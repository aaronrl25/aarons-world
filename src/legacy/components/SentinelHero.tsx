import {Component, lazy, Suspense, useState, type ReactNode} from 'react';
import {motion, useReducedMotion} from 'framer-motion';
import {ArrowUpRight, ArrowDown, Menu, X} from 'lucide-react';
import './SentinelHero.css';
const Spline = lazy(()=>import('@splinetool/react-spline'));
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?null:this.props.children;}
}
const nav=[['About','about'],['Expertise','expertise'],['Projects','projects'],['Mission log','experience']];
export default function SentinelHero(){
  const reduced=useReducedMotion();
  const [open,setOpen]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const reveal=(delay:number)=>({initial:reduced?false:{opacity:0,y:20,filter:'blur(4px)'},animate:{opacity:1,y:0,filter:'blur(0px)'},transition:{duration:.7,delay:reduced?0:delay}});
  return <section id="top" className={`sentinel-hero ${loaded?'scene-loaded':''}`} aria-label="Introduction">
    <div className="sentinel-fallback" aria-hidden="true"><div className="sentinel-ring"/><img src="/aaron-removebg-preview.png" alt="" width="421" height="559"/></div>
    {!reduced&&<div className="sentinel-scene" aria-hidden="true"><SceneBoundary><Suspense fallback={null}><Spline scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode" onLoad={()=>setLoaded(true)}/></Suspense></SceneBoundary></div>}
    <div className="sentinel-shade" aria-hidden="true"/>
    <nav className="sentinel-nav" aria-label="Main navigation"><a href="#top" className="sentinel-logo" aria-label="Aaron Ramírez, home">AR<span>®</span></a><div className="sentinel-links">{nav.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</div><a className="sentinel-nav-cta" href="#contact">Let’s talk <ArrowUpRight size={16}/></a><button className="sentinel-menu" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="sentinel-mobile-nav" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>{open&&<div id="sentinel-mobile-nav" className="sentinel-mobile-nav">{[...nav,['Contact','contact']].map(([label,id])=><a key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}<ArrowUpRight size={16}/></a>)}</div>}</nav>
    <div className="sentinel-content">
      <motion.p className="sentinel-eyebrow" {...reveal(.1)}><span/> SENIOR REACT NATIVE ARCHITECT</motion.p>
      <motion.h1 {...reveal(.2)}>Aaron<br/><span>Ramírez.</span></motion.h1>
      <motion.p className="sentinel-tagline" {...reveal(.35)}>Mobile products. Built to go further.</motion.p>
      <motion.p className="sentinel-description" {...reveal(.45)}>A decade building mobile experiences people rely on. I lead teams, shape the architecture, and turn complex challenges into software that ships.</motion.p>
      <motion.div className="sentinel-actions" {...reveal(.55)}><a href="#contact" className="sentinel-primary">Let’s talk <ArrowUpRight size={18}/></a><a href="#projects" className="sentinel-secondary">Selected projects <ArrowDown size={17}/></a></motion.div>
      <motion.div className="sentinel-trust" {...reveal(.65)}><img src="/aaron-removebg-preview.png" alt="Aaron Ramírez" width="421" height="559"/><div><span>EXPERIENCE ON THE GROUND</span><p>IBM · Walmart · HCSC</p></div></motion.div>
    </div>
    <div className="sentinel-caption"><span>01 / READY FOR THE NEXT MISSION</span><a href="#about">EXPLORE <ArrowDown size={13}/></a></div>
  </section>;
}
