// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { PluginSlot } from "@/plugins";

/** The `sidebar` slot renders only when `layoutVariant === "cockpit"`
 *  (documented in extending-the-dashboard.md). Extracted so the rule is
 *  testable without mounting the full App shell. */
export function CockpitSidebarSlot({ layoutVariant }: { layoutVariant: string }) {
  return layoutVariant === "cockpit" ? <PluginSlot name="sidebar" /> : null;
}
