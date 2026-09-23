import {mkdir,writeFile} from 'node:fs/promises';
import {loadContent} from './content-module.mjs';
const {lessons,exercises}=await loadContent('lessons');
const {prerequisiteChecks}=await loadContent('prerequisite-checks');
const {allPrerequisitePlans,diagnosticPlan,targetPractice}=await loadContent('diagnostic-paths');
const errors=[];
for(const c of prerequisiteChecks){
 const l=lessons.find(l=>l.slug===c.lesson);
 if(!l?.supplements.some(s=>s.id===c.repair))errors.push(['target',c.id,c.lesson,c.repair,l?.supplements.map(s=>s.id)]);
 for(const id of [...c.requires,...Object.values(c.wrong??{}).flat()])if(!prerequisiteChecks.some(n=>n.id===id))errors.push(['child',c.id,id]);
}
for(const row of allPrerequisitePlans){
 for(const family of row.families)if(!exercises.some(q=>q.lesson===row.lesson&&q.family===family))errors.push(['family',row.lesson,family]);
 for(const id of row.checks)if(!prerequisiteChecks.some(n=>n.id===id))errors.push(['check',row.lesson,id]);
}
const visit=(c,path=[])=>{if(path.includes(c.id)){errors.push(['cycle',...path,c.id]);return;}for(const id of new Set([...c.requires,...Object.values(c.wrong??{}).flat()])){const n=prerequisiteChecks.find(n=>n.id===id);if(n)visit(n,[...path,c.id]);}};
for(const c of prerequisiteChecks)visit(c);
const rows=exercises.map(q=>{const p=diagnosticPlan(q);return {id:q.id,subject:lessons.find(l=>l.slug===q.lesson).subject??'数学II',lesson:q.lesson,family:q.family,repair:q.repair,stage:q.stage,scope:p.scope,source:p.sourceId,checks:p.checks.map(c=>c?.id),reason:p.reason};});
const groups=Object.groupBy(rows,r=>r.subject);
const summary={lessons:lessons.length,questions:rows.length,checks:prerequisiteChecks.length,rules:allPrerequisitePlans.length,bySubject:Object.fromEntries(Object.entries(groups).map(([k,v])=>[k,{total:v.length,linked:v.filter(r=>r.checks.length).length,explicitLocal:v.filter(r=>!r.checks.length&&r.scope!=='local').length,localRepair:v.filter(r=>r.scope==='local').length}])),errors};
await mkdir('outputs/prerequisites',{recursive:true});
await writeFile('outputs/prerequisites/coverage.json',JSON.stringify({summary,rows},null,2));
await writeFile('outputs/prerequisites/targets.json',JSON.stringify(prerequisiteChecks.map(c=>({...c,practice:targetPractice(c).map(q=>q.id)})),null,2));
console.log(JSON.stringify(summary,null,2));
if(errors.length)process.exitCode=1;
