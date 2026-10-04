import {addRepairExamples,quadraticTopic as topic,m,w,num,poly,vertexForm,signed,substitutionPrep,boundaryPrep,coordinatePrep} from "./math1-quadratic-authoring";
import {addPair,type Worked} from "./math1-topic";
export const intersectionCases:{f:number[];g:number[];xs:number[];ys:number[]}[]=[];
function intersections(p:number,q:number,slope:number,constant:number,otherQuadratic=false):Worked{
 const g=[otherQuadratic?1:0,slope,constant],f=[g[0]+1,slope-p-q,constant+p*q],xs=[...new Set([p,q])].sort((a,b)=>a-b),ys=xs.map(x=>g[0]*x*x+g[1]*x+g[2]);
 intersectionCases.push({f,g,xs,ys});
 return w(m`$y=${poly(f[0],f[1],f[2])}$ と $y=${poly(g[0],g[1],g[2])}$ の共有点を求めなさい。`,xs.map((x,i)=>m`$(${x},${ys[i]})$`).join("、")+"。","同じ点では横座標も縦座標も同じなので、二つの右辺を等しくします。",m`右辺を等しくして整理すると $${poly(1,-p-q,p*q)}=0$、つまり $(x${signed(-p)})(x${signed(-q)})=0$。$x=${xs.join(",")}$ を $y=${poly(g[0],g[1],g[2])}$ に代入すると、対応する $y$ は順に $${ys.join(",")}$。両方の式で同じ高さになることを確かめます。`);
}
export const sharedPoints=topic("m1-graph-intersections","二つのグラフの共有点",[
 m`二つのグラフの共有点は、二つの式を同時に満たす点です。同じ横座標で縦座標も等しいため、右辺同士を等しくして横座標を求めます。`,
 m`$y=x^2$ と $y=x+2$ なら $x^2=x+2$ より $(x-2)(x+1)=0$。$x=-1,2$ です。直線の式へ戻すと $y=1,4$ なので、共有点は $(-1,1),(2,4)$。横座標だけで終わりにしません。`,
 m`二つの放物線でも方法は同じです。整理後の二次の項が消えて一次方程式になる場合もあります。式の形を確かめてから解きます。`,
],"二つの式を同時に満たす横座標を求め、縦座標も計算します。",[
 {id:"parabola-line",title:"二つの高さを等しくする",why:"共有点では二つの関数値が等しくなります。",sample:intersections(-1,2,1,2),items:[intersections(0,3,1,1),intersections(-2,1,2,3),intersections(1,4,-1,2),intersections(-1,-3,0,2),intersections(2,2,2,0),intersections(-2,2,1,-1),intersections(0,1,-2,3),intersections(-1,3,1,0)]},
 {id:"two-parabolas",title:"放物線同士でも同じ横座標で比べる",why:"右辺同士を等しくし、同類項を整理して方程式にします。",sample:intersections(-1,2,1,0,true),items:[intersections(0,2,1,1,true),intersections(-2,1,-1,2,true),intersections(1,3,0,-1,true),intersections(-1,-1,2,0,true),intersections(-2,2,-1,1,true),intersections(0,3,1,-2,true)]},
],[substitutionPrep,coordinatePrep]);
addPair(sharedPoints,"no-shared-point","共有点がないことを式で確かめる","右辺同士を等しくした式が実数解をもたなければ、共有点もありません。",[
 w(m`$y=x^2+1$ と $y=0$ の共有点を求めなさい。`,"共有点はありません。","平方の符号を調べます。",m`$x^2+1=0$ なら $x^2=-1$ となり、実数解がありません。`),
 w(m`$y=x^2+2$ と $y=1$ の共有点を求めなさい。`,"共有点はありません。","右辺同士を等しくして、平方の値を調べます。",m`$x^2+2=1$ より $x^2=-1$。実数では成り立ちません。`),
]);
addPair(sharedPoints,"cancel-quadratic","二次の項が消える共有点計算","右辺を等しくして整理した後の次数で、解く方法を決めます。",[
 w(m`$y=x^2+x$ と $y=x^2+2$ の共有点を求めなさい。`,m`$(2,6)$。`,"両辺の二次の項を引いてみます。",m`$x^2+x=x^2+2$ より $x=2$。どちらの式でも $y=6$ です。`),
 w(m`$y=2x^2-x$ と $y=2x^2+3$ の共有点を求めなさい。`,m`$(-3,21)$。`,"同じ二次の項が消えるので、残る一次方程式を解きます。",m`$-x=3$ より $x=-3$。$y=2(-3)^2+3=21$。`),
]);

function rectangle(L:number,maximum:boolean):Worked{
 const formula=poly(-1,L,0),h=L/2,area=L*L/4;
 return w(m`周の長さが $${2*L}\,\mathrm{cm}$ の長方形で、一辺を $x\,\mathrm{cm}$ とします。${maximum?"面積が最大になる辺の長さと最大面積を求めなさい。":"面積を表す関数と、実数の変数 $x$ の定義域を求めなさい。"}辺の長さは正とします。`,maximum?m`二辺はともに $${num(h)}\,\mathrm{cm}$、最大面積は $${num(area)}\,\mathrm{cm}^2$。`:m`$S=${formula}$、$0<x<${L}$。`,maximum?"周の長さから他方の辺を表し、面積を平方完成します。頂点が実際の長方形になるかも確認します。":"向かい合う辺が二本ずつあることから、二辺の和を求めます。",m`他方の辺を $y\,\mathrm{cm}$ とすると $2x+2y=${2*L}$、よって $y=${L}-x$。二辺の長さは正なので $x>0$ かつ $${L}-x>0$、よって $0<x<${L}$。面積を $S\,\mathrm{cm}^2$ とすると、$S=x(${L}-x)=${formula}$。`+(maximum?m`平方完成すると $S=${vertexForm(-1,h,area)}$。$x=${num(h)}$ は定義域に入り、平方がゼロなので最大面積は $${num(area)}\,\mathrm{cm}^2$。他方の辺も $${num(h)}\,\mathrm{cm}$ です。`:"両端では辺の一方がゼロとなり長方形ではないため、端を含めません。"));
}
function heightModel(h:number,k:number,last:number):Worked{
 const b=2*h,c=k-h*h;
 return w(m`教材用のモデルとして、時刻 $t$ 秒の高さ $H$ メートルを $H=-t^2+${b}t+${c}$（$0\le t\le${last}$）で表します。この期間の最高の高さと、その時刻を求めなさい。`,m`$t=${h}$ 秒で、最高の高さは $${k}$ メートル。`,"入力は時刻、出力は高さです。平方完成して頂点の時刻が期間内か確かめます。",m`$H=-(t-${h})^2+${k}$。$0\le${h}\le${last}$ なので頂点の時刻は使えます。平方の係数が負だから、このとき最高の高さ $${k}$ メートルをとります。`);
}
export const quadraticModel=topic("m1-quadratic-model","数量を表す二次関数",[
 m`文章から式を作るときは、まず入力と出力が何の量か、単位は何かを決めます。式を計算する前に、その場面で入力がとれる範囲を考えます。`,
 m`周の長さが $12\,\mathrm{cm}$ の長方形で一辺が $x\,\mathrm{cm}$ なら、他方は $(6-x)\,\mathrm{cm}$。面積は $S=x(6-x)$ ですが、長方形の辺が正という条件から $0<x<6$ が必要です。`,
 m`最大値を求めたら、数式の値だけでなく、どの量がいくらになるのかを単位付きで答えます。頂点が求める範囲に入らなければ、その値を場面の答えにはできません。`,
],"式・定義域・単位をそろえ、計算した値を元の場面へ戻します。",[
 {id:"rectangle-model",title:"辺の条件から式と範囲を作る",why:"周の長さから他方の辺を表し、二辺の正の条件を両方使います。",sample:rectangle(6,false),items:[rectangle(8,false),rectangle(10,false),rectangle(7,false),rectangle(12,false),rectangle(5,false),rectangle(9,false)]},
 {id:"rectangle-maximum",title:"面積を平方完成し、辺の長さへ戻す",why:"平方の項がゼロになる長さが、正の辺を作れるかも確認します。",sample:rectangle(6,true),items:[rectangle(8,true),rectangle(7,true),rectangle(10,true),rectangle(5,true),rectangle(12,true),rectangle(9,true)]},
 {id:"time-height",title:"時刻と高さを区別して答える",why:"横の変数は時刻、関数値は高さです。頂点の二つの座標の意味を分けます。",sample:heightModel(2,5,4),items:[heightModel(1,3,2),heightModel(2,7,4),heightModel(3,10,6),heightModel(2,6,3),heightModel(1,4,2),heightModel(3,12,5)]},
],[substitutionPrep,boundaryPrep]);
sharedPoints.lesson.prerequisites=[{slug:"m1-graph-points",label:"座標とグラフ上の点"},{slug:"m1-quadratic-factor-equation",label:"二次方程式"}];
quadraticModel.lesson.prerequisites=[{slug:"m1-interval-extrema",label:"区間内の最大値・最小値"}];
export const quadraticApplicationTopics=[sharedPoints,quadraticModel];
for(const b of quadraticApplicationTopics)b.exercises.forEach(e=>{e.steps=e.steps.slice(0,1);});
addRepairExamples(sharedPoints,"parabola-line",["5"]);
addRepairExamples(sharedPoints,"two-parabolas",["4"]);
addRepairExamples(quadraticModel,"rectangle-maximum",["2"]);
