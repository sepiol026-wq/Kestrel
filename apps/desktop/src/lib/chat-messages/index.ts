// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export { sameAttachmentTurn } from './attachment-turn'
export { toChatMessages } from './hydration'
export {
  appendAssistantTextPart,
  appendReasoningPart,
  assistantTextPart,
  chatMessageText,
  collectUnspokenTurnSpeech,
  completeOpenTimelineParts,
  dedupeRepeatedTextInParts,
  finalizeInterruptedMessages,
  lastTextPartText,
  mergeFinalAssistantText,
  normalizeWs,
  partsText,
  reasoningPart,
  reasoningTextFromDetails,
  renderMediaTags,
  textPart
} from './parts'
export type { UnspokenTurnSpeech } from './parts'
export {
  branchGroupForUser,
  isLocalSystemNotice,
  preserveLocalAssistantErrors,
  preserveLocalSystemNotices,
  spliceOlderPreservedRows
} from './reconciliation'
export {
  concatPartsByToolCall,
  hasUnresolvedToolCall,
  isRedeliveredToolEvent,
  markQueuedPromptStarted,
  QUESTION_CARD_TOOLS,
  queuedPromptAwaitsNextTurn,
  restorePendingBlockingToolCall,
  restorePendingClarifyToolCall,
  sealOpenToolParts,
  settlePendingClarifyToolCall,
  stripPendingClarifyProjectionForCache,
  toolCallOwnerMessageId,
  toolEventOwnerMessageId,
  upsertToolPart,
  withUniqueToolCallIdsWithinMessage
} from './tool-parts'
export type { PendingClarifyProjection, SettledClarifyProjection } from './tool-parts'
export type { ChatMessage, ChatMessagePart, GatewayEventPayload, TimelinePartMetadata } from './types'
