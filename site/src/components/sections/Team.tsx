import { useCallback, useRef, useState, type CSSProperties, type PointerEvent, type FocusEvent, type MouseEvent } from 'react';
import { people } from '@/content';
import { getEngine } from '@/lib/scroll-engine';
import { Effects } from './TeamFx';
import styles from './Team.module.css';

/** Geometry of the hovered figure in % of the stage, measured on activation. */
export interface Box {
  L: number;
  T: number;
  W: number;
  H: number;
  cx: number;
}

/**
 * 07 / Команда — one group shot: eight cut-out figures on a black stage at different depths,
 * a huge «КОМАНДА» behind them, a blue floor glow. Hovering a person turns a spotlight on them,
 * puts their craft as a giant word above the head and plays a looping effect scoped to their frame.
 */
export function Team() {
  const stage = useRef<HTMLDivElement>(null);
  const figures = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [box, setBox] = useState<Box | null>(null);
  const coarse = getEngine().coarse;

  const activate = useCallback((i: number) => {
    const st = stage.current;
    const fig = figures.current[i];
    if (!st || !fig) return;
    const sr = st.getBoundingClientRect();
    const r = fig.getBoundingClientRect();
    // the cutout is object-fit: contain, bottom-aligned — measure the drawn image, not the figure box
    const img = fig.querySelector('img');
    const ratio = img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : 0.67;
    const drawnH = Math.min(r.height, r.width / ratio);
    const drawnW = Math.min(r.width, r.height * ratio);
    const L = ((r.left + (r.width - drawnW) / 2 - sr.left) / sr.width) * 100;
    const T = ((r.bottom - drawnH - sr.top) / sr.height) * 100;
    const W = (drawnW / sr.width) * 100;
    const H = (drawnH / sr.height) * 100;
    setBox({ L, T, W, H, cx: L + W / 2 });
    setActive(i);
  }, []);

  const deactivate = useCallback(() => {
    setActive(null);
    setBox(null);
  }, []);

  const findIdx = (t: EventTarget | null) => {
    const f = (t as Element | null)?.closest?.('[data-person]');
    return f ? Number((f as HTMLElement).dataset.person) : null;
  };

  const onOver = (ev: PointerEvent) => {
    if (coarse) return;
    const i = findIdx(ev.target);
    if (i != null && i !== active) activate(i);
  };
  const onOut = (ev: PointerEvent) => {
    if (coarse) return;
    const i = findIdx(ev.target);
    if (i != null && findIdx(ev.relatedTarget) == null) deactivate();
  };
  const onFocus = (ev: FocusEvent) => {
    const i = findIdx(ev.target);
    if (i != null) activate(i);
  };
  const onClick = (ev: MouseEvent) => {
    if (!coarse) return;
    const i = findIdx(ev.target);
    if (i == null) return;
    active === i ? deactivate() : activate(i);
  };

  return (
    <section id="sp-07" data-scene className={styles.section} aria-label="07 Команда">
      <div className={`grid12 ${styles.head}`}>
        <div className={`${styles.index} mono mono-dim`}>
          07 / КОМАНДА
          <br />8 ИЗ 15 СПЕЦИАЛИСТОВ
        </div>
        <h2 className={`${styles.title} h2`}>Кто это делает</h2>
      </div>

      <div
        ref={stage}
        className={styles.stage}
        data-active={active != null ? '1' : undefined}
        onPointerOver={onOver}
        onPointerOut={onOut}
        onFocus={onFocus}
        onBlur={(ev) => {
          if (!ev.currentTarget.contains(ev.relatedTarget as Node | null)) deactivate();
        }}
        onClick={onClick}
      >
        <div aria-hidden="true" className={styles.bgWord}>
          Команда
        </div>
        <div aria-hidden="true" className={styles.glow} />
        <div aria-hidden="true" className={styles.floor} />

        <div aria-hidden="true" className={styles.fx}>
          {active != null && box && <Effects i={active} person={people[active]} box={box} stage={stage.current!} />}
        </div>

        <div className={`${styles.stageMeta} mono`}>
          <span>СЦЕНАРИСТЫ · ОПЕРАТОРЫ · МОНТАЖЁРЫ · ЗВУК · СВЕТ · ГРИМ</span>
          <span>КАЗАНЬ · СТУДИЯ</span>
        </div>

        <div className={styles.figures}>
          {people.map((p, i) => (
            <figure
              key={p.name}
              ref={(el) => {
                figures.current[i] = el;
              }}
              data-person={i}
              tabIndex={0}
              data-cursor="МОТОР"
              className={styles.figure}
              data-on={active === i ? '1' : undefined}
              data-dim={active != null && active !== i ? '1' : undefined}
              style={
                {
                  '--left': `${p.left}%`,
                  '--h': `${p.height}%`,
                  '--z': active === i ? 9 : p.z,
                  '--mxf': `${p.mx}px`,
                  '--lift': `${p.lift}px`,
                  '--glow': p.fx.color,
                } as CSSProperties
              }
            >
              <img src={p.src} alt={`${p.name} — ${p.role}`} loading="lazy" className={styles.img} data-anim={active === i ? p.name : undefined} />
              <figcaption className={styles.caption} style={{ bottom: `${p.captionBottom}%` }}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.role} style={{ color: p.accent ? 'var(--accent)' : undefined }}>
                  {p.role}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
