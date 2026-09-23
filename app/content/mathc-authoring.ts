import {topic,chapterCheck,skill,type Bank,type Q,type Skill,m,q,f,range} from "./matha-authoring";
export {m,q,f,range,skill};
export type {Bank,Q,Skill};
export const nums=[3,1,2,4,5,6,7,8];
export const S=(id:string,title:string,why:string,qs:Q[])=>{
 if(qs.length<8)throw Error("Need sample and seven questions: "+id);
 return skill(id,title,why,qs[0],qs.slice(1));
};
export const pair=(a:number,b:number)=>`(${a},${b})`;
export const triple=(a:number,b:number,c:number)=>`(${a},${b},${c})`;
export const complex=(a:number,b:number)=>a===0?(b===0?"0":b===1?"i":b===-1?"-i":`${b}i`):b===0?`${a}`:`${a}${b>0?"+":"-"}${Math.abs(b)===1?"":Math.abs(b)}i`;
export const root=(n:number)=>Number.isInteger(Math.sqrt(n))?String(Math.sqrt(n)):m`\sqrt{${n}}`;
export const pi=(n:number,d=1)=>n===0?"0":n===d?m`\pi`:n===-d?m`-\pi`:m`${f(n,d)}\pi`;
const subtract=(n:number)=>q(m`$${n}-(-2)$ を計算しなさい。`,m`$${n+2}$。`,"負の数を引くと、その反対の数を足します。",m`$${n}-(-2)=${n}+2=${n+2}$。`);
const square=(n:number)=>q(m`$(-${n})^2+2^2$ を計算しなさい。`,m`$${n*n+4}$。`,"負号も含めて二乗します。",m`$(-${n})^2=${n*n}$、$2^2=4$ なので和は $${n*n+4}$。`);
export const prep=[
 skill("prep-sign","負の数を引く","引く数の符号を反対にします。",subtract(3),[subtract(1),subtract(4),subtract(5)]),
 skill("prep-square","二乗を計算する","括弧全体に指数がかかります。",square(3),[square(1),square(4),square(5)])
];
export function C(chapter:string,slug:string,title:string,description:string,introduction:string[],rule:string,skills:Skill[],section:string,ready=prep):Bank{
 const b=topic(chapter,"mc-"+slug,title,description,introduction,rule,skills,ready,section);
 b.lesson.subject="数学C";
 for(const s of skills){
  const help=b.lesson.supplements.find(h=>h.id===s.id)!;
  const x=s.items[2];
  help.text+="\nもう一つ確かめる\n"+x.prompt+"\n"+x.working+"\n"+x.answer;
  if(["purpose","dimensions","argument-condition"].includes(s.id)){
   const others=s.id==="purpose"?[s.items[0],s.items[1]]:[s.items[1]];
   for(const other of others)help.text+="\n別の条件でも確かめる\n"+other.prompt+"\n"+other.working+"\n"+other.answer;
  }
 }
 return b;
}
export function finish(chapter:string,slug:string,banks:Bank[],sections:string[]){
 const selection:Record<string,number[]>={};
 // Include every independent-practice decision, not just the first two.
 for(const b of banks)for(const s of b.skills)selection[b.lesson.slug+"-"+s.id]=s.items.map((_,i)=>i+1).filter(i=>i>=2);
 const check=chapterCheck(chapter,"mc-"+slug+"-check",banks,sections,selection);check.lesson.subject="数学C";
 return {lessons:[...banks.map(b=>b.lesson),check.lesson],exercises:[...banks.flatMap(b=>b.exercises),...check.exercises]};
}
