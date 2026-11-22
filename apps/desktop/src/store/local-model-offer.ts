// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { atom } from 'nanostores'

import { readKey } from '@/lib/storage'

/** Install-level: the local-model offer opens at most once per install, and a dismiss is final. */
export const LOCAL_MODEL_OFFERED_KEY = 'hermes.desktop.firstRun.localModelOffered.v1'
/** When the offer's settle wait started, so a restart before it opens resumes the wait. */
export const LOCAL_MODEL_PENDING_KEY = 'hermes.desktop.firstRun.localModelPendingFrom.v1'

/** The local-model offer after onboarding is armed and not answered yet (false once this machine reads
 *  as unable to run a local model). The sign-in offer waits for it: the local-model offer comes first. */
export const $localModelOfferPending = atom(
  Boolean(readKey(LOCAL_MODEL_PENDING_KEY)) && !readKey(LOCAL_MODEL_OFFERED_KEY)
)
