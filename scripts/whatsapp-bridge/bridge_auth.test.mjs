// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import test from 'node:test';
import assert from 'node:assert/strict';

import { bridgeAuthProof, createBridgeAuthMiddleware } from './bridge_auth.js';

function invokeMiddleware(middleware, authorization) {
  const req = { headers: {} };
  if (authorization !== undefined) req.headers.authorization = authorization;
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  let nextCalled = false;
  middleware(req, response, () => { nextCalled = true; });
  return { response, nextCalled };
}

test('bridge auth middleware rejects missing and incorrect bearer tokens', () => {
  const middleware = createBridgeAuthMiddleware('correct-secret');

  for (const authorization of [undefined, 'Bearer wrong-secret', 'Basic correct-secret']) {
    const { response, nextCalled } = invokeMiddleware(middleware, authorization);
    assert.equal(nextCalled, false);
    assert.equal(response.statusCode, 401);
    assert.deepEqual(response.body, { error: 'Unauthorized' });
  }
});

test('bridge auth middleware accepts the exact bearer token', () => {
  const middleware = createBridgeAuthMiddleware('correct-secret');
  const { response, nextCalled } = invokeMiddleware(middleware, 'Bearer correct-secret');

  assert.equal(nextCalled, true);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body, null);
});

test('health proof is bound to both the secret and challenge', () => {
  const proof = bridgeAuthProof('correct-secret', 'challenge-a');

  assert.match(proof, /^[0-9a-f]{64}$/);
  assert.notEqual(proof, bridgeAuthProof('correct-secret', 'challenge-b'));
  assert.notEqual(proof, bridgeAuthProof('wrong-secret', 'challenge-a'));
});
