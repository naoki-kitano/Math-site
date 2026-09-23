export type Point=[number,number];
export type GeoFigure={caption:string;points:Record<string,Point>;edges:string[][];dashed?:string[][];circles?:{center:Point;radius:number}[];labels?:Record<string,string>;rightAngles?:string[][];arrows?:string[][]};
const mix=(a:Point,b:Point,t:number):Point=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
const tri=(ab:number,ac:number,bc:number)=>{const x=(ab*ab-ac*ac+bc*bc)/(2*bc);return {A:[x,Math.sqrt(ab*ab-x*x)] as Point,B:[0,0] as Point,C:[bc,0] as Point};};
const edges=[["A","B"],["B","C"],["C","A"]];
const circlePoint=(deg:number):Point=>[4*Math.cos(deg*Math.PI/180),4*Math.sin(deg*Math.PI/180)];
export function geometryFigure(slug:string,index:number):GeoFigure|null{
 if(slug==="ma-incenter-circumcenter"){
  if(index===0)return {caption:"内心から辺への距離は、三本の垂線で測ります。図は半径一の内接円です。",points:{A:[0,3],B:[0,0],C:[4,0],I:[1,1],J:[1,0],K:[0,1],L:[1.6,1.8]},edges,dashed:[["I","J"],["I","K"],["I","L"]],circles:[{center:[1,1],radius:1}]};
  if(index===1){const pt=(a:number)=>circlePoint(a).map(v=>v/2) as Point;return {caption:"外心から測るのは頂点までの距離です。三本とも長さ二の半径です。",points:{A:pt(80),B:pt(200),C:pt(330),O:[0,0]},edges,dashed:[["O","A"],["O","B"],["O","C"]],circles:[{center:[0,0],radius:2}]};}
  return {caption:"斜辺三の直角三角形。外心は斜辺の中点で、半径は $\\frac32$ です。",points:{A:[0,1.8],B:[0,0],C:[2.4,0],O:[1.2,.9]},edges,circles:[{center:[1.2,.9],radius:1.5}],rightAngles:[["B","A","C"]]};
 }
 if(slug==="ma-parallel-ratios"||slug==="ma-area-ratios"){
  if(index>0)return null;
  const pts={A:[2,6] as Point,B:[0,0] as Point,C:[10,0] as Point};
  if(slug==="ma-area-ratios")return {caption:"二つの三角形は、同じ頂点から同じ直線への高さを使います。",points:{...pts,D:[4,0],H:[2,0]},edges:[...edges,["A","D"]],dashed:[["A","H"]]};
  // AB is five units, AC ten units, as in the first example.
  const base=tri(5,10,8),D=mix(base.A,base.B,0.4),E=mix(base.A,base.C,0.4);
  return {caption:"$AD:DB=2:3$。平行な $DE$ と $BC$ から、二つの三角形を対応させます。",points:{...base,D,E},edges:[...edges,["D","E"]]};
 }
 if(slug==="ma-triangle-sides-angles"&&index===1)return {caption:"最長辺 $BC$ の向かいは、頂点 $A$ の角です。",points:tri(3,4,5),edges};
 if(slug==="ma-angle-bisector"){
  const pts=tri(6,9,10);
  if(index===0)return {caption:"内側は $BD+DC=BC$。二つの三角形の面積比を比べます。",points:{...pts,D:[4,0]},edges:[...edges,["A","D"]]};
  if(index===1)return {caption:"外側は $CE-BE=BC$。$E$ は $B$ 側の延長上にあります。",points:{...pts,E:[-20,0]},edges:[...edges,["A","E"],["E","B"]]};
 }
 if(slug==="ma-centroid"&&index===0){
  const A:Point=[0,3],B:Point=[-2,0],C:Point=[2,0],D:Point=[0,0],E=mix(A,C,.5),G:Point=[0,1];
  return {caption:"$D,E$ は中点。頂点側の部分が長く、$AG:GD=2:1$ です。",points:{A,B,C,D,E,G},edges:[...edges,["A","D"],["B","E"]],dashed:[["D","E"]]};
 }
 if(slug==="ma-ceva"||slug==="ma-geometry-converses"){
  if(index>0)return null;
  const A:Point=[2,6],B:Point=[0,0],C:Point=[10,0];
  const converse=slug==="ma-geometry-converses";
  const D=mix(B,C,converse?1/3:2/5),E=mix(C,A,converse?1/4:3/7),F=mix(A,B,converse?6/7:2/3);
  return {caption:"$D,E,F$ は三辺の内部。比を $BD:DC,CE:EA,AF:FB$ の順に読みます。",points:{A,B,C,D,E,F},edges:[...edges,["A","D"],["B","E"],["C","F"]]};
 }
 if(slug==="ma-menelaus"&&index===0){
  const A:Point=[0,6],B:Point=[0,0],C:Point=[9,0],D=mix(B,C,1/3),E=mix(C,A,1/4),F:Point=[0,-1.2],G:Point=[9,2.4];
  return {caption:"$D,E,F$ は一直線。$CG\\parallel AB$ を引くと、二組の相似が見つかります。",points:{A,B,C,D,E,F,G},edges:[...edges,["B","F"],["F","G"]],dashed:[["C","G"]]};
 }
 if(slug==="ma-inscribed-angle"&&index===0){
  const A=circlePoint(20),B=circlePoint(70),C=circlePoint(220),O:Point=[0,0];
  return {caption:"頂点 $C$ を含まない短い弧 $AB$ の中心角が $50^\\circ$、円周角が $25^\\circ$ です。",points:{A,B,C,O},edges:[["C","A"],["C","B"],["O","A"],["O","B"]],circles:[{center:O,radius:4}]};
 }
 if(slug==="ma-cyclic-quadrilateral"&&index===0){
  const A=circlePoint(170),B=circlePoint(40),C=circlePoint(0),D=circlePoint(-60);
  return {caption:"対角 $A,C$ が見込む二つの弧で一周になります。",points:{A,B,C,D},edges:[["A","B"],["B","C"],["C","D"],["D","A"]],circles:[{center:[0,0],radius:4}]};
 }
 if(slug==="ma-circle-tangent"){
  const O:Point=[0,0],P:Point=[5,0],T:Point=[1.8,2.4],U:Point=[1.8,-2.4];
  if(index===0)return {caption:"$OT=3,OP=5$。接点 $T$ で半径と接線が直角になります。",points:{O,P,T},edges:[["O","P"],["O","T"],["P","T"]],circles:[{center:O,radius:3}],rightAngles:[["T","O","P"]]};
  const shrink=(a:Point)=>a.map(v=>v*.75) as Point;
  return {caption:"共通の斜辺と同じ半径から合同。二本の接線の長さは、ともに三です。",points:{O,P:shrink(P),T:shrink(T),U:shrink(U)},edges:[["O","P"],["O","T"],["P","T"],["O","U"],["P","U"]],circles:[{center:O,radius:2.25}],rightAngles:[["T","O","P"],["U","O","P"]]};
 }
 if(slug==="ma-tangent-chord"){
  const A:Point=[4,0],B=circlePoint(100),C=circlePoint(230),T:Point=[4,5],S:Point=[4,-5];
  return {caption:"$AT$ と $C$ は直線 $AB$ の反対側。$\\angle TAB=\\angle ACB=50^\\circ$、反対向きの角は $130^\\circ$ です。",points:{A,B,C,T,S},edges:[["T","S"],["A","B"],["A","C"],["B","C"]],circles:[{center:[0,0],radius:4}]};
 }
 if(slug==="ma-power-of-point"){
  if(index===0){
   // Circle x²+y²-4x-y-12=0: intersections on axes (-2,0),(6,0),(0,-3),(0,4).
   return {caption:"すべての線分を交点 $P$ から測ります。$2\\times6=3\\times4$。",points:{P:[0,0],A:[-2,0],B:[6,0],C:[0,-3],D:[0,4]},edges:[["A","B"],["C","D"]],circles:[{center:[2,.5],radius:Math.sqrt(16.25)}]};
  }
  if(index===1)return {caption:"二本の割線でも、同じ点 $P$ から測ります。$PA\\cdot PB=3\\times8=PC\\cdot PD=2\\times12$。",points:{P:[0,0],A:[3,0],B:[8,0],C:[0,2],D:[0,12]},edges:[["P","B"],["P","D"]],circles:[{center:[5.5,7],radius:Math.sqrt(55.25)}]};
  // Circle through x=3,8; tangent from origin has length sqrt24.
  const O:Point=[5.5,0],P:Point=[0,0],A:Point=[3,0],B:Point=[8,0],tx=24/5.5,T:Point=[tx,Math.sqrt(24-tx*tx)];
  return {caption:"$PA=3,AB=5$ から $PB=8$ を作ります。接線なら $PT^2=3\\times8$ です。",points:{O,P,A,B,T},edges:[["P","B"],["P","T"]],dashed:[["O","T"]],circles:[{center:O,radius:2.5}]};
 }
 if(slug==="ma-two-circles"&&index===0)return {caption:"半径 $5,2$、中心間距離 $7$。二円は外側で一つの接点を共有します。",points:{O:[0,0],P:[7,0],T:[5,0]},edges:[["O","P"]],circles:[{center:[0,0],radius:5},{center:[7,0],radius:2}]};
 if(slug==="ma-common-tangents"){
  const inner=index===1,r=inner?2:4,s=1,d=5,leg=inner?r+s:r-s;
  const u:Point=[leg/d,Math.sqrt(1-(leg/d)**2)],O:Point=[0,0],P:Point=[d,0],T:Point=[r*u[0],r*u[1]],U:Point=[d+(inner?-1:1)*s*u[0],(inner?-1:1)*s*u[1]];
  return {caption:inner?"内共通接線：中心は反対側なので、垂直方向は半径の和です。":"外共通接線：中心は同じ側なので、垂直方向は半径の差です。",points:{O,P,T,U},edges:[["O","P"],["O","T"],["P","U"],["T","U"]],circles:[{center:O,radius:r},{center:P,radius:s}],rightAngles:[["T","O","U"],["U","P","T"]]};
 }
 return null;
}
