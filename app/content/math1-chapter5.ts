import {dataDistributionTopics} from "./math1-data-distributions";
import {dataSpreadTopics} from "./math1-data-spread";
import {dataRelationshipTopics} from "./math1-data-relationships";
import {dataInferenceTopics} from "./math1-data-inference";
import type {Exercise,Lesson} from "./lessons";
export const math1Chapter5Topics=[...dataDistributionTopics,...dataSpreadTopics,...dataRelationshipTopics,...dataInferenceTopics];
const slug="m1-data-analysis-check";
const titles=["分布を読む","代表値と散らばり","二つの変量の関係","仮定の下で判断する"];
const groupOf=(i:number)=>i===2||i>=5&&i<=8?1:i<5?0:i<12?2:3;
// Explicit coverage, not the first few questions of an array. @ retains pre-split IDs.
export const dataCheckSelection:Record<string,string[]>={
 "record-unit":["2","5"],"survey-scope":["2","3","4"],"class-frequency":["2","5"],"class-mean":["2","5"],
 "draw-histogram":["one","two"],"draw-boxplot":["one","two"],
 "arithmetic-mean":["2","4"],median:["2","3","5"],mode:["2","5"],"pooled-mean":["2","5"],
 quartiles:["2","4","5"],"range-iqr":["2","4"],
 "compare-distributions":["2","5"],"range-versus-iqr":["@compare-distributions-3","@compare-distributions-6"],
 "iqr-from-quartiles":["@compare-distributions-4","extra"],
 "boxplot-limits":["2","3","6"],"box-width-not-count":["@boxplot-limits-1","@boxplot-limits-5"],
 "median-ties":["@boxplot-limits-4","extra"],"outlier-treatment":["1","6"],"correct-record":["@outlier-treatment-2","@outlier-treatment-5"],
 "outlier-population":["@outlier-treatment-3","extra"],"outlier-summary":["@outlier-treatment-4","extra"],
 deviation:["2","4","6"],"deviation-variance":["2","3","5"],
 "standard-deviation":["2","3","5"],"compare-sd":["2","4","5"],"zero-spread":["2","3","5"],
 "variance-moments":["2","3","5"],"variance-shift-method":["2","5"],
 "variance-method-choice":["1","2","3","4"],
 "transformed-mean":["2","3","4","5"],"transformed-spread":["1","2","3","4","5"],
 "paired-points":["2","5"],"scatter-direction":["2","5"],
 "correlation-calculation":["2","3","4","5"],"correlation-domain":["2","3","5","6"],
 "correlation-strength":["2","3","5"],"zero-correlation-limits":["2","5"],
 "correlation-not-cause":["2","5"],"fair-comparison":["2","3","5"],
 "randomized-uncertainty":["@fair-comparison-6","extra"],
 "simulation-tail":["2","3","5"],"simulation-decision":["2","3","5","6"],
 "independence-check":["@inference-design-1","extra","second"],
 "conditional-probability-meaning":["@inference-design-2","@inference-design-5"],
 "nonrejection-limits":["@inference-design-3","@inference-design-6"],
 "predeclared-rule":["@inference-design-4","extra"],
 "mean-not-everyone":["@data-conclusion-1","@data-conclusion-6","extra"],
 "conclusion-scope":["@data-conclusion-2","extra"],
 "tail-information":["@data-conclusion-3","extra"],
 "causal-conclusion":["@data-conclusion-4","extra"],
 "median-not-distribution":["@data-conclusion-5","extra"],
 "data-count":["2","3"],"data-order":["2","3"],
};
export const math1DataCoverage:{lesson:string;family:string;checkFamily:string;sourceIds:string[]}[]=[];
export const math1DataCheckExercises:Exercise[]=[];
const supplements:Lesson["supplements"]=[],seen=new Map<string,string>();
const groups=titles.map((title,i)=>({id:`part-${i+1}`,title,exerciseIds:[] as string[]}));
math1Chapter5Topics.forEach(({lesson,exercises},i)=>{
 lesson.section=titles[groupOf(i)];
 for(const family of new Set(exercises.map(e=>e.family))){
  const keys=dataCheckSelection[family];if(!keys||keys.length<2)throw new Error("Uncovered data decision "+family);
  const selected=keys.map(key=>{
   const e=exercises.find(e=>e.id===`${lesson.slug}-${key.startsWith("@")?key.slice(1):family+"-"+key}-v1`);
   if(!e||e.family!==family)throw new Error("Missing data selection "+lesson.slug+"/"+family+"/"+key);return e;
  });
  const fingerprint=JSON.stringify(selected.map(e=>[e.prompt,e.answer,e.hints,e.steps]));
  const checkFamily=seen.get(fingerprint)??`${lesson.slug}-${family}`;
  math1DataCoverage.push({lesson:lesson.slug,family,checkFamily,sourceIds:selected.map(e=>e.id)});
  if(seen.has(fingerprint))continue;seen.set(fingerprint,checkFamily);
  const repair=lesson.supplements.find(s=>s.id===family);
  if(!repair)throw new Error("Missing data supplement "+family);
  supplements.push({...repair,id:checkFamily,title:lesson.title+"："+repair.title});
  selected.forEach((e,n)=>{
   const id=`${slug}-${checkFamily}-${n+1}-v1`;
   math1DataCheckExercises.push({...e,id,lesson:slug,stage:"practice",family:checkFamily,repair:checkFamily});
   groups[groupOf(i)].exerciseIds.push(id);
  });
 }
});
function copy(e:Exercise,stage:"ready"|"guided",key:string){
 const c=math1DataCoverage.find(c=>c.lesson===e.lesson&&c.family===e.family)!;
 const id=`${slug}-${stage}-${key}-v1`;
 math1DataCheckExercises.push({...e,id,lesson:slug,stage,family:c.checkFamily,repair:c.checkFamily});return id;
}
math1Chapter5Topics[0].exercises.filter(e=>e.stage==="ready").forEach((e,i)=>copy(e,"ready",String(i+1)));
for(const [family,key,prompt,answer,hint,working] of [
 ["data-count","count","$1,1,2,2,3,4,4$ の記録は何個ですか。","$7$ 個。","同じ値も別の記録として数えます。","値の種類ではなく、並んでいる記録を数えると $7$ 個です。"],
 ["data-order","order","$6,2,4,2,1$ を小さい順に並べなさい。","$1,2,2,4,6$。","同じ値を消さずに並べます。","$1$ が最小、次が二つの $2$、その後に $4,6$ と続きます。"],
 ]){
 const repair=math1DataCoverage.find(c=>c.family===family)!.checkFamily;
 math1DataCheckExercises.push({id:`${slug}-review-${key}-v1`,lesson:slug,stage:"review",family:repair,repair,kind:"paper",prompt,answer,hints:[hint],steps:[{title:"考えて進める",text:working}]});
}
const examples=[dataSpreadTopics[0],dataRelationshipTopics[1]].map((bank,n)=>{
 const e=bank.lesson.examples[0],q=bank.exercises.find(q=>q.id===e.guidedIds[0])!;
 return {...e,id:`example-${n+1}`,guidedIds:[copy(q,"guided",String(n+1))]};
});
export const math1DataCheckLesson:Lesson={slug,title:"データの分析の章末確認",chapter:"データの分析",subject:"数学I",section:"章末確認",basicsTitle:"数値を結論につなげる",description:"対象・分布・指標・仮定を確かめ、根拠に合う結論を述べよう。",introduction:["何のデータかを確かめ、知りたいことに合う図や指標を選びます。中心と散らばり、関連と原因は別のものです。","仮定の下での珍しさを調べても、仮定が真である確率や、その正しさの証明にはなりません。このページの調査・数値は教材用の仮想データです。"],rule:"計算だけで終わらず、その結果が何を表すか、どこまで言えるかを確かめます。",examples,guidedAfterExamples:true,supplements,practiceGroups:groups};
export const math1Chapter5Lessons=[...math1Chapter5Topics.map(t=>t.lesson),math1DataCheckLesson];
export const math1Chapter5Exercises=[...math1Chapter5Topics.flatMap(t=>t.exercises),...math1DataCheckExercises];
