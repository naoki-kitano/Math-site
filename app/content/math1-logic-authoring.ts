import {topic,addPair,type Skill,type Worked} from "./math1-topic";
import type {Lesson} from './lessons';
export const m=String.raw;
export const math=(s:string)=>`$${s}$`;
export const set=(a:number[])=>a.length?m`\{${a.join(",")}\}`:m`\varnothing`;
export const w=(prompt:string,answer:string,hint:string,working:string):Worked=>[prompt,answer,hint,working];
export function logicWorking(...parts:string[]){
 const unique=parts.map(s=>s.trim()).filter(Boolean).filter((s,i,a)=>!a.some((other,j)=>j!==i&&other.includes(s)&&(other!==s||j<i)));
 return unique.join('\n');
}
export function logicRepair(id:string,title:string,why:string,examples:Worked[],check:Worked):Lesson['supplements'][number]{
 const [first,...extra]=examples;
 return {id,title,text:logicWorking(why,first[0],logicWorking(first[3],first[1])),tex:'',check:check[0],answer:logicWorking(check[3],check[1]),
  ...(extra.length?{additionalExamples:extra.map((e,i)=>({title:`別の例 ${i+1}`,text:logicWorking(e[0],e[3],e[1])}))}:{}),
 };
}
export function addLogicPair(bank:ReturnType<typeof topic>,id:string,title:string,why:string,pair:[Worked,Worked]){
 addPair(bank,id,title,why,pair);
 const index=bank.lesson.supplements.findIndex(s=>s.id===id);
 bank.lesson.supplements[index]=logicRepair(id,title,why,[pair[0]],pair[1]);
}
const compare=(a:number,b:number):Worked=>w(`${math(String(a))} は ${math(String(b))} 以下ですか。`,a<=b?"はい。":"いいえ。",`${math(String(a))} と ${math(String(b))} の大小と等号を確かめます。`,`${math(`${a}${a<=b?m`\le`:" > "}${b}`)} なので、${a<=b?"条件を満たします":"条件を満たしません"}。`);
const substitute=(n:number):Worked=>w(m`$x=${n}$ のとき $x^2$ の値を求めなさい。`,math(String(n*n))+"。",`${math(String(n))} を代入し、${n<0?"負の数全体を括弧で囲んで":""}同じ数を二つ掛け合わせます。`,math(m`(${n})^2=(${n})(${n})=${n*n}`)+"。");
export const logicPreparation:Skill[]=[
 {id:"compare",title:"数と境界を比べる",why:"以下・以上には等しい場合も含みます。",sample:compare(2,2),items:[compare(3,4),compare(5,5),compare(4,3)]},
 {id:"substitute",title:"与えられた値を代入する",why:"文字を指定された数に置き換え、式の値を計算します。",sample:substitute(-2),items:[substitute(-3),substitute(0),substitute(-4)]},
];
export function logicTopic(slug:string,title:string,intro:string[],rule:string,skills:Skill[],prep=logicPreparation){
 const result=topic(slug,title,intro,rule,skills,prep);
 result.lesson.chapter="集合と命題";
 result.lesson.examples.forEach((e,i)=>{e.steps=[{title:'',text:logicWorking(skills[i].sample[3],skills[i].sample[1])}];});
 result.lesson.supplements=[...skills,...prep].map(s=>logicRepair(s.id,s.title,s.why,[s.sample],s.items[0]));
 return result;
}
