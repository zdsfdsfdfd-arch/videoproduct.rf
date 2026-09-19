import { useEffect, useRef, useState } from 'react';
import { Picture } from '@/components/Picture';
import { cities, contacts, coverPortrait, coverPoster, heroVideoId, vkEmbedUrl } from '@/content';
import { useAnchorClick, useIsDesktop } from '@/lib/hooks';
import { getEngine } from '@/lib/scroll-engine';
import styles from './Cover.module.css';

/**
 * 00 / Обложка — magazine cover: full-bleed VK showreel (muted, looping) under the poster frame,
 * the director cut out on the right with mouse parallax, and the title moving the opposite way.
 */
export function Cover() {
  const onClick = useAnchorClick();
  const desktop = useIsDesktop();
  const frame = useRef<HTMLIFrameElement>(null);
  const [videoOn, setVideoOn] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // VK autoplay is desktop-only in practice; phones keep the still.
  useEffect(() => {
    if (desktop && !getEngine().reduced) setVideoOn(true);
  }, [desktop]);

  return (
    <section id="sp-00" data-scene className={styles.section} aria-label="Обложка">
      <div className={styles.sticky}>
        <header className={`${styles.header} mono`}>
          <span className={styles.brand}>{contacts.brand}</span>
          <span className={styles.issue}>ЖУРНАЛ О ПРОИЗВОДСТВЕ ВИДЕО · ВЫПУСК 01</span>
          <span className={styles.since}>КАЗАНЬ · С {contacts.since} ГОДА</span>
        </header>

        <div className={styles.stage}>
          <div className={styles.video} aria-hidden="true">
            <div className={styles.videoBox}>
              <Picture photo={coverPoster} alt="" className={styles.poster} loading="eager" fetchPriority="high" />
              {videoOn && (
                <iframe
                  ref={frame}
                  title="Шоурил студии"
                  src={vkEmbedUrl(heroVideoId, '&autoplay=1&loop=1&mute=1&js_api=1')}
                  allow="autoplay; encrypted-media"
                  className={styles.frame}
                  style={{ opacity: videoReady ? 1 : 0 }}
                  onLoad={() => setVideoReady(true)}
                />
              )}
            </div>
            <div className={styles.shade} />
          </div>

          <div className={styles.portrait}>
            <img src={coverPortrait} alt="Роман, режиссёр" width={460} height={690} loading="eager" fetchPriority="high" />
          </div>

          <h1 className={styles.title}>
            <span className={styles.line}>От идеи</span>
            <span className={`${styles.line} ${styles.line2}`}>
              до кадра<span className={styles.dot}>.</span>
            </span>
          </h1>

          <a href="#sp-02" onClick={onClick} data-cursor="СМОТРЕТЬ" className={`${styles.play} mono`}>
            <span className={styles.playRing}>▶</span>ШОУРИЛ · 2500+ РОЛИКОВ
          </a>
        </div>

        <footer className={styles.footer}>
          <p className={styles.tagline}>Создаем видеоролики, которые работают на рост вашей компании</p>
          <div className={`${styles.cities} mono`}>
            {cities.map((c, i) => (
              <span key={c} className={styles.city}>
                {i > 0 && <span className={styles.cityLine} />}
                {c}
              </span>
            ))}
          </div>
          <a href="#sp-01" onClick={onClick} data-cursor="ВПЕРЁД" className={`${styles.next} mono`}>
            ЛИСТАТЬ <span className={styles.nextLine} />
          </a>
        </footer>
      </div>
    </section>
  );
}
