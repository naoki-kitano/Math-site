import type {CSSProperties,ReactNode} from 'react';
import {Formula,MathText} from './MathText';
const m=String.raw;
const blue='#176c82',gold='#936114';
const cell:CSSProperties={padding:'7px 4px',textAlign:'center',borderBottom:'1px solid var(--line)',verticalAlign:'middle'};
const F=({tex}:{tex:string})=><Formula tex={tex}/>;
const P=({text}:{text:string})=><p style={{margin:'8px 0'}}><MathText text={text}/></p>;
function Table({headers,rows}:{headers:string[];rows:ReactNode[][]}){return <table style={{width:'100%',tableLayout:'fixed',borderCollapse:'collapse',margin:'8px 0'}}><thead><tr>{headers.map((s,i)=><th scope="col" key={i} style={{...cell,fontWeight:500,lineHeight:1.4}}><MathText text={s}/></th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((v,j)=><td key={j} style={cell}>{v}</td>)}</tr>)}</tbody></table>;}
function Tiles({items}:{items:string[]}){return <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:8}}>{items.map((tex,i)=><div key={i} style={{padding:8,border:'1px solid var(--line)',borderRadius:8,textAlign:'center'}}><F key="cell-0" tex={tex}/></div>)}</div>;}
function FactorPairs({stage}:{stage:number}){return <><Tiles items={['1\\times12','2\\times6','3\\times4']}/>{stage>0&&<Formula tex="1,2,3,4,6,12" display/>}</>;}
function FactorChoices({stage}:{stage:number}){
 if(!stage)return <><Formula tex={m`72=2^3\times3^2`} display/><Table headers={['素因数','選べる指数','選び方']} rows={[[<F key="cell-1" tex="2"/>,<F key="cell-2" tex="0,1,2,3"/>,<F key="cell-3" tex="4"/>],[<F key="cell-4" tex="3"/>,<F key="cell-5" tex="0,1,2"/>,<F key="cell-6" tex="3"/>]]}/></>;
 return <><Table headers={['$2$ の因子','$3^0=1$','$3^1=3$','$3^2=9$']} rows={[1,2,4,8].map(a=>[<F key="factor" tex={String(a)}/>,...[1,3,9].map(b=><F key={b} tex={String(a*b)}/>)])}/><Formula tex={m`4\times3=12`} display/></>;
}
function SquarePairs({stage}:{stage:number}){return <>
 <P text={stage?'足りない因数を一つ補う':'同じ素因数を二つずつ組にする'}/>
 <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center'}}>
  <div style={{border:`2px solid ${blue}`,borderRadius:9,padding:8}}><F key="cell-7" tex={m`\color{#176c82}{2\times2}`}/></div>
  <div style={{border:`2px ${stage?'solid':'dashed'} ${blue}`,borderRadius:9,padding:8}}><F key="cell-8" tex={stage?m`\color{#176c82}{2\times2}`:m`\color{#176c82}{2}`}/></div>
  <div style={{border:`2px solid ${gold}`,borderRadius:9,padding:8}}><F key="cell-9" tex={m`\color{#936114}{3\times3}`}/></div>
 </div>
 {stage>0&&<Formula tex={m`72\times2=2^4\times3^2=12^2`} display/>}
 </>;}
function GcdLcm({stage}:{stage:number}){return <>
 <Formula tex={m`18=2^1\times3^2`} display/><Formula tex={m`24=2^3\times3^1`} display/>
 <Table headers={['対象','$2$ の指数','$3$ の指数']} rows={[
  [<F key="n" tex="18"/>,<F key="a" tex="1"/>,<F key="b" tex="2"/>],
  [<F key="n" tex="24"/>,<F key="a" tex="3"/>,<F key="b" tex="1"/>],
  ...(stage?[[stage===1?'小さい方':'大きい方',<F key="a" tex={stage===1?'1':'3'}/>,<F key="b" tex={stage===1?'1':'2'}/>]]:[])
 ]}/>
 {stage>0&&<Formula tex={stage===1?'2^1\\times3^1=6':'2^3\\times3^2=72'} display/>}
 </>;}
function NegativeRemainder({stage}:{stage:number}){return <>
 <svg viewBox="0 0 300 125" style={{width:'100%',maxWidth:360,display:'block',margin:'auto'}} role="img" aria-label="-9と-6の間にある-7。下側の倍数-9からの距離が余り2">
  <line x1="20" x2="284" y1="72" y2="72" stroke="#30485e" strokeWidth="2"/>
  {[{x:30,tex:'-9'},{x:190,tex:'-7'},{x:270,tex:'-6'}].map(({x,tex})=><g key={tex}><line x1={x} x2={x} y1="66" y2="78" stroke="#30485e" strokeWidth="2"/><foreignObject x={x-28} y="81" width="56" height="32"><div style={{fontSize:18,textAlign:'center'}}><F key="cell-10" tex={tex}/></div></foreignObject></g>)}
  <circle cx="190" cy="72" r="5" fill={blue}/>
  {stage>0&&<><path d="M30 54 V39 H190 V54 M184 47 L190 54 L196 47" fill="none" stroke={blue} strokeWidth="2"/><foreignObject x="80" y="0" width="80" height="32"><div style={{fontSize:18,textAlign:'center'}}><F key="cell-11" tex="r=2"/></div></foreignObject></>}
 </svg><Formula tex={m`-9=3\times(-3),\quad-6=3\times(-2)`} display/>
 </>;}
function Residues({stage}:{stage:number}){const rows=[['3k','3(3k^2)','0'],['3k+1','3(3k^2+2k)','1'],['3k+2','3(3k^2+4k+1)','1']];return <div>{rows.map(([n,multiple,r],i)=><div key={n} style={{borderBottom:i<2?'1px solid var(--line)':undefined,padding:'7px 0'}}><Formula tex={`n=${n}`} display/>{stage>0&&<Formula tex={`n^2=${multiple}+{\\color{#936114}{${r}}}`} display/>}</div>)}</div>;}
function DigitWeights({stage}:{stage:number}){
 if(!stage)return <Table headers={['位の重み','$3$ の倍数','残り']} rows={[[<F key="cell-12" tex="100"/>,<F key="cell-13" tex={m`3\times33`}/>,<F key="cell-14" tex="1"/>],[<F key="cell-15" tex="10"/>,<F key="cell-16" tex={m`3\times3`}/>,<F key="cell-17" tex="1"/>],[<F key="cell-18" tex="1"/>,<F key="cell-19" tex="0"/>,<F key="cell-20" tex="1"/>]]}/>;
 return <><Table headers={['各位の値','$3$ の倍数','残り']} rows={[[<F key="cell-21" tex="100a"/>,<F key="cell-22" tex={m`3\times33a`}/>,<F key="cell-23" tex="a"/>],[<F key="cell-24" tex="10b"/>,<F key="cell-25" tex={m`3\times3b`}/>,<F key="cell-26" tex="b"/>],[<F key="cell-27" tex="c"/>,<F key="cell-28" tex="0"/>,<F key="cell-29" tex="c"/>]]}/><Formula tex="100a+10b+c" display/><Formula tex="=3(33a+3b)+(a+b+c)" display/></>;
}
function IntegerSolutions({stage}:{stage:number}){
 if(!stage)return <><Table headers={['増減','$x-2$','$y+1$']} rows={[[<F key="cell-30" tex="t"/>,<F key="cell-31" tex="5t"/>,<F key="cell-32" tex="-3t"/>]]}/><Formula tex="3(5t)+5(-3t)=0" display/></>;
 return <><Table headers={['座標','一組の解','増減']} rows={[[<F key="cell-33" tex="x"/>,<F key="cell-34" tex="2"/>,<F key="cell-35" tex="5t"/>],[<F key="cell-36" tex="y"/>,<F key="cell-37" tex="-1"/>,<F key="cell-38" tex="-3t"/>]]}/><Formula tex={m`x=2+5t,\quad y=-1-3t`} display/><Formula tex="3(2+5t)+5(-1-3t)=1" display/></>;
}
function Nonnegative({stage}:{stage:number}){return <><Table headers={['$t$','$x=6-3t$','$y=2t$']} rows={[0,1,2].map(t=>[<F key="t" tex={String(t)}/>,<span key="x" style={{color:stage&&t!==1?'var(--muted)':'var(--ink)'}}><F key="cell-39" tex={String(6-3*t)}/></span>,<span key="y" style={{color:stage&&t!==1?'var(--muted)':'var(--ink)'}}><F key="cell-40" tex={String(2*t)}/></span>])}/><P text={stage?m`両方正：$t=1$ の行だけ → $(3,2)$`:m`非負：三つの行 → $(6,0),(3,2),(0,4)$`}/></>;}
function Recurring({stage}:{stage:number}){return <>
 <Formula tex={m`\begin{array}{rcl}100x&=&27.{\color{#176c82}{272727\ldots}}\\x&=&0.{\color{#176c82}{272727\ldots}}\end{array}`} display/>
 {stage>0&&<><P text="上下を引くと、同じ小数部分が消える"/><Formula tex="100x-x=27" display/><Formula tex="99x=27" display/></>}
 </>;}
function Binary({stage}:{stage:number}){
 if(stage<2)return <><Table headers={['桁','$1$','$1$','$0$','$1$']} rows={[
  ['重み',...['8','4','2','1'].map(t=><F key={t} tex={t}/>)],
  ...(stage?[[ '桁の値',...['8','4','0','1'].map((t,i)=><F key={i} tex={t}/>)]]:[])
 ]}/>{stage>0&&<Formula tex="1101_{(2)}=8+4+0+1=13" display/>}</>;
 return <><Table headers={['元の数','商','余り','重み']} rows={[[13,6,1,1],[6,3,0,2],[3,1,1,4],[1,0,1,8]].slice(0,stage===2?1:4).map(row=>row.map((n,i)=><F key={i} tex={String(n)}/>))}/>{stage>2&&<Formula tex="1101_{(2)}" display/>}</>;
}
function Coordinates({stage}:{stage:number}){const vals=stage===0?[3,0,-2]:stage===1?[2,0,0]:[0,0,0];return <><Table headers={['$x$ 成分','$y$ 成分','$z$ 成分']} rows={[vals.map((v,i)=><span key={i} style={{color:v===0?blue:'var(--ink)',fontWeight:v===0?600:400}}><F key="cell-41" tex={String(v)}/></span>)]}/>{stage===0?<><Formula tex="y=0" display/><P text={m`$xz$ 平面上`}/></>:stage===1?<><Formula tex="y=z=0" display/><P text={m`$x$ 軸上（$xy$ 平面と $xz$ 平面にも属する）`}/></>:<><P text={m`座標軸：$x$ 軸、$y$ 軸、$z$ 軸`}/><P text={m`座標平面：$xy$ 平面、$xz$ 平面、$yz$ 平面`}/></>}</>;}
function Tiling({stage}:{stage:number}){return <>
 <svg viewBox="0 0 300 210" style={{width:'100%',maxWidth:330,display:'block',margin:'auto'}} role="img" aria-label="縦18、横24の長方形を一辺6の正方形で3行4列に分けた図">
  {Array.from({length:12},(_,i)=><rect key={i} x={45+(i%4)*48} y={26+Math.floor(i/4)*48} width="48" height="48" fill={i===0?'#e4f3f5':'none'} stroke={blue} strokeWidth="1.5"/>)}
  <foreignObject x="10" y="82" width="32" height="32"><div style={{fontSize:18}}><F key="cell-42" tex="18"/></div></foreignObject>
  <foreignObject x="117" y="174" width="56" height="32"><div style={{fontSize:18,textAlign:'center'}}><F key="cell-43" tex="24"/></div></foreignObject>
  <foreignObject x="57" y="39" width="28" height="32"><div style={{fontSize:18,textAlign:'center'}}><F key="cell-44" tex="6"/></div></foreignObject>
 </svg>
 {stage>0&&<Formula tex={m`\underbrace{\frac{18}{6}}_{\text{縦の枚数}}\times\underbrace{\frac{24}{6}}_{\text{横の枚数}}=12`} display/>}
 </>;}
function Stones({stage}:{stage:number}){return <><Table headers={['相手が取る','自分が取る','二人の合計']} rows={[[<F key="cell-45" tex="1"/>,<F key="cell-46" tex="2"/>,<F key="cell-47" tex="3"/>],[<F key="cell-48" tex="2"/>,<F key="cell-49" tex="1"/>,<F key="cell-50" tex="3"/>]]}/>{stage>0&&<><P text="二人が取り終えた後の残り"/><Formula tex={m`6\longrightarrow3\longrightarrow0`} display/><P text="最後の $0$ は、自分が最後の石を取った後です。"/></>}</>;}
export default function MathAIntegerStructure({kind,stage}:{kind:string;stage:number;reduce:boolean}){
 switch(kind){
  case 'ma-integer-factor-pairs':return <FactorPairs stage={stage}/>;
  case 'ma-integer-factor-choices':return <FactorChoices stage={stage}/>;
  case 'ma-integer-factor-pairs-square':return <SquarePairs stage={stage}/>;
  case 'ma-integer-gcd-lcm':return <GcdLcm stage={stage}/>;
  case 'ma-integer-negative-remainder':return <NegativeRemainder stage={stage}/>;
  case 'ma-integer-residues':return <Residues stage={stage}/>;
  case 'ma-integer-digit-weights':return <DigitWeights stage={stage}/>;
  case 'ma-integer-integer-solutions':return <IntegerSolutions stage={stage}/>;
  case 'ma-integer-nonnegative':return <Nonnegative stage={stage}/>;
  case 'ma-integer-recurring':return <Recurring stage={stage}/>;
  case 'ma-integer-binary':return <Binary stage={stage}/>;
  case 'ma-integer-coordinates':return <Coordinates stage={stage}/>;
  case 'ma-integer-tiling':return <Tiling stage={stage}/>;
  case 'ma-integer-stones':return <Stones stage={stage}/>;
  default:return null;
 }
}
