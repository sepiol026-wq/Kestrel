// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { compactNumber } from '@hermes/shared'
import { useLocation, useNavigate } from 'react-router'

import { PanelEmpty } from '@/app/overlays/panel'
import type { ProfileScope } from '@/hermes'
import { useI18n } from '@/i18n'

import type { McpServersController } from '../mcp/use-mcp-servers'

import { ConnectorDialog } from './connector-dialog'
import { invalidatePluginProbe } from './data/keys'
import { localServerName } from './derive'
import { ConnectorDialogMenu } from './dialog-menu'
import type { InstallField } from './local-server-control'
import { LocalAdvanced } from './local-slots'
import { PluginToolsPanel } from './plugin-tools-panel'
import { LocalToolsPanel } from './tools-panel'
import type { ConnectorCardModel } from './types'

export interface LocalConnectorDialogProps {
  card: ConnectorCardModel
  controller: McpServersController
  installFields?: readonly InstallField[]
  installing?: boolean
  onClose: () => void
  onConnect: () => void
  onInstall: (env: Record<string, string>) => void
  onReconnect: () => void
  onRemoveServer: () => void
  profile: ProfileScope
}

export function LocalConnectorDialog({
  card,
  controller,
  installFields,
  installing,
  onClose,
  onConnect,
  onInstall,
  onReconnect,
  onRemoveServer,
  profile
}: LocalConnectorDialogProps) {
  const { t } = useI18n()
  const name = localServerName(card)
  const openPlugins = useOpenPluginsTab()
  const plugin = card.plugin
  const installed = card.ways.local?.installed === true
  const owned = plugin === undefined && installed

  const refreshTools = () => {
    if (plugin === undefined) {
      void controller.runProbe(name)
    } else {
      invalidatePluginProbe(profile, name)
    }
  }

  return (
    <ConnectorDialog
      advanced={owned ? <LocalAdvanced controller={controller} name={name} onRemove={onRemoveServer} /> : undefined}
      card={card}
      cost={localCost(controller, name)}
      installFields={installFields}
      installing={installing}
      menu={<ConnectorDialogMenu onRefreshTools={refreshTools} />}
      onAuthenticate={() => void controller.authenticate(name)}
      onConnect={onConnect}
      onInstall={onInstall}
      onOpenChange={next => {
        if (!next) {
          onClose()
        }
      }}
      onReconnect={onReconnect}
      onServerToggle={next => void controller.setServerEnabled(name, next)}
      open
      tools={
        plugin !== undefined ? (
          <PluginToolsPanel card={card} onOpenPlugins={openPlugins} plugin={plugin} scope={profile} />
        ) : installed ? (
          <LocalToolsPanel card={card} controller={controller} onRemove={onRemoveServer} />
        ) : (
          <PanelEmpty
            description={t.connectorsPage.tools.notInstalledBody}
            icon="plug"
            title={t.connectorsPage.tools.title}
          />
        )
      }
    />
  )
}

function useOpenPluginsTab(): () => void {
  const navigate = useNavigate()
  const { hash, pathname, search } = useLocation()

  return () => {
    const params = new URLSearchParams(search)
    params.set('tab', 'plugins')
    navigate({ hash, pathname, search: `?${params.toString()}` })
  }
}

export function localCost(controller: McpServersController, name: string) {
  const entry = controller.servers[name]

  if (!entry) {
    return undefined
  }

  const cost = controller.costFor(name, entry)

  return {
    tokensPerCall: cost.tokens === null ? undefined : compactNumber(cost.tokens),
    usesPerMonth: cost.uses === null ? undefined : compactNumber(cost.uses)
  }
}
