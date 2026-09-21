/**
 * Scroll reveals.
 *
 * Anything marked `data-reveal` starts a little below its place and transparent, and settles into
 * position the first time it comes into view. One shared IntersectionObserver does the work and
 * drops each element as soon as it has been shown, so this costs nothing while scrolling — the
 * frame loop in scroll-engine.ts stays untouched.
 *
 * Two safeguards:
 *   • the hidden state is scoped to `html[data-reveal]`, which only this module sets, so if the
 *     script never runs the page is simply visible;
 *   • with prefers-reduced-motion the observer is not started at all.
 */

import type { CSSProperties } from 'react';

const SHOWN = 'data-shown';

let io: IntersectionObserver | null = null;
let mo: MutationObserver | null = null;

function show(el: Element) {
  el.setAttribute(SHOWN, '');
  io?.unobserve(el);
}

/**
 * An element inside a sideways scroller (the portfolio reel, the stage strip) is clipped out of
 * the intersection rect while it waits its turn, so it would never be told to appear — and would
 * then fade in under the reader's thumb as they swipe. Those are shown outright.
 */
function inSideScroller(el: Element) {
  for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
    if (n.scrollWidth > n.clientWidth + 4 && getComputedStyle(n).overflowX !== 'visible') return true;
  }
  return false;
}

/** Observe everything not yet revealed. Safe to call again after the DOM changes. */
export function scanReveals() {
  if (!io) return;
  document.querySelectorAll(`[data-reveal]:not([${SHOWN}])`).forEach((el) => {
    // already on screen when the page opened: show it without the animation running late
    if (el.getBoundingClientRect().top < innerHeight * 0.92 || inSideScroller(el)) show(el);
    else io!.observe(el);
  });
}

export function startReveals() {
  if (io) return;
  const root = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  root.setAttribute('data-reveal', '');
  io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) if (en.isIntersecting) show(en.target);
    },
    // fires a little before the element's top edge reaches the fold, so the motion is finishing
    // by the time it is properly in view rather than starting then
    { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
  );
  scanReveals();

  // A hard flick can carry an element from below the fold to above it between two observations,
  // and the observer never sees it cross. A sweep once the scroll settles catches those — by then
  // they are above the fold, which scanReveals treats as "show it".
  addEventListener('scroll', onScroll, { passive: true });

  // routes swap whole page trees in; pick up whatever arrives
  mo = new MutationObserver(() => scanReveals());
  mo.observe(document.body, { childList: true, subtree: true });
}

let settleT = 0;
const onScroll = () => {
  clearTimeout(settleT);
  settleT = window.setTimeout(scanReveals, 180);
};

export function stopReveals() {
  removeEventListener('scroll', onScroll);
  clearTimeout(settleT);
  io?.disconnect();
  mo?.disconnect();
  io = null;
  mo = null;
  document.documentElement.removeAttribute('data-reveal');
}

/**
 * A jump — an anchor from the menu, a new route — teleports the reader into the middle of the
 * page, and everything there would fade up from nothing while they wait. For the length of the
 * jump the reveals are switched off, so the destination is simply there.
 */
export function revealInstant(ms = 700) {
  const root = document.documentElement;
  root.setAttribute('data-reveal-now', '');
  clearTimeout(instantT);
  instantT = window.setTimeout(() => root.removeAttribute('data-reveal-now'), ms);
}
let instantT = 0;

/** Hold an element back a beat: `style={delay(90)}`. */
export const delay = (ms: number) => ({ '--rd': `${ms}ms` }) as CSSProperties;

/** Stagger a row or a list: `style={stagger(i)}`. */
export const stagger = (i: number, step = 60, max = 420) => delay(Math.min(i * step, max));
