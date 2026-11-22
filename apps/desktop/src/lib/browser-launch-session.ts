// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { GatewayReauthRequiredError } from '@hermes/shared'

export const WEBAPP_LAUNCH_REQUIRED = 'Run hermes webapp on this computer to sign this browser in.'

/**
 * This tab holds no credential the gateway accepts, and only a new launch link signs it in. The
 * reconnect loop stops on this error and the startup overlay shows the Webapp sign-in view.
 */
export function webappSignInRequired(): GatewayReauthRequiredError {
  return new GatewayReauthRequiredError(WEBAPP_LAUNCH_REQUIRED)
}

/** Where this tab keeps its launch-link grant for the Webapp at ``basePath`` on this origin. */
export function webappSessionKey(basePath: string): string {
  return `hermes.webapp.session.v1:${JSON.stringify([window.location.origin, basePath])}`
}

/**
 * This tab's credential, which the launch and child-window pages (``/webapp/launch``,
 * ``/webapp/window``) leave in its sessionStorage. It never travels in a URL: the browser would keep
 * that in its history. Reloads keep only this tab's grant.
 */
export function readWebappSession(basePath: string): string {
  try { return sessionStorage.getItem(webappSessionKey(basePath)) || '' } catch { return '' }
}
