// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StructuredReasoning } from "./StructuredReasoning";

describe("StructuredReasoning", () => {
  it("renders thinking prose without literal wrapper tags", () => {
    const html = renderToStaticMarkup(
      <StructuredReasoning content="<thinking>plain prose</thinking>" />,
    );

    expect(html).toContain("plain prose");
    expect(html).not.toContain("&lt;thinking");
    expect(html).not.toContain("&lt;/thinking");
  });

  it("renders action and result as labeled code blocks", () => {
    const html = renderToStaticMarkup(
      <StructuredReasoning content={'<thinking>prose <action>tool_call</action><result>{"ok":true}</result></thinking>'} />,
    );

    expect(html).toContain("prose");
    expect(html).toContain("Action");
    expect(html).toContain("tool_call");
    expect(html).toContain("Result");
    expect(html).toContain("{&quot;ok&quot;:true}");
  });
});
