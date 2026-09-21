import { faq } from '@/content';
import styles from './Faq.module.css';

/** 11 / Вопросы — native disclosure list; only facts confirmed on the source site. */
export function Faq() {
  return (
    <section id="sp-11" data-scene className={styles.section} aria-label="11 Вопросы">
      <div className="grid12">
        <div className={`${styles.index} mono mono-dim`}>11 / ВОПРОСЫ</div>
        <h2 className={styles.title}>Коротко и по делу</h2>
        <div className={styles.list}>
          {faq.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary className={styles.summary}>
                {item.q}
                <span className={styles.sign} aria-hidden="true">
                  +
                </span>
              </summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
