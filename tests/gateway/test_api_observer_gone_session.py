# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""An exact streaming Chat retry after its session was deleted replays the receipt, not a 500."""
import json

import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer


@pytest.mark.asyncio
async def test_streaming_retry_after_delete_replays_terminal_receipt(api, owner):
    calls = []

    async def handle(event):
        from gateway.session_results import execution_result
        calls.append(event.text)
        execution_result.get()['result'] = {'final_response': 'answer', 'messages': []}
        return 'answer'
    owner.runner._handle_message = handle
    app = web.Application()
    app.router.add_post('/v1/chat/completions', api._handle_chat_completions)
    body = {'messages': [{'role': 'user', 'content': 'work'}], 'stream': True}
    headers = {'Idempotency-Key': 'deleted-stream'}
    async with TestClient(TestServer(app)) as client:
        first = await client.post('/v1/chat/completions', json=body, headers=headers)
        assert first.status == 200, await first.text()
        assert 'answer' in await first.text()
        sid = first.headers['X-Hermes-Session-Id']
        assert owner.db.delete_session(sid)
        owner.sessions.pop(sid, None)  # the owner's prune drops the live session with the row
        retry = await client.post('/v1/chat/completions', json=body, headers=headers)
        text = await retry.text()
    assert retry.status == 200, text
    chunks = [json.loads(line[6:]) for line in text.splitlines() if line.startswith('data: {')]
    assert 'answer' in ''.join(c['choices'][0]['delta'].get('content') or '' for c in chunks if c.get('choices'))
    assert calls == ['work']
