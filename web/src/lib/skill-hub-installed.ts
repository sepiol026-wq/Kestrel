// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { skillCatalogInstallIdentifier } from "@hermes/shared";

import type { SkillHubInstalledEntry, SkillHubResult } from "@/lib/api";

/**
 * The installed lock entry a hub search or featured hit names. The backend keys
 * a ClawHub install by its lock id (`@owner/slug`) and by the `clawhub/<slug>`
 * id a catalog card installs, but a ClawHub hit carries its bare slug. So a hit
 * is looked up under its own id, then under the id a catalog card would install
 * for it, which differs only for ClawHub.
 */
export function installedHubEntry(
  installed: Record<string, SkillHubInstalledEntry>,
  hit: Pick<SkillHubResult, "identifier" | "name" | "source">,
): SkillHubInstalledEntry | undefined {
  return (
    installed[hit.identifier] ??
    installed[skillCatalogInstallIdentifier(hit) ?? hit.identifier]
  );
}
