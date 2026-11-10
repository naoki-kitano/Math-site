"use client";
import { useContext, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {DiagramLayoutContext} from "./DiagramLayout";
const narrowQuery="(max-width: 600px)";
const subscribeViewport=(callback:()=>void)=>{const media=window.matchMedia(narrowQuery);media.addEventListener("change",callback);return()=>media.removeEventListener("change",callback);};
import { MathText } from "./MathText";
import Math2CoordinateDiagram from './Math2CoordinateDiagram';
export type Curve = { label:string; value:(x:number)=>number; color?:string; dashed?:boolean; from?:number; to?:number };
export type Dot = { x:number;y:number;label:string;open?:boolean;labelOffset?:[number,number] };
export type Segment = { from:[number,number];to:[number,number];label?:string;dashed?:boolean;color?:string;width?:number;labelOffset?:[number,number] };
export type Circle = { x:number;y:number;r:number;label:string;dashed?:boolean;color?:string };
export type Area = { from:number;to:number;upper:(x:number)=>number;lower:(x:number)=>number;label:string };
export type Arc = { x:number;y:number;r:number;from:number;to:number;label:string;color?:string;width?:number };
export type CoordinateDiagramProps = {
 title:string;description:string;xRange:[number,number];yRange:[number,number];
 curves?:Curve[];points?:Dot[];segments?:Segment[];circles?:Circle[];areas?:Area[];arcs?:Arc[];tick?:number;
 xTicks?:{value:number;label:string}[];
 axisDescription?:string;
 directLabels?:boolean;
 responsive?:boolean;
 compact?:boolean;
 hideTickLabels?:boolean;
 axisLabels?:boolean;
};
// Equal scale on both axes preserves distances, angles, and circles.
export default function CoordinateDiagram(props:CoordinateDiagramProps){
 return props.directLabels?<Math2CoordinateDiagram {...props}/>:<LegacyCoordinateDiagram {...props}/>;
}
function LegacyCoordinateDiagram({title,description,xRange,yRange,curves=[],points=[],segments=[],circles=[],areas=[],arcs=[],tick=1,xTicks,responsive=false,axisLabels=false,axisDescription="横軸は $x$、縦軸は $y$。"}:CoordinateDiagramProps){
 const clip=useId().replace(/:/g,"");
 const focused=useContext(DiagramLayoutContext),svgRef=useRef<SVGSVGElement>(null);
 const [renderedWidth,setRenderedWidth]=useState(0);
 useEffect(()=>{
  const svg=svgRef.current;if(!focused||!svg)return;
  const observer=new ResizeObserver(()=>setRenderedWidth(svg.getBoundingClientRect().width));
  observer.observe(svg);return()=>observer.disconnect();
 },[focused]);
 const small=useSyncExternalStore(subscribeViewport,()=>(responsive||focused)&&window.matchMedia(narrowQuery).matches,()=>false);
 const width=focused?(small?320:360):small?320:640,padding=focused?30:small?32:36;
 const labelSize=focused?Math.max(18,14*width/(renderedWidth||width)):small?18:14;
 const height=focused?280:small?Math.max(260,Math.min(480,Math.round((width-2*padding)*(yRange[1]-yRange[0])/(xRange[1]-xRange[0])+2*padding))):440;
 const scale=Math.min((width-2*padding)/(xRange[1]-xRange[0]),(height-2*padding)/(yRange[1]-yRange[0]));
 const plotWidth=(xRange[1]-xRange[0])*scale,plotHeight=(yRange[1]-yRange[0])*scale;
 const left=(width-plotWidth)/2,top=(height-plotHeight)/2;
 // SVG precision must be stable across the server and browser math libraries.
 const px=(x:number)=>Number((left+(x-xRange[0])*scale).toFixed(4)),py=(y:number)=>Number((top+(yRange[1]-y)*scale).toFixed(4));
 const ticks=(range:[number,number])=>Array.from({length:Math.max(0,Math.min(60,Math.floor(range[1]/tick)-Math.ceil(range[0]/tick)+1))},(_,i)=>(Math.ceil(range[0]/tick)+i)*tick);
 const labeledTicks=(range:[number,number])=>{const values=ticks(range),stride=small||focused?Math.max(1,Math.ceil(values.length/(focused&&renderedWidth>0&&renderedWidth<260?5:7))):1;return values.filter((_,i)=>i%stride===0);};
 // Numeric labels close to the origin may collide across the two axes.
 // Keep the horizontal labels and omit only overlapping vertical tick text.
 const xLabelY=Math.min(top+plotHeight+18,Math.max(top+16,py(0)+19));
 const yLabelX=Math.min(left+plotWidth-5,Math.max(left-6,px(0)-8));
 const xLabelBoxes=xTicks?xTicks.map(t=>({left:px(t.value)-28,right:px(t.value)+28,top:Math.min(top+plotHeight+2,Math.max(top,py(0)+5)),bottom:Math.min(top+plotHeight+2,Math.max(top,py(0)+5))+32})):labeledTicks(xRange).filter(x=>x!==0).map(x=>{
  const half=String(Number(x.toFixed(2))).length*labelSize*.32;
  return {left:px(x)-half,right:px(x)+half,top:xLabelY-labelSize,bottom:xLabelY+3};
 });
 const verticalLabels=labeledTicks(yRange).filter(y=>y!==0).filter(y=>{
  if(!focused)return true;
  const width=String(Number(y.toFixed(2))).length*labelSize*.64;
  const bounds={left:yLabelX-width,right:yLabelX,top:py(y)+5-labelSize,bottom:py(y)+8};
  return !xLabelBoxes.some(x=>bounds.left<x.right+2&&bounds.right>x.left-2&&bounds.top<x.bottom+2&&bounds.bottom>x.top-2);
 });
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
 return <figure className={`panel math-figure legacy-coordinate${focused?" focused-coordinate":""}${responsive?" responsive-coordinate":""}`}>
  <h3>{title}</h3><p id={`${clip}-description`}><MathText text={description}/></p>
  <svg ref={svgRef} className="coordinate-diagram" viewBox={"0 0 "+width+" "+height} role="img" aria-label={title} aria-describedby={`${clip}-description`}>
   <title>{title}</title>
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
   {xTicks?xTicks.map(t=><foreignObject key={t.value} x={px(t.value)-28} y={Math.min(top+plotHeight+2,Math.max(top,py(0)+5))} width="56" height="32"><div style={{fontSize:focused?labelSize:small?18:13,lineHeight:1.2,textAlign:"center",color:"#43566b"}}><MathText text={t.label}/></div></foreignObject>):labeledTicks(xRange).filter(x=>x!==0).map(x=><text key={x} x={px(x)} y={xLabelY} textAnchor="middle" fontSize={labelSize} fill="#43566b">{Number(x.toFixed(2))}</text>)}
   {verticalLabels.map(y=><text key={y} x={yLabelX} y={py(y)+5} textAnchor="end" fontSize={labelSize} fill="#43566b">{Number(y.toFixed(2))}</text>)}
   {axisLabels&&<><foreignObject x={Math.min(width-24,left+plotWidth+6)} y={py(0)-27} width="24" height="28"><div style={{fontSize:labelSize,lineHeight:1.1}}><MathText text="$x$"/></div></foreignObject><foreignObject x={px(0)+12} y="2" width="24" height="28"><div style={{fontSize:labelSize,lineHeight:1.1}}><MathText text="$y$"/></div></foreignObject></>}
  </svg>
  <figcaption><p className={axisLabels?"sr-only":"meta"}><MathText text={axisDescription}/></p>
   {curves.filter(c=>c.label).map((c,i)=><p key={"curve"+i}><span className="figure-key" style={{background:c.color??"#087c70"}}/><MathText text={c.label}/></p>)}
   {circles.map((c,i)=><p key={"circle"+i}><MathText text={c.label}/></p>)}
   {arcs.map((a,i)=><p key={"arc"+i}><MathText text={a.label}/></p>)}
   {points.filter(p=>p.label).map((p,i)=><p key={"point"+i}><MathText text={p.label}/></p>)}
   {segments.filter(s=>s.label).map((s,i)=><p key={"line"+i}><MathText text={s.label!}/></p>)}
   {areas.map((a,i)=><p key={"area"+i}><MathText text={a.label}/></p>)}
  </figcaption>
 </figure>;
}
