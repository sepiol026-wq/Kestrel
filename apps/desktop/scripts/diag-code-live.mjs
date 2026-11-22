// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Is the tree-split preview path actually active in the running renderer?
// Checks the served source (what vite compiled) rather than guessing.
import { attach } from './perf/lib/launch.mjs'

const { cdp, teardown } = await attach({ port: 9222 })

try {
  await cdp.send('Runtime.enable')

  const out = await cdp.eval(`(async () => {
    const res = await fetch('/src/components/pane-shell/tree/renderer/tree-split.tsx')
    const src = await res.text()
    return JSON.stringify({
      previewShift: src.includes('previewShift'),
      adaptiveFloor: (await (await fetch('/src/app/session/hooks/use-message-stream/index.ts')).text()).includes('adaptiveFloor'),
      structuralSignature: (await (await fetch('/src/components/assistant-ui/thread/list.tsx')).text()).includes('structuralSignature'),
      sharedRO: (await (await fetch('/src/hooks/use-resize-observer.ts')).text()).includes('sharedObserver'),
      rootTipProvider: (await (await fetch('/src/main.tsx')).text()).includes('RootTooltipProvider')
    })
  })()`)

  console.log(out)
} finally {
  teardown?.()
}
