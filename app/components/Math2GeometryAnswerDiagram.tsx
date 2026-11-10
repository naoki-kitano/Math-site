import type {Exercise} from '../content/lessons';
import CoordinateDiagram,{type CoordinateDiagramProps} from './CoordinateDiagram';
type HalfPlane={kind:'half-plane';intercept:number;closed:boolean};
type CircleRegion={kind:'circle-region';h:number;k:number;closed:boolean;outside?:boolean};
export const geometryAnswerSpecs:Record<string,HalfPlane|CircleRegion>={
 'inequality-regions-guided-half-plane-region-1-v1':{kind:'half-plane',intercept:2,closed:false},
 'inequality-regions-practice-half-plane-region-1-v1':{kind:'half-plane',intercept:1,closed:true},
 'inequality-regions-practice-half-plane-region-2-v1':{kind:'half-plane',intercept:3,closed:false},
 'inequality-regions-practice-half-plane-region-3-v1':{kind:'half-plane',intercept:2,closed:true},
 'inequality-regions-review-half-plane-region-1-v1':{kind:'half-plane',intercept:1,closed:false},
 'chapter-three-check-practice-half-plane-region-v1':{kind:'half-plane',intercept:3,closed:true},
 'chapter-three-check-review-half-plane-region-v1':{kind:'half-plane',intercept:1,closed:true},
 'inequality-regions-guided-intersection-region-1-v1':{kind:'circle-region',h:1,k:1,closed:false},
 'inequality-regions-practice-intersection-region-1-v1':{kind:'circle-region',h:0,k:1,closed:true},
 'inequality-regions-practice-intersection-region-2-v1':{kind:'circle-region',h:0,k:0,closed:false,outside:true},
 'inequality-regions-practice-intersection-region-3-v1':{kind:'circle-region',h:1,k:1,closed:true},
 'inequality-regions-review-intersection-region-1-v1':{kind:'circle-region',h:0,k:1,closed:false},
 'chapter-three-check-practice-intersection-region-v1':{kind:'circle-region',h:-1,k:1,closed:true},
 'chapter-three-check-review-intersection-region-v1':{kind:'circle-region',h:0,k:1,closed:true}
};
const square=(v:string,a:number)=>a===0?`${v}^2`:`(${v}${a<0?'+':'-'}${Math.abs(a)})^2`;
export function geometryAnswerFigure(exercise:Exercise):CoordinateDiagramProps|null{
 const spec=geometryAnswerSpecs[exercise.id];if(!spec)return null;
 if(spec.kind==='half-plane'){
  const b=spec.intercept;
  return {title:'解答の領域図',description:spec.closed?'直線より上側。境界の直線も含む。':'直線より上側。破線の境界は含まない。',xRange:[-3,3],yRange:[b-3,b+3],curves:[{label:`境界 $y=x+${b}$`,value:x=>x+b,dashed:!spec.closed}],areas:[{from:-3,to:3,upper:()=>b+3,lower:x=>x+b,label:'直線の上側'}]};
 }
 const {h,k,closed,outside}=spec,r=2,upper=(x:number)=>k+Math.sqrt(Math.max(0,4-(x-h)**2)),lower=(x:number)=>k-Math.sqrt(Math.max(0,4-(x-h)**2));
 return {title:'解答の領域図',description:outside?'円の外側と右半平面の重なり。円周を除き、縦軸上では上下の二部分を含む。':`円の内部と右半平面の重なり。円周の右半分を${closed?'含む':'含まない'}。`,xRange:[h-3,h+3],yRange:[k-3,k+3],
  circles:[{x:h,y:k,r,label:`境界 $${square('x',h)}+${square('y',k)}=4$`,dashed:!closed}],
  areas:outside?[
   {from:h,to:h+r,upper:()=>k+3,lower:upper,label:'上側の円外'},
   {from:h,to:h+r,upper:lower,lower:()=>k-3,label:'下側の円外'},
   {from:h+r,to:h+3,upper:()=>k+3,lower:()=>k-3,label:'右側の円外'}
  ]:[{from:h,to:h+r,upper,lower,label:'右半円の領域'}],
  segments:outside?[{from:[h,k-3],to:[h,k-r]},{from:[h,k+r],to:[h,k+3]}]:[{from:[h,k-r],to:[h,k+r]}],
  points:[{x:h,y:k-r,label:`$A(${h},${k-r})$`,open:!closed},{x:h,y:k+r,label:`$B(${h},${k+r})$`,open:!closed}]
 };
}
export default function Math2GeometryAnswerDiagram({exercise}:{exercise:Exercise}){
 const figure=geometryAnswerFigure(exercise);if(!figure)return null;
 const spec=geometryAnswerSpecs[exercise.id];
 return <div data-geometry-answer={exercise.id}><CoordinateDiagram {...figure} directLabels compact/>{(spec.kind==='half-plane'||spec.outside)&&<p className="meta">色の付いた領域は、図の外にも続きます。</p>}</div>;
}
