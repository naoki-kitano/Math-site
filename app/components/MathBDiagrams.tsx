import {MathText} from "./MathText";
const m=String.raw;
const phi=(z:number)=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
const X=(z:number)=>180+42*z,Y=(z:number)=>185-340*phi(z);
const coords=(lo:number,hi:number)=>Array.from({length:121},(_,i)=>{const z=lo+(hi-lo)*i/120;return `${X(z)},${Y(z)}`;}).join(" ");
function Label({x,y,text}:{x:number;y:number;text:string}){return <foreignObject x={x-40} y={y} width="80" height="40"><div style={{textAlign:"center",fontSize:18,lineHeight:1.5}}><MathText text={text}/></div></foreignObject>;}
function Normal({tail=false,critical=false}:{tail?:boolean;critical?:boolean}){
 const z=critical?1.96:1;
 return <figure className="math-b-figure"><svg viewBox="0 0 360 235" role="img" aria-label={critical?"標準正規分布の両側の棄却域":tail?"標準正規分布の右側の確率":"標準正規分布の中央の確率"}>
 <line x1="20" x2="340" y1="185" y2="185" stroke="var(--navy)"/>
 {(critical?[[-3.7,-z],[z,3.7]]:tail?[[z,3.7]]:[[-z,z]]).map(([a,b])=><polygon key={a} points={`${X(a)},185 ${coords(a,b)} ${X(b)},185`} fill="#80c5b5" opacity=".65"/>)}
 <polyline points={coords(-3.7,3.7)} fill="none" stroke="#328e7e" strokeWidth="2"/>
 {[-z,0,z].map(t=><g key={t}><line x1={X(t)} x2={X(t)} y1="185" y2="192" stroke="#14243f"/><Label x={X(t)} y={195} text={`$${t}$`}/></g>)}
 <Label x={333} y={166} text="$z$"/>
 </svg><figcaption><MathText text={critical?m`横軸は標準化した値 $z$。両側の色の部分を合わせて約 $5\%$ です。`:tail?m`横軸は標準化した値 $z$。色の部分は $Z\ge1$ の確率で、右半分から中央の面積を引きます。`:m`横軸は標準化した値 $z$。色の部分は $-1\le Z\le1$ の確率です。高さではなく面積を読みます。`}/></figcaption></figure>;
}
export default function MathBDiagrams({slug,index}:{slug:string;index:number}){
 if(slug==="mb-normal-distribution"&&index<2)return <Normal tail={index===1}/>;
 if(slug==="mb-two-sided-test"&&index===0)return <Normal critical/>;
 if(index!==0)return null;
 if(slug==="mb-sequence-terms")return <figure className="math-b-figure"><svg viewBox="0 0 360 245" role="img" aria-label="数列の項を点で表した図">
 <path d="M40 10 V200 H340" fill="none" stroke="#14243f"/>
 {[1,2,3,4,5].map(n=><g key={n}><circle cx={40+50*n} cy={200-18*(2*n-1)} r="4" fill="#328e7e"/><Label x={40+50*n} y={205} text={`$${n}$`}/><Label x={40+50*n} y={172-18*(2*n-1)} text={`$${2*n-1}$`}/></g>)}
 <Label x={330} y={183} text="$n$"/><Label x={35} y={0} text="$a_n$"/>
 </svg><figcaption><MathText text={m`横軸は項番号 $n$、縦軸は項の値 $a_n$。正の整数の場所に点を打ち、間を連続した線で結びません。`}/></figcaption></figure>;
 if(slug==="mb-binomial-distribution")return <figure className="math-b-figure"><svg viewBox="0 0 360 230" role="img" aria-label="五回の独立な硬貨投げにおける表の回数の確率分布">
 <path d="M25 10 V180 H335" fill="none" stroke="#14243f"/>
 {[1,5,10,10,5,1].map((p,k)=><g key={k}><rect x={37+k*49} y={180-p*10} width="26" height={p*10} fill="#70b8a7"/><Label x={50+k*49} y={187} text={`$${k}$`}/><Label x={50+k*49} y={147-p*10} text={m`$\frac{${p}}{32}$`}/></g>)}
 </svg><figcaption><MathText text={m`横軸は表の回数、棒の高さは各回数の確率です。$B(5,\frac12)$ の分布で、六つの確率を足すと $1$ になります。`}/></figcaption></figure>;
 if(slug==="mb-mean-interval")return <figure className="math-b-figure"><svg viewBox="0 0 360 150" role="img" aria-label="例題の母平均の信頼区間">
 <line x1="25" x2="335" y1="65" y2="65" stroke="#14243f"/><line x1="65" x2="295" y1="65" y2="65" stroke="#328e7e" strokeWidth="6"/>
 {[65,180,295].map(x=><line key={x} x1={x} x2={x} y1="57" y2="73" stroke="#14243f"/>)}
 <Label x={65} y={85} text="$43.04$"/><Label x={180} y={85} text="$45$"/><Label x={295} y={85} text="$46.96$"/><Label x={180} y={20} text={m`$\overline x$`}/>
 </svg><figcaption><MathText text={m`中央は今回の標本平均 $45$。左右に $1.96$ ずつ幅を取っています。未知の母平均の位置を示した図ではありません。`}/></figcaption></figure>;
 if(slug==="mb-data-function")return <figure className="math-b-figure"><svg viewBox="0 0 360 245" role="img" aria-label="架空の観測点と近似直線">
 <path d="M50 10 V205 H330" fill="none" stroke="#14243f"/><line x1="50" x2="290" y1="145" y2="49" stroke="#328e7e" strokeWidth="2"/>
 {[5,9,13].map(y=><g key={y}><line x1="45" x2="50" y1={205-12*y} y2={205-12*y} stroke="#14243f"/><Label x={24} y={191-12*y} text={`$${y}$`}/></g>)}
 {[5,8,8,12,13].map((y,x)=><g key={x}><circle cx={50+60*x} cy={205-12*y} r="4" fill="#14243f"/><Label x={50+60*x} y={210} text={`$${x}$`}/></g>)}
 <Label x={40} y={0} text="$y$"/><Label x={325} y={185} text="$x$"/>
 </svg><figcaption><MathText text={m`横軸 $x$、縦軸 $y$。点は上の表の架空データ、線は $y=2x+5$。両端以外の観測値は直線からずれています。`}/></figcaption></figure>;
 return null;
}
