import type {ReactNode} from 'react';
import {Formula} from './MathText';
import CoordinateDiagram from './CoordinateDiagram';
const m=String.raw,teal='#176c82',ochre='#936114';
type Props={kind:string;stage:number;reduce:boolean};
function Label({x,y,tex,width=92,color='#263c53'}:{x:number;y:number;tex:string;width?:number;color?:string}){
 return <foreignObject x={x-width/2} y={y-18} width={width} height="45"><div className="m2-geometry-label" style={{color}}><Formula tex={tex}/></div></foreignObject>;
}
function Frame({children,label,reduce,height=240}:{children:ReactNode;label:string;reduce:boolean;height?:number}){
 return <svg className={`m2-geometry-svg ${reduce?'m2-reduce':''}`} viewBox={`0 0 320 ${height}`} role="img" aria-label={label}>{children}</svg>;
}
function Section({stage,reduce}:Omit<Props,'kind'>){
 const moved=stage>0;
 return <Frame label="横の座標だけを数直線に示す。横の変化6を三等分し、Aの横座標から一つ分進む。" reduce={reduce} height={220}>
  <path d="M40 90H280" stroke="#a9bac6" strokeWidth="4"/>
  {[40,120,200,280].map(x=><path key={x} d={`M${x} 82V98`} stroke="#64798e" strokeWidth="2"/>)}
  {stage!==2&&[80,160,240].map((x,i)=><Label key={x} x={x} y={119} tex="2" width={35} color={i===0?teal:'#64798e'}/>)}
  <path d="M40 140v8H280v-8" stroke="#64798e" fill="none"/>
  <Label x={160} y={175} tex={stage===2?'c-a':'6'} width={100}/><text x="160" y="209" textAnchor="middle" className="m2-geometry-text">横の変化</text>
  <Label x={44} y={30} tex={stage===2?'x_A=a':'x_A=0'} width={88}/><Label x={276} y={30} tex={stage===2?'x_B=c':'x_B=6'} width={88}/>
  {!moved&&<><circle cx="120" cy="90" r="4" fill="white" stroke={teal}/><Label x={120} y={66} tex="x_P" width={80} color={teal}/></>}
  <path d="M40 90H120" stroke={teal} strokeWidth="5" style={{opacity:moved?1:0,transition:reduce?'none':'opacity .6s'}}/>
  <g className="m2-section-point" style={{transform:`translate(${moved?80:0}px,0)`,opacity:moved?1:0,transition:reduce?'none':'transform .8s ease,opacity .4s'}}>
   <circle cx="40" cy="90" r="5" fill={teal}/><Label x={40} y={66} tex={stage===2?'x_P':'x_P=2'} width={95} color={teal}/>
  </g>
 </Frame>;
}
function Distance({stage,reduce}:Omit<Props,'kind'>){
 return <Frame label="右へ3、下へ4の変化を直角三角形の二辺へ対応させ、斜辺ABを求める" reduce={reduce} height={254}>
  <path d="M70 45H190V205" fill="none" stroke="#d9e1e8" strokeWidth="2"/>
  <path d="M70 45H190" stroke={teal} strokeWidth="3"/><path d="M190 45V205" stroke={ochre} strokeWidth="3"/>
  <path d="M178 45V57H190" fill="none" stroke="#8192a4"/>
  <path d="M70 45L190 205" stroke="#0b1f3a" strokeWidth={stage===2?4:2}/>
  <Label x={55} y={24} tex="A" width={40}/><Label x={206} y={237} tex="B" width={40}/>
  <Label x={132} y={24} tex="3" color={teal} width={38}/><Label x={225} y={126} tex="4" color={ochre} width={38}/>
  <Label x={90} y={157} tex={stage===2?'AB=5':'AB'} width={100}/>
  <text x="252" y="160" textAnchor="middle" className="m2-geometry-text">下向き</text>
 </Frame>;
}
function PointSlope({stage,reduce}:Omit<Props,'kind'>){
 const left=stage===2;
 return <Frame label={left?'点Aから左下へ進む場合、横と縦の変化はともに負。':'点Aから右上の点Pまでの横と縦の差を示す。'} reduce={reduce} height={255}>
  <path d="M100 250L215 20" stroke={teal} strokeWidth="2.5"/>
  <circle cx="150" cy="150" r="4" fill="#0b1f3a"/>
  <path d={left?'M150 150H110V230':'M150 150H205V40'} stroke="#8195a9" fill="none" strokeDasharray="5 4"/>
  <Label x={left?178:125} y={150} tex="A" width={40}/>
  <circle cx={left?110:205} cy={left?230:40} r="5" fill={ochre}/>
  <Label x={left?88:205} y={left?238:20} tex="P" width={40}/>
  {left?<><Label x={130} y={125} tex={m`\Delta x<0`} width={110} color={teal}/><Label x={63} y={190} tex={m`\Delta y<0`} width={110} color={ochre}/></>:<><Label x={182} y={180} tex="x-(-1)" width={120} color={teal}/><Label x={258} y={100} tex="y-(-2)" width={120} color={ochre}/></>}
 </Frame>;
}
function Perpendicular({stage,reduce}:Omit<Props,'kind'>){
 if(stage===2)return <CoordinateDiagram directLabels compact title="指定点を通る垂線" description="傾きは負の二分の一。点P(0,1)を通る直線。" xRange={[-3,3]} yRange={[-2,4]} curves={[{label:'$y-1=-\\dfrac12x$',value:x=>1-x/2}]} points={[{x:0,y:1,label:'$P(0,1)$'}]}/>;
 const turned=stage>0;
 return <Frame label="右1上2の矢印を直角に回すと、左2上1になる。横の変化は負で、辺の長さは正。" reduce={reduce} height={255}>
  <path d="M28 173H294 M166 35V227" stroke="#bdc8d3" fill="none"/>
  <path d="M166 173L215 75" stroke="#ccd8df" strokeWidth="3"/>
  <path d={turned?'M166 173H68V124':'M166 173H215V75'} stroke="#bdc8d3" fill="none" strokeDasharray="4 4"/>
  <g className="m2-direction-arrow" style={{transformOrigin:'166px 173px',transform:turned?'rotate(-90deg)':'rotate(0deg)',transition:reduce?'none':'transform .9s ease'}}>
   <path d="M166 173L215 75 M204 83L215 75L215 90" fill="none" stroke={teal} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <Label x={turned?115:193} y={203} tex={turned?'-2':'1'} color={teal} width={50}/>
  <Label x={turned?43:246} y={turned?148:125} tex={turned?'1':'2'} color={ochre} width={40}/>
  <Label x={289} y={192} tex="x" width={24}/><Label x={188} y={34} tex="y" width={24}/>
  <text x="160" y="246" textAnchor="middle" className="m2-geometry-text">横・縦の符号付きの変化</text>
 </Frame>;
}
function LineDistance({stage,reduce}:Omit<Props,'kind'>){
 return <div className="m2-line-distance">
  {stage<2&&<div className="m2-role-grid"><div><span>直線の係数</span><Formula tex={m`{\color{#176c82}{a=3}},\ b=4,\ c=1`}/></div><div><span>点の座標</span><Formula tex={m`{\color{#936114}{x_0=-1}},\ y_0=-1`}/></div></div>}
  <Frame label="点Pから直線への垂線PH。直線の式全体を二倍しても同じ線で、垂線の長さは変わらない。" reduce={reduce} height={240}>
   <path d="M60 42.5L280 207.5" stroke={teal} strokeWidth="2.5"/>
   <path d="M110 155L146 107" stroke={ochre} strokeWidth="3"/>
   <path d="M140 115L148 121L154 113" fill="none" stroke="#8192a4"/>
   <circle cx="110" cy="155" r="4" fill="#0b1f3a"/><circle cx="146" cy="107" r="4" fill="#0b1f3a"/>
   <Label x={94} y={180} tex="P" width={35}/><Label x={160} y={87} tex="H" width={35}/>
   <Label x={102} y={121} tex={stage>=2?m`\dfrac65`:'d'} color={ochre} width={70}/>
   <Label x={173} y={20} tex={stage===3?'6x+8y+2=0':'3x+4y+1=0'} width={270} color={teal}/>
  </Frame>
 </div>;
}
function ChordTerms({stage,reduce}:Omit<Props,'kind'>){
 return <div className={`m2-chord-terms ${stage?'m2-cancel':''} ${reduce?'m2-reduce':''}`} role="group" aria-label="上の円の式から下の円の式を引き、xの二乗、yの二乗、定数を打ち消す">
  {[['x^2','-2x','+y^2','-4','=0'],['x^2','+2x','+y^2','-4','=0']].map((row,i)=><div key={i} className="m2-chord-row"><span className="m2-chord-sign">{i===1&&stage?<Formula tex="-"/>:null}</span>{row.map((tex,j)=><span key={j} className={j===0||j===2||j===3?'m2-common-term':''}><Formula tex={tex}/></span>)}</div>)}
  {stage>0&&<div className="m2-chord-remainder"><Formula tex="-2x-(+2x)=-4x" display/></div>}
 </div>;
}
function TwoCircles({stage,reduce}:Omit<Props,'kind'>){
 const d=stage===0?4:stage===1?2:3,scale=28,cx=94,cy=127,second=cx+d*scale,T=cx+3*scale;
 return <Frame label={stage===0?'外接では中心と中心の間に接点があり、距離は半径3と1の和。':stage===1?'内接では大きい半径3が、中心間距離2と小さい半径1の和。':'中心間距離3は半径差2と半径和4の間。二円は二点で交わる。'} reduce={reduce} height={268}>
  <circle cx={cx} cy={cy} r={3*scale} stroke={teal} fill="none" strokeWidth="2.5"/><circle cx={second} cy={cy} r={scale} stroke={ochre} fill="none" strokeWidth="2.5"/>
  <circle cx={cx} cy={cy} r="3" fill={teal}/><circle cx={second} cy={cy} r="3" fill={ochre}/>
  <Label x={cx} y={155} tex="C_1" width={55} color={teal}/><Label x={second} y={stage===1?174:155} tex="C_2" width={55} color={ochre}/>
  {stage<2?<><path d={`M${cx} ${cy}H${T}`} stroke={teal} strokeWidth="3"/><path d={`M${second} ${cy}H${T}`} stroke={ochre} strokeWidth="3"/><circle cx={T} cy={cy} r="4" fill="#0b1f3a"/><Label x={T} y={101} tex="T" width={30}/><Label x={(cx+T)/2} y={106} tex="3" color={teal} width={35}/><Label x={(second+T)/2} y={stage===1?205:180} tex="1" color={ochre} width={35}/></>:<>{[-1,1].map(sign=><circle key={sign} cx={cx+scale*17/6} cy={cy+sign*scale*Math.sqrt(35)/6} r="4" fill="#0b1f3a"/>)}<Label x={68} y={66} tex="r=3" color={teal} width={75}/><Label x={second+25} y={89} tex="s=1" color={ochre} width={75}/></>}
  <path d={`M${cx} 222v8H${second}v-8`} fill="none" stroke="#526176"/>
  <Label x={(cx+second)/2} y={254} tex={`d=${d}`} width={100}/>
 </Frame>;
}
export default function Math2GeometryDiagram({kind,stage,reduce}:Props){
 const short=kind.replace('m2-geometry-','');
 if(short==='section')return <Section stage={stage} reduce={reduce}/>;
 if(short==='distance')return <Distance stage={stage} reduce={reduce}/>;
 if(short==='point-slope')return <PointSlope stage={stage} reduce={reduce}/>;
 if(short==='perpendicular')return <Perpendicular stage={stage} reduce={reduce}/>;
 if(short==='line-distance')return <LineDistance stage={stage} reduce={reduce}/>;
 if(short==='chord-terms')return <ChordTerms stage={stage} reduce={reduce}/>;
 if(short==='two-circles')return <TwoCircles stage={stage} reduce={reduce}/>;
 if(short==='completed-circle')return <CoordinateDiagram directLabels compact title="中心と半径" description="中心(1,-1)、半径1の円" xRange={[-1,3]} yRange={[-3,1]} circles={[{x:1,y:-1,r:1,label:m`$(x-1)^2+(y+1)^2=1$`}]}/>;
 if(short==='chord')return <CoordinateDiagram directLabels compact title="差の式を満たす直線と二つの共通点" description="二円の共通点は(0,-2),(0,2)。直線全体が円上にあるのではない。" xRange={[-4,4]} yRange={[-3,3]} circles={[{x:-1,y:0,r:Math.sqrt(5),label:'$(x+1)^2+y^2=5$'},{x:1,y:0,r:Math.sqrt(5),label:'$(x-1)^2+y^2=5$',color:ochre}]} segments={[{from:[0,-3],to:[0,3],dashed:true},{from:[0,-2],to:[0,2],width:4}]} points={[{x:0,y:-2,label:'$P(0,-2)$'},{x:0,y:2,label:'$Q(0,2)$'}]}/>;
 if(short==='tangent')return <CoordinateDiagram directLabels compact hideTickLabels title="半径に垂直な接線" description="半径の横縦の変化は3,4。接線方向の変化は4,-3。" xRange={[-6,7]} yRange={[-6,7]} circles={[{x:-1,y:0,r:5,label:'$(x+1)^2+y^2=25$'}]} curves={stage?[{label:'接線 $3x+4y=22$',value:x=>(22-3*x)/4,color:ochre}]:[]} points={[{x:-1,y:0,label:'$C(-1,0)$',labelOffset:[-23,-12]},{x:2,y:4,label:'$T(2,4)$'}]} segments={stage===0?[{from:[-1,0],to:[2,4],width:3},{from:[-1,0],to:[2,0],dashed:true,label:'横 $3$',labelOffset:[0,23]},{from:[2,0],to:[2,4],dashed:true,label:'縦 $4$'}]:[{from:[-1,0],to:[2,4]},{from:[2,4],to:[6,4],dashed:true,label:'右へ $4$',color:ochre},{from:[6,4],to:[6,1],dashed:true,label:'下へ $3$',color:ochre}]}/>;
 if(short==='circle-line'){
  const y=[2,4,5][stage],d=y-1;
  return <CoordinateDiagram directLabels compact hideTickLabels title="中心から直線への距離" description={`半径3と垂線の長さ${d}を比べる。`} xRange={[-4,4]} yRange={[-3,6]} circles={[{x:0,y:1,r:3,label:'$x^2+(y-1)^2=9$'}]} curves={[{label:`$y=${y}$`,value:()=>y,color:ochre}]} points={[{x:0,y:1,label:'$C(0,1)$',labelOffset:[24,14]},...(stage===0?[{x:-Math.sqrt(8),y,label:'$P$'},{x:Math.sqrt(8),y,label:'$Q$'}]:stage===1?[{x:0,y:4,label:'$T(0,4)$'}]:[])]} segments={[{from:[0,1],to:[0,y],label:`$d=${d}$`,color:ochre,width:3},{from:[0,1],to:[-3,1],label:'$r=3$',color:teal,dashed:true,labelOffset:[0,23]}]}/>;
 }
 return null;
}
