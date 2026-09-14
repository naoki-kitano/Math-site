"use client";
import { useEffect, useRef, useState } from "react";
import Link from "./SiteLink";
import { lessons, type Exercise, type Step } from "../content/lessons";
import { MathText, Formula } from "./MathText";
import { useProgress } from "./Progress";
import { matchesNumber, historyFor, type Outcome } from "../lib/progress";

export function Steps({steps}:{steps:Step[]}) {
  return <ol className="steps">{steps.map((s,i)=><li className="step" key={i}><span className="step-num" aria-hidden="true">{i+1}</span><div><strong>{s.title}</strong><p><MathText text={s.text}/></p>{s.tex&&<Formula tex={s.tex} display/>}</div></li>)}</ol>;
}
export type QueueItem={exercise:Exercise;reviewOf?:string};
export function Practice({items,label,resume=false}:{items:QueueItem[];label:string;resume?:boolean}) {
  const {attempts,ready}=useProgress();
  if(!ready)return <p role="status">練習を読み込んでいます。</p>;
  const next=resume?items.findIndex(item=>!historyFor(item.reviewOf??item.exercise.id,attempts).length):0;
  return <Session items={items} label={label} start={next<0?0:next}/>;
}
function Session({items,label,start}:{items:QueueItem[];label:string;start:number}) {
  const [index,setIndex]=useState(start);
  if(index>=items.length)return <div className="complete" role="status"><h3>ここまでの問題が終わりました</h3><p>もう一度確かめたい問題は、復習に残っています。</p><div className="actions"><Link className="button" href="/review">復習へ</Link><button className="button secondary" onClick={()=>setIndex(0)}>最初から解く</button></div></div>;
  return <Question key={items[index].exercise.id+"-"+index} item={items[index]} label={label} index={index} total={items.length} next={()=>setIndex(index+1)}/>;
}
function Question({item,label,index,total,next}:{item:QueueItem;label:string;index:number;total:number;next:()=>void}) {
  const {add}=useProgress(), q=item.exercise;
  const hints=q.lesson==="rational"&&q.kind==="paper"?[...q.hints,"元の分母をゼロにする値も、忘れずに除きます。"]:q.hints;
  const [choice,setChoice]=useState<number|null>(null),[input,setInput]=useState(""),[hint,setHint]=useState(0);
  const [revealed,setRevealed]=useState(false),[paperDone,setPaperDone]=useState(false);
  const [outcome,setOutcome]=useState<Outcome|null>(null),[invalid,setInvalid]=useState("");
  const heading=useRef<HTMLHeadingElement>(null),recorded=useRef(false),previewed=useRef(false);
  const attemptId=useRef<string|null>(null);
  const sessionId=()=>attemptId.current??(attemptId.current=crypto.randomUUID());
  useEffect(()=>{if(index>0)heading.current?.focus({preventScroll:true});},[index]);
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
    record(ok?(hint?"assisted":"independent"):"retry");
  };
  const repair=lessons.find(l=>l.slug===q.lesson)!.supplements.find(s=>s.id===q.repair)!;
  return <article className="question" data-question-id={q.id}>
    <div className="question-head"><span>{label}</span><span>{index+1} / {total}</span></div>
    <div className="progress-track" role="progressbar" aria-label="回答済み" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index}><div className="progress-fill" style={{width:(index/total*100)+"%"}}/></div>
    <h3 tabIndex={-1} ref={heading}><MathText text={q.prompt}/>{q.tex&&<Formula tex={q.tex} display/>}</h3>
    {q.kind==="choice"&&<div className="options" role="group" aria-label="答えを選ぶ">{q.options!.map((o,i)=><button key={i} className={"option"+(choice===i?" chosen":"")} aria-pressed={choice===i} disabled={revealed} onClick={()=>{setChoice(i);setInvalid("");}}><MathText text={o}/></button>)}</div>}
    {q.kind==="number"&&<form onSubmit={e=>{e.preventDefault();if(!revealed)check();}}><label className="input-label" htmlFor={q.id+"-input"}>答え</label><input autoComplete="off" className="numeric" id={q.id+"-input"} value={input} disabled={revealed} onChange={e=>setInput(e.target.value)} aria-describedby={invalid?q.id+"-invalid":undefined}/><span className="meta">負の数は「-」を付けて入力できます。</span></form>}
    {q.kind==="paper"&&!revealed&&<p className="meta">紙に途中式と答えを書いてから、解答と比べてください。</p>}
    {invalid&&<p id={q.id+"-invalid"} className="error-text" role="alert">{invalid}</p>}
    {!revealed&&<div className="actions">
      {q.kind==="paper"?<button className="button" onClick={()=>{preview();setPaperDone(true);setRevealed(true);}}>解き終えたので照合する</button>:<button className="button" onClick={check}>答えを確かめる</button>}
      <button className="button secondary" disabled={hint>=hints.length} onClick={()=>{preview();setHint(hint+1);}}>ヒント{hint?"をもう一つ":""}</button>
      <button className="text-link" onClick={()=>{setRevealed(true);record("seen");}}>解答から確かめる</button>
    </div>}
    {hint>0&&<div className="hint"><strong>ヒント</strong>{hints.slice(0,hint).map((h,i)=><p key={i}><MathText text={h}/></p>)}</div>}
    {revealed&&<div className="feedback" aria-live="polite">
      <h4>{outcome==="retry"?"途中式を確かめよう":outcome==="independent"?"自力でできました":outcome==="assisted"?"ヒントを使ってできました":"解答"}</h4>
      <p><MathText text={q.answer}/></p><Steps steps={q.steps}/>
      {q.kind==="paper"&&paperDone&&!outcome&&<><p>答えだけでなく、途中式・理由・必要な条件も比べてください。</p><div className="ratings"><button className="button" onClick={()=>record(hint?"assisted":"independent")}>{hint?"ヒントを使って解けた":"自力で解けた"}</button><button className="button secondary" onClick={()=>record("retry")}>もう一度解く</button></div><small>紙で解いた結果は自己評価として記録します。</small></>}
      {(outcome&&outcome!=="independent")&&<details className="supplement"><summary>{repair.title}</summary><p><MathText text={repair.text}/></p><Formula tex={repair.tex} display/><p><MathText text={repair.check}/></p><details><summary>確認する</summary><p><MathText text={repair.answer}/></p></details><Link className="text-link" href={"/learn/"+q.lesson+"#basics"}>説明を読み直す</Link></details>}
    </div>}
    {outcome&&<div className="actions"><button className="button" onClick={next}>{index+1===total?"結果へ":"次の問題へ"} <span aria-hidden="true">→</span></button></div>}
  </article>;
}
