// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import type { SessionImportResponse } from "@/lib/api";

export type ImportableSession = Record<string, unknown>;

function normalizeImportSessions(value: unknown): ImportableSession[] {
  const candidate =
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Array.isArray((value as { sessions?: unknown }).sessions)
      ? (value as { sessions: unknown[] }).sessions
      : Array.isArray(value)
        ? value
        : [value];

  const sessions = candidate.filter(
    (item): item is ImportableSession =>
      !!item && typeof item === "object" && !Array.isArray(item),
  );
  if (sessions.length !== candidate.length) {
    throw new Error("Expected exported session JSON or JSONL");
  }
  return sessions;
}

export function parseImportSessions(text: string): ImportableSession[] {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("File is empty");

  try {
    return normalizeImportSessions(JSON.parse(trimmed));
  } catch (jsonError) {
    const lines = trimmed.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length <= 1) throw jsonError;
    return normalizeImportSessions(lines.map((line) => JSON.parse(line)));
  }
}

export function importSummary(result: SessionImportResponse): string {
  const parts = [`${result.imported} imported`];
  if (result.skipped > 0) parts.push(`${result.skipped} skipped`);
  if (result.detached > 0) {
    parts.push(`${result.detached} detached from missing parents`);
  }
  return parts.join("; ");
}
