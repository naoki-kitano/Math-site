"use client";
import {useState} from "react";
import {Formula,MathText} from "./MathText";
import {formulaCorrespondence} from "../content/formula-correspondence";

import FormulaTransfer from "./FormulaTransfer";
import StructureDiagram from "./StructureDiagram";
import LearningStepControls from "./LearningStepControls";

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

export default function FormulaCorrespondence({slug,onCompletionChange,onProgressChange,onContinue,onBack}:{slug:string;onCompletionChange?:(complete:boolean)=>void;onProgressChange?:(progress:number)=>void;onContinue?:()=>void;onBack?:()=>void}){
 const [stage,setStage]=useState(0),[reduce,setReduce]=useState(false);
 const data=formulaCorrespondence[slug];
 if(!data)return null;
 const current=data.steps[stage];
 const go=(next:number)=>{setStage(next);onCompletionChange?.(next===data.steps.length-1);onProgressChange?.(next/Math.max(1,data.steps.length-1));};
 return <section className="panel formula-correspondence" data-formula-lesson={slug} data-stage={stage}>
  <h3>{data.title}</h3>
  <div className="formula-correspondence-readout" aria-live="polite" aria-atomic="true">
   <p><MathText text={current.text}/></p>
   {current.diagram&&<div className="structure-diagram"><StructureDiagram kind={current.diagram.kind} stage={current.diagram.stage} reduce={reduce}/></div>}
   {slug==="logarithm-base-change"?<MovingBase stage={stage} reduce={reduce}/>:current.motion?<FormulaTransfer key={stage} motion={current.motion} reduce={reduce}/>:current.formulas.length>0?<div className="formula-correspondence-lines">{current.formulas.map((tex,i)=><Formula key={i} tex={tex} display/>)}</div>:null}
  </div>
  <LearningStepControls className="formula-correspondence-controls" onPrevious={stage>0?()=>go(stage-1):onBack} onNext={stage<data.steps.length-1?()=>go(stage+1):onContinue}/>
  {data.check&&<p className="start-check"><MathText text={data.check}/></p>}
  {(slug==="logarithm-base-change"||data.steps.some(step=>step.motion||(step.diagram&&(step.diagram.animated??!/^m[12]-/.test(step.diagram.kind)))))&&<label className="formula-reduced"><input type="checkbox" checked={reduce} onChange={e=>setReduce(e.target.checked)}/>動きを減らす</label>}
 </section>;
}
