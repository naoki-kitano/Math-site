"use client";
import {useState} from 'react';
import {Formula,MathText} from './MathText';
import {squareRiemann} from '../lib/relation-models';
const m=String.raw,teal='#176c82',ochre='#936114';
function Label({x,y,tex,width=70}:{x:number;y:number;tex:string;width?:number}){
 return <foreignObject x={x-width/2} y={y-19} width={width} height={50}><div className="structure-math-label"><Formula tex={tex}/></div></foreignObject>;
}
const X=(x:number)=>40+235*x,Y=(y:number)=>230-180*y,round=(x:number)=>Number(x.toFixed(3));
export default function Math3RiemannStructure({stage,reduce}:{stage:number;reduce:boolean}){
 const [n,setN]=useState(4),[side,setSide]=useState<'left'|'right'>('right');
 const count=stage<3?4:n,edge=stage<3?'right':side;
 const k=Math.round(3*count/4),sample=(k-(edge==='left'?1:0))/count,height=sample**2;
 const sum=squareRiemann(count)[edge==='right'?'upper':'lower'];
 const path=Array.from({length:81},(_,i)=>`${i?'L':'M'}${round(X(i/80))},${round(Y((i/80)**2))}`).join(' ');
 return <div className={`structure-riemann ${reduce?'reduce-motion':''}`}>
  <svg viewBox="0 0 360 300" role="img" aria-label={`y=xの二乗。0から1を${count}等分し、${edge==='right'?'右':'左'}端の高さで長方形を作る。黄土色は幅、青緑は高さ。`}>
   {Array.from({length:count},(_,i)=>{
    const h=((i+(edge==='right'?1:0))/count)**2;
    return <rect key={i} x={X(i/count)} y={Y(h)} width={235/count} height={180*h} fill={i===k-1?'#dfedf1':'#eef3f5'} stroke="#aebdc5" opacity={stage>=2||i===k-1?1:0} className="riemann-piece"/>;
   })}
   <path d="M25 230H291 M40 242V32" fill="none" stroke="#8195a9"/>
   <path d={path} fill="none" stroke="#0b1f3a" strokeWidth="2.5"/>
   <Label x={22} y={250} tex="0" width={30}/><Label x={275} y={250} tex="1" width={30}/><Label x={304} y={246} tex="x" width={28}/><Label x={23} y={26} tex="y" width={28}/><Label x={229} y={27} tex="y=x^2" width={110}/>
   {stage<3&&<>
    <path d={`M${X((k-1)/count)} 237V267H${X(k/count)}V237`} fill="none" stroke={ochre} strokeWidth="2"/>
    <Label x={(X(k/count)+X((k-1)/count))/2} y={286} tex={m`\color{#936114}{\Delta x}`} width={70}/>
    {stage>=1&&<><path d={`M${X(k/count)+4} ${Y(height)}H300`} fill="none" stroke={teal} strokeWidth="1" strokeDasharray="3 4"/>
     <path d={`M305 ${Y(height)}H315 M310 ${Y(height)}V230 M305 230H315`} fill="none" stroke={teal} strokeWidth="2"/>
     <Label x={317} y={(Y(height)+230)/2} tex={m`\color{#176c82}{f(x_k)}`} width={82}/></>}
   </>}
  </svg>
  {stage===3&&<>
   <p aria-live="polite"><MathText text={m`${edge==='right'?'右端':'左端'}の高さで作った $${count}$ 個の和は約 $${sum.toFixed(4)}$。`}/></p>
   <details className="structure-options"><summary>分割数と高さの取り方を変える</summary>
    <div className="graph-controls" role="group" aria-label="分割する個数">{[4,8,16,32].map(value=><button key={value} aria-pressed={n===value} onClick={()=>setN(value)}><MathText text={`$${value}$ 個`}/></button>)}</div>
    <div className="graph-controls" role="group" aria-label="高さを決める点">{(['left','right']as const).map(value=><button key={value} aria-pressed={side===value} onClick={()=>setSide(value)}>{value==='left'?'左端の高さ':'右端の高さ'}</button>)}</div>
   </details>
  </>}
 </div>;
}
