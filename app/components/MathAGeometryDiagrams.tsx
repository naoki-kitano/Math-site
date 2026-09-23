import {MathText} from "./MathText";
import {geometryFigure,type GeoFigure} from "../content/matha-geometry-figures";
export function GeometryDrawing({figure}:{figure:GeoFigure}){
 const pts=Object.values(figure.points),bounds=[...pts,...(figure.circles??[]).flatMap(c=>[[c.center[0]-c.radius,c.center[1]-c.radius],[c.center[0]+c.radius,c.center[1]+c.radius]])];
 const xmin=Math.min(...bounds.map(p=>p[0])),xmax=Math.max(...bounds.map(p=>p[0])),ymin=Math.min(...bounds.map(p=>p[1])),ymax=Math.max(...bounds.map(p=>p[1]));
 const scale=Math.min(310/(xmax-xmin||1),210/(ymax-ymin||1)),x=(n:number)=>200+(n-(xmin+xmax)/2)*scale,y=(n:number)=>140-(n-(ymin+ymax)/2)*scale;
 const edge=(names:string[],i:number,dashed=false)=>{const a=figure.points[names[0]],b=figure.points[names[1]];return <line key={(dashed?"d":"e")+i} x1={x(a[0])} y1={y(a[1])} x2={x(b[0])} y2={y(b[1])} stroke={dashed?"#81929b":"#30485e"} strokeWidth="2" strokeDasharray={dashed?"5 4":undefined}/>;};
 return <figure className="math-a-figure"><svg viewBox="0 0 400 290" role="img" aria-label="本文の点と線分を対応させる図形">
 {(figure.circles??[]).map((c,i)=><circle key={i} cx={x(c.center[0])} cy={y(c.center[1])} r={c.radius*scale} fill="none" stroke="#4a9285" strokeWidth="2"/>)}
 {figure.edges.map((e,i)=>edge(e,i))}{figure.dashed?.map((e,i)=>edge(e,i,true))}
 {figure.rightAngles?.map(([corner,a,b],i)=>{
  const p=figure.points[corner],pa=figure.points[a],pb=figure.points[b],da=Math.hypot(pa[0]-p[0],pa[1]-p[1]),db=Math.hypot(pb[0]-p[0],pb[1]-p[1]);
  const u=[(pa[0]-p[0])/da*8,-(pa[1]-p[1])/da*8],v=[(pb[0]-p[0])/db*8,-(pb[1]-p[1])/db*8],px=x(p[0]),py=y(p[1]);
  return <path key={"r"+i} d={`M${px+u[0]} ${py+u[1]} l${v[0]} ${v[1]} l${-u[0]} ${-u[1]}`} fill="none" stroke="#4a9285" strokeWidth="1.5"/>;
 })}
 {figure.arrows?.map(([a,b],i)=>{
  const p=figure.points[a],end=figure.points[b],dx=x(end[0])-x(p[0]),dy=y(end[1])-y(p[1]),len=Math.hypot(dx,dy),ux=dx/len,uy=dy/len,px=x(end[0]),py=y(end[1]);
  return <path key={"a"+i} d={`M${px-8*ux-4*uy} ${py-8*uy+4*ux} L${px} ${py} L${px-8*ux+4*uy} ${py-8*uy-4*ux}`} fill="none" stroke="#30485e" strokeWidth="1.5"/>;
 })}
 {Object.entries(figure.points).map(([name,p])=><g key={name}><circle cx={x(p[0])} cy={y(p[1])} r="2.5" fill="#30485e"/>{figure.labels?.[name]!==""&&<foreignObject x={x(p[0])+3} y={y(p[1])-25} width="40" height="28"><div style={{fontSize:16}}><MathText text={"$"+(figure.labels?.[name]??name)+"$"}/></div></foreignObject>}</g>)}
 </svg><figcaption><MathText text={figure.caption}/></figcaption></figure>;
}
export default function MathAGeometryDiagrams({slug,index}:{slug:string;index:number}){
 const figure=geometryFigure(slug,index);return figure?<GeometryDrawing figure={figure}/>:null;
}
