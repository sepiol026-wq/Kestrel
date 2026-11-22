// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Whether the empty-chat intro splash renders.
 *
 * The splash is the full-height empty state of the primary chat: it belongs to
 * a fresh draft in the main window and nothing else. Auxiliary and non-primary
 * windows are scratch surfaces, a routed or active session already owns the
 * view, and any transcript at all means the conversation started.
 *
 * `enabled` is the user's Appearance toggle and outranks every other clause:
 * turning the splash off never depends on which window asks.
 */
export function shouldShowIntro(input: {
  activeSessionId: null | string
  auxiliaryWindow: boolean
  enabled: boolean
  freshDraftReady: boolean
  messagesEmpty: boolean
  primary: boolean
  routedSessionView: boolean
  selectedSessionId: null | string
}): boolean {
  return (
    input.enabled &&
    input.primary &&
    !input.auxiliaryWindow &&
    input.freshDraftReady &&
    !input.routedSessionView &&
    !input.selectedSessionId &&
    !input.activeSessionId &&
    input.messagesEmpty
  )
}
