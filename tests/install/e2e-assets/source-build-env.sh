#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyright (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

# OLD and NEW must stamp the checked-out source, not the CI driver's ref.
# A subshell preserves the workflow's identity and the git URL redirect.
source_build_env() (
  unset GITHUB_SHA GITHUB_REF GITHUB_REF_NAME GITHUB_HEAD_REF GITHUB_BASE_REF
  unset HERMES_BUILD_COMMIT HERMES_PAYLOAD_TAG HERMES_PAYLOAD_VERSION HERMES_DESKTOP_VARIANT
  "$@"
)