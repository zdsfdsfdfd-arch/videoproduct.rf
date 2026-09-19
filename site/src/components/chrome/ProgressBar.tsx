import styles from './ProgressBar.module.css';

export function ProgressBar() {
  return (
    <div aria-hidden="true" className={styles.track}>
      <div className={styles.bar} />
    </div>
  );
}
