// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export const ruUpdateChannel = {
  title: 'Канал обновлений',
  description:
    'Стабильный устанавливает только опубликованные релизы. «Каждый коммит» следует за веткой main по мере изменений.',
  stable: 'Стабильные релизы',
  main: 'Каждый коммит',
  stableConfirmTitle: 'Перейти на стабильные релизы?',
  stableConfirmBody:
    'Hermes перейдёт на последний опубликованный релиз, который может быть старше текущего кода. Данные, записанные более новым кодом, могут читаться неправильно, поэтому сначала сделайте резервную копию.',
  stableConfirm: 'Перейти на стабильный',
  failed: 'Не удалось изменить канал обновлений',
  detailsLabel: 'Канал',
  branch: (b: string) => `Ветка: ${b}`,
  change: 'Изменить',
  latestRelease: (v: string) => `У вас последний стабильный релиз (${v}).`,
  rollbackTitle: (v: string) => `Вернуться к стабильному релизу ${v}`,
  rollbackBody: (v: string) => `Эта сборка новее стабильного релиза ${v}. Установка вернёт Hermes к этому релизу.`,
  heldBody: (v: string) =>
    `Эта сборка новее стабильного релиза ${v}, и ваши сессии уже используют её среду шлюза, которую ${v} не может открыть. Hermes останется на этой сборке до выхода нового стабильного релиза.`,
  rollbackAction: (v: string) => `Вернуться к ${v}`,
  allChanges: 'Все изменения'
}
