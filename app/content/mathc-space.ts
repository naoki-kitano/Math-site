import {C,S,m,q,nums,root,finish} from "./mathc-authoring";
import {spaceAngle,planeMembership} from "./mathc-extra-skills";
const chapter="空間ベクトル",sec=["座標と演算","点・直線・平面"];
function coordinate(n:number,dist=false){
 return dist?q(m`$A(1,2,3),B(${n+1},4,5)$ の距離を求めなさい。`,m`$AB=${root(n*n+8)}$。`,"三方向それぞれの差を二乗して足します。",m`$\overrightarrow{AB}=(${n},2,2)$ より $AB=\sqrt{${n}^2+2^2+2^2}=${root(n*n+8)}$。`):
 q(m`点 $P(${n},-2,3)$ から $xy$ 平面へ垂線を下ろした足 $H$ と、距離 $PH$ を求めなさい。`,m`$H(${n},-2,0)$、$PH=3$。`,"平面に垂直な方向の成分だけを零にします。",m`$xy$ 平面は $z=0$。横の位置 $x,y$ を保ち、高さ $z$ だけを零にするので $H(${n},-2,0)$、距離は $|3|=3$。`);
}
function operation(n:number,dot=false){
 return dot?q(m`$\vec a=(${n},1,-2),\vec b=(2,-${n},3)$ の内積を求めなさい。`,m`$${n-6}$。`,"三組の成分の積を足します。",m`$\vec a\cdot\vec b=${n}\cdot2+1\cdot(-${n})+(-2)\cdot3=${n-6}$。`):
 q(m`$\vec a=(${n},1,-2),\vec b=(1,-1,3)$ のとき、$2\vec a-\vec b$ を求めなさい。`,m`$(${2*n-1},3,-7)$。`,"三成分とも、二倍してから対応する成分を引きます。",m`$(2\cdot${n}-1,2\cdot1-(-1),2\cdot(-2)-3)=(${2*n-1},3,-7)$。`);
}
function point(n:number,centroid=false){
 return centroid?q(m`三角形の頂点が $A(0,0,3),B(${3*n},0,0),C(0,6,0)$ のとき、重心を求めなさい。`,m`$G(${n},2,1)$。`,"平面の場合と同じく、三頂点の各座標を平均します。",m`$G\left(\frac{0+${3*n}+0}3,\frac{0+0+6}3,\frac{3+0+0}3\right)=G(${n},2,1)$。`):
 q(m`$A(0,1,2),B(${3*n},4,5)$ を $1:2$ に内分する点を求めなさい。`,m`$P(${n},2,3)$。`,"点 $A$から全体の三分の一だけ進みます。",m`$\overrightarrow{OP}=\frac{2(0,1,2)+(${3*n},4,5)}3=(${n},2,3)$。`);
}
function represent(n:number,plane=false){
 return plane?q(m`$A(0,0,${n}),B(1,0,${n}),C(0,1,${n})$ を通る平面上の点を、二つの実数で表しなさい。`,m`$(x,y,z)=(0,0,${n})+s(1,0,0)+t(0,1,0)$、$s,t\in\mathbb R$。すなわち $z=${n}$。`,"一つの出発点から、平行でない二方向へ動きます。",m`$\overrightarrow{AB}=(1,0,0),\overrightarrow{AC}=(0,1,0)$ は平行でありません。任意の $(x,y,${n})$ は $s=x,t=y$ として表せます。`):
 q(m`$A(1,0,${n}),B(2,1,${n+2})$ を通る直線を、実数 $t$ で表しなさい。`,m`$(x,y,z)=(1,0,${n})+t(1,1,2)$、$t\in\mathbb R$。`,"まず二点の差から進む方向を求めます。",m`$\overrightarrow{AB}=(1,1,2)$。各座標では $x=1+t,y=t,z=${n}+2t$ です。`);
}
function normal(n:number,sphere=false){
 return sphere?q(m`中心 $C(1,-2,${n})$、半径 $${n}$ の球面の方程式を求めなさい。`,m`$(x-1)^2+(y+2)^2+(z-${n})^2=${n*n}$。`,"中心からの距離が半径に等しい点の集まりです。",m`$CP=\sqrt{(x-1)^2+(y+2)^2+(z-${n})^2}=${n}$。両辺非負なので二乗は同値です。球の内部は不等号 $<$ で表す別の集合です。`):
 q(m`点 $A(1,0,${n})$ を通り、$\vec n=(1,2,1)$ に垂直な平面の方程式を求めなさい。`,m`$x+2y+z=${n+1}$。`,"平面上の点への移動と、法線の内積を零にします。",m`$P(x,y,z)$ とすると $(1,2,1)\cdot(x-1,y,z-${n})=0$。したがって $x-1+2y+z-${n}=0$。逆にこの式を満たす移動は法線と垂直です。`);
}
export const spaceBanks=[
 C(chapter,"space-coordinates","空間座標と距離","横・奥行き・高さの三つの数で位置を表します。",[m`互いに垂直な三本の軸を $x,y,z$ 軸とし、点の位置を $(x,y,z)$ と表します。$xy$ 平面では $z=0$ です。`,m`二点間の距離は $\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}$。平面内の距離に高さの差を合わせて、三平方の定理をもう一度使います。`],"見取り図の見た目の長さではなく、座標の差を使います。",[S("projection","平面への垂線","残す二成分と零にする成分を分けます。",nums.map(n=>coordinate(n))),S("distance","二点の距離","三方向の差を二乗します。",nums.map(n=>coordinate(n,true)))],sec[0]),
 C(chapter,"space-dot","空間ベクトルの演算と内積","平面の計算を、三つ目の成分まで広げます。",[m`空間でも成分ごとに加減・実数倍を行います。$(a_1,a_2,a_3)\cdot(b_1,b_2,b_3)=a_1b_1+a_2b_2+a_3b_3$。`,m`なす角も、非零ベクトルについて $\cos\theta=\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}$。見取り図で直角に見えても、内積で確かめます。`],"計算の規則は平面と同じです。成分を一つ落とさないようにします。",[S("operation","三成分の加減","同じ位置の成分を対応させます。",nums.map(n=>operation(n))),S("dot","三成分の内積","三つの積の和を計算します。",nums.map(n=>operation(n,true))),spaceAngle],sec[0]),
 C(chapter,"space-division","空間の分点と重心","位置ベクトルの式を、三つの座標に適用します。",[m`内分点 $\vec p=\frac{n\vec a+m\vec b}{m+n}$、三角形の重心 $\vec g=\frac{\vec a+\vec b+\vec c}3$ は空間でも成り立ちます。`,m`三次元でも三角形の頂点は三つです。座標の個数と、平均する点の個数を混同しません。`],"各座標で同じ重みを用います。",[S("division","内分点を求める","比と係数の対応を確かめます。",nums.map(n=>point(n))),S("centroid","三角形の重心","三つの頂点の平均です。",nums.map(n=>point(n,true)))],sec[1]),
 C(chapter,"space-line-plane","空間の直線と平面","直線は一方向、平面は平行でない二方向で表します。",[m`直線は $\vec p=\vec a+t\vec u$、$\vec u\ne\vec0$。平面は $\vec p=\vec a+s\vec u+t\vec v$ で、$\vec u,\vec v$ が平行でないことが必要です。`,m`平行な二方向では、動ける場所が一本の直線にとどまります。点が図形上にあるかは、同じ実数の値で全成分の式が成り立つか調べます。`],"出発点と方向を分けて書きます。",[S("line","直線を表す","二点の差を方向に使います。",nums.map(n=>represent(n))),S("plane","平面を表す","平行でない二つの移動を使います。",nums.map(n=>represent(n,true))),planeMembership],sec[1]),
 C(chapter,"space-normal-sphere","平面の法線と球面","垂直という条件と、距離が一定という条件を式にします。",[m`平面に垂直な非零ベクトルを法線ベクトルといいます。$\vec n\cdot(\vec p-\vec a)=0$ は、点 $A$ を通り $\vec n$ に垂直な平面です。`,m`球面は中心から一定の距離にある点の集まりです。距離を二乗した式は、平面の一次式とは異なる形になります。`],"垂直なら内積、距離なら二乗の和を選びます。",[S("normal","法線から平面へ","法線と移動の内積を零にします。",nums.map(n=>normal(n))),S("sphere","中心と半径から球面へ","距離を式にして二乗します。",nums.map(n=>normal(n,true)))],sec[1])
];
export const spaceChapter=finish(chapter,"space",spaceBanks,sec);
