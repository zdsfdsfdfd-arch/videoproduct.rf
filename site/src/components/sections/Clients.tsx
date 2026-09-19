import { clientLogos } from '@/content';
import styles from './Clients.module.css';

/** «Нам доверяют» — nine client marks in a single staggered row, inverted for the dark spread. */
export function Clients() {
  return (
    <section aria-label="Нам доверяют" className={styles.section}>
      <div className={`${styles.label} mono mono-dim`}>НАМ ДОВЕРЯЮТ</div>
      <ul className={styles.row}>
        {clientLogos.map((c, i) => (
          <li key={c.name} className={styles.item} style={{ height: c.h, transform: `translateY(${i % 2 ? 16 : -16}px)` }}>
            <img src={c.src} alt={c.name} loading="lazy" className={styles.logo} />
          </li>
        ))}
      </ul>
    </section>
  );
}
