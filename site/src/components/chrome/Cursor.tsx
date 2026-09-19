import { useEffect, useRef } from 'react';
import { getEngine } from '@/lib/scroll-engine';
import styles from './Cursor.module.css';

/**
 * Custom cursor: a 12px accent dot that grows into a labelled circle over anything with
 * `data-cursor="ТЕКСТ"` and swells slightly over `data-cursor-grow`. Desktop, fine pointer only —
 * the engine never shows it on touch devices or with reduced motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const engine = getEngine();
    engine.attachCursor(dot.current, label.current);
    return () => engine.attachCursor(null, null);
  }, []);
  return (
    <div ref={dot} aria-hidden="true" className={styles.dot}>
      <span ref={label} className={styles.label} />
    </div>
  );
}
