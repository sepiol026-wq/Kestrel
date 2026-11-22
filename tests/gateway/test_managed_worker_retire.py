# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A managed worker's turn-final memory work drains before the provider shuts down."""


def test_retire_agent_flushes_pending_memory_before_shutdown():
    from agent.managed_worker import retire_agent

    calls = []

    class Manager:
        def flush_pending(self, timeout=None):
            calls.append(('flush', timeout))
            return True

    class Agent:
        _memory_manager = Manager()
        _session_messages = [{'role': 'user', 'content': 'hi'}]

        def shutdown_memory_provider(self, messages):
            calls.append(('shutdown', len(messages)))

        def release_clients(self):
            calls.append(('release',))

    retire_agent(Agent())
    assert calls == [('flush', 10), ('shutdown', 1), ('release',)]
