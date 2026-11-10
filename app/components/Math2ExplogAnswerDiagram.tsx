import type {Exercise} from '../content/lessons';
import CoordinateDiagram,{type CoordinateDiagramProps} from './CoordinateDiagram';
import {LogInterval} from './Math2ExplogDiagram';
const m=String.raw;
type GraphSpec={kind:'exp'|'log';base:number;dx:number;dy:number;tex:string;points:[number,number,string][];xRange:[number,number];yRange:[number,number]};
export const math2ExplogAnswerFigures:Record<string,GraphSpec>={
 'exponential-graph-practice-exp-points-monotonicity-3-v1':{kind:'exp',base:4,dx:0,dy:0,tex:m`y=4^x`,points:[[-1,.25,m`(-1,\frac14)`],[0,1,'(0,1)'],[1,4,'(1,4)']],xRange:[-2,2],yRange:[-1,5]},
 'exponential-graph-practice-exp-points-monotonicity-4-v1':{kind:'exp',base:1/3,dx:0,dy:0,tex:m`y=(\frac13)^x`,points:[[-1,3,'(-1,3)'],[0,1,'(0,1)'],[1,1/3,m`(1,\frac13)`]],xRange:[-2,3],yRange:[-1,5]},
 'exponential-graph-practice-exp-range-shift-4-v1':{kind:'exp',base:.5,dx:0,dy:-2,tex:m`y=(\frac12)^x-2`,points:[[-1,0,'(-1,0)'],[0,-1,'(0,-1)'],[1,-1.5,m`(1,-\frac32)`]],xRange:[-3,4],yRange:[-3,3]},
 'exponential-graph-practice-exp-range-shift-5-v1':{kind:'exp',base:2,dx:1,dy:0,tex:m`y=2^{x-1}`,points:[[0,.5,m`(0,\frac12)`],[1,1,'(1,1)'],[2,2,'(2,2)']],xRange:[-2,4],yRange:[-1,5]},
 'exponential-graph-review-exp-range-shift-6-v1':{kind:'exp',base:3,dx:0,dy:4,tex:m`y=3^x+4`,points:[[-1,13/3,m`(-1,\frac{13}3)`],[0,5,'(0,5)'],[1,7,'(1,7)']],xRange:[-3,3],yRange:[0,9]},
 'logarithmic-graph-practice-log-points-monotonicity-3-v1':{kind:'log',base:3,dx:0,dy:0,tex:m`y=\log_3x`,points:[[1/3,-1,m`(\frac13,-1)`],[1,0,'(1,0)'],[3,1,'(3,1)']],xRange:[-1,5],yRange:[-3,3]},
 'logarithmic-graph-practice-log-range-shift-3-v1':{kind:'log',base:2,dx:-1,dy:0,tex:m`y=\log_2(x+1)`,points:[[-.5,-1,m`(-\frac12,-1)`],[0,0,'(0,0)'],[1,1,'(1,1)']],xRange:[-2,4],yRange:[-3,3]},
 'logarithmic-graph-practice-log-points-monotonicity-4-v1':{kind:'log',base:1/3,dx:0,dy:0,tex:m`y=\log_{\frac13}x`,points:[[1/3,1,m`(\frac13,1)`],[1,0,'(1,0)'],[3,-1,'(3,-1)']],xRange:[-1,5],yRange:[-3,3]},
 'logarithmic-graph-practice-log-range-shift-4-v1':{kind:'log',base:3,dx:0,dy:2,tex:m`y=\log_3x+2`,points:[[1/3,1,m`(\frac13,1)`],[1,2,'(1,2)'],[3,3,'(3,3)']],xRange:[-1,5],yRange:[-1,5]},
 'logarithmic-graph-review-log-range-shift-6-v1':{kind:'log',base:3,dx:1,dy:0,tex:m`y=\log_3(x-1)`,points:[[4/3,-1,m`(\frac43,-1)`],[2,0,'(2,0)'],[4,1,'(4,1)']],xRange:[-1,6],yRange:[-3,3]}
};
const copies:Record<string,string>={
 'chapter-five-check-exp-graph-basic-v1':'exponential-graph-practice-exp-points-monotonicity-3-v1',
 'chapter-five-check-log-graph-basic-v1':'logarithmic-graph-practice-log-points-monotonicity-3-v1',
 'chapter-five-check-log-shift-basic-v1':'logarithmic-graph-practice-log-range-shift-3-v1',
 'chapter-five-check-exp-graph-retry-v1':'exponential-graph-practice-exp-points-monotonicity-4-v1',
 'chapter-five-check-exp-shift-retry-v1':'exponential-graph-review-exp-range-shift-6-v1',
 'chapter-five-check-log-graph-retry-v1':'logarithmic-graph-practice-log-points-monotonicity-4-v1',
 'chapter-five-check-log-shift-retry-v1':'logarithmic-graph-review-log-range-shift-6-v1'
};
for(const[id,source]of Object.entries(copies))math2ExplogAnswerFigures[id]=math2ExplogAnswerFigures[source];
export default function Math2ExplogAnswerDiagram({exercise}:{exercise:Exercise}){
 if(['logarithmic-equations-practice-log-inequality-5-v1','chapter-five-check-log-increasing-inequality-retry-v1'].includes(exercise.id))return <LogInterval/>;
 const spec=math2ExplogAnswerFigures[exercise.id];if(!spec)return null;
 const value=(x:number)=>spec.kind==='exp'?spec.base**(x-spec.dx)+spec.dy:Math.log(x-spec.dx)/Math.log(spec.base)+spec.dy;
 const props:CoordinateDiagramProps={title:'解答のグラフ',description:spec.kind==='exp'?`漸近線 $y=${spec.dy}$ に近づきますが、交わりません。`:`定義域は $x>${spec.dx}$。漸近線 $x=${spec.dx}$ に近づきますが、交わりません。`,xRange:spec.xRange,yRange:spec.yRange,curves:[{label:`$${spec.tex}$`,value,...(spec.kind==='log'?{from:spec.dx+.001}:{})}],points:spec.points.map(([x,y,tex])=>({x,y,label:`$${tex}$`}))};
 props.segments=spec.kind==='exp'?[{from:[spec.xRange[0],spec.dy],to:[spec.xRange[1],spec.dy],dashed:true,label:`漸近線 $y=${spec.dy}$`}]:[{from:[spec.dx,spec.yRange[0]],to:[spec.dx,spec.yRange[1]],dashed:true,label:`漸近線 $x=${spec.dx}$`}];
 return <CoordinateDiagram {...props}/>;
}
