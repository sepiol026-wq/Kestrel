# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Shipped updaters import ``hermes_cli.local_runtime.processes`` from the new tree mid-update.

v2026.9.24's ``_subprocess_compat.bounded_probe_run`` lazily imports
``spawn_server`` after the pull, inside a process that still holds the old
``hermes_platform`` and other first-party modules. Importing that one
submodule must not run the rest of the package, or any name added to an
already-loaded module since the release crashes ``kestrel update``.
"""

import subprocess
import sys

_PROBE = (
    "import sys\n"
    "import kestrel_cli.local_runtime.processes\n"
    "loaded = sorted(m for m in sys.modules if m.startswith(('hermes_platform', 'hermes_cli.local_runtime.')))\n"
    "print('\\n'.join(loaded))\n"
)


def test_processes_import_runs_no_other_local_runtime_module():
    out = subprocess.run([sys.executable, "-c", _PROBE], capture_output=True, text=True, check=True).stdout
    assert out.split() == ["hermes_cli.local_runtime.processes"]


def test_package_exports_still_resolve():
    from kestrel_cli import local_runtime
    from kestrel_cli.local_runtime.hardware import probe_budget

    assert local_runtime.probe_budget is probe_budget
