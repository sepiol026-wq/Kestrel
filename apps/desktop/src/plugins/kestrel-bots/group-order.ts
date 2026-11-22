// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

interface OrderRow {
  activity: number
  /** A gateway room: never reads a Desktop room record, which is keyed by name. */
  gateway?: unknown
  kind: 'bot' | 'group'
  name?: string
  pinned: boolean
}

const savedOrder = (row: OrderRow, rooms: Record<string, { rosterOrder?: number }>) =>
  (row.gateway ? undefined : rooms[row.name!]?.rosterOrder) ?? Infinity

/** Reorder room slots, not bots or folders. Pinning remains the outer band. */
export function sortGroupRosterRows<T extends OrderRow>(
  rows: T[],
  rooms: Record<string, { rosterOrder?: number }>
): T[] {
  const legacy = rows.slice().sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.activity - a.activity)

  const groups = legacy
    .filter(row => row.kind === 'group')
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        savedOrder(a, rooms) - savedOrder(b, rooms)
    )

  let index = 0

  return legacy.map(row => (row.kind === 'group' ? groups[index++] : row))
}

/** Swap visible neighbours without dropping filtered-out rooms from the order. */
export function reorderGroupRows(rows: OrderRow[], name: string, delta: -1 | 1, visible?: string[]): string[] | null {
  const row = rows.find(row => row.name === name)

  const band = rows.filter(
    candidate =>
      candidate.kind === 'group' && candidate.pinned === row?.pinned && (!visible || visible.includes(candidate.name!))
  )

  const index = band.findIndex(candidate => candidate.name === name)
  const neighbour = index >= 0 ? band[index + delta] : undefined

  if (!neighbour) {
    return null
  }

  return rows
    .filter(row => row.kind === 'group')
    .map(row => (row.name === name ? neighbour.name! : row.name === neighbour.name ? name : row.name!))
}
