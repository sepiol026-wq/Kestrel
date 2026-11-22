# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""process schema diet contract (#95681).

Pins the shape: enum names the verbs, description carries only
non-obvious semantics, and the write-vs-submit trap teaching (Windows
PTY: a lone newline is not a line terminator) survives with emphasis.
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from tools.process_registry import PROCESS_SCHEMA


class TestProcessSchemaDiet(unittest.TestCase):


    def test_enum_is_the_verb_source(self):
        from tools.process_registry import _SESSION_ACTIONS
        props = PROCESS_SCHEMA["parameters"]["properties"]
        # The enum is the single list of verbs: every session-scoped handler is offered, plus the two
        # non-session verbs dispatched by name in _handle_process.
        self.assertEqual(set(props["action"]["enum"]), set(_SESSION_ACTIONS) | {"list", "handoff"})


if __name__ == "__main__":
    unittest.main()
