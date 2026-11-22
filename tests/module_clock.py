# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""One module's view of ``time`` with a test-driven ``monotonic``.

Patching ``time.monotonic`` itself also moves the running event loop's clock (its timers read the
same function); this swaps only the module's ``time`` binding, so the loop keeps real time."""
import time


class ModuleClock:
    """``time`` for one module, except that ``monotonic()`` returns ``now``."""

    def __init__(self, now: float):
        self.now = now

    def monotonic(self) -> float:
        return self.now

    def __getattr__(self, name):
        return getattr(time, name)


def install_module_clock(monkeypatch, module, *, now: float = 1000.0) -> ModuleClock:
    clock = ModuleClock(now)
    monkeypatch.setattr(module, "time", clock)
    return clock
