// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Typography } from "@nous-research/ui/ui/components/typography/index";
import type { StatusResponse } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { PluginSlot } from "@/plugins";

export function SidebarFooter({ status }: SidebarFooterProps) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-2",
        "px-5 py-2.5",
        "border-t border-current/10",
      )}
    >
      <PluginSlot
        name="footer-left"
        fallback={
          <Typography
            className="font-mono-ui text-xs tabular-nums tracking-[0.08em] text-text-tertiary lowercase"
          >
            {status?.version != null ? `v${status.version}` : "—"}
          </Typography>
        }
      />

      <PluginSlot
        name="footer-right"
        fallback={
          <a
            href="https://nousresearch.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "font-sans text-display text-xs tracking-[0.12em] text-midground",
              "inline-flex items-center min-h-[24px]",
              "transition-opacity hover:opacity-90",
              "focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-midground/40",
            )}
          >
            {t.app.footer.org}
          </a>
        }
      />
    </div>
  );
}

interface SidebarFooterProps {
  status: StatusResponse | null;
}
