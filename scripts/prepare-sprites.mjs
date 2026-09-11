/**
 * Sprite pipeline for Aaron's character sheets.
 *
 *  1. Detects the grid of every sheet (gap analysis, with the known 5x2 layout as fallback).
 *  2. Removes the fake checkerboard / neutral background (flood fill from the edges, plus
 *     enclosed checkerboard pockets), keeping real alpha where the PNG already has it.
 *  3. Labels connected components, assigns them to grid cells and crops every pose
 *     to its own transparent PNG with no leftover padding (2px safety margin).
 *  4. Normalises every pose in a category onto a shared canvas, at its original scale,
 *     so proportions stay identical between poses.
 *  5. Writes optimised WebP versions (full size + small) for the website.
 *  6. Never touches the source files; writes metadata to src/data/sprites.json.
 *
 *  Run: node scripts/prepare-sprites.mjs
 */
import sharp from 'sharp';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'aaron-css-loader';
const IMG = (n) => path.join(SRC, `ChatGPT Image 8 sept 2026, ${n}.png`);

const SHEETS = [
  { id: 'idle', category: 'idle', source: IMG('11_46_50 p.m.'), columns: 5, rows: 2, align: 'bottom', dropDetached: true, removeCursors: true,
    names: ['neutral-left', 'glance-left', 'look-up-left', 'look-up', 'reach-right', 'wave', 'point-up-right', 'surprised', 'laugh', 'neutral-right'] },
  { id: 'jump', category: 'jumping', source: IMG('11_49_50 p.m.'), columns: 5, rows: 2, align: 'center',
    names: ['crouch-ready', 'jump-fists', 'jump-arms-up', 'leap-forward', 'tuck', 'jump-reach-up', 'leap-star', 'leap-run', 'land-low', 'land-crouch'] },
  { id: 'sword', category: 'energy-sword', source: IMG('11_49_52 p.m. (1)'), columns: 5, rows: 2, align: 'bottom', attachRadius: 30,
    names: ['guard', 'low-slash', 'raise', 'thrust', 'overhead', 'swing-wide', 'ready', 'cross-guard', 'slash-right', 'crouch-strike'] },
  { id: 'combat', category: 'combat', source: IMG('11_49_52 p.m. (2)'), columns: 5, rows: 2, align: 'bottom',
    names: ['guard', 'guard-close', 'punch-left', 'punch-right', 'open-palm', 'stop-hand', 'high-kick', 'sweep-low', 'side-kick', 'finger-guns'] },
  { id: 'climb', category: 'climbing', source: IMG('11_49_52 p.m. (4)'), columns: 5, rows: 2, align: 'center', attachRadius: 30,
    names: ['wall-climb', 'ledge-pullup', 'wall-lean', 'vault-over', 'perch', 'ledge-reach', 'handstand-vault', 'sit-on-block', 'hang-bar', 'hang-swing'] },
  { id: 'stealth', category: 'crouching', source: IMG('11_49_53 p.m. (5)'), columns: 5, rows: 2, align: 'bottom',
    names: ['low-hand', 'hands-up', 'sneak', 'hand-down', 'rest', 'crawl', 'side-look', 'alert', 'both-hands', 'reach'] },
  { id: 'code', category: 'code-power', source: IMG('11_49_53 p.m. (6)'), columns: 5, rows: 2, align: 'bottom', attachRadius: 70,
    names: ['orb', 'small-orb', 'tap', 'beam', 'burst', 'swirl', 'lift-ring', 'crouch-wave', 'shields', 'meditate'] },
  { id: 'fall', category: 'falling', source: IMG('11_49_53 p.m. (7)'), columns: 5, rows: 2, align: 'center',
    names: ['fall-back', 'tumble', 'reach-down', 'arms-up', 'tuck', 'recover-sit', 'recover-roll', 'recover-kneel', 'recover-stumble', 'recover-smile'] },
];
const STRIPS = [
  { id: 'run', category: 'running', source: 'public/aaron-run-sprite.png', frames: 10, align: 'bottom' },
];

const OUT_PNG = 'output/sprites';
const OUT_WEB = 'public/sprites';
const PAD = 2;

/* ---------- pixel helpers ---------- */
function neutralLight(d, i) {
  const r = d[i], g = d[i + 1], b = d[i + 2];
  return Math.abs(r - g) <= 7 && Math.abs(g - b) <= 7 && Math.abs(r - b) <= 7 && Math.min(r, g, b) >= 198;
}
function label(mask, w, h, eight = true) {
  // returns {labels:Int32Array (0 = none), comps:[{id,area,minX,minY,maxX,maxY,sx,sy}]}
  const labels = new Int32Array(w * h);
  const queue = new Int32Array(w * h);
  const comps = [];
  let next = 0;
  for (let p = 0; p < w * h; p++) {
    if (!mask[p] || labels[p]) continue;
    next++;
    const c = { id: next, area: 0, minX: w, minY: h, maxX: 0, maxY: 0, sx: 0, sy: 0 };
    let head = 0, tail = 0; queue[tail++] = p; labels[p] = next;
    while (head < tail) {
      const q = queue[head++]; const x = q % w, y = (q - x) / w;
      c.area++; c.sx += x; c.sy += y;
      if (x < c.minX) c.minX = x; if (x > c.maxX) c.maxX = x; if (y < c.minY) c.minY = y; if (y > c.maxY) c.maxY = y;
      const push = (nx, ny) => { if (nx < 0 || ny < 0 || nx >= w || ny >= h) return; const n = ny * w + nx; if (mask[n] && !labels[n]) { labels[n] = next; queue[tail++] = n; } };
      push(x - 1, y); push(x + 1, y); push(x, y - 1); push(x, y + 1);
      if (eight) { push(x - 1, y - 1); push(x + 1, y - 1); push(x - 1, y + 1); push(x + 1, y + 1); }
    }
    comps.push(c);
  }
  return { labels, comps };
}


/**
 * The fake transparency grid is two flat neutral tones (for example ~253 and ~213, one
 * sheet uses ~190) in square cells of 8, 10 or 12 px. Both tones and the cell size are
 * measured from the sheet corners. A pixel then counts as checkerboard only if it is a
 * neutral tone AND a pixel exactly one cell away (horizontally or vertically) shows the
 * opposite tone. That periodic test rejects light concrete props and hoodie highlights,
 * which are neutral but not periodic. Blend pixels on cell borders are admitted when
 * they touch a match.
 */
function isNeutral(d, i, floor) { const r = d[i], g = d[i + 1], b = d[i + 2]; return Math.abs(r - g) <= 8 && Math.abs(g - b) <= 8 && Math.abs(r - b) <= 8 && Math.min(r, g, b) >= floor; }
function measureChecker(data, w, h) {
  const hist = new Uint32Array(256); const runs = [];
  const corners = [[0, 0], [w - 48, 0], [0, h - 48], [w - 48, h - 48]];
  for (const [cx, cy] of corners) for (let y = cy; y < cy + 48; y++) for (let x = cx; x < cx + 48; x++) { const i = (y * w + x) * 4; if (isNeutral(data, i, 150)) hist[data[i]]++; }
  // two modes: light = brightest peak, dark = brightest peak below light-15
  let light = 255; while (light > 0 && hist[light] < 50) light--;
  let dark = light - 15, best = 0; for (let v = light - 15; v >= 150; v--) if (hist[v] > best) { best = hist[v]; dark = v; }
  const mid = (light + dark) / 2;
  for (const [cx, cy] of corners) { let run = 0, last = -1; for (let x = cx; x < cx + 48; x++) { const v = data[(cy * w + x) * 4]; const cls = v > mid ? 1 : 0; if (cls === last) run++; else { if (last >= 0 && run > 2) runs.push(run); run = 1; last = cls; } } }
  runs.sort((a, b) => a - b); const period = runs.length ? runs[Math.floor(runs.length / 2)] : 8;
  return { light, dark, mid, period };
}
function checkerCandidates(data, w, h, tones) {
  const n = w * h, strong = new Uint8Array(n), cand = new Uint8Array(n);
  const { mid, dark, period } = tones; const floor = dark - 10, gap = Math.max(14, (tones.light - dark) * 0.45);
  const v = (p) => data[p * 4];
  for (let p = 0; p < n; p++) {
    if (!isNeutral(data, p * 4, floor)) continue;
    const x = p % w, y = (p - x) / w, me = v(p);
    const opposite = (q) => isNeutral(data, q * 4, floor) && Math.abs(v(q) - me) >= gap && ((v(q) > mid) !== (me > mid));
    if ((x >= period && opposite(p - period)) || (x + period < w && opposite(p + period)) || (y >= period && opposite(p - period * w)) || (y + period < h && opposite(p + period * w))) strong[p] = 1;
  }
  for (let p = 0; p < n; p++) {
    if (strong[p]) { cand[p] = 1; continue; }
    if (!isNeutral(data, p * 4, floor)) continue;
    const x = p % w;
    if ((x && strong[p - 1]) || (x < w - 1 && strong[p + 1]) || (p >= w && strong[p - w]) || (p < n - w && strong[p + w])) cand[p] = 1;
  }
  return cand;
}

/* ---------- background removal ---------- */
async function loadForeground(source, cfg = {}) {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, n = w * h;
  let realAlpha = false;
  for (let p = 0; p < n; p += 97) if (data[p * 4 + 3] < 250) { realAlpha = true; break; }
  const bg = new Uint8Array(n);
  let mode;
  if (realAlpha) {
    mode = 'alpha';
    for (let p = 0; p < n; p++) if (data[p * 4 + 3] < 16) bg[p] = 1;
  } else {
    mode = 'checkerboard';
    const tones = measureChecker(data, w, h);
    console.log(`  checkerboard tones ${tones.light}/${tones.dark}, cell ${tones.period}px`);
    const cand = checkerCandidates(data, w, h, tones);
    // exterior flood fill over candidate pixels
    const queue = new Int32Array(n); let head = 0, tail = 0;
    const seed = (p) => { if (cand[p] && !bg[p]) { bg[p] = 1; queue[tail++] = p; } };
    for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }
    while (head < tail) { const p = queue[head++]; const x = p % w; if (x) seed(p - 1); if (x < w - 1) seed(p + 1); if (p >= w) seed(p - w); if (p < n - w) seed(p + w); }
    // enclosed checkerboard pockets: neutral regions showing both checker tones
    const inner = new Uint8Array(n); for (let p = 0; p < n; p++) inner[p] = cand[p] && !bg[p] ? 1 : 0;
    const { labels, comps } = label(inner, w, h, false);
    const light = new Uint32Array(comps.length + 1), dark = new Uint32Array(comps.length + 1);
    for (let p = 0; p < n; p++) { const l = labels[p]; if (!l) continue; const v = data[p * 4]; if (v > tones.mid + 6) light[l]++; else if (v < tones.mid - 6) dark[l]++; }
    const pocket = new Uint8Array(comps.length + 1);
    for (const c of comps) if (c.area >= 120 && light[c.id] / c.area >= 0.18 && dark[c.id] / c.area >= 0.18) pocket[c.id] = 1;
    for (let p = 0; p < n; p++) if (labels[p] && pocket[labels[p]]) bg[p] = 1;
    // apply: transparent background + soften the 1px halo of blended edge pixels
    for (let p = 0; p < n; p++) {
      if (bg[p]) { data[p * 4 + 3] = 0; continue; }
      const x = p % w;
      const edge = (x && bg[p - 1]) || (x < w - 1 && bg[p + 1]) || (p >= w && bg[p - w]) || (p < n - w && bg[p + w]);
      if (edge) { const lum = (data[p * 4] + data[p * 4 + 1] + data[p * 4 + 2]) / 3; if (lum > 205) data[p * 4 + 3] = 70; else if (lum > 165) data[p * 4 + 3] = 150; }
    }
  }
  if (cfg.removeCursors) removeDrawnCursors(data, w, h, bg);
  const fg = new Uint8Array(n); for (let p = 0; p < n; p++) fg[p] = bg[p] ? 0 : 1;
  return { data, w, h, fg, mode };
}


/**
 * The idle sheet has small white mouse arrows with a blue outline drawn next to Aaron.
 * Each arrow is found by its blue outline ring; the enclosed white fill is recovered by
 * flood-filling the ring's bounding box from outside, and the whole arrow (plus a 1px
 * anti-alias rim) is cleared. Logged so the removals can be checked against the sheet.
 */
function removeDrawnCursors(data, w, h, bg) {
  const n = w * h, blue = new Uint8Array(n);
  for (let p = 0; p < n; p++) { const r = data[p * 4], g = data[p * 4 + 1], b = data[p * 4 + 2], a = data[p * 4 + 3]; if (a > 40 && b >= 140 && g >= 110 && b - r >= 30 && !bg[p]) blue[p] = 1; }
  const { labels, comps } = label(blue, w, h, true);
  const removed = [];
  for (const c of comps) {
    const bw = c.maxX - c.minX + 1, bh = c.maxY - c.minY + 1;
    if (c.area < 40 || bw < 12 || bh < 12 || bw > 90 || bh > 90) continue;
    // flood the padded box from its border through non-ring pixels; what is not reached is the arrow interior
    const x0 = Math.max(0, c.minX - 2), y0 = Math.max(0, c.minY - 2), x1 = Math.min(w - 1, c.maxX + 2), y1 = Math.min(h - 1, c.maxY + 2);
    const bwid = x1 - x0 + 1, bhei = y1 - y0 + 1, reach = new Uint8Array(bwid * bhei), q = [];
    const tryPush = (x, y) => { if (x < 0 || y < 0 || x >= bwid || y >= bhei) return; const k = y * bwid + x; if (reach[k] || labels[(y0 + y) * w + (x0 + x)] === c.id) return; reach[k] = 1; q.push(k); };
    for (let x = 0; x < bwid; x++) { tryPush(x, 0); tryPush(x, bhei - 1); } for (let y = 0; y < bhei; y++) { tryPush(0, y); tryPush(bwid - 1, y); }
    while (q.length) { const k = q.pop(); const x = k % bwid, y = (k - x) / bwid; tryPush(x - 1, y); tryPush(x + 1, y); tryPush(x, y - 1); tryPush(x, y + 1); }
    const arrow = new Uint8Array(bwid * bhei); let interior = 0;
    for (let k = 0; k < arrow.length; k++) { const x = k % bwid, y = (k - x) / bwid; if (!reach[k] || labels[(y0 + y) * w + (x0 + x)] === c.id) { arrow[k] = 1; if (reach[k] === 0) interior++; } }
    if (interior < 20) continue; // a blue ring without a filled interior is not an arrow
    for (let k = 0; k < arrow.length; k++) {
      if (!arrow[k]) continue; const x = k % bwid, y = (k - x) / bwid;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x0 + x + dx, yy = y0 + y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue; const p = yy * w + xx; data[p * 4 + 3] = 0; bg[p] = 1; }
    }
    removed.push(`(${c.minX},${c.minY}) ${bw}x${bh}`);
  }
  console.log(`  removed ${removed.length} drawn cursor arrows: ${removed.join(', ')}`);
}

/* ---------- grid detection ---------- */
function segments(profile, minGap) {
  const segs = []; let start = -1, gap = 0;
  for (let i = 0; i <= profile.length; i++) {
    const on = i < profile.length && profile[i] > 0;
    if (on) { if (start < 0) start = i; gap = 0; }
    else if (start >= 0) { gap++; if (gap >= minGap || i === profile.length) { segs.push([start, i - gap]); start = -1; gap = 0; } }
  }
  return segs;
}
function detectGrid(fg, w, h, expectCols, expectRows) {
  const colProfile = new Uint32Array(w), rowProfile = new Uint32Array(h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (fg[y * w + x]) { colProfile[x]++; rowProfile[y]++; }
  const cols = segments(colProfile, 4), rows = segments(rowProfile, 4);
  const detected = cols.length === expectCols && rows.length === expectRows;
  return {
    columns: expectCols, rows: expectRows, detected,
    detectedColumns: cols.length, detectedRows: rows.length,
    cellWidth: Math.round(w / expectCols), cellHeight: Math.round(h / expectRows),
    columnBounds: detected ? cols : null, rowBounds: detected ? rows : null,
  };
}
const cellOf = (grid, x, y) => Math.min(grid.rows - 1, Math.floor(y / grid.cellHeight)) * grid.columns + Math.min(grid.columns - 1, Math.floor(x / grid.cellWidth));
const boxDistance = (a, b) => Math.max(0, Math.max(a.minX - b.maxX, b.minX - a.maxX), Math.max(a.minY - b.maxY, b.minY - a.maxY));

/* ---------- pose extraction ---------- */
function cellCenters(grid) {
  const centers = [];
  for (let r = 0; r < grid.rows; r++) for (let c = 0; c < grid.columns; c++) {
    const cb = grid.columnBounds?.[c], rb = grid.rowBounds?.[r];
    centers.push({
      x: cb ? (cb[0] + cb[1]) / 2 : (c + 0.5) * grid.cellWidth,
      y: rb ? (rb[0] + rb[1]) / 2 : (r + 0.5) * grid.cellHeight,
    });
  }
  return centers;
}
function nearestForeground(fg, w, h, cx, cy) {
  cx = Math.round(cx); cy = Math.round(cy);
  for (let r = 0; r < 260; r++) {
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      const x = cx + dx, y = cy + dy;
      if (x >= 0 && y >= 0 && x < w && y < h && fg[y * w + x]) return y * w + x;
    }
  }
  return -1;
}
/**
 * Every cell centre seeds a simultaneous flood through the foreground, so a sword
 * blade or a cloud of particles that touches a neighbour splits at the thinnest
 * geodesic frontier instead of merging two poses. Detached fragments are then
 * attached to the nearest pose (within attachRadius) or dropped.
 */
function extractPoses(img, grid, cfg) {
  const { data, w, h, fg } = img; const n = w * h;
  const centers = cellCenters(grid);
  const owner = new Int32Array(n); // 1-based pose index
  const queue = new Int32Array(n); let head = 0, tail = 0;
  centers.forEach((c, i) => { const s = nearestForeground(fg, w, h, c.x, c.y); if (s >= 0 && !owner[s]) { owner[s] = i + 1; queue[tail++] = s; } else console.warn(`  ! ${cfg.id}: no artwork near cell ${i}`); });
  while (head < tail) {
    const p = queue[head++]; const o = owner[p]; const x = p % w;
    const push = (q) => { if (fg[q] && !owner[q]) { owner[q] = o; queue[tail++] = q; } };
    if (x) push(p - 1); if (x < w - 1) push(p + 1); if (p >= w) push(p - w); if (p < n - w) push(p + w);
    if (x && p >= w) push(p - w - 1); if (x < w - 1 && p >= w) push(p - w + 1); if (x && p < n - w) push(p + w - 1); if (x < w - 1 && p < n - w) push(p + w + 1);
  }
  const boxes = centers.map(() => ({ minX: w, minY: h, maxX: -1, maxY: -1, area: 0 }));
  for (let p = 0; p < n; p++) { const o = owner[p]; if (!o) continue; const b = boxes[o - 1]; const x = p % w, y = (p - x) / w; b.area++; if (x < b.minX) b.minX = x; if (x > b.maxX) b.maxX = x; if (y < b.minY) b.minY = y; if (y > b.maxY) b.maxY = y; }
  // detached fragments (glow particles, drawn cursors, stray specks)
  const rest = new Uint8Array(n); for (let p = 0; p < n; p++) rest[p] = fg[p] && !owner[p] ? 1 : 0;
  const { labels, comps } = label(rest, w, h, true);
  const attach = new Int32Array(comps.length + 1);
  const radius = cfg.dropDetached ? -1 : (cfg.attachRadius ?? 24);
  let attached = 0, dropped = 0;
  for (const c of comps) {
    let best = -1, bestD = Infinity;
    boxes.forEach((b, i) => { if (b.area) { const d = boxDistance(c, b); if (d < bestD) { bestD = d; best = i; } } });
    const speck = c.area < 15 && bestD > 3;
    if (best >= 0 && bestD <= radius && !speck) { attach[c.id] = best + 1; attached++; } else dropped++;
  }
  for (let p = 0; p < n; p++) if (labels[p] && attach[labels[p]]) { owner[p] = attach[labels[p]]; const b = boxes[owner[p] - 1]; const x = p % w, y = (p - x) / w; b.area++; if (x < b.minX) b.minX = x; if (x > b.maxX) b.maxX = x; if (y < b.minY) b.minY = y; if (y > b.maxY) b.maxY = y; }
  if (comps.length) console.log(`  detached fragments: ${attached} attached, ${dropped} dropped`);
  const poses = [];
  boxes.forEach((box, index) => {
    if (!box.area) { console.warn(`  ! ${cfg.id}: cell ${index} has no artwork`); return; }
    const left = Math.max(0, box.minX - PAD), top = Math.max(0, box.minY - PAD);
    const right = Math.min(w - 1, box.maxX + PAD), bottom = Math.min(h - 1, box.maxY + PAD);
    const pw = right - left + 1, ph = bottom - top + 1;
    const out = Buffer.alloc(pw * ph * 4);
    for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) {
      const p = (top + y) * w + (left + x);
      if (owner[p] !== index + 1) continue;
      out.set(data.subarray(p * 4, p * 4 + 4), (y * pw + x) * 4);
    }
    poses.push({ index, name: cfg.names?.[index] ?? `pose-${index + 1}`, buffer: out, width: pw, height: ph, source: { left, top } });
  });
  return poses;
}

async function normaliseAndWrite(poses, cfg, sheetMeta, meta) {
  const canvasW = Math.max(...poses.map((p) => p.width)) + 2, canvasH = Math.max(...poses.map((p) => p.height)) + 2;
  const category = cfg.category;
  await mkdir(path.join(OUT_PNG, category), { recursive: true });
  await mkdir(path.join(OUT_WEB, category), { recursive: true });
  sheetMeta.canvas = { width: canvasW, height: canvasH };
  for (const pose of poses) {
    const left = Math.floor((canvasW - pose.width) / 2);
    const top = cfg.align === 'bottom' ? canvasH - pose.height - 1 : Math.floor((canvasH - pose.height) / 2);
    const composed = sharp({ create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: pose.buffer, raw: { width: pose.width, height: pose.height, channels: 4 }, left, top }]).png({ compressionLevel: 9 });
    const pngPath = path.join(OUT_PNG, category, `${pose.name}.png`);
    await composed.toFile(pngPath);
    const webpPath = `/sprites/${category}/${pose.name}.webp`;
    const smallPath = `/sprites/${category}/${pose.name}-sm.webp`;
    await sharp(pngPath).webp({ quality: 86, alphaQuality: 92, effort: 5 }).toFile(path.join('public', webpPath));
    await sharp(pngPath).resize({ height: Math.min(260, canvasH), withoutEnlargement: true }).webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(path.join('public', smallPath));
    meta.poses.push({
      name: `${category}/${pose.name}`, pose: pose.name, category, sheet: cfg.id, index: pose.index,
      path: webpPath, smallPath, png: pngPath,
      width: pose.width, height: pose.height, canvasWidth: canvasW, canvasHeight: canvasH,
      offset: { x: left, y: top }, sourceRect: { ...pose.source, width: pose.width, height: pose.height },
    });
  }
}

/* ---------- main ---------- */
const meta = { generatedAt: new Date().toISOString(), sheets: [], strips: [], poses: [] };
let bytesWeb = 0;
for (const cfg of SHEETS) {
  console.log(`Sheet ${cfg.id}: ${cfg.source}`);
  const img = await loadForeground(cfg.source, cfg);
  const grid = detectGrid(img.fg, img.w, img.h, cfg.columns, cfg.rows);
  console.log(`  background: ${img.mode}; grid ${grid.columns}x${grid.rows} (${grid.detected ? 'detected from gaps' : `assumed, gaps gave ${grid.detectedColumns}x${grid.detectedRows}`}), cell ${grid.cellWidth}x${grid.cellHeight}`);
  const poses = extractPoses(img, grid, cfg);
  const sheetMeta = { id: cfg.id, category: cfg.category, source: cfg.source, width: img.w, height: img.h, background: img.mode, grid: { columns: grid.columns, rows: grid.rows, cellWidth: grid.cellWidth, cellHeight: grid.cellHeight, detected: grid.detected }, poses: poses.length };
  await normaliseAndWrite(poses, cfg, sheetMeta, meta);
  meta.sheets.push(sheetMeta);
  console.log(`  ${poses.length} poses -> canvas ${sheetMeta.canvas.width}x${sheetMeta.canvas.height}`);
}
for (const cfg of STRIPS) {
  console.log(`Strip ${cfg.id}: ${cfg.source}`);
  const img = await loadForeground(cfg.source);
  const grid = detectGrid(img.fg, img.w, img.h, cfg.frames, 1);
  console.log(`  background: ${img.mode}; ${grid.detectedColumns} frames found by gaps (expected ${cfg.frames})`);
  const frames = extractPoses(img, grid, { ...cfg, names: Array.from({ length: cfg.frames }, (_, i) => `frame-${String(i + 1).padStart(2, '0')}`) });
  const sheetMeta = { id: cfg.id, category: cfg.category, source: cfg.source, width: img.w, height: img.h, background: img.mode, grid: { columns: cfg.frames, rows: 1, cellWidth: grid.cellWidth, cellHeight: grid.cellHeight, detected: grid.detected }, poses: frames.length };
  await normaliseAndWrite(frames, cfg, sheetMeta, meta);
  meta.sheets.push(sheetMeta);
  // Equal-width strip for CSS steps() animation, built from the normalised frames.
  const fw = sheetMeta.canvas.width, fh = sheetMeta.canvas.height;
  const strip = sharp({ create: { width: fw * frames.length, height: fh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(await Promise.all(frames.map(async (f, i) => ({ input: await sharp(path.join(OUT_PNG, cfg.category, `${f.name}.png`)).toBuffer(), left: i * fw, top: 0 }))));
  const stripPath = `/sprites/${cfg.category}/${cfg.id}-strip.webp`;
  await strip.webp({ quality: 86, alphaQuality: 92, effort: 5 }).toFile(path.join('public', stripPath));
  meta.strips.push({ id: cfg.id, category: cfg.category, path: stripPath, frames: frames.length, frameWidth: fw, frameHeight: fh, width: fw * frames.length, height: fh });
  console.log(`  ${frames.length} frames -> strip ${fw * frames.length}x${fh}`);
}
for (const p of meta.poses) bytesWeb += (await stat(path.join('public', p.path))).size + (await stat(path.join('public', p.smallPath))).size;
await writeFile('src/data/sprites.json', JSON.stringify(meta, null, 2) + '\n');
console.log(`\n${meta.poses.length} poses written. WebP total ${(bytesWeb / 1024 / 1024).toFixed(2)} MB. Metadata: src/data/sprites.json`);
