# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Independent durable writer used only by the loopback ownership probe."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(sys.argv[1]).resolve()))
from kestrel_state import SessionDB

db = SessionDB(db_path=Path(sys.argv[2]))
db.append_message(
    sys.argv[3], "user", "foreign independent input", observed=False,
    display_metadata={"gateway_input_owner": "independent-process-owner"},
)
db.close()
