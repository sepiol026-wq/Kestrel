# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Private loopback worker persistence does not use ambient HTTP proxies."""
import json
import queue
from types import SimpleNamespace

from websockets.exceptions import ConnectionClosed


def test_worker_persistence_explicitly_bypasses_proxy(tmp_path, monkeypatch):
    from agent.runtime_session_store import WorkerRPC
    monkeypatch.setenv('HTTPS_PROXY', 'http://127.0.0.1:1')
    monkeypatch.delenv('NO_PROXY', raising=False)
    endpoint = SimpleNamespace(api_origin='http://127.0.0.1:1234')
    discoveries = iter([SimpleNamespace(state='ready', endpoint=endpoint),
                        SimpleNamespace(state='draining', endpoint=None)])
    monkeypatch.setattr('hermes_cli.gateway_runtime.discover_gateway_endpoint',
                        lambda *a, **k: next(discoveries))
    monkeypatch.setattr('hermes_cli.gateway_runtime.control_home_for', lambda home, endpoint: home)
    monkeypatch.setattr('hermes_cli.gateway_runtime_discovery.query_identify', lambda *a, **k: {'pid': -1})
    monkeypatch.setattr('hermes_cli.gateway_client._session_ticket', lambda *a, **k: 'ticket')
    calls = []
    def connect(url, **kwargs):
        calls.append(kwargs)
        frames = queue.SimpleQueue()
        def recv():
            frame = frames.get()
            if frame is None:
                raise ConnectionClosed(None, None)
            return frame
        def send(value):
            frames.put(json.dumps({'id': json.loads(value)['id'], 'result': {'ok': True}}))
            frames.put(None)  # then the owner drops the idle connection: the next call redials (draining)
        return SimpleNamespace(send=send, recv=recv, close=lambda: frames.put(None))
    monkeypatch.setattr('websockets.sync.client.connect', connect)
    rpc = WorkerRPC(tmp_path)
    assert rpc('worker.persist') == {'ok': True}
    rpc.link.reader.join(5)
    assert rpc('worker.persist') == {'ok': True}
    assert len(calls) == 2 and all(call['proxy'] is None for call in calls)
