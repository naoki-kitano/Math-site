"use client";
import {useState} from "react";
import {coinSample} from "../lib/mathb-simulation";
import {MathText} from "./MathText";
import MathTable from "./MathTable";
export default function MathBSimulation({slug}:{slug:string}){
 const [samples,setSamples]=useState<ReturnType<typeof coinSample>[]>([]);
 if(slug!=="mb-survey-simulation")return null;
 return <section aria-label="硬貨の実験">
 <p><MathText text={String.raw`公平な硬貨を独立に $100$ 回投げて一組とします。`}/></p>
 <div className="actions"><button className="button secondary" disabled={samples.length>=10} onClick={()=>setSamples(previous=>[...previous,coinSample(previous.at(-1)?.seed??20260923)])}>一組投げる</button>{samples.length>0&&<button className="text-link" onClick={()=>setSamples([])}>やり直す</button>}</div>
 <div aria-live="polite">{samples.length>0&&<MathTable caption="各組の結果" headers={["実験の組","表の回数","相対度数"]} rows={samples.map((s,i)=>[`$${i+1}$`,`$${s.heads}$`,`$${(s.heads/s.count).toFixed(2)}$`])}/>}</div>
 <p className="meta">10組まで。やり直すと同じ乱数列で比較できます。</p>
 </section>;
}
