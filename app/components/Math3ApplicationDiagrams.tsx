import CoordinateDiagram,{type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
const m=String.raw;
const blue="#42648b";
const orange="#a4513a";
export const math3ApplicationFigures:Record<string,Record<number,Diagram>>={
 "m3-tangent-at-point":{0:{title:"対数曲線と接線",description:m`$(1,0)$ で高さと傾きが一致します。接線は $y=x-1$ です。`,xRange:[-0.2,3],yRange:[-2,2],curves:[{label:m`$y=\log x$`,value:Math.log,from:0.08},{label:m`$y=x-1$`,value:x=>x-1,color:blue}],points:[{x:1,y:0,label:m`$(1,0)$`}]}},
 "m3-normal-line":{
 0:{title:"同じ点を通る接線と法線",description:m`接線の傾きは $1$、法線の傾きは $-1$。二つの直線は直交します。`,xRange:[-1.5,1.5],yRange:[-0.5,3],curves:[{label:m`$y=e^x$`,value:Math.exp},{label:m`接線 $y=x+1$`,value:x=>x+1,color:blue},{label:m`法線 $y=-x+1$`,value:x=>1-x,color:orange}],points:[{x:0,y:1,label:m`$(0,1)$`}]},
 1:{title:"水平な接線と鉛直な法線",description:m`$(0,1)$ で接線は $y=1$、法線は $x=0$ です。`,xRange:[-2,2],yRange:[-1,2],curves:[{label:m`$y=\cos x$`,value:Math.cos},{label:m`接線 $y=1$`,value:()=>1,color:blue}],segments:[{from:[0,-1],to:[0,2],label:m`法線 $x=0$`,color:orange}],points:[{x:0,y:1,label:m`$(0,1)$`}]}
 },
 "m3-unknown-contact":{0:{title:"通る点と接点は別",description:m`二つの接線が $(0,-1)$ を通ります。接点は $(1,1)$ と $(-1,1)$ です。`,xRange:[-2,2],yRange:[-2,4],curves:[{label:m`$y=x^2$`,value:x=>x*x},{label:m`$y=2x-1$`,value:x=>2*x-1,color:blue},{label:m`$y=-2x-1$`,value:x=>-2*x-1,color:orange}],points:[{x:0,y:-1,label:m`指定点 $(0,-1)$`},{x:1,y:1,label:m`接点 $(1,1)$`},{x:-1,y:1,label:m`接点 $(-1,1)$`}]}},
 "m3-linear-approximation":{0:{title:"近くの曲線を接線で近似",description:m`$x=4.1$ で接線の高さは $2.025$。曲線の高さに近い値ですが、同じ値ではありません。`,xRange:[2,6],yRange:[1,3],curves:[{label:m`$y=\sqrt{x}$`,value:Math.sqrt},{label:m`接線 $y=\dfrac{x}{4}+1$`,value:x=>x/4+1,color:blue,dashed:true}],points:[{x:4,y:2,label:m`基準点 $(4,2)$`}]}},
 "m3-mean-value-theorem":{0:{title:"平均変化率と同じ傾き",description:m`両端を結ぶ割線の傾きは $2$。$c=1$ での接線も同じ傾きです。`,xRange:[-0.5,2.5],yRange:[-1.5,5],curves:[{label:m`$y=x^2$`,value:x=>x*x},{label:m`割線 $y=2x$`,value:x=>2*x,color:blue},{label:m`接線 $y=2x-1$`,value:x=>2*x-1,color:orange}],points:[{x:0,y:0,label:m`$(0,0)$`},{x:2,y:4,label:m`$(2,4)$`},{x:1,y:1,label:m`$c=1$`}]}},
 "m3-concavity-inflection":{
 0:{title:"傾きが減る側・増える側",description:m`$y=x^3$ は原点の前で上に凸、後で下に凸。増加し続けながら凹凸が変わります。`,xRange:[-1.5,1.5],yRange:[-3,3],curves:[{label:m`$y=x^3$`,value:x=>x*x*x}],points:[{x:0,y:0,label:m`変曲点 $(0,0)$`}]},
 1:{title:"極小点でも変曲点とは限らない",description:m`$y=x^4$ は原点の左右とも下に凸です。原点は極小点ですが、変曲点ではありません。`,xRange:[-1.5,1.5],yRange:[-0.5,3],curves:[{label:m`$y=x^4$`,value:x=>x**4}],points:[{x:0,y:0,label:m`極小点 $(0,0)$`}]}
 },
 "m3-curve-sketch":{
 0:{title:"極大点と変曲点をつなぐ",description:m`$x=1$ で増減が変わり、$x=2$ で凹凸が変わります。右端では正のまま横軸に近づきます。`,xRange:[-0.6,5],yRange:[-0.8,0.8],curves:[{label:m`$y=xe^{-x}$`,value:x=>x*Math.exp(-x)}],points:[{x:1,y:1/Math.E,label:m`極大点 $(1,\dfrac1e)$`},{x:2,y:2/Math.E**2,label:m`変曲点 $(2,\dfrac2{e^2})$`}]},
 1:{title:"原点でつながらない二つの枝",description:m`左右の区間で別々に減少します。$x=0$ は定義域に入らず、変曲点でもありません。`,xRange:[-3,3],yRange:[-3,3],curves:[{label:m`$y=\dfrac1x$（$x<0$）`,value:x=>1/x,to:-0.08},{label:m`$y=\dfrac1x$（$x>0$）`,value:x=>1/x,from:0.08,color:blue}]}
 },
 "m3-roots-existence-count":{1:{title:"極小点の両側に一つずつ",description:m`$y=e^x-x$ は $x=0$ で最小値 $1$。直線 $y=2$ と左右で一度ずつ交わります。`,xRange:[-2.5,1.8],yRange:[0,4],curves:[{label:m`$y=e^x-x$`,value:x=>Math.exp(x)-x},{label:m`$y=2$`,value:()=>2,color:blue}],points:[{x:0,y:1,label:m`最小点 $(0,1)$`}]}},
 "m3-derivative-inequalities":{0:{title:"曲線は接線の下へ出ない",description:m`$e^x\ge1+x$ の等号は $x=0$。図の関係を、差の最小値で証明します。`,xRange:[-2,2],yRange:[-1,4],curves:[{label:m`$y=e^x$`,value:Math.exp},{label:m`$y=1+x$`,value:x=>1+x,color:blue}],points:[{x:0,y:1,label:m`等号の点 $(0,1)$`}]}},
 "m3-optimization-model":{0:{title:"周の長さを二辺の和にする",description:m`図は一例です。二辺の和が $10\,\mathrm{cm}$ なので、面積を $x(10-x)$ と表せます。`,xRange:[-1,8],yRange:[-1,5],segments:[{from:[0,0],to:[6,0],label:m`$(10-x)\,\mathrm{cm}$`},{from:[6,0],to:[6,4],label:m`$x\,\mathrm{cm}$`},{from:[6,4],to:[0,4]},{from:[0,4],to:[0,0]}]}}
};
export default function Math3ApplicationDiagrams({slug,index}:{slug:string;index:number}){
 const figure=math3ApplicationFigures[slug]?.[index];
 return figure?<CoordinateDiagram {...figure}/>:null;
}
