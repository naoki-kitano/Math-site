import {topic,type Skill,type Worked} from "./math1-topic";
import type {Step} from './lessons';
export const m=String.raw;
export const w=(prompt:string,answer:string,hint:string,working:string):Worked=>[prompt,answer,hint,working];
export function frac(n:number,d:number):string{
 if(!Number.isInteger(n)||!Number.isInteger(d)||!d)throw new Error("Invalid fraction");
 const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a,g=gcd(Math.abs(n),Math.abs(d));
 n=n/g*Math.sign(d);d=Math.abs(d)/g;
 return d===1?String(n):m`${n<0?"-":""}\frac{${Math.abs(n)}}{${d}}`;
}
export const list=(xs:number[])=>xs.join(",");
// Separate inline values can wrap without splitting a number or losing a record.
export const records=(xs:number[])=>xs.map(x=>`$${x}$`).join('、');
const workedStages=new WeakMap<Worked,Step[]>();
export function staged(work:Worked,steps:Step[]):Worked{workedStages.set(work,steps);return work;}
// These authored workings already state the numerical result and required conditions.
// Interpretation tasks retain their separately written conclusion.
const answerInWorking=new Set(['class-frequency','class-mean','arithmetic-mean','median','mode','pooled-mean','quartiles','range-iqr','deviation','deviation-variance','standard-deviation','compare-sd','zero-spread','variance-moments','variance-shift-method','transformed-mean','transformed-spread','correlation-calculation','data-count','data-order']);
const workedText=(family:string,working:string,answer:string)=>working+(answerInWorking.has(family)?'':'\n'+answer);
export const sum=(xs:number[])=>xs.reduce((a,b)=>a+b,0);
export const mean=(xs:number[])=>sum(xs)/xs.length;
export function median(xs:number[]){
 const a=[...xs].sort((x,y)=>x-y),n=a.length;
 if(!n)throw new Error("Empty data");
 return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2;
}
export function quartiles(xs:number[]){
 const a=[...xs].sort((x,y)=>x-y),n=a.length,k=Math.floor(n/2);
 if(n<2)throw new Error("Too few data");
 return [a[0],median(a.slice(0,k)),median(a),median(a.slice(n%2?k+1:k)),a[n-1]];
}
export const variance=(xs:number[])=>sum(xs.map(x=>(x-mean(xs))**2))/xs.length;
export function skill(id:string,title:string,why:string,sample:Worked,items:Worked[]):Skill{
 if(items.length<3)throw new Error("Missing review variants "+id);
 return {id,title,why,sample,items};
}
export const fictional="このページの数値・調査例は、教材用の仮想データです。";
export const quartileRule=m`小さい順に並べ、奇数個では全体の中央値を除いて上下に分けます。下半分・全体・上半分の中央値が、それぞれ $Q_1,Q_2,Q_3$ です。ひげは最小値・最大値まで引きます。`;
function count(xs:number[]):Worked{return w(m`$${list(xs)}$ のデータは何個ありますか。同じ値も一つずつ数えなさい。`,m`$${xs.length}$ 個。`,"異なる値の種類ではなく、記録の個数を数えます。",m`同じ値が何度出ても、別の記録ならそれぞれ一つ。全部で $${xs.length}$ 個です。`);}
function order(xs:number[]):Worked{return w(m`${records(xs)} を小さい順に並べなさい。`,m`${records([...xs].sort((a,b)=>a-b))}。`,"同じ値も別の記録として残します。"+(xs.some(x=>x<0)?"負の数は零や正の数より小さい数です。":""),m`記録の個数を変えずに並べると ${records([...xs].sort((a,b)=>a-b))}。`);}
export const countPrep=skill("data-count","値の種類とデータの個数","同じ値でも別の記録なら個数に含めます。",count([2,2,4,5]),[count([1,3,3,4,4]),count([0,0,2,2,2,5]),count([2,2,2,2])]);
export const orderPrep=skill("data-order","小さい順に並べる","中央値を読む前に、順序をそろえます。",order([5,1,3,3]),[order([4,1,4,2,3]),order([0,-2,3,-1]),order([7,4,5,2,5,1])]);
// Preparation has one ready item and one distinct review item; it is not a complete diagnosis.
export function dataTopic(slug:string,title:string,intro:string[],rule:string,skills:Skill[],prep:Skill[]=[countPrep,orderPrep]){
 const bank=topic(slug,title,[...intro,fictional],rule,skills,prep);
 bank.lesson.chapter="データの分析";
 bank.exercises.forEach(e=>{e.steps=e.steps.slice(0,1);});
 const warmups:Record<string,string[]>={
  'm1-data-reading':['data-count'],'m1-histogram':['data-count'],
  'm1-representative-values':['data-count','data-order'],'m1-boxplot':['data-order'],
  'm1-data-variance':['data-count'],
 };
 bank.lesson.warmupIds=(warmups[slug]??[]).map(id=>`${slug}-${id}-1-v1`);
 for(const s of [...skills,...prep]){
  const supplement=bank.lesson.supplements.find(p=>p.id===s.id);
  if(supplement){
   supplement.answerExerciseId=`${slug}-${s.id}-1-v1`;
   supplement.text=[s.why,s.sample[0],workedText(s.id,s.sample[3],s.sample[1])].join('\n');
   supplement.answer=workedText(s.id,s.items[0][3],s.items[0][1]);
  }
  s.items.forEach((item,i)=>{const q=bank.exercises.find(e=>e.id===`${slug}-${s.id}-${i+1}-v1`);if(q){const steps=workedStages.get(item);if(steps)q.steps=steps;if(answerInWorking.has(s.id))q.answerInSteps=true;}});
  const steps=workedStages.get(s.sample),example=bank.lesson.examples.find(e=>e.id===s.id);
  if(example&&answerInWorking.has(s.id))example.steps=example.steps.slice(0,-1);
  if(steps&&example)example.steps=steps;
 }
 return bank;
}
export function addDataCases(bank:ReturnType<typeof dataTopic>,family:string,keys:number[]){
 const repair=bank.lesson.supplements.find(s=>s.id===family)!;
 for(const key of keys){
  const e=bank.exercises.find(e=>e.id===`${bank.lesson.slug}-${family}-${key}-v1`)!;
  if(!e)throw new Error("Missing data case "+key);
  (repair.additionalExamples??=[]).push({title:e.prompt,text:workedText(family,e.steps.map(s=>s.text).join('\n'),e.answer)});
 }
}
export function appendData(bank:ReturnType<typeof dataTopic>,family:string,key:string,q:Worked,stage:"practice"|"review"="review"){
 bank.exercises.push({id:`${bank.lesson.slug}-${family}-${key}-v1`,lesson:bank.lesson.slug,family,repair:family,stage,kind:"paper",prompt:q[0],answer:q[1],hints:[q[2]],steps:workedStages.get(q)??[{title:"考えて進める",text:q[3]}]});
}
export function regroupData(bank:ReturnType<typeof dataTopic>,keys:string[],family:string,title:string,why:string){
 const qs=keys.map(key=>{
  const e=bank.exercises.find(e=>e.id===`${bank.lesson.slug}-${key}-v1`);
  if(!e)throw new Error("Missing data grouping "+key);
  e.family=family;e.repair=family;return e;
 });
 const explain=(q:typeof qs[number])=>[...q.steps.map(s=>s.text),q.answer].join("\n");
 const repair={id:family,title,text:why+"\n"+qs[0].prompt+"\n"+explain(qs[0]),tex:"",check:qs.at(-1)!.prompt,answer:explain(qs.at(-1)!),answerExerciseId:qs.at(-1)!.id,additionalExamples:qs.slice(1,-1).map(q=>({title:q.prompt,text:explain(q)}))};
 const i=bank.lesson.supplements.findIndex(s=>s.id===family);
 if(i>=0)bank.lesson.supplements[i]=repair;else bank.lesson.supplements.push(repair);
}
export function medianWorking(xs:number[]){
 const a=[...xs].sort((x,y)=>x-y),n=a.length;
 return n%2?m`中央の第 $${(n+1)/2}$ 番目が $${a[(n-1)/2]}$。`:m`中央の二つは $${a[n/2-1]},${a[n/2]}$。その平均は $\frac{${a[n/2-1]}+(${a[n/2]})}{2}=${median(a)}$。`;
}
