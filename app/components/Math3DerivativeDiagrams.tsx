import CoordinateDiagram, {type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
const m=String.raw;
const blue="#42648b";
export const math3DerivativeFigures:Record<string,Record<number,Diagram>>={
 "m3-derivative-meaning":{
  0:{title:"割線から接線へ",description:m`$y=x^2$ の点 $(1,1)$ と $(1+h,(1+h)^2)$ を結ぶ割線です。図では $h=\frac{1}{2}$。割線の傾きは $2+h$、$h\to0$ で接線の傾き $2$ に近づきます。`,xRange:[0,2],yRange:[0,4],tick:.5,
   curves:[{label:m`$y=x^2$`,value:x=>x*x},{label:m`割線：$y=\frac52x-\frac32$`,value:x=>2.5*x-1.5,color:blue,dashed:true},{label:m`接線：$y=2x-1$`,value:x=>2*x-1,color:"#a4513a"}],
   points:[{x:1,y:1,label:m`$(1,1)$`},{x:1.5,y:2.25,label:m`$(\frac32,\frac94)$`}]},
  1:{title:"点の高さと接線の傾き",description:m`点の高さは $3$。接線上では横に $\frac{1}{2}$ 進むと縦に $2$ 進むので、傾きは $4$ です。`,xRange:[0,3],yRange:[-1,7],
   curves:[{label:m`$y=x^2-1$`,value:x=>x*x-1},{label:m`接線：$y=4x-5$`,value:x=>4*x-5,color:blue}],
   segments:[{from:[2,3],to:[2.5,3],dashed:true,label:m`横の差 $\frac{1}{2}$`},{from:[2.5,3],to:[2.5,5],dashed:true,label:m`縦の差 $2$`}],
   points:[{x:2,y:3,label:m`$(2,3)$`}]}
 },
 "m3-differentiability":{
  0:{title:"つながっていても、傾きはそろわない",description:m`$y=|x|$ は原点で連続です。しかし左側の傾きは $-1$、右側は $1$ なので、原点で一つの傾きを定められません。`,xRange:[-2,2],yRange:[-1,3],
   curves:[{label:m`$y=-x$（$x\le0$）`,value:x=>-x,to:0},{label:m`$y=x$（$x\ge0$）`,value:x=>x,from:0,color:blue}],points:[{x:0,y:0,label:m`原点 $(0,0)$`}]},
  1:{title:"絶対値があっても傾きはつながる",description:m`$y=x|x|$ の原点での差商は $|h|$。左右どちらからも $0$ に近づくので、原点の接線は横向きです。`,xRange:[-2,2],yRange:[-3,3],
   curves:[{label:m`$y=x|x|$`,value:x=>x*Math.abs(x)},{label:m`接線 $y=0$`,value:()=>0,color:blue,dashed:true}],points:[{x:0,y:0,label:m`$(0,0)$、傾き $0$`}]}
 },
 "m3-implicit-derivative":{
  0:{title:"円上の点と接線",description:m`$(\frac{3}{5},\frac{4}{5})$ は上側の円弧上です。半径と直交する接線の傾きは $-\frac{3}{4}$ で、関係式の微分と一致します。`,xRange:[-1.5,1.5],yRange:[-1.5,1.5],tick:.5,
   circles:[{x:0,y:0,r:1,label:m`$x^2+y^2=1$`}],curves:[{label:m`接線 $y=-\frac34x+\frac54$`,value:x=>-.75*x+1.25,color:blue}],
   segments:[{from:[0,0],to:[.6,.8],dashed:true,label:"半径"}],points:[{x:.6,y:.8,label:m`$(\frac35,\frac45)$`}]}
 },
 "m3-inverse-derivative":{
  0:{title:"対応する点も入れ替わる",description:m`$y=x^2$ の $(2,4)$ と、逆関数 $y=\sqrt{x}$ の $(4,2)$。二つのグラフは直線 $y=x$ に関して対称で、対応する傾きは $4$ と $\frac{1}{4}$ です。`,xRange:[-.5,5],yRange:[-.5,5],
   curves:[{label:m`$y=x^2$（$x>0$）`,value:x=>x*x,from:0},{label:m`逆関数 $y=\sqrt{x}$（$x>0$）`,value:x=>Math.sqrt(x),from:0,color:blue},{label:m`$y=x$`,value:x=>x,dashed:true,color:"#8a929d"}],
   points:[{x:0,y:0,open:true,label:m`$0$ は含まない`},{x:2,y:4,label:m`$(2,4)$、傾き $4$`},{x:4,y:2,label:m`$(4,2)$、傾き $\frac{1}{4}$`}]}
 },
 "m3-parametric-derivative":{
  1:{title:"二つの座標の変化を比べる",description:m`$t=\frac{\pi}{4}$ で点は $(\frac{1}{\sqrt{2}},\frac{1}{\sqrt{2}})$。横の変化率は負、縦は正で、大きさが等しいため接線の傾きは $-1$ です。`,xRange:[-1.5,1.5],yRange:[-1.5,1.5],tick:.5,
   circles:[{x:0,y:0,r:1,label:m`$x=\cos t,\ y=\sin t$`}],curves:[{label:m`接線 $y=-x+\sqrt2$`,value:x=>-x+Math.SQRT2,color:blue}],points:[{x:Math.SQRT1_2,y:Math.SQRT1_2,label:m`$t=\frac{\pi}{4}$ の点`}]}
 }
};
export default function Math3DerivativeDiagrams({slug,index}:{slug:string;index:number}){
 const figure=math3DerivativeFigures[slug]?.[index];
 return figure?<CoordinateDiagram {...figure}/>:null;
}
