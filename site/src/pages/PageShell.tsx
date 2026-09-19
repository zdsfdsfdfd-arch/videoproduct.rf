import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { pages } from '@/lib/routes';
import styles from './PageShell.module.css';

interface Props {
  index: string;
  kicker: string;
  title: ReactNode;
  lead?: string;
  children: ReactNode;
}

/** Inner page: a magazine-style opening spread (index, kicker, giant title) followed by the sections. */
export function PageShell({ index, kicker, title, lead, children }: Props) {
  return (
    <>
      <header className={styles.head} data-scene>
        <div className={`${styles.meta} mono mono-dim`}>
          <span>{index}</span>
          <span>{kicker}</span>
        </div>
        <h1 className={styles.title}>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
      </header>
      {children}
      <footer className={styles.foot}>
        <span className="mono mono-dim">ДАЛЬШЕ</span>
        <nav className={styles.footNav} aria-label="Другие страницы">
          {pages.map((p) => (
            <Link key={p.path} to={p.path} data-cursor="ОТКРЫТЬ" className={styles.footLink}>
              {p.label}
            </Link>
          ))}
        </nav>
      </footer>
    </>
  );
}
