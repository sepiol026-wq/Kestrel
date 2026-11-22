// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { translateNow } from '@/i18n'
import { WEBAPP_LAUNCH_REQUIRED } from '@/lib/browser-launch-session'
import { failDesktopBoot } from '@/store/boot'
import { isActivePrimary } from '@/store/gateway'
import { notify, RECOVERY_ACTIONS } from '@/store/notifications'

/**
 * Plain "signed out" copy for a reconnect that needs a new sign-in; the raw ticket/HTTP text stays
 * under Details. In the foreground the boot overlay carries the sign-in flow, so the button hands
 * off to it (desktop-14), and a Webapp tab's sign-in view already says how to sign back in. A parked
 * background primary no longer retries by itself, so it must still offer a way to Settings.
 */
export function notifyPrimaryReauth(detail: string, currentError: () => string): void {
  const foreground = isActivePrimary()

  if (foreground && detail === WEBAPP_LAUNCH_REQUIRED) {return}

  notify({
    kind: 'error',
    title: translateNow('boot.errors.gatewaySignInRequired'),
    message: translateNow('boot.errors.gatewaySignInRequiredDetail'),
    detail,
    action: foreground
      ? { label: translateNow('boot.errors.signInAgain'), onClick: () => failDesktopBoot(currentError()) }
      : RECOVERY_ACTIONS.openGateways()
  })
}
