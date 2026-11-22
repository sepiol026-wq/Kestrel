// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { messages } from '../i18n/runtime.js'
import { pick } from '../lib/text.js'

export const placeholders = (): string[] => Object.values(messages().composer.placeholders)

// Picked once per launch by index so the same slot survives a language switch.
const slot = Math.floor(Math.random() * placeholders().length)

export const placeholder = (): string => placeholders()[slot] ?? pick(placeholders())
