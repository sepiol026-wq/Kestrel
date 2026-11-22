# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Explicit two-checkout native client/runtime compatibility probe option."""


def pytest_addoption(parser):
    parser.addoption("--client-test-runtime-root", default=None,
                     help="Checkout used only for the disposable gateway peer in CLI native tests")
