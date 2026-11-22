// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export const providerDisplayNames = (providers: readonly { name: string; slug: string }[]): string[] => {
  const counts = new Map<string, number>()

  for (const p of providers) {
    counts.set(p.name, (counts.get(p.name) ?? 0) + 1)
  }

  return providers.map(p =>
    (counts.get(p.name) ?? 0) > 1 && p.slug && p.slug !== p.name ? `${p.name} (${p.slug})` : p.name
  )
}
