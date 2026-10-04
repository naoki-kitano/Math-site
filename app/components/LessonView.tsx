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
import JuniorDiagrams from "./JuniorDiagrams";
import MathBDiagrams from "./MathBDiagrams";
import MathBSimulation from "./MathBSimulation";
import { useState } from "react";
import Link from "./SiteLink";
import { exercises, lessons, type Lesson } from "../content/lessons";
import { chapters, subjectForChapter,subjectPath } from "../content/chapters";
import {guidedForExample,practiceForGroup} from "../lib/lesson-layout";
import { Formula, MathText } from "./MathText";
import { Practice } from "./Practice";
import ExampleSteps from "./ExampleSteps";
import UnitCircleExplorer from "./UnitCircleExplorer";
import UnitCircleCoordinates from "./UnitCircleCoordinates";
import ParabolaExplorer from "./ParabolaExplorer";
import ConceptExplorer from "./ConceptExplorer";
import VisualLessonExplorer from "./VisualLessonExplorer";
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
export default function LessonView({lesson}:{lesson:Lesson}) {
  const subject=subjectForChapter(lesson.chapter);
  const start=lessonStarts[lesson.slug];
  const compactBasics=Boolean(start);
  const [practiceGroup,setPracticeGroup]=useState(lesson.practiceGroups?.[0]?.id??"all");
  const lessonItems=exercises.filter(e=>e.lesson===lesson.slug);
  const guided=(i:number)=>guidedForExample(lesson.examples[i],i,lessonItems.filter(e=>e.stage==="guided")).map(exercise=>({exercise}));
  const practiceItems=practiceForGroup(lesson,practiceGroup,lessonItems.filter(e=>e.stage==="practice")).map(exercise=>({exercise}));


  const list=(stage:string)=>exercises.filter(e=>e.lesson===lesson.slug&&e.stage===stage).map(exercise=>({exercise}));
  const chapterLessons=lessons.filter(l=>l.chapter===lesson.chapter);
  const position=chapterLessons.findIndex(l=>l.slug===lesson.slug);
  const next=chapterLessons[position+1];
  const previous=chapterLessons[position-1];
  return <main id="main"><section className="hero"><div className="breadcrumb"><Link href={subjectPath(subject)}>{subject}</Link> / {lesson.chapter}</div><h1>{lesson.title}</h1><p><MathText text={lesson.description}/></p><div className="actions"><a className="button teal" href={start?"#basics":"#first-example"}>{start?"まず図で確かめる":"まず例題を1問"}</a><a className="button secondary" href="#basics">基本の説明</a><a className="button secondary" href="#practice">練習から</a></div></section>
    <div className="wrap study-layout"><aside className="toc"><details open><summary>このページ</summary><nav aria-label="ページ内"><a href="#ready">始める前に</a><a href="#basics">基本を確かめる</a><a href="#examples">例題</a><a href="#guided">一緒に解く</a><a href="#practice">自分で解く</a><a href="#help">分からないとき</a></nav></details></aside>
    <div className="lesson-body">
      <ReturnQuestion slug={lesson.slug}/>
      <TargetedReview slug={lesson.slug}/>
      <section className="block" id="ready"><Preparation slug={lesson.slug}/>{!["数学B","数学C","中学数学"].includes(subject)&&<details className="supplement"><summary>計算・用語のウォームアップ</summary><Practice label="ウォームアップ" items={list("ready")}/></details>}</section>
      <section className="block" id="basics"><p className="section-label">基本</p><h2>{lesson.basicsTitle??(lesson.slug==="rational"?"約分できるのは、共通の因数":"点の座標を、式に入れてみる")}</h2>{start?<div className="lesson-start"><p><MathText text={start.goal}/></p>{start.steps.length>0&&<ol>{start.steps.map((step,i)=><li key={i}><MathText text={step}/></li>)}</ol>}</div>:lesson.introduction.map((p,i)=><p key={i}><MathText text={p}/></p>)}{lesson.slug==="trig-unit-circle"&&<UnitCircleCoordinates/>}{lesson.slug==="trig-angle-change"&&<UnitCircleExplorer/>}{lesson.slug==="m1-parabola-translation"&&<ParabolaExplorer/>}<ConceptExplorer slug={lesson.slug}/><VisualLessonExplorer slug={lesson.slug}/>{start&&<><p className="start-check"><MathText text={start.check}/></p><details className="supplement original-explanation"><summary>定義・公式とその根拠を読む</summary>{lesson.introduction.map((p,i)=><p key={i}><MathText text={p}/></p>)}<p><MathText text={lesson.rule}/></p></details></>}{lesson.slug==="points"&&<PointGraph/>}<LessonTables slug={lesson.slug}/><MathBSimulation slug={lesson.slug}/>{!compactBasics&&<div className="note"><p><MathText text={lesson.rule}/></p></div>}</section>
<section className="block" id="examples"><p className="section-label">例題</p><h2>途中式を確かめよう</h2>{lesson.examples.map((e,i)=><article className="example" id={i===0?"first-example":undefined} key={e.id??i}><span className="example-label">例題 {i+1}</span><h3 className="example-title">{e.title}</h3><p><MathText text={e.prompt}/></p>{e.tex&&<Formula tex={e.tex} display/>}<ExampleSteps steps={e.steps}/><LessonDiagrams slug={lesson.slug} index={i}/><MathOneDiagrams slug={lesson.slug} index={i}/><MathACountingDiagrams slug={lesson.slug} index={i}/><MathAProbabilityDiagrams slug={lesson.slug} index={i}/><MathAGeometryDiagrams slug={lesson.slug} index={i}/><MathASpaceDiagrams slug={lesson.slug} index={i}/><MathAIntegerDiagrams slug={lesson.slug} index={i}/><MathBDiagrams slug={lesson.slug} index={i}/><MathCDiagrams slug={lesson.slug} index={i}/><JuniorDiagrams slug={lesson.slug} index={i}/>{lesson.guidedAfterExamples&&guided(i).length>0&&<section id={i===0?"guided":undefined}><h3>一緒に解く</h3><Practice items={guided(i)} label="一緒に解く"/></section>}</article>)}</section>
      {!lesson.guidedAfterExamples&&<section className="block" id="guided"><p className="section-label">練習 1</p><h2>一緒に解く</h2><Practice items={list("guided")} label="一緒に解く"/></section>}
      <section className="block" id="practice"><p className="section-label">練習 2</p><h2>自分で解く</h2>{lesson.practiceGroups&&<div className="page-tools" role="group" aria-label="確認する内容">{[{id:"all",title:"すべて"},...lesson.practiceGroups].map(g=><button className={"button "+(practiceGroup===g.id?"":"secondary")} aria-pressed={practiceGroup===g.id} key={g.id} onClick={()=>setPracticeGroup(g.id)}>{g.title}</button>)}</div>}<Practice key={practiceGroup} items={practiceItems} label="自分で解く" resume/>{subject!=="数学II"&&<details className="supplement"><summary>別の問題でもう少し練習する</summary><Practice items={list("review")} label="追加練習"/></details>}</section>
      <LessonHelp key={lesson.slug+":"+practiceGroup} lesson={lesson} items={practiceItems.map(item=>item.exercise)}/>
      <nav className="actions" aria-label="学習ページの移動">{previous&&<Link className="button secondary" href={"/learn/"+previous.slug}>← {previous.title}</Link>}{next&&<Link className="button" href={"/learn/"+next.slug}>{next.title} →</Link>}</nav>
      <Link className="text-link" href={subjectPath(subject)+"#"+chapters.find(c=>c.name===lesson.chapter)?.id}>{subject}の学習一覧へ戻る</Link>
    </div></div>
  </main>;
}
