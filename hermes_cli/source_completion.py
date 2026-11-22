# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Compatibility shim forwarding hermes_cli/source_completion.py to kestrel_cli/source_completion.py."""
import os
import sys
import runpy

here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
target = os.path.join(root, "kestrel_cli", "source_completion.py")

if __name__ == "__main__":
    sys.argv[0] = target
    runpy.run_path(target, run_name="__main__")
