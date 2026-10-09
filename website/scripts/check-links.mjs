import {readdirSync,readFileSync,existsSync,statSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root=resolve('dist'),base='/shenyangjianzhudx-huiyu/';
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);}
let count=0; const errors=[];
for(const file of files(root).filter(f=>f.endsWith('.html'))){
  const html=readFileSync(file,'utf8');
  for(const match of html.matchAll(/(?:href|src|component-url|renderer-url)="([^"#]+)"/g)){
    const url=match[1];if(!url.startsWith('/'))continue;
    count++;
    if(!url.startsWith(base)){errors.push(`${file}: missing base ${url}`);continue;}
    const path=join(root,decodeURIComponent(url.split(/[?#]/)[0].slice(base.length)));
    if(!existsSync(path)||statSync(path).isDirectory()&&!existsSync(join(path,'index.html')))errors.push(`${file}: missing target ${url}`);
  }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Verified ${count} internal page/asset references under ${base}`);
