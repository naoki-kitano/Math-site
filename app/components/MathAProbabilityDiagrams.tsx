import {MathText} from "./MathText";
export default function MathAProbabilityDiagrams({slug,index}:{slug:string;index:number}){
 if(slug!=="ma-probability-tree"||index!==1)return null;
 return <figure className="math-a-figure"><figcaption>赤二個・青一個を戻して引く樹形図</figcaption><p>各回、各玉を等確率で選び、戻してよく混ぜます。枝の横の数は、その時点での確率です。</p><ul>
 {["赤","青"].map((first,i)=><li key={first}><MathText text={`${first}：$${i?"\\frac13":"\\frac23"}$`}/><ul>
 {["赤","青"].map((second,j)=><li key={second}><MathText text={`${second}：$${j?"\\frac13":"\\frac23"}$ → ${first}${second} の確率 $${!i&&!j?"\\frac49":i&&j?"\\frac19":"\\frac29"}$`}/></li>)}
 </ul></li>)}
 </ul><p>異色になる赤青と青赤の二経路を足します。<MathText text={"$\\frac29+\\frac29=\\frac49$。"}/></p></figure>;
}
