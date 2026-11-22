// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createContext } from "react";
import type { ReactNode } from "react";

export interface PageHeaderContextValue {
  setAfterTitle: (node: ReactNode) => void;
  setEnd: (node: ReactNode) => void;
  setTitle: (title: string | null) => void;
}

export const PageHeaderContext = createContext<PageHeaderContextValue | null>(
  null,
);
