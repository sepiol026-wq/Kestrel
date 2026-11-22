// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** The clarify question card. */
export interface ClarifyCopy {
  notReady: string
  gatewayDisconnected: string
  sendFailed: string
  loadingQuestion: string
  other: string
  placeholder: string
  skip: string
  skipped: string
  noAnswer: string
  confirmAndContinueLabel: string
  singleSelectHint: string
  multiSelectHint: string
  oneQuestion: string
  questionProgress: (answered: number, total: number) => string
  notDelivered: string
}
