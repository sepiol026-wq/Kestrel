// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { GatewayGroupOpenCopy, SkillDeepLinkCopy } from './types_deep_links'

export const enSkillDeepLink: SkillDeepLinkCopy = {
  installTitle: (name: string) => `Install “${name}”?`,
  installDescription: 'This skill will be available in new sessions. Only install sources you trust.',
  installTo: 'Install to',
  thisComputer: 'This computer',
  installing: 'Installing…',
  installComplete: (name: string) => `“${name}” installed`,
  destinationChanged: 'The destination changed. Close this dialog and open the install link again.',
  installed: 'Installed',
  source: 'Source'
}

export const enGatewayGroupOpen: GatewayGroupOpenCopy = {
  opening: 'Opening group chat…',
  lookupFailed: 'Could not look up this group on the gateway. Try again.',
  missing: 'This group chat no longer exists.'
}
