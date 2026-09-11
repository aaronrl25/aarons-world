/** Lightweight exploration progress kept in localStorage: visited realms, stations, opened quests, collected stars. */
import { useSyncExternalStore } from 'react';
export type Progress = { realms: string[]; quests: string[]; zones: string[]; stars: string[]; mode: 'adventure' | 'recruiter'; introSeen: boolean };
const KEY = 'aarons-world-progress-v1';
const empty: Progress = { realms: [], quests: [], zones: [], stars: [], mode: 'adventure', introSeen: false };
let state: Progress = read();
const listeners = new Set<() => void>();
function read(): Progress { try { const raw = localStorage.getItem(KEY); return raw ? { ...empty, ...JSON.parse(raw) } : empty; } catch { return empty; } }
function write(next: Progress) { state = next; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode */ } listeners.forEach((l) => l()); }
export const progress = {
  get: () => state,
  visitRealm: (id: string) => { if (!state.realms.includes(id)) write({ ...state, realms: [...state.realms, id] }); },
  openQuest: (id: string) => { if (!state.quests.includes(id)) write({ ...state, quests: [...state.quests, id] }); },
  visitZone: (id: string) => { if (!state.zones.includes(id)) write({ ...state, zones: [...state.zones, id] }); },
  collectStar: (id: string) => { if (!state.stars.includes(id)) write({ ...state, stars: [...state.stars, id] }); },
  setMode: (mode: Progress['mode']) => write({ ...state, mode }),
  markIntro: () => { if (!state.introSeen) write({ ...state, introSeen: true }); },
  reset: () => write(empty),
};
export function useProgress(): Progress {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => state, () => empty);
}

/** Experience points: worlds are worth the most, then stations, quests and stars. */
export const XP = { realm: 100, zone: 50, quest: 25, star: 15 } as const;
export const LEVEL_XP = 200;
export const xpOf = (p: Progress) => p.realms.length * XP.realm + p.zones.length * XP.zone + p.quests.length * XP.quest + p.stars.length * XP.star;
export const levelOf = (xp: number) => 1 + Math.floor(xp / LEVEL_XP);
export const hasSave = (p: Progress) => p.realms.length + p.zones.length + p.quests.length + p.stars.length > 0;
