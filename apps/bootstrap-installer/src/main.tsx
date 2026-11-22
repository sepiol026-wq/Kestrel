// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import './styles.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app.tsx'
import { watchTheme } from './theme'

// Follow the OS light/dark appearance. theme.ts paints the first frame on
// import (synchronously, from the media query); this subscribes to live OS
// theme changes via the authoritative Tauri window theme.
void watchTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
