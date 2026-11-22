// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { isHermesCloudUrl } from './hermes-cloud'

describe('isHermesCloudUrl', () => {
  it('recognises production and staging agent hosts, nothing else', () => {
    expect(isHermesCloudUrl('https://ares-3009.agents.nousresearch.com')).toBe(true)
    expect(isHermesCloudUrl('https://ares--app.agents.staging-nousresearch.com/')).toBe(true)
    expect(isHermesCloudUrl('https://agents.nousresearch.com.evil.example')).toBe(false)
    expect(isHermesCloudUrl('https://my-box.tailnet.ts.net')).toBe(false)
    expect(isHermesCloudUrl('not a url')).toBe(false)
    expect(isHermesCloudUrl(undefined)).toBe(false)
  })
})
