// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, expect, it, vi } from 'vitest'

import {
  $previewStatusBySession,
  clearPreviewArtifacts,
  dismissPreviewArtifact,
  recordPreviewArtifact
} from './preview-status'
import { dropTilesForProfile, migrateTilesForProfile, recordSessionEventScope } from './session-states'

afterEach(() => {
  vi.restoreAllMocks()
  $previewStatusBySession.set({})
  window.localStorage.clear()
})

it('moves local dismissals on rename and removes only the deleted owner', () => {
  for (const [runtime, connectionId] of [
    ['rename-local', 'local'],
    ['rename-remote', 'remote']
  ]) {
    recordSessionEventScope({ session_id: runtime, connectionId, profile: 'before-rename' })
    recordPreviewArtifact(runtime, '/work/rename.html', '/work', 'rename-stored')
    dismissPreviewArtifact(runtime, '/work/rename.html', 'rename-stored')
  }

  migrateTilesForProfile('before-rename', 'after-rename')
  recordSessionEventScope({ session_id: 'rename-new', connectionId: 'local', profile: 'after-rename' })
  recordPreviewArtifact('rename-new', '/work/rename.html', '/work', 'rename-stored')
  recordPreviewArtifact('rename-remote', '/work/rename.html', '/work', 'rename-stored')
  expect($previewStatusBySession.get()['rename-new']).toBeUndefined()
  expect($previewStatusBySession.get()['rename-remote']).toBeUndefined()
  dropTilesForProfile('after-rename')
  recordPreviewArtifact('rename-new', '/work/rename.html', '/work', 'rename-stored')
  recordPreviewArtifact('rename-remote', '/work/rename.html', '/work', 'rename-stored')
  expect($previewStatusBySession.get()['rename-new']).toHaveLength(1)
  expect($previewStatusBySession.get()['rename-remote']).toBeUndefined()
})

it('keeps a close effective in memory when storage writes fail', () => {
  recordSessionEventScope({ session_id: 'quota', connectionId: 'local', profile: 'quota' })
  recordPreviewArtifact('quota', '/work/quota.html', '/work', 'quota-stored')

  const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('quota')
  })

  dismissPreviewArtifact('quota', '/work/quota.html', 'quota-stored')
  clearPreviewArtifacts('quota')
  recordPreviewArtifact('quota', '/work/quota.html', '/work', 'quota-stored')
  expect($previewStatusBySession.get().quota).toBeUndefined()
  write.mockRestore()
})

it('honors a durable close after module reload', async () => {
  recordSessionEventScope({ session_id: 'before-reload', connectionId: 'local', profile: 'persist' })
  recordPreviewArtifact('before-reload', '/work/saved.html', '/work', 'persist-stored')
  dismissPreviewArtifact('before-reload', '/work/saved.html', 'persist-stored')
  vi.resetModules()
  const fresh = await import('./preview-status')
  const { recordSessionEventScope: scope } = await import('./session-states')
  scope({ session_id: 'after-reload', connectionId: 'local', profile: 'persist' })
  fresh.recordPreviewArtifact('after-reload', '/work/saved.html', '/work', 'persist-stored')
  expect(fresh.$previewStatusBySession.get()['after-reload']).toBeUndefined()
})
