// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('node:child_process', () => ({
  execFileSync: vi.fn(),
}))

const { execFileSync } = await import('node:child_process')
const { buildCommandScreenshotMonitor } = await import('./build-command-screenshot-monitor.mjs')

afterEach(() => {
  vi.mocked(execFileSync).mockReset()
})

// The helper shells out to xcrun; pin the argv contract (not the toolchain),
// so a non-macOS CI host still proves what the macOS build will run.
describe('buildCommandScreenshotMonitor argv', () => {
  it('uses the paired sysroot or delegates SDK selection to xcrun', () => {
    for (const sysroot of ['/Developer/SDKs/MacOSX.sdk', null]) {
      const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'csm-argv-'))
      const staging = path.resolve(distDir, `native/command-screenshot-monitor.${process.pid}.tmp/command-screenshot-monitor`)
      fs.mkdirSync(path.dirname(staging), { recursive: true })
      fs.writeFileSync(staging, 'staged')

      try {
        const out = buildCommandScreenshotMonitor({ distDir, platform: 'darwin', sysroot })
        const [cmd, argv] = vi.mocked(execFileSync).mock.lastCall
        expect(cmd).toBe('xcrun')
        expect(argv.slice(0, 3)).toEqual(sysroot
          ? ['clang', '-isysroot', sysroot]
          : ['--sdk', 'macosx', 'clang'])
        expect(out).toBe(path.resolve(distDir, 'native/command-screenshot-monitor'))
      } finally {
        fs.rmSync(distDir, { recursive: true, force: true })
      }
    }
  })

  it('is a no-op off macOS', () => {
    const distDir = path.join(os.tmpdir(), 'csm-never')

    expect(buildCommandScreenshotMonitor({ distDir, platform: 'linux' })).toBeNull()
    expect(execFileSync).not.toHaveBeenCalled()
  })
})
