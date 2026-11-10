'use client';
import {Formula} from './MathText';
import CoordinateDiagram from './CoordinateDiagram';
const m=String.raw,blue='#176c82',ochre='#936114';
type Props={kind:string;stage:number;reduce:boolean};
function Rectangle({stage}:{stage:number}){
 if(stage===2)return <CoordinateDiagram responsive title="辺の長さと面積" description={m`頂点の横座標は辺の長さ $3$、縦座標は面積 $9$ です。`} axisDescription="横軸は辺の長さ $x$（センチメートル）、縦軸は面積 $S$（平方センチメートル）。" xRange={[-1,7]} yRange={[-1,11]} curves={[{label:m`$S=x(6-x)$、$0<x<6$`,value:x=>x*(6-x),from:0,to:6}]} points={[{x:0,y:0,open:true,label:m`$x=0$ は除く`},{x:6,y:0,open:true,label:m`$x=6$ は除く`},{x:3,y:9,label:m`$(3,9)$`}]}/>;
 const side=stage===0?'y':'6-x';
 const label=(x:number,y:number,tex:string)=><foreignObject x={x-50} y={y-20} width="100" height="44"><div className="m1-quadratic-label"><Formula tex={tex}/></div></foreignObject>;
 return <div className="m1-quadratic-rectangle"><svg viewBox="0 0 300 200" role="img" aria-label={stage===0?'向かい合う辺はxとx、yとy。二辺ずつ足すと周の長さ。':'縦の長さxと横の長さ6-xの積が面積。辺の比率を固定した模式図。'}>
  <rect x="72" y="45" width="156" height="100" fill="#f4f8f9" stroke="#bacad4"/>
  <path d="M72 45V145 M228 45V145" stroke={blue} strokeWidth="3"/><path d="M72 45H228 M72 145H228" stroke={ochre} strokeWidth="3"/>
  {label(36,96,m`\color{#176c82}{x}`)}{label(265,96,m`\color{#176c82}{x}`)}
  {label(150,23,m`\color{#936114}{${side}}`)}{label(150,172,m`\color{#936114}{${side}}`)}
  {stage===1&&label(150,95,'S')}
 </svg><p className="m1-quadratic-caption">辺の対応を表す模式図</p></div>;
}
export default function Math1QuadraticDiagram({kind,stage}:Props){
 if(kind==='m1-quadratic-rectangle')return <Rectangle stage={stage}/>;
 if(kind==='m1-quadratic-domain')return <CoordinateDiagram responsive title="入力の端から出力の端へ" description={stage===0?m`閉じた点 $(0,2)$ を含みます。`:m`白い点 $(3,-1)$ は境界だけを示し、グラフには含みません。`} xRange={[-1,4]} yRange={[-2,3]} curves={[{label:m`$y=-x+2$、$0\le x<3$`,value:x=>-x+2,from:0,to:3}]} points={[{x:0,y:2,label:m`含む $(0,2)$`},{x:3,y:-1,open:true,label:stage>0?m`除く $(3,-1)$`:""}]} segments={stage>0?[{from:[3,-1],to:[0,-1],dashed:true,color:ochre},{from:[0,0],to:[0,2],color:blue,width:3}]:[]}/>;
 if(kind==='m1-quadratic-conditions')return <CoordinateDiagram responsive title={stage===2?'二つの条件を満たす放物線':'頂点と通る点'} description={stage===0?m`頂点 $(1,-2)$ は位置を決めます。`:m`点 $(2,1)$ は、横座標 $2$ と高さ $1$ の対応です。`} xRange={[-1,3]} yRange={[-3,5]} points={[{x:1,y:-2,label:m`頂点 $(1,-2)$`},...(stage>0?[{x:2,y:1,label:m`通る点 $(2,1)$`}]:[])]} curves={stage===2?[{label:m`$y=3(x-1)^2-2$`,value:x=>3*(x-1)**2-2}]:[]} segments={[{from:[1,-3],to:[1,5],dashed:true,label:m`軸 $x=1$`}]}/>;
 if(kind==='m1-quadratic-vertex')return <CoordinateDiagram responsive title="頂点・軸・対称な二点" description={stage<2?m`平方の値が等しい二つの入力は、同じ高さになります。`:m`軸の両側へ対称に続く放物線です。`} xRange={[-2,4]} yRange={[-4,6]} curves={stage===2?[{label:m`$y=2(x-1)^2-3$`,value:x=>2*(x-1)**2-3}]:[]} points={[{x:1,y:-3,label:m`頂点 $(1,-3)$`},...(stage>0?[{x:0,y:-1,label:m`$(0,-1)$`},{x:2,y:-1,label:m`$(2,-1)$`}]:[])]} segments={[{from:[1,-4],to:[1,6],dashed:true,label:m`軸 $x=1$`}]}/>;
 if(kind==='m1-quadratic-intercepts')return <CoordinateDiagram responsive title="高さゼロの点" description={stage<2?m`曲線と $x$ 軸が共有する点を調べます。`:m`二つの解を横座標にし、縦座標は $0$ です。`} xRange={[-3,4]} yRange={[-3,6]} curves={[{label:m`$y=x^2-x-2$`,value:x=>x*x-x-2}]} points={stage===0?[]:[{x:-1,y:0,label:stage===1?m`$x=-1$`:m`$(-1,0)$`},{x:2,y:0,label:stage===1?m`$x=2$`:m`$(2,0)$`}]}/>;
 if(kind==='m1-quadratic-boundaries')return <CoordinateDiagram responsive title={stage===2?'曲線は常に軸より上':'接点と、それ以外の高さ'} description={stage===0?m`$y>0$ に対応する入力は $x\ne1$。接点の入力では高さがゼロです。`:stage===1?m`$y\le0$ となるのは、接点の入力 $x=1$ だけです。`:m`$y<0$ となる入力はありません。`} xRange={[-2,4]} yRange={[-1,6]} curves={[{label:stage===2?m`$y=(x-1)^2+2$`:m`$y=(x-1)^2$`,value:x=>(x-1)**2+(stage===2?2:0)}]} points={[{x:1,y:stage===2?2:0,label:stage===2?m`最小の高さ $2$`:m`$(1,0)$`}]}/>;
 if(kind==='m1-quadratic-intersections')return <CoordinateDiagram responsive title="同じ横座標で同じ高さ" description={stage<2?'二曲線を同時に満たす点を探します。':'横座標と高さを組にして答えます。'} xRange={[-3,3]} yRange={[-3,8]} curves={[{label:m`$y=2x^2-2$`,value:x=>2*x*x-2,color:blue},{label:m`$y=x^2+x$`,value:x=>x*x+x,color:ochre}]} points={stage===2?[{x:-1,y:0,label:m`$(-1,0)$`},{x:2,y:6,label:m`$(2,6)$`}]:[]}/>;
 return null;
}
