"use client";
import {useState} from "react";
import {Formula,MathText} from "./MathText";
import {formulaCorrespondence} from "../content/formula-correspondence";

const m=String.raw;

function MovingBase({stage,reduce}:{stage:number;reduce:boolean}){
 const item=(tex:string,x:number,y:number,small=false,extra="")=><foreignObject x="0" y="0" width="90" height="60" className={`formula-moving-token ${small?"small":""} ${extra}`} style={{transform:`translate(${x}px, ${y}px)`}}><div><Formula tex={tex}/></div></foreignObject>;
 return <>
  <svg className={`formula-moving ${reduce?"reduce-motion":""}`} viewBox="0 0 340 170" aria-hidden="true" focusable="false">
   {item(m`\log`,24,64)}
   {stage>=2&&item(m`\color{#936114}{a}`,67,81,true,"ghost")}
   {stage>=1&&item(m`\color{#176c82}{b}`,84,63,false,"ghost")}
   {item(m`\color{#936114}{a}`,stage>=2?253:67,stage>=2?103:81,stage<2,"moving")}
   {item(m`\color{#176c82}{b}`,stage>=1?253:84,stage>=1?18:63,false,"moving")}
   {stage>=1&&<g className="formula-frame">{item(stage>=3?m`\log_c`:m`\log_{\square}`,195,19)}<line x1="188" y1="78" x2="290" y2="78" stroke="#263c53" strokeWidth="2"/></g>}
   {stage>=2&&item(stage>=3?m`\log_c`:m`\log_{\square}`,195,103,false,"formula-frame")}
   {stage>=3&&item(m`=`,144,64,false,"formula-frame")}
  </svg>
  <span className="sr-only"><MathText text={stage===3?m`$\log_a b=\dfrac{\log_c b}{\log_c a}$`:m`$\log_a b$ から右辺を組み立てます。`}/></span>
 </>;
}

function MovingProduct({stage,reduce}:{stage:number;reduce:boolean}){
 const item=(tex:string,x:number,y:number,extra="")=><foreignObject x="0" y="0" width="90" height="60" className={`formula-moving-token ${extra}`} style={{transform:`translate(${x}px, ${y}px)`}}><div><Formula tex={tex}/></div></foreignObject>;
 return <>
  <svg className={`formula-moving ${reduce?"reduce-motion":""}`} viewBox="0 0 340 170" aria-hidden="true" focusable="false">
   <defs>
    <marker id="product-arrow-m" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#176c82"/></marker>
    <marker id="product-arrow-n" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#936114"/></marker>
   </defs>
   {item(m`\log_a(`,106,17)}
   {item(m`)`,218,17)}
   {stage>=1&&<g className="formula-frame">
    {item(m`\color{#176c82}{M}`,166,17)}{item(m`\color{#936114}{N}`,192,17)}
    <path d="M178 57 C178 75 108 78 108 101" fill="none" stroke="#176c82" strokeWidth="2" markerEnd="url(#product-arrow-m)"/>
    <path d="M203 57 C203 75 228 78 228 101" fill="none" stroke="#936114" strokeWidth="2" markerEnd="url(#product-arrow-n)"/>
    {item(m`\log_a`,48,112)}{item(m`+`,132,112)}{item(m`\log_a`,171,112)}
   </g>}
   {stage>=1&&item(m`=`,18,112,"formula-equals")}
   {item(m`\color{#176c82}{M}`,stage>=1?98:166,stage>=1?112:17,"moving")}
   {item(m`\color{#936114}{N}`,stage>=1?218:192,stage>=1?112:17,"moving")}
  </svg>
  <span className="sr-only"><MathText text={stage>=1?m`$\log_a(MN)=\log_a M+\log_a N$`:m`$\log_a(MN)$ の真数を見ます。`}/></span>
 </>;
}

export default function FormulaCorrespondence({slug,onCompletionChange}:{slug:string;onCompletionChange?:(complete:boolean)=>void}){
 const [stage,setStage]=useState(0),[reduce,setReduce]=useState(false);
 const data=formulaCorrespondence[slug];
 if(!data)return null;
 const current=data.steps[stage];
 const go=(next:number)=>{setStage(next);onCompletionChange?.(next===data.steps.length-1);};
 return <section className="panel formula-correspondence" data-formula-lesson={slug} data-stage={stage}>
  <h3>{data.title}</h3>
  <div className="formula-correspondence-readout" aria-live="polite" aria-atomic="true">
   <p><MathText text={current.text}/></p>
   {slug==="logarithm-base-change"?<MovingBase stage={stage} reduce={reduce}/>:slug==="logarithm-laws"&&stage<2?<MovingProduct stage={stage} reduce={reduce}/>:<div className="formula-correspondence-lines">{current.formulas.map((tex,i)=><Formula key={i} tex={tex} display/>)}</div>}
  </div>
  <div className="actions formula-correspondence-controls">
   {stage>0&&<button className="button secondary" onClick={()=>go(stage-1)}>前へ</button>}
   {stage<data.steps.length-1&&<button className="button" onClick={()=>go(stage+1)}>次へ</button>}
  </div>
  {(stage===data.steps.length-1||slug==="logarithm-laws")&&<p className="start-check"><MathText text={data.check}/></p>}
  {(slug==="logarithm-base-change"||slug==="logarithm-laws")&&<label className="formula-reduced"><input type="checkbox" checked={reduce} onChange={e=>setReduce(e.target.checked)}/>動きを減らす</label>}
 </section>;
}
