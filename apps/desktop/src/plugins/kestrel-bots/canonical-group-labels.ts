// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useI18n } from '@hermes/plugin-sdk'

import { useBots } from './i18n'

/** Hosted group copy stays plugin-owned; generic controls reuse the core catalog. */
export function useCanonicalGroupLabels() {
  const { t } = useI18n()
  const { canonical, group } = useBots()

  return {
    ...canonical,
    back: t.common.back,
    cancel: t.common.cancel,
    close: t.common.close,
    refresh: t.common.refresh,
    retry: t.common.retry,
    send: t.common.send,
    stop: t.composer.stop,
    discard: t.composer.queueLostDiscard,
    details: t.notifications.details,
    download: t.fileMenu.download,
    rename: t.fileMenu.renameTitle,
    renameLabel: t.fileMenu.renameLabel,
    save: t.common.save,
    disband: group.disbandAction,
    disbanding: group.disbanding,
    disbandDone: group.disbandDone,
    disbanded: group.disbanded,
    disbandDescPrefix: group.disbandDescPrefix,
    disbandDescSuffix: group.disbandDescSuffix,
    disbandTitle: group.disbandTitle
  }
}
