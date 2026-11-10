"use client";
import MathACountingDiagrams from "./MathACountingDiagrams";
import MathAProbabilityDiagrams from "./MathAProbabilityDiagrams";
import MathAGeometryDiagrams from "./MathAGeometryDiagrams";
import MathASpaceDiagrams from "./MathASpaceDiagrams";
import MathAIntegerDiagrams from "./MathAIntegerDiagrams";
import MathCDiagrams from "./MathCDiagrams";
import ReturnQuestion from "./ReturnQuestion";
import TargetedReview from "./TargetedReview";
import LessonHelp from "./LessonHelp";
import Preparation from "./Preparation";
import {preparationChecks} from "../content/review-checks";
import {knownExercise,knownReviewOf} from "../content/foundation-links";
import {diagnosticTarget} from "../content/diagnostic-paths";
import {useQuery} from "../lib/use-query";
import JuniorDiagrams from "./JuniorDiagrams";
import MathBDiagrams from "./MathBDiagrams";
import MathBSimulation from "./MathBSimulation";
import { Fragment, useEffect, useState } from "react";
import Link from "./SiteLink";
import { exercises, lessons, type Lesson } from "../content/lessons";
import { chapters, subjectForChapter,subjectPath } from "../content/chapters";
import {guidedForExample,practiceForGroup} from "../lib/lesson-layout";
import {distinctSteps} from "../lib/step-heading";
import { Formula, MathText } from "./MathText";
import { Practice } from "./Practice";
import BasicReader from "./BasicReader";
import ExampleSteps from "./ExampleSteps";
import UnitCircleExplorer from "./UnitCircleExplorer";
import UnitCircleCoordinates from "./UnitCircleCoordinates";
import ParabolaExplorer from "./ParabolaExplorer";
import ConceptExplorer from "./ConceptExplorer";
import VisualLessonExplorer from "./VisualLessonExplorer";
import FormulaCorrespondence from "./FormulaCorrespondence";
import {formulaCorrespondence} from "../content/formula-correspondence";
import { lessonStarts } from "../content/lesson-starts";
import LessonDiagrams from "./LessonDiagrams";
import LessonTables from "./LessonTables";
import MathOneDiagrams from "./MathOneDiagrams";

function PointGraph() {
  const [point,setPoint]=useState<"on"|"off">("on");
  const coords=Array.from({length:81},(_,i)=>{const x=-2.5+i/16;return (170+x*48)+","+(286-(x*x+1)*35);}).join(" ");
  return <div className="panel"><h3>同じ横の座標でも、縦の座標を比べよう</h3><div className="graph-layout"><svg className="graph" viewBox="0 0 340 330" role="img" aria-label={point==="on"?"放物線 y=xの2乗+1 と、その上にある点(2,5)":"放物線 y=xの2乗+1 と、その下にある点(2,4)"}>
    <title>横の座標が2のとき、グラフの縦の座標は5</title>
    {[-2,-1,0,1,2].map(x=><g key={x}><line x1={170+x*48} y1="18" x2={170+x*48} y2="298" stroke="#e3eaf2"/><text x={170+x*48} y="312" textAnchor="middle" fontSize="13" fill="#43566b">{x}</text></g>)}
    {[1,2,3,4,5,6,7].map(y=><g key={y}><line x1="25" y1={286-y*35} x2="315" y2={286-y*35} stroke="#e3eaf2"/><text x="160" y={290-y*35} textAnchor="end" fontSize="13" fill="#43566b">{y}</text></g>)}
    <line x1="25" y1="286" x2="318" y2="286" stroke="#344e6b"/><line x1="170" y1="18" x2="170" y2="299" stroke="#344e6b"/>
    <polyline points={coords} fill="none" stroke="#087c70" strokeWidth="3"/>
    <line x1="266" y1="286" x2="266" y2="111" stroke="#526d89" strokeDasharray="5 4"/>
    <circle cx="266" cy={point==="on"?111:146} r="6" fill="#0b1f3a" stroke="white" strokeWidth="2"/>
  </svg><div><Formula tex="y=x^2+1" display/><div className="graph-controls"><button aria-pressed={point==="on"} onClick={()=>setPoint("on")}><MathText text="$(2,5)$"/></button><button aria-pressed={point==="off"} onClick={()=>setPoint("off")}><MathText text="$(2,4)$"/></button></div><div aria-live="polite"><Formula tex={point==="on"?"5=2^2+1":"4\\ne2^2+1"} display/><p>{point==="on"?"点の縦の座標と一致します。この点はグラフ上にあります。":"点の縦の座標と一致しません。この点はグラフ上にありません。"}</p></div></div></div></div>;
}
type LessonTask={id:string;label:string;hash:string};
export default function LessonView({lesson}:{lesson:Lesson}) {
  const subject=subjectForChapter(lesson.chapter),start=lessonStarts[lesson.slug],hasFormula=Object.hasOwn(formulaCorrespondence,lesson.slug);
  const hasPacedVisual=["rational","trig-unit-circle","trig-angle-change","m1-parabola-translation","m1-linear-inequalities","m1-interval-extrema","m1-quadratic-inequality"].includes(lesson.slug);
  const pacedBasics=["数学I","数学II","数学III"].includes(subject)&&!start;
  const [practiceGroup,setPracticeGroup]=useState(lesson.practiceGroups?.[0]?.id??"all");
  const [visitedGroups,setVisitedGroups]=useState<Set<string>>(()=>new Set([lesson.practiceGroups?.[0]?.id??"all"]));
  const [formulaComplete,setFormulaComplete]=useState(()=>hasFormula?formulaCorrespondence[lesson.slug].steps.length<=1:pacedBasics?lesson.introduction.length+(lesson.introduction.includes(lesson.rule)?0:1)<=1:false),[exampleCompletion,setExampleCompletion]=useState<Record<number,boolean>>({});
  const [exampleProgress,setExampleProgress]=useState<Record<number,{step:number;complete:boolean}>>({});
  const params=useQuery(),queryKey=params.toString();
  const origin=knownExercise(params.get("from"),exercises);
  const targetQuestion=knownExercise(params.get("exercise"),exercises);
  const guide=knownExercise(params.get("guide"),exercises)??origin;
  const target=diagnosticTarget(lesson.slug,params.get("trail"),guide);
  const originReview=knownReviewOf(params.get("fromReview"),origin,exercises);
  const lessonItems=exercises.filter(e=>e.lesson===lesson.slug);
  const list=(stage:string)=>lessonItems.filter(e=>e.stage===stage).map(exercise=>({exercise}));
  const guided=(i:number)=>guidedForExample(lesson.examples[i],i,lessonItems.filter(e=>e.stage==="guided")).map(exercise=>({exercise}));
  const practiceItems=practiceForGroup(lesson,practiceGroup,lessonItems.filter(e=>e.stage==="practice")).map(exercise=>({exercise}));
  const hasPrep=preparationChecks(lesson.slug).length>0;
  const warmup=list("ready").filter(({exercise})=>lesson.warmupIds===undefined||lesson.warmupIds.includes(exercise.id));
  const hasWarmup=!["数学B","数学C","中学数学"].includes(subject)&&warmup.length>0;
  const hasExtra=subject!=="数学II"&&list("review").length>0;
  const tasks:LessonTask[]=[];
  if(hasPrep)tasks.push({id:"prepare",label:"必要な基礎",hash:"ready"});
  if(hasWarmup)tasks.push({id:"warmup",label:"計算・用語のウォームアップ",hash:"warmup"});
  tasks.push({id:"basics",label:"基本の説明",hash:"basics"});
  lesson.examples.forEach((_,i)=>{
    tasks.push({id:`example-${i}`,label:lesson.examples.length>1?`例題 ${i+1}`:"例題",hash:i===0?"first-example":`example-${i+1}`});
    if(lesson.guidedAfterExamples&&guided(i).length)tasks.push({id:`guided-${i}`,label:"一緒に解く",hash:i===0?"guided":`guided-${i+1}`});
  });
  if(!lesson.guidedAfterExamples&&list("guided").length)tasks.push({id:"guided-all",label:"一緒に解く",hash:"guided"});
  if(practiceItems.length)tasks.push({id:"practice",label:"自分で解く",hash:"practice"});
  tasks.push({id:"help",label:"復習",hash:"help"});
  const initial=tasks[0].id;
  const [task,setTask]=useState(initial),[visited,setVisited]=useState<Set<string>>(()=>new Set([initial]));
  const [lastTask,setLastTask]=useState<string|null>(null);
  const chapterLessons=lessons.filter(l=>l.chapter===lesson.chapter),position=chapterLessons.findIndex(l=>l.slug===lesson.slug);
  const previous=chapterLessons[position-1],next=chapterLessons[position+1];
  const visit=(id:string)=>{setVisited(old=>old.has(id)?old:new Set([...old,id]));setTask(id);};
  const go=(id:string)=>{
    const item=tasks.find(t=>t.id===id)??(id==="practice-extra"&&hasExtra?{id,hash:"practice-extra"}:id==="return"&&targetQuestion?.lesson===lesson.slug?{id,hash:"return-question"}:id==="target"&&target?{id,hash:"targeted-review"}:undefined);
    if(!item)return;
    window.history.pushState({...window.history.state,mathcanvasFrom:task},"",`#${item.hash}`);
    setLastTask(task);visit(id);window.scrollTo({top:0,behavior:"auto"});
  };
  useEffect(()=>{
    const sync=()=>{
      let hash="";try{hash=decodeURIComponent(window.location.hash.slice(1));}catch{/* Invalid fragments fall back to the first task. */}
      let id=tasks.find(t=>t.hash===hash)?.id;
      if(hash==="ready")id=hasPrep?"prepare":hasWarmup?"warmup":"basics";
      if(hash==="examples")id="example-0";
      if(hash==="guided")id=tasks.find(t=>t.id.startsWith("guided"))?.id;
      if(hash==="practice-extra"&&hasExtra)id="practice-extra";
      if(hash==="return-question"&&targetQuestion?.lesson===lesson.slug)id="return";
      if(hash==="targeted-review"&&target)id="target";
      if(lesson.supplements.some(s=>s.id===hash))id="help";
      setLastTask(typeof window.history.state?.mathcanvasFrom==="string"?window.history.state.mathcanvasFrom:null);
      visit(id??initial);
    };
    sync();window.addEventListener("hashchange",sync);window.addEventListener("popstate",sync);
    return()=>{window.removeEventListener("hashchange",sync);window.removeEventListener("popstate",sync);};
    // The task list is derived from the current lesson; query changes may select a review route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[lesson.slug,queryKey]);
  const show=(id:string)=>visited.has(id)||task===id;
  const index=tasks.findIndex(t=>t.id===task),before=task==="help"&&lastTask==="practice-extra"?{id:"practice-extra",label:"別の問題",hash:"practice-extra"}:tasks[index-1],after=tasks[index+1];
  const exampleIndex=task.startsWith("example-")?Number(task.slice("example-".length)):-1;
  const exampleComplete=exampleIndex<0||(exampleCompletion[exampleIndex]??(distinctSteps(lesson.examples[exampleIndex]?.steps??[]).length<=1));
  const afterPrep=hasWarmup?"warmup":"basics";
  const originHref=origin?"/learn/"+origin.lesson+"?exercise="+encodeURIComponent(origin.id)+(originReview?"&reviewOf="+encodeURIComponent(originReview):"")+"#return-question":null;
  return <main id="main"><section className="hero focused-hero"><div className="breadcrumb"><Link href={subjectPath(subject)}>{subject}</Link> / {lesson.chapter}</div><h1>{lesson.title}</h1><p><MathText text={lesson.description}/></p></section>
  <div className="wrap focused-layout"><div className="lesson-body">
    {originHref&&task!=="return"&&<div className="actions"><Link className="button secondary" href={originHref}>元の問題に戻る</Link></div>}
    {!originHref&&targetQuestion?.lesson===lesson.slug&&task!=="return"&&<div className="actions"><button className="button secondary" onClick={()=>go("return")}>元の問題に戻る</button></div>}
    {show("return")&&<div className="task-pane" data-task-pane="return" hidden={task!=="return"}><ReturnQuestion slug={lesson.slug}/></div>}
    {show("target")&&<div className="task-pane" data-task-pane="target" hidden={task!=="target"}><TargetedReview slug={lesson.slug}/></div>}
    {hasPrep&&show("prepare")&&<section className="block task-pane" id="ready" data-task-pane="prepare" hidden={task!=="prepare"}><Preparation slug={lesson.slug} onComplete={()=>go(afterPrep)}/></section>}
    {hasWarmup&&show("warmup")&&<section className="block task-pane" id="warmup" data-task-pane="warmup" hidden={task!=="warmup"}><h2>計算・用語のウォームアップ</h2><Practice label="ウォームアップ" items={warmup} onComplete={()=>go("basics")}/></section>}
    {show("basics")&&<section className="block task-pane" id="basics" data-task-pane="basics" hidden={task!=="basics"}>
      {!hasFormula&&!hasPacedVisual&&<h2>{lesson.basicsTitle??(lesson.slug==="rational"?"約分できるのは、共通の因数":"点の座標を、式に入れてみる")}</h2>}
      {start?(!hasFormula&&!hasPacedVisual&&<div className="lesson-start"><p><MathText text={start.goal}/></p>{start.steps.length>0&&<ol>{start.steps.map((step,i)=><li key={i}><MathText text={step}/></li>)}</ol>}</div>):pacedBasics?<BasicReader key={lesson.slug} slug={lesson.slug} introduction={lesson.introduction} rule={lesson.rule} onCompletionChange={setFormulaComplete}/>:lesson.introduction.map((p,i)=><p key={i}><MathText text={p}/></p>)}
      {lesson.slug==="trig-unit-circle"&&<UnitCircleCoordinates onCompletionChange={setFormulaComplete}/>}{lesson.slug==="trig-angle-change"&&<UnitCircleExplorer onCompletionChange={setFormulaComplete}/>}{lesson.slug==="m1-parabola-translation"&&<ParabolaExplorer onCompletionChange={setFormulaComplete}/>}
      <ConceptExplorer slug={lesson.slug}/>{!hasFormula&&<VisualLessonExplorer slug={lesson.slug} onCompletionChange={hasPacedVisual?setFormulaComplete:undefined}/>}<FormulaCorrespondence key={lesson.slug} slug={lesson.slug} onCompletionChange={setFormulaComplete}/>
      {start&&<>{!hasFormula&&!hasPacedVisual&&<p className="start-check"><MathText text={start.check}/></p>}<details className="supplement original-explanation"><summary>定義・公式とその根拠を読む</summary>{lesson.introduction.map((p,i)=><p key={i}><MathText text={p}/></p>)}<p><MathText text={lesson.rule}/></p></details></>}
      {lesson.slug==="points"&&<PointGraph/>}<LessonTables slug={lesson.slug} folded={["数学I","数学II","数学III"].includes(subject)}/><MathBSimulation slug={lesson.slug}/>{!start&&!pacedBasics&&<div className="note"><p><MathText text={lesson.rule}/></p></div>}
    </section>}
    {lesson.examples.map((e,i)=>{
      const id=`example-${i}`,guidedId=`guided-${i}`,pair=guided(i),afterExample=tasks[tasks.findIndex(t=>t.id===id)+1];
      return <Fragment key={e.id??i}>
        {show(id)&&<section className="block task-pane" id={i===0?"examples":`example-${i+1}`} data-task-pane={id} hidden={task!==id}><article className="example" id={i===0?"first-example":undefined}><h2>{e.title}</h2><p><MathText text={e.prompt}/></p>{e.tex&&<Formula tex={e.tex} display/>}<ExampleSteps steps={e.steps} onCompletionChange={complete=>setExampleCompletion(old=>({...old,[i]:complete}))} onStepChange={(step,complete)=>setExampleProgress(old=>({...old,[i]:{step,complete}}))}/><LessonDiagrams slug={lesson.slug} index={i}/><MathOneDiagrams slug={lesson.slug} index={i} step={exampleProgress[i]?.step??0} complete={exampleProgress[i]?.complete??(distinctSteps(e.steps).length<=1)}/><MathACountingDiagrams slug={lesson.slug} index={i}/><MathAProbabilityDiagrams slug={lesson.slug} index={i}/><MathAGeometryDiagrams slug={lesson.slug} index={i}/><MathASpaceDiagrams slug={lesson.slug} index={i}/><MathAIntegerDiagrams slug={lesson.slug} index={i}/><MathBDiagrams slug={lesson.slug} index={i}/><MathCDiagrams slug={lesson.slug} index={i}/><JuniorDiagrams slug={lesson.slug} index={i}/></article></section>}
        {lesson.guidedAfterExamples&&pair.length>0&&show(guidedId)&&<section className="block task-pane" id={i===0?"guided":`guided-${i+1}`} data-task-pane={guidedId} hidden={task!==guidedId}><h2>一緒に解く</h2><Practice items={pair} label="一緒に解く" onComplete={afterExample&&tasks[tasks.findIndex(t=>t.id===guidedId)+1]?()=>go(tasks[tasks.findIndex(t=>t.id===guidedId)+1].id):undefined}/></section>}
      </Fragment>;
    })}
    {!lesson.guidedAfterExamples&&list("guided").length>0&&show("guided-all")&&<section className="block task-pane" id="guided" data-task-pane="guided-all" hidden={task!=="guided-all"}><h2>一緒に解く</h2><Practice items={list("guided")} label="一緒に解く" onComplete={()=>go(tasks.some(t=>t.id==="practice")?"practice":"help")}/></section>}
    {practiceItems.length>0&&show("practice")&&<section className="block task-pane" id="practice" data-task-pane="practice" hidden={task!=="practice"}><h2>自分で解く</h2>{lesson.practiceGroups&&<details className="supplement"><summary>練習する内容を選ぶ</summary><div className="page-tools" role="group" aria-label="確認する内容">{[{id:"all",title:"すべて"},...lesson.practiceGroups].map(g=><button className={"button "+(practiceGroup===g.id?"":"secondary")} aria-pressed={practiceGroup===g.id} key={g.id} onClick={e=>{setVisitedGroups(old=>new Set([...old,g.id]));setPracticeGroup(g.id);e.currentTarget.closest("details")?.removeAttribute("open");}}>{g.title}</button>)}</div></details>}{[...visitedGroups].map(group=><div key={group} hidden={practiceGroup!==group}><Practice items={practiceForGroup(lesson,group,lessonItems.filter(e=>e.stage==="practice")).map(exercise=>({exercise}))} label="自分で解く" resume onComplete={()=>go("help")} onExtra={hasExtra?()=>go("practice-extra"):undefined} onStop={()=>go("help")}/></div>)}</section>}
    {hasExtra&&show("practice-extra")&&<section className="block task-pane" id="practice-extra" data-task-pane="practice-extra" hidden={task!=="practice-extra"}><h2>別の問題</h2><Practice items={list("review")} label="追加練習" onComplete={()=>go("help")}/></section>}
    {show("help")&&<div className="task-pane" data-task-pane="help" hidden={task!=="help"}><LessonHelp key={lesson.slug+":"+practiceGroup} lesson={lesson} items={practiceItems.map(item=>item.exercise)}/><nav className="actions" aria-label="学習ページの移動">{previous&&<Link className="button secondary" href={"/learn/"+previous.slug}>← {previous.title}</Link>}{next&&<Link className="button" href={"/learn/"+next.slug}>{next.title} →</Link>}</nav><Link className="text-link" href={subjectPath(subject)+"#"+chapters.find(c=>c.name===lesson.chapter)?.id}>{subject}の学習一覧へ戻る</Link></div>}
    {index>=0&&task!=="prepare"&&<nav className="actions focused-navigation" aria-label="前後の内容">{before&&<button className="button secondary" onClick={()=>go(before.id)}>前の内容へ</button>}{after&&task!=="warmup"&&!task.startsWith("guided")&&task!=="practice"&&task!=="practice-extra"&&(task!=="basics"||(!hasFormula&&!pacedBasics&&!hasPacedVisual)||formulaComplete)&&exampleComplete&&<button className="button" onClick={()=>go(after.id)}>{after.label}へ</button>}</nav>}
    {task==="practice-extra"&&<nav className="actions focused-navigation" aria-label="前後の内容"><button className="button secondary" onClick={()=>go("practice")}>前の内容へ</button></nav>}
  </div></div></main>;
}
