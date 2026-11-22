// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useStore } from '@nanostores/react'
import { useEffect, useState } from 'react'

import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { $confirmRequest, type PendingConfirm, runConfirm, settleConfirm } from '@/store/confirm'

// The one mount point for `confirm()` from @/store/confirm. Mounted once at the
// shell, the way NotificationStack backs notify().
export function ConfirmHost() {
  const request = useStore($confirmRequest)
  // The atom clears the moment the question is answered, but Radix still has a
  // close animation to play — hold the copy so the dialog doesn't blank mid-fade.
  const [shown, setShown] = useState<null | PendingConfirm>(request)

  useEffect(() => {
    if (request) {
      setShown(request)
    }
  }, [request])

  if (!shown) {
    return null
  }

  return (
    <ConfirmDialog
      busyLabel={shown.busyLabel}
      cancelLabel={shown.cancelLabel}
      confirmLabel={shown.confirmLabel}
      description={shown.description}
      destructive={shown.destructive}
      dismissOnConfirm={!shown.onConfirm}
      doneLabel={shown.doneLabel}
      key={shown.id}
      onClose={() => settleConfirm(shown.phase === 'done', shown)}
      onConfirm={() => runConfirm(shown)}
      open={request !== null}
      title={shown.title}
    >
      {shown.details && (
        <dl className="space-y-3 text-xs">
          {shown.details.map(({ label, value }) => (
            <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3" key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="m-0 whitespace-pre-wrap break-words text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </ConfirmDialog>
  )
}
