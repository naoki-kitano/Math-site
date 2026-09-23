import {topic,type Skill,type Worked} from "./math1-topic";
export const m=String.raw;
export const w=(prompt:string,answer:string,hint:string,working:string):Worked=>[prompt,answer,hint,working];
export const fraction=(n:number,d:number):string=>{
 if(!Number.isInteger(n)||!Number.isInteger(d)||d===0)throw new Error("Invalid rational");
 const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
 const g=gcd(Math.abs(n),Math.abs(d));n=n/g*Math.sign(d);d=Math.abs(d)/g;
 return d===1?String(n):m`${n<0?"-":""}\frac{${Math.abs(n)}}{${d}}`;
};
export function root(n:number):string{
 if(!Number.isInteger(n)||n<0)throw new Error("Invalid radicand");
 if(!n)return "0";
 let k=1;for(let i=2;i*i<=n;i++)if(n%(i*i)===0)k=i;
 return n===k*k?String(k):m`${k===1?"":k}\sqrt{${n/(k*k)}}`;
}
export function trigTopic(slug:string,title:string,intro:string[],rule:string,skills:Skill[],prep:Skill[]){
 const bank=topic(slug,title,intro,rule,skills,prep);bank.lesson.chapter="図形と計量";
 bank.exercises.forEach(e=>{e.steps=e.steps.slice(0,1);});return bank;
}
export function repairCases(bank:ReturnType<typeof trigTopic>,family:string,keys:string[]){
 const s=bank.lesson.supplements.find(s=>s.id===family);
 if(!s)throw new Error("Missing trig repair "+family);
 for(const key of keys){
  const e=bank.exercises.find(e=>e.id===`${bank.lesson.slug}-${family}-${key}-v1`);
  if(!e)throw new Error("Missing trig repair example "+key);
  s.text+="\n"+[e.prompt,...e.steps.map(s=>s.text),e.answer].join("\n");
 }
}
export function appendTrigQuestion(bank:ReturnType<typeof trigTopic>,family:string,key:string,q:Worked,stage:"practice"|"review"="review"){
 bank.exercises.push({id:`${bank.lesson.slug}-${family}-${key}-v1`,lesson:bank.lesson.slug,family,repair:family,stage,kind:"paper",prompt:q[0],answer:q[1],hints:[q[2]],steps:[{title:"考えて進める",text:q[3]}]});
}
export function regroupTrig(bank:ReturnType<typeof trigTopic>,keys:string[],family:string,title:string,why:string){
 const qs=keys.map(key=>{
  const q=bank.exercises.find(e=>e.id===`${bank.lesson.slug}-${key}-v1`);
  if(!q)throw new Error("Missing regroup question "+key);
  q.family=family;q.repair=family;return q;
 });
 bank.lesson.supplements.push({id:family,title,text:why+"\n"+qs.map(q=>[q.prompt,...q.steps.map(s=>s.text),q.answer].join("\n")).join("\n"),tex:"",check:qs.at(-1)!.prompt,answer:qs.at(-1)!.steps.map(s=>s.text).join("\n")+"\n"+qs.at(-1)!.answer});
}
function angleSum(a:number,b:number):Worked{return w(m`三角形の二つの内角が $${a}^\circ,${b}^\circ$ です。残りの角を求めなさい。`,m`$${180-a-b}^\circ$。`,"三つの内角の和を使います。",m`$180^\circ-${a}^\circ-${b}^\circ=${180-a-b}^\circ$。`);}
export const anglePrep:Skill={id:"angle-sum",title:"三角形の内角の和",why:m`三角形の三つの内角の和は $180^\circ$。各内角は正です。`,sample:angleSum(40,60),items:[angleSum(30,90),angleSum(45,60),angleSum(60,90)]};
function positiveRoot(n:number):Worked{return w(m`長さ $x$ が $x^2=${n*n}$ を満たします。$x$ を求めなさい。`,m`$x=${n}$。`,"方程式の解のうち、長さの条件を満たすものを選びます。",m`方程式だけなら $x=\pm${n}$。長さは正なので $x=${n}$。`);}
export const lengthPrep:Skill={id:"positive-length",title:"長さには正の解を選ぶ",why:"辺の長さは正なので、二乗から戻すとき負の解は採用しません。",sample:positiveRoot(4),items:[positiveRoot(5),positiveRoot(3),positiveRoot(6)]};
function ratio(n:number,d:number):Worked{return w(m`$\frac{${n}}{${d}}$ を約分しなさい。`,m`$${fraction(n,d)}$。`,"分子と分母を同じ非零の数で割ります。",m`分子と分母の共通の因数を取り除くと $${fraction(n,d)}$ です。値は変わりません。`);}
export const ratioPrep:Skill={id:"reduce-ratio",title:"比を分数で表す",why:"比を表す分数も、分子と分母を同じ非零の数で割って整理できます。",sample:ratio(6,10),items:[ratio(8,12),ratio(9,15),ratio(10,16)]};
function proportion(n:number,d:number,v:number):Worked{return w(m`$\frac{x}{${d}}=${fraction(n,v)}$ を解きなさい。`,m`$x=${fraction(n*d,v)}$。`,"両辺に分母の数を掛けます。",m`両辺に $${d}$ を掛けて $x=${d}\cdot${fraction(n,v)}=${fraction(n*d,v)}$。`);}
export const proportionPrep:Skill={id:"solve-ratio",title:"分数を含む等式を解く",why:"未知数の位置を確かめ、等式の両辺に同じ数を掛けます。",sample:proportion(1,8,2),items:[proportion(3,10,5),proportion(2,12,3),proportion(1,9,3)]};
export type SpecialAngle=0|30|45|60|90|120|135|150|180;
export const specialValues:Record<SpecialAngle,[sin:string,cos:string,tan:string|null]>={
 0:["0","1","0"],30:[m`\frac12`,m`\frac{\sqrt3}{2}`,m`\frac{\sqrt3}{3}`],
 45:[m`\frac{\sqrt2}{2}`,m`\frac{\sqrt2}{2}`,"1"],60:[m`\frac{\sqrt3}{2}`,m`\frac12`,m`\sqrt3`],
 90:["1","0",null],120:[m`\frac{\sqrt3}{2}`,m`-\frac12`,m`-\sqrt3`],
 135:[m`\frac{\sqrt2}{2}`,m`-\frac{\sqrt2}{2}`,"-1"],150:[m`\frac12`,m`-\frac{\sqrt3}{2}`,m`-\frac{\sqrt3}{3}`],
 180:["0","-1","0"],
};
