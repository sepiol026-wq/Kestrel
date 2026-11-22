// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { CronControlCopy } from './types_cron_control'

export const arCronControl: CronControlCopy = {
  stop: 'إيقاف',
  stopping: 'جارٍ الإيقاف…',
  stopped: 'أُلغي التشغيل',
  finishedFirst: 'انتهى التشغيل قبل إيقافه',
  nothingToStop: 'لا يوجد تشغيل جارٍ',
  failedStop: 'تعذّر إيقاف التشغيل',
  lastCancelled: (reason: string) => (reason ? `أُلغي آخر تشغيل: ${reason}` : 'أُلغي آخر تشغيل'),
  catchUpLabel: 'التشغيلات الفائتة',
  catchUpHint: 'ما يحدث للتشغيلات الفائتة أثناء توقف Hermes.',
  catchUpChoices: {
    default: 'استخدام الإعداد الافتراضي',
    run: 'تشغيل مرة واحدة عند العودة',
    skip: 'تخطيها'
  }
}
