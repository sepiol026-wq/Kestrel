# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""CLI subcommand parser builders for ``kestrel <subcommand>``.

Each group owns a ``build_<group>_parser(subparsers, ...)`` in its own module; ``main()``
calls them. ``cmd_*`` handlers are dependency-injected so no module imports ``main``
(cycle avoidance). Shared parser helpers live in ``_shared.py``.
"""

from __future__ import annotations
