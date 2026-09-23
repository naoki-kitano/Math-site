import ts from 'typescript';
import {readFileSync} from 'node:fs';
const cache=new Map();
function load(file){
 if(cache.has(file.href))return cache.get(file.href);
 const source=file.pathname.endsWith('.json')?'export default '+readFileSync(file,'utf8'):ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 const js=source.replace(/from\s+["'](\.\/[^"']+)["']/g,(_,p)=>'from '+JSON.stringify(load(new URL(/\.(ts|json)$/.test(p)?p:p+'.ts',file))));
 const url='data:text/javascript;base64,'+Buffer.from(js).toString('base64');cache.set(file.href,url);return url;
}
const {lessons,exercises}=await import(load(new URL('../app/content/lessons.ts',import.meta.url)));
for(const chapter of [...new Set(lessons.map(l=>l.chapter))]){
 const list=lessons.filter(l=>l.chapter===chapter);
 console.log(`${list[0].subject??'数学II'}／${chapter}：${list.map(l=>l.title).join(' ・ ')}`);
}
for(const chapter of [...new Set(lessons.filter(l=>l.subject==='数学A').map(l=>l.chapter))]){
 const list=lessons.filter(l=>l.chapter===chapter),qs=exercises.filter(e=>list.some(l=>l.slug===e.lesson));
 console.log(JSON.stringify({chapter,lessons:list.length,examples:list.reduce((n,l)=>n+l.examples.length,0),questions:qs.length,supplements:list.reduce((n,l)=>n+l.supplements.length,0)}));
}
