# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Historical takeover publishes source identity before restarting runtimes."""

from kestrel_cli.update_finish import finish_update


def test_successful_historical_completion_stamps_before_restart(tmp_path, monkeypatch):
    from kestrel_cli import source_stamp
    from kestrel_cli import update_cmd

    events = []
    monkeypatch.setattr(update_cmd, "_run_post_update_maintenance", lambda **kwargs: True)
    monkeypatch.setattr(
        source_stamp, "write_source_stamp", lambda root: events.append(("stamp", root)),
    )
    monkeypatch.setattr(
        update_cmd, "_restart_gateway_fleet_after_update",
        lambda plan, gateway_mode: events.append(("restart", plan)) or object(),
    )
    monkeypatch.setattr(
        update_cmd, "_resume_windows_gateways_and_merge_outcome", lambda *args: None,
    )
    monkeypatch.setattr(update_cmd, "_verify_fleet_after_update", lambda *args, **kwargs: None)

    finish_update(
        root=tmp_path,
        assume_yes=True,
        gateway_mode=False,
        pre_update_snapshot_id=None,
        had_desktop_app_before_update=False,
        pre_update_version=None,
        plan=None,
        windows_resume=None,
    )

    assert events == [("stamp", tmp_path), ("restart", None)]
