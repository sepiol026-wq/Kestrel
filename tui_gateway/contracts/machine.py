# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""This machine (``methods_machine.py``): host facts from ``hermes_platform.host.summary``.

Host-level by design: there is no ``profile`` param because the answer is the same for every
profile one backend serves.
"""

from __future__ import annotations

from kestrel_platform.host.products import NvidiaPlatform

from .base import Params, Result
from .registry import method


class MachineInfo(Result):
    """Measured hardware; a key that was not measured is absent."""

    os_family: str | None = None
    os_release: str | None = None
    native_arch: str | None = None
    cpu_model: str | None = None
    ram_gb: int | None = None
    gpu_class: str | None = None
    vendor: str | None = None
    wsl: bool | None = None
    container: bool | None = None


class MachineFactsResult(Result):
    """``machine_kind`` is ``Spark``, ``Mac``, ``PC`` or ``computer``. ``nvidia_platform`` is
    ``products.nvidia_platform()``: ``rtx_spark``, ``dgx_spark``, ``discrete`` or null. ``locale`` is the OS
    account's first UI language, null when the OS has none."""

    machine: MachineInfo
    machine_kind: str
    has_nvidia_gpu: bool
    nvidia_platform: NvidiaPlatform | None = None
    locale: str | None = None


method("machine.facts", params=Params, result=MachineFactsResult,
       doc="Facts about the machine running this backend and its OS account, for the desktop first run.")
