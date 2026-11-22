# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

import re

from kestrel_cli.session_export_html import _generate_messages_html

def test_role_is_escaped_in_html_export():
    messages = [
        {
            "role": "<img src=x onerror=alert(document.domain)>",
            "content": "hello",
            "timestamp": 1700000000,
        }
    ]

    html = _generate_messages_html(messages)

    assert "<img src=x onerror=alert(document.domain)>" not in html
    assert "&lt;img src=x onerror=alert(document.domain)&gt;" in html
    # The class attribute must remain a single, well-formed token: a crafted
    # role must not break out of it nor split into several unintended classes.
    class_value = re.search(r'class="(message message-[^"]*active)"', html)
    assert class_value is not None
    assert " message-" in class_value.group(1)  # exactly one message-<role> class
    assert class_value.group(1).count("message-") == 1
