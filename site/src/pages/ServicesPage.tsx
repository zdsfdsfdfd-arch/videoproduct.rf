import { Link } from 'react-router-dom';
import { PageShell } from './PageShell';
import { Process } from '@/components/sections/Process';
import { serviceChapters, servicesTotal, tariffs } from '@/content';
import { chapterIntros, serviceDetails, allStages, stageIn } from '@/content/pages';
import styles from './ServicesPage.module.css';

/**
 * Услуги — the full catalogue: five chapters, every one of the 27 services as a row with what it is,
 * the usual format and the tariff it lands in; then the seven production stages and the
 * stage × tariff matrix so a visitor can see what exactly is included.
 */
export function ServicesPage() {
  let n = 0;
  return (
    <PageShell index="02" kicker={`${servicesTotal} НАПРАВЛЕНИЙ · 5 ГЛАВ · 7 ЭТАПОВ`} title={<>Услу<em>ги</em></>} lead="Продакшн полного цикла: от анимированного логотипа до имиджевых и документальных фильмов. Ниже — каждое направление, его формат и тариф, в который оно обычно укладывается.">
      <nav aria-label="Главы" className={styles.toc}>
        {serviceChapters.map((ch, i) => (
          <a key={ch.title} href={`#ch-${i + 1}`} className={`${styles.tocLink} mono`}>
            <span className={styles.tocNum}>0{i + 1}</span>
            {ch.title}
            <span className={styles.tocCount}>{ch.items.length}</span>
          </a>
        ))}
      </nav>

      <section id="sp-04" data-scene className={styles.catalogue} aria-label="Каталог услуг">
        {serviceChapters.map((ch, ci) => (
          <article key={ch.title} id={`ch-${ci + 1}`} className={styles.chapter} data-scene>
            <header className={styles.chapterHead}>
              <span aria-hidden="true" className={styles.chapterNum}>
                0{ci + 1}
              </span>
              <div>
                <div className={`${styles.chapterLabel} mono`}>ГЛАВА 0{ci + 1} · {ch.items.length} НАПРАВЛЕНИЙ</div>
                <h2 className={styles.chapterTitle}>{ch.title}</h2>
                <p className={styles.chapterIntro}>{chapterIntros[ci]}</p>
              </div>
            </header>
            <ol className={styles.rows}>
              {serviceDetails[ci].map((s) => {
                n += 1;
                return (
                  <li key={s.name} className={styles.row} data-cursor-grow>
                    <span className={`${styles.rowNum} mono`}>{String(n).padStart(2, '0')}</span>
                    <div className={styles.rowMain}>
                      <h3 className={styles.rowName}>{s.name}</h3>
                      <p className={styles.rowDesc}>{s.desc}</p>
                    </div>
                    <div className={`${styles.rowMeta} mono`}>
                      <span>{s.format.toUpperCase()}</span>
                      <Link to="/tarify" className={styles.rowTariff} data-tariff={s.tariff}>
                        ОТ ТАРИФА «{s.tariff}»
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          </article>
        ))}
      </section>

      <Process />

      <section className={styles.matrix} aria-label="Что входит в тарифы" data-scene>
        <div className={`${styles.matrixHead} mono mono-dim`}>
          <span>ЭТАПЫ × ТАРИФЫ</span>
          <span>ЧТО ВХОДИТ В КАЖДЫЙ ТАРИФ</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Этап</th>
              {tariffs.map((t) => (
                <th key={t.name} scope="col">
                  <span className={styles.thName}>{t.name}</span>
                  <span className={`${styles.thPrice} mono`}>{t.price.toUpperCase()}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allStages.map((st, i) => (
              <tr key={st}>
                <th scope="row">
                  <span className={`${styles.tdNum} mono`}>{String(i + 1).padStart(2, '0')}</span>
                  {st}
                </th>
                {tariffs.map((t) => {
                  const v = stageIn(t, st);
                  return (
                    <td key={t.name} data-v={v}>
                      {v === 'full' ? '●' : v === 'basic' ? 'базовый' : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.matrixNote}>
          Финальная стоимость индивидуальна, тарифы не фиксированные.{' '}
          <Link to="/brif" data-cursor="ВПЕРЁД">
            ЗАПОЛНИТЬ БРИФ И ПОЛУЧИТЬ РАСЧЁТ →
          </Link>
        </p>
      </section>
    </PageShell>
  );
}
