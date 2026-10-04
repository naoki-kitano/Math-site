import {MathText} from "./MathText";
import {mathCPlots} from "../content/mathc-diagrams";
const m=String.raw;
function Label({x,y,text}:{x:number;y:number;text:string}){return <foreignObject x={x-50} y={y} width="100" height="44"><div style={{textAlign:"center",fontSize:18,lineHeight:1.5}}><MathText text={text}/></div></foreignObject>;}
export default function MathCDiagrams({slug,index}:{slug:string;index:number}){
 const target=["mc-parametric-elimination","mc-polar-equation"].includes(slug)?1:0;
 if(index!==target)return null;
 const plot=mathCPlots[slug];
 if(plot){
  const scale=130/plot.limit,X=(x:number)=>180+x*scale,Y=(y:number)=>180-y*scale,id=slug+"-arrow";
  return <figure className="math-b-figure math-c-figure"><svg viewBox="0 0 360 360" role="img" aria-label="例題の座標図。横軸と縦軸の一単位を同じ長さで表示">
   <defs><marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="#328e7e"/></marker></defs>
   <path d="M25 180 H335 M180 335 V25" stroke="#8293a5" fill="none"/>
   <Label x={330} y={187} text={plot.axis?.[0]??"$x$"}/><Label x={180} y={3} text={plot.axis?.[1]??"$y$"}/>
   <Label x={165} y={184} text="$0$"/>
   <line x1={X(1)} x2={X(1)} y1="177" y2="183" stroke="#8293a5"/><Label x={X(1)} y={199} text="$1$"/>
   <line x1="177" x2="183" y1={Y(1)} y2={Y(1)} stroke="#8293a5"/>
   {plot.paths.map((p,i)=><polyline key={i} points={p.points.map(([x,y])=>`${X(x).toFixed(2)},${Y(y).toFixed(2)}`).join(" ")} fill="none" stroke={p.dashed?"#8293a5":"#328e7e"} strokeWidth={p.dashed?1.4:2.4} strokeDasharray={p.dashed?"5 4":undefined} markerEnd={p.arrow?`url(#${id})`:undefined}/>)}
   {plot.points.map((p,i)=><g key={i}><circle cx={X(p.at[0])} cy={Y(p.at[1])} r="4" fill="#14243f"/><Label x={X(p.at[0])+(p.offset?.[0]??0)} y={Y(p.at[1])+(p.offset?.[1]??-30)} text={p.label}/></g>)}
  </svg><figcaption><MathText text={plot.caption}/></figcaption></figure>;
 }
 if(slug==="mc-space-coordinates")return <figure className="math-b-figure math-c-figure"><svg viewBox="0 0 360 310" role="img" aria-label="空間の点から座標平面へ下ろした垂線の見取り図">
 <path d="M110 245 L325 245 M110 245 L30 295 M110 245 L110 25" fill="none" stroke="#8293a5"/>
 <path d="M110 245 L265 215 L265 95 M110 125 L265 95" fill="none" stroke="#328e7e" strokeWidth="2" strokeDasharray="5 4"/>
 <circle cx="265" cy="95" r="4" fill="#14243f"/><circle cx="265" cy="215" r="4" fill="#14243f"/>
 <Label x={320} y={250} text="$x$"/><Label x={35} y={265} text="$y$"/><Label x={110} y={0} text="$z$"/>
 <Label x={280} y={57} text="$P(3,-2,3)$"/><Label x={275} y={220} text="$H(3,-2,0)$"/><Label x={289} y={143} text="$3$"/>
 </svg><figcaption><MathText text={m`例題の見取り図。$xy$ 平面へ下ろすと高さだけが零になります。投影図なので、紙面上の角度や長さは実際の値とは一致しません。`}/></figcaption></figure>;
 if(slug==="mc-data-representation")return <figure className="math-b-figure math-c-figure"><svg viewBox="0 0 360 260" role="img" aria-label="例題の要望件数を降順に並べた棒と累積比率">
 <path d="M40 20 V200 H305 V20" fill="none" stroke="#8293a5"/>
 {[15,9,6].map((n,i)=><g key={i}><rect x={65+i*80} y={200-n*10} width="38" height={n*10} fill="#80c5b5"/><Label x={84+i*80} y={170-n*10} text={`$${n}$`}/></g>)}
 <polyline points="84,110 164,56 244,20" fill="none" stroke="#14243f" strokeWidth="2"/>
 <Label x={84} y={212} text="蔵書"/><Label x={164} y={212} text="時間"/><Label x={244} y={212} text="座席"/>
 <Label x={325} y={5} text={m`$100\%$`}/><Label x={327} y={95} text={m`$50\%$`}/><Label x={325} y={185} text={m`$0\%$`}/>
 </svg><figcaption><MathText text={m`棒は件数（上に値を表示）、折れ線は右の目盛で読む累積比率。蔵書と開室時間で全体の $80\%$ です。`}/></figcaption></figure>;
 if(slug==="mc-discrete-graph")return <figure className="math-b-figure math-c-figure"><svg viewBox="0 0 360 230" role="img" aria-label="三地点間の所要時間を辺に付けたグラフ">
 <path d="M55 175 L175 45 L305 175 Z" fill="none" stroke="#328e7e" strokeWidth="3"/>
 {[["A",55,175],["B",175,45],["C",305,175]].map(([s,x,y])=><g key={s}><circle cx={Number(x)} cy={Number(y)} r="6" fill="#14243f"/><Label x={Number(x)} y={Number(y)+(s==="B"?-35:10)} text={`$${s}$`}/></g>)}
 <Label x={90} y={78} text="$3$ 分"/><Label x={264} y={78} text="$2$ 分"/><Label x={180} y={178} text="$6$ 分"/>
 </svg><figcaption>例題の三地点。辺の見た目の長さではなく、書かれた所要時間を足して比較します。どの道も双方向です。</figcaption></figure>;
 return null;
}
