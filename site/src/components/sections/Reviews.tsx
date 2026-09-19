import { useRef } from 'react';
import { VkPlayer } from '@/components/VkPlayer';
import { reviews, vkVideoUrl } from '@/content';
import { useIsDesktop, useSceneIndex } from '@/lib/hooks';
import styles from './Reviews.module.css';

/**
 * 08 / Отзывы — one testimonial fills the viewport; scrolling through the 300vh section swaps
 * them. All four video reviews are pre-loaded as the section approaches; only the active one is
 * shown, the others stay mounted so switching is instant (desktop only).
 */
export function Reviews() {
  const section = useRef<HTMLElement>(null);
  const [active] = useSceneIndex(section, reviews.length);
  const desktop = useIsDesktop();

  const current = reviews[active];

  // Phones: no pin — the four reviews stack, each with its own (tap-to-play) VK player.
  if (!desktop) {
    return (
      <section id="sp-08" ref={section} data-scene className={`${styles.section} ${styles.stack}`} aria-label="08 Отзывы">
        <div className={`${styles.head} mono mono-dim`}>
          <span>08 / ОТЗЫВЫ</span>
          <span>{String(reviews.length).padStart(2, '0')} ВИДЕО</span>
        </div>
        <ul className={styles.list}>
          {reviews.map((r) => (
            <li key={r.videoId} className={styles.item}>
              <div className={styles.company}>{r.company}</div>
              <div className={styles.name}>{r.name}</div>
              <div className={styles.position}>{r.position}</div>
              <div className={styles.player}>
                <VkPlayer id={r.videoId} title={`Видеоотзыв — ${r.company}`} interactive prewarm="100% 0px" hd={1} className={styles.frame} />
              </div>
              <a href={vkVideoUrl(r.videoId)} target="_blank" rel="noopener" className={`${styles.link} mono`}>
                СМОТРЕТЬ В VK →
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
