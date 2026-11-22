# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Hold only execution scheduling after a real API commit and HTTP ACK."""
import runpy
from gateway.session_authority import SessionAuthority
from kestrel_state_runtime import list_session_admissions

schedule = SessionAuthority._schedule


def hold_safe(self, ref):
    pending = list_session_admissions(self.db, session_id=ref.session_id)
    if any(row['payload'].get('text') == 'SAFE_QUEUE' for row in pending):
        return
    return schedule(self, ref)


SessionAuthority._schedule = hold_safe
runpy.run_module('gateway.run', run_name='__main__')
