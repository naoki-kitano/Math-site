import type {Exercise} from '../content/lessons';
import Math2TrigDiagram,{TrigPlot,TrigTangentRegion} from './Math2TrigDiagram';
const m=String.raw,pi=Math.PI;
export const trigAnswerWaves:Record<string,{kind:'negative-sine'|'double-cosine'|'double-sine';amplitude:number}>={
 'trig-graphs-practice-negative-v1':{kind:'negative-sine',amplitude:1},
 'trig-graphs-practice-frequency-v1':{kind:'double-cosine',amplitude:1},
 'trig-synthesis-check-check-wave-v1':{kind:'double-sine',amplitude:2},
 'trig-synthesis-check-check-review-wave-v1':{kind:'double-cosine',amplitude:2},
};
const tangentAnswers:Record<string,{inclusive:boolean;negative:boolean;threshold:number;thresholdTex:string;limit?:number}>={
 'trig-inequalities-guided-tangent-v1':{inclusive:true,negative:false,threshold:1,thresholdTex:'1',limit:pi},
 'trig-inequalities-practice-tangent-negative-v1':{inclusive:false,negative:true,threshold:-1,thresholdTex:'-1'},
 'trig-inequalities-review-tangent-v1':{inclusive:true,negative:true,threshold:-Math.sqrt(3),thresholdTex:m`-\sqrt3`},
 'trig-synthesis-check-check-tangent-inequality-v1':{inclusive:true,negative:false,threshold:Math.sqrt(3),thresholdTex:m`\sqrt3`},
 'trig-synthesis-check-check-review-tangent-inequality-v1':{inclusive:true,negative:true,threshold:-1,thresholdTex:'-1'},
};
export const trigAnswerDiagramIds=[...Object.keys(trigAnswerWaves),'trig-graphs-practice-tangent-branch-v1','trig-graphs-practice-shift-v1',...Object.keys(tangentAnswers),'trig-inequalities-practice-cosine-positive-v1'];
export default function Math2TrigAnswerDiagram({exercise}:{exercise:Exercise}){
 const spec=trigAnswerWaves[exercise.id];
 if(spec){
  const negative=spec.kind==='negative-sine',end=negative?2*pi:pi;
  const value=(x:number)=>spec.kind==='negative-sine'?-Math.sin(x):spec.amplitude*(spec.kind==='double-sine'?Math.sin(2*x):Math.cos(2*x));
  const tex=negative?['0',m`\frac\pi2`,m`\pi`,m`\frac{3\pi}2`,m`2\pi`]:['0',m`\frac\pi4`,m`\frac\pi2`,m`\frac{3\pi}4`,m`\pi`];
  const ticks=tex.map((t,i)=>({x:end*i/4,tex:t}));
  return <TrigPlot xMin={0} xMax={end} yMin={-spec.amplitude*1.3} yMax={spec.amplitude*1.3} curves={[{value}]} ticks={ticks} points={ticks.map(t=>({x:t.x,y:value(t.x)}))} description="解答のグラフ。指定区間の五つの基準点を示し、三角関数の曲線で結んでいる。"/>;
 }
 if(exercise.id==='trig-graphs-practice-tangent-branch-v1')return <TrigPlot xMin={-pi/2} xMax={pi/2} yMin={-3} yMax={3} curves={[{value:Math.tan,from:-pi/2+.0001,to:pi/2-.0001}]} ticks={[{x:-pi/2,tex:m`-\frac\pi2`},{x:-pi/4,tex:m`-\frac\pi4`},{x:0,tex:'0'},{x:pi/4,tex:m`\frac\pi4`},{x:pi/2,tex:m`\frac\pi2`}]} points={[{x:-pi/4,y:-1},{x:0,y:0},{x:pi/4,y:1}]} asymptotes={[-pi/2,pi/2]} description="正接の中央の枝。三点を通る増加曲線が、両側の漸近線へ限りなく近づく。漸近線上には点を置かない。"/>;
 if(exercise.id==='trig-graphs-practice-shift-v1')return <Math2TrigDiagram kind="m2-trig-shift" stage={1} reduce/>;
 if(tangentAnswers[exercise.id])return <TrigTangentRegion {...tangentAnswers[exercise.id]}/>;
 if(exercise.id==='trig-inequalities-practice-cosine-positive-v1')return <Math2TrigDiagram kind="m2-trig-wrap" stage={1} reduce/>;
 return null;
}
