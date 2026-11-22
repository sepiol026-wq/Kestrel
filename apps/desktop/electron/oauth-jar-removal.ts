// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Clear a removed gateway's sign-in cookies (#98242). oauthJarsToClearOnRemoval
 * decides which jars; this runs it against Electron sessions. Kept free of
 * `electron` imports: main.ts injects the session lookup and the in-memory mirror.
 */
import { type ConnectionRegistry, removeConnection } from './connection-registry'
import { oauthJarsToClearOnRemoval, type OauthJarToClear } from './oauth-partition'

interface CookieLike {
  domain?: string
  name: string
  path?: string
  secure?: boolean
}

export interface CookieSessionLike {
  cookies: {
    get(filter: Record<string, unknown>): Promise<CookieLike[]>
    remove(url: string, name: string): Promise<void>
  }
}

export interface OauthJarRemovalDeps {
  /** The session for a partition, or null before app ready. */
  sessionFor: (partition: string) => CookieSessionLike | null
  /** Drop the explicit-Cookie-header mirror: a whole partition, or one origin in it. */
  clearMirror: (partition: string, url?: string) => void
}

const bareDomain = (cookie: CookieLike) =>
  String(cookie.domain || '')
    .replace(/^\./, '')
    .toLowerCase()

async function clearJar(jar: OauthJarToClear, deps: OauthJarRemovalDeps): Promise<void> {
  deps.clearMirror(jar.partition, jar.scope === 'host' ? jar.url : undefined)
  const sess = deps.sessionFor(jar.partition)

  if (!sess) {
    return
  }

  const host = new URL(jar.url).hostname.toLowerCase()
  const cookies = await sess.cookies.get({})
  // The shared jar keeps every other site's cookies, a parent-domain one included.
  const doomed = jar.scope === 'all' ? cookies : cookies.filter(c => bareDomain(c) === host)

  await Promise.all(
    doomed.map(c =>
      sess.cookies
        .remove(`${c.secure ? 'https' : 'http'}://${bareDomain(c)}${c.path || '/'}`, c.name)
        .catch(() => undefined)
    )
  )
}

export async function clearRemovedConnectionCookies(jars: OauthJarToClear[], deps: OauthJarRemovalDeps): Promise<void> {
  for (const jar of jars) {
    try {
      await clearJar(jar, deps)
    } catch {
      // Best effort: a stale cookie self-expires, and the removal itself must land.
    }
  }
}

interface RemovedConnectionCookieCleanerDeps extends OauthJarRemovalDeps {
  v1RemoteUrl: () => unknown
  /** URLs outside the list that may keep cookies in the legacy jar (the Portal, connection.json's route). */
  sharedUrls: () => unknown[]
}

/** connection.json's routes that dial a URL: the app-global one and every per-profile override. */
export function connectionConfigUrls(
  config: { remote?: { url?: unknown }; profiles?: Record<string, { url?: unknown } | null> } | null | undefined
) {
  return [config?.remote?.url, ...Object.values(config?.profiles ?? {}).map(block => block?.url)]
}

/**
 * Removal's cookie cleanup, for Desktop's own removal and for one the watcher saw
 * another writer (the Webapp) make. `after` defaults to `before` without `id`.
 */
export function createRemovedConnectionCookieCleaner(deps: RemovedConnectionCookieCleanerDeps) {
  return (id: string, before: ConnectionRegistry, after: ConnectionRegistry = removeConnection(before, id)) =>
    clearRemovedConnectionCookies(
      oauthJarsToClearOnRemoval(id, before, after, { v1RemoteUrl: deps.v1RemoteUrl(), sharedUrls: deps.sharedUrls() }),
      deps
    )
}
