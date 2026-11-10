"use client";
import {useRef,useState} from "react";
import {math1DataReadingContext} from "../content/math1-data-reading-context";
import {math1QuadraticReadingContext} from "../content/math1-quadratic-reading-context";
import {math3ReadingContext} from "../content/math3-reading-context";
import {math2ReadingContext} from "../content/math2-reading-context";
import {MathText} from "./MathText";
import LearningStepControls from "./LearningStepControls";
export default function BasicReader({slug,introduction,rule,onCompletionChange,onProgressChange,onContinue,onBack}:{slug:string;introduction:string[];rule:string;onCompletionChange?:(complete:boolean)=>void;onProgressChange?:(progress:number)=>void;onContinue?:()=>void;onBack?:()=>void}){
 const intro=slug==="m3-e-and-natural-log"?[introduction.slice(0,2).join(" "),...introduction.slice(2)]:introduction;
 const context=math1DataReadingContext[slug]??math1QuadraticReadingContext[slug]??math2ReadingContext[slug]??math3ReadingContext[slug];
 const passages=[...intro,...(introduction.includes(rule)?[]:[rule])];
 const [position,setPosition]=useState(0),[expanded,setExpanded]=useState(false);const full=useRef<HTMLDetailsElement>(null);
 const go=(next:number)=>{setPosition(next);onCompletionChange?.(next===passages.length-1||!!full.current?.open);onProgressChange?.(full.current?.open?1:next/Math.max(1,passages.length-1));};
 return <div className="basics-reader">
  <div className="basic-passage" aria-live="polite" aria-atomic="true">{context&&(position>0||["m3-trig-basic-integrals","m3-mean-value-theorem","m3-linear-approximation","m3-graph-length"].includes(slug))&&<p className="basic-context"><MathText text={context}/></p>}<p><MathText text={passages[position]}/></p></div>
  <LearningStepControls onPrevious={position>0?()=>go(position-1):onBack} onNext={expanded||position===passages.length-1?onContinue:()=>go(position+1)}/>
  <details ref={full} className="supplement" onToggle={e=>{setExpanded(e.currentTarget.open);onCompletionChange?.(e.currentTarget.open||position===passages.length-1);onProgressChange?.(e.currentTarget.open?1:position/Math.max(1,passages.length-1));}}><summary>説明をまとめて読む</summary>{passages.map((text,i)=><p key={i}><MathText text={text}/></p>)}</details>
 </div>;
}
