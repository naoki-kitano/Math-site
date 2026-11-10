import {Formula,MathText} from './MathText';
export type AlgebraRange={from:number|null;to:number|null;openFrom?:boolean;openTo?:boolean};
export type AlgebraLineRow={label:string;ranges?:AlgebraRange[];points?:number[]};
export default function Math1AlgebraNumberLine({min,max,marks,rows}:{min:number;max:number;marks:number[];rows:AlgebraLineRow[]}){
 const pos=(n:number)=>`${8+84*(n-min)/(max-min)}%`;
 return <div className="m1alg-number-lines">{rows.map((row,i)=><div className="m1alg-line-row" key={i}>
  <p className="m1alg-line-label"><MathText text={row.label}/></p>
  <div className="m1alg-axis" role="img" aria-label={row.label.replaceAll('$','')}>
   <span className="m1alg-axis-track"/>
   {(row.ranges??[]).map((range,j)=>{const left=range.from??min,right=range.to??max;return <span key={j} className="m1alg-range" style={{left:pos(left),width:`${84*(right-left)/(max-min)}%`}}>
    {range.from===null?<span className="m1alg-ray left"/>:<span className={'m1alg-end left'+(range.openFrom?' open':'')}/>}
    {range.to===null?<span className="m1alg-ray right"/>:<span className={'m1alg-end right'+(range.openTo?' open':'')}/>}
   </span>;})}
   {(row.points??[]).map(v=><span className="m1alg-point" key={v} style={{left:pos(v)}}/>)}
   {marks.map(v=><span className="m1alg-mark" key={v} style={{left:pos(v)}}><span/><Formula tex={String(v)}/></span>)}
  </div>
 </div>)}</div>;
}
