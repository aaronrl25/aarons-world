/** The career level: a side-scrolling platformer. Units are pixels at scale 1; y grows downward and every y is the top edge of a platform (where feet land). */
export const LEVEL = { w: 6700, h: 900, ground: 780 };
export type Platform = { x: number; y: number; w: number; h: number; kind?: 'ground' | 'ledge' };
export const platforms: Platform[] = [
  // ground, with two pits into the void
  { x: 0, y: 780, w: 2640, h: 120, kind: 'ground' },
  { x: 2820, y: 780, w: 1600, h: 120, kind: 'ground' },
  { x: 4600, y: 780, w: 2100, h: 120, kind: 'ground' },
  // staircase after the forge, up to the Roambee ledge
  { x: 1150, y: 680, w: 160, h: 26 }, { x: 1400, y: 590, w: 160, h: 26 }, { x: 1650, y: 680, w: 160, h: 26 },
  { x: 1800, y: 600, w: 360, h: 26 },
  // over the first pit
  { x: 2690, y: 650, w: 110, h: 24 },
  // the Walmart tower
  { x: 3120, y: 640, w: 180, h: 24 }, { x: 2880, y: 520, w: 180, h: 24 }, { x: 3120, y: 400, w: 180, h: 24 },
  // steps to the HCSC ledge
  { x: 3380, y: 700, w: 120, h: 24 }, { x: 3550, y: 620, w: 380, h: 26 },
  // over the second pit
  { x: 4460, y: 660, w: 100, h: 24 },
  // the climb to the Hall of Achievements
  { x: 5000, y: 660, w: 160, h: 24 }, { x: 5200, y: 560, w: 160, h: 24 }, { x: 5350, y: 480, w: 360, h: 26 },
  // a last hop before the portal
  { x: 6050, y: 680, w: 160, h: 24 },
];
/** Where each world, station and the home pad stands (feet position). */
export const spots: Record<string, { x: number; y: number }> = {
  home: { x: 300, y: 780 },
  'eurybia-forge': { x: 900, y: 780 },
  'roambee-hive': { x: 1980, y: 600 },
  quests: { x: 2400, y: 780 },
  'walmart-citadel': { x: 3000, y: 780 },
  'hcsc-signal-tower': { x: 3740, y: 620 },
  skills: { x: 4200, y: 780 },
  'ibm-power-grid': { x: 4850, y: 780 },
  hall: { x: 5530, y: 480 },
  vault: { x: 5900, y: 780 },
  portal: { x: 6400, y: 780 },
};
/** Star centres, mostly a jump above a platform. */
export const starSpots: Record<string, { x: number; y: number }> = {
  'star-01': { x: 1230, y: 620 }, 'star-02': { x: 1480, y: 530 }, 'star-03': { x: 2110, y: 540 }, 'star-04': { x: 2745, y: 570 },
  'star-05': { x: 3210, y: 580 }, 'star-06': { x: 2970, y: 460 }, 'star-07': { x: 3210, y: 340 }, 'star-08': { x: 3880, y: 560 },
  'star-09': { x: 4510, y: 590 }, 'star-10': { x: 5080, y: 600 }, 'star-11': { x: 5280, y: 500 }, 'star-12': { x: 6130, y: 620 },
};
