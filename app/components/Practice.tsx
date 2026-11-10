"use client";
import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import ReviewGuide from "./ReviewGuide";
import Link from "./SiteLink";
import { type Exercise } from "../content/lessons";
import { MathText, Formula } from "./MathText";
import ExampleSteps from "./ExampleSteps";
import ExerciseAnswerDiagram from "./ExerciseAnswerDiagram";
import LearningStepControls from "./LearningStepControls";
export {Steps} from "./StepList";
import { useProgress } from "./Progress";
import { matchesNumber, historyFor, type Outcome } from "../lib/progress";

export type QueueItem={exercise:Exercise;reviewOf?:string};
export function Practice({items,label,resume=false,active=true,onComplete,onExtra,onStop,onBack,onProgressChange}:{items:QueueItem[];label:string;resume?:boolean;active?:boolean;onComplete?:()=>void;onExtra?:()=>void;onStop?:()=>void;onBack?:()=>void;onProgressChange?:(progress:number)=>void}) {
  const {attempts,ready}=useProgress();
  if(!ready)return <p role="status">練習を読み込んでいます。</p>;
  const next=resume?items.findIndex(item=>!historyFor(item.reviewOf??item.exercise.id,attempts).length):0;
  return <Session items={items} label={label} start={next<0?0:next} active={active} onComplete={onComplete} onExtra={onExtra} onStop={onStop} onBack={onBack} onProgressChange={onProgressChange}/>;
}
function Session({items,label,start,active,onComplete,onExtra,onStop,onBack,onProgressChange}:{items:QueueItem[];label:string;start:number;active:boolean;onComplete?:()=>void;onExtra?:()=>void;onStop?:()=>void;onBack?:()=>void;onProgressChange?:(progress:number)=>void}) {
  const [index,setIndex]=useState(start),[questionProgress,setQuestionProgress]=useState(0);
  const reportProgress=useEffectEvent((value:number)=>onProgressChange?.(value));
  useEffect(()=>{if(active)reportProgress((index+questionProgress)/Math.max(1,items.length));},[active,index,questionProgress,items.length]);
  if(index>=items.length)return <div className="complete" role="status"><h3>ここまでの問題が終わりました</h3>{onComplete?<div className="actions"><button className="button" onClick={onComplete}>次へ</button>{onExtra&&<button className="button secondary" onClick={onExtra}>別の問題を解く</button>}<button className="button secondary" onClick={()=>setIndex(0)}>最初から解く</button></div>:<><p>もう一度確かめたい問題は、復習に残っています。</p><div className="actions"><Link className="button" href="/review">復習へ</Link><button className="button secondary" onClick={()=>setIndex(0)}>最初から解く</button></div></>}</div>;
  const advance=()=>{onProgressChange?.((index+1)/items.length);if(index+1===items.length&&onComplete){onComplete();return;}setQuestionProgress(0);setIndex(index+1);};
  return <Question key={items[index].exercise.id+"-"+index} item={items[index]} label={label} index={index} next={advance} onStop={onStop} onBack={onBack} onProgressChange={setQuestionProgress}/>;
}
function Question({item,label,index,next,onStop,onBack,onProgressChange}:{item:QueueItem;label:string;index:number;next:()=>void;onStop?:()=>void;onBack?:()=>void;onProgressChange?:(progress:number)=>void}) {
  const {add}=useProgress(), q=item.exercise;
  const inputId=useId(),invalidId=useId();
  const hints=q.lesson==="rational"&&q.kind==="paper"?[...q.hints,"元の分母をゼロにする値も、忘れずに除きます。"]:q.hints;
  const [choice,setChoice]=useState<number|null>(null),[input,setInput]=useState(""),[hint,setHint]=useState(0);
  const [revealed,setRevealed]=useState(false),[paperDone,setPaperDone]=useState(false);
  const [helpOpen,setHelpOpen]=useState(false),[usedHelp,setUsedHelp]=useState(false);
  const [outcome,setOutcome]=useState<Outcome|null>(null),[invalid,setInvalid]=useState("");
  const heading=useRef<HTMLHeadingElement>(null),recorded=useRef(false),previewed=useRef(false);
  const attemptId=useRef<string|null>(null);
  const sessionId=()=>attemptId.current??(attemptId.current=crypto.randomUUID());
  useEffect(()=>{
    if(index>0&&heading.current){
      heading.current.focus({preventScroll:true});
      const card=heading.current.closest(".question")??heading.current;
      const topbar=document.querySelector<HTMLElement>(".topbar");
      window.scrollTo({top:Math.max(0,card.getBoundingClientRect().top+window.scrollY-(topbar?.offsetHeight??66)-12),behavior:"instant"});
    }
  },[index]);
  const record=(result:Outcome)=>{
    if(recorded.current)return;
    recorded.current=true;
    setOutcome(result);
    add({id:sessionId(),exerciseId:q.id,at:Date.now(),outcome:result,method:q.kind==="paper"?"self":"auto",...(item.reviewOf?{reviewOf:item.reviewOf}:{})});
  };
  const preview=()=>{
    if(previewed.current||recorded.current)return;
    previewed.current=true;
    add({id:sessionId(),exerciseId:q.id,at:Date.now(),outcome:"seen",method:q.kind==="paper"?"self":"auto",...(item.reviewOf?{reviewOf:item.reviewOf}:{})});
  };
  const check=()=>{
    if(q.kind==="choice"&&choice===null){setInvalid("答えを一つ選んでください。");return;}
    if(q.kind==="number"&&!/^[+-]?\d+(?:\.\d+)?$/.test(input.normalize("NFKC").replace(/−/g,"-").trim())){setInvalid("数を入力してください。");return;}
    setInvalid("");setRevealed(true);
    const ok=q.kind==="choice"?choice===q.correct:matchesNumber(input,q.correct!);
    record(ok?(hint||usedHelp?"assisted":"independent"):"retry");
  };

  return <article className="question" aria-label={label} data-question-id={q.id}>
    <div hidden={helpOpen}>
    <h3 tabIndex={-1} ref={heading}><MathText text={q.prompt}/>{q.tex&&<Formula tex={q.tex} display/>}</h3>
    {q.kind==="choice"&&<div className="options" role="group" aria-label="答えを選ぶ">{q.options!.map((o,i)=><button key={i} className={"option"+(choice===i?" chosen":"")} aria-pressed={choice===i} disabled={revealed} onClick={()=>{setChoice(i);setInvalid("");}}><MathText text={o}/></button>)}</div>}
    {q.kind==="number"&&<form onSubmit={e=>{e.preventDefault();if(!revealed)check();}}><label className="input-label" htmlFor={inputId}>答え</label><input autoComplete="off" className="numeric" id={inputId} value={input} disabled={revealed} onChange={e=>setInput(e.target.value)} aria-describedby={invalid?invalidId:undefined}/><span className="meta">負の数は「-」を付けて入力できます。</span></form>}
    {q.kind==="paper"&&!revealed&&<p className="meta">紙に途中式と答えを書いてから、解答と比べてください。</p>}
    {invalid&&<p id={invalidId} className="error-text" role="alert">{invalid}</p>}
    {!revealed&&<><LearningStepControls onPrevious={onBack} onNext={q.kind==="paper"?()=>{preview();setPaperDone(true);setRevealed(true);}:check} nextLabel="答え合わせ"/><div className="actions">
      <button className="text-link" disabled={hint>=hints.length} onClick={()=>{preview();setHint(hint+1);}}>ヒント{hint?"をもう一つ":""}</button>
      <button className="text-link" onClick={()=>{setRevealed(true);record("seen");}}>解答から確かめる</button>
    </div></>}
    {hint>0&&<div className="hint"><strong>ヒント</strong>{hints.slice(0,hint).map((h,i)=><p key={i}><MathText text={h}/></p>)}</div>}
    {revealed&&<div className="feedback" aria-live="polite">
      <h4>{outcome==="retry"?"途中式を確かめよう":outcome==="independent"?"自力でできました":outcome==="assisted"?"説明を使ってできました":"解答"}</h4>
      {!q.answerInSteps&&<p><MathText text={q.answer}/></p>}<ExerciseAnswerDiagram exercise={q}/><ExampleSteps steps={q.steps} onContinue={outcome?next:undefined} onBack={onBack} onProgressChange={onProgressChange} completionAction={q.kind==="paper"&&paperDone&&!outcome?{label:hint||usedHelp?"説明で解けた":"自力で解けた",onClick:()=>record(hint||usedHelp?"assisted":"independent"),secondaryLabel:"もう一度解く",onSecondary:()=>record("retry")}:undefined}/>
    </div>}
    {outcome&&onStop&&<button className="text-link" onClick={onStop}>ここまでにする</button>}
    </div>
    {outcome!=="independent"&&<div className="question-help">{!helpOpen?<button className="button secondary" onClick={()=>{preview();setUsedHelp(true);setHelpOpen(true);}}>復習するところを探す</button>:<ReviewGuide exercise={q} reviewOf={item.reviewOf} onClose={()=>setHelpOpen(false)}/>}</div>}
  </article>;
}
