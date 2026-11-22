// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { PluginPreviewAccessTranslations } from './types_plugin_preview_access'

/** Copy for the preview-script consent prompt and the per-plugin grant list (Capabilities ▸ Plugins). */
export const arPluginPreviewAccess: PluginPreviewAccessTranslations = {
  previewScriptPromptTitle: (plugin: string) => `هل تسمح لـ ${plugin} بتشغيل نصوص برمجية على هذه الصفحة؟`,
  previewScriptPromptBody: (plugin: string, origin: string) =>
    `يريد ${plugin} تشغيل JavaScript في متصفح المعاينة على ${origin}.`,
  previewScriptPromptRisk: 'يمكن للنصوص البرمجية قراءة كل شيء على ذلك الموقع وتغييره، بما في ذلك صفحات الحسابات التي سجّلت الدخول إليها هناك.',
  previewScriptPromptRevokeHint: 'ينطبق على هذا الموقع فقط. يمكنك إلغاؤه من المهارات ▸ الإضافات.',
  previewScriptAllow: 'السماح على هذا الموقع',
  previewScriptDeny: 'عدم السماح',
  previewScriptAccessLabel: 'نصوص الصفحة',
  previewScriptAccessNone: 'يسأل قبل تشغيل النصوص البرمجية على أي صفحة',
  previewScriptRevoke: (origin: string) => `إلغاء الوصول إلى ${origin}`,
  previewScriptRevoked: (plugin: string, origin: string) => `لم يعد بإمكان ${plugin} تشغيل نصوص برمجية على ${origin}.`,
  previewScriptRevokeUnsaved: (plugin: string, origin: string) =>
    `تعذّر حفظ هذا التغيير، لذا يسري فقط حتى إعادة تشغيل Hermes. ${plugin} محظور على ${origin} في الوقت الحالي.`
}
