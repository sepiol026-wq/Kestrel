# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""CLI entry after the isolated interpreter has been selected."""
from pathlib import Path
import sys

import truststore

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

def main() -> int:
    # PM's import closure constructs HTTPS clients; install platform trust
    # before importing it, but never mutate SSL merely by importing launch.
    truststore.inject_into_ssl()
    from pm.cli import main as cli_main
    from pm.runtime import lease_current_runtime

    lease_current_runtime()
    return cli_main()

if __name__ == "__main__":
    raise SystemExit(main())
