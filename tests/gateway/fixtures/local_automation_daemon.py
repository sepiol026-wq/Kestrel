# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Crash barrier after real automation commit, before producer ACK/first claim."""
import os
import runpy
import signal

from gateway.session_authority import SessionAuthority
from kestrel_state_runtime import list_session_admissions

original = SessionAuthority._schedule


def schedule(self, ref):
    original(self, ref)
    rows = list_session_admissions(self.db, session_id=ref.session_id)
    if any(r['principal_id'].startswith('automation:') for r in rows):
        os.kill(os.getpid(), signal.SIGSTOP)


SessionAuthority._schedule = schedule
runpy.run_module('gateway.run', run_name='__main__')
