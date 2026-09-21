import { Link } from 'react-router-dom';
import { Picture } from '@/components/Picture';
import { VkPlayer } from '@/components/VkPlayer';
import { cities, contacts, coverPoster, coverReel, coverVideo, heroVideoId, tariffs, vkVideoUrl } from '@/content';
import { useAnchorClick, useIsDesktop } from '@/lib/hooks';
import { getEngine } from '@/lib/scroll-engine';
import styles from './Cover.module.css';

/**
 * 00 / Обложка — the first screen has to answer three questions before anything else: what this
 * studio is, what it can make for you, and what to do next. So the cover keeps its footage and its
 * line, but underneath sits a plain sentence about the work, the two things a visitor actually
 * wants (the reel and a quote), and the three numbers that matter — including the entry price.
 * The director's cut-out that used to stand on the right is gone: it crowded the text on a phone
 * and said nothing a first-time visitor needed.
 *
 * What plays where:
 *   • a self-hosted clip (content → coverVideo), inline and muted — works on every device;
 *   • otherwise, on desktop, the VK showreel in an iframe;
 *   • otherwise, on phones, a slow cross-fade through studio frames — VK's embedded player does not
 *     run inside mobile browsers (it renders «видео недоступно»), and a motionless cover reads as a
 *     video that failed to load. The play button there opens the real showreel in the VK app.
 */
export function Cover() {
  const onClick = useAnchorClick();
  const desktop = useIsDesktop();
  const reduced = getEngine().reduced;
  const vkOn = !coverVideo && desktop && !reduced;
  const reelOn = !coverVideo && !desktop && !reduced;

  return (
    <section id="sp-00" data-scene className={styles.section} aria-label="Обложка">
      <div className={styles.sticky}>
        <header className={`${styles.header} mono`}>
          <span className={styles.brand}>{contacts.brand}</span>
          <span className={styles.issue}>ВИДЕОПРОДАКШН ПОЛНОГО ЦИКЛА</span>
          <span className={styles.since}>КАЗАНЬ · С {contacts.since} ГОДА</span>
        </header>

        <div className={styles.stage}>
          <div className={styles.video} aria-hidden="true">
            <div className={styles.videoBox}>
              {coverVideo ? (
                <video className={styles.poster} poster={coverPoster.src} src={coverVideo} autoPlay muted loop playsInline preload="auto" />
              ) : vkOn ? (
                <VkPlayer id={heroVideoId} title="Шоурил студии" poster={coverPoster.src} autoplay eager holdMs={2200} className={styles.frame} />
              ) : reelOn ? (
                coverReel.map((photo, i) => (
                  <Picture
                    key={photo.src}
                    photo={photo}
                    alt=""
                    className={styles.reelFrame}
                    style={{ animationDelay: `${i * 4.5}s` }}
                    sizes="100vw"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    fetchPriority={i === 0 ? 'high' : 'low'}
                  />
                ))
              ) : (
                <Picture photo={coverPoster} alt="" className={styles.poster} loading="eager" fetchPriority="high" />
              )}
            </div>
            <div className={styles.shade} />
          </div>

          <div className={styles.pitch}>
            <h1 className={styles.title}>
              <span className={styles.line}>От идеи</span>
              <span className={`${styles.line} ${styles.line2}`}>
                до кадра<span className={styles.dot}>.</span>
              </span>
            </h1>

            <p className={styles.sub}>
              Снимаем рекламные, имиджевые и корпоративные ролики для бизнеса. Сценарий, съёмка, монтаж, цвет, звук и графика — под
              ключ, своей командой и на своём оборудовании.
            </p>

            <div className={styles.actions}>
              <Link to="/portfolio" className={styles.cta}>
                Смотреть работы
              </Link>
              <a href="#sp-09" onClick={onClick} className={`${styles.cta} ${styles.ctaGhost}`}>
                Рассчитать стоимость
              </a>
              {desktop ? (
                <a href="#sp-02" onClick={onClick} className={`${styles.play} mono`}>
                  <span className={styles.playRing}>▶</span>ШОУРИЛ
                </a>
              ) : (
                <a href={vkVideoUrl(heroVideoId)} target="_blank" rel="noopener" className={`${styles.play} mono`}>
                  <span className={styles.playRing}>▶</span>ШОУРИЛ В VK
                </a>
              )}
            </div>

            <ul className={`${styles.marks} mono`}>
              <li>2500+ РОЛИКОВ</li>
              <li>25 ГОРОДОВ СЪЁМОК</li>
              <li>
                РОЛИК <span className={styles.markAccent}>{tariffs[0].price.toUpperCase()}</span>
              </li>
            </ul>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={`${styles.cities} mono`}>
            {cities.map((c, i) => (
              <span key={c} className={styles.city}>
                {i > 0 && <span className={styles.cityLine} />}
                {c}
              </span>
            ))}
          </div>
          <a href="#sp-01" onClick={onClick} className={`${styles.next} mono`}>
            ЛИСТАТЬ <span className={styles.nextLine} />
          </a>
        </footer>
      </div>
    </section>
  );
}
