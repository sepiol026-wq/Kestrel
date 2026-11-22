# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

# shellcheck shell=sh
# Installed as /etc/profile.d/hermes.sh. Debian's /etc/profile resets PATH for
# every login shell (`bash -l`, `docker exec <c> bash -l`, ssh, the terminal
# tool's background `bash -lic`), dropping the image's ENV PATH dirs, so bare
# `hermes` exits 127 there. Put them back in the ENV PATH order; dirs a login
# PATH already lists keep their position.
for __hermes_p in /opt/data/.local/bin /opt/hermes/.venv/bin /opt/hermes/bin; do
    case ":$PATH:" in
        *":$__hermes_p:"*) ;;
        *) PATH="$__hermes_p:$PATH" ;;
    esac
done
unset __hermes_p
export PATH
