// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export function desktopBackendSpawnEnv(base: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return {
    ...base,
    // The desktop spawns `hermes serve` directly — no systemd/launchd supervisor will
    // revive a failure exit, so EX_TEMPFAIL only severs the UI's websockets and drops
    // in-flight assistant messages (#118080). Tell the gateway to stay alive on
    // all-adapters-down and let the reconnect watcher recover instead. Written LAST
    // so no earlier spread can override it. Older runtimes ignore the unknown
    // variable and keep the historical exit behavior.
    GATEWAY_ON_ALL_ADAPTERS_DOWN: 'stay_alive'
  }
}
