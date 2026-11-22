// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Shared height cap for inline embeds. Ratio embeds cap their width off this in
// UrlEmbed so height follows the aspect ratio; fenced renderers (mermaid, svg)
// reuse it directly. Pure CSS — no measuring.
export const EMBED_MAX_H = '33dvh'

// Fallback height (px) for non-ratio embeds that don't declare one: the consent
// placeholder, the intrinsic-size hint, and social frames until they measure.
export const EMBED_DEFAULT_H = 320
