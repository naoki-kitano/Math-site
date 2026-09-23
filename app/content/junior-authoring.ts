import {topic,chapterCheck,skill,type Bank,type Q,type Skill,m,q,f} from "./matha-authoring";
export {m,q,f,skill};
export type {Bank,Q,Skill};
export const ns=[3,1,2,4,5,6,7,8];
export const S=(id:string,title:string,why:string,qs:Q[])=>skill(id,title,why,qs[0],qs.slice(1));
const add=(n:number)=>q(m`$${n}+2$ を計算しなさい。`,m`$${n+2}$。`,"二つ分だけ大きくします。",m`$${n}+2=${n+2}$。`);
const times=(n:number)=>q(m`$${n}\times3$ を計算しなさい。`,m`$${n*3}$。`,"同じ数を三つ分合わせます。",m`$${n}+${n}+${n}=${3*n}$。`);
export const prep=[skill("prep-add","加法を確かめる","数を合わせます。",add(3),[add(2),add(4),add(5)]),skill("prep-times","乗法を確かめる","同じ量がいくつ分あるかを考えます。",times(3),[times(2),times(4),times(5)])];
function preparation(chapter:string):Skill[]{
 if(chapter==="数と計算の基礎")return prep;
 const value=(n:number)=>q(m`$x=${n}$ のとき $2x$ の値を求めなさい。`,m`$${2*n}$。`,"省略されている掛け算を補います。",m`$2x=2\times${n}=${2*n}$。`);
 const signed=(n:number)=>q(m`$${n}+(-2)$ を計算しなさい。`,m`$${n-2}$。`,"負の数を足すと、数直線で左へ進みます。",m`$${n}+(-2)=${n}-2=${n-2}$。`);
 const square=(n:number)=>q(m`$${n}^2$ を計算しなさい。`,m`$${n*n}$。`,"同じ数を二回掛けます。",m`$${n}\times${n}=${n*n}$。`);
 const divide=(n:number)=>q(m`$${3*n}\div3$ を計算しなさい。`,m`$${n}$。`,"三つの同じ量に分けます。",m`$3\times${n}=${3*n}$ なので商は $${n}$。`);
 const fs=chapter==="文字と式の基礎"?[signed,times]:chapter==="データと確率の基礎"?[add,divide]:[value,square];
 const titles=chapter==="文字と式の基礎"?["正負の計算","数の掛け算"]:chapter==="データと確率の基礎"?["合計の計算","同じ量に分ける"]:["代入の計算","二乗の計算"];
 return fs.map((fn,i)=>skill("prep-"+i,titles[i],"前に学んだ計算を確かめます。",fn(3),[fn(2),fn(4),fn(5)]));
}
export function J(chapter:string,slug:string,title:string,description:string,introduction:string[],rule:string,skills:Skill[],section:string):Bank{
 const b=topic(chapter,"jr-"+slug,title,description,introduction,rule,skills,preparation(chapter),section);b.lesson.subject="中学数学";
 for(const s of skills){
  const h=b.lesson.supplements.find(h=>h.id===s.id)!;
  const x=s.items[s.id==="bias"?0:2];h.text+="\n別の問題で確かめる\n"+x.prompt+"\n"+x.working+"\n"+x.answer;
 }
 return b;
}
export function finish(chapter:string,slug:string,banks:Bank[],sections:string[]){
 const selection=Object.fromEntries(banks.flatMap(b=>b.skills.map(s=>[b.lesson.slug+"-"+s.id,s.items.map((_,i)=>i+1).filter(i=>i>=2)])));
 const c=chapterCheck(chapter,"jr-"+slug+"-check",banks,sections,selection);c.lesson.subject="中学数学";
 return {lessons:[...banks.map(b=>b.lesson),c.lesson],exercises:[...banks.flatMap(b=>b.exercises),...c.exercises]};
}
