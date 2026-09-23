"use client";
import {useEffect,useId,useRef,useState} from "react";
import {exercises,lessons,type Exercise,type Lesson} from "../content/lessons";
import {type ReviewCheck} from "../content/review-checks";
import {prerequisitesOf,type PrerequisiteCheck} from "../content/prerequisite-checks";
import {diagnosticChecksFor} from "../content/diagnostic-paths";
import {knownExercise,knownReviewOf} from "../content/foundation-links";
import {useQuery} from "../lib/use-query";
import {MathText,Formula} from "./MathText";
import Link from "./SiteLink";

export function CheckCard({check,onResult,initialResult}:{check:ReviewCheck;onResult:(correct:boolean,choice:number|null)=>void;initialResult?:{choice:number|null}}){
 const [choice,setChoice]=useState<number|null>(initialResult?.choice??null),[done,setDone]=useState(!!initialResult);
 const id=useId();
 return <div className="review-check">
  <p id={id}><MathText text={check.prompt}/></p>
  <div className="options" role="group" aria-labelledby={id}>{check.options.map((o,i)=><button className={"option"+(choice===i?" chosen":"")+(done?(i===check.correct?" correct-option":choice===i?" not-correct":""):"")} key={i} disabled={done} aria-pressed={choice===i} onClick={()=>setChoice(i)}><MathText text={o}/>{done&&i===check.correct&&<span className="option-note">正しい答え</span>}{done&&choice===i&&i!==check.correct&&<span className="option-note">選んだ答えを見直そう</span>}</button>)}</div>
  {!done&&<div className="actions"><button className="button" disabled={choice===null} onClick={()=>{setDone(true);onResult(choice===check.correct,choice);}}>確かめる</button><button className="text-link" onClick={()=>{setChoice(null);setDone(true);onResult(false,null);}}>まだ分からない</button></div>}
  {done&&<div className="note" role="status"><strong>{choice===check.correct?"この確認はできました":"ここから確かめよう"}</strong><p><MathText text={check.explanation}/></p></div>}
 </div>;
}
export function RepairCard({repair}:{repair:Lesson["supplements"][number]}){
 return <div className="repair-card"><h3>{repair.title}</h3><p className="math-paragraph"><MathText text={repair.text}/></p>{repair.tex&&<Formula tex={repair.tex} display/>}<div className="repair-exercise"><p><MathText text={repair.check}/></p><details><summary>答えと途中式を確かめる</summary><p className="math-paragraph"><MathText text={repair.answer}/></p></details></div></div>;
}
export function ReviewLessonLink({slug,exercise,reviewOf,children,onClick,trail}:{slug:string;exercise:Exercise;reviewOf?:string;children:React.ReactNode;onClick?:()=>void;trail?:string[]}){
 const params=useQuery();
 const from=knownExercise(params.get("from"),exercises),origin=from??exercise;
 const attribution=knownReviewOf(from?params.get("fromReview"):reviewOf??null,origin,exercises);
 return <Link className="button teal" onClick={onClick} href={"/learn/"+slug+"?from="+encodeURIComponent(origin.id)+(attribution?"&fromReview="+encodeURIComponent(attribution):"")+(trail?.length?"&guide="+encodeURIComponent(exercise.id)+"&trail="+encodeURIComponent(trail.join(",")):"")+(trail?.length?"#targeted-review":"#basics")}>{children}</Link>;
}
export function RetryLink({exercise,reviewOf}:{exercise:Exercise;reviewOf?:string}){
 const params=useQuery(),origin=knownExercise(params.get("from"),exercises);
 const rootReview=knownReviewOf(params.get("fromReview"),origin,exercises);
 const attribution=knownReviewOf(reviewOf??null,exercise,exercises);
 return <Link className="button secondary" href={"/learn/"+exercise.lesson+"?exercise="+encodeURIComponent(exercise.id)+(attribution?"&reviewOf="+encodeURIComponent(attribution):"")+(origin&&origin.id!==exercise.id?"&from="+encodeURIComponent(origin.id)+(rootReview?"&fromReview="+encodeURIComponent(rootReview):""):"")+"#return-question"}>同じ問題を解き直す</Link>;
}
type CheckFrame={checks:PrerequisiteCheck[];index:number;result:boolean|null;choice:number|null;prefix:string[]};
export function DiagnosticSequence({checks,exercise,reviewOf,onDone,prefix=[]}:{checks:PrerequisiteCheck[];exercise:Exercise;reviewOf?:string;onDone:()=>void;prefix?:string[]}){
 const [frames,setFrames]=useState<CheckFrame[]>([{checks,index:0,result:null,choice:null,prefix}]);
 const frame=frames[frames.length-1],current=frame.checks[frame.index];
 const trail=[...frame.prefix,current.id],deeper=prerequisitesOf(current,frame.choice);
 const heading=useRef<HTMLHeadingElement>(null);
 const update=(patch:Partial<CheckFrame>)=>setFrames(old=>old.map((f,i)=>i===old.length-1?{...f,...patch}:f));
 const back=()=>setFrames(old=>old.slice(0,-1));
 useEffect(()=>{heading.current?.focus({preventScroll:true});},[current.id,frames.length]);
 return <div className="diagnostic-sequence" data-check-id={current.id}>
  {frames.length>1&&<button className="text-link" onClick={back}>← ひとつ前の確認へ</button>}
  <h3 ref={heading} tabIndex={-1}>{current.title}</h3>
  <p className="meta">{frames.length>1?"先に必要なところを確認":`短い確認 ${frame.index+1} / ${frame.checks.length}`}</p>
  <CheckCard key={trail.join(",")} check={current} initialResult={frame.result===null?undefined:{choice:frame.choice}} onResult={(result,choice)=>update({result,choice})}/>
  {frame.result===false&&<div className="review-recommendation">
   <p>この計算・考え方を、途中式から復習できます。</p>
   <ReviewLessonLink slug={current.lesson} exercise={exercise} reviewOf={reviewOf} trail={trail}>{current.title}を復習する</ReviewLessonLink>
   {deeper.length>0&&<div className="actions"><button className="button secondary" onClick={()=>setFrames(old=>[...old,{checks:deeper,index:0,result:null,choice:null,prefix:trail}])}>先に必要なところを確かめる</button></div>}
  </div>}
  {frame.result===true&&<div className="actions">
   {frame.index+1<frame.checks.length?<button className="button" onClick={()=>update({index:frame.index+1,result:null,choice:null})}>次の確認へ</button>:frames.length>1?<button className="button" onClick={back}>ひとつ前の確認へ戻る</button>:<button className="button" onClick={onDone}>問題の考え方へ進む</button>}
  </div>}
  <button className="text-link" onClick={onDone}>確認を終えて、問題の考え方を見る</button>
 </div>;
}
export default function ReviewGuide({exercise,reviewOf,onClose}:{exercise:Exercise;reviewOf?:string;onClose:()=>void}){
 const checks=diagnosticChecksFor(exercise),[explain,setExplain]=useState(!checks.length);
 const repair=lessons.find(l=>l.slug===exercise.lesson)!.supplements.find(s=>s.id===exercise.repair)!;
 return <section className="review-guide" aria-label="問題に合わせた復習">
  <div className="review-guide-head"><span className="section-label">ひとつずつ確かめる</span><button className="text-link" onClick={onClose}>閉じる</button></div>
  {!explain?<DiagnosticSequence checks={checks} exercise={exercise} reviewOf={reviewOf} onDone={()=>setExplain(true)}/>:<><h3>この問題の考え方</h3><RepairCard repair={repair}/><div className="actions"><ReviewLessonLink slug={exercise.lesson} exercise={exercise} reviewOf={reviewOf}>この教材の例題から復習する</ReviewLessonLink><RetryLink exercise={exercise} reviewOf={reviewOf}/></div></>}
 </section>;
}
