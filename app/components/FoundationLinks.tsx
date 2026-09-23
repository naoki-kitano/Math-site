"use client";
import {useQuery} from "../lib/use-query";
import { exercises, lessons, type Exercise } from "../content/lessons";
import { foundationsFor, knownExercise, knownReviewOf } from "../content/foundation-links";
import Link from "./SiteLink";

export default function FoundationLinks({exercise,onVisit,reviewOf}:{exercise:Exercise;onVisit:()=>void;reviewOf?:string}) {
 const params=useQuery();
 const from=knownExercise(params.get("from"),exercises);
 const origin=from??exercise;
 const attribution=knownReviewOf(from?params.get("fromReview"):reviewOf??null,origin,exercises);
 const targets=foundationsFor(exercise).map(slug=>lessons.find(l=>l.slug===slug)).filter(l=>!!l);
 if(!targets.length)return null;
 return <div className="note foundation-links"><p>計算や言葉の意味で迷ったときは</p>
  <ul>{targets.map(l=><li key={l.slug}><Link className="text-link" onClick={onVisit} href={"/learn/"+l.slug+"?from="+encodeURIComponent(origin.id)+(attribution?"&fromReview="+encodeURIComponent(attribution):"")+"#basics"}>{l.title}を復習する</Link></li>)}</ul>
 </div>;
}
