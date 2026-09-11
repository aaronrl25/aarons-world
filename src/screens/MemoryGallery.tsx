import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, MapPin } from 'lucide-react';
import AaronCharacter from '../components/AaronCharacter';
import { memories, kinds, type MemoryKind } from '../data/memories';
import { progress } from '../lib/progress';
import { useReducedMotion } from '../lib/hooks';
import './MemoryGallery.css';

export default function MemoryGallery() {
  const [kind, setKind] = useState<MemoryKind | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => { document.title = 'Memory Vault — aaron.software'; progress.visitZone('vault'); }, []);
  const list = useMemo(() => kind === 'all' ? memories : memories.filter((m) => m.kind === kind), [kind]);
  const index = list.findIndex((m) => m.id === openId);
  const current = index >= 0 ? list[index] : null;
  useEffect(() => { const d = dialogRef.current; if (!d) return; if (current && !d.open) d.showModal(); if (!current && d.open) d.close(); }, [current]);
  const move = (delta: number) => { if (index < 0) return; setOpenId(list[(index + delta + list.length) % list.length].id); };
  useEffect(() => { if (!current) return; const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') move(1); if (e.key === 'ArrowLeft') move(-1); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); });
  return (
    <main className="page vault">
      <div className="wrap">
        <header className="page-head vault-head">
          <div>
            <p className="eyebrow">Memory vault · actual photos, actual stories</p>
            <h1>Collectible moments</h1>
            <p>Stages, hackathons, meetups and the occasional day off. I wrote a line for each one, so nothing here is decoration.</p>
          </div>
          <div className="vault-actor" aria-hidden="true"><AaronCharacter animation="idle" pose="climbing/sit-on-block" size={200} /></div>
        </header>
        <div className="vault-filters" role="tablist" aria-label="Filter memories">
          {kinds.map((k) => <button key={k.id} type="button" role="tab" aria-selected={kind === k.id} className={`chip ${kind === k.id ? 'cyan' : ''}`} onClick={() => setKind(k.id)}>{k.label} <span className="count">{k.id === 'all' ? memories.length : memories.filter((m) => m.kind === k.id).length}</span></button>)}
        </div>
        <ul className="memory-grid">
          {list.map((m, i) => (
            <motion.li key={m.id} layout={!reduced} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.04 }} className={m.height > m.width ? 'tall' : ''}>
              <button type="button" className="memory-tile" onClick={() => setOpenId(m.id)} aria-label={`${m.title}. Open memory`}>
                <img src={m.thumbnail} alt={m.alt} loading="lazy" width={m.width} height={m.height} />
                <span className="memory-tile-info"><span className="hud-text">{m.kind.replace('-', ' ')}</span><strong>{m.title}</strong>{m.place && <small><MapPin size={11} aria-hidden="true" /> {m.place}</small>}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
      <dialog ref={dialogRef} className="memory-viewer" onClose={() => setOpenId(null)} onClick={(e) => { if (e.target === dialogRef.current) setOpenId(null); }} aria-label={current ? current.title : 'Memory'}>
        {current && (
          <div className="memory-viewer-inner">
            <button type="button" className="viewer-close" onClick={() => setOpenId(null)} aria-label="Close"><X size={20} /></button>
            <button type="button" className="viewer-nav prev" onClick={() => move(-1)} aria-label="Previous memory"><ChevronLeft size={24} /></button>
            <figure>
              <img key={current.id} src={current.src} alt={current.alt} width={current.width} height={current.height} />
              <figcaption>
                <p className="eyebrow">{current.kind.replace('-', ' ')}{current.place ? ` · ${current.place}` : ''}</p>
                <h2>{current.title}</h2>
                <p>{current.story}</p>
                <p className="mono viewer-count">{index + 1} / {list.length}</p>
              </figcaption>
            </figure>
            <button type="button" className="viewer-nav next" onClick={() => move(1)} aria-label="Next memory"><ChevronRight size={24} /></button>
          </div>
        )}
      </dialog>
    </main>
  );
}
