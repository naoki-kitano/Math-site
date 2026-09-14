"use client";
import { useId } from "react";
import { MathText } from "./MathText";
export type Curve = { label:string; value:(x:number)=>number; color?:string; dashed?:boolean; from?:number; to?:number };
export type Dot = { x:number;y:number;label:string;open?:boolean };
export type Segment = { from:[number,number];to:[number,number];label?:string;dashed?:boolean;color?:string;width?:number };
export type Circle = { x:number;y:number;r:number;label:string;dashed?:boolean;color?:string };
export type Area = { from:number;to:number;upper:(x:number)=>number;lower:(x:number)=>number;label:string };
export type Arc = { x:number;y:number;r:number;from:number;to:number;label:string;color?:string;width?:number };
export type CoordinateDiagramProps = {
 title:string;description:string;xRange:[number,number];yRange:[number,number];
 curves?:Curve[];points?:Dot[];segments?:Segment[];circles?:Circle[];areas?:Area[];arcs?:Arc[];tick?:number;
 xTicks?:{value:number;label:string}[];
};
// Equal scale on both axes preserves distances, angles, and circles.
export default function CoordinateDiagram({title,description,xRange,yRange,curves=[],points=[],segments=[],circles=[],areas=[],arcs=[],tick=1,xTicks}:CoordinateDiagramProps){
 const clip=useId().replace(/:/g,"");
 const width=640,height=440,padding=36;
 const scale=Math.min((width-2*padding)/(xRange[1]-xRange[0]),(height-2*padding)/(yRange[1]-yRange[0]));
 const plotWidth=(xRange[1]-xRange[0])*scale,plotHeight=(yRange[1]-yRange[0])*scale;
 const left=(width-plotWidth)/2,top=(height-plotHeight)/2;
 const px=(x:number)=>left+(x-xRange[0])*scale,py=(y:number)=>top+(yRange[1]-y)*scale;
 const ticks=(range:[number,number])=>Array.from({length:Math.max(0,Math.min(60,Math.floor(range[1]/tick)-Math.ceil(range[0]/tick)+1))},(_,i)=>(Math.ceil(range[0]/tick)+i)*tick);
 const path=(curve:Curve)=>{
  const from=Math.max(xRange[0],curve.from??xRange[0]),to=Math.min(xRange[1],curve.to??xRange[1]);
  let result="",previous:number|null=null;
  for(let i=0;i<=320;i++){
   const x=from+(to-from)*i/320,y=curve.value(x);
   if(!Number.isFinite(y)){previous=null;continue;}
   const connected=previous!==null&&Math.abs(y-previous)<(yRange[1]-yRange[0])*2;
   result+=(connected?"L":"M")+px(x).toFixed(2)+","+py(y).toFixed(2);
   previous=y;
  }
  return result;
 };
 const areaPath=(area:Area)=>{
  const xs=Array.from({length:161},(_,i)=>area.from+(area.to-area.from)*i/160);
  return [...xs.map(x=>[px(x),py(area.upper(x))]),...xs.reverse().map(x=>[px(x),py(area.lower(x))])]
   .map(([x,y])=>x.toFixed(2)+","+y.toFixed(2)).join(" ");
 };
 return <figure className="panel math-figure">
  <h3>{title}</h3><p><MathText text={description}/></p>
  <svg className="coordinate-diagram" viewBox={"0 0 "+width+" "+height} role="img" aria-label={title}>
   <title>{title}</title><desc>{description.replace(/\$/g,"")}</desc>
   <defs><clipPath id={clip}><rect x={left} y={top} width={plotWidth} height={plotHeight}/></clipPath></defs>
   <g clipPath={"url(#"+clip+")"}>
    {(xTicks?.map(t=>t.value)??ticks(xRange)).map(x=><line key={"x"+x} x1={px(x)} y1={top} x2={px(x)} y2={top+plotHeight} stroke="#e3eaf2"/>)}
    {ticks(yRange).map(y=><line key={"y"+y} x1={left} y1={py(y)} x2={left+plotWidth} y2={py(y)} stroke="#e3eaf2"/>)}
    {areas.map((a,i)=><polygon key={i} points={areaPath(a)} fill="#00a88b" fillOpacity=".16"/>)}
    <line x1={left} x2={left+plotWidth} y1={py(0)} y2={py(0)} stroke="#526176"/>
    <line x1={px(0)} x2={px(0)} y1={top} y2={top+plotHeight} stroke="#526176"/>
    {circles.map((c,i)=><circle key={i} cx={px(c.x)} cy={py(c.y)} r={c.r*scale} fill="none" stroke={c.color??"#087c70"} strokeWidth="2.5" strokeDasharray={c.dashed?"6 5":undefined}/>)}
    {arcs.map((a,i)=><path key={i} d={Array.from({length:161},(_,j)=>{const angle=a.from+(a.to-a.from)*j/160;return (j?"L":"M")+px(a.x+a.r*Math.cos(angle))+","+py(a.y+a.r*Math.sin(angle));}).join(" ")} fill="none" stroke={a.color??"#087c70"} strokeWidth={a.width??4}/>)}
    {curves.map((c,i)=><path key={i} d={path(c)} fill="none" stroke={c.color??"#087c70"} strokeWidth="2.5" strokeDasharray={c.dashed?"6 5":undefined}/>)}
    {segments.map((s,i)=><line key={i} x1={px(s.from[0])} y1={py(s.from[1])} x2={px(s.to[0])} y2={py(s.to[1])} stroke={s.color??"#42648b"} strokeWidth={s.width??2} strokeDasharray={s.dashed?"6 5":undefined}/>)}
    {points.map((p,i)=><circle key={i} cx={px(p.x)} cy={py(p.y)} r="4.5" fill={p.open?"white":"#0b1f3a"} stroke={p.open?"#0b1f3a":"white"} strokeWidth="1.5"/>)}
   </g>
   {xTicks?xTicks.map(t=><foreignObject key={t.value} x={px(t.value)-28} y={Math.min(top+plotHeight+2,Math.max(top,py(0)+5))} width="56" height="32"><div style={{fontSize:13,textAlign:"center",color:"#43566b"}}><MathText text={t.label}/></div></foreignObject>):ticks(xRange).filter(x=>x!==0).map(x=><text key={x} x={px(x)} y={Math.min(top+plotHeight+18,Math.max(top+16,py(0)+19))} textAnchor="middle" fontSize="14" fill="#43566b">{Number(x.toFixed(2))}</text>)}
   {ticks(yRange).filter(y=>y!==0).map(y=><text key={y} x={Math.min(left+plotWidth-5,Math.max(left-6,px(0)-8))} y={py(y)+5} textAnchor="end" fontSize="14" fill="#43566b">{Number(y.toFixed(2))}</text>)}
  </svg>
  <figcaption><p className="meta"><MathText text="横軸は $x$、縦軸は $y$。"/></p>
   {curves.map((c,i)=><p key={"curve"+i}><span className="figure-key" style={{background:c.color??"#087c70"}}/><MathText text={c.label}/></p>)}
   {circles.map((c,i)=><p key={"circle"+i}><MathText text={c.label}/></p>)}
   {arcs.map((a,i)=><p key={"arc"+i}><MathText text={a.label}/></p>)}
   {points.map((p,i)=><p key={"point"+i}><MathText text={p.label}/></p>)}
   {segments.filter(s=>s.label).map((s,i)=><p key={"line"+i}><MathText text={s.label!}/></p>)}
   {areas.map((a,i)=><p key={"area"+i}><MathText text={a.label}/></p>)}
  </figcaption>
 </figure>;
}
