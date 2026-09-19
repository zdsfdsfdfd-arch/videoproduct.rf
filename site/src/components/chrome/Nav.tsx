import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '@/content';
import { pages } from '@/lib/routes';
import { useActiveSection, useAnchorClick } from '@/lib/hooks';
import styles from './Nav.module.css';

/**
 * Desktop: the vertical technical index pinned at the right edge. On the magazine it lists the
 * spreads (active line grows and turns violet); on inner pages it lists the pages.
 */
export function SideNav() {
  const active = useActiveSection();
  const onClick = useAnchorClick();
  const { pathname } = useLocation();
  const home = pathname === '/';
  return (
    <nav aria-label={home ? 'Разделы журнала' : 'Страницы сайта'} className={styles.side}>
      {home
        ? navItems.map((it, i) => (
            <a key={it.id} href={`#${it.id}`} onClick={onClick} className={styles.sideLink} aria-current={i === active ? 'true' : undefined}>
              <span className={styles.tick} />
              {it.label}
            </a>
          ))
        : pages.map((p, i) => (
            <NavLink key={p.path} to={p.path} end className={styles.sideLink}>
              <span className={styles.tick} />
              {String(i).padStart(2, '0')} {p.label}
            </NavLink>
          ))}
    </nav>
  );
}

/** Phones: a horizontal strip along the bottom, 46px targets, auto-scrolls to the active item. */
export function MiniNav() {
  const active = useActiveSection();
  const onClick = useAnchorClick();
  const { pathname } = useLocation();
  const home = pathname === '/';
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>('[aria-current]');
    if (el && scroller.current) scroller.current.scrollLeft = Math.max(0, el.offsetLeft - 40);
  }, [active, pathname]);
  return (
    <nav aria-label={home ? 'Разделы журнала' : 'Страницы сайта'} className={styles.mini}>
      <div ref={scroller} className={styles.miniScroll}>
        {home
          ? navItems.map((it, i) => (
              <a key={it.id} href={`#${it.id}`} onClick={onClick} className={styles.miniLink} aria-current={i === active ? 'true' : undefined}>
                {it.label}
              </a>
            ))
          : pages.map((p) => (
              <NavLink key={p.path} to={p.path} end className={styles.miniLink}>
                {p.label}
              </NavLink>
            ))}
      </div>
    </nav>
  );
}
