// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export const ruModelMenu = {
  pickDeferred: (model: string) => `${model} применится со следующего сообщения`,
  search: 'Поиск моделей',
  noModels: 'Модели не найдены',
  editModels: 'Изменить модели…',
  followDefault: 'Использовать модель по умолчанию из настроек',
  refreshModels: 'Обновить модели',
  favorites: 'Избранное',
  addFavorite: 'Добавить в избранное',
  removeFavorite: 'Убрать из избранного',
  favoriteShortcut: '⇧ Клик',
  fast: 'Быстрая',
  free: 'бесплатно',
  cacheRead: 'чтение из кэша',
  priceTitle: (input: string, output: string, cache: string) =>
    `Вход ${input}/Mtok · Выход ${output}/Mtok` + (cache ? ` · Чтение из кэша ${cache}/Mtok` : ''),
  localSetup: {
    title: 'Запуск локально · бесплатно, приватно',
    text: (model: string, size: string) => `${model} подходит для этого компьютера · загрузка ${size}`,
    action: 'Настроить'
  },
  limited: 'Лимит',
  limitedUntil: (time: string) => `Лимит до ${time}`,
  limitedTip: (provider: string, time: null | string) =>
    time
      ? `${provider} исчерпал лимит использования. Он сбросится в ${time}; модель на потом можно выбрать уже сейчас.`
      : `${provider} исчерпал лимит использования. Модель на время после сброса можно выбрать уже сейчас.`,
  modelResets: (time: string) => `снова в ${time}`,
  modelLimitedTip: (time: string) =>
    `Эта модель исчерпала собственный лимит и вернётся в ${time}. Остальные модели здесь работают.`,
  usageLeft: (percent: number, time: null | string) =>
    time ? `Осталось ${percent}% · сброс в ${time}` : `Осталось ${percent}%`,
  poolAccounts: (count: number) => `Аккаунтов: ${count}`,
  poolLimited: (limited: number, total: number) => `Лимит у ${limited}/${total} аккаунтов`,
  poolAccount: (number: number) => `Аккаунт ${number}`,
  poolUnknown: 'Данные об использовании недоступны',
  poolUnavailable: 'Войдите снова',
  usageTip: (provider: string) => `${provider} почти исчерпал лимит использования.`,
  usageWindow: (label: string, percent: number, time: null | string) =>
    time ? `${label}: осталось ${percent}%, сброс в ${time}` : `${label}: осталось ${percent}%`
}
