import {Formula,MathText} from './MathText';
import Math1DataPlot from './Math1DataPlot';
import {coinSimulation} from '../content/math1-data-inference';

const m=String.raw;
const Values=({values,selected=[]}:{values:number[];selected?:number[]})=><div className="m1-data-values">{values.map((v,i)=><span className={selected.includes(i)?'m1-data-selected':''} key={i}><Formula tex={String(v)}/></span>)}</div>;
function Quartiles({stage}:{stage:number}){
 if(stage>=4)return <Math1DataPlot figure={{title:'五つの位置から箱とひげへ',description:'',kind:'box',xLabel:'データの値',yLabel:'',xRange:[0,10],yMax:1,xTicks:[0,2,4,6,8,10],yTicks:[],five:[1,2,5,8,9]}}/>;
 return <div className="m1-data-quartiles">
  <p>小さい順</p><Values values={[1,2,4,5,7,8,9]} selected={stage? [3]:[]}/>
  {stage>=1&&<><p><MathText text={m`全体の中央は $Q_2=5$。この値を除いて分けます。`}/></p><div className="m1-data-halves">
   <div><p>下半分</p><Values values={[1,2,4]} selected={stage>=2?[1]:[]}/>{stage>=2&&<Formula tex="Q_1=2" display/>}</div>
   <div><p>上半分</p><Values values={[7,8,9]} selected={stage>=3?[1]:[]}/>{stage>=3&&<Formula tex="Q_3=8" display/>}</div>
  </div></>}
 </div>;
}
function Frequency({stage}:{stage:number}){
 const values=[2,5,5,8,10,12,14,15,18,19,21,24];
 return <div><p>所要時間（分）</p><Values values={values} selected={stage>=1?[1,2,3]:[]}/>
  {stage>=1&&<p className="m1-data-link"><MathText text={m`$5$ 以上 $10$ 未満：$5,5,8$ の $3$ 人`}/></p>}
  {stage>=2&&<><Math1DataPlot figure={{title:'同じ三つの記録を柱の高さへ',description:'',kind:'bars',xLabel:'所要時間（分）',yLabel:'度数（人）',xRange:[0,25],yMax:4,xTicks:[0,5,10,15,20,25],yTicks:[0,1,2,3,4],bars:[1,3,3,3,2].map((value,i)=>({lo:5*i,hi:5*(i+1),value,highlight:i===1}))}}/>
   <div className="m1-data-total"><p>選んだ階級の個数を、全体の個数で割る</p><Formula tex={m`\frac{\overbrace{3}^{\text{階級}}}{\underbrace{12}_{\text{全体}}}=\frac14`} display/></div></>}
 </div>;
}
function Variance({stage}:{stage:number}){
 const rows=[[2,-2,4],[4,0,0],[4,0,0],[6,2,4]];
 if(stage===0)return <div><Values values={[2,4,4,6]}/><Formula tex={m`\bar x=\frac{2+4+4+6}{4}=4`} display/></div>;
 return <div>
  <p><MathText text={m`各行の記録から、同じ平均 $4$ を引きます。`}/></p>
  <table className="m1-data-table"><thead><tr><th>値</th><th>偏差</th>{stage>=2&&<th>二乗</th>}</tr></thead><tbody>{rows.map(([x,d,sq],i)=><tr key={i}><td><Formula tex={String(x)}/></td><td><Formula tex={`${x}-4=${d}`}/></td>{stage>=2&&<td><Formula tex={String(sq)}/></td>}</tr>)}</tbody></table>
  {stage===1&&<Formula tex="(-2)+0+0+2=0" display/>}
  {stage>=2&&<div className="m1-data-total"><p>二乗した値の合計</p><Formula tex="4+0+0+4=8" display/></div>}
  {stage>=3&&<><p><MathText text={m`二乗した値も $4$ 個。合計をその個数で割ります。`}/></p><Formula tex={m`s^2=\frac{\overbrace{8}^{\text{二乗の合計}}}{\underbrace{4}_{\text{個数}}}=2`} display/></>}
 </div>;
}
function Moments({stage}:{stage:number}){
 return <div><p>元のデータ</p><Values values={[1,2,4,5]}/>
  <div className="m1-data-paths">
   <section className={stage===0?'m1-data-active':''}><h4>二乗してから平均</h4><Values values={[1,4,16,25]}/><Formula tex={m`\overline{x^2}=\frac{46}{4}=\frac{23}{2}`} display/></section>
   {stage>=1&&<section><h4>平均してから二乗</h4><Formula tex={m`\bar x=\frac{12}{4}=3`} display/><Formula tex={m`(\bar x)^2=3^2=9`} display/></section>}
  </div>
  {stage>=2&&<Formula tex={m`s^2=\frac{23}{2}-9=\frac52`} display/>}
 </div>;
}
function Affine({stage,reduce}:{stage:number;reduce:boolean}){
 const original=[2,4,4,6];
 const a=stage===2?-2:stage===3?0:1,b=stage===1?5:stage===3?7:0;
 const values=original.map(x=>a*x+b),av=4*a+b;
 const X=(x:number)=>22+(x+14)*276/28;
 return <div className={`m1-data-affine ${reduce?'m1-data-reduce':''}`}>
  <p><MathText text={stage===0?'元のデータ':stage===1?m`全ての値に $5$ を足す`:stage===2?m`全ての値を $-2$ 倍する`:m`全ての値を $y=7$ にする`}/></p>
  <svg viewBox="0 0 320 150" role="img" aria-label="データと平均の同じ変換">
   <line x1="22" x2="298" y1="104" y2="104" stroke="#284353"/>
   {[-14,-7,0,7,14].map(v=><g key={v}><line x1={X(v)} x2={X(v)} y1="104" y2="109" stroke="#284353"/><foreignObject x={X(v)-20} y="116" width="40" height="30"><div className="m1-data-plot-label"><Formula tex={String(v)}/></div></foreignObject></g>)}
   {values.map((v,i)=><circle key={i} cx="0" cy="0" r="5" style={{transform:`translate(${X(v)}px, ${58+i*10}px)`}} fill="#176c82" stroke="#fff" strokeWidth="1"/>)}
   <g className="m1-data-average" style={{transform:`translate(${X(av)}px, 0)`}}><line x1="0" x2="0" y1="40" y2="104" stroke="#936114" strokeWidth="2" strokeDasharray="4 3"/></g>
  </svg>
  <p>横軸：データの値</p><Values values={values}/>
  <p className="m1-data-mean"><MathText text={`${stage===0?'平均は':'平均も同じ変換で'} $${av}$。`}/></p>
  {stage===1&&<Formula tex="(x_i+5)-(4+5)=x_i-4" display/>}
  {stage===2&&<Formula tex="(-2x_i)-(-8)=-2(x_i-4)" display/>}
  {stage===3&&<Formula tex={m`s_y^2=0,\quad s_y=0`} display/>}
 </div>;
}
function Correlation({stage}:{stage:number}){
 if(stage===0)return <><Math1DataPlot figure={{title:'平均との差を見る二本の線',description:'',kind:'points',xLabel:'変量 $x$',yLabel:'変量 $y$',xRange:[0,4],yMax:4,xTicks:[0,1,2,3,4],yTicks:[0,1,2,3,4],points:[[1,1],[2,3],[3,2]],mean:[2,2],selectedPoint:0}}/><p><MathText text={m`点 $(1,1)$ は両平均より $1$ ずつ小さいので、偏差の積は $(-1)(-1)=1$。`}/></p></>;
 if(stage===1)return <table className="m1-data-table"><thead><tr><th>同じ組</th><th>偏差の組</th><th>積</th></tr></thead><tbody>{[['(1,1)','(-1,-1)','1'],['(2,3)','(0,1)','0'],['(3,2)','(1,0)','0']].map((row,i)=><tr key={i}>{row.map((v,k)=><td key={k}><Formula tex={v}/></td>)}</tr>)}</tbody></table>;
 return <div className="m1-data-correlation-sums">
  <section><h4>同じ組の偏差の積の和</h4><Formula tex="1+0+0=1" display/></section>
  <section><h4>横の偏差の二乗和</h4><Formula tex="(-1)^2+0^2+1^2=2" display/></section>
  <section><h4>縦の偏差の二乗和</h4><Formula tex="(-1)^2+1^2+0^2=2" display/></section>
  {stage>=3&&<div className="m1-data-total"><Formula tex={m`r=\frac{\overbrace{1}^{\text{積の和}}}{\sqrt{\underbrace{2}_{x}\cdot\underbrace{2}_{y}}}=\frac12`} display/></div>}
 </div>;
}
function WeightedMean({grouped=false,stage}:{grouped?:boolean;stage:number}){
 const rows=grouped?[[2,5],[4,15],[2,25]]:[[2,4],[6,8]],total=rows.reduce((s,[n,x])=>s+n*x,0),n=rows.reduce((s,[n])=>s+n,0);
 return <div><table className="m1-data-table"><thead><tr><th>{grouped?'度数':'人数'}</th><th>{grouped?'階級値（分）':'平均（分）'}</th>{stage>=1&&<th>{grouped?'積':'合計（分）'}</th>}</tr></thead><tbody>{rows.map(([n,x],i)=><tr key={i}><td><Formula tex={String(n)}/></td><td><Formula tex={String(x)}/></td>{stage>=1&&<td><Formula tex={m`${n}\cdot${x}=${n*x}`}/></td>}</tr>)}</tbody></table>
  {stage>=2&&<><p>{grouped?'積の合計を度数の合計で割る':'時間の合計を人数の合計で割る'}</p><Formula tex={m`\frac{${total}}{${n}}=${total/n}\quad(\text{分})`} display/>{grouped&&<p>各記録を階級値で置き換えた平均の推定値です。</p>}</>}
 </div>;
}
function BoxLimits({stage}:{stage:number}){
 return <div className="m1-data-counterexample"><section><h4>一組目</h4><Values values={[0,1,2,3,4,5,6]} selected={[2]}/>{stage>=1&&<Formula tex={m`\text{平均}=\frac{21}{7}=3`} display/>}</section>
  <section><h4>二組目</h4><Values values={[0,1,1,3,4,5,6]} selected={[2]}/>{stage>=1&&<Formula tex={m`\text{平均}=\frac{20}{7}`} display/>}</section>
  <p>どちらも同じ五数要約</p><Values values={[0,1,3,5,6]}/>
  {stage>=2&&<Math1DataPlot figure={{title:'二組で共通の箱ひげ図',description:'',kind:'box',xLabel:'データの値',yLabel:'',xRange:[0,6],yMax:1,xTicks:[0,1,2,3,4,5,6],yTicks:[],five:[0,1,3,5,6],showFiveLabels:false}}/>}
 </div>;
}
function Tail({stage}:{stage:number}){
 return <div><Math1DataPlot figure={{title:'仮定の下での計算機実験',description:'',kind:'bars',xLabel:'表の回数',yLabel:'試行の度数',xRange:[-.6,10.6],yMax:3000,xTicks:[0,2,4,6,8,10],yTicks:[0,1000,2000,3000],bars:coinSimulation.counts.map((value,k)=>({lo:k-.4,hi:k+.4,value,highlight:stage>=1&&k>=9}))}}/>
  {stage>=1&&<div className="m1-data-total"><p><MathText text={m`表 $9$ 回の $99$ 試行と、$10$ 回の $11$ 試行`}/></p><Formula tex="99+11=110" display/></div>}
  {stage>=2&&<><p>観測以上の試行を、全試行で割る</p><Formula tex={m`\frac{110}{10000}=0.011=1.1\%`} display/></>}
 </div>;
}
export default function Math1DataDiagram({kind,stage,reduce}:{kind:string;stage:number;reduce:boolean}){
 return <div className="m1-data-diagram">{
  kind==='m1-data-quartiles'?<Quartiles stage={stage}/>:
  kind==='m1-data-frequency'?<Frequency stage={stage}/>:
  kind==='m1-data-variance'?<Variance stage={stage}/>:
  kind==='m1-data-moments'?<Moments stage={stage}/>:
  kind==='m1-data-affine'?<Affine stage={stage} reduce={reduce}/>:
  kind==='m1-data-correlation'?<Correlation stage={stage}/>:
  kind==='m1-data-pooled'?<WeightedMean stage={stage}/>:
  kind==='m1-data-grouped'?<WeightedMean grouped stage={stage}/>:
  kind==='m1-data-box-limits'?<BoxLimits stage={stage}/>:
  kind==='m1-data-tail'?<Tail stage={stage}/>:null
 }</div>;
}
