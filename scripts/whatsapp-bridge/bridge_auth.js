// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createHmac, timingSafeEqual } from 'node:crypto';

function constantTimeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ''), 'utf8');
  const rightBuffer = Buffer.from(String(right || ''), 'utf8');
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function bridgeAuthProof(token, challenge) {
  return createHmac('sha256', String(token)).update(String(challenge)).digest('hex');
}

export function createBridgeAuthMiddleware(token) {
  const expected = `Bearer ${token}`;
  return (req, res, next) => {
    if (!token || !constantTimeEqual(req.headers.authorization, expected)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
}
