import { serviceChapters, servicesTotal } from '@/content';
import styles from './Services.module.css';

/**
 * 04 / Услуги — paper spread. Twenty-seven services in five chapters, each opened by a heavy rule,
 * an outlined giant number and a title; chapters alternate left/right so the page reads as a zigzag.
 */
export function Services() {
  let n = 0;
  return (
    <section id="sp-04" data-scene className={styles.section} aria-label="04 Услуги">
      <div className="grid12">
        <div className={`${styles.index} mono mono-dim-ink`}>
          04 / УСЛУГИ
          <br />
          {servicesTotal} НАПРАВЛЕНИЙ
        </div>
        <h2 className={`${styles.title} h2`}>Что мы снимаем</h2>
        <p className={`${styles.lead} body-copy`}>
          Задачи от анимированного логотипа до имиджевых и презентационных роликов, съёмок мастер-классов, лекций и мероприятий.
        </p>

        {serviceChapters.map((ch, ci) => (
          <div key={ch.title} className={styles.chapter} data-side={ch.side}>
            <div className={styles.chapterHead}>
              <span className={styles.chapterLabel}>
                ГЛАВА {String(ci + 1).padStart(2, '0')} · {ch.items.length} НАПРАВЛЕНИЙ
              </span>
              <span aria-hidden="true" className={styles.chapterNum}>
                {String(ci + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.chapterTitle}>{ch.title}</h3>
            </div>
            <ul className={styles.tiles}>
              {ch.items.map((item) => {
                n += 1;
                return (
                  <li key={item} data-cursor-grow className={styles.tile}>
                    <span className={styles.tileNum}>{String(n).padStart(2, '0')}</span>
                    <span className={styles.tileName}>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
