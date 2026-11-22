// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

interface SessionPruneResult {
  removed: number
  skipped_open: number
}

export function formatSessionPruneResult(result: SessionPruneResult): string {
  const removed = `Pruned ${result.removed} session${result.removed === 1 ? '' : 's'}`
  if (!result.skipped_open) return removed

  return `${removed}. Skipped ${result.skipped_open} open session${result.skipped_open === 1 ? '' : 's'}; prune only removes ended sessions.`
}
