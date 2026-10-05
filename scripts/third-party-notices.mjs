import fs from 'node:fs';import path from 'node:path';
const packages=['react','react-dom','scheduler','lucide-react','qrcode','dijkstrajs'];
const blocks=['THIRD PARTY NOTICES\nThe portable browser distribution bundles code from the packages below. Installed server/build dependencies retain their own license files in node_modules. Source documents and standards retain their respective publisher terms.'];
for(const name of packages){const dir=path.join('node_modules',name),pkg=JSON.parse(fs.readFileSync(path.join(dir,'package.json')));const file=fs.readdirSync(dir).find(n=>/^(license|licence|copying)(\.|$)/i.test(n));if(!file)throw Error('License file missing: '+name);blocks.push(name+' '+pkg.version+' · '+pkg.license+'\n'+fs.readFileSync(path.join(dir,file),'utf8'));}
fs.writeFileSync('public/THIRD-PARTY-NOTICES.txt',blocks.join('\n\n--------------------\n\n'));
console.log('Bundled browser dependency license notices prepared.');
