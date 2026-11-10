'use client';
import {Formula,MathText} from './MathText';
const m=String.raw;
const teal='#176c82',ochre='#936114',ink='#526d89';
type P={x:number;y:number;label?:string;dx?:number;dy?:number;color?:string};
type E={a:number;b:number;label?:string;color?:string;dash?:boolean;dx?:number;dy?:number};
export type Math1TrigPlaneProps={title:string;points:P[];edges:E[];right?:[number,number,number][];circle?:{x:number;y:number;r:number;half?:boolean};note?:string};
const round=(v:number)=>Number(v.toFixed(4));
export function Math1TrigPlane({title,points,edges,right=[],circle,note}:Math1TrigPlaneProps){
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
 if(circle){xs.push(circle.x-circle.r,circle.x+circle.r);ys.push(circle.y+(circle.half?0:-circle.r),circle.y+circle.r)}
 const xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys),scale=Math.min(222/(xmax-xmin||1),154/(ymax-ymin||1)),cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;
 const xy=(p:{x:number;y:number})=>({x:round(160+(p.x-cx)*scale),y:round(118-(p.y-cy)*scale)}),ps=points.map(xy);
 const label=(x:number,y:number,tex:string,color=ink)=> <foreignObject x={round(x-45)} y={round(y-18)} width="90" height="36"><div className="math1-trig-label" style={{color}}><Formula tex={tex}/></div></foreignObject>;
 return <figure className="math1-trig-figure"><svg viewBox="0 0 320 240" role="img" aria-label={title}><title>{title}</title>
 {circle&&(circle.half?<path d={`M ${xy({x:circle.x-circle.r,y:circle.y}).x} ${xy(circle).y} A ${round(circle.r*scale)} ${round(circle.r*scale)} 0 0 1 ${xy({x:circle.x+circle.r,y:circle.y}).x} ${xy(circle).y}`} fill="none" stroke="#a2b6c7" strokeWidth="1.7"/>:<circle cx={xy(circle).x} cy={xy(circle).y} r={round(circle.r*scale)} fill="none" stroke="#a2b6c7" strokeWidth="1.7"/>)}
 {edges.map((e,i)=>{const a=ps[e.a],b=ps[e.b],dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy)||1;return <g key={i}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={e.color||ink} strokeWidth={e.color?2.8:1.8} strokeDasharray={e.dash?'5 4':undefined}/>{e.label&&label((a.x+b.x)/2+(e.dx??dy/n*17),(a.y+b.y)/2+(e.dy??-dx/n*17),e.label,e.color)}</g>})}
 {right.map(([i,j,k],n)=>{const a=ps[i],o=ps[j],b=ps[k],l=Math.hypot(a.x-o.x,a.y-o.y),r=Math.hypot(b.x-o.x,b.y-o.y),u={x:(a.x-o.x)/l*8,y:(a.y-o.y)/l*8},v={x:(b.x-o.x)/r*8,y:(b.y-o.y)/r*8};return <polyline key={n} points={`${round(o.x+u.x)},${round(o.y+u.y)} ${round(o.x+u.x+v.x)},${round(o.y+u.y+v.y)} ${round(o.x+v.x)},${round(o.y+v.y)}`} fill="none" stroke={ink} strokeWidth="1.2"/>})}
 {ps.map((p,i)=>{const source=points[i],dx=p.x-160,dy=p.y-118,n=Math.hypot(dx,dy)||1;return <g key={i}>{source.label&&<><circle cx={p.x} cy={p.y} r="2.6" fill={source.color||ink}/>{label(p.x+(source.dx??dx/n*21),p.y+(source.dy??dy/n*21),source.label,source.color)}</>}</g>})}
 </svg>{note&&<figcaption><MathText text={note}/></figcaption>}</figure>
}
function triangle(mode:string,stage:number):Math1TrigPlaneProps{
 const numerical=mode==='ratios'||mode==='unknown'||stage===3, focus=mode==='roles'&&stage===2?'B':'A';
 const points:P[]=[{x:0,y:0,label:mode==='unknown'?m`A=30^\circ`:'A',dx:mode==='unknown'?12:-16,dy:22},{x:5,y:0,label:'B',dx:16,dy:18},{x:mode==='unknown'?3.75:3.2,y:mode==='unknown'?Math.sqrt(3)*1.25:2.4,label:'C',dy:-22}];
 let colors=[ink,ink,ochre];
 if(mode==='roles')colors=stage===0?[ink,ink,ochre]:focus==='A'?[teal,ink,ochre]:[ink,teal,ochre];
 if(mode==='ratios')colors=stage===0?[teal,ink,ochre]:stage===1?[ink,teal,ochre]:[teal,ochre,ink];
 if(mode==='unknown')colors=[teal,ink,ochre];
 const labels=mode==='unknown'?['4','',stage>=2?'8':'x']:numerical?['3','4','5']:['BC','AC','AB'];
 return {title:mode==='roles'?`角 ${focus} と三辺の対応`:'直角三角形の辺と比',points,edges:[{a:1,b:2,label:labels[0],color:colors[0]},{a:2,b:0,label:labels[1],color:colors[1]},{a:0,b:1,label:labels[2],color:colors[2]}],right:[[0,2,1]],note:mode==='roles'?(stage===0?m`斜辺 $AB$：直角 $C$ の向かい。`:focus==='A'?m`$A$ の向かい：$BC$、隣：$AC$、斜辺：$AB$`:m`$B$ の向かい：$AC$、隣：$BC$、斜辺：$AB$`):undefined};
}
function circleFigure(stage:number):Math1TrigPlaneProps{
 const h=1.5*Math.sqrt(3);return {title:'同じ弦 BC を見る円周角と直径 BD',points:[{x:0,y:3,label:'A'},{x:-1.5,y:-h,label:'B',dx:-17,dy:17},{x:1.5,y:-h,label:'C',dx:17,dy:17},{x:0,y:0,label:'O',dx:15,dy:16},...(stage?[{x:1.5,y:h,label:'D',dx:24,dy:0}]:[])],edges:[{a:0,b:1},{a:0,b:2},{a:1,b:2,label:'a',color:teal},...(stage?[{a:1,b:4,label:'2R',color:ochre,dx:-28,dy:-12},{a:4,b:2,color:ink}]:[])],right:stage?[[1,2,4]]:[],circle:{x:0,y:0,r:3}};
}
function heightFigure(mode:string,stage:number):Math1TrigPlaneProps{
 const obtuse=stage===3&&mode!=='sine',b=4,c=mode==='area'&&obtuse?6:5,A=obtuse?150:60,x=b*Math.cos(A*Math.PI/180),y=b*Math.sin(A*Math.PI/180);
 const cosine=mode==='cosine';return {title:cosine?'辺の横と縦の成分':'二つの直角三角形に共通の高さ',points:[{x:0,y:0,label:'A',dx:obtuse?0:-18,dy:22},{x:c,y:0,label:'B',dx:17,dy:18},{x,y,label:'C',dy:-23},{x,y:0,label:'H',dx:0,dy:22}],edges:[{a:0,b:1,label:'c',dy:39},{a:0,b:2,label:'b',color:mode==='sine'&&stage===1?ochre:ink},{a:1,b:2,label:'a',color:mode==='sine'&&stage===2?ochre:ink},{a:3,b:2,label:cosine?m`b\sin A`:'h',color:teal,dx:25,dy:0},...(obtuse?[{a:0,b:3,dash:true,label:cosine?m`b\cos A`:undefined,dy:39}]:cosine?[{a:0,b:3,label:m`b\cos A`,color:ochre,dy:18}]:[])],right:[[1,3,2]],note:cosine?m`$H=(b\cos A,0)$。$CH=b\sin A$。`:undefined};
}
function coordinateFigure(kind:string,stage:number):Math1TrigPlaneProps{
 let x=-3,y=4,r=5;
 if(kind==='identity'){r=1;x=stage>=2?-.8:-.6;y=stage>=2?.6:.8;}
 if(kind==='equal'){r=1;x=(stage===2||stage===4)?-.5:Math.sqrt(3)/2;y=(stage===2||stage===4)?Math.sqrt(3)/2:.5;}
 const equal=kind==='equal',endpoints=equal&&stage===3;
 const points:P[]=[{x:-1.15*r,y:0},{x:1.15*r,y:0,label:'x',dx:12,dy:0},{x:0,y:-.08*r},{x:0,y:1.14*r,label:'y',dx:0,dy:-15},{x:0,y:0,label:'O',dx:-12,dy:17}];
 const edges:E[]=[{a:0,b:1},{a:2,b:3}];
 if(endpoints){points.push({x:-1,y:0,label:m`180^\circ`,dx:2,dy:25},{x:1,y:0,label:m`0^\circ`,dx:0,dy:25},{x:0,y:1,label:m`90^\circ`,dx:35,dy:0});return{title:'単位円の端点と上端',points,edges,circle:{x:0,y:0,r:1,half:true}};}
 const pointLabel=equal?((stage===0||stage===4)?'P':stage===2?m`120^\circ`:m`30^\circ`):kind==='coordinates'?'P': 'P';
 points.push({x,y,label:pointLabel,dx:x<0?-20:22,dy:-16},{x,y:0,label:equal?((stage===2||stage===4)?m`-\tfrac12`:''):kind==='coordinates'?'-3':'x',dx:0,dy:20},{x:0,y,label:equal?((stage===2||stage===4)?'':m`\tfrac12`):kind==='coordinates'?'4':'y',dx:17,dy:0});
 edges.push({a:4,b:5,label:equal?'':kind==='coordinates'?'5':'r',color:kind==='identity'?ink:ochre,dx:14,dy:8});
 if(equal){if(stage===2||stage===4){points.push({x,y:1.05,label:''});edges.push({a:6,b:8,color:teal,dash:true});}else{points.push({x:-x,y,label:stage===0?'Q':m`150^\circ`,dx:-22,dy:-16});edges.push({a:8,b:5,color:teal,dash:true},{a:4,b:8});}}
 else edges.push({a:5,b:6,color:kind==='identity'?ochre:kind==='coordinates'&&stage===2?ink:teal,dash:true},{a:5,b:7,color:kind==='identity'||kind==='coordinates'&&stage===2?teal:ink,dash:true});
 return{title:equal?'上半円と同じ座標を持つ点':kind==='coordinates'?'半径 5 の円上の点 P(−3,4)':'半径 r と横・縦の座標',points,edges,circle:{x:0,y:0,r,half:true}};
}
function spaceFigure(stage:number,height=12):Math1TrigPlaneProps{
 if(stage===1)return{title:'底面の直角三角形 ABC',points:[{x:0,y:0,label:'A'},{x:3,y:0,label:'B'},{x:3,y:4,label:'C'}],edges:[{a:0,b:1,label:'3'},{a:1,b:2,label:'4'},{a:0,b:2,label:'AC=5',color:teal,dx:-28,dy:0}],right:[[0,1,2]]};
 if(stage>=2)return{title:'共通の辺 AC を含む断面 ACG',points:[{x:0,y:0,label:stage===3?m`A\ (\theta)`:'A',dx:0,dy:24},{x:5,y:0,label:'C'},{x:5,y:height,label:'G'}],edges:[{a:0,b:1,label:'AC=5',color:teal,dy:34},{a:1,b:2,label:String(height)},{a:0,b:2,label:stage===2?'AG':'AG',dx:-23,dy:-2}],right:[[0,1,2]],note:m`$CG\perp AC$。この図は断面 $ACG$ の平面図です。`};
 return{title:'直方体の見取図',points:[{x:0,y:0,label:'A'},{x:4,y:0,label:'B'},{x:6,y:1.5,label:'C',dx:17,dy:8},{x:2,y:1.5,label:'D',dx:-13,dy:0},{x:0,y:5,label:'E'},{x:4,y:5,label:'F',dx:-4,dy:-17},{x:6,y:6.5,label:'G'},{x:2,y:6.5,label:'H'}],edges:[{a:0,b:1,label:'3'},{a:1,b:2,label:'4',dx:17,dy:12},{a:2,b:3,dash:true},{a:3,b:0,dash:true},{a:0,b:4},{a:1,b:5},{a:2,b:6,label:String(height)},{a:3,b:7,dash:true},{a:4,b:5},{a:5,b:6},{a:6,b:7},{a:7,b:4},{a:0,b:2,color:teal,dash:true},{a:0,b:6,dash:true}],note:'立体の見取図です。画面上の角度・縮尺は実際と異なります。'};
}
export function Math1TrigSpaceDiagram({stage,height=12}:{stage:number;height?:number}){return <Math1TrigPlane {...spaceFigure(stage,height)}/>}
export default function Math1TrigDiagram({kind,stage}:{kind:string;stage:number;reduce:boolean}){
 const name=kind.replace('m1-trig-','');
 if(['roles','ratios','unknown'].includes(name))return <Math1TrigPlane {...triangle(name,stage)}/>;
 if(['coordinates','identity','equal'].includes(name))return <Math1TrigPlane {...coordinateFigure(name,stage)}/>;
 if(['sine','area','cosine'].includes(name))return <Math1TrigPlane {...heightFigure(name,stage)}/>;
 if(name==='circle')return <Math1TrigPlane {...circleFigure(stage)}/>;
 if(name==='space')return <Math1TrigSpaceDiagram stage={stage}/>;
 if(name==='similarity')return <Math1TrigPlane title="同じ角を持つ二つの相似な三角形" points={[{x:0,y:0,label:'A'},{x:2.5,y:0,label:'B'},{x:1.6,y:1.2,label:'C'},{x:3.6,y:0,label:"A'"},{x:8.6,y:0,label:"B'"},{x:6.8,y:2.4,label:"C'"}]} edges={[{a:0,b:1,label:'5',color:ochre,dy:18},{a:1,b:2,label:'3',color:teal,dx:12,dy:-3},{a:2,b:0},{a:3,b:4,label:'10',color:ochre,dy:18},{a:4,b:5,label:'6',color:teal},{a:5,b:3}]} right={[[0,2,1],[3,5,4]]} note={m`左の三辺をすべて $2$ 倍したものが右です。`}/>;
 if(name==='special')return <Math1TrigPlane title="一辺 2 の正三角形を高さで二等分" points={[{x:0,y:Math.sqrt(3),label:'A',dx:0,dy:-22},{x:-1,y:0,label:stage===3?m`B\ (60^\circ)`:'B',dx:-4,dy:24},{x:1,y:0,label:'C',dx:17,dy:17},{x:0,y:0,label:'H',dx:0,dy:22}]} edges={[{a:0,b:1,label:'2',color:ochre},{a:0,b:2,label:stage===0?'2':undefined},{a:1,b:3,label:'1',color:stage===2?teal:ink,dy:19},{a:3,b:2,label:stage===0?'1':undefined,dy:19},{a:0,b:3,label:stage>=1?m`\sqrt3`:'h',color:stage===3?teal:ink,dx:23,dy:0}]} right={[[0,3,1]]}/>;
 if(name==='cosangle')return <Math1TrigPlane title="角 A の向かいと、角 A をはさむ二辺" points={[{x:0,y:0,label:'A'},{x:3,y:0,label:'B'},{x:1/3,y:Math.sqrt(80)/3,label:'C'}]} edges={[{a:1,b:2,label:'a=4',color:teal},{a:0,b:2,label:'b=3',color:ochre},{a:0,b:1,label:'c=3',color:ochre}]}/>;
 if(name==='ssa')return <Math1TrigPlane title="二辺と対角が同じ二つの三角形" points={[{x:0,y:0,label:m`A=30^\circ`,dx:0,dy:27},{x:Math.sqrt(1.5),y:Math.sqrt(.5),label:'C',dx:0,dy:-23},{x:Math.sqrt(1.5)+Math.sqrt(.5),y:0,label:'B_1',dx:18,dy:18},...(stage>0?[{x:Math.sqrt(1.5)-Math.sqrt(.5),y:0,label:'B_2',dx:0,dy:22}]:[])]} edges={[{a:0,b:1,label:m`\sqrt2`},{a:0,b:2},{a:1,b:2,label:'1',color:teal},...(stage>0?[{a:1,b:3,label:'1',color:ochre,dash:true,dx:-19,dy:8}]:[])]}/>;
 if(name==='complement')return <Math1TrigPlane title="同じ辺 AC が角によって隣と向かいになる" points={[{x:0,y:0,label:m`A\ (30^\circ)`,dx:0,dy:24},{x:2,y:0,label:m`B\ (60^\circ)`,dx:0,dy:24},{x:1.5,y:Math.sqrt(3)/2,label:'C',dy:-23}]} edges={[{a:0,b:1,label:'2',color:ochre,dy:40},{a:1,b:2,label:'1'},{a:0,b:2,label:m`\sqrt3`,color:teal}]} right={[[0,2,1]]} note={stage===0?m`$30^\circ$ の隣は $AC$。$\cos30^\circ=\frac{AC}{AB}$。`:m`$60^\circ$ の向かいも同じ $AC$。$\sin60^\circ=\frac{AC}{AB}=\cos30^\circ$。`}/>;
 if(name==='pyramid'&&stage===0)return <Math1TrigPlane title="四角錐の中心 O、辺の中点 M、頂点 A" points={[{x:-3,y:-2,label:'A'},{x:3,y:-2,label:'B'},{x:5,y:2,label:'C'},{x:-1,y:2,label:'D',dx:-20,dy:-5},{x:1,y:0,label:'O',dx:16,dy:10},{x:0,y:-2,label:'M',dx:0,dy:22},{x:1,y:5,label:'V',dx:0,dy:-20}]} edges={[{a:0,b:1,label:'6',dy:40},{a:1,b:2},{a:2,b:3,dash:true},{a:3,b:0,dash:true},{a:6,b:0},{a:6,b:1},{a:6,b:2},{a:6,b:3,dash:true},{a:6,b:4,label:'4',color:teal,dx:20,dy:0},{a:4,b:5,color:ochre,dash:true},{a:6,b:5,color:ink,dash:true},{a:4,b:0,dash:true}]} note={m`立体の見取図です。$O$ は底面の中心、$M$ は $AB$ の中点。$VO$ は底面に垂直です。`}/>;
 if(name==='pyramid')return <Math1TrigPlane title={stage<2?'側面の高さを含む断面 VOM':'側辺を含む断面 VOA'} points={[{x:0,y:4,label:'V'},{x:0,y:0,label:'O'},{x:stage<2?3:3*Math.sqrt(2),y:0,label:stage<2?'M':'A'}]} edges={[{a:0,b:1,label:'VO=4',color:teal},{a:1,b:2,label:stage<2?'3':m`3\sqrt2`,color:ochre},{a:0,b:2,label:stage<2?'VM':'VA'}]} right={[[0,1,2]]} note={stage<2?m`$M$ は一辺 $6$ の底面の辺の中点。$OM=3$。`:m`底面の頂点 $A$ へ向かう断面では、$OA=3\sqrt2$。高さ $VO$ は共通です。`}/>;
 return null;
}
