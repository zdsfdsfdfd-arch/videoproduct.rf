import { Link, NavLink } from 'react-router-dom';
import { logo } from '@/assets';
import { contacts } from '@/content';
import { pages } from '@/lib/routes';
import { useAnchorClick } from '@/lib/hooks';
import styles from './TopBars.module.css';

/**
 * The site header: brand (left), pages (centre, ≥1280px — narrower screens get the «МЕНЮ» plate,
 * see MobileMenu) and the consultation link (right).
 *
 * It used to be three plates floating over the page at top: 12px. Between and beside them the
 * page's own text showed through, so every heading that scrolled past the top of the window
 * collided with the chrome. It is one full-width bar now — the content passes cleanly underneath
 * it, which is also what lets the bar stay quiet: a thin rule and a blurred, barely-there ground.
 */
export function TopBars() {
  const onClick = useAnchorClick();
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" data-cursor="ГЛАВНАЯ" aria-label="Видеопродакшн.РФ — на главную" className={styles.logo}>
          <img src={logo} alt="" width={30} height={23} className={styles.mark} />
          <span className={styles.brand}>{contacts.brand}</span>
        </Link>

        <nav aria-label="Страницы сайта" className={styles.menu}>
          {pages.map((p) => (
            <NavLink key={p.path} to={p.path} end data-cursor="ОТКРЫТЬ" className={styles.menuLink}>
              {p.label}
            </NavLink>
          ))}
        </nav>

        <a href="#sp-12" onClick={onClick} data-cursor="ВНИЗ" aria-label="Связаться с нами — к контактам" className={styles.contact}>
          <span aria-hidden="true" className={styles.dotAccent} />
          <span className={styles.full}>Бесплатная консультация</span>
          <span className={styles.short}>Консультация</span>
        </a>
      </div>
    </header>
  );
}
