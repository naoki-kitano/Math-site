import {topic,type Skill,type Worked} from "./math1-topic";
export const m=String.raw;
export const w=(prompt:string,answer:string,hint:string,working:string):Worked=>[prompt,answer,hint,working];
export function num(n:number):string {
 if(Number.isInteger(n))return String(n);
 for(const d of [2,4,8,16])if(Number.isInteger(n*d))return `${n<0?"-":""}\\frac{${Math.abs(n*d)}}{${d}}`;
 throw new Error(`Unsupported exact fraction ${n}`);
}
export const signed=(n:number)=>n<0?num(n):`+${num(n)}`;
export function poly(a:number,b:number,c:number){
 const terms:[[number,string],[number,string],[number,string]]=[[a,"x^2"],[b,"x"],[c,""]];
 const s=terms.filter(([v])=>v!==0).map(([v,t],i)=>`${v<0?"-":i?"+":""}${t&&Math.abs(v)===1?"":num(Math.abs(v))}${t}`).join("");return s||"0";
}
export const vertexForm=(a:number,h:number,k:number)=>`${a===1?"":a===-1?"-":num(a)}${h===0?"x^2":`(x${signed(-h)})^2`}${k===0?"":signed(k)}`;
export const value=(a:number,b:number,c:number,x:number)=>a*x*x+b*x+c;
export function quadraticTopic(slug:string,title:string,intro:string[],rule:string,skills:Skill[],prep:Skill[]){
 const bank=topic(slug,title,intro,rule,skills,prep);bank.lesson.chapter="二次関数";
 // Practice renders the answer separately; do not repeat it as a second step.
 bank.exercises.forEach(e=>{e.steps=e.steps.slice(0,1);});
 return bank;
}
export function addRepairExamples(bank:ReturnType<typeof quadraticTopic>,family:string,keys:string[]){
 const supplement=bank.lesson.supplements.find(s=>s.id===family);
 if(!supplement)throw new Error(`Missing repair ${family}`);
 for(const key of keys){
  const e=bank.exercises.find(e=>e.id===`${bank.lesson.slug}-${family}-${key}-v1`);
  if(!e)throw new Error(`Missing repair example ${family}/${key}`);
  supplement.text+="\n"+[e.prompt,...e.steps.map(s=>s.text),e.answer].filter((x,i,a)=>a.indexOf(x)===i).join("\n");
 }
}
function square(n:number):Worked{return w(m`$(${num(n)})^2$ を計算しなさい。`,m`$${num(n*n)}$。`,"括弧の中の数全体を二回掛けます。",m`$(${num(n)})^2=(${num(n)})(${num(n)})=${num(n*n)}$。`);}
function linear(n:number):Worked{return w(m`$x=${n}$ のとき $2x+1$ の値を求めなさい。`,m`$${2*n+1}$。`,"文字を指定された数に置き換え、掛け算から計算します。",m`$2\cdot(${n})+1=${2*n+1}$。`);}
export const squarePrep:Skill={id:"signed-square",title:"負の数を二乗する",why:"負の数を括弧で囲み、負号も含めて二乗します。",sample:square(-2),items:[square(-3),square(-4),square(-1)]};
export const substitutionPrep:Skill={id:"linear-substitution",title:"文字へ数を代入する",why:"代入は文字を数に置き換えることです。",sample:linear(2),items:[linear(-2),linear(0),linear(3)]};
function readPoint(x:number,y:number):Worked{return w(m`点 $(${x},${y})$ の横座標と縦座標を答えなさい。`,m`横座標は $${x}$、縦座標は $${y}$。`,"座標は横、縦の順です。",m`$(x,y)$ の一番目を横、二番目を縦として読みます。`);}
export const coordinatePrep:Skill={id:"coordinate-order",title:"横座標と縦座標",why:"座標の組は順序をもちます。",sample:readPoint(2,-1),items:[readPoint(-1,3),readPoint(0,-2),readPoint(4,0)]};
function boundary(x:number,lo:number,hi:number):Worked{return w(m`$${lo}\le x<${hi}$ に $x=${x}$ は含まれますか。`,x>=lo&&x<hi?"含まれます。":"含まれません。", "左の境界は等号を含み、右の境界は含みません。",m`$${lo}\le${x}$ と $${x}<${hi}$ の両方を調べます。`);}
export const boundaryPrep:Skill={id:"interval-membership",title:"区間の端を確かめる",why:"不等式を両方満たすかを調べ、等号の有無を保ちます。",sample:boundary(2,0,2),items:[boundary(0,0,3),boundary(3,0,3),boundary(1,-1,2)]};
