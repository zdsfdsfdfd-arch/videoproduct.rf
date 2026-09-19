import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { vkEmbedUrl, works } from '@/content';
import { useAnchorClick, useIsDesktop } from '@/lib/hooks';
import { getEngine } from '@/lib/scroll-engine';
import styles from './Works.module.css';

interface Props {
  onOpen: (index: number, thumb: HTMLElement) => void;
}

/**
 * 02 / Работы — a horizontal portfolio wall driven by vertical scroll. The section is 340vh tall;
 * the pinned track moves by --e × --tw, where --tw is the overflow of the track measured on resize.
 * Cards with a still frame start their VK preview on hover; the one card without a still
 * (university film) loads straight away so it is never empty.
 */
export function Works({ onOpen }: Props) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const onClick = useAnchorClick();
  const desktop = useIsDesktop();

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
            <WorkCard key={w.id} index={i} work={w} desktop={desktop} onOpen={onOpen} />
          ))}

          <div className={styles.outro}>
            <p className="body-copy">На сайте студии — раздел «Портфолио 100+»: ознакомительные ролики, видео о продукции, имиджевые и продающие видео.</p>
            <a href="#sp-09" onClick={onClick} data-cursor="ВПЕРЁД" className={`${styles.cta} mono`}>
              ОБСУДИТЬ ПРОЕКТ →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkCard({ index, work, desktop, onOpen }: { index: number; work: (typeof works)[number]; desktop: boolean; onOpen: Props['onOpen'] }) {
  const thumb = useRef<HTMLSpanElement>(null);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  const previews = desktop && !getEngine().reduced && !getEngine().coarse;

  // no still frame → the preview loads immediately (desktop only, like the prototype)
  useEffect(() => {
    if (previews && !work.poster) setArmed(true);
  }, [previews, work.poster]);

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
      onPointerEnter={() => previews && setArmed(true)}
    >
      <span ref={thumb} className={styles.thumb} style={{ height: work.h }}>
        {work.poster ? (
          <img src={work.poster} alt="" loading="lazy" className={styles.poster} />
        ) : (
          <span className={styles.placeholder}>{work.title}</span>
        )}
        {armed && (
          <iframe
            title={work.title}
            src={vkEmbedUrl(work.id, '&autoplay=1&loop=1&mute=1').replace('hd=2', 'hd=1')}
            loading="lazy"
            allow="autoplay; encrypted-media"
            className={styles.frame}
            style={{ opacity: ready ? 1 : 0 }}
            onLoad={() => setReady(true)}
          />
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
