# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""search_files advertises macOS protected-folder pruning only on the host that prunes."""

import pytest

from tools.file_tools import SEARCH_FILES_SCHEMA


@pytest.mark.platforms("macos")
def test_macos_schema_explains_protected_folder_pruning():
    assert "TCC-protected folders" in SEARCH_FILES_SCHEMA["description"]


@pytest.mark.platforms("not macos")
def test_other_hosts_schema_omits_macos_pruning():
    description = SEARCH_FILES_SCHEMA["description"]
    assert "macOS" not in description and "TCC" not in description
