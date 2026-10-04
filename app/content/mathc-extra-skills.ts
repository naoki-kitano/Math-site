import {S,m,q,nums,f} from "./mathc-authoring";
export const spaceAngle=S("angle","空間のなす角","図の見た目でなく、内積と長さで求めます。",nums.map(n=>{
 const sign=n%2?1:-1;
 return q(m`$\vec a=(${n},${n},0),\vec b=(${sign*n},0,${n})$ のなす角を求めなさい。`,m`$${sign>0?60:120}^\circ$。`,"両方の長さと内積を計算し、余弦を求めます。",m`$|\vec a|=|\vec b|=${n}\sqrt2$、内積は $${sign*n*n}$。$\cos\theta=\frac{${sign*n*n}}{${2*n*n}}=${f(sign,2)}$。$0\leqq\theta\leqq180^\circ$ より角度が決まります。`);
}));
export const planeMembership=S("membership","同じ平面上にあるか","一つの成分の不一致でも、平面上とはいえません。",nums.map(n=>{
 const yes=n%2===0,z=yes?2:3;
 return q(m`平面 $(x,y,z)=(0,0,2)+s(1,0,0)+t(0,1,0)$ に点 $P(${n},1,${z})$ はありますか。理由も答えなさい。`,yes?m`あります。$s=${n},t=1$ とすれば三成分がすべて一致します。`:m`ありません。この平面では常に $z=2$ ですが、点 $P$ は $z=3$ です。`,"動かせる座標と、固定されている座標を読みます。",m`$x=s,y=t,z=2$。初めの二成分から $s=${n},t=1$ を選んだ後、第三成分が $${z}$ に一致するか確かめます。`);
}));
export const polarProduct=S("polar-product","極形式同士を掛ける","絶対値の積と偏角の和を別々に計算します。",nums.map(n=>
 q(m`$z=${n}\left(\cos\frac\pi6+i\sin\frac\pi6\right),w=2\left(\cos\frac\pi3+i\sin\frac\pi3\right)$ の積を $a+bi$ の形で求めなさい。`,m`$${2*n}i$。`,"極形式で与えられているので、絶対値の積と偏角の和を先に求めます。",m`絶対値は $${n}\cdot2=${2*n}$、偏角は $\frac\pi6+\frac\pi3=\frac\pi2$。よって $zw=${2*n}(\cos\frac\pi2+i\sin\frac\pi2)=${2*n}i$。`)
));
export const polarQuotient=S("polar-quotient","極形式同士を割る","分母が非零であることを確かめ、角度を引きます。",nums.map(n=>
 q(m`$z=${2*n}\left(\cos\frac{2\pi}3+i\sin\frac{2\pi}3\right),w=2\left(\cos\frac\pi6+i\sin\frac\pi6\right)$ の商 $\frac zw$ を求めなさい。`,m`$${n===1?"":n}i$。`,"極形式で与えられているので、分母が零でないことを確かめ、絶対値の商と偏角の差を求めます。",m`$|w|=2\ne0$。絶対値は $\frac{${2*n}}2=${n}$、偏角は $\frac{2\pi}3-\frac\pi6=\frac\pi2$。したがって商は $${n===1?"":n}i$。`)
));
export const ellipseTangent=S("ellipse","楕円上の点での接線","接点を確かめてから、単位円へ縮めて考えます。",nums.map(n=>
 q(m`楕円 $\frac{x^2}{${25*n*n}}+\frac{y^2}{25}=1$ 上の点 $(${3*n},4)$ における接線を求めなさい。`,m`$${n===1?"3x":m`\frac{3x}{${n}}`}+4y=25$。`,"接点の座標を接線の式に代入します。",m`接点で $\frac{${9*n*n}}{${25*n*n}}+\frac{16}{25}=1$。接線は $\frac{${3*n}x}{${25*n*n}}+\frac{4y}{25}=1$。両辺を $25$ 倍して整理します。`)
));
export const hyperbolaTangent=S("hyperbola","双曲線上の点での接線","負の項の符号を保ち、代入後の重解を確かめます。",nums.map(n=>
 q(m`双曲線 $\frac{x^2}{${n*n}}-\frac{y^2}3=1$ 上の点 $(${2*n},3)$ における接線を求めなさい。`,m`$${n===1?"2x":m`\frac{2x}{${n}}`}-y=1$。`,"接点が曲線上にあることを確認し、接線を代入して確かめます。",m`接点で $4-3=1$。接線の式は $\frac{(${2*n})x}{${n*n}}-\frac{3y}3=1$ から得られます。$u=\frac x{${n}}$ と置くと接線は $y=2u-1$。曲線へ代入すると $3u^2-(2u-1)^2=3$、すなわち $(u-2)^2=0$ で接点が重解です。`)
));
