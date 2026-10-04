import {workedText} from "./worked-text";
import type {Exercise,Lesson} from "./lessons";
import type {Q,Skill} from "./matha-counting-authoring";
export {m,q,skill,comb} from "./matha-counting-authoring";
export type {Q,Skill};
export const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
export const f=(a:number,b=1)=>{if(!b)throw new Error("zero denominator");if(b<0){a=-a;b=-b;}const d=gcd(a,b);a/=d;b/=d;return b===1?String(a):`${a<0?"-":""}\\frac{${Math.abs(a)}}{${b}}`;};
export const range=(n:number,start=0)=>Array.from({length:n},(_,i)=>i+start);
export type Bank={lesson:Lesson;exercises:Exercise[];skills:Skill[]};
export function addRepairExample(banks:Bank[],slug:string,family:string,example:Q){
 const help=banks.find(b=>b.lesson.slug===slug)?.lesson.supplements.find(h=>h.id===family);
 if(!help)throw Error("Missing repair example "+slug+family);
 help.text+="\n別の条件でも確かめる\n"+example.prompt+"\n"+workedText(example.working,example.answer);
}
export function topic(chapter:string,slug:string,title:string,description:string,introduction:string[],rule:string,skills:Skill[],prep:Skill[],section:string):Bank{
 const exercises:Exercise[]=[];
 const add=(s:Skill,x:Q,i:number,stage:Exercise["stage"])=>{
  exercises.push({id:`${slug}-${s.id}-${i+1}-v1`,lesson:slug,family:s.id,repair:s.id,stage,kind:"paper",prompt:x.prompt,answer:x.answer,hints:[x.hint],steps:[{title:s.title,text:x.working},{title:"答え",text:x.answer}]});
 };
 for(const s of skills){if(s.items.length<4)throw Error("Missing practice "+slug+s.id);s.items.forEach((x,i)=>add(s,x,i,i===0?"guided":i>=s.items.length-2?"review":"practice"));}
 for(const s of prep)s.items.forEach((x,i)=>add(s,x,i,i===0?"ready":"review"));
 // Interleave independent practice so adjacent questions do not give away the method.
 // IDs and all explicit example-to-guided mappings remain unchanged.
 const queues=skills.map(s=>exercises.filter(e=>e.stage==="practice"&&e.family===s.id));
 const mixed:Exercise[]=[];
 for(let i=0;i<Math.max(...queues.map(q=>q.length));i++)for(const queue of queues)if(queue[i])mixed.push(queue[i]);
 const firstPractice=exercises.findIndex(e=>e.stage==="practice");
 const other=exercises.filter(e=>e.stage!=="practice");
 if(firstPractice>=0){other.splice(Math.min(firstPractice,other.length),0,...mixed);exercises.splice(0,exercises.length,...other);}
 return {skills,exercises,lesson:{slug,title,subject:"数学A",chapter,section,description,introduction,rule,basicsTitle:title,guidedAfterExamples:true,
  examples:skills.map(s=>({id:s.id,title:s.title,prompt:s.sample.prompt,guidedIds:[`${slug}-${s.id}-1-v1`],steps:[{title:"",text:s.sample.hint},{title:s.title,text:s.sample.working},{title:"答え",text:s.sample.answer}]})),
  supplements:[...skills,...prep].map(s=>({id:s.id,title:s.title,text:workedText(s.why,s.sample.prompt,s.sample.working,s.sample.answer),tex:"",check:s.items[0].prompt,answer:workedText(s.items[0].working,s.items[0].answer)}))}};
}
// Explicit family coverage: one practice and two distinct review questions per decision.
// All supplied selections are IDs within that family, not the order of lesson cards.
export function chapterCheck(chapter:string,slug:string,banks:Bank[],sections:string[],selection:Record<string,number[]>={}):Bank{
 const exercises:Exercise[]=[],supplements:Lesson["supplements"]=[];
 const practiceGroups=sections.map((title,i)=>({id:`part-${i+1}`,title,exerciseIds:[] as string[]}));
 for(const b of banks)for(const s of b.skills){
  const family=`${b.lesson.slug}-${s.id}`,keys=selection[family]??[2,3,s.items.length-1,s.items.length];
  const unique=[...new Set(keys)];
  if(unique.length<3)throw Error("Insufficient chapter alternates "+family);
  const source=b.lesson.supplements.find(h=>h.id===s.id)!;
  supplements.push({...source,id:family,title:b.lesson.title+"："+source.title});
  unique.forEach((key,i)=>{
   const e=b.exercises.find(e=>e.id===`${b.lesson.slug}-${s.id}-${key}-v1`)!;
   if(!e)throw Error("Missing selected item "+family+key);
   const id=`${slug}-${family}-${key}-v1`,stage=i<unique.length-2?"practice":"review";
   exercises.push({...e,id,lesson:slug,family,repair:family,stage});
   if(stage==="practice")practiceGroups[sections.indexOf(b.lesson.section!)].exerciseIds.push(id);
  });
 }
 const first=banks[0],skills=first.skills.slice(0,2);
 for(const [i,s] of skills.entries()){
  const family=`${first.lesson.slug}-${s.id}`;
  for(const [stage,key] of [["ready",s.items.length],["guided",1]] as const){
   const e=first.exercises.find(e=>e.id===`${first.lesson.slug}-${s.id}-${key}-v1`)!;
   exercises.push({...e,id:`${slug}-${stage}-${i+1}-v1`,lesson:slug,family,repair:family,stage});
  }
 }
 return {skills:[],exercises,lesson:{slug,chapter,subject:"数学A",title:chapter+"の章末確認",description:"条件を読み取り、使う考え方と途中式を自分で書きます。",section:"章末確認",basicsTitle:"条件と理由を確かめる",introduction:["何が分かっているか、何を求めるかを先に整理します。","答えだけでなく、使った性質とその条件も確かめましょう。"],rule:"図や式に条件を書き込み、選んだ方法の理由を説明します。",guidedAfterExamples:true,
 examples:first.lesson.examples.slice(0,2).map((e,i)=>({...e,guidedIds:[`${slug}-guided-${i+1}-v1`]})),supplements,practiceGroups}};
}
