// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { useMemo } from "react";
import { Markdown } from "@/components/Markdown";
import {
  parseReasoningMarkup,
  type ReasoningMarkupSegment,
} from "@/lib/reasoning-markup";

export function StructuredReasoning({
  content,
  highlightTerms,
}: {
  content: string;
  highlightTerms?: string[];
}) {
  const segments = useMemo(() => parseReasoningMarkup(content), [content]);

  return (
    <div className="space-y-2">
      {segments.map((segment, index) => (
        <ReasoningSegment
          key={index}
          segment={segment}
          highlightTerms={highlightTerms}
        />
      ))}
    </div>
  );
}

function ReasoningSegment({
  segment,
  highlightTerms,
}: {
  segment: ReasoningMarkupSegment;
  highlightTerms?: string[];
}) {
  if (segment.type === "prose") {
    return (
      <Markdown
        content={segment.content.trim()}
        highlightTerms={highlightTerms}
      />
    );
  }

  const label = segment.type === "action" ? "Action" : "Result";

  return (
    <div className="border border-border bg-secondary/40">
      <div className="border-b border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
        {label}
      </div>
      <pre className="px-3 py-2.5 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap text-foreground">
        <code>{segment.content}</code>
      </pre>
    </div>
  );
}
