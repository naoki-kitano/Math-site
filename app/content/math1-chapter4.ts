import {trigFoundationTopics} from "./math1-trig-foundations";
import {trigExtensionTopics} from "./math1-trig-extension";
import {triangleLawTopics} from "./math1-triangle-laws";
import {triangleChoice} from "./math1-triangle-choice";
import {trigApplicationTopics} from "./math1-trig-applications";
import type {Exercise,Lesson} from "./lessons";
export const math1Chapter4Topics=[...trigFoundationTopics,...trigExtensionTopics,...triangleLawTopics,triangleChoice,...trigApplicationTopics];
const slug="m1-trigonometry-check",titles=["辺と角・三角比","定理の選択と計算","面積・測量・断面"];
const groupOf=(i:number)=>i<7?0:i<12?1:2;
// Explicit coverage keys: include boundary, sign, inverse, units and all-candidate decisions in the practice body.
export const trigCheckSelection:Record<string,string[]>={
 "side-roles":["2","3","6"],pythagoras:["1","2"],
 "trig-ratios":["2","3","4"],"similarity-ratio":["2","3"],
 "special-ratio":["2","3","4","5","6","7","8"],"derive-special":["2","3"],
 "side-from-angle":["1","2","3","4","5","6","7","8"],"angle-from-ratio":["2","3","4"],"trig-approximation":["extra-1","extra-2"],
 "coordinate-ratios":["1","2","4"],"endpoint-ratios":["1","2","3","5","6","7"],
 "endpoint-tangent-domain":["@endpoint-ratios-4","@endpoint-ratios-8","@endpoint-ratios-9"],
 "recover-cosine":["1","2","4"],"complement-ratio":["1","2","4"],"supplement-ratio":["1","2","3"],"identity-domain":["extra-1","extra-2"],
 "recover-sine":["extra-1","extra-2"],"tangent-squared":["extra-1","extra-2"],
 "sine-all-angles":["1","2","3"],"cosine-unique":["1","2","3","4"],
 "unit-sine-angle":["@sine-all-angles-4","extra-1"],"zero-sine-endpoints":["@sine-all-angles-5","@sine-all-angles-6"],
 "sine-pairing":["2","3"],"sine-side":["2","4","5","7"],"circumradius":["1","2","3","4"],"radius-to-chord":["1","2","3"],
 "cosine-setup":["1","2"],"cosine-side":["1","2","3","4"],"cosine-angle-type":["1","2","3"],"cosine-exact-angle":["1","2","3"],
 "choose-triangle-method":["2","3","4","5","6","7","8"],"ssa-candidates":["1","2","3","4"],"ssa-impossible":["extra-1","extra-2","possible-1","possible-2"],"triangle-length-condition":["extra-1","extra-2"],
 "ssa-right-candidate":["@ssa-candidates-5","@ssa-candidates-6"],"ssa-angle-feasibility":["extra-1","extra-2"],
 "triangle-area":["1","2","3","4","5"],"height-and-area":["1","2","3"],"area-angle-choice":["extra-1","extra-2"],
 "survey-height":["1","2","3"],"survey-triangle":["1","2","4"],"split-plane-area":["1","2"],
 "cuboid-section":["2","3"],"pyramid-section":["1","2"],"line-plane-angle":["extra-1","extra-2"],
 "angle-sum":["2","3"],"positive-length":["2","3"],"reduce-ratio":["2","3"],"solve-ratio":["2","3"],
};
export const math1TrigCoverage:{lesson:string;family:string;checkFamily:string;sourceIds:string[]}[]=[];
export const math1TrigCheckExercises:Exercise[]=[];
const supplements:Lesson["supplements"]=[],seen=new Map<string,string>();
const groups=titles.map((title,i)=>({id:`part-${i+1}`,title,exerciseIds:[] as string[]}));
// Review-only: two repeated prerequisites and one extra valid SSA case. The same SSA decision remains in practice.
const reviewOnly=new Set(["m1-right-triangle-angle-sum-3-v1","m1-right-triangle-positive-length-3-v1","m1-triangle-choice-ssa-impossible-possible-2-v1"]);
math1Chapter4Topics.forEach(({lesson,exercises},i)=>{
 lesson.section=titles[groupOf(i)];
 for(const family of new Set(exercises.map(e=>e.family))){
  const keys=trigCheckSelection[family];if(!keys||keys.length<2)throw new Error("Uncovered trig family "+family);
  const selected=keys.map(key=>{
   const e=exercises.find(e=>e.id===`${lesson.slug}-${key.startsWith("@")?key.slice(1):family+"-"+key}-v1`);
   if(!e)throw new Error("Missing trig selection "+lesson.slug+"/"+family+"/"+key);return e;
  });
  const fingerprint=JSON.stringify(selected.map(e=>[e.prompt,e.answer,e.hints,e.steps]));
  const checkFamily=seen.get(fingerprint)??`${lesson.slug}-${family}`;
  math1TrigCoverage.push({lesson:lesson.slug,family,checkFamily,sourceIds:selected.map(e=>e.id)});
  if(seen.has(fingerprint))continue;seen.set(fingerprint,checkFamily);
  const repair=lesson.supplements.find(s=>s.id===family)!;
  supplements.push({...repair,id:checkFamily,title:lesson.title+"："+repair.title});
  selected.forEach((e,n)=>{
   const id=`${slug}-${checkFamily}-${n+1}-v1`,stage=reviewOnly.has(e.id)?"review":"practice";
   math1TrigCheckExercises.push({...e,id,lesson:slug,stage,family:checkFamily,repair:checkFamily});
   if(stage==="practice")groups[groupOf(i)].exerciseIds.push(id);
  });
 }
});
function copy(e:Exercise,stage:"ready"|"guided",key:string){
 const c=math1TrigCoverage.find(c=>c.lesson===e.lesson&&c.family===e.family)!;
 const id=`${slug}-${stage}-${key}-v1`;
 math1TrigCheckExercises.push({...e,id,lesson:slug,stage,family:c.checkFamily,repair:c.checkFamily});return id;
}
math1Chapter4Topics[0].exercises.filter(e=>e.stage==="ready").forEach((e,i)=>copy(e,"ready",String(i+1)));
const examples=[{bank:triangleChoice,index:0},{bank:trigApplicationTopics[2],index:0}].map(({bank,index},n)=>{
 const e=bank.lesson.examples[index],q=bank.exercises.find(q=>q.id===e.guidedIds[0])!;
 return {...e,id:`example-${n+1}`,guidedIds:[copy(q,"guided",String(n+1))]};
});
export const math1TrigCheckLesson:Lesson={slug,title:"図形と計量の章末確認",chapter:"図形と計量",subject:"数学I",section:"章末確認",basicsTitle:"角・辺・図を結び付ける",description:"分かっている量を図へ写し、必要な比や定理を選ぼう。",introduction:["角に着目して、向かいの辺とはさむ二辺を区別します。角の範囲が変われば、三角比の符号や角の候補も変わります。","求めるものが辺・角・面積のどれかを確かめ、使える条件から方法を選びます。最後に三角形の成立、角の全候補、長さや面積の単位を確かめます。"],rule:"図と条件を対応させ、答えを元の問いに戻して確認します。",examples,guidedAfterExamples:true,supplements,practiceGroups:groups};
export const math1Chapter4Lessons=[...math1Chapter4Topics.map(t=>t.lesson),math1TrigCheckLesson];
export const math1Chapter4Exercises=[...math1Chapter4Topics.flatMap(t=>t.exercises),...math1TrigCheckExercises];
