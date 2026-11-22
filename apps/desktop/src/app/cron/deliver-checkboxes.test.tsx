// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Field } from '@/components/ui/field'
import { en } from '@/i18n/en'

import { DeliverCheckboxes } from './index'

afterEach(cleanup)

// Regression for the delivery-target group losing its accessible name: `Field`
// renders the visible label as `<label htmlFor>`, which only associates with
// labelable elements (input, select, ...) — not a `div[role="group"]`. The
// group must pick up the label via `aria-labelledby` instead.
describe('DeliverCheckboxes accessible name', () => {
  it('exposes the Field label as the group name', () => {
    render(
      <Field htmlFor="cron-deliver" label={en.cron.deliverLabel}>
        <DeliverCheckboxes
          c={en.cron}
          id="cron-deliver"
          onChange={() => {}}
          targets={[{ home_env_var: null, home_target_set: true, id: 'local', name: 'This desktop' }]}
          value="local"
        />
      </Field>
    )

    expect(screen.getByRole('group', { name: en.cron.deliverLabel })).toBeTruthy()
  })
})
