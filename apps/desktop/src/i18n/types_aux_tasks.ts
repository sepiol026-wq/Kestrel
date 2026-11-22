// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Copy for one built-in auxiliary-model slot row (Settings → Models → Auxiliary models). */
export interface AuxTaskCopy {
  label: string
  hint: string
}

/** Built-in slot key → row copy; plugin slots bring their own label/hint from the backend. */
export type AuxTaskCopyMap = Record<string, AuxTaskCopy>
