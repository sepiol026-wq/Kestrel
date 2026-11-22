# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Gateway vision pre-process merges the analysis with the user text."""

import json
from unittest.mock import AsyncMock, patch

import pytest


@pytest.mark.asyncio
async def test_enrich_message_with_vision_merges_analysis_without_output_cap():
    from gateway.run import GatewayRunner

    runner = GatewayRunner.__new__(GatewayRunner)

    with patch(
        "tools.vision_tools.vision_analyze_tool",
        new_callable=AsyncMock,
        return_value=json.dumps({"success": True, "analysis": "A cat on a chair."}),
    ) as mock_vision:
        result = await runner._enrich_message_with_vision(
            user_text="What is happening here?",
            image_paths=["/tmp/cat.png"],
        )

    assert "A cat on a chair." in result
    assert "What is happening here?" in result
    # No output cap is forwarded: per the max-tokens-knob policy the aux
    # client decides token handling; conciseness comes from the prompt.
    assert "max_tokens" not in mock_vision.await_args.kwargs
