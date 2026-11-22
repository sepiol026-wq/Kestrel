# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A re-pin that adds a desktop half is a widened surface whichever layout the half uses.

The installers accept ``plugin.js`` at the package root as well as under ``desktop/``; the re-pin
consent check reads the same rule, so a root-layout half added by a new commit is not waved through.
"""

from pathlib import Path

import pytest

from kestrel_cli.plugins_cmd_catalog import plugin_surface, surface_delta


@pytest.mark.parametrize("entry", ["plugin.js", "desktop/plugin.js"])
def test_new_desktop_half_widens_the_surface_in_either_layout(tmp_path: Path, entry: str):
    old, new = tmp_path / "old", tmp_path / "new"
    for tree in (old, new):
        tree.mkdir()
        (tree / "plugin.yaml").write_text("name: demo\n")
    (new / entry).parent.mkdir(parents=True, exist_ok=True)
    (new / entry).write_text("export default {}\n")

    delta = surface_delta(plugin_surface({"name": "demo"}, old), plugin_surface({"name": "demo"}, new))

    assert delta.get("desktop") == [entry]


@pytest.mark.parametrize(("before", "after"), [("plugin.js", "desktop/plugin.js"), ("desktop/plugin.js", "plugin.js")])
def test_moving_an_existing_desktop_half_between_layouts_widens_nothing(tmp_path: Path, before: str, after: str):
    old, new = tmp_path / "old", tmp_path / "new"
    for tree, entry in ((old, before), (new, after)):
        (tree / entry).parent.mkdir(parents=True, exist_ok=True)
        (tree / "plugin.yaml").write_text("name: demo\n")
        (tree / entry).write_text("export default {}\n")

    assert surface_delta(plugin_surface({"name": "demo"}, old), plugin_surface({"name": "demo"}, new)) == {}
