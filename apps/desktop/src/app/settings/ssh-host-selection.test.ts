// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { enrichSelectedSshHost, selectSshHost } from './ssh-host-selection'

const state = {
  mode: 'ssh',
  sshHost: 'linux-box',
  sshUser: 'operator',
  sshPort: 2222,
  sshKeyPath: '/keys/linux',
  sshRemoteHermesPath: '/opt/hermes'
}

describe('selectSshHost', () => {
  it('clears host-specific fields when the selected host changes', () => {
    expect(selectSshHost(state, 'mac-box')).toEqual({
      mode: 'ssh',
      sshHost: 'mac-box',
      sshUser: '',
      sshPort: null,
      sshKeyPath: '',
      sshRemoteHermesPath: ''
    })
  })

  it('preserves state when reselecting the same host', () => {
    expect(selectSshHost(state, state.sshHost)).toBe(state)
  })

  it('enriches only the host that produced the ssh config result', () => {
    const selected = selectSshHost(state, 'mac-box')
    expect(
      enrichSelectedSshHost(selected, 'mac-box', {
        identityFile: '~/.ssh/id_ed25519',
        port: 22,
        user: 'hermes'
      })
    ).toMatchObject({
      sshHost: 'mac-box',
      sshUser: 'hermes',
      sshPort: null,
      sshKeyPath: '~/.ssh/id_ed25519'
    })
    expect(enrichSelectedSshHost(state, 'mac-box', { user: 'wrong' })).toBe(state)
  })
})
