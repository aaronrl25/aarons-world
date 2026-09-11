import sharp from 'sharp';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
const entries=JSON.parse(await readFile('site-captures/apps-source.json','utf8'));
await mkdir('public/apps',{recursive:true});
const apps=[];
for(const [id,title,url] of entries){
 await sharp(`site-captures/app-${id}.png`).resize({width:1000}).webp({quality:85}).toFile(`public/apps/${id}.webp`);
 apps.push({id,name:id==='lidia'?'Lidia Central':title,url,company:id==='aep-ohio'?'American Electric Power':id==='bcbsil'?'HCSC':id==='lidia'?'Propia AI':'Walmart',store:id==='aep-ohio'?'App Store':'Google Play',image:`/apps/${id}.webp`});
}
await writeFile('src/professional-apps.json',JSON.stringify(apps,null,2)+'\n');
