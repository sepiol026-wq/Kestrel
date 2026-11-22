// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Receipt returned by the dashboard's POST /api/profiles endpoint. */
export interface ProfileCreateResponse {
  ok: boolean;
  name: string;
  path: string;
  model_set?: boolean;
  warnings?: string[];
  mcp_written?: number;
  skills_disabled?: number;
  hub_installs?: Array<{ identifier: string; pid: number | null }>;
}
