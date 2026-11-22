// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Shared drag-and-drop visual language — ONE dashed accent sheet, used by every
 * drop affordance (the composer file/session overlay, the layout zone targets)
 * so "you can drop here" reads identically everywhere.
 */

/** The sheet: a dashed region marking where a drop would land. */
export const DROP_SHEET_CLASS = 'rounded-2xl border-2 border-dashed'

/** Soft blur for the LIVE sheet only — idle outlines must not fog the app. */
export const DROP_SHEET_BLUR_CLASS = 'backdrop-blur-[2px] [-webkit-backdrop-filter:blur(2px)]'
