// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { TranslationOverrides } from './define-locale'

export const esConnectorCard: TranslationOverrides['connectors'] = {
  title: 'Conecta tus apps',
  connect: 'Conectar',
  skip: 'Ahora no',
  cancel: 'Dejar de esperar',
  retry: 'Reintentar',
  grant: 'Volver a conectar',
  connected: 'Conectado',
  checking: 'Comprobando tus apps…',
  notConnected: 'No conectado',
  skipped: 'Omitido',
  disabled: 'No disponible',
  failed: 'No se pudo conectar',
  needsAuth: 'Acceso caducado',
  opening: 'Abriendo el inicio de sesión…',
  waiting: 'Esperando a tu navegador…',
  timeout: 'Seguimos esperando la autorización.',
  refresh: 'Actualizar estado',
  connectError: 'No se pudo iniciar la autorización. Inténtalo de nuevo.',
  connectErrorFor: (app: string) => `No se pudo iniciar la autorización para ${app}.`,
  unavailable: 'Los conectores no están disponibles en esta sesión.',
  ownerMissing: 'Vuelve a abrir esta conversación para gestionar sus conexiones.',
  search: 'Buscar una app',
  empty: 'No hay apps que coincidan',
  disclaimer: 'Conectar es opcional. Autoriza solo las apps que quieras que use Hermes.',
  execution: 'Herramientas de conectores',
  setup: server => `Configurar ${server}`,
  openInBrowser: 'Abrir en el navegador',
  setupCancel: 'Cancelar',
  authorizedToolsUnavailable: 'Autorizado. Herramientas no disponibles.',
  required: 'Obligatorio',
  namedAccount: (app: string, alias: string) => `Hermes llamó ${alias} a esta cuenta de ${app}.`,
  renameAccount: 'Cambiar nombre',
  directory: {
    suggested: 'Sugeridas',
    allApps: 'Todas las apps',
    receiptConnected: apps => `Conectadas: ${apps}`,
    receiptNone: 'Ninguna app nueva conectada',
    receiptTimedOut: 'Cerrado tras 10 minutos',
    finishInBrowser: 'Termina en tu navegador',
    signInFailed: 'No se pudo conectar. Haz clic para reintentar'
  }
}
