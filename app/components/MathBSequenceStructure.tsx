import {Formula} from "./MathText";

const m = String.raw;
const teal = "#24778a", gold = "#a56422", ink = "#29465b";
const M = ({tex}: {tex: string}) => <Formula tex={tex}/>;
const Result = ({tex}: {tex: string}) => <div className="mb-seq-result"><M tex={tex}/></div>;

function IndexedTerms({stage}: {stage: number}) {
  const selected = stage === 0 ? 2 : 3;
  return <><div className="mb-seq-indices">
    <div className="mb-seq-cursor" style={{transform: `translateX(${selected * 100}%)`}}/>
    {[1, 2, 3, 4].map(n => <div key={n} className="mb-seq-index">
      <M tex={`a_{${n}}`}/><M tex={String(2 * n - 1)}/>
    </div>)}
  </div><Result tex={stage === 0 ? "a_3=5" : m`a_{3+1}=7,\quad a_3+1=6`}/></>;
}

function Intervals({values, operations}: {values: number[]; operations: string[]}) {
  return <div className="mb-seq-intervals">{values.map((v, i) => <div className="mb-seq-knot" key={i}>
    <span className="mb-seq-node"><M tex={String(v)}/></span>
    {i < operations.length && <span className="mb-seq-gap"><M tex={operations[i]}/><span aria-hidden="true">→</span></span>}
  </div>)}</div>;
}

function StaircaseSum({stage}: {stage: number}) {
  const points = [1, 2, 3, 4].flatMap(height => Array.from({length: height}, (_, row) =>
    <circle key={height + "-" + row} cx={44 + 26 * (height - 1)} cy={115 - 19 * row} r="6.4"/>));
  return <><svg viewBox="0 0 166 150" aria-label={stage ? "逆順の点を合わせると各列に五個ずつ、全部で二十個" : "四列の点は左から一個、二個、三個、四個"} role="img" className="mb-seq-pairs">
    {[0, 1, 2, 3].map(i => <rect key={i} x={34 + 26 * i} y="29" width="20" height="96" rx="9" fill="#eef4f4"/>)}
    <g fill={teal}>{points}</g>
    <g className="mb-seq-turn" style={{transform: `rotate(${stage ? 180 : 0}deg)`, opacity: stage ? 1 : 0}} fill={gold}>{points}</g>
  </svg><Result tex={stage ? m`2S_4=4\times5` : m`S_4=1+2+3+4`}/></>;
}

type StripKind = "geosum" | "weighted" | "cancel" | "partial";
function AlignRows({kind, stage}: {kind: StripKind; stage: number}) {
  if (kind === "partial") {
    // Keep both rows in the layout while the three subtracted terms rise.
    const terms = ["a_1", "a_2", "a_3", "a_4"];
    return <div className="mb-seq-partial" data-subtracted={stage > 0}>
      <div className="mb-seq-lanes mb-seq-subtraction">
        <span className="mb-seq-minuend"><M tex="S_4"/></span>
        {terms.map((tex,i) => <span className={i < 3 ? "mb-seq-tile mb-seq-matched" : "mb-seq-tile"} key={tex}><M tex={tex}/></span>)}
        <span className="mb-seq-subtrahend"><M tex="-S_3"/></span>
        {terms.slice(0,3).map(tex => <span className="mb-seq-tile lower mb-seq-matched" key={"minus"+tex}><M tex={tex}/></span>)}
      </div>
      <div className="mb-seq-difference" aria-hidden={stage === 0}><Result tex="S_4-S_3=a_4"/></div>
    </div>;
  }
  const weighted = kind === "weighted", cancel = kind === "cancel";
  const first = weighted ? ["1", "2", "3"] : cancel ? ["b_1", "b_2", "b_3", "b_4"] : ["1", "2", "4", "8"];
  const second = weighted ? first : cancel ? ["-b_2", "-b_3", "-b_4", "-b_5"] : ["2", "4", "8", "16"];
  const columns = weighted ? 4 : 5;
  const active = stage > 0;
  const result = weighted ? m`S-rS=r+r^2+r^3-3r^4` : cancel ? m`b_1-b_5` : m`S-2S=1-16`;
  return <>
    <div className="mb-seq-lanes" style={{gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`}}>
      {weighted && ["r", "r^2", "r^3", "r^4"].map((t, i) => <span key={t} style={{gridColumn: i + 1, gridRow: 1}} className="mb-seq-header"><M tex={t}/></span>)}
      {first.map((t, i) => <span className={'mb-seq-tile' + (active && !weighted && i > 0 ? ' paired' : '')} key={'u'+i} style={{gridColumn:i+1, gridRow:2}}><M tex={t}/></span>)}
      {second.map((t, i) => <span className={'mb-seq-tile lower' + (active && !weighted && i < second.length - 1 ? ' paired' : '')} key={'d'+i} style={{
        gridColumn: i + 1, gridRow: 3,
        transform: active ? "translateX(100%)" : "translateX(0)",
        opacity: !active && !cancel ? 0 : 1
      }}><M tex={t}/></span>)}
    </div>
    {active && <Result tex={result}/>}
  </>;
}

// The eight boxes partition [0,k+1]^3 along the three planes through k.
type Point3 = [number, number, number];
const project = ([x, y, z]: Point3): [number, number] => [120 + 15 * (x - y), 100 + 6.8 * (x + y) - 15 * z];
const point = (v: Point3) => project(v).join(",");
const shellColors = ["#a7b7c4", "#76b6bd", "#e1af68", "#b17c92"];

function Block({base, size, count, spread, visible}: {base: Point3; size: Point3; count: number; spread: boolean; visible: boolean}) {
  const [x, y, z] = base, [w, d, h] = size;
  const fill = shellColors[count];
  const offset = base.map(b => spread && b ? 1.5 : 0) as Point3;
  const [dx, dy] = project(offset), [ox, oy] = project([0, 0, 0]);
  const faces: Point3[][] = [
    [[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],
    [[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],
    [[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],
  ];
  const grid: [Point3, Point3][] = [];
  for (let i=1; i<w; i++) grid.push([[x+i,y,z+h],[x+i,y+d,z+h]], [[x+i,y+d,z],[x+i,y+d,z+h]]);
  for (let j=1; j<d; j++) grid.push([[x,y+j,z+h],[x+w,y+j,z+h]], [[x+w,y+j,z],[x+w,y+j,z+h]]);
  for (let l=1; l<h; l++) grid.push([[x,y+d,z+l],[x+w,y+d,z+l]], [[x+w,y,z+l],[x+w,y+d,z+l]]);
  return <g className="mb-seq-block" style={{transform: `translate(${dx-ox}px,${dy-oy}px)`, opacity: visible ? 1 : 0}}>
    {faces.map((face,i) => <g key={i}><polygon points={face.map(point).join(" ")} fill={fill} stroke="#385064" strokeWidth=".8"/>
      {i < 2 && <polygon points={face.map(point).join(" ")} fill="#24394b" opacity={i === 0 ? .12 : .24}/>}</g>)}
    {grid.map(([a,b],i) => <polyline key={i} points={point(a)+" "+point(b)} fill="none" stroke="#364757" strokeWidth=".55" opacity=".62"/>)}
  </g>;
}

function CubeShell({stage}: {stage: number}) {
  const masks = [0, 1, 2, 4, 3, 5, 6, 7];
  return <><svg viewBox="0 0 240 177" className="mb-seq-shell" role="img" aria-label={["一辺三、体積二十七の立方体","立方体の外側に付ける三枚の板、三本の棒、角の一個を分離","三種の部品がもとの立方体の外側に収まった一辺四の立方体"][stage]}>
    {masks.map(mask => {
      const sides = [1, 2, 4].map(bit => (mask & bit) !== 0);
      return <Block key={mask} base={sides.map(edge => edge ? 3 : 0) as Point3}
        size={sides.map(edge => edge ? 1 : 3) as Point3} count={sides.filter(Boolean).length}
        visible={stage > 0 || mask === 0} spread={stage <= 1}/>;
    })}
  </svg>
  {stage === 1 && <div className="mb-seq-legend">{["板", "棒", "角"].map((name, i) => <span key={name}><i style={{background:shellColors[i+1]}}/>{name} <M tex={["3k^2", "3k", "1"][i]}/></span>)}</div>}
  {stage === 2 && <Result tex={m`(k+1)^3-k^3=3k^2+3k+1`}/>}
  </>;
}

function FixedPoint({stage}: {stage: number}) {
  const start = 35, unit = 42;
  return <><svg className="mb-seq-fixed" viewBox="0 0 245 153" role="img" aria-label={stage ? "固定点マイナス一から各項までの距離は一、二、四" : "固定点マイナス一から初項ゼロまでの距離は一"}>
    <line x1={start-12} y1="110" x2="225" y2="110" stroke={ink}/>
    {[-1, 0, 1, 3].map(n => <g key={n}>
      <line x1={start+(n+1)*unit} x2={start+(n+1)*unit} y1="106" y2="114" stroke={ink}/>
      <foreignObject x={start+(n+1)*unit-19} y="119" width="38" height="31"><div className="mb-seq-axis"><M tex={String(n)}/></div></foreignObject>
    </g>)}
    <path d={`M${start} 18V106`} stroke={ink} strokeDasharray="3 4"/>
    {[1,2,4].map((distance,i) => <g key={distance} className="mb-seq-distance" style={{opacity:stage || i === 0 ? 1 : 0, transform: `scaleX(${stage || i===0 ? 1 : 1/distance})`, transitionDelay:stage ? `${i*110}ms` : '0ms'}}>
      <path d={`M${start} ${91-31*i}h${unit*distance}`} stroke={teal} strokeWidth="4"/>
      <circle cx={start+unit*distance} cy={91-31*i} r="4" fill={teal}/>
    </g>)}
  </svg><Result tex={stage ? m`a_{n+1}+1=2(a_n+1)` : m`2(-1)+1=-1`}/></>;
}

export default function MathBSequenceStructure({kind,stage,reduce}: {kind: string; stage: number; reduce: boolean}) {
  const name = kind.slice("mb-sequence-".length);
  let picture;
  switch (name) {
    case "indices": picture = <IndexedTerms stage={stage}/>; break;
    case "gaps": picture = <Intervals values={stage ? [1,4,9,16] : [3,5,7,9]} operations={stage ? ["+3","+5","+7"] : ["+2","+2","+2"]}/>; break;
    case "ratio": picture = <Intervals values={[2,-4,8,-16]} operations={Array(3).fill(m`\times(-2)`)}/>; break;
    case "pairs": picture = <StaircaseSum stage={stage}/>; break;
    case "geosum": case "weighted": case "cancel": case "partial": picture = <AlignRows kind={name} stage={stage}/>; break;
    case "shell": picture = <CubeShell stage={stage}/>; break;
    case "fixed": picture = <FixedPoint stage={stage}/>; break;
    default: return null;
  }
  return <div className="mb-seq-scene" data-reduce={reduce}>{picture}</div>;
}
