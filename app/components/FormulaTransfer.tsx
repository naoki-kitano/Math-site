"use client";
import {useEffect,useId,useRef,useState} from "react";
import {Formula} from "./MathText";
export type Transfer={source:string;target:string;template?:string;parts:{tex:string;color:string;sourceEdge?:"left"|"right";targetEdge?:"left"|"right"}[]};
type Track={tex:string;color:string;sx:number;sy:number;tx:number;ty:number;from:number;to:number;sh:number;th:number;path:string};
/** Measure typeset symbols so arrows follow the actual glyphs, at every width. */
export default function FormulaTransfer({motion,reduce}:{motion:Transfer;reduce:boolean}){
 const root=useRef<HTMLDivElement>(null),source=useRef<HTMLDivElement>(null),target=useRef<HTMLDivElement>(null);
 const id=useId().replaceAll(":","");
 const [settled,setSettled]=useState(false);
 const [layout,setLayout]=useState<{width:number;height:number;tracks:Track[]}|null>(null);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  let cancelled=false,frame=0;
  const bounds=(container:HTMLElement,color:string)=>{
   const rgb=`rgb(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)})`;
   const nodes=[...container.querySelectorAll<HTMLElement>('.katex-html [style]')].filter(n=>n.style.color===rgb);
   if(!nodes.length)return null;
   const rects=nodes.map(n=>n.getBoundingClientRect());
   return {left:Math.min(...rects.map(r=>r.left)),right:Math.max(...rects.map(r=>r.right)),top:Math.min(...rects.map(r=>r.top)),bottom:Math.max(...rects.map(r=>r.bottom))};
  };
  const measure=()=>{
   if(cancelled||!source.current||!target.current)return;
   const box=el.getBoundingClientRect(),tracks:Track[]=[];
   for(const part of motion.parts){const s=bounds(source.current,part.color),t=bounds(target.current,part.color);if(!s||!t)continue;
    const sx=(s.left+s.right)/2-box.left,sy=(s.top+s.bottom)/2-box.top,tx=(t.left+t.right)/2-box.left,ty=(t.top+t.bottom)/2-box.top;
    const ax=part.sourceEdge?(part.sourceEdge==='left'?s.left-box.left-6:s.right-box.left+6):sx,ay=part.sourceEdge?sy:s.bottom-box.top+7;
    const bx=part.targetEdge?(part.targetEdge==='left'?t.left-box.left-9:t.right-box.left+9):tx,by=part.targetEdge?ty:t.top-box.top-10;
    const path=part.sourceEdge||part.targetEdge?`M${ax} ${ay} C${part.sourceEdge?ax+(part.sourceEdge==='left'?-28:28):ax} ${part.sourceEdge?ay:(ay+by)/2},${part.targetEdge?bx+(part.targetEdge==='left'?-28:28):bx} ${part.targetEdge?by:(ay+by)/2},${bx} ${by}`:`M${ax} ${ay} L${bx} ${by}`;
    tracks.push({...part,path,sx:(s.left+s.right)/2-box.left,sy:(s.top+s.bottom)/2-box.top,tx:(t.left+t.right)/2-box.left,ty:(t.top+t.bottom)/2-box.top,from:s.bottom-box.top+7,to:t.top-box.top-10,sh:s.bottom-s.top,th:t.bottom-t.top});
   }
   setLayout({width:box.width,height:box.height,tracks});
  };
  const observer=new ResizeObserver(()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);});observer.observe(el);
  void document.fonts.ready.then(measure);
  return()=>{cancelled=true;observer.disconnect();cancelAnimationFrame(frame);};
 },[motion]);
 useEffect(()=>{
  if(!layout)return;
  if(reduce||window.matchMedia('(prefers-reduced-motion: reduce)').matches){const frame=requestAnimationFrame(()=>setSettled(true));return()=>cancelAnimationFrame(frame);}
  const animations=[...root.current!.querySelectorAll<HTMLElement>('.formula-flight')].map((el,i)=>{
   const p=layout.tracks[i],height=el.querySelector('.katex-html')!.getBoundingClientRect().height;return el.animate([{transform:`translate(${p.sx}px,${p.sy}px) scale(${p.sh/height})`,opacity:1},{transform:`translate(${p.tx}px,${p.ty}px) scale(${p.th/height})`,opacity:1},{transform:`translate(${p.tx}px,${p.ty}px) scale(${p.th/height})`,opacity:0}],{duration:900,easing:'ease-in-out'});
  });
  if(motion.template){
   const result=root.current!.querySelector('.transfer-result')!,template=root.current!.querySelector('.transfer-template')!;
   animations.push(result.animate([{opacity:0,offset:0},{opacity:0,offset:.8},{opacity:1,offset:1}],{duration:900}),template.animate([{opacity:1,offset:0},{opacity:1,offset:.8},{opacity:0,offset:1}],{duration:900}));
  }
  let active=true;void Promise.all(animations.map(a=>a.finished)).then(()=>{if(active)setSettled(true);}).catch(()=>{});
  return()=>{active=false;animations.forEach(a=>a.cancel());};
 },[layout,reduce,motion.template]);
 return <div ref={root} className={`formula-transfer ${motion.template?"has-template":""} ${settled||reduce?"is-settled":""}`}>
  <div ref={source} className="transfer-source"><Formula tex={motion.source} display/></div>
  <div className="transfer-target"><div ref={target} className="transfer-result"><Formula tex={motion.target} display/></div>{motion.template&&<div className="transfer-template" aria-hidden="true"><Formula tex={motion.template} display/></div>}</div>
  {layout&&<><svg className="transfer-arrows" width={layout.width} height={layout.height} aria-hidden="true" focusable="false">
   {layout.tracks.map((p,i)=><g key={i}><defs><marker id={`${id}-${i}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke={p.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></marker></defs><path d={p.path} fill="none" stroke={p.color} strokeWidth="1.5" markerEnd={`url(#${id}-${i})`}/></g>)}
  </svg>{layout.tracks.map((p,i)=><div key={i} className="formula-flight" aria-hidden="true"><div><Formula tex={p.tex}/></div></div>)}</>}
 </div>;
}
