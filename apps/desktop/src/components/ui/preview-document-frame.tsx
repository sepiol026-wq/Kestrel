// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { type IframeHTMLAttributes, useCallback, useEffect, useRef } from 'react'

import { browserBootstrap, endpointUrl } from '@/lib/browser-transport'
import { isBrowserHostedDesktop } from '@/lib/platform'

interface PreviewDocumentFrameProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  srcDoc: string
}

/** A served preview gets its own CSP; srcdoc would inherit the renderer's. */
export function PreviewDocumentFrame({ srcDoc, sandbox, ...props }: PreviewDocumentFrameProps) {
  const frame = useRef<HTMLIFrameElement>(null)
  const browser = isBrowserHostedDesktop()
  const src = browser ? endpointUrl('/assets/webapp-preview.html', browserBootstrap()?.basePath || '').href : undefined
  const scripts = sandbox === 'allow-scripts'

  const send = useCallback(() => {
    if (browser) {
      frame.current?.contentWindow?.postMessage({ type: 'hermes-preview-document', html: srcDoc, scripts }, '*')
    }
  }, [browser, srcDoc, scripts])

  useEffect(send, [send])

  if (!browser) {
    return <iframe {...props} sandbox={sandbox} srcDoc={srcDoc} />
  }

  return <iframe {...props} onLoad={send} ref={frame}
    referrerPolicy="no-referrer" sandbox="allow-scripts" src={src} />
}
