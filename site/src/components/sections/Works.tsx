import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SkipPin } from '@/components/chrome/SkipPin';
import { VkPlayer } from '@/components/VkPlayer';
import { works, allWorks } from '@/content';
import { useAnchorClick, useIsDesktop } from '@/lib/hooks';
import { delay } from '@/lib/reveal';
import styles from './Works.module.css';

interface Props {
  onOpen: (index: number, thumb: HTMLElement) => void;
}

/**
 * 02 / Работы — a horizontal reel of the portfolio, driven by vertical scroll.
 *
 * The ribbon was the right idea and the wrong composition: the chapter title rode the track as its
 * first slide, so the first screen of the section was a headline and one card cut in half at the
 * edge, and every card had its own size and vertical offset, which read as clutter rather than as a
 * wall. The title, the copy and the two links now hold a column of their own on the left, with a
 * bar that shows how far along the reel you are; the cards are one size on one baseline and start
 * on screen, so the chapter opens on the work.
 *
 * The track moves by --e × --tw, where --tw is the overflow measured against the reel's own width.
 * Every card carries a muted VK preview pre-loaded two screens ahead, behind its still frame, so
 * there is never a black card while the player spins up.
 */
export function Works({ onOpen }: Props) {
  const section = useRef<HTMLElement>(null);
  const reel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const onClick = useAnchorClick();
  const desktop = useIsDesktop();
  const [armed, setArmed] = useState(false);

  // The cards live on a horizontal track, mostly off-screen to the right, so per-card visibility
  // would arm them too late. Arm all nine as soon as the section is 1.5 screens away.
  useEffect(() => {
    const sec = section.current;
    if (!sec || !desktop) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: '150% 0px' },
    );
    io.observe(sec);
    return () => io.disconnect();
  }, [desktop]);

  useLayoutEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr) return;
    const measure = () => {
      const view = reel.current?.clientWidth ?? innerWidth;
      sec.style.setProperty('--tw', `${Math.max(0, tr.scrollWidth - view)}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    if (reel.current) ro.observe(reel.current);
    addEventListener('resize', measure);
    // fonts/images can change the track width after first paint
    const t = setTimeout(measure, 600);
    return () => {
      ro.disconnect();
      removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  const shown = desktop ? works : works.filter((w) => w.poster);
  const total = desktop ? allWorks.length : allWorks.filter((w) => w.poster).length;

  const aside = (
    <div className={styles.aside}>
      <h2 data-reveal="display" className={styles.title}>
        Снятое
        <br />
        <span className={styles.titleDim}>и смонтированное</span>
      </h2>
      <p data-reveal style={delay(90)} className={`${styles.note} body-copy`}>
        Ознакомительные ролики, видео о продукции, имиджевые и продающие — здесь {shown.length} из архива на {total}.
      </p>
      <div data-reveal style={delay(170)} className={styles.links}>
        <Link to="/portfolio" className={styles.cta}>
          Все {total} роликов →
        </Link>
        <a href="#sp-09" onClick={onClick} className={`${styles.cta} ${styles.ctaGhost}`}>
          Обсудить проект →
        </a>
      </div>
      {desktop && (
        <div aria-hidden="true" className={styles.rail}>
          <span className={styles.railFill} />
        </div>
      )}
    </div>
  );

  return (
    <section id="sp-02" ref={section} data-scene className={styles.section} aria-label="02 Работы">
      <div className={styles.sticky}>
        <div className={`${styles.head} mono mono-dim`}>
          <span>02 / РАБОТЫ</span>
          <span className={styles.headRight}>ПОРТФОЛИО {total}+ · ГОРИЗОНТАЛЬНАЯ ЛЕНТА</span>
        </div>

        <div className={styles.body}>
          {aside}

          <div ref={reel} className={styles.reel}>
            <div ref={track} className={styles.track}>
              {shown.map((w, k) => (
                <WorkCard key={w.id} index={works.indexOf(w)} n={k + 1} work={w} desktop={desktop} armed={armed} onOpen={onOpen} />
              ))}
            </div>
          </div>
        </div>

        {desktop && <SkipPin from="sp-02" className={styles.skip} />}
      </div>
    </section>
  );
}

/** `index` opens the right case; `n` is the number the visitor sees, so the reel reads 01…N. */
function WorkCard({ index, n, work, desktop, armed, onOpen }: { index: number; n: number; work: (typeof works)[number]; desktop: boolean; armed: boolean; onOpen: Props['onOpen'] }) {
  const thumb = useRef<HTMLSpanElement>(null);

  return (
    <button type="button" className={styles.card} onClick={() => thumb.current && onOpen(index, thumb.current)}>
      <span ref={thumb} className={styles.thumb}>
        {desktop ? (
          <VkPlayer id={work.id} title={work.title} poster={work.poster} autoplay hd={1} eager={armed} className={styles.player} />
        ) : work.poster ? (
          <img src={work.poster} alt="" loading="lazy" className={styles.poster} />
        ) : (
          // no still frame for this project yet — a designed card instead of an empty tile
          <span className={styles.placeholder}>
            <span className={styles.placeholderIndex}>{String(n).padStart(2, '0')}</span>
            <span className={styles.placeholderTitle}>{work.title}</span>
            <span className={`${styles.placeholderNote} mono`}>КАДР ИЗ ФИЛЬМА · СКОРО</span>
          </span>
        )}
        <span aria-hidden="true" className={styles.badge}>
          ▶ VK VIDEO
        </span>
      </span>
      <span className={`${styles.meta} mono`} style={{ color: work.accent ? 'var(--accent)' : undefined }}>
        {String(n).padStart(2, '0')} · {work.type}
      </span>
      <span className={styles.name}>{work.title}</span>
    </button>
  );
}
