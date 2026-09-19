import { useEffect, useRef, useState, useCallback, type RefObject, type MouseEvent } from 'react';
import { getEngine, scrollToSection, type SceneListener } from './scroll-engine';

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
 */
export function useSceneIndex(ref: RefObject<HTMLElement | null>, count: number) {
  const [idx, setIdx] = useState(0);
  const [e, setE] = useState(0);
  useScene(ref, (eVal) => {
    const i = Math.min(count - 1, Math.floor(eVal * (count + 0.02)));
    setIdx(i);
    setE(eVal);
  });
  return [idx, e] as const;
}

export function useActiveSection() {
  const [i, setI] = useState(0);
  useEffect(() => getEngine().onActive(setI), []);
  return i;
}

/** onClick for `href="#sp-NN"` anchors: smooth scroll instead of the jump. */
export function useAnchorClick() {
  return useCallback((ev: MouseEvent<HTMLAnchorElement>) => {
    const href = ev.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;
    ev.preventDefault();
    scrollToSection(href.slice(1));
  }, []);
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => (typeof matchMedia === 'function' ? matchMedia(query).matches : false));
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
