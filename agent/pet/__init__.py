# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Petdex pet engine — shared core for the CLI, TUI, and desktop surfaces.

Petdex (https://github.com/crafter-station/petdex) is a public gallery of
animated sprite "pets": a ``pet.json`` plus a ``spritesheet.{webp,png}`` of
192×208 px cells (8-col × 9-row Codex atlas, or the older 8-row atlas). This
package is the single source of truth for the feature so the CLI (Python) and
TUI (Ink, via ``tui_gateway``) never duplicate the hard parts: ``constants``
(geometry + :class:`PetState`), ``state`` (activity → state), ``manifest``,
``store`` (on-disk pets), ``render`` (kitty / iTerm2 / sixel / half-blocks).
A pure display concern: no model tool, no prompt/toolset mutation, so zero
effect on prompt caching.
"""

from agent.pet.constants import DEFAULT_SCALE, FRAME_H, FRAME_W, FRAMES_PER_STATE, LOOP_MS, STATE_ROWS, PetState
from agent.pet.state import derive_pet_state

__all__ = ["DEFAULT_SCALE", "FRAMES_PER_STATE", "FRAME_H", "FRAME_W", "LOOP_MS", "STATE_ROWS", "PetState", "derive_pet_state"]
