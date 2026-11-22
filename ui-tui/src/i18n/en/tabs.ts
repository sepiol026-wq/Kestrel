// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Owned namespace: `tabs` — the top tab strip and the code-mode pane it opens.

export const tabsEn = {
  tabs: {
    code: 'code',
    newSession: 'new session',
    cycleHint: (count: number) => `alt+1-${count} switch · alt+c code`,
    hiddenLeft: (count: number) => `←${count}`,
    hiddenRight: (count: number) => `→${count}`,
    codeEmpty: 'code mode: nothing ran yet. ask for code in the prompt, or press alt+c to leave.',
    codeInput: 'in',
    codeOutput: 'out',
    codeRunning: 'running…',
    codeTitle: 'code mode'
  }
}
