// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * Collapse state for the desktop chat side panel (model + sessions),
 * persisted in localStorage so the choice survives reloads.
 *
 * Pure helpers so ChatPage stays under its FILE_LINES cap and the
 * persistence stays testable without React.
 */

const CHAT_PANEL_COLLAPSED_KEY = "hermes-chat-panel-collapsed";

/** The panel's collapsed flag remembered from the previous visit. */
export function readChatPanelCollapsed(): boolean {
  return localStorage.getItem(CHAT_PANEL_COLLAPSED_KEY) === "1";
}

/** Flip the collapsed flag and persist the new choice. */
export function toggleChatPanelCollapsed(previous: boolean): boolean {
  const next = !previous;
  localStorage.setItem(CHAT_PANEL_COLLAPSED_KEY, next ? "1" : "0");
  return next;
}
