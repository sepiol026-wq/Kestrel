# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Run an installed PM CLI with driver-side launch capture under its own -I interpreter.

The published launcher exposes its installation-bound command. Inject only the
capture module ahead of that command's bootstrap; keep its selected interpreter,
isolated flag, bootstrap, and argv instead of constructing a new product launch.
"""

import json
import os
from pathlib import Path
import subprocess
import sys


def main() -> int:
    launcher = sys.argv[1]
    spec = sys.argv[2]
    query = subprocess.run(
        [launcher, "--print-runtime-command", "--", "desktop"],
        check=True, capture_output=True, text=True,
    )
    command = json.loads(query.stdout)
    if (not isinstance(command, list) or len(command) != 5
            or command[1:3] != ["-I", "-c"] or command[4] != "desktop"
            or not all(isinstance(part, str) for part in command)):
        raise ValueError("installed PM launcher did not provide an isolated desktop command")
    capture = Path(__file__).with_name("sitecustomize.py")
    command[3] = f"import runpy; runpy.run_path({str(capture)!r}); " + command[3]
    env = os.environ.copy()
    env["HERMES_E2E_CAPTURE_LAUNCH"] = spec
    return subprocess.run(command, env=env, check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main())
