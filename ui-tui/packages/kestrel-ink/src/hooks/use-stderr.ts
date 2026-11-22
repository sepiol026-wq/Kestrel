// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useMemo } from 'react'
export type StderrHandle = {
  stderr: NodeJS.WriteStream
  write: (data: string) => boolean
}

export default function useStderr(): StderrHandle {
  return useMemo(
    () => ({
      stderr: process.stderr,
      write: data => process.stderr.write(data)
    }),
    []
  )
}
