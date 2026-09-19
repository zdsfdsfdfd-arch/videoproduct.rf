import { facts } from '@/content';
import styles from './Intro.module.css';

/** 01 / Начало — editorial statement; the two lines settle into place as the spread scrolls in. */
export function Intro() {
  return (
    <section id="sp-01" data-scene className={styles.section} aria-label="01 Начало">
      <div className="grid12">
        <div className={`${styles.index} mono mono-dim`}>01 / НАЧАЛО</div>

        <h2 className={styles.title}>
          <span className={styles.line1}>Видеопродакшн</span>
          <span className={styles.line2}>полного цикла</span>
        </h2>

        <p className={`${styles.copyA} body-copy`}>
          Продакшн-студия полного цикла работает с бизнесом с 2015 года. Компания делает упор на повышение качества создаваемых
          роликов. В команде работают сценаристы, видеооператоры, монтажёры и другие специалисты.
        </p>
        <p className={`${styles.copyB} body-copy`}>
          Выполняем задачи от создания анимированного логотипа до имиджевых и презентационных роликов, съёмок мастер-классов, лекций и
          мероприятий.
        </p>

        <dl className={styles.facts}>
          {facts.map((f) => (
            <div key={f.label} className={styles.fact} data-accent={'accent' in f && f.accent ? '1' : undefined}>
              <dt className={styles.factLabel}>{f.label}</dt>
              <dd className={styles.factValue}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
