// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from "vitest";
import type { MemoryProviderSetupInfo } from "@/lib/api";
import { setupHasDetails, setupHasInstallableSteps } from "@/lib/memory-provider-setup";

describe("memory provider preparation", (): void => {
  it("offers preparation for a PM member without legacy pip declarations", (): void => {
    const setup: MemoryProviderSetupInfo = {
      pip_dependencies: [],
      python_dependencies_declared: true,
      external_dependencies: [],
      required_env: [],
      dependencies_installed: false,
    };
    expect(setupHasDetails(setup)).toBe(true);
    expect(setupHasInstallableSteps(setup)).toBe(true);
    expect(setupHasInstallableSteps({ ...setup, python_dependencies_declared: false })).toBe(false);
  });
});