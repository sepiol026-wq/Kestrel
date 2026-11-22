# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Loopback peer with explicit SSE usage for per-admission accounting probes."""
import json

from tests.gateway.fixtures.shared_authority_peer import ModelPeer


class UsageModelPeer(ModelPeer):
    def do_POST(self):
        output = self.wfile

        class StreamUsage:
            def write(self, data):
                if data == b'data: [DONE]\n\n':
                    chunk = {'id': 'chatcmpl-local', 'object': 'chat.completion.chunk',
                             'model': 'local-wire-stub', 'created': 1, 'choices': [],
                             'usage': {'prompt_tokens': 10, 'completion_tokens': 5, 'total_tokens': 15}}
                    output.write(('data: ' + json.dumps(chunk) + '\n\n').encode())
                return output.write(data)

            def flush(self):
                output.flush()

        self.wfile = StreamUsage()
        try:
            super().do_POST()
        finally:
            self.wfile = output
