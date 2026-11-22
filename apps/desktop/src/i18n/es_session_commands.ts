// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

// Typed /undo /retry /steer /queue lines (en_session_commands.ts is the source).
export const esSessionCommands = {
  undoUsage: 'uso: /undo [N]',
  undoNothing: 'nada que deshacer',
  undidOne: (count: string) => `se deshizo ${count} mensaje — el mensaje eliminado está en el compositor`,
  undidOther: (count: string) => `se deshicieron ${count} mensajes — el mensaje eliminado está en el compositor`,
  retryNothing: 'nada que reintentar',
  retryUnsupported: '/retry: no se pueden reintentar contenidos multimedia o partes desconocidas',
  busy: (command: string) =>
    `sesión ocupada — Hermes sigue respondiendo. Detén primero la respuesta actual (botón Detener o Ctrl+C en una terminal) y luego ejecuta /${command}.`,
  busyCompressing: (command: string) =>
    `sesión ocupada — se está ejecutando un /compress; ejecuta /${command} cuando termine.`,
  steerUsage: 'uso: /steer <prompt>',
  steerQueued: (preview: string) => `indicación en cola — llega tras la próxima llamada a herramienta: "${preview}"`,
  steerNoActiveTurn: (preview: string) => `no hay turno activo — en cola para el siguiente: "${preview}"`,
  steerRejected: 'indicación rechazada — no hay turno activo, en cola para el siguiente turno',
  queued: (preview: string) => `en cola: "${preview}"`,
  queueFailed: 'No se pudo poner el mensaje en cola',
  countOne: (count: string) => `${count} mensaje en cola`,
  countOther: (count: string) => `${count} mensajes en cola`,
  queueEditKeptTitle: 'Mensaje en cola sin cambios',
  queueEditKept: 'Empezó o fue rechazado antes de guardar tu edición. Tu texto editado está en el editor.',
  queueEditUnconfirmedTitle: 'Edición sin confirmar',
  queueEditUnconfirmed:
    'Hermes no pudo confirmar tu edición. Guarda de nuevo para reintentar la misma edición; nunca se pone en cola dos veces.'
}
