import { delay } from '@/lib/reveal';
import styles from './Geography.module.css';

/** 10 / География — three city names as giant typography, sliding against each other with scroll. */
export function Geography() {
  return (
    <section id="sp-10" data-scene className={styles.section} aria-label="10 География">
      <div data-reveal="soft" className={`${styles.head} mono mono-dim`}>
        <span>10 / ГЕОГРАФИЯ</span>
        <span>СЪЁМКИ В 25 ГОРОДАХ</span>
      </div>
      {/* the cities drift with --p; the reveal sits on the group so the two transforms
          do not fight over the same elements */}
      <div data-reveal="display" className={styles.cities}>
        <div className={`${styles.city} ${styles.c1}`}>Москва</div>
        <div className={`${styles.city} ${styles.c2}`}>Казань</div>
        <div className={`${styles.city} ${styles.c3}`}>Санкт-Петербург</div>
      </div>
      <p data-reveal style={delay(300)} className={styles.note}>И по всей России: студия полного цикла выезжает на объект заказчика.</p>
    </section>
  );
}
