# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Persistent multi-credential pool for same-provider failover."""

from __future__ import annotations

from agent.credential_pool_admin import CredentialPoolAdminMixin
from agent.credential_pool_model_cooldowns import CredentialPoolModelCooldownMixin, model_cooldown_until
from agent.credential_pool_errors import _normalize_error_context, redact_error_text
from agent.credential_pool_selection import CredentialPoolSelectionMixin
from agent.credential_pool_timestamps import _parse_absolute_timestamp

import logging
import os
import threading
import time
import uuid
import re
from dataclasses import dataclass, fields, replace
from datetime import datetime, timezone, UTC
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Optional, Set, Tuple

from kestrel_constants import OPENROUTER_BASE_URL
from kestrel_cli.config import load_env
from agent.secret_scope import get_secret as _get_secret, get_secret_str
from kestrel_cli.auth_plugin_providers import plugin_refresh_hook
from agent.credential_pool_plugin import apply_plugin_refresh_result, plugin_row_is_expiring, recover_failed_plugin_refresh
from agent.credential_persistence import (
    fingerprint_secret_value,
    is_borrowed_credential_source,
    sanitize_borrowed_credential_payload,
)
import kestrel_cli.auth as auth_mod
from kestrel_cli.auth_oauth_grants import owned_profile_reads_root_state
from kestrel_cli.auth import (
    CODEX_ACCESS_TOKEN_REFRESH_SKEW_SECONDS,
    PROVIDER_REGISTRY,
    SINGLE_USE_REFRESH_POOL_PROVIDERS,
    _auth_store_lock,
    _codex_access_token_is_expiring,
    _decode_jwt_claims,
    _global_auth_file_path,
    _load_auth_store,
    _load_provider_state,
    _load_provider_state_with_source,
    _resolve_kimi_base_url,
    _resolve_zai_base_url,
    _same_path,
    _save_auth_store,
    _save_provider_state,
    _store_provider_state,
    read_credential_pool,
    write_credential_pool,
)

logger = logging.getLogger(__name__)


def _load_config_safe() -> Optional[dict]:
    """Read-only config (``load_config_readonly`` skips the per-row deepcopy), None on any error.
    Inside ``frozen_runtime_config`` it is the session's frozen config: a key rotated in config.yaml
    must never seed a frozen session's pool."""
    try:
        from kestrel_cli.config import load_config_readonly
        from kestrel_cli.runtime_provider import _FROZEN_RUNTIME_CONFIG
        return _FROZEN_RUNTIME_CONFIG.get() or load_config_readonly()
    except Exception:
        return None


def _is_source_suppressed_fn() -> Callable[[str, str], bool]:
    """``hermes_cli.auth.is_source_suppressed`` (late-bound), or an always-False stub."""
    try:
        from kestrel_cli.auth import is_source_suppressed
        return is_source_suppressed
    except ImportError:
        return lambda _p, _s: False


# --- Status and type constants ---

STATUS_OK = "ok"
# A short per-key 429 window.  Custom endpoint keys are kept out of selection
# for 65 seconds, then deliberately re-tried once.  A second 429 after that
# window means this key's longer quota is depleted and it becomes exhausted.
STATUS_COOLDOWN = "cooldown"
STATUS_EXHAUSTED = "exhausted"
CUSTOM_429_COOLDOWN_SECONDS = 65
# Terminal failure — the credential will never recover on its own.  Used for
# upstream-permanent OAuth states like ``token_invalidated`` / ``token_revoked``
# where retrying after a TTL cooldown is guaranteed to fail.  ``DEAD`` entries
# are excluded from rotation unconditionally and only clear when an explicit
# write-side sync (e.g. ``_save_codex_tokens`` after a fresh device-code
# login) rewrites the tokens.
STATUS_DEAD = "dead"

# OAuth error reasons that mean the credential is permanently invalid
# server-side (OpenAI Codex, Anthropic, xAI, Google OAuth, RFC 6749/6750/7009).
_TERMINAL_AUTH_REASONS = frozenset({
    "token_invalidated",
    "token_revoked",
    "invalid_token",
    "invalid_grant",
    "unauthorized_client",
    "refresh_token_reused",  # single-use refresh token consumed by another process
})

# Locally generated terminal reason (no HTTP status): a refresh POST rotated a
# single-use pair but the replacement never reached its authoritative store, so
# the pre-rotation token still on disk is already spent. Kept out of
# _TERMINAL_AUTH_REASONS (upstream 401 reasons) and handled explicitly.
CREDENTIAL_PERSIST_FAILED_REASON = "credential_persist_failed"

# DEAD ``manual:*`` entries are pruned after this quiet window — they have no
# singleton to re-seed from and the user can re-add via ``hermes auth add``.
# Singleton-seeded entries (device_code, claude_code) are NOT pruned because
# ``_seed_from_singletons`` would re-create them from the same stale tokens.
DEAD_MANUAL_PRUNE_TTL_SECONDS = 24 * 60 * 60

AUTH_TYPE_OAUTH = "oauth"
AUTH_TYPE_API_KEY = "api_key"

SOURCE_MANUAL = "manual"
SOURCE_MANUAL_DEVICE_CODE = f"{SOURCE_MANUAL}:device_code"

STRATEGY_FILL_FIRST = "fill_first"
STRATEGY_ROUND_ROBIN = "round_robin"
STRATEGY_RANDOM = "random"
STRATEGY_LEAST_USED = "least_used"
SUPPORTED_POOL_STRATEGIES = {
    STRATEGY_FILL_FIRST,
    STRATEGY_ROUND_ROBIN,
    STRATEGY_RANDOM,
    STRATEGY_LEAST_USED,
}

# Cooldowns before retrying an exhausted credential. Transient 401s cool down
# briefly so single-key setups recover; 429/402/other take an hour.
# Provider-supplied reset_at timestamps override these defaults.
EXHAUSTED_TTL_401_SECONDS = 5 * 60
EXHAUSTED_TTL_429_SECONDS = 60 * 60
EXHAUSTED_TTL_DEFAULT_SECONDS = 60 * 60
# When the offending key is the sole non-DEAD entry, an hour-long bench means
# an hour of hard failures. Throttles (429/403/5xx) reset in seconds, so a sole
# credential cools down briefly instead.
EXHAUSTED_TTL_SOLE_CREDENTIAL_SECONDS = 60

# ``FailoverReason.billing`` as a bare string: the pool persists classified
# failure semantics to JSON and must not import the classifier.
FAILURE_REASON_BILLING = "billing"

# Billing verdict resting on an ambiguous body (#82154): Anthropic's "out of
# extra usage" 400 is returned both for genuine overage and for a server-side
# content-filter rejection, which leaves the credential healthy. Unverified
# billing gets the short transient cooldown; genuine depletion re-latches.
FAILURE_REASON_BILLING_UNVERIFIED = "billing_unverified"

# Throttle window for the "no available entries" INFO line. Selection runs on
# every model call; on Windows several processes share one rotating log behind
# a cross-process lock, and per-selection logging stormed that lock, pegged a
# core, and stalled the event loop (Desktop backend readiness timeouts).
# Credential selection runs on a hot path (every model call, plus auxiliary tasks like
# compression/moa/titles), so when a pool is empty or fully exhausted the un-throttled log fires on *every*
# selection. On Windows several Hermes processes share one rotating log guarded by concurrent-log-handler's
# cross-process lock; that per-selection volume storms the lock (``RuntimeError: Cannot acquire lock after
# 20 attempts``), pegs a core, and stalls the asyncio event loop long enough to fail the Desktop backend
# readiness handshake ("Timed out connecting to Hermes backend after 15000ms"). Logging the condition at
# most once per window preserves the signal while removing the storm — same class of fix as the warn-once
# dedup in #58265.
NO_AVAILABLE_ENTRIES_LOG_THROTTLE_SECONDS = 60.0

# Pool key prefix for custom OpenAI-compatible endpoints: all share
# provider='custom' but are keyed 'custom:<normalized_name>'.
CUSTOM_POOL_PREFIX = "custom:"

# Fields only round-tripped through JSON — never used for logic as attributes.
_EXTRA_KEYS = frozenset({
    "token_type", "scope", "client_id", "portal_base_url", "obtained_at",
    "expires_in", "agent_key_id", "agent_key_expires_in", "agent_key_reused",
    "agent_key_obtained_at", "tls", "secret_source", "secret_fingerprint",
    # Nous guest identity (``auth_method: anonymous``): the anon_ credential is the refresh material.
    "auth_method", "account_tier", "anon_token", "user_id", "org_id",
    # Classified failure semantics for the last exhaustion (agent/error_classifier.py).
    # Providers return 403 for both an edge throttle and a spending limit, so the
    # raw status cannot size a cooldown; persisted so a restart doesn't downgrade
    # a billing bench to a 60s transient cooldown.
    "failure_reason",
})

# Nous singleton metadata mirrored between auth.json state and ``entry.extra``.
_NOUS_EXTRA_STATE_KEYS = (
    "obtained_at", "expires_in", "agent_key_id",
    "agent_key_expires_in", "agent_key_reused", "agent_key_obtained_at",
    "auth_method", "account_tier", "anon_token", "user_id", "org_id",
)

# ``replace(entry, **_CLEAR_STATUS)`` returns an entry with no error state.
_CLEAR_STATUS: dict[str, Any] = {
    "last_status": None,
    "last_status_at": None,
    "last_error_code": None,
    "last_error_reason": None,
    "last_error_message": None,
    "last_error_reset_at": None,
}
_MARK_OK: dict[str, Any] = {**_CLEAR_STATUS, "last_status": STATUS_OK}


def _normalize_pool_auth_type(provider: str, token: Any, auth_type: Any) -> str:
    """Infer pool auth metadata for token formats with one unambiguous meaning."""
    if provider == "anthropic" and isinstance(token, str) and token.startswith("sk-ant-oat"):
        return AUTH_TYPE_OAUTH
    return str(auth_type or AUTH_TYPE_API_KEY)


@dataclass
class PooledCredential:
    provider: str
    id: str
    label: str
    auth_type: str
    priority: int
    source: str
    access_token: str
    refresh_token: Optional[str] = None
    last_status: Optional[str] = None
    last_status_at: Optional[float] = None
    last_error_code: Optional[int] = None
    last_error_reason: Optional[str] = None
    last_error_message: Optional[str] = None
    last_error_reset_at: Optional[float] = None
    # Epoch of the last deliberate ``hermes auth reset`` of this entry. Sticky: a later exhaustion
    # stamps a newer ``last_status_at``, so "reset postdates status" stays decidable across processes.
    status_cleared_at: Optional[float] = None
    base_url: Optional[str] = None
    expires_at: Optional[str] = None
    expires_at_ms: Optional[int] = None
    last_refresh: Optional[str] = None
    inference_base_url: Optional[str] = None
    agent_key: Optional[str] = None
    agent_key_expires_at: Optional[str] = None
    request_count: int = 0
    # A provider may rate-limit one model while the same credential remains
    # usable for its sibling models.  Keep that observation separate from the
    # credential-wide status used for auth and billing failures.
    model_cooldowns: Optional[dict[str, float]] = None
    extra: dict[str, Any] = None  # type: ignore[assignment]

    def __post_init__(self):
        if self.extra is None:
            self.extra = {}
        self.auth_type = _normalize_pool_auth_type(self.provider, self.access_token, self.auth_type)

    def __getattr__(self, name: str):
        if name in _EXTRA_KEYS:
            return self.extra.get(name)
        raise AttributeError(f"'{type(self).__name__}' object has no attribute {name!r}")

    @classmethod
    def from_dict(cls, provider: str, payload: dict[str, Any]) -> PooledCredential:
        field_names = {f.name for f in fields(cls) if f.name != "provider"}
        data = {k: payload.get(k) for k in field_names if k in payload}
        # Rehydrated last_status_at may be an ISO string from to_dict() — normalize to float epoch
        if isinstance(data.get("last_status_at"), str):
            data["last_status_at"] = _parse_absolute_timestamp(data["last_status_at"])
        # Every non-field key rides in ``extra`` (to_dict writes them all back), so metadata a plugin
        # stores on its own rows survives load -> save -> load. ``_EXTRA_KEYS`` stays the attribute
        # surface for core logic; unknown keys are opaque payload. ``provider`` is the row's owner
        # (excluded from ``field_names`` above), never metadata — sweeping it in would write a
        # stray provider name back over the row on to_dict().
        data["extra"] = {
            k: v for k, v in payload.items() if k not in field_names and k != "provider" and v is not None
        }
        data.setdefault("id", uuid.uuid4().hex[:6])
        data.setdefault("label", payload.get("source", provider))
        data.setdefault("auth_type", AUTH_TYPE_API_KEY)
        data.setdefault("priority", 0)
        data.setdefault("source", SOURCE_MANUAL)
        data.setdefault("access_token", "")
        return cls(provider=provider, **data)

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {}
        for field_def in fields(self):
            if field_def.name in {"provider", "extra"}:
                continue
            value = getattr(self, field_def.name)
            if value is not None or field_def.name in _CLEAR_STATUS:
                result[field_def.name] = value
        for k, v in self.extra.items():
            if v is not None:
                result[k] = v
        return sanitize_borrowed_credential_payload(result, self.provider)

    @property
    def runtime_api_key(self) -> str:
        if self.provider == "nous":
            # Nous stores the runtime inference credential in agent_key for
            # compatibility. It must be a NAS invoke JWT.
            for token, expires_at in (
                (self.agent_key, self.agent_key_expires_at),
                (self.access_token, self.expires_at),
            ):
                if (
                    isinstance(token, str)
                    and token.strip()
                    and auth_mod._nous_invoke_jwt_is_usable(
                        token, scope=getattr(self, "scope", None), expires_at=expires_at,
                    )
                ):
                    return token.strip()
            return ""
        return str(self.access_token or "")

    @property
    def runtime_base_url(self) -> Optional[str]:
        if self.provider == "nous":
            return self.inference_base_url or self.base_url
        if self.provider == "openai-codex":
            # Pool rows keep the canonical ChatGPT URL; the profile-scoped proxy override must win
            # for every reader of the row — initial resolution AND a 401/429 rotation
            # (client_lifecycle._swap_credential), or a rotation silently leaves the proxy.
            return get_secret_str("HERMES_CODEX_BASE_URL", "").strip().rstrip("/") or self.base_url
        return self.base_url


def label_from_token(token: str, fallback: str) -> str:
    claims = _decode_jwt_claims(token)
    for key in ("email", "preferred_username", "upn"):
        value = claims.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return fallback


def _codex_principal_identity(access_token: Any) -> Optional[tuple[str, str]]:
    """``(chatgpt_account_id, sub)`` of a Codex access token, or None when either claim is missing.

    Decoded without signature verification: this only decides whether two credentials Hermes
    already holds belong to the same principal, never whether a token is valid. Both claims are
    required because members of one ChatGPT workspace share ``chatgpt_account_id`` yet have their
    own subjects and quotas.
    """
    claims = _decode_jwt_claims(access_token)
    auth_claims = claims.get("https://api.openai.com/auth") if isinstance(claims, dict) else None
    account_id = auth_claims.get("chatgpt_account_id") if isinstance(auth_claims, dict) else None
    subject = claims.get("sub") if isinstance(claims, dict) else None
    if not (isinstance(account_id, str) and account_id.strip() and isinstance(subject, str) and subject.strip()):
        return None
    return account_id.strip(), subject.strip()


def _codex_entry_tracks_singleton(entry: PooledCredential, singleton_tokens: dict[str, Any]) -> bool:
    """Whether a Codex pool entry may adopt the auth.json singleton's token pair.

    ``device_code`` IS the singleton. ``manual:device_code`` is ambiguous: a legacy alias of the
    singleton (same account, must follow its rotations) or an independent account added with
    ``hermes auth add openai-codex`` (must never be overwritten — adopting turned two logins into
    one account, both hitting the same usage limit). Same principal proves the alias; unknown
    identity fails closed.
    """
    if entry.source == "device_code":
        return True
    if entry.source != SOURCE_MANUAL_DEVICE_CODE:
        return False
    entry_identity = _codex_principal_identity(entry.access_token)
    return entry_identity is not None and entry_identity == _codex_principal_identity(singleton_tokens.get("access_token"))


def _next_priority(entries: list[PooledCredential]) -> int:
    return max((entry.priority for entry in entries), default=-1) + 1


def _is_manual_source(source: str) -> bool:
    normalized = (source or "").strip().lower()
    return normalized == SOURCE_MANUAL or normalized.startswith(f"{SOURCE_MANUAL}:")


def _exhausted_ttl(
    error_code: Optional[int],
    *,
    sole_credential: bool = False,
    failure_reason: Optional[str] = None,
) -> int:
    """Return cooldown seconds based on the HTTP status that caused exhaustion.

    *sole_credential*: the pool has nothing to rotate to, so transient
    throttles (429 and the catch-all default covering 403/5xx/unknown) are
    capped to a brief cooldown; 401 keeps its own already-short TTL.

    *failure_reason* is the classifier verdict: an OpenRouter ``key limit
    exceeded`` and an xAI spending block both arrive as 403 but are billing,
    and a 60s retry on a spent account just re-fails. Billing keeps the full
    bench regardless of status; 402 is billing by definition.
    Unverified billing (#82154) gets the short cooldown regardless of pool
    size (the credential may be healthy), unless the status is a true 402.
    """
    if error_code == 401:
        return EXHAUSTED_TTL_401_SECONDS
    base = EXHAUSTED_TTL_429_SECONDS if error_code == 429 else EXHAUSTED_TTL_DEFAULT_SECONDS
    if failure_reason == FAILURE_REASON_BILLING_UNVERIFIED and error_code != 402:
        return min(base, EXHAUSTED_TTL_SOLE_CREDENTIAL_SECONDS)
    is_billing = error_code == 402 or failure_reason == FAILURE_REASON_BILLING
    if sole_credential and not is_billing:
        return min(base, EXHAUSTED_TTL_SOLE_CREDENTIAL_SECONDS)
    return base


def _custom_pool(provider: str) -> bool:
    return str(provider or "").strip().lower().startswith(CUSTOM_POOL_PREFIX)


def _custom_key_is_second_429(entry: PooledCredential) -> bool:
    """True when a custom key was already released from its 65s 429 cooldown."""
    return (
        _custom_pool(entry.provider)
        and entry.last_status == STATUS_COOLDOWN
        and entry.last_error_code == 429
        and bool(entry.last_status_at)
        and time.time() >= entry.last_status_at + CUSTOM_429_COOLDOWN_SECONDS
    )


def _parse_absolute_timestamp(value: Any) -> Optional[float]:
    """Best-effort parse for provider reset timestamps.

    Both sides stamp ``last_refresh`` on every successful rotation. When
    either side lacks a parseable stamp this returns False (cannot prove),
    which keeps the historical adopt-on-difference behavior (#70111) intact
    for legacy writers.
    """
    entry_ts = _parse_absolute_timestamp(entry.last_refresh)
    if entry_ts is None:
        return False
    state_ts = _parse_absolute_timestamp(state.get("last_refresh") if isinstance(state, dict) else None)
    if state_ts is None:
        return False
    return state_ts < entry_ts


def _exhausted_until(entry: PooledCredential, *, sole_credential: bool = False) -> Optional[float]:
    if entry.last_status != STATUS_EXHAUSTED:
        return None
    reset_at = _parse_absolute_timestamp(entry.last_error_reset_at)
    if reset_at is not None:
        return reset_at
    if entry.last_status_at:
        return entry.last_status_at + _exhausted_ttl(
            entry.last_error_code,
            sole_credential=sole_credential,
            failure_reason=entry.failure_reason,
        )
    return None


# --- Custom (OpenAI-compatible) endpoint pool keys ---


def _normalize_custom_pool_name(name: str) -> str:
    """Normalize a custom provider name for use as a pool key suffix."""
    return name.strip().lower().replace(" ", "-")


def _norm_url(url: Any) -> str:
    return str(url or "").strip().rstrip("/")


def _iter_custom_providers(config: Optional[dict] = None):
    """Yield ``(normalized_name, entry)`` from the merged custom-provider config view."""
    if config is None:
        config = _load_config_safe()
    if config is None:
        return
    try:
        from kestrel_cli.config import get_compatible_custom_providers

        custom_providers = get_compatible_custom_providers(config)
    except Exception:
        return
    for entry in custom_providers or ():
        if isinstance(entry, dict) and isinstance(entry.get("name"), str):
            yield _normalize_custom_pool_name(entry["name"]), entry


def _custom_entry_name_aliases(norm_name: str, entry: dict[str, Any]) -> set:
    aliases = {norm_name}
    provider_key = _normalize_custom_pool_name(str(entry.get("provider_key") or ""))
    if provider_key:
        aliases.add(provider_key)
    return aliases


def _requested_custom_name_aliases(provider_name: str) -> set:
    normalized = _normalize_custom_pool_name(provider_name)
    aliases = {normalized} if normalized else set()
    if normalized.startswith(CUSTOM_POOL_PREFIX):
        suffix = _normalize_custom_pool_name(normalized[len(CUSTOM_POOL_PREFIX):])
        if suffix:
            aliases.add(suffix)
    return aliases


def _pool_keys_for_custom_entry(norm_name: str, entry: dict[str, Any]) -> list[str]:
    """Durable ``providers.<key>`` slug first, then legacy ``custom:<name>``."""
    keys: list[str] = []
    provider_key = _normalize_custom_pool_name(str(entry.get("provider_key") or ""))
    for key in (provider_key, f"{CUSTOM_POOL_PREFIX}{norm_name}" if norm_name else ""):
        normalized = key.strip().lower()
        if normalized and normalized not in keys:
            keys.append(normalized)
    return keys


def custom_provider_pool_key_candidates(
    base_url: Optional[str], provider_name: Optional[str] = None, config: Optional[dict] = None,
) -> list[str]:
    """Return pool keys to try for a custom endpoint: the durable ``providers.<key>`` slug
    (``hermes auth add <key>``), then legacy ``custom:<display-name>``, so a populated pool is not
    skipped for the ``no-key-required`` placeholder. ``config`` is a frozen route's config: ITS
    entry owns the endpoint, so a live edit of that entry's URL neither drops nor redirects the pool.
    """
    # A named pool holds credentials for its configured endpoint only: a launch-overridden base_url
    # must not inherit them (R2-M1), nor borrow a sibling's by URL.
    from agent.custom_entry_pool import custom_entry_for_endpoint
    match = custom_entry_for_endpoint(base_url, provider_name, config)
    return _pool_keys_for_custom_entry(*match) if match else []


def get_custom_provider_pool_key(base_url: Optional[str], provider_name: Optional[str] = None) -> Optional[str]:
    """Preferred pool key for a custom provider: durable slug, else ``custom:<name>``.

    When provider_name is given, match by name first so two custom providers
    sharing a base_url keep separate keys.
    """
    candidates = custom_provider_pool_key_candidates(base_url, provider_name)
    return candidates[0] if candidates else None


def list_custom_pool_providers() -> list[str]:
    """Return all 'custom:*' pool keys that have entries in auth.json."""
    pool_data = read_credential_pool(None)
    return sorted(
        key for key in pool_data
        if key.startswith(CUSTOM_POOL_PREFIX)
        and isinstance(pool_data.get(key), list)
        and pool_data[key]
    )


def _get_custom_provider_config(pool_key: str) -> Optional[dict[str, Any]]:
    """Return the custom_providers config entry matching a pool key like 'custom:together.ai'."""
    if not pool_key.startswith(CUSTOM_POOL_PREFIX):
        return None
    suffix = pool_key[len(CUSTOM_POOL_PREFIX):]
    return next((entry for norm_name, entry in _iter_custom_providers() if norm_name == suffix), None)


def get_pool_strategy(provider: str) -> str:
    """Return the configured selection strategy for a provider."""
    config = _load_config_safe()
    strategies = config.get("credential_pool_strategies") if config else None
    if not isinstance(strategies, dict):
        return STRATEGY_FILL_FIRST
    strategy = str(strategies.get(provider, "") or "").strip().lower()
    return strategy if strategy in SUPPORTED_POOL_STRATEGIES else STRATEGY_FILL_FIRST


def _keyed_custom_pool_matches(
    pool_provider: str,
    provider_norm: str,
    base_url: Optional[str],
) -> bool:
    """Match a durable ``providers.<key>`` pool against runtime identities."""
    runtime_url = _norm_url(base_url)
    if not runtime_url:
        return False
    try:
        for normalized_name, entry in _iter_custom_providers():
            provider_key = _normalize_custom_pool_name(str(entry.get("provider_key") or ""))
            if provider_key != pool_provider:
                continue
            aliases = _custom_entry_name_aliases(normalized_name, entry)
            aliases.add(f"{CUSTOM_POOL_PREFIX}{normalized_name}")
            if provider_key:
                aliases.add(f"{CUSTOM_POOL_PREFIX}{provider_key}")
            configured_url = _norm_url(entry.get("base_url"))
            if provider_norm == "custom":
                return runtime_url == configured_url
            runtime_aliases = _requested_custom_name_aliases(provider_norm)
            return bool(runtime_aliases & aliases) and runtime_url == configured_url
    except Exception:
        return False
    return False


def _legacy_custom_pool_matches(
    pool_provider: str,
    provider_norm: str,
    runtime_url: str,
) -> bool:
    """Match a legacy ``custom:<name>`` pool against a named runtime identity."""
    try:
        for normalized_name, entry in _iter_custom_providers():
            if f"{CUSTOM_POOL_PREFIX}{normalized_name}" != pool_provider:
                continue
            aliases = {normalized_name}
            for value in (entry.get("name"), entry.get("provider_key")):
                alias = _normalize_custom_pool_name(str(value or ""))
                if alias:
                    aliases.add(alias)
                    if alias.startswith(CUSTOM_POOL_PREFIX):
                        aliases.add(alias[len(CUSTOM_POOL_PREFIX):])
            configured_url = _norm_url(entry.get("base_url"))
            runtime_aliases = {_normalize_custom_pool_name(provider_norm)}
            if provider_norm.startswith(CUSTOM_POOL_PREFIX):
                runtime_aliases.add(_normalize_custom_pool_name(provider_norm[len(CUSTOM_POOL_PREFIX):]))
            return bool(runtime_aliases & aliases) and runtime_url == configured_url
    except Exception:
        return False
    return False


def credential_pool_entry_serves_endpoint(entry: Any, base_url: Any) -> bool:
    """Whether a pooled credential may be bound to a session running at ``base_url``. ``_swap_credential``
    adopts the entry's base_url too, so a same-provider entry for another endpoint (public OpenAI vs. an
    Azure resource) would send the session's requests — and the entry's key — to the wrong host (#68237).
    Entries or sessions without endpoint metadata (legacy adapters, test doubles) cannot rebind and are accepted."""
    if not isinstance(base_url, str) or not base_url:
        return True
    entry_url = getattr(entry, "runtime_base_url", None) or getattr(entry, "base_url", None)
    if not isinstance(entry_url, str) or not entry_url:
        return True
    from kestrel_cli.route_identity import normalize_route_base_url
    return normalize_route_base_url(entry_url) == normalize_route_base_url(base_url)


def credential_pool_matches_provider(
    pool_or_provider: Any,
    provider: Optional[str],
    *,
    base_url: Optional[str] = None,
) -> bool:
    """Return whether a pool belongs to the requested runtime provider.

    Named custom endpoints may use three identities: the live agent can retain
    the configured name/provider key, newer runtime paths normalize it to
    ``custom``, and the pool may be keyed as the durable ``providers.<key>``
    slug or as legacy ``custom:<name>``. Accept those aliases only when the
    runtime endpoint belongs to the same configured custom provider. Empty
    identities fail closed. Legacy pool adapters without a ``provider``
    attribute remain compatible; production pools are scoped.
    """
    raw_pool_provider = getattr(pool_or_provider, "provider", None)
    if raw_pool_provider is None:
        if not isinstance(pool_or_provider, str):
            # Lightweight/unscoped pool adapters (old plugins, tests) may
            # expose only select()/has_credentials().
            return True
        raw_pool_provider = pool_or_provider
    pool_provider = str(raw_pool_provider or "").strip().lower()
    provider_norm = str(provider or "").strip().lower()
    if not pool_provider or not provider_norm:
        return False
    if not pool_provider.startswith(CUSTOM_POOL_PREFIX):
        if pool_provider == provider_norm:
            return True
        return _keyed_custom_pool_matches(pool_provider, provider_norm, base_url)
    if provider_norm == "custom":
        try:
            matched_pool = get_custom_provider_pool_key(base_url or "")
            if str(matched_pool or "").strip().lower() == pool_provider:
                return True
            candidates = custom_provider_pool_key_candidates(base_url or "")
        except Exception:
            return False
        return pool_provider in {str(key).strip().lower() for key in candidates}

    runtime_url = _norm_url(base_url)
    if not runtime_url:
        return False
    return _legacy_custom_pool_matches(pool_provider, provider_norm, runtime_url)


def resolve_runtime_pool_key(provider: Optional[str], base_url: Optional[str]) -> str:
    """Resolve the credential-pool key for a runtime provider identity.

    Named custom runtimes retain their configured alias while their pool may
    be stored under the durable ``providers.<key>`` slug or legacy
    ``custom:<name>``. Return that scoped key only when the canonical
    provider/endpoint boundary accepts it; otherwise preserve the normalized
    runtime identity so callers fail closed.
    """
    provider_norm = str(provider or "").strip().lower()
    if not provider_norm:
        return ""

    def _accepts(candidate: str) -> bool:
        return credential_pool_matches_provider(candidate, provider_norm, base_url=base_url)

    try:
        if provider_norm == "custom":
            candidate = get_custom_provider_pool_key(base_url)
            if candidate and _accepts(candidate):
                return str(candidate).strip().lower()
        else:
            # Named/exact custom runtimes are keyed by identity: search the
            # configured candidates by identity before endpoint so a sibling
            # sharing the URL cannot lend its pool.
            for normalized_name, entry in _iter_custom_providers():
                for candidate in _pool_keys_for_custom_entry(normalized_name, entry):
                    if _accepts(candidate):
                        return candidate
    except Exception:
        pass
    return provider_norm


DEFAULT_MAX_CONCURRENT_PER_CREDENTIAL = 1


# --- Multi-profile root write-through ---


def _guarded_global_root(global_path: Optional[Path]) -> Optional[Path]:
    """Apply the pytest seat belt to a resolved global-root auth.json path.

    ``None`` means classic mode (profile == root) or "refuse": under pytest,
    never write the real user's ``~/.hermes/auth.json`` even when HERMES_HOME
    points at a profile path (mirrors the read-side guard in
    ``_load_global_auth_store``). Uses the unmodified HOME env, not
    ``Path.home()`` which fixtures may monkeypatch.
    """
    if global_path is None:
        return None
    if os.environ.get("PYTEST_CURRENT_TEST"):
        real_home_env = os.environ.get("HOME", "")
        if real_home_env:
            real_root = Path(real_home_env) / ".hermes" / "auth.json"
            try:
                # Comparing the guard path must not probe the real auth store.
                if os.path.normcase(os.path.abspath(global_path)) == os.path.normcase(os.path.abspath(real_root)):
                    return None
            except Exception:
                return None
    return global_path


def _write_through_provider_state_to_global_root(
    provider_id: str, state: dict[str, Any]
) -> None:
    """Persist a rotated OAuth ``state`` into the global-root auth.json.

    Best-effort write-through for the multi-profile rotation hazard: nous,
    openai-codex, and xai-oauth rotate the refresh_token on refresh, so when
    a profile pool refresh rotates a grant it resolved from the root fallback,
    the rotated chain must land back in root. Otherwise root keeps a revoked
    refresh token and every other profile dies with ``refresh_token_reused``
    / ``invalid_grant`` once its access token expires.

    Only updates ``providers.<provider_id>`` in the root store; never touches
    the profile store (the caller already saved that). Swallows all errors —
    a failed write-through degrades to root-stale and must never break the
    profile's own successful save. Mirrors
    ``hermes_cli.auth._write_through_xai_oauth_to_global_root``.

    See #48415.
    """
    try:
        global_path = _guarded_global_root(auth_mod._global_auth_file_path())
    except Exception:
        return
    if global_path is None:
        return
    try:
        auth_mod._persist_provider_state_to_store(provider_id, state, global_path, set_active=False)
    except Exception as exc:  # pragma: no cover - best effort
        logger.debug("%s pool refresh: write-through to global root failed: %s", provider_id, exc)


def _probe_custom_api_key(entry: PooledCredential, model: str) -> bool:
    """Return whether a custom API key accepts a minimal completion request."""
    try:
        from openai import OpenAI

        client = OpenAI(
            api_key=entry.runtime_api_key,
            base_url=(entry.runtime_base_url or entry.base_url or "").rstrip("/"),
            max_retries=0,
            timeout=15,
        )
        try:
            client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": "hi"}],
                max_tokens=1,
            )
        finally:
            client.close()
        return True
    except Exception as exc:
        status = getattr(exc, "status_code", None)
        response = getattr(exc, "response", None)
        if status is None:
            status = getattr(response, "status_code", None)
        return status != 429


class CredentialPool:
    def __init__(self, provider: str, entries: List[PooledCredential]):
        self.provider = provider
        self._entries = sorted(entries, key=lambda entry: entry.priority)
        self._current_id: Optional[str] = None
        # Ids of rows read via the global-root fallback (single-use OAuth
        # providers only); set by load_pool(), consumed by add_entry().
        self._borrowed_root_ids: set[str] = set()
        self._persisted_token_pairs: dict[str, tuple[Any, Any]] = {}
        self._strategy = get_pool_strategy(provider)
        # RLock: _replace_entry/_persist self-acquire it so the DEFERRED
        # single-use-token refresh path (network I/O outside the lock by
        # design) still serializes its pool mutations; in-lock callers
        # re-acquire reentrantly.
        self._lock = threading.RLock()
        self._active_leases: dict[str, int] = {}
        self._max_concurrent = DEFAULT_MAX_CONCURRENT_PER_CREDENTIAL
        # Monotonic timestamp of the last "no available entries" log (see
        # NO_AVAILABLE_ENTRIES_LOG_THROTTLE_SECONDS). Re-armed to None on every
        # successful selection so a recover->re-exhaust transition logs promptly.
        self._last_no_entries_log_at: Optional[float] = None

    # ---- read accessors ---------------------------------------------------

    def has_credentials(self) -> bool:
        return bool(self._entries)

    def has_available(self) -> bool:
        """True if at least one entry is not currently in exhaustion cooldown."""
        return bool(self._available_entries())

    def entries(self) -> List[PooledCredential]:
        return list(self._entries)

    def current(self) -> Optional[PooledCredential]:
        if not self._current_id:
            return None
        return self._find(lambda e: e.id == self._current_id)

    def entry_id_for_api_key(self, api_key_hint: Any = None) -> Optional[str]:
        """Return the stable id for the credential currently in use."""
        current = self.current()
        if current is not None and (
            api_key_hint is None or current.runtime_api_key == api_key_hint
        ):
            return current.id
        if api_key_hint is None:
            return None
        matches = [
            entry for entry in self._entries
            if entry.runtime_api_key == api_key_hint
        ]
        return matches[0].id if len(matches) == 1 else None

    # ---- mutation primitives (self-locking) --------------------------------

    def _replace_entry(self, old: PooledCredential, new: PooledCredential) -> None:
        """Swap an entry in-place by id, preserving sort order.

        Self-locking (RLock) so the deferred refresh path — which runs outside
        the pool lock — cannot tear ``self._entries`` against a concurrent
        select()/rotation.
        """
        with self._lock:
            for idx, entry in enumerate(self._entries):
                if entry.id == old.id:
                    self._entries[idx] = new
                    return

    def _persist(
        self,
        *,
        removed_ids: Optional[list[str]] = None,
        status_cleared_ids: Optional[list[str]] = None,
    ) -> None:
        # Self-locking: snapshotting self._entries must not race a rotation.
        with self._lock:
            payloads = [entry.to_dict() for entry in self._entries]
            written = persist_pool_entries(
                self.provider, payloads,
                removed_ids=removed_ids,
                status_cleared_ids=status_cleared_ids,
                token_bases=self._persisted_token_pairs,
            )
            if written is None:
                return
            rows = auth_mod._entry_ids(written)
            self._persisted_token_pairs = auth_mod._token_pairs_by_id(written)
            for entry in self._entries:
                row = rows.get(entry.id)
                pair = self._persisted_token_pairs.get(entry.id, (None, None))
                # Reference-only rows are intentionally secret-free on disk; never dehydrate
                # their live in-memory credential while adopting a concurrent generation.
                if row is None or not any(pair):
                    continue
                # Adopt only rows the store overrode with a peer's newer pair; re-hydrating an
                # unchanged row would replace the live object (and pull peer cooldown state
                # merged into the written row) on every ordinary flush.
                if pair != (entry.access_token, entry.refresh_token):
                    self._replace_entry(entry, PooledCredential.from_dict(self.provider, row))

    def _adopt(self, entry: PooledCredential, *, persist: bool = True, **updates: Any) -> PooledCredential:
        """``replace(entry, **updates)``, swap it into the pool, optionally persist."""
        updated = replace(entry, **updates)
        self._replace_entry(entry, updated)
        if persist:
            self._persist()
            # _persist may have swapped in a peer's newer token generation; hand callers
            # the live entry so they don't rebind the client to the stale pair.
            return self._find(lambda e: e.id == updated.id) or updated
        return updated

    def _quarantine_sources(self, entry: PooledCredential, sources: set[str]) -> None:
        """Drop every entry seeded from *sources* and persist the removal.

        Atomic read-modify-write of ``self._entries``: this runs on the
        DEFERRED refresh path (outside the pool lock), so take the RLock here;
        still-locked callers re-enter safely.
        """
        with self._lock:
            removed_ids = [item.id for item in self._entries if item.source in sources]
            self._entries = [item for item in self._entries if item.source not in sources]
            if self._current_id == entry.id:
                self._current_id = None
            self._persist(removed_ids=removed_ids)

    # ---- exhaustion --------------------------------------------------------

    def _is_terminal_auth_failure(
        self,
        status_code: Optional[int],
        normalized_error: dict[str, Any],
    ) -> bool:
        """Detect upstream-permanent OAuth failures that won't recover on TTL.

        Only 401s whose reason is a known terminal OAuth state count;
        token_expired (refreshable) and reason-less 401s (possible glitch)
        stay transient, as do 429/402. The one status-independent case is
        ``CREDENTIAL_PERSIST_FAILED_REASON``: no upstream response is involved,
        the rotated pair never became durable and only a re-auth recovers it.
        """
        raw_reason = normalized_error.get("reason")
        reason = raw_reason.strip().lower() if isinstance(raw_reason, str) else ""
        if reason == CREDENTIAL_PERSIST_FAILED_REASON:
            return True
        return status_code == 401 and reason in _TERMINAL_AUTH_REASONS

    def _mark_exhausted(
        self,
        entry: PooledCredential,
        status_code: Optional[int],
        error_context: Optional[Dict[str, Any]] = None,
    ) -> PooledCredential:
        normalized_error = _normalize_error_context(error_context)
        # Permanent OAuth failures (token_invalidated, token_revoked, etc.)
        # transition to STATUS_DEAD instead of STATUS_EXHAUSTED.  Without this,
        # a revoked credential gets a 1-hour TTL cooldown and then re-enters
        # rotation, failing immediately every hour until the user manually
        # removes it (issue #32849).  DEAD entries are excluded from rotation
        # unconditionally and only clear via an explicit re-auth write-side
        # sync (``_save_codex_tokens`` after a fresh device-code login).
        if (
            _custom_pool(self.provider)
            and status_code == 429
            and entry.last_status == STATUS_COOLDOWN
            and entry.last_error_code == 429
            and entry.last_status_at
            and time.time() >= entry.last_status_at + CUSTOM_429_COOLDOWN_SECONDS
        ):
            # The key was released after its minute-level cooldown and was
            # rate-limited again: treat this as a quota wall for this pool run.
            terminal_status = STATUS_EXHAUSTED
        elif _custom_pool(self.provider) and status_code == 429:
            terminal_status = STATUS_COOLDOWN
        elif self._is_terminal_auth_failure(status_code, normalized_error):
            terminal_status = STATUS_DEAD
        else:
            updated_extra.pop("failure_reason", None)
        return self._adopt(
            entry,
            persist=persist,
            last_status=STATUS_DEAD if terminal else STATUS_EXHAUSTED,
            last_status_at=time.time(),
            last_error_code=status_code,
            last_error_reason=normalized_error.get("reason"),
            last_error_message=normalized_error.get("message"),
            last_error_reset_at=normalized_error.get("reset_at"),
            extra=updated_extra,
        )
        self._replace_entry(entry, updated)
        self._persist()
        return updated

    def _sync_anthropic_entry_from_credentials_file(self, entry: PooledCredential) -> PooledCredential:
        """Sync a claude_code entry from ~/.claude/.credentials.json if tokens differ."""
        if self.provider != "anthropic" or entry.source != "claude_code":
            return entry
        try:
            from agent.anthropic_credentials import read_claude_code_credentials
            creds = read_claude_code_credentials()
            if not creds:
                return entry
            file_refresh = creds.get("refreshToken", "")
            file_access = creds.get("accessToken", "")
            # Access tokens can be re-issued without a new refresh token, so
            # checking only refresh_token leaves a stale access_token in the
            # pool -> 401 on every request until the exhausted TTL expires.
            if (file_access or file_refresh) and (
                (file_access and file_access != (entry.access_token or ""))
                or (file_refresh and file_refresh != (entry.refresh_token or ""))
            ):
                logger.debug("Pool entry %s: syncing tokens from credentials file (tokens changed)", entry.id)
                return self._adopt(
                    entry,
                    access_token=file_access or entry.access_token,
                    refresh_token=file_refresh or entry.refresh_token,
                    expires_at_ms=creds.get("expiresAt", 0) or entry.expires_at_ms,
                    **_CLEAR_STATUS,
                )
        except Exception as exc:
            logger.debug("Failed to sync from credentials file: %s", exc)
        return entry

    def _sync_entry_from_pool_store(self, entry: PooledCredential) -> PooledCredential:
        """Adopt a token pair rotated by another pool instance (anthropic, xai-oauth).

        Re-reads the exact persisted row from the credential-pool store while
        the shared cross-process auth-store lock is held. Direct integrations
        load a fresh ``CredentialPool`` per request, so in-memory locks cannot
        protect a single-use refresh token across requests or processes.

        Anthropic borrowed sources (``claude_code``) are excluded: they are
        reference-only rows whose secrets are stripped before reaching
        auth.json, so re-reading yields empty tokens that would be adopted as
        a "rotation" — blanking a usable credential. The singleton file, not
        the pool store, is token authority for those sources; a row with no
        token material at all is refused for the same reason.
        """
        if self.provider not in ("anthropic", "xai-oauth") and plugin_refresh_hook(self.provider) is None:
            return entry
        is_anthropic = self.provider == "anthropic"
        is_xai = self.provider == "xai-oauth"
        display = {"anthropic": "Anthropic", "xai-oauth": "xAI"}.get(self.provider, self.provider)
        if is_anthropic and is_borrowed_credential_source(entry.source, self.provider):
            return entry
        try:
            persisted = next(
                (p for p in read_credential_pool(self.provider) if isinstance(p, dict) and p.get("id") == entry.id),
                None,
            )
            if not isinstance(persisted, dict):
                return entry
            # Same base policy as _persist/load_pool: a token-less disk row is a known
            # (blank) generation, recorded before the no-token-material bail-out below.
            self._persisted_token_pairs[entry.id] = auth_mod._credential_token_pair(persisted)
            stored = PooledCredential.from_dict(self.provider, persisted)
            # No token material at all is never a "rotation" (anthropic borrowed rows, a plugin row a
            # peer blanked mid-write): adopting it would replace a usable credential with nothing.
            if not is_xai and not (stored.access_token or "").strip() and not (stored.refresh_token or "").strip():
                return entry
            if stored.access_token != entry.access_token or stored.refresh_token != entry.refresh_token:
                logger.debug(
                    "Pool entry %s: adopting %s OAuth tokens rotated by another pool instance",
                    entry.id, display,
                )
                self._replace_entry(entry, stored)
                return stored
        except Exception as exc:
            logger.debug("Failed to sync %s OAuth entry from credential pool: %s", display, exc)
        return entry

    _sync_anthropic_entry_from_pool_store = _sync_entry_from_pool_store

    def _sync_entry_from_auth_store(self, entry: PooledCredential) -> PooledCredential:
        """Sync a Codex / xAI device_code entry from auth.json ``providers.<id>.tokens``.

        A fresh ``hermes model`` / ``hermes auth`` login writes new tokens
        under ``_auth_store_lock`` while the pool entry may sit frozen behind
        a ``last_error_reset_at`` hours in the future; without this sync every
        request fails with "no available entries" despite fresh credentials on
        disk. Only singleton-seeded entries apply — env/API-key rows have no
        auth.json shadow.
        """
        spec = _TOKENS_SINGLETON_PROVIDERS.get(self.provider)
        if spec is None:
            return entry
        display = spec[0]
        is_codex = self.provider == "openai-codex"
        sources = ("device_code", "manual:device_code") if is_codex else ("device_code",)
        if entry.source not in sources:
            return entry
        try:
            with _auth_store_lock():
                state = _load_provider_state(_load_auth_store(), self.provider)
            tokens = state.get("tokens") if isinstance(state, dict) else None
            if not isinstance(tokens, dict):
                return entry
            if is_codex and not _codex_entry_tracks_singleton(entry, tokens):
                return entry
            store_access = tokens.get("access_token", "")
            store_refresh = tokens.get("refresh_token", "")
            entry_refresh = entry.refresh_token or ""
            # Adopt when either side differs: a fresh refresh_token from
            # another process means our pair is consumed/stale.
            should_adopt = bool(store_access) and (
                store_access != (entry.access_token or "")
                or (store_refresh and store_refresh != entry_refresh)
            )
            if not should_adopt and is_codex and store_refresh and store_refresh != entry_refresh and not store_access:
                # Store has only a refresh_token — another process rotated the
                # pair and the access_token was consumed. Adopt the
                # refresh_token so we don't replay the consumed one.
                logger.info(
                    "Pool entry %s: auth.json has newer refresh_token "
                    "but no access_token; adopting refresh_token to "
                    "avoid replaying consumed token",
                    entry.id,
                )
                should_adopt = True
            if should_adopt and _singleton_predates_entry(state, entry):
                # #106705: manual:* entries never write back to the singleton
                # (#39236), so after a pool-side rotation the singleton sits
                # one chain behind. Adopting it would replay the consumed
                # refresh token. ``last_refresh`` is stamped on every
                # successful rotation on both sides; when either side lacks a
                # parseable stamp this falls through to the historical
                # adopt-on-difference above (#70111).
                logger.info(
                    "Pool entry %s: auth.json singleton predates this entry's "
                    "rotation (last_refresh %s < %s); keeping pool chain to "
                    "avoid replaying the consumed refresh token",
                    entry.id,
                    state.get("last_refresh") if isinstance(state, dict) else None,
                    entry.last_refresh,
                )
                should_adopt = False
            if should_adopt:
                logger.debug(
                    "Pool entry %s: syncing %s tokens from auth.json (refreshed by another process)",
                    entry.id, display,
                )
                field_updates: dict[str, Any] = {
                    "access_token": store_access or entry.access_token,
                    "refresh_token": store_refresh or entry.refresh_token,
                    **_CLEAR_STATUS,
                }
                if state.get("last_refresh"):
                    field_updates["last_refresh"] = state["last_refresh"]
                return self._adopt(entry, **field_updates)
        except Exception as exc:
            logger.debug("Failed to sync %s entry from auth.json: %s", display, exc)
        return entry

    def _sync_nous_entry_from_auth_store(self, entry: PooledCredential) -> PooledCredential:
        """Sync a Nous device_code entry from auth.json ``providers.nous`` if state differs.

        Another process refreshing via ``resolve_nous_runtime_credentials``
        writes fresh tokens under ``_auth_store_lock``; adopting them avoids a
        "refresh token reuse" revocation on the Nous Portal.
        """
        if self.provider != "nous" or entry.source != "device_code":
            return entry
        try:
            with _auth_store_lock():
                state = _load_provider_state(_load_auth_store(), "nous")
            if not state:
                return entry
            comparable = {
                key: state.get(key)
                for key in (
                    "access_token", "refresh_token", "expires_at",
                    "agent_key", "agent_key_expires_at", "inference_base_url",
                )
            }
            if not any(v not in (None, "") and getattr(entry, k, None) != v for k, v in comparable.items()):
                return entry
            logger.debug("Pool entry %s: syncing Nous state from auth.json", entry.id)
            field_updates: dict[str, Any] = dict(_CLEAR_STATUS)
            field_updates.update({k: v for k, v in comparable.items() if v})
            extra_updates = dict(entry.extra)
            extra_updates.update(
                {k: state[k] for k in _NOUS_EXTRA_STATE_KEYS if state.get(k) is not None}
            )
            return self._adopt(entry, extra=extra_updates, **field_updates)
        except Exception as exc:
            logger.debug("Failed to sync Nous entry from auth.json: %s", exc)
        return entry

    def _sync_device_code_entry_to_auth_store(self, entry: PooledCredential) -> None:
        """Write refreshed pool entry tokens back to auth.json ``providers.<id>``.

        Otherwise the next ``load_pool()`` re-seeds the stale singleton state
        over the fresh entry — potentially a consumed single-use refresh
        token. Applies to Nous, OpenAI Codex and xAI OAuth singletons.

        ``set_active=False`` everywhere: a sync-back is a token-rotation side
        effect, not the user choosing a provider; ``_save_provider_state``
        would flip ``active_provider`` to whichever provider refreshed last.

        #74339: decide the root write-through on WHERE the state resolved
        from (``_load_provider_state_with_source``), not on whether the
        profile has a ``providers.<id>`` key — ``_store_provider_state``
        creates that key unconditionally, which self-sealed the check after
        the first refresh. When the grant came from the global root, write
        back to root ONLY and skip the profile store so it never accrues a
        shadowing key that blocks both the fallback and the write-through.
        """
        # Only singleton-seeded entries sync back; ``manual:*`` entries are
        # independent credentials and must not write to the singleton.
        if entry.source != "device_code" or self.provider not in ("nous", *_TOKENS_SINGLETON_PROVIDERS):
            return
        try:
            with _auth_store_lock():
                auth_store = _load_auth_store()
                state, source_path = _load_provider_state_with_source(auth_store, self.provider)
                if not isinstance(state, dict):
                    return
                global_root = _global_auth_file_path()
                is_from_root = bool(
                    source_path is not None and global_root is not None and _same_path(source_path, global_root)
                )
                if not self._apply_entry_to_singleton_state(entry, state):
                    return
                if is_from_root:
                    _write_through_provider_state_to_global_root(self.provider, state)
                else:
                    _store_provider_state(auth_store, self.provider, state, set_active=False)
                    _save_auth_store(auth_store)
        except Exception as exc:
            logger.debug("Failed to sync %s pool entry back to auth store: %s", self.provider, exc)

    def _apply_entry_to_singleton_state(self, entry: PooledCredential, state: dict[str, Any]) -> bool:
        """Copy *entry*'s tokens into the provider's auth.json ``state`` in place."""
        if self.provider == "nous":
            state["access_token"] = entry.access_token
            for key in ("refresh_token", "expires_at", "agent_key", "agent_key_expires_at"):
                if getattr(entry, key):
                    state[key] = getattr(entry, key)
            for extra_key in _NOUS_EXTRA_STATE_KEYS:
                val = entry.extra.get(extra_key)
                if val is not None:
                    state[extra_key] = val
            if entry.inference_base_url:
                state["inference_base_url"] = entry.inference_base_url
            return True
        tokens = state.get("tokens")
        if not isinstance(tokens, dict):
            return False
        tokens["access_token"] = entry.access_token
        if entry.refresh_token:
            tokens["refresh_token"] = entry.refresh_token
        if entry.last_refresh:
            state["last_refresh"] = entry.last_refresh
        return True

    # ---- refresh -----------------------------------------------------------

    def _refresh_entry(self, entry: PooledCredential, *, force: bool, failed_key: Optional[str] = None):
        if entry.auth_type != AUTH_TYPE_OAUTH or not entry.refresh_token:
            if force:
                self._mark_exhausted(entry, None)
            return None
        # Plugin providers with a ``refresh_credential`` hook are treated as single-use by default:
        # the pool cannot know their grant semantics, and a needless in-lock re-read is cheaper than
        # a ``refresh_token_reused`` login loss. Eligibility comes from the hook, never a name set.
        if self.provider not in _SINGLE_USE_REFRESH_PROVIDERS and plugin_refresh_hook(self.provider) is None:
            return self._refresh_entry_impl(entry, force=force, failed_key=failed_key)

        # Single-use refresh tokens: sync -> POST -> write-back must be atomic
        # across Hermes processes, or two processes adopt the same on-disk
        # token, both POST it, and the loser gets ``refresh_token_reused`` /
        # ``invalid_grant`` (for Anthropic sources other than claude_code
        # there was no recovery path at all). Serialize through the shared
        # cross-process auth-store flock; a waiter's in-lock re-sync picks up
        # the winner's rotated token and skips the POST.
        with _auth_store_lock(timeout_seconds=self._single_use_refresh_lock_timeout()):
            if self.provider == "openai-codex":
                synced = self._sync_entry_from_auth_store(entry)
                if synced is not entry and not force and not self._entry_needs_refresh(synced):
                    return synced
                return self._refresh_entry_impl(synced, force=force)
            synced = self._sync_entry_from_pool_store(entry)
            if self.provider == "anthropic" and synced.source == "claude_code":
                # claude_code entries are NOT profile-owned: the refresh token
                # lives in one shared ~/.claude/.credentials.json (or Keychain)
                # every profile reads. The profile-scoped lock above only covers
                # THIS profile's auth.json, so take the dedicated shared-file
                # lock (inner, per the ordering invariant on ``_auth_store_lock``)
                # and re-read that authoritative file before any
                # adopt-and-return shortcut fires. The official ``claude`` CLI
                # rotating out-of-band is handled by the sync-and-retry-once
                # fallback in ``_recover_failed_refresh``.
                with self._claude_code_credentials_lock():
                    synced = self._sync_anthropic_entry_from_credentials_file(synced)
                    if synced.refresh_token != entry.refresh_token:
                        return synced
                    return self._refresh_entry_impl(synced, force=force)
            if synced.access_token != entry.access_token or synced.refresh_token != entry.refresh_token:
                return synced
            return self._refresh_entry_impl(synced, force=force)

    def _claude_code_credentials_lock(self):
        """Cross-process lock keyed to the shared claude_code credentials file.

        Unlike the per-profile ``_auth_store_lock()`` this serializes every
        profile and process that might refresh a ``claude_code`` entry.
        """
        from agent.anthropic_credentials import claude_code_credentials_path

        return _auth_store_lock(
            timeout_seconds=self._single_use_refresh_lock_timeout(),
            target_path=claude_code_credentials_path(),
        )

    def _fail_closed_unpersisted_rotation(
        self,
        entry: PooledCredential,
        exc: BaseException,
        *,
        store: str,
    ) -> None:
        """Quarantine an entry whose rotated pair never reached its store.

        For ``claude_code`` / ``hermes_pkce`` the singleton file — not
        auth.json — is authoritative: ``_seed_from_singletons()`` re-reads it
        on every ``load_pool()``. When the refresh POST succeeded but the
        singleton write failed, the replacement pair exists only in memory
        while the consumed pair survives on disk and would be re-seeded over
        any row we persisted; the next refresh would replay the spent token.
        So never expose or persist the rotated pair; mark the entry terminally
        so it surfaces as an explicit re-auth requirement.
        """
        logger.error(
            "Anthropic %s refresh rotated the single-use token but could not commit it "
            "to %s (%s) — failing closed and quarantining the credential; "
            "re-authenticate to recover",
            entry.source, store, exc,
        )
        try:
            from agent.anthropic_credentials import (
                mark_rotation_consumed_uncommitted,
                spent_rotation_source_path,
            )

            # The singleton still holds the spent pair and load_pool() re-seeds
            # it, so record the fingerprints — persisted to the shared source's
            # sidecar registry (we hold its path-keyed lock here) so OTHER
            # processes/profiles adopt the terminal verdict instead of leasing
            # the stale pair or re-POSTing the spent refresh token.
            mark_rotation_consumed_uncommitted(
                entry.access_token,
                entry.refresh_token,
                source_path=spent_rotation_source_path(entry.source),
            )
        except Exception:  # pragma: no cover - never block the quarantine
            logger.debug("Failed to record consumed rotation fingerprints", exc_info=True)
        self._mark_exhausted(
            entry,
            None,
            {
                "reason": CREDENTIAL_PERSIST_FAILED_REASON,
                "message": f"rotated credential was not durably written to {store}: {exc}",
            },
        )

    def _single_use_refresh_lock_timeout(self) -> float:
        """Configured refresh POST timeout plus margin, so a slow token endpoint cannot starve the flock."""
        env_var = _REFRESH_TIMEOUT_ENV_VARS.get(self.provider, "HERMES_ANTHROPIC_REFRESH_TIMEOUT_SECONDS")
        refresh_timeout_seconds = auth_mod.env_float(env_var, 20)
        return max(float(auth_mod.AUTH_LOCK_TIMEOUT_SECONDS), float(refresh_timeout_seconds) + 5.0)

    def _commit_anthropic_rotation(
        self, entry: PooledCredential, refreshed: dict[str, Any]
    ) -> None:
        """Write a rotated Anthropic pair to its authoritative singleton, or fail closed.

        claude_code -> ~/.claude/.credentials.json (so the fallback resolver
        and other profiles see it). hermes_pkce -> ~/.hermes/.anthropic_oauth.json
        (``_seed_from_singletons`` re-seeds it every load; a borrowed row commits
        to the ROOT's file, never a new profile-local copy, #100339). Not
        ``endswith``: manual:hermes_pkce is pool-owned and a singleton for it
        would be a second authority for the same refresh-token family.
        """
        if entry.source == "claude_code":
            store = "~/.claude/.credentials.json"
        elif entry.source == "hermes_pkce":
            store = "~/.hermes/.anthropic_oauth.json"
        else:
            return
        try:
            from agent import anthropic_credentials as ac
            args = (refreshed["access_token"], refreshed["refresh_token"], refreshed["expires_at_ms"])
            if entry.source == "claude_code":
                ac._write_claude_code_credentials(*args, spent_refresh_token=entry.refresh_token or "")
            else:
                ac._write_hermes_oauth_credentials(*args, target=_singleton_target_for_entry(self, entry))
        except Exception as wexc:
            # Authoritative commit failed: do not mark, persist or return the
            # rotation as successful, and bypass the re-POST recovery path —
            # there is nothing left to retry with.
            raise _RefreshDone(self._fail_closed_unpersisted_rotation(entry, wexc, store=store))

    def _refresh_anthropic(self, entry: PooledCredential) -> PooledCredential:
        """POST the Anthropic refresh, commit to the singleton, return the rotated (unpersisted) entry."""
        from agent.anthropic_credentials import (
            is_rotation_consumed_uncommitted,
            refresh_anthropic_oauth_pure,
            spent_rotation_source_path,
        )

        # Never POST a refresh token another process already spent: the
        # durable sidecar verdict is what a fresh interpreter sees here.
        source_path = spent_rotation_source_path(entry.source)
        if is_rotation_consumed_uncommitted(entry.refresh_token, source_path=source_path) or (
            is_rotation_consumed_uncommitted(entry.access_token, source_path=source_path)
        ):
            raise _RefreshDone(self._fail_closed_unpersisted_rotation(
                entry,
                RuntimeError(
                    "credential pair was rotated by another process but the "
                    "rotation never committed (spent-rotation sidecar verdict)"
                ),
                store=str(source_path or "credential store"),
            ))
        refreshed = refresh_anthropic_oauth_pure(entry.refresh_token, use_json=entry.source.endswith("hermes_pkce"))
        updated = replace(
            entry,
            access_token=refreshed["access_token"],
            refresh_token=refreshed["refresh_token"],
            expires_at_ms=refreshed["expires_at_ms"],
        )
        self._commit_anthropic_rotation(entry, refreshed)
        return updated

    def _post_tokens_refresh(self, entry: PooledCredential) -> PooledCredential:
        """Codex / xAI: POST the refresh and return the rotated (unpersisted) entry."""
        refresh_fn_name = _TOKENS_SINGLETON_PROVIDERS[self.provider][2]
        refreshed = getattr(auth_mod, refresh_fn_name)(entry.access_token, entry.refresh_token)
        return replace(
            entry,
            access_token=refreshed["access_token"],
            refresh_token=refreshed["refresh_token"],
            last_refresh=refreshed.get("last_refresh"),
        )

    def _refresh_entry_impl(self, entry: PooledCredential, *, force: bool, failed_key: Optional[str] = None):
        # Single-use-token providers adopt fresher tokens from their store
        # BEFORE spending the refresh_token; ``entry`` is rebound to the synced
        # row so the failure path below recovers against the pair we POSTed.
        try:
            if self.provider == "anthropic":
                updated = self._refresh_anthropic(entry)
            elif self.provider in _TOKENS_SINGLETON_PROVIDERS:
                entry = self._sync_entry_from_auth_store(entry)
                updated = self._post_tokens_refresh(entry)
            elif (plugin_refresh := plugin_refresh_hook(self.provider)) is not None:
                rotated = plugin_refresh(entry)
                if not rotated:
                    # ``None``/empty = the plugin could not rotate: bench like a failed refresh POST, never
                    # report the stale row as refreshed (the loop would replay the dead bearer).
                    raise RuntimeError("provider refresh_credential returned no rotated fields")
                updated = apply_plugin_refresh_result(entry, rotated)
            elif self.provider == "nous":
                # The bearer the request SENT, not this row's (maybe older) copy: adopting it replays the 401.
                stale_key = failed_key or entry.runtime_api_key or entry.agent_key or entry.access_token
                synced = self._sync_nous_entry_from_auth_store(entry)
                if synced is not entry:
                    entry = synced
                    # A peer persisted a DIFFERENT usable key: adopt it without re-spending the refresh token.
                    if force and entry.runtime_api_key and entry.runtime_api_key != stale_key:
                        logger.debug("Nous entry %s: adopting peer-rotated token, skipping refresh", entry.id)
                        return entry
                auth_mod.resolve_nous_runtime_credentials(force_refresh=force, stale_access_token=stale_key or None)
                updated = self._sync_nous_entry_from_auth_store(entry)
            else:
                return entry
        except _RefreshDone as done:
            return done.result
        except Exception as exc:
            logger.debug("Credential refresh failed for %s/%s: %s", self.provider, entry.id, exc)
            return self._recover_failed_refresh(entry, exc)

        updated = replace(updated, **_MARK_OK)
        self._replace_entry(entry, updated)
        # Declare the cleared id: a borrowed row carries no access_token on disk, so
        # the merge's token-change bypass cannot apply and a plain persist would copy
        # the still-binding cooldown back over this success.
        self._persist(status_cleared_ids=[updated.id])
        # Sync back so _seed_from_singletons() on the next load_pool() sees
        # fresh state instead of re-seeding consumed tokens.
        self._sync_device_code_entry_to_auth_store(updated)
        return updated

    def _recover_failed_refresh(self, entry: PooledCredential, exc: Exception) -> Optional[PooledCredential]:
        """After a failed refresh POST: adopt a peer's rotation, quarantine a dead grant, or bench.

        Another process may have consumed the refresh token between our
        pre-POST sync and the HTTP call; re-read the provider's token
        authority once more and adopt fresher tokens before giving up.
        """
        if self.provider == "anthropic":
            if entry.source == "claude_code":
                synced = self._sync_anthropic_entry_from_credentials_file(entry)
                if synced.refresh_token != entry.refresh_token:
                    logger.debug("Retrying refresh with synced token from credentials file")
                    try:
                        from agent.anthropic_credentials import refresh_anthropic_oauth_pure
                        refreshed = refresh_anthropic_oauth_pure(
                            synced.refresh_token, use_json=synced.source.endswith("hermes_pkce"),
                        )
                        # Commit to the authoritative singleton BEFORE marking or
                        # persisting the pool row, or a failed write leaves an
                        # "ok" row that the next load_pool() re-seeds over.
                        self._commit_anthropic_rotation(synced, refreshed)
                        return self._adopt(
                            synced,
                            access_token=refreshed["access_token"],
                            refresh_token=refreshed["refresh_token"],
                            expires_at_ms=refreshed["expires_at_ms"],
                            last_status=STATUS_OK,
                            last_status_at=None,
                            last_error_code=None,
                        )
                    except _RefreshDone as done:
                        return done.result
                    except Exception as retry_exc:
                        logger.debug("Retry refresh also failed: %s", retry_exc)
                elif not self._entry_needs_refresh(synced):
                    logger.debug("Credentials file has valid token, using without refresh")
                    return synced
            else:
                # Backstop for pool-owned sources (hermes_pkce, manual:dashboard_pkce):
                # the winner may have persisted between our pre-check and our POST.
                synced = self._sync_entry_from_pool_store(entry)
                if synced.refresh_token != entry.refresh_token:
                    logger.debug("Anthropic OAuth refresh failed but pool store has newer tokens — adopting")
                    return self._adopt(synced, **_MARK_OK)
            from agent.anthropic_credentials import is_terminal_anthropic_refresh_error
            if is_terminal_anthropic_refresh_error(exc):
                # A dead grant is not "exhausted": benching it for a TTL replays the dead token every
                # hour at DEBUG, so the lost login left no trace (#113023). Never touch the external
                # CLI's credentials file here — only Hermes' own row goes DEAD.
                logger.warning(
                    "Anthropic OAuth refresh token for %s is terminally invalid (%s); the credential "
                    "leaves rotation. Re-run 'hermes auth add anthropic' to sign in again.",
                    entry.label or entry.id[:8], exc)
                self._mark_dead_refresh_grant(entry, exc)
                return None
        elif self.provider in _TOKENS_SINGLETON_PROVIDERS:
            _, display, _, terminal_fn_name = _TOKENS_SINGLETON_PROVIDERS[self.provider]
            synced = self._sync_entry_from_auth_store(entry)
            if synced.refresh_token != entry.refresh_token:
                logger.debug("%s OAuth refresh failed but auth.json has newer tokens — adopting", display)
                return self._adopt(synced, **_MARK_OK)
            # Terminal error with no newer tokens: the stored refresh_token is
            # dead. Clear it from auth.json so the next session does not
            # re-seed the revoked credentials, and drop singleton-seeded
            # entries from the pool (mirrors the Nous quarantine path).
            if getattr(auth_mod, terminal_fn_name)(exc):
                # WARNING, not debug: this is the moment a login is lost. At the default log level a
                # silent quarantine looked like "I logged in once and Hermes keeps failing" (#113023).
                logger.warning(
                    "%s OAuth refresh token is terminally invalid (%s); clearing local token state. "
                    "Re-run 'hermes auth add %s' to sign in again.", display, exc, self.provider)
                self._clear_terminal_tokens_state(entry, exc)
                self._quarantine_sources(entry, {"device_code"})
                self._mark_dead_refresh_grant(entry, exc)
                return None
        elif self.provider == "nous":
            synced = self._sync_nous_entry_from_auth_store(entry)
            if synced.refresh_token != entry.refresh_token:
                logger.debug("Nous refresh failed but auth.json has newer tokens — adopting")
                updated = self._adopt(synced, **_MARK_OK)
                self._sync_device_code_entry_to_auth_store(updated)
                return updated
            if isinstance(exc, TimeoutError):
                # Lost the auth-store lock race under heavy fan-out. That says
                # nothing about the credential — benching it here emptied the
                # pool for ~120 sessions ("matched no nous entry ... pool size
                # 0"). The caller's retry re-syncs once the winner persisted.
                logger.debug("Nous refresh skipped: auth store lock busy; not benching entry")
                return entry
            if auth_mod._is_terminal_nous_refresh_error(exc):
                logger.warning(
                    "Nous refresh token is terminally invalid (%s); clearing local token state. "
                    "Re-run 'hermes auth add nous' to sign in again.", exc)
                self._clear_terminal_nous_state(entry, exc)
                self._quarantine_sources(
                    entry,
                    {auth_mod.NOUS_DEVICE_CODE_SOURCE, f"manual:{auth_mod.NOUS_DEVICE_CODE_SOURCE}"},
                )
                self._mark_dead_refresh_grant(entry, exc)
                return None
        elif plugin_refresh_hook(self.provider) is not None:
            handled, result = recover_failed_plugin_refresh(self, entry, exc)
            if handled:
                return result
        self._mark_exhausted(entry, None)
        return None

    def _mark_dead_refresh_grant(self, entry: PooledCredential, exc: Exception) -> None:
        """Mark a row whose refresh token was terminally rejected DEAD, if the quarantine kept it.

        ``_quarantine_sources`` drops only singleton-seeded rows; an independent ``manual:*`` login
        (``hermes auth add``) survives, and an unmarked survivor re-enters rotation and re-fires the
        terminal WARNING on every later refresh attempt. DEAD leaves rotation until a write-side
        re-auth sync clears it (never via TTL).
        """
        with self._lock:
            current = next((item for item in self._entries if item.id == entry.id), None)
            if current is None or current.last_status == STATUS_DEAD:
                return
            self._adopt(
                current,
                last_status=STATUS_DEAD,
                last_status_at=time.time(),
                last_error_code=None,
                last_error_reason=str(getattr(exc, "code", None) or "invalid_grant"),
                last_error_message=redact_error_text(str(exc), (current.access_token, current.refresh_token, current.agent_key)),
            )

    def _clear_terminal_tokens_state(self, entry: PooledCredential, exc: Exception) -> None:
        """Drop the dead Codex/xAI token pair from auth.json unless a peer already rotated it."""
        display = _TOKENS_SINGLETON_PROVIDERS[self.provider][1]
        try:
            with _auth_store_lock():
                auth_store = _load_auth_store()
                state = _load_provider_state(auth_store, self.provider) or {}
                tokens = (state.get("tokens") or {}) if isinstance(state, dict) else None
                if isinstance(tokens, dict):
                    store_refresh = str(tokens.get("refresh_token") or "").strip()
                    if not store_refresh or store_refresh == str(entry.refresh_token or "").strip():
                        tokens.pop("access_token", None)
                        tokens.pop("refresh_token", None)
                        state["tokens"] = tokens
                        state["last_auth_error"] = {
                            "provider": self.provider,
                            "code": getattr(exc, "code", "unknown"),
                            "message": str(exc),
                            "reason": "credential_pool_refresh_failure",
                            "relogin_required": True,
                            "at": datetime.now(UTC).isoformat(),
                        }
                        _save_provider_state(auth_store, self.provider, state)
                        _save_auth_store(auth_store)
        except Exception as clear_exc:
            logger.debug("Failed to clear terminal %s OAuth state: %s", display, clear_exc)

    def _clear_terminal_nous_state(self, entry: PooledCredential, exc: Exception) -> None:
        try:
            with _auth_store_lock():
                auth_store = _load_auth_store()
                state = _load_provider_state(auth_store, "nous") or {
                    "client_id": entry.client_id,
                    "portal_base_url": entry.portal_base_url,
                    "inference_base_url": entry.inference_base_url,
                    "token_type": entry.token_type,
                    "scope": entry.scope,
                    "tls": entry.tls,
                }
                store_refresh = str(state.get("refresh_token") or "").strip()
                if not store_refresh or store_refresh == str(entry.refresh_token or "").strip():
                    auth_mod._quarantine_nous_oauth_state(state, exc, reason="credential_pool_refresh_failure")
                    auth_mod._quarantine_nous_pool_entries(auth_store, exc, reason="credential_pool_refresh_failure")
                    _save_provider_state(auth_store, "nous", state)
                    _save_auth_store(auth_store)
        except Exception as clear_exc:
            logger.debug("Failed to clear terminal Nous OAuth state: %s", clear_exc)

    def _entry_needs_refresh(self, entry: PooledCredential) -> bool:
        if entry.auth_type != AUTH_TYPE_OAUTH:
            return False
        if self.provider == "anthropic" or plugin_refresh_hook(self.provider) is not None:
            return plugin_row_is_expiring(entry)  # expiry-stamped rows: rotate 2 min ahead of expires_at_ms
        if self.provider == "openai-codex":
            return _codex_access_token_is_expiring(entry.access_token, CODEX_ACCESS_TOKEN_REFRESH_SKEW_SECONDS)
        if self.provider == "xai-oauth":
            return auth_mod._xai_access_token_is_expiring(
                entry.access_token, auth_mod._xai_proactive_refresh_skew_seconds(entry.access_token),
            )
        # Nous refresh can require network access and happens when runtime
        # credentials are actually resolved, not on enumeration/selection.
        return False

    def select(self) -> Optional[PooledCredential]:
        with self._lock:
            return self._select_unlocked()

    def _available_entries(
        self, *, clear_expired: bool = False, refresh: bool = False, model: Optional[str] = None,
    ) -> tuple[list[PooledCredential], list[PooledCredential]]:
        """Return (available, pending_refresh) for entries not in cooldown.

        *clear_expired* resets elapsed cooldowns to STATUS_OK and persists.
        *refresh* refreshes entries needing a token refresh (skipped on
        failure) — except single-use-token providers (openai-codex,
        xai-oauth), which are returned as *pending_refresh* so the caller
        refreshes them outside the lock instead of stalling every pool
        consumer during cross-process flock acquisition + OAuth network I/O.
        """
        now = time.time()
        cleared_any = False
        entries_to_prune: list[str] = []
        available: list[PooledCredential] = []
        pending_refresh: list[PooledCredential] = []
        sole_credential = self._is_sole_credential()
        for entry in self._entries:
            # Borrowed credentials persist as metadata-only references and are
            # hydrated from their live source on load; never lease an
            # unhydrated duplicate as an empty key.
            if entry.auth_type == AUTH_TYPE_API_KEY and not entry.runtime_api_key:
                continue
            synced = self._resync_stale_entry(entry)
            if synced is not entry:
                entry = synced
                cleared_any = True
            if entry.last_status == STATUS_DEAD:
                # Manual DEAD credentials are pruned after a 24h quiet window;
                # singleton-seeded ones stay (audit trail, and the seeder would
                # re-create them anyway). DEAD never re-enters via TTL — only a
                # write-side re-auth sync clears it.
                if _is_manual_source(entry.source):
                    dead_at = entry.last_status_at or 0
                    if dead_at and now - dead_at > DEAD_MANUAL_PRUNE_TTL_SECONDS:
                        logger.warning(
                            "credential pool: pruning DEAD manual entry %s "
                            "(reason=%s, age=%.1fh) — re-add via `hermes auth add %s`",
                            entry.label or entry.id[:8],
                            entry.last_error_reason or "unknown",
                            (now - dead_at) / 3600.0,
                            self.provider,
                        )
                        entries_to_prune.append(entry.id)  # can't mutate while iterating
                        cleared_any = True
                continue
            if model_cooldown_until(entry, model) is not None:
                continue
            if entry.last_status == STATUS_COOLDOWN:
                cooldown_until = (entry.last_status_at or now) + CUSTOM_429_COOLDOWN_SECONDS
                if now < cooldown_until:
                    continue
                # Preserve the cooldown marker after it opens.  A new 429 on
                # this re-trial is how _mark_exhausted distinguishes a minute
                # rate limit from an exhausted daily quota.
            if entry.last_status == STATUS_EXHAUSTED:
                exhausted_until = _exhausted_until(entry)
                if exhausted_until is not None and now < exhausted_until:
                    continue
                if clear_expired:
                    # The probe may have rotated this row's single-use token pair: clear the
                    # cooldown on the live row, not on this pre-probe copy.
                    entry = self._find(lambda e, i=entry.id: e.id == i) or entry
                    entry = self._adopt(entry, persist=False, **_MARK_OK)
                    cleared_any = True
            if refresh and self._entry_needs_refresh(entry):
                if self.provider in _TOKENS_SINGLETON_PROVIDERS:
                    pending_refresh.append(entry)
                    continue
                refreshed = self._refresh_entry(entry, force=False)
                if refreshed is None:
                    continue
                entry = refreshed
            if entry.auth_type == AUTH_TYPE_OAUTH and not (entry.access_token or "").strip():
                # A borrowed OAuth row that failed to hydrate (or a sanitized
                # row read straight off disk); leasing it would send an empty
                # bearer. The API-key guard above does not cover it.
                continue
            available.append(entry)
        if entries_to_prune:
            pruned_ids = set(entries_to_prune)
            self._entries = [e for e in self._entries if e.id not in pruned_ids]
        if cleared_any:
            self._persist(removed_ids=entries_to_prune)
        return available, pending_refresh

    def _log_no_available_entries(self) -> None:
        """Emit the empty-pool INFO line at most once per throttle window."""
        now = time.monotonic()
        last = self._last_no_entries_log_at
        if last is not None and (now - last) < NO_AVAILABLE_ENTRIES_LOG_THROTTLE_SECONDS:
            return
        self._last_no_entries_log_at = now
        logger.info("credential pool %s: no available entries (all exhausted or empty)", self.provider)

    def reclaim(self, credential_id: str, *, model: Optional[str] = None) -> Optional[PooledCredential]:
        """Entry *credential_id* once its cooldown has lifted (cleared and token-refreshed the way
        ``select`` would), else ``None``. Never bumps ``request_count`` or round-robin order: a
        live session asking "may I go back?" every turn is not a request."""
        with self._lock:
            available, pending = self._available_entries(clear_expired=True, refresh=True, model=model)
        if any(e.id == credential_id for e in pending):
            self._refresh_pending_entries([e for e in pending if e.id == credential_id])
            with self._lock:
                available, _pending = self._available_entries(clear_expired=True, refresh=True, model=model)
        return next((e for e in available if e.id == credential_id), None)

    # ---- rotation ----------------------------------------------------------

        if self._strategy == STRATEGY_RANDOM:
            entry = random.choice(available)
            self._current_id = entry.id
            return entry

        if self._strategy == STRATEGY_LEAST_USED and len(available) > 1:
            entry = min(available, key=lambda e: e.request_count)
            # Increment usage counter so subsequent selections distribute load
            updated = replace(entry, request_count=entry.request_count + 1)
            self._replace_entry(entry, updated)
            self._current_id = entry.id
            return updated

        if self._strategy == STRATEGY_ROUND_ROBIN and len(available) > 1:
            entry = available[0]
            rotated = [candidate for candidate in self._entries if candidate.id != entry.id]
            rotated.append(replace(entry, priority=len(self._entries) - 1))
            self._entries = [replace(candidate, priority=idx) for idx, candidate in enumerate(rotated)]
            self._persist()
            self._current_id = entry.id
            return self.current() or entry

        entry = available[0]
        self._current_id = entry.id
        return entry

    def peek(self) -> Optional[PooledCredential]:
        current = self.current()
        if current is not None:
            return current
        available = self._available_entries()
        return available[0] if available else None

    def mark_custom_429_and_rotate(
        self,
        *,
        api_key_hint: Optional[str] = None,
        error_context: Optional[Dict[str, Any]] = None,
    ) -> Tuple[Optional[PooledCredential], bool]:
        """Advance a custom key ring after a 429.

        The normal pool intentionally skips cooling entries.  Custom API-key
        pools instead keep an ordered ring of *two usable slots*: after key A
        gets a 429, gateway immediately runs key B.  Once the ring wraps back
        to key A, the caller performs a full ``hi`` probe before declaring the
        pool depleted.
        """
        with self._lock:
            entry = next(
                (e for e in self._entries if api_key_hint and e.runtime_api_key == api_key_hint),
                None,
            ) or self.current() or self._select_unlocked()
            if entry is None:
                return None, False
            self._mark_exhausted(entry, 429, error_context)
            eligible = [
                e for e in self._entries
                if e.id != entry.id and e.last_status not in {STATUS_EXHAUSTED, STATUS_DEAD}
            ]
            if not eligible:
                self._current_id = None
                return None, False
            current_index = next(i for i, e in enumerate(self._entries) if e.id == entry.id)
            next_entry = None
            wrapped = False
            for offset in range(1, len(self._entries) + 1):
                candidate = self._entries[(current_index + offset) % len(self._entries)]
                if candidate in eligible:
                    next_entry = candidate
                    wrapped = current_index + offset >= len(self._entries)
                    break
            if next_entry is None:
                return None, False
            self._current_id = next_entry.id
            return next_entry, wrapped

    def probe_custom_keys(self, model: str) -> Tuple[Optional[PooledCredential], int, int]:
        """Send the minimal ``hi`` chat request through every custom key.

        Returns ``(first_live, live_count, dead_count)``.  Only HTTP 429 is a
        quota death here; a non-429 response proves that the key can still be
        used and remains available for recovery.
        """
        if not _custom_pool(self.provider):
            return None, 0, 0
        live: List[PooledCredential] = []
        dead = 0
        for entry in self.entries():
            if entry.last_status == STATUS_DEAD or not entry.runtime_api_key:
                dead += 1
                continue
            if _probe_custom_api_key(entry, model):
                live.append(entry)
            else:
                dead += 1
                # A full-ring ``hi`` probe is the terminal verdict requested
                # by the custom-key flow.  It follows a wrap-around of normal
                # traffic and has already given every configured key a turn;
                # unlike an individual first 429, a 429 here must keep this
                # entry out of selection until the user resets the pool.
                # Do not call _mark_exhausted(): that intentionally assigns a
                # first custom 429 a 65-second cooldown and would leave a
                # key that just failed the decisive probe selectable again.
                self._mark_custom_probe_exhausted(entry)
        if live:
            with self._lock:
                self._current_id = live[0].id
        return (live[0] if live else None), len(live), dead

    def _mark_custom_probe_exhausted(self, entry: PooledCredential) -> None:
        """Persist a conclusive 429 from a complete custom-pool probe."""
        updated = replace(
            entry,
            last_status=STATUS_EXHAUSTED,
            last_status_at=time.time(),
            last_error_code=429,
            last_error_reason=None,
            last_error_message="429 during pool quota probe",
            last_error_reset_at=None,
        )
        with self._lock:
            self._replace_entry(entry, updated)
            self._persist()

    def mark_exhausted_and_rotate(
        self,
        *,
        status_code: Optional[int],
        error_context: Optional[dict[str, Any]] = None,
        api_key_hint: Optional[str] = None,
    ) -> Optional[PooledCredential]:
        with self._lock:
            entry = None
            if api_key_hint:
                # Prefer the specific entry whose API key matches the one that
                # actually failed.  When this pool was freshly loaded from disk
                # (another process already rotated), current() is None and
                # _select_unlocked() would return the NEXT key — the wrong one.
                entry = next(
                    (e for e in self._entries if e.runtime_api_key == api_key_hint),
                    None,
                )
            if entry is None:
                entry = self.current() or self._select_unlocked()
            if entry is None:
                return None
            _label = entry.label or entry.id[:8]
            self._mark_exhausted(entry, status_code, error_context)
            # Re-read the updated entry to log the correct terminal state.
            updated_entry = self._find(lambda e: e.id == entry.id) or entry
            if updated_entry.last_status == STATUS_DEAD:
                logger.warning(
                    "credential pool: marking %s DEAD (status=%s, reason=%s) — "
                    "permanently failed, will NOT re-enter rotation until re-auth",
                    _label, status_code, updated_entry.last_error_reason or "unknown",
                )
            else:
                logger.info("credential pool: marking %s exhausted (status=%s), rotating", _label, status_code)
            self._current_id = None
            next_entry, _pending = self._select_unlocked(refresh=False)
            if next_entry is not None and next_entry.id == entry.id:
                # No-recovery guard (#97315): selection handed back the very entry that was
                # just marked (the auth-store sync adopted fresher tokens, or a quota probe
                # false-positive lifted the bench mid-selection). Returning it reports a
                # successful rotation without changing the credential, so the caller retries
                # the same 429 forever (~2 req/s for hours). Mirror the single-entry guard on
                # the unmatched-identity branch: surface the failure instead.
                logger.warning(
                    "credential pool: rotation returned the just-marked entry %s — "
                    "treating as no-recovery so the failure surfaces", _label,
                )
                self._current_id = None
                return None
            if next_entry:
                logger.info("credential pool: rotated to %s", next_entry.label or next_entry.id[:8])
            return next_entry

    # ---- leases ------------------------------------------------------------

    def acquire_lease(self, credential_id: Optional[str] = None) -> Optional[str]:
        """Acquire a soft lease on a credential.

        With *credential_id*, lease that entry directly. Otherwise prefer the
        least-leased available credential (priority as tie-breaker); when
        every credential is at the soft cap, still return the least-leased
        one instead of blocking.
        """
        chosen_id, pending_refresh = self._acquire_lease_under_lock(credential_id)
        if pending_refresh:
            self._refresh_pending_entries(pending_refresh)
            # Mirror select(): a pool whose entries all needed a deferred
            # refresh must retry once they are back in rotation, or the caller
            # sees "no credentials available" after a successful refresh.
            if chosen_id is None:
                chosen_id, _ = self._acquire_lease_under_lock(credential_id)
        return chosen_id

    def _acquire_lease_under_lock(
        self, credential_id: Optional[str],
    ) -> tuple[Optional[str], list[PooledCredential]]:
        with self._lock:
            if credential_id:
                self._active_leases[credential_id] = self._active_leases.get(credential_id, 0) + 1
                self._current_id = credential_id
                return credential_id, []

            available, pending_refresh = self._available_entries(clear_expired=True, refresh=True)
            if not available:
                return None, pending_refresh

            below_cap = [e for e in available if self._active_leases.get(e.id, 0) < self._max_concurrent]
            chosen = min(
                below_cap or available,
                key=lambda entry: (self._active_leases.get(entry.id, 0), entry.priority),
            )
            self._active_leases[chosen.id] = self._active_leases.get(chosen.id, 0) + 1
            self._current_id = chosen.id
            return chosen.id, pending_refresh

    def release_lease(self, credential_id: str) -> None:
        with self._lock:
            count = self._active_leases.get(credential_id, 0)
            if count <= 1:
                self._active_leases.pop(credential_id, None)
            else:
                self._active_leases[credential_id] = count - 1

    # ---- explicit refresh / admin ------------------------------------------

    def try_refresh_current(self) -> Optional[PooledCredential]:
        with self._lock:
            return self._try_refresh_current_unlocked()

    def try_refresh_matching(
        self, api_key_hint: Optional[str] = None
    ) -> Optional[PooledCredential]:
        """Force-refresh the entry that supplied ``api_key_hint``.

        Direct integrations may reload the pool after a request failed, so
        ``current_id`` cannot identify the issuing credential. With no hint,
        select WITHOUT the normal proactive refresh: the forced refresh below
        must consume a rotating refresh token exactly once.
        """
        with self._lock:
            entry = None
            if api_key_hint:
                entry = next(
                    (
                        candidate
                        for candidate in self._entries
                        if candidate.runtime_api_key == api_key_hint
                    ),
                    None,
                )
            else:
                entry = self.current() or self._select_unlocked(refresh=False)
            if entry is None:
                return None
            self._current_id = entry.id
            return self._try_refresh_current_unlocked(failed_key=api_key_hint)

    def _try_refresh_current_unlocked(self) -> Optional[PooledCredential]:
        entry = self.current()
        if entry is None:
            return None
        refreshed = self._refresh_entry(entry, force=True, failed_key=failed_key)
        if refreshed is not None:
            self._current_id = refreshed.id
        return refreshed

    def reset_statuses(self) -> int:
        count = 0
        new_entries = []
        for entry in self._entries:
            if entry.last_status or entry.last_status_at or entry.last_error_code:
                new_entries.append(
                    replace(
                        entry,
                        last_status=None,
                        last_status_at=None,
                        last_error_code=None,
                        last_error_reason=None,
                        last_error_message=None,
                        last_error_reset_at=None,
                    )
                )
                count += 1
            else:
                new_entries.append(entry)
        if count:
            self._entries = new_entries
            self._persist()
        return count

    def remove_index(self, index: int) -> Optional[PooledCredential]:
        if index < 1 or index > len(self._entries):
            return None
        removed = self._entries.pop(index - 1)
        self._entries = [
            replace(entry, priority=new_priority)
            for new_priority, entry in enumerate(self._entries)
        ]
        write_credential_pool(
            self.provider,
            [entry.to_dict() for entry in self._entries],
            removed_ids=[removed.id],
        )
        if self._current_id == removed.id:
            self._current_id = None
        return removed

    def resolve_target(self, target: Any) -> Tuple[Optional[int], Optional[PooledCredential], Optional[str]]:
        raw = str(target or "").strip()
        if not raw:
            return None, None, "No credential target provided."

        for idx, entry in enumerate(self._entries, start=1):
            if entry.id == raw:
                return idx, entry, None

        label_matches = [
            (idx, entry)
            for idx, entry in enumerate(self._entries, start=1)
            if entry.label.strip().lower() == raw.lower()
        ]
        if len(label_matches) == 1:
            return label_matches[0][0], label_matches[0][1], None
        if len(label_matches) > 1:
            return None, None, f'Ambiguous credential label "{raw}". Use the numeric index or entry id instead.'
        if raw.isdigit():
            index = int(raw)
            if 1 <= index <= len(self._entries):
                return index, self._entries[index - 1], None
            return None, None, f"No credential #{index}."
        return None, None, f'No credential matching "{raw}".'

    def add_entry(self, entry: PooledCredential) -> PooledCredential:
        entry = replace(entry, priority=_next_priority(self._entries))
        self._entries.append(entry)
        self._persist()
        return entry


# --- Seeding --------------------------------------------------------------


def _upsert_entry(entries: list[PooledCredential], provider: str, source: str, payload: dict[str, Any]) -> bool:
    matching_indices = [idx for idx, entry in enumerate(entries) if entry.source == source]
    existing_idx = matching_indices[0] if matching_indices else None
    duplicate_indices = set(matching_indices[1:])
    if duplicate_indices:
        entries[:] = [entry for idx, entry in enumerate(entries) if idx not in duplicate_indices]

    if existing_idx is None:
        payload.setdefault("id", uuid.uuid4().hex[:6])
        payload.setdefault("priority", _next_priority(entries))
        payload.setdefault("label", payload.get("label") or source)
        entries.append(PooledCredential.from_dict(provider, payload))
        return True

    existing = entries[existing_idx]
    field_updates: dict[str, Any] = {}
    extra_updates: dict[str, Any] = {}
    _field_names = {f.name for f in fields(existing)}
    incoming_token = payload.get("access_token")
    token_changed = incoming_token is not None and incoming_token != existing.access_token
    if token_changed and not existing.access_token:
        # Borrowed sources (claude_code, env-backed rows) are written to
        # auth.json without their secret, so a reloaded entry carries only a
        # ``secret_fingerprint``. Comparing against the empty string reported
        # a rotation on EVERY load and cleared the DEAD/exhausted state the
        # previous process had just persisted. Compare fingerprints instead.
        known_fingerprint = existing.extra.get("secret_fingerprint")
        if isinstance(known_fingerprint, str) and known_fingerprint:
            token_changed = fingerprint_secret_value(incoming_token) != known_fingerprint
    for key, value in payload.items():
        if key in {"id", "priority"} or value is None or (key == "label" and existing.label):
            continue
        if key in _field_names:
            if getattr(existing, key) != value:
                field_updates[key] = value
        elif key in _EXTRA_KEYS and existing.extra.get(key) != value:
            extra_updates[key] = value
    # A rotated token makes the old exhaustion/error state stale.
    if token_changed and existing.last_status is not None:
        field_updates.update(_CLEAR_STATUS)
    if field_updates or extra_updates:
        if extra_updates:
            field_updates["extra"] = {**existing.extra, **extra_updates}
        updated = replace(existing, **field_updates)
        entries[existing_idx] = updated
        # Runtime-only borrowed secret updates refresh the in-memory entry
        # without forcing auth.json churn when the disk-safe payload is
        # unchanged (e.g. env keys with the same fingerprint).
        return bool(duplicate_indices) or existing.to_dict() != updated.to_dict()
    return bool(duplicate_indices)


_ANTHROPIC_SOURCE_RANK = {
    "env:ANTHROPIC_TOKEN": 0,
    "env:CLAUDE_CODE_OAUTH_TOKEN": 1,
    "hermes_pkce": 2,
    "claude_code": 3,
    "env:ANTHROPIC_API_KEY": 4,
}


def _normalize_pool_priorities(provider: str, entries: list[PooledCredential]) -> bool:
    if provider != "anthropic":
        return False
    manual_entries = sorted(
        (entry for entry in entries if _is_manual_source(entry.source)),
        key=lambda entry: entry.priority,
    )
    seeded_entries = sorted(
        (entry for entry in entries if not _is_manual_source(entry.source)),
        key=lambda entry: (
            _ANTHROPIC_SOURCE_RANK.get(entry.source, len(_ANTHROPIC_SOURCE_RANK)),
            entry.priority,
            entry.label,
        ),
    )
    id_to_idx = {entry.id: idx for idx, entry in enumerate(entries)}
    changed = False
    for new_priority, entry in enumerate([*manual_entries, *seeded_entries]):
        if entry.priority != new_priority:
            entries[id_to_idx[entry.id]] = replace(entry, priority=new_priority)
            changed = True
    return changed


def _retain_sources_not_in(entries: list[PooledCredential], drop: set[str]) -> bool:
    """Remove entries whose source is in *drop*; True if anything was removed."""
    retained = [entry for entry in entries if entry.source not in drop]
    if len(retained) == len(entries):
        return False
    entries[:] = retained
    return True


class _Seeder:
    """Accumulates ``_upsert_entry`` results for one ``load_pool`` seeding pass."""

    def __init__(self, provider: str, entries: list[PooledCredential]):
        self.provider = provider
        self.entries = entries
        self.changed = False
        self.active_sources: set[str] = set()
        self.is_suppressed = _is_source_suppressed_fn()

    def upsert(self, source: str, payload: dict[str, Any]) -> bool:
        """Upsert unless suppressed (``hermes auth remove`` must stay stable across loads)."""
        if self.is_suppressed(self.provider, source):
            return False
        self.active_sources.add(source)
        ingested = _upsert_entry(self.entries, self.provider, source, {"source": source, **payload})
        self.changed |= ingested
        return ingested

    @property
    def result(self) -> tuple[bool, set[str]]:
        return self.changed, self.active_sources


def _seed_from_env(provider: str, entries: List[PooledCredential]) -> Tuple[bool, Set[str]]:
    changed = False
    active_sources: Set[str] = set()

    # Prefer ~/.hermes/.env over os.environ — the user's config file is the
    # authoritative source for Hermes credentials. Stale env vars from parent
    # processes (Codex CLI, test scripts, etc.) should not override deliberate
    # changes to the .env file.
    def _get_env_prefer_dotenv(key: str) -> str:
        env_file = load_env()
        raw = env_file.get(key, "").strip()
        env_val = os.environ.get(key, "").strip()
        # If .env contains an unresolved op:// reference, prefer the
        # already-resolved value from os.environ (set by
        # load_hermes_dotenv() -> apply_onepassword_secrets()).  The raw
        # "op://Vault/Item/field" string would otherwise win and every
        # provider auth attempt would receive a URL instead of a key.  This
        # happens during a partial migration, or when the user wrote op://
        # references straight into .env rather than the secrets.onepassword
        # config block.  For every non-op:// value the original
        # .env-takes-precedence behaviour is preserved unchanged.
        if raw.startswith("op://") and env_val:
            return env_val
        return raw or _get_secret(key, "") or env_val

    # Honour user suppression — `hermes auth remove <provider> <N>` for an
    # env-seeded credential marks the env:<VAR> source as suppressed so it
    # won't be re-seeded from the user's shell environment or ~/.hermes/.env.
    # Without this gate the removal is silently undone on the next
    # load_pool() call whenever the var is still exported by the shell.
    try:
        from kestrel_cli.auth import is_provider_explicitly_configured
        if not is_provider_explicitly_configured("anthropic"):
            return
    except ImportError:
        pass

    # API-key vs OAuth is a user-visible choice at `hermes setup`. The API-key
    # signal is ANTHROPIC_API_KEY set AND no OAuth env vars (the save_* helpers
    # zero the other side). Then we MUST NOT seed autodiscovered OAuth tokens:
    # rotation on a 401/429 would silently flip the session onto OAuth, which
    # forces the Claude Code identity injection, `mcp_` tool-name rewrite and
    # claude-cli User-Agent the user explicitly opted out of. Prefer
    # ~/.hermes/.env over os.environ, as `_seed_from_env` does.
    _env_file = load_env()

    def _env_val(key: str) -> str:
        return (_env_file.get(key) or _get_secret(key, "") or "").strip()

    anthropic_oauth_env = _env_val("ANTHROPIC_TOKEN") or _env_val("CLAUDE_CODE_OAUTH_TOKEN")
    if _env_val("ANTHROPIC_API_KEY") and not anthropic_oauth_env:
        # Prune stale autodiscovered OAuth entries from a previous OAuth
        # session so a transient 401 cannot revive them.
        seed.changed |= _retain_sources_not_in(seed.entries, {"hermes_pkce", "claude_code"})
        return

    from agent.anthropic_credentials import (
        read_claude_code_credentials,
        read_hermes_oauth_credentials,
    )
    from agent.credential_sources import adopt_external_logins_enabled

    sources = [("hermes_pkce", read_hermes_oauth_credentials())]
    if adopt_external_logins_enabled():
        sources.append(("claude_code", read_claude_code_credentials()))
    else:
        # Singleton-seeded rows are otherwise never pruned; the opt-out must also drop the row an
        # earlier (adopting) process persisted, or it keeps rotating a login Hermes no longer reads.
        seed.changed |= _retain_sources_not_in(seed.entries, {"claude_code"})
    for source_name, creds in sources:
        if creds and creds.get("accessToken"):
            seed.upsert(source_name, {
                "auth_type": AUTH_TYPE_OAUTH,
                "access_token": creds.get("accessToken", ""),
                "refresh_token": creds.get("refreshToken"),
                "expires_at_ms": creds.get("expiresAt"),
                "label": label_from_token(creds.get("accessToken", ""), source_name),
            })


def _seed_nous_singleton(seed: _Seeder, auth_store: dict[str, Any]) -> None:
    state, source_path = _load_provider_state_with_source(auth_store, "nous")
    if owned_profile_reads_root_state(auth_store, "nous", source_path):
        # e.g. an agent_key-only row surviving a fork strip/heal
        return
    from kestrel_cli.anon_auth import guest_without_free_tier  # kept for connectors only: no inference rows
    has_runtime_material = not guest_without_free_tier(state) and bool(isinstance(state, dict) and (
        str(state.get("access_token") or "").strip() or str(state.get("agent_key") or "").strip()))
    if state and not has_runtime_material:
        seed.changed |= _retain_sources_not_in(seed.entries, {"device_code", "manual:device_code"})
    if not (state and has_runtime_material):
        return
    # Prefer a user-supplied label embedded in the singleton state (``hermes
    # auth add nous --label <name>``) over the token-derived fingerprint.
    custom_label = str(state.get("label") or "").strip()
    seed.upsert("device_code", {
        "auth_type": AUTH_TYPE_OAUTH,
        "access_token": state.get("access_token", ""),
        "refresh_token": state.get("refresh_token"),
        "expires_at": state.get("expires_at"),
        "token_type": state.get("token_type"),
        "scope": state.get("scope"),
        "client_id": state.get("client_id"),
        "portal_base_url": state.get("portal_base_url"),
        "inference_base_url": state.get("inference_base_url"),
        "agent_key": state.get("agent_key"),
        "agent_key_expires_at": state.get("agent_key_expires_at"),
        # Refresh timestamps let freshness-sensitive consumers (self-heal
        # hooks, pruning by age) tell just-refreshed credentials from stale
        # ones (#15099).
        **{key: state.get(key) for key in _NOUS_EXTRA_STATE_KEYS},
        "tls": state.get("tls") if isinstance(state.get("tls"), dict) else None,
        "label": custom_label or label_from_token(state.get("access_token", ""), "device_code"),
    })


def _seed_profile_singleton(seed: _Seeder) -> None:
    """Rows a provider profile seeds itself (``seed_pool_credentials``): ambient/env tokens it
    validates or exchanges. The profile gates its own work on suppression and explicit config."""
    from providers import get_provider_profile
    profile = get_provider_profile(seed.provider)
    if profile is None or not _profile_seeds_pool(seed.provider):
        return
    from kestrel_cli.auth import is_provider_explicitly_configured, suppressed_credential_sources
    rows = profile.seed_pool_credentials(  # values, not callbacks: a hosted profile gets plain JSON
        suppressed_sources=suppressed_credential_sources(seed.provider),
        explicitly_configured=is_provider_explicitly_configured(seed.provider))
    pconfig = PROVIDER_REGISTRY.get(seed.provider)
    for row in rows or ():
        seed.upsert(row["source"], {
            "auth_type": AUTH_TYPE_API_KEY,
            "access_token": row["access_token"],
            "base_url": row.get("base_url") or (pconfig.inference_base_url if pconfig else ""),
            "label": row.get("label") or row["source"],
        })


def _profile_seeds_pool(provider: str) -> bool:
    """Whether the provider's profile owns pool seeding (the generic env loop must not overwrite it)."""
    from providers import get_provider_profile
    from providers.base import ProviderProfile
    profile = get_provider_profile(provider)
    return profile is not None and type(profile).seed_pool_credentials is not ProviderProfile.seed_pool_credentials


def _seed_qwen_singleton(seed: _Seeder) -> None:
    # Qwen OAuth tokens live in ~/.qwen/oauth_creds.json (written by the Qwen
    # CLI). refresh_if_expiring=False avoids network calls during pool loading.
    try:
        from kestrel_cli.auth import resolve_qwen_runtime_credentials
        creds = resolve_qwen_runtime_credentials(refresh_if_expiring=False)
        token = creds.get("api_key", "")
        if token:
            source_name = creds.get("source", "qwen-cli")
            seed.upsert(source_name, {
                "auth_type": AUTH_TYPE_OAUTH,
                "access_token": token,
                "expires_at_ms": creds.get("expires_at_ms"),
                "base_url": creds.get("base_url", ""),
                "label": creds.get("auth_file", source_name),
            })
    except Exception as exc:
        logger.debug("Qwen OAuth token seed failed: %s", exc)


def _seed_minimax_singleton(seed: _Seeder) -> None:
    # Read the raw auth.json state rather than resolve_minimax_oauth_runtime_credentials,
    # which always refreshes on expiry (surprise network calls during discovery).
    try:
        from kestrel_cli.auth import get_provider_auth_state
        state = get_provider_auth_state("minimax-oauth")
        if not (state and state.get("access_token")):
            return
        expires_at_ms = None
        try:
            raw = state.get("expires_at", "")
            if raw:
                expires_at_ms = int(datetime.fromisoformat(raw).timestamp() * 1000)
        except Exception:
            expires_at_ms = None
        seed.upsert("oauth", {
            "auth_type": AUTH_TYPE_OAUTH,
            "access_token": state["access_token"],
            "refresh_token": state.get("refresh_token"),
            "expires_at_ms": expires_at_ms,
            "base_url": str(state.get("inference_base_url", "") or "").rstrip("/"),
            "label": state.get("label", "") or label_from_token(state.get("access_token", ""), "oauth"),
        })
    except Exception as exc:
        logger.debug("MiniMax OAuth token seed failed: %s", exc)


def _seed_tokens_singleton(seed: _Seeder, auth_store: dict[str, Any]) -> None:
    """Codex / xAI: surface the auth.json ``providers.<id>.tokens`` singleton as ``device_code``.

    Hermes owns its own Codex auth state and does NOT auto-import
    ~/.codex/auth.json: refresh tokens are single-use, so sharing them with
    Codex CLI / VS Code causes refresh_token_reused races. Adoption is an
    explicit one-time prompt via `hermes auth openai-codex`.
    """
    state, source_path = _load_provider_state_with_source(auth_store, seed.provider)
    if owned_profile_reads_root_state(auth_store, seed.provider, source_path):
        return
    tokens = state.get("tokens") if isinstance(state, dict) else None
    if not (isinstance(tokens, dict) and tokens.get("access_token")):
        return
    if seed.provider == "openai-codex":
        base_url = auth_mod.DEFAULT_CODEX_BASE_URL
        custom_label = str(state.get("label") or "").strip()
    else:
        base_url = auth_mod.DEFAULT_XAI_OAUTH_BASE_URL
        custom_label = ""
    seed.upsert("device_code", {
        "auth_type": AUTH_TYPE_OAUTH,
        "access_token": tokens.get("access_token", ""),
        "refresh_token": tokens.get("refresh_token"),
        "base_url": base_url,
        "last_refresh": state.get("last_refresh"),
        "label": custom_label or label_from_token(tokens.get("access_token", ""), "device_code"),
    })


def _seed_from_singletons(provider: str, entries: list[PooledCredential]) -> tuple[bool, set[str]]:
    seed = _Seeder(provider, entries)
    auth_store = _load_auth_store()
    if provider == "anthropic":
        _seed_anthropic_singletons(seed)
    elif provider == "nous":
        _seed_nous_singleton(seed, auth_store)
    elif provider == "qwen-oauth":
        _seed_qwen_singleton(seed)
    elif provider == "minimax-oauth":
        _seed_minimax_singleton(seed)
    elif provider in _TOKENS_SINGLETON_PROVIDERS:
        # `hermes auth remove openai-codex` suppresses device_code; without
        # this gate the removal is undone on the next load_pool().
        if provider == "openai-codex" and seed.is_suppressed(provider, "device_code"):
            return seed.result
        _seed_tokens_singleton(seed, auth_store)
    else:
        _seed_profile_singleton(seed)
    return seed.result


def get_env_prefer_dotenv(key: str) -> str:
    """Resolve a credential env var, preferring ~/.hermes/.env over os.environ.

    The user's config file is authoritative; stale env vars from parent
    processes (Codex CLI, test scripts) must not override deliberate .env
    changes. load_env() memoizes on mtime, so per-call reads cost a stat().
    An unresolved ``op://`` reference in .env yields to the already-resolved
    value from the active secret scope (set by apply_onepassword_secrets());
    otherwise every provider auth attempt would receive a URL instead of a key.
    """
    env_file = load_env()
    raw = env_file.get(key, "").strip()
    scoped_value = (_get_secret(key, "") or "").strip()
    if raw.startswith("op://") and scoped_value:
        return scoped_value
    return raw or scoped_value


# Providers already warned about env-key -> pool ingestion, once per process
# (#81952 expected-behavior #3).
_ENV_INGESTION_WARNED: set[str] = set()


def _warn_env_ingestion_once(provider: str, env_var: str) -> None:
    """WARN once per process per provider when an env credential is ingested into a paid pool.

    Auto-ingesting OPENROUTER_API_KEY is what ARMS silent OpenRouter spend —
    every downstream auto-detect keys off the pool having credentials.
    Ingestion stays allowed (an exported key is arguable intent) but must
    never be silent.
    """
    if provider in _ENV_INGESTION_WARNED:
        return
    _ENV_INGESTION_WARNED.add(provider)
    logger.warning(
        "Ingested %s from environment into the %s credential pool — this "
        "enables %s spend. Remove the key or run "
        "hermes auth remove %s <n> to suppress.",
        env_var,
        provider,
        "OpenRouter" if provider == "openrouter" else provider,
        provider,
    )


def _env_payload(*, env_var: str, token: str, base_url: str) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "auth_type": AUTH_TYPE_API_KEY,
        "access_token": token,
        "base_url": base_url,
        "label": env_var,
    }
    try:
        from kestrel_cli.env_loader import get_secret_source
        source_label = get_secret_source(env_var)
    except Exception:
        source_label = None
    secret_source = str(source_label).strip() if source_label else None
    if secret_source:
        payload["secret_source"] = secret_source
    return payload


# Region-specific endpoints inferred from the key itself.
_ENV_BASE_URL_RESOLVERS = {
    "kimi-coding": _resolve_kimi_base_url,
    "zai": _resolve_zai_base_url,
}


def _env_key_var_candidates(env_vars: list[str], entries: list[PooledCredential]) -> list[str]:
    """*env_vars*, their numbered siblings, and the ``env:VAR`` names already persisted.

    ``VAR_2``, ``VAR_3``, ... are tried for every declared VAR until the first
    one that does not resolve, so a `.env` or secret-manager project can back a
    whole rotation pool with no config: setting ``NVIDIA_API_KEY_2`` is the
    whole opt-in (#76593).

    Env-backed rows are written to auth.json without their secret and
    re-hydrated on every load; a row whose VAR the registry does not
    declare would otherwise stay empty forever and be silently dropped
    from rotation by ``_available_entries``.
    """
    names = list(env_vars)
    for base in env_vars:
        n = 2
        while get_env_prefer_dotenv(f"{base}_{n}"):
            names.append(f"{base}_{n}")
            n += 1
    for entry in entries:
        if entry.source.startswith("env:"):
            env_name = entry.source.split(":", 1)[1].strip()
            if env_name and env_name not in names:
                names.append(env_name)
    return names


def _seed_from_env(provider: str, entries: list[PooledCredential]) -> tuple[bool, set[str]]:
    seed = _Seeder(provider, entries)
    # A profile that seeds its own rows may exchange the raw env token for a runtime one; the
    # generic loop would re-read the same env var and overwrite it with the RAW token.
    if _profile_seeds_pool(provider):
        return seed.result

    if provider == "openrouter":
        for env_var in _env_key_var_candidates(["OPENROUTER_API_KEY"], entries):
            token = get_env_prefer_dotenv(env_var)
            if token and seed.upsert(
                f"env:{env_var}",
                _env_payload(env_var=env_var, token=token, base_url=OPENROUTER_BASE_URL),
            ):
                _warn_env_ingestion_once(provider, env_var)
        return seed.result

    pconfig = PROVIDER_REGISTRY.get(provider)
    if not pconfig or pconfig.auth_type != AUTH_TYPE_API_KEY:
        return seed.result

    env_url = ""
    if pconfig.base_url_env_var:
        env_url = get_env_prefer_dotenv(pconfig.base_url_env_var).rstrip("/")

    env_vars = list(pconfig.api_key_env_vars)
    if provider == "anthropic":
        env_vars = ["ANTHROPIC_TOKEN", "CLAUDE_CODE_OAUTH_TOKEN", "ANTHROPIC_API_KEY"]
    env_vars = _env_key_var_candidates(env_vars, entries)

    resolve_base_url = _ENV_BASE_URL_RESOLVERS.get(provider)
    for env_var in env_vars:
        token = get_env_prefer_dotenv(env_var)
        if not token:
            continue
        base_url = env_url or pconfig.inference_base_url
        if resolve_base_url is not None:
            base_url = resolve_base_url(token, pconfig.inference_base_url, env_url)
        seed.upsert(f"env:{env_var}", _env_payload(env_var=env_var, token=token, base_url=base_url))
    return seed.result


def _prune_stale_seeded_entries(
    entries: list[PooledCredential],
    active_sources: set[str],
    *,
    prune_env_sources: bool = True,
) -> bool:
    def _is_prunable(entry: PooledCredential) -> bool:
        # ``env:*`` entries are persisted references re-hydrated on every load.
        # A process that merely lacks the env var must NOT delete the on-disk
        # entry for every other process (#9331); prune only when explicitly
        # requested (an `hermes auth` command that confirmed the source is gone).
        if entry.source.startswith("env:"):
            return prune_env_sources
        # File-backed singletons and Hermes PKCE disappear when their backing file is gone.
        return is_borrowed_credential_source(entry.source, entry.provider) or entry.source == "hermes_pkce"

    retained = [
        entry
        for entry in entries
        if _is_manual_source(entry.source) or entry.source in active_sources or not _is_prunable(entry)
    ]
    if len(retained) == len(entries):
        return False
    entries[:] = retained
    return True


def _seed_custom_pool(pool_key: str, entries: list[PooledCredential]) -> tuple[bool, set[str]]:
    """Seed a custom endpoint pool from custom_providers config and model config."""
    seed = _Seeder(pool_key, entries)

    cp_config = _get_custom_provider_config(pool_key)
    if cp_config:
        api_key = str(cp_config.get("api_key") or "").strip()
        name = str(cp_config.get("name") or "").strip()
        if api_key:
            seed.upsert(f"config:{name}", {
                "auth_type": AUTH_TYPE_API_KEY,
                "access_token": api_key,
                "base_url": _norm_url(cp_config.get("base_url")),
                "label": name or f"config:{name}",
            })

    # Seed from model.api_key when model.provider=='custom' and model.base_url matches
    try:
        config = _load_config_safe()
        model_cfg = config.get("model") if config else None
        if isinstance(model_cfg, dict):
            model_provider = str(model_cfg.get("provider") or "").strip().lower()
            model_base_url = _norm_url(model_cfg.get("base_url"))
            model_api_key = next(
                (v.strip() for k in ("api_key", "api") for v in (model_cfg.get(k),) if isinstance(v, str) and v.strip()),
                "",
            )
            if model_provider == "custom" and model_base_url and model_api_key:
                # Check if this model's base_url matches our custom provider.
                # The picker writes the selected custom provider's primary key
                # into model.api_key too, so it is often just a mirror of the
                # config:<name> entry already seeded above. Do not turn that
                # mirror into a separate rotation slot: after a 429 it would
                # retry the exact same key before moving to a manual backup.
                matched_key = get_custom_provider_pool_key(model_base_url)
                primary_key = str(cp_config.get("api_key") or "").strip() if cp_config else ""
                if matched_key == pool_key and model_api_key != primary_key:
                    source = "model_config"
                    if not _is_suppressed(pool_key, source):
                        active_sources.add(source)
                        changed |= _upsert_entry(
                            entries,
                            pool_key,
                            source,
                            {
                                "source": source,
                                "auth_type": AUTH_TYPE_API_KEY,
                                "access_token": model_api_key,
                                "base_url": model_base_url,
                                "label": "model_config",
                            },
                        )
    except Exception:
        pass

    return seed.result


def load_pool(provider: str) -> CredentialPool:
    provider = (provider or "").strip().lower()
    if provider in SINGLE_USE_REFRESH_POOL_PROVIDERS:
        # One-time heal for installs that forked this grant across profiles
        # before the clone-strip / root write-through existed (#100339).
        auth_mod.heal_forked_single_use_oauth_grants(provider)
    raw_entries = read_credential_pool(provider)
    disk_ids = {e.get("id") for e in raw_entries if isinstance(e, dict) and e.get("id")}
    # Ownership (auth.json read) after the heal above; re-read at the tail only if _persist() ran.
    owns_provider: Optional[bool] = None
    changed = any(
        isinstance(payload, dict) and sanitize_borrowed_credential_payload(payload, provider) != payload
        for payload in raw_entries
    )
    entries = [PooledCredential.from_dict(provider, payload) for payload in raw_entries]
    raw_needs_auth_normalization = any(
        isinstance(payload, dict)
        and _normalize_pool_auth_type(
            provider, payload.get("access_token"), payload.get("auth_type", AUTH_TYPE_API_KEY),
        ) != payload.get("auth_type", AUTH_TYPE_API_KEY)
        for payload in raw_entries
    )
    if raw_needs_auth_normalization:
        # A profile may be reading this provider from the global-root fallback.
        # Keep that fallback read-only: only the owning store may rewrite these
        # rows; loading the default/root profile heals global rows.
        active_pool = _load_auth_store().get("credential_pool")
        active_entries = active_pool.get(provider) if isinstance(active_pool, dict) else None
        changed |= bool(active_entries)

    if provider.startswith(CUSTOM_POOL_PREFIX):
        custom_changed, custom_sources = _seed_custom_pool(provider, entries)
        changed |= custom_changed
        changed |= _prune_stale_seeded_entries(entries, custom_sources)
    else:
        singleton_changed, singleton_sources = _seed_from_singletons(provider, entries)
        env_changed, env_sources = _seed_from_env(provider, entries)
        changed |= singleton_changed or env_changed
        # ``load_pool()`` is a non-destructive read for env-seeded entries
        # (#9331); file-backed singletons still prune when their file is gone.
        if provider in SINGLE_USE_REFRESH_POOL_PROVIDERS and disk_ids:
            owns_provider = _profile_owns_pool_provider(provider)
        if owns_provider is False:
            # Rows read through the global-root fallback are seeded from the
            # ROOT's singleton files, which this profile cannot see; pruning
            # them would hide (and, via write-through, delete) the shared
            # grant. The root's own load_pool() prunes.
            borrowed = [e for e in entries if e.id in disk_ids]
            others = [e for e in entries if e.id not in disk_ids]
            changed |= _prune_stale_seeded_entries(
                others, singleton_sources | env_sources, prune_env_sources=False,
            )
            entries[:] = borrowed + others
        else:
            changed |= _prune_stale_seeded_entries(
                entries, singleton_sources | env_sources, prune_env_sources=False,
            )
        changed |= _normalize_pool_priorities(provider, entries)

    pool = CredentialPool(provider, entries)
    pool._persisted_token_pairs = auth_mod._token_pairs_by_id(raw_entries)
    if changed:
        pool._persist(removed_ids=sorted(disk_ids - {entry.id for entry in entries}))
    # Remember the root's borrowed rows so a later ``add_entry`` in this
    # profile leaves them out of the profile's own store (#100339).
    # No disk rows -> nothing borrowed; the ``set()`` default already applies.
    if provider in SINGLE_USE_REFRESH_POOL_PROVIDERS and disk_ids:
        # Reuse the pre-persist ownership answer unless _persist() just rewrote
        # the store (it can give the profile its own rows); nothing else between
        # the two checks touches auth.json.
        if changed:
            owns_provider = _profile_owns_pool_provider(provider)
        if not owns_provider:
            pool._borrowed_root_ids = set(disk_ids)
    return pool
