import { Link, NavLink, useLocation } from 'react-router-dom';
import { Map, Scroll, GitBranch, Trophy, Images, FileText, Gamepad2, Briefcase, Mail } from 'lucide-react';
import { progress, useProgress, xpOf, levelOf, LEVEL_XP } from '../lib/progress';
import { locations } from '../data/world';
import './HUD.css';

const nav = [
  { to: '/world', label: 'World', icon: Map },
  { to: '/quests', label: 'Quests', icon: Scroll },
  { to: '/skills', label: 'Skills', icon: GitBranch },
  { to: '/achievements', label: 'Trophies', icon: Trophy },
  { to: '/memories', label: 'Memories', icon: Images },
  { to: '/contact', label: 'Contact', icon: Mail },
];

export default function HUD() {
  const p = useProgress();
  const { pathname } = useLocation();
  const recruiter = pathname.startsWith('/recruiter');
  const xp = xpOf(p), level = levelOf(xp);
  return (
    <>
      <header className={`hud ${recruiter ? 'is-recruiter' : ''}`}>
        <div className="hud-inner">
          <Link to="/" className="hud-logo" aria-label="aaron.software home">
            <img className="hud-avatar" src="/sprites/aaron-head.webp" alt="" width="40" height="40" decoding="async" />
            <span className="hud-logo-text"><strong>aaron.software</strong><small>Senior Software Engineer · 10+ yrs · 8 yrs front end</small></span>
          </Link>
          <nav className="hud-nav" aria-label="World navigation">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `hud-link ${isActive ? 'active' : ''}`}><Icon size={15} aria-hidden="true" /><span>{label}</span></NavLink>
            ))}
          </nav>
          <div className="hud-right">
            <Link to="/world" className="hud-progress" title={`Level ${level} · ${xp} XP · ${p.realms.length}/${locations.length} worlds explored`} aria-label={`Level ${level}, ${xp} experience points, ${p.realms.length} of ${locations.length} worlds explored`}>
              <span className="hud-level">LV {level}</span><span className="hud-xp" aria-hidden="true"><i style={{ width: `${((xp % LEVEL_XP) / LEVEL_XP) * 100}%` }} /></span><span className="hud-worlds"><Map size={13} aria-hidden="true" /> {p.realms.length}/{locations.length}</span>
            </Link>
            <div className="mode-toggle" role="group" aria-label="Site mode">
              <NavLink to="/world" onClick={() => progress.setMode('adventure')} className={() => `mode ${!recruiter ? 'active' : ''}`}><Gamepad2 size={14} aria-hidden="true" /><span>Adventure</span></NavLink>
              <NavLink to="/recruiter" onClick={() => progress.setMode('recruiter')} className={({ isActive }) => `mode ${isActive ? 'active' : ''}`}><Briefcase size={14} aria-hidden="true" /><span>Recruiter</span></NavLink>
            </div>
            <a className="hud-resume" href="/Aaron_Ramirez_Resume.docx" download><FileText size={15} aria-hidden="true" /><span>Résumé</span></a>
          </div>
        </div>
      </header>
      <nav className="hud-mobile" aria-label="World navigation (mobile)">
        {nav.slice(0, 5).map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `hud-mlink ${isActive ? 'active' : ''}`}><Icon size={18} aria-hidden="true" /><span>{label}</span></NavLink>
        ))}
        <NavLink to="/recruiter" className={({ isActive }) => `hud-mlink ${isActive ? 'active' : ''}`}><Briefcase size={18} aria-hidden="true" /><span>Recruiter</span></NavLink>
      </nav>
    </>
  );
}
