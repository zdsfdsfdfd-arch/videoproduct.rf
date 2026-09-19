import { PageShell } from './PageShell';
import { VkPlayer } from '@/components/VkPlayer';
import { reviews, vkVideoUrl } from '@/content';
import styles from './ReviewsPage.module.css';

/** All four video testimonials, one per row, each with its player. */
export function ReviewsPage() {
  return (
    <PageShell index="05" kicker="ВИДЕООТЗЫВЫ · 600+ КЛИЕНТОВ" title={<>Отзы<em>вы</em></>}>
      <section id="sp-08" data-scene className={styles.list} aria-label="Отзывы">
        {reviews.map((r, i) => (
          <article key={r.videoId} className={styles.row}>
            <div className={styles.text}>
              <div className={`${styles.num} mono`}>{String(i + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}</div>
              <div className={`${styles.company} mono`}>{r.company}</div>
              <h2 className={styles.name}>{r.name}</h2>
              <p className={styles.position}>{r.position}</p>
              <a href={vkVideoUrl(r.videoId)} target="_blank" rel="noopener" data-cursor="ОТКРЫТЬ" className={`${styles.link} mono`}>
                СМОТРЕТЬ В VK →
              </a>
            </div>
            <VkPlayer id={r.videoId} title={`Видеоотзыв — ${r.company}`} interactive prewarm="100% 0px" className={styles.player} />
          </article>
        ))}
      </section>
    </PageShell>
  );
}
