# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Stop the actual owner after the result commit, before any publication."""
import os
import runpy
import signal
from gateway import session_results

finish = session_results.finish_result


def stop_after_commit(db, *, row, **kwargs):
    receipt = finish(db, row=row, **kwargs)
    if row['payload'].get('text') == 'BLOCK_STARTED':
        os.kill(os.getpid(), signal.SIGSTOP)
    return receipt


session_results.finish_result = stop_after_commit
runpy.run_module('gateway.run', run_name='__main__')
