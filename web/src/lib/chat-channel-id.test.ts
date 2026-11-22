// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from "vitest";

import { generateChannelId } from "./chat-channel-id";

describe("generateChannelId", () => {
  it("prefixes chat when scoped and chat-fresh when not", () => {
    expect(generateChannelId("scope")).toMatch(/^chat-/);
    expect(generateChannelId()).toMatch(/^chat-fresh-/);
  });

  it("never returns the same id twice", () => {
    expect(generateChannelId("s")).not.toBe(generateChannelId("s"));
  });
});
