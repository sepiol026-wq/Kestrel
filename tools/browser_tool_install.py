# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Frozen old-updater compatibility stub (tests/compat/old_updater_surface.json, ``bare`` list).

The extraction-era home of ``warm_agent_browser_npx_cache``: a pre-PM ``hermes update`` still running
mid-swap may import it from the NEW tree. agent-browser is gone; nothing else belongs here.
"""


def warm_agent_browser_npx_cache(timeout: float = 60.0) -> bool:
    """Frozen old-updater surface: nothing is warmed (there is no agent-browser to warm); always False."""
    return False
