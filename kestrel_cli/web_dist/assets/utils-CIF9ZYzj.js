// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import{H as e,U as t}from"./ui-DA12QuKg.js";function n(...n){return e(t(n))}var r=`font-mondwest normal-case`;function i(e){let t=Date.now()/1e3-e;return t<60?`just now`:t<3600?`${Math.floor(t/60)}m ago`:t<86400?`${Math.floor(t/3600)}h ago`:t<172800?`yesterday`:`${Math.floor(t/86400)}d ago`}function a(e){let t=(Date.now()-new Date(e).getTime())/1e3;return t<0||Number.isNaN(t)?`unknown`:t<60?`just now`:t<3600?`${Math.floor(t/60)}m ago`:t<86400?`${Math.floor(t/3600)}h ago`:`${Math.floor(t/86400)}d ago`}export{i,a as n,r,n as t};