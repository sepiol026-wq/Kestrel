// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Out-of-credits overlay copy; `Translations` spreads this in.
export interface BillingTranslations {
  billingBlock: {
    titleNous: string
    titleProvider: (provider: string) => string
    fallbackMessage: string
    openBilling: string
    addCredits: string
    dismiss: string
  }
}
