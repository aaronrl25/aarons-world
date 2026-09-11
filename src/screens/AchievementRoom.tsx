import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import AaronCharacter from '../components/AaronCharacter';
import Particles from '../components/Particles';
import { achievements, type Achievement } from '../data/achievements';
import { memoryById } from '../data/memories';
import { progress } from '../lib/progress';
import { useReducedMotion } from '../lib/hooks';
import './AchievementRoom.css';

function TrophyIcon({ icon }: { icon: Achievement['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (icon) {
    case 'years': return <svg viewBox="0 0 48 48" {...common}><circle cx="24" cy="24" r="16" /><path d="M24 12v12l8 5" /><path d="M24 4v4M44 24h-4M24 44v-4M4 24h4" /></svg>;
    case 'rn': return <svg viewBox="0 0 48 48" {...common}><ellipse cx="24" cy="24" rx="18" ry="7" /><ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(60 24 24)" /><ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(120 24 24)" /><circle cx="24" cy="24" r="3" fill="currentColor" /></svg>;
    case 'walmart': return <svg viewBox="0 0 48 48" {...common}><path d="M8 40V22h6v-6h6v6h8V12h6v10h6v18Z" /><path d="M21 40v-8h6v8" /></svg>;
    case 'ibm': return <svg viewBox="0 0 48 48" {...common}><path d="M10 40 20 8h8l10 32M14 28h20M17 18h14M10 40h28" /></svg>;
    case 'mic': return <svg viewBox="0 0 48 48" {...common}><rect x="18" y="6" width="12" height="22" rx="6" /><path d="M10 22c0 8 6 14 14 14s14-6 14-14M24 36v6M16 42h16" /></svg>;
    case 'trophy': return <svg viewBox="0 0 48 48" {...common}><path d="M14 8h20v10c0 8-4 14-10 14S14 26 14 18ZM14 12H6v4c0 5 4 8 8 8M34 12h8v4c0 5-4 8-8 8M24 32v6M16 42h16" /></svg>;
    case 'hammer': return <svg viewBox="0 0 48 48" {...common}><path d="M12 12h18l6 6-6 6H12l-4-6ZM22 24 8 42M30 12l8-4" /></svg>;
    case 'coffee': return <svg viewBox="0 0 48 48" {...common}><path d="M10 18h24v10a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10ZM34 22h4a4 4 0 0 1 0 8h-4M16 8c0 3 2 3 2 6M22 8c0 3 2 3 2 6M28 8c0 3 2 3 2 6" /></svg>;
    case 'crowd': return <svg viewBox="0 0 48 48" {...common}><circle cx="24" cy="14" r="5" /><circle cx="10" cy="18" r="4" /><circle cx="38" cy="18" r="4" /><path d="M14 40v-8a10 10 0 0 1 20 0v8M2 36v-6a8 8 0 0 1 8-8M46 36v-6a8 8 0 0 0-8-8" /></svg>;
    case 'map': return <svg viewBox="0 0 48 48" {...common}><path d="M6 12l12-4 12 4 12-4v28l-12 4-12-4-12 4ZM18 8v28M30 12v28" /></svg>;
  }
}

export default function AchievementRoom() {
  const [open, setOpen] = useState<Achievement | null>(null);
  const [celebrated, setCelebrated] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => { document.title = 'Hall of Achievements — aaron.software'; progress.visitZone('hall'); }, []);
  useEffect(() => { if (!open) return; const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [open]);
  const memory = open?.memory ? memoryById(open.memory) : undefined;
  return (
    <main className="page hall">
      <Particles density={30} color="229, 53, 43" speed={0.5} />
      <div className="wrap">
        <header className="page-head hall-head">
          <div>
            <p className="eyebrow">Hall of achievements · no participation trophies</p>
            <h1>Twelve trophies, one decade</h1>
            <p>Every one of these is real: years, employers, stages I spoke on, jams I won and the communities I help run. Open a trophy for the story.</p>
          </div>
          <div className="hall-actor" aria-hidden="true"><AaronCharacter animation={celebrated ? 'idle' : 'celebrating'} pose={celebrated ? 'combat/finger-guns' : undefined} size={220} onAnimationComplete={() => setCelebrated(true)} /></div>
        </header>
        <ol className="trophies">
          {achievements.map((a, i) => (
            <motion.li key={a.id} initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-30px' }} transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}>
              <button type="button" className={`trophy ${a.rarity}`} onClick={() => setOpen(a)} aria-haspopup="dialog">
                <span className="trophy-glow" aria-hidden="true" />
                <span className="trophy-icon" aria-hidden="true"><TrophyIcon icon={a.icon} /></span>
                <span className="trophy-plinth" aria-hidden="true" />
                <span className="trophy-title">{a.title}</span>
                <span className="trophy-rarity hud-text">{a.rarity}</span>
              </button>
            </motion.li>
          ))}
        </ol>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="trophy-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div className={`trophy-modal panel ${open.rarity}`} role="dialog" aria-modal="true" aria-labelledby="trophy-title" onClick={(e) => e.stopPropagation()} initial={reduced ? false : { y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={reduced ? undefined : { y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
              <button type="button" className="location-close" onClick={() => setOpen(null)} aria-label="Close"><X size={18} /></button>
              <span className="trophy-icon large" aria-hidden="true"><TrophyIcon icon={open.icon} /></span>
              <p className="eyebrow">{open.rarity} trophy</p>
              <h2 id="trophy-title">{open.title}</h2>
              <p className="trophy-detail">{open.detail}</p>
              {memory && <figure className="trophy-memory"><img src={memory.thumbnail} alt={memory.alt} loading="lazy" /><figcaption>{memory.title}. {memory.story}</figcaption></figure>}
              <div className="trophy-actions">
                {memory && <Link to="/memories" className="btn small">Memory vault</Link>}
                {open.link && <Link to={open.link} className="btn small primary">Go there <ArrowRight size={13} aria-hidden="true" /></Link>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
