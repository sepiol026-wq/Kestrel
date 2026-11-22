// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Screenshot the render.tsx output with the workspace's Electron (offscreen).
import { app, BrowserWindow } from 'electron'
import { writeFileSync } from 'fs'
import { join } from 'path'

import { visualOutDir } from './paths.mjs'

app.disableHardwareAcceleration()

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    height: 2100,
    show: false,
    webPreferences: { offscreen: true },
    width: 1500
  })

  const outDir = visualOutDir()

  await win.loadFile(join(outDir, 'tui-visual.html'))
  await new Promise(r => setTimeout(r, 700))

  const image = await win.webContents.capturePage()
  const outFile = join(outDir, 'tui-visual.png')

  writeFileSync(outFile, image.toPNG())
  console.log(`wrote ${outFile}`)
  app.quit()
})
