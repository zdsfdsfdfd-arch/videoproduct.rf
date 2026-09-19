import { useEffect, useRef, useState } from 'react';
import { reviews, vkEmbedUrl, vkVideoUrl } from '@/content';
import { useIsDesktop, useSceneIndex } from '@/lib/hooks';
import styles from './Reviews.module.css';

/**
 * 08 / Отзывы — one testimonial fills the viewport; scrolling through the 300vh section swaps
 * them. The client's video review plays beside the name (desktop only) and the VK link follows.
 */
export function Reviews() {
  const section = useRef<HTMLElement>(null);
  const [active] = useSceneIndex(section, reviews.length);
  const desktop = useIsDesktop();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => setVisible(en.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const current = reviews[active];
  const playerOn = desktop && visible;

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
            {playerOn && (
              <iframe
                key={current.videoId}
                title={`Видеоотзыв — ${current.company}`}
                src={vkEmbedUrl(current.videoId)}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                className={styles.frame}
              />
            )}
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
