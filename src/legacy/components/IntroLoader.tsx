import {useEffect,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import './IntroLoader.css';

export default function IntroLoader(){
 const [visible,setVisible]=useState(true);
 const reduced=useReducedMotion();
 useEffect(()=>{
  // Show once per page load, never again on internal navigation.
  const delay=reduced?0:2200;
  const timer=window.setTimeout(()=>setVisible(false),delay);
  return()=>window.clearTimeout(timer);
 },[reduced]);
 return <AnimatePresence>{visible&&<motion.div className="intro-loader" role="status" aria-label="Loading Aaron.software" initial={{opacity:1}} exit={reduced?{opacity:0}:{opacity:0,y:'-8%'}} transition={{duration:reduced?0:.55,ease:[.76,0,.24,1]}}>
  <div className="space-loader-stars" aria-hidden="true">{Array.from({length:32},(_,i)=><i key={i} style={{left:`${(i*37+9)%100}%`,top:`${(i*23+7)%100}%`,animationDelay:`${-(i%7)*.3}s`,animationDuration:`${1.2+(i%5)*.3}s`}}/>)}</div><div className="intro-loader-content" aria-hidden="true"><div className="space-loader-scene"><div className="space-loader-orbit"/><div className="space-loader-planet"/><div className="space-runner"><img src="/aaron-run-sprite.png" width="3970" height="397" alt=""/></div><div className="space-loader-ground"/><span className="space-loader-coordinate">AR / MISSION START</span></div><motion.div className="intro-loader-mark" initial={reduced?false:{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.45}}><span>Aaron</span><span className="intro-loader-dot">.</span><span className="intro-loader-software">software</span></motion.div><div className="intro-loader-track"><motion.span initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:reduced?0:2.1,ease:[.22,1,.36,1]}}/></div><div className="intro-loader-caption"><span>ENGINEERING IDEAS INTO REALITY</span><span>WELCOME</span></div></div>
 </motion.div>}</AnimatePresence>
}
