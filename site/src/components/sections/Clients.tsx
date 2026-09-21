import type { CSSProperties } from 'react';
import { clientLogos } from '@/content';
import styles from './Clients.module.css';

/**
 * «Нам доверяют» — nine client marks in a single staggered row. The source cutouts are
 * monochrome, so each is drawn as a CSS mask filled with the brand colour (multi-colour marks
 * get a gradient fill split at the right places); original vector logos can replace them 1:1.
 * Each mark carries its own glow colour, so the row lifts off the black instead of sinking into it.
 */
export function Clients() {
  return (
    <section aria-label="Нам доверяют" className={styles.section}>
      <div className={`${styles.label} mono mono-dim`}>НАМ ДОВЕРЯЮТ</div>
      <ul className={styles.row}>
        {clientLogos.map((c, i) => (
          <li key={c.name} className={styles.item} style={{ height: c.h, transform: `translateY(${i % 2 ? 16 : -16}px)`, '--glow': c.glow } as CSSProperties}>
            <span
              role="img"
              aria-label={c.name}
              className={styles.logo}
              style={{ '--logo': `url(${c.src})`, '--fill': c.fill, aspectRatio: c.ratio } as CSSProperties}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
