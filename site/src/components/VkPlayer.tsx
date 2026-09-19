import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { vkEmbedUrl } from '@/content';
import { getEngine } from '@/lib/scroll-engine';
import styles from './VkPlayer.module.css';

interface Props {
  id: string;
  title: string;
  /** Still frame shown until the player has really started; stays as the background otherwise. */
  poster?: string;
  /** Muted, looping background preview (cover, portfolio cards). */
  autoplay?: boolean;
  /** How far ahead of the viewport to start loading. Default: two screens. */
  prewarm?: string;
  /** Mount the iframe right away regardless of visibility. */
  eager?: boolean;
  /** Keep the iframe mounted but hidden (used to pre-load review players). */
  hidden?: boolean;
  /** Let the visitor use the VK controls. */
  interactive?: boolean;
  /** Milliseconds to keep the poster after `load` — VK paints black before its first frame. */
  holdMs?: number;
  className?: string;
  style?: CSSProperties;
  hd?: 1 | 2;
}

/**
 * VK player that never shows a black frame: the iframe is mounted well before it scrolls into
 * view (IntersectionObserver with a large rootMargin), the poster stays on top until the frame
 * has loaded plus a short hold, then crossfades. Once mounted it is never unmounted, so scrolling
 * back and forth does not reload the player.
 */
export function VkPlayer({ id, title, poster, autoplay, prewarm = '200% 0px', eager, hidden, interactive, holdMs = 1400, className, style, hd = 2 }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(!!eager);
  const [ready, setReady] = useState(false);
  const reduced = getEngine().reduced;

  // a parent may decide to pre-load later (e.g. when its pinned section approaches)
  useEffect(() => {
    if (eager) setArmed(true);
  }, [eager]);

  useEffect(() => {
    if (armed || eager) return;
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: prewarm },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, eager, prewarm]);

  const params = autoplay && !reduced ? '&autoplay=1&loop=1&mute=1&js_api=1' : '';
  const src = vkEmbedUrl(id, params).replace('hd=2', `hd=${hd}`);

  return (
    <div ref={box} className={`${styles.box} ${className ?? ''}`} style={style} data-hidden={hidden ? '1' : undefined}>
      {poster && <img src={poster} alt="" loading="lazy" decoding="async" className={styles.poster} data-off={ready ? '1' : undefined} />}
      {!poster && <div className={styles.blank} data-off={ready ? '1' : undefined} />}
      {armed && (
        <iframe
          title={title}
          src={src}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen={interactive}
          className={styles.frame}
          style={{ opacity: ready ? 1 : 0, pointerEvents: interactive ? 'auto' : 'none' }}
          onLoad={() => setTimeout(() => setReady(true), holdMs)}
        />
      )}
    </div>
  );
}
