"use client";
import CoordinateDiagram, {type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
const blue="#42648b";
const cubic=(sign:number,shift:number,title:string,description:string):Diagram=>({
 title,description,xRange:[-2.5,2.5],yRange:[-4+shift,4+shift],
 curves:[{label:sign===1?(shift===0?"$y=x^3-3x$":"$y=x^3-3x+"+shift+"$"):"$y=-x^3+3x+"+shift+"$",value:x=>sign*(x*x*x-3*x)+shift}],
 points:[{x:-1,y:2*sign+shift,label:"$(-1,"+(2*sign+shift)+")$"},{x:0,y:shift,label:"縦軸との交点 $(0,"+shift+")$"},{x:1,y:-2*sign+shift,label:"$(1,"+(-2*sign+shift)+")$"}]
});
const interval=(from:number):Diagram=>({
 title:"端点と内部の候補を同じ図で比べる",description:"指定区間の曲線だけをかいています。同じ最大値・最小値をとる点があれば、すべて残します。",
 xRange:[from-.5,2.5],yRange:[-3,3],curves:[{label:"$y=x^3-3x$、$"+from+"\\le x\\le2$",value:x=>x*x*x-3*x,from,to:2}],
 points:(from===0?[0,1,2]:[-2,-1,1,2]).map(x=>({x,y:x*x*x-3*x,label:"$("+x+","+(x*x*x-3*x)+")$"}))
});
const flat:Diagram={title:"水平でも、増加から減少には変わらない",description:"原点を通過するときに接線は水平になりますが、その前後とも右上がりです。",
 xRange:[-2,2],yRange:[-3,3],curves:[{label:"$y=x^3$",value:x=>x*x*x},{label:"原点での接線 $y=0$",value:()=>0,dashed:true,color:blue}],points:[{x:0,y:0,label:"$(0,0)$ は極値をとる点ではない"}]};
export const derivativeFigures:Record<string,Record<number,Diagram>>={
 "average-rate":{
  0:{title:"両端を結ぶ直線の傾き",description:"曲線の途中の傾きではなく、二点を結ぶ直線の傾きです。横の差で縦の差を割ります。",xRange:[0,4],yRange:[0,10],
   curves:[{label:"$y=x^2$",value:x=>x*x},{label:"二点を結ぶ直線 $y=4x-3$",value:x=>4*x-3,color:blue}],
   points:[{x:1,y:1,label:"$A(1,1)$"},{x:3,y:9,label:"$B(3,9)$"}],segments:[{from:[1,1],to:[3,1],dashed:true,label:"横の変化量 $2$"},{from:[3,1],to:[3,9],dashed:true,label:"縦の変化量 $8$、平均変化率 $8/2=4$"}]},
  1:{title:"両端では高さが下がっている",description:"曲線は途中で上がり始めますが、平均変化率では両端の高さだけを比べます。",xRange:[-3,2],yRange:[0,7],
   curves:[{label:"$y=x^2+1$",value:x=>x*x+1},{label:"二点を結ぶ直線 $y=-x+3$",value:x=>-x+3,color:blue}],points:[{x:-2,y:5,label:"$(-2,5)$"},{x:1,y:2,label:"$(1,2)$"}],segments:[{from:[-2,5],to:[1,5],dashed:true,label:"横の差 $3$"},{from:[1,5],to:[1,2],dashed:true,label:"縦の差 $-3$、平均変化率 $-1$"}]}
 },
 "derivative-at-point":{
  0:{title:"両側から接点へ近づける",description:"動かす点が左右どちらから近づいても、二点を結ぶ直線の傾きは $4$ に近づきます。幅はゼロにせず、近づけます。",xRange:[0,4],yRange:[0,10],
   curves:[{label:"$y=x^2$",value:x=>x*x},{label:"$h=1$ の直線：傾き $5$",value:x=>5*x-6,dashed:true,color:blue},{label:"$h=-1/2$ の直線：傾き $7/2$",value:x=>3.5*x-3,dashed:true,color:blue},{label:"接線 $y=4x-4$：傾き $4$",value:x=>4*x-4,color:"#0b1f3a"}],
   points:[{x:2,y:4,label:"固定する点 $(2,4)$"},{x:3,y:9,label:"$h=1$ の点 $(3,9)$"},{x:1.5,y:2.25,label:"$h=-1/2$ の点 $(3/2,9/4)$"}]},
  1:{title:"高さと傾きは別の値",description:"接点の高さは $2$ ですが、その点での傾きは $-2$ です。右へ進むと下がる向きに接線を引きます。",xRange:[-3,2],yRange:[-1,6],
   curves:[{label:"$y=x^2+1$",value:x=>x*x+1},{label:"接線 $y=-2x$",value:x=>-2*x,color:blue}],points:[{x:-1,y:2,label:"$(-1,2)$、$f(-1)=2$、$f'(-1)=-2$"}]}
 },
 "derivative-function":{
  0:{title:"導関数の高さが、元の曲線の傾き",description:"同じ横の値を二つの式へ入れます。元の関数の高さと、導関数の高さを区別します。",xRange:[-2,4],yRange:[-4,10],
   curves:[{label:"元の関数 $y=x^2$",value:x=>x*x},{label:"導関数のグラフ $y=2x$",value:x=>2*x,color:blue}],points:[{x:3,y:9,label:"元の関数の高さ $f(3)=9$"},{x:3,y:6,label:"導関数の高さ $f'(3)=6$（元の曲線の傾き）"}]},
  1:{title:"高さを上げても、傾きは変わらない",description:"元の曲線を上へ動かしても、各点での進む向きは変わりません。",xRange:[-2,3],yRange:[-4,7],
   curves:[{label:"$y=x^2+2$",value:x=>x*x+2},{label:"導関数 $y=2x$",value:x=>2*x,color:blue}],points:[{x:-1,y:3,label:"$f(-1)=3$"},{x:-1,y:-2,label:"$f'(-1)=-2$"}]}
 },
 "tangent-line":{
  0:{title:"点の高さと接線の傾きを合わせる",description:"接線は点 $(2,5)$ を通り、傾きは $4$ です。高さの $5$ を傾きに使わないようにします。",xRange:[-1,4],yRange:[-1,10],
   curves:[{label:"$y=x^2+1$",value:x=>x*x+1},{label:"接線 $y=4x-3$",value:x=>4*x-3,color:blue}],points:[{x:2,y:5,label:"接点 $(2,5)$"}]},
  1:{title:"傾きゼロなら横の直線",description:"谷の点では接線が水平です。接点の高さもゼロなので、接線は横軸と一致します。",xRange:[-2,4],yRange:[-1,5],
   curves:[{label:"$y=(x-1)^2$",value:x=>(x-1)**2},{label:"接線 $y=0$",value:()=>0,color:blue}],points:[{x:1,y:0,label:"接点 $(1,0)$"}]}
 },
 "derivative-sign":{
  0:cubic(1,0,"正・負・正を、上がる・下がる・上がるへ","横軸より上か下かではなく、右へ進むときの向きを見ます。"),
  1:cubic(-1,1,"係数の負号で増減が逆になる","左では減少、中央では増加、右では減少です。")
 },
 "local-extrema":{
  0:cubic(1,0,"山と谷の高さを元の式で読む","山の横の値は $-1$、高さは $2$。谷の横の値は $1$、高さは $-2$ です。"),
  1:{...flat,title:"水平でも極値とは限らない",description:"$(0,1)$ で接線が水平ですが、両側とも増加しているため極値ではありません。",curves:[{label:"$y=x^3+1$",value:x=>x*x*x+1},{label:"接線 $y=1$",value:()=>1,dashed:true,color:blue}],points:[{x:0,y:1,label:"$(0,1)$"}]}
 },
 "graph-sketch":{
  0:cubic(1,0,"増減表と曲線を照合する","表の上がり下がりと曲線の向きをそろえ、山と谷を正しい高さに置きます。"),
  1:cubic(-1,1,"左上から右下へ伸びる曲線","山と谷を逆にしないよう、導関数の符号と高さを別々に確認します。"),
  2:flat
 },
 "closed-interval-extrema":{0:interval(0),1:interval(-2)},
 "derivative-applications":{
  0:cubic(1,1,"単調な区間ごとに交点を数える","山は横軸より上、谷は横軸より下です。三つの単調な区間で、一度ずつ横軸を横切ります。"),
  1:{title:"増加する関数で高さを比べる",description:"グラフは全体で右上がりです。高さ $2$ 以上になるのは、交点の右側だけです。",xRange:[-2,2],yRange:[-4,5],
   curves:[{label:"$y=x^3+x$",value:x=>x*x*x+x},{label:"$y=2$",value:()=>2,color:blue}],points:[{x:1,y:2,label:"境界 $(1,2)$、解は $x\\ge1$"}]},
  2:{title:"指定された範囲で最も低い点を見る",description:"$x\\ge0$ の曲線は、いったん下がり、$x=1$ から上がります。最小値がゼロなので、全範囲で負にはなりません。",xRange:[-.5,3],yRange:[-1,5],
   curves:[{label:"$y=x^3-3x+2$、$x\\ge0$",value:x=>x*x*x-3*x+2,from:0}],points:[{x:0,y:2,label:"端点 $(0,2)$"},{x:1,y:0,label:"最小の点 $(1,0)$、等号は $x=1$ のみ"}]}
 },
 "chapter-six-check":{
  0:{title:"接点で高さと向きが一致する",description:"接点は元の関数から、傾きは導関数から求めます。",xRange:[-3,2],yRange:[-1,6],curves:[{label:"$y=x^2+1$",value:x=>x*x+1},{label:"接線 $y=-2x$",value:x=>-2*x,color:blue}],points:[{x:-1,y:2,label:"接点 $(-1,2)$、傾き $-2$"}]},
  1:interval(-2)
 }
};
export default function DerivativeDiagrams({slug,index}:{slug:string;index:number}){
 const figure=derivativeFigures[slug]?.[index];return figure?<CoordinateDiagram {...figure}/>:null;
}
