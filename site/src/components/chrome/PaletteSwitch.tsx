import { useEffect, useState } from 'react';
import styles from './PaletteSwitch.module.css';

type Palette = 'ink' | 'colour';
const KEY = 'vp-palette';

/**
 * A review tool, not a site feature: the studio asked to see a warmer, more colourful version next
 * to the strict violet-black one, so the palette can be flipped on the live page. The choice is
 * remembered per device and can also be set with ?theme=colour / ?theme=ink.
 * Delete this component (and its two lines in App.tsx) to freeze whichever palette wins.
 */
export function PaletteSwitch() {
  const [palette, setPalette] = useState<Palette>('ink');

  useEffect(() => {
    const fromUrl = new URLSearchParams(location.search).get('theme');
    const stored = (() => {
      try {
        return localStorage.getItem(KEY);
      } catch {
        return null;
      }
    })();
    const next: Palette = fromUrl === 'colour' || fromUrl === 'ink' ? fromUrl : stored === 'colour' ? 'colour' : 'ink';
    setPalette(next);
  }, []);

  useEffect(() => {
    if (palette === 'colour') document.documentElement.dataset.palette = 'colour';
    else delete document.documentElement.dataset.palette;
    try {
      localStorage.setItem(KEY, palette);
    } catch {
      /* private mode — the choice just does not persist */
    }
  }, [palette]);

  return (
    <button
      type="button"
      className={`${styles.chip} mono`}
      data-cursor="ПАЛИТРА"
      aria-label={`Палитра: ${palette === 'colour' ? 'цветная' : 'строгая'}. Переключить`}
      onClick={() => setPalette((p) => (p === 'colour' ? 'ink' : 'colour'))}
    >
      <span className={styles.dots} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {palette === 'colour' ? 'ЦВЕТ' : 'СТРОГО'}
    </button>
  );
}
