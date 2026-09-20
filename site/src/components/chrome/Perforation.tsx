import { useEffect, useRef } from 'react';
import { getEngine } from '@/lib/scroll-engine';
import styles from './Perforation.module.css';

/** Film-strip sprocket holes along both viewport edges; they scroll with the page. */
export function Perforation({ side }: { side: 'left' | 'right' }) {
  const holes = useRef<HTMLDivElement>(null);

  // --perf-y lands on this element, not on <html> (see ProgressBar for why)
  useEffect(() => {
    const el = holes.current;
    if (!el) return;
    const detach = getEngine().attachPerf(el);
    return () => {
      detach();
    };
  }, []);

  return (
    <div aria-hidden="true" className={`${styles.rail} ${side === 'left' ? styles.left : styles.right}`}>
      <div ref={holes} className={styles.holes} />
    </div>
  );
}
