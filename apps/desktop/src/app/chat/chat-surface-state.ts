// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useRef } from 'react'

import { isWatchWindow } from '@/store/windows'

import type { DragKind } from './hooks/use-file-drop-zone'
import { composerStaysMounted } from './thread-loading'

interface ShowChatBarOptions {
  loadingSession: boolean
  resumeExhausted: boolean
  routedSessionId: null | string
  routedSessionView: boolean
}

// Hide the composer in the exhausted error state too: there's no live runtime
// to send to until a retry rebinds one. Watch windows are pure spectators of a
// subagent run driven elsewhere — no composer, transcript is read-only.
//
// Once this route has rendered with its composer, a later transient loader
// (periodic list/status refresh, hydrate through an empty frame) must not
// unmount it again — see composerStaysMounted (#117375).
export function useShowChatBar({
  loadingSession,
  resumeExhausted,
  routedSessionId,
  routedSessionView
}: ShowChatBarOptions): boolean {
  const settledRoutedSessionRef = useRef<null | string>(null)

  if (!loadingSession && routedSessionView) {
    settledRoutedSessionRef.current = routedSessionId
  } else if (!routedSessionView) {
    settledRoutedSessionRef.current = null
  }

  return composerStaysMounted({
    hideComposer: resumeExhausted || isWatchWindow(),
    loadingSession,
    routedSessionId,
    settledRoutedSessionId: settledRoutedSessionRef.current
  })
}

// While a session drag targets one of the surface's EDGES or a tab strip, the
// zone overlay/caret owns the visual — the link overlay stands down.
export function dropOverlayKind(dragKind: DragKind, sessionDragging: boolean, sessionEdgeHover: boolean): DragKind {
  return dragKind === 'files' ? 'files' : sessionDragging && !sessionEdgeHover ? 'session' : null
}
