import {topic,chapterCheck,type Bank,type Q,type Skill,m,q,skill,f,range,comb} from "./matha-authoring";
export {m,q,f,range,comb};
export type {Q,Skill,Bank};
export const audit:{kind:string;args:number[];value:number}[]=[];
export function checked(kind:string,args:number[],value:number,prompt:string,answer:string,hint:string,working:string):Q{
 audit.push({kind,args,value});return q(prompt,answer,hint,working,value);
}
export const S=(id:string,title:string,why:string,qs:Q[])=>{
 if(qs.length<8)throw Error("Need sample and practice "+id);
 return skill(id,title,why,qs[0],qs.slice(1));
};
const substitution=(n:number)=>q(m`$x=${n}$ のとき、$2x+1$ の値を求めなさい。`,m`$${2*n+1}$。`,"文字の場所に数を入れ、掛け算から計算します。",m`$2\times(${n})+1=${2*n+1}$。`);
const fraction=(n:number)=>q(m`$\frac{1}{${n}}+\frac{1}{${n}}$ を計算しなさい。`,m`$${f(2,n)}$。`,"分母が同じなら分子を足します。",m`$\frac{1+1}{${n}}=${f(2,n)}$。`);
export const algebraPrep=[
 skill("prep-substitute","代入を確かめる","文字の表す数を式に入れます。",substitution(3),[substitution(2),substitution(-1),substitution(4)]),
 skill("prep-fraction","分数の計算を確かめる","同じ大きさの部分を合わせます。",fraction(3),[fraction(4),fraction(5),fraction(6)])
];
export const B=(chapter:string,slug:string,title:string,description:string,intro:string[],rule:string,skills:Skill[],section:string,prep=algebraPrep):Bank=>{
 const bank=topic(chapter,"mb-"+slug,title,description,intro,rule,skills,prep,section);
 bank.lesson.subject="数学B";return bank;
};
export function finish(chapter:string,slug:string,banks:Bank[],sections:string[],selection:Record<string,number[]>={}){
 const check=chapterCheck(chapter,"mb-"+slug+"-check",banks,sections,selection);check.lesson.subject="数学B";
 return {lessons:[...banks.map(b=>b.lesson),check.lesson],exercises:[...banks.flatMap(b=>b.exercises),...check.exercises]};
}
export const nums=[5,2,3,4,6,7,8,9];
