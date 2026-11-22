// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { messages } from '../i18n/runtime.js'

/** Kaomoji spinner frames, in catalog order, resolved against the active language at call time. */
export const faces = (): string[] => Object.values(messages().content.faces)
