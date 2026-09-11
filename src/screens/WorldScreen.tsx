import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, ExternalLink, ChevronUp, ChevronLeft, ChevronRight, Briefcase, Anchor } from 'lucide-react';
import AaronCharacter, { type CharacterAnimation } from '../components/AaronCharacter';
import Particles from '../components/Particles';
import { locations, zones, collectibles, type Location } from '../data/world';
import { LEVEL, platforms, spots, starSpots, type Platform } from '../data/level';
import apps from '../data/professional-apps.json';
import { progress, useProgress, xpOf, levelOf, LEVEL_XP } from '../lib/progress';
import { useReducedMotion, useCoarsePointer, useInView } from '../lib/hooks';
import { preloadPoses } from '../lib/sprites';
import './WorldScreen.css';

/* ---------- the level ---------- */
const RUN = 380, GRAVITY = 2400, JUMP = 830, MAX_FALL = 1500, COYOTE = 0.1, BUFFER = 0.12;
const ACTOR = 110, DOCK_X = 110, DOCK_Y = 40, STAR_X = 38;
type Node = { id: string; name: string; sub: string; era?: string; x: number; y: number; kind: 'realm' | 'zone'; icon: string; accent: string; route: string };
const nodes: Node[] = [
  ...locations.map((l) => ({ id: l.id, name: l.name, sub: l.realm, era: l.era, x: spots[l.id].x, y: spots[l.id].y, kind: 'realm' as const, icon: l.icon, accent: l.accent, route: `/world/${l.id}` })),
  ...zones.map((z) => ({ id: z.id, name: z.name, sub: z.description, x: spots[z.id].x, y: spots[z.id].y, kind: 'zone' as const, icon: z.icon, accent: '#e5352b', route: z.route })),
];
const stars = collectibles.map((c) => ({ ...c, ...starSpots[c.id] }));
const findNode = (id: string) => nodes.find((n) => n.id === id);
const nodeById = (id: string) => findNode(id)!;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const sky = (() => { let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; return Array.from({ length: 260 }, () => ({ x: Math.round(rnd() * LEVEL.w), y: Math.round(rnd() * LEVEL.h), r: +(1 + rnd() * 2.2).toFixed(1), o: +(0.3 + rnd() * 0.7).toFixed(2), d: +(rnd() * 6).toFixed(1) })); })();
const starPath = (() => { let d = ''; for (let i = 0; i < 10; i++) { const r = i % 2 ? 7 : 16; const a = -Math.PI / 2 + (i * Math.PI) / 5; d += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)} `; } return d + 'Z'; })();

type Keys = { left: boolean; right: boolean; jump: boolean; jumpPressed: boolean };
const noKeys = (): Keys => ({ left: false, right: false, jump: false, jumpPressed: false });
const keyMap: Record<string, 'left' | 'right' | 'jump'> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'jump', ' ': 'jump', a: 'left', d: 'right', w: 'jump', A: 'left', D: 'right', W: 'jump' };
type Toast = { id: number; title: string; sub?: string; kind: 'xp' | 'level' | 'star' | 'info' };
type Anim = { animation: CharacterAnimation; pose?: string };
const ANIMS: Record<string, Anim> = {
  idle: { animation: 'idle' }, run: { animation: 'running' },
  rise: { animation: 'idle', pose: 'jumping/jump-fists' }, apex: { animation: 'idle', pose: 'jumping/jump-arms-up' }, fall: { animation: 'idle', pose: 'jumping/jump-reach-up' },
  land: { animation: 'idle', pose: 'jumping/land-low' }, plunge: { animation: 'idle', pose: 'falling/arms-up' },
  present: { animation: 'presenting' }, celebrate: { animation: 'celebrating' },
};
const isTyping = (t: EventTarget | null) => t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement;

export default function WorldScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const p = useProgress();
  const open = id ? locations.find((l) => l.id === id) : undefined;

  const stageRef = useRef<HTMLElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const stageInView = useInView(stageRef, '0px');
  const stageInViewRef = useRef(stageInView); stageInViewRef.current = stageInView;
  const openRef = useRef(open); openRef.current = open;

  const start = id && findNode(id) ? nodeById(id) : spots.home;
  const sim = useRef({ x: start.x, y: start.y, vx: 0, vy: 0, grounded: true, facing: 'right' as 'left' | 'right', coyote: 0, buffer: 0, jumpCut: false, landT: 0, safe: { x: start.x, y: start.y }, warping: false, celebrating: false });
  const keysRef = useRef<Keys>(noKeys());
  const camRef = useRef({ x: 0, s: 1, w: 0, h: 0 });
  const animRef = useRef('idle');
  const facingRef = useRef<'left' | 'right'>('right');
  const nearRef = useRef<string | null>(null);
  const collectedRef = useRef(new Set(progress.get().stars));
  const [animKey, setAnimKey] = useState('idle');
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [at, setAt] = useState<string | null>(id ?? null);
  const [near, setNear] = useState<string | null>(null);
  const [warping, setWarping] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [tutorial, setTutorial] = useState(() => { const s = progress.get(); return s.realms.length + s.zones.length + s.stars.length === 0; });
  const tutorialRef = useRef(tutorial); tutorialRef.current = tutorial;

  useEffect(() => { document.title = open ? `${open.name} — aaron.software` : 'The Career Run — aaron.software'; }, [open]);
  useEffect(() => { preloadPoses(['jumping/jump-fists', 'jumping/jump-arms-up', 'jumping/jump-reach-up', 'jumping/land-low', 'falling/arms-up', 'idle/point-up-right', 'idle/reach-right']); }, []);

  /* toasts and XP */
  const toastId = useRef(0);
  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const tid = ++toastId.current;
    setToasts((l) => [...l.slice(-2), { ...t, id: tid }]);
    window.setTimeout(() => setToasts((l) => l.filter((x) => x.id !== tid)), t.kind === 'star' ? 4200 : 3000);
  }, []);
  const gain = useCallback((apply: () => void, title: string, sub?: string, kind: Toast['kind'] = 'xp') => {
    const before = xpOf(progress.get()); apply(); const after = xpOf(progress.get());
    if (after <= before) return;
    toast({ title: `+${after - before} XP · ${title}`, sub, kind });
    if (levelOf(after) > levelOf(before)) window.setTimeout(() => toast({ title: `Level ${levelOf(after)}!`, sub: 'Level up. Keep running.', kind: 'level' }), 600);
  }, [toast]);

  useEffect(() => { if (open) { gain(() => progress.visitRealm(open.id), 'New world discovered', open.name); preloadPoses([open.enterPose]); } }, [open, gain]);
  useEffect(() => { if (id && !findNode(id)) navigate('/world', { replace: true }); }, [id, navigate]);

  const snapCam = () => { const cam = camRef.current, S = sim.current; const vw = cam.w / cam.s; cam.x = clamp(S.x - vw / 2, 0, Math.max(0, LEVEL.w - vw)); };
  const place = (n: { x: number; y: number }) => { const S = sim.current; S.x = n.x; S.y = n.y; S.vx = 0; S.vy = 0; S.grounded = true; S.safe = { x: n.x, y: n.y }; snapCam(); };
  // Deep links and "Visit X" buttons: appear there when Aaron is not already standing there.
  useEffect(() => {
    if (!id) return; const n = findNode(id); if (!n) return;
    const S = sim.current;
    if (!(Math.abs(S.x - n.x) < DOCK_X && Math.abs(S.y - n.y) < DOCK_Y)) place(n);
    setAt(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const arrive = (t: Node) => {
    setAt(t.id);
    if (t.kind !== 'zone') { navigate(t.route); return; }
    gain(() => progress.visitZone(t.id), 'Station reached', t.name);
    if (reduced) { navigate(t.route); return; }
    sim.current.celebrating = true; window.setTimeout(() => navigate(t.route), 1100);
  };
  const warp = (node: Node) => {
    const S = sim.current; if (S.warping) return;
    if (Math.abs(S.x - node.x) < DOCK_X && Math.abs(S.y - node.y) < DOCK_Y) { arrive(node); return; }
    if (reduced) { place(node); arrive(node); return; }
    S.warping = true; setWarping(true); keysRef.current = noKeys();
    if (openRef.current) navigate('/world');
    window.setTimeout(() => place(node), 340);
    window.setTimeout(() => { S.warping = false; setWarping(false); arrive(node); }, 720);
  };
  const dock = () => { const n = nearRef.current ? findNode(nearRef.current) : undefined; if (!n || openRef.current || sim.current.warping) return; arrive(n); };
  const dockRef = useRef(dock); dockRef.current = dock;
  const close = () => navigate('/world');

  /* stage size: the level always fits vertically, the camera scrolls sideways */
  useEffect(() => {
    const stage = stageRef.current, scaler = scalerRef.current; if (!stage || !scaler) return;
    const resize = () => {
      const r = stage.getBoundingClientRect(); const cam = camRef.current;
      cam.w = r.width; cam.h = r.height; cam.s = clamp(r.height / LEVEL.h, 0.5, 1.4);
      scaler.style.transform = `scale(${cam.s})`; scaler.style.width = `${r.width / cam.s}px`; scaler.style.height = `${LEVEL.h}px`;
      snapCam();
    };
    resize(); const ro = new ResizeObserver(resize); ro.observe(stage); return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* physics and camera */
  const objectiveRef = useRef<Node | null>(null);
  useEffect(() => {
    let raf = 0, last = 0;
    const step = (now: number) => {
      const dt = last ? Math.max(0, Math.min(0.033, (now - last) / 1000)) : 0; last = now;
      const S = sim.current, k = keysRef.current, cam = camRef.current;
      const frozen = S.warping || !!openRef.current || S.celebrating;
      const input = frozen ? 0 : (k.right ? 1 : 0) - (k.left ? 1 : 0);
      if (!frozen) {
        S.vx += (input * RUN - S.vx) * Math.min(1, dt * (S.grounded ? 16 : 8));
        if (!input && Math.abs(S.vx) < 6) S.vx = 0;
        if (input) S.facing = input < 0 ? 'left' : 'right';
        if (k.jumpPressed) { S.buffer = BUFFER; k.jumpPressed = false; }
        if (S.buffer > 0) S.buffer -= dt; if (S.coyote > 0) S.coyote -= dt;
        if (S.buffer > 0 && (S.grounded || S.coyote > 0)) { S.vy = -JUMP; S.grounded = false; S.coyote = 0; S.buffer = 0; S.jumpCut = false; }
        if (!k.jump && S.vy < -320 && !S.jumpCut) { S.vy = -320; S.jumpCut = true; }
        S.vy = Math.min(MAX_FALL, S.vy + GRAVITY * dt);
        const prevY = S.y;
        S.x = clamp(S.x + S.vx * dt, 30, LEVEL.w - 30);
        S.y += S.vy * dt;
        let landed: Platform | null = null;
        if (S.vy >= 0) for (const pl of platforms) { if (S.x >= pl.x - 10 && S.x <= pl.x + pl.w + 10 && prevY <= pl.y + 6 && S.y >= pl.y) { landed = pl; break; } }
        if (landed) {
          if (!S.grounded && S.vy > 700) S.landT = 0.14;
          S.y = landed.y; S.vy = 0; S.grounded = true; S.coyote = COYOTE;
          S.safe = { x: clamp(S.x, landed.x + 40, landed.x + landed.w - 40), y: landed.y };
        } else S.grounded = false;
        if (S.landT > 0) S.landT -= dt;
        if (S.y > LEVEL.h + 160) { S.x = S.safe.x; S.y = S.safe.y; S.vx = 0; S.vy = 0; S.grounded = true; toast({ title: 'The void', sub: 'Back on solid ground. Try the platform over the gap.', kind: 'info' }); }
        if (tutorialRef.current && (Math.abs(S.vx) > 30 || !S.grounded)) { tutorialRef.current = false; setTutorial(false); }
        for (const st of stars) {
          if (!collectedRef.current.has(st.id) && Math.abs(st.x - S.x) < STAR_X && st.y > S.y - ACTOR && st.y < S.y + 12) { collectedRef.current.add(st.id); gain(() => progress.collectStar(st.id), 'Star collected', st.fact, 'star'); }
        }
      }
      // pose
      let key = 'idle';
      if (openRef.current) key = 'present';
      else if (S.celebrating) key = 'celebrate';
      else if (!S.grounded) key = S.y > LEVEL.ground + 50 ? 'plunge' : S.vy < -150 ? 'rise' : S.vy > 150 ? 'fall' : 'apex';
      else if (S.landT > 0) key = 'land';
      else if (Math.abs(S.vx) > 30) key = 'run';
      if (key !== animRef.current) { animRef.current = key; setAnimKey(key); }
      if (S.facing !== facingRef.current) { facingRef.current = S.facing; setFacing(S.facing); }
      // docking range
      let nearest: string | null = null, nd = DOCK_X;
      for (const n of nodes) { const dx = Math.abs(n.x - S.x); if (dx < nd && Math.abs(n.y - S.y) < DOCK_Y) { nd = dx; nearest = n.id; } }
      if (nearest !== nearRef.current) { nearRef.current = nearest; setNear(nearest); }
      // camera with a little look-ahead
      const vw = cam.w / cam.s;
      const tx = clamp(S.x - vw / 2 + (S.facing === 'right' ? 90 : -90), 0, Math.max(0, LEVEL.w - vw));
      cam.x += (tx - cam.x) * Math.min(1, dt * 5);
      if (levelRef.current) levelRef.current.style.transform = `translate3d(${-cam.x}px, 0, 0)`;
      if (midRef.current) midRef.current.style.transform = `translate3d(${-cam.x * 0.4}px, 0, 0)`;
      if (farRef.current) farRef.current.style.transform = `translate3d(${-cam.x * 0.15}px, 0, 0)`;
      if (playerRef.current) { playerRef.current.style.left = `${S.x - ACTOR / 2}px`; playerRef.current.style.top = `${S.y - ACTOR}px`; }
      // off-screen objective pointer
      const o = objectiveRef.current, edge = edgeRef.current;
      if (edge) {
        if (o && !openRef.current) {
          const sx = o.x - cam.x;
          if (sx < -40) { edge.dataset.side = 'left'; edge.hidden = false; edge.querySelector('strong')!.textContent = o.name; }
          else if (sx > vw + 40) { edge.dataset.side = 'right'; edge.hidden = false; edge.querySelector('strong')!.textContent = o.name; }
          else edge.hidden = true;
        } else edge.hidden = true;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [gain, toast]);

  /* keyboard: arrows or A/D run, Space/W/Up jump, Enter or E dock */
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = keyMap[e.key];
      if (k) {
        if (!stageInViewRef.current && !openRef.current) return;
        if (e.key === ' ' && (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) return;
        e.preventDefault();
        if (k === 'jump') { if (!keysRef.current.jump) keysRef.current.jumpPressed = true; keysRef.current.jump = true; } else keysRef.current[k] = true;
        if (openRef.current) navigate('/world');
        return;
      }
      if ((e.key === 'Enter' || e.key === 'e' || e.key === 'E') && nearRef.current && !openRef.current && !(e.target instanceof HTMLButtonElement) && !(e.target instanceof HTMLAnchorElement)) { e.preventDefault(); dockRef.current(); }
    };
    const onUp = (e: KeyboardEvent) => { const k = keyMap[e.key]; if (k) keysRef.current[k] = false; };
    const onBlur = () => { keysRef.current = noKeys(); };
    window.addEventListener('keydown', onDown); window.addEventListener('keyup', onUp); window.addEventListener('blur', onBlur);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); window.removeEventListener('blur', onBlur); };
  }, [navigate]);

  /* objective: nearest unexplored world, then station, then the stars */
  const objective = useMemo(() => {
    const S = sim.current; const dist = (n: Node) => Math.abs(n.x - S.x);
    const pick = (list: Node[]) => [...list].sort((a, b) => dist(a) - dist(b))[0];
    const realm = pick(locations.filter((l) => !p.realms.includes(l.id)).map((l) => nodeById(l.id)));
    if (realm) return { node: realm as Node | null, text: `Reach ${realm.name}`, sub: 'Dock there and I’ll show you what I built.' };
    const zone = pick(zones.filter((z) => !p.zones.includes(z.id)).map((z) => nodeById(z.id)));
    if (zone) return { node: zone as Node | null, text: `Reach ${zone.name}`, sub: 'Every world explored. Now the stations.' };
    const left = collectibles.length - p.stars.length;
    if (left > 0) return { node: null, text: `Collect the last ${left} star${left === 1 ? '' : 's'}`, sub: 'Some need a jump or two.' };
    return { node: null, text: '100% explored. Legendary.', sub: 'Now open a channel in the Contact Portal.' };
  }, [p]);
  objectiveRef.current = objective.node;
  const xp = xpOf(p), level = levelOf(xp), levelPct = ((xp % LEVEL_XP) / LEVEL_XP) * 100;
  const nextRealm = useMemo(() => { if (!open) return null; const i = locations.findIndex((l) => l.id === open.id); return locations[(i + 1) % locations.length]; }, [open]);
  const nearNode = near ? findNode(near) : undefined;
  const anim = ANIMS[animKey];
  const idle = animKey === 'idle';

  const hold = (k: 'left' | 'right', on: boolean) => { keysRef.current[k] = on; };
  const holdProps = (k: 'left' | 'right') => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); hold(k, true); },
    onPointerUp: () => hold(k, false), onPointerCancel: () => hold(k, false), onPointerLeave: () => hold(k, false), onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });
  const jumpProps = {
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); keysRef.current.jumpPressed = true; keysRef.current.jump = true; if (openRef.current) navigate('/world'); },
    onPointerUp: () => { keysRef.current.jump = false; }, onPointerCancel: () => { keysRef.current.jump = false; }, onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };

  return (
    <main className="world">
      <section className="stage" ref={stageRef} aria-label="The Career Run: a platformer through Aaron's career. Arrow keys run, Space jumps, Enter docks.">
        <Particles density={24} color="229, 53, 43" speed={0.5} />
        <div className="scaler" ref={scalerRef}>
          <div className="layer far" ref={farRef} aria-hidden="true">
            {sky.map((st, i) => <i key={i} style={{ left: st.x, top: st.y, width: st.r * 2, height: st.r * 2, opacity: st.o, animationDelay: `${st.d}s` }} />)}
          </div>
          <div className="layer mid" ref={midRef} aria-hidden="true">
            <span className="nebula n1" /><span className="nebula n2" /><span className="nebula n3" /><span className="nebula n4" />
            <span className="far-planet p1" /><span className="far-planet p2" /><span className="far-planet p3" />
          </div>
          <div className="level" ref={levelRef} style={{ width: LEVEL.w, height: LEVEL.h }}>
            <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
              <defs>
                {locations.map((l) => (
                  <radialGradient key={l.id} id={`planet-${l.id}`} cx="35%" cy="30%" r="75%"><stop offset="0" stopColor="#ffffff" stopOpacity="0.85" /><stop offset="0.25" stopColor={l.accent} /><stop offset="0.75" stopColor={l.accent} stopOpacity="0.55" /><stop offset="1" stopColor="#04080f" /></radialGradient>
                ))}
              </defs>
            </svg>
            {platforms.map((pl, i) => <div key={i} className={`platform ${pl.kind ?? 'ledge'}`} style={{ left: pl.x, top: pl.y, width: pl.w, height: pl.h }} aria-hidden="true" />)}
            <div className="home-pad" style={{ left: spots.home.x, top: spots.home.y }} aria-hidden="true">
              <svg viewBox="-30 -30 60 60" width="60" height="60"><circle r="14" /><path d="M-22 0 h44 M0 -22 v44 M-9 -9 h18 v18 h-18 Z" /></svg>
              <span>Home station · start here</span>
            </div>
            {nodes.map((n) => {
              const visited = n.kind === 'realm' ? p.realms.includes(n.id) : p.zones.includes(n.id);
              return (
                <button type="button" key={n.id} className={`spot ${n.kind} ${visited ? 'visited' : ''} ${at === n.id ? 'active' : ''} ${near === n.id ? 'near' : ''}`} style={{ left: n.x, top: n.y, ['--accent' as string]: n.accent }} onClick={() => warp(n)} aria-label={`${n.name}: ${n.sub}. Warp there.`}>
                  <span className="spot-label"><strong>{n.name}</strong><small>{n.sub}</small>{n.era && <em>{n.era}</em>}</span>
                  <svg className="spot-art" viewBox="-60 -60 120 120" width="120" height="120" aria-hidden="true">
                    <circle className="halo" r="58" />
                    {n.kind === 'realm' ? (
                      <>
                        {n.id === 'walmart-citadel' && <ellipse className="planet-ring back" rx="66" ry="16" transform="rotate(-18)" />}
                        <circle className="planet" r="40" fill={`url(#planet-${n.id})`} />
                        {n.id === 'walmart-citadel' && <ellipse className="planet-ring front" rx="66" ry="16" transform="rotate(-18)" />}
                        {n.id === 'roambee-hive' && <circle className="moon" r="6" cx="48" cy="-30" />}
                      </>
                    ) : <polygon className="station" points="0,-40 35,-20 35,20 0,40 -35,20 -35,-20" />}
                    <g transform="scale(1.35)"><NodeIcon icon={n.icon} /></g>
                    {visited && <g className="check" transform="translate(34 -34)"><circle r="11" /><path d="M-5 0 l4 4 l6 -8" /></g>}
                  </svg>
                  {objective.node?.id === n.id && <span className="objective-marker" aria-hidden="true"><b>GO</b><ChevronUp size={28} style={{ transform: 'rotate(180deg)' }} /></span>}
                </button>
              );
            })}
            {stars.map((st, i) => !p.stars.includes(st.id) && (
              <span key={st.id} className="pickup" style={{ left: st.x, top: st.y, animationDelay: `${(i % 5) * 0.4}s` }} aria-hidden="true"><svg viewBox="-20 -20 40 40" width="40" height="40"><path d={starPath} /></svg></span>
            ))}
            {/* Aaron */}
            <div className={`player ${idle ? 'is-idle' : ''}`} ref={playerRef} style={{ width: ACTOR, height: ACTOR }}>
              <AaronCharacter animation={anim.animation} pose={anim.pose} size={ACTOR} direction={facing} speed={1.2} followCursor={idle && !open && !coarse} />
              <span className="player-shadow" aria-hidden="true" />
              {tutorial && !open && (
                <p className="bubble map-tutorial">{coarse ? 'Hold ◀ ▶ to run and tap the big button to jump. Grab the stars, then tap a place to dock.' : <><kbd>← →</kbd> run, <kbd>Space</kbd> jumps. Grab the ★ on the way, and press <kbd>Enter</kbd> at a planet to see what I built there.</>}</p>
              )}
              <AnimatePresence>
                {nearNode && !open && idle && !tutorial && (
                  <motion.button type="button" key={nearNode.id} className="dock-prompt" onClick={dock} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Anchor size={13} aria-hidden="true" /> {coarse ? 'Tap to dock at' : <><kbd>Enter</kbd> dock at</>} <strong>{nearNode.name}</strong>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* HUD overlays */}
        <div className="mission panel">
          <div className="mission-head"><span className="eyebrow">Mission</span><h1 className="mission-title" title={objective.sub}>{objective.text}</h1></div>
          <div className="xp" aria-label={`Level ${level}, ${xp} experience points`}>
            <span className="xp-level">LV {level}</span>
            <span className="xp-bar" aria-hidden="true"><i style={{ width: `${levelPct}%` }} /></span>
            <span className="xp-num mono">{xp} XP</span>
          </div>
          <div className="mission-foot">
            <ul className="mission-stats" aria-label="Exploration progress">
              <li><strong>{p.realms.length}/{locations.length}</strong> worlds</li>
              <li><strong>{p.zones.length}/{zones.length}</strong> stations</li>
              <li><strong>{p.stars.length}/{collectibles.length}</strong> stars</li>
            </ul>
            <Link to="/recruiter" className="mission-skip" onClick={() => progress.setMode('recruiter')}><Briefcase size={13} aria-hidden="true" /> <span>Skip the game,</span> recruiter view</Link>
          </div>
          <p className="mission-keys">{coarse ? 'Hold ◀ ▶ to run · big button jumps · tap a place to warp' : <><kbd>← →</kbd> run · <kbd>Space</kbd> jump · <kbd>Enter</kbd> dock · click a place to warp</>}</p>
        </div>

        <div className="edge-arrow" ref={edgeRef} hidden aria-hidden="true"><ChevronLeft size={18} className="l" /><strong /><ChevronRight size={18} className="r" /></div>

        <div className="toasts" aria-live="polite">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div key={t.id} className={`toast ${t.kind}`} initial={{ opacity: 0, y: -14, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ type: 'spring', stiffness: 400, damping: 26 }}>
                <strong>{t.title}</strong>{t.sub && <span>{t.sub}</span>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {coarse && (
          <div className="touch" aria-label="Run and jump controls">
            <div className="touch-move">
              <button type="button" className="touch-btn" aria-label="Run left" {...holdProps('left')}><ChevronLeft size={26} /></button>
              <button type="button" className="touch-btn" aria-label="Run right" {...holdProps('right')}><ChevronRight size={26} /></button>
            </div>
            <button type="button" className="touch-btn touch-jump" aria-label="Jump" {...jumpProps}><ChevronUp size={30} /><span>Jump</span></button>
          </div>
        )}
        <div className={`warp-veil ${warping ? 'on' : ''}`} aria-hidden="true"><span className="hud-text">Warping…</span></div>
      </section>

      <section className="wrap realm-list" aria-label="Fast travel">
        <div className="realm-list-head"><p className="eyebrow">Fast travel</p><h2>Every stop on the run</h2><p>Pick one and I’ll warp there.</p></div>
        <ul>
          {nodes.map((n) => { const visited = n.kind === 'realm' ? p.realms.includes(n.id) : p.zones.includes(n.id); return (
            <li key={n.id}><button type="button" className={`realm-btn ${visited ? 'visited' : ''}`} onClick={() => { stageRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); warp(n); }} style={{ ['--accent' as string]: n.accent }}><span className="realm-btn-icon"><svg viewBox="-30 -30 60 60" width="34" height="34" aria-hidden="true"><NodeIcon icon={n.icon} /></svg></span><span><strong>{n.name}</strong><small>{n.sub}</small></span><ArrowRight size={16} aria-hidden="true" /></button></li>
          ); })}
        </ul>
      </section>

      <AnimatePresence>
        {open && <CareerLocation key={open.id} location={open} onClose={close} next={nextRealm!} onNext={() => warp(nodeById(nextRealm!.id))} />}
      </AnimatePresence>
    </main>
  );
}

function NodeIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'citadel': return <g className="icon"><path d="M-18 12 V-6 h6 v-6 h6 v6 h12 v-12 h6 v12 h6 v18 Z" /><path d="M-3 12 v-8 h6 v8" /></g>;
    case 'grid': return <g className="icon"><path d="M-14 14 L-4 -16 h8 L14 14 M-11 4 h22 M-8 -6 h16 M-14 14 h28" /><path d="M2 -16 l-3 8 h5 l-4 9" className="bolt" /></g>;
    case 'tower': return <g className="icon"><path d="M0 14 V-14 M-6 14 h12 M-4 -4 h8 M-3 4 h6" /><path d="M-12 -12 a16 16 0 0 1 24 0 M-8 -8 a10 10 0 0 1 16 0" className="wave" /></g>;
    case 'hive': return <g className="icon"><path d="M-6 -16 h12 l6 10 l-6 10 h-12 l-6 -10 Z" /><path d="M6 -6 h12 l6 10 l-6 10 h-12" /><path d="M-6 4 h12 l6 10 l-6 10 h-12 l-6 -10 Z" /></g>;
    case 'forge': return <g className="icon"><path d="M-16 2 h32 l-4 6 h-8 v6 h-8 v-6 h-8 Z" /><path d="M-4 -4 c-6 -8 0 -12 0 -18 c6 6 10 10 4 18 Z" className="flame" /></g>;
    case 'quests': return <g className="icon"><path d="M-14 -14 h28 v22 h-28 Z M-8 -6 h16 M-8 0 h16 M-8 6 h10" /><path d="M-4 -14 v-4 h8 v4" /></g>;
    case 'skills': return <g className="icon"><path d="M0 16 V-2 M0 -2 l-10 -8 M0 -2 l10 -8 M0 6 l-8 -6 M0 6 l8 -6" /><circle cx="-10" cy="-10" r="3" /><circle cx="10" cy="-10" r="3" /><circle cx="0" cy="-16" r="3" /><path d="M0 -2 V-13" /></g>;
    case 'hall': return <g className="icon"><path d="M-12 -10 h24 v6 c0 8 -6 12 -12 12 c-6 0 -12 -4 -12 -12 Z M-4 8 v6 h8 v-6 M-8 14 h16" /><path d="M-12 -6 h-4 v4 c0 4 3 6 6 6 M12 -6 h4 v4 c0 4 -3 6 -6 6" /></g>;
    case 'vault': return <g className="icon"><path d="M-16 -12 h32 v24 h-32 Z M-11 7 l7 -8 l6 6 l4 -4 l5 6" /><circle cx="8" cy="-4" r="2.5" /></g>;
    case 'portal': return <g className="icon"><ellipse rx="12" ry="16" /><ellipse rx="6" ry="9" /><path d="M-16 16 h32" /></g>;
    default: return null;
  }
}

function CareerLocation({ location, onClose, next, onNext }: { location: Location; onClose: () => void; next: Location; onNext: () => void }) {
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [roleOpen, setRoleOpen] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setEntered(false); setRoleOpen(0); panelRef.current?.focus(); }, [location.id]);
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onClose]);
  const locationApps = apps.filter((a) => location.apps.includes(a.id));
  return (
    <motion.aside ref={panelRef} tabIndex={-1} className="location panel" role="dialog" aria-modal="false" aria-labelledby="loc-title" style={{ ['--accent' as string]: location.accent }}
      initial={reduced ? { opacity: 0 } : { x: '100%', opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { x: '100%', opacity: 0.5 }} transition={{ type: 'spring', stiffness: 260, damping: 32 }}>
      <button type="button" className="location-close" onClick={onClose} aria-label="Back to the map"><X size={18} /></button>
      <header className="location-head">
        <div className="location-actor">
          <AaronCharacter animation={entered ? 'idle' : 'jumping'} pose={entered ? location.enterPose : undefined} size={170} onAnimationComplete={() => setEntered(true)} />
        </div>
        <p className="eyebrow">{location.realm} · {location.era}</p>
        <h2 id="loc-title">{location.name}</h2>
        <p className="location-tagline">{location.tagline}</p>
      </header>
      <p className="bubble location-lore tail-left">{location.lore}</p>
      <div className="location-stats">{location.stats.map((s) => <div className="stat" key={s.label}><strong>{s.value}</strong><span>{s.label}</span></div>)}</div>

      <section className="location-section">
        <h3><span className="eyebrow">Campaign log</span> What I did at {location.name.split(' ')[0]}</h3>
        <div className="roles">
          {location.roles.map((r, i) => (
            <article key={r.title + r.dates} className={`role ${roleOpen === i ? 'open' : ''}`}>
              <button type="button" className="role-head" aria-expanded={roleOpen === i} onClick={() => setRoleOpen(roleOpen === i ? -1 : i)}>
                <span><strong>{r.title}</strong><small>{r.product}</small></span><span className="mono role-dates">{r.dates}</span><ChevronUp size={16} aria-hidden="true" />
              </button>
              <AnimatePresence initial={false}>{roleOpen === i && (
                <motion.div className="role-body" initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduced ? undefined : { height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="role-inner">
                    <div className="role-presenter" aria-hidden="true"><AaronCharacter animation="presenting" size={120} /></div>
                    <ul>{r.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                  </div>
                </motion.div>)}
              </AnimatePresence>
            </article>
          ))}
        </div>
      </section>

      <section className="location-section">
        <h3><span className="eyebrow">Chambers</span> What I built here</h3>
        <ul className="chambers">{location.chambers.map((c) => <li key={c.name}><strong>{c.name}</strong><span>{c.detail}</span></li>)}</ul>
      </section>

      <section className="location-section">
        <h3><span className="eyebrow">Loadout</span> Tools I used</h3>
        <div className="chips">{location.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
      </section>

      {locationApps.length > 0 && (
        <section className="location-section">
          <h3><span className="eyebrow">Artifacts</span> Apps in the wild</h3>
          <ul className="apps">{locationApps.map((a) => <li key={a.id}><a href={a.url} target="_blank" rel="noopener noreferrer"><img src={a.image} alt="" loading="lazy" width="96" height="96" /><span><strong>{a.name}</strong><small>{a.store} <ExternalLink size={11} aria-hidden="true" /></small></span></a></li>)}</ul>
        </section>
      )}

      <footer className="location-foot">
        <button type="button" className="btn" onClick={onClose}><ArrowLeft size={15} aria-hidden="true" /> Map</button>
        <button type="button" className="btn primary" onClick={onNext}>Warp to {next.name} <ArrowRight size={15} aria-hidden="true" /></button>
      </footer>
    </motion.aside>
  );
}

