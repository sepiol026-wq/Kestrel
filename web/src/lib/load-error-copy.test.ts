// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { describe, expect, it } from "vitest";

import { en } from "@/i18n/en";
import { loadErrorCopy } from "./load-error-copy";

describe("loadErrorCopy", () => {
  it("fills the translated template with what failed and the detail line", () => {
    const copy = loadErrorCopy(en.common, en.cron.loadWhat!, "The Hermes service hit an internal error.");
    expect(copy.title).toContain(en.cron.loadWhat!);
    expect(copy.title).not.toContain("{what}");
    expect(copy.title).toContain(en.common.retry);
    expect(copy.details).toContain("internal error");
    expect(copy.details).not.toContain("{detail}");
  });

  it("omits the details line when there is no detail", () => {
    expect(loadErrorCopy(en.common, en.skills.loadWhat!, null).details).toBeNull();
    expect(loadErrorCopy(en.common, en.skills.loadWhat!, "").details).toBeNull();
  });
});
