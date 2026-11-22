// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

const profileGraphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/** Keep combining marks and emoji sequences together without changing the rail's size. */
export function profileShortLabel(label: string): string {
  for (const { segment } of profileGraphemes.segment(label.trim())) {
    if (/[\p{L}\p{N}\p{Extended_Pictographic}\p{Regional_Indicator}]/u.test(segment)) {
      return segment
    }
  }

  return '?'
}
