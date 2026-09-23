import {readFileSync} from 'node:fs';
import ts from 'typescript';
function moduleURL(file){
 const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 return 'data:text/javascript;base64,'+Buffer.from(code.replace(/from\s+["'](\.\/[^"']+)["']/g,(_,p)=>'from '+JSON.stringify(moduleURL(new URL(p+'.ts',file))))).toString('base64');
}
const {math1Chapter4Lessons:lessons,math1Chapter4Exercises:exercises}=await import(moduleURL(new URL('../app/content/math1-chapter4.ts',import.meta.url)));
const rows=lessons.map(l=>({slug:l.slug,examples:l.examples.length,questions:exercises.filter(e=>e.lesson===l.slug).length,supplements:l.supplements.length}));
console.log(JSON.stringify({rows,total:rows.reduce((a,r)=>({examples:a.examples+r.examples,questions:a.questions+r.questions,supplements:a.supplements+r.supplements}),{examples:0,questions:0,supplements:0})},null,2));
