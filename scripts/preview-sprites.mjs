// Renders a contact sheet of every processed pose (dev aid, not part of the site).
import sharp from 'sharp';
import meta from '../src/data/sprites.json' with { type: 'json' };
const out = process.argv[2] || 'output/sprites/contact-sheet.jpg';
const cats = [...new Set(meta.poses.map((p) => p.category))];
const TILE = 150; const tiles = []; let y = 0;
for (const cat of cats) {
  const poses = meta.poses.filter((p) => p.category === cat);
  const ch = Math.round(TILE * poses[0].canvasHeight / poses[0].canvasWidth) ;
  const tw = TILE, th = Math.min(ch, 220);
  for (let i = 0; i < poses.length; i++) {
    const p = poses[i];
    const img = await sharp('public' + p.path).resize(tw - 6, th - 6, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).flatten({ background: '#6d6d7a' }).png().toBuffer();
    tiles.push({ input: img, left: i * tw + 3, top: y + 3 });
  }
  y += th;
}
await sharp({ create: { width: TILE * 10, height: y, channels: 3, background: '#3a3a44' } }).composite(tiles).jpeg({ quality: 85 }).toFile(out);
console.log('wrote', out);
