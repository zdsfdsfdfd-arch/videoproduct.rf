import { useRef } from 'react';
import { Picture } from '@/components/Picture';
import { processSteps } from '@/content';
import { useSceneIndex } from '@/lib/hooks';
import styles from './Process.module.css';

const COUNT = processSteps.length;

/**
 * 03 / Процесс — pinned for 460vh. Each of the seven stages owns a full-screen colour frame
 * that cuts in with a slight push-in, the stage name lights up in the list, the description
 * swaps beneath, and the line at the bottom fills with scroll progress.
 */
export function Process() {
  const section = useRef<HTMLElement>(null);
  const [active] = useSceneIndex(section, COUNT);

  return (
    <section id="sp-03" ref={section} data-scene className={styles.section} aria-label="03 Процесс">
      <div className={styles.sticky}>
        <div className={`${styles.head} mono mono-dim`}>
          <span>03 / ПРОЦЕСС</span>
          <span>
            <span className={styles.headLong}>ЭТАПЫ ПРОИЗВОДСТВА · </span>
            <span className={styles.num}>{String(active + 1).padStart(2, '0')}</span> / {String(COUNT).padStart(2, '0')}
          </span>
        </div>

        <div className={styles.middle}>
          <div className={styles.stage} aria-hidden="true">
            {processSteps.map((s, i) => (
              <div key={s.title} className={`${styles.frame} ${s.frame.portrait ? styles.framePortrait : ''}`} data-on={i === active ? '1' : undefined}>
                {s.frame.photo ? (
                  <Picture photo={s.frame.photo} alt="" className={styles.photo} />
                ) : (
                  <img src={s.frame.portrait} alt="" loading="lazy" className={styles.portrait} />
                )}
              </div>
            ))}
            <div className={styles.shade} />
          </div>

          <ol className={styles.list}>
            {processSteps.map((s, i) => (
              <li key={s.title} className={styles.item} data-on={i === active ? '1' : undefined} data-before={i < active ? '1' : undefined}>
                <span className={styles.itemNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.itemName}>{s.title}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.bottom}>
          <div className={styles.descs}>
            {processSteps.map((s, i) => (
              <p key={s.title} className={styles.desc} data-on={i === active ? '1' : undefined} aria-hidden={i !== active}>
                {s.description}
              </p>
            ))}
          </div>
          <p className={styles.note}>
            ВХОДИТ В ТАРИФЫ
            <br />
            <span className={styles.noteValue}>{processSteps[active].tariffs}</span>
          </p>
          <div className={styles.line}>
            <div className={styles.lineFill} />
          </div>
        </div>
      </div>
    </section>
  );
}
