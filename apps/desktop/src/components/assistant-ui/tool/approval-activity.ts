// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { ToolCallLike } from './run-summary'

/** These calls render as activity, not file diffs or other deliverable cards. */
export const isApprovalActivity = (tool: ToolCallLike): boolean =>
  tool.toolName === 'terminal' || tool.toolName === 'execute_code'

export function isCurrentTurnMessage(messages: readonly { id: string; role: string }[], messageId: string): boolean {
  for (let index = messages.length - 1; index >= 0; index--) {
    const message = messages[index]

    if (message.id === messageId) {
      return message.role === 'assistant'
    }

    if (message.role === 'user') {
      return false
    }
  }

  return false
}
