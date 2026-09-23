import {sets,operations,inclusion} from "./math1-logic-sets";
import {truth,necessary} from "./math1-logic-statements";
import {negation,contrapositive} from "./math1-logic-negation";
import {direct,contraProof,contradiction} from "./math1-logic-proofs";
import {rootMeaning} from "./math1-roots";
import type {Exercise,Lesson} from "./lessons";
import {applyLogicRefinements} from "./math1-logic-refinements";
applyLogicRefinements();
export const math1Chapter2Topics=[sets,operations,truth,inclusion,necessary,negation,contrapositive,direct,contraProof,contradiction];
rootMeaning.lesson.prerequisites=[{slug:"m1-proof-contradiction",label:"平方根の無理数性の証明（第2章）"}];
direct.lesson.prerequisites=[{slug:"m1-distributive-expansion",label:"分配法則と展開"}];
contraProof.lesson.prerequisites=[{slug:"m1-converse-contrapositive",label:"逆・裏・対偶"},{slug:"m1-direct-proof",label:"文字による説明と証明"}];
contradiction.lesson.prerequisites=[{slug:"m1-square-roots",label:"平方根と根号の意味"},{slug:"m1-proof-contrapositive",label:"対偶による証明"}];
const sectionTitles=["集合","命題の判断","条件と否定","証明"];
const sectionOf=(i:number)=>i<2?0:i===2?1:i<7?2:3;
const selections:Record<string,Record<string,string[]>>={
 "m1-sets-elements":{membership:["membership-2","membership-5"],listing:["listing-2","listing-5","listing-3"],"object-kind":["object-kind-extra-1","object-kind-extra-2"],"empty-zero":["empty-zero-extra-1","empty-zero-extra-2"]},
 "m1-set-operations":{intersection:["intersection-2","intersection-6","intersection-3"],union:["union-3","union-6"],complement:["complement-4","complement-6","complement-5"]},
 "m1-statements-counterexamples":{"true-reason":["true-reason-2","true-reason-6"],counterexample:["counterexample-2","counterexample-6","counterexample-5","counterexample-4"],"truth-choice":["truth-choice-new-1","truth-choice-new-3","truth-choice-new-2"],"counter-candidate":["counter-candidate-new-1","counter-candidate-new-3","counter-candidate-new-2"]},
 "m1-condition-inclusion":{subset:["subset-3","subset-5"],"condition-range":["condition-range-3","condition-range-5"],"subset-counter":["subset-2","subset-6"],"empty-subset":["empty-subset-extra-1","empty-subset-extra-2"],"range-counter":["range-counter-extra-1","range-counter-extra-2"]},
 "m1-necessary-sufficient":{"direction-name":["direction-name-4","direction-name-5"],"classify-conditions":["classify-conditions-2","classify-conditions-5","classify-conditions-3","classify-conditions-4","classify-conditions-new-1"]},
 "m1-condition-negation":{boundary:["boundary-2","boundary-6","boundary-4","boundary-3","boundary-5"],compound:["compound-2","compound-6","compound-3"],quantifier:["quantifier-2","quantifier-6","quantifier-4"]},
 "m1-converse-contrapositive":{transform:["transform-3","transform-6"],"truth-pair":["truth-pair-2","truth-pair-6","truth-pair-3"]},
 "m1-direct-proof":{"parity-algebra":["parity-algebra-2","parity-algebra-6","parity-algebra-4"],consecutive:["consecutive-2","consecutive-6","consecutive-3"],"parity-plan":["parity-plan-new-1","parity-plan-new-2"],"consecutive-plan":["consecutive-plan-new-1","consecutive-plan-new-2"]},
 "m1-proof-contrapositive":{"parity-contra":["parity-contra-2","parity-contra-5"],"compound-contra":["compound-contra-3","compound-contra-6"],"nonzero-contra":["compound-contra-2","compound-contra-5"],"parity-contra-plan":["parity-contra-plan-new-1","parity-contra-plan-new-2"],"sum-contra-plan":["sum-contra-plan-new-1","sum-contra-plan-new-2"]},
 "m1-proof-contradiction":{contradiction:["contradiction-4","contradiction-6"],"integer-extreme":["contradiction-2","contradiction-5"],"open-domain-extreme":["contradiction-3","open-domain-extreme-new-1","open-domain-extreme-new-2"],"irrational-root":["irrational-root-extra-1","irrational-root-extra-2"],"irrational-expression":["irrational-expression-2","irrational-expression-4"],"irrational-reciprocal":["irrational-expression-5","irrational-reciprocal-new-1"],"contradiction-plan":["contradiction-plan-new-1","contradiction-plan-new-2"],"root-plan":["root-plan-new-1","root-plan-new-2"],"irrational-plan":["irrational-plan-new-1","irrational-plan-new-2"]},
};
const shared:Record<string,string[]>={compare:["compare-2","compare-3"],substitute:["substitute-2","substitute-3"],"integer-recognition":["integer-recognition-2","integer-recognition-3"],"member-ready":["member-ready-2","member-ready-3"],"integer-form":["integer-form-2","integer-form-new-2"],"consecutive-form":["consecutive-form-new-1","consecutive-form-new-2"],"expand-square":["expand-square-2","expand-square-3"]};
export const math1LogicCheckExercises:Exercise[]=[];
export const math1LogicCoverage:{lesson:string;family:string;checkFamily:string;sourceIds:string[]}[]=[];
const supplements:Lesson["supplements"]=[],seen=new Map<string,string>();
const groups=sectionTitles.map((title,i)=>({id:`part-${i+1}`,title,exerciseIds:[] as string[]}));
const slug="m1-sets-logic-check";
const methodReasons:Record<string,string>={
 "parity-algebra":"直接証明を選ぶ。偶数・奇数という仮定を整数の式で表せるから。",
 consecutive:"直接証明を選ぶ。連続する数を同じ文字で表すと、和や差を計算できるから。",
 "parity-contra":"対偶による証明を選ぶ。元の数の偶奇を仮定すると、平方や三乗を直接計算できるから。",
 "compound-contra":"対偶による証明を選ぶ。結論を否定すると二数の条件がそろい、和などを計算できるから。",
 "nonzero-contra":"対偶による証明を選ぶ。一方がゼロという仮定なら、積が直ちにゼロと分かるから。",
 contradiction:"背理法を選ぶ。元の仮定を保ち、結論を否定して計算すると両立しない条件が得られるから。",
 "integer-extreme":"背理法を選ぶ。最大・最小を仮定すると、そこからさらに大きい・小さい整数を作れるから。",
 "open-domain-extreme":"背理法を選ぶ。極端な値を仮定して半分にすると、範囲内により小さい・大きい数を作れるから。",
 "irrational-root":"背理法を選ぶ。有理数と仮定すれば既約分数で表せ、共通因数をもつ矛盾を示せるから。",
 "irrational-expression":"背理法を選ぶ。有理数と仮定した式から、既知の無理数が有理数だと導けるから。",
 "irrational-reciprocal":"背理法を選ぶ。有理数と仮定し非零を確認して逆数を取ると、既知の無理数が有理数だと導けるから。",
};
math1Chapter2Topics.forEach(({lesson,exercises},i)=>{
 lesson.section=sectionTitles[sectionOf(i)];
 for(const family of new Set(exercises.map(e=>e.family))){
  const candidates=exercises.filter(e=>e.family===family&&["practice","review"].includes(e.stage));
  const fingerprint=JSON.stringify(candidates.map(e=>[e.prompt,e.answer,e.hints,e.steps]));
  const choiceReason=lesson.slug.includes('proof')?methodReasons[family]:undefined;
  const checkFamily=seen.get(fingerprint)??`${lesson.slug}-${choiceReason?'choose-':''}${family}`;
  const chosen=selections[lesson.slug]?.[family]??shared[family];
  if(!chosen||chosen.length<2)throw new Error(`Uncovered math I logic skill: ${lesson.slug}/${family}`);
  const selected=chosen.map(key=>{
   const e=candidates.find(e=>e.id===`${lesson.slug}-${key}-v1`);
   if(!e)throw new Error(`Invalid logic chapter source: ${lesson.slug}/${key}`);
   return e;
  });
  math1LogicCoverage.push({lesson:lesson.slug,family,checkFamily,sourceIds:selected.map(e=>e.id)});
  if(seen.has(fingerprint))continue;
  seen.set(fingerprint,checkFamily);
  const copied:Exercise[]=[];
  selected.forEach((e,n)=>{
   const stage=n===1?"review":"practice",id=`${slug}-${checkFamily}-${n+1}-v1`;
   const item:Exercise={...e,id,lesson:slug,stage,family:checkFamily,repair:checkFamily};
   if(choiceReason){
    item.prompt=e.prompt.replace(/対偶を用いて|背理法で/g,'')+" 方法を選んだ理由も示しなさい。";
    item.answer="方法の一例："+choiceReason+"\n"+e.answer;
    item.steps=[{title:"方法を選ぶ",text:choiceReason},{title:"確認",text:"正しい別の証明方法でも構いません。仮定・根拠・結論がつながっているかを確かめます。"}];
   }
   copied.push(item);math1LogicCheckExercises.push(item);
   if(stage==="practice")groups[sectionOf(i)].exerciseIds.push(id);
  });
  const repair=lesson.supplements.find(s=>s.id===family);
  if(!repair)throw new Error(`Missing logic repair: ${family}`);
  supplements.push(choiceReason?{...repair,id:checkFamily,title:"方法を選ぶ："+repair.title,text:copied[0].prompt+"\n"+copied[0].answer+"\n正しい別解でも構いません。\n"+repair.text,check:copied[1].prompt,answer:copied[1].answer}:{...repair,id:checkFamily,title:lesson.title+"："+repair.title});
 }
});
const copy=(e:Exercise,stage:"ready"|"guided",key:string)=>{
 const coverage=math1LogicCoverage.find(c=>c.lesson===e.lesson&&c.family===e.family)!;
 const id=`${slug}-${stage}-${key}-v1`;
 math1LogicCheckExercises.push({...e,id,lesson:slug,stage,family:coverage.checkFamily,repair:coverage.checkFamily});
 return id;
};
sets.exercises.filter(e=>e.stage==="ready").forEach((e,i)=>copy(e,"ready",String(i+1)));
const examples=[truth,direct].map((d,i)=>{
 const e=d.lesson.examples[0],q=d.exercises.find(q=>q.id===e.guidedIds[0])!;
 return {...e,id:`example-${i+1}`,guidedIds:[copy(q,"guided",String(i+1))]};
});
export const math1LogicCheckLesson:Lesson={
 slug,title:"集合と命題の章末確認",subject:"数学I",chapter:"集合と命題",section:"章末確認",description:"範囲・向き・否定を確かめ、根拠とともに答えよう。",basicsTitle:"仮定と結論を読み分ける",
 introduction:["集合では全体集合と要素を確かめます。条件の関係は、出発する条件を満たすすべての場合を考えます。反例は仮定を満たし、結論を満たさないことを両方示します。","必要・十分は二つの向き、否定は境界とかつ・または、すべて・あるを確認します。証明では文字の範囲と使った理由を残し、最後に何がいえたかを書きます。"],
 rule:"何を仮定し、何を示すかを先に書き分けます。",guidedAfterExamples:true,examples,supplements,practiceGroups:groups,
};
export const math1Chapter2Lessons=[...math1Chapter2Topics.map(d=>d.lesson),math1LogicCheckLesson];
export const math1Chapter2Exercises=[...math1Chapter2Topics.flatMap(d=>d.exercises),...math1LogicCheckExercises];
