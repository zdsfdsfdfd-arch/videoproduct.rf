import { Picture } from '@/components/Picture';
import { VkPlayer } from '@/components/VkPlayer';
import { cities, contacts, coverPortrait, coverPoster, heroVideoId, vkVideoUrl } from '@/content';
import { useAnchorClick, useIsDesktop } from '@/lib/hooks';
import { getEngine } from '@/lib/scroll-engine';
import styles from './Cover.module.css';

/**
 * 00 / Обложка — magazine cover: full-bleed VK showreel (muted, looping) under the poster frame,
 * the director cut out on the right with mouse parallax, and the title moving the opposite way.
 * Phones keep the still: mobile browsers (Safari above all) block the cookies VK's embedded player
 * needs and it renders «видео недоступно» instead of the showreel. The play button there opens the
 * showreel in the VK app / VK site, where it always plays.
 */
export function Cover() {
  const onClick = useAnchorClick();
  const desktop = useIsDesktop();
  const videoOn = desktop && !getEngine().reduced;

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
              {videoOn ? (
                <VkPlayer id={heroVideoId} title="Шоурил студии" poster={coverPoster.src} autoplay eager holdMs={2200} className={styles.frame} />
              ) : (
                <Picture photo={coverPoster} alt="" className={styles.poster} loading="eager" fetchPriority="high" />
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

          {desktop ? (
            <a href="#sp-02" onClick={onClick} data-cursor="СМОТРЕТЬ" className={`${styles.play} mono`}>
              <span className={styles.playRing}>▶</span>ШОУРИЛ · 2500+ РОЛИКОВ
            </a>
          ) : (
            <a href={vkVideoUrl(heroVideoId)} target="_blank" rel="noopener" className={`${styles.play} mono`}>
              <span className={styles.playRing}>▶</span>ШОУРИЛ В VK · 2500+ РОЛИКОВ
            </a>
          )}
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
