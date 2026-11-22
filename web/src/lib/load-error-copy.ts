// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { en } from "@/i18n/en";

/** Fill the `{what}` / `{detail}` placeholders of the "could not load" card copy.
 *  Kept out of the component so the copy shape is testable without rendering. */
export function loadErrorCopy(
  t: { loadFailed?: string; loadFailedDetails?: string },
  what: string,
  detail?: string | null,
): { title: string; details: string | null } {
  const loadFailed = t.loadFailed ?? en.common.loadFailed!;
  const loadFailedDetails = t.loadFailedDetails ?? en.common.loadFailedDetails!;
  return {
    title: loadFailed.replace("{what}", what),
    details: detail ? loadFailedDetails.replace("{detail}", detail) : null,
  };
}
