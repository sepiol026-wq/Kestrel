# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Gateway launch decisions independent of operating-system probes."""

from dataclasses import dataclass
from typing import Literal

RuntimeState = Literal[
    "absent", "starting", "ready", "draining", "incompatible", "inaccessible", "conflict"
]


@dataclass(frozen=True)
class RuntimeObservation:
    state: RuntimeState
    installed_service: bool = False
    service_may_start: bool = False
    update_paused: bool = False


def next_start_action(observation: RuntimeObservation) -> str:
    if observation.update_paused:
        return "wait-update"
    actions = {
        "ready": "attach",
        "starting": "wait-owner",
        "draining": "wait-owner",
        "incompatible": "reject-version",
        "inaccessible": "reject-access",
        "conflict": "reject-conflict",
    }
    if observation.state in actions:
        return actions[observation.state]
    if observation.state != "absent":
        raise ValueError("unknown runtime state")
    if observation.service_may_start:
        return "wait-service"
    return "start-service" if observation.installed_service else "spawn-unmanaged"
