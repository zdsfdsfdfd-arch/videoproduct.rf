import { useEffect, useRef, useState } from 'react';
import { Picture } from '@/components/Picture';
import { SkipPin } from '@/components/chrome/SkipPin';
import { backstage } from '@/content';
import { useSceneIndex } from '@/lib/hooks';
import { getEngine } from '@/lib/scroll-engine';
import styles from './Backstage.module.css';

const WORDS = backstage.words;

/**
 * 05 / За кадром — three frames from the studio's shoots dissolving into each other with a slow
 * push-in, and the clapper word set letter by letter over them.
 *
 * It used to carry a whole fake camera interface on top: corner brackets, a crosshair, a blinking
 * REC dot, a running timecode, «A-CAM · 4K 25P», a take number. Six pieces of small type scattered
 * over a photograph — a gimmick that fought the picture and collided with itself on narrow screens.
 * The photography carries the chapter now.
 */
export function Backstage() {
  const section = useRef<HTMLElement>(null);
  const idx = useSceneIndex(section, WORDS.length);

  return (
    <section id="sp-05" ref={section} data-scene className={styles.section} aria-label="05 За кадром">
      <div className={styles.sticky}>
        <div className={`${styles.layer} ${styles.layer1}`}>
          <Picture photo={backstage.layers[0]} alt="" className={styles.photo} />
        </div>
        <div className={`${styles.layer} ${styles.layer2}`}>
          <Picture photo={backstage.layers[1]} alt="" className={styles.photo} />
        </div>
        <div className={`${styles.layer} ${styles.layer3}`}>
          <Picture photo={backstage.layers[2]} alt="" className={styles.photo} />
        </div>

        <div className={styles.wordWrap}>
          <ClapperWord word={WORDS[idx]} />
        </div>

        <div className={`${styles.head} mono`}>
          <span>05 / ЗА КАДРОМ</span>
          <span className={styles.headRight}>СЪЁМКИ В 25 ГОРОДАХ · СВОЁ ОБОРУДОВАНИЕ 5 000 000 ₽</span>
        </div>

        <div className={styles.strip}>
          <div className={styles.stripTrack}>
            {backstage.strip.map((ph, i) => (
              <div key={i} className={styles.stripFrame}>
                <Picture photo={ph} alt={`Кадр ${String(i + 1).padStart(2, '0')}`} sizes="220px" className={styles.stripImg} />
              </div>
            ))}
          </div>
        </div>

        <SkipPin from="sp-05" className={styles.skip} />
      </div>
    </section>
  );
}

/**
 * The clapper word: first half of the letters outlined, second half filled (variant A chosen by the
 * client), difference-inverted against the frames. Every change replays the title cascade —
 * each letter rises from under an invisible line with a slight rotation, 45 ms apart.
 */
function ClapperWord({ word }: { word: string }) {
  const [shown, setShown] = useState(false);
  const letters = [...word];
  const half = Math.ceil(letters.length / 2);
  const reduced = getEngine().reduced;

  useEffect(() => {
    setShown(false);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(id);
  }, [word]);

  return (
    <span className={styles.word} aria-label={word}>
      {letters.map((ch, n) => (
        <span key={`${word}-${n}`} className={styles.letterClip} aria-hidden="true">
          <span
            className={`${styles.letter} ${n >= half ? styles.letterFill : ''}`}
            style={reduced ? undefined : { transitionDelay: `${n * 45}ms`, transform: shown ? 'translateY(0) rotate(0)' : 'translateY(112%) rotate(4deg)' }}
          >
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}
