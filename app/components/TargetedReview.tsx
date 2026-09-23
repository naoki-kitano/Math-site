"use client";
import {useEffect,useState} from "react";
import {exercises,lessons,type Exercise} from "../content/lessons";
import {diagnosticTarget,targetPractice} from "../content/diagnostic-paths";
import {prerequisitesOf,type PrerequisiteCheck} from "../content/prerequisite-checks";
import {knownExercise,knownReviewOf} from "../content/foundation-links";
import {useQuery} from "../lib/use-query";
import {DiagnosticSequence,RepairCard,ReviewLessonLink,RetryLink} from "./ReviewGuide";
import {Practice} from "./Practice";

function Target({check,trail,guide,reviewOf}:{check:PrerequisiteCheck;trail:PrerequisiteCheck[];guide:Exercise;reviewOf?:string}){
 const [checking,setChecking]=useState(false);
 const repair=lessons.find(l=>l.slug===check.lesson)!.supplements.find(s=>s.id===check.repair)!;
 const items=targetPractice(check).map(exercise=>({exercise}));
 const prior=trail[trail.length-2],deeper=prerequisitesOf(check,null);
 useEffect(()=>{document.getElementById("targeted-review")?.scrollIntoView();},[check.id]);
 return <section className="block targeted-review" id="targeted-review" aria-label="いま必要な復習">
  <p className="section-label">いま必要な復習</p><h2>{check.title}</h2>
  <RepairCard repair={repair}/>
  {deeper.length>0&&<div className="question-help">{checking?<DiagnosticSequence checks={deeper} exercise={guide} reviewOf={reviewOf} prefix={trail.map(c=>c.id)} onDone={()=>setChecking(false)}/>:<button className="button secondary" onClick={()=>setChecking(true)}>この説明の前に必要なところを確かめる</button>}</div>}
  {items.length>0&&<><h3>この内容を使って解いてみよう</h3><Practice items={items} label="戻って確かめる練習"/></>}
  <div className="actions">
   {prior?<ReviewLessonLink slug={prior.lesson} exercise={guide} reviewOf={reviewOf} trail={trail.slice(0,-1).map(c=>c.id)}>ひとつ前へ：{prior.title}</ReviewLessonLink>:<RetryLink exercise={guide} reviewOf={reviewOf}/>}
  </div>
 </section>;
}
export default function TargetedReview({slug}:{slug:string}){
 const params=useQuery(),origin=knownExercise(params.get("from"),exercises);
 const guide=knownExercise(params.get("guide"),exercises)??origin;
 const target=diagnosticTarget(slug,params.get("trail"),guide);
 const reviewOf=guide?.id===origin?.id?knownReviewOf(params.get("fromReview"),guide,exercises):undefined;
 if(!target||!guide)return null;
 return <Target key={guide.id+":"+target.trail.map(c=>c.id).join(",")} {...target} guide={guide} reviewOf={reviewOf}/>;
}
