// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { afterEach, describe, expect, it, vi } from "vitest";

import { api } from "@/lib/api";
import { runDashboardPluginUpdate } from "@/lib/plugin-update";

const copy = {
  consentBody: (name: string, sha: string) => `consent ${name} ${sha}`,
  scanBody: (name: string, count: number) => `scan ${name} ${count}`,
  scanBlocked: (name: string) => `blocked ${name}`,
};
const caution = {
  ok: false,
  scan_blocked: true,
  scan_verdict: "caution",
  scan_findings: [{ severity: "high", category: "execution", file: "helper.py", line: 1, description: "eval" }],
};

afterEach(() => vi.restoreAllMocks());

describe("runDashboardPluginUpdate", () => {
  it("shows a caution finding and retries with force only after the user agrees", async () => {
    const update = vi.spyOn(api, "updateAgentPlugin").mockResolvedValueOnce(caution).mockResolvedValueOnce({ ok: true });
    const ask = vi.fn().mockReturnValue(true);

    expect(await runDashboardPluginUpdate("tern", copy, ask)).toBe(true);
    expect(ask.mock.calls[0][0]).toContain("HIGH  helper.py:1  eval");
    expect(update).toHaveBeenLastCalledWith("tern", { acceptCapabilities: false, force: true });
  });

  it("cancel applies nothing, and a dangerous verdict throws without asking", async () => {
    const update = vi.spyOn(api, "updateAgentPlugin").mockResolvedValue(caution);
    expect(await runDashboardPluginUpdate("tern", copy, () => false)).toBe(false);
    expect(update).toHaveBeenCalledTimes(1);

    update.mockResolvedValue({ ...caution, scan_verdict: "dangerous" });
    const ask = vi.fn();
    await expect(runDashboardPluginUpdate("tern", copy, ask)).rejects.toThrow("blocked tern");
    expect(ask).not.toHaveBeenCalled();
  });
});
