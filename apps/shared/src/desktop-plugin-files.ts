// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/** Catalog names are directory names under `plugin-catalog/`; anything else is not a lookup key. */
export const PLUGIN_CATALOG_NAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/

/** Marker inside a materialized desktop half: which agent package it came from. */
export const PACKAGE_MARKER = '.hermes-package.json'

/** Inside a STANDALONE desktop plugin installed from the catalog: which entry it is (`catalogName`, `repo`,
 *  `sha`, and `pin` when a tag pin names a tag object), so the catalog card shows it installed. Unlike the
 *  package marker it pairs the folder with no agent half and leaves it removable. Only an installer writes it
 *  (`hermes_cli/desktop_plugin_halves.py` `INSTALL_ORIGIN` on the Webapp host). */
export const INSTALL_ORIGIN = '.hermes-origin.json'
