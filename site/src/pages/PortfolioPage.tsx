import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOpenCase } from '@/App';
import { VkPlayer } from '@/components/VkPlayer';
import { PageShell } from './PageShell';
import { works, reviews, vkVideoUrl } from '@/content';
import { useIsDesktop } from '@/lib/hooks';
import styles from './PortfolioPage.module.css';

const SIZES = ['xl', 's', 'm', 'l', 's', 'm', 'xl', 's', 'm'];

/** Cinematic wall of every project with a type filter, live muted previews, click → case; then the video reviews as «истории клиентов». */
export function PortfolioPage() {
  const openCase = useOpenCase();
  const desktop = useIsDesktop();
  const [filter, setFilter] = useState<string | null>(null);
  const types = useMemo(() => Array.from(new Set(works.map((w) => w.type))), []);
  const shown = works.map((w, i) => ({ w, i })).filter(({ w }) => !filter || w.type === filter);

  return (
    <PageShell index="01" kicker="ПОРТФОЛИО 100+ · 9 ПРОЕКТОВ С ВИДЕО" title={<>Портфо<em>лио</em></>} lead="На сайте студии — раздел «Портфолио 100+»: ознакомительные ролики, видео о продукции, имиджевые и продающие видео. Здесь — девять проектов с видео, по клику открывается кейс.">
      <div className={styles.filters} role="tablist" aria-label="Тип проекта">
        <button type="button" role="tab" aria-selected={filter === null} className={`${styles.filter} mono`} onClick={() => setFilter(null)}>
          ВСЕ <span className={styles.filterCount}>{works.length}</span>
        </button>
        {types.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={filter === t} className={`${styles.filter} mono`} onClick={() => setFilter(t)}>
            {t} <span className={styles.filterCount}>{works.filter((w) => w.type === t).length}</span>
          </button>
        ))}
      </div>

      <section id="sp-02" data-scene className={styles.wall} aria-label="Портфолио">
        {shown.map(({ w, i }, k) => (
          <Tile key={w.id} i={i} size={filter ? ['xl', 'm', 'm', 'l'][k % 4] : SIZES[i]} work={w} desktop={desktop} onOpen={openCase} />
        ))}
      </section>

      <section className={styles.stories} aria-label="Истории клиентов" data-scene>
        <div className={`${styles.storiesHead} mono mono-dim`}>
          <span>ИСТОРИИ КЛИЕНТОВ</span>
          <Link to="/otzyvy" data-cursor="ОТКРЫТЬ">ВСЕ ВИДЕООТЗЫВЫ →</Link>
        </div>
        <ul className={styles.storyList}>
          {reviews.map((r) => (
            <li key={r.videoId} className={styles.story}>
              <span className={`${styles.storyCompany} mono`}>{r.company}</span>
              <span className={styles.storyName}>{r.name}</span>
              <span className={styles.storyPosition}>{r.position}</span>
              <a href={vkVideoUrl(r.videoId)} target="_blank" rel="noopener" data-cursor="ОТКРЫТЬ" className={`${styles.storyLink} mono`}>
                СМОТРЕТЬ ОТЗЫВ →
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

function Tile({ i, size, work, desktop, onOpen }: { i: number; size: string; work: (typeof works)[number]; desktop: boolean; onOpen: (i: number, el: HTMLElement) => void }) {
  const thumb = useRef<HTMLSpanElement>(null);
  return (
    <button type="button" data-cursor="ОТКРЫТЬ" className={styles.tile} data-size={size} onClick={() => thumb.current && onOpen(i, thumb.current)}>
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
