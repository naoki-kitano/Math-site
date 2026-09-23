"use client";
import { useEffect } from "react";
import Link from "./SiteLink";
import { lessons, exercises } from "../content/lessons";
import { chapters,subjectPath } from "../content/chapters";
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
   if(chapter)window.location.replace(sitePath(subjectPath(chapter.subject)+"#"+hash));
   else if(hash==="math-one"||hash==="math-two"||hash==="math-three"||hash==="math-a"||hash==="math-b"||hash==="math-c"||hash==="junior")window.location.replace(sitePath("/"+hash));
  };
  openOldLink();window.addEventListener("hashchange",openOldLink);
  return ()=>window.removeEventListener("hashchange",openOldLink);
 },[]);
 return <main id="main"><section className="hero"><p className="eyebrow">MathCanvas</p><h1>科目を選ぶ</h1></section><div className="wrap">
  <div className="home-grid">
   <article className="lesson-tile"><h2>中学数学</h2><p>数と式、方程式、関数、図形、データと確率。必要な基礎から学び直せます。</p><Link className="button" href="/junior">中学数学の教材を見る →</Link></article>
   <article className="lesson-tile"><h2>数学I</h2><p>数と式、集合と命題、二次関数、図形と計量、データの分析。</p><Link className="button" href="/math-one">数学Iの教材を見る →</Link></article>
   <article className="lesson-tile"><h2>数学A</h2><p>場合の数と確率、図形の性質と作図、整数と数学の活用。</p><Link className="button" href="/math-a">数学Aの教材を見る →</Link></article>
   <article className="lesson-tile"><h2>数学II</h2><p>式と証明、複素数と方程式、図形と方程式、三角・指数・対数関数、微分・積分。</p><Link className="button" href="/math-two">数学IIの教材を見る →</Link></article>
   <article className="lesson-tile"><h2>数学B</h2><p>数列と和、漸化式と数学的帰納法、確率分布と統計的な推測、数学と社会生活。</p><Link className="button" href="/math-b">数学Bの教材を見る →</Link></article>
   <article className="lesson-tile"><h2>数学III</h2><p>関数の基礎と極限から、微分・積分へ。</p><Link className="button" href="/math-three">数学IIIの教材を見る →</Link></article>
   <article className="lesson-tile"><h2>数学C</h2><p>平面・空間のベクトル、複素数平面、二次曲線、媒介変数と極座標、数学的な表現の工夫。</p><Link className="button" href="/math-c">数学Cの教材を見る →</Link></article>
  </div>
  {ready&&lesson&&<section className="home-review"><div><h2>前回の続き</h2><p>{lesson.title}</p></div><Link className="button secondary" href={"/learn/"+lesson.slug}>続きを開く</Link></section>}
  <section className="home-review"><div><h2>今日の復習</h2><p>{!ready?"記録を読み込んでいます。":due.length?due.length+"問をもう一度確かめられます。":"今日の復習はありません。"}</p></div><Link href="/review" className="button secondary">復習を開く</Link></section>
  <p style={{marginTop:24}}><Link className="text-link" href="/record">学習記録を見る</Link></p>
 </div></main>;
}
