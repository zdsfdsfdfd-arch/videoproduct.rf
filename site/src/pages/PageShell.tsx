import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { pages } from '@/lib/routes';
import { delay } from '@/lib/reveal';
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
        <div data-reveal="soft" className={`${styles.meta} mono mono-dim`}>
          <span>{index}</span>
          <span>{kicker}</span>
        </div>
        <h1 data-reveal="display" className={styles.title}>
          {title}
        </h1>
        {lead && (
          <p data-reveal style={delay(110)} className={styles.lead}>
            {lead}
          </p>
        )}
      </header>
      {children}
      <footer className={styles.foot}>
        <span className="mono mono-dim">ДАЛЬШЕ</span>
        <nav className={styles.footNav} aria-label="Другие страницы">
          {pages.map((p) => (
            <Link key={p.path} to={p.path} className={styles.footLink}>
              {p.label}
            </Link>
          ))}
        </nav>
      </footer>
    </>
  );
}
