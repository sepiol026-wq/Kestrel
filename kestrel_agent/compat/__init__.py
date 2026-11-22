# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Old module names keep importing after a module moves."""
from __future__ import annotations

import sys


def install() -> None:
    """Put the non-strict compat finder at the front of ``sys.meta_path``, once per process.

    Stdlib only and idempotent. A finder already installed (the strict one in tests) is kept.
    """
    if any(type(finder).__name__ == "Finder" and (
        type(finder).__module__.startswith("kestrel_agent.compat") or
        type(finder).__module__.startswith("hermes_agent.compat")
    ) for finder in sys.meta_path):
        return
    from kestrel_agent.compat.finder import Finder
    from kestrel_agent.compat.moves import MOVES

    sys.meta_path.insert(0, Finder(MOVES))
