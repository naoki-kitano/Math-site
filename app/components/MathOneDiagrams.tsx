import {Formula,MathText} from "./MathText";
import MathOneQuadraticDiagrams from "./MathOneQuadraticDiagrams";
import MathOneTrigDiagrams from "./MathOneTrigDiagrams";
type Row={from:number;to:number;openFrom?:boolean;openTo?:boolean;label:string};
type Figure={title:string;description:string;min:number;max:number;marks:number[];rows:Row[]};
export const mathOneNumberLines:Record<string,Figure[]>={
 "m1-absolute-distance":[
  {title:"二点の間の距離",description:"$2$ から $5$ までの距離は $3$。引く順序が逆でも距離は同じです。",min:0,max:6,marks:[0,2,5],rows:[{from:2,to:5,label:"$|2-5|=3$"}]},
  {title:"中心から左右へ同じ距離",description:"$2$ から左へ $3$、右へ $3$ 進むと $-1$ と $5$ です。",min:-2,max:6,marks:[-1,2,5],rows:[{from:-1,to:2,label:"左側の距離 $3$"},{from:2,to:5,label:"右側の距離 $3$"}]},
  {title:"距離が指定値より小さい範囲",description:"$|x-2|<3$ は $-1<x<5$。白丸の両端は距離がちょうど $3$ なので含みません。",min:-2,max:6,marks:[-1,2,5],rows:[{from:-1,to:5,openFrom:true,openTo:true,label:"$-1<x<5$"}]},
 ],
 "m1-linear-inequalities":[
  {title:"境界より左側",description:"$2x+1<7$ の解は $x<3$。白丸の $3$ を含まず、左へ続きます。",min:-2,max:6,marks:[0,3],rows:[{from:-2,to:3,openTo:true,label:"$x<3$"}]},
  {title:"負の数で割ると向きが反転",description:"$-2x+1<7$ の解は $x>-3$。白丸の $-3$ を含まず、右へ続きます。",min:-6,max:2,marks:[-3,0],rows:[{from:-3,to:2,openFrom:true,label:"$x>-3$"}]},
 ],
 "m1-simultaneous-inequalities":[
  {title:"二つの範囲の共通部分",description:"上の二つの範囲を重ねると、共通部分は $1<x\\le4$。下の段が両方を満たす範囲です。",min:-1,max:6,marks:[1,4],rows:[{from:1,to:6,openFrom:true,label:"$x>1$"},{from:-1,to:4,label:"$x\\le4$"},{from:1,to:4,openFrom:true,label:"$1<x\\le4$"}]},
  {title:"共通部分がない場合",description:"$x>3$ と $x\\le2$ は重なりません。どちらか一方ではなく、両方を満たす必要があります。",min:0,max:5,marks:[2,3],rows:[{from:3,to:5,openFrom:true,label:"$x>3$"},{from:0,to:2,label:"$x\\le2$"}]},
  {title:"計算後の範囲を重ねる",description:"それぞれを解いて $x>1$ と $x\\le4$。共通範囲は $1<x\\le4$ です。",min:-1,max:6,marks:[1,4],rows:[{from:1,to:6,openFrom:true,label:"$x>1$"},{from:-1,to:4,label:"$x\\le4$"},{from:1,to:4,openFrom:true,label:"$1<x\\le4$"}]},
 ],
};
import MathOneDataDiagrams from "./MathOneDataDiagrams";
export default function MathOneDiagrams({slug,index}:{slug:string;index:number}) {
 const f=mathOneNumberLines[slug]?.[index];
 if(!f)return <><MathOneQuadraticDiagrams slug={slug} index={index}/><MathOneTrigDiagrams slug={slug} index={index}/><MathOneDataDiagrams slug={slug} index={index}/></>;
 const px=(x:number)=>36+568*(x-f.min)/(f.max-f.min);
 const height=62+f.rows.length*44;
 return <figure className="panel"><h3>{f.title}</h3><p><MathText text={f.description}/></p><svg viewBox={`0 0 640 ${height}`} style={{width:"100%",height:"auto"}} role="img" aria-label={f.title}><title>{f.title+"。横の位置が数の大小を表します。"}</title>
  {f.rows.map((r,i)=>{const y=26+i*44;return <g key={i}><line x1="24" x2="616" y1={y} y2={y} stroke="#9caebc"/><line x1={px(r.from)} x2={px(r.to)} y1={y} y2={y} stroke="#087c70" strokeWidth="5"/>{[r.from,r.to].map((x,j)=>x===f.min||x===f.max?<path key={j} d={x===f.min?`M ${px(x)+9} ${y-6} L ${px(x)} ${y} L ${px(x)+9} ${y+6}`:`M ${px(x)-9} ${y-6} L ${px(x)} ${y} L ${px(x)-9} ${y+6}`} fill="none" stroke="#087c70" strokeWidth="3"/>:<circle key={j} cx={px(x)} cy={y} r="6" fill={(j?r.openTo:r.openFrom)?"white":"#087c70"} stroke="#087c70" strokeWidth="2"/>)}</g>})}
  {f.marks.map(x=><g key={x}><line x1={px(x)} x2={px(x)} y1="10" y2={height-36} stroke="#9caebc" strokeDasharray="3 4"/><foreignObject x={px(x)-35} y={height-32} width="70" height="30"><div style={{textAlign:"center"}}><Formula tex={String(x)}/></div></foreignObject></g>)}
 </svg><figcaption>{f.rows.map((r,i)=><p key={i}><MathText text={r.label}/></p>)}</figcaption></figure>;
}
