// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import * as inputHistory from '@hermes/shared/prompt-history'
import { useRef, useState } from 'react'

export function useInputHistory() {
  const historyRef = useRef<string[]>(inputHistory.load())
  const [historyIdx, setHistoryIdx] = useState<number | null>(null)
  const historyDraftRef = useRef('')

  return { historyRef, historyIdx, setHistoryIdx, historyDraftRef, pushHistory: inputHistory.append }
}
