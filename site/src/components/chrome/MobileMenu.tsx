import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { contacts } from '@/content';
import { pages } from '@/lib/routes';
import { useAnchorClick } from '@/lib/hooks';
import styles from './MobileMenu.module.css';

/**
 * Page menu for phones and tablets (below 1280px the centre page menu is hidden): a «МЕНЮ» plate in
 * the top chrome opens a full-screen sheet with the eight pages, the consultation CTA and the
 * contacts. Closes on route change, Escape, the close button or a tap on the current page.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const onAnchor = useAnchorClick();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('scroll-locked');
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('scroll-locked');
      removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onCta = (ev: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    onAnchor(ev);
  };

  return (
    <>
      <button type="button" className={`${styles.btn} mono`} aria-expanded={open} aria-controls="site-menu" aria-label="Открыть меню сайта" onClick={() => setOpen(true)}>
        <span className={styles.burger} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        МЕНЮ
      </button>

      {open && (
        <div id="site-menu" role="dialog" aria-modal="true" aria-label="Меню сайта" className={styles.overlay}>
          <div className={`${styles.head} mono`}>
            <span className={styles.brand}>{contacts.brand}</span>
            <button ref={closeBtn} type="button" className={`${styles.close} mono`} onClick={() => setOpen(false)}>
              ЗАКРЫТЬ ✕
            </button>
          </div>

          <nav aria-label="Страницы сайта" className={styles.list}>
            {pages.map((p, i) => (
              <NavLink key={p.path} to={p.path} end className={styles.link} style={{ '--i': i } as CSSProperties} onClick={() => setOpen(false)}>
                <span className={`${styles.num} mono`}>{String(i).padStart(2, '0')}</span>
                <span className={styles.label}>{p.label}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </NavLink>
            ))}
          </nav>

          <div className={styles.foot}>
            <a href="#sp-12" onClick={onCta} className={`${styles.cta} mono`}>
              <span className={styles.dot} />
              ПОЛУЧИТЬ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ →
            </a>
            <div className={`${styles.contacts} mono`}>
              <a href={contacts.phoneHref}>{contacts.phoneDisplay}</a>
              <a href={contacts.whatsapp} target="_blank" rel="noopener">
                WHATSAPP
              </a>
              <a href={contacts.emailHref}>{contacts.email}</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
