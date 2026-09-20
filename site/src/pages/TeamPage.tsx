import { PageShell } from './PageShell';
import { Team } from '@/components/sections/Team';
import { Clients } from '@/components/sections/Clients';
import { Backstage } from '@/components/sections/Backstage';
import { facts, people } from '@/content';
import { duties, stageRoles } from '@/content/pages';
import styles from './TeamPage.module.css';

/**
 * Команда — the group stage, then a roster (who does what, with the technical line of each role),
 * the numbers behind the studio, who works on which production stage, backstage and clients.
 */
export function TeamPage() {
  return (
    <PageShell
      index="04"
      kicker="15 СПЕЦИАЛИСТОВ · 8 В КАДРЕ · КАЗАНЬ"
      title={<>Коман<em>да</em></>}
      lead="Сценаристы, операторы, монтажёры, звук, свет, грим — 15 специалистов и своё оборудование на 5 000 000 ₽. Коснитесь человека на сцене (на компьютере — наведите курсор), чтобы увидеть его ремесло."
    >
      <Team />

      <section className={styles.roster} aria-label="Состав команды" data-scene>
        <div className={`${styles.head} mono mono-dim`}>
          <span>КТО ЧТО ДЕЛАЕТ</span>
          <span>8 ИЗ 15 СПЕЦИАЛИСТОВ</span>
        </div>
        <ol className={styles.people}>
          {people.map((p, i) => (
            <li key={p.name} className={styles.person}>
              <div className={styles.portraitBox} style={{ '--glow': p.fx.color } as React.CSSProperties}>
                <img src={p.src} alt={`${p.name} — ${p.role}`} loading="lazy" className={styles.portrait} />
              </div>
              <div className={styles.personText}>
                <span className={`${styles.personNum} mono`}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={styles.personName}>{p.name}</h3>
                <div className={`${styles.personRole} mono`} style={{ color: p.fx.color === '#F1EDF7' ? 'var(--accent)' : p.fx.color }}>
                  {p.role}
                </div>
                <p className={styles.personDuty}>{duties[p.name]}</p>
                <div className={`${styles.personMeta} mono`}>{p.fx.meta}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.numbers} aria-label="Цифры" data-scene>
        {facts.map((f) => (
          <div key={f.label} className={styles.fact} data-accent={'accent' in f && f.accent ? '1' : undefined}>
            <span className={styles.factValue}>{f.value}</span>
            <span className={`${styles.factLabel} mono`}>{f.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.stages} aria-label="Кто на каком этапе" data-scene>
        <div className={`${styles.head} mono mono-dim`}>
          <span>КТО НА КАКОМ ЭТАПЕ</span>
          <span>7 ЭТАПОВ ПРОИЗВОДСТВА</span>
        </div>
        <ol className={styles.stageList}>
          {stageRoles.map((s, i) => (
            <li key={s.stage} className={styles.stageRow}>
              <span className={`${styles.stageNum} mono`}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.stageName}>{s.stage}</span>
              <span className={styles.stageRoles}>
                {s.roles.map((r) => (
                  <span key={r} className={`${styles.roleTag} mono`}>
                    {r.toUpperCase()}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <Backstage />
      <Clients />
    </PageShell>
  );
}
