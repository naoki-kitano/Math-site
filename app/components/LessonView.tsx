"use client";
import { useState } from "react";
import Link from "./SiteLink";
import { exercises, lessons, type Lesson } from "../content/lessons";
import { chapters, subjectForChapter } from "../content/chapters";
import { Formula, MathText } from "./MathText";
import { Practice, Steps } from "./Practice";
import LessonDiagrams from "./LessonDiagrams";
import LessonTables from "./LessonTables";

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
  const list=(stage:string)=>exercises.filter(e=>e.lesson===lesson.slug&&e.stage===stage).map(exercise=>({exercise}));
  const chapterLessons=lessons.filter(l=>l.chapter===lesson.chapter);
  const position=chapterLessons.findIndex(l=>l.slug===lesson.slug);
  const next=chapterLessons[position+1];
  const previous=chapterLessons[position-1];
  return <main id="main"><section className="hero"><div className="breadcrumb"><Link href={subject==="数学III"?"/math-three":"/math-two"}>{subject}</Link> / {lesson.chapter}</div><h1>{lesson.title}</h1><p>{lesson.description}</p><div className="actions"><a className="button teal" href="#basics">説明から</a><a className="button secondary" href="#practice">練習から</a></div></section>
    <div className="wrap study-layout"><aside className="toc"><details open><summary>このページ</summary><nav aria-label="ページ内"><a href="#ready">始める前に</a><a href="#basics">基本を確かめる</a><a href="#examples">例題</a><a href="#guided">一緒に解く</a><a href="#practice">自分で解く</a><a href="#help">分からないとき</a></nav></details></aside>
    <div className="lesson-body">
      <section className="block" id="ready"><details className="supplement"><summary>始める前に、2問で確かめる</summary><Practice label="始める前に" items={list("ready")}/></details>{!!lesson.prerequisites?.length&&<p className="meta">関連する基礎：{lesson.prerequisites.map(p=><Link key={p.slug} className="text-link" href={"/learn/"+p.slug}>{p.label}{" / "}</Link>)}</p>}</section>
      <section className="block" id="basics"><p className="section-label">基本</p><h2>{lesson.basicsTitle??(lesson.slug==="rational"?"約分できるのは、共通の因数":"点の座標を、式に入れてみる")}</h2>{lesson.introduction.map((p,i)=><p key={i}><MathText text={p}/></p>)}{lesson.slug==="points"&&<PointGraph/>}<LessonTables slug={lesson.slug}/><div className="note"><p><MathText text={lesson.rule}/></p></div></section>
      <section className="block" id="examples"><p className="section-label">例題</p><h2>途中式を確かめよう</h2>{lesson.examples.map((e,i)=><article className="example" key={i}><span className="example-label">例題 {i+1}</span><h3 className="example-title">{e.title}</h3><p><MathText text={e.prompt}/></p>{e.tex&&<Formula tex={e.tex} display/>}<Steps steps={e.steps}/><LessonDiagrams slug={lesson.slug} index={i}/>{lesson.guidedAfterExamples&&list("guided")[i]&&<section id={i===0?"guided":undefined}><h3>一緒に解く</h3><Practice items={[list("guided")[i]]} label="一緒に解く"/></section>}</article>)}</section>
      {!lesson.guidedAfterExamples&&<section className="block" id="guided"><p className="section-label">練習 1</p><h2>一緒に解く</h2><Practice items={list("guided")} label="一緒に解く"/></section>}
      <section className="block" id="practice"><p className="section-label">練習 2</p><h2>自分で解く</h2><Practice items={list("practice")} label="自分で解く" resume/>{subject==="数学III"&&<details className="supplement"><summary>別の問題でもう少し練習する</summary><Practice items={list("review")} label="追加練習"/></details>}</section>
      <section className="block" id="help"><h2>分からないところを確かめる</h2>{lesson.supplements.map(s=><details className="supplement" id={s.id} key={s.id}><summary>{s.title}</summary><p><MathText text={s.text}/></p><Formula tex={s.tex} display/><p><MathText text={s.check}/></p><details><summary>答えを確かめる</summary><p><MathText text={s.answer}/></p></details></details>)}</section>
      <nav className="actions" aria-label="学習ページの移動">{previous&&<Link className="button secondary" href={"/learn/"+previous.slug}>← {previous.title}</Link>}{next&&<Link className="button" href={"/learn/"+next.slug}>{next.title} →</Link>}</nav>
      <Link className="text-link" href={(subject==="数学III"?"/math-three#":"/math-two#")+chapters.find(c=>c.name===lesson.chapter)?.id}>{subject}の学習一覧へ戻る</Link>
    </div></div>
  </main>;
}
