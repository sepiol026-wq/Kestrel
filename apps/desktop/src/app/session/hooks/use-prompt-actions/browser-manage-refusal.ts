// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { hostHas } from '@/lib/host-capabilities'

// A remote connection refuses /browser connect|disconnect: both drive the CDP
// connection inside the gateway process. The Webapp is always remote and has no
// local gateway to switch to, so it names the machine the command acts on instead.
export const remoteBrowserManageRefusal = (action: 'connect' | 'disconnect'): string =>
  hostHas('webappCopy')
    ? `/browser ${action} isn't available in the Webapp — it manages a Chromium-family browser on the machine running Hermes. Run it from Hermes Desktop or the CLI on that machine.`
    : '/browser connect manages a Chromium-family browser on the gateway host — only available when connected to a local gateway.'
