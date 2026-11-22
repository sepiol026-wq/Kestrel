// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useContext } from "react";
import {
  SystemActionsContext,
  type SystemActionsState,
} from "./system-actions-context";

export function useSystemActions(): SystemActionsState {
  const ctx = useContext(SystemActionsContext);
  if (!ctx) {
    throw new Error(
      "useSystemActions must be used within a SystemActionsProvider",
    );
  }
  return ctx;
}
