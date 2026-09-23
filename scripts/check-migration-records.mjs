import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const url=source=>`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
function contentModule(file){
 const source=file.pathname.endsWith('.json')?'export default '+fs.readFileSync(file,'utf8'):ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 return url(source.replace(/from\s+["'](\.\/[^"']+)["']/g,(_,relative)=>'from '+JSON.stringify(contentModule(new URL(/\.(ts|json)$/.test(relative)?relative:relative+'.ts',file)))));
}
const current=await import(contentModule(pathToFileURL(path.resolve('app/content/lessons.ts'))));
const old=await import(contentModule(pathToFileURL(path.resolve('work/github-pages-source/app/content/lessons.ts'))));
const exerciseKeys=['id','lesson','stage','family','kind','correct','repair'];
for(const e of old.exercises){
 const next=current.exercises.find(x=>x.id===e.id);assert(next,e.id);
 for(const key of exerciseKeys)assert.deepEqual(next[key],e[key],`${e.id}: ${key}`);
}
for(const l of old.lessons){
 const next=current.lessons.find(x=>x.slug===l.slug);assert(next,l.slug);
 assert.equal(next.chapter,l.chapter);assert.deepEqual(next.supplements.map(s=>s.id),l.supplements.map(s=>s.id));
}
// CoordinateDiagram has an already reviewed chapter-six axis-description addition.
for(const file of ['app/lib/progress.ts','app/components/Progress.tsx','app/components/MathText.tsx','app/components/Practice.tsx'])assert.equal(fs.readFileSync(file,'utf8'),fs.readFileSync(path.join('work/github-pages-source',file),'utf8'),file);
console.log(`Preserved ${old.lessons.length} published lesson IDs and ${old.exercises.length} exercise identities, scoring, repair links and shared storage/math components.`);
