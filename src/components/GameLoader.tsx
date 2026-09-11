import { useEffect, useState } from 'react';
import AaronLoader from './AaronLoader';
import { preloadPoses } from '../lib/sprites';
import { useReducedMotion } from '../lib/hooks';
import './GameLoader.css';

const lines = ['Compiling adventures…', 'Loading 10+ years of experience…', 'Initializing 8 years of front end…', 'Connecting enterprise systems…', 'Summoning clean architecture…', 'Optimizing performance…'];
const idlePoses = ['idle/neutral-right', 'idle/neutral-left', 'idle/glance-left', 'idle/look-up-left', 'idle/look-up', 'idle/reach-right', 'idle/wave', 'idle/point-up-right', 'idle/surprised', 'idle/laugh'];

export default function GameLoader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [line, setLine] = useState(0);
  const [pct, setPct] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  useEffect(() => { preloadPoses(idlePoses).then(() => setAssetsReady(true)); }, []);
  useEffect(() => {
    const total = reduced ? 900 : 4400; const start = performance.now(); let raf = 0;
    const tick = () => { const t = Math.min(1, (performance.now() - start) / total); setPct(Math.round(t * 100)); setLine(Math.min(lines.length - 1, Math.floor(t * lines.length))); if (t < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [reduced]);
  const done = pct >= 100 && assetsReady;
  useEffect(() => { if (done) { const t = window.setTimeout(onDone, 250); return () => window.clearTimeout(t); } }, [done, onDone]);
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader-scene" aria-hidden="true">
        <div className="loader-ground" />
        <div className="loader-ticks" />
        <div className="loader-runner"><AaronLoader size={230} label="Aaron running" /></div>
      </div>
      <h1 className="loader-title">Loading aaron.software…</h1>
      <p className="loader-line mono" key={line}>{lines[line]}</p>
      <div className="loader-bar" aria-hidden="true"><span className="loader-fill" style={{ width: `${pct}%` }} /><span className="loader-glow" /></div>
      <p className="loader-pct hud-text">{pct}%</p>
      <button type="button" className="loader-skip hud-text" onClick={onDone}>Skip intro</button>
    </div>
  );
}
