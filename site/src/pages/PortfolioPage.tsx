import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useOpenCase } from '@/App';
import { VkPlayer } from '@/components/VkPlayer';
import { PageShell } from './PageShell';
import { works, archiveWorks, allWorks, reviews, vkVideoUrl } from '@/content';
import { useIsDesktop } from '@/lib/hooks';
import styles from './PortfolioPage.module.css';

const SIZES = ['xl', 's', 'm', 'l', 's', 'm', 'xl', 's', 'm', 'l', 's', 'm', 'xl', 's', 'm', 'l', 'm', 's'];

/**
 * Cinematic wall of every project with a type filter, live muted previews, click → case; then the video
 * reviews as «истории клиентов». The wall is the nine confirmed cases followed by the VK archive (titles
 * described from the frame, awaiting the studio's wording) — case indices are positions in `allWorks`.
 */
export function PortfolioPage() {
  const openCase = useOpenCase();
  const desktop = useIsDesktop();
  const [filter, setFilter] = useState<string | null>(null);
  const types = useMemo(() => Array.from(new Set(allWorks.map((w) => w.type))), []);
  const shown = allWorks.map((w, i) => ({ w, i })).filter(({ w }) => !filter || w.type === filter);
  const confirmed = shown.filter(({ w }) => !w.archive);
  const archive = shown.filter(({ w }) => w.archive);
  const size = (i: number, k: number) => (filter ? ['xl', 'm', 'm', 'l'][k % 4] : SIZES[i % SIZES.length]);

  return (
    <PageShell
      index="01"
      kicker={`ПОРТФОЛИО 100+ · ${allWorks.length} РОЛИКОВ С ВИДЕО`}
      title={<>Портфо<em>лио</em></>}
      lead={`На сайте студии — раздел «Портфолио 100+»: ознакомительные ролики, видео о продукции, имиджевые и продающие видео. Здесь — ${allWorks.length} роликов из VK-канала студии: ${works.length} кейсов с подтверждёнными названиями и ${archiveWorks.length} из архива. По клику открывается кейс.`}
    >
      <div className={styles.filters} role="tablist" aria-label="Тип проекта">
        <button type="button" role="tab" aria-selected={filter === null} className={`${styles.filter} mono`} onClick={() => setFilter(null)}>
          ВСЕ <span className={styles.filterCount}>{allWorks.length}</span>
        </button>
        {types.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={filter === t} className={`${styles.filter} mono`} onClick={() => setFilter(t)}>
            {t} <span className={styles.filterCount}>{allWorks.filter((w) => w.type === t).length}</span>
          </button>
        ))}
      </div>

      <section id="sp-02" data-scene className={styles.wall} aria-label="Портфолио">
        {confirmed.map(({ w, i }, k) => (
          <Tile key={w.id} i={i} size={size(i, k)} work={w} desktop={desktop} onOpen={openCase} />
        ))}
        {archive.length > 0 && (
          <div className={`${styles.divider} mono mono-dim`} role="presentation">
            <span>ЕЩЁ ИЗ АРХИВА VK · {archive.length}</span>
            <span className={styles.dividerNote}>НАЗВАНИЯ ОПИСАНЫ ПО КАДРУ И УТОЧНЯЮТСЯ У СТУДИИ</span>
          </div>
        )}
        {archive.map(({ w, i }, k) => (
          <Tile key={w.id} i={i} size={size(i, k + confirmed.length)} work={w} desktop={desktop} onOpen={openCase} />
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

function Tile({ i, size, work, desktop, onOpen }: { i: number; size: string; work: (typeof allWorks)[number]; desktop: boolean; onOpen: (i: number, el: HTMLElement) => void }) {
  const thumb = useRef<HTMLSpanElement>(null);
  return (
    <button type="button" data-cursor="ОТКРЫТЬ" className={styles.tile} data-size={size} onClick={() => thumb.current && onOpen(i, thumb.current)}>
      <span ref={thumb} className={styles.thumb}>
        {desktop ? (
          <VkPlayer id={work.id} title={work.title} poster={work.poster} autoplay hd={1} prewarm="120% 0px" className={styles.player} />
        ) : work.poster ? (
          <img src={work.poster} alt="" loading="lazy" className={styles.poster} />
        ) : (
          <span className={styles.placeholder}>
            <span className={styles.placeholderIndex}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.placeholderTitle}>{work.title}</span>
            <span className={`${styles.placeholderNote} mono`}>КАДР ИЗ ФИЛЬМА · СКОРО</span>
          </span>
        )}
        <span aria-hidden="true" className={styles.badge}>
          ▶ VK VIDEO
        </span>
      </span>
      <span className={`${styles.meta} mono`} style={{ color: work.accent ? 'var(--accent)' : undefined }}>
        {String(i + 1).padStart(2, '0')} · {work.type}
        {work.archive && <span className={styles.archiveMark}>АРХИВ</span>}
      </span>
      <span className={styles.name}>{work.title}</span>
    </button>
  );
}
