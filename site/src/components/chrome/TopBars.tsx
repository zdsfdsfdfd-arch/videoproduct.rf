import { logo } from '@/assets';
import { contacts } from '@/content';
import { useAnchorClick } from '@/lib/hooks';
import styles from './TopBars.module.css';

/** Two mirrored glass plates fixed at the top: the brand (back to top) and the consultation CTA (down to contacts). */
export function TopBars() {
  const onClick = useAnchorClick();
  return (
    <>
      <a href="#sp-00" onClick={onClick} data-cursor="НАВЕРХ" aria-label="Видеопродакшн.РФ — наверх" className={`${styles.bar} ${styles.logo}`}>
        <img src={logo} alt="" width={26} height={26} className={styles.mark} />
        <span className={styles.brand}>{contacts.brand}</span>
      </a>
      <a href="#sp-12" onClick={onClick} data-cursor="ВНИЗ" aria-label="Связаться с нами — к контактам" className={`${styles.bar} ${styles.contact}`}>
        <span className={styles.dotAccent} />
        <span className={styles.full}>ПОЛУЧИТЬ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ</span>
        <span className={styles.short}>КОНСУЛЬТАЦИЯ</span>
      </a>
    </>
  );
}
