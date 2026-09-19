import { Link, NavLink } from 'react-router-dom';
import { logo } from '@/assets';
import { contacts } from '@/content';
import { pages } from '@/lib/routes';
import { useAnchorClick } from '@/lib/hooks';
import styles from './TopBars.module.css';

/**
 * Fixed top chrome: the brand plate (left), the page menu (centre, desktop only — phones use the
 * bottom strip) and the consultation CTA (right, scrolls to the contact form).
 */
export function TopBars() {
  const onClick = useAnchorClick();
  return (
    <>
      <Link to="/" data-cursor="ГЛАВНАЯ" aria-label="Видеопродакшн.РФ — на главную" className={`${styles.bar} ${styles.logo}`}>
        <img src={logo} alt="" width={26} height={26} className={styles.mark} />
        <span className={styles.brand}>{contacts.brand}</span>
      </Link>

      <nav aria-label="Страницы сайта" className={`${styles.bar} ${styles.menu}`}>
        {pages.map((p) => (
          <NavLink key={p.path} to={p.path} end data-cursor="ОТКРЫТЬ" className={styles.menuLink}>
            {p.label}
          </NavLink>
        ))}
      </nav>

      <a href="#sp-12" onClick={onClick} data-cursor="ВНИЗ" aria-label="Связаться с нами — к контактам" className={`${styles.bar} ${styles.contact}`}>
        <span className={styles.dotAccent} />
        <span className={styles.full}>ПОЛУЧИТЬ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ</span>
        <span className={styles.short}>КОНСУЛЬТАЦИЯ</span>
      </a>
    </>
  );
}
