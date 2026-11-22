# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

# Bundled web search providers: plugins/web/<name>/{plugin.yaml, __init__.py, provider.py}
# (image_gen plugin layout). They auto-load via kind: backend and register via
# ctx.register_web_search_provider() into agent.web_search_registry.
