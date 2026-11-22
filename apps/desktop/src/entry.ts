// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Renderer entry. The whole app (every store that reads localStorage when its
// module evaluates) enters through the dynamic import below, so nothing can
// read a shared preference before this machine's store hydrated it (#145213),
// in the production chunk graph and in dev's unbundled ESM alike. Keep this
// file's static imports free of app modules.
import { showBootFailure } from './lib/boot-failure'
import { bootRenderer } from './lib/ui-preferences/boot'

void bootRenderer(() => import('./main')).catch(showBootFailure)
