// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { MemoryProviderSetupInfo } from "@/lib/api";

export function setupHasDetails(setup?: MemoryProviderSetupInfo): boolean {
  return Boolean(
    setup && (
      setup.external_dependencies?.length ||
      setup.python_dependencies_declared ||
      setup.pip_dependencies?.length ||
      setup.required_env?.length
    ),
  );
}

export function setupHasInstallableSteps(setup?: MemoryProviderSetupInfo): boolean {
  return Boolean(
    setup && (
      setup.external_dependencies?.some((dep) => dep.install) ||
      setup.python_dependencies_declared ||
      setup.pip_dependencies?.length
    ),
  );
}
