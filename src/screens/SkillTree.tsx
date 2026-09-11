import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AaronCharacter from '../components/AaronCharacter';
import { branches, type Skill } from '../data/skills';
import { quests } from '../data/quests';
import { locations } from '../data/world';
import { progress } from '../lib/progress';
import { useReducedMotion } from '../lib/hooks';
import './SkillTree.css';

const allSkills = branches.flatMap((b) => b.skills.map((s) => ({ ...s, branch: b })));
const linkTarget = (id: string) => {
  const q = quests.find((x) => x.id === id); if (q) return { label: q.name, to: `/quests/${q.id}`, kind: 'Quest' };
  const l = locations.find((x) => x.id === id); if (l) return { label: l.name, to: `/world/${l.id}`, kind: 'Realm' };
  return null;
};

export default function SkillTree() {
  const [params, setParams] = useSearchParams();
  const reduced = useReducedMotion();
  const initial = params.get('skill');
  const [selectedId, setSelectedId] = useState<string>(initial && allSkills.some((s) => s.id === initial) ? initial : 'react-native');
  const [revealing, setRevealing] = useState(false);
  const selected = useMemo(() => allSkills.find((s) => s.id === selectedId)!, [selectedId]);
  useEffect(() => { document.title = 'Skill Tree — aaron.software'; progress.visitZone('skills'); }, []);
  const choose = (s: Skill & { branch: (typeof branches)[number] }) => {
    if (s.id === selectedId) return;
    setSelectedId(s.id); setParams({ skill: s.id }, { replace: true });
    if (!reduced) setRevealing(true);
  };
  const links = selected.links.map(linkTarget).filter(Boolean) as { label: string; to: string; kind: string }[];
  const totalYears = 10;
  return (
    <main className="page skills">
      <div className="wrap">
        <header className="page-head">
          <p className="eyebrow">Skill tree · what I’m actually good at</p>
          <h1>Five branches, one main quest</h1>
          <p>Front end is the trunk: 8 of my {totalYears}+ years. Pick any skill and I’ll point you at the places and projects where I earned it.</p>
        </header>
        <div className="tree-layout">
          <div className="tree" role="group" aria-label="Skill branches">
            <div className="trunk" aria-hidden="true" />
            {branches.map((b) => (
              <section key={b.id} className={`branch ${selected.branch.id === b.id ? 'lit' : ''}`} style={{ ['--accent' as string]: b.accent }} aria-labelledby={`branch-${b.id}`}>
                <header className="branch-head"><h2 id={`branch-${b.id}`}>{b.name}</h2><p>{b.tagline}</p></header>
                <ol className="branch-nodes">
                  {b.skills.map((s) => {
                    const active = s.id === selected.id;
                    return (
                      <li key={s.id}>
                        <button type="button" className={`skill-node ${active ? 'active' : ''}`} aria-pressed={active} onClick={() => choose({ ...s, branch: b })} title={s.note}>
                          <span className="node-ring" style={{ ['--level' as string]: `${(s.level / 5) * 360}deg` }} aria-hidden="true"><span className="node-core">{s.level}</span></span>
                          <span className="node-name">{s.name}</span>
                          {s.years && <span className="node-years mono">{s.years}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </div>
          <aside className="skill-detail panel cyan" aria-live="polite" style={{ ['--accent' as string]: selected.branch.accent }}>
            <div className="skill-detail-actor" aria-hidden="true">
              <AaronCharacter animation={revealing ? 'codePower' : 'idle'} pose={revealing ? undefined : selected.branch.pose} size={220} onAnimationComplete={() => setRevealing(false)} />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={selected.id} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
                <p className="eyebrow">{selected.branch.name}</p>
                <h2>{selected.name}</h2>
                <p className="skill-level"><span className="stars" aria-label={`Level ${selected.level} of 5`}>{'●'.repeat(selected.level)}{'○'.repeat(5 - selected.level)}</span>{selected.years && <span className="chip cyan">{selected.years}</span>}</p>
                {selected.note && <p className="skill-note">{selected.note}</p>}
                <h3 className="hud-text">Earned in</h3>
                {links.length ? (
                  <ul className="skill-links">{links.map((l) => <li key={l.to}><Link to={l.to}><span className="hud-text">{l.kind}</span><strong>{l.label}</strong><ArrowRight size={14} aria-hidden="true" /></Link></li>)}</ul>
                ) : <p className="skill-note">Community work: Code &amp; Coffee Chicago and San Francisco. See the <Link to="/achievements">Hall of Achievements</Link>.</p>}
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </main>
  );
}
