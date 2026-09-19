/**
 * Scroll engine — a port of the prototype's requestAnimationFrame loop.
 *
 * Every frame it writes a handful of custom properties that the stylesheets read:
 *   on <html>:            --mx --my (lerped mouse, −1…1)  --sp (page progress 0…1)  --perf-y (perforation offset)
 *   on each [data-scene]: --p (reveal progress: saturates when the top rises 70 % of the viewport)
 *                         --e (pin progress: 0…1 while a taller-than-viewport section scrolls through)
 * Components that need discrete state (which process step, which review) subscribe to a scene and
 * derive it from --e, so nothing here knows about React.
 *
 * Reduced motion: the loop is replaced by scroll/resize listeners, --p is forced to 1 and the
 * mouse parallax stays at 0. Pinned scenes still work — they are scroll state, not animation.
 */

export type SceneListener = (e: number, p: number) => void;

const LERP = 0.07; // "кинематографично" density from the prototype tweaks
const CURSOR_LERP = 0.18;
const REVEAL_SPAN = 0.7;

class ScrollEngine {
  readonly reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly coarse = matchMedia('(pointer: coarse)').matches;

  private root = document.documentElement;
  private scenes: HTMLElement[] = [];
  private listeners = new Map<HTMLElement, Set<SceneListener>>();
  private raf = 0;
  private started = false;

  // mouse parallax (target → lerped)
  private tmx = 0;
  private tmy = 0;
  private mx = 0;
  private my = 0;

  // cursor follower
  private cx = -100;
  private cy = -100;
  private ccx = -100;
  private ccy = -100;
  private cursorShown = false;
  private cursorEl: HTMLElement | null = null;
  private cursorLabel: HTMLElement | null = null;
  private cursorState = '';
  private cursorEnabled = false;

  // active section (for the index)
  private io: IntersectionObserver | null = null;
  private activeIdx = 0;
  private activeSubs = new Set<(i: number) => void>();

  start() {
    if (this.started) return;
    this.started = true;
    this.cursorEnabled = !this.coarse && !this.reduced;
    this.scan();
    this.observeSections();
    if (this.reduced) {
      addEventListener('scroll', this.tickSafe, { passive: true });
      addEventListener('resize', this.tickSafe, { passive: true });
      this.tickSafe();
    } else {
      this.raf = requestAnimationFrame(this.frame);
    }
    if (this.cursorEnabled) {
      addEventListener('pointermove', this.onMove, { passive: true });
      addEventListener('pointerover', this.onOver, { passive: true });
      document.addEventListener('pointerleave', this.onLeave);
      addEventListener('blur', this.onLeave);
    }
  }

  stop() {
    if (!this.started) return;
    this.started = false;
    cancelAnimationFrame(this.raf);
    removeEventListener('scroll', this.tickSafe);
    removeEventListener('resize', this.tickSafe);
    removeEventListener('pointermove', this.onMove);
    removeEventListener('pointerover', this.onOver);
    document.removeEventListener('pointerleave', this.onLeave);
    removeEventListener('blur', this.onLeave);
    this.io?.disconnect();
    document.body.classList.remove('no-cursor');
  }

  /** Re-collect scenes after the DOM changed (called by hooks on mount). */
  scan() {
    this.scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
    this.observeSections();
  }

  subscribe(el: HTMLElement, fn: SceneListener) {
    let set = this.listeners.get(el);
    if (!set) this.listeners.set(el, (set = new Set()));
    set.add(fn);
    if (!this.scenes.includes(el)) this.scan();
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

  attachCursor(el: HTMLElement | null, label: HTMLElement | null) {
    this.cursorEl = el;
    this.cursorLabel = label;
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

  private frame = () => {
    this.tickSafe();
    this.raf = requestAnimationFrame(this.frame);
  };

  private warned = false;
  private tickSafe = () => {
    try {
      this.tick();
    } catch (err) {
      if (!this.warned) {
        this.warned = true;
        console.warn('scroll frame error', err);
      }
    }
  };

  private tick() {
    const vh = innerHeight;
    const root = this.root;

    if (!this.reduced) {
      this.mx += (this.tmx - this.mx) * LERP;
      this.my += (this.tmy - this.my) * LERP;
      this.ccx += (this.cx - this.ccx) * CURSOR_LERP;
      this.ccy += (this.cy - this.ccy) * CURSOR_LERP;
      root.style.setProperty('--mx', this.mx.toFixed(4));
      root.style.setProperty('--my', this.my.toFixed(4));
      if (this.cursorEl) this.cursorEl.style.transform = `translate3d(${this.ccx.toFixed(1)}px,${this.ccy.toFixed(1)}px,0)`;
    }

    const sp = scrollY / Math.max(1, root.scrollHeight - vh);
    root.style.setProperty('--sp', Math.min(1, Math.max(0, sp)).toFixed(4));
    root.style.setProperty('--perf-y', (scrollY * 0.35).toFixed(1));

    for (const el of this.scenes) {
      const r = el.getBoundingClientRect();
      let p = this.reduced ? 1 : (vh - r.top) / (vh * REVEAL_SPAN);
      let e = r.height > vh ? -r.top / (r.height - vh) : 0;
      if (!Number.isFinite(p) || !Number.isFinite(e)) continue;
      p = Math.min(1, Math.max(0, p));
      e = Math.min(1, Math.max(0, e));
      el.style.setProperty('--p', p.toFixed(4));
      el.style.setProperty('--e', e.toFixed(4));
      const subs = this.listeners.get(el);
      if (subs) subs.forEach((fn) => fn(e, p));
    }
  }

  private onMove = (e: PointerEvent) => {
    this.tmx = (e.clientX / innerWidth - 0.5) * 2;
    this.tmy = (e.clientY / innerHeight - 0.5) * 2;
    this.cx = e.clientX;
    this.cy = e.clientY;
    if (!this.cursorShown) {
      // first appearance: snap under the physical cursor, no flight from the corner
      this.cursorShown = true;
      this.ccx = this.cx;
      this.ccy = this.cy;
      this.root.style.setProperty('--cur-o', '1');
      document.body.classList.add('no-cursor');
    }
  };

  private onLeave = () => {
    this.cursorShown = false;
    this.root.style.setProperty('--cur-o', '0');
    document.body.classList.remove('no-cursor');
  };

  private onOver = (e: PointerEvent) => {
    const target = e.target as Element | null;
    if (!target?.closest) return;
    const labelled = target.closest<HTMLElement>('[data-cursor]');
    const grow = !labelled && target.closest('[data-cursor-grow]');
    const label = labelled ? labelled.dataset.cursor ?? '' : grow ? '\u0000grow' : '';
    if (label === this.cursorState) return;
    this.cursorState = label;
    const el = this.cursorEl;
    const lb = this.cursorLabel;
    if (!el || !lb) return;
    if (label === '\u0000grow') {
      this.sizeCursor(el, 26, '#1E5BFF');
      lb.style.opacity = '0';
    } else if (label) {
      this.sizeCursor(el, Math.max(58, label.length * 7 + 26), 'rgba(30,91,255,0.92)');
      lb.textContent = label;
      lb.style.opacity = '1';
    } else {
      this.sizeCursor(el, 12, '#1E5BFF');
      lb.style.opacity = '0';
    }
  };

  private sizeCursor(el: HTMLElement, size: number, bg: string) {
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.margin = `${-size / 2}px 0 0 ${-size / 2}px`;
    el.style.background = bg;
  }
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
  scrollTo({ top: t.getBoundingClientRect().top + scrollY, behavior: getEngine().reduced ? 'auto' : 'smooth' });
}
