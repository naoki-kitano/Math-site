import type {Exercise} from '../content/lessons';
import {math1QuadraticAnswerCases} from '../content/math1-chapter3';
import {num,vertexForm} from '../content/math1-quadratic-authoring';
import CoordinateDiagram from './CoordinateDiagram';
export const math1QuadraticAnswerIds=Object.keys(math1QuadraticAnswerCases);
export default function Math1QuadraticAnswerDiagram({exercise}:{exercise:Exercise}){
 const data=math1QuadraticAnswerCases[exercise.id];if(!data)return null;
 const {a,h,k}=data,yLow=Math.min(k,k+4*a)-1,yHigh=Math.max(k,k+4*a)+1;
 return <CoordinateDiagram responsive title="グラフの解答" description={`頂点、軸、対称な二点を示します。${a>0?'上':'下'}向きに開く放物線です。`} xRange={[h-3,h+3]} yRange={[yLow,yHigh]} curves={[{label:`$y=${vertexForm(a,h,k)}$`,value:x=>a*(x-h)**2+k}]} segments={[{from:[h,yLow],to:[h,yHigh],dashed:true,label:`軸 $x=${num(h)}$`}]} points={[{x:h,y:k,label:`頂点 $(${num(h)},${num(k)})$`},{x:h-1,y:k+a,label:`$(${num(h-1)},${num(k+a)})$`},{x:h+1,y:k+a,label:`$(${num(h+1)},${num(k+a)})$`}]}/>;
}
