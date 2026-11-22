// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useValue } from '@hermes/plugin-sdk'

import { avatarColor, botAppearance, BotFace } from './avatar'
import { isBackfilledFacePng } from './avatar-image'
import { $botMeta } from './data'

/** A bot's face from its Bot Mode appearance (custom image/pet, else its shape + color). */
export function RoomBotAvatar({ name, size = 24 }: { name: string; size?: number }) {
  const meta = useValue($botMeta) as Record<string, Parameters<typeof botAppearance>[1]>
  const appearance = botAppearance(name, meta?.[name])
  const photo = appearance.image && !isBackfilledFacePng(appearance.image) ? appearance.image : null

  return <BotFace color={avatarColor(appearance.color, name)} image={photo} name={name} shape={appearance.shape} size={size} />
}
