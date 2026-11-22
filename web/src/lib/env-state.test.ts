// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from "vitest";

import type { EnvVarInfo } from "./api";
import { removeDeletedEnvVarFromState } from "./env-state";

function envVar(overrides: Partial<EnvVarInfo> = {}): EnvVarInfo {
  return {
    is_set: true,
    redacted_value: "secr...alue",
    description: "",
    url: null,
    category: "provider",
    is_password: true,
    tools: [],
    advanced: false,
    ...overrides,
  };
}

describe("removeDeletedEnvVarFromState", () => {
  it("removes a deleted custom key from dashboard state", () => {
    const vars = {
      WHATSAPP_DEBUG: envVar({ category: "custom", custom: true }),
      OPENAI_API_KEY: envVar(),
    };

    const updated = removeDeletedEnvVarFromState(vars, "WHATSAPP_DEBUG");

    expect(updated).not.toHaveProperty("WHATSAPP_DEBUG");
    expect(updated?.OPENAI_API_KEY).toBe(vars.OPENAI_API_KEY);
  });

  it("keeps a catalog key available while marking it unset", () => {
    const vars = { OPENAI_API_KEY: envVar() };

    const updated = removeDeletedEnvVarFromState(vars, "OPENAI_API_KEY");

    expect(updated?.OPENAI_API_KEY).toEqual({
      ...vars.OPENAI_API_KEY,
      is_set: false,
      redacted_value: null,
    });
  });
});
