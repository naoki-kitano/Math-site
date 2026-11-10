import {MathText} from "./MathText";

type Point=[number,number];
type Edge={a:string;b:string;color?:string;dashed?:boolean};
type Ring={center:Point;radius:number;visible?:boolean;color?:string};
type Face={names:string[];color:string};
type Scene={
 points:Record<string,Point>;edges:Edge[];rings?:Ring[];faces?:Face[];
 visible?:string[];labels?:Record<string,string>;offsets?:Record<string,Point>;
 rights?:[string,string,string][];caption:string;
};
const blue="#176c82",amber="#936114",gray="#9aaab3";
const edge=(a:string,b:string,color=gray,dashed=false):Edge=>({a,b,color,dashed});
const round=(n:number)=>Number(n.toFixed(4));
const cubePoints:Record<string,Point>={A:[0,0],B:[4,0],C:[5.8,1.6],D:[1.8,1.6],E:[0,3.4],F:[4,3.4],G:[5.8,5],H:[1.8,5]};
const cubeEdges=[["A","B"],["B","C"],["C","G"],["G","H"],["H","E"],["E","A"],["E","F"],["F","G"],["B","F"]];
const cubeHidden=[["A","D"],["D","C"],["D","H"]];
function box(caption:string):Scene{
 return {points:{...cubePoints},edges:[...cubeEdges.map(([a,b])=>edge(a,b)),...cubeHidden.map(([a,b])=>edge(a,b,gray,true))],
  offsets:{A:[-18,4],B:[0,5],C:[6,-8],D:[-18,-25],E:[-18,-26],F:[5,0],G:[5,-25],H:[-20,-27]},caption};
}
function highlight(scene:Scene,a:string,b:string,color=blue){scene.edges.push(edge(a,b,color));}
function makeScene(kind:string,stage:number):Scene|null{
 const s=Math.max(0,stage),u=Math.sqrt(3);
 if(kind==="bisectors"){
  const scene:Scene={points:{A:[-2,0],B:[2,0],P:[0,Math.sqrt(5)],Q:[0,-Math.sqrt(5)],M:[0,0]},edges:[edge("A","B")],
   rings:[{center:[-2,0],radius:3},{center:[2,0],radius:3}],visible:s===0?["A","B"]:s===1?["A","B","P","Q"]:["A","B","P","Q","M"],
   offsets:{A:[-24,4],B:[6,4],P:[6,-26],Q:[6,0],M:[5,3]},caption:s===0?"両端を中心とする同じ半径の円":s===1?"二つの交点から両端までの等しい距離":"交点を結んだ直線が、中点で垂直に交わる"};
  if(s>=1)scene.edges.push(edge("P","A",blue),edge("P","B",blue),edge("Q","A",amber),edge("Q","B",amber));
  if(s>=2){highlight(scene,"P","Q");scene.rights=[["M","B","P"]];}
  return scene;
 }
 if(kind==="angle-bisector"){
  const scene:Scene={points:{O:[0,0],P:[3,0],Q:[1.5,1.5*u],R:[3,u],A:[5,0],B:[2.5,2.5*u]},
   edges:[edge("O","A"),edge("O","B"),edge("O","P",blue),edge("O","Q",blue),edge("P","R",amber),edge("Q","R",amber)],
   rings:[{center:[0,0],radius:3},{center:[3,0],radius:u},{center:[1.5,1.5*u],radius:u}],
   offsets:{O:[-22,3],P:[-8,3],Q:[-27,-25],R:[5,-18],A:[4,2],B:[-10,-27]},
   caption:s===0?"同じ円の半径と、同じ半径の二つの円弧":"二つの合同な三角形で、頂点の角が対応する"};
  if(s>=1){scene.faces=[{names:["O","P","R"],color:blue},{names:["O","Q","R"],color:amber}];highlight(scene,"O","R");}
  return scene;
 }
 if(kind==="perpendicular"){
  const scene:Scene={points:{A:[-2,0],B:[2,0],P:[0,3],H:[0,0],X:[0,Math.sqrt(5)],Y:[0,-Math.sqrt(5)],L:[-3,3],N:[3,3]},
   visible:s===0?["A","B","P"]:s===1?["A","B","P","H"]:["A","B","P","H","N"],labels:{L:"",N:"\\ell",X:"",Y:""},
   edges:[edge("A","B"),edge("P","A",blue),edge("P","B",blue)],
   rings:[{center:[0,3],radius:Math.sqrt(13)},{center:[-2,0],radius:3,visible:s>=1},{center:[2,0],radius:3,visible:s>=1}],
   offsets:{A:[-24,3],B:[5,3],P:[7,-25],H:[5,4]},
   caption:s===0?"外点から等距離の二点を元の直線上に取る":s===1?"二点の垂直二等分線は外点を通る":"同じ直線に垂直な二直線は平行"};
  if(s>=1){scene.edges.push(edge("X","Y",blue),edge("P","H",blue));scene.rights=[["H","B","P"]];}
  if(s>=2){highlight(scene,"L","N",amber);scene.rights?.push(["P","N","H"]);}
  return scene;
 }
 if(kind==="division"){
  const scene:Scene={points:{A:[0,0],B:[8,0],C:[5,5],D:[2,2],P:[3.2,0],T_1:[1,1],T_3:[3,3],T_4:[4,4]},
   labels:{T_1:"",T_3:"",T_4:""},visible:s===0?["A","B","C","D","T_1","T_3","T_4"]:undefined,
   edges:[edge("A","B"),edge("A","D",blue),edge("D","C",amber)],
   offsets:{A:[-23,4],B:[4,4],C:[6,-25],D:[-25,-20],P:[-8,5]},caption:s===0?"補助半直線を五つの等しい区間に分ける":s===1?"二番目の点から平行線を作る":s===2?"相似な三角形の部分と全体を対応させる":"補助線と元の線分で、二対三の部分が対応する"};
  if(s>=1)scene.edges.push(edge("C","B"),edge("D","P",blue));
  if(s>=2){scene.faces=[{names:["A","C","B"],color:amber},{names:["A","D","P"],color:blue}];highlight(scene,"A","P");}
  if(s>=3)highlight(scene,"P","B",amber);
  return scene;
 }
 if(kind==="tangents"){
  const scene:Scene={points:{O:[0,0],P:[5,0],M:[2.5,0],T:[1.8,2.4],U:[1.8,-2.4]},edges:[edge("O","P")],
   rings:[{center:[0,0],radius:3,color:blue},{center:[2.5,0],radius:2.5}],
   visible:s===0?["O","P","M"]:undefined,offsets:{O:[-24,2],P:[5,2],M:[-8,4],T:[1,-28],U:[1,3]},
   caption:s===0?"中心と外点を直径の両端とする補助円":s===1?"元の円と補助円の二つの交点":s===2?"直径に対する円周角は直角":"接点で半径と垂直に交わる二本の接線"};
  if(s>=2){scene.edges.push(edge("O","T",blue),edge("O","U",blue),edge("P","T",amber),edge("P","U",amber));scene.rights=[["T","O","P"],["U","O","P"]];}
  return scene;
 }
 if(kind==="lines"){
  const pairs=[["A","B","E","F"],["A","B","B","C"],["A","B","C","G"],["A","C","F","H"]],pair=pairs[Math.min(s,3)];
  const scene=box(["同じ側面の向かい合う辺","共有点で交わる二直線","平行でも交わる関係でもない二直線","別の平行な面にある、平行でない対角線"][Math.min(s,3)]);
  highlight(scene,pair[0],pair[1]);highlight(scene,pair[2],pair[3],amber);return scene;
 }
 if(kind==="planes"){
  const scene=box(["底面内で垂直な二本の辺","面内で交わる二本と、それらに垂直な辺","交線に垂直な各面の辺が二面の角を表す","向かい合う二面は平行"][Math.min(s,3)]);
  scene.faces=[{names:["A","B","C","D"],color:blue}];
  if(s===0){highlight(scene,"A","B");highlight(scene,"A","D",amber);}
  if(s===1){highlight(scene,"A","E");highlight(scene,"A","B",amber);highlight(scene,"A","D",amber);}
  if(s===2){scene.faces.push({names:["A","B","F","E"],color:amber});highlight(scene,"A","B",gray);highlight(scene,"A","D");highlight(scene,"A","E",amber);}
  if(s>=3)scene.faces.push({names:["E","F","G","H"],color:amber});
  return scene;
 }
 if(kind==="distance"){
  if(s===0){const scene=box("面への距離は垂線の長さ");scene.faces=[{names:["A","B","C","D"],color:blue}];highlight(scene,"E","A");return scene;}
  return {points:{E:[0,4],A:[0,0],B:[3,0]},edges:[edge("E","A",blue),edge("A","B",amber),edge("E","B")],rights:[["A","B","E"]],
   offsets:{E:[-19,-27],A:[-23,3],B:[6,3]},caption:"側面の直角三角形を取り出す"};
 }
 if(kind==="projection"){
  const scene=box(s===0?"端点を垂直に写して正射影を取る":"元の線分と正射影が作る角");
  scene.faces=[{names:["A","B","C","D"],color:amber}];highlight(scene,"A","G");scene.edges.push(edge("G","C",gray,true));highlight(scene,"A","C",amber);
  if(s>=1)scene.faces.push({names:["A","C","G"],color:blue});
  return scene;
 }
 if(kind==="section"){
  const scene=box(["底面内の二点を結ぶ","隣の側面で二点を結ぶ","三つ目の面で切り口を閉じる","同じ直角三角形から切り口の三辺が等しい"][Math.min(s,3)]);
  Object.assign(scene.points,{P:[2,0],Q:[.9,.8],R:[0,1.7]});
  Object.assign(scene.offsets!,{P:[0,4],Q:[-27,-23],R:[-24,-10]});
  const faces=[["A","B","C","D"],["A","D","H","E"],["A","B","F","E"]];
  scene.faces=[{names:faces[Math.min(s,2)],color:amber}];
  highlight(scene,"P","Q");
  if(s>=1)highlight(scene,"Q","R");
  if(s>=2)highlight(scene,"R","P");
  if(s>=3){scene.faces=[{names:["P","Q","R"],color:blue}];scene.edges.push(edge("A","P",amber),edge("A","Q",amber),edge("A","R",amber));}
  return scene;
 }
 if(kind==="parallel-section"){
  const scene=box("底面に平行な切り口を各側面でつなぐ");
  Object.assign(scene.points,{P:[0,1.7],Q:[4,1.7],R:[5.8,3.3],S:[1.8,3.3]});
  Object.assign(scene.offsets!,{P:[-22,-10],Q:[4,-4],R:[4,-8],S:[-20,-25]});
  scene.faces=[{names:["P","Q","R","S"],color:blue}];
  for(const [a,b] of [["P","Q"],["Q","R"],["R","S"],["S","P"]])highlight(scene,a,b);
  return scene;
 }
 if(kind==="counts"){
  const scene:Scene={points:{A:[0,0],B:[4,0],C:[2,1.3],D:[0,3],E:[4,3],F:[2,4.3]},
   edges:[edge("A","B"),edge("A","C",gray,true),edge("B","C",gray,true),edge("D","E"),edge("E","F"),edge("F","D"),edge("A","D"),edge("B","E"),edge("C","F",gray,true)],
   visible:s===0?["A","B","C"]:undefined,offsets:{A:[-20,4],B:[5,4],C:[-25,-17],D:[-21,-24],E:[5,-18],F:[-6,-28]},
   caption:["一つの底面の三頂点と三辺","二つの底面に対応する頂点","二つの底面の辺と、それらをつなぐ三辺","二つの底面と三つの側面"][Math.min(s,3)]};
  for(const [a,b] of [["A","B"],["A","C"],["B","C"]])highlight(scene,a,b);
  if(s>=1)for(const [a,b] of [["D","E"],["E","F"],["F","D"]])highlight(scene,a,b);
  if(s>=2)for(const [a,b] of [["A","D"],["B","E"],["C","F"]])highlight(scene,a,b,amber);
  if(s>=3)scene.faces=[{names:["A","B","E","D"],color:amber},{names:["B","C","F","E"],color:amber},{names:["C","A","D","F"],color:amber},{names:["A","B","C"],color:blue},{names:["D","E","F"],color:blue}];
  return scene;
 }
 if(kind==="pyramid"){
  return {points:{A:[0,0],B:[4,0],C:[2,1.3],P:[2,4.3]},
   edges:[edge("A","B",blue),edge("B","C",blue,true),edge("C","A",blue,true),edge("A","P",amber),edge("B","P",amber),edge("C","P",amber,true)],
   faces:[{names:["A","B","C"],color:blue}],offsets:{A:[-20,4],B:[5,4],C:[5,0],P:[-7,-28]},caption:"底面の三頂点から一つの頂点へつなぐ"};
 }
 return null;
}
function Drawing({scene}:{scene:Scene}){
 // All future points and rings remain in the bounds: a new construction line never shifts the diagram.
 const bounds=[...Object.values(scene.points),...(scene.rings??[]).flatMap(c=>[[c.center[0]-c.radius,c.center[1]-c.radius],[c.center[0]+c.radius,c.center[1]+c.radius]])];
 const xmin=Math.min(...bounds.map(p=>p[0])),xmax=Math.max(...bounds.map(p=>p[0])),ymin=Math.min(...bounds.map(p=>p[1])),ymax=Math.max(...bounds.map(p=>p[1]));
 const scale=Math.min(245/(xmax-xmin||1),175/(ymax-ymin||1)),x=(n:number)=>round(160+(n-(xmin+xmax)/2)*scale),y=(n:number)=>round(120-(n-(ymin+ymax)/2)*scale);
 return <figure style={{margin:"0 auto",width:"100%",maxWidth:320}}>
  <svg viewBox="0 0 320 240" role="img" aria-label={scene.caption} style={{display:"block",width:"100%",height:"auto"}}>
   {scene.faces?.map((face,i)=><polygon key={"f"+i} points={face.names.map(n=>x(scene.points[n][0])+","+y(scene.points[n][1])).join(" ")} fill={face.color} fillOpacity=".09"/>)}
   {scene.rings?.filter(r=>r.visible!==false).map((ring,i)=><circle key={"c"+i} cx={x(ring.center[0])} cy={y(ring.center[1])} r={round(ring.radius*scale)} fill="none" stroke={ring.color??gray} strokeWidth="1.4"/>)}
   {scene.edges.map((e,i)=><line key={"e"+i} x1={x(scene.points[e.a][0])} y1={y(scene.points[e.a][1])} x2={x(scene.points[e.b][0])} y2={y(scene.points[e.b][1])} stroke={e.color} strokeWidth={e.color===gray?"1.4":"2.8"} strokeDasharray={e.dashed?"5 4":undefined}/>)}
   {scene.rights?.map(([o,a,b],i)=>{
    const p=scene.points[o],pa=scene.points[a],pb=scene.points[b],la=Math.hypot(pa[0]-p[0],pa[1]-p[1]),lb=Math.hypot(pb[0]-p[0],pb[1]-p[1]);
    const u=[(pa[0]-p[0])/la*9,-(pa[1]-p[1])/la*9],v=[(pb[0]-p[0])/lb*9,-(pb[1]-p[1])/lb*9],px=x(p[0]),py=y(p[1]);
    return <path key={"r"+i} d={`M${round(px+u[0])} ${round(py+u[1])} l${round(v[0])} ${round(v[1])} l${round(-u[0])} ${round(-u[1])}`} fill="none" stroke={blue} strokeWidth="1.5"/>;
   })}
   {Object.entries(scene.points).filter(([name])=>!scene.visible||scene.visible.includes(name)).map(([name,p])=>{
    const offset=scene.offsets?.[name]??[5,-26],label=scene.labels?.[name]??name;
    return <g key={name}><circle cx={x(p[0])} cy={y(p[1])} r="2.5" fill="#30485e"/>
     {label!==""&&<foreignObject x={round(x(p[0])+offset[0])} y={round(y(p[1])+offset[1])} width="44" height="30"><div style={{fontSize:18,lineHeight:"26px",color:"#30485e"}}><MathText text={"$"+label+"$"}/></div></foreignObject>}</g>;
   })}
  </svg>
 </figure>;
}
export default function MathASpaceStructure({kind,stage}:{kind:string;stage:number;reduce:boolean}){
 const scene=makeScene(kind.replace(/^ma-space-/,""),stage);
 return scene?<Drawing scene={scene}/>:null;
}
