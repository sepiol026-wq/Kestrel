// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { $groupChats, updateGroupChat } from './group-chat'

/** Flip a group chat's "Pin to top" flag (kestrel-agent#89813). The roster
 *  sort already treats `room.pinned` as the outer band for group rows, the
 *  same way `bot-meta.pinned` leads bot rows; this is the write site that flag
 *  never had. Presentation only: the room record is the group's sole durable
 *  identity, so the pin rides the local group-chats persistence like
 *  `rosterOrder` and stays out of the gateway conversation mirror.
 *  Returns the new pinned state, or null when the room is gone. */
export function toggleGroupChatPinned(name: string): boolean | null {
  const room = $groupChats.get()[name]

  if (!room || room.tombstone) {
    return null
  }

  const pinned = !room.pinned
  updateGroupChat(name, current => ({ ...current, pinned }), { sync: false })

  return pinned
}
