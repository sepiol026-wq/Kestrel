// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

/** Transient visible overlay pane ids (including aliases and zone mates).
 * Docked/persisted open flags do not describe the narrow overlay. */
export const $narrowOverlayPaneIds = atom<ReadonlySet<string>>(new Set())
