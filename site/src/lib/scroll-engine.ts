/**
 * Scroll engine — a port of the prototype's requestAnimationFrame loop.
 *
 * Every frame it writes a handful of custom properties that the stylesheets read:
 *   on <html>:            --mx --my (lerped mouse, −1…1)
 *   on the progress bar:  --sp (page progress 0…1)
 *   on each [data-scene]: --p (reveal progress: saturates when the top rises 70 % of the viewport)
 *                         --e (pin progress: 0…1 while a taller-than-viewport section scrolls through)
 * Components that need discrete state (which process step, which review) subscribe to a scene and
 * derive it from --e, so nothing here knows about React.
 *
 * Three rules keep the loop cheap enough for a phone:
 *   1. No layout reads while scrolling. Each scene's position is measured once into `geom` and only
 *      re-measured when something actually changes size (resize, images, route). Interleaving
 *      getBoundingClientRect with style writes used to force a full re-layout per scene per frame.
 *   2. A property is written only when its value changed, so an idle page touches no styles.
 *   3. When nothing has changed for a moment the loop parks itself; scrolling or moving the mouse
 *      wakes it again.
 *
 * Reduced motion: the loop is replaced by scroll/resize listeners, --p is forced to 1 and the
 * mouse parallax stays at 0. Pinned scenes still work — they are scroll state, not animation.
 */

import { revealInstant } from './reveal';

export type SceneListener = (e: number, p: number) => void;

const LERP = 0.07; // "кинематографично" density from the prototype tweaks
const REVEAL_SPAN = 0.7;
const PARK_AFTER = 20; // frames of no change before the loop stops

type Geom = { top: number; height: number };

class ScrollEngine {
  readonly reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly coarse = matchMedia('(pointer: coarse)').matches;

  private root = document.documentElement;
  private scenes: HTMLElement[] = [];
  private geom: Geom[] = [];
  private written: { p: string; e: string }[] = [];
  private measured = false;
  private listeners = new Map<HTMLElement, Set<SceneListener>>();
  private raf = 0;
  private started = false;
  private running = false;
  private still = 0;

  // mouse parallax (target → lerped)
  private tmx = 0;
  private tmy = 0;
  private mx = 0;
  private my = 0;
  private lastMx = '';
  private lastMy = '';

  // page progress, written on the element that reads it instead of on <html>
  private progressEl: HTMLElement | null = null;
  private lastSp = '';
  private docHeight = 0;

  /** Mouse parallax runs on a pointer that can hover, and only when motion is allowed. */
  private parallax = false;

  // active section (for the index)
  private io: IntersectionObserver | null = null;
  private ro: ResizeObserver | null = null;
  private activeIdx = 0;
  private activeSubs = new Set<(i: number) => void>();

  start() {
    if (this.started) return;
    this.started = true;
    this.parallax = !this.coarse && !this.reduced;
    this.scan();
    this.observeSections();
    addEventListener('scroll', this.wake, { passive: true });
    addEventListener('resize', this.remeasure, { passive: true });
    addEventListener('orientationchange', this.remeasure, { passive: true });
    addEventListener('load', this.remeasure);
    if (this.reduced) {
      this.tickSafe();
    } else {
      this.wake();
    }
    if (this.parallax) addEventListener('pointermove', this.onMove, { passive: true });
  }

  stop() {
    if (!this.started) return;
    this.started = false;
    this.running = false;
    cancelAnimationFrame(this.raf);
    removeEventListener('scroll', this.wake);
    removeEventListener('resize', this.remeasure);
    removeEventListener('orientationchange', this.remeasure);
    removeEventListener('load', this.remeasure);
    removeEventListener('pointermove', this.onMove);
    this.io?.disconnect();
    this.ro?.disconnect();
  }

  /** Re-collect scenes after the DOM changed (called by hooks on mount). */
  scan() {
    this.scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
    this.written = this.scenes.map(() => ({ p: '', e: '' }));
    this.ro?.disconnect();
    // a scene that changes height (an image arrives, an accordion opens) invalidates the cache
    this.ro = new ResizeObserver(() => this.remeasure());
    this.scenes.forEach((el) => this.ro!.observe(el));
    this.ro.observe(document.body);
    this.remeasure();
    this.observeSections();
  }

  subscribe(el: HTMLElement, fn: SceneListener) {
    let set = this.listeners.get(el);
    if (!set) this.listeners.set(el, (set = new Set()));
    set.add(fn);
    if (!this.scenes.includes(el)) this.scan();
    this.wake();
    return () => {
      set!.delete(fn);
      if (!set!.size) this.listeners.delete(el);
    };
  }

  onActive(fn: (i: number) => void) {
    this.activeSubs.add(fn);
    fn(this.activeIdx);
    return () => {
      this.activeSubs.delete(fn);
    };
  }

  /** The progress bar reads its own property, not one on <html>. */
  attachProgress(el: HTMLElement | null) {
    this.progressEl = el;
    this.lastSp = '';
    this.wake();
  }

  private observeSections() {
    this.io?.disconnect();
    this.io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const i = Number(en.target.id.replace('sp-', ''));
          if (i !== this.activeIdx) {
            this.activeIdx = i;
            this.activeSubs.forEach((fn) => fn(i));
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    document.querySelectorAll('section[id^="sp-"]').forEach((s) => this.io!.observe(s));
  }

  /** Mark the geometry cache stale; the next frame measures before it writes anything. */
  private remeasure = () => {
    this.measured = false;
    this.wake();
  };

  private measure() {
    const y = scrollY;
    this.geom = this.scenes.map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + y, height: r.height };
    });
    this.docHeight = this.root.scrollHeight;
    this.measured = true;
  }

  private wake = () => {
    this.still = 0;
    if (!this.started) return;
    if (this.reduced) {
      this.tickSafe();
      return;
    }
    if (this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.frame);
  };

  private frame = () => {
    const changed = this.tickSafe();
    this.still = changed ? 0 : this.still + 1;
    if (this.still > PARK_AFTER) {
      this.running = false;
      return;
    }
    this.raf = requestAnimationFrame(this.frame);
  };

  private warned = false;
  private tickSafe = () => {
    try {
      return this.tick();
    } catch (err) {
      if (!this.warned) {
        this.warned = true;
        console.warn('scroll frame error', err);
      }
      return false;
    }
  };

  /** Returns whether anything was written, so the loop knows when it may park. */
  private tick() {
    const vh = innerHeight;
    const y = Math.max(0, scrollY);
    // the only layout read, and only after something resized
    if (!this.measured || this.geom.length !== this.scenes.length) this.measure();

    let changed = false;

    if (this.parallax) {
      this.mx += (this.tmx - this.mx) * LERP;
      this.my += (this.tmy - this.my) * LERP;
      const sx = this.mx.toFixed(3);
      const sy = this.my.toFixed(3);
      if (sx !== this.lastMx) {
        this.root.style.setProperty('--mx', (this.lastMx = sx));
        changed = true;
      }
      if (sy !== this.lastMy) {
        this.root.style.setProperty('--my', (this.lastMy = sy));
        changed = true;
      }
    }

    const sp = Math.min(1, Math.max(0, y / Math.max(1, this.docHeight - vh))).toFixed(4);
    if (sp !== this.lastSp) {
      this.lastSp = sp;
      this.progressEl?.style.setProperty('--sp', sp);
      changed = true;
    }
    for (let i = 0; i < this.scenes.length; i++) {
      const g = this.geom[i];
      if (!g) continue;
      const top = g.top - y;
      let p = this.reduced ? 1 : (vh - top) / (vh * REVEAL_SPAN);
      let e = g.height > vh ? -top / (g.height - vh) : 0;
      if (!Number.isFinite(p) || !Number.isFinite(e)) continue;
      p = Math.min(1, Math.max(0, p));
      e = Math.min(1, Math.max(0, e));
      const sp2 = p.toFixed(3);
      const se = e.toFixed(4);
      const w = this.written[i];
      if (w.p === sp2 && w.e === se) continue;
      const el = this.scenes[i];
      if (w.p !== sp2) el.style.setProperty('--p', (w.p = sp2));
      if (w.e !== se) el.style.setProperty('--e', (w.e = se));
      changed = true;
      const subs = this.listeners.get(el);
      if (subs) subs.forEach((fn) => fn(e, p));
    }

    return changed;
  }

  private onMove = (e: PointerEvent) => {
    this.tmx = (e.clientX / innerWidth - 0.5) * 2;
    this.tmy = (e.clientY / innerHeight - 0.5) * 2;
    this.wake();
  };
}

let instance: ScrollEngine | null = null;
export function getEngine(): ScrollEngine {
  if (!instance) instance = new ScrollEngine();
  return instance;
}

/** Smooth anchor scroll used by every in-page link (respects reduced motion). */
export function scrollToSection(id: string) {
  const t = document.getElementById(id);
  if (!t) return;
  const smooth = !getEngine().reduced;
  // the chapter we land on should be there when we arrive, not fade up afterwards
  revealInstant(smooth ? 1100 : 300);
  scrollTo({ top: t.getBoundingClientRect().top + scrollY, behavior: smooth ? 'smooth' : 'auto' });
}
