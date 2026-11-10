import {Formula} from './MathText';
const m=String.raw;
const X=(x:number)=>40+200*x,Y=(y:number)=>220-200*y;
const rounded=(value:number)=>Number(value.toFixed(3));
function Label({x,y,tex,width=60}:{x:number;y:number;tex:string;width?:number}){
 return <foreignObject x={x-width/2} y={y-19} width={width} height="50"><div className="length-structure-label"><Formula tex={tex}/></div></foreignObject>;
}
export default function Math3LengthStructure({kind,stage,reduce}:{kind:string;stage:number;reduce:boolean}){
 if(kind!=='arc-length')return null;
 const curve=Array.from({length:81},(_,i)=>{const x=i/80;return `${i?'L':'M'}${rounded(X(x))},${rounded(Y(x*x))}`;}).join(' ');
 const a=.1,b=.9,p={x:X(a),y:Y(a*a)},q={x:X(b),y:Y(b*b)};
 const polygon=Array.from({length:5},(_,i)=>{const x=i/4;return `${i?'L':'M'}${rounded(X(x))},${rounded(Y(x*x))}`;}).join(' ');
 return <div className={`length-structure${reduce?' reduced':''}`}>
  <svg viewBox="0 0 300 270" role="img" aria-label={stage<2?'放物線上の二点を結ぶ線分と、横の変化、縦の変化からできる直角三角形。線分は曲線の一部の近似。':'放物線を四本の線分で近似した折れ線。さらに分割を細かくした長さの和の極限を考える。'}>
   <path d="M30 220H267 M40 230V14" stroke="#8195a9" strokeWidth="1.3" fill="none"/>
   <path d={curve} stroke="#9dabb8" strokeWidth="2.4" fill="none"/>
   <Label x={265} y={242} tex="x" width={32}/><Label x={23} y={18} tex="y" width={30}/>
   <Label x={27} y={242} tex="0" width={30}/><Label x={240} y={242} tex="1" width={30}/>
   <Label x={114} y={31} tex="y=x^2" width={110}/>
   {stage<2?<g>
    <path d={`M${p.x} ${p.y}H${q.x}`} stroke="#176c82" strokeWidth={stage===1?4:3} fill="none"/>
    <path d={`M${q.x} ${p.y}V${q.y}`} stroke="#936114" strokeWidth="3" fill="none"/>
    <path d={`M${p.x} ${p.y}L${q.x} ${q.y}`} stroke="#172235" strokeWidth="3" fill="none"/>
    <path d={`M${q.x-11} ${p.y}V${p.y-11}H${q.x}`} stroke="#8195a9" strokeWidth="1.2" fill="none"/>
    <circle cx={p.x} cy={p.y} r="3.5" fill="#172235"/><circle cx={q.x} cy={q.y} r="3.5" fill="#172235"/>
    <Label x={(p.x+q.x)/2} y={246} tex={m`\color{#176c82}{\Delta x}`}/>
    <Label x={258} y={(p.y+q.y)/2+7} tex={m`\color{#936114}{\Delta y}`}/>
    <Label x={(p.x+q.x)/2-24} y={(p.y+q.y)/2-20} tex={m`\Delta s`}/>
   </g>:<g className="length-structure-polygon">
    <path d={polygon} fill="none" stroke="#176c82" strokeWidth="3"/>
    {Array.from({length:5},(_,i)=>{const x=i/4;return <circle key={i} cx={rounded(X(x))} cy={rounded(Y(x*x))} r="2.5" fill="#176c82"/>;})}
   </g>}
  </svg>
 </div>;
}
