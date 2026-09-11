import {Pose,PosePlayground} from './CharacterHero';
import {useState} from 'react';
import {useLocation,Link} from 'react-router-dom';
import {useReducedMotion} from 'framer-motion';
import {X,ArrowUpRight,Pause,Play} from 'lucide-react';
import './SpaceCharacter.css';

export function CharacterBanner(){return <section className="character-banner"><div className="character-banner-run" aria-hidden="true"><Pose name="sit"/><span className="character-platform"/></div><div><span className="game-eyebrow">PLAYER ONE / AARON RAMÍREZ</span><h2>Curiosity is<br/>my default setting.</h2><p>Engineer, community builder, and explorer. From shipping apps to sharing ideas, there’s always another level to discover.</p><Link to="/about">Meet the player <ArrowUpRight size={17}/></Link></div></section>}
export function CharacterArt(){return <PosePlayground/>}
export default function SpaceCharacter(){
 const {pathname}=useLocation();const reduced=useReducedMotion();const [open,setOpen]=useState(false);const [hidden,setHidden]=useState(false);const [paused,setPaused]=useState(false);
 const level=pathname==='/about'?'02 / THE EXPLORER':pathname==='/experience'?'03 / MISSION LOG':pathname==='/contact'?'04 / MAKE CONTACT':'01 / HOME BASE';
 return <><div className={`game-starfield ${paused?'game-paused':''}`} aria-hidden="true">{Array.from({length:28},(_,i)=><i key={i} style={{left:`${(i*37+13)%100}%`,top:`${(i*29+4)%100}%`,animationDelay:`-${i%9}s`}}/>)}<span className="game-orbital-ring"/></div>{!hidden&&<aside className={`game-companion ${paused?'game-paused':''}`} aria-label="Aaron character guide">{open&&<div className="game-companion-message"><span>{level}</span><p>{pathname==='/contact'?'Ready for the next mission? Send me a hello.':'Welcome aboard. Explore the apps, meet the teams, and discover my work.'}</p><div><button onClick={()=>setPaused(p=>!p)}>{paused?<Play size={13}/>:<Pause size={13}/>} {paused?'Animate':'Pause character'}</button><button aria-label="Hide character guide" onClick={()=>setHidden(true)}><X size={15}/></button></div></div>}<button className="game-companion-button" aria-label={open?'Close character guide':'Meet your guide, Aaron'} aria-expanded={open} onClick={()=>setOpen(p=>!p)}><span className={`game-runner ${reduced?'game-paused':''}`} aria-hidden="true"><img src="/aaron-run-sprite.png" alt="" width="3970" height="397"/></span><span className="game-companion-tag">{open?'−':'+'} AARON</span></button></aside>}</>
}
