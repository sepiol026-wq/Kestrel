# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Resolve the Nous route under the real home, then run worker.py with the key passed by env only."""
import os, subprocess, sys
from kestrel_cli.runtime_provider import resolve_runtime_provider
arm, out, rep, tree = sys.argv[1:5]
rt = resolve_runtime_provider(requested="nous")
env = dict(os.environ, RL_TREE=tree, RL_URL=rt["base_url"], RL_KEY=rt["api_key"])
env.pop("PYTHONPATH", None)
worker = os.path.join(os.path.dirname(__file__), "worker.py")
sys.exit(subprocess.run([sys.executable, worker, arm, out, rep], env=env, check=False, timeout=600).returncode)
