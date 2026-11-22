// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { beforeEach, describe, expect, it, vi } from 'vitest'

// Right-click a tab -> Reload remounts THAT pane's content: its epoch (the
// React key the zone renderer hands the contribution) advances, and no other
// pane's does. The layout tree itself must never move.

describe('reloadTreePane', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.resetModules()
  })

  it('advances only the reloaded pane epoch and leaves the tree alone', async () => {
    const tree = await import('@/components/pane-shell/tree/store')
    const model = await import('@/components/pane-shell/tree/model')

    tree.declareDefaultTree(model.group(['workspace', 'files'], { active: 'workspace', id: 'grp-main' }))

    const before = tree.$layoutTree.get()

    tree.reloadTreePane('workspace')
    tree.reloadTreePane('workspace')

    expect(tree.$treePaneEpochs.get().workspace).toBe(2)
    expect(tree.$treePaneEpochs.get().files).toBeUndefined()
    expect(tree.$layoutTree.get()).toBe(before)
  })
})
