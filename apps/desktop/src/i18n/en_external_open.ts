// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { ExternalOpenFailedCopy } from './types_external_open'

export const enExternalOpenFailed: ExternalOpenFailedCopy = {
  title: 'Couldn’t open this link',
  message: 'No browser is registered to open this address. Copy the link and open it manually.',
  copyUrl: 'Copy link',
  close: 'Close',
  missing: {
    title: 'File not found',
    message: 'This file does not exist — it may have been deleted or moved, or it lives on another machine.'
  }
}
