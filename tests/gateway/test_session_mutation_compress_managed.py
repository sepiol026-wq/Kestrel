# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Real summary preparation under the managed_workers opt-in: each turn runs out of process."""
import pytest

from tests.gateway.test_session_mutation_compress import run_compress_case


@pytest.mark.parametrize('in_place', [True, False])
def test_managed_compress_preserves_configured_history_and_admission_owner(tmp_path, in_place):
    run_compress_case(tmp_path, 'managed', in_place)
