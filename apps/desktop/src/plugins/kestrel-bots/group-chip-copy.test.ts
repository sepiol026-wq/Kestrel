// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { expect, it, vi } from 'vitest'

vi.mock('@hermes/plugin-sdk', async () => (await import('./group-test-utils')).pluginSdkMock({}))

import { CANONICAL_GROUP_LOCALES } from './canonical-group-locales'
import { memberStatusText } from './group-room-ui'

it.each(Object.entries(CANONICAL_GROUP_LOCALES))('shows a single stalled timer and consistent queued case in %s', (_locale, labels) => {
  for (const elapsedS of [137, 600]) {
    expect(memberStatusText({ kind: 'stalled', quietS: 137, elapsedS, tool: 'terminal' }, labels)).toBe(`${labels.statusStalled.replace('{time}', '2m17s')} · terminal`)
  }

  expect(memberStatusText({ kind: 'working', elapsedS: 137, tool: 'terminal' }, labels)).toBe('terminal · 2m17s')
  expect(labels.memberQueued[0]).toBe(labels.memberQueued[0].toLocaleLowerCase())
})
