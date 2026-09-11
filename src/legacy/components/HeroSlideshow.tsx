import {useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {ArrowLeft,ArrowRight,Pause,Play} from 'lucide-react';
import photos from '../photos.json';
import './HeroSlideshow.css';
const slides=[...photos.filter(photo=>photo.id==='talent-land'),...photos.filter(photo=>photo.id!=='moment-03'&&photo.id!=='moment-23'&&photo.id!=='talent-land')];
export default function HeroSlideshow(){
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[visible,setVisible]=useState(true),[pageVisible,setPageVisible]=useState(true);
 const reduced=useReducedMotion();const root=useRef<HTMLDivElement>(null);
 const current=slides[index];const playing=!paused&&!reduced&&visible&&pageVisible;
 const change=(delta:number)=>setIndex(i=>(i+delta+slides.length)%slides.length);
 useEffect(()=>{const image=new Image();image.src=slides[(index+1)%slides.length].src;},[index]);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(root.current)observer.observe(root.current);const visibility=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',visibility);visibility();return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility)}},[]);
 useEffect(()=>{if(!playing)return;const timer=setTimeout(()=>change(1),6000);return()=>clearTimeout(timer)},[index,playing]);
 return <><div ref={root} className="hero-slideshow" aria-hidden="true"><AnimatePresence initial={false}><motion.div key={current.id} className={`hero-photo-slide ${current.height>current.width?'portrait-slide':''}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:1.2}}>
 {current.height>current.width&&<img className="hero-slide-backdrop" src={current.src} alt=""/>}
 <motion.img className="hero-slide-image" src={current.src} alt="" width={current.width} height={current.height} fetchPriority={index===0?'high':'auto'} initial={{scale:1}} animate={{scale:reduced?1:1.055}} transition={{duration:7,ease:'linear'}}/>
 </motion.div></AnimatePresence></div><div className="hero-slide-controls" role="group" aria-label="Hero photo slideshow"><div className="hero-slide-caption"><span>PEOPLE. PLACES. PERSPECTIVE.</span><p>{current.alt}</p></div><div className="hero-slide-buttons"><button aria-label="Previous hero photo" onClick={()=>{setPaused(true);change(-1)}}><ArrowLeft size={17}/></button><span className="hero-slide-count" aria-live={paused?'polite':'off'}>{String(index+1).padStart(2,'0')} / {slides.length}</span><button aria-label="Next hero photo" onClick={()=>{setPaused(true);change(1)}}><ArrowRight size={17}/></button>{!reduced&&<button aria-label={paused?'Play slideshow':'Pause slideshow'} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button>}</div></div></>
}
