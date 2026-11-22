# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Bot Desktop: per-profile headless Xfce desktop over RFB, viewed from Hermes Desktop.

``runtime`` owns the Xvnc/Xfce process and the published env; ``lease`` owns who may drive the
screen (agent vs. human); ``rfb_filter`` is the byte-level input gate the WebSocket bridge applies.
"""
