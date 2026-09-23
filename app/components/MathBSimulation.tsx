"use client";
import {useState} from "react";
import {coinSample} from "../lib/mathb-simulation";
import {MathText} from "./MathText";
import MathTable from "./MathTable";
export default function MathBSimulation({slug}:{slug:string}){
 const [samples,setSamples]=useState<ReturnType<typeof coinSample>[]>([]);
 if(slug!=="mb-survey-simulation")return null;
 return <section className="note"><h3>同じ条件でも結果は変わる</h3>
 <p><MathText text={String.raw`表の確率を $\frac12$ とする独立な硬貨投げを、一組 $100$ 回ずつ計算機で再現します。同じ条件で繰り返したときの違いを比べましょう。`}/></p>
 <div className="actions"><button className="button secondary" disabled={samples.length>=10} onClick={()=>setSamples(previous=>[...previous,coinSample(previous.at(-1)?.seed??20260923)])}>一組の実験を行う</button><button className="text-link" onClick={()=>setSamples([])}>実験を最初からやり直す</button></div>
 <div aria-live="polite">{samples.length>0&&<MathTable caption="各組は別の百回です。合計の割合ではありません。" headers={["実験の組","表の回数","相対度数"]} rows={samples.map((s,i)=>[`$${i+1}$`,`$${s.heads}$`,`$${(s.heads/s.count).toFixed(2)}$`])}/>}</div>
 <p className="meta">十組まで比較できます。実測データではなく、固定した種から作る疑似乱数による例です。最初からやり直すと同じ列を再現します。この実験は演習の自力正解として記録しません。</p>
 </section>;
}
