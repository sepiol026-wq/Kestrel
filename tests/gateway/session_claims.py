# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""Claim an admitted row the way the owner's drain does, for tests that execute it directly.

``execute_admission`` runs a CLAIMED row: the claim stamps the owner epoch and runtime generation
the turn's scope is fenced by. A test that admits and then executes must claim in between.
"""


def claim(authority, ref, row):
    """Claim *row* (the head of *ref*'s FIFO) under *authority*'s epoch; return the claimed row."""
    from kestrel_state_runtime import claim_session_input

    claimed = claim_session_input(authority.db, epoch=authority.epoch, session_id=ref.session_id)
    assert claimed and claimed['admission_id'] == row['admission_id'], (claimed, row)
    return claimed
