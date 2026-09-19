import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { Person } from '@/content';
import { getEngine } from '@/lib/scroll-engine';
import type { Box } from './Team';
import base from './Team.module.css';
import fx from './TeamFx.module.css';

const pct = (n: number) => `${n}%`;

/**
 * Hover effects for the team stage. Shared part: spotlight, role-colour wash, floor glow, the craft
 * word set letter-by-letter above the head, the name plate. Then one scene per craft — each one is
 * the tool of that person's trade, not abstract particles:
 *   light → red gel + anamorphic flares · drone → FPV HUD · camera → viewfinder with focus pull ·
 *   cinema → letterbox + film strip · director → clapperboard · make-up → ring light + soft bloom ·
 *   sound → ripples, EQ, VU meter · editing → timeline + colour-grade wipe.
 */
export function Effects({ i, person, box, stage }: { i: number; person: Person; box: Box; stage: HTMLDivElement }) {
  const { T, H, W, cx } = box;
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

  const scenes = [Light, Drone, Camera, Cinema, Director, Makeup, Sound, Editing];
  const Scene = scenes[i];

  return (
    <>
      <div
        className={base.spot}
        style={{
          background: `radial-gradient(ellipse ${W * 2.2}% ${H * 1.5}% at ${cx}% ${T + H * 0.45}%, rgba(10,7,20,0) 0%, rgba(10,7,20,0.1) 35%, rgba(10,7,20,0.55) 70%, rgba(10,7,20,0.8) 100%)`,
        }}
      />
      <div className={base.wash} style={{ background: `radial-gradient(ellipse at ${cx}% 100%, ${color}44 0%, ${color}11 35%, transparent 65%)` }} />
      <div className={base.floorGlow} style={{ left: pct(cx), top: pct(T + H), width: pct(W * 2.4), background: `radial-gradient(ellipse at 50% 50%, ${color}99, ${color}33 40%, transparent 70%)` }} />
      <div ref={wordRef} className={base.word} style={{ left: pct(cx), top: pct(Math.max(5, T - 3)), color, mixBlendMode: color === '#F1EDF7' ? 'difference' : 'normal' }}>
        {[...word].map((ch, n) => (
          <span key={`${word}-${n}`} className={base.letterClip}>
            <span className={base.letter} style={{ animationDelay: `${n * 45}ms` }}>
              {ch}
            </span>
          </span>
        ))}
      </div>
      <div ref={plateRef} className={base.plate} style={{ left: pct(cx), top: pct(T + H), borderColor: color }}>
        <span className={base.plateName}>{person.name}</span>
        <span className={base.plateMeta} style={{ color }}>
          {meta}
        </span>
      </div>
      {!reduced && Scene && <Scene box={box} color={color} />}
    </>
  );
}

type SceneProps = { box: Box; color: string };

/* The figure's own frame in stage %, slightly wider than the cutout. */
const frame = ({ L, T, W, H }: Box, wx = 1.3, top = 0.3, h = 0.72): CSSProperties => ({
  left: pct(L - (W * (wx - 1)) / 2),
  top: pct(T + H * top),
  width: pct(W * wx),
  height: pct(H * h),
});

/* 0 · Булат — red gel over the stage, light cone from the rig, anamorphic flares off the tubes */
function Light({ box }: SceneProps) {
  const { T, H, W, cx } = box;
  return (
    <>
      <div className={fx.gel} />
      <div className={fx.cone} style={{ left: pct(cx - W * 0.7), width: pct(W * 1.4), height: pct(Math.max(0, T + H * 0.1)) }} />
      {[0.28, 0.4].map((y, n) => (
        <div key={n} className={fx.flare} style={{ left: pct(cx - W * 1.6), width: pct(W * 3.2), top: pct(T + H * y), animationDelay: `${n * 0.7}s` }} />
      ))}
      <div className={fx.lightMeter} style={{ left: pct(cx + W * 0.7), top: pct(T + H * 0.5) }}>
        <span>3200K</span>
        <span className={fx.lightBar}>
          <span />
        </span>
        <span>f/2.8 · 1/50</span>
      </div>
    </>
  );
}

/* 1 · Алексей — FPV heads-up display around the figure, horizon tilting, altitude ladder, telemetry */
function Drone({ box }: SceneProps) {
  const { T, W, cx } = box;
  const st = frame(box, 1.9, -0.08, 1.02);
  return (
    <div className={fx.hud} style={st}>
      <span className={`${fx.hudCorner} ${fx.tl}`} />
      <span className={`${fx.hudCorner} ${fx.tr}`} />
      <span className={`${fx.hudCorner} ${fx.bl}`} />
      <span className={`${fx.hudCorner} ${fx.br}`} />
      <div className={fx.horizon} />
      <div className={fx.ladder}>
        {Array.from({ length: 9 }, (_, n) => (
          <span key={n} data-major={n % 2 === 0 ? '1' : undefined}>
            {n % 2 === 0 ? 60 - n * 5 : ''}
          </span>
        ))}
      </div>
      <div className={fx.hudTop}>
        <span>ALT 42 m</span>
        <span>SPD 18 km/h</span>
        <span>GPS 14</span>
        <span className={fx.hudRec}>● REC</span>
      </div>
      <div className={fx.hudBottom}>
        <span>BAT ▮▮▮▮▯ 78%</span>
        <span>{`${cx.toFixed(3)}° N · ${(T + W).toFixed(3)}° E`}</span>
        <span>HOME ↖ 120 m</span>
      </div>
      <span className={fx.hudCross} style={{ top: '38%' }} />
    </div>
  );
}

/* 2 · Николай — camera viewfinder: brackets, REC + timecode, AF box locking on the face, focus pull */
function Camera({ box }: SceneProps) {
  const { T, H, W, cx } = box;
  return (
    <>
      <div className={fx.finder} style={frame(box, 1.7, -0.1, 1.06)}>
        <span className={`${fx.fCorner} ${fx.tl}`} />
        <span className={`${fx.fCorner} ${fx.tr}`} />
        <span className={`${fx.fCorner} ${fx.bl}`} />
        <span className={`${fx.fCorner} ${fx.br}`} />
        <div className={fx.finderTop}>
          <span className={fx.rec}>
            <span className={fx.recDot} />
            REC
          </span>
          <RunningTimecode />
        </div>
        <div className={fx.finderBottom}>
          <span>4K · 50p</span>
          <span className={fx.zoom}>
            W <span className={fx.zoomTrack}><span /></span> T
          </span>
          <span>STAB ON</span>
        </div>
      </div>
      <div className={fx.afBox} style={{ left: pct(cx), top: pct(T + H * 0.02), width: pct(W * 0.3), height: pct(H * 0.17) }}>
        <span className={fx.afLabel}>AF</span>
      </div>
    </>
  );
}

/* 3 · Семён — cinema: 2.39:1 letterbox, film strip with sprockets running past, warm grade, grain */
function Cinema({ box }: SceneProps) {
  const { L, T, W, H } = box;
  const st = frame(box, 1.7, -0.06, 1.06);
  return (
    <>
      <div className={fx.grade} style={st} />
      <div className={fx.grain} style={st} />
      <div className={`${fx.bar} ${fx.barTop}`} style={{ ...st, top: pct(T - H * 0.2), height: pct(H * 0.14) }} />
      <div className={`${fx.bar} ${fx.barBottom}`} style={{ ...st, top: pct(T + H * 0.9), height: pct(H * 0.12) }} />
      <div className={fx.film} style={{ left: pct(L - W * 0.4), top: pct(T - H * 0.2), width: pct(W * 0.13), height: pct(H * 1.2) }} />
      <div className={fx.cineLabel} style={{ left: pct(L + W * 1.1), top: pct(T + H * 0.3) }}>
        <span className={fx.rolling}>ROLLING</span>
        <span>24 FPS</span>
        <span>2.39:1</span>
        <span>ISO 800</span>
      </div>
    </>
  );
}

/* 4 · Роман — the clapperboard: slate in front of the chest, the stick claps, take number ticks */
function Director({ box }: SceneProps) {
  const { T, H, W, cx } = box;
  const [take, setTake] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setTake((t) => (t % 9) + 1), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <div className={fx.slate} style={{ left: pct(cx), top: pct(T + H * 0.56), width: pct(W * 1.05) }}>
        <div className={fx.stick} />
        <div className={fx.stickBase} />
        <div className={fx.slateBody}>
          <div className={fx.slateRow}>
            <span>СЦЕНА</span>
            <b>04</b>
            <span>ДУБЛЬ</span>
            <b key={take} className={fx.takeNum}>
              {String(take).padStart(2, '0')}
            </b>
          </div>
          <div className={fx.slateRow}>
            <span>РЕЖ.</span>
            <b>РОМАН</b>
            <span>ОПЕР.</span>
            <b>СЕМЁН</b>
          </div>
          <div className={fx.slateAction}>МОТОР · КАМЕРА · НАЧАЛИ</div>
        </div>
      </div>
      <div className={fx.actionFlash} style={frame(box, 1.6, 0, 1)} />
    </>
  );
}

/* 5 · Аниса — ring light behind the head, soft bloom, powder drifting, the palette */
function Makeup({ box }: SceneProps) {
  const { T, H, W, cx } = box;
  const [parts] = useState(() =>
    Array.from({ length: 10 }, (_, n) => ({
      size: 3 + Math.random() * 6,
      color: ['#F7C6D0', '#F1EDF7', '#FFD9A0'][n % 3],
      dur: 2.4 + Math.random() * 1.5,
      delay: Math.random() * 2.4,
      dx: (Math.random() - 0.5) * W * 4,
      dy: -30 - Math.random() * 120,
      rot: Math.random() * 200,
    })),
  );
  return (
    <>
      <div className={fx.ring} style={{ left: pct(cx), top: pct(T + H * 0.13), width: pct(W * 0.95) }} />
      <div className={fx.bloom} style={frame(box, 1.3, -0.1, 0.6)} />
      {parts.map((p, n) => (
        <div
          key={n}
          className={fx.powder}
          style={{ left: pct(cx), top: pct(T + H * 0.44), width: p.size, height: p.size, background: p.color, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--rot': `${p.rot}deg` } as CSSProperties}
        />
      ))}
      <div className={fx.palette} style={{ left: pct(cx), top: pct(T + H * 0.92) }}>
        {['#F2C4B5', '#E89A8A', '#C9736A', '#F7D9C4', '#B76E79', '#8C5CFF'].map((c, n) => (
          <span key={c} style={{ background: c, animationDelay: `${n * 0.18}s` }} />
        ))}
      </div>
    </>
  );
}

/* 6 · Исхак — sound: ripples off the boom mic, an equalizer along the floor, a VU meter beside him */
function Sound({ box }: SceneProps) {
  const { L, T, W, H, cx } = box;
  const [bars] = useState(() => Array.from({ length: 22 }, (_, n) => ({ dur: 0.5 + Math.random() * 0.6, delay: n * 0.03 })));
  return (
    <>
      {[0, 1, 2].map((n) => (
        <div key={n} className={fx.ripple} style={{ left: pct(L + W * 0.18), top: pct(T + H * 0.6), width: pct(W * 0.9), animationDelay: `${n * 0.8}s` }} />
      ))}
      <div className={fx.eq} style={{ left: pct(cx - W * 0.85), width: pct(W * 1.7), top: pct(T + H * 0.8), height: pct(H * 0.19) }}>
        {bars.map((b, n) => (
          <span key={n} style={{ animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, background: n % 7 === 0 ? '#F1EDF7' : 'var(--accent)' }} />
        ))}
      </div>
      <div className={fx.vu} style={{ left: pct(L + W * 1.06), top: pct(T + H * 0.22), height: pct(H * 0.5) }}>
        <span className={fx.vuScale}>0</span>
        <span className={fx.vuTrack}>
          <span className={fx.vuLevel} />
          <span className={fx.vuPeak} />
        </span>
        <span className={fx.vuScale}>-∞</span>
        <span className={fx.vuLabel}>48 kHz · 24 bit</span>
      </div>
    </>
  );
}

/* 7 · Ирина — editing: a timeline with clips and a sweeping playhead, the colour-grade wipe across the figure */
function Editing({ box }: SceneProps) {
  const { T, H, W, cx } = box;
  const st = frame(box, 1.3, -0.08, 1.06);
  return (
    <>
      <div className={fx.gradeWipe} style={st}>
        <span className={fx.wipeLabelL}>LOG</span>
        <span className={fx.wipeLabelR}>GRADE</span>
      </div>
      <div className={fx.timeline} style={{ left: pct(cx - W * 0.95), width: pct(W * 1.9), top: pct(T + H * 0.82) }}>
        <div className={fx.tlRuler}>
          {Array.from({ length: 9 }, (_, n) => (
            <span key={n}>{`00:0${n}`}</span>
          ))}
        </div>
        <div className={fx.tlTrack} data-name="V1">
          <span style={{ width: '22%', background: '#8C5CFF' }} />
          <span style={{ width: '14%', background: '#C4A6FF' }} />
          <span style={{ width: '31%', background: '#8C5CFF' }} />
          <span style={{ width: '18%', background: '#5B3BB8' }} />
        </div>
        <div className={fx.tlTrack} data-name="A1">
          <span style={{ width: '48%', background: '#2E9E6B' }} />
          <span style={{ width: '37%', background: '#2E9E6B' }} />
        </div>
        <div className={fx.playhead} />
      </div>
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
      if (el.current) el.current.textContent = `00:00:${String(Math.floor(ms / 1000) % 60).padStart(2, '0')}:${String(Math.floor(ms / 40) % 25).padStart(2, '0')}`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <span ref={el} className={fx.tc}>00:00:00:00</span>;
}
