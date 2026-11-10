import {Formula} from './MathText';
const m=String.raw,teal='#176c82',ochre='#936114';
type Props={kind:string;stage:number;reduce:boolean};
function Label({x,y,tex,width=78}:{x:number;y:number;tex:string;width?:number}){
 return <foreignObject x={x-width/2} y={y-17} width={width} height="42" aria-hidden="true"><div className="geometry-math"><Formula tex={tex}/></div></foreignObject>;
}
function Fence({stage,reduce}:Omit<Props,'kind'>){
 const joined=stage===1,area=stage===3;
 const transition=reduce?'none':'transform 700ms ease, opacity 500ms ease';
 return <svg className={`geometry-structure ${reduce?'reduce-motion':''}`} viewBox="0 0 280 264" role="img" aria-label={joined?'壁に垂直な同じ長さの柵二本を並べ、xとxを足すと2xになる。':'壁に沿う長方形。壁に垂直な二辺はx。残る平行な辺は、三辺の合計12から2xを引いた長さ。'}>
  <rect x="40" y="33" width="200" height="20" fill="#e5eaf0"/>
  {Array.from({length:10},(_,i)=><path key={i} d={`M${43+i*20} 33l15 20`} stroke="#bdc8d3"/>)}
  <text x="140" y="22" textAnchor="middle" className="geometry-text">壁</text>
  <rect x="52" y="54" width="176" height="96" fill={area?'#e0f0ee':'#f5f9fb'} style={{transition:reduce?'none':'fill 500ms ease'}}/>
  <path d="M52 54V150H228V54" fill="none" stroke="#b4c0ca" strokeWidth="3"/>
  <path d="M52 150H228" stroke={stage>=2?ochre:'#647b8d'} strokeWidth="4"/>
  <g style={{opacity:joined?.28:1,transition}}>
   <Label x={26} y={102} tex={m`\color{#176c82}{x}`} width={48}/>
   <Label x={254} y={102} tex={m`\color{#176c82}{x}`} width={48}/>
  </g>
  <g style={{opacity:joined?0:1,transition}}><Label x={140} y={179} tex={stage>=2?m`\color{#936114}{12-2x}`:'?'} width={170}/></g>
  <g className="geometry-moving" style={{transform:joined?'translate(44px, 210px) rotate(-90deg)':'translate(52px, 54px)',transition}}>
   <line x1="0" y1="0" x2="0" y2="96" stroke={teal} strokeWidth="4" strokeLinecap="round"/>
  </g>
  <g className="geometry-moving" style={{transform:joined?'translate(140px, 210px) rotate(-90deg)':'translate(228px, 54px)',transition}}>
   <line x1="0" y1="0" x2="0" y2="96" stroke={teal} strokeWidth="4" strokeLinecap="round"/>
  </g>
  <g style={{opacity:joined?1:0,transition}}>
   <Label x={92} y={187} tex={m`\color{#176c82}{x}`} width={46}/>
   <Label x={188} y={187} tex={m`\color{#176c82}{x}`} width={46}/>
   <path d="M44 220v8H236v-8" fill="none" stroke={teal}/>
   <path d="M140 205v10" stroke={teal} strokeWidth="2"/>
   <Label x={140} y={246} tex={m`\color{#176c82}{2x}`} width={90}/>
  </g>
  <g style={{opacity:stage===0?1:0,transition}}><Label x={140} y={231} tex={m`\text{柵の合計 }12\,\mathrm m`} width={230}/></g>
  {area&&<Label x={140} y={100} tex="A" width={50}/>}
 </svg>;
}
function Washer({stage,reduce}:Omit<Props,'kind'>){
 const section=stage>=2,measuring=stage>=1;
 const transition=reduce?'none':'transform 750ms ease, opacity 500ms ease';
 return <svg className={`geometry-structure ${reduce?'reduce-motion':''}`} viewBox="0 0 280 242" role="img" aria-label={section?'回転軸に垂直な円環断面。外半径3、内半径2。軸から測った二つの距離を同じ長さの半径として示す。':'横座標0から1、縦座標1から2の長方形と、回転軸yイコール負の1。軸から上の境界まで3、下の境界まで2。'}>
  <g style={{opacity:section?0:1,transition}}>
   <path d="M55 47V188 M30 140H244" fill="none" stroke="#97a8b9"/>
   <rect x="55" y="80" width="160" height="30" fill="#e0efee" stroke="#688a95" strokeWidth="1.5"/>
   <path d="M215 110V140" stroke="#97a8b9" strokeDasharray="4 4"/>
   <path d="M38 170H244" stroke="#0b1f3a" strokeWidth="2" strokeDasharray="6 4"/>
   <Label x={30} y={80} tex="2" width={38}/><Label x={30} y={110} tex="1" width={38}/>
   <Label x={42} y={143} tex="0" width={35}/><Label x={215} y={150} tex="1" width={35}/>
   <Label x={252} y={139} tex="x" width={36}/><Label x={54} y={34} tex="y" width={35}/>
   <Label x={30} y={175} tex="-1" width={48}/>
   <text x="200" y="202" textAnchor="middle" className="geometry-text">回転軸</text>
   <Label x={140} y={224} tex="y=-1" width={110}/>
  </g>
  <g style={{opacity:section?1:0,transition}}>
   <circle cx="140" cy="120" r="90" fill={stage===3?'#d8ebea':'#e9f3f2'} stroke={teal} strokeWidth="2.5"/>
   <circle cx="140" cy="120" r="60" fill="white" stroke={ochre} strokeWidth="2.5"/>
   <circle cx="140" cy="120" r="3" fill="#0b1f3a"/>
   <text x="140" y="20" textAnchor="middle" className="geometry-text">軸に垂直な断面</text>
   <path d="M140 128V147" stroke="#97a8b9"/>
   <text x="140" y="167" textAnchor="middle" className="geometry-text">回転軸</text>
  </g>
  <g className="geometry-moving" style={{opacity:measuring?1:0,transform:section?'translate(140px, 120px) rotate(90deg)':'translate(160px, 170px)',transition}}>
   <path d="M-4 0H4 M0 0V-90 M-4 -90H4" fill="none" stroke={teal} strokeWidth="3"/>
  </g>
  <g className="geometry-moving" style={{opacity:measuring?1:0,transform:section?'translate(140px, 120px) rotate(-90deg)':'translate(120px, 170px)',transition}}>
   <path d="M-4 0H4 M0 0V-60 M-4 -60H4" fill="none" stroke={ochre} strokeWidth="3"/>
  </g>
  <g style={{opacity:measuring?1:0,transform:section?'translate(0px,-24px)':'translate(0px,0px)',transition}}>
   <Label x={190} y={123} tex={m`\color{#176c82}{R=3}`} width={84}/>
  </g>
  <g style={{opacity:measuring?1:0,transform:section?'translate(10px,4px)':'translate(0px,0px)',transition}}>
   <Label x={96} y={137} tex={m`\color{#936114}{r=2}`} width={80}/>
  </g>
 </svg>;
}
export default function Math3GeometryStructures({kind,stage,reduce}:Props){
 if(kind==='fence')return <Fence stage={stage} reduce={reduce}/>;
 if(kind==='washer')return <Washer stage={stage} reduce={reduce}/>;
 return null;
}
