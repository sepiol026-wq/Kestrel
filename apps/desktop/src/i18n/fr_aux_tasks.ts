// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { AuxTaskCopyMap } from './types_aux_tasks'

export const frAuxTasks: AuxTaskCopyMap = {
  vision: {
    label: 'Vision',
    hint: "Analyse d'image"
  },
  compression: {
    label: 'Compression',
    hint: 'Compaction de contexte'
  },
  approval: {
    label: 'Approbation',
    hint: 'Auto-approbation intelligente'
  },
  mcp: {
    label: 'MCP',
    hint: "Routage d'outils MCP"
  },
  title_generation: {
    label: 'Génération de titre',
    hint: 'Titres de session'
  },
  review: {
    label: 'Révision',
    hint: 'Sous-agent de révision /review'
  },
  voice_chat: { label: 'Chat vocal', hint: 'Réponses parlées du mode vocal' },
  triage_specifier: {
    label: 'Précision du triage',
    hint: 'Détail des spécifications Kanban'
  },
  kanban_decomposer: {
    label: 'Décomposition Kanban',
    hint: 'Décomposition des tâches'
  },
  profile_describer: {
    label: 'Description de profil',
    hint: 'Descriptions automatiques des profils'
  },
  curator: {
    label: 'Curateur',
    hint: "Revue d'utilisation des skills"
  }
}
