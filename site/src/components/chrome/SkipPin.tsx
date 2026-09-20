import { getEngine } from '@/lib/scroll-engine';
import styles from './SkipPin.module.css';

/**
 * A way out of a pinned chapter. While a spread is pinned the page holds still and the scroll
 * drives what happens inside it — which is the point, but it means a reader who has seen enough
 * has to keep scrolling to get anywhere. This drops them at the start of the next chapter.
 */
export function SkipPin({ from, label = 'ДАЛЬШЕ', className = '' }: { from: string; label?: string; className?: string }) {
  const skip = () => {
    const all = [...document.querySelectorAll<HTMLElement>('section[id^="sp-"]')];
    const next = all[all.findIndex((s) => s.id === from) + 1];
    if (!next) return;
    scrollTo({ top: next.getBoundingClientRect().top + scrollY, behavior: getEngine().reduced ? 'auto' : 'smooth' });
  };

  return (
    <button type="button" onClick={skip} className={`${styles.skip} ${className} mono`}>
      {label}
      <span aria-hidden="true" className={styles.arrow}>
        ↓
      </span>
    </button>
  );
}
