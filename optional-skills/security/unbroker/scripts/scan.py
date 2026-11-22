# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Stdlib fetch helper for simple url_pattern brokers (osint-style).

For JS-rendered or anti-bot pages the agent should use the `web_extract` or
`browser_exec` tools (and the `scrapling` skill for stealth/Cloudflare).
This helper only covers plain static pages and is intentionally network-light so
it can be mocked in tests.
"""
from __future__ import annotations

import urllib.error
import urllib.request

USER_AGENT = "Mozilla/5.0 (compatible; unbroker/1.0; data opt-out)"


def fetch(url: str, timeout: int = 20) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            charset = resp.headers.get_content_charset() or "utf-8"
            return getattr(resp, "status", 200), resp.read().decode(charset, errors="replace")
    except urllib.error.HTTPError as exc:
        return exc.code, ""
    except (urllib.error.URLError, TimeoutError, ValueError):
        return 0, ""


def looks_listed(html: str, match_signal: str | None) -> bool:
    """Naive confirmation heuristic for static pages: does the match signal appear?"""
    if not html or not match_signal:
        return False
    return match_signal.lower() in html.lower()
