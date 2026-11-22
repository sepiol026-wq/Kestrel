// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Credential prompts: the sudo password, secret (env var) and password-manager
// unlock prompts hosted in MaskedPrompt. Owned namespace: `secure`.
//
// Only labels/hints live here — the typed values never touch the catalog.
// (maskedPrompt.tsx itself has no prose; its `> ` caret is a token.)

export const secureEn = {
  secure: {
    sudo: {
      title: 'sudo password required'
    },
    secret: {
      forEnvVar: (envVar: string) => `for ${envVar}`
    },
    vault: {
      unlockTitle: (displayName: string) => `Unlock ${displayName} for this session`,
      unlockHint: 'master password · hidden · goes to the manager CLI only · Esc keeps it locked',
      saveTitle: (site: string) => `Save your ${site} login`,
      saveIdentifierHint: 'email or username · password comes next · Esc or empty skips saving',
      savePasswordTitle: (identifier: string) => `Password for ${identifier}`,
      savePasswordHint: (site: string) => `hidden · encrypted on this machine for ${site} · never shown to the model`,
      codeTitle: (site: string) => `Verification code for ${site}`,
      codeHint: 'typed into the page only · never shown to the model · Esc skips'
    }
  }
}
