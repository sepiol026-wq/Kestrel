// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Install targets shared by the public docs galleries and native catalog. */
export interface SkillCatalogTarget {
  name: string
  source: string
  identifier?: string
  installIdentifier?: string
}

export function skillCatalogInstallIdentifier(skill: SkillCatalogTarget): string | null {
  if (skill.installIdentifier) {
    return skill.installIdentifier
  }

  const identifier = skill.identifier

  // Older snapshots omit identifiers for local skills. Optional skills have a
  // source-qualified name lookup; bundled skills are not in that source.
  if (!identifier) {
    return skill.source === 'built-in' ? null : skill.source === 'optional' ? `official/${skill.name}` : skill.name
  }

  return skill.source.toLowerCase() === 'clawhub' && !identifier.startsWith('clawhub/')
    ? `clawhub/${identifier}`
    : identifier
}

export function skillCatalogInstallUrl(skill: SkillCatalogTarget): string | null {
  const identifier = skillCatalogInstallIdentifier(skill)

  return identifier ? `hermes://skill/install?${new URLSearchParams({ identifier })}` : null
}

export function pluginCatalogInstallUrl(plugin: { name: string }): string {
  return `hermes://plugin/install?${new URLSearchParams({ catalog: plugin.name })}`
}
