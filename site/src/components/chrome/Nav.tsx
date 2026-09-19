import { useEffect, useRef } from 'react';
import { navItems, paperSections } from '@/content';
import { useActiveSection, useAnchorClick } from '@/lib/hooks';
import styles from './Nav.module.css';

/** Desktop: the vertical technical index pinned at the right edge; the active line grows and turns blue. */
export function SideNav() {
  const active = useActiveSection();
  const onClick = useAnchorClick();
  const paper = paperSections.has(active);
  return (
    <nav aria-label="Разделы журнала" className={styles.side} data-paper={paper ? '1' : undefined}>
      {navItems.map((it, i) => (
        <a key={it.id} href={`#${it.id}`} onClick={onClick} className={styles.sideLink} aria-current={i === active ? 'true' : undefined}>
          <span className={styles.tick} />
          {it.label}
        </a>
      ))}
    </nav>
  );
}

/** Phones: a horizontal strip along the bottom, 46px targets, auto-scrolls to the active item. */
export function MiniNav() {
  const active = useActiveSection();
  const onClick = useAnchorClick();
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>(`[data-i="${active}"]`);
    if (el && scroller.current) scroller.current.scrollLeft = Math.max(0, el.offsetLeft - 40);
  }, [active]);
  return (
    <nav aria-label="Разделы журнала" className={styles.mini}>
      <div ref={scroller} className={styles.miniScroll}>
        {navItems.map((it, i) => (
          <a key={it.id} data-i={i} href={`#${it.id}`} onClick={onClick} className={styles.miniLink} aria-current={i === active ? 'true' : undefined}>
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
