// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { PtyConnectionState } from "@/lib/pty-reconnect";

/**
 * Hard cap so a wedged resume (never gets PTY payload) cannot leave the
 * wait notice up forever.
 */
export const PTY_RESUME_LOADING_MAX_MS = 30000;

export const PTY_RESUME_LOADING_MESSAGE =
  "Please wait while the conversation loads…";

export interface ResumeLoadingOverlayInput {
  hasResumeTarget: boolean;
  ptyState: PtyConnectionState;
  hydrating: boolean;
}

/**
 * Show a wait notice only while a resumed chat is still blank. Once the
 * first real PTY payload arrives the terminal has something to show, so
 * the notice hides and history can stream in underneath.
 *
 * Reconnect / ended / closed states keep their own overlays and must not
 * stack this one on top.
 */
export function shouldShowResumeLoadingOverlay({
  hasResumeTarget,
  ptyState,
  hydrating,
}: ResumeLoadingOverlayInput): boolean {
  if (!hasResumeTarget || !hydrating) {
    return false;
  }
  if (
    ptyState === "reconnecting" ||
    ptyState === "closed" ||
    ptyState === "ended"
  ) {
    return false;
  }
  return ptyState === "connecting" || ptyState === "open";
}

/** First non-empty PTY chunk means the blank window is over. */
export function shouldFinishResumeHydrationOnChunk(chunkText: string): boolean {
  return chunkText.length > 0;
}
