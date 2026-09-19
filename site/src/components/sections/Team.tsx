import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type FocusEvent, type MouseEvent } from 'react';
import { people, type Person } from '@/content';
import { getEngine } from '@/lib/scroll-engine';
import styles from './Team.module.css';

/** Geometry of the hovered figure in % of the stage, measured on activation. */
interface Box {
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
    const L = ((r.left - sr.left) / sr.width) * 100;
    const T = ((r.top - sr.top) / sr.height) * 100;
    const W = (r.width / sr.width) * 100;
    const H = (r.height / sr.height) * 100;
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

/* ---------- hover effects ---------- */

const pct = (n: number) => `${n}%`;

function Effects({ i, person, box, stage }: { i: number; person: Person; box: Box; stage: HTMLDivElement }) {
  const { L, T, W, H, cx } = box;
  const { word, color, meta } = person.fx;
  const reduced = getEngine().reduced;
  const wordRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  // keep the word and the plate inside the stage
  useLayoutEffect(() => {
    const sr = stage.getBoundingClientRect();
    const pad = 12;
    for (const el of [wordRef.current, plateRef.current]) {
      if (!el) continue;
      el.style.setProperty('--shift', '0px');
      const b = el.getBoundingClientRect();
      let shift = 0;
      if (b.left < sr.left + pad) shift = sr.left + pad - b.left;
      else if (b.right > sr.right - pad) shift = sr.right - pad - b.right;
      el.style.setProperty('--shift', `${shift.toFixed(0)}px`);
    }
  }, [box, stage]);

  const box_: CSSProperties = { left: pct(L - W * 0.15), top: pct(T + H * 0.3), width: pct(W * 1.3), height: pct(H * 0.72) };

  return (
    <>
      {/* the stage dims around the person, tinted in their role colour */}
      <div
        className={styles.spot}
        style={{
          background: `radial-gradient(ellipse ${W * 2.2}% ${H * 1.5}% at ${cx}% ${T + H * 0.45}%, rgba(10,7,20,0) 0%, rgba(10,7,20,0.1) 35%, rgba(10,7,20,0.55) 70%, rgba(10,7,20,0.8) 100%)`,
        }}
      />
      <div className={styles.wash} style={{ background: `radial-gradient(ellipse at ${cx}% 100%, ${color}44 0%, ${color}11 35%, transparent 65%)` }} />
      {/* floor glow under the feet, role colour */}
      <div className={styles.floorGlow} style={{ left: pct(cx), top: pct(T + H), width: pct(W * 2.4), background: `radial-gradient(ellipse at 50% 50%, ${color}99, ${color}33 40%, transparent 70%)` }} />
      {/* the craft, set letter by letter above the head */}
      <div
        ref={wordRef}
        className={styles.word}
        style={{ left: pct(cx), top: pct(Math.max(5, T - 3)), color, mixBlendMode: color === '#F1EDF7' ? 'difference' : 'normal' }}
      >
        {[...word].map((ch, n) => (
          <span key={`${word}-${n}`} className={styles.letterClip}>
            <span className={styles.letter} style={{ animationDelay: `${n * 45}ms` }}>
              {ch}
            </span>
          </span>
        ))}
      </div>
      <div ref={plateRef} className={styles.plate} style={{ left: pct(cx), top: pct(T + H), borderColor: color }}>
        <span className={styles.plateName}>{person.name}</span>
        <span className={styles.plateMeta} style={{ color }}>
          {meta}
        </span>
      </div>

      {!reduced && (
        <>
          {i === 0 && (
            <>
              <div className={styles.fxLight} style={box_} />
              <div className={styles.fxBeam} style={{ left: pct(cx - W * 0.9), width: pct(W * 1.8), height: pct(Math.max(0, T + H * 0.12)) }} />
              <div className={styles.fxBeamCore} style={{ left: pct(cx - W * 0.35), width: pct(W * 0.7), height: pct(Math.max(0, T + H * 0.1)) }} />
            </>
          )}
          {i === 1 && (
            <>
              <div className={`${styles.orbit} ${styles.orbitA}`} style={{ left: pct(cx), top: pct(T + H * 0.68), width: pct(W * 1.2) }} />
              <div className={`${styles.orbit} ${styles.orbitB}`} style={{ left: pct(cx), top: pct(T + H * 0.68), width: pct(W * 0.9) }} />
              {[0, 1, 2, 3, 4].map((n) => (
                <div key={n} className={styles.spark} style={{ left: `calc(${cx}% + ${(n - 2) * 22}px)`, top: pct(T + H * 0.55), animationDelay: `${n * 0.35}s` }} />
              ))}
            </>
          )}
          {i === 2 && (
            <>
              <div className={styles.brackets} style={box_} />
              <div className={styles.rec} style={{ left: pct(L + W * 1.05), top: pct(T + H * 0.32) }}>
                <span className={styles.recDot} />
                <RunningTimecode />
              </div>
            </>
          )}
          {i === 3 && (
            <>
              <div className={styles.cine} style={box_}>
                <div className={styles.strobe} />
                <div className={styles.scan} />
              </div>
              <div className={styles.matte} style={{ left: pct(L - W * 0.15), width: pct(W * 1.3), top: pct(T + H * 0.93), height: pct(H * 0.09) }} />
            </>
          )}
          {i === 4 && (
            <>
              <div className={styles.clapper} style={{ left: pct(L - W * 0.2), width: pct(W * 1.4), top: pct(Math.max(2, T - 5)) }} />
              <div className={`${styles.clapper} ${styles.clapperRev}`} style={{ left: pct(L - W * 0.2), width: pct(W * 1.4), top: pct(T + H * 0.98) }} />
              <div className={styles.fxBlue} style={box_} />
            </>
          )}
          {i === 5 && (
            <>
              <div className={styles.fxPink} style={box_} />
              <Powder cx={cx} top={T + H * 0.42} W={W} />
            </>
          )}
          {i === 6 && (
            <div className={styles.wave} style={{ left: pct(L - W * 0.25), width: pct(W * 1.5), top: pct(T + H * 0.5), height: pct(H * 0.2) }}>
              <WaveBars />
            </div>
          )}
          {i === 7 && (
            <>
              <div className={styles.cuts} style={box_}>
                <div className={styles.cutBlack} />
                <div className={styles.cutLine} style={{ left: '33%' }} />
                <div className={`${styles.cutLine} ${styles.cutLine2}`} style={{ left: '66%' }} />
              </div>
              <div className={styles.timeline} style={{ left: pct(L - W * 0.25), width: pct(W * 1.5), top: pct(T + H * 0.86) }} />
            </>
          )}
        </>
      )}
    </>
  );
}

function RunningTimecode() {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const ms = performance.now() - start;
      if (el.current) el.current.textContent = `REC 00:00:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 40) % 25).padStart(2, '0')}`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={el}>REC 00:00:00:00</span>;
}

function Powder({ cx, top, W }: { cx: number; top: number; W: number }) {
  const [parts] = useState(() =>
    Array.from({ length: 16 }, (_, n) => ({
      size: 4 + Math.random() * 8,
      color: ['#F7C6D0', '#F1EDF7', '#FFD9A0'][n % 3],
      dur: 1.8 + Math.random(),
      delay: Math.random() * 1.8,
      dx: (Math.random() - 0.5) * W * 6,
      dy: -40 - Math.random() * 200,
      rot: Math.random() * 200,
    })),
  );
  return (
    <>
      {parts.map((p, n) => (
        <div
          key={n}
          className={styles.powder}
          style={
            {
              left: pct(cx),
              top: pct(top),
              width: p.size,
              height: p.size,
              background: p.color,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}

function WaveBars() {
  const [bars] = useState(() => Array.from({ length: 18 }, (_, n) => ({ dur: 0.45 + Math.random() * 0.6, delay: n * 0.04, bright: n % 6 === 0 })));
  return (
    <>
      {bars.map((b, n) => (
        <span key={n} className={styles.bar} style={{ background: b.bright ? '#F1EDF7' : '#8C5CFF', animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }} />
      ))}
    </>
  );
}
