// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useEffect, useState } from 'react'

export const matchesQuery = (query: string) =>
  typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(query).matches

/** Read at call time, not render time: animations check this as they start, and
 *  the OS setting can flip mid-session. */
export const prefersReducedMotion = () => matchesQuery('(prefers-reduced-motion: reduce)')

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => matchesQuery(query))

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)

    setMatches(mql.matches)
    mql.addEventListener('change', onChange)

    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
