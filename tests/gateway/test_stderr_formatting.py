# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Regression tests for operator-visible gateway stderr formatting."""

from __future__ import annotations

import logging
import re

from gateway.run import _gateway_stderr_formatter


def test_gateway_stderr_formatter_includes_timestamp() -> None:
    record = logging.LogRecord(
        name="gateway.run",
        level=logging.ERROR,
        pathname=__file__,
        lineno=1,
        msg="delivery failed",
        args=(),
        exc_info=None,
    )

    rendered = _gateway_stderr_formatter().format(record)

    assert re.match(r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}", rendered), rendered
    assert "delivery failed" in rendered
