"use client";
import {useState} from "react";
import {preparationChecks} from "../content/review-checks";
import {lessons,exercises} from "../content/lessons";
import {knownExercise} from "../content/foundation-links";
import {useQuery} from "../lib/use-query";
import {CheckCard,ReviewLessonLink} from "./ReviewGuide";
import Link from "./SiteLink";
export default function Preparation({slug}:{slug:string}){
 const checks=preparationChecks(slug),[index,setIndex]=useState(0),[result,setResult]=useState<boolean|null>(null);
 const params=useQuery(),origin=knownExercise(params.get("from"),exercises);
 if(!checks.length)return <p className="meta">下の説明と例題から始められます。途中で迷ったら、問題の「復習するところを探す」を使ってください。</p>;
 const check=checks[index];
 return <details className="supplement"><summary>始める前に、必要な基礎を確かめる</summary>
  <p className="meta">{index+1} / {checks.length} · {check.title}</p><CheckCard key={check.id} check={check} onResult={setResult}/>
  {result===false&&(origin?<ReviewLessonLink slug={check.lesson} exercise={origin}>{lessons.find(l=>l.slug===check.lesson)!.title}を復習する</ReviewLessonLink>:<Link className="text-link" href={"/learn/"+check.lesson+"#basics"}>{lessons.find(l=>l.slug===check.lesson)!.title}を復習する</Link>)}
  {result!==null&&(index+1<checks.length?<div className="actions"><button className="button secondary" onClick={()=>{setIndex(index+1);setResult(null);}}>次の確認へ</button></div>:<div className="actions"><a className="button" href="#basics">説明へ進む</a></div>)}
 </details>;
}
