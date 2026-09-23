import type {GeoFigure,Point} from "./matha-geometry-figures";
const cube={A:[0,0],B:[5,0],C:[7,2],D:[2,2],E:[0,5],F:[5,5],G:[7,7],H:[2,7]} as Record<string,Point>;
const boxEdges=[["A","B"],["B","C"],["C","G"],["G","H"],["H","E"],["E","A"],["E","F"],["F","G"],["B","F"]];
const hidden=[["A","D"],["D","C"],["D","H"]];
export function spaceFigure(slug:string,index:number):GeoFigure|null{
 if(slug==="ma-construction-bisectors"){
  if(index===0)return {caption:"同じ半径の二円の交点 $P,Q$ を結びます。円弧を消さずに残します。",points:{A:[-2,0],B:[2,0],P:[0,Math.sqrt(5)],Q:[0,-Math.sqrt(5)],M:[0,0]},edges:[["A","B"],["P","Q"]],circles:[{center:[-2,0],radius:3},{center:[2,0],radius:3}]};
  const u=Math.sqrt(3),P:Point=[3,0],Q:Point=[1.5,1.5*u],R:Point=[3, u];
  return {caption:"$OP=OQ$、$PR=QR$、$OR$ 共通。三辺相等から二つの角が等しくなります。",points:{O:[0,0],P,Q,R,A:[5,0],B:[2.5,2.5*u]},edges:[["O","A"],["O","B"],["O","R"]],dashed:[["P","R"],["Q","R"]],circles:[{center:[0,0],radius:3},{center:P,radius:u},{center:Q,radius:u}]};
 }
 if(slug==="ma-construction-perpendicular"){
  const base:GeoFigure={caption:"$P$ を中心とする円で直線上に等距離の二点 $A,B$ を取ります。$AB$ の垂直二等分線が垂線です。",points:{A:[-2,0],B:[2,0],P:[0,3],H:[0,0]},edges:[["A","B"],["P","H"]],circles:[{center:[0,3],radius:Math.sqrt(13)},{center:[-2,0],radius:3},{center:[2,0],radius:3}]};
  if(index===1){base.points.C=[-2,3];base.points.D=[2,3];base.edges.push(["C","D"]);base.caption="最初に $PH$ を作り、次に $P$ で $PH$ に垂線 $CD$ を作ります（作図の流れ）。";}
  return base;
 }
 if(slug==="ma-construction-division"){
  const n=index===0?2:4,points:Record<string,Point>={A:[0,0],B:[8,0]},es=[["A","B"]],ds:string[][]=[];
  for(let i=1;i<=n;i++){points["P_"+i]=[i,i];points["Q_"+i]=[8*i/n,0];if(i<n)ds.push(["P_"+i,"Q_"+i]);}
  es.push(["A","P_"+n],["P_"+n,"B"]);
  return {caption:index===0?"補助半直線を同じ間隔で区切り、最後の点と $B$ を結びます。途中の点から平行線を作ります。":"比が $2:2$ の例では、補助半直線を四区間に分けて二番目を対応させます。",points,edges:es,dashed:ds};
 }
 if(slug==="ma-construction-tangents"){
  if(index===0)return {caption:"$T$ で半径 $OT$ に垂線を作図します。直線上の等距離二点から円弧を描きます。",points:{O:[0,0],T:[3,0],A:[2,0],B:[4,0],P:[3,Math.sqrt(3)],Q:[3,-Math.sqrt(3)]},edges:[["O","B"],["P","Q"]],circles:[{center:[0,0],radius:3},{center:[2,0],radius:2},{center:[4,0],radius:2}]};
  return {caption:"$OP$ の中点 $M$ を中心に、直径 $OP$ の円を描きます。二つの交点で半径と接線が直角になります。",points:{O:[0,0],P:[5,0],M:[2.5,0],T:[1.8,2.4],U:[1.8,-2.4]},edges:[["O","P"],["P","T"],["P","U"]],dashed:[["O","T"],["O","U"]],circles:[{center:[0,0],radius:3},{center:[2.5,0],radius:2.5}]};
 }
 if(["ma-space-lines","ma-space-lines-planes","ma-space-angle-distance","ma-solid-sections"].includes(slug)){
  const points={...cube},es=boxEdges.map(e=>[...e]),ds=hidden.map(e=>[...e]);
  let caption="下の面は $ABCD$、上の面は $EFGH$。破線は奥にある辺です。見取図の角度は実際の角度を表しません。";
  if(slug==="ma-space-lines"&&index===1){ds.push(["A","C"],["F","H"]);caption+=" $AC$ と $FH$ は同じ点で交わりません。";}
  if(slug==="ma-space-angle-distance"){
   if(index===0){es.push(["E","B"]);caption+=" $EB$ は点までの斜めの距離、$EA$ は面までの垂直距離です。";}
   else {es.push(["A","G"]);ds.push(["A","C"]);caption+=" $G$ の垂線の足は $C$。底面との角は $\\angle GAC$ です。";}
  }
  if(slug==="ma-solid-sections"){
   if(index===0){points.P=[2.5,0];points.Q=[1,1];points.R=[0,2.5];es.push(["P","Q"],["Q","R"],["R","P"]);caption+=" 中点 $P,Q,R$ を、各面の中で結びます。";}
   else {points.P=[0,2.5];points.Q=[5,2.5];points.R=[7,4.5];points.S=[2,4.5];es.push(["P","Q"],["Q","R"],["R","S"],["S","P"]);caption+=" 同じ高さで底面に平行な切り口は正方形です。";}
  }
  return {points,edges:es,dashed:ds,caption};
 }
 if(slug==="ma-polyhedron-counts"){
  if(index===0)return {caption:"三角柱は三角形の底面が二つと、側面が三つです。奥の辺も含めて数えます。",points:{A:[0,0],B:[4,0],C:[2,2],D:[0,4],E:[4,4],F:[2,6]},edges:[["A","B"],["A","D"],["B","E"],["D","E"],["E","F"],["F","D"]],dashed:[["A","C"],["B","C"],["C","F"]]};
  return {caption:"三角錐は底面の三辺と、頂点へつながる三辺を分けて数えます。",points:{A:[0,0],B:[4,0],C:[2,2],P:[2,5]},edges:[["A","B"],["A","P"],["B","P"],["C","P"]],dashed:[["A","C"],["B","C"]]};
 }
 return null;
}
