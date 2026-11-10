"use client";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Step } from "../content/lessons";
import { Steps } from "./StepList";
import {distinctSteps} from "../lib/step-heading";
import LearningStepControls from "./LearningStepControls";
import {DiagramLayoutContext} from "./DiagramLayout";

export type CompletionAction={label:string;onClick:()=>void;secondaryLabel?:string;onSecondary?:()=>void};
/** One control continues the explanation, then the next learning task. */
export default function ExampleSteps({steps:sourceSteps,onCompletionChange,onStepChange,onProgressChange,onContinue,onBack,completionAction,children,visualSteps=[]}:{steps:Step[];onCompletionChange?:(complete:boolean)=>void;onStepChange?:(step:number,complete:boolean)=>void;onProgressChange?:(progress:number)=>void;onContinue?:()=>void;onBack?:()=>void;completionAction?:CompletionAction;children?:ReactNode;visualSteps?:ReactNode[]}){
 const steps=distinctSteps(sourceSteps),[count,setCount]=useState(1),[expanded,setExpanded]=useState(false);
 const id=useId(),details=useRef<HTMLDetailsElement>(null);
 const total=steps.length+visualSteps.length,visual=count>steps.length;
 const complete=count>=total||expanded;
 const report=(next:number,open:boolean)=>{const done=next>=total||open;onCompletionChange?.(done);onStepChange?.(Math.max(0,Math.min(next,steps.length)-1),done);onProgressChange?.(done?1:(next-1)/Math.max(1,total-1));};
 const go=(next:number)=>{setCount(next);report(next,!!details.current?.open);};
 const action=complete?completionAction:undefined;
 useLayoutEffect(()=>{
  if(expanded)return;
  const current=document.getElementById(id),root=current?.parentElement;
  const controls=root?.querySelector<HTMLElement>(".learning-step-controls");
  if(!current||!root||!controls)return;
  const extra=root.querySelector<HTMLElement>(".walkthrough-visuals");
  const bottom=Math.max(current.getBoundingClientRect().bottom,extra?.getBoundingClientRect().bottom??0);
  const ceiling=(document.querySelector<HTMLElement>(".topbar")?.offsetHeight??66)+12;
  const anchor=document.querySelector<HTMLElement>(".lesson-progress")??root.closest<HTMLElement>(".example,.question")??root;
  if(bottom>controls.getBoundingClientRect().top-12&&anchor.getBoundingClientRect().top>ceiling)
   window.scrollBy({top:anchor.getBoundingClientRect().top-ceiling,behavior:"instant"});
 },[count,expanded,id]);
 return <div className="example-walkthrough" data-step={count-1} data-visual-step={visual&&!expanded||undefined}>
  {!!total&&<div className="walkthrough-current" id={id} aria-live="polite" aria-atomic="true">{visual?<DiagramLayoutContext.Provider value={true}>{visualSteps[count-steps.length-1]}</DiagramLayoutContext.Provider>:<Steps steps={[steps[count-1]]} showNumbers={false}/>}</div>}
  <DiagramLayoutContext.Provider value={!expanded}><div className="walkthrough-visuals">{children}</div></DiagramLayoutContext.Provider>
  <LearningStepControls className="walkthrough-actions" onPrevious={action?action.onSecondary:count>1?()=>go(count-1):onBack} previousLabel={action?.secondaryLabel} onNext={action?action.onClick:complete?onContinue:()=>go(count+1)} nextLabel={action?.label}/>
  {!!total&&<details ref={details} className="supplement" onToggle={e=>{setExpanded(e.currentTarget.open);report(count,e.currentTarget.open);}}><summary>解説をまとめて読む</summary><Steps steps={steps} showNumbers={false}/>{expanded&&visualSteps}</details>}
 </div>;
}
