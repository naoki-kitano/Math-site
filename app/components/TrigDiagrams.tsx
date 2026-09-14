"use client";
import CoordinateDiagram, {type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
const pi=Math.PI,blue="#42648b";
const unit={xRange:[-1.4,1.4] as [number,number],yRange:[-1.4,1.4] as [number,number],tick:.5,circles:[{x:0,y:0,r:1,label:"単位円 $x^2+y^2=1$"}]};
const circlePoint=(a:number,label:string)=>({x:Math.cos(a),y:Math.sin(a),label});
const quarterTicks=[{value:0,label:"$0$"},{value:pi/2,label:"$\\pi/2$"},{value:pi,label:"$\\pi$"},{value:3*pi/2,label:"$3\\pi/2$"},{value:2*pi,label:"$2\\pi$"}];
const figures:Record<string,Diagram[]>={
 "trig-radians":[
  {title:"半周を基準に角を直す",description:"$150^\\circ$ は $180^\\circ$ の $5/6$ 倍なので、弧も半円の $5/6$ です。",...unit,
   arcs:[{x:0,y:0,r:1,from:0,to:5*pi/6,label:"$150^\\circ=5\\pi/6\\,\\mathrm{rad}$",width:5}],segments:[{from:[0,0],to:[1,0]},{from:[0,0],to:[-Math.sqrt(3)/2,.5]}],points:[circlePoint(5*pi/6,"終辺と単位円の交点")]},
  {title:"円の三分の一の扇形",description:"中心角 $120^\\circ$ は一周の三分の一。弧長も面積も、円全体の三分の一です。",xRange:[-4,4],yRange:[-4,4],
   circles:[{x:0,y:0,r:3,label:"半径 $3\\,\\mathrm{cm}$ の円"}],arcs:[{x:0,y:0,r:3,from:0,to:2*pi/3,label:"弧長 $2\\pi\\,\\mathrm{cm}$",width:5}],segments:[{from:[0,0],to:[3,0]},{from:[0,0],to:[-1.5,3*Math.sqrt(3)/2],label:"二本の半径と弧で囲む面積は $3\\pi\\,\\mathrm{cm}^2$"}]}
 ],
 "trig-unit-circle":[
  {title:"横が余弦、縦が正弦",description:"横は負、縦は正です。正接は縦を横で割るので負になります。",...unit,
   points:[{x:-.6,y:.8,label:"$P(-3/5,4/5)$"}],segments:[{from:[0,0],to:[-.6,.8],label:"半径 $1$"},{from:[0,0],to:[-.6,0],label:"$\\cos\\theta=-3/5$"},{from:[-.6,0],to:[-.6,.8],dashed:true,label:"$\\sin\\theta=4/5$"}]},
  {title:"横がゼロのときの正接",description:"真上の点では余弦がゼロです。正接を求めようとするとゼロで割ることになるため、定義されません。",...unit,
   segments:[{from:[0,0],to:[0,1]}],points:[{x:0,y:1,label:"$P(0,1)$：$\\cos(\\pi/2)=0$、$\\sin(\\pi/2)=1$"}]}
 ],
 "trig-angle-change":[
  {title:"縦は同じ、横は反対",description:"$\\pi/6$ の点を縦軸について反転すると、$5\\pi/6$ の点です。",...unit,
   points:[circlePoint(pi/6,"$\\pi/6$：$(\\sqrt3/2,1/2)$"),circlePoint(5*pi/6,"$5\\pi/6$：$(-\\sqrt3/2,1/2)$")],
   segments:[{from:[-Math.sqrt(3)/2,.5],to:[Math.sqrt(3)/2,.5],dashed:true,label:"正弦はともに $1/2$"}]},
  {title:"余角では横と縦が入れ替わる",description:"直線 $y=x$ に関して対称な二点を見ます。元の横の座標が、余角の縦の座標になります。",...unit,
   curves:[{label:"対称の軸 $y=x$",value:x=>x,dashed:true,color:blue}],points:[{x:.6,y:.8,label:"元の角：$(3/5,4/5)$"},{x:.8,y:.6,label:"余角：$(4/5,3/5)$"}]}
 ],
 "trig-identities":[
  {title:"平方根の候補から象限で選ぶ",description:"同じ縦の座標でも横には正負の二候補があります。第二象限の条件があるので左側を選びます。",...unit,
   curves:[{label:"$y=3/5$",value:()=>.6,color:blue}],points:[{x:-.8,y:.6,label:"選ぶ点 $(-4/5,3/5)$"},{x:.8,y:.6,label:"第一象限の候補は条件外",open:true}]},
  {title:"平方和の関係に戻る",description:"正弦と余弦は単位円の縦と横です。円の式から平方和が $1$ と分かります。約分には、正弦がゼロでない条件が必要です。",...unit,
   segments:[{from:[0,0],to:[.8,.6],label:"斜辺 $1$"},{from:[0,0],to:[.8,0],label:"横 $\\cos\\theta$"},{from:[.8,0],to:[.8,.6],label:"縦 $\\sin\\theta$"}],points:[{x:.8,y:.6,label:"第一象限の点で図示（平方和は全象限で成立）"}]}
 ],
 "trig-graphs":[
  {title:"中心を上げて、縦を二倍にする",description:"中心は $y=1$、そこから上下へ $2$ ずつ振れます。一周分の横の長さは変わりません。",xRange:[-.5,2*pi+.5],yRange:[-2,4],xTicks:quarterTicks,
   curves:[{label:"$y=2\\sin x+1$",value:x=>2*Math.sin(x)+1,from:0,to:2*pi},{label:"中心 $y=1$",value:()=>1,dashed:true,color:blue}],points:quarterTicks.map(t=>({x:t.value,y:2*Math.sin(t.value)+1,label:t.label+" で $y="+Math.round(2*Math.sin(t.value)+1)+"$"}))},
  {title:"漸近線ではつながない",description:"$x=-\\pi/4,\\pi/4$ では定義されません。その左右は別の枝としてかきます。",xRange:[-pi/2,pi/2],yRange:[-3,3],
   xTicks:[{value:-pi/2,label:"$-\\pi/2$"},{value:-pi/4,label:"$-\\pi/4$"},{value:0,label:"$0$"},{value:pi/4,label:"$\\pi/4$"},{value:pi/2,label:"$\\pi/2$"}],
   curves:[{label:"$y=\\tan(2x)$、周期 $\\pi/2$",value:x=>Math.tan(2*x),from:-pi/2,to:-pi/4-.001},{label:"中央の枝",value:x=>Math.tan(2*x),from:-pi/4+.001,to:pi/4-.001},{label:"右の枝",value:x=>Math.tan(2*x),from:pi/4+.001,to:pi/2}],
   segments:[{from:[-pi/4,-3],to:[-pi/4,3],dashed:true,label:"漸近線 $x=-\\pi/4$"},{from:[pi/4,-3],to:[pi/4,3],dashed:true,label:"漸近線 $x=\\pi/4$"}]}
 ],
 "trig-equations":[
  {title:"同じ高さに二つの点",description:"上半円で縦の座標が $\\sqrt3/2$ になる点を二つ探します。",...unit,
   curves:[{label:"$y=\\sqrt3/2$",value:()=>Math.sqrt(3)/2,color:blue}],points:[circlePoint(pi/3,"$\\theta=\\pi/3$"),circlePoint(2*pi/3,"$\\theta=2\\pi/3$")]},
  {title:"二周分の角を調べる",description:"$u=2\\theta$ は $0\\le u<4\\pi$。横軸上の点に来る角を、二周分数えます。$4\\pi$ は含みません。",...unit,
   points:[{x:1,y:0,label:"右端：$u=0,2\\pi$"},{x:-1,y:0,label:"左端：$u=\\pi,3\\pi$"}],arcs:[{x:0,y:0,r:1,from:0,to:2*pi,label:"最後に二で割る：$\\theta=0,\\pi/2,\\pi,3\\pi/2$"}]}
 ],
 "trig-inequalities":[
  {title:"二点ではなく、その間の弧",description:"縦の座標が $1/2$ 以上になる上側の弧を選びます。等号があるので両端も含みます。",...unit,
   curves:[{label:"境界の高さ $y=1/2$",value:()=>.5,dashed:true,color:blue}],arcs:[{x:0,y:0,r:1,from:pi/6,to:5*pi/6,label:"$\\pi/6\\le\\theta\\le5\\pi/6$",width:6}],points:[circlePoint(pi/6,"角の範囲の下端 $\\pi/6$"),circlePoint(5*pi/6,"角の範囲の上端 $5\\pi/6$")]},
  {title:"傾きが一より大きい弧",description:"第一象限と第三象限で、縦を横で割った値が $1$ より大きくなります。縦軸上では正接が定義されません。",...unit,
   curves:[{label:"境界の傾き $y=x$",value:x=>x,dashed:true,color:blue}],arcs:[{x:0,y:0,r:1,from:pi/4,to:pi/2,label:"$\\pi/4<\\theta<\\pi/2$",width:6},{x:0,y:0,r:1,from:5*pi/4,to:3*pi/2,label:"$5\\pi/4<\\theta<3\\pi/2$",width:6}],points:[pi/4,pi/2,5*pi/4,3*pi/2].map(a=>({...circlePoint(a,"白丸は含まない端点"),open:true}))}
 ],
 "trig-addition":[
  {title:"知っている角を足す",description:"$5\\pi/12=\\pi/4+\\pi/6$。四十五度の方向から、さらに三十度だけ回した点です。",...unit,
   segments:[{from:[0,0],to:[Math.SQRT1_2,Math.SQRT1_2],dashed:true},{from:[0,0],to:[Math.cos(5*pi/12),Math.sin(5*pi/12)]}],arcs:[{x:0,y:0,r:.5,from:pi/4,to:5*pi/12,label:"追加の角 $\\pi/6$"}],points:[circlePoint(5*pi/12,"求める縦の座標 $\\sin(5\\pi/12)$")]},
  {title:"知っている角の差にする",description:"$\\pi/12=\\pi/4-\\pi/6$。角を引いても、三角関数の値をそのまま引くことはできません。",...unit,
   segments:[{from:[0,0],to:[Math.SQRT1_2,Math.SQRT1_2],dashed:true},{from:[0,0],to:[Math.cos(pi/12),Math.sin(pi/12)]}],arcs:[{x:0,y:0,r:.5,from:pi/12,to:pi/4,label:"差し引く角 $\\pi/6$"}],points:[circlePoint(pi/12,"この半径の傾きが $\\tan(\\pi/12)$")]}
 ],
 "trig-double-half":[
  {title:"角を二倍にしても座標は二倍ではない",description:"元の点も二倍角の点も単位円上です。二倍角の公式から、新しい横と縦を求めます。",...unit,
   points:[{x:.8,y:.6,label:"元の角：$(4/5,3/5)$"},{x:.28,y:.96,label:"二倍角：$(7/25,24/25)$"}],segments:[{from:[0,0],to:[.8,.6]},{from:[0,0],to:[.28,.96],color:blue}]},
  {title:"半分にした角の象限を見る",description:"元の角は下半円、半角は第二象限です。したがって半角の正弦は正、余弦は負です。",...unit,
   points:[{x:-.6,y:-.8,label:"元の角：$(-3/5,-4/5)$"},{x:-1/Math.sqrt(5),y:2/Math.sqrt(5),label:"半角：$(-\\sqrt5/5,2\\sqrt5/5)$"}],segments:[{from:[0,0],to:[-.6,-.8],color:blue},{from:[0,0],to:[-1/Math.sqrt(5),2/Math.sqrt(5)]}]}
 ],
 "trig-synthesis":[
  {title:"係数を半径で割って角を決める",description:"係数の組 $(\\sqrt3,1)$ を長さ $2$ で割ると単位円上の点になります。横が余弦、縦が正弦なので、角は $\\pi/6$ です。",...unit,
   points:[circlePoint(pi/6,"$(\\cos\\varphi,\\sin\\varphi)=(\\sqrt3/2,1/2)$")],segments:[{from:[0,0],to:[Math.sqrt(3)/2,.5],label:"$\\sqrt3\\sin\\theta+\\cos\\theta=2\\sin(\\theta+\\pi/6)$"}]},
  {title:"指定された区間だけを見る",description:"この区間では頂点を通りますが、波の最下点までは進みません。最小値は両端の $1$ です。横軸には元の角を取ります。",xRange:[-.2,pi/2+.2],yRange:[0,1.8],
   xTicks:[{value:0,label:"$0$"},{value:pi/4,label:"$\\pi/4$"},{value:pi/2,label:"$\\pi/2$"}],tick:.5,
   curves:[{label:"$y=\\sin x+\\cos x$、$0\\le x\\le\\pi/2$",value:x=>Math.sin(x)+Math.cos(x),from:0,to:pi/2}],points:[{x:0,y:1,label:"左端 $(0,1)$"},{x:pi/4,y:Math.sqrt(2),label:"最大の点 $(\\pi/4,\\sqrt2)$"},{x:pi/2,y:1,label:"右端 $(\\pi/2,1)$"}]},
  {title:"元の角の範囲で交点を確かめる",description:"合成した波が高さ $1$ になる位置を見ます。右端の $2\\pi$ は指定範囲に含まれません。横軸は元の角です。",xRange:[-.5,2*pi+.5],yRange:[-2,2],xTicks:quarterTicks,
   curves:[{label:"$y=\\sin x+\\cos x$",value:x=>Math.sin(x)+Math.cos(x),from:0,to:2*pi},{label:"$y=1$",value:()=>1,color:blue}],points:[{x:0,y:1,label:"解 $0$"},{x:pi/2,y:1,label:"解 $\\pi/2$"},{x:2*pi,y:1,label:"$2\\pi$ は範囲外",open:true}]}
 ],
 "chapter-four-check":[
  {title:"余弦は横の座標で判断する",description:"横の座標が $1/2$ 以上の弧を選びます。角がゼロをまたぐので、指定範囲では二つの区間に分けて答えます。",...unit,
   segments:[{from:[.5,-1.4],to:[.5,1.4],dashed:true,label:"境界 $x=1/2$"}],arcs:[{x:0,y:0,r:1,from:0,to:pi/3,label:"$0\\le\\theta\\le\\pi/3$",width:6},{x:0,y:0,r:1,from:5*pi/3,to:2*pi,label:"$5\\pi/3\\le\\theta<2\\pi$",width:6}],points:[circlePoint(pi/3,"境界の角 $\\pi/3$"),circlePoint(5*pi/3,"境界の角 $5\\pi/3$"),{x:1,y:0,label:"角 $0$ は含む（$2\\pi$ は範囲外）"}]},
  {title:"半角の余弦は負を選ぶ",description:"半角は第二象限です。平方根の正の値ではなく、左側の座標を答えます。",...unit,
   points:[{x:-1/3,y:2*Math.sqrt(2)/3,label:"半角の点 $(-1/3,2\\sqrt2/3)$"}],segments:[{from:[0,0],to:[-1/3,2*Math.sqrt(2)/3]},{from:[-1/3,0],to:[-1/3,2*Math.sqrt(2)/3],dashed:true},{from:[0,0],to:[-1/3,0],width:4,label:"横の座標 $\\cos(\\theta/2)=-1/3$"}]}
 ]
};
export {figures as trigFigures};
export default function TrigDiagrams({slug,index}:{slug:string;index:number}){
 const figure=figures[slug]?.[index];return figure?<CoordinateDiagram {...figure}/>:null;
}
