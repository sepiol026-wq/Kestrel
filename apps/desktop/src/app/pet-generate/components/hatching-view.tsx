// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { PetEggHatch } from '@/components/pet/pet-egg-hatch'
import { useI18n } from '@/i18n'
import { cancelHatch, type PetHatchStage } from '@/store/pet-generate'

interface HatchingViewProps {
  stage: PetHatchStage | null
}

// The hatch progress screen — a beating egg with a phase-tracking subtitle
// (per-row → composing → saving).
export function HatchingView({ stage }: HatchingViewProps) {
  const { t } = useI18n()
  const copy = t.commandCenter.generatePet

  const subtitle = stage
    ? stage.phase === 'row'
      ? copy.hatchRow(stage.state ?? '', stage.done ?? 0, stage.total ?? 0)
      : stage.phase === 'compose'
        ? copy.hatchComposing
        : copy.hatchSaving
    : copy.hatchingSub

  return <PetEggHatch cancelLabel={t.common.cancel} onCancel={cancelHatch} subtitle={subtitle} />
}
