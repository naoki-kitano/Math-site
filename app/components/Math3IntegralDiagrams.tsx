import CoordinateDiagram,{type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
const m=String.raw;
export const math3IntegralFigures:Record<string,Record<number,Diagram>>={
 "m3-antiderivative-constant":{0:{title:"高さが違っても傾きは同じ",description:m`$x^2+C$ は上下に平行移動した曲線です。同じ横の座標での傾きは、どれも $2x$ です。`,xRange:[-2,2],yRange:[-3,6],curves:[
 {label:m`$y=x^2$`,value:x=>x*x},{label:m`$y=x^2+2$`,value:x=>x*x+2,color:"#42648b"},{label:m`$y=x^2-2$`,value:x=>x*x-2,color:"#a4513a"}]}},
 "m3-trig-substitution":{
 0:{title:"右半円で余弦を正にする",description:m`$x=\sin\theta$ と置くと、単位円の点は $(\cos\theta,\sin\theta)=(\sqrt{1-x^2},x)$。指定した角の範囲では右半円上にあり、余弦は正です。図は $\theta=\dfrac\pi6$ の例です。`,xRange:[-1.4,1.4],yRange:[-1.4,1.4],tick:0.5,
 axisDescription:m`横は $\cos\theta$、縦は $\sin\theta=x$。`,
 circles:[{x:0,y:0,r:1,label:"単位円"}],arcs:[{x:0,y:0,r:1,from:-Math.PI/2,to:Math.PI/2,label:m`$-\dfrac\pi2<\theta<\dfrac\pi2$`}],
 segments:[{from:[0,0],to:[Math.sqrt(3)/2,0.5],label:"半径"},{from:[0,0],to:[Math.sqrt(3)/2,0],label:m`$\cos\theta=\sqrt{1-x^2}$`,dashed:true},{from:[Math.sqrt(3)/2,0],to:[Math.sqrt(3)/2,0.5],label:m`$\sin\theta=x$`,dashed:true}],
 points:[{x:Math.sqrt(3)/2,y:0.5,label:m`$(\dfrac{\sqrt3}2,\dfrac12)$`},{x:0,y:1,open:true,label:"端は含まない"},{x:0,y:-1,open:true,label:"端は含まない"}]},
 1:{title:"上半円の高さを根号で表す",description:m`$y=\sqrt{1-x^2}$ は上半円です。被積分関数の分母がゼロになるため、ここでは両端を除きます。`,xRange:[-1.3,1.3],yRange:[-0.3,1.3],tick:0.5,
 curves:[{label:m`$y=\sqrt{1-x^2}$（$-1<x<1$）`,value:x=>Math.sqrt(1-x*x),from:-1,to:1}],points:[{x:-1,y:0,open:true,label:m`$(-1,0)$ は除く`},{x:1,y:0,open:true,label:m`$(1,0)$ は除く`}]}
 }
};
export default function Math3IntegralDiagrams({slug,index}:{slug:string;index:number}){
 const figure=math3IntegralFigures[slug]?.[index];
 return figure?<CoordinateDiagram {...figure}/>:null;
}
