// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Button } from '@/components/ui/button'

interface EmptyHintProps {
  onExample: (prompt: string) => void
}

// Creative seed prompts — specifics make better pets (petdex's own advice).
// Short chips that wrap into a tight, centered cluster (capped width → 2 rows).
const EXAMPLE_PROMPTS = ['bubble-tea otter', 'sock elf', 'pixel dragon', 'office cat', 'neon axolotl', 'moss golem']

export function EmptyHint({ onExample }: EmptyHintProps) {
  return (
    <div className="flex max-w-[300px] flex-wrap place-content-center place-items-center gap-2">
      {EXAMPLE_PROMPTS.map(example => (
        <Button
          className="h-auto w-fit rounded-full font-normal"
          key={example}
          onClick={() => onExample(`a ${example}`)}
          size="xs"
          variant="outline"
        >
          {example}
        </Button>
      ))}
    </div>
  )
}
