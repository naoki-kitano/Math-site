'use client';
import {useEffect,useRef} from 'react';
import type {CSSProperties,ReactNode} from 'react';
import {Formula,MathText} from './MathText';
const m=String.raw,teal='#176c82',ochre='#936114',ink='#20364e';
const rowStyle:CSSProperties={display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:8,margin:'4px 0'};
const F=({tex}:{tex:string})=><Formula tex={tex}/>;
function Row({children}:{children:ReactNode}){return <div style={rowStyle}>{children}</div>;}
function Box({label,tex,children,tone=ink,muted=false}:{label?:string;tex?:string;children?:ReactNode;tone?:string;muted?:boolean}){
 return <div style={{minWidth:0,padding:'8px 10px',border:`1px solid ${muted?'#d5dde5':tone}`,borderRadius:8,background:muted?'#f3f6f8':'#fff',color:muted?'#64748b':tone,textAlign:'center'}}>
  {label&&<div style={{fontSize:14,marginBottom:3}}><MathText text={label}/></div>}{tex&&<F tex={tex}/>} {children}
 </div>;
}
function Result({tex}:{tex:string}){return <div style={{textAlign:'center',marginTop:8,lineHeight:1.6}}><Formula tex={m`\displaystyle ${tex}`}/></div>;}
function Grid({children,columns=2}:{children:ReactNode;columns?:number}){return <div style={{display:'grid',gridTemplateColumns:`repeat(${columns},minmax(0,1fr))`,gap:8,margin:'4px 0'}}>{children}</div>;}
function PairGrid({stage,prefix=false}:{stage:number;prefix?:boolean}){
 return <><div aria-label="一つ目と二つ目の選択の組" style={{display:'grid',gridTemplateColumns:'3rem repeat(2,minmax(0,1fr))',gap:5,margin:'12px 0',textAlign:'center',alignItems:'center'}}>
  <span style={{fontSize:14}}>{prefix?'パン':'シャツ'}</span>{[1,2].map(j=><span style={{fontSize:14}} key={'h'+j}><MathText text={`${prefix?'飲み物':'帽子'} $${j}$`}/></span>)}
  {[1,2,3].map(i=><div key={i} style={{display:'contents'}}><F tex={String(i)}/>{[1,2].map(j=><Box key={j} tone={i===1?teal:ink} muted={stage===0&&i>1}><span style={{visibility:stage===0&&i>1?'hidden':'visible'}}><F tex={`(${i},${j})`}/></span></Box>)}</div>)}
 </div>{stage===2&&<Result tex={m`3\times2=6`}/>}</>;
}
function SumProduct({stage}:{stage:number}){
 if(stage>0)return <PairGrid stage={stage} prefix/>;
 return <><Grid><Box label="ケーキ" tone={teal}><Row>{['C_1','C_2','C_3'].map(t=><F tex={t} key={t}/>)}</Row></Box><Box label="アイス" tone={ochre}><Row>{['I_1','I_2'].map(t=><F tex={t} key={t}/>)}</Row></Box></Grid><Result tex="3+2=5"/></>;
}
function Changing({stage}:{stage:number}){
 const zero=<Box label="一の位が $0$" tone={teal}><Row><F tex="10"/><F tex="20"/><F tex="30"/></Row></Box>;
 const two=<Box label="一の位が $2$" tone={ochre}><Row><F tex="12"/><F tex="32"/></Row></Box>;
 if(stage===0)return <>{zero}<Row><Box label="十の位の候補" tex="1,2,3"/><F tex={m`\longrightarrow`}/><F tex="3"/></Row></>;
 if(stage===1)return <>{two}<Row><Box label="先頭には置けない" tex="0" muted/><Box label="一の位に使用済み" tex="2" muted/></Row><Result tex="2"/></>;
 return <>{zero}<div style={{height:8}}/>{two}<Result tex="3+2=5"/></>;
}
function Sets({stage}:{stage:number}){
 if(stage===0)return <Grid columns={3}><Box label="犬だけ" tex="7" tone={teal}/><Box label="両方" tex="5" tone={ochre}/><Box label="猫だけ" tex="4" tone={teal}/></Grid>;
 if(stage===1)return <><Row><span>犬好き</span><F tex="12="/><Box tex="7" tone={teal}/><F tex="+"/><Box label="共通の人" tex="5" tone={ochre}/></Row><Row><span>猫好き</span><F tex="9="/><Box label="共通の人" tex="5" tone={ochre}/><F tex="+"/><Box tex="4" tone={teal}/></Row></>;
 if(stage===2)return <><Grid columns={3}><Box label="犬だけ" tex="7" tone={teal}/><Box label="両方を一回" tex="5" tone={ochre}/><Box label="猫だけ" tex="4" tone={teal}/></Grid><Result tex="12+9-5=16"/></>;
 return <><Grid><Box label="少なくとも一方" tex="16" tone={teal}/><Box label="どちらでもない" tex="4" tone={ochre}/></Grid><Result tex="20-16=4"/></>;
}
function Slots({stage,repeated=false}:{stage:number;repeated?:boolean}){
 const labels=repeated?['先頭','二桁目','三桁目']:['一番目','二番目','三番目'];
 const values=repeated?[stage===2?'3':'4','4','4']:['5','4','3'];
 return <>{repeated&&<div style={{textAlign:'center',fontSize:14}}>各桁の候補数</div>}<Grid columns={3}>{labels.map((label,i)=><Box label={label} key={label} tone={i===0?teal:ink} muted={!repeated&&stage===0&&i>0}>
  <span style={{visibility:!repeated&&stage===0&&i>0?'hidden':'visible'}}><F tex={values[i]}/></span>
 </Box>)}</Grid>{repeated?(stage>0&&<Result tex={stage===1?m`4\times4\times4=64`:m`3\times4\times4=48`}/>):stage===2&&<Result tex={m`{}_5P_3=5\times4\times3=60`}/>}</>;
}
function Adjacent({stage}:{stage:number}){
 if(stage===0)return <Row><Box label="一つのまとまり" tex="AB" tone={teal}/><Box tex="C"/><Box tex="D"/></Row>;
 if(stage===1)return <><Grid columns={2}>{['(AB)CD','(AB)DC','C(AB)D','D(AB)C','CD(AB)','DC(AB)'].map(v=><Box key={v} tex={v}/>)}</Grid><Result tex="3!=6"/></>;
 return <><Box label="外側の一つの配置"><Row><Box tex="AB" tone={teal}/><F tex="CD"/></Row><Row><Box tex="BA" tone={teal}/><F tex="CD"/></Row></Box><Result tex={m`3!\times2=12`}/></>;
}
const circlePoint=(i:number,turn:number)=>{const angle=-Math.PI/2+(i+turn)*Math.PI/2;return [130+67*Math.cos(angle),104+67*Math.sin(angle)];};
function Circle({stage,reduce}:{stage:number;reduce:boolean}){
 const groups=useRef<(SVGGElement|null)[]>([]),prior=useRef(stage);
 const turn=stage===1?1:0;
 useEffect(()=>{
  const from=prior.current===1?1:0;prior.current=stage;
  if(from===turn||reduce||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const animations=groups.current.map((el,i)=>el?.animate(Array.from({length:17},(_,j)=>{const p=circlePoint(i,from+(turn-from)*j/16);return {transform:`translate(${p[0]}px,${p[1]}px)`};}),{duration:650,easing:'ease-in-out'}));
  return()=>animations.forEach(a=>a?.cancel());
 },[stage,turn,reduce]);
 return <><svg viewBox="0 0 260 200" role="img" aria-label={stage===3?'番号付きの四席に、四人が座る配置':'Aから時計回りにB、C、Dの順に座る同じ円順列'} style={{display:'block',width:'100%',maxWidth:210,margin:'auto'}}>
  <circle cx="130" cy="104" r="42" fill="#eef7f6" stroke="#b4cfce"/>
  {stage===3&&[0,1,2,3].map(i=>{const p=circlePoint(i,0);return <foreignObject x={p[0]+20} y={p[1]-12} key={i} width="25" height="30"><div style={{fontSize:17,lineHeight:1.35,color:ochre}}><F tex={String(i+1)}/></div></foreignObject>;})}
  {['A','B','C','D'].map((name,i)=>{const p=circlePoint(i,turn);return <g key={name} ref={el=>{groups.current[i]=el;}} style={{transform:`translate(${p[0]}px,${p[1]}px)`}}><circle r="18" fill={i===0?'#e8f4f6':'white'} stroke={i===0?teal:'#bccbd9'}/><foreignObject x="-17" y="-15" width="34" height="40"><div style={{textAlign:'center',fontSize:20,lineHeight:1.35}}><F tex={name}/></div></foreignObject></g>;})}
 </svg>{stage>=2&&<Result tex={stage===2?'3!=6':'4!=24'}/>}</>;
}
const unordered=['AB','AC','AD','BC','BD','CD'];
function Combination({stage}:{stage:number}){
 if(stage===0)return <><Grid columns={4}>{unordered.flatMap(pair=>[pair,[...pair].reverse().join('')]).map(pair=><Box key={pair} tex={pair}/>)}</Grid><Result tex={m`4\times3=12`}/></>;
 return <><Grid columns={2}>{unordered.map(pair=><Box key={pair} tone={teal}><F tex={`${pair}\\leftrightarrow ${[...pair].reverse().join('')}`}/></Box>)}</Grid><Result tex={stage===1?'2!=2':m`{}_4C_2=\frac{12}{2!}=6`}/></>;
}
function Order({stage}:{stage:number}){
 return stage===0?<><Row><Box label="持っていく組" tex={m`\{A,B\}`} tone={teal}/><F tex="="/><Box label="持っていく組" tex={m`\{B,A\}`} tone={teal}/></Row></>:<><Grid><Box label="左 → 右" tex="AB" tone={teal}/><Box label="左 → 右" tex="BA" tone={ochre}/></Grid><Result tex={m`(A,B)\ne(B,A)`}/></>;
}
function Identical({stage}:{stage:number}){
 const first=stage===0?'A_1A_2BC':'AABC',second=stage===0?'A_2A_1BC':'AABC';
 return <><Grid><Box label={stage===0?'仮番号付き':'番号を消した列'} tex={first} tone={teal}/><Box label={stage===0?'仮番号を交換':'同じ列'} tex={second} tone={teal}/></Grid>{stage===0?<Result tex="4!=24"/>:stage===1?<Result tex={m`\text{一つの並びに }2!\text{ 通り}`}/>:<Result tex={m`\frac{4!}{2!}=12`}/>}</>;
}
function Path({stage}:{stage:number}){
 const path=[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]];
 return <><svg viewBox="0 0 260 185" role="img" aria-label="右、上、右、上、右の順に進む最短経路の一例" style={{display:'block',width:'100%',maxWidth:210,margin:'auto'}}>
  {[0,1,2,3].map(i=><line key={'v'+i} x1={30+i*65} x2={30+i*65} y1="25" y2="155" stroke="#ccd8e2"/>)}{[0,1,2].map(i=><line key={'h'+i} x1="30" x2="225" y1={25+i*65} y2={25+i*65} stroke="#ccd8e2"/>)}
  {path.slice(1).map(([x,y],i)=><line key={i} x1={30+path[i][0]*65} y1={155-path[i][1]*65} x2={30+x*65} y2={155-y*65} stroke={x===path[i][0]?ochre:teal} strokeWidth="4"/>)}
  {[[8,143,'S'],[229,8,'G']].map(([x,y,name])=><foreignObject key={name} x={Number(x)} y={Number(y)} width="25" height="36"><div style={{fontSize:19,lineHeight:1.35}}><F tex={String(name)}/></div></foreignObject>)}
 </svg><Row>{['右','上','右','上','右'].map((direction,i)=><span key={i} style={{color:direction==='右'?teal:ochre}}>{direction}{i<4&&<F tex={m`\rightarrow`}/>}</span>)}</Row>{stage===1&&<Result tex={m`\frac{5!}{3!2!}=10`}/>}</>;
}
function Grouping({stage}:{stage:number}){
 if(stage===2)return <><Grid><Box label="赤組 → 白組" tex={m`AB\mid CD`} tone={teal}/><Box label="赤組 → 白組" tex={m`CD\mid AB`} tone={ochre}/></Grid><Result tex={m`{}_4C_2=6`}/></>;
 return <><div style={{display:'grid',gap:8}}>{[['AB','CD'],['AC','BD'],['AD','BC']].map(([a,b])=><Box key={a} tone={teal} ><Row><F tex={`${a}\\mid ${b}`}/><span>{stage===0?'・':'と'}</span><F tex={`${b}\\mid ${a}`}/></Row></Box>)}</div><Result tex={stage===0?m`{}_4C_2=6`:m`\frac{{}_4C_2}{2}=3`}/></>;
}
function Complement({stage}:{stage:number}){
 return <><Grid columns={2}>{[4,18,12,1].map((count,girls)=><Box key={girls} label={`女子 $${girls}$ 人`} tex={String(count)} tone={girls===0?ochre:teal} muted={stage>0&&girls===0}/>)}</Grid>{stage===0?<Result tex="4+18+12+1=35"/>:stage===1?<Result tex="18+12+1"/>:stage===2?<Result tex="35-4=31"/>:<><Result tex={m`{}_3C_1{}_4C_2=18`}/><Result tex={m`{}_3C_2{}_4C_1=12`}/><Result tex="18+12+1=31"/></>}</>;
}
export default function MathACountingStructure({kind,stage,reduce}:{kind:string;stage:number;reduce:boolean}){
 const name=kind.replace('ma-counting-','');
 const content=name==='listing'?<PairGrid stage={stage}/>:name==='sum-product'?<SumProduct stage={stage}/>:name==='changing'?<Changing stage={stage}/>:name==='sets'?<Sets stage={stage}/>:name==='permutation'?<Slots stage={stage}/>:name==='repeated'?<Slots stage={stage} repeated/>:name==='adjacent'?<Adjacent stage={stage}/>:name==='circle'?<Circle stage={stage} reduce={reduce}/>:name==='combination'?<Combination stage={stage}/>:name==='order'?<Order stage={stage}/>:name==='identical'?<Identical stage={stage}/>:name==='path'?<Path stage={stage}/>:name==='grouping'?<Grouping stage={stage}/>:name==='complement'?<Complement stage={stage}/>:null;
 return content?<div data-kind={kind} data-stage={stage} style={{maxWidth:440,margin:'0 auto'}}>{content}</div>:null;
}
