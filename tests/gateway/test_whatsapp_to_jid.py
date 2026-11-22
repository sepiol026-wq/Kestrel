# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Unit tests for gateway.whatsapp_identity.to_whatsapp_jid.

``to_whatsapp_jid`` is the outbound inverse of
``normalize_whatsapp_identifier``: it builds the bridge-safe JID a send
must use. Baileys' ``jidDecode`` crashes on a bare phone number (#8637),
so every outbound target must be rewritten to ``<digits>@s.whatsapp.net``
before it reaches the bridge.
"""

import pytest

from gateway.whatsapp_identity import to_whatsapp_jid


class TestToWhatsappJid:
    @pytest.mark.parametrize(
        "raw,expected",
        [
            # bare phone numbers → user JID
            ("+50766715226", "50766715226@s.whatsapp.net"),
            ("50766715226", "50766715226@s.whatsapp.net"),
            # human-formatted phone numbers get stripped to digits
            ("+1 (555) 123-4567", "15551234567@s.whatsapp.net"),
            ("+1.555.123.4567", "15551234567@s.whatsapp.net"),
        ],
    )
    def test_bare_phone_becomes_user_jid(self, raw, expected):
        assert to_whatsapp_jid(raw) == expected

    @pytest.mark.parametrize(
        "jid",
        [
            "50766715226@s.whatsapp.net",  # already a user JID
            "123456789-987654321@g.us",    # group JID
            "130631430344750@lid",         # linked identity
            "status@broadcast",            # broadcast pseudo-chat
            "123@newsletter",              # channel/newsletter
        ],
    )
    def test_fully_qualified_jid_passes_through(self, jid):
        assert to_whatsapp_jid(jid) == jid


