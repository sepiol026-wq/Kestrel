// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

import { Plate } from "../../kit/react/draw";
import { StretchArt } from "./art";
import { readoutOf, PULLED } from "./rig";
import "./stretch.css";

export function TestRigFigure() {
  return (
    <Plate
      fig="Fig 6"
      title="Press and pull"
      hint="Press, then pull ← →"
      readout="120.0 × 32.0 · lean 0.0 px"
      keys={[
        { mark: "raised", label: "The glass while it is held" },
        { mark: "dotted", label: "Where it rests" },
        { mark: "edge", label: "The pull, from where I pressed to the finger" },
      ]}
      caption={`A 120 × 32 glass button on a test rig: a carriage on two guide rods held by four springs, a finger probe on a rail behind it, and a dial gauge that reads the lean. Pulled 80 px it leans ${readoutOf(PULLED).split("lean ")[1]}.`}
    >
      <StretchArt />
    </Plate>
  );
}
