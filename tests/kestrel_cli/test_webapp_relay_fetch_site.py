# SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
# Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
# Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
# Derivative work. All upstream attribution and rights retained.

"""A relayed request runs only for the Webapp's own page.

The Webapp's session cookie is ``SameSite=Lax``, so another site's top-level navigation still carries
it; without this check that navigation would make the relay GET a saved gateway with its saved
credential. Contract: a request whose ``Sec-Fetch-Site`` is present and not ``same-origin`` is refused
(403) before anything is sent; the page's own fetches and clients without Fetch Metadata still relay.
"""
import pytest

from tests.kestrel_cli import test_webapp_relay_proxy as relay_tests

webapp = relay_tests.webapp


@pytest.mark.parametrize("site", ["cross-site", "same-site", "none"])
def test_a_request_another_page_made_is_refused_before_it_reaches_the_gateway(webapp, site):
    refused = webapp.browser.get(f"/api/relay/{webapp.id}/api/profiles", headers={"Sec-Fetch-Site": site})
    assert refused.status_code == 403, refused.text
    assert "requests" not in webapp.seen


def test_the_pages_own_fetch_and_a_plain_client_still_relay(webapp):
    own = webapp.browser.get(f"/api/relay/{webapp.id}/api/profiles", headers={"Sec-Fetch-Site": "same-origin"})
    plain = webapp.browser.get(f"/api/relay/{webapp.id}/api/profiles")
    assert (own.status_code, plain.status_code) == (200, 200), (own.text, plain.text)
    assert len(webapp.seen["requests"]) == 2
