import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { VkPlayer } from '@/components/VkPlayer';
import { works, allWorks } from '@/content';
import { useAnchorClick, useIsDesktop } from '@/lib/hooks';
import styles from './Works.module.css';

interface Props {
  onOpen: (index: number, thumb: HTMLElement) => void;
}

/**
 * 02 / Работы — a horizontal portfolio wall driven by vertical scroll. The section is 340vh tall;
 * the pinned track moves by --e × --tw, where --tw is the overflow of the track measured on resize.
 * Every card carries a muted VK preview that is pre-loaded two screens ahead, behind its still frame,
 * so there is never a black card while the player spins up.
 */
export function Works({ onOpen }: Props) {
  const section = useRef<HTMLElement>(null);
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
      const tw = Math.max(0, tr.scrollWidth - innerWidth + (innerWidth < 768 ? 28 : 52));
      sec.style.setProperty('--tw', `${tw}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    addEventListener('resize', measure);
    // fonts/images can change the track width after first paint
    const t = setTimeout(measure, 600);
    return () => {
      ro.disconnect();
      removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, []);

  return (
    <section id="sp-02" ref={section} data-scene className={styles.section} aria-label="02 Работы">
      <div className={styles.sticky}>
        <div className={`${styles.head} mono mono-dim`}>
          <span>02 / РАБОТЫ</span>
          <span>ПОРТФОЛИО 100+ · ГОРИЗОНТАЛЬНАЯ ЛЕНТА</span>
        </div>

        <div ref={track} className={styles.track}>
          <h2 className={styles.title}>
            Снятое
            <br />
            <span className={styles.titleDim}>и смонтированное</span>
          </h2>

          {works.map((w, i) => (
            <WorkCard key={w.id} index={i} work={w} desktop={desktop} armed={armed} onOpen={onOpen} />
          ))}

          <div className={styles.outro}>
            <p className="body-copy">На сайте студии — раздел «Портфолио 100+»: ознакомительные ролики, видео о продукции, имиджевые и продающие видео.</p>
            <Link to="/portfolio" data-cursor="ОТКРЫТЬ" className={`${styles.cta} mono`}>
              ВСЕ {allWorks.length} РОЛИКОВ →
            </Link>
            <a href="#sp-09" onClick={onClick} data-cursor="ВПЕРЁД" className={`${styles.cta} mono`}>
              ОБСУДИТЬ ПРОЕКТ →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkCard({ index, work, desktop, armed, onOpen }: { index: number; work: (typeof works)[number]; desktop: boolean; armed: boolean; onOpen: Props['onOpen'] }) {
  const thumb = useRef<HTMLSpanElement>(null);

  const style: CSSProperties = {
    width: work.w,
    alignSelf: work.align === 'center' ? 'center' : work.align === 'start' ? 'flex-start' : 'flex-end',
    marginTop: work.align === 'start' ? work.offset : undefined,
    marginBottom: work.align === 'end' ? work.offset : undefined,
  };

  return (
    <button
      type="button"
      data-cursor="ОТКРЫТЬ"
      className={styles.card}
      style={style}
      onClick={() => thumb.current && onOpen(index, thumb.current)}
    >
      <span ref={thumb} className={styles.thumb} style={{ height: work.h }}>
        {desktop ? (
          <VkPlayer id={work.id} title={work.title} poster={work.poster} autoplay hd={1} eager={armed} className={styles.player} />
        ) : work.poster ? (
          <img src={work.poster} alt="" loading="lazy" className={styles.poster} />
        ) : (
          <span className={styles.placeholder}>{work.title}</span>
        )}
        <span aria-hidden="true" className={styles.badge}>
          ▶ VK VIDEO
        </span>
      </span>
      <span className={`${styles.meta} mono`} style={{ color: work.accent ? 'var(--accent)' : undefined }}>
        {String(index + 1).padStart(2, '0')} · {work.type}
        {index === 0 && <span className={styles.metaRight}>2500+ РОЛИКОВ В АРХИВЕ</span>}
      </span>
      <span className={`${styles.name} ${work.big ? styles.nameBig : ''}`} style={{ maxWidth: work.maxTitle }}>
        {work.title}
      </span>
    </button>
  );
}
