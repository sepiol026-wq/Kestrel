// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { shouldRestoreTerminalFocus } from "./pty-focus";

describe("shouldRestoreTerminalFocus", () => {
  const body = document.body;
  const host = document.createElement("div");
  const textarea = document.createElement("textarea");
  const sidebarInput = document.createElement("input");
  host.appendChild(textarea);
  body.appendChild(host);
  body.appendChild(sidebarInput);

  it("restores when nothing holds focus (OS app-switch drops focus onto <body>)", () => {
    expect(shouldRestoreTerminalFocus(null, host)).toBe(true);
    expect(shouldRestoreTerminalFocus(body, host)).toBe(true);
  });

  it("restores when the terminal itself already had focus", () => {
    expect(shouldRestoreTerminalFocus(textarea, host)).toBe(true);
  });

  it("does not steal focus from another control on the page", () => {
    expect(shouldRestoreTerminalFocus(sidebarInput, host)).toBe(false);
  });

  it("restores when the terminal host is not mounted yet", () => {
    expect(shouldRestoreTerminalFocus(sidebarInput, null)).toBe(true);
  });
});
