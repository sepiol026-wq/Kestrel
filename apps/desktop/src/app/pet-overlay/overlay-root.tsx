// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/themes/context'

import { PetOverlayApp } from './pet-overlay-app'

/**
 * Boot the pet-overlay window. Loaded by the same bundle as the main app but
 * via `?win=overlay`, so it shares CSS/atoms while mounting a minimal, transparent
 * surface (no app shell, no gateway, no I18n — the bubble strings are inline).
 *
 * The index.html boot script paints an OPAQUE themed background to avoid a flash
 * in normal windows; the overlay must be see-through, so we force every host
 * layer transparent with a late, high-specificity style tag.
 */
export function mountPetOverlay(): void {
  const style = document.createElement('style')
  style.textContent = 'html,body,#root{background:transparent !important;}'
  document.head.appendChild(style)

  const root = document.getElementById('root')

  if (!root) {
    return
  }

  createRoot(root).render(
    <StrictMode>
      <ErrorBoundary label="pet-overlay">
        <ThemeProvider>
          <PetOverlayApp />
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  )
}
