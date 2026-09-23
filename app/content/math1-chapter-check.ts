import {math1Chapter1Drafts as drafts} from "./math1-chapter1";
import type {Exercise,Lesson} from "./lessons";
import {math1CheckSelection,math1SharedCheckSelection} from "./math1-check-selection";

const slug="m1-number-expression-check";
const sections=["式を読む・代入","展開・因数分解","平方根・絶対値","不等式・立式"];
const sectionAt=(i:number)=>i<4?0:i<9?1:i<13?2:3;
export const math1CheckExercises:Exercise[]=[];
const supplements:Lesson["supplements"]=[];
const groups=sections.map((title,i)=>({id:`part-${i+1}`,title,exerciseIds:[] as string[]}));
const aliases=new Map<string,string>();
const seen=new Map<string,string>();
export const math1CheckCoverage:{lesson:string;family:string;checkFamily:string}[]=[];
// Explicit skill coverage: every decision appears. Identical prerequisite banks
// shared by several lessons are represented once, not repeated as a long test.
drafts.forEach(({lesson,exercises},i)=>{
  lesson.section=sections[sectionAt(i)];
  for(const family of new Set(exercises.map(e=>e.family))) {
    const candidates=exercises.filter(e=>e.family===family&&(e.stage==="practice"||e.stage==="review"));
    const fingerprint=JSON.stringify(candidates.map(e=>[e.prompt,e.answer,e.hints,e.steps]));
    const key=seen.get(fingerprint)??`${lesson.slug}-${family}`;
    aliases.set(`${lesson.slug}|${family}`,key);
    math1CheckCoverage.push({lesson:lesson.slug,family,checkFamily:key});
    if(seen.has(fingerprint))continue;
    seen.set(fingerprint,key);
    if(candidates.length<2)throw new Error(`Missing chapter-check alternate: ${key}`);
    const selected=math1CheckSelection[lesson.slug]?.[family]??math1SharedCheckSelection[family];
    if(!selected||selected.length<2)throw new Error(`Missing explicit chapter selection: ${key}`);
    for(const [n,source] of selected.entries()) {
      const stage=n===1?"review":"practice";
      const e=candidates.find(q=>q.id===`${lesson.slug}-${source}-v1`);
      if(!e)throw new Error(`Invalid chapter source: ${lesson.slug}/${source}`);
      const id=`${slug}-${stage}-${key}${n>1?`-form-${n}`:""}-v1`;
      math1CheckExercises.push({...e,id,lesson:slug,family:key,repair:key,stage:stage as Exercise["stage"]});
      if(stage==="practice")groups[sectionAt(i)].exerciseIds.push(id);
    }
    const original=lesson.supplements.find(s=>s.id===candidates[0].repair);
    if(!original)throw new Error(`Missing repair: ${key}`);
    supplements.push({...original,id:key,title:lesson.title+"："+original.title});
  }
});
const copy=(e:Exercise,stage:"ready"|"guided",key:string)=>{
  const family=aliases.get(`${e.lesson}|${e.family}`);
  if(!family)throw new Error(`Missing coverage: ${e.id}`);
  const id=`${slug}-${stage}-${key}-v1`;
  math1CheckExercises.push({...e,id,lesson:slug,stage,family,repair:family});
  return id;
};
drafts[0].exercises.filter(e=>e.stage==="ready").forEach((e,i)=>copy(e,"ready",String(i+1)));
const examples=[drafts[1],drafts[6]].map((d,i)=>{
  const original=d.lesson.examples[0];
  const guided=d.exercises.find(e=>e.id===original.guidedIds[0]);
  if(!guided)throw new Error("Missing guided example");
  return {...original,id:`example-${i+1}`,guidedIds:[copy(guided,"guided",String(i+1))]};
});
export const math1CheckLesson:Lesson={slug,title:"数と式の章末確認",subject:"数学I",chapter:"数と式",section:"章末確認",
  description:"式の形と条件を見て、必要な計算を選ぼう。",basicsTitle:"式の形と条件を確かめる",
  introduction:["式の値を求めるときは代入、積を和へ直すときは展開、和を積へ直すときは因数分解です。何を求める問いかを最初に確かめます。","平方根では非負の値と正負の平方根を区別します。不等式では負の数で割るときの向きと、端の値を含むかを確かめます。"],
  rule:"答えを元の式や数量の条件に戻して確かめましょう。",examples,guidedAfterExamples:true,supplements,practiceGroups:groups,
};
