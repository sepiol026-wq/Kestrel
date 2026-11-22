// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Field, FieldHint } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n'

export interface SetupField {
  name: string
  prompt?: string
  required: boolean
  secret: boolean
  default: string
}

interface SetupFieldListProps {
  fields: SetupField[]
  draft: Record<string, string>
  onChange: (name: string, value: string) => void
  disabled?: boolean
}

export function SetupFieldList({ disabled, draft, fields, onChange }: SetupFieldListProps) {
  const { t } = useI18n()

  return (
    <div className="grid gap-4">
      {fields.map(field => {
        const id = `setup-field-${field.name}`

        return (
          <Field htmlFor={id} key={field.name} label={field.prompt || field.name}>
            <Input
              disabled={disabled}
              id={id}
              onChange={event => onChange(field.name, event.currentTarget.value)}
              type={field.secret ? 'password' : 'text'}
              value={draft[field.name] ?? ''}
            />
            {field.required ? <FieldHint>{t.connectors.required}</FieldHint> : null}
          </Field>
        )
      })}
    </div>
  )
}
