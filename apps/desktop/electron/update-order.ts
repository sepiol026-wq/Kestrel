// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * A local update hands control to a detached updater that waits for the
 * Desktop window to exit, so every remote update transaction must settle
 * first — otherwise a managed SSH update can outlive the local updater's
 * exit deadline and abort the whole update.
 */
export async function updateConnectionsBeforeLocal<T extends { kind: string }, R>(
  connections: T[],
  update: (connection: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(connections.length)
  const indexed = connections.map((connection, index) => ({ connection, index }))

  const run = async ({ connection, index }: (typeof indexed)[number]) => {
    results[index] = await update(connection)
  }

  await Promise.all(indexed.filter(({ connection }) => connection.kind !== 'local').map(run))
  await Promise.all(indexed.filter(({ connection }) => connection.kind === 'local').map(run))

  return results
}
