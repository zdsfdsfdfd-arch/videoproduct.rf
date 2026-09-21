import { Picture } from '@/components/Picture';
import { processSteps } from '@/content';
import { useAnchorClick } from '@/lib/hooks';
import styles from './Process.module.css';

const COUNT = processSteps.length;
const HUES = ['violet', 'indigo', 'soft', 'orchid'] as const;

/**
 * 03 / Процесс — the seven stages of a shoot, as seven frames.
 *
 * Two earlier versions did not hold up. The first pinned the page for 460vh and lit one stage at a
 * time. The second read the stages down a column beside a sticky photograph — readable, but seven
 * identical text rows next to one picture, and the studio said as much. This one gives every stage
 * its own frame: its still from their shoots, its number, its colour and the tariffs it belongs to
 * as chips you can actually scan. The eighth card is the way out of the chapter — the brief.
 *
 * Desktop lays the eight out four across; a phone swipes through them like a film strip, the same
 * gesture the portfolio uses. Nothing is pinned and nothing runs per frame.
 */
export function Process() {
  const onClick = useAnchorClick();

  return (
    <section id="sp-03" data-scene className={styles.section} aria-label="03 Процесс">
      <div className={`${styles.head} mono mono-dim`}>
        <span>03 / ПРОЦЕСС</span>
        <span className={styles.headLong}>ПОЛНЫЙ ЦИКЛ · {String(COUNT).padStart(2, '0')} ЭТАПОВ</span>
      </div>

      <div className={styles.intro}>
        <h2 className={`${styles.title} h2`}>
          Как рождается <em>ролик</em>
        </h2>
        <p className={`${styles.lead} body-copy`}>
          Каждый этап делает своя часть команды. В тариф «Старт» входит базовый набор, в «Стандарт» и «Комбо» — все семь.
        </p>
      </div>

      <ol className={styles.track}>
        {processSteps.map((s, i) => (
          <li key={s.title} className={styles.card} data-hue={HUES[i % HUES.length]}>
            <Picture photo={s.frame.photo} alt={s.frame.alt} sizes="(max-width: 767px) 76vw, 24vw" className={styles.photo} />
            <div className={styles.veil} />
            <span aria-hidden="true" className={styles.num}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className={styles.body}>
              <h3 className={styles.name}>{s.title}</h3>
              <p className={styles.desc}>{s.description}</p>
              <ul className={`${styles.chips} mono`}>
                {s.tariffs.split('·').map((t) => (
                  <li key={t} className={styles.chip}>
                    {t.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}

        <li className={`${styles.card} ${styles.cardCta}`}>
          <div className={styles.body}>
            <span className={`${styles.ctaLabel} mono`}>ЭТАП {String(COUNT + 1).padStart(2, '0')}</span>
            <h3 className={styles.name}>Ваш проект</h3>
            <p className={styles.desc}>Расскажите о задаче — предложим тариф и состав работ под неё.</p>
            <a href="#sp-09" onClick={onClick} data-cursor="ЗАПОЛНИТЬ" className={styles.ctaLink}>
              Рассчитать стоимость →
            </a>
          </div>
        </li>
      </ol>
    </section>
  );
}
