// Mechanical migration of the remaining plain-text numeric fractions.
import fs from 'node:fs';
import {literals} from './notation-inventory.mjs';
const changes=[];
for(const row of literals()) {
  let after=row.value.split(/(\$[^$]+\$)/g).map(part=>part.startsWith('$')?part:part.replace(/(-?\d+)\/(\d+)/g,(_,a,b)=>`$\\frac{${a}}{${b}}$`)).join('');
  after=after.replace('（$ {}_nC_r$）','');
  if(after!==row.value)changes.push({...row,after});
}
fs.mkdirSync('outputs/notation',{recursive:true});
fs.writeFileSync('outputs/notation/prose.json',JSON.stringify(changes.map(({file,value,after})=>({file,before:value,after})),null,2));
for(const file of new Set(changes.map(r=>r.file))) {
  let source=fs.readFileSync(file,'utf8');
  for(const row of changes.filter(r=>r.file===file).sort((a,b)=>b.start-a.start))source=source.slice(0,row.start)+(row.raw?'`'+row.after+'`':JSON.stringify(row.after))+source.slice(row.end);
  fs.writeFileSync(file,source);
}
console.log(`Updated ${changes.length} remaining prose strings`);
