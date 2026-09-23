import {C,S,m,q,nums,complex,f,pi,root,finish} from "./mathc-authoring";
import {complexAngleBanks} from "./mathc-complex-angles";
import {polarCondition} from "./mathc-conditions";
import {zeroArgument} from "./content-audit-additions";
import {polarProduct,polarQuotient} from "./mathc-extra-skills";
const chapter="複素数平面",sec=["複素数と点","極形式と演算","回転と図形"];
function point(n:number,conjugate=false){
 const a=n%2?-n:n,b=2;
 return conjugate?q(m`$z=${complex(a,b)}$ の共役複素数を求め、点の位置がどう変わるか答えなさい。`,m`$\overline z=${complex(a,-b)}$。実軸に関して対称です。`,"実部はそのまま、虚部の符号だけを変えます。",m`点 $(${a},${b})$ が $(${a},${-b})$ へ移ります。`):
 q(m`複素数 $z=${complex(a,b)}$ を表す点の座標と、$|z|$ を求めなさい。`,m`$(${a},${b})$、$|z|=${root(a*a+b*b)}$。`,"実部を横、虚部を縦に置きます。絶対値は原点からの距離です。",m`$|z|=\sqrt{(${a})^2+${b}^2}=${root(a*a+b*b)}$。`);
}
function difference(n:number,distance=false){
 const a=n,b=2,c=1,d=-1;
 return distance?q(m`複素数 $\alpha=${complex(a,b)},\beta=${complex(c,d)}$ を表す二点の距離を求めなさい。`,m`$|\beta-\alpha|=${root((c-a)**2+9)}$。`,"差を移動とみなし、その絶対値を取ります。",m`$\beta-\alpha=${complex(c-a,d-b)}$ なので、距離は $\sqrt{(${c-a})^2+(-3)^2}=${root((c-a)**2+9)}$。`):
 q(m`点 $z=${complex(a,b)}$ を、横に $-1$、縦に $3$ 移動した点を表す複素数を求めなさい。`,m`$${complex(a-1,5)}$。`,"移動量を複素数にして足します。",m`$(${complex(a,b)})+(-1+3i)=${complex(a-1,5)}$。`);
}
function polar(n:number,axis=false){
 const a=axis?0:(n%2?-n:n),b=axis?(n%2?n:-n):n;
 const theta=axis?(b>0?m`\frac\pi2`:m`\frac{3\pi}2`):(a>0?m`\frac\pi4`:m`\frac{3\pi}4`);
 const r=axis?String(n):`${n===1?"":n}\\sqrt2`;
 return q(m`$z=${complex(a,b)}$ を $0\leqq\theta<2\pi$ の偏角で極形式にしなさい。`,m`$${r}\left(\cos${theta}+i\sin${theta}\right)$。`,"まず絶対値を求め、実部と虚部の符号から角度を選びます。",m`$r=\sqrt{(${a})^2+(${b})^2}=${r}$。$\cos\theta=\frac{${a}}{${r}},\sin\theta=\frac{${b}}{${r}}$ の両方に合う $\theta=${theta}$ を使います。`);
}
function multiply(n:number,divide=false){
 const a=n,b=n%2?-1:1,ans=divide?complex(b,-a):complex(-b,a);
 return q(m`$z=${complex(a,b)}$ ${divide?m`を $i$ で割った`:m`に $i$ を掛けた`}値を求め、回転の向きも答えなさい。`,m`$${ans}$。原点を中心に${divide?"時計回り":"反時計回り"}に $90^\circ$ 回転します。`,divide?m`$\frac1i=-i$ を使います。`:m`$i^2=-1$ を使います。`,divide?m`$\frac z i=-iz=-i(${complex(a,b)})=${ans}$。偏角から $\frac\pi2$ を引きます。`:m`$iz=i(${complex(a,b)})=${ans}$。偏角に $\frac\pi2$ を足します。`);
}
function power(n:number,inverse=false){
 const k=n+1,r=inverse?f(1,2**k):String(2**k),t=inverse?-k:k;
 return q(m`$z=2\left(\cos\frac\pi3+i\sin\frac\pi3\right)$ とします。$z^{${inverse?-k:k}}$ を極形式で表しなさい。`,m`$${r}\left(\cos\left(${pi(t,3)}\right)+i\sin\left(${pi(t,3)}\right)\right)$。`,inverse?"非零を確かめ、絶対値は負の整数乗、偏角は負の整数倍にします。":"絶対値は累乗し、偏角は指数倍します。",m`$|z|=2\ne0$。絶対値は $2^{${inverse?-k:k}}=${r}$、偏角は $(${inverse?-k:k})\cdot\frac\pi3=${pi(t,3)}$。偏角が一周を越えても極形式として使えます。`);
}
function roots(n:number,negative=false){
 const k=n%2?3:4,r=n,theta=negative?m`\pi`:"0",forms=Array.from({length:k},(_,j)=>pi((negative?1:0)+2*j,k));
 return q(m`$z^{${k}}=${negative?"-":""}${r**k}$ の複素数解をすべて極形式で表しなさい。`,m`$z=${r}(\cos\theta+i\sin\theta)$、$\theta=${forms.join(",")}$。`,"絶対値の根だけでなく、一周分の異なる偏角をすべて数えます。",m`$|z|^{${k}}=${r**k}$ より $|z|=${r}$。偏角は $\frac{${theta}+2j\pi}{${k}}$、$j=${Array.from({length:k},(_,j)=>j).join(",")}$。これらは異なる $${k}$ 個で、指数倍するとすべて元の偏角に戻ります。`);
}
function rotate(n:number,clockwise=false){
 const center=complex(1,2),z=complex(n+1,3),ans=clockwise?complex(2,2-n):complex(0,n+2);
 return q(m`点 $z=${z}$ を、点 $\alpha=${center}$ を中心に${clockwise?"時計回り":"反時計回り"}に $90^\circ$ 回転した点 $w$ を求めなさい。`,m`$w=${ans}$。`,"中心を引いて原点に移し、回してから中心を足し戻します。",m`$z-\alpha=${complex(n,1)}$。$w=\alpha+(${clockwise?"-i":"i"})(z-\alpha)=(${center})+(${clockwise?complex(1,-n):complex(-1,n)})=${ans}$。`);
}
function locus(n:number,bisector=false){
 return bisector?q(m`複素数 $z$ が $|z-1|=|z-${2*n+1}|$ を満たすとき、点 $z$ の軌跡を求めなさい。`,m`直線 $x=${n+1}$。`,"二点からの距離が等しい条件を、実部と虚部で表します。",m`$z=x+iy$ と置くと $(x-1)^2+y^2=(x-${2*n+1})^2+y^2$。整理すると $x=${n+1}$。逆にこの直線上では両距離の二乗が等しく、距離は非負なので元の条件も成り立ちます。`):
 q(m`$|z-(1+2i)|=${n}$ を満たす点 $z$ の軌跡を求めなさい。`,m`中心 $(1,2)$、半径 $${n}$ の円。`,"差の絶対値を二点間の距離として読みます。",m`$z=x+iy$ とすると $(x-1)^2+(y-2)^2=${n*n}$。円上の点では距離が $${n}$ であり、逆も成り立ちます。`);
}
export const complexBanks=[
 C(chapter,"complex-point","複素数を点で表す","実部を横軸、虚部を縦軸に対応させます。",[m`複素数 $a+bi$ を点 $(a,b)$ で表した平面を複素数平面といいます。横が実軸、縦が虚軸です。`,m`$|a+bi|=\sqrt{a^2+b^2}$ は原点からの距離。共役複素数 $\overline z=a-bi$ は実軸について対称な点です。`],"複素数の絶対値は実部だけの絶対値ではありません。",[S("point","座標と絶対値","二成分から距離を求めます。",nums.map(n=>point(n))),S("conjugate","共役と対称移動","虚部の符号を変えます。",nums.map(n=>point(n,true)))],sec[0]),
 C(chapter,"complex-distance","複素数の和・差と距離","足し算を移動、差の絶対値を距離として読みます。",[m`$z+w$ は点 $z$ を、$w$ が表す移動量だけ動かした点です。`,m`$\beta-\alpha$ は点 $\alpha$ から点 $\beta$ への移動。$|\beta-\alpha|$ はその長さで、順序を逆にしても距離は同じです。`],"移動を表す複素数と、距離を表す非負の数を区別します。",[S("translate","平行移動","横と縦の移動を足します。",nums.map(n=>difference(n))),S("distance","二点間の距離","差を取ってから絶対値を求めます。",nums.map(n=>difference(n,true)))],sec[0]),
 C(chapter,"complex-polar","複素数の極形式","原点からの距離と角度で、同じ点を表し直します。",[m`$z\ne0$ のとき $z=r(\cos\theta+i\sin\theta)$、$r=|z|>0$ と表せます。$\theta$ を偏角といい、$2\pi$ の整数倍を加えても同じ点です。`,m`角度は余弦だけでなく正弦も合わせて選びます。$z=0$ には向きがないため、偏角を定めません。`],"実部と虚部の符号から、象限や軸上の位置を先に確かめます。",[S("quadrant","象限から偏角を選ぶ","余弦と正弦の両方に合わせます。",nums.map(n=>polar(n))),S("axis","軸上の偏角","実部が零なら虚軸上です。",nums.map(n=>polar(n,true))),polarCondition,zeroArgument],sec[1]),
 C(chapter,"complex-product","積・商と回転","掛け算は角度を足し、割り算は角度を引きます。",[m`$z=r(\cos\alpha+i\sin\alpha),w=s(\cos\beta+i\sin\beta)$ の積は、加法定理により $zw=rs\{\cos(\alpha+\beta)+i\sin(\alpha+\beta)\}$。`,m`$w\ne0$ なら $\frac zw=\frac rs\{\cos(\alpha-\beta)+i\sin(\alpha-\beta)\}$。絶対値は掛け算・割り算、偏角は足し算・引き算です。`],m`$i$ を掛けると反時計回りに直角だけ回ります。`,[S("multiply","虚数単位を掛ける","実部と虚部の入れ替わりを確かめます。",nums.map(n=>multiply(n))),S("divide","虚数単位で割る","逆向きの回転です。",nums.map(n=>multiply(n,true))),polarProduct,polarQuotient],sec[1]),
 C(chapter,"complex-powers","ド・モアブルの定理","同じ回転を繰り返すことを、累乗で表します。",[m`積の偏角を足す規則を繰り返すと $(\cos\theta+i\sin\theta)^n=\cos n\theta+i\sin n\theta$。これがド・モアブルの定理です。`,m`正の整数では繰返しの積、負の整数では逆数を用います。$r(\cos\theta+i\sin\theta)$ 全体の累乗では、前の $r$ も累乗します。`],"絶対値の累乗と角度の整数倍を別々に求めます。",[S("positive","正の整数乗","距離は累乗、角度は指数倍です。",nums.map(n=>power(n))),S("negative","負の整数乗","非零を確認し逆数を使います。",nums.map(n=>power(n,true)))],sec[1]),
 C(chapter,"complex-roots","複素数の累乗根","一周を等しく分け、解を落とさずに数えます。",[m`$w=R(\cos\phi+i\sin\phi)\ne0$ の $n$ 乗根は、絶対値 $\sqrt[n]{R}$、偏角 $\frac{\phi+2k\pi}{n}$、$k=0,\ldots,n-1$ の $n$ 個です。`,m`異なる偏角は一周を等分します。実数の正の根だけを答えると複素数解を落としてしまいます。$w=0$ なら解は $z=0$ だけです。`],"根を元の指数で累乗し、数と条件を確かめます。",[S("positive","正の実数の累乗根","偏角零に一周の整数倍を足してから割ります。",nums.map(n=>roots(n))),S("negative","負の実数の累乗根","偏角を半周から始めます。",nums.map(n=>roots(n,true)))],sec[1]),
 C(chapter,"complex-rotation","原点以外を中心とする回転","中心を引き、回してから、元の位置へ戻します。",[m`点 $\alpha$ を中心に角 $\theta$ だけ回すと $w-\alpha=(z-\alpha)(\cos\theta+i\sin\theta)$。`,m`したがって $w=\alpha+(z-\alpha)(\cos\theta+i\sin\theta)$。$z$ にそのまま回転の数を掛けると、原点を中心とする別の回転になります。`],"三段階を省略せず、中心が動かないことも確かめます。",[S("left","反時計回りに回す","中心から測った移動を回します。",nums.map(n=>rotate(n))),S("right","時計回りに回す","角度の符号を反対にします。",nums.map(n=>rotate(n,true)))],sec[2]),
 C(chapter,"complex-locus","複素数で表す円と直線","絶対値の式を、距離の条件へ読み替えます。",[m`$|z-\alpha|=r$、$r>0$ は中心 $\alpha$、半径 $r$ の円です。`,m`異なる二点 $\alpha,\beta$ に対して $|z-\alpha|=|z-\beta|$ は垂直二等分線です。二乗して整理した後、元の距離の条件と同値かも確かめます。`],"軌跡では、条件を満たす点が漏れず、余計な点も入らないことを確認します。",[S("circle","一定の距離","中心と半径を読み取ります。",nums.map(n=>locus(n))),S("bisector","等しい二つの距離","実部と虚部に分け、二乗差を整理します。",nums.map(n=>locus(n,true)))],sec[2])
];
complexBanks.push(...complexAngleBanks);
export const complexChapter=finish(chapter,"complex",complexBanks,sec);
