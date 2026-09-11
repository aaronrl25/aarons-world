import sharp from 'sharp';
// Flood only neutral background connected to the canvas edge; preserve enclosed artwork.
const source='output/characters/aaron-pose-atlas.png';
const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const {width:w,height:h}=info;const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
function add(p){if(p<0||p>=w*h||seen[p])return;const j=p*4;const a=data[j],b=data[j+1],c=data[j+2];if(Math.min(a,b,c)<130||Math.max(a,b,c)-Math.min(a,b,c)>30)return;seen[p]=1;queue[tail++]=p;}
for(let x=0;x<w;x++){add(x);add((h-1)*w+x)}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1)}
while(head<tail){const p=queue[head++];data[p*4+3]=0;if(p%w)add(p-1);if(p%w<w-1)add(p+1);add(p-w);add(p+w)}
const png=await sharp(data,{raw:info}).png().toBuffer();
const boxes=[['fly',45,20,500,480],['float',550,0,440,505],['roll',1055,45,460,460],['sit',20,535,520,480],['land',590,535,390,460],['smile',1080,535,425,460]];
for(const [name,left,top,width,height] of boxes)await sharp(await sharp(png).extract({left,top,width,height}).png().toBuffer()).trim().resize(600,600,{fit:'contain',background:'#00000000'}).webp({quality:92}).toFile(`public/characters/${name}.webp`);
console.log('Prepared six separate character poses');
