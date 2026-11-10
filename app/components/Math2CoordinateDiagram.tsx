"use client";
import {useId,useSyncExternalStore} from 'react';
import {Formula,MathText} from './MathText';
import type {CoordinateDiagramProps} from './CoordinateDiagram';
const query='(max-width: 600px)';
const subscribe=(onChange:()=>void)=>{const media=window.matchMedia(query);media.addEventListener('change',onChange);return()=>media.removeEventListener('change',onChange);};
const teal='#176c82',ochre='#936114';
/** Geometry-only opt-in: labels stay readable without changing other subjects. */
export default function Math2CoordinateDiagram({title,description,xRange,yRange,curves=[],points=[],segments=[],circles=[],areas=[],arcs=[],tick=1,xTicks,axisDescription='横軸は $x$、縦軸は $y$。',compact=false,hideTickLabels=false}:CoordinateDiagramProps){
 const small=useSyncExternalStore(subscribe,()=>window.matchMedia(query).matches,()=>false);
 const id=useId().replaceAll(':',''),width=small?320:640,height=small?300:440,pad=small?34:40;
 const scale=Math.min((width-2*pad)/(xRange[1]-xRange[0]),(height-2*pad)/(yRange[1]-yRange[0]));
 const pw=(xRange[1]-xRange[0])*scale,ph=(yRange[1]-yRange[0])*scale,left=(width-pw)/2,top=(height-ph)/2;
 const X=(x:number)=>left+(x-xRange[0])*scale,Y=(y:number)=>top+(yRange[1]-y)*scale;
 const ticks=(r:[number,number])=>{const all=Array.from({length:Math.min(60,Math.max(0,Math.floor(r[1]/tick)-Math.ceil(r[0]/tick)+1))},(_,i)=>(Math.ceil(r[0]/tick)+i)*tick);const stride=small?Math.max(1,Math.ceil(all.length/5)):1;return all.filter((_,i)=>i%stride===0);};
 const label=(tex:string,x:number,y:number,key:string,color='#263c53',w=72)=>{const lx=Math.min(width-w/2-2,Math.max(w/2+2,x)),ly=Math.max(19,Math.min(height-20,y));return <foreignObject key={key} x={lx-w/2} y={ly-18} width={w} height="40"><div className="m2-coordinate-label" style={{fontSize:small?18:16,color,textAlign:'center'}}><Formula tex={tex}/></div></foreignObject>;};
 const curvePath=(f:(x:number)=>number,from:number,to:number)=>Array.from({length:201},(_,i)=>{const x=from+(to-from)*i/200;return `${i?'L':'M'}${X(x)},${Y(f(x))}`;}).join(' ');
 const cColor=(i:number)=>circles[i]?.color??(i===0?teal:ochre);
 const cName=(i:number)=>circles.length===1?'C':`C_{${i+1}}`;
 const pName=(i:number)=>{const p=points[i],center=circles.findIndex(c=>Math.abs(c.x-p.x)<1e-8&&Math.abs(c.y-p.y)<1e-8);if(center>=0)return cName(center);return p.label.match(/\$([A-Z])(?:\(|\$)/)?.[1]??(p.label.includes('垂足')?'H':`P_{${i+1}}`);};
 const inX=(v:number)=>v>=xRange[0]&&v<=xRange[1],inY=(v:number)=>v>=yRange[0]&&v<=yRange[1];
 return <figure className={`math-figure m2-coordinate-figure ${compact?'m2-compact':'panel'}`}>
  {!compact&&<><h3>{title}</h3><p><MathText text={description}/></p></>}
  <svg className="coordinate-diagram" style={{maxWidth:640,margin:'0 auto'}} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
   <title>{title}</title><desc>{description.replaceAll('$','')}</desc>
   <defs><clipPath id={id}><rect x={left} y={top} width={pw} height={ph}/></clipPath></defs>
   <g clipPath={`url(#${id})`}>
    {ticks(xRange).map(x=><line key={'gx'+x} x1={X(x)} x2={X(x)} y1={top} y2={top+ph} stroke="#edf1f4"/>)}
    {ticks(yRange).map(y=><line key={'gy'+y} x1={left} x2={left+pw} y1={Y(y)} y2={Y(y)} stroke="#edf1f4"/>)}
    {areas.map((a,i)=>{const xs=Array.from({length:201},(_,j)=>a.from+(a.to-a.from)*j/200);const poly=[...xs.map(x=>[X(x),Y(a.upper(x))]),...xs.reverse().map(x=>[X(x),Y(a.lower(x))])];return <polygon key={i} points={poly.map(p=>p.join(',')).join(' ')} fill="#00a88b" fillOpacity=".14"/>;})}
    {inY(0)&&<line x1={left} x2={left+pw} y1={Y(0)} y2={Y(0)} stroke="#8e9cae"/>}
    {inX(0)&&<line x1={X(0)} x2={X(0)} y1={top} y2={top+ph} stroke="#8e9cae"/>}
    {circles.map((c,i)=><circle key={i} cx={X(c.x)} cy={Y(c.y)} r={c.r*scale} fill="none" stroke={cColor(i)} strokeWidth="2.5" strokeDasharray={c.dashed?'5 4':undefined}/>)}
    {curves.map((c,i)=><path key={i} d={curvePath(c.value,Math.max(xRange[0],c.from??xRange[0]),Math.min(xRange[1],c.to??xRange[1]))} fill="none" stroke={c.color??teal} strokeWidth="2.5" strokeDasharray={c.dashed?'5 4':undefined}/>)}
    {arcs.map((a,i)=><path key={i} d={Array.from({length:161},(_,j)=>{const t=a.from+(a.to-a.from)*j/160;return `${j?'L':'M'}${X(a.x+a.r*Math.cos(t))},${Y(a.y+a.r*Math.sin(t))}`;}).join(' ')} fill="none" stroke={a.color??teal} strokeWidth={a.width??3}/>)}
    {segments.map((s,i)=><line key={i} x1={X(s.from[0])} x2={X(s.to[0])} y1={Y(s.from[1])} y2={Y(s.to[1])} stroke={s.color??'#42648b'} strokeWidth={s.width??2} strokeDasharray={s.dashed?'4 4':undefined}/>)}
    {points.map((p,i)=><circle key={i} cx={X(p.x)} cy={Y(p.y)} r={small?3.5:4.5} fill={p.open?'white':'#0b1f3a'} stroke={p.open?'#0b1f3a':'white'} strokeWidth="1.5"/>)}
    {circles.map((c,i)=>points.some(p=>p.x===c.x&&p.y===c.y)?null:<circle key={i} cx={X(c.x)} cy={Y(c.y)} r="3" fill={cColor(i)}/>)}
   </g>
   {!hideTickLabels&&(xTicks??ticks(xRange).filter(x=>x!==0).map(value=>({value,label:`$${Number(value.toFixed(2))}$`}))).map(t=>label(t.label.replaceAll('$',''),X(t.value),Math.min(height-19,Math.max(22,inY(0)?Y(0)+23:top+ph+23)),'tx'+t.value,'#58697c',44))}
   {!hideTickLabels&&ticks(yRange).filter(y=>y!==0).map(y=>label(String(Number(y.toFixed(2))),Math.max(22,inX(0)?X(0)-23:left-21),Y(y),'ty'+y,'#58697c',44))}
   {inY(0)&&label('x',width-14,Y(0)-20,'x','#58697c',24)}
   {inX(0)&&label('y',X(0)+21,top-14,'y','#58697c',24)}
   {points.map((p,i)=>{const close=points.some((q,j)=>j<i&&Math.hypot(X(p.x)-X(q.x),Y(p.y)-Y(q.y))<48),offset=p.labelOffset??[close?20:0,close?24:-24];return label(pName(i),X(p.x)+offset[0],Y(p.y)+offset[1],'p'+i,'#0b1f3a',50);})}
   {circles.map((c,i)=>points.some(p=>p.x===c.x&&p.y===c.y)?null:label(cName(i),X(c.x),Y(c.y)+24,'c'+i,cColor(i),58))}
   {segments.filter(s=>s.label).map((s,i)=>{const full=s.label!.match(/\$([^$]+)\$/)?.[1];if(!full)return null;const parts=full.split('='),tex=parts.length>2?`${parts[0]}=${parts.at(-1)}`:full;const vertical=Math.abs(s.from[0]-s.to[0])<1e-8,offset=s.labelOffset??[vertical?29:0,vertical?0:-22];return label(tex,(X(s.from[0])+X(s.to[0]))/2+offset[0],(Y(s.from[1])+Y(s.to[1]))/2+offset[1],'s'+i,s.color??'#42648b',small?112:170);})}
  </svg>
  <figcaption>
   {!compact&&<p className="meta"><MathText text={axisDescription}/></p>}
   {curves.map((c,i)=><p key={'l'+i}><span className="figure-key" style={{background:c.color??teal}}/><MathText text={c.label}/></p>)}
   {circles.map((c,i)=><p key={'c'+i} style={{color:cColor(i)}}><Formula tex={cName(i)}/><span>：</span><MathText text={c.label}/></p>)}
   {!compact&&(points.length>0||segments.some(s=>s.label))&&<details className="m2-figure-details"><summary>座標と長さを確かめる</summary>{points.map((p,i)=><p key={i}><Formula tex={pName(i)}/><span>：</span><MathText text={p.label}/></p>)}{segments.filter(s=>s.label).map((s,i)=><p key={'s'+i}><MathText text={s.label!}/></p>)}</details>}
  </figcaption>
 </figure>;
}
