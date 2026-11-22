// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useContext } from "react";
import { PageHeaderContext, type PageHeaderContextValue } from "./page-header-context";

/**
 * Fill header slots from `useLayoutEffect` and clear them in its cleanup. A
 * `useEffect` cleanup on the outgoing page runs after the incoming page's
 * layout effects, so it would erase the new page's header.
 */
export function usePageHeader(): PageHeaderContextValue {
  const ctx = useContext(PageHeaderContext);
  if (!ctx) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider");
  }
  return ctx;
}
