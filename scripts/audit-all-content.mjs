import {mkdir,writeFile} from 'node:fs/promises';
import {loadContent} from './content-module.mjs';
const {lessons,exercises}=await loadContent('lessons');
const byLesson=new Map(lessons.map(l=>[l.slug,exercises.filter(q=>q.lesson===l.slug)]));
const findings=[];
for(const l of lessons){
 if(!l.basicsTitle)findings.push({slug:l.slug,kind:'fallback-heading',title:l.title});
 if(l.title.length>26)findings.push({slug:l.slug,kind:'long-title',title:l.title});
 if(l.supplements.length>12)findings.push({slug:l.slug,kind:'large-help-list',count:l.supplements.length});
 const scan=(obj,path)=>{
  if(typeof obj==='string'){
   const prose=obj.replace(/\$[^$]*\$/g,'');
   if(/MODULE|モジュール|テンプレート|設計意図|製作|制作方針|学習システム|ファミリー|足場|足場掛け/.test(prose))findings.push({slug:l.slug,kind:'author-language',path,text:obj});
   if([...obj].some(c=>c.charCodeAt(0)<32&&c!=='\n'&&c!=='\r'))findings.push({slug:l.slug,kind:'control-character',path});
  }else if(Array.isArray(obj))obj.forEach((x,i)=>scan(x,path+'.'+i));
  else if(obj&&typeof obj==='object')Object.entries(obj).forEach(([k,v])=>scan(v,path+'.'+k));
 };
 scan(l,'lesson');scan(byLesson.get(l.slug),'questions');
}
const inventory=lessons.map(l=>({slug:l.slug,subject:l.subject??'数学II',title:l.title,description:l.description,chapter:l.chapter,examples:l.examples.length,questions:byLesson.get(l.slug).length,repairs:l.supplements.length,prerequisites:l.prerequisites??[]}));
await mkdir('outputs/site-audit',{recursive:true});
await writeFile('outputs/site-audit/inventory.json',JSON.stringify(inventory,null,2));
await writeFile('outputs/site-audit/content-findings.json',JSON.stringify(findings,null,2));
console.log(JSON.stringify({lessons:lessons.length,questions:exercises.length,byKind:Object.fromEntries([...new Set(findings.map(f=>f.kind))].map(k=>[k,findings.filter(f=>f.kind===k).length])),findings:findings.filter(f=>f.kind!=='large-help-list')}));
