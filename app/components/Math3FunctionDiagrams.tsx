import CoordinateDiagram, { type CoordinateDiagramProps as Diagram } from "./CoordinateDiagram";
const blue="#42648b";
export const math3Figures:Record<string,Record<number,Diagram>>={
 "m3-domain-range":{
  0:{title:"横と縦、それぞれの範囲",description:"始点 $(1,0)$ を含み、右上へ続きます。横の範囲は $x\\ge1$、縦の範囲は $y\\ge0$ です。",xRange:[-1,6],yRange:[-1,4],curves:[{label:"$y=\\sqrt{x-1}$",value:x=>Math.sqrt(x-1),from:1}],points:[{x:1,y:0,label:"始点 $(1,0)$"}]},
  1:{title:"端だけでなく、途中の高さも見る",description:"$-1\\le x\\le2$ の部分だけを描いています。最も低い点は途中の $(0,0)$、最も高い点は端の $(2,4)$ です。",xRange:[-2,3],yRange:[-1,5],curves:[{label:"$y=x^2$、$-1\\le x\\le2$",value:x=>x*x,from:-1,to:2}],points:[{x:-1,y:1,label:"左端 $(-1,1)$"},{x:0,y:0,label:"最小値 $0$"},{x:2,y:4,label:"最大値 $4$"}]}
 },
 "m3-rational-functions":{
  0:{title:"移動した双曲線",description:"破線は漸近線です。グラフは $x=2$ の左右に分かれ、この直線上には点をもちません。",xRange:[-2,6],yRange:[-3,5],curves:[{label:"$y=\\frac1{x-2}+1$：$x<2$",value:x=>1/(x-2)+1,to:1.98},{label:"$x>2$ の枝",value:x=>1/(x-2)+1,from:2.02}],segments:[{from:[2,-3],to:[2,5],dashed:true,label:"$x=2$"},{from:[-2,1],to:[6,1],dashed:true,label:"$y=1$"}],points:[{x:1,y:0,label:"$(1,0)$"},{x:3,y:2,label:"$(3,2)$"}]},
  1:{title:"変形した式と同じグラフ",description:"$\\frac{x+1}{x-1}=1+\\frac2{x-1}$ と変形すると、漸近線と枝の位置が読めます。",xRange:[-3,5],yRange:[-3,5],curves:[{label:"$y=\\frac{x+1}{x-1}$：$x<1$",value:x=>(x+1)/(x-1),to:.98},{label:"$x>1$ の枝",value:x=>(x+1)/(x-1),from:1.02}],segments:[{from:[1,-3],to:[1,5],dashed:true,label:"$x=1$"},{from:[-3,1],to:[5,1],dashed:true,label:"$y=1$"}],points:[{x:-1,y:0,label:"$(-1,0)$"},{x:0,y:-1,label:"$(0,-1)$"}]}
 },
 "m3-radical-functions":{
  0:{title:"根号の中が零になる点から",description:"$x=-1$ のとき根号の中が $0$ になります。そこから右へ進みます。",xRange:[-2,6],yRange:[-3,3],curves:[{label:"$y=\\sqrt{x+1}-2$",value:x=>Math.sqrt(x+1)-2,from:-1}],points:[{x:-1,y:-2,label:"始点 $(-1,-2)$"},{x:0,y:-1,label:"$(0,-1)$"},{x:3,y:0,label:"$(3,0)$"}]},
  1:{title:"左へ続き、上限をもつグラフ",description:"$2-x\\ge0$ なので左へ続きます。根号の前が負なので、出力は $1$ 以下です。",xRange:[-4,3],yRange:[-3,3],curves:[{label:"$y=-\\sqrt{2-x}+1$",value:x=>-Math.sqrt(2-x)+1,to:2}],points:[{x:2,y:1,label:"始点 $(2,1)$"},{x:1,y:0,label:"$(1,0)$"},{x:-2,y:-1,label:"$(-2,-1)$"}]}
 },
 "m3-composition-domain":{
  0:{title:"根号の中の条件で区間が決まる",description:"$1-x^2\\ge0$ を満たす $-1\\le x\\le1$ の部分だけです。両端も含みます。",xRange:[-2,2],yRange:[-1,2],curves:[{label:"$y=\\sqrt{1-x^2}$",value:x=>Math.sqrt(Math.max(0,1-x*x)),from:-1,to:1}],points:[{x:-1,y:0,label:"$(-1,0)$"},{x:0,y:1,label:"$(0,1)$"},{x:1,y:0,label:"$(1,0)$"}]},
  1:{title:"式が簡単になっても範囲は残る",description:"$(\\sqrt{x})^2=x$ ですが、元の $\\sqrt{x}$ が定義される $x\\ge0$ の部分だけです。",xRange:[-2,4],yRange:[-2,4],curves:[{label:"$y=(\\sqrt{x})^2=x$、$x\\ge0$",value:x=>x,from:0}],points:[{x:0,y:0,label:"原点 $(0,0)$ を含む"}]}
 },
 "m3-inverse-functions":{
  0:{title:"入力と出力を交換した点",description:"$(3,7)$ を交換すると $(7,3)$。二つのグラフは破線 $y=x$ に関して対称です。",xRange:[-1,9],yRange:[-1,9],curves:[{label:"$y=2x+1$",value:x=>2*x+1},{label:"逆関数 $y=\\frac{x-1}2$",value:x=>(x-1)/2,color:blue},{label:"対称の軸 $y=x$",value:x=>x,dashed:true,color:"#7b8794"}],points:[{x:3,y:7,label:"$(3,7)$"},{x:7,y:3,label:"$(7,3)$"}]},
  1:{title:"元の範囲から平方根の枝を選ぶ",description:"元の入力は非負です。入れ替えた後の出力も非負なので、逆関数は $y=\\sqrt{x}$ です。",xRange:[-1,5],yRange:[-1,5],curves:[{label:"$y=x^2$、$x\\ge0$",value:x=>x*x,from:0},{label:"$y=\\sqrt{x}$、$x\\ge0$",value:x=>Math.sqrt(x),from:0,color:blue},{label:"$y=x$",value:x=>x,dashed:true,color:"#7b8794"}],points:[{x:2,y:4,label:"$(2,4)$"},{x:4,y:2,label:"$(4,2)$"}]}
 },
 "m3-graph-equations":{
  0:{title:"等しい高さになる横の座標",description:"$\\sqrt{x}=x$ の解は、二つのグラフの交点の横の座標 $0,1$ です。",xRange:[-1,4],yRange:[-1,4],curves:[{label:"$y=\\sqrt{x}$",value:x=>Math.sqrt(x),from:0},{label:"$y=x$",value:x=>x,color:blue}],points:[{x:0,y:0,label:"交点 $(0,0)$"},{x:1,y:1,label:"交点 $(1,1)$"}]},
  1:{title:"分数のグラフが高いのはどこか",description:"$\\frac1x>1$ は緑のグラフが青い直線より上にある範囲です。$x=0$ は定義されず、$x=1$ は等しいので含みません。",xRange:[-3,3],yRange:[-3,4],curves:[{label:"$y=\\frac1x$：$x<0$",value:x=>1/x,to:-.02},{label:"$x>0$ の枝",value:x=>1/x,from:.02},{label:"$y=1$",value:()=>1,color:blue}],points:[{x:1,y:1,label:"境界の交点 $(1,1)$"}],segments:[{from:[0,0],to:[1,0],width:5,label:"解は $0<x<1$"}]}
 },
 "m3-functions-check":{
  1:{title:"負の側を入れ替える",description:"元の入力は $x\\le0$ です。逆関数の出力は非正となり、$y=-\\sqrt{x}$ を選びます。",xRange:[-4,10],yRange:[-4,10],tick:2,curves:[{label:"$y=x^2$、$x\\le0$",value:x=>x*x,to:0},{label:"$y=-\\sqrt{x}$、$x\\ge0$",value:x=>-Math.sqrt(x),from:0,color:blue},{label:"$y=x$",value:x=>x,dashed:true,color:"#7b8794"}],points:[{x:-3,y:9,label:"$(-3,9)$"},{x:9,y:-3,label:"$(9,-3)$"}]}
 }
};
export default function Math3FunctionDiagrams({slug,index}:{slug:string;index:number}){
 const figure=math3Figures[slug]?.[index];
 return figure?<CoordinateDiagram {...figure}/>:null;
}
