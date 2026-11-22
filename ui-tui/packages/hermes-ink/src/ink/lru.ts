// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Shared eviction for the hot Ink LRU caches (widthCache, wrapCache,
// sliceCache, lineWidthCache). Hot-path touch-on-read stays inlined per
// cache — only the bulk eviction is factored here.
export function lruEvict<K, V>(cache: Map<K, V>, keepRatio: number): void {
  if (keepRatio <= 0) {
    return cache.clear()
  }

  const target = Math.floor(cache.size * keepRatio)

  while (cache.size > target) {
    cache.delete(cache.keys().next().value!)
  }
}
