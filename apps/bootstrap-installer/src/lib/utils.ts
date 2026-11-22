// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/*
 * cn — Tailwind-aware class merger. Same util the desktop and dashboard
 * use. clsx handles conditional classes; twMerge resolves utility
 * conflicts so `cn('px-2', condition && 'px-4')` ends up with px-4 only,
 * not both.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
