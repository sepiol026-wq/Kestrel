# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""``terminal.client_env_passthrough`` (a shell client's extra toolchain names) is a registered key."""
import os
from unittest.mock import patch

from kestrel_cli.config import DEFAULT_CONFIG, load_config, save_config


def test_default_and_user_list_round_trip(tmp_path):
    from agent.session_client_env import configured_names
    from kestrel_cli.config import _validate_config_key
    assert DEFAULT_CONFIG["terminal"]["client_env_passthrough"] == []
    assert _validate_config_key("terminal.client_env_passthrough") == (True, None)
    names = ["GEM_HOME", "POETRY_HOME"]
    with patch.dict(os.environ, {"HERMES_HOME": str(tmp_path)}):
        assert load_config()["terminal"]["client_env_passthrough"] == []
        (tmp_path / "config.yaml").write_text("terminal:\n  client_env_passthrough: [GEM_HOME, POETRY_HOME]\n")
        config = load_config()
        assert config["terminal"]["client_env_passthrough"] == names
        assert configured_names(config) == set(names)
        save_config(config)
        assert load_config()["terminal"]["client_env_passthrough"] == names
