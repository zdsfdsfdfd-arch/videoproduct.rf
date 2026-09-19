import { useEffect, useRef, useState } from 'react';
import { Picture } from '@/components/Picture';
import { VkPlayer } from '@/components/VkPlayer';
import { caseFallbackFrames, vkVideoUrl, works } from '@/content';
import { getEngine } from '@/lib/scroll-engine';
import styles from './CaseOverlay.module.css';

export interface CaseRequest {
  index: number;
  /** Where the clicked thumbnail was — the flyer takes off from there. */
  rect: DOMRect;
}

/**
 * Cinematic case transition: a blue flyer grows from the thumbnail to the full screen and
 * dissolves into the case page (title, metadata, frames, VK player). Esc or «Закрыть» closes;
 * the player unmounts so the video stops.
 */
export function CaseOverlay({ request, onClose }: { request: CaseRequest | null; onClose: () => void }) {
  const [shown, setShown] = useState<CaseRequest | null>(null);
  const [phase, setPhase] = useState<'closed' | 'flying' | 'open' | 'closing'>('closed');
  const flyer = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const reduced = getEngine().reduced;

  // open
  useEffect(() => {
    if (!request) return;
    restoreFocus.current = document.activeElement as HTMLElement | null;
    setShown(request);
    document.body.classList.add('scroll-locked');
    if (reduced) {
      setPhase('open');
      return;
    }
    setPhase('flying');
    const fl = flyer.current;
    if (fl) {
      const r = request.rect;
      fl.style.transition = 'none';
      fl.style.opacity = '1';
      fl.style.top = `${r.top}px`;
      fl.style.left = `${r.left}px`;
      fl.style.width = `${r.width}px`;
      fl.style.height = `${r.height}px`;
    }
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const f = flyer.current;
        if (f) {
          f.style.transition = 'top .72s var(--ease), left .72s var(--ease), width .72s var(--ease), height .72s var(--ease), opacity .4s .4s';
          f.style.top = '0px';
          f.style.left = '0px';
          f.style.width = '100%';
          f.style.height = '100%';
          f.style.opacity = '0';
        }
        setPhase('open');
      }),
    );
    return () => cancelAnimationFrame(raf);
  }, [request, reduced]);

  // close
  useEffect(() => {
    if (request || !shown) return;
    setPhase('closing');
    const t = setTimeout(
      () => {
        setPhase('closed');
        setShown(null);
        document.body.classList.remove('scroll-locked');
        restoreFocus.current?.focus?.();
      },
      reduced ? 0 : 280,
    );
    return () => clearTimeout(t);
  }, [request, shown, reduced]);

  useEffect(() => {
    if (phase !== 'open') return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [phase, onClose]);

  if (!shown || phase === 'closed') return null;
  const work = works[shown.index];
  const num = String(shown.index + 1).padStart(2, '0');

  return (
    <div role="dialog" aria-modal="true" aria-label={`Кейс ${num}: ${work.title}`} className={styles.overlay}>
      <button ref={closeBtn} type="button" data-cursor="ЗАКРЫТЬ" aria-label="Закрыть кейс" className={styles.close} onClick={onClose}>
        ЗАКРЫТЬ ✕
      </button>
      <div ref={flyer} aria-hidden="true" className={styles.flyer} />
      <div className={styles.body} data-phase={phase}>
        <div className={styles.page}>
          <div className={`${styles.index} mono mono-dim`}>КЕЙС {num}</div>
          <h3 className={styles.title}>{work.title}</h3>
          <div className={styles.meta}>
            ТИП
            <br />
            <span className={styles.metaValue}>{work.type}</span>
          </div>
          <div className={styles.meta}>
            СТУДИЯ
            <br />
            <span className={styles.metaValue}>ВИДЕОПРОДАКШН.РФ</span>
          </div>
          <div className={styles.meta}>
            ЦИКЛ
            <br />
            <span className={styles.metaValue}>ПОЛНЫЙ</span>
          </div>

          <div className={styles.frames}>
            <div className={styles.frameA}>
              {work.poster ? (
                <img src={work.poster} alt="Кадр из проекта" className={styles.img} />
              ) : (
                <Picture photo={caseFallbackFrames.a} alt="Кадр со съёмки" className={styles.img} sizes="60vw" />
              )}
            </div>
            <div className={styles.frameB}>
              <Picture photo={caseFallbackFrames.b} alt="Кадр со съёмки" className={styles.img} sizes="40vw" />
            </div>
          </div>

          <div className={styles.video}>
            <div className={styles.videoHead}>
              <span>ВИДЕО</span>
              <a href={vkVideoUrl(work.id)} target="_blank" rel="noopener" data-cursor="ОТКРЫТЬ">
                СМОТРЕТЬ В VK →
              </a>
            </div>
            <div className={styles.player}>
              <VkPlayer key={work.id} id={work.id} title={`Видео проекта — ${work.title}`} poster={work.poster} interactive eager holdMs={600} className={styles.iframe} />
            </div>
          </div>

          <p className={styles.note}>Кадры со съёмок — из архива студии. Описание и результаты кейса на исходном сайте не опубликованы.</p>
        </div>
      </div>
    </div>
  );
}
