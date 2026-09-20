import { Picture } from '@/components/Picture';
import { serviceChapters, servicesTotal } from '@/content';
import styles from './Services.module.css';

/**
 * 04 / Услуги — twenty-seven services in five chapters. One reading direction: the chapter title
 * on the left, its services under one another on the right, every line starting at the same edge.
 * (The earlier zigzag of loose tiles looked like a spread but could not be read.)
 *
 * Читаемо ещё не значит интересно: five identical blocks of grey rows put the studio to sleep.
 * So each chapter takes one of the palette hues and one still from their own shoots into the
 * column that was standing empty, and its number is set large behind the title.
 */
export function Services() {
  let n = 0;
  return (
    <section id="sp-04" data-scene className={styles.section} aria-label="04 Услуги">
      <div className="grid12">
        <div className={`${styles.index} mono mono-dim`}>
          04 / УСЛУГИ
          <br />
          {servicesTotal} НАПРАВЛЕНИЙ
        </div>
        <h2 className={`${styles.title} h2`}>Что мы снимаем</h2>
        <p className={`${styles.lead} body-copy`}>
          Задачи от анимированного логотипа до имиджевых и презентационных роликов, съёмок мастер-классов, лекций и мероприятий.
        </p>

        {serviceChapters.map((ch, ci) => (
          <div key={ch.title} className={styles.chapter} data-hue={ch.hue}>
            <div className={styles.chapterHead}>
              <div className={styles.chapterTop}>
                <span aria-hidden="true" className={styles.chapterGhost}>
                  {String(ci + 1).padStart(2, '0')}
                </span>
                <div>
                  <span className={styles.chapterNum}>ГЛАВА {String(ci + 1).padStart(2, '0')}</span>
                  <h3 className={styles.chapterTitle}>{ch.title}</h3>
                  <span className={styles.chapterLabel}>{ch.items.length} НАПРАВЛЕНИЙ</span>
                </div>
              </div>
              <figure className={styles.shot}>
                <Picture photo={ch.photo} alt={ch.photoAlt} sizes="(max-width: 767px) 92vw, 30vw" className={styles.shotImg} />
              </figure>
            </div>
            <ul className={styles.list}>
              {ch.items.map((item) => {
                n += 1;
                return (
                  <li key={item} className={styles.row}>
                    <span className={styles.rowNum}>{String(n).padStart(2, '0')}</span>
                    <span className={styles.rowName}>{item}</span>
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
