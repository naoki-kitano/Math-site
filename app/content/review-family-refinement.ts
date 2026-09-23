import {type Bank,type Q,skill} from "./matha-authoring";
import type {Exercise,Lesson} from "./lessons";
export const legacyReviewGroups=new Map<string,string>();
export const preferredReviewIds=new Set<string>();

// Keep existing question IDs, prompts and answers. Refine only their review
// decisions; new alternate questions receive new IDs. Old backups remain valid.
export function refineFamily(bank:Bank,chapter:{lessons:Lesson[];exercises:Exercise[]},oldFamily:string,parts:{id:string;title:string;why:string;keys:number[];sample:Q;items:Q[]}[]){
 const oldSkills=bank.skills.find(s=>s.id===oldFamily)!;
 const check=chapter.lessons.find(l=>l.practiceGroups)!;
 const chapterFamily=bank.lesson.slug+"-"+oldFamily;
 const group=check.practiceGroups!.find(g=>g.exerciseIds.some(id=>chapter.exercises.some(e=>e.id===id&&e.family===chapterFamily)))!;
 const oldQuestions=bank.exercises.filter(e=>e.family===oldFamily);
 const example=bank.lesson.examples.find(e=>e.id===oldFamily);
 if(example){const part=parts[0];example.title=part.title;example.prompt=part.sample.prompt;example.steps=[{title:"まず考えること",text:part.why},{title:"順に進める",text:part.sample.working},{title:"答えと確認",text:part.sample.answer}];}
 for(const e of chapter.exercises.filter(e=>e.lesson===bank.lesson.slug&&e.family===oldFamily||e.lesson===check.slug&&e.family===chapterFamily)){
  legacyReviewGroups.set(e.id,e.lesson+":"+e.family);
 }
 for(const part of parts){
  const s=skill(part.id,part.title,part.why,part.sample,part.items);
  bank.skills.push(s);
  const repair={id:part.id,title:part.title,text:[part.why,part.sample.prompt,part.sample.working,part.sample.answer].join("\n"),tex:"",check:part.items[0].prompt,answer:part.items[0].working+"\n"+part.items[0].answer};
  bank.lesson.supplements.push(repair);
  const family=bank.lesson.slug+"-"+part.id;
  check.supplements.push({...repair,id:family,title:bank.lesson.title+"："+part.title});
  for(const key of part.keys){
   const old=oldQuestions.find(e=>e.id===`${bank.lesson.slug}-${oldFamily}-${key}-v1`);
   if(!old)throw Error("Missing legacy review question "+key);
   old.family=part.id;old.repair=part.id;
   for(const e of chapter.exercises.filter(e=>e.lesson===check.slug&&e.family===chapterFamily&&e.id===`${check.slug}-${chapterFamily}-${key}-v1`)){e.family=family;e.repair=family;}
  }
  part.items.forEach((item,i)=>{
   const e:Exercise={id:`${bank.lesson.slug}-${part.id}-new-${i+1}-v1`,lesson:bank.lesson.slug,family:part.id,repair:part.id,stage:i===0?"practice":"review",kind:"paper",prompt:item.prompt,answer:item.answer,hints:[item.hint],steps:[{title:"考えて進める",text:item.working},{title:"答えと確認",text:item.answer}]};
   bank.exercises.push(e);chapter.exercises.push(e);
   const copy={...e,id:check.slug+"-"+e.id,lesson:check.slug,family,repair:family};
   chapter.exercises.push(copy);
   if(copy.stage==="practice")group.exerciseIds.push(copy.id);
  });
 }
 if(oldQuestions.some(e=>e.family===oldFamily))throw Error("Unassigned review decision "+oldFamily);
 bank.skills.splice(bank.skills.indexOf(oldSkills),1);
 bank.lesson.supplements=bank.lesson.supplements.filter(s=>s.id!==oldFamily);
 check.supplements=check.supplements.filter(s=>s.id!==chapterFamily);
}

export function varyPractice(bank:Bank,chapter:{lessons:Lesson[];exercises:Exercise[]},family:string,items:Q[]){
 const check=chapter.lessons.find(l=>l.practiceGroups)!;
 const cf=bank.lesson.slug+"-"+family;
 const group=check.practiceGroups!.find(g=>g.exerciseIds.some(id=>chapter.exercises.some(e=>e.id===id&&e.family===cf)))!;
 for(const e of chapter.exercises){
  if((e.lesson===bank.lesson.slug&&e.family===family||e.lesson===check.slug&&e.family===cf)&&e.stage==="practice"){
   e.stage="review";
   group.exerciseIds=group.exerciseIds.filter(id=>id!==e.id);
  }
 }
 items.forEach((x,i)=>{
  const e:Exercise={id:`${bank.lesson.slug}-${family}-varied-${i+1}-v1`,lesson:bank.lesson.slug,family,repair:family,stage:i<items.length-2?"practice":"review",kind:"paper",prompt:x.prompt,answer:x.answer,hints:[x.hint],steps:[{title:"考えて進める",text:x.working},{title:"答えと確認",text:x.answer}]};
  bank.exercises.push(e);chapter.exercises.push(e);
  const copy={...e,id:check.slug+"-"+e.id,lesson:check.slug,family:cf,repair:cf};
  preferredReviewIds.add(e.id);preferredReviewIds.add(copy.id);
  chapter.exercises.push(copy);
  if(copy.stage==="practice")group.exerciseIds.push(copy.id);
 });
}
