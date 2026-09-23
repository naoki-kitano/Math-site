import {loadContent} from './content-module.mjs';
const {lessons,exercises}=await loadContent('lessons');
const [filter='',mode='families']=process.argv.slice(2);
for(const l of lessons.filter(l=>(l.subject??'数学II')===filter||l.slug===filter||(!filter&&!l.practiceGroups))){
 const qs=exercises.filter(q=>q.lesson===l.slug&&q.stage!=='ready');
 if(mode==='questions'){
  for(const q of qs)console.log(JSON.stringify({id:q.id,f:q.family,p:q.prompt,t:q.tex,a:q.answer,h:q.hints,s:q.steps,r:q.repair}));
 }else if(mode==='repairs'){
  console.log(l.slug,l.title);
  for(const r of l.supplements)console.log(JSON.stringify(r));
 }else if(!l.practiceGroups&&!l.title.includes('章末')){
  console.log(l.slug+' | '+l.title+' | '+[...new Set(qs.filter(q=>q.stage==='practice').map(q=>q.family))].join(','));
 }
}
