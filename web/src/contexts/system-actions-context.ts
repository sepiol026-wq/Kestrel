// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createContext } from "react";
import type { ActionStatusResponse } from "@/lib/api";

export const SystemActionsContext = createContext<SystemActionsState | null>(
  null,
);

export type SystemAction = "restart" | "update";

export interface SystemActionsState {
  actionStatus: ActionStatusResponse | null;
  activeAction: SystemAction | null;
  dismissLog: () => void;
  isBusy: boolean;
  isRunning: boolean;
  pendingAction: SystemAction | null;
  runAction: (action: SystemAction) => Promise<void>;
}
