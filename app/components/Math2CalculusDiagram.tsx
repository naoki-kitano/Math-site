"use client";
import {useEffect,useState} from 'react';
import {Formula} from './MathText';
const m=String.raw,teal='#176c82',ochre='#936114',navy='#0b1f3a',faint='#c9d5de';
type Props={kind:string;stage:number;reduce:boolean};
type Plot={x:(n:number)=>number;y:(n:number)=>number;path:(f:(n:number)=>number,a:number,b:number)=>string};
function plot(x0:number,x1:number,y0:number,y1:number):Plot{
 const x=(n:number)=>38+(n-x0)/(x1-x0)*204,y=(n:number)=>184-(n-y0)/(y1-y0)*154;
 return {x,y,path:(f,a,b)=>Array.from({length:61},(_,i)=>{const v=a+(b-a)*i/60;return `${i?'L':'M'}${x(v).toFixed(3)} ${y(f(v)).toFixed(3)}`;}).join(' ')};
}
function Label({x,y,tex,width=70}:{x:number;y:number;tex:string;width?:number}){
 return <foreignObject x={x-width/2} y={y-19} width={width} height="45" aria-hidden="true"><div className="geometry-math"><Formula tex={tex}/></div></foreignObject>;
}
function Axes({p,xTicks,yTicks}:{p:Plot;xTicks:number[];yTicks:number[]}){
 return <g><path d={`M30 ${p.y(0)}H250 M${p.x(0)} 22V191`} fill="none" stroke="#7e91a3"/>
  {xTicks.map(v=><g key={v}><path d={`M${p.x(v)} ${p.y(0)-3}v6`} stroke="#7e91a3"/><Label x={p.x(v)} y={p.y(0)+20} tex={String(v)} width={36}/></g>)}
  {yTicks.filter(v=>v!==0).map(v=><g key={v}><path d={`M${p.x(0)-3} ${p.y(v)}h6`} stroke="#7e91a3"/><Label x={p.x(0)-19} y={p.y(v)} tex={String(v)} width={35}/></g>)}
  <Label x={261} y={p.y(0)} tex="x" width={30}/><Label x={p.x(0)} y={20} tex="y" width={30}/>
 </g>;
}
function Svg({label,children}:{label:string;children:React.ReactNode}){
 return <svg className="geometry-structure" viewBox="0 0 280 230" role="img" aria-label={label}>{children}</svg>;
}
function Average(){
 const p=plot(0,4,0,10);
 return <><Svg label="二点(1,1)と(3,9)。横の変化2を黄土色、縦の変化8を青緑で示す。軸の目盛を使って縦横を読む。">
  <Axes p={p} xTicks={[1,3]} yTicks={[1,9]}/>
  <path d={p.path(x=>x*x,0,Math.sqrt(10))} fill="none" stroke={faint} strokeWidth="2"/>
  <path d={p.path(x=>4*x-3,.75,3.25)} fill="none" stroke={navy} strokeWidth="2"/>
  <path d={`M${p.x(1)} ${p.y(1)}H${p.x(3)}`} stroke={ochre} strokeWidth="3"/>
  <path d={`M${p.x(3)} ${p.y(1)}V${p.y(9)}`} stroke={teal} strokeWidth="3"/>
  <Label x={p.x(2)} y={p.y(1)-18} tex={m`\color{#936114}{2}`} width={40}/>
  <Label x={p.x(3)+23} y={p.y(5)} tex={m`\color{#176c82}{8}`} width={40}/>
  {[1,3].map(x=><circle key={x} cx={p.x(x)} cy={p.y(x*x)} r="4" fill={navy}/>)}
 </Svg><Formula tex={m`\dfrac{\color{#176c82}{\text{縦の変化 }8}}{\color{#936114}{\text{横の変化 }2}}=4`} display/></>;
}
function Secant({stage,reduce}:Omit<Props,'kind'>){
 const [h,setH]=useState(stage===2?-1:1);
 useEffect(()=>{
  const start=stage===2?-1:1,end=stage===2?-.25:stage===1?.25:1;
  if(reduce||window.matchMedia('(prefers-reduced-motion: reduce)').matches){const f=requestAnimationFrame(()=>setH(end));return()=>cancelAnimationFrame(f);}
  let frame=0,begin:number|undefined;
  const tick=(time:number)=>{begin??=time;const progress=Math.min(1,(time-begin)/1400);setH(start+(end-start)*progress);if(progress<1)frame=requestAnimationFrame(tick);};
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[stage,reduce]);
 const p=plot(0,3.2,-.5,10),tangent=stage===3,slope=tangent?4:4+h;
 const a=Math.max(.6,(0-4)/slope+2),b=Math.min(3.2,(10-4)/slope+2);
 return <><Svg label={tangent?'極限の接線。点(2,4)での傾き4。':'固定点(2,4)と、幅hだけ離れた放物線上の点を結ぶ割線。幅hと傾き4+hが連動する。'}>
  <Axes p={p} xTicks={[1,2,3]} yTicks={[4,9]}/>
  <path d={p.path(x=>x*x,.6,Math.sqrt(10))} stroke={faint} strokeWidth="2" fill="none"/>
  <path d={p.path(x=>4*x-4,1,3.2)} stroke={navy} strokeDasharray={tangent?undefined:'4 4'} strokeWidth={tangent?3:1.5} fill="none"/>
  {!tangent&&<><path d={p.path(x=>4+slope*(x-2),a,b)} stroke={teal} strokeWidth="2.5" fill="none"/><circle cx={p.x(2+h)} cy={p.y((2+h)**2)} r="4" fill={teal}/><path d={`M${p.x(2)} ${p.y(4)}H${p.x(2+h)}`} stroke={ochre} strokeWidth="3"/></>}
  <circle cx={p.x(2)} cy={p.y(4)} r="4" fill={navy}/><Label x={p.x(2)-23} y={p.y(4)-18} tex="(2,4)" width={76}/>
 </Svg><Formula tex={tangent?m`f'(2)=4`:m`h\simeq${h.toFixed(2)},\quad 4+h\simeq${slope.toFixed(2)}`} display/></>;
}
function Signs({stage}:{stage:number}){
 const p=plot(-2,2,-2,4),intervals=[[-2,-1],[-1,1],[1,2]],active=intervals[stage]??intervals[0],signs=stage===0?['-','-']:stage===1?['+','-']:['+','+'];
 const increase=stage===1;
 return <><Formula tex={m`\begin{array}{c|c}x&${stage===0?'x<-1':stage===1?'-1<x<1':'x>1'}\\\hline -3&-\\ x+1&${signs[0]}\\ x-1&${signs[1]}\\\hline f'(x)&${increase?'+':'-'}\\ f(x)&${increase?m`\nearrow`:m`\searrow`}\end{array}`} display/>
  <Svg label={increase?'中央の区間で導関数は正、曲線は増加。':'選んだ外側の区間で導関数は負、曲線は減少。'}><Axes p={p} xTicks={[-1,1]} yTicks={[-1,3]}/>
   <path d={p.path(x=>-x*x*x+3*x+1,-2,2)} stroke={faint} fill="none" strokeWidth="2"/>
   <path d={p.path(x=>-x*x*x+3*x+1,active[0],active[1])} stroke={teal} fill="none" strokeWidth="3"/>
   {[-1,1].map(x=><circle key={x} cx={p.x(x)} cy={p.y(-x*x*x+3*x+1)} r="3" fill={navy}/>)}
  </Svg></>;
}
function Extrema({stage}:{stage:number}){
 const p=plot(-2.1,2.1,-3,3),a=stage===0?-1:1,v=a*a*a-3*a;
 return <><Formula tex={stage===2?m`\begin{array}{c|ccccc}x&\cdots&-1&\cdots&1&\cdots\\\hline f'(x)&+&0&-&0&+\\ f(x)&\nearrow&2&\searrow&-2&\nearrow\end{array}`:m`\begin{array}{c|ccc}x&\cdots&${a}&\cdots\\\hline f'(x)&${a===-1?'+':'-'}&0&${a===-1?'-':'+'}\\ f(x)&${a===-1?m`\nearrow`:m`\searrow`}&${v}&${a===-1?m`\searrow`:m`\nearrow`}\end{array}`} display/>
  <Svg label={stage===2?'増加、減少、増加を、曲線の三つの区間に対応させる。':`横座標${a}、縦座標${v}を点(${a},${v})へ対応させる。`}>
   <Axes p={p} xTicks={[-1,1]} yTicks={[-2,2]}/>
   <path d={p.path(x=>x*x*x-3*x,-2.1,2.1)} stroke={teal} strokeWidth="2.5" fill="none"/>
   {stage<2?<><path d={`M${p.x(a)} ${p.y(0)}V${p.y(v)}H${p.x(0)}`} stroke={ochre} strokeDasharray="4 3" fill="none"/><circle cx={p.x(a)} cy={p.y(v)} r="4" fill={ochre}/><Label x={p.x(a)+(a<0?-3:10)} y={p.y(v)+(a<0?-20:23)} tex={`(${a},${v})`} width={82}/></>:<>{[-1,1].map(x=><circle key={x} cx={p.x(x)} cy={p.y(x*x*x-3*x)} r="4" fill={navy}/>)}<path d={p.path(x=>x*x*x-3*x,-1,1)} stroke={ochre} strokeWidth="3" fill="none"/></>}
  </Svg></>;
}
function Interval({stage}:{stage:number}){
 return <svg className="geometry-structure" viewBox="0 0 280 155" role="img" aria-label="区間0から2。候補負の1は区間外、1は内部。両端0と2も比較する。">
  <path d="M25 70H255" stroke={faint} strokeWidth="2"/><path d="M105 70H245" stroke={teal} strokeWidth="5"/>
  {[-1,0,1,2].map((v,i)=><g key={v}><circle cx={35+i*70} cy="70" r={v===1||stage>0&&v>=0?5:3} fill={v<0?faint:v===1?ochre:teal}/><Label x={35+i*70} y={95} tex={String(v)} width={38}/></g>)}
  <text x="35" y="42" textAnchor="middle" className="geometry-text">区間外</text>
  <text x="175" y="42" textAnchor="middle" className="geometry-text">内部</text>
  {stage>0&&<><text x="105" y="133" textAnchor="middle" className="geometry-text">端点</text><text x="245" y="133" textAnchor="middle" className="geometry-text">端点</text></>}
 </svg>;
}
function Additivity({stage}:{stage:number}){
 return <svg className="geometry-structure" viewBox="0 0 280 165" role="img" aria-label="0から1と1から3の区間をつなぐと0から3。共通の端は1。">
  <path d="M35 55H105" stroke={teal} strokeWidth="4"/><path d="M105 55H245" stroke={ochre} strokeWidth="4"/>
  {[35,105,245].map((v,i)=><g key={v}><path d={`M${v} 49v12`} stroke={navy}/><Label x={v} y={79} tex={String([0,1,3][i])} width={35}/></g>)}
  <Label x={70} y={27} tex={m`\color{#176c82}{\int_0^1 f(x)\,dx}`} width={120}/><Label x={175} y={27} tex={m`\color{#936114}{\int_1^3 f(x)\,dx}`} width={150}/>
  {stage>0&&<><path d="M35 104v7H245v-7" fill="none" stroke={navy}/><Label x={140} y={140} tex={m`\int_0^3 f(x)\,dx`} width={175}/></>}
 </svg>;
}
function Area({stage,height=false}:{stage:number;height?:boolean}){
 const p=plot(-1.3,1.3,-1.2,1.2);
 const tri=(values:[number,number][])=>values.map(([x,y])=>`${p.x(x)},${p.y(y)}`).join(' ');
 return <Svg label={height?'左の区間では上が軸の0、下がx。縦の高さは0からxを引く。':stage===0?'左の三角形は負の二分の一、右は正の二分の一として数える。':'同じ左右の三角形を、面積ではどちらも正の二分の一として数える。'}>
  <polygon points={tri([[-1,-1],[-1,0],[0,0]])} fill={ochre} opacity=".15"/><polygon points={tri([[0,0],[1,0],[1,1]])} fill={teal} opacity=".15"/>
  <Axes p={p} xTicks={[-1,1]} yTicks={[-1,1]}/><path d={p.path(x=>x,-1.2,1.2)} stroke={navy} fill="none" strokeWidth="2"/>
  {height?<><path d={`M${p.x(-.65)} ${p.y(-.65)}V${p.y(0)}`} stroke={teal} strokeWidth="4"/><Label x={p.x(-.65)-10} y={p.y(0)-19} tex="0" width={40}/><Label x={p.x(-.65)} y={p.y(-.65)+22} tex="x" width={40}/><Label x={205} y={195} tex="0-x=-x" width={130}/></>:<><Label x={63} y={140} tex={m`\color{#936114}{${stage===0?'-':''}\dfrac12}`} width={65}/><Label x={212} y={68} tex={m`\color{#176c82}{\dfrac12}`} width={65}/></>}
 </Svg>;
}
function Between({stage}:{stage:number}){
 const p=plot(-.2,2.2,-.3,4.3),q=stage===0?.55:1.55,upper=stage===0?q:q*q,lower=stage===0?q*q:q;
 const from=stage===0?0:1,to=stage===0?1:2;
 const upperPath=p.path(x=>stage===0?x:x*x,from,to),lowerPath=p.path(x=>stage===0?x*x:x,to,from).replace(/^M/,'L');
 return <><Svg label={stage===0?'0から1の区間。上が直線x、下が放物線xの二乗。縦の長さはx引くxの二乗。':'1から2の区間。上が放物線xの二乗、下が直線x。縦の長さはxの二乗引くx。'}>
  <path d={upperPath+' '+lowerPath+' Z'} fill={teal} opacity=".12"/><Axes p={p} xTicks={[1,2]} yTicks={[1,4]}/>
  <path d={p.path(x=>x,0,2)} fill="none" stroke={teal} strokeWidth="2.5"/>
  <path d={p.path(x=>x*x,0,2)} fill="none" stroke={ochre} strokeWidth="2.5"/>
  <path d={`M${p.x(q)} ${p.y(lower)}V${p.y(upper)}`} stroke={navy} strokeWidth="3"/>
  <circle cx={p.x(q)} cy={p.y(upper)} r="3.5" fill={stage===0?teal:ochre}/><circle cx={p.x(q)} cy={p.y(lower)} r="3.5" fill={stage===0?ochre:teal}/>
  <circle cx={p.x(1)} cy={p.y(1)} r="3" fill={navy}/>
 </Svg><Formula tex={m`\underbrace{\color{${stage===0?teal:ochre}}{${stage===0?'x':'x^2'}}}_{\text{上}}-\underbrace{\color{${stage===0?ochre:teal}}{${stage===0?'x^2':'x'}}}_{\text{下}}`} display/></>;
}
export default function Math2CalculusDiagram({kind,stage,reduce}:Props){
 return <div className="math2-calculus-diagram" data-calculus-diagram={kind} data-stage={stage}>
  {kind==='m2-calculus-average'?<Average/>:kind==='m2-calculus-secant'?<Secant stage={stage} reduce={reduce}/>:kind==='m2-calculus-signs'?<Signs stage={stage}/>:kind==='m2-calculus-extrema'?<Extrema stage={stage}/>:kind==='m2-calculus-interval'?<Interval stage={stage}/>:kind==='m2-calculus-additivity'?<Additivity stage={stage}/>:kind==='m2-calculus-signed-area'?<Area stage={stage}/>:kind==='m2-calculus-height-axis'?<Area stage={stage} height/>:kind==='m2-calculus-height-between'?<Between stage={stage}/>:null}
 </div>;
}
