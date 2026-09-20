import { useEffect, useRef, useState } from 'react';
import { Picture } from '@/components/Picture';
import { processSteps } from '@/content';
import styles from './Process.module.css';

const COUNT = processSteps.length;

/**
 * 03 / Процесс — the seven stages of a shoot.
 *
 * This used to be pinned for 460vh: one stage at a time, the other six greyed out, and four and a
 * half screens of scrolling to get past it. Now all seven are readable at once as a list — number,
 * name, what happens, which tariffs include it — and the frame beside them (sticky, not pinned)
 * follows whichever stage is level with the middle of the screen. The whole chapter is about a
 * screen and a half, and the page never holds the scroll.
 */
export function Process() {
  const section = useRef<HTMLElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // which stage is level with the middle of the viewport — an observer, so nothing runs per frame
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const i = rows.current.indexOf(en.target as HTMLLIElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    rows.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="sp-03" ref={section} data-scene className={styles.section} aria-label="03 Процесс">
      <div className={`${styles.head} mono mono-dim`}>
        <span>03 / ПРОЦЕСС</span>
        <span>
          <span className={styles.headLong}>ЭТАПЫ ПРОИЗВОДСТВА · </span>
          {String(COUNT).padStart(2, '0')} ЭТАПОВ
        </span>
      </div>

      <h2 className={`${styles.title} h2`}>
        Как рождается <em>ролик</em>
      </h2>

      <div className={styles.body}>
        <div className={styles.frameCol}>
          <div className={styles.frameBox} aria-hidden="true">
            {processSteps.map((s, i) => (
              <div key={s.title} className={`${styles.frame} ${s.frame.portrait ? styles.framePortrait : ''}`} data-on={i === active ? '1' : undefined}>
                {s.frame.photo ? (
                  <Picture photo={s.frame.photo} alt="" className={styles.photo} />
                ) : (
                  <img src={s.frame.portrait} alt="" loading="lazy" className={styles.portrait} />
                )}
              </div>
            ))}
            <div className={styles.frameShade} />
            <span className={`${styles.frameTag} mono`}>
              ЭТАП {String(active + 1).padStart(2, '0')} · {processSteps[active].title.toUpperCase()}
            </span>
          </div>
        </div>

        <ol className={styles.list}>
          {processSteps.map((s, i) => (
            <li
              key={s.title}
              ref={(el) => {
                rows.current[i] = el;
              }}
              className={styles.step}
              data-on={i === active ? '1' : undefined}
            >
              <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepName}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.description}</p>
                <p className={`${styles.stepTariffs} mono`}>{s.tariffs}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
