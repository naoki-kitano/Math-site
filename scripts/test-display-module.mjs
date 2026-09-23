// Unit-test loader for real React display components, with a shared content catalogue.
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
import {loadContent} from './content-module.mjs';
globalThis.__mathcanvasDiagnosticTestContent=await loadContent('lessons');
const url=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const content=url('export const {lessons,exercises,exerciseById}=globalThis.__mathcanvasDiagnosticTestContent;');
const cache=new Map();
function compile(file){
 if(file.href===new URL('../app/content/lessons.ts',import.meta.url).href)return content;
 if(cache.has(file.href))return cache.get(file.href);
 const js=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const result=url(js.replace(/from\s+["']([^"']+)["']/g,(_,p)=>{
  if(p==='./Practice')return 'from '+JSON.stringify(url('export const Practice=()=>null;'));
  return 'from '+JSON.stringify(p.startsWith('.')?compile(new URL(p+(existsSync(new URL(p+'.tsx',file))?'.tsx':'.ts'),file)):import.meta.resolve(p));
 }));
 cache.set(file.href,result);return result;
}
export const loadDisplay=async name=>import(compile(new URL('../app/components/'+name+'.tsx',import.meta.url)));
