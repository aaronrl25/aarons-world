import { useEffect, useRef } from 'react';
import { usePageVisible, useReducedMotion, useInView } from '../lib/hooks';

type Props = { density?: number; color?: string; className?: string; speed?: number };
/** Lightweight drifting motes on a canvas. Pauses when hidden, disabled under reduced motion. */
export default function Particles({ density = 40, color = '65, 217, 255', className = '', speed = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const visible = usePageVisible();
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let raf = 0, w = 0, h = 0; const dpr = Math.min(2, window.devicePixelRatio || 1);
    const motes = Array.from({ length: density }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, vx: (Math.random() - 0.5) * 0.00012, vy: -(0.00006 + Math.random() * 0.00018), a: 0.25 + Math.random() * 0.6, tw: Math.random() * Math.PI * 2 }));
    const resize = () => { const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(50, now - last); last = now;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.x += m.vx * dt * speed; m.y += m.vy * dt * speed; m.tw += dt * 0.002;
        if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); } if (m.x < -0.02) m.x = 1.02; if (m.x > 1.02) m.x = -0.02;
        const alpha = m.a * (0.6 + 0.4 * Math.sin(m.tw));
        ctx.beginPath(); ctx.fillStyle = `rgba(${color}, ${alpha})`; ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    if (!reduced && visible && inView) raf = requestAnimationFrame(tick);
    else { ctx.clearRect(0, 0, w, h); if (reduced) for (const m of motes) { ctx.beginPath(); ctx.fillStyle = `rgba(${color}, ${m.a * 0.6})`; ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2); ctx.fill(); } }
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density, color, speed, visible, inView, reduced]);
  return <canvas ref={ref} className={`particles ${className}`} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}
