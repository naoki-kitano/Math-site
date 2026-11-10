import Math1DataPlot,{type DataFigure} from "./Math1DataPlot";
import Math1DataDiagram from "./Math1DataDiagram";
import {histogramData,boxData} from "../content/math1-data-distributions";
import {quartiles,m} from "../content/math1-data-authoring";
import {scatterData} from "../content/math1-data-relationships";
import {coinSimulation} from "../content/math1-data-inference";
export const mathOneDataFigures:Record<string,(DataFigure|undefined)[]>={
 "m1-histogram":[{title:"区間に入る人数を柱で表す",description:m`横軸は所要時間（分）、縦軸は度数（人）。各階級は下端を含み、上端を含みません。$5$ 分以上 $10$ 分未満には $3$ 人が入ります。`,kind:"bars",xLabel:"所要時間（分）",yLabel:"度数（人）",xRange:[0,25],yMax:4,xTicks:[0,5,10,15,20,25],yTicks:[0,1,2,3,4],bars:histogramData.counts.map((c,i)=>({lo:histogramData.edges[i],hi:histogramData.edges[i+1],value:c,highlight:i===1}))}],
 "m1-boxplot":[{title:"五つの値を数直線上に置く",description:m`小さい順に $1,2,4,5,7,8,9$。最小値 $1$、$Q_1=2$、中央値 $5$、$Q_3=8$、最大値 $9$。箱の幅は $8-2=6$、全体の範囲は $9-1=8$ です。`,kind:"box",xLabel:"データの値",yLabel:"",xRange:[0,10],yMax:1,xTicks:[0,1,2,3,4,5,6,7,8,9,10],yTicks:[],five:quartiles(boxData)}],
 "m1-scatterplot":[{title:"同じ対象の二つの値を、一つの点へ",description:m`横軸は変量 $x$、縦軸は変量 $y$。例えば組 $(2,1)$ は、横の値 $2$、縦の値 $1$ の点です。二列を別々に並べ替えると、別のデータになってしまいます。`,kind:"points",xLabel:m`変量 $x$`,yLabel:m`変量 $y$`,xRange:[0,6],yMax:6,xTicks:[0,1,2,3,4,5,6],yTicks:[0,1,2,3,4,5,6],points:scatterData}],
 "m1-correlation-coefficient":[{title:"偏差の積の符号と点の位置",description:m`例題の三組は $(1,1),(2,3),(3,2)$。両平均は $2$、偏差の積の和は $1$、二乗和はともに $2$ なので $r=\frac12$。`,kind:"points",xLabel:m`変量 $x$`,yLabel:m`変量 $y$`,xRange:[0,4],yMax:4,xTicks:[0,1,2,3,4],yTicks:[0,1,2,3,4],points:[[1,1],[2,3],[3,2]]},undefined,undefined,{title:"相関係数が0でも、曲線的な関係はある",description:m`$(-1,1),(0,0),(1,1)$ は全て $y=x^2$ 上にあります。$r=0$ は、あらゆる関係がないことを意味しません。`,kind:"points",xLabel:m`変量 $x$`,yLabel:m`変量 $y$`,xRange:[-2,2],yMax:2,xTicks:[-2,-1,0,1,2],yTicks:[0,1,2],points:[[-1,1],[0,0],[1,1]]}],
 "m1-hypothesis-thinking":[{title:"観測以上の回数をまとめて数える",description:m`横軸は $10$ 回中の表の回数、縦軸は計算機実験の度数です。$9$ 回の表を観測した場合、色の濃い $9$ 回と $10$ 回の両方を数えます。合計 $110$ 回、全体の $1.1\%$ です。`,kind:"bars",xLabel:"表の回数",yLabel:"試行の度数",xRange:[-0.6,10.6],yMax:3000,xTicks:[0,2,4,6,8,10],yTicks:[0,1000,2000,3000],bars:coinSimulation.counts.map((c,k)=>({lo:k-0.4,hi:k+0.4,value:c,highlight:k>=9}))}],
};
export default function MathOneDataDiagrams({slug,index,step,complete}:{slug:string;index:number;step?:number;complete?:boolean}){
 const full=complete??step===undefined;
 if(slug==='m1-histogram'&&index===1)return <Math1DataDiagram kind="m1-data-grouped" stage={full?2:Math.min(step??0,2)} reduce/>;
 if(slug==='m1-representative-values'&&index===3)return <Math1DataDiagram kind="m1-data-pooled" stage={full?2:Math.min(step??0,2)} reduce/>;
 if(slug==='m1-distribution-comparison'&&index===1)return <Math1DataDiagram kind="m1-data-box-limits" stage={full?2:Math.min(step??0,2)} reduce/>;
 if(slug==='m1-data-variance'&&index===1)return <Math1DataDiagram kind="m1-data-variance" stage={full?3:(step??0)+1} reduce/>;
 if(slug==='m1-variance-calculation'&&index===0)return <Math1DataDiagram kind="m1-data-moments" stage={full?2:Math.min(step??0,2)} reduce/>;
 const f=mathOneDataFigures[slug]?.[index];if(!f)return null;
 if(slug==='m1-boxplot'&&!full)return <Math1DataDiagram kind="m1-data-quartiles" stage={step===0?1:2} reduce/>;
 if(slug==='m1-histogram'&&!full)return <Math1DataDiagram kind="m1-data-frequency" stage={1} reduce/>;
 if(slug==='m1-scatterplot'&&!full)return <Math1DataPlot figure={{...f,title:'横と縦の目盛り',description:'同じ対象の二つの値を一組にして置きます。',points:[]}}/>;
 if(slug==='m1-correlation-coefficient'&&index===0)return <Math1DataPlot figure={{...f,description:full?f.description:'',mean:(step??0)>=1||full?[2,2]:undefined}}/>;
 if(slug==='m1-hypothesis-thinking')return <Math1DataPlot figure={{...f,description:full?f.description:'',bars:f.bars?.map(b=>({...b,highlight:full||(step??0)>=1?b.highlight:false}))}}/>;
 return <Math1DataPlot figure={f}/>;
}
