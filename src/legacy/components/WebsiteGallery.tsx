import {useState} from 'react';
import {ArrowUpRight, Plus} from 'lucide-react';
import websites from '../websites.json';
export default function WebsiteGallery(){
 const [expanded,setExpanded]=useState(false);
 return <div className="ma-websites" id="freelance-websites">
  <div className="ma-websites-heading"><div><span className="ma-freelance-label">INDEPENDENT WORK / WEBSITES</span><h3>Ideas turned into websites.</h3></div><p>From local businesses to digital products.<br/>Explore a few things I’ve built for the web.</p></div>
  <div className="ma-websites-grid" id="website-grid">{(expanded?websites:websites.slice(0,6)).map(site=><a className="ma-website" key={site.url} href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} — visit website (opens in a new tab)`}><div className="ma-website-image"><img src={site.image} srcSet={`${site.thumbnail} 640w, ${site.image} 1440w`} sizes="(max-width:700px) 90vw, (max-width:1000px) 45vw, 30vw" width="1440" height="1000" alt={`${site.name} homepage preview`} loading="lazy" decoding="async"/><span>Visit website <ArrowUpRight size={16}/></span></div><div className="ma-website-caption"><h4>{site.name}{site.temporary&&<small className="ma-website-status">Temporary link</small>}</h4><ArrowUpRight size={18}/></div></a>)}</div>
  {!expanded&&<button className="ma-websites-more" aria-expanded={expanded} aria-controls="website-grid" onClick={()=>setExpanded(true)}>Show all {websites.length} websites <Plus size={17}/></button>}
 </div>
}
