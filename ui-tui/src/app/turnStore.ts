// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'
import { useSyncExternalStore } from 'react'

import { isTodoDone } from '../lib/liveProgress.js'
import type { ActiveTool, ActivityItem, Msg, SubagentProgress, TodoItem } from '../types.js'

const buildTurnState = (): TurnState => ({
  activity: [],
  outcome: '',
  reasoning: '',
  reasoningActive: false,
  reasoningStreaming: false,
  reasoningTokens: 0,
  streamPendingTools: [],
  streamSegments: [],
  streaming: '',
  subagents: [],
  todoCollapsed: false,
  todos: [],
  toolTokens: 0,
  tools: [],
  turnTrail: []
})

export const $turnState = atom<TurnState>(buildTurnState())

export const getTurnState = () => $turnState.get()

const subscribeTurn = (cb: () => void) => $turnState.listen(() => cb())

export const useTurnSelector = <T>(selector: (state: TurnState) => T): T =>
  useSyncExternalStore(
    subscribeTurn,
    () => selector($turnState.get()),
    () => selector($turnState.get())
  )

export const patchTurnState = (next: Partial<TurnState> | ((state: TurnState) => TurnState)) =>
  $turnState.set(typeof next === 'function' ? next($turnState.get()) : { ...$turnState.get(), ...next })

export const toggleTodoCollapsed = () => patchTurnState(state => ({ ...state, todoCollapsed: !state.todoCollapsed }))

export const archiveDoneTodos = () => archiveTodosAtTurnEnd()

export const archiveTodosAtTurnEnd = () => {
  const state = $turnState.get()

  if (!state.todos.length) {
    return []
  }

  const done = isTodoDone(state.todos)

  const msg: Msg = {
    kind: 'trail',
    role: 'system',
    text: '',
    todos: state.todos,
    ...(done ? { todoCollapsedByDefault: true } : { todoIncomplete: true })
  }

  patchTurnState({ todoCollapsed: false, todos: [] })

  return [msg]
}

export const resetTurnState = () => $turnState.set(buildTurnState())

export interface TurnState {
  activity: ActivityItem[]
  outcome: string
  reasoning: string
  reasoningActive: boolean
  reasoningStreaming: boolean
  reasoningTokens: number
  streamPendingTools: string[]
  streamSegments: Msg[]
  streaming: string
  subagents: SubagentProgress[]
  todoCollapsed: boolean
  todos: TodoItem[]
  toolTokens: number
  tools: ActiveTool[]
  turnTrail: string[]
}
