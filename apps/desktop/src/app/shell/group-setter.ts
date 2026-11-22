// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// The `GroupSetter` shape pages take as an extension-point prop (CapabilitiesView,
// MessagingView, ChatPreviewRail, …). The live implementation is the
// registry-backed `registryGroupSetter` in app/contrib/panes.tsx.
type Side = 'left' | 'right'

export type GroupSetter<T> = (id: string, items: readonly T[], side?: Side) => void
