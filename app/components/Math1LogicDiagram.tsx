import {Formula,MathText} from './MathText';
const m=String.raw;
const F=({tex}:{tex:string})=><Formula tex={tex}/>;
function Card({label,tex,tone='',children}:{label:string;tex?:string;tone?:string;children?:React.ReactNode}){
 return <div className={`m1-logic-card ${tone}`}><span className="m1-logic-label"><MathText text={label}/></span>{tex&&<F tex={tex}/>} {children&&<div className="m1-logic-card-body">{children}</div>}</div>;
}
function Pair({left,right}:{left:React.ReactNode;right:React.ReactNode}){return <div className="m1-logic-pair">{left}{right}</div>;}
function Range({label,from,to,min=0,max=5,openFrom=false,openTo=false,leftRay=false,rightRay=false,marks=[1,3],tone='teal',point}:{label:string;from:number;to:number;min?:number;max?:number;openFrom?:boolean;openTo?:boolean;leftRay?:boolean;rightRay?:boolean;marks?:number[];tone?:string;point?:number}){
 const at=(x:number)=>8+84*(x-min)/(max-min);
 return <div className={`m1-logic-range ${tone}`}><p><MathText text={label}/></p><div className="m1-logic-axis" role="img" aria-label={label.replaceAll('$','')}>
  <div className="m1-logic-axis-line"/>
  <div className="m1-logic-band" style={{left:`${at(from)}%`,width:`${at(to)-at(from)}%`}}/>
  {leftRay?<i className="m1-logic-ray left" style={{left:`${at(from)}%`}}/>:<i className={`m1-logic-dot ${openFrom?'open':''}`} style={{left:`${at(from)}%`}}/>}
  {rightRay?<i className="m1-logic-ray" style={{left:`${at(to)}%`}}/>:<i className={`m1-logic-dot ${openTo?'open':''}`} style={{left:`${at(to)}%`}}/>}
  {marks.map(x=><span className="m1-logic-tick" style={{left:`${at(x)}%`}} key={x}><F tex={String(x)}/></span>)}
  {point!==undefined&&<span className="m1-logic-probe" style={{left:`${at(point)}%`}}><F tex={String(point)}/></span>}
 </div></div>;
}
function Sets({stage}:{stage:number}){
 if(stage===2)return <Pair left={<Card label="数" tex="3" tone="teal"/>} right={<Card label="集合" tex={m`\{3\}`} tone="ochre"><p>要素は一つ</p></Card>}/>;
 if(stage===3)return <Pair left={<Card label="空集合" tex={m`\varnothing`}><p>要素はない</p></Card>} right={<Card label="ゼロを含む集合" tex={m`\{0\}`} tone="teal"><p>要素は一つ</p></Card>}/>;
 return <><Pair left={<Card label="対象"><MathText text={stage===0?'整数 $x$':'実数 $x$'}/></Card>} right={<Card label="条件" tex={m`1\le x<4`}/>}/>
 {stage===0?<><div className="m1-logic-integers" role="img" aria-label="整数1、2、3が条件を満たす。0と4は満たさない。">{[0,1,2,3,4].map(x=><div key={x} className={x>=1&&x<4?'selected':''}><F tex={String(x)}/><i/></div>)}</div><div className="m1-logic-result"><F tex={m`\{1,2,3\}`}/></div></>:<><Range label="実数の範囲" from={1} to={4} openTo marks={[1,4]}/><p className="m1-logic-result"><MathText text={m`$1<\frac32<4$ だから $\frac32$ も入る`}/></p></>}
 </>;
}
function Operations({stage}:{stage:number}){
 const chosen=stage===0?[3]:stage===1?[1,2,3,4,5]:[4,5,6];
 return <><div className="m1-logic-definition"><p><MathText text={m`$U=\{1,2,3,4,5,6\}$`}/></p><p><MathText text={m`$A=\{1,2,3\}$、$B=\{3,4,5\}$`}/></p></div><div className="m1-logic-elements">{[1,2,3,4,5,6].map(x=><div className={`m1-logic-element ${chosen.includes(x)?'selected':''}`} key={x}><F tex={String(x)}/><small><MathText text={x===3?'$A$ と $B$':x<3?'$A$':x<6?'$B$':'どちらにも入らない'}/></small></div>)}</div><div className="m1-logic-result"><F tex={stage===0?m`A\cap B=\{3\}`:stage===1?m`A\cup B=\{1,2,3,4,5\}`:m`\overline A=\{4,5,6\}`}/></div></>;
}
function Counterexample({stage}:{stage:number}){
 const good=stage===0;
 return <><div className="m1-logic-definition"><F tex="x^2=4"/><span>ならば</span><F tex="x=2"/></div><p className="m1-logic-candidate"><MathText text={good?'候補 $x=-2$':'候補 $x=0$'}/></p><Pair left={<Card label="仮定" tex={good?'(-2)^2=4':m`0^2\ne4`} tone="teal"><p>{good?'満たす':'満たさない'}</p></Card>} right={<Card label="結論" tex={good?m`-2\ne2`:m`0\ne2`} tone="ochre"><p>満たさない</p></Card>}/><p className="m1-logic-result">{good?'二つがそろうので反例':'仮定の外なので反例ではない'}</p></>;
}
function Inclusion({stage}:{stage:number}){
 return <><Range label={m`$P$：$p:x>3$ を満たす範囲`} from={3} to={5} openFrom rightRay point={stage===2?2:undefined}/><Range label={m`$Q$：$q:x>1$ を満たす範囲`} from={1} to={5} openFrom rightRay tone="ochre" point={stage===2?2:undefined}/><div className="m1-logic-result">{stage===0?<F tex={m`P\subseteq Q`}/>:stage===1?<><F tex={m`P\subseteq Q`}/><span>だから</span><F tex={m`p\Rightarrow q`}/></>:<><F tex={m`2\in Q,\quad2\notin P`}/><p><MathText text={m`$q\Rightarrow p$ は偽`}/></p></>}</div></>;
}
function Necessary({stage}:{stage:number}){
 return <><Pair left={<Card label="$p$" tex="x=2" tone="teal"><F tex={m`P=\{2\}`}/></Card>} right={<Card label="$q$" tex="x^2=4" tone="ochre"><F tex={m`Q=\{-2,2\}`}/></Card>}/>
 {stage===0?<Card label="$p$ から $q$" tex={m`2^2=4`}><p><MathText text="$p$ は $q$ の十分条件"/></p></Card>:stage===1?<Card label="$q$ から $p$" tex={m`(-2)^2=4`}><MathText text={m`でも $-2\ne2$`}/><p><MathText text="$p$ は $q$ の必要条件ではない"/></p></Card>:<Card label="成り立つ向き" tex={m`p\Rightarrow q`}><p><MathText text="$p$ は $q$ の十分条件"/></p><p><MathText text="$q$ は $p$ の必要条件"/></p></Card>}
 </>;
}
function ConditionRow({label,left,join,right}:{label:string;left:string;join:string;right:string}){return <div className="m1-logic-condition"><span className="m1-logic-label">{label}</span><div className="m1-logic-condition-parts"><F tex={left}/><span>{join}</span><F tex={right}/></div></div>;}
function Quantifier({all}:{all:boolean}){
 return <><div className="m1-logic-quantifier"><span className="m1-logic-label">元の文</span><span className="m1-logic-word">{all?'すべての':'ある'}</span><span><MathText text={all?'実数 $x$':'整数 $n$'}/></span><span>{all?'について':'が存在して'}</span><F tex={all?m`x^2\ge0`:'n^2=2'}/></div><div className="m1-logic-quantifier"><span className="m1-logic-label">否定</span><span className="m1-logic-word">{all?'ある':'すべての'}</span><span><MathText text={all?'実数 $x$':'整数 $n$'}/></span><span>{all?'が存在して':'について'}</span><F tex={all?'x^2<0':m`n^2\ne2`}/></div></>;
}
function Negation({stage}:{stage:number}){
 if(stage===0)return <><Range label="元の条件：$x>2$" from={2} to={5} openFrom rightRay min={-1} marks={[2]}/><Range label={m`否定：$x\le2$`} from={-1} to={2} leftRay min={-1} marks={[2]} tone="ochre"/></>;
 if(stage>=3)return <Quantifier all={stage===3}/>;
 return <><ConditionRow label="この条件全体を否定" left={stage===1?'x>0':'x<0'} join={stage===1?'かつ':'または'} right={stage===1?'y>0':'y<0'}/><ConditionRow label="否定" left={stage===1?m`x\le0`:m`x\ge0`} join={stage===1?'または':'かつ'} right={stage===1?m`y\le0`:m`y\ge0`}/></>;
}
function Implication({left,right,nleft=false,nright=false}:{left:'p'|'q';right:'p'|'q';nleft?:boolean;nright?:boolean}){
 const tex=(v:string,neg:boolean)=>v==='p'?(neg?m`x\ne2`:'x=2'):(neg?m`x^2\ne4`:'x^2=4');
 return <div className="m1-logic-implication"><Card label={`$${nleft?'\\neg ':''}${left}$`} tex={tex(left,nleft)} tone={left==='p'?'teal':'ochre'}/><F tex={m`\Rightarrow`}/><Card label={`$${nright?'\\neg ':''}${right}$`} tex={tex(right,nright)} tone={right==='p'?'teal':'ochre'}/></div>;
}
function Transform({stage}:{stage:number}){
 if(stage===3)return <><Card label="元の命題が偽となる場合"><MathText text="$p$ が真、$q$ が偽"/></Card><Card label="対偶が偽となる場合"><MathText text={m`$\neg q$ が真、$\neg p$ が偽`}/><p><MathText text="つまり $q$ が偽、$p$ が真"/></p></Card></>;
 return <><span className="m1-logic-label">元の命題</span><Implication left="p" right="q"/><span className="m1-logic-label">{['逆','裏','対偶'][stage]}</span><Implication left={stage===1?'p':'q'} right={stage===1?'q':'p'} nleft={stage>0} nright={stage>0}/></>;
}
function IntegerForm({factor,inside,extra}:{factor:string;inside:string;extra:string}){
 return <div className="m1-logic-integer-form"><div><F tex={factor}/></div><div className="m1-logic-integer-slot"><span>整数</span></div><div><F tex={extra}/></div><div><F tex={factor}/></div><div className="m1-logic-integer-slot"><F tex={inside}/><small>ここが整数</small></div><div><F tex={extra}/></div></div>;
}
function Direct({stage}:{stage:number}){
 if(stage===0)return <Pair left={<Card label="偶数 $a$" tex="2r" tone="teal"><p><MathText text="$r$ は整数"/></p></Card>} right={<Card label="奇数 $b$" tex="2s+1" tone="ochre"><p><MathText text="$s$ は整数"/></p></Card>}/>;
 if(stage===1)return <><p><F tex="a+b=2r+(2s+1)"/></p><IntegerForm factor="2\times" inside="(r+s)" extra="+1"/><p className="m1-logic-result">和は奇数</p></>;
 if(stage===2)return <><div className="m1-logic-consecutive">{['n','n+1','n+2'].map((tex,i)=><div key={tex}><F tex={tex}/>{i<2&&<span className="m1-logic-increment"><F tex="+1"/></span>}</div>)}</div><p className="m1-logic-result"><MathText text="$n$ は整数。隣との差は $1$。"/></p></>;
 return <><p><F tex="n+(n+1)+(n+2)"/></p><IntegerForm factor="3\times" inside="(n+1)" extra=""/><p className="m1-logic-result">和は三の倍数</p></>;
}
function Proof({contradiction,stage}:{contradiction:boolean;stage:number}){
 if(contradiction)return <><Card label="保つ仮定" tex="a+b>0" tone="teal"/>{stage>0&&<Card label="結論を否定して置く条件" tex={m`a\le0,\quad b\le0`} tone="ochre"><p><MathText text={m`足すと $a+b\le0$`}/></p></Card>}{stage===2&&<div className="m1-logic-conflict"><F tex="a+b>0"/><span>両立しない</span><F tex={m`a+b\le0`}/></div>}</>;
 return <><Card label="元の命題"><p><MathText text="$a+b>0$ ならば"/></p><MathText text="$a>0$ または $b>0$"/></Card><Card label="対偶の仮定：結論全体の否定" tex={m`a\le0,\quad b\le0`} tone="ochre"/>{stage>0&&<Card label="不等式を足して得る結論" tex={m`a+b\le0`} tone="teal"><p>元の仮定の否定</p></Card>}{stage===2&&<p className="m1-logic-result">対偶が真なので、元の命題も真</p>}</>;
}
export default function Math1LogicDiagram({kind,stage}:{kind:string;stage:number;reduce:boolean}){
 const topic=kind.replace('m1-logic-','');
 const contents=topic==='sets'?<Sets stage={stage}/>:topic==='operations'?<Operations stage={stage}/>:topic==='counterexample'?<Counterexample stage={stage}/>:topic==='inclusion'?<Inclusion stage={stage}/>:topic==='necessary'?<Necessary stage={stage}/>:topic==='negation'?<Negation stage={stage}/>:topic==='transform'?<Transform stage={stage}/>:topic==='direct'?<Direct stage={stage}/>:topic==='contra-proof'?<Proof contradiction={false} stage={stage}/>:topic==='contradiction'?<Proof contradiction stage={stage}/>:null;
 return contents?<div className="m1-logic-diagram">{contents}</div>:null;
}
