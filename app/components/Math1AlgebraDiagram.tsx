import {Formula,MathText} from './MathText';
import Math1AlgebraNumberLine from './Math1AlgebraNumberLine';
import type {ReactNode} from 'react';
const m=String.raw;
const F=({tex}:{tex:string})=><Formula tex={tex}/>;
const lines=(...tex:string[])=>tex.map((value,i)=><Formula key={i} tex={value} display/>);
function Tag({tex,tone='a',caption}:{tex:string;tone?:string;caption?:string}){return <div className={`m1alg-tag m1alg-${tone}`}><F tex={tex}/>{caption&&<small><MathText text={caption}/></small>}</div>;}
function Product({rows,cols,cells,highlight=[]}:{rows:string[];cols:string[];cells:string[][];highlight?:string[]}){
 return <div className="m1alg-product" style={{gridTemplateColumns:`auto repeat(${cols.length},minmax(0,1fr))`}} role="table" aria-label="行と列の項の積">
  <div className="m1alg-product-head"><F tex="\times"/></div>{cols.map((v,i)=><div className="m1alg-product-head" key={`h${i}`}><F tex={v}/></div>)}
  {rows.map((r,i)=><div key={r} className="m1alg-product-row" role="row"><div className="m1alg-product-head"><F tex={r}/></div>{cells[i].map((v,j)=><div key={j} className={'m1alg-product-cell'+(highlight.includes(`${i},${j}`)?' m1alg-match':'')}><F tex={v}/></div>)}</div>)}
 </div>;
}
function Repeating({stage}:{stage:number}){
 if(stage===3)return <>{lines('99a=27',m`a=\frac{27}{99}=\frac3{11}`)}</>;
 return <div className={'m1alg-repeat'+(stage===2?' subtract':'')}>
  {stage>0&&<div className="m1alg-decimal-row"><F tex="100a"/><F tex="="/><F tex="27"/><F tex="."/><span className="m1alg-tail"><F tex={m`272727\ldots`}/></span></div>}
  <div className="m1alg-decimal-row"><F tex="a"/><F tex="="/><F tex="0"/><F tex="."/><span className="m1alg-tail"><F tex={m`272727\ldots`}/></span></div>
  {stage===2&&<div className="m1alg-difference">{lines('100a-a=27','99a=27')}</div>}
 </div>;
}
function Scope({stage}:{stage:number}){
 if(stage===2)return <>{lines(m`2\cdot9-(-3)`,`18+3=21`)}</>;
 return <><div className="m1alg-expression"><F tex="2"/><Tag tex={stage===0?'x^2':'(-3)^2'} caption="二乗する部分"/><F tex={stage===0?'-x':'-(-3)'}/></div>{stage===0&&<div className="m1alg-comparison"><p>括弧まで二乗する場合</p><F tex="(2x)^2=(2x)(2x)"/></div>}</>;
}
function Coefficient({stage}:{stage:number}){
 return <>{lines('-2x^3y^2')}<div className="m1alg-expression"><Tag tex={stage?'(-2y^2)':'-2'} caption="係数"/><F tex="\cdot"/><Tag tex={stage?'x^3':'x^3y^2'} tone="b" caption={stage?'$x$ の部分':'文字の部分'}/></div>{lines(stage?m`\text{次数 }3`:m`\text{次数 }3+2=5`)}</>;
}
function Collect({stage}:{stage:number}){
 if(stage<2)return <><div className="m1alg-two-columns"><div><Tag tex="x^2" caption="二次の項"/>{lines('3x^2','-x^2')}</div><div><Tag tex="x" caption="一次の項"/>{lines('-2x','+5x')}</div></div>{stage===1&&<>{lines('(3-1)x^2+( -2+5)x','=2x^2+3x')}</>}</>;
 if(stage===2)return <>{lines('(4x+1)-(x-3)')}<div className="m1alg-pairs"><div><F tex="(-1)\cdot x"/><F tex="=-x"/></div><div><F tex="(-1)\cdot(-3)"/><F tex="=+3"/></div></div></>;
 return <>{lines('4x+1-x+3','=(4-1)x+(1+3)','=3x+4')}</>;
}
function Distribute({stage}:{stage:number}){
 if(stage<2)return <><Product rows={['2x','-1']} cols={['x','3']} cells={[['2x^2','6x'],['-x','-3']]} highlight={stage===1?['0,1','1,0']:[]}/>{stage===1&&<>{lines('6x-x=5x','(2x-1)(x+3)','=2x^2+5x-3')}</>}</>;
 return <><Product rows={['x','1']} cols={['x^2','-x','2']} cells={[['x^3','-x^2','2x'],['x^2','-x','2']]} highlight={stage===3?['0,1','1,0']:[]}/>{stage===3&&<>{lines('-x^2+x^2=0','(x+1)(x^2-x+2)','=x^3+x+2')}</>}</>;
}
function Square({stage}:{stage:number}){
 if(stage===4)return <><Product rows={['2x','1']} cols={['3x','-1']} cells={ [['6x^2','-2x'],['3x','-1']] } highlight={['0,1','1,0']}/>{lines('-2x+3x=x','(2x+1)(3x-1)','=6x^2+x-1')}</>;
 if(stage===0)return <>{lines(m`({\color{#176c82}a}-{\color{#936114}b})^2`,m`={\color{#176c82}a}^2-2{\color{#176c82}a}{\color{#936114}b}+{\color{#936114}b}^2`)}<div className="m1alg-expression"><Tag tex="a=2x"/><Tag tex="b=3" tone="b"/></div>{lines(m`({\color{#176c82}2x}-{\color{#936114}3})^2`,m`=({\color{#176c82}2x})^2-2({\color{#176c82}2x}){\color{#936114}3}+{\color{#936114}3}^2`)}</>;
 if(stage===1)return <><Product rows={['2x','-3']} cols={['2x','-3']} cells={ [['4x^2','-6x'],['-6x','9']] } highlight={['0,1','1,0']}/>{lines('-6x-6x=-12x','(2x-3)^2','=4x^2-12x+9')}</>;
 return <><Product rows={['3x','2']} cols={['3x','-2']} cells={ [['9x^2','-6x'],['6x','-4']] } highlight={stage===3?['0,1','1,0']:[]}/>{stage===3&&<>{lines('-6x+6x=0','(3x+2)(3x-2)','=9x^2-4')}</>}</>;
}
function Common({stage,group=false}:{stage:number;group?:boolean}){
 const factor=group?'(x+1)':'3x';
 return <>{stage===0?<div className="m1alg-pairs"><div><Tag tex={factor}/><F tex="\cdot 2x"/></div><div><Tag tex={factor}/><F tex={group?m`\cdot 1`:m`\cdot 3`}/></div></div>:<div className="m1alg-expression"><Tag tex={factor}/><F tex={group?'(2x+1)':'(2x+3)'}/></div>}{stage===0?lines(group?'2x(x+1)+(x+1)':'6x^2+9x'):lines(group?'2x(x+1)+(x+1)':'6x^2+9x',group?'=(x+1)(2x+1)':'=3x(2x+3)')}</>;
}
function Quadratic({stage}:{stage:number}){
 return <><Product rows={['2x','1']} cols={['x','3']} cells={ [['2x^2','6x'],['x','3']] } highlight={stage>0?['0,1','1,0']:[]}/>{stage>0&&lines('6x+x=7x')}{stage===2&&lines('2x^2+7x+3','=(2x+1)(x+3)')}</>;
}
function Grouping({stage}:{stage:number}){
 if(stage<2)return <Common stage={stage} group/>;
 return <>{lines('xy+2x+3y+6')}<div className="m1alg-pairs"><div><F tex="xy+2x"/><F tex="=x(y+2)"/></div><div><F tex="3y+6"/><F tex="=3(y+2)"/></div></div>{stage===3&&lines('x(y+2)+3(y+2)','=(x+3)(y+2)')}</>;
}
function Roots({stage}:{stage:number}){
 if(stage===2)return <>{lines(m`\sqrt{(-3)^2}=\sqrt9=3`,m`\sqrt{x^2}=|x|`)}</>;
 return <><div className="m1alg-two-columns"><Tag tex="3^2=9" caption={stage?'非負':'正の平方根'}/><Tag tex="(-3)^2=9" tone={stage?'muted':'b'} caption="負の平方根"/></div>{lines(stage?m`\sqrt9=3`:m`9\text{ の平方根は }3,-3`)}</>;
}
function Radicals({stage}:{stage:number}){
 if(stage<2)return <>{lines(m`\sqrt{12}=\sqrt{4\cdot3}`)}<div className="m1alg-expression"><Tag tex={stage? '2':m`\sqrt4`} caption={stage?'平方根を計算':'平方因子'}/><F tex="\cdot"/><Tag tex={m`\sqrt3`} tone="b" caption="残る根号"/></div>{stage===1&&lines(m`\sqrt{12}=2\sqrt3`)}</>;
 return <><div className="m1alg-pairs"><div><F tex={m`\sqrt{12}`}/><F tex={m`=2\sqrt3`}/></div><div><F tex={m`\sqrt{27}`}/><F tex={m`=3\sqrt3`}/></div></div>{stage===3&&lines(m`2\sqrt3+3\sqrt3`,m`=(2+3)\sqrt3=5\sqrt3`)}</>;
}
function Rationalize({stage}:{stage:number}){
 if(stage===0)return <>{lines(m`\frac1{2+\sqrt3}\cdot\frac{2-\sqrt3}{2-\sqrt3}`,m`=\frac{2-\sqrt3}{(2+\sqrt3)(2-\sqrt3)}`)}<p><MathText text={m`掛けた分数は $1$ です。`}/></p></>;
 if(stage===1)return <><Product rows={['2',m`\sqrt3`]} cols={['2',m`-\sqrt3`]} cells={ [['4',m`-2\sqrt3`],[m`2\sqrt3`,'-3']] } highlight={['0,1','1,0']}/>{lines(m`-2\sqrt3+2\sqrt3=0`)}</>;
 return <>{lines(m`(2+\sqrt3)(2-\sqrt3)=1`,m`\frac1{2+\sqrt3}=2-\sqrt3`)}</>;
}
function Absolute({stage}:{stage:number}){
 return <>{stage===0&&lines('|x+2|=|x-(-2)|')}{stage===1&&lines('-2-3=-5','-2+3=1')}<Math1AlgebraNumberLine min={-6} max={2} marks={[-5,-2,1]} rows={stage===0?[{label:'中心 $-2$',points:[-2]}]:stage===1?[{label:'中心から距離 $3$ の境界',points:[-5,1]}]:[{label:'$-5<x<1$',ranges:[{from:-5,to:1,openFrom:true,openTo:true}]}]}/></>;
}
function Intersection({stage}:{stage:number}){
 return <Math1AlgebraNumberLine min={0} max={5} marks={stage<2?[1,4]:[2]} rows={stage<2?[
  {label:'$x>1$',ranges:[{from:1,to:null,openFrom:true}]},{label:m`$x\le4$`,ranges:[{from:null,to:4}]},...(stage===1?[{label:m`共通部分 $1<x\le4$`,ranges:[{from:1,to:4,openFrom:true}]}]:[])
 ]:[{label:stage===2?m`$x\ge2$`:'$x>2$',ranges:[{from:2,to:null,openFrom:stage===3}]},{label:m`$x\le2$`,ranges:[{from:null,to:2}]},{label:stage===2?'共通部分 $x=2$':'共通部分なし',points:stage===2?[2]:[]}]}/>;
}
function Modeling({stage}:{stage:number}){
 if(stage===0)return <div className="m1alg-quantity"><div><span>品物代</span><F tex="120x"/><small>円</small></div><div><span>送料</span><F tex="200"/><small>円</small></div><div><span>合計の上限</span><F tex="1000"/><small>円</small></div></div>;
 if(stage===1)return <>{lines(m`120x+200\le1000`,m`120x\le800`,m`x\le\frac{20}{3}`)}</>;
 if(stage===2)return <>{lines(m`6<\frac{20}{3}<7`)}<Math1AlgebraNumberLine min={4.5} max={7.5} marks={[5,6,7]} rows={[{label:'条件を満たす整数のうち、上限に近い点',points:[5,6]}]}/>{lines(m`\text{最大 }6\text{ 個}`)}</>;
 return <div className="m1alg-quantity"><div><F tex="6\text{ 個}"/><F tex="120\cdot6+200"/><F tex="=920\le1000"/></div><div><F tex="7\text{ 個}"/><F tex="120\cdot7+200"/><F tex="=1040>1000"/></div></div>;
}
export default function Math1AlgebraDiagram({kind,stage,reduce}:{kind:string;stage:number;reduce:boolean}){
 const name=kind.replace('m1-algebra-','');let content:ReactNode;
 switch(name){
  case 'repeat':content=<Repeating stage={stage}/>;break;case 'scope':content=<Scope stage={stage}/>;break;
  case 'coefficient':content=<Coefficient stage={stage}/>;break;case 'collect':content=<Collect stage={stage}/>;break;
  case 'distribute':content=<Distribute stage={stage}/>;break;case 'square':content=<Square stage={stage}/>;break;
  case 'common':content=<Common stage={stage}/>;break;case 'quadratic':content=<Quadratic stage={stage}/>;break;
  case 'grouping':content=<Grouping stage={stage}/>;break;case 'roots':content=<Roots stage={stage}/>;break;
  case 'radicals':content=<Radicals stage={stage}/>;break;case 'rationalize':content=<Rationalize stage={stage}/>;break;
  case 'absolute':content=<Absolute stage={stage}/>;break;case 'intersection':content=<Intersection stage={stage}/>;break;
  case 'modeling':content=<Modeling stage={stage}/>;break;default:return null;
 }
 if(!kind.startsWith('m1-algebra-'))return null;
 return <div className="m1alg-diagram" data-kind={kind} data-stage={stage} data-reduce={reduce}>{content}</div>;
}
