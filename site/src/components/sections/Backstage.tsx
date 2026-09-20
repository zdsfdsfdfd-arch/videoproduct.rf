import { useEffect, useRef, useState } from 'react';
import { Picture } from '@/components/Picture';
import { backstage } from '@/content';
import { useScene, useSceneIndex } from '@/lib/hooks';
import { getEngine } from '@/lib/scroll-engine';
import styles from './Backstage.module.css';

const WORDS = backstage.words;
const FPS = 25;
const SECONDS = 90;

function timecode(e: number) {
  const total = Math.round(e * SECONDS * FPS);
  const fr = total % FPS;
  const s = Math.floor(total / FPS) % 60;
  const m = Math.floor(total / (FPS * 60));
  return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(fr).padStart(2, '0')}`;
}

/**
 * 05 / За кадром — the viewfinder of a running A-cam. Three backstage frames stack on top of each
 * other through clip-path wipes while the camera slowly pushes in; REC blinks, the timecode runs
 * with the scroll (25 fps), the take number follows the clapper word, which is set letter by letter.
 */
export function Backstage() {
  const section = useRef<HTMLElement>(null);
  const idx = useSceneIndex(section, WORDS.length);
  const tc = useRef<HTMLDivElement>(null);

  // timecode is high-frequency: written straight to the DOM, never through state
  useScene(section, (e) => {
    const next = timecode(e);
    if (tc.current && tc.current.textContent !== next) tc.current.textContent = next;
  });

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

        <div aria-hidden="true" className={styles.finder}>
          <span className={`${styles.corner} ${styles.tl}`} />
          <span className={`${styles.corner} ${styles.tr}`} />
          <span className={`${styles.corner} ${styles.bl}`} />
          <span className={`${styles.corner} ${styles.br}`} />
          <span className={styles.crossH} />
          <span className={styles.crossV} />
          <div className={styles.rec}>
            <span className={styles.recDot} />
            REC
          </div>
          <div ref={tc} className={styles.tc}>
            00:00:00:00
          </div>
          <div className={styles.cam}>A-CAM · 4K 25P</div>
          <div className={styles.take}>СЦЕНА 05 · ДУБЛЬ {String(idx + 1).padStart(2, '0')}</div>
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
