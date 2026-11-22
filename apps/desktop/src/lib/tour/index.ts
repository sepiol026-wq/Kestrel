// SPDX-License-Identifier: AGPL-3.0-or-later AND MIT
// Portions Copyright (c) 2024-2026 Nous Research, Hermes Agent & Qwerty Contributors (MIT License)
// Modifications Copyleft (c) 2026 Sam Sepi0l <sepiol026@gmail.com> (AGPL-3.0)
// Derivative work. All upstream attribution and rights retained.

/**
 * TOURS — highlight-and-narrate walkthroughs for any surface.
 *
 * Two consumers, one engine:
 *
 * - The `tour` agent tool, via the gateway (see run-tour.ts).
 * - Your own curated tours, via this module:
 *
 * ```ts
 * import { startTour, showTourStep, stopTour } from '@/lib/tour'
 *
 * startTour([
 *   { selector: '[data-tour="composer"]', title: 'Composer', text: 'Type here.' },
 *   { selector: '[data-tour="files"]', title: 'Files', text: 'Your project.' }
 * ])
 * ```
 *
 * Tours run against whatever is in the DOM — mark elements with `data-tour="…"`
 * to give them durable handles (see `collectTourTargets`, which reports those
 * first and flags every selector as stable or positional).
 */

export { collectTourTargets, type TourTarget } from './collect-targets'
export type { TourAction, TourHost, TourResult, TourStep } from './engine'
export {
  isTourActive,
  listTourTargets,
  nextTourStep,
  previousTourStep,
  runTour,
  showTourStep,
  startTour,
  stopTour,
  type TourSurface
} from './run-tour'
