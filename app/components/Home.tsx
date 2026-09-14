"use client";
import { useEffect } from "react";
import Link from "./SiteLink";
import { lessons, exercises } from "../content/lessons";
import { chapters } from "../content/chapters";
import { useProgress } from "./Progress";
import { dueExercises } from "../lib/progress";
import { sitePath } from "../lib/site-path";
export default function Home() {
 const {attempts,ready}=useProgress();
 const due=dueExercises(attempts);
 const last=[...attempts].sort((a,b)=>b.at-a.at)[0];
 const lesson=last&&lessons.find(l=>exercises.find(e=>e.id===last.exerciseId)?.lesson===l.slug);
 useEffect(()=>{
  const openOldLink=()=>{
   const hash=window.location.hash.slice(1),chapter=chapters.find(c=>c.id===hash);
   if(chapter)window.location.replace(sitePath((chapter.subject==="数学III"?"/math-three":"/math-two")+"#"+hash));
   else if(hash==="math-two"||hash==="math-three")window.location.replace(sitePath("/"+hash));
  };
  openOldLink();window.addEventListener("hashchange",openOldLink);
  return ()=>window.removeEventListener("hashchange",openOldLink);
 },[]);
 return <main id="main"><section className="hero"><p className="eyebrow">MathCanvas</p><h1>科目を選ぶ</h1></section><div className="wrap">
  <div className="home-grid">
   <article className="lesson-tile"><h2>数学II</h2><p>式と証明から、図形・三角関数・指数と対数、微分・積分へ。</p><Link className="button" href="/math-two">数学IIの教材を見る →</Link></article>
   <article className="lesson-tile"><h2>数学III</h2><p>関数の基礎、数列と関数の極限、連続性を学ぶ。</p><Link className="button" href="/math-three">数学IIIの教材を見る →</Link></article>
  </div>
  {ready&&lesson&&<section className="home-review"><div><h2>前回の続き</h2><p>{lesson.title}</p></div><Link className="button secondary" href={"/learn/"+lesson.slug}>続きを開く</Link></section>}
  <section className="home-review"><div><h2>今日の復習</h2><p>{!ready?"記録を読み込んでいます。":due.length?due.length+"問をもう一度確かめられます。":"今日の復習はありません。"}</p></div><Link href="/review" className="button secondary">復習を開く</Link></section>
  <p style={{marginTop:24}}><Link className="text-link" href="/record">学習記録を見る</Link></p>
 </div></main>;
}
