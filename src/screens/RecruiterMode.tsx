import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Linkedin, Github, FileText, ExternalLink, Gamepad2, Youtube } from 'lucide-react';
import content from '../data/content.json';
import apps from '../data/professional-apps.json';
import websites from '../data/websites.json';
import { quests } from '../data/quests';
import { branches } from '../data/skills';
import { achievements } from '../data/achievements';
import { progress } from '../lib/progress';
import './RecruiterMode.css';

export default function RecruiterMode() {
  useEffect(() => { document.title = 'Aaron David Ramírez Lezama — Senior Software Engineer (Recruiter view)'; progress.setMode('recruiter'); }, []);
  const links = content.links as Record<string, string>;
  return (
    <main className="page recruiter">
      <div className="wrap">
        <header className="rec-hero">
          <img className="rec-photo" src="/aaron.jpg" alt="Aaron David Ramírez Lezama, smiling in a red cap and NASA hoodie" width="640" height="800" />
          <div className="rec-hero-copy">
            <p className="eyebrow">Recruiter view · everything on one page, no game</p>
            <h1>{content.name}</h1>
            <p className="rec-headline">Senior Software Engineer · <strong>10+ years</strong> of software engineering · <strong>8 years</strong> of front end · open to Senior, Lead and Staff React Native / Frontend roles</p>
            <p className="rec-summary">{content.summary}</p>
            <ul className="rec-contacts">
              <li><a href={`mailto:${content.email}`}><Mail size={16} aria-hidden="true" /> {content.email}</a></li>
              <li><a href="tel:+17737082882"><Phone size={16} aria-hidden="true" /> +1 (773) 708-2882</a></li>
              <li><a href={links.LinkedIn} target="_blank" rel="noopener noreferrer"><Linkedin size={16} aria-hidden="true" /> linkedin.com/in/aaronsoftware</a></li>
              <li><a href={links.GitHub} target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true" /> github.com/aaronrl25</a></li>
              <li><a href={links.YouTube} target="_blank" rel="noopener noreferrer"><Youtube size={16} aria-hidden="true" /> Podcast on YouTube</a></li>
            </ul>
            <div className="rec-actions">
              <a className="btn primary" href="/Aaron_Ramirez_Resume.docx" download><FileText size={16} aria-hidden="true" /> Download résumé (.docx)</a>
              <a className="btn" href="/aaron-david-ramirez-resume.txt" target="_blank" rel="noopener noreferrer">Plain-text résumé</a>
              <Link className="btn cyan" to="/world"><Gamepad2 size={16} aria-hidden="true" /> Adventure mode</Link>
            </div>
          </div>
        </header>

        <section className="rec-stats" aria-label="Key facts">
          {[['10+', 'years of software engineering'], ['8', 'years of front end'], ['500K+', 'daily users on Walmart apps I built'], ['1M+', 'HCSC members on Mobile 2.0'], ['40%', 'faster loads at Walmart and AEP'], ['200+', 'attendees at events I organize']].map(([v, l]) => <div className="stat" key={l}><strong>{v}</strong><span>{l}</span></div>)}
        </section>

        <div className="rec-columns">
          <div>
            <section className="rec-section" aria-labelledby="rec-exp">
              <h2 id="rec-exp">Experience</h2>
              <ol className="rec-timeline">
                {content.experience.map((e) => (
                  <li key={e.role + e.date}>
                    <p className="mono rec-date">{e.date}</p>
                    <h3>{e.role}</h3>
                    <p className="rec-company">{e.company}</p>
                    <ul>{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                    <div className="chips">{e.tags.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rec-section" aria-labelledby="rec-projects">
              <h2 id="rec-projects">Projects</h2>
              <ul className="rec-projects">
                {quests.map((q) => (
                  <li key={q.id}>
                    <h3><Link to={`/quests/${q.id}`}>{q.name}</Link> <span className="rec-project-kind">{q.kind}</span></h3>
                    <p>{q.mission}</p>
                    <p className="rec-project-stack mono">{q.loadout.join(' · ')}</p>
                    <p className="rec-project-links">{q.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <ExternalLink size={12} aria-hidden="true" /></a>)}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="rec-side">
            <section className="rec-section" aria-labelledby="rec-skills">
              <h2 id="rec-skills">Skills</h2>
              {branches.map((b) => <div className="rec-skill-group" key={b.id}><h3>{b.name}</h3><p>{b.skills.map((s) => s.years ? `${s.name} (${s.years})` : s.name).join(', ')}</p></div>)}
              <div className="rec-skill-group"><h3>Also</h3><p>{content.skills.map(([, v]) => v).join('; ')}</p></div>
            </section>
            <section className="rec-section" aria-labelledby="rec-ach">
              <h2 id="rec-ach">Achievements &amp; community</h2>
              <ul className="rec-list">{achievements.map((a) => <li key={a.id}><strong>{a.title}.</strong> {a.detail}</li>)}</ul>
            </section>
            <section className="rec-section" aria-labelledby="rec-edu">
              <h2 id="rec-edu">Education</h2>
              <ul className="rec-list">{content.education.map(([d, s]) => <li key={d}><strong>{d}.</strong> {s}</li>)}</ul>
            </section>
            <section className="rec-section" aria-labelledby="rec-apps">
              <h2 id="rec-apps">Apps in production</h2>
              <ul className="rec-apps">{apps.map((a) => <li key={a.id}><a href={a.url} target="_blank" rel="noopener noreferrer"><img src={a.image} alt="" loading="lazy" width="40" height="40" /><span>{a.name}<small>{a.company} · {a.store}</small></span></a></li>)}</ul>
            </section>
            <section className="rec-section" aria-labelledby="rec-web">
              <h2 id="rec-web">Websites shipped</h2>
              <p className="rec-web-list">{websites.filter((w) => !w.temporary).map((w, i, arr) => <span key={w.url}><a href={w.url} target="_blank" rel="noopener noreferrer">{w.name}</a>{i < arr.length - 1 ? ', ' : ''}</span>)}</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
