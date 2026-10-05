import fs from 'node:fs';import path from 'node:path';
function walk(root,dir=root){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(root,path.join(dir,e.name)):/\.(js|css|woff2|png|svg)$/.test(e.name)?['/'+path.relative(root,path.join(dir,e.name)).replaceAll('\\','/')]:[]);}
for(const root of ['portable-dist','dist/client'])if(fs.existsSync(root)){const files=walk(root).filter(f=>!f.endsWith('/sw.js'));fs.writeFileSync(path.join(root,'offline-assets.json'),JSON.stringify(files));console.log(root+': '+files.length+' offline assets');}
