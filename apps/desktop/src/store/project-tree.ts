// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

import type { SidebarProjectTree } from '@/app/chat/sidebar/projects/workspace-groups'

// The project tree atom lives in this leaf so store/session-states.ts can
// read it (a focused tile's session is often older than the paginated recents
// page, so the tree is the only loaded copy of its row, #76535) without
// pulling store/projects.ts — and through it store/gateway.ts — into every
// suite that partially mocks the gateway. store/projects.ts owns all writes
// and re-exports the atom so existing call sites keep their import path.
export const $projectTree = atom<SidebarProjectTree[]>([])
