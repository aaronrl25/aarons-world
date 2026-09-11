"use client";

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Menu, X } from 'lucide-react';
import { MediaGlobe } from './media-globe';

const navigation = [['About', 'about'], ['Expertise', 'expertise'], ['Mission log', 'experience'], ['Contact', 'contact']];

export function Sec2Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  return (
    <section id="top" className="aaron-origin" aria-label="Introduction">
      <nav className="ao-nav" aria-label="Main navigation">
        <a className="ao-logo" href="#top" aria-label="Aaron Ramírez, home">AR<span>®</span></a>
        <div className="ao-desktop-links">{navigation.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div>
        <a className="ao-nav-contact" href="#contact">Let’s talk <ArrowUpRight size={16}/></a>
        <button className="ao-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="hero-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
        {menuOpen && <div className="ao-mobile-links" id="hero-navigation">{navigation.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={16}/></a>)}</div>}
      </nav>
      <div className="ao-body">
        <motion.div className="ao-copy" initial={reduced ? false : {opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
          <p className="ao-eyebrow"><span/> Senior React Native Architect</p>
          <h1>Aaron<br/>Ramírez<span className="ao-period">.</span></h1>
          <p className="ao-tagline">Mobile products.<br/><span>Built for the real world.</span></p>
          <p className="ao-description">A decade turning complex problems into mobile experiences people rely on. I build the architecture, lead the team, and get it shipped.</p>
          <div className="ao-actions"><a href="#contact" className="ao-primary">Let’s talk <ArrowUpRight size={18}/></a><a href="#experience" className="ao-secondary">Explore my work <ArrowDown size={15}/></a></div>
          <div className="ao-credits"><span>EXPERIENCE ON THE GROUND</span><p>IBM <i/> Walmart <i/> HCSC</p></div>
        </motion.div>
        <motion.div className="ao-visual" initial={reduced ? false : {opacity:0}} animate={{opacity:1}} transition={{duration:1,delay:.2}}>
          <div className="ao-orbit" aria-hidden="true"/>
          <div className="ao-globe" aria-label="Interactive globe"><MediaGlobe query="(min-width: 0px)"/></div>
          <img className="ao-portrait" src="/aaron-removebg-preview.png" alt="Aaron Ramírez wearing an astronaut jacket" width="421" height="559"/>
          <span className="ao-telemetry">MISSION CONTROL<br/>MOBILE / SYSTEMS / PEOPLE</span>
          <div className="ao-flight-tag"><span className="ao-red-dot"/> 10+ YEARS IN THE FIELD</div>
          <span className="ao-crosshair" aria-hidden="true">+</span>
        </motion.div>
      </div>
      <div className="ao-bottom"><span>01 / READY FOR THE NEXT MISSION</span><a href="#about">SCROLL TO EXPLORE <ArrowDown size={13}/></a><span>CODE. COFFEE. LIFTOFF.</span></div>
    </section>
  );
}
