// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { annotateFlushPrompt, dataUrlToFile, packageAnnotateStack } from './pack'
import type { AnnotatePin } from './stack'

export interface AnnotateFlushPorts {
  attachImage: (blob: Blob) => void | Promise<void>
  insertText: (text: string) => void
  send?: () => void
}

export interface AnnotateFlushResult {
  count: number
  prompt: string
  sent: false
}

/**
 * Attach every pin to the composer as a numbered crop plus the packed prompt.
 * Saving / flushing never submits a turn — `send` is accepted so tests can
 * prove it stays untouched.
 */
export async function flushAnnotateStack(
  pins: readonly AnnotatePin[],
  ports: AnnotateFlushPorts,
  pageUrl?: string
): Promise<AnnotateFlushResult> {
  const items = packageAnnotateStack(pins)

  for (const item of items) {
    if (item.imageDataUrl) {
      await ports.attachImage(dataUrlToFile(item.imageDataUrl, `Comment_${item.number}.png`))
    }
  }

  const prompt = annotateFlushPrompt(items, pageUrl)

  if (prompt.trim()) {
    ports.insertText(prompt)
  }

  return { count: items.length, prompt, sent: false }
}
