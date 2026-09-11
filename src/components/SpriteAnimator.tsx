import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useInView, usePageVisible, useReducedMotion } from '../lib/hooks';
import type { StripMeta } from '../lib/sprites';
import './SpriteAnimator.css';

type Props = {
  strip: StripMeta;
  /** rendered height in px */
  height: number;
  fps?: number;
  playing?: boolean;
  direction?: 'left' | 'right';
  className?: string;
  style?: CSSProperties;
  label?: string;
};

/**
 * CSS steps() animation over an equal-width sprite strip. Uses only background-position,
 * pauses offscreen or when the tab is hidden, and shows a single frame under
 * prefers-reduced-motion.
 */
export default function SpriteAnimator({ strip, height, fps = 12, playing = true, direction = 'right', className = '', style, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const pageVisible = usePageVisible();
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => { const img = new Image(); img.onload = () => setReady(true); img.src = strip.path; }, [strip.path]);
  const scale = height / strip.frameHeight;
  const frameW = strip.frameWidth * scale;
  const run = playing && inView && pageVisible && !reduced && ready;
  return (
    <div
      ref={ref}
      className={`sprite-strip ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{
        ...style,
        width: frameW,
        height,
        backgroundImage: `url(${strip.path})`,
        backgroundSize: `${frameW * strip.frames}px ${height}px`,
        animationDuration: `${strip.frames / fps}s`,
        animationTimingFunction: `steps(${strip.frames})`,
        animationPlayState: run ? 'running' : 'paused',
        transform: direction === 'left' ? 'scaleX(-1)' : undefined,
        ['--frames' as string]: strip.frames,
        ['--frame-w' as string]: `${frameW}px`,
      }}
    />
  );
}
