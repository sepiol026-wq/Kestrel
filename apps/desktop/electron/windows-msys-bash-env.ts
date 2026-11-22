// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Git Bash/MSYS rewrite slash-prefixed native flags (`/FI`) into paths.
// Set these two opt-outs on Windows unless already present.
export function applyWindowsMsysBashEnvDefaults(
  env: NodeJS.ProcessEnv,
  isWindows: boolean = process.platform === 'win32'
): NodeJS.ProcessEnv {
  if (!isWindows) {
    return env
  }

  if (!Object.prototype.hasOwnProperty.call(env, 'MSYS_NO_PATHCONV')) {
    env.MSYS_NO_PATHCONV = '1'
  }

  if (!Object.prototype.hasOwnProperty.call(env, 'MSYS2_ARG_CONV_EXCL')) {
    env.MSYS2_ARG_CONV_EXCL = '*'
  }

  return env
}
