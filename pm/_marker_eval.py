# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Evaluate one PEP 508 marker inside PM's runtime: `_marker_eval.py MARKER ENV_JSON`.

Prints "1" or "0". Callers whose interpreter has no `packaging` (a historical
takeover running under an old venv) delegate here; the PM runtime owns it.
"""

import json
import sys

from packaging.markers import Marker

if __name__ == "__main__":
    print("1" if Marker(sys.argv[1]).evaluate(environment=json.loads(sys.argv[2])) else "0")
