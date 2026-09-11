import sharp from 'sharp';
import {readdir,mkdir,writeFile,stat} from 'node:fs/promises';
const captions=[
['Sharing ideas with the developer community','Community'],['An evening by the Golden Gate Bridge','Off duty'],['A sunny day at the Golden Gate Bridge','Off duty'],['Exploring a technology exhibition','Events'],['Meeting fellow attendees at a Capital One reception','Events'],['Outside NVIDIA GTC 2026','Events'],['Building and exchanging ideas at a developer gathering','Community'],['A visit to a GitHub event','Community'],['Conversations at a technology event','Events'],['A group photo at Auth0 Camp AI','Events'],['Connecting with the community at Auth0 Camp AI','Events'],['Sunset on San Francisco Bay','Off duty'],['At an innovation conference','Events'],['A quick selfie with fellow attendees','Community'],['Exploring the conference floor','Events'],['At a Snowflake event','Events'],['An evening at Oracle Park','Off duty'],['Connecting at an AWS event','Events'],['A community gathering in the city','Community'],['A group photo outside the Amazon Spheres','Community'],['A visit to Y Combinator','Events'],['Outside Y Combinator','Events'],['Enjoying a game at the stadium','Off duty'],['A portrait away from the keyboard','Off duty']];
const files=(await readdir('public/assets')).filter(f=>/\.jpg$/i.test(f)).sort();
await mkdir('public/photos',{recursive:true});
const photos=[];let original=0,optimized=0;
for(let i=0;i<files.length;i++){
 const source=`public/assets/${files[i]}`;original+=(await stat(source)).size;
 const id=`moment-${String(i+1).padStart(2,'0')}`;
 for(const width of [640,1440]){const target=`public/photos/${id}-${width}.webp`;await sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality:80}).toFile(target);optimized+=(await stat(target)).size;}
 const meta=await sharp(source).metadata();
 photos.push({id,src:`/photos/${id}-1440.webp`,thumbnail:`/photos/${id}-640.webp`,alt:captions[i][0],category:captions[i][1],width:meta.autoOrient.width,height:meta.autoOrient.height});
}
await writeFile('src/photos.json',JSON.stringify(photos,null,2)+'\n');
console.log(`${photos.length} photos prepared. Originals ${(original/1024/1024).toFixed(1)} MB; all responsive variants ${(optimized/1024/1024).toFixed(1)} MB.`);
