import {Formula,MathText} from './MathText';
const m=String.raw;
type Props={kind:string;stage:number;reduce:boolean};
type Tone='teal'|'gold';
function Term({tex,tone,cancel=false}:{tex:string;tone?:Tone;cancel?:boolean}){
 return <span className={`m2a-term${tone?' m2a-'+tone:''}${cancel?' m2a-cancel':''}`}><Formula tex={tex}/></span>;
}
function Rows({rows,columns=3,cancel=[]}:{rows:string[][];columns?:number;cancel?:number[][]}){
 return <div className="m2a-rows" style={{gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`}}>{rows.map((row,i)=>row.map((tex,j)=><div key={i+'-'+j} className={i===rows.length-1?'m2a-last-row':''}>{tex&&<Term tex={tex} tone={cancel[i]?.includes(j)?(j%2?'teal':'gold'):undefined} cancel={cancel[i]?.includes(j)}/>}</div>))}</div>;
}
function PairTable({heads,rows}:{heads:string[];rows:string[][]}){
 return <div className="m2a-pair-table" role="table"><div className="m2a-table-row m2a-table-head" role="row">{heads.map(head=><div role="columnheader" key={head}><MathText text={head}/></div>)}</div>{rows.map((row,i)=><div className="m2a-table-row" role="row" key={i}>{row.map((tex,j)=><div role="cell" key={j}><Formula tex={tex}/></div>)}</div>)}</div>;
}
function CubeParts({stage}:{stage:number}){
 return stage===0?<><Formula tex={m`({\color{#176c82}a}-{\color{#936114}b})^3`} display/><Formula tex={m`({\color{#176c82}{2x}}-{\color{#936114}1})^3`} display/><PairTable heads={['$a$ に入るまとまり','$b$ に入るまとまり']} rows={[[m`\color{#176c82}{2x}`,m`\color{#936114}1`]]}/></>:<PairTable heads={['公式の項','対応する項']} rows={[[m`a^3`,m`({\color{#176c82}{2x}})^3`],[m`-3a^2b`,m`-3({\color{#176c82}{2x}})^2\cdot1`],[m`+3ab^2`,m`+3({\color{#176c82}{2x}})\cdot1^2`],[m`-b^3`,m`-1^3`]]}/>;
}
function CubeCancel({stage}:{stage:number}){
 const cancel=stage>0;
 return <><p className="m2a-small"><MathText text="$x$ 倍の行と $2$ 倍の行を足します。"/></p><Rows columns={4} rows={[[m`x^3`,m`-2x^2`,m`+4x`,``],[``,m`+2x^2`,m`-4x`,m`+8`]]} cancel={cancel?[[1,2],[1,2]]:[]}/>{cancel&&<div className="m2a-result"><Formula tex="x^3+8" display/></div>}</>;
}
function Choice({stage}:{stage:number}){
 const groups=stage<2?[[1,'x','x'],['x',1,'x'],['x','x',1]]:[[2,2,'x','x'],[2,'x',2,'x'],[2,'x','x',2],['x',2,2,'x'],['x',2,'x',2],['x','x',2,2]];
 return <><div className={stage<2?'m2a-choice-list':'m2a-choice-grid'}>{groups.map((row,i)=><div className="m2a-choice-row" key={i}><Formula tex={row.map(v=>typeof v==='number'?m`{\color{#176c82}{${v}}}`:v).join(m`\cdot `)+(stage<2?'=x^2':'')}/></div>)}</div>{stage===1&&<div className="m2a-result"><Formula tex="x^2+x^2+x^2=3x^2" display/></div>}{stage===2&&<div className="m2a-result"><p className="m2a-small">どの選び方でも、一通りの積は同じ</p><Formula tex={m`x^2\cdot2^2=4x^2`} display/></div>}</>;
}
function Degree({stage}:{stage:number}){
 return <>{stage===0?<><Formula tex={m`{}_5C_r x^{\color{#176c82}{5-r}}2^r`} display/><PairTable heads={['一般項の次数','求める次数']} rows={[[m`\color{#176c82}{5-r}`,m`\color{#176c82}3`]]}/><Formula tex="5-r=3" display/></>:<><Formula tex="r=2" display/><PairTable heads={['個数を決める前','決めた後']} rows={[[m`{}_5C_r`,m`{}_5C_{\color{#176c82}2}`],[m`x^{5-r}`,m`x^{5-2}=x^3`],[m`2^r`,m`2^{\color{#176c82}2}=4`]]}/></> }</>;
}
function SubtractionRows({top,bottom,result,cancel=false}:{top:string[];bottom:string[];result?:string[];cancel?:boolean}){
 return <div className="m2a-subtraction" style={{gridTemplateColumns:`18px repeat(${top.length},minmax(0,1fr))`}}>
  <span/>{top.map((tex,j)=><div key={'t'+j}><Term tex={tex} tone={j===0?'teal':undefined} cancel={cancel&&j===0}/></div>)}
  <span><Formula tex="-"/></span>{bottom.map((tex,j)=><div key={'b'+j}><Term tex={tex} tone={j===0?'teal':undefined} cancel={cancel&&j===0}/></div>)}
  {result&&<><span className="m2a-difference"/>{result.map((tex,j)=><div className="m2a-difference" key={'r'+j}>{tex&&<Formula tex={tex}/>}</div>)}</>}
 </div>;
}
function Division({stage}:{stage:number}){
 const missing=stage===3,second=stage===2;
 return <><div className="m2a-division-head"><span><MathText text={missing?'割る式 $x^2+1$':'割る式 $x+1$'}/></span><span><MathText text={second?'商 $x+2$':'商 $x$'}/></span></div>{missing?<><SubtractionRows top={['x^3','+0x^2','+0x','+1']} bottom={['x^3','+0x^2','+x','+0']} result={['','','-x','+1']} cancel/><p className="m2a-small">余りは一次、割る式は二次</p></>:second?<SubtractionRows top={['2x','+1']} bottom={['2x','+2']} result={['','-1']} cancel/>:<SubtractionRows top={['x^2','+3x','+1']} bottom={['x^2','+x','+0']} result={stage>0?['','2x','+1']:undefined} cancel={stage>0}/>}</>;
}
function CommonDenominator({stage}:{stage:number}){
 return stage===0?<><Formula tex={m`\dfrac1x\cdot\underbrace{{\color{#176c82}{\dfrac{x+1}{x+1}}}}_{1}`} display/><Formula tex={m`=\dfrac{{\color{#176c82}{x+1}}}{x({\color{#176c82}{x+1}})}`} display/></>:<><Formula tex={m`\dfrac1{x+1}\cdot\underbrace{{\color{#936114}{\dfrac xx}}}_{1}`} display/><Formula tex={m`=\dfrac{{\color{#936114}x}}{({\color{#936114}x})(x+1)}`} display/></>;
}
function Subtract(){
 return <><Formula tex={m`\dfrac{(x+1)-(x-1)}{(x-1)(x+1)}`} display/><div className="m2a-subtract-scope"><Formula tex={m`(x+1)-{\color{#936114}{(x-1)}}`} display/><Formula tex={m`=x+1{\color{#936114}{-x+1}}`} display/></div></>;
}
function Compare({stage}:{stage:number}){
 const complex=stage>1,solved=stage%2===1;
 return <><PairTable heads={complex?['実部','虚部']:['$x$ の係数','定数項']} rows={complex?[[m`\color{#176c82}a`,m`\color{#936114}{b-1}`],[m`\color{#176c82}2`,m`\color{#936114}3`]]:[[m`\color{#176c82}a`,m`\color{#936114}{a+b}`],[m`\color{#176c82}2`,m`\color{#936114}5`]]}/><div className="m2a-result"><Formula tex={complex?m`a=2,\quad b-1=3`:m`a=2,\quad a+b=5`} display/>{solved&&<Formula tex={complex?m`a=2,\quad b=4`:m`a=2,\quad b=3`} display/>}</div></>;
}
function ProofSquares({stage}:{stage:number}){
 return <><Rows rows={[[m`a^2`,m`+2ab`,m`+b^2`],[m`-a^2`,m`+2ab`,m`-b^2`]]} cancel={stage>0?[[0,2],[0,2]]:[]}/><p className="m2a-small">二つの行を足す</p>{stage>0&&<div className="m2a-result"><Formula tex="2ab+2ab=4ab" display/></div>}</>;
}
function Amgm({stage}:{stage:number}){
 return <><PairTable heads={['$a$ に入れる正の数','$b$ に入れる正の数']} rows={[[m`\color{#176c82}x`,m`\color{#936114}{\dfrac4x}`]]}/><div className="m2a-result">{stage===0?<Formula tex={m`a+b\ge2\sqrt{ab}`} display/>:<><Formula tex={m`a=b`} display/><Formula tex={m`{\color{#176c82}x}={\color{#936114}{\dfrac4x}}`} display/><Formula tex="x^2=4,\quad x=2\ (x>0)" display/></>}</div></>;
}
function Conjugate({stage}:{stage:number}){
 return <><div className="m2a-inline-sum"><Formula tex="1"/><Term tex="-i" tone="teal" cancel={stage>0}/><Term tex="+i" tone="teal" cancel={stage>0}/><Formula tex="-i^2"/></div>{stage>0&&<div className="m2a-result"><Formula tex="1-i^2=1-(-1)=2" display/></div>}</>;
}
function Vieta({stage}:{stage:number}){
 return <>{stage===0?<PairTable heads={['$x$ の係数','定数項']} rows={[[m`\color{#176c82}b`,m`\color{#936114}c`],[m`\color{#176c82}{-a(\alpha+\beta)}`,m`\color{#936114}{a\alpha\beta}`]]}/>:<><Formula tex={m`b=-a(\alpha+\beta)`} display/><Formula tex={m`\alpha+\beta=-\dfrac ba`} display/><div className="m2a-result"><Formula tex={m`c=a\alpha\beta`} display/><Formula tex={m`\alpha\beta=\dfrac ca`} display/></div></>}</>;
}
function SquareSum(){
 return <><Formula tex={m`(\alpha+\beta)^2`} display/><Formula tex={m`=\alpha^2+{\color{#936114}{2\alpha\beta}}+\beta^2`} display/><div className="m2a-result"><Formula tex={m`\alpha^2+\beta^2`} display/><Formula tex={m`=(\alpha+\beta)^2-{\color{#936114}{2\alpha\beta}}`} display/></div></>;
}
function Remainder({stage}:{stage:number}){
 return stage===0?<Formula tex="P(x)=(x-2)Q(x)+r" display/>:<><div className="m2a-inline-sum"><Formula tex="P(2)="/><Term tex="(2-2)Q(2)" tone="teal" cancel/><Formula tex="+r"/></div><Formula tex="(2-2)Q(2)=0" display/><div className="m2a-result"><Formula tex="P(2)=r" display/></div></>;
}
function FactorTree({stage}:{stage:number}){
 return stage===0?<PairTable heads={['因数がゼロになる式','得られる解']} rows={[[m`x=0`,m`x=0`],[m`x-2=0`,m`x=2`],[m`x+2=0`,m`x=-2`]]}/>:<div className="m2a-branches">{[1,4].map((v,i)=><div key={v}><Formula tex={`t=${v}`} display/><Formula tex={`x^2=${v}`} display/><Formula tex={`x=\\pm${i+1}`} display/></div>)}</div>;
}
export default function Math2AlgebraDiagram({kind,stage,reduce}:Props){
 if(!kind.startsWith('m2-algebra-'))return null;
 const name=kind.slice('m2-algebra-'.length);
 const diagram=name==='cube-parts'?<CubeParts stage={stage}/>:name==='cube-cancel'?<CubeCancel stage={stage}/>:name==='choice'?<Choice stage={stage}/>:name==='degree'?<Degree stage={stage}/>:name==='division'?<Division stage={stage}/>:name==='common-denominator'?<CommonDenominator stage={stage}/>:name==='subtract'?<Subtract/>:name==='compare'?<Compare stage={stage}/>:name==='proof-squares'?<ProofSquares stage={stage}/>:name==='amgm'?<Amgm stage={stage}/>:name==='conjugate'?<Conjugate stage={stage}/>:name==='vieta'?<Vieta stage={stage}/>:name==='square-sum'?<SquareSum/>:name==='remainder'?<Remainder stage={stage}/>:name==='factor-tree'?<FactorTree stage={stage}/>:null;
 if(!diagram)return null;
 return <div className={`m2-algebra-diagram${reduce?' m2a-reduce':''}`} data-m2-algebra={name} data-stage={stage}>{diagram}</div>;
}
