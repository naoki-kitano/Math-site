import {Formula} from './MathText';
const m=String.raw;
const teal='#176c82',ochre='#936114',ink='#172d46',muted='#9baaba';
const stable=(n:number)=>Number(n.toFixed(4));
function Label({x,y,tex,width=74}:{x:number;y:number;tex:string;width?:number}){
 return <foreignObject x={x-width/2} y={y-15} width={width} height={38}><div style={{fontSize:19,lineHeight:1.2,textAlign:'center',color:ink}}><Formula tex={tex}/></div></foreignObject>;
}
export type TrigPlotProps={xMin:number;xMax:number;yMin:number;yMax:number;curves:{value:(x:number)=>number;from?:number;to?:number;color?:string;width?:number}[];ticks:{x:number;tex:string}[];points?:{x:number;y:number;open?:boolean;color?:string}[];asymptotes?:number[];level?:number;connectors?:{from:[number,number];to:[number,number]}[];yTicks?:{y:number;tex:string}[];xLabel?:string;secondAxis?:{label:string;values:string[]};description:string};
/** Curves stop at poles; open dots denote finite values only. */
export function TrigPlot({xMin,xMax,yMin,yMax,curves,ticks,points=[],asymptotes=[],level,connectors=[],yTicks,xLabel='x',secondAxis,description}:TrigPlotProps){
 const X=(x:number)=>stable(43+286*(x-xMin)/(xMax-xMin)),Y=(y:number)=>stable(18+170*(yMax-y)/(yMax-yMin));
 const path=(f:TrigPlotProps['curves'][number])=>{
  let d='',started=false;const a=f.from??xMin,b=f.to??xMax;
  for(let i=0;i<=280;i++){const x=a+(b-a)*i/280,y=f.value(x);if(!Number.isFinite(y)||y<yMin||y>yMax){started=false;continue;}d+=`${started?'L':'M'}${X(x)} ${Y(y)} `;started=true;}
  return d;
 };
 return <svg viewBox={`0 0 360 ${secondAxis?285:240}`} role="img" aria-label={description} style={{display:'block',width:'100%',maxWidth:600,margin:'12px auto'}}>
  <path d={`M43 ${Y(0)}H329 M${X(0)} 18V188`} fill="none" stroke={muted}/>
  {(yTicks??[-2,-1,1,2].filter(y=>y>=yMin&&y<=yMax).map(y=>({y,tex:String(y)}))).map(({y,tex})=><g key={y}><path d={`M39 ${Y(y)}H329`} stroke="#e2e9ed"/><Label x={24} y={Y(y)} tex={tex} width={43}/></g>)}
  {asymptotes.map(x=><path key={x} d={`M${X(x)} 18V188`} stroke={ochre} strokeDasharray="5 4"/>)}
  {level!==undefined&&<path d={`M43 ${Y(level)}H329`} stroke={ochre} strokeDasharray="4 4"/>}
  {connectors.map((c,i)=><path key={i} d={`M${X(c.from[0])} ${Y(c.from[1])}L${X(c.to[0])} ${Y(c.to[1])}`} stroke={teal} strokeDasharray="4 3" strokeWidth="2"/>)}
  {curves.map((c,i)=><path key={i} d={path(c)} fill="none" stroke={c.color??teal} strokeWidth={c.width??2.5}/>)}
  {points.map((p,i)=><circle key={i} cx={X(p.x)} cy={Y(p.y)} r="4" fill={p.open?'white':p.color??teal} stroke={p.color??teal} strokeWidth="2"/>)}
  <path d="M43 188H329" stroke={muted}/>
  {ticks.map(t=><g key={t.x}><path d={`M${X(t.x)} 188v5`} stroke={muted}/><Label x={X(t.x)} y={213} tex={t.tex} width={57}/></g>)}
  <Label x={20} y={213} tex={xLabel} width={30}/><Label x={22} y={16} tex="y" width={30}/>
  {secondAxis&&<><path d="M43 242H329" stroke={muted}/><Label x={20} y={264} tex={secondAxis.label} width={30}/>{ticks.map((t,i)=><g key={t.x}><path d={`M${X(t.x)} 238v8`} stroke={muted}/><Label x={X(t.x)} y={264} tex={secondAxis.values[i]} width={57}/></g>)}</>}
 </svg>;
}
function RangePair({top,bottom,values,topOpen=[false,true],bottomOpen=topOpen,showPoints=true}:{top:string;bottom:string;values:{top:string;bottom:string}[];topOpen?:boolean[];bottomOpen?:boolean[];showPoints?:boolean}){
 const X=(i:number)=>58+268*i/(values.length-1);
 return <svg viewBox="0 0 360 190" role="img" aria-label={`${top}と${bottom}の角の範囲と、対応する点。端の白丸は含まない角。`} style={{display:'block',width:'100%',maxWidth:600,margin:'12px auto'}}>
  <Label x={20} y={42} tex={top} width={35}/><Label x={20} y={139} tex={bottom} width={35}/>
  <path d="M58 35H326 M58 132H326" stroke={muted} strokeWidth="2"/>
  {values.map((v,i)=>{const end=i===0||i===values.length-1;if(!end&&!showPoints)return null;return <g key={i}>
   <path d={`M${X(i)} 54V111`} stroke="#c8d6df" strokeDasharray="3 4"/>
   <circle cx={X(i)} cy="35" r="4" stroke={teal} strokeWidth="2" fill={end&&topOpen[i===0?0:1]?'white':teal}/>
   <circle cx={X(i)} cy="132" r="4" stroke={teal} strokeWidth="2" fill={end&&bottomOpen[i===0?0:1]?'white':teal}/>
   <Label x={X(i)} y={15} tex={v.top} width={58}/><Label x={X(i)} y={163} tex={v.bottom} width={58}/>
  </g>;})}
 </svg>;
}
export function TrigTangentRegion({inclusive=true,negative=true,threshold=negative?-1:1,thresholdTex=negative?'-1':'1',limit=2*Math.PI}:{inclusive?:boolean;negative?:boolean;threshold?:number;thresholdTex?:string;limit?:number}){
 const pi=Math.PI,poles=[pi/2,3*pi/2].filter(x=>x<limit);
 const crossing=Math.atan(threshold)+(negative?pi:0),bounds=[crossing,crossing+pi].filter(x=>x>=0&&x<limit);
 const starts=negative?poles:bounds,ends=negative?[crossing,crossing+pi]:[pi/2,3*pi/2];
 const split=[0,...poles,limit];
 const ticks=limit===pi?[{x:0,tex:'0'},{x:pi/4,tex:m`\frac\pi4`},{x:pi/2,tex:m`\frac\pi2`},{x:3*pi/4,tex:m`\frac{3\pi}4`},{x:pi,tex:m`\pi`}]:[{x:0,tex:'0'},{x:pi/2,tex:m`\frac\pi2`},{x:pi,tex:m`\pi`},{x:3*pi/2,tex:m`\frac{3\pi}2`},{x:2*pi,tex:m`2\pi`}];
 return <div>
  <TrigPlot xMin={0} xMax={limit} yMin={-3} yMax={3} xLabel={m`\theta`} description="正接の枝と境界の水平線。条件を満たす部分を青緑で示し、漸近線上には有限の点を置いていない。"
   ticks={ticks} asymptotes={poles} level={threshold}
   curves={[...split.slice(0,-1).map((a,i)=>({value:Math.tan,from:a+(i?0.0001:0),to:split[i+1]-.0001,color:muted})),...starts.map((a,i)=>({value:Math.tan,from:a+.0001,to:Math.min(ends[i],limit)-.0001,color:teal,width:4}))]}
   points={bounds.map(x=>({x,y:threshold,open:!inclusive}))}/>
  <Formula tex={m`\tan\theta${negative?(inclusive?m`\le`:'<'):(inclusive?m`\ge`:'>')}${thresholdTex}`} display/>
 </div>;
}
function WrapCircle({stage}:{stage:number}){
 const p=Math.PI,X=(t:number)=>180+88*Math.cos(t),Y=(t:number)=>112-88*Math.sin(t);
 const arc=(a:number,b:number)=>Array.from({length:81},(_,i)=>{const t=a+(b-a)*i/80;return `${i?'L':'M'}${stable(X(t))} ${stable(Y(t))}`;}).join(' ');
 return <svg viewBox="0 0 360 330" role="img" aria-label="余弦が二分の一より大きい右側の弧と、ゼロから二πまでの角の数直線。ゼロは含み、二πは含まない。" style={{display:'block',width:'100%',maxWidth:500,margin:'12px auto'}}>
  <circle cx="180" cy="112" r="88" stroke={muted} fill="none"/><path d="M75 112H288 M180 12V214" stroke={muted}/>
  <path d="M224 20V205" stroke={ochre} strokeDasharray="4 4"/>
  {stage>0&&<path d={arc(-p/3,p/3)} fill="none" stroke={teal} strokeWidth="5"/>}
  {[p/3,5*p/3].map(t=><circle key={t} cx={stable(X(t))} cy={stable(Y(t))} r="4" fill="white" stroke={teal} strokeWidth="2"/>)}
  <Label x={249} y={27} tex={m`\frac\pi3`}/><Label x={251} y={200} tex={m`\frac{5\pi}3`}/><Label x={303} y={113} tex="0" width={30}/><Label x={208} y={227} tex={m`x=\frac12`} width={110}/>
  {stage>0&&<><path d="M43 270H326" stroke={muted}/><path d="M43 270H90.167 M278.833 270H326" stroke={teal} strokeWidth="5"/>
   {[{x:43,t:'0',open:false},{x:90.167,t:m`\frac\pi3`,open:true},{x:278.833,t:m`\frac{5\pi}3`,open:true},{x:326,t:m`2\pi`,open:true}].map(v=><g key={v.x}><circle cx={v.x} cy="270" r="4" fill={v.open?'white':teal} stroke={teal} strokeWidth="2"/><Label x={v.x} y={302} tex={v.t} width={54}/></g>)}<Label x={18} y={270} tex={m`\theta`} width={30}/></>}
 </svg>;
}
function Addition({stage,reduce}:{stage:number;reduce:boolean}){
 const O={x:48,y:228},r=178,a=Math.PI/4,b=Math.PI/6,c=Math.cos(a),s=Math.sin(a),H={x:O.x+r*c*Math.cos(b),y:O.y-r*c*Math.sin(b)},P={x:O.x+r*Math.cos(a+b),y:O.y-r*Math.sin(a+b)};
 return <svg viewBox="0 0 360 280" role="img" aria-label={stage===0?'元の角が四分のπの直角三角形。横の移動が青緑、縦の移動が黄土色。':'同じ三角形を六分のπだけ反時計回りに回した図。二つの移動の縦成分を足したものが、回転後の点の高さ。'} style={{display:'block',width:'100%',maxWidth:520,margin:'12px auto'}}>
  <path d="M28 228H304 M48 242V22" stroke={muted}/><Label x={316} y={236} tex="x" width={28}/><Label x={35} y={16} tex="y" width={28}/>
  <path d={`M48 228H${stable(48+r*c)}V${stable(228-r*s)}L48 228`} stroke="#c9d3dc" strokeDasharray="4 4" fill="none"/>
  <g style={{transformOrigin:'48px 228px',transform:`rotate(${stage>0?-30:0}deg)`,transition:reduce?'none':'transform 700ms ease'}}>
   <path d={`M48 228H${stable(48+r*c)}`} stroke={teal} strokeWidth="4"/><path d={`M${stable(48+r*c)} 228V${stable(228-r*s)}`} stroke={ochre} strokeWidth="4"/><path d={`M48 228L${stable(48+r*c)} ${stable(228-r*s)}`} stroke={ink} strokeWidth="2"/>
  </g>
  {stage===0?<><Label x={114} y={253} tex={m`\cos\alpha`} width={110}/><Label x={222} y={164} tex={m`\sin\alpha`} width={110}/><Label x={80} y={212} tex={m`\alpha`} width={35}/></>:<>
   <path d={`M${stable(H.x)} ${stable(H.y)}H278 M${stable(P.x)} ${stable(P.y)}H278`} stroke={muted} strokeDasharray="3 4"/>
   <path d={`M270 228V${stable(H.y)}`} stroke={teal} strokeWidth="5"/><path d={`M270 ${stable(H.y)}V${stable(P.y)}`} stroke={ochre} strokeWidth="5"/>
   <Label x={270} y={30} tex={m`\sin(\alpha+\beta)`} width={170}/>
  </>}
 </svg>;
}
function HalfCircle(){
 const X=(x:number)=>180+87*x,Y=(y:number)=>110-87*y;
 return <svg viewBox="0 0 360 245" role="img" aria-label="半角は第二象限。縦座標は正、横座標は負。元の点は灰色で第三象限に示す。" style={{display:'block',width:'100%',maxWidth:440,margin:'12px auto'}}>
  <circle cx="180" cy="110" r="87" fill="none" stroke={muted}/><path d="M74 110H289 M180 10V212" stroke={muted}/>
  <path d={`M180 110L${X(-.6)} ${Y(-.8)}`} stroke={muted} strokeDasharray="4 4"/>
  <path d={`M180 110H${stable(X(-1/Math.sqrt(5)))}V${stable(Y(2/Math.sqrt(5)))}L180 110`} stroke={teal} fill="none" strokeWidth="3"/>
  <circle cx={stable(X(-1/Math.sqrt(5)))} cy={stable(Y(2/Math.sqrt(5)))} r="4" fill={teal}/>
  <Label x={113} y={19} tex={m`\frac\theta2`} width={60}/><Label x={112} y={199} tex={m`\theta`} width={35}/>
  <Label x={172} y={231} tex={m`\sin\frac\theta2>0,\quad\cos\frac\theta2<0`} width={330}/>
 </svg>;
}
function Coefficients({stage}:{stage:number}){
 const a=stage?'\\sqrt3':'a',b=stage?'1':'b';
 return <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',textAlign:'center',padding:'12px 4px',background:'white',borderRadius:8}} aria-label="正弦と余弦を固定した、対応する係数の二列">
  <div><Formula tex={m`\sin\theta`} display/><Formula tex={m`{\color{#176c82}{${a}}}`} display/><Formula tex={m`{\color{#176c82}{R\cos\varphi}}`} display/></div>
  <div><Formula tex={m`\cos\theta`} display/><Formula tex={m`{\color{#936114}{${b}}}`} display/><Formula tex={m`{\color{#936114}{R\sin\varphi}}`} display/></div>
 </div>;
}
function AdditionFactors({stage}:{stage:number}){
 const first=stage===0;
 return <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 18px minmax(0,1fr)',gap:4,textAlign:'center',padding:'14px 4px',background:'white',borderRadius:8}} aria-label="加法定理の一つの積。各列で、一般式の因子、具体的な角、その値が対応する。">
  <div><Formula tex={first?m`\sin\alpha`:m`\cos\alpha`} display/><Formula tex={first?m`\sin\frac\pi4`:m`\cos\frac\pi4`} display/><Formula tex={m`\color{#176c82}{\frac{\sqrt2}2}`} display/></div>
  <div style={{alignSelf:'center'}}><Formula tex={m`\cdot`}/></div>
  <div><Formula tex={first?m`\cos\beta`:m`\sin\beta`} display/><Formula tex={first?m`\cos\frac\pi6`:m`\sin\frac\pi6`} display/><Formula tex={first?m`\color{#936114}{\frac{\sqrt3}2}`:m`\color{#936114}{\frac12}`} display/></div>
 </div>;
}
export default function Math2TrigDiagram({kind,stage,reduce}:{kind:string;stage:number;reduce:boolean}){
 const pi=Math.PI;
 if(kind==='m2-trig-double-range')return <RangePair top="u" bottom={m`\theta`} values={[{top:'0',bottom:'0'},{top:m`\pi`,bottom:m`\frac\pi2`},{top:m`2\pi`,bottom:m`\pi`},{top:m`3\pi`,bottom:m`\frac{3\pi}2`},{top:m`4\pi`,bottom:m`2\pi`}]} showPoints={stage>0}/>;
 if(kind==='m2-trig-wrap')return <WrapCircle stage={stage}/>;
 if(kind==='m2-trig-addition')return <Addition stage={stage} reduce={reduce}/>;
 if(kind==='m2-trig-half-range')return <RangePair top={m`\theta`} bottom={m`\frac\theta2`} values={[{top:m`\pi`,bottom:m`\frac\pi2`},{top:m`2\pi`,bottom:m`\pi`}]} topOpen={[true,true]}/>;
 if(kind==='m2-trig-half-sign')return <HalfCircle/>;
 if(kind==='m2-trig-addition-factors')return <AdditionFactors stage={stage}/>;
 if(kind==='m2-trig-coefficients')return <Coefficients stage={stage}/>;
 if(kind==='m2-trig-tangent')return <TrigTangentRegion/>;
 if(kind==='m2-trig-shift')return <TrigPlot xMin={-pi/2} xMax={5*pi/2} yMin={-1.4} yMax={1.4} connectors={stage>0?[{from:[0,0],to:[pi/2,0]},{from:[pi/2,1],to:[pi,1]}]:[]} description="正弦のグラフの点を、高さを保って右へ二分のπ移した対応。" ticks={[{x:0,tex:'0'},{x:pi/2,tex:m`\frac\pi2`},{x:pi,tex:m`\pi`},{x:3*pi/2,tex:m`\frac{3\pi}2`},{x:2*pi,tex:m`2\pi`}]} curves={[{value:Math.sin,color:muted},...(stage>0?[{value:(x:number)=>Math.sin(x-pi/2),color:teal}]:[])]} points={stage===0?[{x:0,y:0},{x:pi/2,y:1}]:[{x:0,y:0,open:true,color:muted},{x:pi/2,y:1,open:true,color:muted},{x:pi/2,y:0},{x:pi,y:1}]}/>;
 if(kind==='m2-trig-synthesis-range')return <TrigPlot xMin={0} xMax={pi/2} yMin={0} yMax={1.7} yTicks={[{y:1,tex:'1'},{y:Math.SQRT2,tex:m`\sqrt2`}]} xLabel={m`\theta`} description="正弦と余弦の和の指定範囲。元の角θと合成した角uの目盛を上下に対応させる。" ticks={[{x:0,tex:'0'},{x:pi/4,tex:m`\frac\pi4`},{x:pi/2,tex:m`\frac\pi2`}]} curves={[{value:x=>Math.sin(x)+Math.cos(x)}]} points={[{x:0,y:1},{x:pi/4,y:Math.SQRT2},{x:pi/2,y:1}]} secondAxis={{label:'u',values:[m`\frac\pi4`,m`\frac\pi2`,m`\frac{3\pi}4`]}}/>;
 if(kind==='m2-trig-synthesis-equation')return <TrigPlot xMin={0} xMax={2*pi} yMin={-1.7} yMax={1.7} xLabel={m`\theta`} description="正弦と余弦の和が1になる二つの角。右端二πは含まない。下に合成した角uを対応させる。" ticks={[{x:0,tex:'0'},{x:pi/2,tex:m`\frac\pi2`},{x:pi,tex:m`\pi`},{x:3*pi/2,tex:m`\frac{3\pi}2`},{x:2*pi,tex:m`2\pi`}]} curves={[{value:x=>Math.sin(x)+Math.cos(x)}]} level={1} points={[{x:0,y:1},{x:pi/2,y:1},{x:2*pi,y:1,open:true}]} secondAxis={{label:'u',values:[m`\frac\pi4`,m`\frac{3\pi}4`,m`\frac{5\pi}4`,m`\frac{7\pi}4`,m`\frac{9\pi}4`]}}/>;
 return null;
}
