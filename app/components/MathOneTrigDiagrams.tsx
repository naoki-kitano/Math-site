"use client";
import {Formula,MathText} from "./MathText";
import CoordinateDiagram,{type CoordinateDiagramProps as Diagram} from "./CoordinateDiagram";
type Point={x:number;y:number;label:string;labelOffset?:[number,number]};
type Edge={from:number;to:number;label?:string;dashed?:boolean;teal?:boolean;labelOffset?:[number,number]};
export type TrigFigure={title:string;description:string;points:Point[];edges:Edge[];right?:[number,number,number][];circle?:{x:number;y:number;r:number}};
const m=String.raw;
// Round only screen coordinates so server and browser agree on SVG attributes.
const screen=(value:number)=>Number(value.toFixed(4));
const tri=(title:string,description:string,b:number,c:number,A:number,labels:[string,string,string],sides:[string,string,string],right?:[number,number,number][]):TrigFigure=>({
 title,description,points:[{x:0,y:0,label:labels[0]},{x:c,y:0,label:labels[1]},{x:b*Math.cos(A*Math.PI/180),y:b*Math.sin(A*Math.PI/180),label:labels[2]}],
 edges:[{from:1,to:2,label:sides[0],teal:true},{from:2,to:0,label:sides[1]},{from:0,to:1,label:sides[2]}],right,
});
const ratioTriangle=tri("着目する角から辺を読む",m`$\angle C=90^\circ$。$\angle A$ の向かいは $BC$、斜辺は $AB$、残る隣の辺は $AC$ です。`,4,5,Math.acos(4/5)*180/Math.PI,["A","B","C"],["3","4","5"],[[0,2,1]]);
// All lengths are Euclidean in the plane. Perspective drawings are explicitly identified.
export const mathOneTrigFigures:Record<string,(TrigFigure|undefined)[]>={
 "m1-right-triangle":[ratioTriangle,{...ratioTriangle,title:"斜辺と残る辺",description:m`$AB=5,BC=3$。$AC^2=AB^2-BC^2$ と、斜辺の二乗から引きます。`}],
 "m1-trig-meaning":[ratioTriangle,{...ratioTriangle,title:"相似で長さが変わっても比は同じ",description:m`この三角形を全体に $2$ 倍しても、$\sin A=\frac{BC}{AB}=\frac35$。向かいと斜辺の両方が同じ倍率で伸びます。`}],
 "m1-special-angles":[
  tri("正三角形の半分",m`$\angle A=30^\circ$。$\tan A=\frac1{\sqrt3}$。斜辺の長さ $2$ は正接には使いません。`,Math.sqrt(3),2,30,[m`A\ (30^\circ)`,"B","C"],["1",m`\sqrt3`,"2"],[[0,2,1]]),
  tri("直角二等辺三角形",m`$\angle A=45^\circ$。$\sin A=\frac2{2\sqrt2}=\frac{\sqrt2}{2}$。`,2,2*Math.sqrt(2),45,[m`A\ (45^\circ)`,"B","C"],["2","2",m`2\sqrt2`],[[0,2,1]]),
 ],
 "m1-trig-sides-angles":[
  tri("未知の斜辺は分母",m`$\sin30^\circ=\frac4x$ から $x=8$。`,4*Math.sqrt(3),8,30,[m`A\ (30^\circ)`,"B","C"],["4",m`4\sqrt3`,"x"],[[0,2,1]]),
  tri("隣と斜辺の比から角へ",m`$\cos A=\frac12$、$A$ は鋭角なので $A=60^\circ$。`,1,2,60,["A","B","C"],[m`\sqrt3`,"1","2"],[[0,2,1]]),
 ],
 "m1-sine-law":[
  tri("辺は向かいの角と組にする",m`$a=BC$ は $A$ の向かい、$b=CA$ は $B$ の向かい、$c=AB$ は $C$ の向かいです。`,4,5,60,["A","B","C"],["a","b","c"]),
  tri("既知の組から別の辺へ",m`$a=2,A=30^\circ$ と $B=90^\circ$。$\frac b{\sin90^\circ}=\frac2{\sin30^\circ}$。`,4,2*Math.sqrt(3),30,[m`A\ (30^\circ)`,"B","C"],["2","b",m`2\sqrt3`],[[0,1,2]]),
 ],
 "m1-sine-circumcircle":[
  {title:"弦とその対角、外接円の半径",description:m`$BC=6$、$\angle BAC=30^\circ$。$\frac6{\sin30^\circ}=12=2R$ なので半径は $6$ です。`,points:[{x:0,y:6,label:m`A\ (30^\circ)`},{x:-3,y:-3*Math.sqrt(3),label:"B"},{x:3,y:-3*Math.sqrt(3),label:"C"},{x:0,y:0,label:"O"}],edges:[{from:0,to:1},{from:0,to:2},{from:1,to:2,label:"6",teal:true},{from:3,to:0,label:"R",dashed:true}],circle:{x:0,y:0,r:6}},
  {title:"半径から弦の長さへ",description:m`$R=3,\ A=60^\circ$ なら $BC=2\cdot3\sin60^\circ=3\sqrt3$。`,points:[{x:0,y:3,label:m`A\ (60^\circ)`},{x:-1.5*Math.sqrt(3),y:-1.5,label:"B"},{x:1.5*Math.sqrt(3),y:-1.5,label:"C"},{x:0,y:0,label:"O"}],edges:[{from:0,to:1},{from:0,to:2},{from:1,to:2,label:"a",teal:true},{from:3,to:0,label:"3",dashed:true}],circle:{x:0,y:0,r:3}},
 ],
 "m1-cosine-law-side":[
  tri("二辺にはさまれる角",m`$b=3,c=4$ の間の角は $A=60^\circ$。求める辺 $a$ はその向かいです。`,3,4,60,[m`A\ (60^\circ)`,"B","C"],["a","3","4"]),
  tri("鈍角でも同じ対応",m`$b=c=2,\ A=120^\circ$。$\cos120^\circ<0$ なので $a^2=4+4-8\left(-\frac12\right)=12$。`,2,2,120,[m`A\ (120^\circ)`,"B","C"],["a","2","2"]),
 ],
 "m1-cosine-law-angle":[
  tri("三辺から向かいの角へ",m`$a=4,b=c=3$。$A$ の余弦は $\frac{9+9-16}{18}=\frac19>0$ です。`,3,3,Math.acos(1/9)*180/Math.PI,["A","B","C"],["4","3","3"]),
  tri("負の余弦が表す鈍角",m`$a=\sqrt3,b=c=1$。$\cos A=-\frac12$ なので $A=120^\circ$。`,1,1,120,["A","B","C"],[m`\sqrt3`,"1","1"]),
 ],
 "m1-triangle-choice":[
  tri("既知の辺と対角を見つける",m`$A=30^\circ,B=60^\circ,a=2$。$a,A$ の組があるので正弦定理を使えます。`,2*Math.sqrt(3),4,30,[m`A\ (30^\circ)`,m`B\ (60^\circ)`,"C"],["2","b","4"]),
  {title:"同じ条件から二つの三角形",description:m`$A=30^\circ,a=1,b=\sqrt2$。$B$ は横の半直線上の二点が候補です。$B=45^\circ$ または $135^\circ$ で、どちらも残る角は正です。`,points:[{x:0,y:0,label:m`A\ (30^\circ)`},{x:Math.sqrt(1.5),y:Math.sqrt(.5),label:"C"},{x:Math.sqrt(1.5)+Math.sqrt(.5),y:0,label:"B_1"},{x:Math.sqrt(1.5)-Math.sqrt(.5),y:0,label:"B_2"}],edges:[{from:0,to:1,label:m`\sqrt2`},{from:0,to:2},{from:1,to:2,label:"1",teal:true},{from:1,to:3,label:"1",dashed:true,teal:true}]},
 ],
 "m1-triangle-area":[
  tri("高さは辺と正弦の積",m`$AB=3,AC=4,A=60^\circ$。$C$ から直線 $AB$ への高さは $4\sin60^\circ$。`,4,3,60,[m`A\ (60^\circ)`,"B","C"],["","4","3"]),
  {title:"高さの足が延長上に出る場合",description:m`$AB=6,AC=4,A=150^\circ$。$H$ は直線 $AB$ 上にあり、$CH=4\sin150^\circ=2$ です。`,points:[{x:0,y:0,label:m`A\ (150^\circ)`},{x:6,y:0,label:"B"},{x:-2*Math.sqrt(3),y:2,label:"C"},{x:-2*Math.sqrt(3),y:0,label:"H"}],edges:[{from:0,to:1,label:"6"},{from:0,to:2,label:"4"},{from:1,to:2},{from:0,to:3,dashed:true},{from:3,to:2,label:"h",teal:true}],right:[[0,3,2]]},
 ],
 "m1-measurement":[
  {title:"目の水平線から上の高さ",description:m`水平距離は $10\,\mathrm{m}$、目の高さは $1.5\,\mathrm{m}$。仰角 $45^\circ$ の直角三角形から上の高さ $h$ を求め、最後に $1.5\,\mathrm{m}$ を足します。`,points:[{x:0,y:1.5,label:"P",labelOffset:[-32,-6]},{x:10,y:1.5,label:"Q",labelOffset:[26,-8]},{x:10,y:11.5,label:"T"},{x:0,y:0,label:"E",labelOffset:[-24,25]},{x:10,y:0,label:"F",labelOffset:[25,26]}],edges:[{from:0,to:1,label:"10",dashed:true},{from:0,to:2},{from:1,to:2,label:"h",teal:true},{from:0,to:3,label:"1.5",labelOffset:[-65,8]},{from:3,to:4},{from:4,to:1}],right:[[0,1,2]]},
  tri("基線の対角を先に求める",m`$AB=8\,\mathrm{m},A=B=45^\circ$。既知の辺 $AB$ の対角は $C=90^\circ$ です。`,4*Math.sqrt(2),8,45,[m`A\ (45^\circ)`,m`B\ (45^\circ)`,"C"],["","AC","8"],[[0,2,1]]),
  {title:"同じ底辺の二つの三角形",description:m`凸四角形を対角線 $AC=8$ で分けます。垂直距離 $3,4$ をそれぞれ高さにして、二つの面積を足します。`,points:[{x:0,y:0,label:"A"},{x:3,y:3,label:"B"},{x:8,y:0,label:"C"},{x:4,y:-4,label:"D"},{x:3,y:0,label:"H"},{x:4,y:0,label:"K"}],edges:[{from:0,to:1},{from:1,to:2},{from:2,to:3},{from:3,to:0},{from:0,to:2,label:"8",teal:true},{from:1,to:4,label:"3",dashed:true},{from:3,to:5,label:"4",dashed:true}],right:[[0,4,1],[2,5,3]]},
 ],
 "m1-space-triangles":[
  {title:"直方体から三角形を取り出す",description:m`これは立体の見取図で、画面上の角度や縮尺は実際と異なります。$AB=3,BC=4,CG=12$。底面の $AC$ を求めたら、三角形 $ACG$ を別の平面図として考えます。$CG$ は底面に垂直です。`,points:[{x:0,y:0,label:"A"},{x:4,y:0,label:"B"},{x:6,y:1.5,label:"C"},{x:2,y:1.5,label:"D"},{x:0,y:5,label:"E"},{x:4,y:5,label:"F"},{x:6,y:6.5,label:"G"},{x:2,y:6.5,label:"H"}],edges:[{from:0,to:1,label:"3",labelOffset:[0,24]},{from:1,to:2,label:"4",labelOffset:[28,14]},{from:2,to:3,dashed:true},{from:3,to:0,dashed:true},{from:0,to:4},{from:1,to:5},{from:2,to:6,label:"12",teal:true},{from:3,to:7,dashed:true},{from:4,to:5},{from:5,to:6},{from:6,to:7},{from:7,to:4},{from:0,to:2,dashed:true,teal:true},{from:0,to:6,teal:true}]},
  tri("側面の高さを含む断面",m`一辺 $6$、高さ $4$ の四角錐から三角形 $VOM$ を取り出しました。$OM=3$ なので $VM=5$。側辺 $VA$ なら $OM$ でなく $OA=3\sqrt2$ を使います。`,4,5,Math.acos(4/5)*180/Math.PI,["V","M","O"],["3","4","VM"],[[0,2,1]]),
 ],
};
const semicircle=(title:string,description:string,angles:number[],r=1):Diagram=>({
 title,description,xRange:[-1.4*r,1.4*r],yRange:[-.2*r,1.4*r],
 arcs:[{x:0,y:0,r,from:0,to:Math.PI,label:m`$x^2+y^2=${r*r}$`}],
 points:angles.map(a=>({x:r*Math.cos(a*Math.PI/180),y:r*Math.sin(a*Math.PI/180),label:Number.isInteger(a)?m`$\theta=${a}^\circ$`:m`$P$`})),
 segments:angles.flatMap(a=>[{from:[0,0] as [number,number],to:[r*Math.cos(a*Math.PI/180),r*Math.sin(a*Math.PI/180)] as [number,number],label:Number.isInteger(a)?m`$\theta=${a}^\circ$`:m`$OP$`},{from:[r*Math.cos(a*Math.PI/180),0] as [number,number],to:[r*Math.cos(a*Math.PI/180),r*Math.sin(a*Math.PI/180)] as [number,number],dashed:true,label:""}]),
 axisDescription:"横軸は横座標 $x$、縦軸は縦座標 $y$。角は正の横軸から反時計回りに測ります。",
});
export const mathOneTrigCoordinateFigures:Record<string,(Diagram|undefined)[]>={
 "m1-trig-coordinates":[{...semicircle("座標の符号と三角比",m`$P(-3,4),OP=5$。縦座標は正、横座標は負です。$\sin\theta=\frac45,\cos\theta=-\frac35,\tan\theta=-\frac43$。`,[Math.acos(-3/5)*180/Math.PI],5),points:[{x:-3,y:4,label:m`$P(-3,4)$`}]},semicircle("軸上の正弦と正接の条件",m`$\theta=90^\circ$ では点 $(0,1)$ なので $\sin90^\circ=1$。一方、正接は $\frac yx$ の分母がゼロになり、定義されません。`,[90])],
 "m1-trig-relations":[semicircle("符号は角の範囲から",m`$\sin\theta=\frac35$、$\theta$ は鈍角なので左上の点です。$\cos\theta=-\frac45$。`,[180-Math.asin(3/5)*180/Math.PI]),semicircle("二つの鋭角を入れ替える",m`$30^\circ$ の横座標は、$60^\circ$ の縦座標と同じです。$\sin(90^\circ-30^\circ)=\cos30^\circ$。`,[30,60]),semicircle("左右対称なら横の符号だけ反転",m`$30^\circ$ と $150^\circ$ の高さは等しく、横座標は反対符号です。`,[30,150])],
 "m1-equal-sines":[semicircle("同じ高さの二点",m`$\sin\theta=\frac12$ の点は二つ。$\theta=30^\circ,150^\circ$ です。`,[30,150]),semicircle("同じ横座標の点は一つ",m`$\cos\theta=-\frac12$ に対応する上半円上の点は $\theta=120^\circ$ の一点です。`,[120])],
};
export default function MathOneTrigDiagrams({slug,index}:{slug:string;index:number}){
 const f=mathOneTrigFigures[slug]?.[index],c=mathOneTrigCoordinateFigures[slug]?.[index];
 if(c)return <CoordinateDiagram {...c}/>;
 if(!f)return null;
 const xs=f.points.map(p=>p.x),ys=f.points.map(p=>p.y);
 if(f.circle){xs.push(f.circle.x-f.circle.r,f.circle.x+f.circle.r);ys.push(f.circle.y-f.circle.r,f.circle.y+f.circle.r);}
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),cx=(minX+maxX)/2,cy=(minY+maxY)/2;
 const scale=Math.min(470/(maxX-minX||1),260/(maxY-minY||1));
 const point=(p:{x:number;y:number})=>({x:screen(320+(p.x-cx)*scale),y:screen(185-(p.y-cy)*scale)});
 const ps=f.points.map(point);
 return <figure className="panel math-figure trig-figure"><h4>{f.title}</h4><p><MathText text={f.description}/></p>
 <svg className="coordinate-diagram" viewBox="0 0 640 380" role="img" aria-label={f.title}><title>{f.title}</title>
 {f.circle&&<circle cx={point(f.circle).x} cy={point(f.circle).y} r={screen(f.circle.r*scale)} fill="none" stroke="#a5b9c7" strokeWidth="2"/>}
 {f.edges.map((e,i)=>{const a=ps[e.from],b=ps[e.to],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;return <g key={i}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={e.teal?"#087c70":"#526d89"} strokeWidth={e.teal?3:2} strokeDasharray={e.dashed?"6 5":undefined}/>{e.label&&<foreignObject x={screen((a.x+b.x)/2+(e.labelOffset?.[0]??dy/len*17)-48)} y={screen((a.y+b.y)/2+(e.labelOffset?.[1]??-dx/len*17)-30)} width="96" height="60"><div className="diagram-label"><Formula tex={e.label}/></div></foreignObject>}</g>})}
 {f.right?.map(([i,j,k],n)=>{const a=ps[i],o=ps[j],b=ps[k],la=Math.hypot(a.x-o.x,a.y-o.y),lb=Math.hypot(b.x-o.x,b.y-o.y),u={x:(a.x-o.x)/la*12,y:(a.y-o.y)/la*12},v={x:(b.x-o.x)/lb*12,y:(b.y-o.y)/lb*12};return <polyline key={n} points={`${screen(o.x+u.x)},${screen(o.y+u.y)} ${screen(o.x+u.x+v.x)},${screen(o.y+u.y+v.y)} ${screen(o.x+v.x)},${screen(o.y+v.y)}`} fill="none" stroke="#526d89" strokeWidth="1.5"/>})}
 {ps.map((p,i)=>{const dx=p.x===320&&p.y===185?-1:p.x-320,dy=p.y-185,len=Math.hypot(dx,dy)||1;return <g key={i}><circle cx={p.x} cy={p.y} r="3.5" fill="#0b1f3a"/><foreignObject x={screen(p.x+(f.points[i].labelOffset?.[0]??dx/len*25)-68)} y={screen(p.y+(f.points[i].labelOffset?.[1]??dy/len*25)-30)} width="136" height="60"><div className="diagram-label"><Formula tex={f.points[i].label}/></div></foreignObject></g>})}
 </svg></figure>;
}
