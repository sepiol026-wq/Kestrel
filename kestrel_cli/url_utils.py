# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Small helpers for composing URLs from configured network hosts."""


def format_url_host(host: str) -> str:
    """Return *host* in HTTP URL-authority form.

    IPv6 literals require brackets when followed by a port. Already-bracketed
    values are preserved so callers can safely pass either representation.
    """
    host = host.strip()
    if host.startswith("[") and host.endswith("]"):
        inner_host = host[1:-1]
        if ":" in inner_host:
            return f"[{inner_host.replace('%', '%25')}]"
        return host
    if ":" in host:
        return f"[{host.replace('%', '%25')}]"
    return host
