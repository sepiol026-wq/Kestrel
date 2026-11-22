# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Cancellation-safe handoff of a managed subprocess acquired off the owner loop."""
import asyncio
import threading


async def acquire_process(spawn, *args, **kwargs):
    from gateway.session_managed_worker import ManagedWorker
    lock = threading.Lock()
    state = {'cancelled': False, 'process': None}

    def create():
        process = spawn(*args, **kwargs)
        with lock:
            cancelled = state['cancelled']
            if not cancelled:
                state['process'] = process
        if cancelled:
            ManagedWorker(process).close()
        return process

    pending = asyncio.create_task(asyncio.to_thread(create))
    try:
        process = await asyncio.shield(pending)
        with lock:
            state['process'] = None
        return process
    except asyncio.CancelledError:
        with lock:
            state['cancelled'] = True
            process = state['process']
            state['process'] = None
        if process is not None:
            await asyncio.to_thread(ManagedWorker(process).close)
        # If creation still runs, its thread owns cleanup; consume an eventual spawn exception.
        pending.add_done_callback(lambda task: task.exception() if not task.cancelled() else None)
        raise
