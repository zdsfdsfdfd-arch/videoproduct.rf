import { Link } from 'react-router-dom';
import { PageShell } from './PageShell';
import { Brief } from '@/components/sections/Brief';
import { contacts, tariffs } from '@/content';
import { afterBrief } from '@/content/pages';
import styles from './BriefPage.module.css';

/** Бриф — the wizard, what happens next, the three tariffs it maps onto, and the direct contacts. */
export function BriefPage() {
  return (
    <PageShell index="06" kicker="5 ШАГОВ · ~1,5 МИНУТЫ · ИНДИВИДУАЛЬНЫЙ РАСЧЁТ" title={<>Бр<em>иф</em></>} lead="Один вопрос на экран, следующий зависит от ответа. В конце — ориентир по тарифу, а команда студии готовит расчёт по вашим ответам.">
      <Brief />

      <section className={styles.after} aria-label="Что дальше" data-scene>
        <div className={`${styles.head} mono mono-dim`}>
          <span>ЧТО ПРОИСХОДИТ ПОСЛЕ</span>
          <span>3 ШАГА</span>
        </div>
        <ol className={styles.steps}>
          {afterBrief.map((s) => (
            <li key={s.n} className={styles.step}>
              <span className={`${styles.stepNum} mono`}>{s.n}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepText}>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.tariffs} aria-label="Ориентиры" data-scene>
        <div className={`${styles.head} mono mono-dim`}>
          <span>КУДА ПРИВОДЯТ ОТВЕТЫ</span>
          <Link to="/tarify">ПОДРОБНО О ТАРИФАХ →</Link>
        </div>
        <div className={styles.tariffRow}>
          {tariffs.map((t) => (
            <div key={t.name} className={styles.tariff} data-accent={t.accent ? '1' : undefined}>
              <span className={`${styles.tariffIndex} mono`}>{t.index}</span>
              <span className={styles.tariffName}>{t.name}</span>
              <span className={styles.tariffPrice}>{t.price}</span>
              <span className={`${styles.tariffFits} mono`}>{t.fits}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.direct} aria-label="Напрямую" data-scene>
        <h2 className={styles.directTitle}>Или сразу напрямую</h2>
        <div className={styles.directLinks}>
          <a href={contacts.phoneHref} className={styles.directLink}>
            {contacts.phoneDisplay}
          </a>
          <a href={contacts.whatsapp} target="_blank" rel="noopener" className={styles.directLink}>
            WhatsApp
          </a>
          <a href={contacts.emailHref} className={styles.directLink}>
            {contacts.email}
          </a>
        </div>
      </section>
    </PageShell>
  );
}
