"use client";
import {Formula,MathText} from './MathText';
import FormulaTransfer from './FormulaTransfer';
const m=String.raw;
const teal='#176c82',ochre='#936114';

export function LogInterval({stage=2}:{stage?:number}){
 const rows=[{label:m`1<x<5`,left:1,right:5,lo:false,ro:false,color:teal},...(stage>=1?[{label:m`x\le3`,left:0,right:3,lo:true,ro:true,color:ochre}]:[]),...(stage>=2?[{label:m`1<x\le3`,left:1,right:3,lo:false,ro:true,color:teal}]:[])];
 return <div className="m2-explog-interval" role="group" aria-label="真数条件と不等式を同じ目盛で重ねた数直線">
  {rows.map((row,i)=><div className="m2-explog-interval-row" key={row.label}><Formula tex={row.label}/><svg viewBox="0 0 280 70" role="img" aria-label={`${row.label}${i===2?' は二つの範囲の共通部分':''}`}>
   <line x1="12" y1="25" x2="268" y2="25" stroke="#a7b5bf" strokeWidth="1.5"/>
   {[1,3,5].map(n=><g key={n}><line x1={20+n*40} y1="20" x2={20+n*40} y2="30" stroke="#607382"/><foreignObject x={6+n*40} y="39" width="28" height="28"><div className="m2-explog-tick"><Formula tex={String(n)}/></div></foreignObject></g>)}
   <line x1={row.left===0?12:20+row.left*40} y1="25" x2={20+row.right*40} y2="25" stroke={row.color} strokeWidth="5"/>
   {row.left===0?<path d="M21 18 L12 25 L21 32" fill="none" stroke={row.color} strokeWidth="2"/>:<circle cx={20+row.left*40} cy="25" r="5" fill={row.lo?row.color:'#fff'} stroke={row.color} strokeWidth="2"/>}
   <circle cx={20+row.right*40} cy="25" r="5" fill={row.ro?row.color:'#fff'} stroke={row.color} strokeWidth="2"/>
  </svg></div>)}
 </div>;
}
function Shift({stage}:{stage:number}){
 const px=(x:number)=>60+45*x,py=(y:number)=>110-45*y;
 const curve=(dx:number)=>Array.from({length:121},(_,i)=>{const u=.25+(3.75-dx/2)*i/120;return `${i?'L':'M'}${px(u+dx)} ${py(-Math.log2(u))}`;}).join(' ');
 const label=(tex:string,x:number,y:number,width=64)=><foreignObject x={x} y={y} width={width} height="34"><div className="m2-explog-plot-label"><Formula tex={tex}/></div></foreignObject>;
 return <div className="m2-explog-shift">
  <div className="m2-explog-matching"><div><span>移動前</span><Formula tex="x=1" display/><Formula tex="(1,0)"/></div><div><span>移動後</span><Formula tex="x-2=1" display/><Formula tex="(3,0)"/></div></div>
  <svg viewBox="0 0 300 230" role="img" aria-label="真数1の点が(1,0)から(3,0)へ右に2移る。元のグラフは灰色、移動後は青緑色。">
   <line x1="15" y1="110" x2="285" y2="110" stroke="#91a2ad"/>
   <line x1="60" y1="15" x2="60" y2="205" stroke="#91a2ad"/>
   <path d={curve(0)} fill="none" stroke="#6d8192" strokeWidth="2" strokeDasharray="6 4"/>
   <path d={curve(2)} fill="none" stroke={teal} strokeWidth="2.5"/>
   {stage>=1&&<><line x1="150" y1="15" x2="150" y2="205" stroke={teal} strokeDasharray="5 4"/>{label('x=0',28,202)}{label('x=2',118,202)}</>}
   <line x1="105" y1="110" x2="195" y2="110" stroke={ochre} strokeWidth="3"/>
   <path d="M187 104 L195 110 L187 116" fill="none" stroke={ochre} strokeWidth="2"/>
   <circle cx="105" cy="110" r="4" fill="#6d8192"/><circle cx="195" cy="110" r="4" fill={teal}/>
   {label('(1,0)',73,124)}{label('(3,0)',170,124)}{label('+2',122,75)}{label('x',270,114,28)}{label('y',32,8,28)}
  </svg>
  <div className="m2-explog-plot-key"><span className="figure-key" style={{background:'#6d8192'}}/><MathText text={m`移動前：$y=\log_{\frac12}x$`}/></div>
  <div className="m2-explog-plot-key"><span className="figure-key" style={{background:teal}}/><MathText text={m`移動後：$y=\log_{\frac12}(x-2)$`}/></div>
 </div>;
}
function Digits({decimal}:{decimal:boolean}){
 const labels=decimal?['整数','第一位','第二位','第三位','第四位']:['百の位','十の位','一の位'];
 const values=decimal?['0.','0','0','0','1']:['1','0','0'];
 return <div className="m2-explog-digits" role="group" aria-label={decimal?'0.0001の1は小数第四位':'100は百の位から一の位まである三桁の最小値'}>
  <Formula tex={decimal?m`10^{-4}=0.0001`:m`10^2=100`} display/>
  <div className="m2-explog-places" style={{gridTemplateColumns:`repeat(${labels.length},minmax(0,1fr))`}}>{labels.map((label,i)=><div key={label} className={i===(decimal?4:0)?'m2-explog-active':''}><span>{label}</span><Formula tex={values[i]}/></div>)}</div>
  <Formula tex={decimal?m`0.0001\le q<0.001`:m`100\le N<1000`} display/>
 </div>;
}
export function LogPowerMatch(){
 return <div className="m2-explog-structure" role="group" aria-label="係数2が真数6全体の指数2に対応する">
  <FormulaTransfer motion={{source:m`{\color{#936114}{2}}\log_3 6`,target:m`=\log_3(6^{\color{#936114}{2}})`,parts:[{tex:"2",color:ochre}]}} reduce={false}/>
  <p><MathText text={m`係数 $2$ は、真数 $6$ 全体を二乗する指数になります。`}/></p>
 </div>;
}
export function LogFactorCancellation(){
 return <div className="m2-explog-structure" role="group" aria-label="分子と分母のlog2の3全体を共通因子として約分する">
  <Formula tex={m`\frac{\cancel{\color{#176c82}{\log_2 3}}\,\log_2 4}{\cancel{\color{#176c82}{\log_2 3}}}`} display/>
  <Formula tex={m`=\log_2 4=2`} display/>
  <p><MathText text={m`$\log_2 3\ne0$ なので、同じ因子で分子と分母を割れます。`}/></p>
 </div>;
}
export default function Math2ExplogDiagram({kind,stage}:{kind:string;stage:number;reduce:boolean}){
 let content;
 switch(kind){
  case 'm2-explog-product':content=<><Formula tex={m`\underbrace{a\cdot a}_{a^2}\;\underbrace{a\cdot a\cdot a}_{a^3}`} display/><Formula tex={m`a^2a^3=a^{2+3}=a^5`} display/></>;break;
  case 'm2-explog-power':content=<><Formula tex={m`\underbrace{(a\cdot a)(a\cdot a)(a\cdot a)}_{a^2\text{ を三つ}}`} display/><Formula tex={m`(a^2)^3=a^{2+2+2}=a^6`} display/></>;break;
  case 'm2-explog-substitution':content=<><Formula tex={m`\begin{aligned}(\underbrace{2^x}_{t})^2-3(\underbrace{2^x}_{t})+2&=0\\t^2-3t+2&=0\end{aligned}`} display/><Formula tex="t>0"/></>;break;
  case 'm2-explog-interval':content=<LogInterval stage={stage}/>;break;
  case 'm2-explog-shift':content=<Shift stage={stage}/>;break;
  case 'm2-explog-digits':content=<Digits decimal={stage===1}/>;break;
  default:return null;
 }
 return <div className="m2-explog-structure" data-explog-structure={kind} data-stage={stage}>{content}</div>;
}
