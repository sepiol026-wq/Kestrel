# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Guard test for the MEDIA:<path> caption chokepoint (_media_caption_split).

`hermes send` strips the MEDIA: tag and leaves the remaining prose as the
accompanying text. Historically every standalone sender posted that text as a
*separate* message before an uncaptioned media bubble, splitting
``hermes send --to whatsapp "MEDIA:/x.png This Caption"`` into two parts.

`_media_caption_split` is the single enforced decision point that all standalone
senders (WhatsApp, Telegram, Discord) consult to decide whether the text should
ride on the media bubble as a native caption. This test pins that contract so
the platforms can't diverge.
"""

from tools.send_message_tool import _DEFAULT_CAPTION_LIMIT, _media_caption_split
from plugins.platforms.telegram.standalone import _TELEGRAM_CAPTION_LIMIT


def test_single_image_short_text_becomes_caption():
    caption, body = _media_caption_split(
        "This Caption", [("/tmp/F22.png", False)], max_caption_len=_DEFAULT_CAPTION_LIMIT
    )
    assert caption == "This Caption"
    assert body == ""


def test_multi_file_keeps_separate_body():
    text = "two photos"
    caption, body = _media_caption_split(
        text,
        [("/tmp/a.png", False), ("/tmp/b.png", False)],
        max_caption_len=_DEFAULT_CAPTION_LIMIT,
    )
    assert caption is None
    assert body == text


def test_unknown_extension_keeps_separate_body():
    # A non-captionable kind (e.g. an audio note that isn't flagged voice)
    text = "some audio"
    caption, body = _media_caption_split(
        text, [("/tmp/song.mp3", False)], max_caption_len=_DEFAULT_CAPTION_LIMIT
    )
    assert caption is None
    assert body == text
