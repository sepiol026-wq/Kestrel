// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

import { persistString, storedString } from '@/lib/storage'

const KEY = 'hermes.desktop.chat-text-scale.v1'
const DEFAULT_CHAT_TEXT_SCALE = 110

export const CHAT_TEXT_SCALE_PRESETS = [90, 100, 110, 125, 150, 175] as const
export type ChatTextScale = (typeof CHAT_TEXT_SCALE_PRESETS)[number]

function normalizeChatTextScale(value: unknown): ChatTextScale {
  return CHAT_TEXT_SCALE_PRESETS.find(preset => preset === Number(value)) ?? DEFAULT_CHAT_TEXT_SCALE
}

export const $chatTextScale = atom<ChatTextScale>(normalizeChatTextScale(storedString(KEY)))

export function setChatTextScale(value: number): void {
  $chatTextScale.set(normalizeChatTextScale(value))
}

// Desktop-local presentation, independent of the window zoom and active profile.
if (typeof window !== 'undefined') {
  $chatTextScale.subscribe(value => {
    document.documentElement.style.setProperty('--chat-text-scale', String(value / 100))
    persistString(KEY, value === DEFAULT_CHAT_TEXT_SCALE ? null : String(value))
  })
}
