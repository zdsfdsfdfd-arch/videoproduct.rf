import styles from './Perforation.module.css';

/** Film-strip sprocket holes along both viewport edges; they scroll with the page. */
export function Perforation({ side }: { side: 'left' | 'right' }) {
  return (
    <div aria-hidden="true" className={`${styles.rail} ${side === 'left' ? styles.left : styles.right}`}>
      <div className={styles.holes} />
    </div>
  );
}
