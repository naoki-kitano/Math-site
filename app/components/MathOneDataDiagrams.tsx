import {Formula,MathText} from "./MathText";
import {histogramData,boxData} from "../content/math1-data-distributions";
import {quartiles,m} from "../content/math1-data-authoring";
import {scatterData} from "../content/math1-data-relationships";
import {coinSimulation} from "../content/math1-data-inference";
type DataFigure={
 title:string;description:string;kind:"bars"|"points"|"box";
 xLabel:string;yLabel:string;xRange:[number,number];yMax:number;
 xTicks:number[];yTicks:number[];points?:[number,number][];bars?:{lo:number;hi:number;value:number;highlight?:boolean}[];five?:number[];
};
export const mathOneDataFigures:Record<string,(DataFigure|undefined)[]>={
 "m1-histogram":[{title:"区間に入る人数を柱で表す",description:m`横軸は所要時間（分）、縦軸は度数（人）。各階級は下端を含み、上端を含みません。$5$ 分以上 $10$ 分未満には $3$ 人が入ります。`,kind:"bars",xLabel:"所要時間（分）",yLabel:"度数（人）",xRange:[0,25],yMax:4,xTicks:[0,5,10,15,20,25],yTicks:[0,1,2,3,4],bars:histogramData.counts.map((c,i)=>({lo:histogramData.edges[i],hi:histogramData.edges[i+1],value:c,highlight:i===1}))}],
 "m1-boxplot":[{title:"五つの値を数直線上に置く",description:m`小さい順に $1,2,4,5,7,8,9$。最小値 $1$、$Q_1=2$、中央値 $5$、$Q_3=8$、最大値 $9$。箱の幅は $8-2=6$、全体の範囲は $9-1=8$ です。`,kind:"box",xLabel:"データの値",yLabel:"",xRange:[0,10],yMax:1,xTicks:[0,1,2,3,4,5,6,7,8,9,10],yTicks:[],five:quartiles(boxData)}],
 "m1-scatterplot":[{title:"同じ対象の二つの値を、一つの点へ",description:m`横軸は変量 $x$、縦軸は変量 $y$。例えば組 $(2,1)$ は、横の値 $2$、縦の値 $1$ の点です。二列を別々に並べ替えると、別のデータになってしまいます。`,kind:"points",xLabel:m`変量 $x$`,yLabel:m`変量 $y$`,xRange:[0,6],yMax:6,xTicks:[0,1,2,3,4,5,6],yTicks:[0,1,2,3,4,5,6],points:scatterData}],
 "m1-correlation-coefficient":[{title:"偏差の積の符号と点の位置",description:m`例題の三組は $(1,1),(2,3),(3,2)$。両平均は $2$、偏差の積の和は $1$、二乗和はともに $2$ なので $r=\frac12$。`,kind:"points",xLabel:m`変量 $x$`,yLabel:m`変量 $y$`,xRange:[0,4],yMax:4,xTicks:[0,1,2,3,4],yTicks:[0,1,2,3,4],points:[[1,1],[2,3],[3,2]]},undefined,undefined,{title:"相関係数が零でも、曲線的な関係はある",description:m`$(-1,1),(0,0),(1,1)$ は全て $y=x^2$ 上にあります。$r=0$ は、あらゆる関係がないことを意味しません。`,kind:"points",xLabel:m`変量 $x$`,yLabel:m`変量 $y$`,xRange:[-2,2],yMax:2,xTicks:[-2,-1,0,1,2],yTicks:[0,1,2],points:[[-1,1],[0,0],[1,1]]}],
 "m1-hypothesis-thinking":[{title:"観測以上の回数をまとめて数える",description:m`横軸は $10$ 回中の表の回数、縦軸は計算機実験の度数です。$9$ 回の表を観測した場合、色の濃い $9$ 回と $10$ 回の両方を数えます。合計 $110$ 回、全体の $1.1\%$ です。`,kind:"bars",xLabel:"表の回数",yLabel:"試行の度数",xRange:[-0.6,10.6],yMax:3000,xTicks:[0,2,4,6,8,10],yTicks:[0,1000,2000,3000],bars:coinSimulation.counts.map((c,k)=>({lo:k-0.4,hi:k+0.4,value:c,highlight:k>=9}))}],
};
export default function MathOneDataDiagrams({slug,index}:{slug:string;index:number}){
 const f=mathOneDataFigures[slug]?.[index];if(!f)return null;
 const X=(x:number)=>86+(x-f.xRange[0])*500/(f.xRange[1]-f.xRange[0]),Y=(y:number)=>300-y*220/f.yMax;
 const label=(x:number,y:number,tex:string,key:string)=> <foreignObject key={key} x={x-42} y={y-22} width={84} height={44}><div className="data-diagram-label"><Formula tex={tex}/></div></foreignObject>;
 return <figure className="math-figure data-figure"><h3>{f.title}</h3><p><MathText text={f.description}/></p>
  <svg className="coordinate-diagram" viewBox="0 0 640 365" role="img" aria-label={f.title}><title>{f.title}</title>
   {f.kind!=="box"&&f.yTicks.map(v=><g key={v}><line x1="86" x2="586" y1={Y(v)} y2={Y(v)} stroke="#d7e3e5"/>{label(42,Y(v),String(v),`y-${v}`)}</g>)}
   <line x1="86" x2="586" y1="300" y2="300" stroke="#233f50" strokeWidth="2"/>
   {f.kind!=="box"&&<line x1="86" x2="86" y1="80" y2="300" stroke="#233f50" strokeWidth="2"/>}
   {f.xTicks.map(v=><g key={v}><line x1={X(v)} x2={X(v)} y1="300" y2="307" stroke="#233f50"/>{label(X(v),328,String(v),`x-${v}`)}</g>)}
   {f.bars?.map((b,i)=><rect key={i} x={X(b.lo)} y={Y(b.value)} width={X(b.hi)-X(b.lo)} height={300-Y(b.value)} fill={b.highlight?"#087c70":"#b3d1cc"} stroke="#ffffff" strokeWidth="1"/>)}
   {f.points?.map(([x,y],i)=><circle key={i} cx={X(x)} cy={Y(y)} r="6" fill="#087c70" stroke="#ffffff" strokeWidth="2"/>)}
   {f.five&&<g stroke="#087c70" strokeWidth="3"><line x1={X(f.five[0])} x2={X(f.five[4])} y1="180" y2="180"/>
    <rect x={X(f.five[1])} y="145" width={X(f.five[3])-X(f.five[1])} height="70" fill="#e2f0eb"/>
    {[0,2,4].map(i=><line key={i} x1={X(f.five![i])} x2={X(f.five![i])} y1={i===2?145:158} y2={i===2?215:202}/>)}
    {f.five.map((v,i)=><g key={i} strokeWidth="0">{label(X(v),110,i===0?String(v):i===4?String(v):m`Q_${i}`,`q-${i}`)}</g>)}
   </g>}
  </svg><figcaption><MathText text={`横軸：${f.xLabel}${f.yLabel?"　縦軸："+f.yLabel:""}`}/></figcaption>
 </figure>;
}
