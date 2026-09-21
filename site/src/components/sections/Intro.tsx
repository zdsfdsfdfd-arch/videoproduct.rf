import { Link } from 'react-router-dom';
import { allWorks, facts, processSteps, reviews, servicesTotal, tariffs } from '@/content';
import { useAnchorClick } from '@/lib/hooks';
import { delay, stagger } from '@/lib/reveal';
import styles from './Intro.module.css';

/**
 * 01 / Начало — who the studio is, and then, plainly, what is on this site. The six cards are the
 * page's table of contents: a first-time visitor sees the sections, the counts and the entry price
 * without scrolling through the whole magazine to find them.
 */
const sections = [
  { to: '/portfolio', name: 'Портфолио', note: `${allWorks.length} роликов в подборке, 2500+ в архиве` },
  { to: '/uslugi', name: 'Услуги', note: `${servicesTotal} направлений съёмки` },
  { to: '/tarify', name: 'Тарифы', note: `Ролик ${tariffs[0].price.toLowerCase()}` },
  { to: '#sp-03', name: 'Как мы работаем', note: `${processSteps.length} этапов производства` },
  { to: '/komanda', name: 'Команда', note: 'Съёмочная группа до 15 человек' },
  { to: '/otzyvy', name: 'Отзывы', note: `${reviews.length} видеоотзыва клиентов` },
] as const;

export function Intro() {
  const onClick = useAnchorClick();

  return (
    <section id="sp-01" data-scene className={styles.section} aria-label="01 Начало">
      <div className="grid12">
        <div data-reveal="soft" className={`${styles.index} mono mono-dim`}>01 / НАЧАЛО</div>

        <h2 className={styles.title}>
          <span className={styles.line1}>Видеопродакшн</span>
          <span className={styles.line2}>полного цикла</span>
        </h2>

        <p data-reveal className={`${styles.copyA} body-copy`}>
          Продакшн-студия полного цикла работает с бизнесом с 2015 года. Компания делает упор на повышение качества создаваемых
          роликов. В команде работают сценаристы, видеооператоры, монтажёры и другие специалисты.
        </p>
        <p data-reveal style={delay(90)} className={`${styles.copyB} body-copy`}>
          Выполняем задачи от создания анимированного логотипа до имиджевых и презентационных роликов, съёмок мастер-классов, лекций и
          мероприятий.
        </p>

        <dl className={styles.facts}>
          {facts.map((f, i) => (
            <div key={f.label} data-reveal="soft" style={stagger(i)} className={styles.fact} data-accent={'accent' in f && f.accent ? '1' : undefined}>
              <dt className={styles.factLabel}>{f.label}</dt>
              <dd className={styles.factValue}>{f.value}</dd>
            </div>
          ))}
        </dl>

        <nav className={styles.map} aria-label="Разделы сайта">
          <p data-reveal="soft" className={`${styles.mapHead} mono`}>ЧТО ЗДЕСЬ ЕСТЬ</p>
          <ul className={styles.cards}>
            {sections.map((s, i) => (
              <li key={s.name} data-reveal style={stagger(i, 70)}>
                {s.to.startsWith('#') ? (
                  <a href={s.to} onClick={onClick} className={styles.card}>
                    <Card {...s} />
                  </a>
                ) : (
                  <Link to={s.to} className={styles.card}>
                    <Card {...s} />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

function Card({ name, note }: { name: string; note: string }) {
  return (
    <>
      <span className={styles.cardName}>{name}</span>
      <span className={styles.cardNote}>{note}</span>
      <span aria-hidden="true" className={styles.cardArrow}>
        →
      </span>
    </>
  );
}
