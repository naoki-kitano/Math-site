import {readFileSync} from 'node:fs';
import ts from 'typescript';
const cache=new Map();
export function contentModule(file){
 if(cache.has(file.href))return cache.get(file.href);
 const source=file.pathname.endsWith('.json')?'export default '+readFileSync(file,'utf8'):ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 const js=source.replace(/from\s+["'](\.\.?\/[^"']+)["']/g,(_,p)=>'from '+JSON.stringify(contentModule(new URL(/\.(ts|json)$/.test(p)?p:p+'.ts',file))));
 const url='data:text/javascript;base64,'+Buffer.from(js).toString('base64');cache.set(file.href,url);return url;
}
export const loadContent=async name=>import(contentModule(new URL('../app/content/'+name+'.ts',import.meta.url)));
