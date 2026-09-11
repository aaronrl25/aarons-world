import { useEffect, useState } from 'react';
import { Mail, Phone, Linkedin, Github, Youtube, Globe, Copy, Check, Send } from 'lucide-react';
import AaronCharacter from '../components/AaronCharacter';
import Particles from '../components/Particles';
import content from '../data/content.json';
import { progress } from '../lib/progress';
import './ContactPortal.css';

export default function ContactPortal() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => { document.title = 'Contact Portal — aaron.software'; progress.visitZone('portal'); }, []);
  const links = content.links as Record<string, string>;
  const copy = async () => { try { await navigator.clipboard.writeText(content.email); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* clipboard unavailable */ } };
  const mailto = `mailto:${content.email}?subject=${encodeURIComponent(`Hello from ${name || 'a visitor'} (aaron.software)`)}&body=${encodeURIComponent(message)}`;
  return (
    <main className="page portal">
      <Particles density={48} />
      <div className="wrap portal-grid">
        <section className="portal-copy">
          <p className="eyebrow">Contact portal · I answer my own email</p>
          <h1>Open a channel</h1>
          <p className="portal-lead">I’m based between Chicago and San Francisco, open to Senior, Lead and Staff Front-end and Mobile roles, consulting and speaking. Pick a channel or write to me directly.</p>
          <ul className="channels">
            <li><a href={`mailto:${content.email}`}><Mail size={18} aria-hidden="true" /><span><strong>Email</strong><small>{content.email}</small></span></a><button type="button" className="copy" onClick={copy} aria-label="Copy email address">{copied ? <Check size={16} /> : <Copy size={16} />}</button></li>
            <li><a href="tel:+17737082882"><Phone size={18} aria-hidden="true" /><span><strong>Phone</strong><small>+1 (773) 708-2882</small></span></a></li>
            <li><a href={links.LinkedIn} target="_blank" rel="noopener noreferrer"><Linkedin size={18} aria-hidden="true" /><span><strong>LinkedIn</strong><small>linkedin.com/in/aaronsoftware</small></span></a></li>
            <li><a href={links.GitHub} target="_blank" rel="noopener noreferrer"><Github size={18} aria-hidden="true" /><span><strong>GitHub</strong><small>github.com/aaronrl25</small></span></a></li>
            <li><a href={links.YouTube} target="_blank" rel="noopener noreferrer"><Youtube size={18} aria-hidden="true" /><span><strong>Podcast</strong><small>Founders, CTOs and engineers on YouTube</small></span></a></li>
            <li><a href={links['aron.software']} target="_blank" rel="noopener noreferrer"><Globe size={18} aria-hidden="true" /><span><strong>aron.software</strong><small>The terminal portfolio</small></span></a></li>
          </ul>
          <form className="portal-form panel" onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}>
            <label>Your name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" /></label>
            <label>Message<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Tell Aaron about the role, the product or the talk." required /></label>
            <button type="submit" className="btn primary"><Send size={15} aria-hidden="true" /> Send through your mail app</button>
            <p className="portal-note">Opens your email client with the message prefilled. Nothing is stored on this site.</p>
          </form>
        </section>
        <section className="portal-stage" aria-label="Aaron at the portal">
          <p className="bubble portal-bubble">Real inbox, real replies. Tell me about the role or the thing you’re building.</p>
          <div className="portal-ring" aria-hidden="true"><span /><span /><span /></div>
          <AaronCharacter animation="idle" followCursor interactive size={380} label="Aaron waiting at the contact portal" />
        </section>
      </div>
    </main>
  );
}
