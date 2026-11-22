// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { fuzzyScoreMulti } from "@hermes/shared";

/**
 * True when `trimmedQuery` located the selected provider by name/slug but
 * matches none of its models by id — the case where a single search box
 * filtering both the provider and model columns would otherwise leave the
 * model pane empty even though the user just successfully found the
 * provider they were looking for.
 */
export function queryMatchesProviderOnly(
  selectedProvider: { name: string; slug: string } | null,
  models: readonly string[],
  trimmedQuery: string,
): boolean {
  if (!trimmedQuery || !selectedProvider) return false;

  const matchesProvider =
    fuzzyScoreMulti(`${selectedProvider.name} ${selectedProvider.slug}`, trimmedQuery) !=
    null;
  const matchesAnyModel = models.some((m) => fuzzyScoreMulti(m, trimmedQuery) != null);

  return matchesProvider && !matchesAnyModel;
}
