import type {GeoFigure} from "./matha-geometry-figures";
export function integerFigure(slug:string,index:number):GeoFigure|null{
 if(slug==="ma-euclidean-algorithm"&&index===0){
  return {caption:"縦三十・横八十四を、三十の正方形二枚と残り二十四に分けます。次は三十と二十四の長方形を調べます。",points:{A:[0,0],B:[84,0],C:[84,30],D:[0,30],E:[30,0],F:[30,30],G:[60,0],H:[60,30]},edges:[["A","B"],["B","C"],["C","D"],["D","A"],["E","F"],["G","H"]]};
 }
 if(slug==="ma-mathematics-activities"&&index===0){
  const points:GeoFigure["points"]={A:[0,0],B:[24,0],C:[24,18],D:[0,18]},edges=[["A","B"],["B","C"],["C","D"],["D","A"]];
  for(let x=6;x<24;x+=6){points["V_"+x]=[x,0];points["W_"+x]=[x,18];edges.push(["V_"+x,"W_"+x]);}
  for(let y=6;y<18;y+=6){points["L_"+y]=[0,y];points["R_"+y]=[24,y];edges.push(["L_"+y,"R_"+y]);}
  return {caption:"縦十八・横二十四を一辺六の正方形で分けると、縦三枚・横四枚で十二枚です。",points,edges,labels:Object.fromEntries(Object.keys(points).filter(k=>k.length>1).map(k=>[k,""]))};
 }
 if(slug==="ma-coordinates-space"){
  return {caption:index===0?"矢印は三つの軸の正方向。$P=(3,0,-2)$ は $y=0$ なので $xz$ 平面上です。図は空間の見取図で、軸の一単位は共通です。":"$P=(2,0,0)$ は $y,z$ の成分が零なので $x$ 軸上です。",points:index===0?{O:[0,0],x:[4,0],y:[1.8,1.8],z:[0,3],P:[3,-2],X:[3,0],Z:[0,-2]}:{O:[0,0],x:[4,0],y:[1.8,1.8],z:[0,3],P:[2,0]},edges:index===0?[["O","x"],["O","y"],["O","z"],["O","Z"]]:[["O","x"],["O","y"],["O","z"]],dashed:index===0?[["X","P"],["Z","P"]]:[],labels:{O:"O",x:"x",y:"y",z:"z",P:"P",X:"3",Z:"-2"},arrows:[["O","x"],["O","y"],["O","z"]]};
 }
 return null;
}
