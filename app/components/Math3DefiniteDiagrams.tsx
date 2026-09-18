import CoordinateDiagram,{type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
const m=String.raw;
const square=(x:number)=>x*x;
export const math3DefiniteFigures:Record<string,Record<number,Diagram>>={
 "m3-definite-meaning":{0:{title:"区間を決めた符号付きの量",description:m`$0\le x\le1$ では $2x\ge0$。この例では定積分 $1$ が三角形の面積と一致します。`,xRange:[-0.2,1.4],yRange:[-0.2,2.5],tick:0.5,curves:[{label:m`$y=2x$`,value:x=>2*x,from:0,to:1}],areas:[{from:0,to:1,upper:x=>2*x,lower:()=>0,label:m`$\int_0^1 2x\,dx=1$`}]}},
 "m3-integral-symmetry":{0:{title:"奇関数の左右は反対の寄与",description:m`例題の $x^3$ の項だけを取り出した図です。原点対称の二つの領域は同じ面積で、定積分では符号が反対になります。$x^2$ の項は打ち消し合いません。`,xRange:[-1.2,1.2],yRange:[-1.2,1.2],tick:0.5,curves:[{label:m`$y=x^3$`,value:x=>x*x*x,from:-1,to:1}],areas:[{from:-1,to:0,upper:()=>0,lower:x=>x*x*x,label:m`左側の寄与は $-\dfrac14$`},{from:0,to:1,upper:x=>x*x*x,lower:()=>0,label:m`右側の寄与は $\dfrac14$`}]}},
 "m3-integral-function":{0:{title:"上端を少し動かしたときの増分",description:m`$F(x)=\int_0^x t^2\,dt$ について、$x=1$ から $x+h=\dfrac54$ まで上端を動かす例です。追加された帯の量が $F(x+h)-F(x)$。幅で割ると、その区間の平均の高さになります。`,axisDescription:m`横軸は積分変数 $t$、縦軸は $y$。`,xRange:[-0.2,1.5],yRange:[-0.2,2],tick:0.5,curves:[{label:m`$y=t^2$`,value:square,from:0,to:1.4}],areas:[{from:1,to:1.25,upper:square,lower:()=>0,label:m`帯の幅 $h=\dfrac14$`}],segments:[{from:[1,0],to:[1,1],dashed:true,label:m`元の上端 $x=1$`},{from:[1.25,0],to:[1.25,1.5625],dashed:true,label:m`新しい上端 $x+h=\dfrac54$`}]}},
 "m3-riemann-sums":{0:{title:"右端の高さで四つに分ける",description:m`$n=4$ の例です。幅は $\dfrac14$、右端の高さは $\left(\dfrac k4\right)^2$。この有限個の和は近似であり、定積分そのものではありません。右端の和は、この増加関数では面積より大きくなります。`,xRange:[-0.1,1.2],yRange:[-0.1,1.2],tick:0.25,curves:[{label:m`$y=x^2$`,value:square,from:0,to:1}],areas:Array.from({length:4},(_,i)=>({from:i/4,to:(i+1)/4,upper:()=>((i+1)/4)**2,lower:()=>0,label:""})),segments:Array.from({length:4},(_,i)=>({from:[i/4,((i+1)/4)**2] as [number,number],to:[(i+1)/4,((i+1)/4)**2] as [number,number]})),points:[{x:1,y:1,label:m`各長方形の右上が曲線に乗ります。和は $\dfrac{15}{32}$。`}]}},
 "m3-integral-bounds":{
 0:{title:"上下の一定の高さで挟む",description:m`$[0,1]$ の全体で曲線は $y=\dfrac12$ と $y=1$ の間にあります。区間の長さが $1$ なので、積分値も $\dfrac12$ と $1$ の間です。`,xRange:[-0.1,1.2],yRange:[-0.1,1.2],tick:0.5,curves:[{label:m`$y=\dfrac1{1+x^2}$`,value:x=>1/(1+x*x),from:0,to:1},{label:m`下限 $y=\dfrac12$`,value:()=>0.5,from:0,to:1,dashed:true,color:"#42648b"},{label:m`上限 $y=1$`,value:()=>1,from:0,to:1,dashed:true,color:"#a4513a"}],areas:[{from:0,to:1,upper:x=>1/(1+x*x),lower:()=>0,label:m`$\dfrac12\le I\le1$`}]},
 1:{title:"差の積分は非負",description:m`$[0,1]$ では直線が放物線の上にあります。色の付いた差の面積が非負なので、積分値の大小が分かります。`,xRange:[-0.1,1.2],yRange:[-0.1,1.2],tick:0.5,curves:[{label:m`$y=x$`,value:x=>x,from:0,to:1},{label:m`$y=x^2$`,value:square,from:0,to:1,color:"#42648b"}],areas:[{from:0,to:1,upper:x=>x,lower:square,label:m`$\int_0^1(x-x^2)\,dx\ge0$`}]}
 }
};
export default function Math3DefiniteDiagrams({slug,index}:{slug:string;index:number}){
 const figure=math3DefiniteFigures[slug]?.[index];
 return figure?<CoordinateDiagram {...figure}/>:null;
}
