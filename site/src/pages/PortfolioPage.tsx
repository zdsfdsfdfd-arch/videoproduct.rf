import { useRef } from 'react';
import { useOpenCase } from '@/App';
import { VkPlayer } from '@/components/VkPlayer';
import { PageShell } from './PageShell';
import { works } from '@/content';
import { useIsDesktop } from '@/lib/hooks';
import styles from './PortfolioPage.module.css';

/** Cinematic wall of every project: mixed sizes, live muted previews, click → case. */
export function PortfolioPage() {
  const openCase = useOpenCase();
  const desktop = useIsDesktop();
  return (
    <PageShell index="01" kicker="ПОРТФОЛИО 100+ · ВИДЕО ПО ПРОЕКТАМ" title={<>Портфо<em>лио</em></>} lead="На сайте студии — раздел «Портфолио 100+»: ознакомительные ролики, видео о продукции, имиджевые и продающие видео. Здесь — девять проектов с видео.">
      <section id="sp-02" data-scene className={styles.wall} aria-label="Портфолио">
        {works.map((w, i) => (
          <Tile key={w.id} i={i} work={w} desktop={desktop} onOpen={openCase} />
        ))}
      </section>
    </PageShell>
  );
}

function Tile({ i, work, desktop, onOpen }: { i: number; work: (typeof works)[number]; desktop: boolean; onOpen: (i: number, el: HTMLElement) => void }) {
  const thumb = useRef<HTMLSpanElement>(null);
  return (
    <button type="button" data-cursor="ОТКРЫТЬ" className={styles.tile} data-size={['xl', 's', 'm', 'l', 's', 'm', 'xl', 's', 'm'][i]} onClick={() => thumb.current && onOpen(i, thumb.current)}>
      <span ref={thumb} className={styles.thumb}>
        {desktop ? (
          <VkPlayer id={work.id} title={work.title} poster={work.poster} autoplay hd={1} prewarm="120% 0px" className={styles.player} />
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
        {String(i + 1).padStart(2, '0')} · {work.type}
      </span>
      <span className={styles.name}>{work.title}</span>
    </button>
  );
}
