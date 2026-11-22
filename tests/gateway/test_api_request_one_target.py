# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""One API Idempotency-Key names one admission: a second session target never runs it again."""
import pytest
from aiohttp import web
from aiohttp.test_utils import TestClient, TestServer

KEY = 'request-scope-key-long-enough'


@pytest.mark.asyncio
async def test_same_chat_key_on_another_session_is_refused_not_rerun(api, owner):
    calls = []

    async def handle(event):
        from gateway.session_results import execution_result
        calls.append(event.text)
        execution_result.get()['result'] = {'final_response': 'ok', 'messages': []}
        return 'ok'
    owner.runner._handle_message = handle
    api._api_key = KEY
    app = web.Application()
    app.router.add_post('/v1/chat/completions', api._handle_chat_completions)
    body = {'messages': [{'role': 'user', 'content': 'charge the card'}]}
    async with TestClient(TestServer(app)) as client:
        statuses = []
        for sid in ('first-session', 'second-session'):
            response = await client.post('/v1/chat/completions', json=body, headers={
                'Authorization': 'Bearer ' + KEY, 'Idempotency-Key': 'pay-once', 'X-Hermes-Session-Id': sid})
            statuses.append((response.status, (await response.json()).get('error', {}).get('code')))
    assert calls == ['charge the card'], calls
    assert statuses == [(200, None), (409, 'admission_conflict')], statuses
