import { Link } from 'react-router-dom';
import { PageShell } from './PageShell';
import { VkPlayer } from '@/components/VkPlayer';
import { Clients } from '@/components/sections/Clients';
import { reviews, vkVideoUrl, works, facts } from '@/content';
import { reviewRelatedWork } from '@/content/pages';
import styles from './ReviewsPage.module.css';

/** Отзывы — four video testimonials with the related project where it's known, the numbers, the clients. */
export function ReviewsPage() {
  return (
    <PageShell index="05" kicker="4 ВИДЕООТЗЫВА · 600+ КЛИЕНТОВ · С 2015 ГОДА" title={<>Отзы<em>вы</em></>} lead="Клиенты говорят о работе со студией на камеру — без текстовых цитат, только видео. Рядом с каждым отзывом — проект, о котором идёт речь, если он есть в портфолио.">
      <section className={styles.strip} aria-label="Цифры" data-scene>
        {facts.slice(0, 4).map((f) => (
          <div key={f.label} className={styles.fact}>
            <span className={styles.factValue}>{f.value}</span>
            <span className={`${styles.factLabel} mono`}>{f.label}</span>
          </div>
        ))}
      </section>

      <section id="sp-08" data-scene className={styles.list} aria-label="Отзывы">
        {reviews.map((r, i) => {
          const related = reviewRelatedWork[r.videoId] ? works.find((w) => w.id === reviewRelatedWork[r.videoId]) : undefined;
          return (
            <article key={r.videoId} className={styles.row}>
              <div className={styles.text}>
                <div className={`${styles.num} mono`}>
                  {String(i + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
                </div>
                <div className={`${styles.company} mono`}>{r.company}</div>
                <h2 className={styles.name}>{r.name}</h2>
                <p className={styles.position}>{r.position}</p>
                <div className={styles.links}>
                  <a href={vkVideoUrl(r.videoId)} target="_blank" rel="noopener" data-cursor="ОТКРЫТЬ" className={`${styles.link} mono`}>
                    СМОТРЕТЬ В VK →
                  </a>
                  {related && (
                    <Link to="/portfolio" data-cursor="ОТКРЫТЬ" className={`${styles.related} mono`}>
                      ПРОЕКТ: {related.title.toUpperCase()} →
                    </Link>
                  )}
                </div>
              </div>
              <VkPlayer id={r.videoId} title={`Видеоотзыв — ${r.company}`} interactive prewarm="100% 0px" className={styles.player} />
            </article>
          );
        })}
      </section>

      <Clients />

      <section className={styles.cta} data-scene>
        <h2 className={styles.ctaTitle}>
          Следующий отзыв —<br />
          <em>ваш</em>.
        </h2>
        <div className={styles.ctaActions}>
          <Link to="/brif" data-cursor="ВПЕРЁД" className={`${styles.ctaBtn} mono`}>
            ЗАПОЛНИТЬ БРИФ →
          </Link>
          <Link to="/portfolio" data-cursor="ОТКРЫТЬ" className={`${styles.ctaGhost} mono`}>
            СМОТРЕТЬ РАБОТЫ
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
