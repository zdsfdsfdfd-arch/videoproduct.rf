import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Picture } from '@/components/Picture';
import { cities, contacts, coverPoster, coverVideo, heroVideoId, kinescopeEmbedUrl, kinescopeFileUrl, tariffs, vkVideoUrl } from '@/content';
import { useAnchorClick, useIsDesktop } from '@/lib/hooks';
import { delay } from '@/lib/reveal';
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
 * The footage is the studio's own reel on Kinescope, played by Kinescope's player (content →
 * coverVideo). It runs everywhere, phones included — which is why the VK iframe and the phone
 * frame-reel that used to stand in for it are gone. The poster frame sits underneath it always,
 * so the first paint is a frame of the studio's work rather than black, and it is still there if
 * the player never arrives.
 */
export function Cover() {
  const onClick = useAnchorClick();
  const desktop = useIsDesktop();
  const reduced = getEngine().reduced;
  const [clipDead, setClipDead] = useState(false);
  const playing = coverVideo.mode !== 'off' && !reduced && !clipDead;

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
              <Picture photo={coverPoster} alt="" className={styles.poster} loading="eager" fetchPriority="high" />
              {playing && (coverVideo.mode === 'embed' ? <CoverEmbed /> : <CoverFile onDead={() => setClipDead(true)} />)}
            </div>
            <div className={styles.shade} />
          </div>

          <div className={styles.pitch}>
            {/* the reveal sits on the lines, not on the h1: the heading's own transform is the
                mouse parallax, and the two would overwrite each other */}
            <h1 className={styles.title}>
              <span data-reveal="display" className={styles.line}>
                От идеи
              </span>
              <span data-reveal="display" style={delay(110)} className={`${styles.line} ${styles.line2}`}>
                до кадра<span className={styles.dot}>.</span>
              </span>
            </h1>

            <p data-reveal style={delay(260)} className={styles.sub}>
              Снимаем рекламные, имиджевые и корпоративные ролики для бизнеса. Сценарий, съёмка, монтаж, цвет, звук и графика — под
              ключ, своей командой и на своём оборудовании.
            </p>

            <div data-reveal="soft" style={delay(340)} className={styles.actions}>
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

            <ul data-reveal="soft" style={delay(420)} className={`${styles.marks} mono`}>
              <li>2500+ РОЛИКОВ</li>
              <li>25 ГОРОДОВ СЪЁМОК</li>
              <li>
                РОЛИК <span className={styles.markAccent}>{tariffs[0].price.toUpperCase()}</span>
              </li>
            </ul>
          </div>
        </div>

        <footer className={styles.footer}>
          <div data-reveal="soft" style={delay(500)} className={`${styles.cities} mono`}>
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

/**
 * Kinescope's player as a backdrop: muted, looping, no controls, and `pointer-events: none` so it
 * never takes a click or a hover meant for the page. Unlike a direct file link it negotiates its
 * rendition against the size it is drawn at, which is the whole reason it is here — a cover this
 * size needs far more than the 720p the direct link was serving.
 *
 * A frame that cannot load draws the browser's own error page, and that page is opaque: on a
 * network where Kinescope is unreachable — a blocker, an office firewall — the cover would be a
 * blank grey rectangle instead of the poster underneath. So the frame starts invisible and is
 * faded in only once a no-cors request has shown that the host answers at all. It loads the whole
 * time regardless, so nothing is waiting on the check.
 */
function CoverEmbed() {
  const [reachable, setReachable] = useState(false);

  useEffect(() => {
    let live = true;
    // opaque response: we cannot read it, and do not need to — that it came back is the answer
    fetch(kinescopeEmbedUrl(coverVideo.kinescopeId), { mode: 'no-cors', cache: 'no-store' })
      .then(() => live && setReachable(true))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  return (
    <iframe
      src={kinescopeEmbedUrl(coverVideo.kinescopeId)}
      title=""
      tabIndex={-1}
      allow="autoplay; encrypted-media"
      frameBorder="0"
      className={styles.embed}
      data-on={reachable ? '' : undefined}
    />
  );
}

/**
 * The plain-file path (content → coverVideo.mode = 'file'), kept as a way back.
 *
 * The renditions go in as <source> children, sharpest first: the browser walks the list by itself
 * and steps down when one is missing. With a list rather than a single src the element does not
 * fire `error` once the candidates run out — it goes to networkState NETWORK_NO_SOURCE instead,
 * which is what the poll below watches for. That is a statement of fact, not a deadline, so a slow
 * connection is never mistaken for a dead file; the long stop after it only covers the other case,
 * a file that arrives but never yields a frame.
 */
const NO_SOURCE = 3; // HTMLMediaElement.NETWORK_NO_SOURCE — every candidate was refused
const GIVE_UP = 20000; // downloading all this time without a frame is not a cover either

function CoverFile({ onDead }: { onDead: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // autoplay can be refused (low power mode, a policy we do not control) — that is not a failure
    // of the file, so it only matters that a frame arrived
    void v.play().catch(() => {});
    if (v.readyState >= 2) return;

    const started = Date.now();
    const poll = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      if (el.readyState >= 2) {
        clearInterval(poll);
        return;
      }
      if (el.networkState === NO_SOURCE || Date.now() - started > GIVE_UP) {
        clearInterval(poll);
        onDead();
      }
    }, 400);
    return () => clearInterval(poll);
  }, [onDead]);

  return (
    <video ref={ref} className={styles.clip} autoPlay muted loop playsInline preload="auto">
      {coverVideo.renditions.map((q) => (
        <source key={q} src={kinescopeFileUrl(coverVideo.kinescopeId, q)} type="video/mp4" />
      ))}
    </video>
  );
}
