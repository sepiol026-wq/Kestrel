// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { $composerPopout, $composerPopoutGesturesEnabled } from '@/store/composer-popout'

import { useComposerPopout } from './use-composer-popout'

vi.mock('@/components/pane-shell/pane-visibility', () => ({
  usePaneGroup: () => 'test-zone',
  usePaneVisible: () => true
}))

vi.mock('@/hooks/use-resize-observer', () => ({ useResizeObserver: () => undefined }))
vi.mock('@/store/windows', async importOriginal => ({
  ...(await importOriginal<Record<string, unknown>>()),
  isSecondaryWindow: () => false
}))

function PopoutAffordanceHarness() {
  const composerRef = useRef<HTMLFormElement>(null)
  const { popoutAllowed } = useComposerPopout({ composerRef })

  return (
    <form ref={composerRef}>{popoutAllowed && <div data-slot="composer-drag-region" data-testid="drag-region" />}</form>
  )
}

describe('useComposerPopout', () => {
  beforeEach(() => {
    $composerPopout.set({ poppedOut: false, position: { bottom: 24, right: 24 } })
    $composerPopoutGesturesEnabled.set(true)
  })

  afterEach(() => {
    cleanup()
    $composerPopout.set({ poppedOut: false, position: { bottom: 24, right: 24 } })
    $composerPopoutGesturesEnabled.set(true)
  })

  it('removes the pop-out affordance when gestures are disabled', () => {
    $composerPopoutGesturesEnabled.set(false)

    render(<PopoutAffordanceHarness />)

    expect(screen.queryByTestId('drag-region')).toBeNull()
  })
})
