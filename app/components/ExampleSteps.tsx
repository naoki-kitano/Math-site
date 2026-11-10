"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import type { Step } from "../content/lessons";
import { Steps } from "./StepList";
import {distinctSteps} from "../lib/step-heading";
import LearningStepControls from "./LearningStepControls";

export type CompletionAction={label:string;onClick:()=>void;secondaryLabel?:string;onSecondary?:()=>void};
/** One control continues the explanation, then the next learning task. */
export default function ExampleSteps({steps:sourceSteps,onCompletionChange,onStepChange,onProgressChange,onContinue,onBack,completionAction,children}:{steps:Step[];onCompletionChange?:(complete:boolean)=>void;onStepChange?:(step:number,complete:boolean)=>void;onProgressChange?:(progress:number)=>void;onContinue?:()=>void;onBack?:()=>void;completionAction?:CompletionAction;children?:ReactNode}){
 const steps=distinctSteps(sourceSteps),[count,setCount]=useState(1),[expanded,setExpanded]=useState(false);
 const id=useId(),details=useRef<HTMLDetailsElement>(null);
 const complete=count>=steps.length||expanded;
 const report=(next:number,open:boolean)=>{const done=next>=steps.length||open;onCompletionChange?.(done);onStepChange?.(Math.max(0,next-1),done);onProgressChange?.(done?1:(next-1)/Math.max(1,steps.length-1));};
 const go=(next:number)=>{setCount(next);report(next,!!details.current?.open);};
 const action=complete?completionAction:undefined;
 return <div className="example-walkthrough">
  {!!steps.length&&<div id={id} aria-live="polite" aria-atomic="true"><Steps steps={[steps[count-1]]} showNumbers={false}/></div>}
  {children}
  <LearningStepControls className="walkthrough-actions" onPrevious={action?action.onSecondary:count>1?()=>go(count-1):onBack} previousLabel={action?.secondaryLabel} onNext={action?action.onClick:complete?onContinue:()=>go(count+1)} nextLabel={action?.label}/>
  {!!steps.length&&<details ref={details} className="supplement" onToggle={e=>{setExpanded(e.currentTarget.open);report(count,e.currentTarget.open);}}><summary>解説をまとめて読む</summary><Steps steps={steps} showNumbers={false}/></details>}
 </div>;
}
