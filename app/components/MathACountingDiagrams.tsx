import {MathText} from "./MathText";
function Person({x,y,name}:{x:number;y:number;name:string}){
 return <foreignObject x={x-18} y={y-18} width={36} height={36}><div style={{textAlign:"center",fontSize:18}}><MathText text={"$"+name+"$"}/></div></foreignObject>;
}
export default function MathACountingDiagrams({slug,index}:{slug:string;index:number}){
 if(slug==="ma-circular-permutation"&&index===0)return <figure className="math-a-figure">
  <div className="math-a-circles">{[["A","B","C","D"],["D","A","B","C"]].map((people,i)=><svg key={i} viewBox="0 0 220 210" role="img" aria-label={i?"全員を四分の一回転した同じ並び":"四人の円卓の並び"}>
   <circle cx="110" cy="100" r="54" fill="#eef5f3" stroke="#4a9285" strokeWidth="2"/>
   {[[110,25],[185,100],[110,175],[35,100]].map(([x,y],j)=><Person key={j} x={x} y={y} name={people[j]}/>)}
  </svg>)}</div><figcaption><MathText text="二つ目の図は全員を同じ向きに回したものです。$A$ さんから時計回りに読むと、どちらも $B,C,D$ の順です。"/></figcaption>
 </figure>;
 if(slug==="ma-listing"&&index===1)return <figure className="math-a-figure">
  <p>十の位を決めてから、残るカードを一の位に置きます。</p>
  <ul>{[1,2,3].map(a=><li key={a}><MathText text={`十の位 $${a}$`}/><ul>{[1,2,3].filter(b=>b!==a).map(b=><li key={b}><MathText text={`一の位 $${b}$ → 整数 $${10*a+b}$`}/></li>)}</ul></li>)}</ul>
  <figcaption>枝を最後までたどると、一つの整数になります。同じカードへ戻る枝はありません。</figcaption>
 </figure>;
 if(slug==="ma-identical-permutation"&&index===1)return <figure className="math-a-figure">
  <svg viewBox="0 0 320 220" role="img" aria-label="右三回、上二回の格子と一つの最短経路">
   {[0,1,2,3].map(i=><line key={"v"+i} x1={45+i*70} x2={45+i*70} y1="35" y2="175" stroke="#b5c5ce"/>)}
   {[0,1,2].map(i=><line key={"h"+i} x1="45" x2="255" y1={35+i*70} y2={35+i*70} stroke="#b5c5ce"/>)}
   <path d="M45 175 H115 V105 H185 V35 H255" stroke="#4a9285" strokeWidth="5" fill="none"/>
   <Person x={27} y={184} name="S"/><Person x={282} y={35} name="G"/>
  </svg><figcaption><MathText text="$S$ から $G$ へ進む一例は、右・上・右・上・右です。歩く順序を決めれば、経路が一つ決まります。"/></figcaption>
 </figure>;
 return null;
}
