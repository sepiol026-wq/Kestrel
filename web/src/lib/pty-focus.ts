// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Whether ChatPage may pull keyboard focus back into the xterm textarea.
//
// Only when nothing else on the page is holding focus: `document.activeElement`
// is null / <body> (first activation after mount, or a return from another OS
// app or browser tab where focus fell back to <body>), or already inside the
// terminal host. If the user had clicked into the sidebar (model picker,
// tool-call entry) we must not yank focus away from wherever they left it —
// that's a surprise and an a11y foot-gun.
export function shouldRestoreTerminalFocus(
  active: Element | null,
  host: Element | null,
): boolean {
  if (active === null || active === document.body || host === null) {
    return true;
  }
  return host.contains(active);
}
