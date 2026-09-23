import {addRepairExamples,quadraticTopic as topic,m,w,num,poly,signed,squarePrep,substitutionPrep} from "./math1-quadratic-authoring";
import {addPair,type Worked,type Skill} from "./math1-topic";
export const rootCases:{p:number;q:number;a:number;expression:string}[]=[];
function factorSolve(p:number,q:number,a=1):Worked{
 const expr=poly(a,-a*(p+q),a*p*q);rootCases.push({p,q,a,expression:expr});
 return w(m`$${expr}=0$ を解きなさい。`,m`$x=${[...new Set([p,q])].sort((a,b)=>a-b).map(num).join(",")}$。`,"左辺を因数分解し、積がゼロになる二つの可能性を調べます。",m`$${a===1?"":num(a)}(x${signed(-p)})(x${signed(-q)})=0$。係数はゼロでないので、$x${signed(-p)}=0$ または $x${signed(-q)}=0$。${p===q?"同じ解は一回だけ書きます。":"両方の可能性を残します。"}`);
}
function squareSolve(h:number,c:number):Worked{
 const left=h===0?"x^2":`(x${signed(-h)})^2`,r=Math.sqrt(c);
 const answer=c<0?"実数解はありません。":c===0?m`$x=${num(h)}$。`:Number.isInteger(r)?m`$x=${num(h-r)},${num(h+r)}$。`:m`$x=${h===0?"":num(h)}\pm\sqrt{${c}}$。`;
 return w(m`$${left}=${c}$ を実数の範囲で解きなさい。`,answer,c<0?"実数の平方は負になりません。":c===0?"平方がゼロなら中身もゼロです。":"平方根の正負両方を残してから、移項します。",c<0?m`左辺は非負、右辺は $${c}<0$ なので等しくなりません。`:c===0?m`$x${h===0?"":signed(-h)}=0$。`:m`$x${h===0?"":signed(-h)}=\pm${Number.isInteger(r)?num(r):m`\sqrt{${c}}`}$。正負どちらも二乗すると $${c}$ になります。`);
}
const zeroProduct=(p:number,q:number):Worked=>w(m`$(x${signed(-p)})(x${signed(-q)})=0$ から、それぞれの因数について成り立つ条件を書きなさい。`,m`$x${signed(-p)}=0$ または $x${signed(-q)}=0$。`,"両方がゼロとは限りません。少なくとも一方がゼロです。","二つともゼロでなければ積もゼロではないため、少なくとも一方がゼロです。");
const zeroPrep:Skill={id:"zero-product",title:"積がゼロになる条件",why:"少なくとも一方がゼロという、またはの条件に分けます。",sample:zeroProduct(1,-2),items:[zeroProduct(2,-3),zeroProduct(0,4),zeroProduct(-1,3)]};
export const factorEquation=topic("m1-quadratic-factor-equation","因数分解・平方根と二次方程式",[
 m`二次方程式は $ax^2+bx+c=0$（$a\ne0$）の形に整理できる方程式です。ここでは実数の解をすべて求めます。`,
 m`積 $AB=0$ なら $A=0$ または $B=0$。例えば $(x-2)(x+3)=0$ なら $x=2,-3$。積がゼロでない場合には同じ分け方はできません。`,
 m`$x^2=9$ の解は $x=\pm3$。記号 $\sqrt9$ 自体は正の平方根 $3$ ですが、方程式の解は負の平方根も含みます。`,
 m`$x^2=3x$ で両辺を $x$ で割ると $x=0$ の可能性を失います。$x(x-3)=0$ と整理して $x=0,3$ を求めます。ゼロかもしれない式では、そのまま割りません。`,
],"ゼロの積か平方の形に直し、すべての実数解を残します。",[
 {id:"factor-equation",title:"ゼロの積へ直す",why:"右辺をゼロにして積の形にすると、二つの一次方程式へ分けられます。",sample:factorSolve(2,-3),items:[factorSolve(1,4),factorSolve(-2,3),factorSolve(0,3),factorSolve(-1,-4),factorSolve(1,3,2),factorSolve(2,2),factorSolve(-3,1),factorSolve(0,-2)]},
 {id:"square-equation",title:"平方根の正負を残す",why:"中身の二乗が正の数なら、中身は正負二つの平方根です。",sample:squareSolve(0,9),items:[squareSolve(1,4),squareSolve(-2,9),squareSolve(0,5),squareSolve(2,3),squareSolve(-1,16),squareSolve(0,7)]},
],[zeroPrep,squarePrep]);
addPair(factorEquation,"square-zero","平方がゼロの解","正負に書いてもゼロは同じ数です。中身がゼロになる一つの値を求めます。",[squareSolve(3,0),squareSolve(-2,0)]);
addPair(factorEquation,"square-negative","実数の平方の符号","実数の平方は非負なので、負の値にはなりません。",[squareSolve(1,-1),squareSolve(0,-4)]);
addPair(factorEquation,"unsafe-division","未知数で割る前にゼロを残す","ゼロで割れないため、未知数で割る操作はゼロの解を失うことがあります。移項して共通因数を取り出します。",[
 w(m`$x^2=4x$ を $x$ で割って $x=4$ とした解答を直しなさい。`,m`$x=0,4$。$x=0$ も元の式を満たします。`,"両辺を引いてゼロの積にします。",m`$x(x-4)=0$。$x=0$ と $x=4$ の両方を残します。`),
 w(m`$x^2+2x=0$ を $x$ で割って $x=-2$ とした解答を直しなさい。`,m`$x=0,-2$。`,"共通因数をくくっても、それで割らなければゼロの解が残ります。",m`$x(x+2)=0$ より $x=0$ または $x=-2$。`),
]);
function formula(a:number,b:number,c:number):Worked{
 const D=b*b-4*a*c;
 let simplified="",factor=1;
 if(D>0){
  for(let s=1;s*s<=D;s++)if(D%(s*s)===0)factor=s;
  const radicand=D/(factor*factor),gcd=(u:number,v:number):number=>v===0?Math.abs(u):gcd(v,u%v);
  const divisor=gcd(gcd(b,factor),2*a),u=-b*Math.sign(a)/divisor,v=factor/divisor,den=2*Math.abs(a)/divisor;
  const radical=radicand===1?String(v):`${v===1?"":v}\\sqrt{${radicand}}`;
  const numerator=`${u===0?"":u}\\pm${radical}`;
  simplified=den===1?numerator:m`\frac{${numerator}}{${den}}`;
 }
 const answer=D<0?"実数解はありません。":D===0?m`$x=${num(-b/(2*a))}$。`:m`$x=${simplified}$。`;
 return w(m`$${poly(a,b,c)}=0$ を解の公式で解きなさい。`,answer,"係数を符号ごと読み、判別式を計算してから公式へ入れます。",m`$a=${a},b=${b},c=${c}$、$D=(${b})^2-4\cdot(${a})\cdot(${c})=${D}$。${D<0?"根号内が負であり、実数解はありません。":D===0?m`$x=\frac{-(${b})}{2\cdot(${a})}=${num(-b/(2*a))}$。`:m`$x=\frac{-(${b})\pm\sqrt{${D}}}{2\cdot(${a})}$。${factor>1?m`$\sqrt{${D}}=${factor}\sqrt{${D/(factor*factor)}}$ と整理します。`:""}分子全体と分母の共通因数を約分して $x=${simplified}$。${a<0?"分母を正に直すと正負の対応が入れ替わりますが、両方の解は同じです。":""}`}`);
}
function countRoots(a:number,b:number,c:number):Worked{
 const D=b*b-4*a*c,n=D>0?2:D===0?1:0;
 return w(m`$${poly(a,b,c)}=0$ の異なる実数解の個数を判別式で調べなさい。`,m`$${n}$ 個。`,"判別式の正・ゼロ・負だけで個数が分かり、解まで求める必要はありません。",m`$D=(${b})^2-4\cdot(${a})\cdot(${c})=${D}$。${D>0?"正負の平方根から異なる二つの解が得られます。":D===0?"正負の項がゼロになり、一つの解（重解）です。":"根号内が負になり、実数解はありません。"}`);
}
export const formulaEquation=topic("m1-quadratic-formula","解の公式と実数解の個数",[
 m`$ax^2+bx+c=0$（$a\ne0$）を $a$ で割って平方完成すると、$(x+\frac b{2a})^2=\frac{b^2-4ac}{4a^2}$。分母 $4a^2$ は正なので、右辺の符号は $b^2-4ac$ で決まります。`,
 m`$D=b^2-4ac\ge0$ のとき、両辺を $4a^2$ 倍して $(2ax+b)^2=D$。よって $2ax+b=\pm\sqrt D$、$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$ が解の公式です。$a$ が負でも使えます。`,
 m`$D>0$ なら異なる実数解が二つ、$D=0$ なら一つ（重解）、$D<0$ なら実数解はありません。`,
],"係数を符号ごと代入し、根号の中の値から実数解の個数を調べます。",[
 {id:"quadratic-formula",title:"符号を保って公式へ代入する",why:"一次係数が負でも、公式の分子はその係数の符号を反転したものです。",sample:formula(1,-2,-1),items:[formula(1,2,-1),formula(2,-2,-1),formula(1,-1,-1),formula(3,2,-2),formula(2,1,-2),formula(1,4,1),formula(-1,2,1),formula(-2,2,1)]},
 {id:"discriminant-count",title:"判別式の符号で個数を決める",why:"平方に等しい数が正・ゼロ・負のどれかを調べます。",sample:countRoots(1,-4,4),items:[countRoots(1,2,-1),countRoots(1,2,1),countRoots(1,0,2),countRoots(-1,2,-1),countRoots(2,1,-1),countRoots(2,0,3)]},
],[squarePrep,substitutionPrep]);
addPair(formulaEquation,"formula-no-real","公式と実数の範囲","根号内が負なら実数の平方根がなく、実数解はありません。",[formula(1,2,3),formula(2,2,2)]);
addPair(formulaEquation,"formula-double","重解を一つの値として書く","判別式ゼロでは正負の項がなくなり、解は一つの値です。",[formula(1,-4,4),formula(2,4,2)]);
function intercept(p:number,q:number):Worked{return w(m`$y=${poly(1,-p-q,p*q)}$ と $x$ 軸の共有点を求めなさい。`,[...new Set([p,q])].sort((a,b)=>a-b).map(x=>m`$(${x},0)$`).join("、")+"。",m`$x$ 軸上では $y=0$。方程式を解き、縦座標ゼロを添えます。`,factorSolve(p,q)[3]+" 解は横座標であり、点を答えるには縦座標も必要です。");}
function interceptCount(a:number,b:number,c:number):Worked{return w(m`$y=${poly(a,b,c)}$ と $x$ 軸の共有点の個数を、判別式で説明しなさい。`,countRoots(a,b,c)[3]+" 異なる実数解一つが一つの共有点に対応するため、共有点は "+countRoots(a,b,c)[1],m`$y=0$ の方程式の異なる実数解一つが、一つの共有点に対応します。`,countRoots(a,b,c)[3]);}
export const equationGraph=topic("m1-equation-graph","二次方程式とグラフ",[
 m`$y=f(x)$ と $x$ 軸の共有点では $y=0$。したがって $f(x)=0$ の実数解は、共有点の横座標を表します。方程式の解と点の座標は答えの種類が違います。`,
 m`$y=x^2-x-2$ なら $(x-2)(x+1)=0$ より $x=-1,2$。共有点は $(-1,0),(2,0)$。実数解が二つなら二点で交わり、重解なら一点で接します。実数解がなければ共有点がありません。`,
],"方程式の解を横座標として読み、グラフとの対応を確かめます。",[
 {id:"x-intercepts",title:"横座標に縦座標ゼロを添える",why:"共有点は、横と縦の座標の組です。",sample:intercept(-1,2),items:[intercept(1,3),intercept(-2,1),intercept(0,4),intercept(-1,-3),intercept(2,2),intercept(-2,4)]},
 {id:"intercept-count",title:"解の個数を共有点の個数へ",why:"異なる実数解と共有点が一対一に対応します。",sample:interceptCount(1,-2,1),items:[interceptCount(1,0,-1),interceptCount(1,2,1),interceptCount(1,0,1),interceptCount(-1,0,2),interceptCount(-1,2,-1),interceptCount(-2,0,-1)]},
],[zeroPrep,substitutionPrep]);
export const quadraticEquationTopics=[factorEquation,formulaEquation,equationGraph];
for(const b of quadraticEquationTopics)b.exercises.forEach(e=>{e.steps=e.steps.slice(0,1);});
addRepairExamples(factorEquation,"factor-equation",["3","5","6"]);
addRepairExamples(factorEquation,"square-equation",["3","4"]);
addRepairExamples(formulaEquation,"discriminant-count",["3"]);
addRepairExamples(formulaEquation,"quadratic-formula",["7"]);
addRepairExamples(equationGraph,"x-intercepts",["5"]);
addRepairExamples(equationGraph,"intercept-count",["3","4"]);
