import { tariffs } from '@/content';
import { useAnchorClick } from '@/lib/hooks';
import styles from './Tariffs.module.css';

/** 06 / Тарифы — editorial comparison: three columns separated by hairlines; the hovered one widens. */
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
          <article key={t.name} className={styles.tariff}>
            <div className={`${styles.meta} mono`}>
              <span style={{ color: t.accent ? 'var(--accent)' : undefined }}>{t.index}</span>
              <span>{t.name}</span>
            </div>
            <div className={styles.price}>{t.price}</div>
            <ul className={styles.stages}>
              {t.stages.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className={styles.desc}>{t.description}</p>
            <p className={styles.fits}>{t.fits}</p>
          </article>
        ))}
      </div>

      <p className={styles.foot}>
        ЗАПОЛНИВ БРИФ, ВЫ ПОЛУЧИТЕ ИНДИВИДУАЛЬНЫЙ РАСЧЁТ КОММЕРЧЕСКОГО ПРЕДЛОЖЕНИЯ ·{' '}
        <a href="#sp-09" onClick={onClick} data-cursor="ВПЕРЁД">
          ПЕРЕЙТИ К БРИФУ →
        </a>
      </p>
    </section>
  );
}
