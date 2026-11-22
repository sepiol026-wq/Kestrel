// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Compile-time guard for BillingPaymentMethod.
 *
 * There is nothing to run here — the point is that `tsc` accepts this file.
 * An earlier revision typed the fallback arm's `kind` as `string & {}`, which
 * makes the discriminant non-literal and silently defeats narrowing for every
 * arm: the `pm.brand` read below stops compiling. Keeping this file honest
 * keeps `kind` narrowable.
 */

import type { BillingPaymentMethod } from './billing-types'

export function describePaymentMethod(pm: BillingPaymentMethod): string {
  switch (pm.kind) {
    case 'card':
      return pm.wallet ? `${pm.wallet} ${pm.brand} ${pm.last4}` : `${pm.brand} ${pm.last4}`

    case 'link':
      return pm.email ?? 'Link'

    case 'unknown':
      return pm.raw_kind
  }
}
