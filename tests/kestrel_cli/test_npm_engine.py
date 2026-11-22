# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""The frozen npm retry import hands off, never provisioning in the old parent."""

import pytest

from kestrel_cli.npm_engine import maybe_repair_npm_engine
from tests.compat.old_updater_support import (
    fresh_child as fresh_child,  # noqa: PLC0414 -- the self-alias is load-bearing: it suppresses F811 for the pytest fixture parameter shadowing this import
    no_external_work as no_external_work,  # noqa: PLC0414 -- the self-alias is load-bearing: it suppresses F811 for the pytest fixture parameter shadowing this import
)


@pytest.mark.parametrize("quiet,output", [(True, "EBADENGINE"), (False, "unrelated failure")])
def test_retired_retry_handoffs_without_provisioning(fresh_child, quiet, output):
    with fresh_child.exits():
        maybe_repair_npm_engine("/caller-owned/npm", output, quiet=quiet)
