# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Shared channel warning boundary: policy, actual receipt, and stream isolation."""
import json
from unittest.mock import AsyncMock

import pytest
from gateway.platforms.base import SendResult
from tests.gateway.test_session_hygiene import HygieneCaptureAdapter


@pytest.mark.asyncio
@pytest.mark.parametrize("setting", [None, False, True])
async def test_emit_warning_preserves_transport_receipt_and_input_metadata(tmp_path, monkeypatch, setting):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    monkeypatch.setenv("HERMES_MANAGED_DIR", str(tmp_path / "managed"))
    cfg = {} if setting is None else {"display": {"suppress_warning_notifications": setting}}
    (tmp_path / "config.yaml").write_text(json.dumps(cfg))
    adapter = HygieneCaptureAdapter()
    failure = SendResult(success=False, error="fixture transport rejection")
    adapter.send = AsyncMock(return_value=failure)
    metadata = {"thread_id": "123"}
    result = await adapter.emit_warning("chat", "diagnostic", reply_to="456", metadata=metadata)
    assert metadata == {"thread_id": "123"}
    if setting is True:
        assert result is None  # explicitly not a successful transport receipt
        adapter.send.assert_not_awaited()
    else:
        assert result is failure
        assert adapter.send.await_args.kwargs["metadata"] == {"thread_id": "123"}
        assert adapter.send.await_args.kwargs["reply_to"] == "456"


@pytest.mark.asyncio
async def test_emit_warning_uses_logical_override_and_does_not_swallow_send_error(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    monkeypatch.setenv("HERMES_MANAGED_DIR", str(tmp_path / "managed"))
    (tmp_path / "config.yaml").write_text(json.dumps({"display": {
        "suppress_warning_notifications": True,
        "platforms": {"slack": {"suppress_warning_notifications": False}}}}))
    adapter = HygieneCaptureAdapter()
    adapter.send = AsyncMock(side_effect=RuntimeError("fixture transport failure"))
    with pytest.raises(RuntimeError, match="fixture transport failure"):
        await adapter.emit_warning("chat", "diagnostic", logical_platform="slack")
