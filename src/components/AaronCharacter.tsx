import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import SpriteAnimator from './SpriteAnimator';
import { pose as poseMeta, preloadPoses, runStrip } from '../lib/sprites';
import { useCoarsePointer, useInView, usePageVisible, useReducedMotion, useTimer } from '../lib/hooks';
import './AaronCharacter.css';

export type CharacterAnimation = 'idle' | 'running' | 'jumping' | 'presenting' | 'thinking' | 'celebrating' | 'climbing' | 'crouching' | 'codePower' | 'falling' | 'recovery';

export type AaronCharacterProps = {
  animation?: CharacterAnimation;
  /** Explicit pose name (e.g. "energy-sword/overhead") that overrides the animation's frames. */
  pose?: string;
  /** Rendered height in px. */
  size?: number;
  direction?: 'left' | 'right';
  /** Playback multiplier: 2 is twice as fast. */
  speed?: number;
  /** Reacts to taps/clicks with a short flourish. */
  interactive?: boolean;
  /** Idle mode watches the mouse: looks, blinks, tilts, waves, reaches. */
  followCursor?: boolean;
  onAnimationComplete?: (animation: CharacterAnimation) => void;
  className?: string;
  style?: CSSProperties;
  /** Announces the character to assistive tech; decorative when omitted. */
  label?: string;
};

type Sequence = { frames: string[]; ms: number; loop: boolean | number; holdLast?: boolean };
export const sequences: Record<Exclude<CharacterAnimation, 'running'>, Sequence> = {
  idle: { frames: ['idle/neutral-right'], ms: 1000, loop: true },
  jumping: { frames: ['jumping/crouch-ready', 'jumping/jump-fists', 'jumping/jump-arms-up', 'jumping/jump-reach-up', 'jumping/land-low'], ms: 150, loop: false, holdLast: true },
  presenting: { frames: ['idle/point-up-right', 'idle/point-up-right', 'idle/reach-right'], ms: 700, loop: false, holdLast: true },
  thinking: { frames: ['idle/look-up', 'idle/look-up-left', 'idle/look-up', 'idle/glance-left'], ms: 900, loop: true },
  celebrating: { frames: ['jumping/jump-fists', 'jumping/jump-arms-up', 'jumping/jump-reach-up', 'jumping/jump-arms-up'], ms: 220, loop: 2, holdLast: true },
  climbing: { frames: ['climbing/wall-climb', 'climbing/ledge-reach', 'climbing/ledge-pullup', 'climbing/perch'], ms: 280, loop: false, holdLast: true },
  crouching: { frames: ['crouching/sneak', 'crouching/hand-down', 'crouching/alert', 'crouching/hand-down'], ms: 650, loop: true },
  codePower: { frames: ['code-power/small-orb', 'code-power/orb', 'code-power/burst', 'code-power/shields'], ms: 210, loop: false, holdLast: true },
  falling: { frames: ['falling/fall-back', 'falling/tumble', 'falling/arms-up', 'falling/tuck', 'falling/reach-down'], ms: 170, loop: false, holdLast: true },
  recovery: { frames: ['falling/recover-sit', 'falling/recover-kneel', 'falling/recover-stumble', 'falling/recover-smile'], ms: 330, loop: false, holdLast: true },
};

/** Idle poses chosen from the cursor's angle and distance. */
type IdleState = 'neutral-right' | 'neutral-left' | 'glance-left' | 'look-up-left' | 'look-up' | 'reach-right' | 'wave' | 'point-up-right' | 'surprised' | 'laugh';
function idleForCursor(dx: number, dy: number, dist: number): IdleState {
  const angle = Math.atan2(-dy, dx); // radians, 0 = right, positive = up
  if (dist < 130) return 'reach-right';
  if (angle > 1.15 && angle < 2.0) return 'look-up';
  if (angle >= 2.0 && angle < 2.9) return 'look-up-left';
  if (angle >= 2.9 || angle < -2.6) return 'glance-left';
  if (angle <= -0.5 && angle >= -2.6) return dx < 0 ? 'neutral-left' : 'neutral-right';
  if (angle > 0.35 && angle <= 1.15) return 'point-up-right';
  return dist < 260 ? 'reach-right' : 'neutral-right';
}

export default function AaronCharacter({
  animation = 'idle', pose, size = 260, direction = 'right', speed = 1, interactive = false, followCursor = false,
  onAnimationComplete, className = '', style, label,
}: AaronCharacterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const pageVisible = usePageVisible();
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const active = inView && pageVisible;
  const [frame, setFrame] = useState(0);
  const [loadedSeq, setLoadedSeq] = useState<string | null>(null);
  const [idleState, setIdleState] = useState<IdleState>('neutral-right');
  const [blink, setBlink] = useState(false);
  const [tilt, setTilt] = useState(0);
  const [reach, setReach] = useState({ x: 0, y: 0 });
  const [flourish, setFlourish] = useState<CharacterAnimation | null>(null);
  const completeRef = useRef(onAnimationComplete); completeRef.current = onAnimationComplete;
  const blinkTimer = useTimer();
  const surpriseTimer = useTimer();
  const settleTimer = useTimer();
  const flourishTimer = useTimer();

  const currentAnimation: CharacterAnimation = flourish ?? animation;
  const seq = currentAnimation === 'running' ? null : sequences[currentAnimation];

  // Preload the frames of the current sequence before stepping through them.
  useEffect(() => {
    const names = pose ? [pose] : seq ? seq.frames : [];
    if (!names.length) return;
    let cancelled = false;
    preloadPoses(names).then(() => { if (!cancelled) setLoadedSeq(names.join('|')); });
    return () => { cancelled = true; };
  }, [pose, seq]);

  // Step through the sequence frames.
  useEffect(() => {
    setFrame(0);
    if (!seq || pose || reduced || !active) return;
    if (seq.frames.length < 2) { if (!seq.loop) { const t = window.setTimeout(() => completeRef.current?.(currentAnimation), seq.ms / speed); return () => window.clearTimeout(t); } return; }
    let i = 0, loops = 0;
    const id = window.setInterval(() => {
      i++;
      if (i >= seq.frames.length) {
        loops++;
        const done = seq.loop === false || (typeof seq.loop === 'number' && loops >= seq.loop);
        if (done) { window.clearInterval(id); if (seq.holdLast) setFrame(seq.frames.length - 1); else setFrame(0); completeRef.current?.(currentAnimation); if (flourish) setFlourish(null); return; }
        i = 0;
      }
      setFrame(i);
    }, seq.ms / speed);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seq, pose, reduced, active, speed, currentAnimation]);

  // ----- idle cursor interaction -----
  const idleEnabled = followCursor && currentAnimation === 'idle' && !pose && !reduced && active && !coarse;
  useEffect(() => {
    if (!idleEnabled) { setTilt(0); setReach((r) => (r.x === 0 && r.y === 0 ? r : { x: 0, y: 0 })); return; }
    let raf = 0; let last = { x: 0, y: 0, t: 0 };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const now = performance.now();
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height * 0.28; // eye line
        const dx = e.clientX - cx, dy = e.clientY - cy; const dist = Math.hypot(dx, dy);
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        const speedPx = last.t ? Math.hypot(e.clientX - last.x, e.clientY - last.y) / Math.max(1, now - last.t) : 0;
        last = { x: e.clientX, y: e.clientY, t: now };
        setTilt(Math.max(-4, Math.min(4, dx / 90)));
        if (inside) {
          setIdleState('wave');
          setReach({ x: Math.max(-8, Math.min(8, dx / 20)), y: Math.max(-4, Math.min(2, dy / 40)) });
        } else {
          setReach(dist < 220 ? { x: Math.max(-10, Math.min(10, dx / 14)), y: 0 } : { x: 0, y: 0 });
          if (speedPx > 2.6 && dist > 320) { setIdleState('surprised'); surpriseTimer.set(() => setIdleState(idleForCursor(dx, dy, dist)), 550); }
          else setIdleState(idleForCursor(dx, dy, dist));
        }
        settleTimer.set(() => { setIdleState('neutral-right'); setTilt(0); setReach({ x: 0, y: 0 }); }, 3800);
      });
    };
    const onLeave = () => { setIdleState('surprised'); surpriseTimer.set(() => { setIdleState('neutral-right'); setTilt(0); setReach({ x: 0, y: 0 }); }, 700); };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => { window.removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('mouseleave', onLeave); if (raf) cancelAnimationFrame(raf); };
  }, [idleEnabled, surpriseTimer, settleTimer]);

  // Blink: a quick eyes-closed frame every few seconds.
  useEffect(() => {
    if (!(followCursor && currentAnimation === 'idle' && !pose && !reduced && active)) return;
    let alive = true;
    const schedule = () => blinkTimer.set(() => { if (!alive) return; setBlink(true); window.setTimeout(() => { setBlink(false); schedule(); }, 120); }, 2600 + Math.random() * 3200);
    schedule();
    return () => { alive = false; blinkTimer.clear(); };
  }, [followCursor, currentAnimation, pose, reduced, active, blinkTimer]);

  // Idle poses should be warm before the cursor logic needs them.
  useEffect(() => { if (followCursor) preloadPoses(['idle/neutral-right', 'idle/neutral-left', 'idle/glance-left', 'idle/look-up-left', 'idle/look-up', 'idle/reach-right', 'idle/wave', 'idle/point-up-right', 'idle/surprised', 'idle/laugh']); }, [followCursor]);

  const onTap = useCallback(() => {
    if (!interactive || reduced) return;
    const options: CharacterAnimation[] = ['celebrating', 'jumping', 'codePower'];
    const pick = options[Math.floor(Math.random() * options.length)];
    setFlourish(pick);
    flourishTimer.set(() => setFlourish(null), 2600);
  }, [interactive, reduced, flourishTimer]);

  const poseName = useMemo(() => {
    if (pose) return pose;
    if (currentAnimation === 'idle' && followCursor && !coarse) return `idle/${blink ? 'laugh' : idleState}`;
    if (!seq) return 'idle/neutral-right';
    if (reduced) return seq.frames[seq.holdLast ? seq.frames.length - 1 : 0];
    return seq.frames[Math.min(frame, seq.frames.length - 1)];
  }, [pose, currentAnimation, followCursor, coarse, blink, idleState, seq, reduced, frame]);

  const wrapperStyle: CSSProperties = { ...style, width: size, height: size, ['--reach-x' as string]: `${reach.x}px`, ['--reach-y' as string]: `${reach.y}px`, ['--tilt' as string]: `${tilt}deg` };
  const isReady = loadedSeq !== null || currentAnimation === 'running';

  return (
    <div ref={ref} className={`aaron ${className} ${interactive ? 'is-interactive' : ''} ${direction === 'left' ? 'faces-left' : ''}`} style={wrapperStyle}
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} onClick={interactive ? onTap : undefined} onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } } : undefined} tabIndex={interactive ? 0 : undefined}>
      <div className="aaron-body" data-anim={currentAnimation} data-idle={currentAnimation === 'idle' ? idleState : undefined}>
        {currentAnimation === 'running'
          ? <SpriteAnimator strip={runStrip} height={size} fps={12 * speed} playing={active} />
          : <PoseImage name={poseName} size={size} ready={isReady} />}
      </div>
    </div>
  );
}

function PoseImage({ name, size, ready }: { name: string; size: number; ready: boolean }) {
  const meta = poseMeta(name);
  return <img className="aaron-pose" src={meta.path} width={meta.canvasWidth} height={meta.canvasHeight} alt="" decoding="sync" draggable={false}
    style={{ height: size, width: 'auto', opacity: ready ? 1 : 0 }} />;
}
