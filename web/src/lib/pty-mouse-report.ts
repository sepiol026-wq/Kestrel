// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// xterm.js SGR mouse tracking emits raw CSI reports (`\x1b[<...`) that look
// like ordinary bytes to the backend. The embedded web chat prefers input
// stability over terminal-style mouse reporting, so ChatPage drops these
// reports entirely instead of forwarding them into Hermes (see ChatPage.tsx,
// "Keystrokes → PTY").
// eslint-disable-next-line no-control-regex -- intentional ESC byte in xterm SGR mouse report parser
export const SGR_MOUSE_RE = /^\x1b\[<(\d+);(\d+);(\d+)([Mm])$/;
