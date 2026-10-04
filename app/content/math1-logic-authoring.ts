import {topic,type Skill,type Worked} from "./math1-topic";
export const m=String.raw;
export const math=(s:string)=>`$${s}$`;
export const set=(a:number[])=>a.length?m`\{${a.join(",")}\}`:m`\varnothing`;
export const w=(prompt:string,answer:string,hint:string,working:string):Worked=>[prompt,answer,hint,working];
const compare=(a:number,b:number):Worked=>w(`${math(String(a))} は ${math(String(b))} 以下ですか。`,a<=b?"はい。":"いいえ。",`${math(String(a))} と ${math(String(b))} の大小と等号を確かめます。`,`${math(`${a}${a<=b?m`\le`:" > "}${b}`)} なので、${a<=b?"条件を満たします":"条件を満たしません"}。`);
const substitute=(n:number):Worked=>w(m`$x=${n}$ のとき $x^2$ の値を求めなさい。`,math(String(n*n))+"。",`${math(String(n))} を代入し、${n<0?"負の数全体を括弧で囲んで":""}同じ数を二つ掛け合わせます。`,math(m`(${n})^2=(${n})(${n})=${n*n}`)+"。");
export const logicPreparation:Skill[]=[
 {id:"compare",title:"数と境界を比べる",why:"以下・以上には等しい場合も含みます。",sample:compare(2,2),items:[compare(3,4),compare(5,5),compare(4,3)]},
 {id:"substitute",title:"与えられた値を代入する",why:"文字を指定された数に置き換え、式の値を計算します。",sample:substitute(-2),items:[substitute(-3),substitute(0),substitute(-4)]},
];
export function logicTopic(slug:string,title:string,intro:string[],rule:string,skills:Skill[],prep=logicPreparation){
 const result=topic(slug,title,intro,rule,skills,prep);
 result.lesson.chapter="集合と命題";
 return result;
}
