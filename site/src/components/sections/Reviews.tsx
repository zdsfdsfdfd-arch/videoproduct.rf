import { useRef } from 'react';
import { Picture } from '@/components/Picture';
import { VkPlayer } from '@/components/VkPlayer';
import { reviews, reviewFrames, vkVideoUrl } from '@/content';
import { useIsDesktop, useSceneIndex } from '@/lib/hooks';
import styles from './Reviews.module.css';

/**
 * 08 / Отзывы — one testimonial fills the viewport; scrolling through the 300vh section swaps
 * them. All four video reviews are pre-loaded as the section approaches; only the active one is
 * shown, the others stay mounted so switching is instant (desktop only).
 */
export function Reviews() {
  const section = useRef<HTMLElement>(null);
  const active = useSceneIndex(section, reviews.length);
  const desktop = useIsDesktop();

  const current = reviews[active];

  // Phones: no pin — the four reviews stack. Mobile browsers (Safari above all) block the cookies
  // VK's embedded player needs and it renders «видео недоступно», so each review is a play card
  // that opens the video in the VK app or the VK site, where playback is guaranteed.
  if (!desktop) {
    return (
      <section id="sp-08" ref={section} data-scene className={`${styles.section} ${styles.stack}`} aria-label="08 Отзывы">
        <div className={`${styles.head} mono mono-dim`}>
          <span>08 / ОТЗЫВЫ</span>
          <span>{String(reviews.length).padStart(2, '0')} ВИДЕО</span>
        </div>
        <ul className={styles.list}>
          {reviews.map((r, i) => (
            <li key={r.videoId} className={styles.item}>
              <div className={styles.company}>{r.company}</div>
              <div className={styles.name}>{r.name}</div>
              <div className={styles.position}>{r.position}</div>
              <a href={vkVideoUrl(r.videoId)} target="_blank" rel="noopener" className={styles.playCard} aria-label={`Смотреть видеоотзыв: ${r.name}, ${r.company}`}>
                {reviewFrames[r.videoId] && <Picture photo={reviewFrames[r.videoId]} alt="" className={styles.playFrame} sizes="100vw" />}
                <span className={styles.playIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.playRing} aria-hidden="true">
                  ▶
                </span>
                <span className={`${styles.playLabel} mono`}>СМОТРЕТЬ ОТЗЫВ В VK →</span>
                <span className={`${styles.playNote} mono`}>КАДР СО СЪЁМКИ СТУДИИ</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section id="sp-08" ref={section} data-scene className={styles.section} aria-label="08 Отзывы">
      <div className={styles.sticky}>
        <div className={`${styles.head} mono mono-dim`}>
          <span>08 / ОТЗЫВЫ</span>
          <span>
            <span className={styles.num}>{String(active + 1).padStart(2, '0')}</span> / {String(reviews.length).padStart(2, '0')}
          </span>
        </div>

        <div className={styles.middle}>
          {reviews.map((r, i) => (
            <div key={r.videoId} className={styles.review} data-on={i === active ? '1' : undefined} data-before={i < active ? '1' : undefined} aria-hidden={i !== active}>
              <div className={styles.company}>{r.company}</div>
              <div className={styles.name}>{r.name}</div>
              <div className={styles.position}>{r.position}</div>
            </div>
          ))}
          <div className={styles.player}>
            {desktop &&
              reviews.map((r, i) => (
                <VkPlayer key={r.videoId} id={r.videoId} title={`Видеоотзыв — ${r.company}`} interactive hidden={i !== active} prewarm="150% 0px" className={styles.frame} />
              ))}
          </div>
        </div>

        <div className={styles.foot}>
          <p className={styles.footNote}>
            ВИДЕООТЗЫВЫ КЛИЕНТОВ ·{' '}
            <a href={vkVideoUrl(current.videoId)} target="_blank" rel="noopener" data-cursor="ОТКРЫТЬ">
              СМОТРЕТЬ В VK →
            </a>
          </p>
          <div className={styles.line}>
            <div className={styles.lineFill} />
          </div>
        </div>
      </div>
    </section>
  );
}
