import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Store, Star, CheckCircle2 } from 'lucide-react';
import AaronCharacter from '../components/AaronCharacter';
import { quests, type Quest } from '../data/quests';
import { branches } from '../data/skills';
import { memoryById } from '../data/memories';
import { progress, useProgress } from '../lib/progress';
import { useInView, useReducedMotion } from '../lib/hooks';
import './QuestBoard.css';

const skillName = (id: string) => branches.flatMap((b) => b.skills).find((s) => s.id === id)?.name ?? id;

export default function QuestBoard() {
  const { id } = useParams();
  const quest = id ? quests.find((q) => q.id === id) : undefined;
  useEffect(() => { document.title = quest ? `${quest.name} — Quest — aaron.software` : 'Quest Board — aaron.software'; }, [quest]);
  useEffect(() => { progress.visitZone('quests'); }, []);
  if (quest) return <QuestDetail quest={quest} />;
  return <Board />;
}

function Board() {
  const p = useProgress();
  const reduced = useReducedMotion();
  return (
    <main className="page quests">
      <div className="wrap">
        <header className="page-head board-head">
          <div>
            <p className="eyebrow">Quest board · things I built on my own time</p>
            <h1>Side quests worth the detour</h1>
            <p>Six projects outside the day job: hackathon builds, AI products, a voice assistant and an open-source starter. Each one shows the mission, the hard part, what I did and what shipped.</p>
          </div>
          <div className="board-actor" aria-hidden="true"><AaronCharacter animation="thinking" size={210} /></div>
        </header>
        <ol className="quest-grid">
          {quests.map((q, i) => {
            const done = p.quests.includes(q.id);
            return (
              <motion.li key={q.id} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.06 }}>
                <Link to={`/quests/${q.id}`} className="quest-card" style={{ ['--accent' as string]: q.accent }}>
                  <div className="quest-thumb">{q.screenshots[0] ? <img src={q.screenshots[0].src.replace('-1440', '-640')} alt="" loading="lazy" /> : <div className="quest-thumb-code mono" aria-hidden="true">{'{ mvp: true }'}</div>}</div>
                  <div className="quest-body">
                    <p className="quest-kind hud-text">{q.kind}</p>
                    <h2>{q.name}</h2>
                    <p className="quest-code">{q.codename}</p>
                    <div className="quest-meta">
                      <span className="stars" aria-label={`Difficulty ${q.difficulty} of 5`}>{Array.from({ length: 5 }, (_, s) => <Star key={s} size={13} className={s < q.difficulty ? 'on' : ''} aria-hidden="true" />)}</span>
                      {done ? <span className="quest-done"><CheckCircle2 size={13} aria-hidden="true" /> Completed</span> : <span className="quest-open">Open quest <ArrowRight size={13} aria-hidden="true" /></span>}
                    </div>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}

function QuestDetail({ quest }: { quest: Quest }) {
  const [celebrated, setCelebrated] = useState(false);
  const reduced = useReducedMotion();
  const archRef = useRef<HTMLElement>(null);
  const archInView = useInView(archRef, '-120px');
  useEffect(() => { progress.openQuest(quest.id); setCelebrated(false); }, [quest.id]);
  const idx = quests.findIndex((q) => q.id === quest.id);
  const next = quests[(idx + 1) % quests.length];
  const memory = quest.memory ? memoryById(quest.memory) : undefined;
  const LinkIcon = ({ kind }: { kind: Quest['links'][number]['kind'] }) => kind === 'github' ? <Github size={15} aria-hidden="true" /> : kind === 'store' ? <Store size={15} aria-hidden="true" /> : <ExternalLink size={15} aria-hidden="true" />;
  return (
    <main className="page quest" style={{ ['--accent' as string]: quest.accent }}>
      <div className="wrap">
        <Link to="/quests" className="back-link"><ArrowLeft size={15} aria-hidden="true" /> Quest board</Link>
        <header className="quest-hero">
          <div>
            <p className="eyebrow">{quest.kind}</p>
            <h1>{quest.name}</h1>
            <p className="quest-hero-code">{quest.codename}</p>
            <div className="quest-hero-meta">
              <span className="stars" aria-label={`Difficulty ${quest.difficulty} of 5`}>{Array.from({ length: 5 }, (_, s) => <Star key={s} size={14} className={s < quest.difficulty ? 'on' : ''} aria-hidden="true" />)}</span>
              <span className="chip">Quest complete</span>
            </div>
            <div className="quest-links">{quest.links.map((l) => <a key={l.href} className="btn cyan small" href={l.href} target="_blank" rel="noopener noreferrer"><LinkIcon kind={l.kind} /> {l.label}</a>)}</div>
          </div>
          <div className="quest-hero-actor" aria-hidden="true">
            <AaronCharacter animation={celebrated ? 'idle' : 'celebrating'} pose={celebrated ? 'jumping/jump-arms-up' : undefined} size={230} onAnimationComplete={() => setCelebrated(true)} />
          </div>
        </header>

        <div className="quest-layout">
          <nav className="quest-nav" aria-label="Quest sections">
            {['Mission', 'Challenge', 'Role', 'Loadout', 'Architecture', 'Solution', 'Results', 'Screenshots'].map((s) => <a key={s} href={`#${s.toLowerCase()}`}>{s}</a>)}
            <div className="quest-nav-actor" aria-hidden="true"><AaronCharacter animation={archInView && !reduced ? 'crouching' : 'idle'} pose={archInView ? undefined : 'crouching/rest'} size={120} /></div>
          </nav>
          <div className="quest-log">
            <Section id="mission" title="Mission"><p>{quest.mission}</p></Section>
            <Section id="challenge" title="Challenge"><p>{quest.challenge}</p></Section>
            <Section id="role" title="Aaron’s role"><p>{quest.role}</p></Section>
            <Section id="loadout" title="Technology loadout"><div className="chips">{quest.loadout.map((t) => <span className="chip cyan" key={t}>{t}</span>)}</div></Section>
            <Section id="architecture" title="Architecture" ref={archRef}><ol className="arch">{quest.architecture.map((a, i) => <li key={a}><span className="mono">{String(i + 1).padStart(2, '0')}</span>{a}</li>)}</ol></Section>
            <Section id="solution" title="Solution"><p>{quest.solution}</p></Section>
            <Section id="results" title="Results"><ul className="results">{quest.results.map((r) => <li key={r}><CheckCircle2 size={16} aria-hidden="true" />{r}</li>)}</ul></Section>
            <Section id="screenshots" title="Screenshots">
              {quest.screenshots.length ? <div className="shots">{quest.screenshots.map((s) => <figure key={s.src} className="shot panel"><img src={s.src} alt={s.alt} loading="lazy" /><figcaption>{s.alt}</figcaption></figure>)}</div> : <p className="muted">This quest lives in a repository rather than a storefront. <a href={quest.links[0].href} target="_blank" rel="noopener noreferrer">Open the code</a> to see it.</p>}
            </Section>
            {memory && (
              <Section id="memory" title="Memory card">
                <Link to="/memories" className="memory-card panel">
                  <img src={memory.thumbnail} alt={memory.alt} loading="lazy" width={memory.width} height={memory.height} />
                  <span><strong>{memory.title}</strong><small>{memory.story}</small></span>
                </Link>
              </Section>
            )}
            <Section id="skills" title="Skills used"><div className="chips">{quest.skills.map((s) => <Link key={s} to={`/skills?skill=${s}`} className="chip">{skillName(s)}</Link>)}</div></Section>
            <footer className="quest-foot">
              <Link to="/quests" className="btn"><ArrowLeft size={15} aria-hidden="true" /> Board</Link>
              <Link to={`/quests/${next.id}`} className="btn primary">Next quest: {next.name} <ArrowRight size={15} aria-hidden="true" /></Link>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

import { forwardRef, type ReactNode } from 'react';
const Section = forwardRef<HTMLElement, { id: string; title: string; children: ReactNode }>(function Section({ id, title, children }, ref) {
  return <section id={id} ref={ref} className="quest-section"><h2><span className="eyebrow">{title}</span></h2>{children}</section>;
});
