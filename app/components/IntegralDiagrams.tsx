"use client";
import CoordinateDiagram, {type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
const blue="#42648b";
const between=(coefficient:number,end:number):Diagram=>{
 const split=Math.min(coefficient,end);
 return {title:end>coefficient?"交点で上と下が入れ替わる":"上の曲線から下の曲線を引く",
  description:end>coefficient?"交点の左右では縦の長さを表す式が逆になります。二つの部分の面積を別々に計算して足します。":"二つの曲線は同じ横の位置で比べます。縦の線分の長さが、積分する高さです。",
  xRange:[-.5,end+.5],yRange:[-.5,end*end+.5],
  curves:[{label:"直線 $y="+(coefficient===1?"x":coefficient+"x")+"$",value:x=>coefficient*x},{label:"放物線 $y=x^2$",value:x=>x*x,color:blue}],
  areas:[{from:0,to:split,upper:x=>coefficient*x,lower:x=>x*x,label:"$0\\le x\\le"+split+"$：高さ $"+(coefficient===1?"x":coefficient+"x")+"-x^2$"},
   ...(end>coefficient?[{from:coefficient,to:end,upper:(x:number)=>x*x,lower:(x:number)=>coefficient*x,label:"$"+coefficient+"\\le x\\le"+end+"$：高さ $x^2-"+(coefficient===1?"x":coefficient+"x")+"$"}]:[])],
  segments:[{from:[split/2,(split/2)**2],to:[split/2,coefficient*split/2],width:3,label:"左の部分では直線が上"},
   ...(end>coefficient?[{from:[end,coefficient*end] as [number,number],to:[end,end*end] as [number,number],label:"右端の境界 $x="+end+"$"},
    {from:[(coefficient+end)/2,coefficient*(coefficient+end)/2] as [number,number],to:[(coefficient+end)/2,((coefficient+end)/2)**2] as [number,number],width:3,label:"右の部分では放物線が上"}]:[])],
  points:[{x:0,y:0,label:"交点 $(0,0)$"},{x:coefficient,y:coefficient*coefficient,label:"交点 $("+coefficient+","+(coefficient*coefficient)+")$"}]
 };
};
export const integralFigures:Record<string,Record<number,Diagram>>={
 "antiderivatives":{
  0:{title:"定数を足しても傾きは同じ",description:"曲線の高さは違っても、同じ横の値での傾きは一致します。どちらも微分すると同じ関数になります。",xRange:[-2,2],yRange:[-1,6],
   curves:[{label:"$y=x^2$",value:x=>x*x,color:blue},{label:"$y=x^2+3$",value:x=>x*x+3}],points:[{x:1,y:1,label:"$(1,1)$：傾き $2$"},{x:1,y:4,label:"$(1,4)$：傾き $2$"}],
   segments:[{from:[.5,0],to:[1.5,2],dashed:true,label:"下の曲線の接線の一部"},{from:[.5,3],to:[1.5,5],dashed:true,label:"上の曲線の接線の一部"}]},
  1:{title:"傾き三の直線は一つではない",description:"すべての原始関数を表すには、縦の位置を決める定数が必要です。ここでは三本の例を描いています。",xRange:[-2,2],yRange:[-4,4],
   curves:[{label:"$y=3x-1$",value:x=>3*x-1,color:blue},{label:"$y=3x$",value:x=>3*x},{label:"$y=3x+1$",value:x=>3*x+1,color:"#0b1f3a"}]}
 },
 "integral-constant":{
  0:{title:"一点の条件で高さが決まる",description:"傾きだけなら縦の位置は自由です。点 $(0,3)$ を通る条件を加えると、一つの曲線に決まります。",xRange:[-2,2],yRange:[-1,6],
   curves:[{label:"条件を満たす $y=x^2+3$",value:x=>x*x+3},{label:"$y=x^2$ はこの点を通らない",value:x=>x*x,dashed:true,color:blue}],points:[{x:0,y:3,label:"指定点 $(0,3)$"}]},
  1:{title:"点の条件は積分した式へ入れる",description:"点 $(1,2)$ を通るのは $C=3$ の曲線です。導関数に高さを代入するのではありません。",xRange:[-1,3],yRange:[-2,6],
   curves:[{label:"$y=x^2-2x+3$",value:x=>x*x-2*x+3},{label:"比較：$y=x^2-2x$",value:x=>x*x-2*x,dashed:true,color:blue}],points:[{x:1,y:2,label:"指定点 $(1,2)$"}]}
 },
 "definite-integrals":{
  0:{title:"軸より上の部分を足し合わせる",description:"この区間では高さが非負なので、定積分は三角形の面積と一致します。",xRange:[-.5,2.5],yRange:[-.5,4.5],
   curves:[{label:"$y=2x$",value:x=>2*x}],areas:[{from:0,to:2,upper:x=>2*x,lower:()=>0,label:"$\\int_0^2 2x\\,dx=4$"}],segments:[{from:[2,0],to:[2,4],label:"右端 $x=2$"}],points:[{x:0,y:0,label:"$(0,0)$"},{x:2,y:4,label:"$(2,4)$"}]},
  1:{title:"軸の下では負として数える",description:"定積分は左右の面積の合計ではなく、符号付きの値の和です。下側の分を負として数えるので、結果は $-2$ です。",xRange:[-1.5,1.5],yRange:[-3.5,1.5],
   curves:[{label:"$y=2x-1$",value:x=>2*x-1}],areas:[{from:-1,to:.5,upper:()=>0,lower:x=>2*x-1,label:"下側の寄与 $-9/4$"},{from:.5,to:1,upper:x=>2*x-1,lower:()=>0,label:"上側の寄与 $1/4$"}],segments:[{from:[-1,-3],to:[-1,0]},{from:[1,0],to:[1,1]}],points:[{x:.5,y:0,label:"零点 $(1/2,0)$"}]}
 },
 "area-with-axis":{
  0:{title:"非負の高さを積分する",description:"底辺は $2$、高さは $2$ の三角形です。積分で求めた面積 $2$ と一致します。",xRange:[-.5,2.5],yRange:[-.5,2.5],
   curves:[{label:"$y=x$",value:x=>x}],areas:[{from:0,to:2,upper:x=>x,lower:()=>0,label:"面積 $S=2$"}],segments:[{from:[2,0],to:[2,2],label:"境界 $x=2$"}],points:[{x:0,y:0,label:"$(0,0)$"},{x:2,y:2,label:"$(2,2)$"}]},
  1:{title:"軸の下の面積も正で足す",description:"左と右はそれぞれ面積 $1/2$。定積分では打ち消し合いますが、面積は足して $1$ になります。",xRange:[-.5,2.5],yRange:[-1.5,1.5],
   curves:[{label:"$y=x-1$",value:x=>x-1}],areas:[{from:0,to:1,upper:()=>0,lower:x=>x-1,label:"左：高さ $1-x$、面積 $1/2$"},{from:1,to:2,upper:x=>x-1,lower:()=>0,label:"右：高さ $x-1$、面積 $1/2$"}],
   segments:[{from:[0,-1],to:[0,0]},{from:[2,0],to:[2,1]},{from:[.5,-.5],to:[.5,0],width:3,label:"下側では $0-(x-1)=1-x$"},{from:[1.5,0],to:[1.5,.5],width:3,label:"上側では $(x-1)-0=x-1$"}],points:[{x:1,y:0,label:"分ける点 $(1,0)$"}]}
 },
 "area-between-curves":{0:between(1,1),1:between(1,2)},
 "chapter-seven-check":{
  0:{title:"導関数と点の二つの条件を見る",description:"曲線は指定点を通り、各点の傾きは与えられた導関数と一致します。",xRange:[-3,2],yRange:[0,6],
   curves:[{label:"$y=x^2+x+2$",value:x=>x*x+x+2}],points:[{x:-1,y:2,label:"指定点 $(-1,2)$"}]},
  1:between(2,3)
 }
};
export default function IntegralDiagrams({slug,index}:{slug:string;index:number}){
 const figure=integralFigures[slug]?.[index];return figure?<CoordinateDiagram {...figure}/>:null;
}
