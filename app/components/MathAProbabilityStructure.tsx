import type {CSSProperties,ReactNode} from "react";
import {MathText} from "./MathText";

const m=String.raw;
const blue="#176c82",gold="#936114",red="#a94442",ink="#263c53";
const grid=(columns:number):CSSProperties=>({display:"grid",gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`,gap:6,margin:"12px 0"});
const cell=(active=false,color=blue):CSSProperties=>({padding:"7px 3px",textAlign:"center",border:`1.5px solid ${active?color:"#d5dfe8"}`,borderRadius:7,background:active?`${color}0c`:"transparent",minWidth:0});
const frame:CSSProperties={margin:0};
function Caption({children}:{children:ReactNode}){return <figcaption style={{fontSize:16,margin:"6px 0"}}>{children}</figcaption>;}
function Math({text}:{text:string}){return <span><MathText text={text}/></span>;}
function DieCards({kind,stage}:{kind:string;stage:number}){
 const union=kind==="union",independent=kind==="exclusive",n=union?12:6;
 const second=independent&&stage>=2;
 const inA=(v:number)=>union?v%2===0:independent?v%2===0:v>=3;
 const inB=(v:number)=>union?v%3===0:independent?(second?v%3===0:v%2===1):v%2===0;
 return <figure style={frame}>
  <Caption><Math text={union?m`$A$：$2$ の倍数、$B$：$3$ の倍数`:independent?(second?m`$A$：偶数、$B$：$3$ の倍数`:m`$A$：偶数、$B$：奇数`):m`$1$～$6$ のカードで、$3$ 以上と分かったとき`}/></Caption>
  <div style={grid(union?6:3)}>{Array.from({length:n},(_,i)=>i+1).map(v=>{
   const a=inA(v),b=inB(v),selected=union?(stage===0?a:stage===1?b:a||b):independent?a||b:(stage===0||a);
   const color=a&&b?ink:a?blue:gold;
   return <div key={v} style={{...cell(selected,color),opacity:!union&&!independent&&stage>0&&!a ? .3 : 1}}>
    <Math text={`$${v}$`}/>
    {(union||independent)&&<div style={{fontSize:14,minHeight:23}}><Math text={a&&b?"$A,B$":a?"$A$":b?"$B$":""}/></div>}
    {!union&&!independent&&stage>=2&&a&&b&&<div style={{fontSize:14,color:blue}}>偶数</div>}
   </div>;
  })}</div>
  {!union&&!independent&&stage>=1&&<Caption><Math text={stage===1?m`条件に合う全体：$3,4,5,6$ の $4$ 枚`:m`その中の偶数：$4,6$ の $2$ 枚`}/></Caption>}
  {union&&stage===1&&<Caption><Math text={m`$6,12$ は $A$ と $B$ の両方に含まれます。`}/></Caption>}
 </figure>;
}
function CoinRows({stage,complement=false,repeated=false}:{stage:number;complement?:boolean;repeated?:boolean}){
 const rows=repeated?["表表裏","表裏表","裏表表"]:complement?["表表表","表表裏","表裏表","表裏裏","裏表表","裏表裏","裏裏表","裏裏裏"]:["表表","表裏","裏表","裏裏"];
 const shown=repeated&&stage===0?rows.slice(0,1):rows;
 return <figure style={frame}><Caption>{repeated?(stage===0?"一つの並び：表・表・裏":"表が出る位置を変えた三つの列"):complement?"公平な硬貨を独立に三回投げる":"硬貨を二回投げた結果"}</Caption>
  <div style={grid(repeated?1:2)}>{shown.map((row,i)=>{
   const select=repeated?stage>0||i===0:complement?stage>0&&row!=="裏裏裏":stage>0&&[...row].filter(x=>x==="表").length===1;
   return <div key={row} style={{...cell(select),display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:complement&&stage>0&&row==="裏裏裏" ? .35 : 1}}>
    {[...row].map((value,j)=><span key={j} style={{color:value==="表"?blue:ink,fontSize:16}}>{value}</span>)}
    {repeated&&stage>=2&&<span style={{marginLeft:10}}><Math text={m`$\frac18$`}/></span>}
   </div>;
  })}</div>
  {complement&&stage>0&&<Caption>除いた列：裏裏裏</Caption>}
  {!complement&&!repeated&&stage>0&&<Caption><Math text={m`「表がちょうど一回」$=\{\text{表裏},\text{裏表}\}$`}/></Caption>}
 </figure>;
}
function Balls({stage,replace=false}:{stage:number;replace?:boolean}){
 const balls=["R_1","R_2","R_3","B_1","B_2"];
 return <figure style={frame}><Caption><Math text={m`赤 $3$ 個、青 $2$ 個（各玉を等確率で選ぶ）`}/></Caption>
  <div style={grid(5)}>{balls.map((name,i)=>{
   const removed=replace&&stage===1&&i===0;
   return <div key={name} style={{...cell(!removed,i<3?red:blue),opacity:removed ? .25 : 1}}><Math text={`$${name}$`}/></div>;
  })}</div>
  {!replace&&stage===0&&<Caption><Math text={m`どの一個も確率 $\frac15$。番号で区別します。`}/></Caption>}
  {!replace&&stage>=1&&<div style={grid(2)}><div style={cell(true,red)}><Math text={m`赤：$3$ 個`}/></div><div style={cell(true,blue)}><Math text={m`青：$2$ 個`}/></div></div>}
  {replace&&stage===1&&<Caption><Math text={m`最初が赤だった後：赤 $2$ 個、全体 $4$ 個`}/></Caption>}
  {replace&&stage===2&&<Caption><Math text={m`$R_1$ を袋に戻します。`}/></Caption>}
 </figure>;
}
function PairCards({stage}:{stage:number}){
 const names=["R_1","R_2","R_3","B_1","B_2"],pairs=names.flatMap((a,i)=>names.slice(i+1).map(b=>[a,b]));
 return <figure style={frame}><Caption><Math text={m`全体：二個の組 $10$ 通り`}/></Caption><div style={grid(2)}>
  {pairs.map(([a,b])=><div key={a+b} style={{...cell(stage>0&&a.startsWith("R")&&b.startsWith("R"),red),fontSize:16}}><Math text={m`$\{${a},${b}\}$`}/></div>)}
 </div></figure>;
}
export function ProbabilityPaths({stage=2}:{stage?:number}){
 const active=(index:number)=>stage>=2?index===1||index===2:index===0;
 const leaves=[{name:"赤・赤",color:"赤",prob:m`\frac35`,result:m`\frac9{25}`},{name:"赤・青",color:"青",prob:m`\frac25`,result:m`\frac6{25}`},{name:"青・赤",color:"赤",prob:m`\frac35`,result:m`\frac6{25}`},{name:"青・青",color:"青",prob:m`\frac25`,result:m`\frac4{25}`}];
 return <figure style={frame}>
  <Caption><Math text={m`赤 $3$ 個・青 $2$ 個`}/></Caption>
  <div style={{position:"relative",height:stage===0?176:218,fontSize:16}} role="group" aria-label="上から一回目、二回目へ進む樹形図。枠の経路をたどる。">
   <svg viewBox={`0 0 100 ${stage===0?176:218}`} preserveAspectRatio="none" style={{position:"absolute",inset:0,width:"100%",height:"100%"}} aria-hidden="true">
    {[25,75].map((x,i)=><path key={x} d={`M50 8 L${x} 57`} stroke={stage>=2||i===0?blue:"#bdcbd6"} fill="none" strokeWidth="2" vectorEffect="non-scaling-stroke"/>)}
    {[12.5,37.5,62.5,87.5].map((x,i)=><path key={x} d={`M${i<2?25:75} 85 L${x} 138`} stroke={active(i)?blue:"#bdcbd6"} fill="none" strokeWidth={active(i)?2.5:1.5} vectorEffect="non-scaling-stroke"/>)}
   </svg>
   {[{x:25,color:"赤",prob:m`\frac35`},{x:75,color:"青",prob:m`\frac25`}].map((r,i)=><div key={r.color} style={{position:"absolute",left:`${r.x}%`,top:43,transform:"translateX(-50%)",background:"var(--panel,#fff)",padding:"4px 6px",border:`1.5px solid ${stage>=2||i===0?blue:"#d5dfe8"}`,borderRadius:7,display:"flex",alignItems:"center",gap:5}}><span>{r.color}</span><Math text={`$${r.prob}$`}/></div>)}
   {leaves.map((leaf,i)=><div key={leaf.name} style={{position:"absolute",left:`${i*25}%`,top:132,width:"25%",textAlign:"center"}}>
    <div style={{display:"inline-flex",alignItems:"center",gap:3,background:"var(--panel,#fff)",padding:"4px 1px",border:`1.5px solid ${active(i)?blue:"#d5dfe8"}`,borderRadius:7}}><span>{leaf.color}</span><Math text={`$${leaf.prob}$`}/></div>
    {stage>=1&&active(i)&&<div style={{fontSize:14,marginTop:5}}>{leaf.name}<div><Math text={`$${leaf.result}$`}/></div></div>}
   </div>)}
  </div>
  {stage===1&&<Caption><Math text={m`赤・赤：$\frac35\times\frac35=\frac9{25}$`}/></Caption>}
 </figure>;
}
function DiceRectangle({stage}:{stage:number}){
 return <figure style={frame}><Caption><Math text={m`縦：第一の目、横：第二の目。各マスは確率 $\frac1{36}$。`}/></Caption>
  <div style={{...grid(7),gap:3,fontSize:14,textAlign:"center"}}><span/>{[1,2,3,4,5,6].map(n=><Math key={"h"+n} text={`$${n}$`}/>)}
   {[1,2,3,4,5,6].map(a=><div key={a} style={{display:"contents"}}><Math text={`$${a}$`}/>{[1,2,3,4,5,6].map(b=><span key={b} style={{...cell(stage===0?a>=4:a>=4&&b%3===0),minHeight:25,padding:1}}>{stage>=2&&a>=4&&b%3===0?"●":""}</span>)}</div>)}
  </div>
  <Caption><Math text={stage===0?m`第一が $4$ 以上：$3$ 行`:m`第二が $3$ の倍数：$2$ 列。共通部分は $3\times2=6$ マス。`}/></Caption>
 </figure>;
}
function PosteriorPaths({stage}:{stage:number}){
 const rows=[{name:"A → 赤",tex:m`\frac13\times\frac35=\frac3{15}`,red:true,a:true},{name:"A → 青",tex:m`\frac13\times\frac25=\frac2{15}`,red:false,a:true},{name:"B → 赤",tex:m`\frac23\times\frac25=\frac4{15}`,red:true,a:false},{name:"B → 青",tex:m`\frac23\times\frac35=\frac6{15}`,red:false,a:false}];
 return <figure style={frame}><Caption><Math text={m`箱 $A$：赤 $3$・青 $2$、箱 $B$：赤 $2$・青 $3$`}/></Caption>
  {rows.map(r=><div key={r.name} style={{...cell(stage>0&&r.red,r.a?blue:gold),display:"grid",gridTemplateColumns:"5em minmax(0,1fr)",gap:4,alignItems:"center",margin:"5px 0",opacity:stage>0&&!r.red ? .3 : 1}}><Math text={`$${r.a?"A":"B"}$ から${r.red?"赤":"青"}`}/><Math text={`$${r.tex}$`}/></div>)}
  {stage>=1&&<Caption><Math text={m`赤だった経路だけを残す：$\frac3{15}+\frac4{15}=\frac7{15}$`}/></Caption>}
 </figure>;
}
function ExpectedOutcomes({stage,profit=false}:{stage:number;profit?:boolean}){
 const values=profit?(stage===0?[600,0,0,0]:[500,-100,-100,-100]):[0,0,0,2,2,5];
 return <figure style={frame}><Caption><Math text={profit?m`各結果の確率は $\frac14$。${stage===0?"受取額":"利益"}（円）`:m`各結果の確率は $\frac16$。同じ得点も別の結果です。`}/></Caption>
  <div style={grid(profit?4:3)}>{values.map((v,i)=><div key={i} style={{...cell(true,profit?(i===0?blue:ink):v===2?blue:v===5?gold:ink),fontSize:16}}><Math text={`$${v}$`}/></div>)}</div>
  {!profit&&stage>=1&&<div style={grid(3)}>{[[0,m`\frac36`],[2,m`\frac26`],[5,m`\frac16`]].map(([v,p])=><div key={v} style={cell(true,v===2?blue:v===5?gold:ink)}><Math text={`$${v}$ 点`}/><div><Math text={`$${p}$`}/></div></div>)}</div>}
  {profit&&stage>=1&&<Caption><Math text={m`どの結果からも参加費 $100$ 円を引きます。`}/></Caption>}
 </figure>;
}
export default function MathAProbabilityStructure({kind,stage}:{kind:string;stage:number;reduce:boolean}){
 if(kind==="ma-probability-events")return <CoinRows stage={stage}/>;
 if(kind==="ma-probability-equal")return <Balls stage={stage}/>;
 if(kind==="ma-probability-pairs")return <PairCards stage={stage}/>;
 if(kind==="ma-probability-complement")return <CoinRows stage={stage} complement/>;
 if(kind==="ma-probability-union")return <DieCards kind="union" stage={stage}/>;
 if(kind==="ma-probability-tree")return <ProbabilityPaths stage={stage}/>;
 if(kind==="ma-probability-replacement")return <Balls stage={stage} replace/>;
 if(kind==="ma-probability-independent")return <DiceRectangle stage={stage}/>;
 if(kind==="ma-probability-repeated")return <CoinRows stage={stage} repeated/>;
 if(kind==="ma-probability-conditional")return <DieCards kind="conditional" stage={stage}/>;
 if(kind==="ma-probability-exclusive")return <DieCards kind="exclusive" stage={stage}/>;
 if(kind==="ma-probability-posterior")return <PosteriorPaths stage={stage}/>;
 if(kind==="ma-probability-mean")return <ExpectedOutcomes stage={stage}/>;
 if(kind==="ma-probability-profit")return <ExpectedOutcomes stage={stage} profit/>;
 return null;
}
