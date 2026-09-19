import { Link } from 'react-router-dom';
import { PageShell } from './PageShell';
import { Tariffs } from '@/components/sections/Tariffs';
import { Faq } from '@/components/sections/Faq';
import { tariffs } from '@/content';
import { allStages, stageIn, afterBrief } from '@/content/pages';
import styles from './TariffsPage.module.css';

/**
 * Тарифы — the three tariffs, then how they differ (stage matrix), what each is for,
 * how the final price is formed and how to get a calculation.
 */
export function TariffsPage() {
  return (
    <PageShell index="03" kicker="СТАРТ · СТАНДАРТ · КОМБО" title={<>Тари<em>фы</em></>} lead="Три ориентира по бюджету. Финальная стоимость индивидуальна и считается по этапам производства и составу команды — тарифы показывают порядок цифр и что в них входит.">
      <Tariffs />

      <section className={styles.compare} aria-label="Сравнение тарифов" data-scene>
        <div className={`${styles.head} mono mono-dim`}>
          <span>ЧЕМ ОТЛИЧАЮТСЯ</span>
          <span>ЭТАПЫ ПРОИЗВОДСТВА × ТАРИФЫ</span>
        </div>
        <div className={styles.grid}>
          <div className={styles.cornerCell} />
          {tariffs.map((t) => (
            <div key={t.name} className={styles.colHead} data-accent={t.accent ? '1' : undefined}>
              <span className={styles.colName}>{t.name}</span>
              <span className={`${styles.colPrice} mono`}>{t.price.toUpperCase()}</span>
            </div>
          ))}
          {allStages.map((st, i) => (
            <div key={st} className={styles.stageRow}>
              <div className={styles.stageName}>
                <span className={`${styles.stageNum} mono`}>{String(i + 1).padStart(2, '0')}</span>
                {st}
              </div>
              {tariffs.map((t) => {
                const v = stageIn(t, st);
                return (
                  <div key={t.name} className={styles.cell} data-v={v} data-accent={t.accent ? '1' : undefined}>
                    {/* phones hide the column header row, so every cell names its tariff */}
                    <span className={`${styles.cellTariff} mono`}>{t.name.toUpperCase()}</span>
                    <span className={styles.dot} />
                    <span className={`${styles.cellLabel} mono`}>{v === 'full' ? 'ВХОДИТ' : v === 'basic' ? 'БАЗОВЫЙ' : 'НЕТ'}</span>
                  </div>
                );
              })}
            </div>
          ))}
          <div className={styles.stageRow}>
            <div className={styles.stageName}>
              <span className={`${styles.stageNum} mono`}>→</span>
              Для каких задач
            </div>
            {tariffs.map((t) => (
              <div key={t.name} className={`${styles.cell} ${styles.cellText} mono`} data-accent={t.accent ? '1' : undefined}>
                <span className={styles.cellTariff}>{t.name.toUpperCase()}</span>
                {t.fits}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.how} aria-label="Как считается стоимость" data-scene>
        <div className={`${styles.head} mono mono-dim`}>
          <span>КАК СЧИТАЕТСЯ СТОИМОСТЬ</span>
          <span>3 ШАГА ДО РАСЧЁТА</span>
        </div>
        <h2 className={styles.howTitle}>
          Тариф — ориентир.
          <br />
          Расчёт — под задачу.
        </h2>
        <ol className={styles.steps}>
          {afterBrief.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={`${styles.stepNum} mono`}>{s.n}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepText}>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className={styles.howActions}>
          <Link to="/brif" data-cursor="ВПЕРЁД" className={`${styles.cta} mono`}>
            ЗАПОЛНИТЬ БРИФ →
          </Link>
          <Link to="/uslugi" data-cursor="ОТКРЫТЬ" className={`${styles.ctaGhost} mono`}>
            ВСЕ 27 НАПРАВЛЕНИЙ
          </Link>
        </div>
      </section>

      <Faq />
    </PageShell>
  );
}
