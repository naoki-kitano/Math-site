import {mkdir,writeFile} from 'node:fs/promises';
import {loadContent} from './content-module.mjs';
const {lessons,exercises}=await loadContent('lessons');
const {subjectForChapter}=await loadContent('chapters');
const output=process.env.MATHCANVAS_CLARITY_OUTPUT??'outputs/clarity-overhaul';
await mkdir(output,{recursive:true});
const generic=/^(順に進める|考えて進める|まず考えること|考え方|途中式を書く|答えと確認|条件と使う方法|答えと条件を確かめる)$/;
const titles=new Map(),issues=[];
const rows=lessons.map(l=>{
 const genericSteps=l.examples.flatMap((e,i)=>e.steps.flatMap((s,j)=>{
  titles.set(s.title,(titles.get(s.title)??0)+1);
  return generic.test(s.title)?[{example:i,step:j,title:s.title}]:[];
 }));
 const fields=[];
 function walk(value,path){if(typeof value==='string')fields.push({path,text:value});else if(Array.isArray(value))value.forEach((v,i)=>walk(v,path+'.'+i));else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>walk(v,path+'.'+k));}
 walk({title:l.title,description:l.description,introduction:l.introduction,rule:l.rule,examples:l.examples,supplements:l.supplements},l.slug);
 for(const f of fields){if(/枝|順に進める|考えて進める|入力|処理|判定|手掛かり|順番に/.test(f.text))issues.push({slug:l.slug,...f});}
 return {slug:l.slug,subject:subjectForChapter(l.chapter),chapter:l.chapter,title:l.title,description:l.description,introduction:l.introduction,rule:l.rule,examples:l.examples,supplements:l.supplements,questions:exercises.filter(e=>e.lesson===l.slug),genericSteps};
});
for(const subject of new Set(rows.map(r=>r.subject)))await writeFile(output+'/'+subject+'.json',JSON.stringify(rows.filter(r=>r.subject===subject),null,2));
const report={lessons:rows.length,examples:rows.reduce((n,r)=>n+r.examples.length,0),questions:exercises.length,genericSteps:rows.reduce((n,r)=>n+r.genericSteps.length,0),frequentStepTitles:[...titles].sort((a,b)=>b[1]-a[1]).slice(0,35),issues};
await writeFile(output+'/audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,issues:report.issues.length},null,2));
