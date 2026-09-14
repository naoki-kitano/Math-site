"use client";
import CoordinateDiagram, { type CoordinateDiagramProps as Diagram } from "./CoordinateDiagram";
import TrigDiagrams from "./TrigDiagrams";
import ExponentialDiagrams from "./ExponentialDiagrams";
import DerivativeDiagrams from "./DerivativeDiagrams";
import IntegralDiagrams from "./IntegralDiagrams";
const blue="#42648b";
const figures:Record<string,Diagram[]>={
 "coordinate-conditions":[
  {title:"直線上の点と横の範囲",description:"$x$ を $-1$ から $2$ まで動かすと、点は太い線分上を動きます。両端も含みます。",xRange:[-2,3],yRange:[-1,7],
   curves:[{label:"$y=2x+2$、$-1\\le x\\le2$",value:x=>2*x+2,from:-1,to:2}],points:[{x:-1,y:0,label:"左端 $(-1,0)$"},{x:2,y:6,label:"右端 $(2,6)$"}]},
  {title:"固定される縦の座標",description:"$y=1$ のまま、$x>0$ の側へ進みます。白丸の $(0,1)$ は含みません。",xRange:[-1,5],yRange:[-1,3],
   curves:[{label:"$y=1$、$x>0$（右へ続きます）",value:()=>1,from:0}],points:[{x:0,y:1,label:"$(0,1)$ は除きます。",open:true}]}
 ],
 "point-distance":[
  {title:"横・縦・斜辺を見分ける",description:"横に $3$、縦に $4$。求めたいのは点を直接結ぶ斜辺です。",xRange:[-1,5],yRange:[-1,5],
   segments:[{from:[0,0],to:[3,0],label:"横の長さ $3$",dashed:true},{from:[3,0],to:[3,4],label:"縦の長さ $4$",dashed:true},{from:[0,0],to:[3,4],label:"$AB=\\sqrt{3^2+4^2}=5$",width:3}],
   points:[{x:0,y:0,label:"$A(0,0)$"},{x:3,y:4,label:"$B(3,4)$"}]},
  {title:"下向きの変化でも長さは正",description:"縦の差は $-4$、縦の辺の長さは $4$ です。",xRange:[-2,4],yRange:[-3,3],
   segments:[{from:[-1,2],to:[2,2],dashed:true,label:"横の差 $3$"},{from:[2,2],to:[2,-2],dashed:true,label:"縦の差 $-4$"},{from:[-1,2],to:[2,-2],label:"$AB=5$",width:3}],
   points:[{x:-1,y:2,label:"$A(-1,2)$"},{x:2,y:-2,label:"$B(2,-2)$"}]}
 ],
 "section-points":[
  {title:"内分点と中点の位置",description:"$P$ は $A$ から全体の三分の一、$M$ は半分の位置です。",xRange:[-1,7],yRange:[-2,3],
   segments:[{from:[0,-1],to:[6,2],label:"$AP:PB=1:2$"}],points:[{x:0,y:-1,label:"$A(0,-1)$"},{x:2,y:0,label:"$P(2,0)$"},{x:3,y:.5,label:"$M(3,\\tfrac12)$"},{x:6,y:2,label:"$B(6,2)$"}]},
  {title:"外分点は端点の外",description:"$A$ から $B$ へ進み、同じだけ延長すると $P$ です。$AP$ は $BP$ の二倍です。",xRange:[-2,6],yRange:[-1,7],
   segments:[{from:[-1,0],to:[2,3],label:"$AB=BP$"},{from:[2,3],to:[5,6],dashed:true}],points:[{x:-1,y:0,label:"$A(-1,0)$"},{x:2,y:3,label:"$B(2,3)$"},{x:5,y:6,label:"$P(5,6)$"}]}
 ],
 "line-equations":[
  {title:"横の差に対する縦の差",description:"横に $2$ 進む間に縦へ $4$ 進むので、傾きは $2$ です。",xRange:[-3,3],yRange:[-4,4],
   curves:[{label:"$y=2x$",value:x=>2*x}],segments:[{from:[-1,-2],to:[1,-2],dashed:true},{from:[1,-2],to:[1,2],dashed:true}],points:[{x:-1,y:-2,label:"$A(-1,-2)$"},{x:1,y:2,label:"$B(1,2)$"}]},
  {title:"縦線と横線",description:"縦線は横の座標が一定、横線は縦の座標が一定です。",xRange:[-3,3],yRange:[-3,3],
   segments:[{from:[0,-3],to:[0,3],label:"縦線 $x=0$"}],curves:[{label:"横線 $y=-1$",value:()=>-1}],points:[{x:0,y:-1,label:"両方が通る点 $(0,-1)$"}]}
 ],
 "parallel-perpendicular":[
  {title:"傾きを保って平行にする",description:"二つの直線は同じ方向に伸び、切片が異なります。",xRange:[-4,3],yRange:[-3,7],
   curves:[{label:"元の直線 $y=2x+5$",value:x=>2*x+5,color:blue},{label:"求めた直線 $y=2x+2$",value:x=>2*x+2}],points:[{x:-1,y:0,label:"指定点 $(-1,0)$"}]},
  {title:"傾きの積と直角",description:"横・縦の縮尺をそろえると、二直線が直角に交わることが分かります。",xRange:[-4,4],yRange:[-3,5],
   curves:[{label:"$y=2x+1$",value:x=>2*x+1,color:blue},{label:"$y=-\\tfrac12x+1$",value:x=>-.5*x+1}],points:[{x:0,y:1,label:"交点 $(0,1)$"}]}
 ],
 "point-line-distance":[
  {title:"距離は垂線の長さ",description:"青い線分が、点から直線までの最短の線分です。",xRange:[-2,2],yRange:[-2,2],
   curves:[{label:"$3x+4y+1=0$",value:x=>(-3*x-1)/4}],points:[{x:-1,y:-1,label:"$P(-1,-1)$"},{x:-7/25,y:-1/25,label:"垂足 $H(-\\tfrac7{25},-\\tfrac1{25})$"}],
   segments:[{from:[-1,-1],to:[-7/25,-1/25],width:3,label:"$PH=\\tfrac65$"}]},
  {title:"原点からの距離",description:"直線上のどの点へ向かうかによって長さは変わります。ここでは垂線を使います。",xRange:[-1,2],yRange:[-1,2],tick:.5,
   curves:[{label:"$3x+4y-2=0$",value:x=>(2-3*x)/4}],points:[{x:0,y:0,label:"$P(0,0)$"},{x:6/25,y:8/25,label:"垂足 $H(\\tfrac6{25},\\tfrac8{25})$"}],
   segments:[{from:[0,0],to:[6/25,8/25],width:3,label:"$PH=\\tfrac25$"}]}
 ],
 "circle-equation":[
  {title:"中心から同じ距離にある点",description:"中心から円周までは、どの方向でも半径 $1$ です。",xRange:[-3,1],yRange:[-4,0],
   circles:[{x:-1,y:-2,r:1,label:"$(x+1)^2+(y+2)^2=1$"}],points:[{x:-1,y:-2,label:"中心 $C(-1,-2)$"},{x:0,y:-2,label:"円周上の点 $(0,-2)$"}],segments:[{from:[-1,-2],to:[0,-2],label:"半径 $1$"}]},
  {title:"直径の中点が中心",description:"直径全体は $4$、半径はその半分の $2$ です。",xRange:[-3,3],yRange:[-4,2],
   circles:[{x:0,y:-1,r:2,label:"$x^2+(y+1)^2=4$"}],points:[{x:-2,y:-1,label:"$A(-2,-1)$"},{x:0,y:-1,label:"中心 $(0,-1)$"},{x:2,y:-1,label:"$B(2,-1)$"}],segments:[{from:[-2,-1],to:[2,-1],label:"直径 $AB=4$"}]},
  {title:"三点を通る円",description:"三点は同じ中心から距離 $\\sqrt2$ の位置にあります。",xRange:[-1,3],yRange:[-1,3],
   circles:[{x:1,y:1,r:Math.sqrt(2),label:"$(x-1)^2+(y-1)^2=2$"}],points:[{x:0,y:0,label:"$O(0,0)$"},{x:2,y:0,label:"$A(2,0)$"},{x:0,y:2,label:"$B(0,2)$"},{x:1,y:1,label:"中心 $(1,1)$"}]}
 ],
 "circle-completing-square":[
  {title:"括弧の符号から中心へ",description:"$(x-1)^2+(y+1)^2=1$ の中心は $(1,-1)$ です。",xRange:[-1,3],yRange:[-3,1],
   circles:[{x:1,y:-1,r:1,label:"中心 $(1,-1)$、半径 $1$"}],points:[{x:1,y:-1,label:"中心 $(1,-1)$"}]},
  {title:"右辺は半径の二乗",description:"$(x+1)^2+y^2=4$ なので、半径は $2$ です。",xRange:[-4,2],yRange:[-3,3],
   circles:[{x:-1,y:0,r:2,label:"中心 $(-1,0)$、半径 $2$"}],points:[{x:-1,y:0,label:"中心 $(-1,0)$"}]}
 ],
 "figure-intersections":[
  {title:"両方の直線上にある一点",description:"同じ点の縦の座標を二通りに表すと、連立する式ができます。",xRange:[-2,4],yRange:[-1,5],
   curves:[{label:"$y=x+1$",value:x=>x+1},{label:"$y=-x+3$",value:x=>-x+3,color:blue}],points:[{x:1,y:2,label:"交点 $(1,2)$"}]},
  {title:"同じ縦の座標、二つの交点",description:"$y=1$ を円の式へ入れると、横の座標が二つ求まります。",xRange:[-3,3],yRange:[-3,3],
   circles:[{x:0,y:0,r:Math.sqrt(5),label:"$x^2+y^2=5$"}],curves:[{label:"$y=1$",value:()=>1,color:blue}],points:[{x:-2,y:1,label:"$(-2,1)$"},{x:2,y:1,label:"$(2,1)$"}]}
 ],
 "circle-line-position":[
  {title:"距離が半径より小さい",description:"中心が直線上にあるので距離は $0$。円を横切り、交点が二つあります。",xRange:[-5,3],yRange:[-4,4],
   circles:[{x:-1,y:0,r:3,label:"中心 $(-1,0)$、半径 $3$"}],curves:[{label:"直線 $y=0$",value:()=>0,color:blue}],points:[{x:-4,y:0,label:"交点 $(-4,0)$"},{x:2,y:0,label:"交点 $(2,0)$"}]},
  {title:"距離と半径が等しい",description:"中心から直線までの距離 $3$ が半径と等しく、一点だけを共有します。",xRange:[-4,4],yRange:[-3,5],
   circles:[{x:0,y:1,r:3,label:"中心 $(0,1)$、半径 $3$"}],curves:[{label:"接する直線 $y=4$",value:()=>4,color:blue}],points:[{x:0,y:4,label:"接点 $(0,4)$"},{x:0,y:1,label:"中心 $(0,1)$"}],segments:[{from:[0,1],to:[0,4],label:"距離 $3$"}]}
 ],
 "circle-tangents":[
  {title:"接線は半径に垂直",description:"接点を通るだけでなく、半径と直角をなすことが必要です。",xRange:[-7,5],yRange:[-6,6],
   circles:[{x:-1,y:0,r:5,label:"$(x+1)^2+y^2=25$"}],curves:[{label:"接線 $3x+4y=22$",value:x=>(22-3*x)/4,color:blue}],
   points:[{x:-1,y:0,label:"中心 $(-1,0)$"},{x:2,y:4,label:"接点 $T(2,4)$"}],segments:[{from:[-1,0],to:[2,4],label:"接点に引いた半径"}]},
  {title:"外部の点からの二本",description:"どちらの接線も指定点を通り、中心からの距離は半径 $3$ です。",xRange:[-4,6],yRange:[-4,6],
   circles:[{x:0,y:1,r:3,label:"$x^2+(y-1)^2=9$"}],curves:[{label:"$y-1=\\tfrac34(x-5)$",value:x=>1+.75*(x-5),color:blue},{label:"$y-1=-\\tfrac34(x-5)$",value:x=>1-.75*(x-5),color:blue}],
   points:[{x:5,y:1,label:"$P(5,1)$"},{x:1.8,y:3.4,label:"上の接点 $(\\tfrac95,\\tfrac{17}5)$"},{x:1.8,y:-1.4,label:"下の接点 $(\\tfrac95,-\\tfrac75)$"}],
   segments:[{from:[0,1],to:[1.8,3.4],dashed:true},{from:[0,1],to:[1.8,-1.4],dashed:true}]}
 ],
 "two-circle-position":[
  {title:"和と差の間なら二点で交わる",description:"中心間距離 $4$ は、半径の差 $1$ より大きく、和 $5$ より小さい値です。",xRange:[-4,7],yRange:[-4,4],
   circles:[{x:0,y:0,r:3,label:"中心 $(0,0)$、半径 $3$"},{x:4,y:0,r:2,label:"中心 $(4,0)$、半径 $2$",color:blue}],
   segments:[{from:[0,0],to:[4,0],label:"中心間距離 $d=4$",dashed:true}]},
  {title:"半径の和で外接する",description:"中心間距離 $4$ と半径の和 $3+1$ が一致します。",xRange:[-3,7],yRange:[-4,4],
   circles:[{x:1,y:0,r:3,label:"中心 $(1,0)$、半径 $3$"},{x:5,y:0,r:1,label:"中心 $(5,0)$、半径 $1$",color:blue}],points:[{x:4,y:0,label:"唯一の共有点 $(4,0)$"}]}
 ],
 "circle-common-chord":[
  {title:"共通点を結ぶ直線",description:"太い部分は共通弦。その延長も直線ですが、円上にはありません。",xRange:[-4,4],yRange:[-3,3],
   circles:[{x:-1,y:0,r:Math.sqrt(5),label:"$(x+1)^2+y^2=5$"},{x:1,y:0,r:Math.sqrt(5),label:"$(x-1)^2+y^2=5$",color:blue}],
   segments:[{from:[0,-3],to:[0,3],dashed:true,label:"直線 $x=0$"},{from:[0,-2],to:[0,2],width:4}],points:[{x:0,y:-2,label:"$(0,-2)$"},{x:0,y:2,label:"$(0,2)$"}]},
  {title:"二次の項を消して読む",description:"両方の円の式を満たす点は、差の式 $x=1$ も満たします。",xRange:[-2,4],yRange:[-1,3],
   circles:[{x:0,y:1,r:Math.sqrt(2),label:"$x^2+(y-1)^2=2$"},{x:2,y:1,r:Math.sqrt(2),label:"$(x-2)^2+(y-1)^2=2$",color:blue}],
   segments:[{from:[1,-1],to:[1,3],dashed:true,label:"直線 $x=1$"},{from:[1,0],to:[1,2],width:4}],points:[{x:1,y:0,label:"$(1,0)$"},{x:1,y:2,label:"$(1,2)$"}]}
 ],
 "locus-equations":[
  {title:"等距離の点はどこに並ぶ？",description:"直線上のどの高さの点でも、左右の定点までの距離が等しくなります。",xRange:[-5,1],yRange:[-3,3],
   segments:[{from:[-2,-3],to:[-2,3],width:3,label:"軌跡 $x=-2$"},{from:[-4,0],to:[-2,2],dashed:true},{from:[0,0],to:[-2,2],dashed:true}],
   points:[{x:-4,y:0,label:"$A(-4,0)$"},{x:0,y:0,label:"$B(0,0)$"},{x:-2,y:2,label:"例えば $P(-2,2)$ では $PA=PB$"}]},
  {title:"元の線分と中点の線分",description:"中点では二つの座標がどちらも半分になります。太い線分が中点の軌跡です。",xRange:[-2,2],yRange:[-3,3],
   curves:[{label:"元の動点 $Q$：$y=2x$、$-1\\le x\\le1$",value:x=>2*x,from:-1,to:1,color:blue}],
   segments:[{from:[-.5,-1],to:[.5,1],width:5,color:"#087c70",label:"中点 $P$：$y=2x$、$-\\tfrac12\\le x\\le\\tfrac12$"}],
   points:[{x:-.5,y:-1,label:"中点の軌跡の左端 $(-\\tfrac12,-1)$"},{x:.5,y:1,label:"右端 $(\\tfrac12,1)$"}]},
  {title:"距離の比から円へ",description:"条件から得た円の中心は $(4,0)$、半径は $2$ です。円上の点が元の距離の条件を満たすことも、式で確かめます。",xRange:[-1,7],yRange:[-3,3],
   circles:[{x:4,y:0,r:2,label:"軌跡 $(x-4)^2+y^2=4$"}],points:[{x:0,y:0,label:"$A(0,0)$"},{x:3,y:0,label:"$B(3,0)$"},{x:2,y:0,label:"例えば $(2,0)$：$PA=2$、$PB=1$"},{x:6,y:0,label:"例えば $(6,0)$：$PA=6$、$PB=3$"}]}
 ],
 "chapter-three-check":[
  {title:"直径から円、円から交点へ",description:"中心は直径の中点です。直線 $y=0$ との共有点は、直径の両端と一致します。",xRange:[-2,4],yRange:[-3,3],
   circles:[{x:1,y:0,r:2,label:"$(x-1)^2+y^2=4$"}],curves:[{label:"$y=0$",value:()=>0,color:blue}],points:[{x:-1,y:0,label:"$A(-1,0)$"},{x:1,y:0,label:"中心 $(1,0)$"},{x:3,y:0,label:"$B(3,0)$"}]},
  {title:"中点でも範囲を確かめる",description:"元の点の横の座標が $0$ から $2$ までなら、中点では $0$ から $1$ までです。両端も含みます。",xRange:[-1,3],yRange:[-1,3],
   curves:[{label:"$Q$ の線分：$y=x$、$0\\le x\\le2$",value:x=>x,from:0,to:2,color:blue}],segments:[{from:[0,0],to:[1,1],width:5,label:"$P$ の軌跡：$y=x$、$0\\le x\\le1$"}],points:[{x:0,y:0,label:"$(0,0)$"},{x:1,y:1,label:"$(1,1)$"},{x:2,y:2,label:"元の線分の端 $(2,2)$"}]}
 ],
 "inequality-regions":[
  {title:"境界のどちら側かを試す",description:"点 $(0,2)$ は条件を満たすので、その点を含む上側です。破線上は含みません。",xRange:[-3,3],yRange:[-2,4],
   curves:[{label:"含まない境界 $y=x+1$",value:x=>x+1,dashed:true}],areas:[{from:-3,to:3,upper:()=>4,lower:x=>x+1,label:"色を付けた側が $y>x+1$（画面の外にも続きます）"}],points:[{x:0,y:2,label:"試す点 $(0,2)$"}]},
  {title:"二つの条件の重なり",description:"円の内側と $x\\ge0$ の重なり。円周と直径の端点は含まず、直径の途中は含みます。",xRange:[-3,3],yRange:[-2,4],
   circles:[{x:0,y:1,r:2,label:"含まない円周 $x^2+(y-1)^2=4$",dashed:true}],
   areas:[{from:0,to:2,upper:x=>1+Math.sqrt(4-x*x),lower:x=>1-Math.sqrt(4-x*x),label:"$x^2+(y-1)^2<4$ かつ $x\\ge0$"}],
   segments:[{from:[0,-1],to:[0,3],label:"直径は $-1<y<3$ の部分だけ含む"}],points:[{x:0,y:-1,label:"$(0,-1)$ は除く",open:true},{x:0,y:3,label:"$(0,3)$ は除く",open:true}]}
 ]
};
export default function LessonDiagrams({slug,index}:{slug:string;index:number}){
 const figure=figures[slug]?.[index];
 return figure?<CoordinateDiagram {...figure}/>:<><TrigDiagrams slug={slug} index={index}/><ExponentialDiagrams slug={slug} index={index}/><DerivativeDiagrams slug={slug} index={index}/><IntegralDiagrams slug={slug} index={index}/><Math3FunctionDiagrams slug={slug} index={index}/><Math3LimitDiagrams slug={slug} index={index}/></>;
}
export { figures };
import Math3FunctionDiagrams from "./Math3FunctionDiagrams";
import Math3LimitDiagrams from "./Math3LimitDiagrams";
