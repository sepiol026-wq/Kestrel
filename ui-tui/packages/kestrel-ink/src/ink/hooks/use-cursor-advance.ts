// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useContext } from 'react'

import CursorAdvanceContext, { type CursorAdvanceNotifier } from '../components/CursorAdvanceContext.js'

/**
 * Returns a function that notifies Ink the physical terminal cursor was
 * advanced out-of-band (e.g. by a direct stdout.write from the
 * TextInput fast-echo bypass).
 *
 * Calling the returned function updates two pieces of Ink state:
 *
 *   - `displayCursor` — the cached parked-cursor position log-update
 *     uses as the relative-move basis for the next frame. Skipped on
 *     alt-screen, where every frame's CSI H resets the cursor anyway.
 *
 *   - The active `cursorDeclaration` — the target the cursor parks at
 *     after every frame. Bumped on BOTH main- and alt-screen, because
 *     onRender's alt-screen park branch emits an absolute CUP from
 *     this value and a stale declaration there is still visibly wrong.
 *     The next React commit that publishes a fresh declaration
 *     supersedes the bump.
 *
 * The caller is responsible for the stdout write itself; this hook
 * only reports the resulting cursor delta. Pass `dx` and optional
 * `dy` in terminal cells (positive = moved right/down, negative =
 * moved left/up).
 *
 * If the host isn't an Ink render root (test stubs, non-Ink renderer)
 * the returned callback is a safe no-op.
 */
export function useCursorAdvance(): CursorAdvanceNotifier {
  return useContext(CursorAdvanceContext)
}
