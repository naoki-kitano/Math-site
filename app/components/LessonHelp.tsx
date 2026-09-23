"use client";
import {useCallback,useEffect,useId,useState,useSyncExternalStore} from "react";
import {exerciseById,type Exercise,type Lesson} from "../content/lessons";
import {historyFor,stateFor} from "../lib/progress";
import {useProgress} from "./Progress";
import {MathText,Formula} from "./MathText";
import ReviewGuide,{RepairCard} from "./ReviewGuide";
function subscribe(onChange:()=>void){window.addEventListener("hashchange",onChange);return ()=>window.removeEventListener("hashchange",onChange);}
function useHash(){return useSyncExternalStore(subscribe,()=>{try{return decodeURIComponent(window.location.hash.slice(1));}catch{return "";}},()=>"");}
export default function LessonHelp({lesson,items}:{lesson:Lesson;items:Exercise[]}){
 const {attempts,add}=useProgress(),[chosen,setChosen]=useState<string|null>(null),hash=useHash();
 const choose=useCallback((q:Exercise)=>{add({id:crypto.randomUUID(),exerciseId:q.id,at:Date.now(),outcome:"seen",method:q.kind==="paper"?"self":"auto"});setChosen(q.id);},[add]);
 const recent=items.filter(q=>stateFor(q.id,attempts).needsHelp).sort((a,b)=>historyFor(b.id,attempts).at(-1)!.at-historyFor(a.id,attempts).at(-1)!.at).slice(0,3);
 const target=chosen?exerciseById[chosen]:undefined;
 const linked=lesson.supplements.find(s=>s.id===hash);
 useEffect(()=>{if(linked)document.getElementById(linked.id)?.scrollIntoView({block:"start"});},[linked]);
 return <section className="block" id="help"><p className="section-label">復習</p><h2>つまずいた問題から確かめる</h2>
  {target?<ReviewGuide key={target.id} exercise={target} onClose={()=>setChosen(null)}/>:recent.length?<><p>もう一度確かめたい問題を選んでください。</p><div className="help-problems">{recent.map(q=><button className="help-problem" key={q.id} onClick={()=>choose(q)}><span><MathText text={q.prompt}/>{q.tex&&<Formula tex={q.tex} display/>}</span><span className="text-link">復習するところを探す →</span></button>)}</div></>:<div className="note"><p>問題が解けないときは、練習中の「復習するところを探す」から、一つずつ確かめられます。</p><a className="text-link" href="#practice">練習問題へ戻る →</a></div>}
  {linked&&<div id={linked.id} className="linked-repair"><RepairCard repair={linked}/></div>}
  <HelpLibrary key={lesson.slug} supplements={lesson.supplements} linkedId={linked?.id}/>
 </section>;
}
function HelpLibrary({supplements,linkedId}:{supplements:Lesson["supplements"];linkedId?:string}){
 const [search,setSearch]=useState(""),[page,setPage]=useState(0),id=useId();
 const list=supplements.filter(s=>s.id!==linkedId&&(!search.trim()||(s.title+" "+s.text).includes(search.trim()))),pages=Math.max(1,Math.ceil(list.length/5)),current=Math.min(page,pages-1);
 return <details className="help-library"><summary>説明を探して読む</summary><label className="input-label" htmlFor={id}>言葉で探す</label><input id={id} className="help-search" type="search" value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="例：分母、角度"/><p className="meta" role="status">{list.length}件{list.length>5?` · ${current+1} / ${pages}ページ`:""}</p>
  {list.slice(current*5,current*5+5).map(s=><details className="supplement" key={s.id} id={s.id}><summary>{s.title}</summary><RepairCard repair={s}/></details>)}
  {pages>1&&<nav className="actions" aria-label="補足のページ"><button className="button secondary" disabled={current===0} onClick={()=>setPage(current-1)}>前へ</button><button className="button secondary" disabled={current===pages-1} onClick={()=>setPage(current+1)}>次へ</button></nav>}
 </details>;
}
