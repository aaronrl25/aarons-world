import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const sites = [
 ['ychackathon.vercel.app','Temper'],['codeandcoffeewearedevelopers-psi.vercel.app','Code & Coffee × WeAreDevelopers'],['codeandcoffee.org','Code & Coffee'],
 ['strgyz.vercel.app','STRGYZ'],['trihlon.vercel.app','Trihlon'],
 ['lanimatequila.com','Lánima Tequila'],['camafra.com.mx','Camafra'],
 ['aaronr257.sg-host.com','Grandma Mode'],['aaronr254.sg-host.com','LoopCFO'],['aaronr253.sg-host.com','Goaty'],
 ['supahfan.com','Supah Fan'],['babyburger.com.mx','Baby Burger'],['zarandero.com','Zarandero'],['oftalmicaclinica.com','Oftálmica Clínica'],['royabascal.com','Roy Abascal'],['rafasarmiento.mx','Rafa Sarmiento'],['vehitfer.com.mx','Vehitfer'],['nearminds.ai','Nearminds'],['bhuvibiz.com','Bhuvi Business'],['apevent.us','American Premier Events'],['apclus.com','American Premier Cricket League'],['aron.software','Aaron — Terminal Portfolio'],
];
await mkdir('public/websites',{recursive:true});
const entries=[];
for(const [domain,name] of sites){
 const input=`site-captures/${domain}.png`;
 for(const width of [640,1440]) await sharp(input).resize({width}).webp({quality:84}).toFile(`public/websites/${domain}-${width}.webp`);
 entries.push({name,url:`https://${domain}/`,image:`/websites/${domain}-1440.webp`,thumbnail:`/websites/${domain}-640.webp`,temporary:domain.endsWith('.vercel.app')});
}
await writeFile('src/websites.json',JSON.stringify(entries,null,2)+'\n');
