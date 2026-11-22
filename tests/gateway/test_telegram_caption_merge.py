# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for TelegramPlatform._merge_caption caption deduplication logic."""


from plugins.platforms.telegram.adapter import TelegramAdapter

merge = TelegramAdapter._merge_caption


class TestMergeCaptionBasic:
    def test_no_existing_text(self):
        assert merge(None, "Hello") == "Hello"


class TestMergeCaptionSubstringBug:
    """These are the exact scenarios that the old substring check got wrong."""

    def test_shorter_caption_not_dropped_when_substring(self):
        # Bug: "Meeting" in "Meeting agenda" → True → caption was silently lost
        result = merge("Meeting agenda", "Meeting")
        assert result == "Meeting agenda\n\nMeeting"


class TestMergeCaptionWhitespace:
    def test_trailing_space_treated_as_duplicate(self):
        assert merge("Revenue", "Revenue  ") == "Revenue"


class TestMergeCaptionMultipleItems:
    def test_three_unique_captions_all_present(self):
        text = merge(None, "A")
        text = merge(text, "B")
        text = merge(text, "C")
        assert text == "A\n\nB\n\nC"


