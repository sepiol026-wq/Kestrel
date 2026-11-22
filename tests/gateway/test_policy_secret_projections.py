# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

import json
from dataclasses import asdict
from types import SimpleNamespace


def test_terminal_and_config_secret_projections_recover_without_durable_values(tmp_path, monkeypatch):
    from gateway.session_policy import build_policy, bind_launch_key, policy_scope
    from tools.terminal_scope import terminal_env
    monkeypatch.setenv('HERMES_HOME', str(tmp_path))
    secret = 'opaque-terminal-header-secret'
    cfg = {'terminal': {'docker_env': {'UNCLASSIFIED': secret}},
           'providers': {'fixture': {'extra_headers': {'X-Custom-Auth': secret}}}}
    (tmp_path / 'config.yaml').write_text(json.dumps(cfg))
    (tmp_path / '.env').write_text('TERMINAL_SERVICE_TOKEN=' + secret + '\n')
    private = {}
    policy = build_policy({'cwd': str(tmp_path), 'model': 'frozen'}, cfg, private_secrets=private)
    def owner():
        return SimpleNamespace(db=SimpleNamespace(db_path=tmp_path / 'state.db'),
                               profile_id='owned', instance_id='instance', epoch=1)
    policy = bind_launch_key(owner(), 'session', policy, None, config_secrets=private)
    assert secret not in json.dumps(asdict(policy))
    assert policy.config(owner()) == cfg
    with policy_scope(policy, authority=owner()):
        assert json.loads(terminal_env('TERMINAL_DOCKER_ENV'))['UNCLASSIFIED'] == secret
        assert terminal_env('TERMINAL_SERVICE_TOKEN') == secret
