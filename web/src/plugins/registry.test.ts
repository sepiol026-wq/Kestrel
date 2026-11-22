// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Smoke test for the plugin SDK surface additions.
 *
 * Verifies that `exposePluginSDK()` writes the new dialog/toast primitives to
 * `window.__HERMES_PLUGIN_SDK__`. Each new key is checked individually so a
 * regression in one helper doesn't mask the others.
 *
 * Companion to the additive PR "feat(plugins): expose Dialog/ConfirmDialog/
 * Toast/useToast/useConfirmDelete on the plugin SDK". See issue #50547.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { exposePluginSDK } from "./registry";

describe("plugin SDK dialog/toast surface", () => {
  beforeEach(() => {
    // Reset window between tests so exposePluginSDK() writes fresh.
    (globalThis as unknown as { window: Record<string, unknown> }).window = {
      __HERMES_PLUGINS__: undefined,
      __HERMES_PLUGIN_SDK__: undefined,
    };
  });

  it("exposes Dialog + subcomponents on components", () => {
    exposePluginSDK();
    const sdk = (globalThis as unknown as { window: { __HERMES_PLUGIN_SDK__: { components: Record<string, unknown>; hooks: Record<string, unknown> } } }).window.__HERMES_PLUGIN_SDK__;
    expect(sdk.components.Dialog).toBeDefined();
    expect(sdk.components.DialogContent).toBeDefined();
    expect(sdk.components.DialogHeader).toBeDefined();
    expect(sdk.components.DialogTitle).toBeDefined();
    expect(sdk.components.DialogDescription).toBeDefined();
    expect(sdk.components.DialogFooter).toBeDefined();
    expect(sdk.components.DialogClose).toBeDefined();
    expect(sdk.components.ConfirmDialog).toBeDefined();
    expect(sdk.components.Toast).toBeDefined();
  });

  it("exposes useToast and useConfirmDelete on hooks", () => {
    exposePluginSDK();
    const sdk = (globalThis as unknown as { window: { __HERMES_PLUGIN_SDK__: { components: Record<string, unknown>; hooks: Record<string, unknown> } } }).window.__HERMES_PLUGIN_SDK__;
    expect(typeof sdk.hooks.useToast).toBe("function");
    expect(typeof sdk.hooks.useConfirmDelete).toBe("function");
    // Original React hooks still present (no accidental removal).
    expect(typeof sdk.hooks.useState).toBe("function");
    expect(typeof sdk.hooks.useCallback).toBe("function");
  });
});