import {Formula} from './MathText';
type P=[number,number];
type Edge={a:string;b:string;color?:string;dash?:boolean};
type Arc={center:P;r:number;start:number;end:number;color:string};
type SketchData={points:Record<string,P>;edges:Edge[];circles?:{center:P;r:number}[];arcs?:Arc[];labels?:Record<string,string>;offsets?:Record<string,P>;fills?:{names:string[];color:string}[];right?:[string,string,string][];edgeLabels?:{a:string;b:string;tex:string;offset?:P}[];ticks?:string[];caption:string};
const blue='#176c82',gold='#936114',ink='#30485e';
const rd=(n:number)=>Number(n.toFixed(4));
const lerp=(a:P,b:P,t:number):P=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
const pt=(angle:number,r=4):P=>[r*Math.cos(angle*Math.PI/180),r*Math.sin(angle*Math.PI/180)];
const tri=(ab:number,ac:number,bc:number):Record<string,P>=>{const x=(ab*ab-ac*ac+bc*bc)/(2*bc);return {A:[x,Math.sqrt(ab*ab-x*x)],B:[0,0],C:[bc,0]};};
const edges=(pairs:string[],color?:string,dash=false):Edge[]=>pairs.map(pair=>({a:pair[0],b:pair[1],color,dash}));
export function GeometrySketch({data}:{data:SketchData}){
 const all=[...Object.values(data.points),...(data.circles??[]).flatMap(c=>[[c.center[0]-c.r,c.center[1]-c.r],[c.center[0]+c.r,c.center[1]+c.r]] as P[])];
 const xmin=Math.min(...all.map(p=>p[0])),xmax=Math.max(...all.map(p=>p[0])),ymin=Math.min(...all.map(p=>p[1])),ymax=Math.max(...all.map(p=>p[1]));
 const scale=Math.min(220/(xmax-xmin||1),158/(ymax-ymin||1));
 const x=(n:number)=>rd(160+(n-(xmin+xmax)/2)*scale),y=(n:number)=>rd(118-(n-(ymin+ymax)/2)*scale);
 const at=(p:P)=>`${x(p[0])},${y(p[1])}`;
 return <figure style={{margin:'8px auto',maxWidth:340,width:'100%'}}><svg viewBox="0 0 320 236" role="img" aria-label={data.caption} style={{display:'block',width:'100%',height:'auto',overflow:'visible'}}>
 {data.fills?.map((f,i)=><polygon key={'f'+i} points={f.names.map(n=>at(data.points[n])).join(' ')} fill={f.color} opacity=".12"/>)}
 {data.circles?.map((c,i)=><circle key={'c'+i} cx={x(c.center[0])} cy={y(c.center[1])} r={rd(c.r*scale)} fill="none" stroke="#789b99" strokeWidth="1.7"/>)}
 {data.arcs?.map((a,i)=>{const p=(deg:number):P=>[a.center[0]+a.r*Math.cos(deg*Math.PI/180),a.center[1]+a.r*Math.sin(deg*Math.PI/180)];return <path key={'a'+i} d={`M${at(p(a.start))} A${rd(a.r*scale)} ${rd(a.r*scale)} 0 ${a.end-a.start>180?1:0} 0 ${at(p(a.end))}`} fill="none" stroke={a.color} strokeWidth="4"/>;})}
 {data.edges.map((e,i)=><line key={'e'+i} x1={x(data.points[e.a][0])} y1={y(data.points[e.a][1])} x2={x(data.points[e.b][0])} y2={y(data.points[e.b][1])} stroke={e.color??ink} strokeWidth={e.color?3:1.8} strokeDasharray={e.dash?'5 4':undefined}/>)}
 {data.right?.map(([c,a,b],i)=>{const p=data.points[c],pa=data.points[a],pb=data.points[b],da=Math.hypot(pa[0]-p[0],pa[1]-p[1]),db=Math.hypot(pb[0]-p[0],pb[1]-p[1]),px=x(p[0]),py=y(p[1]),u=[(pa[0]-p[0])/da*9,-(pa[1]-p[1])/da*9],v=[(pb[0]-p[0])/db*9,-(pb[1]-p[1])/db*9];return <path key={'r'+i} d={`M${rd(px+u[0])} ${rd(py+u[1])} l${rd(v[0])} ${rd(v[1])} l${rd(-u[0])} ${rd(-u[1])}`} fill="none" stroke={blue} strokeWidth="1.5"/>;})}
 {data.ticks?.map((n,i)=>{const p=data.points[n];return <line key={'tick'+i} x1={x(p[0])-5} y1={y(p[1])} x2={x(p[0])+5} y2={y(p[1])} stroke={ink} strokeWidth="2"/>;})}
 {data.edgeLabels?.map((label,i)=>{const p=lerp(data.points[label.a],data.points[label.b],.5),offset=label.offset??[0,0];return <foreignObject key={'label'+i} x={x(p[0])+offset[0]-31} y={y(p[1])+offset[1]-17} width="62" height="40"><div style={{fontSize:20,textAlign:'center',lineHeight:1.4}}><Formula tex={label.tex}/></div></foreignObject>;})}
 {Object.entries(data.points).map(([name,p])=>{const offset=data.offsets?.[name]??[0,-23],label=data.labels?.[name]??name,boxWidth=label.length>1?100:56;return <g key={name}>{label&&<circle cx={x(p[0])} cy={y(p[1])} r="2.5" fill={ink}/>} {label&&<foreignObject x={x(p[0])+offset[0]-boxWidth/2} y={y(p[1])+offset[1]-16} width={boxWidth} height="40"><div style={{fontSize:20,textAlign:'center',lineHeight:1.4,color:ink,whiteSpace:'nowrap'}}><Formula tex={label}/></div></foreignObject>}</g>;})}
 </svg></figure>;
}
const triangleEdges=()=>edges(['AB','BC','CA']);
export function geometryStructureData(kind:string,stage:number):SketchData|null{
 const k=kind.replace('ma-geometry-','');
 if(k==='angles'){
  const A:P=[0,0],B:P=[5,0],length=5*Math.sin(Math.PI/3)/Math.sin(70*Math.PI/180),C:P=[length*Math.cos(50*Math.PI/180),length*Math.sin(50*Math.PI/180)];
  return {points:{A,B,C,...(stage?{L:[C[0]-3,C[1]] as P,R:[C[0]+3,C[1]] as P}:{})},edges:[...triangleEdges(),...(stage?edges(['LR'],undefined,true):[])],arcs:[{center:A,r:.55,start:0,end:50,color:blue},{center:B,r:.55,start:120,end:180,color:gold},...(stage?[{center:C,r:.55,start:180,end:230,color:blue},{center:C,r:.55,start:300,end:360,color:gold}]:[])],labels:{L:'',R:''},offsets:{A:[-12,13],B:[12,13]},caption:stage?'頂点Cを通るABの平行線。AとBの角が錯角としてCの両側に対応する。':'三角形ABCの三つの内角'};
 }
 if(k==='correspondence')return {points:{A:[0,4],B:[0,0],C:[6,0],D:[9,10],E:[9,0],F:[24,0]},edges:[...edges(['AB','BC','CA','DE','EF','FD']),...(stage>=1?edges(['AB','DE'],blue):[]),...(stage>=2?edges(['BC','EF'],gold):[])],offsets:{B:[-8,17],C:[0,19],E:[0,19],F:[8,17]},caption:'相似な三角形の頂点はAとD、BとE、CとF。ABとDE、BCとEFが対応する。'};
 if(k==='parallel'){const p=tri(5,10,8);p.D=lerp(p.A,p.B,.4);p.E=lerp(p.A,p.C,.4);return {points:p,edges:[...triangleEdges(),...edges(['DE'],blue),...(stage?edges(['AD','AE'],blue):edges(['AD'],blue)),...(!stage?edges(['DB'],gold):[])],fills:stage?[{names:['A','D','E'],color:blue}]:[],offsets:{D:[-18,0],E:[18,0],B:[-8,18],C:[8,18]},edgeLabels:stage?[]:[{a:'A',b:'D',tex:'2',offset:[-21,0]},{a:'D',b:'B',tex:'3',offset:[-21,0]},{a:'A',b:'C',tex:'10',offset:[22,0]}],caption:'平行線DEから三角形ADEとABCが相似。ADとAEは頂点Aから測る部分。'};}
 if(k==='area'){
  if(stage===2)return {points:{A:[0,2],B:[0,0],C:[2,0],D:[4,3],E:[4,0],F:[7,0]},edges:[...edges(['AB','DE'],blue),...edges(['BC','EF'],gold),...edges(['CA','FD'])],right:[['B','A','C'],['E','D','F']],offsets:{B:[-8,17],C:[0,19],E:[0,19],F:[8,17]},caption:'相似な三角形では高さも底辺も同じ倍率で変わる。'};
  return {points:{A:[1,3],B:[0,0],C:[5,0],D:[2,0],H:[1,0]},edges:[...triangleEdges(),...edges(['AD']),...edges(['AH'],blue,true),...edges(['BD'],blue),...edges(['DC'],gold)],right:[['H','A','C']],labels:{H:''},offsets:{B:[-12,18],D:[0,18],C:[10,18]},fills:stage?[{names:['A','B','D'],color:blue},{names:['A','D','C'],color:gold}]:[],caption:'三角形ABDとADCは頂点Aから直線BCまでの高さが共通。'};
 }
 if(k==='triangle'){
  if(stage===0)return {points:{A:[0,0],B:[2,0],C:[5,0]},edges:[...edges(['AB'],blue),...edges(['BC'],gold)],offsets:{A:[0,-23],B:[0,-23],C:[0,-23]},edgeLabels:[{a:'A',b:'B',tex:'2',offset:[0,22]},{a:'B',b:'C',tex:'3',offset:[0,22]}],caption:'長さ2と3をつないで長さ5にすると一直線になり、三角形にならない。'};
  return {points:stage===1?tri(2,3,4):tri(3,4,5),edges:[...triangleEdges(),...(stage===2?edges(['BC'],gold):[])],offsets:{B:[-12,18],C:[12,18]},caption:stage===1?'長さ2、3、4の三角形':'最長辺BCの向かいの頂点はA'};
 }
 if(k==='bisector'){
  if(stage===1)return {points:{E:[0,0],B:[2,0],C:[3,0]},edges:[...edges(['EB'],blue),...edges(['BC'],gold)],offsets:{E:[0,-23],B:[0,-23],C:[0,-23]},edgeLabels:[{a:'E',b:'B',tex:'20',offset:[0,22]},{a:'B',b:'C',tex:'10',offset:[0,22]}],caption:'外点EからB、Cの順。CEはBEとBCの和で、CEからBEを引くとBCになる。'};
  const p=tri(6,9,10);p.D=[4,0];return {points:p,edges:[...triangleEdges(),...edges(['AD'],undefined,true),...edges(['BD'],blue),...edges(['DC'],gold)],offsets:{B:[-10,18],D:[0,18],C:[10,18]},edgeLabels:[{a:'B',b:'D',tex:'4',offset:[0,19]},{a:'D',b:'C',tex:'6',offset:[0,19]}],caption:'角Aの二等分線で分かれるBDとDCの和はBC'};
 }
 if(k==='centroid')return {points:{A:[0,3],B:[-2,0],C:[2,0],D:[0,0],G:[0,1],...(stage?{E:[0,2] as P}:{})},edges:[...triangleEdges(),...edges(['AG'],blue),...edges(['GD'],gold)],labels:{E:''},ticks:stage?['E','G']:[],edgeLabels:[{a:'A',b:'G',tex:'2',offset:[-23,0]},{a:'G',b:'D',tex:'1',offset:[-23,0]}],offsets:{B:[-12,18],C:[12,18],D:[0,18],G:[22,0]},caption:'中線AD上でAGは2、GDは1の割合。全体ADは3の割合。'};
 if(k==='centers'){
  if(stage===0)return {points:{A:[0,3],B:[0,0],C:[4,0],I:[1,1],J:[1,0],K:[0,1],L:[1.6,1.8]},edges:[...triangleEdges(),...edges(['IJ','IK','IL'],blue)],circles:[{center:[1,1],r:1}],right:[['J','I','C'],['K','I','A'],['L','I','C']],labels:{J:'',K:'',L:''},offsets:{A:[-10,-20],B:[-12,16],C:[12,16],I:[20,0]},caption:'内心Iから三辺への垂線は内接円の半径で、長さが等しい。'};
  if(stage===1)return {points:{A:pt(80,2),B:pt(200,2),C:pt(330,2),O:[0,0]},edges:[...triangleEdges(),...edges(['OA','OB','OC'],blue)],circles:[{center:[0,0],r:2}],offsets:{B:[-13,12],C:[13,12],O:[-18,4]},caption:'外心Oから三頂点までの距離は外接円の半径'};
  return {points:{A:[0,1.8],B:[0,0],C:[2.4,0],O:[1.2,.9]},edges:[...triangleEdges(),...edges(['OA','OC'],blue),...edges(['OB'],blue,true)],circles:[{center:[1.2,.9],r:1.5}],right:[['B','A','C']],offsets:{B:[-12,16],C:[14,16],O:[16,-18]},caption:'直角三角形の斜辺ACの中点Oが外心'};
 }
 if(k==='ceva'||k==='menelaus'||k==='converse'){
  const outer=k==='menelaus'||k==='converse'&&stage===1;
  const p:Record<string,P>=outer?{A:[0,6],B:[0,0],C:[9,0],D:[3,0],E:[6.75,1.5],F:[0,-1.2]}:{A:[2,6],B:[0,0],C:[10,0]};
  if(!outer){p.D=lerp(p.B,p.C,k==='ceva'?.4:1/3);p.E=lerp(p.C,p.A,k==='ceva'?3/7:1/4);p.F=lerp(p.A,p.B,k==='ceva'?2/3:6/7);}
  return {points:p,edges:[...triangleEdges(),...(outer?edges(['DF','FE'],undefined,true):edges(['AD','BE','CF'],undefined,true)),...edges(['BD'],blue),...edges(['DC'],gold),...(stage||k==='converse'? [...edges(['CE','AF'],blue),...edges(['EA','FB'],gold)]:[])],offsets:{A:[0,-22],B:[-20,4],C:[13,18],D:[0,20],E:[18,-6],F:outer?[-15,16]:[-20,-15]},caption:outer?'三辺をBC、CA、ABの順に巡る。FはABのB側延長上で、AFにはBFを含む。':'三辺をBC、CA、ABの順に巡り、各辺の前半を分子、後半を分母にする。'};
 }
 if(k==='arc')return {points:{A:pt(20),B:pt(70),C:pt(220),O:[0,0],...(stage===2?{D:pt(45)}:{})},edges:[...edges(['CA','CB'],blue),...(stage>=1?edges(['OA','OB'],blue,true):[]),...(stage===2?edges(['DA','DB'],gold):[])],circles:[{center:[0,0],r:4}],arcs:[{center:[0,0],r:4,start:20,end:70,color:blue},...(stage===2?[{center:[0,0] as P,r:4,start:70,end:380,color:gold}]:[])],labels:{O:stage?'O':''},offsets:{A:[21,3],B:[5,-23],C:[-15,15],D:[22,-10],O:[-20,8]},caption:'円周角ACBと中心角AOBは同じ弧ABに対応。Dが反対側なら残りの弧を見込む。'};
 if(k==='cyclic')return {points:{A:pt(170),B:pt(40),C:pt(0),D:pt(-60)},edges:[...edges(['AB','AD'],blue),...edges(['BC','CD'],stage?gold:undefined)],circles:[{center:[0,0],r:4}],arcs:[{center:[0,0],r:4,start:300,end:400,color:blue},...(stage?[{center:[0,0] as P,r:4,start:40,end:300,color:gold}]:[])],offsets:{A:[-20,0],B:[15,-18],C:[20,4],D:[10,20]},caption:'角Aが見込む弧BCDと、角Cが見込む弧BADは、合わせて円一周。'};
 if(k==='tangent')return {points:{O:[0,0],P:[5,0],T:[1.8,2.4],...(stage===2?{U:[1.8,-2.4] as P}:{})},edges:[...edges(['PT'],gold),...edges(['OT'],blue),...(stage>=1?edges(['OP'],undefined,true):[]),...(stage===2?[...edges(['PU'],gold),...edges(['OU'],blue)]:[])],circles:[{center:[0,0],r:3}],right:[['T','O','P'],...(stage===2?[['U','O','P'] as [string,string,string]]:[])],offsets:{O:[-15,-16],P:[20,0],T:[8,-23],U:[8,24]},caption:'接点TでOTとPTが直交。OPが直角三角形の斜辺。'};
 if(k==='tangent-chord')return {points:{A:[4,0],B:pt(100),C:pt(230),...(stage?{T:[4,3] as P}:{}),...(stage===2?{S:[4,-3] as P}:{})},edges:[...edges(['AB'],blue),...edges(['CA','CB']),...(stage?edges(['AT'],blue):[]),...(stage===2?edges(['AS'],gold):[])],circles:[{center:[0,0],r:4}],offsets:{A:[22,0],B:[0,-23],C:[-15,16],T:[13,-20],S:[13,20]},caption:'弦ABを一辺とする接弦角TABと円周角ACB。反対向きのASでは補角になる。'};
 if(k==='power'){
  if(stage===3)return {points:{P:[0,0],A:[-2,0],B:[6,0],C:[0,-3],D:[0,4]},edges:[...edges(['AP','PB'],blue),...edges(['CP','PD'],gold),...edges(['AC','DB'],undefined,true)],circles:[{center:[2,.5],r:Math.sqrt(16.25)}],offsets:{P:[-20,-16],A:[-20,0],B:[20,0],C:[0,24],D:[0,-24]},caption:'円内の交点Pから両端まで測る。三角形APCとDPBの相似からPAとPBの積はPCとPDの積に等しい。'};
  if(stage===2){const tx=24/5.5,ty=Math.sqrt(24-tx*tx);return {points:{P:[0,0],A:[3,0],B:[8,0],O:[5.5,0],T:[tx,ty]},edges:[...edges(['PB'],gold),...edges(['PA'],blue),...edges(['PT'],blue),...edges(['OT'],undefined,true)],circles:[{center:[5.5,0],r:2.5}],right:[['T','O','P']],offsets:{P:[-12,18],A:[0,18],B:[10,18],O:[0,18],T:[0,-23]},caption:'同じ起点Pから接点Tまでの長さの二乗が、PAとPBの積に等しい。'};}
  return {points:{P:[0,0],A:[3,0],B:[8,0],C:[0,2],D:[0,12]},edges:[...edges(['PB'],gold),...edges(['PA'],blue),...(stage? [...edges(['PD'],gold),...edges(['PC'],blue)]:[])],circles:[{center:[5.5,7],r:Math.sqrt(55.25)}],labels:{C:stage?'C':'',D:stage?'D':''},offsets:{P:[-20,16],A:[0,20],B:[8,20],C:[-20,-3],D:[-20,0]},caption:'割線の二つの長さは、どちらもPから測る。PBはPAとABの和。'};
 }
 if(k==='circles'){
  const d=stage===0?7:stage===1?3:stage===2?5:0,r=stage===3?3:5,s=stage===3?3:2;
  return {points:{O:[0,0],...(stage<3?{P:[d,0] as P}:{}),...(stage<2?{T:[5,0] as P}:{})},edges:stage<2?[...edges(['OT'],blue),...edges(['PT'],gold)]:stage===2?edges(['OP']):[],circles:[{center:[0,0],r},{center:[d,0],r:s}],labels:{O:stage===3?'O=P':'O'},offsets:{O:[0,-24],P:[0,-24],T:[0,22]},caption:stage===0?'外接ではOTとTPを足すと中心間距離OPになる。':stage===1?'内接ではOTからPTを引くと中心間距離OPになる。':stage===2?'半径差より大きく半径和より小さい中心間距離なら二点で交わる。':'中心も半径も一致する二円は同じ円。'};
 }
 if(k==='common'){
  const inner=stage===3,p:Record<string,P>=inner?{O:[0,0],P:[5,0],T:[1.2,1.6],U:[4.4,-.8],H:[1.8,2.4]}:{O:[0,0],P:[5,0],T:[2.4,3.2],U:[5.6,.8],...(stage?{H:[1.8,2.4] as P}:{})};
  return {points:p,edges:[...edges(['TU'],gold),...edges(['OT','PU'],blue),...edges(['OP'],undefined,true),...(stage?[...edges(['HP'],gold,true),...edges(['OH'],blue),...(inner?edges(['TH'],blue,true):[])]:[])],circles:stage===2?[]:[{center:[0,0],r:inner?2:4},{center:[5,0],r:1}],right:stage?[['H','O','P']]:[['T','O','U'],['U','P','T']],offsets:{O:[-18,13],P:inner?[18,-15]:[15,18],T:inner?[-23,-10]:[0,-24],U:inner?[18,20]:[24,0],H:[-10,-25]},caption:stage===0?'二本の半径OTとPUは外共通接線TUに垂直で、中心は同じ側にある。':inner?'内共通接線ではOHが半径の和。OPを斜辺としHPが接点間の長さに等しい。':'外共通接線ではOHが半径の差。OPを斜辺としHPが接点間の長さに等しい。'};
 }
 return null;
}
export default function MathAGeometryStructure({kind,stage}:{kind:string;stage:number;reduce?:boolean}){const data=geometryStructureData(kind,stage);return data?<><GeometrySketch data={data}/>{kind==='ma-geometry-correspondence'&&<div style={{display:'flex',justifyContent:'center',gap:16,flexWrap:'wrap'}}>{['A\\leftrightarrow D','B\\leftrightarrow E','C\\leftrightarrow F'].map(tex=><Formula key={tex} tex={tex}/>)}</div>}</>:null;}
