// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from "vitest";
import {
  assignmentToPickerCurrent,
  formatPickerCurrentLabel,
  isAutoPickerCurrent,
  resolveInitialProviderSlug,
  resolvePickerCurrent,
} from "./model-picker-current";

const MAIN = { model: "glm-5.3", provider: "zxl" };
const VISION = { model: "qwen/qwen2.5-flash", provider: "nous" };

const PROVIDERS = [
  { slug: "zxl", is_current: true },
  { slug: "nous", is_current: false },
  { slug: "openrouter", is_current: false },
];

describe("assignmentToPickerCurrent", () => {
  it("maps a pinned auxiliary task onto that provider/model", () => {
    expect(assignmentToPickerCurrent(VISION)).toEqual(VISION);
  });

  it("treats missing, empty, or auto provider as auto", () => {
    expect(assignmentToPickerCurrent(undefined)).toEqual({
      model: "",
      provider: "auto",
    });
    expect(assignmentToPickerCurrent({ provider: "auto", model: "ignored" })).toEqual({
      model: "",
      provider: "auto",
    });
    expect(assignmentToPickerCurrent({ provider: "", model: "glm-5.3" })).toEqual({
      model: "",
      provider: "auto",
    });
  });
});

describe("resolvePickerCurrent", () => {
  it("uses the catalog main model when no slot override is given", () => {
    expect(resolvePickerCurrent(MAIN)).toEqual(MAIN);
  });

  it("does not let the main chat model leak into an auxiliary slot", () => {
    // The screenshot bug: Set Auxiliary: Vision showed glm-5.3 · zxl
    // because the loader is always /api/model/options (main).
    expect(resolvePickerCurrent(MAIN, VISION)).toEqual(VISION);
  });

  it("keeps an explicit auto override instead of falling back to main", () => {
    expect(resolvePickerCurrent(MAIN, { model: "", provider: "auto" })).toEqual({
      model: "",
      provider: "auto",
    });
  });
});

describe("formatPickerCurrentLabel", () => {
  it("matches the previous main-picker label shape", () => {
    expect(formatPickerCurrentLabel(MAIN)).toBe("glm-5.3 · zxl");
  });

  it("shows auto (use main model) for unset auxiliary slots", () => {
    expect(formatPickerCurrentLabel({ model: "", provider: "auto" })).toBe(
      "auto (use main model)",
    );
    expect(isAutoPickerCurrent({ model: "glm-5.3", provider: "" })).toBe(true);
  });
});

describe("resolveInitialProviderSlug", () => {
  it("opens the auxiliary provider, not the main-model provider", () => {
    expect(resolveInitialProviderSlug(PROVIDERS, "nous")).toBe("nous");
  });

  it("falls back to the catalog's current provider when the slot is auto", () => {
    expect(resolveInitialProviderSlug(PROVIDERS, "auto")).toBe("zxl");
  });

  it("falls back when the pinned provider is missing from the catalog", () => {
    expect(resolveInitialProviderSlug(PROVIDERS, "missing-custom")).toBe("zxl");
  });
});
