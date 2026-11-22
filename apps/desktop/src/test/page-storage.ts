// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * The object that holds `window.localStorage`'s methods, for spying on the page's storage reads
 * and writes. On Node 22 that is jsdom's `Storage.prototype`: a spy defined on the instance is kept
 * as a stored item and never intercepts a call. From Node 25 the test setup installs a plain
 * in-memory storage (see vitest.setup.ts) whose methods are its own and whose prototype has none.
 */
export function pageStorage(): Storage {
  const storage = window.localStorage

  return Object.prototype.hasOwnProperty.call(storage, 'setItem')
    ? storage
    : (Object.getPrototypeOf(storage) as Storage)
}
