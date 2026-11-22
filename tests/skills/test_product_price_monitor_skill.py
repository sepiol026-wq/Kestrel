# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Tests for the product-price-monitor skill's price-watch blueprint."""


def test_price_watch_blueprint_schedule_resolves():
    from cron.blueprint_catalog import CATALOG

    bp = next(b for b in CATALOG if b.key == "price-watch")
    interval_slot = next(s for s in bp.slots if s.name == "interval_h")
    for opt in interval_slot.options:
        expr = bp.schedule_template.format(interval_h=opt)
        fields = expr.split()
        assert len(fields) == 5, f"invalid cron expr: {expr}"
        assert fields[1] == f"*/{opt}"
