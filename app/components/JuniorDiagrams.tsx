import {MathText} from "./MathText";
const m=String.raw;
function Label({x,y,text}:{x:number;y:number;text:string}){
 return <foreignObject x={x} y={y} width="100" height="45"><div style={{fontSize:16}}><MathText text={text}/></div></foreignObject>;
}
export default function JuniorDiagrams({slug,index}:{slug:string;index:number}){
 if(index!==0)return null;
 if(slug==="jr-signed-add")return <figure className="panel junior-figure"><svg viewBox="0 0 420 150" role="img" aria-label="数直線上で3から左へ5進むとマイナス2">
  <line x1="25" y1="65" x2="395" y2="65" stroke="#526d89"/>
  {[-3,-2,-1,0,1,2,3,4].map((n,i)=><g key={n}><line x1={40+45*i} x2={40+45*i} y1="60" y2="70" stroke="#526d89"/><Label x={32+45*i} y={77} text={"$"+n+"$"}/></g>)}
  <path d="M310 45H85l12 -8m-12 8 12 8" fill="none" stroke="#087c70" strokeWidth="3"/>
  <circle cx="310" cy="65" r="5" fill="#15213a"/><circle cx="85" cy="65" r="5" fill="#087c70"/>
 </svg><figcaption>負の数を足すと、左へ進みます。</figcaption></figure>;
 if(slug==="jr-coordinates"||slug==="jr-linear-function"||slug==="jr-quadratic-function"){
  const quadratic=slug==="jr-quadratic-function",linear=slug==="jr-linear-function";
  const X=(x:number)=>180+30*x,Y=(y:number)=>270-20*y;
  const path=Array.from({length:81},(_,i)=>{const x=-3+i*6/80;return X(x)+","+Y(quadratic?2*x*x:linear?2*x+3:2*x);}).join(" ");
  return <figure className="panel junior-figure"><svg viewBox="0 0 420 340" role="img" aria-label={quadratic?"二乗に比例する関数の左右対称なグラフ":linear?"切片3、傾き2の直線":"直線上にある点と、同じ横座標で直線上にない点"}>
   <defs><clipPath id={"jr-clip-"+slug}><rect x="35" y="25" width="340" height="285"/></clipPath></defs>
   <line x1="30" y1="270" x2="385" y2="270" stroke="#526d89"/><line x1="180" y1="15" x2="180" y2="310" stroke="#526d89"/>
   <Label x={388} y={257} text="$x$"/><Label x={185} y={0} text="$y$"/><Label x={158} y={273} text="$0$"/>
   <polyline points={path} clipPath={"url(#jr-clip-"+slug+")"} fill="none" stroke="#087c70" strokeWidth="3"/>
   {(quadratic?[[-2,8],[2,8]]:linear?[[0,3],[1,5]]:[[3,6],[3,7]]).map(([x,y])=><g key={x+","+y}><line x1={X(x)} y1="270" x2={X(x)} y2={Y(y)} stroke="#94a3b8" strokeDasharray="4 4"/><circle cx={X(x)} cy={Y(y)} r="5" fill={y===7?"#a74232":"#15213a"}/><Label x={X(x)+7} y={Y(y)-20} text={"$("+x+","+y+")$"}/></g>)}
  </svg><figcaption><MathText text={quadratic?m`$y=2x^2$。横の座標が反対でも、高さは同じです。`:linear?m`$y=2x+3$。横に $1$ 進むと縦に $2$ 上がります。`:m`$y=2x$。$(3,6)$ は直線上ですが、$(3,7)$ は直線上ではありません。`}/></figcaption></figure>;
 }
 if(slug==="jr-pythagoras"||slug==="jr-area-volume")return <figure className="panel junior-figure"><svg viewBox="0 0 420 260" role="img" aria-label="直角を挟む二辺と、その向かいの斜辺を示す三角形">
  <path d="M70 210V30L310 210Z" fill="#edf7f4" stroke="#087c70" strokeWidth="3"/><path d="M70 192H88V210" fill="none" stroke="#526d89"/>
  <Label x={29} y={118} text={slug==="jr-pythagoras"?"$9$":"高さ"}/><Label x={172} y={211} text={slug==="jr-pythagoras"?"$12$":"底辺"}/><Label x={193} y={89} text={slug==="jr-pythagoras"?"$c$":"斜めの辺"}/>
 </svg><figcaption>{slug==="jr-pythagoras"?<MathText text={m`直角の向かいが斜辺です。$9^2+12^2=c^2$ と置きます。`}/>:"高さは底辺に垂直な長さです。この図は長さの縮尺を表していません。"}</figcaption></figure>;
 return null;
}
