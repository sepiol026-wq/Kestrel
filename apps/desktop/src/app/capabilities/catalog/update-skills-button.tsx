// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Button } from '@/components/ui/button'
import type { ProfileScope } from '@/hermes'
import { useI18n } from '@/i18n'
import { useStoreSelector } from '@/lib/use-session-slice'
import { $hubActions, UPDATE_ALL_KEY, updateHubSkills } from '@/store/hub-actions'
import { notify, notifyError } from '@/store/notifications'

export function UpdateSkillsButton({ profile }: { profile?: ProfileScope }) {
  const { t } = useI18n()
  const h = t.skills.hub
  const updating = useStoreSelector($hubActions, actions => actions[UPDATE_ALL_KEY]?.running ?? false)

  return (
    <Button
      disabled={updating}
      onClick={() => {
        notify({ kind: 'success', title: h.updateStarted, message: h.actionLog })
        void updateHubSkills(profile).catch(err => notifyError(err, h.actionFailed))
      }}
      size="xs"
      variant="text"
    >
      {updating ? h.updating : h.updateAll}
    </Button>
  )
}
