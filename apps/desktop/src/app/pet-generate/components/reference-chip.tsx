// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useState } from 'react'

import { ImageLightbox } from '@/components/chat/zoomable-image'
import { useImageDownload } from '@/hooks/use-image-download'
import { useI18n } from '@/i18n'
import { X } from '@/lib/icons'

interface ReferenceChipProps {
  name: string
  onRemove: () => void
  src: string
}

// The reference photo as an attachment chip: filename + thumbnail that opens
// the shared image viewer (lightbox), with a remove affordance.
export function ReferenceChip({ name, onRemove, src }: ReferenceChipProps) {
  const { t } = useI18n()
  const { download, saving } = useImageDownload(src)
  const [viewing, setViewing] = useState(false)

  return (
    <div className="ml-auto flex h-6 items-center gap-2 self-start rounded-lg border border-border/60 bg-background/50 pl-1 pr-2">
      <button aria-label={t.desktop.openImage} className="shrink-0" onClick={() => setViewing(true)} type="button">
        <img alt={name} className="size-4 rounded-md object-cover" src={src} />
      </button>

      <span className="max-w-40 truncate text-[0.64rem] font-medium text-foreground/50">{name || 'Reference'}</span>
      <button
        aria-label="Remove reference"
        className="text-(--ui-text-tertiary) transition not-hover:opacity-50"
        onClick={onRemove}
        type="button"
      >
        <X className="size-3" />
      </button>

      <ImageLightbox
        alt={name}
        copy={t.desktop}
        onClick={download}
        onOpenChange={setViewing}
        open={viewing}
        saving={saving}
        src={src}
      />
    </div>
  )
}
