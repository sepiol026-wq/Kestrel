# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Shared leaf helpers for the ``kestrel update`` modules (no Kestrel imports; no cycle)."""

import logging
import sys
from contextlib import contextmanager

# Log-record parity with the origin module.
logger = logging.getLogger("hermes_cli.update_cmd")


def _record_stop(reason: str, *, without_receipt: str | None = None) -> None:
    """Name the exit about to stop this update as one closed token (see update_receipt.record_stop_reason).

    ``without_receipt`` (``refused``/``failed``) is for an exit that fires before the receipt
    opens: a metrics row only. The receipt module is read from ``sys.modules``, never imported:
    an older updater can load this tree after the swap while its own, older ``update_receipt``
    (without these calls) stays loaded.
    """
    receipt = sys.modules.get("hermes_cli.update_receipt")
    if without_receipt is None:
        record = getattr(receipt, "record_stop_reason", None)
        if record is not None:
            record(reason)
    elif (record := getattr(receipt, "record_stop_without_receipt", None)) is not None:
        record(reason, without_receipt)


@contextmanager
def _best_effort(message: str):
    """Run a non-critical update step; swallow ``Exception`` and log it at debug.

    The updater must never die on bookkeeping (receipt, notices, cache seeds):
    ``message`` is the ``%s``-style debug line the inline ``try/except`` used.
    """
    try:
        yield
    except Exception as exc:
        logger.debug(message, exc)
