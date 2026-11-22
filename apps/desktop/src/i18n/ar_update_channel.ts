// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export const arUpdateChannel = {
  title: 'قناة التحديث',
  description: 'المستقر يثبّت الإصدارات المنشورة فقط. «كل التزام» يتبع فرع main مع وصول التغييرات.',
  stable: 'الإصدارات المستقرة',
  main: 'كل التزام',
  stableConfirmTitle: 'التبديل إلى الإصدارات المستقرة؟',
  stableConfirmBody:
    'سينتقل Hermes إلى أحدث إصدار منشور، وقد يكون أقدم من الكود الذي تشغّله الآن. قد لا تُقرأ البيانات التي كتبها كود أحدث بشكل صحيح، لذا انسخها احتياطيًا أولًا.',
  stableConfirm: 'التبديل إلى المستقر',
  failed: 'تعذّر تغيير قناة التحديث',
  detailsLabel: 'القناة',
  branch: (b: string) => `الفرع: ${b}`,
  change: 'تغيير',
  latestRelease: (v: string) => `أنت على أحدث إصدار مستقر (${v}).`,
  rollbackTitle: (v: string) => `العودة إلى الإصدار المستقر ${v}`,
  rollbackBody: (v: string) => `هذا الإصدار أحدث من الإصدار المستقر ${v}. سيعيد التثبيت Hermes إلى ذلك الإصدار.`,
  heldBody: (v: string) =>
    `هذا الإصدار أحدث من الإصدار المستقر ${v}، وجلساتك تستخدم بالفعل بيئة البوابة الخاصة به التي لا يستطيع ${v} فتحها. سيبقى Hermes على هذا الإصدار حتى يصدر إصدار مستقر أحدث.`,
  rollbackAction: (v: string) => `العودة إلى ${v}`,
  allChanges: 'عرض كل التغييرات'
}
