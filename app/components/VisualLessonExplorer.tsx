"use client";
import {useState} from "react";
import {Formula,MathText} from "./MathText";
import ComplexRotationExplorer from "./ComplexRotationExplorer";
import RelationExplorer from "./RelationExplorer";
import {relationStarts} from "../content/relation-lessons";
import {visualLessons,type VisualSlug,type VisualKind} from "../content/visual-lessons";
import {intervalCases,intervalExtrema,parabolaValue,combinationPairs,geometricRows} from "../lib/visual-models";

const m=String.raw, round=(n:number)=>Number(n.toFixed(3));
function Label({x,y,tex,width=90}:{x:number;y:number;tex:string;width?:number}){
 return <foreignObject x={x-width/2} y={y-23} width={width} height="62"><div className="unit-math-label"><Formula tex={tex}/></div></foreignObject>;
}
function Plane({complex=false}:{complex?:boolean}){
 return <g><line x1="40" x2="468" y1="327" y2="327" stroke="#8195a9"/><line x1="165" x2="165" y1="24" y2="360" stroke="#8195a9"/>
  <Label x={472} y={350} tex={complex?m`\operatorname{Re}`:"x"} width={50}/><Label x={192} y={24} tex={complex?m`\operatorname{Im}`:"y"} width={50}/>
  {[-2,-1,0,1,2,3,4,5,6].map(x=><Label key={x} x={165+43*x} y={350} tex={String(x)} width={32}/>)}
  {[1,2,3,4,5,6].map(y=><Label key={y} x={140} y={327-43*y} tex={String(y)} width={32}/>)}
 </g>;
}
const px=(x:number)=>round(165+43*x),py=(y:number)=>round(327-43*y);
function Curve({a,b,dashed=false}:{a:number;b:number;dashed?:boolean}){
 const d=Array.from({length:101},(_,i)=>{const x=a+(b-a)*i/100;return`${i?"L":"M"}${px(x)},${py(parabolaValue(x))}`;}).join(" ");
 return <path d={d} fill="none" stroke={dashed?"#a5b1bd":"#087c70"} strokeWidth={dashed?2:4} strokeDasharray={dashed?"5 5":undefined}/>;
}
function FractionBars({stage}:{stage:number}){
 return <div className="fraction-visual">
  {(stage===2?[{n:6,d:6,label:"帯一つ分"},{n:1,d:6,label:"残り"}]:stage===1?[{n:4,d:6,label:"上の分数"},{n:3,d:6,label:"下の分数"}]:[{n:2,d:3,label:"上の分数"},{n:1,d:2,label:"下の分数"}]).map(({n,d,label},row)=><div key={row}>
   <span>{label}</span><div className="fraction-strip" style={{gridTemplateColumns:`repeat(${d},1fr)`}} aria-label={`${d}等分のうち${n}個`}>
    {Array.from({length:d},(_,i)=><span key={i} className={i<n?(row?"filled-orange":"filled-teal"):""}/>)}
   </div><Formula tex={m`\dfrac{${n}}{${d}}`}/>
  </div>)}
 </div>;
}
function CancelTiles({stage}:{stage:number}){
 return <div className="cancel-visual">
  <p>分子と分母の掛け算を見比べます。</p>
  <div className="factor-fraction">
   <div>{stage===0?<Formula tex="x^2-1"/>:stage===1?<><span className="matching-factor"><Formula tex="(x-1)"/></span><Formula tex="\times"/><span><Formula tex="(x+1)"/></span></>:<Formula tex="x+1"/>}</div>
   <div>{stage<2?<span className={stage===1?"matching-factor":""}><Formula tex="x-1"/></span>:<Formula tex="1"/>}</div>
  </div>
  <p className="meta">{stage===1?"枠で囲んだ式は、どちらも掛け算の一つの因数です。":stage===2?"同じ零でない因数で割ったので、分数全体の値は変わりません。":"引き算の項どうしを、そのまま消すことはできません。"}</p>
 </div>;
}
function InequalityLine({stage}:{stage:number}){
 const x=(v:number)=>250+34*v;
 return <svg viewBox="0 0 500 185" className="visual-svg" role="img" aria-label={stage===2?"白丸の負の3より右が解":stage===1?"負の2は負の5より右":"2は5より左"}>
  <line x1="24" x2="476" y1="100" y2="100" stroke="#8195a9"/>
  {[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map(v=><g key={v}><line x1={x(v)} x2={x(v)} y1="94" y2="106" stroke="#8195a9"/><Label x={x(v)} y={133} tex={String(v)} width={34}/></g>)}
  {stage<2?[2,5].map((v,i)=>{const actual=stage===0?v:-v;return <g key={v}><circle cx={x(actual)} cy="100" r="7" fill={i?"#c67c28":"#087c70"}/><Label x={x(actual)} y={53} tex={String(actual)} width={60}/></g>;}):<><line x1={x(-3)} x2="475" y1="100" y2="100" stroke="#087c70" strokeWidth="5"/><path d="M463 91 L476 100 L463 109" fill="none" stroke="#087c70" strokeWidth="3"/><circle cx={x(-3)} cy="100" r="7" fill="white" stroke="#087c70" strokeWidth="3"/></>}
 </svg>;
}
function Extrema({stage,choice}:{stage:number;choice:number}){
 const {a,b}=intervalCases[choice],result=intervalExtrema(a,b);
 return <>
  <svg viewBox="0 0 500 390" className="visual-svg" role="img" aria-label="破線は区間外、緑の実線は指定された閉区間の放物線">
   <Plane/><Curve a={-1.5} b={3.5} dashed/><Curve a={a} b={b}/>
   <line x1={px(a)} x2={px(b)} y1={py(0)} y2={py(0)} stroke="#087c70" strokeWidth="5" opacity=".4"/>
   <line x1={px(1)} x2={px(1)} y1="45" y2={py(0)} stroke="#8b9cab" strokeDasharray="3 5"/>
   <Label x={px(1)+26} y={55} tex="x=1"/>
   {[a,b,...(stage>0&&a<=1&&1<=b?[1]:[])].filter((v,i,arr)=>arr.indexOf(v)===i).map(x=><circle key={x} cx={px(x)} cy={py(parabolaValue(x))} r="6" fill="#087c70" stroke="white" strokeWidth="2"/>)}
  </svg>
  {stage>0&&<div className="visual-candidates">{result.points.map(p=><div key={p.x}><Formula tex={`x=${p.x}`}/><Formula tex={`y=${p.y}`}/></div>)}</div>}
  {stage===2&&<div className="unit-answer"><Formula tex={`\\text{最小値 }${result.min}\\quad(x=${result.minX.join(",")})`} display/><Formula tex={`\\text{最大値 }${result.max}\\quad(x=${result.maxX.join(",")})`} display/></div>}
  {stage===1&&<p>{a<=1&&1<=b?"頂点は区間内です。両端と頂点の三つの高さを比べます。":"頂点は区間外なので使えません。この区間では右へ行くほど高くなるため、両端を比べます。"}</p>}
 </>;
}
function Combinations({stage}:{stage:number}){
 return <div className={`combination-visual stage-${stage}`}>{combinationPairs.map(pair=><div key={pair} className={stage>0?"same-pair":""}>
  <span><Formula tex={pair}/></span>{stage<2&&<span><Formula tex={pair.split("").reverse().join("")}/></span>}
 </div>)}</div>;
}
function GeometricRows({stage}:{stage:number}){
 const row=(scaled:boolean)=>Array.from({length:5},(_,i)=>{
  const index=scaled&&stage>0?i-1:i;
  const n=index<0?null:(scaled&&stage>0?geometricRows.scaled:geometricRows.original)[index];
  const common=stage===2&&i>=1&&i<=3;
  return <span key={i} className={common?"common-term":""}>{n!==undefined&&n!==null&&<Formula tex={String(n)}/>}</span>;
 });
 return <div className="geometric-visual">
  <p>同じ列の数を引きます。</p><div className="geometric-row"><Formula tex="S"/>{row(false)}</div>
  <div className="geometric-row"><Formula tex={stage>0?"2S":"S"}/>{row(true)}</div>
  {stage===2&&<p className="meta">枠の中は同じ数どうしの引き算で零になります。</p>}
 </div>;
}
function SignedArea({stage}:{stage:number}){
 const x=(v:number)=>190+80*v,y=(v:number)=>235-80*v;
 return <svg viewBox="0 0 500 365" className="visual-svg" role="img" aria-label="直線y=x。負の1から0は横軸の下、0から2は上。">
  <line x1="60" x2="447" y1={y(0)} y2={y(0)} stroke="#8195a9"/><line x1={x(0)} x2={x(0)} y1="25" y2="340" stroke="#8195a9"/>
  <polygon points={`${x(-1)},${y(0)} ${x(-1)},${y(-1)} ${x(0)},${y(0)}`} fill="#f2d9b6" stroke="#bb7c38"/>
  <polygon points={`${x(0)},${y(0)} ${x(2)},${y(2)} ${x(2)},${y(0)}`} fill="#d8eee6" stroke="#087c70"/>
  <line x1={x(-1.2)} x2={x(2.3)} y1={y(-1.2)} y2={y(2.3)} stroke="#233d5b" strokeWidth="2"/>
  <Label x={430} y={y(0)+20} tex="x" width={32}/><Label x={x(0)-20} y={28} tex="y" width={32}/>
  <Label x={x(-1)} y={y(0)-23} tex="-1"/><Label x={x(0)-22} y={y(0)+27} tex="0" width={32}/><Label x={x(2)} y={y(0)+27} tex="2"/>
  <Label x={290} y={38} tex="y=x"/>
  <Label x={65} y={280} tex={stage===1?m`-\dfrac12`:m`\dfrac12`} width={80}/><Label x={300} y={170} tex="2"/>
 </svg>;
}
function Drawing({kind,stage,choice}:{kind:VisualKind;stage:number;choice:number}){
 if(kind==="fractions")return <FractionBars stage={stage}/>;
 if(kind==="cancel")return <CancelTiles stage={stage}/>;
 if(kind==="inequality")return <InequalityLine stage={stage}/>;
 if(kind==="extrema")return <Extrema stage={stage} choice={choice}/>;
 if(kind==="combination")return <Combinations stage={stage}/>;
 if(kind==="geometric")return <GeometricRows stage={stage}/>;
 if(kind==="area")return <SignedArea stage={stage}/>;
 return null;
}
function Explorer({slug}:{slug:VisualSlug}){
 const data=visualLessons[slug],last=data.steps.length-1;
 const [stage,setStage]=useState(0),[choice,setChoice]=useState(0);
 const go=(next:number)=>setStage(next);
 return <section className="visual-lesson panel" data-visual={data.kind} data-stage={stage} data-progress={stage}>
  <h3>{data.title}</h3>
  {data.kind==="extrema"&&<div className="graph-controls" role="group" aria-label="定義域を選ぶ">{intervalCases.map(({a,b},i)=><button key={i} aria-pressed={choice===i} onClick={()=>{setChoice(i);go(0);}}><MathText text={`$${a}\\le x\\le${b}$`}/></button>)}</div>}
  <div className="unit-stages" role="group" aria-label="考える段階">{data.steps.map((label,i)=><button key={label} aria-pressed={stage===i} onClick={()=>go(i)}>{i+1} {label}</button>)}</div>
  <div className="visual-readout" aria-live="polite" aria-atomic="true">
   <p><MathText text={data.text[stage]}/></p>
   {data.kind==="area"&&stage===2&&<><Formula tex="\int_{-1}^0(-x)\,dx=\dfrac12" display/><Formula tex="\int_0^2x\,dx=2" display/></>}
   <Formula tex={data.tex[stage]} display/>
  </div>
  <Drawing kind={data.kind} stage={stage} choice={choice}/>
  <div className="actions unit-controls">
   {stage<last&&<button className="button" aria-label="次の段階を見る" onClick={()=>go(stage+1)}>{data.steps[stage+1]}</button>}
   <button className="button secondary" onClick={()=>go(0)}>初めに戻す</button>
  </div>
 </section>;
}
export default function VisualLessonExplorer({slug}:{slug:string}){
 if(Object.hasOwn(relationStarts,slug))return <RelationExplorer slug={slug}/>;
 if(slug==="mc-complex-rotation")return <ComplexRotationExplorer/>;
 return Object.hasOwn(visualLessons,slug)?<Explorer key={slug} slug={slug as VisualSlug}/>:null;
}
