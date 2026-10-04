"use client";
import {useId,useState} from "react";
import {Formula,MathText} from "./MathText";
import {quadraticSign,midpointOnSegment,dotProjection,squareRiemann} from "../lib/relation-models";
const m=String.raw;
const num=(v:number)=>String(Number(v.toFixed(3)));
function Label({x,y,tex,width=90}:{x:number;y:number;tex:string;width?:number}){
 return <foreignObject x={x-width/2} y={y-19} width={width} height="82"><div className="relation-label"><Formula tex={tex}/></div></foreignObject>;
}
function FactorSigns(){
 const [x,setX]=useState(0),id=useId(),f=quadraticSign(x);
 const X=(t:number)=>64+(t+2)*68,Y=(t:number)=>207-t*31;
 const path=(a:number,b:number)=>Array.from({length:81},(_,i)=>{const t=a+(b-a)*i/80;return `${i?"L":"M"}${X(t)},${Y(quadraticSign(t).value)}`;}).join(" ");
 const sign=(v:number)=>v<0?"<0":v>0?">0":"";
 return <section className="panel relation-explorer" data-relation="signs">
  <h3>二つの因数の符号を比べる</h3>
  <Formula tex="y=(x+1)(x-2)" display/>
  <svg viewBox="0 0 480 325" role="img" aria-label="二つの零点の間では曲線が横軸の下にあり、外側では上にある">
   <path d={`M35,${Y(0)}H445 M${X(0)},30V298`} stroke="#8195a9" fill="none"/>
   {[[-2,-1],[-1,2],[2,3]].map(([a,b],i)=><path key={i} d={path(a,b)} fill="none" stroke={i===1?"#bb7020":"#087c70"} strokeWidth="3"/> )}
   <line x1={X(x)} x2={X(x)} y1={Y(0)} y2={Y(f.value)} stroke="#526d89" strokeDasharray="4 4"/>
   <circle cx={X(x)} cy={Y(f.value)} r="6" fill="#0b1f3a"/>
   {[-1,0,2].map(t=><Label key={t} x={X(t)} y={Y(0)-22} tex={String(t)} width={36}/>)}
   <Label x={446} y={Y(0)+22} tex="x" width={30}/><Label x={X(0)-22} y={28} tex="y" width={30}/>
  </svg>
  <label htmlFor={id}><MathText text={`$x=${num(x)}$`}/></label>
  <input id={id} className="relation-slider" aria-label="調べる横座標" type="range" min="-2" max="3" step=".1" value={x} onChange={e=>setX(Number(e.target.value))}/>
  <div className="relation-factors" aria-live="polite"><Formula tex={`x+1=${num(f.left)}${sign(f.left)}`}/><Formula tex={`x-2=${num(f.right)}${sign(f.right)}`}/></div>
  <p aria-live="polite">{f.value===0?"一方の因数が零なので、積も零です。":f.value<0?"符号が異なるので積は負。グラフは横軸より下です。":"符号が同じなので積は正。グラフは横軸より上です。"}</p>
  <p><MathText text={m`$-1<x<2$ では常に $x+1>0,\ x-2<0$。この範囲全体で積が負になります。`}/></p>
 </section>;
}
function MidpointLocus(){
 const [t,setT]=useState(1),[show,setShow]=useState(false),id=useId(),{p,q}=midpointOnSegment(t);
 const X=(v:number)=>240+68*v,Y=(v:number)=>209-68*v;
 return <section className="panel relation-explorer" data-relation="locus">
  <h3>動く点と、中点を区別する</h3>
  <Formula tex={m`Q=(t,2t)\quad\longrightarrow\quad P=\left(\dfrac t2,t\right)`} display/>
  <svg viewBox="0 0 480 415" role="img" aria-label="灰色の線分をQが動くと、原点との中点Pは長さが半分の線分上を動く">
   <path d="M95 209H392 M240 35V382" fill="none" stroke="#8195a9"/>
   <line x1={X(-1)} y1={Y(-2)} x2={X(1)} y2={Y(2)} stroke="#bbc7d1" strokeWidth="4"/>
   {[-1,1].map(v=><g key={v}><circle cx={X(v)} cy={Y(2*v)} r="4" fill="#8498a7"/><Label x={X(v)+v*54} y={Y(2*v)} tex={`(${v},${2*v})`} width={94}/></g>)}
   {show&&<g><line x1={X(-.5)} y1={Y(-1)} x2={X(.5)} y2={Y(1)} stroke="#087c70" strokeWidth="7"/>{[-1,1].map(v=><g key={v}><circle cx={X(v/2)} cy={Y(v)} r="5" fill="#087c70"/><Label x={X(v/2)-v*72} y={Y(v)-20} tex={m`\left(${v<0?"-":""}\dfrac12,${v}\right)`} width={124}/></g>)}</g>}
   <line x1={X(0)} y1={Y(0)} x2={X(q[0])} y2={Y(q[1])} stroke="#bb7020" strokeWidth="2"/>
   <circle cx={X(q[0])} cy={Y(q[1])} r="6" fill="#bb7020"/>{t!==0&&<Label x={X(q[0])+32} y={Y(q[1])+23} tex="Q" width={30}/>}
   <circle cx={X(p[0])} cy={Y(p[1])} r="6" fill="#087c70" stroke="white" strokeWidth="2"/>{t!==0&&<Label x={X(p[0])+32} y={Y(p[1])-22} tex="P" width={30}/>}
   {t===0?<Label x={X(0)+65} y={Y(0)-25} tex="P=Q=O" width={145}/>:<Label x={X(0)-20} y={Y(0)+24} tex="O" width={30}/>}<Label x={392} y={230} tex="x" width={30}/><Label x={263} y={35} tex="y" width={30}/>
  </svg>
  <label htmlFor={id}><MathText text={`$t=${num(t)}$`}/></label>
  <input id={id} className="relation-slider" aria-label="点Qの位置" type="range" min="-1" max="1" step=".05" value={t} onChange={e=>setT(Number(e.target.value))}/>
  <p><MathText text={m`$P$ はいつも $OQ$ の中点です。$Q$ の座標を、それぞれ半分にします。`}/></p>
  <button className="button secondary" aria-expanded={show} onClick={()=>setShow(!show)}>{show?"軌跡を隠す":"軌跡を見る"}</button>
  {show&&<div className="relation-conclusion"><Formula tex={m`y=2x,\quad-\dfrac12\leqq x\leqq\dfrac12`} display/><p>両端を含む線分です。</p><p><MathText text={m`逆に、この線分上の $P=(x,2x)$ を選ぶと、$Q=(2x,4x)$ は元の線分上にあります。したがって、どの点も中点として実現できます。`}/></p></div>}
 </section>;
}
function DotProjection(){
 const [angle,setAngle]=useState(60),{x,y}=dotProjection(angle),id=useId().replace(/:/g,"");
 const X=(v:number)=>240+48*v,Y=(v:number)=>258-48*v;
 const value=angle===60?"2":angle===90?"0":"-2",dot=angle===60?"6":angle===90?"0":"-6";
 const arc=Array.from({length:41},(_,i)=>{const a=angle*Math.PI/180*i/40;return `${i?"L":"M"}${X(.65*Math.cos(a))},${Y(.65*Math.sin(a))}`;}).join(" ");
 return <section className="panel relation-explorer" data-relation="projection">
  <h3>同じ向きの成分か、反対向きの成分か</h3>
  <p><MathText text={m`$|\vec a|=3,\ |\vec b|=4$ とします。$\vec b$ の先から、$\vec a$ を含む直線へ垂線を下ろします。`}/></p>
  <div className="graph-controls" role="group" aria-label="なす角">{[60,90,120].map(a=><button key={a} aria-pressed={angle===a} onClick={()=>setAngle(a)}><Formula tex={`${a}^\\circ`}/></button>)}</div>
  <svg viewBox="0 0 480 340" role="img" aria-label={`なす角${angle}度。垂線の足は原点の${angle===60?"右":angle===90?"位置":"左"}にある。`}>
   <defs>{[["a","#0b1f3a"],["b","#087c70"],["p","#bb7020"]].map(([key,color])=><marker key={key} id={id+key} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={color}/></marker>)}</defs>
   <line x1="60" x2="435" y1={Y(0)} y2={Y(0)} stroke="#b2c1cc"/>
   <line x1={X(0)} y1={Y(0)} x2={X(3)} y2={Y(0)} stroke="#0b1f3a" strokeWidth="3" markerEnd={`url(#${id}a)`}/>
   <line x1={X(0)} y1={Y(0)} x2={X(x)} y2={Y(y)} stroke="#087c70" strokeWidth="3" markerEnd={`url(#${id}b)`}/>
   <line x1={X(x)} y1={Y(y)} x2={X(x)} y2={Y(0)} stroke="#bb7020" strokeDasharray="4 4"/>
   {angle!==90&&<path d={`M${X(x)},${Y(0)-12}h${x>0?-12:12}v12`} fill="none" stroke="#bb7020"/>}
   {x!==0&&<line x1={X(0)} y1={Y(0)+10} x2={X(x)} y2={Y(0)+10} stroke="#bb7020" strokeWidth="4" markerEnd={`url(#${id}p)`}/>}
   <path d={arc} fill="none" stroke="#8195a9"/>
   <Label x={X(1.1)} y={Y(.7)} tex={`${angle}^\\circ`} width={74}/>
   <Label x={X(3)} y={Y(0)-26} tex="\vec a" width={55}/><Label x={X(x)-28} y={Y(y)-18} tex="\vec b" width={55}/>
   <Label x={X(0)} y={Y(0)+42} tex="O" width={30}/>
   {x!==0&&<Label x={X(x)} y={Y(0)+42} tex={value} width={40}/>}
  </svg>
  <div className="relation-conclusion" aria-live="polite">
   <Formula tex={m`|\vec b|\cos\theta=4\cos${angle}^\circ=${value}`} display/>
   <p>{angle===60?"垂線の足は右側。同じ向きなので、成分は正です。":angle===90?"垂線の足は始点に重なり、この方向の成分は零です。":"垂線の足は左側。反対向きなので、成分は負です。"}</p>
   <Formula tex={m`\vec a\cdot\vec b=3\times(${value})=${dot}`} display/>
  </div>
 </section>;
}
function RiemannSum(){
 const [n,setN]=useState(4),[side,setSide]=useState<"left"|"right">("right"),{lower,upper,width}=squareRiemann(n);
 const X=(x:number)=>55+350*x,Y=(y:number)=>295-230*y;
 const selected=Math.round(3*n/4),left=X((selected-1)/n),right=X(selected/n);
 const path=Array.from({length:101},(_,i)=>`${i?"L":"M"}${X(i/100)},${Y((i/100)**2)}`).join(" ");
 return <section className="panel relation-explorer" data-relation="riemann">
  <h3>幅と高さを掛けてから、足す</h3>
  <div className="graph-controls" role="group" aria-label="分割する個数">{[4,8,16,32].map(v=><button key={v} aria-pressed={n===v} onClick={()=>setN(v)}><MathText text={`$${v}$ 個`}/></button>)}</div>
  <div className="graph-controls" role="group" aria-label="高さを決める点">{(["left","right"]as const).map(v=><button key={v} aria-pressed={side===v} onClick={()=>setSide(v)}>{v==="left"?"左端の高さ":"右端の高さ"}</button>)}</div>
  <svg viewBox="0 0 480 435" role="img" aria-label={`増加する曲線y=xの二乗と${n}個の長方形。${side==="right"?"上":"下"}から面積を近似する。色の濃い長方形の左端は、kから1を引いた数をnで割った値。右端はkをnで割った値。`}>
   {Array.from({length:n},(_,k)=>{const height=((k+(side==="right"?1:0))/n)**2;return <rect key={k} x={X(k/n)} y={Y(height)} width={350/n} height={230*height} fill={k===selected-1?"#cb914d":side==="right"?"#e8d7bc":"#cee8e1"} stroke={k===selected-1?"#805016":side==="right"?"#aa702c":"#087c70"} strokeWidth={k===selected-1?2:1}/>;})}
   <path d="M35 295H439 M55 35V313" fill="none" stroke="#8195a9"/><path d={path} stroke="#0b1f3a" strokeWidth="3" fill="none"/>
   <Label x={45} y={327} tex="0" width={30}/><Label x={405} y={327} tex="1" width={30}/><Label x={445} y={315} tex="x" width={30}/><Label x={34} y={65} tex="1" width={30}/><Label x={35} y={25} tex="y" width={30}/><Label x={355} y={35} tex="y=x^2"/>
   <path d={`M${left},299V327L${left-40},352 M${right},299V327L${right+40},352`} fill="none" stroke="#805016" strokeWidth="1.5"/>
   <Label x={left-40} y={376} tex={m`\dfrac{k-1}{n}`} width={105}/><Label x={right+40} y={376} tex={m`\dfrac{k}{n}`} width={80}/>
  </svg>
  <p><MathText text={m`色の濃い長方形を、左から $k$ 番目（$1\leqq k\leqq n$）とします。`}/></p>
  <Formula tex={side==="right"?m`\text{幅 }\dfrac1n,\quad\text{高さ }\left(\dfrac kn\right)^2`:m`\text{幅 }\dfrac1n,\quad\text{高さ }\left(\dfrac{k-1}{n}\right)^2`} display/>
  <Formula tex={side==="right"?m`S_n=\sum_{k=1}^n\dfrac1n\left(\dfrac kn\right)^2`:m`T_n=\sum_{k=1}^n\dfrac1n\left(\dfrac{k-1}{n}\right)^2`} display/>
  <p aria-live="polite"><MathText text={`長方形の面積の和は約 $${(side==="right"?upper:lower).toFixed(4)}$。${side==="right"?"曲線より上まで含むので、求める面積より大きくなります。":"曲線まで届かない部分があるので、求める面積より小さくなります。"}`}/></p>
  <p><MathText text={m`左右どちらの端を使っても、分割を細かくすると、長方形の面積の和は $\displaystyle\int_0^1x^2\,dx=\dfrac13$ に近づきます。`}/></p>
  <span className="sr-only">長方形の幅 {width}</span>
 </section>;
}
export default function RelationExplorer({slug}:{slug:string}){
 if(slug==="m1-quadratic-inequality")return <FactorSigns/>;
 if(slug==="locus-equations")return <MidpointLocus/>;
 if(slug==="mc-vector-dot")return <DotProjection/>;
 if(slug==="m3-riemann-sums")return <RiemannSum/>;
 return null;
}
