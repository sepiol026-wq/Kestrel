# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A scripted prelude's tool call id is unique per chat: a rerun of onboarding plays the same name card at the
same place in a new chat, and the desktop keys tool rows by that id."""

from agent.turn_scripted_prelude import prelude_call_id


def test_the_same_card_at_the_same_place_gets_a_different_id_in_another_chat():
    first = prelude_call_id("chat-1", "setup_beat", {"beat": "name"}, 1)

    assert first == prelude_call_id("chat-1", "setup_beat", {"beat": "name"}, 1)
    assert first != prelude_call_id("chat-2", "setup_beat", {"beat": "name"}, 1)
