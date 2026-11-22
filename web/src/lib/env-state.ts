// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { EnvVarInfo } from "./api";

/** Reconcile a successful DELETE /api/env response with the Keys page state. */
export function removeDeletedEnvVarFromState(
  vars: Record<string, EnvVarInfo> | null,
  key: string,
): Record<string, EnvVarInfo> | null {
  const info = vars?.[key];
  if (!vars || !info) return vars;

  if (info.custom) {
    const updated = { ...vars };
    delete updated[key];
    return updated;
  }

  return {
    ...vars,
    [key]: { ...info, is_set: false, redacted_value: null },
  };
}
