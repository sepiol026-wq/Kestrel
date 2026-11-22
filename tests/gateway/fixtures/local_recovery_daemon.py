# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Test-only committed-before-schedule crash barrier around the ordinary daemon."""
import os
import runpy
import signal

from gateway.session_authority import SessionAuthority
from kestrel_state_runtime import list_session_admissions

schedule = SessionAuthority._schedule


def crash_barrier(self, ref):
    pending = list_session_admissions(self.db, session_id=ref.session_id)
    text = pending[-1]['payload'].get('text') if pending else None
    if text in {'TAMPERED_QUEUE', 'MISSING_QUEUE', 'CORRUPT_QUEUE'}:
        return
    if text == 'RECOVER_QUEUED':
        os.kill(os.getpid(), signal.SIGSTOP)
    return schedule(self, ref)


SessionAuthority._schedule = crash_barrier
# submit's ordinary path must use the same production scheduler for this barrier.
runpy.run_module('gateway.run', run_name='__main__')
