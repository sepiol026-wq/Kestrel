# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Cron job scheduling for Kestrel Agent: scheduled tasks (cron expressions, intervals, one-shot),
self-scheduled reminders, isolated sessions. The gateway daemon (``kestrel gateway [install]``) ticks
the scheduler every 60 seconds; a file lock prevents duplicate execution across processes.
"""

# The restart-safe external worker runs as ``-m cron.scheduler``, which executes this package
# first: boot PM dependencies before ``cron.jobs`` reaches a third-party import. A no-op
# unless ``_launch_external_cron_worker`` marked this process. See cron/worker_bootstrap.py.
from cron.worker_bootstrap import worker_bootstrap as _boot_external_worker

_boot_external_worker()

from cron.jobs import (
    create_job,
    get_job,
    list_jobs,
    remove_job,
    update_job,
    pause_job,
    resume_job,
    trigger_job,
    rearm_oneshot,
    JOBS_FILE,
)
from cron.scheduler import tick

__all__ = [
    "JOBS_FILE",
    "create_job",
    "get_job",
    "list_jobs",
    "pause_job",
    "rearm_oneshot",
    "remove_job",
    "resume_job",
    "tick",
    "trigger_job",
    "update_job",
]
