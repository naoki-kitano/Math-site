"use client";
import { useId, useState } from "react";
import type { Step } from "../content/lessons";
import { Steps } from "./Practice";
import {MathText} from "./MathText";
import {stepHeading,distinctSteps} from "../lib/step-heading";

/** Keep every reason and condition available, revealing one move at a time. */
export default function ExampleSteps({ steps: sourceSteps }: { steps: Step[] }) {
  const steps=distinctSteps(sourceSteps);
  const [count, setCount] = useState(1);
  const id = useId();
  if (!steps.length) return null;
  return <div className="example-walkthrough">
    <div id={id} aria-live="polite" aria-relevant="additions"><Steps steps={steps.slice(0, count)} /></div>
    {steps.length > 1 && <div className="actions walkthrough-actions">
      {count < steps.length&&<button className="button" aria-label="次の手順" aria-controls={id} onClick={() => setCount(n => Math.min(n + 1, steps.length))}><MathText text={stepHeading(steps[count].title)?`次：${stepHeading(steps[count].title)}`:"続きを表示"}/></button>}
      <button className="button secondary" disabled={count === 1} onClick={() => setCount(1)}>手順1に戻す</button>
    </div>}
    <details className="supplement"><summary>解説をまとめて読む</summary><Steps steps={steps} /></details>
  </div>;
}
