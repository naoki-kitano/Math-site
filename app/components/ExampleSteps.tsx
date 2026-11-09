"use client";
import { useId, useRef, useState } from "react";
import type { Step } from "../content/lessons";
import { Steps } from "./StepList";
import {MathText} from "./MathText";
import {stepHeading,distinctSteps} from "../lib/step-heading";

/** Keep every reason and condition available, revealing one move at a time. */
export default function ExampleSteps({ steps: sourceSteps,onCompletionChange }: { steps: Step[];onCompletionChange?:(complete:boolean)=>void }) {
  const steps=distinctSteps(sourceSteps);
  const [count, setCount] = useState(1);
  const id = useId();
  const details=useRef<HTMLDetailsElement>(null);
  if (!steps.length) return null;
  const go=(next:number)=>{setCount(next);onCompletionChange?.(next===steps.length||!!details.current?.open);};
  return <div className="example-walkthrough">
    <div id={id} aria-live="polite" aria-atomic="true"><Steps steps={[steps[count-1]]} showNumbers={false}/></div>
    {steps.length > 1 && <div className="actions walkthrough-actions">
      {count < steps.length&&<button className="button" aria-label="次の手順" aria-controls={id} onClick={() => go(Math.min(count + 1, steps.length))}><MathText text={stepHeading(steps[count].title)?`次：${stepHeading(steps[count].title)}`:"続きを表示"}/></button>}
      {count>1&&<button className="button secondary" onClick={() => go(count-1)}>前へ</button>}
    </div>}
    <details ref={details} className="supplement" onToggle={e=>onCompletionChange?.(e.currentTarget.open||count===steps.length)}><summary>解説をまとめて読む</summary><Steps steps={steps} /></details>
  </div>;
}
