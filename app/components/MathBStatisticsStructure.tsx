import type {ReactNode} from 'react';
import {MathText} from './MathText';

const m = String.raw;
const ink = '#193d55';
const teal = '#087d80';
const ochre = '#946014';
const pale = '#a6dcd8';
const axis = '#6c8291';
type Props = {kind: string; stage: number; reduce: boolean};

function Label({x, y, children, width = 56}: {x:number; y:number; children:string; width?:number}) {
  return <foreignObject x={x-width/2} y={y} width={width} height={32}>
    <div className="mb-stat-label"><MathText text={children}/></div>
  </foreignObject>;
}

function Plot({height, description, children}: {height:number; description:string; children:ReactNode}) {
  return <svg viewBox={`0 0 320 ${height}`} role="img" aria-label={description}>{children}</svg>;
}

function CoinCounts({grouped}: {grouped: boolean}) {
  const orders = ['裏裏', '表裏', '裏表', '表表'];
  const columns = [55, 160, 160, 265];
  const rows = [41, 65, 24, 41];
  return <Plot height={119} description={grouped ? '表が0回の列は一列、1回の列は二列、2回の列は一列。' : '二回投げた結果は裏裏、表裏、裏表、表表の四列。'}>
    {orders.map((name,i)=><g key={name} className="mb-stat-slide" style={{transform:`translate(${grouped ? columns[i] : 44+77*i}px, ${grouped ? rows[i] : 42}px)`}}>
      <rect x={-28} y={-14} width={56} height={30} rx={6} fill="#eef7f6" stroke={teal}/>
      <Label x={0} y={-14}>{name}</Label>
    </g>)}
    {grouped && [0,1,2].map((v)=><Label key={v} x={55+105*v} y={87}>{`$${v}$ 回`}</Label>)}
  </Plot>;
}

function PairMeans({averaged}: {averaged: boolean}) {
  const pairs = [[0,0],[0,2],[2,0],[2,2]];
  const x = (value:number) => 80+90*value;
  return <Plot height={160} description={averaged?'四つの組の平均は順に0、1、1、2。':'四つの組は順に0と0、0と2、2と0、2と2。'}>
    {[0,1,2].map(v=><g key={v}><line x1={x(v)} x2={x(v)} y1={12} y2={133} stroke="#c4d4da" strokeDasharray="3 4"/><Label x={x(v)} y={131}>{`$${v}$`}</Label></g>)}
    {pairs.map(([a,b],i)=>{
      const y=22+i*30, mean=(a+b)/2;
      return <g key={i}>
        <Label x={27} y={y-13} width={52}>{`$(${a},${b})$`}</Label>
        <line x1={x(a)} x2={x(b)} y1={y} y2={y} stroke="#a5bdc2"/>
        {[a,b].map((value,j)=><circle key={j} className="mb-stat-slide" cx={0} cy={0} r={6} strokeWidth={1.5} stroke={ink} fill={j?ink:pale}
          style={{transform:`translate(${x(averaged?mean:value)}px,${averaged?y:y+(j?3:-3)}px)`}}/>)}
      </g>;
    })}
  </Plot>;
}

function Density({point}: {point:boolean}) {
  return <Plot height={133} description={point?'区間の右端が1へ戻り、幅も面積も0になる。':'0から4で密度は四分の一。幅1の帯の面積は四分の一。'}>
    <rect x={62} y={27} width={224} height={64} fill="#eef7f6" stroke={ink}/>
    <rect className="mb-stat-slide" x={118} y={27} width={56} height={64} fill={pale} style={{transformOrigin:'118px 91px',transform:`scaleX(${point?0:1})`}}/>
    <line x1={118} x2={118} y1={27} y2={91} stroke={teal} strokeWidth={2}/>
    <line className="mb-stat-slide" x1={174} x2={174} y1={27} y2={91} stroke={teal} strokeWidth={2} style={{transform:`translateX(${point?-56:0}px)`}}/>
    <Label x={38} y={10}>{m`$\frac14$`}</Label><path d="M 62 13 V 91 H 305" stroke={axis} fill="none"/>
    {[0,1,2,4].map(v=><Label x={62+56*v} y={95} key={v}>{`$${v}$`}</Label>)}
  </Plot>;
}

// Horizontal positions are in standard-deviation units. A second calibrated
// ruler can slide next to the same physical region without redrawing its area.
const xZ = (z:number) => 160+39*z;
const yDensity = (z:number) => 83-59*Math.exp(-z*z/2);
function normalPath(a:number,b:number,filled=false) {
  const points=Array.from({length:91},(_,i)=>{
    const z=a+(b-a)*i/90;
    return `${i?'L':'M'}${xZ(z).toFixed(2)} ${yDensity(z).toFixed(2)}`;
  });
  if(filled) points.push(`L${xZ(b)} 83 H${xZ(a)} Z`);
  return points.join(' ');
}
function NormalPlot({kind, stage}: {kind:string; stage:number}) {
  const standard=kind==='standard', two=kind==='two-tails';
  const threshold=two?1.96:1.645, observed=two?2.4:-2.4;
  const areas=standard?[[0,1]]:two?[[-3.6,-threshold],[threshold,3.6]]:[[threshold,3.6]];
  const direction=two?'左右の棄却域':'上側の棄却域';
  const description=standard?'平均から標準偏差一個上までの領域が、元の目盛りの50から54と、標準化した目盛りの0から1に対応する。':`${direction}を網掛け。${stage?`観測値 ${observed} を丸で示す。`:''}`;
  return <Plot height={standard?158:128} description={description}>
    {areas.map(([lo,hi])=><path key={lo} d={normalPath(lo,hi,true)} fill={standard?pale:'#e6c78b'}/>)}
    <path d={normalPath(-3.6,3.6)} stroke={ink} strokeWidth={2} fill="none"/>
    <line x1={13} x2={307} y1={83} y2={83} stroke={axis}/>
    {(standard?[0,1]:two?[-threshold,threshold]:[threshold]).map(v=><line key={v} x1={xZ(v)} x2={xZ(v)} y1={yDensity(v)} y2={83} stroke={standard?teal:ochre} strokeWidth={2}/>)}
    {standard ? <>
      <Label x={27} y={87}>{'$X$'}</Label>
      {[-2,0,1,2].map(v=><Label key={v} x={xZ(v)} y={87}>{`$${50+4*v}$`}</Label>)}
      <g className="mb-stat-slide" style={{transform:`translateY(${stage?0:16}px)`,opacity:stage?1:0}}>
        <line x1={50} x2={270} y1={119} y2={119} stroke={teal}/>
        <Label x={27} y={119}>{'$Z$'}</Label>
        {[-2,0,1,2].map(v=><g key={v}><line x1={xZ(v)} x2={xZ(v)} y1={116} y2={122} stroke={teal}/><Label x={xZ(v)} y={120}>{`$${v}$`}</Label></g>)}
      </g>
    </> : <>
      <Label x={xZ(0)} y={85}>{'$0$'}</Label>
      {(two?[-threshold,threshold]:[threshold]).map(v=><Label key={v} x={xZ(v)} y={85}>{`$${v}$`}</Label>)}
      {stage>0&&<g><line x1={xZ(observed)} x2={xZ(observed)} y1={37} y2={81} stroke={teal} strokeDasharray="3 3"/><circle cx={xZ(observed)} cy={82} r={4} fill={teal}/><Label x={xZ(observed)} y={10} width={100}>{`$z=${observed}$`}</Label></g>}
    </>}
  </Plot>;
}

function ContinuityCorrection({corrected}: {corrected:boolean}) {
  const x=(k:number)=>25+(k-52)*44;
  // Ratios of adjacent B(100, 1/2) probabilities, on a common vertical scale.
  const heights=[70];
  for(let k=52;k<58;k++) heights.push(heights.at(-1)!*(100-k)/(k+1));
  return <Plot height={150} description={corrected?'55回以上に対応する棒の左端は54.5。':'52回から58回付近の二項確率。55回以上の棒を強調。'}>
    {heights.map((h,i)=><g key={i}>
      <rect x={x(52+i)-22} y={101-h} width={44} height={h} fill={i<3?'#e3edef':pale} stroke={ink}/>
      {i%2===1&&<Label x={x(52+i)} y={102}>{`$${52+i}$`}</Label>}
    </g>)}
    <g className="mb-stat-slide" style={{transform:`translateX(${corrected?-22:0}px)`}}>
      <line x1={x(55)} x2={x(55)} y1={32} y2={101} stroke={ochre} strokeWidth={2.5}/>
      <Label x={x(55)} y={2}>{corrected?'$54.5$':'$55$'}</Label>
    </g>
  </Plot>;
}

function Intervals({coverage, stage}: {coverage:boolean; stage:number}) {
  const centers=coverage?[49,50.5,52.5,48.6]:[50];
  const scale=coverage?29:51, x=(value:number)=>145+(value-50)*scale;
  const expanded=!coverage||stage>0;
  return <Plot height={coverage?163:109} description={coverage?'実例の四区間を同一の目盛りで表示。真の母平均50は固定され、中心52.5の区間だけは届かない。':'標本平均50から左右へ1.96ずつ取り、区間は48.04から51.96。'}>
    {coverage&&<><line x1={x(50)} x2={x(50)} y1={27} y2={146} stroke={ink} strokeDasharray="4 3"/><Label x={x(50)} y={0} width={124}>{m`母平均 $50$`}</Label></>}
    {centers.map((mean,i)=>{
      const y=coverage?49+i*30:48, color=coverage&&expanded&&Math.abs(mean-50)>1.96?ochre:teal;
      return <g key={mean}>
        <g className={coverage?'mb-stat-slide':'mb-stat-unfold'} style={{transformOrigin:`${x(mean)}px ${y}px`,transform:`scaleX(${expanded?1:0})`}} stroke={color} strokeWidth={2.5}>
          <line x1={x(mean-1.96)} x2={x(mean+1.96)} y1={y} y2={y}/>
          {[mean-1.96,mean+1.96].map(v=><line key={v} x1={x(v)} x2={x(v)} y1={y-5} y2={y+5}/>)}</g>
        <circle cx={x(mean)} cy={y} r={4} fill={color}/>
      </g>;
    })}
    {!coverage&&[48.04,50,51.96].map(v=><Label key={v} x={x(v)} y={55}>{`$${v}$`}</Label>)}
  </Plot>;
}

export default function MathBStatisticsStructure({kind,stage,reduce}:Props) {
  const scene=kind.slice('mb-statistics-'.length);
  let plot:ReactNode;
  switch(scene){
    case 'coins': plot=<CoinCounts grouped={stage>0}/>; break;
    case 'averages': plot=<PairMeans averaged={stage>0}/>; break;
    case 'density': plot=<Density point={stage>0}/>; break;
    case 'correction': plot=<ContinuityCorrection corrected={stage>0}/>; break;
    case 'standard': case 'two-tails': case 'upper-tail': plot=<NormalPlot kind={scene} stage={stage}/>; break;
    case 'interval': case 'coverage': plot=<Intervals coverage={scene==='coverage'} stage={stage}/>; break;
    default: return null;
  }
  return <div className="mb-stat-plot" data-scene={scene} data-reduce={reduce}>{plot}</div>;
}
