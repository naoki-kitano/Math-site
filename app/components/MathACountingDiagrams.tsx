import {MathText} from "./MathText";
function Person({x,y,name}:{x:number;y:number;name:string}){
 return <foreignObject x={x-18} y={y-18} width={36} height={36}><div style={{textAlign:"center",fontSize:18}}><MathText text={"$"+name+"$"}/></div></foreignObject>;
}
export default function MathACountingDiagrams({slug,index}:{slug:string;index:number}){
 if(slug==="ma-circular-permutation"&&index===0)return <figure className="math-a-figure">
  <div className="math-a-circles" style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:8,maxWidth:360,margin:"0 auto"}}>{[["A","B","C","D"],["D","A","B","C"]].map((people,i)=><svg key={i} viewBox="0 0 160 152" role="img" aria-label={i?"全員を四分の一回転した同じ並び。Aから時計回りにB、C、D。":"四人の円卓の並び。Aから時計回りにB、C、D。"} style={{display:"block",width:"100%",maxWidth:180,height:"auto",margin:"auto"}}>
   <circle cx="80" cy="74" r="27" fill="#eef5f3" stroke="#4a9285" strokeWidth="1.5"/>
   {[[80,18],[135,74],[80,130],[25,74]].map(([x,y],j)=><foreignObject key={j} x={x-18} y={y-16} width={36} height={34}><div style={{textAlign:"center",fontSize:22,lineHeight:1.2}}><MathText text={"$"+people[j]+"$"}/></div></foreignObject>)}
  </svg>)}</div><figcaption><MathText text="どちらも $A$ から時計回りに $B,C,D$。回転は同じ、裏返しは別です。"/></figcaption>
 </figure>;
 if(slug==="ma-listing"&&index===1)return <figure className="math-a-figure">
  <p>十の位を決めてから、残るカードを一の位に置きます。</p>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:6,textAlign:"center"}}>
   {["十の位","一の位","整数"].map(label=><strong style={{fontSize:14}} key={label}>{label}</strong>)}
   {[1,2,3].flatMap(a=>[1,2,3].filter(b=>b!==a).map(b=><div key={10*a+b} style={{display:"contents"}}>
    <span><MathText text={`$${a}$`}/></span><span><MathText text={`$${b}$`}/></span><span><MathText text={`$${10*a+b}$`}/></span>
   </div>))}
  </div><figcaption>各行が一つの整数です。使ったカードは一の位の候補から除きます。</figcaption>
 </figure>;
 if(slug==="ma-identical-permutation"&&index===1)return <figure className="math-a-figure">
  <svg viewBox="0 0 260 190" role="img" aria-label="右三回、上二回の格子と一つの最短経路">
   {[0,1,2,3].map(i=><line key={"v"+i} x1={30+i*65} x2={30+i*65} y1="25" y2="155" stroke="#b5c5ce"/>)}
   {[0,1,2].map(i=><line key={"h"+i} x1="30" x2="225" y1={25+i*65} y2={25+i*65} stroke="#b5c5ce"/>)}
   <path d="M30 155 H95 V90 H160 V25 H225" stroke="#4a9285" strokeWidth="5" fill="none"/>
   <Person x={12} y={167} name="S"/><Person x={244} y={25} name="G"/>
  </svg><figcaption><MathText text="$S$ から $G$ へ進む一例は、右・上・右・上・右です。歩く順序を決めれば、経路が一つ決まります。"/></figcaption>
 </figure>;
 return null;
}
