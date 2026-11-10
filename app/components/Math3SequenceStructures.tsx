"use client";
import {Formula} from './MathText';
const m=String.raw;
type Tone='teal'|'ochre';
function Term({tex,tone,cancel=false}:{tex:string;tone?:Tone;cancel?:boolean}){
 return <span className={`seq-term${tone?' seq-'+tone:''}${cancel?' seq-cancelled':''}`}><Formula tex={tex}/></span>;
}
function Cell({tex,plus=false,tone,cancel=false}:{tex:string;plus?:boolean;tone?:Tone;cancel?:boolean}){
 return <span className="seq-cell"><span className="seq-operator" aria-hidden={!plus}>{plus?<Formula tex="+"/>:null}</span><Term tex={tex} tone={tone} cancel={cancel}/></span>;
}
function Range(){
 return <div className="seq-range-board" role="group" aria-label="添字の2と、初項から二項分の範囲">
  <div className="seq-range-label"><Formula tex={m`S_{\color{#176c82}{2}}`}/></div>
  <div className="seq-range-terms">
   <div className="seq-selected"><Formula tex="a_1"/><Term tex="2"/></div>
   <div className="seq-selected"><Formula tex="a_2"/><Term tex="4"/></div>
   <div><Formula tex="a_3"/><Term tex="6"/></div>
   <div className="seq-range-bracket" aria-hidden="true"/>
  </div>
  <div className="seq-conclusion"><Formula tex={m`S_2=2+4=6`} display/></div>
 </div>;
}
function PartialSum(){
 return <div className="seq-cancel-board" role="group" aria-label="二つの部分和で共通の項が引き合う">
  <div className="seq-equation seq-three-columns"><Formula tex="S_3="/><div className="seq-terms"><Cell tex="2" tone="teal" cancel/><Cell tex="4" tone="ochre" plus cancel/><Cell tex="6" plus/></div></div>
  <div className="seq-equation seq-three-columns"><Formula tex="S_2="/><div className="seq-terms"><Cell tex="2" tone="teal" cancel/><Cell tex="4" tone="ochre" plus cancel/><span/></div></div>
  <div className="seq-result"><Formula tex={m`S_3-S_2=6=a_3`} display/></div>
 </div>;
}
function Geometric({stage}:{stage:number}){
 const shifted=stage>0;
 return <div className={`seq-geometric${shifted?' is-shifted':''}`} role="group" aria-label="公比を掛けた和を一項分ずらして、同じ項を引く">
  <div className="seq-equation seq-four-columns"><Formula tex="S_3="/><div className="seq-terms"><Cell tex="a"/><Cell tex="ar" tone="teal" plus cancel={shifted}/><Cell tex="ar^2" tone="ochre" plus cancel={shifted}/><span/></div></div>
  <div className="seq-equation seq-four-columns"><Formula tex="rS_3="/><div className="seq-shift-space"><div className="seq-shifting-terms"><Cell tex="ar" tone="teal" cancel={shifted}/><Cell tex="ar^2" tone="ochre" plus cancel={shifted}/><Cell tex="ar^3" plus/></div></div></div>
  {shifted&&<div className="seq-result"><Formula tex={m`S_3-rS_3=a-ar^3`} display/></div>}
 </div>;
}
function Radical(){
 return <div className="seq-cancel-board" role="group" aria-label="二乗の差の同じnの二乗が消え、nが残る">
  <div className="seq-radical-terms"><Formula tex="("/><Term tex="n^2" tone="teal" cancel/><Formula tex="+"/><Term tex="n" tone="ochre"/><Formula tex=")-"/><Term tex="n^2" tone="teal" cancel/></div>
  <div className="seq-result"><Formula tex={m`(n^2+n)-n^2=n`} display/></div>
 </div>;
}
function Recurrence(){
 return <div className="seq-cancel-board" role="group" aria-label="漸化式と固定値の式で、共通の定数項が引き合う">
  <div className="seq-recurrence-equation"><Formula tex="a_{n+1}="/><Formula tex={m`\dfrac12a_n`}/><Formula tex="+"/><Term tex="1" tone="ochre" cancel/></div>
  <div className="seq-recurrence-equation"><Formula tex="2="/><Formula tex={m`\dfrac12\cdot2`}/><Formula tex="+"/><Term tex="1" tone="ochre" cancel/></div>
  <div className="seq-result"><Formula tex={m`a_{n+1}-2=\dfrac12(a_n-2)`} display/></div>
 </div>;
}
export default function Math3SequenceStructures({kind,stage,reduce}:{kind:string;stage:number;reduce:boolean}){
 const content=kind==='sequence-range'?<Range/>:kind==='sequence-cancellation'?<PartialSum/>:kind==='sequence-geometric'?<Geometric stage={stage}/>:kind==='sequence-radical-cancellation'?<Radical/>:kind==='sequence-recurrence-cancellation'?<Recurrence/>:null;
 if(!content)return null;
 return <div className={`math3-sequence-structure${reduce?' seq-reduce':''}`} data-sequence-structure={kind} data-stage={stage}>{content}</div>;
}
