import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems, phoneHiddenSections } from '@/content';
import { pages } from '@/lib/routes';
import { useActiveSection, useAnchorClick, useIsDesktop } from '@/lib/hooks';
import styles from './Nav.module.css';

/** «sp-07» → 7. The active chapter is matched by its own number, not by its place in the list —
 *  the list is shorter on a phone. */
const chapterNo = (id: string) => Number(id.slice(3));

/** The chapters this device actually renders (see content → phoneHiddenSections). */
function useChapters() {
  const desktop = useIsDesktop();
  return desktop ? navItems : navItems.filter((it) => !phoneHiddenSections.includes(it.id));
}

/**
 * Desktop: the vertical technical index pinned at the right edge. On the magazine it lists the
 * spreads (active line grows and turns violet); on inner pages it lists the pages.
 *
 * It used to stand open the whole time and print itself over whatever text ran under it. Now it
 * rests as a column of ticks with only the current chapter named, and opens — over its own plate,
 * so nothing shows through — when the pointer reaches it.
 */
export function SideNav() {
  const active = useActiveSection();
  const onClick = useAnchorClick();
  const { pathname } = useLocation();
  const home = pathname === '/';
  const items = useChapters();
  return (
    <nav aria-label={home ? 'Разделы журнала' : 'Страницы сайта'} className={styles.side}>
      {home
        ? items.map((it) => (
            <a key={it.id} href={`#${it.id}`} onClick={onClick} className={styles.sideLink} aria-current={chapterNo(it.id) === active ? 'true' : undefined}>
              <span className={styles.tick} />
              <span className={styles.label}>{it.label}</span>
            </a>
          ))
        : pages.map((p, i) => (
            <NavLink key={p.path} to={p.path} end className={styles.sideLink}>
              <span className={styles.tick} />
              <span className={styles.label}>
                {String(i).padStart(2, '0')} {p.label}
              </span>
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
  const items = useChapters();
  const scroller = useRef<HTMLDivElement>(null);
  // centre the active item instead of pinning it near the left edge, so the neighbours on both
  // sides stay readable and the strip never opens on a half-cut word
  useEffect(() => {
    const box = scroller.current;
    const el = box?.querySelector<HTMLElement>('[aria-current]');
    if (!box || !el) return;
    box.scrollLeft = Math.max(0, el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2);
  }, [active, pathname]);
  return (
    <nav aria-label={home ? 'Разделы журнала' : 'Страницы сайта'} className={styles.mini}>
      <div ref={scroller} className={styles.miniScroll}>
        {home
          ? items.map((it) => (
              <a key={it.id} href={`#${it.id}`} onClick={onClick} className={styles.miniLink} aria-current={chapterNo(it.id) === active ? 'true' : undefined}>
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
