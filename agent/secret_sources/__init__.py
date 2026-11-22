# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""External secret source integrations.

A secret source supplies env-var-shaped credentials at process startup, after
~/.hermes/.env has loaded. Contract: :class:`base.SecretSource`; orchestrator
(ordering, mapped-beats-bulk, first-claim-wins, provenance): :func:`registry.apply_all`.
Bundled: ``bitwarden``, ``onepassword``, ``command``. The set is deliberately
closed — third-party managers ship as plugins that subclass ``SecretSource`` and
register through ``PluginContext.register_secret_source()``.
"""

from agent.secret_sources.base import (
    SECRET_SOURCE_API_VERSION,
    ErrorKind,
    FetchResult,
    SecretSource,
    is_valid_env_name,
    run_secret_cli,
    scrub_ansi,
)
