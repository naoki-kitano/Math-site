"use client";
import { useState } from "react";
import Link from "./SiteLink";
import { useProgress } from "./Progress";
import { lessons } from "../content/lessons";
import { subjectForChapter } from "../content/chapters";
import { attemptedExercises, dueExercises, stateFor, alternateFor, historyFor } from "../lib/progress";
import { MathText, Formula } from "./MathText";
import { Practice, type QueueItem } from "./Practice";
export default function Review({record=false}:{record?:boolean}) {
  const {attempts,ready,importData}=useProgress();
  const [filter,setFilter]=useState<"due"|"missed"|"all">(record?"all":"due");
  const [queue,setQueue]=useState<QueueItem[]|null>(null),[notice,setNotice]=useState("");
  const all=attemptedExercises(attempts);
  const [subject,setSubject]=useState("すべて");
  const selected=filter==="due"?dueExercises(attempts):filter==="missed"?all.filter(e=>stateFor(e.id,attempts).needsHelp):all;
  const visible=selected.filter(e=>subject==="すべて"||subjectForChapter(lessons.find(l=>l.slug===e.lesson)!.chapter)===subject);
  const backup=()=>{
    const blob=new Blob([JSON.stringify({version:1,attempts},null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="mathcanvas-record.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    setNotice("学習記録を書き出しました。");
  };
  return <main id="main"><section className="hero"><div className="breadcrumb"><Link href="/">学習一覧</Link></div><h1>{record?"学習記録":"もう一度、確かめる"}</h1></section><div className="wrap" style={{maxWidth:950}}>
    {!ready?<p role="status">記録を読み込んでいます。</p>:queue?<><button className="text-link" onClick={()=>setQueue(null)}>← 復習一覧へ</button><div style={{marginTop:24}}><Practice items={queue} label="復習"/></div></>:<>
      <div className="page-tools" role="group" aria-label="科目の絞り込み">{["すべて","数学II","数学III"].map(value=><button key={value} className={"button "+(subject===value?"":"secondary")} aria-pressed={subject===value} onClick={()=>setSubject(value)}>{value}</button>)}</div>
      <div className="page-tools" role="group" aria-label="記録の絞り込み">{([["due","今日の復習"],["missed","もう一度"],["all","すべての記録"]] as const).map(([value,text])=><button key={value} className={"button "+(filter===value?"":"secondary")} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{text}</button>)}</div>
      {!!visible.length&&<div className="actions"><button className="button" onClick={()=>setQueue(visible.slice(0,5).map(exercise=>{
        const last=historyFor(exercise.id,attempts).at(-1),alternate=alternateFor(exercise.id,attempts);
        return last?.outcome==="independent"&&last.exerciseId===exercise.id&&alternate?{exercise:alternate,reviewOf:exercise.id}:{exercise};
      }))}>最初の{Math.min(5,visible.length)}問を解く</button><span className="meta">{visible.length}問</span></div>}
      {!visible.length&&<div className="empty"><h2>{all.length?"この一覧の問題はありません":"まだ学習記録がありません"}</h2><p>{all.length?"以前の問題は「すべての記録」からいつでも解けます。":"練習を始めると、ここから振り返れます。"}</p><Link href="/" className="button">学習へ</Link></div>}
      <ul className="record-list">{visible.map(e=>{const state=stateFor(e.id,attempts),alternate=alternateFor(e.id,attempts),last=historyFor(e.id,attempts).at(-1)!;return <li className="record-row" key={e.id}><div style={{minWidth:0}}><span className="meta">{lessons.find(l=>l.slug===e.lesson)!.title}</span><p><MathText text={e.prompt}/></p>{e.tex&&<Formula tex={e.tex} display/>}<span className="pill">{state.label}</span> <span className="meta">{last.outcome==="seen"?"解答・ヒントを確認":last.method==="self"?"自己評価":"回答を判定"} · {new Date(last.at).toLocaleDateString("ja-JP")}</span>{!state.needsHelp&&<p className="meta">次の確認：{new Date(state.dueAt).toLocaleDateString("ja-JP")}</p>}</div><div className="actions"><button className="button secondary" onClick={()=>setQueue([{exercise:e}])}>解き直す</button>{alternate&&<button className="button secondary" onClick={()=>setQueue([{exercise:alternate,reviewOf:e.id}])}>別問題で確かめる</button>}</div></li>})}</ul>
    </>}
    {record&&ready&&<section className="backups"><h2>記録を持ち運ぶ</h2><p>記録はこのブラウザだけに保存されます。別の端末へ移すときや、ブラウザのデータを消す前に書き出してください。</p><button className="button secondary" onClick={backup}>記録を書き出す</button><div style={{marginTop:20}}><label htmlFor="backup-file">書き出した記録を読み込む</label><br/><input id="backup-file" type="file" accept=".json,application/json" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>5_000_000)throw Error("large");const saved=importData(await file.text());setNotice(saved?"記録を追加しました。今ある記録も残っています。":"記録の保存が完了していません。画面上部のお知らせを確認してください。");}catch{setNotice("このファイルは読み込めません。MathCanvasから書き出した記録を選んでください。");}e.target.value="";}}/></div><p role="status">{notice}</p></section>}
    <p className="storage-note">ヒントや解答を使った問題は「もう一度」に残ります。自力で解けた後も、日を空けて確かめられます。</p>
  </div></main>;
}
