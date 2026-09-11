import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {motion, useScroll, useSpring, useReducedMotion} from 'framer-motion';
import './SiteMotion.css';

export default function SiteMotion(){
 const {pathname}=useLocation();
 const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll();
 const progress=useSpring(scrollYProgress,{stiffness:110,damping:28});
 useEffect(()=>{
  if(reduced)return;
  const root=document.getElementById('page-content');
  if(!root)return;
  const selector='.character-banner,.character-art figure,.connect-intro,.connect-main>*,.connect-links>a,.ma-intro>h2,.ma-intro-grid>*,.ma-websites-heading,.ma-website,.ma-freelance-heading,.ma-freelance-services article,.ma-freelance-start,.photo-heading,.photo-highlights-grid>a,.photo-tile,.ma-home-links>h2,.ma-home-links>div>a,.ma-page-intro,.ma-about-grid>*,.ma-about-photo-strip figure,.ma-service,.ma-skills article,.ma-community article,.ma-experience details,.ma-code-card,.ma-contact-grid>*,.ma-experience-photo';
  const tracked=new Set<HTMLElement>();
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('motion-visible');observer.unobserve(entry.target)}
  },{threshold:.06,rootMargin:'0px 0px -25px 0px'});
  const scan=()=>root.querySelectorAll<HTMLElement>(selector).forEach(el=>{
   if(tracked.has(el))return;
   tracked.add(el);
   const index=Array.from(el.parentElement?.children??[]).indexOf(el);
   el.style.setProperty('--reveal-delay',`${Math.min(index%3,2)*85}ms`);
   el.classList.add('motion-reveal');
   if(el.getBoundingClientRect().bottom<0)el.classList.add('motion-visible');else observer.observe(el);
  });
  scan();
  const mutations=new MutationObserver(scan);
  mutations.observe(root,{childList:true,subtree:true});
  let frame=0;
  const update=()=>{frame=0;const hero=root.querySelector<HTMLElement>('.ma-photo-hero');if(hero){const bounds=hero.getBoundingClientRect();if(bounds.bottom>0)hero.style.setProperty('--hero-shift',`${Math.min(Math.max(-bounds.top,0)*.13,100)}px`)}};
  const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  window.addEventListener('scroll',scroll,{passive:true});update();
  return()=>{observer.disconnect();mutations.disconnect();window.removeEventListener('scroll',scroll);cancelAnimationFrame(frame);tracked.forEach(el=>{el.classList.remove('motion-reveal','motion-visible');el.style.removeProperty('--reveal-delay')});root.querySelector<HTMLElement>('.ma-photo-hero')?.style.removeProperty('--hero-shift')};
 },[pathname,reduced]);
 return <motion.div aria-hidden="true" className="site-scroll-progress" style={{scaleX:reduced?scrollYProgress:progress}}/>;
}
