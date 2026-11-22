// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Page-owned header controls (#123597). A page route can render in the
 * workspace pane, whose zone paints `WORKSPACE_PAGE_HEADER_AREA` as the page
 * header, or in a route tile, where nothing reads that area. The control asks
 * WHERE it renders instead of reading the window-global `$workspaceIsPage`,
 * which can't tell a tile's mount from the workspace's.
 */

import { createContext, type ReactNode, useContext } from 'react'

import { Contribute } from '@/contrib/react/contribute'

import { WORKSPACE_PAGE_HEADER_AREA } from '../routes'

/** True inside the workspace pane's routes, whose zone paints the page header.
 *  Provided only by the workspace pane registration (controller.tsx). The
 *  default is false, so any other host fails safe to rendering inline. */
export const WorkspacePageHeaderHostContext = createContext(false)

/** Page-owned control: projected into the workspace page header when this
 *  subtree is hosted by it; rendered inline, in place, anywhere else. */
export function WorkspacePageHeaderControl({ children, id }: { children: ReactNode; id: string }) {
  return useContext(WorkspacePageHeaderHostContext) ? (
    <Contribute area={WORKSPACE_PAGE_HEADER_AREA} id={id}>
      {children}
    </Contribute>
  ) : (
    <>{children}</>
  )
}
