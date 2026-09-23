import {functionFoundationTopics} from "./math1-function-foundations";
import {completingSquareTopics} from "./math1-completing-square";
import {quadraticGraphTopics} from "./math1-quadratic-graphs";
import {quadraticEquationTopics} from "./math1-quadratic-equations";
import {quadraticInequalityTopics} from "./math1-quadratic-inequalities";
import {quadraticApplicationTopics} from "./math1-quadratic-applications";
import type {Exercise,Lesson} from "./lessons";
// Chapter content independently reviewed; public deployment remains a separate step.
export const math1Chapter3Topics=[...functionFoundationTopics,...completingSquareTopics,...quadraticGraphTopics,...quadraticEquationTopics,...quadraticInequalityTopics,...quadraticApplicationTopics];
const slug="m1-quadratics-check";
const titles=["式とグラフ","平方完成・関数の決定","最大値・最小値","方程式・不等式","数量の表現"];
const groupOf=(i:number)=>i<5?0:i<9?1:i<11?2:i<17?3:4;
// Numbers are authored question keys, selected for conditions and operations, not array positions.
const selections:Record<string,Record<string,string[]>>={
 "m1-function-values":{evaluate:["2","3","6"],"combine-values":["2","3"],"function-uniqueness":["extra-1","extra-2"]},
 "m1-graph-points":{"point-membership":["2","4"],"find-ordinate":["2","5"],"point-domain":["extra-1","extra-2","additional-1","additional-2"]},
 "m1-domain-range":{"finite-range":["2","5"],"interval-range":["2","3"],"open-range":["extra-1","extra-2"]},
 "m1-basic-parabola":{"basic-shape":["2","3","5"],"opening-width":["2","3"]},
 "m1-parabola-translation":{"shift-point":["2","3","5"],"shift-equation":["2","3","5","6"]},
 "m1-completing-square":{"integer-completion":["2","4","6"],"fraction-completion":["2","3"],"vertex-reading":["extra-1","extra-2"],"completion-check":["extra-1","extra-2"]},
 "m1-completing-square-coefficient":{"positive-leading":["2","4","6"],"negative-leading":["2","3"],"vertex-reading":["extra-1","extra-2"],"outer-factor-check":["extra-1","extra-2"]},
 "m1-quadratic-graph":{"graph-vertex-form":["2","4"],"graph-expanded":["2","3","4"]},
 "m1-determine-quadratic":{"vertex-and-point":["2","3","4"],"axis-and-points":["2","3"],"three-points":["2","3"],"insufficient-condition":["extra-1","extra-2"]},
 "m1-parabola-extrema":{"vertex-extrema":["2","3"],"complete-extrema":["2","4"]},
 "m1-interval-extrema":{"axis-inside":["2","4","6"],"axis-outside":["2","3"],"unattained-endpoint":["extra-1","extra-2"]},
 "m1-quadratic-factor-equation":{"factor-equation":["2","3","5","6"],"square-equation":["2","3"],"square-zero":["extra-1","extra-2"],"square-negative":["extra-1","extra-2"],"unsafe-division":["extra-1","extra-2"]},
 "m1-quadratic-formula":{"quadratic-formula":["2","3","7"],"discriminant-count":["2","3","5"],"formula-no-real":["extra-1","extra-2"],"formula-double":["extra-1","extra-2"]},
 "m1-equation-graph":{"x-intercepts":["2","3","5"],"intercept-count":["2","3","4"]},
 "m1-quadratic-inequality":{"positive-leading-sign":["2","3","4","6"],"negative-leading-sign":["2","3","4","8"]},
 "m1-quadratic-inequality-boundaries":{"tangent-sign":["1","2","3","4","5","6","7","8"],"no-intersection-sign":["1","2","3","4"]},
 "m1-graph-intersections":{"parabola-line":["2","3","5"],"two-parabolas":["2","4"],"no-shared-point":["extra-1","extra-2"],"cancel-quadratic":["extra-1","extra-2"]},
 "m1-quadratic-model":{"rectangle-model":["2","3"],"rectangle-maximum":["2","3"],"time-height":["2","3"]},
};
const shared:Record<string,string[]>={"signed-square":["2","3"],"linear-substitution":["2","3"],"coordinate-order":["2","3"],"interval-membership":["2","3"],"expand-square":["2","3"],"fraction-sum":["2","3"],"factor-leading":["2","3"],"vertex-form-reading":["2","3"],"zero-product":["2","3"],"graph-sign":["2","3"]};
export const math1QuadraticCoverage:{lesson:string;family:string;checkFamily:string;sourceIds:string[]}[]=[];
export const math1QuadraticCheckExercises:Exercise[]=[];
const supplements:Lesson["supplements"]=[],seen=new Map<string,string>();
const groups=titles.map((title,i)=>({id:`part-${i+1}`,title,exerciseIds:[] as string[]}));
// Only these repeated preparation variants are review-only; all selected mathematical decisions remain in the chapter sections.
const reviewOnly=new Set(["m1-function-values-signed-square-3-v1","m1-function-values-linear-substitution-3-v1"]);
const methodReasons:Record<string,string>={
 "quadratic-formula":"解の公式を選ぶ。整数の積に因数分解しにくい形でも、係数から実数解をまとめて求められるから。",
 "formula-no-real":"判別式を調べる方法を選ぶ。平方完成した式の右辺が実数の平方になり得るかを、その符号から判断できるから。",
 "formula-double":"判別式と解の公式を使う方法を選ぶ。判別式がゼロなら、正負の項がなくなって一つの値が求まるから。",
 "discriminant-count":"判別式を調べる方法を選ぶ。個々の解を求めなくても、符号から異なる実数解の個数が分かるから。",
 "intercept-count":"判別式を調べる方法を選ぶ。縦座標がゼロとなる方程式の異なる実数解が、共有点に一対一に対応するから。",
};
const choosePrompt=(prompt:string)=>prompt.replace(/解の公式で|判別式で/g,"")+" 選んだ方法とその理由も答えなさい。";
math1Chapter3Topics.forEach(({lesson,exercises},i)=>{
 lesson.section=titles[groupOf(i)];
 for(const family of new Set(exercises.map(e=>e.family))){
  const chosen=selections[lesson.slug]?.[family]??shared[family];
  if(!chosen||chosen.length<2)throw new Error(`Uncovered quadratic skill ${lesson.slug}/${family}`);
  const selected=chosen.map(key=>{
   const e=exercises.find(e=>e.id===`${lesson.slug}-${family}-${key}-v1`);
   if(!e)throw new Error(`Missing quadratic chapter source ${lesson.slug}/${family}/${key}`);return e;
  });
  const fingerprint=JSON.stringify(selected.map(e=>[e.prompt,e.answer,e.hints,e.steps]));
  const reason=methodReasons[family];
  const checkFamily=seen.get(fingerprint)??`${lesson.slug}-${reason?"choose-":""}${family}`;
  math1QuadraticCoverage.push({lesson:lesson.slug,family,checkFamily,sourceIds:selected.map(e=>e.id)});
  if(seen.has(fingerprint))continue;seen.set(fingerprint,checkFamily);
  const repair=lesson.supplements.find(s=>s.id===family)!;
  supplements.push({...repair,id:checkFamily,title:lesson.title+"："+repair.title,...(reason?{text:choosePrompt(selected[0].prompt)+"\n方法の一例："+reason+"\n"+selected[0].steps.map(s=>s.text).join("\n")+"\n"+selected[0].answer+"\n正しい別の解き方でも構いません。\n"+repair.text,check:choosePrompt(repair.check),answer:"方法の一例："+reason+"\n"+repair.answer}:{})});
  selected.forEach((e,n)=>{
   const stage=reviewOnly.has(e.id)?"review":"practice",id=`${slug}-${checkFamily}-${n+1}-v1`;
   const choice=reason?{prompt:choosePrompt(e.prompt),answer:"方法の一例："+reason+"\n"+e.answer,steps:[{title:"方法を選ぶ",text:reason},...e.steps,{title:"別の解き方",text:"正しい別の解法でも構いません。必要な条件とすべての解・個数を確認します。"}]}:{};
   math1QuadraticCheckExercises.push({...e,...choice,id,lesson:slug,stage,family:checkFamily,repair:checkFamily});
   if(stage==="practice")groups[groupOf(i)].exerciseIds.push(id);
  });
 }
});
function copy(e:Exercise,stage:"ready"|"guided",key:string){
 const c=math1QuadraticCoverage.find(c=>c.lesson===e.lesson&&c.family===e.family)!;
 const id=`${slug}-${stage}-${key}-v1`;
 math1QuadraticCheckExercises.push({...e,id,lesson:slug,stage,family:c.checkFamily,repair:c.checkFamily});return id;
}
math1Chapter3Topics[0].exercises.filter(e=>e.stage==="ready").forEach((e,i)=>copy(e,"ready",String(i+1)));
const examples=[5,10].map((i,n)=>{
 const bank=math1Chapter3Topics[i],example=bank.lesson.examples[0],q=bank.exercises.find(e=>e.id===example.guidedIds[0])!;
 return {...example,id:`example-${n+1}`,guidedIds:[copy(q,"guided",String(n+1))]};
});
export const math1QuadraticCheckLesson:Lesson={slug,title:"二次関数の章末確認",chapter:"二次関数",subject:"数学I",section:"章末確認",basicsTitle:"式・点・範囲をつなぐ",description:"定義域と問いを確かめ、式とグラフを使って答えよう。",introduction:["点の座標、関数値、方程式の解、不等式の範囲はそれぞれ違う対象です。何を答える問題かを最初に確かめます。","平方完成で頂点を読み、定義域に含まれるかを確認します。方程式ではすべての解、不等式では境界の等号を残します。数量の問題は単位と入力の条件まで戻って答えます。"],rule:"求める対象と、使える入力の範囲を確認します。",examples,guidedAfterExamples:true,supplements,practiceGroups:groups};
export const math1Chapter3Lessons=[...math1Chapter3Topics.map(t=>t.lesson),math1QuadraticCheckLesson];
export const math1Chapter3Exercises=[...math1Chapter3Topics.flatMap(t=>t.exercises),...math1QuadraticCheckExercises];
