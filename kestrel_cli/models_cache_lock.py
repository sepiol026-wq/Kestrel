# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Cross-process lock for ``provider_models_cache.json`` read-modify-write.

Parallel prefetch workers, SWR refresh threads and other Kestrel processes (dashboard, desktop,
CLI) all rewrite the one cache file; each write must re-read it under this lock or a slow writer
puts back the snapshot it loaded before its fetch, dropping rows written meanwhile.
"""

import logging
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Callable

logger = logging.getLogger(__name__)

_thread_lock = threading.Lock()
_holder = threading.local()


@contextmanager
def provider_models_cache_lock(path: Path):
    from kestrel_cli.auth import _file_lock
    with _thread_lock, _file_lock(path.with_name(path.name + ".lock"), _holder, 10.0,
                                  f"Timed out waiting for the provider models cache lock ({path})"):
        yield


def write_under_cache_lock(path: Path, write: Callable[[], None]) -> None:
    """Run ``write`` (re-read, set one row, save) under the thread + cross-process lock.

    The file is a cache: an unwritable home or a wedged lock skips the write instead of failing
    the model listing that triggered it."""
    try:
        with provider_models_cache_lock(path):
            write()
    except (OSError, TimeoutError):
        logger.debug("provider models cache write skipped (%s)", path, exc_info=True)
