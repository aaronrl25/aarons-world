import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Briefcase, MousePointer2, RotateCcw } from 'lucide-react';
import GameLoader from '../components/GameLoader';
import AaronCharacter from '../components/AaronCharacter';
import Particles from '../components/Particles';
import { useReducedMotion, useCoarsePointer } from '../lib/hooks';
import { progress, useProgress, xpOf, levelOf, hasSave } from '../lib/progress';
import { locations, zones, collectibles } from '../data/world';
import { quests } from '../data/quests';
import { achievements } from '../data/achievements';
import './StartScreen.css';

/** The intro plays on every full page load of "/"; it is skipped only when the visitor navigates back home inside the app. */
let introPlayed = false;

export default function StartScreen() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const p = useProgress();
  const [phase, setPhase] = useState<'loading' | 'enter' | 'idle'>(() => (introPlayed ? 'idle' : 'loading'));
  useEffect(() => { document.title = 'aaron.software — Aaron David Ramírez Lezama, Senior Software Engineer'; }, []);
  useEffect(() => {
    if (phase !== 'enter') return;
    const t = window.setTimeout(() => setPhase('idle'), reduced ? 50 : 1500);
    return () => window.clearTimeout(t);
  }, [phase, reduced]);
  useEffect(() => {
    if (phase === 'loading') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement) && !(e.target instanceof HTMLAnchorElement)) navigate('/world'); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [phase, navigate]);
  const finishLoading = () => { introPlayed = true; progress.markIntro(); setPhase('enter'); };

  if (phase === 'loading') return <GameLoader onDone={finishLoading} />;
  const entering = phase === 'enter';
  const saved = hasSave(p);
  const xp = xpOf(p);
  return (
    <main className="start">
      <Particles density={36} />
      <div className="start-grid wrap">
        <motion.section className="start-copy" initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: entering ? 0.9 : 0.1 }}>
          <p className="eyebrow">Aaron’s World · a playable portfolio</p>
          <h1><span>Aaron David</span><span>Ramírez Lezama</span></h1>
          <p className="start-role">I’m a <strong>Senior Software Engineer</strong>, 10+ years building mobile, frontend, enterprise and AI-powered products, <strong>8 of them in front end</strong>. Walmart, IBM, HCSC, two startups. My career is a platformer: run and jump me through it, grab the stars, dock at each place to see what I built.</p>
          {saved ? (
            <div className="save-slot panel" aria-label="Saved game">
              <div className="save-slot-head"><span className="sticker">Save file</span><span className="save-level">LV {levelOf(xp)} · {xp} XP</span></div>
              <ul className="save-stats"><li><strong>{p.realms.length}/{locations.length}</strong> worlds</li><li><strong>{p.zones.length}/{zones.length}</strong> stations</li><li><strong>{p.stars.length}/{collectibles.length}</strong> stars</li><li><strong>{p.quests.length}/{quests.length}</strong> quests</li></ul>
              <div className="start-actions">
                <Link to="/world" className="btn primary" onClick={() => progress.setMode('adventure')}><Play size={16} aria-hidden="true" /> Continue</Link>
                <button type="button" className="btn" onClick={() => progress.reset()}><RotateCcw size={16} aria-hidden="true" /> New game</button>
                <Link to="/recruiter" className="btn" onClick={() => progress.setMode('recruiter')}><Briefcase size={16} aria-hidden="true" /> Recruiter mode</Link>
              </div>
            </div>
          ) : (
            <div className="start-actions">
              <Link to="/world" className="btn primary big" onClick={() => progress.setMode('adventure')}><Play size={18} aria-hidden="true" /> Press start</Link>
              <Link to="/recruiter" className="btn" onClick={() => progress.setMode('recruiter')}><Briefcase size={16} aria-hidden="true" /> Recruiter mode, no game</Link>
            </div>
          )}
          <ul className="start-stats" aria-label="What is in the world">
            <li><strong>{locations.length}</strong><span>worlds to explore</span></li>
            <li><strong>{collectibles.length} ★</strong><span>stars to collect</span></li>
            <li><strong>{quests.length}</strong><span>side quests</span></li>
            <li><strong>{achievements.length}</strong><span>trophies to find</span></li>
          </ul>
          <p className="start-hint hud-text">{coarse ? <>Hold to run, tap to jump · Recruiters: no game required, ever</> : <><kbd className="blink">Enter</kbd> press start · <kbd>← →</kbd> run · <kbd>Space</kbd> jump · <kbd>E</kbd> dock · Recruiters: no game required, ever</>}</p>
        </motion.section>
        <section className="start-stage" aria-label="Aaron's character">
          <div className="stage-platform" aria-hidden="true"><span /><span /><span /></div>
          {!entering && <p className="bubble stage-bubble">Hey! Press start and I’ll run and jump wherever you steer me. Click me for a surprise. <strong>Recruiters:</strong> the plain-text version is one click away.</p>}
          <figure className="stage-polaroid tape"><img src="/aaron-sm.jpg" alt="Aaron in real life, same cap, same hoodie" width="640" height="800" loading="lazy" /><figcaption>the real me ↑</figcaption></figure>
          <motion.div className="stage-actor" initial={reduced ? false : { x: entering ? '-70vw' : 0 }} animate={{ x: 0 }} transition={{ duration: entering ? 1.4 : 0, ease: 'linear' }}>
            <AaronCharacter animation={entering ? 'running' : 'idle'} followCursor interactive size={420} label="Aaron, in his red cap, astronaut hoodie and headphones, watching your cursor" />
          </motion.div>
          <p className="stage-tip"><MousePointer2 size={14} aria-hidden="true" /> drawn from the sprite sheets, not a stock avatar</p>
        </section>
      </div>
    </main>
  );
}
