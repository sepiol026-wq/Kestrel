# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

from kestrel_cli.web_server_gateway import _display_system_platform


def test_windows_11_build_displays_as_windows_11():
    info = _display_system_platform(
        system="Windows",
        release="10",
        version="10.0.26200",
        platform_label="Windows-10-10.0.26200-SP0",
    )

    assert info["os"] == "Windows"
    assert info["os_release"] == "11"
    assert info["os_version"] == "10.0.26200"
    assert info["platform"] == "Windows-11-10.0.26200-SP0"


def test_non_windows_platform_unchanged():
    info = _display_system_platform(
        system="Linux",
        release="6.8.0",
        version="#1 SMP",
        platform_label="Linux-6.8.0-x86_64-with-glibc2.39",
    )

    assert info == {
        "os": "Linux",
        "os_release": "6.8.0",
        "os_version": "#1 SMP",
        "platform": "Linux-6.8.0-x86_64-with-glibc2.39",
    }
