import meta from '../data/sprites.json';

export type PoseMeta = (typeof meta.poses)[number];
export type StripMeta = (typeof meta.strips)[number];

const byName = new Map<string, PoseMeta>(meta.poses.map((p) => [p.name, p]));
export const poseNames = meta.poses.map((p) => p.name);
export function pose(name: string): PoseMeta {
  const p = byName.get(name);
  if (!p) throw new Error(`Unknown pose "${name}"`);
  return p;
}
export function posesIn(category: string): PoseMeta[] { return meta.poses.filter((p) => p.category === category); }
export const runStrip: StripMeta = meta.strips.find((s) => s.id === 'run')!;

const loaded = new Set<string>();
/** Warm the browser cache for a set of poses (used before an animation plays). */
export function preloadPoses(names: string[]): Promise<void> {
  const jobs = names.filter((n) => !loaded.has(n)).map((n) => new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => { loaded.add(n); resolve(); };
    img.src = pose(n).path;
  }));
  return Promise.all(jobs).then(() => undefined);
}
export function preloadCategory(category: string) { return preloadPoses(posesIn(category).map((p) => p.name)); }
