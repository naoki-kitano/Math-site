"use client";
import {useEffect,useId,useRef,useState,useSyncExternalStore} from "react";
import {Formula,MathText} from "./MathText";
import {centeredRotation} from "../lib/visual-models";
const m=String.raw,query="(prefers-reduced-motion: reduce)";
const subscribe=(cb:()=>void)=>{const media=window.matchMedia(query);media.addEventListener("change",cb);return()=>media.removeEventListener("change",cb);};
const X=(x:number)=>Number((188+48*x).toFixed(3)),Y=(y:number)=>Number((333-48*y).toFixed(3));
const stageNames=["初めの位置",m`$-\alpha$ で移す`,m`$i$ を掛けて回す`,m`$+\alpha$ で中心を戻す`];
const headings=["原点以外の点を中心に回す","中心を原点へ移す","原点を中心に回す","中心の位置を戻す"];
const explanations=[
 m`$\alpha=1+2i$ を中心に、点 $z=4+3i$ を反時計回りに $90^\circ$ 回します。`,
 m`原点を中心とする回転の式を使うため、中心と点の両方から $\alpha$ を引きます。どちらも左へ $1$、下へ $2$ 動きます。`,
 m`$z-\alpha$ に $i$ を掛けます。原点からの距離を変えず、反時計回りに $90^\circ$ 回します。`,
 m`中心と点の両方に $\alpha$ を足します。右へ $1$、上へ $2$ 動かすと、中心が元の位置に戻ります。点は回転後の位置 $w$ に着きます。`,
];
const diagramDescriptions=[
 "実軸を横、虚軸を縦にした複素数平面。中心は座標1、2、回す点は座標4、3です。",
 "中心と点をどちらも左へ1、下へ2移します。中心は原点、点は座標3、1へ移ります。",
 "原点からの距離を保って反時計回りに90度回します。点は座標3、1から座標マイナス1、3へ移ります。",
 "中心と点をどちらも右へ1、上へ2移します。中心は元の座標1、2へ戻り、回転後の点は座標0、5に着きます。",
];
const operations=[m`z=4+3i,\quad\alpha=1+2i`,m`z\xrightarrow{-\alpha}z-\alpha`,m`z-\alpha\xrightarrow{\times i}i(z-\alpha)`,m`i(z-\alpha)\xrightarrow{+\alpha}w`];
const calculations=["",m`(4+3i)-(1+2i)=3+i`,m`i(3+i)=-1+3i`,m`(-1+3i)+(1+2i)=5i`];
function Label({x,y,tex,width=135}:{x:number;y:number;tex:string;width?:number}){return <foreignObject x={x-width/2} y={y-22} width={width} height="52"><div className="rotation-math-label"><Formula tex={tex}/></div></foreignObject>;}
function arc(center:number[],from:number[],angle:number){
 const dx=from[0]-center[0],dy=from[1]-center[1];
 return Array.from({length:51},(_,i)=>{const t=angle*i/50;return `${i?"L":"M"}${X(center[0]+dx*Math.cos(t)-dy*Math.sin(t))},${Y(center[1]+dx*Math.sin(t)+dy*Math.cos(t))}`;}).join(" ");
}
export default function ComplexRotationExplorer(){
 const [progress,setProgress]=useState(0),[playing,setPlaying]=useState(false),[manual,setManual]=useState(false);
 const systemReduced=useSyncExternalStore(subscribe,()=>window.matchMedia(query).matches,()=>false),reduced=systemReduced||manual;
 const current=useRef(0),target=useRef(0),id=useId().replace(/:/g,"");
 const finished=Number.isInteger(progress),stage=Math.floor(progress),operation=finished?stage:Math.ceil(progress);
 const {center,point}=centeredRotation(progress);
 const go=(p:number)=>{setPlaying(false);current.current=p;setProgress(p);};
 useEffect(()=>{
  if(!playing||reduced)return;
  let frame:number,previous:number|undefined;
  const tick=(now:number)=>{const elapsed=previous===undefined?0:Math.min(60,now-previous);previous=now;current.current=Math.min(target.current,current.current+elapsed/3200);setProgress(current.current);if(current.current>=target.current)setPlaying(false);else frame=requestAnimationFrame(tick);};
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[playing,reduced]);
 useEffect(()=>{const media=window.matchMedia(query),stop=()=>{if(media.matches)setPlaying(false);};media.addEventListener("change",stop);return()=>media.removeEventListener("change",stop);},[]);
 const next=()=>{const nextStage=Math.min(3,Math.floor(progress)+1);if(reduced)go(nextStage);else{target.current=nextStage;setPlaying(true);}};
 const pointLabel=finished?["z","z-\\alpha","i(z-\\alpha)","w"][stage]:null;
 return <section className="visual-lesson complex-rotation panel" data-visual="rotation" data-stage={stage} data-progress={progress}>
  <div className="rotation-stages" role="group" aria-label="考える段階">{stageNames.map((name,i)=><button key={i} aria-pressed={finished&&stage===i} onClick={()=>go(i)}><MathText text={name}/></button>)}</div>
  <h3>{headings[operation]}</h3>
  <p className="rotation-instruction"><MathText text={explanations[operation]}/></p>
  <div className="rotation-operation"><Formula tex={operations[operation]} display/></div>
  <svg viewBox="0 0 520 405" className="rotation-board" role="img" aria-label={diagramDescriptions[operation]}>
   <defs>{[["move","#bd6f1c"],["turn","#087c70"]].map(([name,color])=><marker key={name} id={id+name} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill={color}/></marker>)}</defs>
   {[-2,-1,0,1,2,3,4,5,6].map(x=><line key={'x'+x} x1={X(x)} x2={X(x)} y1={Y(-1)} y2={Y(6)} stroke="#edf1f5"/>)}
   {[-1,0,1,2,3,4,5,6].map(y=><line key={'y'+y} x1={X(-3)} x2={X(6)} y1={Y(y)} y2={Y(y)} stroke="#edf1f5"/>)}
   <path d={`M${X(-3)},${Y(0)}H${X(6)} M${X(0)},${Y(-1)}V${Y(6)}`} fill="none" stroke="#8093a7"/>
   <Label x={X(6)+14} y={Y(0)+21} tex="\operatorname{Re}" width={42}/><Label x={X(0)+23} y={Y(6)-5} tex="\operatorname{Im}" width={42}/>
   {[-2,0,2,4].map(x=><Label key={x} x={X(x)} y={Y(0)+28} tex={String(x)} width={30}/>)}
   {[2,4,6].map(y=><Label key={y} x={X(0)-22} y={Y(y)} tex={String(y)} width={30}/>)}
   {progress>0&&<g className="rotation-original"><line x1={X(1)} y1={Y(2)} x2={X(4)} y2={Y(3)} stroke="#8d9aa6" strokeDasharray="4 5"/><circle cx={X(1)} cy={Y(2)} r="5" fill="white" stroke="#8d9aa6"/><circle cx={X(4)} cy={Y(3)} r="5" fill="white" stroke="#8d9aa6"/><Label x={X(4)+32} y={Y(3)-18} tex="z" width={30}/>{progress<3&&<Label x={X(1)+24} y={Y(2)+28} tex="\alpha" width={30}/>}</g>}
   {operation===1&&<g className="rotation-motion-path">{[[1,2,0,0],[4,3,3,1]].map(([a,b,c,d],i)=><line key={i} x1={X(a)} y1={Y(b)} x2={X(c)} y2={Y(d)} stroke="#bd6f1c" strokeWidth="2.5" markerEnd={`url(#${id}move)`}/>)}<Label x={X(2)} y={Y(2.6)} tex="-\alpha" width={85}/></g>}
   {operation===2&&<g><path d={arc([0,0],[3,1],Math.PI/2)} fill="none" stroke="#087c70" strokeWidth="2.5" strokeDasharray="4 4" markerEnd={`url(#${id}turn)`}/><path d={arc([0,0],[3,1],Math.PI/2*Math.max(0,progress-1))} fill="none" stroke="#087c70" strokeWidth="4"/><line x1={X(0)} y1={Y(0)} x2={X(3)} y2={Y(1)} stroke="#bd6f1c" strokeDasharray="4 4"/><Label x={X(1.4)} y={Y(2.5)} tex="90^\circ" width={75}/></g>}
   {operation===3&&<g>{[[0,0,1,2],[-1,3,0,5]].map(([a,b,c,d],i)=><line key={i} x1={X(a)} y1={Y(b)} x2={X(c)} y2={Y(d)} stroke="#bd6f1c" strokeWidth="2.5" markerEnd={`url(#${id}move)`}/>)}<line x1={X(0)} y1={Y(0)} x2={X(-1)} y2={Y(3)} stroke="#8d9aa6" strokeDasharray="4 5"/><circle cx={X(-1)} cy={Y(3)} r="5" fill="white" stroke="#8d9aa6"/><Label x={X(-1.6)} y={Y(4.2)} tex="+\alpha" width={85}/></g>}
   <line x1={X(center[0])} y1={Y(center[1])} x2={X(point[0])} y2={Y(point[1])} stroke="#087c70" strokeWidth="3"/>
   <circle cx={X(center[0])} cy={Y(center[1])} r="6" fill="#0b1f3a" stroke="white" strokeWidth="2"/>
   <circle cx={X(point[0])} cy={Y(point[1])} r="7" fill="#087c70" stroke="white" strokeWidth="2"/>
   {finished&&<Label x={X(center[0])-20} y={Y(center[1])-24} tex={stage===0||stage===3?"\\alpha":"O"} width={40}/>}
   {pointLabel&&<Label x={X(point[0])+(stage===2?-35:42)} y={Y(point[1])+(stage===1?22:-26)} tex={pointLabel} width={stage===2?160:125}/>}
  </svg>
  <div className="actions rotation-controls">{progress<3&&<button className="button" onClick={playing?()=>setPlaying(false):next}>{playing?"停止":!finished?"この移動を続ける":<MathText text={stageNames[Math.min(3,stage+1)]}/>}</button>}<button className="button secondary" disabled={progress===0} onClick={()=>go(Math.max(0,Math.ceil(progress)-1))}>一つ前へ</button><button className="text-link" onClick={()=>go(0)}>初めに戻す</button></div>
  <label className="unit-reduced"><input type="checkbox" checked={reduced} disabled={systemReduced} onChange={e=>{setManual(e.target.checked);go(Math.ceil(progress));}}/>動きを減らす</label>
  {finished&&stage>0&&<div className="rotation-calculation" aria-live="polite"><Formula tex={calculations[stage]} display/>{stage===3&&<Formula tex="w=\alpha+i(z-\alpha)" display/>}</div>}
 </section>;
}
