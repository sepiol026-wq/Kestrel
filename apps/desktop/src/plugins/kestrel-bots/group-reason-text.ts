// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { GroupReasonMessages } from './group-reason-locales'

// The gateway's shared bot failure vocabulary plus group scheduling reasons.
const REASON_LABELS = new Map<string, keyof GroupReasonMessages>([
  ['member_unavailable', 'reasonMemberUnavailable'],
  ['runtime_offline', 'reasonRuntimeOffline'],
  ['queued_expired', 'reasonQueuedExpired'],
  ['delivery_timeout', 'reasonDeliveryTimeout'],
  ['agent_blocked', 'reasonAgentBlocked'],
  ['cancelled', 'reasonCancelled'],
  ['provider_auth_or_access', 'reasonProviderAuth'],
  ['provider_quota_limit', 'reasonProviderQuota'],
  ['provider_rate_limit', 'reasonProviderRate'],
  ['rate_limited', 'reasonProviderRate'],
  ['provider_server_error', 'reasonProviderServer'],
  ['context_overflow', 'reasonContextOverflow'],
  ['missing_config', 'reasonMissingConfig'],
  ['model_unavailable', 'reasonModelUnavailable'],
  ['target_scope_unresolved', 'reasonTargetScope'],
  ['superseded_by_newer_user_event', 'reasonSuperseded'],
  ['turn_deadline_exceeded', 'reasonDeadline'],
  ['prepare_failed', 'reasonPrepareFailed'],
  ['slot_wait_timeout', 'reasonSlotWait'],
  ['target_busy', 'reasonTargetBusy'],
  ['member gateway restarted', 'reasonGatewayRestarted']
])

/** Codes never reach the screen. Unknown codes add no detail; free text survives. */
export function groupReasonText(reason: string | undefined, labels: GroupReasonMessages): string {
  const text = reason?.trim() ?? ''
  const key = REASON_LABELS.get(text)

  if (key) {return labels[key]}

  return /^[a-z][\w.:-]*$/i.test(text) || text === 'member turn cancelled' ? '' : text
}
