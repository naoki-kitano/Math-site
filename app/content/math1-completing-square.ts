import {quadraticTopic as topic,m,w,num,signed,poly,vertexForm} from "./math1-quadratic-authoring";
import {addPair,type Worked,type Skill} from "./math1-topic";
export const completionCases:{a:number;b:number;c:number;answer:string}[]=[];
export function complete(a:number,b:number,c:number):Worked{
 const t=b/(2*a),k=c-a*t*t;
 completionCases.push({a,b,c,answer:vertexForm(a,-t,k)});
 return w(m`$${poly(a,b,c)}$ を平方完成しなさい。`,m`$${vertexForm(a,-t,k)}$。`,a===1?m`一次の係数 $${b}$ の半分 $${num(t)}$ を使って平方を作り、増えた平方を引きます。`:m`まず二次と一次の項から $${num(a)}$ をくくります。括弧の中で平方を作り、補正項にも外の係数を掛けます。`,a===1?m`$(x${signed(t)})^2=x^2${signed(b)}x+${num(t*t)}$ なので、$${poly(a,b,c)}=(x${signed(t)})^2-${num(t*t)}+(${num(c)})=${vertexForm(a,-t,k)}$。同じ数を足して引くため値は変わりません。`:m`$${poly(a,b,c)}=${num(a)}\{x^2${signed(b/a)}x\}+(${num(c)})=${num(a)}\{(x${signed(t)})^2-${num(t*t)}\}+(${num(c)})=${vertexForm(a,-t,k)}$。外の係数は平方の項にも補正項にも掛かります。`);
}
const expand=(t:number):Worked=>w(m`$(x${signed(t)})^2$ を展開しなさい。`,m`$${poly(1,2*t,t*t)}$。`,"同じ括弧を二つ掛け、中間項も計算します。",m`$(x${signed(t)})(x${signed(t)})=x^2${signed(t)}x${signed(t)}x+${num(t*t)}=${poly(1,2*t,t*t)}$。`);
const fraction=(a:number,b:number):Worked=>w(m`$${num(a)}+(${num(b)})$ を計算しなさい。`,m`$${num(a+b)}$。`,"分母をそろえてから、分子を足します。",m`$${num(a)}=\frac{${a*4}}4$、$${num(b)}=\frac{${b*4}}4$。和は $\frac{${a*4+b*4}}4=${num(a+b)}$。`);
const expandPrep:Skill={id:"expand-square",title:"平方の中間項を確認",why:"平方の公式には、二つの積を合わせた中間項があります。",sample:expand(2),items:[expand(3),expand(-2),expand(-1)]};
const fractionPrep:Skill={id:"fraction-sum",title:"分数の補正を計算",why:"平方完成で生じた分数も、分母をそろえて計算します。",sample:fraction(0.25,0.5),items:[fraction(0.5,0.25),fraction(1,-2.25),fraction(2,-0.25)]};
const readVertex=(a:number,h:number,k:number):Worked=>w(m`$y=${vertexForm(a,h,k)}$ の頂点と軸を答えなさい。`,m`頂点は $(${num(h)},${num(k)})$、軸は $x=${num(h)}$。`,"平方の括弧がゼロになる入力を求め、そのとき残る高さを読みます。",m`$x=${num(h)}$ のとき平方の部分はゼロで $y=${num(k)}$。$a\ne0$ のとき $y=a(x-h)^2+k$ の頂点は $(h,k)$ です。`);
export const squareBasic=topic("m1-completing-square","平方完成の基本",[
 m`平方完成は、二次式を平方のまとまりを使う形に直すことです。$x^2+6x+2$ を $(x+3)^2-7$ に直すと、関数 $y=(x+3)^2-7$ の頂点が $(-3,-7)$ と読めます。`,
 m`$(x+3)^2=x^2+6x+9$ なので、$x^2+6x$ を平方にするには $9$ が必要です。ただ足すと値が変わるため、同時に $9$ を引きます。$x^2+6x+2=(x+3)^2-9+2$ です。`,
 m`一次の係数が奇数でも同じです。$x^2+3x+1=(x+\frac32)^2-\frac94+1=(x+\frac32)^2-\frac54$。一次の係数の半分を使い、その二乗を補正します。`,
 m`変形後の式を展開すると元に戻ります。いくつかの数を代入して一致するだけでは、すべての入力で等しい理由にはなりません。`,
],"平方を作るために増えた数を引き、値を変えずに形を直します。",[
 {id:"integer-completion",title:"一次の係数を半分にする",why:"この問題群では一次係数が偶数なので、半分と補正は整数です。",sample:complete(1,6,2),items:[complete(1,4,1),complete(1,8,3),complete(1,10,4),complete(1,-6,5),complete(1,-4,-2),complete(1,2,0),complete(1,-2,5),complete(1,6,-1)]},
 {id:"fraction-completion",title:"分数でも同じ補正を行う",why:"一次係数の半分の二乗を引くので、分母は二から四になります。",sample:complete(1,3,1),items:[complete(1,-3,2),complete(1,1,1),complete(1,-5,2),complete(1,5,0),complete(1,-1,-1),complete(1,7,3)]},
],[expandPrep,fractionPrep]);
addPair(squareBasic,"vertex-reading","平方の形から頂点を読む","括弧の符号をそのまま座標にせず、平方の部分がゼロになる入力を探します。",[readVertex(1,-2,3),readVertex(1,1.5,-0.25)]);
addPair(squareBasic,"completion-check","増えた定数を補正する","等しい式かは展開して係数を比較します。平方を作ったときに増える定数を引きます。",[
 w(m`$x^2+4x+1=(x+2)^2+1$ という変形を直し、理由を答えなさい。`,m`正しくは $(x+2)^2-3$。右辺に余分な $4$ が増えているので引きます。`,"右辺の平方を展開して定数項を比べます。",m`$(x+2)^2+1=x^2+4x+5$ で元より $4$ 大きい。よって定数を $1-4=-3$ にします。`),
 w(m`$x^2-6x+2=(x-3)^2+2$ という変形を直し、理由を答えなさい。`,m`正しくは $(x-3)^2-7$。平方で増えた $9$ を引きます。`,"平方には正の九が含まれます。",m`$(x-3)^2=x^2-6x+9$。$2-9=-7$ と補正します。`),
]);
function factor(a:number,b:number):Worked{return w(m`$${poly(a,b,0)}$ から係数 $${a}$ をくくりなさい。`,m`$${a}(x^2${signed(b/a)}x)$。`,"それぞれの項を、くくる係数で割ります。",m`$${a}\cdot x^2=${a}x^2$、$${a}\cdot(${num(b/a)}x)=${b}x$ と戻ることを確かめます。`);}
const factorPrep:Skill={id:"factor-leading",title:"二次と一次の項から係数をくくる",why:"括弧の中のすべての項を同じ係数で割ります。",sample:factor(2,8),items:[factor(3,6),factor(-1,4),factor(-2,8)]};
export const squareLeading=topic("m1-completing-square-coefficient","係数をくくる平方完成",[
 m`$ax^2+bx+c$（$a\ne0$）では、まず二次と一次の項から $a$ をくくります。定数項は外に残すと、補正をまとめやすくなります。`,
 m`$2x^2+8x+1=2(x^2+4x)+1=2\{(x+2)^2-4\}+1=2(x+2)^2-7$。括弧の中で引いた $4$ にも $2$ が掛かるので、補正は $-8$ です。`,
 m`$-x^2+4x+3=-(x^2-4x)+3=-\{(x-2)^2-4\}+3=-(x-2)^2+7$。負の係数をくくったときは、一次の項も補正項も符号に注意します。`,
],"外の係数を補正項にも掛け、最後に定数をまとめます。",[
 {id:"positive-leading",title:"括弧の中で平方を作る",why:"くくった後の一次係数を半分にします。元の一次係数をそのまま半分にはしません。",sample:complete(2,8,1),items:[complete(2,4,3),complete(3,6,1),complete(2,-8,5),complete(2,2,1),complete(4,-4,0),complete(0.5,2,-1),complete(3,-12,2),complete(2,6,-2)]},
 {id:"negative-leading",title:"負号を補正項にも掛ける",why:"括弧内で引いた数に負の係数を掛けると、外では正の補正になります。",sample:complete(-1,4,3),items:[complete(-1,-2,3),complete(-2,8,1),complete(-1,3,0),complete(-3,-6,2),complete(-2,2,-1),complete(-0.5,2,1)]},
],[factorPrep,expandPrep]);
addPair(squareLeading,"vertex-reading","係数があっても頂点を読む","平方の係数が変わっても、平方の部分がゼロになる横座標と残る定数が頂点です。",[readVertex(2,-1,3),readVertex(-2,1,-1)]);
addPair(squareLeading,"outer-factor-check","補正項への掛け忘れを直す","平方にするため括弧内で足して引いた数にも、外の係数が掛かります。",[
 w(m`$2x^2+8x+1=2(x+2)^2-3$ という変形を直し、理由を答えなさい。`,m`$2(x+2)^2-7$。補正は $-4$ ではなく $2\cdot(-4)=-8$ だからです。`,"括弧内の補正に外の二を掛けたか見ます。",m`$2\{(x+2)^2-4\}+1=2(x+2)^2-8+1$。`),
 w(m`$-x^2+4x+3=-(x-2)^2-1$ という変形を直し、理由を答えなさい。`,m`$-(x-2)^2+7$。括弧内の $-4$ に負号を掛けると $+4$ になるからです。`,"外の負号が補正項にも掛かります。",m`$-\{(x-2)^2-4\}+3=-(x-2)^2+4+3$。`),
]);
squareBasic.lesson.prerequisites=[{slug:"m1-parabola-translation",label:"平行移動と対応する点"},{slug:"m1-product-identities",label:"乗法公式と式の形"}];
squareLeading.lesson.prerequisites=[{slug:"m1-completing-square",label:"平方完成の基本"}];
for(const b of [squareBasic,squareLeading])b.exercises.forEach(e=>{e.steps=e.steps.slice(0,1);});
export const completingSquareTopics=[squareBasic,squareLeading];
for(const [bank,family,key]of [[squareBasic,"fraction-sum","fraction-sum-2"],[squareLeading,"factor-leading","factor-leading-2"]] as const){
 const e=bank.exercises.find(e=>e.id===`${bank.lesson.slug}-${key}-v1`)!;
 bank.lesson.supplements.find(s=>s.id===family)!.text+="\n"+[e.prompt,e.steps[0].text,e.answer].join("\n");
}
for(const [bank,key,a,b]of [[squareBasic,"integer-completion-1",1,4],[squareBasic,"fraction-completion-1",1,-3],[squareLeading,"positive-leading-1",2,4],[squareLeading,"negative-leading-1",-1,-2]] as const){
 const e=bank.exercises.find(e=>e.id===`${bank.lesson.slug}-${key}-v1`)!;
 e.prompt+=(a===1?" 一次係数の半分、平方を作るために引く数、平方完成した等式全体の順に答えなさい。":" 最初に二次と一次の項の係数をくくり、括弧内の一次係数の半分、括弧内で引く数、外の係数を掛けた補正項、平方完成した等式全体の順に答えなさい。");
 const t=b/(2*a);
 const c=key==="integer-completion-1"?1:key==="fraction-completion-1"?2:3;
 e.answer=m`半分は $${num(t)}$、平方を作るために引く数は $${num(t*t)}$。${a===1?"":m`最初の括り出しは $${poly(a,b,c)}=${num(a)}(x^2${signed(b/a)}x)+${c}$。外の係数を掛けた補正項は $${num(-a*t*t)}$。`}等式全体は $${poly(a,b,c)}=${vertexForm(a,-t,c-a*t*t)}$。`;
}
