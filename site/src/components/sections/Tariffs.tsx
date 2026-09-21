import { tariffs } from '@/content';
import { useAnchorClick } from '@/lib/hooks';
import styles from './Tariffs.module.css';

/**
 * 06 / Тарифы — three plans side by side.
 *
 * Everything but the price used to be set in 10–11px uppercase mono with 0.12em of tracking: the
 * plan's own name, what it includes, who it suits. The price shouted and the rest was unreadable,
 * and the name — the one thing that tells you which plan you are looking at — was the smallest
 * type on the card, in its top right corner. The name leads now, the lists are set at a size you
 * can read, and «подойдёт для» is one item per line instead of a run-on string of capitals.
 */
export function Tariffs() {
  const onClick = useAnchorClick();
  return (
    <section id="sp-06" data-scene className={styles.section} aria-label="06 Тарифы">
      <div className={`grid12 ${styles.head}`}>
        <div className={`${styles.index} mono mono-dim`}>06 / ТАРИФЫ</div>
        <h2 className={`${styles.title} h2`}>
          Ориентир
          <br />
          по бюджету
        </h2>
        <p className={styles.lead}>Финальная стоимость индивидуальна, тарифы не фиксированные, но они могут послужить удобным ориентиром для вашего выбора.</p>
      </div>

      <div className={styles.columns}>
        {tariffs.map((t) => (
          <article key={t.name} className={styles.tariff} data-accent={t.accent ? '1' : undefined}>
            <p className={`${styles.label} mono`}>{t.index}</p>
            <h3 className={styles.name}>{t.name}</h3>
            <p className={styles.price}>{t.price}</p>
            <p className={styles.desc}>{t.description}</p>

            <div className={styles.block}>
              <p className={`${styles.blockHead} mono`}>ЧТО ВХОДИТ</p>
              <ul className={styles.stages}>
                {t.stages.map((s) => (
                  <li key={s} className={styles.stage}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`${styles.block} ${styles.blockLast}`}>
              <p className={`${styles.blockHead} mono`}>ПОДОЙДЁТ ДЛЯ</p>
              <ul className={styles.fits}>
                {t.fits.split('·').map((f) => (
                  <li key={f} className={styles.fit}>
                    {f.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <p className={styles.foot}>
        Заполнив бриф, вы получите индивидуальный расчёт коммерческого предложения.{' '}
        <a href="#sp-09" onClick={onClick} data-cursor="ВПЕРЁД" className={styles.footLink}>
          Перейти к брифу →
        </a>
      </p>
    </section>
  );
}
