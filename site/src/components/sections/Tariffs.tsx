import { tariffs } from '@/content';
import { useAnchorClick } from '@/lib/hooks';
import { delay, stagger } from '@/lib/reveal';
import styles from './Tariffs.module.css';

/**
 * 06 / Тарифы — three plans side by side.
 *
 * Everything but the price used to be set in 10–11px uppercase mono with 0.12em of tracking: the
 * plan's own name, what it includes, who it suits. The price shouted and the rest was unreadable,
 * and the name — the one thing that tells you which plan you are looking at — was the smallest
 * type on the card, in its top right corner. The name leads now, the lists are set at a size you
 * can read, and «подойдёт для» is one item per line instead of a run-on string of capitals.
 *
 * What the cards were still missing is what anyone comparing plans actually asks: how big a crew
 * comes, how many shooting days are covered, and how long it takes. Those three now sit right
 * under the price, above the stage list — and the plan the studio calls its «хит» is marked as
 * one, because a page of three equal columns makes the visitor do the choosing alone. Each card
 * takes its own step along the violet family and carries its own way to order.
 */
export function Tariffs() {
  const onClick = useAnchorClick();
  return (
    <section id="sp-06" data-scene className={styles.section} aria-label="06 Тарифы">
      <div className={`grid12 ${styles.head}`}>
        <div className={`${styles.index} mono mono-dim`}>06 / ТАРИФЫ</div>
        <h2 data-reveal="display" className={`${styles.title} h2`}>
          Ориентир
          <br />
          по бюджету
        </h2>
        <p data-reveal style={delay(100)} className={styles.lead}>Финальная стоимость индивидуальна, тарифы не фиксированные, но они могут послужить удобным ориентиром для вашего выбора.</p>
      </div>

      <div className={styles.columns}>
        {tariffs.map((t, i) => (
          <article key={t.name} data-reveal style={stagger(i, 90)} className={styles.tariff} data-hue={t.hue} data-accent={t.accent ? '1' : undefined}>
            {t.accent && <span className={`${styles.hit} mono`}>ХИТ</span>}

            <p className={`${styles.label} mono`}>{t.index}</p>
            <h3 className={styles.name}>{t.name}</h3>
            <p className={styles.price}>{t.price}</p>
            <p className={styles.desc}>{t.description}</p>

            {/* the three things anyone comparing plans asks before the stage list */}
            <ul className={styles.facts}>
              {[t.team, t.shoots, t.term].map((f) => (
                <li key={f} className={styles.fact}>
                  {f}
                </li>
              ))}
            </ul>

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

            {/* scrolls to the brief on the home page, goes to /brif from anywhere else */}
            <a href="#sp-09" onClick={onClick} className={styles.order}>
              Заказать
            </a>
          </article>
        ))}
      </div>

      <p data-reveal="soft" className={styles.foot}>
        Заполнив бриф, вы получите индивидуальный расчёт коммерческого предложения.{' '}
        <a href="#sp-09" onClick={onClick} className={styles.footLink}>
          Перейти к брифу →
        </a>
      </p>
    </section>
  );
}
