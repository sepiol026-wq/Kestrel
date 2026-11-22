// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

export function normalizeSessionTitle(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const title = raw.trim();
  return title ? title : null;
}

export function titleFromSessionInfoPayload(
  payload: unknown,
): string | null | undefined {
  if (!payload || typeof payload !== "object" || !("title" in payload)) {
    return undefined;
  }

  return normalizeSessionTitle((payload as { title?: unknown }).title);
}
