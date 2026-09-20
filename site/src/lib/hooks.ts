import { useEffect, useRef, useState, useCallback, type RefObject, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEngine, scrollToSection, type SceneListener } from './scroll-engine';
import { anchorRoutes } from './routes';

/** Subscribe a [data-scene] section to the engine's per-frame progress. */
export function useScene(ref: RefObject<HTMLElement | null>, fn: SceneListener) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return getEngine().subscribe(el, (e, p) => fnRef.current(e, p));
  }, [ref]);
}

/**
 * Derive a discrete index (0…count-1) from a pinned scene's --e, the way the prototype's
 * tickSticky / tickProcess did: floor(e * (count + 0.02)) so the last state is reachable.
 *
 * Only the index is state: --e itself changes every frame, and putting that in state re-rendered
 * the whole section sixty times a second. Anything that needs the raw value subscribes with
 * useScene and writes to the DOM directly.
 */
export function useSceneIndex(ref: RefObject<HTMLElement | null>, count: number) {
  const [idx, setIdx] = useState(0);
  useScene(ref, (eVal) => {
    setIdx(Math.min(count - 1, Math.floor(eVal * (count + 0.02))));
  });
  return idx;
}

export function useActiveSection() {
  const [i, setI] = useState(0);
  useEffect(() => getEngine().onActive(setI), []);
  return i;
}

/**
 * onClick for `href="#sp-NN"` anchors. If the section is on this page → smooth scroll;
 * otherwise go to the page that owns it (or the magazine with the hash).
 */
export function useAnchorClick() {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    (ev: MouseEvent<HTMLAnchorElement>) => {
      const href = ev.currentTarget.getAttribute('href');
      if (!href?.startsWith('#')) return;
      ev.preventDefault();
      const id = href.slice(1);
      if (document.getElementById(id)) {
        scrollToSection(id);
        return;
      }
      const route = anchorRoutes[id];
      if (route && route !== location.pathname) navigate(route);
      else navigate(`/#${id}`);
    },
    [navigate, location.pathname],
  );
}

/**
 * Phones and tablets: the fixed top plates (logo, consultation, menu) sit over the page, so while
 * reading they can cover a line of text. Scrolling down hides them, scrolling up or returning to the
 * top brings them back — the state is a `data-chrome` attribute on <html> the plates' styles read.
 */
export function useAutoHideChrome() {
  useEffect(() => {
    const root = document.documentElement;
    let last = scrollY;
    let hidden = false;
    const onScroll = () => {
      const y = Math.max(0, scrollY);
      const dy = y - last;
      if (Math.abs(dy) < 8) return; // ignore jitter and rubber-banding
      last = y;
      const next = dy > 0 && y > 160;
      if (next === hidden) return;
      hidden = next;
      root.dataset.chrome = hidden ? 'up' : 'down';
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      removeEventListener('scroll', onScroll);
      delete root.dataset.chrome;
    };
  }, []);
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}

export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');
