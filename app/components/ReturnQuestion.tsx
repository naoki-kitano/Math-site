"use client";
import {useEffect} from "react";
import {useQuery} from "../lib/use-query";
import {exercises} from "../content/lessons";
import {knownExercise,knownReviewOf} from "../content/foundation-links";
import {Practice} from "./Practice";
import Link from "./SiteLink";

export default function ReturnQuestion({slug}:{slug:string}) {
 const params=useQuery();
 const origin=knownExercise(params.get("from"),exercises);
 const q=knownExercise(params.get("exercise"),exercises);
 const target=q?.lesson===slug?q:undefined;
 const originReview=knownReviewOf(params.get("fromReview"),origin,exercises);
 const reviewOf=knownReviewOf(params.get("reviewOf"),target,exercises);
 useEffect(()=>{
  if(target&&location.hash==="#return-question")document.getElementById("return-question")?.scrollIntoView();
 },[target]);
 return <>
  {origin&&<div className="note"><Link className="button secondary" href={"/learn/"+origin.lesson+"?exercise="+encodeURIComponent(origin.id)+(originReview?"&reviewOf="+encodeURIComponent(originReview):"")+"#return-question"}>元の問題に戻る</Link></div>}
  {target&&<section className="block" id="return-question"><h2>元の問題をもう一度</h2><Practice key={target.id} label="復習後の確認" items={[{exercise:target,...(reviewOf?{reviewOf}:{})}]}/></section>}
 </>;
}
