import { readFile, mkdir, writeFile } from 'node:fs/promises';
const routes = ['world', 'quests', 'skills', 'achievements', 'memories', 'recruiter', 'contact',
  'world/walmart-citadel', 'world/ibm-power-grid', 'world/hcsc-signal-tower', 'world/roambee-hive', 'world/eurybia-forge',
  'quests/phoenix', 'quests/lidia', 'quests/goaty', 'quests/loop-cfo', 'quests/grandma-mode', 'quests/rn-mvp-boilerplate'];
const html = await readFile('dist/index.html', 'utf8');
for (const route of routes) { await mkdir(`dist/${route}`, { recursive: true }); await writeFile(`dist/${route}/index.html`, html); }
await writeFile('dist/404.html', html);
console.log(`Generated ${routes.length} directly accessible page entries.`);
