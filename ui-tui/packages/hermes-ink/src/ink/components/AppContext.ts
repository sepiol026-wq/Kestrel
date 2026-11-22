// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { createContext } from 'react'

export type Props = {
  /**
   * Exit (unmount) the whole Ink app.
   */
  readonly exit: (error?: Error) => void
}

/**
 * `AppContext` is a React context, which exposes a method to manually exit the app (unmount).
 */

const AppContext = createContext<Props>({
  exit() {}
})

AppContext.displayName = 'InternalAppContext'

export default AppContext
