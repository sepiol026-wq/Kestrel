// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import{n as e}from"./rolldown-runtime-CbXtAM7H.js";import{h as t,n}from"./react-vendor-R7IuHd60.js";var r=n(),i=e(t(),1);function a(e){let t=(0,r.c)(4),{open:n,onClose:a}=e,o=(0,i.useRef)(null),s,c;return t[0]!==a||t[1]!==n?(s=()=>{if(!n)return;let e=document.activeElement,t=e=>{e.key===`Escape`&&(e.preventDefault(),a())};document.addEventListener(`keydown`,t);let r=document.body.style.overflow;return document.body.style.overflow=`hidden`,()=>{document.removeEventListener(`keydown`,t),document.body.style.overflow=r,e?.focus?.()}},c=[n,a],t[0]=a,t[1]=n,t[2]=s,t[3]=c):(s=t[2],c=t[3]),(0,i.useEffect)(s,c),o}export{a as t};