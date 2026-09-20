import { useEffect, useRef } from 'react';
import { getEngine } from '@/lib/scroll-engine';
import styles from './ProgressBar.module.css';

export function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);

  // the engine writes --sp here rather than on <html>: a custom property on the root
  // invalidates the style of the whole page on every scroll frame
  useEffect(() => {
    getEngine().attachProgress(bar.current);
    return () => getEngine().attachProgress(null);
  }, []);

  return (
    <div aria-hidden="true" className={styles.track}>
      <div ref={bar} className={styles.bar} />
    </div>
  );
}
