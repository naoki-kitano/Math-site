import CoordinateDiagram, {type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
const blue="#42648b";
export const limitFigures:Record<string,Record<number,Diagram>>={
 "m3-limit-and-value":{
  0:{title:"点が欠けていても、近づく高さは読める",description:"$x\\ne1$ では $y=x+1$。白い点 $(1,2)$ は含まれませんが、左右からの高さは $2$ に近づきます。",xRange:[-1,3],yRange:[-1,5],curves:[{label:"$y=(x^2-1)/(x-1)$（$x\\ne1$）",value:x=>x+1}],points:[{x:1,y:2,open:true,label:"含まれない点 $(1,2)$"}]},
  1:{title:"点の値と、近づく高さ",description:"近くのグラフは前の例と同じですが、$g(1)=5$ と定めています。極限値 $2$ と関数値 $5$ は異なります。",xRange:[-1,3],yRange:[-1,6],curves:[{label:"$g(x)=x+1$（$x\\ne1$）",value:x=>x+1}],points:[{x:1,y:2,open:true,label:"近づく高さは $2$"},{x:1,y:5,label:"実際の点 $(1,5)$"}]}
 },
 "m3-one-sided-limits":{
  0:{title:"左と右で異なる高さ",description:"$x<0$ では $-1$、$x>0$ では $1$。$x=0$ の左右がつながりません。",xRange:[-3,3],yRange:[-2,2],curves:[{label:"$y=|x|/x$：$x<0$",value:()=>-1,to:0},{label:"$x>0$ の部分",value:()=>1,from:0}],points:[{x:0,y:-1,open:true,label:"左極限 $-1$"},{x:0,y:1,open:true,label:"右極限 $1$"}]},
  1:{title:"分母の符号で向きが変わる",description:"縦軸の右では正に大きく、左では負に大きくなります。二つの枝はつながっていません。",xRange:[-3,3],yRange:[-4,4],curves:[{label:"$y=1/x$：$x<0$",value:x=>1/x,to:-.02},{label:"$x>0$ の枝",value:x=>1/x,from:.02}]}
 },
 "m3-limits-at-infinity":{
  1:{title:"正負の無限遠で異なる近づき先",description:"$y=\\sqrt{x^2+1}/x$ は、右の無限遠で $1$、左の無限遠で $-1$ に近づきます。",xRange:[-5,5],yRange:[-3,3],curves:[{label:"$y=\\sqrt{x^2+1}/x$：$x<0$",value:x=>Math.sqrt(x*x+1)/x,to:-.03},{label:"$x>0$ の枝",value:x=>Math.sqrt(x*x+1)/x,from:.03}],segments:[{from:[-5,1],to:[5,1],dashed:true,label:"$y=1$"},{from:[-5,-1],to:[5,-1],dashed:true,label:"$y=-1$"}]}
 },
 "m3-trigonometric-limits":{
  0:{title:"三角形と扇形の面積を比べる",description:"図の角を $\\theta$ とします（図は $\\theta=\\pi/6$）。$0<\\theta<\\pi/2$ で、三角形 $OAB$ の面積 $\\sin\\theta/2$、扇形 $OAB$ の面積 $\\theta/2$、三角形 $OAC$ の面積 $\\tan\\theta/2$ の順に大きくなります。",xRange:[-.2,1.4],yRange:[-.2,1.1],tick:.5,
   arcs:[{x:0,y:0,r:1,from:0,to:Math.PI/6,label:"半径 $1$ の円弧 $AB$"}],
   segments:[{from:[0,0],to:[1,0]},{from:[0,0],to:[1,Math.tan(Math.PI/6)]},{from:[1,0],to:[1,Math.tan(Math.PI/6)],color:blue},{from:[1,0],to:[Math.cos(Math.PI/6),.5],color:blue}],
   points:[{x:0,y:0,label:"$O(0,0)$"},{x:1,y:0,label:"$A(1,0)$"},{x:Math.cos(Math.PI/6),y:.5,label:"$B(\\cos\\theta,\\sin\\theta)$"},{x:1,y:Math.tan(Math.PI/6),label:"$C(1,\\tan\\theta)$"}]}
 },
 "m3-continuity":{
  0:{title:"極限値で点を補う",description:"$f(1)=2$ と定めると、欠けていた点が埋まり、左右からの極限と点の値が一致します。",xRange:[-1,3],yRange:[-1,5],curves:[{label:"補った後のグラフ $y=x+1$",value:x=>x+1}],points:[{x:1,y:2,label:"補った点 $(1,2)$"}]},
  1:{title:"式が切り替わっても、値はつながる",description:"左は $x+1$、右は $2x+1$。両方とも $(0,1)$ へつながります。",xRange:[-2,2],yRange:[-2,5],curves:[{label:"$y=x+1$（$x<0$）",value:x=>x+1,to:0},{label:"$y=2x+1$（$x\\ge0$）",value:x=>2*x+1,from:0,color:blue}],points:[{x:0,y:1,label:"左右の極限と関数値は $1$"}]}
 },
 "m3-intermediate-value":{
  0:{title:"負の値から正の値へ",description:"$f(x)=x^3+x-1$ は $[0,1]$ で連続です。端の値が $-1$ と $1$ なので、途中で高さ $0$ を通ります。",xRange:[-.3,1.3],yRange:[-1.5,1.5],tick:.5,curves:[{label:"$y=x^3+x-1$、$0\\le x\\le1$",value:x=>x*x*x+x-1,from:0,to:1}],points:[{x:0,y:-1,label:"$f(0)=-1$"},{x:1,y:1,label:"$f(1)=1$"}]},
  1:{title:"連続性がなければ、途中で零を通るとは限らない",description:"$y=1/x$ は $x=0$ で定義されません。両端の符号が違っても、この区間には中間値の定理を適用できません。",xRange:[-2,2],yRange:[-3,3],curves:[{label:"$y=1/x$：$x<0$",value:x=>1/x,to:-.02},{label:"$x>0$ の枝",value:x=>1/x,from:.02}],points:[{x:-1,y:-1,label:"$(-1,-1)$"},{x:1,y:1,label:"$(1,1)$"}]}
 }
};
export default function Math3LimitDiagrams({slug,index}:{slug:string;index:number}){
 const figure=limitFigures[slug]?.[index];
 return figure?<CoordinateDiagram {...figure}/>:null;
}
