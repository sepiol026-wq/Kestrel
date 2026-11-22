# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""UI sink gating never suppresses the producer or interprets its return value."""
import pytest
from gateway import warning_notifications as policy


@pytest.mark.parametrize("setting", [None, False, True])
@pytest.mark.parametrize("diagnostic", [False, True])
def test_render_notification_calls_renderer_only_when_visible(setting, diagnostic):
    cfg = {} if setting is None else {"display": {"suppress_warning_notifications": setting}}
    observed = ["producer ran"]
    def renderer():
        observed.append("rendered")
        return False  # not a delivery receipt
    presented = policy.render_notification(renderer, platform="cli", user_config=cfg, diagnostic=diagnostic)
    expected = not (diagnostic and setting is True)
    assert presented is expected
    assert observed == (["producer ran", "rendered"] if expected else ["producer ran"])


def test_render_failure_propagates_and_requested_result_does_not_read_policy(monkeypatch):
    def fail():
        raise RuntimeError("renderer failed")
    monkeypatch.setattr(policy, "warning_notifications_enabled", lambda *a: pytest.fail("must not consult policy for result"))
    with pytest.raises(RuntimeError, match="renderer failed"):
        policy.render_notification(fail, platform="tui", diagnostic=False)
