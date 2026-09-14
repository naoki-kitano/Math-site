"use client";
import CoordinateDiagram, {type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
const blue="#42648b";
export const exponentialFigures:Record<string,Record<number,Diagram>>={
 "exponential-graph":{
  0:{title:"指数が増えると高さも増える",description:"三つの点は、なめらかな曲線の通り道です。左へ進むほど高さはゼロに近づきますが、ゼロにはなりません。",xRange:[-3,2],yRange:[-1,5],
   curves:[{label:"$y=3^x$（画面の外にも続く）",value:x=>3**x}],points:[{x:-1,y:1/3,label:"$(-1,1/3)$"},{x:0,y:1,label:"$(0,1)$"},{x:1,y:3,label:"$(1,3)$"}]},
  1:{title:"近づく高さも上へ移る",description:"値は減りますが、必ず $2$ より大きいままです。移動後の漸近線は横軸ではありません。",xRange:[-2,4],yRange:[-1,6],
   curves:[{label:"$y=(1/2)^x+2$",value:x=>.5**x+2},{label:"漸近線 $y=2$",value:()=>2,dashed:true,color:blue}],points:[{x:-1,y:4,label:"$(-1,4)$"},{x:0,y:3,label:"$(0,3)$"},{x:1,y:2.5,label:"$(1,5/2)$"}]}
 },
 "exponential-equations":{
  0:{title:"同じ高さになる位置を探す",description:"増加する曲線なので、高さ $8$ になる横の座標は一つだけです。",xRange:[-1,4],yRange:[-1,10],
   curves:[{label:"$y=2^{x+1}$",value:x=>2**(x+1)},{label:"$y=8$",value:()=>8,color:blue}],points:[{x:2,y:8,label:"交点 $(2,8)$、解は $x=2$"}]},
  1:{title:"低くなるのは交点の右側",description:"底が $1$ より小さいので曲線は右下がりです。高さが $1/4$ 以下になるのは $x\\ge3$ の側です。",xRange:[0,6],yRange:[-.5,2.5],tick:.5,
   curves:[{label:"$y=(1/2)^{x-1}$",value:x=>.5**(x-1),color:blue},{label:"条件を満たす部分：$x\\ge3$",value:x=>.5**(x-1),from:3},{label:"境界の高さ $y=1/4$",value:()=>.25,dashed:true,color:blue}],points:[{x:3,y:.25,label:"境界 $(3,1/4)$ を含む"}]}
 },
 "logarithmic-graph":{
  0:{title:"真数を横に、指数を縦に取る",description:"横の座標は正に限られます。縦の座標は、負にもゼロにも正にもなります。",xRange:[-1,5],yRange:[-3,3],
   curves:[{label:"$y=\\log_2 x$、$x>0$",value:x=>Math.log2(x),from:.02}],segments:[{from:[0,-3],to:[0,3],dashed:true,label:"漸近線 $x=0$"}],points:[{x:.5,y:-1,label:"$(1/2,-1)$"},{x:1,y:0,label:"$(1,0)$"},{x:2,y:1,label:"$(2,1)$"}]},
  1:{title:"真数がゼロになる境界も移る",description:"底が $1$ 未満なので右下がりです。定義域は $x>2$ で、左側にはグラフがありません。",xRange:[0,6],yRange:[-3,3],
   curves:[{label:"$y=\\log_{1/2}(x-2)$",value:x=>-Math.log2(x-2),from:2.02}],segments:[{from:[2,-3],to:[2,3],dashed:true,label:"漸近線 $x=2$"}],points:[{x:2.5,y:1,label:"$(5/2,1)$"},{x:3,y:0,label:"$(3,0)$"},{x:4,y:-1,label:"$(4,-1)$"}]}
 },
 "logarithmic-equations":{
  1:{title:"真数条件の内側で高さを比べる",description:"$x>1$ の範囲だけを調べます。曲線が高さ $-1$ 以上になるのは、交点までの左側です。",xRange:[0,5],yRange:[-3,3],
   curves:[{label:"$y=\\log_{1/2}(x-1)$",value:x=>-Math.log2(x-1),from:1.02,color:blue},{label:"解に対応する部分：$1<x\\le3$",value:x=>-Math.log2(x-1),from:1.02,to:3},{label:"$y=-1$",value:()=>-1,dashed:true,color:blue}],
   segments:[{from:[1,-3],to:[1,3],dashed:true,label:"$x=1$ は定義されない"}],points:[{x:3,y:-1,label:"$x=3$ は等号が成り立つので含む"}]}
 },
 "chapter-five-check":{
  0:{title:"小さい底では右へ進むほど低くなる",description:"曲線が境界の高さ以下になるのは、交点の右側です。",xRange:[-1,4],yRange:[-.5,1.5],tick:.5,
   curves:[{label:"$y=(1/3)^{x+1}$",value:x=>(1/3)**(x+1),color:blue},{label:"解に対応する部分：$x\\ge1$",value:x=>(1/3)**(x+1),from:1},{label:"$y=1/9$",value:()=>1/9,dashed:true,color:blue}],points:[{x:1,y:1/9,label:"交点 $(1,1/9)$ を含む"}]}
 }
};
export default function ExponentialDiagrams({slug,index}:{slug:string;index:number}){
 const figure=exponentialFigures[slug]?.[index];return figure?<CoordinateDiagram {...figure}/>:null;
}
