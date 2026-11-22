// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Tests for the sidecar ``session.create`` params built by ChatSidebar.
 *
 * The sidecar must opt its session into close_on_disconnect so the gateway
 * reaps the slash_worker on WS disconnect (the #21370/#21467 leak), and it
 * must pass the dashboard's selected profile so model/credential info
 * matches the PTY child under profile-scoped chat.
 *
 */

import { describe, expect, it } from "vitest";

import { sidecarSessionCreateParams } from "@/components/ChatSidebar";

describe("sidecarSessionCreateParams", () => {
  it("opts into close_on_disconnect", () => {
    const params = sidecarSessionCreateParams();
    expect(params.close_on_disconnect).toBe(true);
  });

  it("sets source to 'tool'", () => {
    const params = sidecarSessionCreateParams();
    expect(params.source).toBe("tool");
  });

  it("forwards the profile when present", () => {
    const params = sidecarSessionCreateParams("work");
    expect(params.profile).toBe("work");
  });

  it("omits profile when undefined", () => {
    const params = sidecarSessionCreateParams();
    expect(params).not.toHaveProperty("profile");
  });
});
