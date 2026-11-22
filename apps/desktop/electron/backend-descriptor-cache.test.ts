// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from 'vitest'

import { assertDescriptorStillOwned, forgetFailedDescriptor } from './backend-descriptor-cache'

// The descriptor cache never owns a process: an entry is a promise for a
// gateway descriptor. Two invariants keep concurrent dials and profile
// mutations honest around the `gateway ensure` await.

describe('backend descriptor cache ownership', () => {
  it('a late dial failure forgets only its own entry, never a newer descriptor installed under the same key', () => {
    const cache = new Map<string, { connectionPromise: Promise<unknown> | null }>()
    const stale = { connectionPromise: Promise.reject(new Error('first dial died')) }
    const fresh = { connectionPromise: Promise.resolve({ baseUrl: 'http://127.0.0.1:1' }) }

    stale.connectionPromise.catch(() => undefined)
    cache.set('research', stale)
    // A retire + re-dial raced ahead of the stale rejection.
    cache.set('research', fresh)

    forgetFailedDescriptor(cache, 'research', stale)

    expect(cache.get('research')).toBe(fresh)

    forgetFailedDescriptor(cache, 'research', fresh)

    expect(cache.has('research')).toBe(false)
  })

  it('a dial whose entry was forgotten mid-flight (profile delete, retirement) refuses to hand back a descriptor', () => {
    const cache = new Map<string, { connectionPromise: Promise<unknown> | null }>()
    const entry = { connectionPromise: null }

    cache.set('research', entry)
    expect(() => assertDescriptorStillOwned(cache, 'research', entry)).not.toThrow()

    // Profile delete lands while `gateway ensure` is still running.
    cache.delete('research')

    expect(() => assertDescriptorStillOwned(cache, 'research', entry)).toThrow(/cancelled/)

    // A replacement installed by a newer caller is not ours either.
    cache.set('research', { connectionPromise: null })

    expect(() => assertDescriptorStillOwned(cache, 'research', entry)).toThrow(/cancelled/)
  })
})
