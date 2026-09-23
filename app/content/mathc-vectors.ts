import {C,S,m,q,nums,pair,f,finish} from "./mathc-authoring";
import {vectorApplicationBanks} from "./mathc-vector-applications";
import {unitCondition,angleCondition} from "./mathc-conditions";
import {endpointAngle,variedUnits} from "./content-audit-additions";
import {varyPractice} from "./review-family-refinement";
const chapter="平面ベクトル",sec=["向き・成分・長さ","内積と角度","点と図形"];
function displacement(n:number,reverse=false){
 const a=[n,-1],b=[2,n],v=reverse?[n-2,-1-n]:[2-n,n+1];
 return q(m`$A${pair(...a as [number,number])},B${pair(...b as [number,number])}$ のとき、$${reverse?m`\overrightarrow{BA}`:m`\overrightarrow{AB}`}$ を成分で表しなさい。`,m`$${pair(v[0],v[1])}$。`,"矢印の終点の座標から始点の座標を引きます。",reverse?m`始点は $B$、終点は $A$ なので $( ${n}-2,-1-${n})=${pair(v[0],v[1])}$。`:m`始点は $A$、終点は $B$ なので $(2-${n},${n}-(-1))=${pair(v[0],v[1])}$。`);
}
function operations(n:number,subtract=false){
 const a=[n,-2],b=[-1,n%2?3:-3],v=[a[0]+(subtract?-b[0]:b[0]),a[1]+(subtract?-b[1]:b[1])];
 return q(m`$\vec a=${pair(a[0],a[1])},\vec b=${pair(b[0],b[1])}$ のとき、$\vec a${subtract?"-":"+"}\vec b$ を求めなさい。`,m`$${pair(v[0],v[1])}$。`,subtract?"後ろのベクトルの両成分の符号を変えます。":"横同士、縦同士を足します。",m`$(${a[0]}${subtract?"-":"+"}(${b[0]}),${a[1]}${subtract?"-":"+"}(${b[1]}))=${pair(v[0],v[1])}$。`);
}
function scale(n:number){
 const k=n%2?-2:3;
 return q(m`$\vec a=(${n},-1)$ のとき、$(${k})\vec a$ を求め、向きと長さがどう変わるか答えなさい。`,m`$(${k*n},${-k})$。向きは${k<0?"反対":"同じ"}、長さは $${Math.abs(k)}$ 倍。`,"実数を両成分に掛け、向きは符号、長さは絶対値で考えます。",m`$(${k})(${n},-1)=(${k*n},${-k})$。実数倍が負なら向きが反転します。`);
}
function parallel(n:number){
 const yes=n%2===0,b=yes?[2*n,2]:[2*n,3];
 return q(m`非零ベクトル $\vec a=(${n},1),\vec b=${pair(b[0],b[1])}$ は平行ですか。理由も答えなさい。`,yes?m`平行。$\vec b=2\vec a$ だからです。`:"平行ではありません。両成分を同じ倍率で表せません。","横成分で決まる倍率が縦成分にも合うか確かめます。",m`横成分から倍率は $2$。縦成分は $2\cdot1=2$ ${yes?"となり一致します。":m`ですが、$\vec b$ の縦成分は $3$ なので一致しません。`}`);
}
function magnitude(n:number,unit=false){
 return q(m`$\vec a=(${3*n},${-4*n})$ ${unit?"と同じ向きの単位ベクトル":"の大きさ"}を求めなさい。`,unit?m`$\left(\frac35,-\frac45\right)$。`:m`$${5*n}$。`,unit?"まず大きさを求め、その値で両成分を割ります。":"直角三角形の斜辺として考えます。",m`$|\vec a|=\sqrt{(${3*n})^2+(-${4*n})^2}=${5*n}$。`+(unit?m`非零なので $\frac{\vec a}{|\vec a|}=\left(\frac{${3*n}}{${5*n}},\frac{-${4*n}}{${5*n}}\right)=\left(\frac35,-\frac45\right)$。`:"大きさは非負です。"));
}
function dot(n:number,geometry=false){
 return geometry?q(m`$|\vec a|=${n},|\vec b|=4$、なす角 $120^\circ$ のとき、$\vec a\cdot\vec b$ を求めなさい。`,m`$${-2*n}$。`,"長さ同士の積に、なす角の余弦を掛けます。",m`$\vec a\cdot\vec b=${n}\cdot4\cos120^\circ=${n}\cdot4\cdot\left(-\frac12\right)=${-2*n}$。内積は負にもなります。`):
 q(m`$\vec a=(${n},-2),\vec b=(3,${n})$ の内積を求めなさい。`,m`$${n}$。`,"同じ位置の成分を掛け、その二つを足します。",m`$\vec a\cdot\vec b=${n}\cdot3+(-2)\cdot${n}=${n}$。答えはベクトルではなく数です。`);
}
function angle(n:number){
 const sign=n%2?1:-1;
 return q(m`$\vec a=(${n},0),\vec b=(${sign*n},${n})$ のなす角を求めなさい。`,m`$${sign>0?45:135}^\circ$。`,"両方が非零か確認し、内積を二つの長さで割ります。",m`$|\vec a|=${n},|\vec b|=${n}\sqrt2,\vec a\cdot\vec b=${sign*n*n}$。$\cos\theta=${sign>0?"": "-"}\frac1{\sqrt2}$、$0\leqq\theta\leqq180^\circ$ より答えを選びます。`);
}
function perpendicular(n:number){
 const yes=n%2===0,b=yes?[-1,n]:[1,n];
 return q(m`$\vec a=(${n},1),\vec b=${pair(b[0],b[1])}$ は垂直ですか。理由も答えなさい。`,yes?"垂直。両方非零で内積が零だからです。":"垂直ではありません。内積が零ではないからです。","垂直かどうかは内積で確かめます。",m`$\vec a\cdot\vec b=${n}\cdot(${b[0]})+1\cdot${n}=${yes?0:2*n}$。`);
}
function section(n:number,external=false){
 const a=1,b=1+3*n,value=external?1+6*n:1+2*n;
 return q(m`数直線上の $A(${a}),B(${b})$ を $2:1$ に${external?"外分":"内分"}する点 $P$ の座標を求めなさい。`,m`$${value}$。`,external?"外分点は線分の外側です。ここでは点 $B$を越えた側にあります。":"全体を三等分し、点 $A$から二つ分進みます。",external?m`$P=\frac{2\cdot${b}-1\cdot${a}}{2-1}=${value}$。$PA=${6*n},PB=${3*n}$ で比は $2:1$。`:m`$P=\frac{1\cdot${a}+2\cdot${b}}{2+1}=${value}$。$AP=${2*n},PB=${n}$ で比は $2:1$。`);
}
function centroid(n:number,mid=false){
 return q(m`$A(0,0),B(${3*n},0),C(0,6)$ について、${mid?m`辺 $BC$ の中点 $M$`:m`三角形 $ABC$ の重心 $G$`}の位置ベクトルを求めなさい。`,mid?m`$\overrightarrow{OM}=\left(${f(3*n,2)},3\right)$。`:m`$\overrightarrow{OG}=(${n},2)$。`,"各頂点の位置ベクトルを足し、点の個数で割ります。",mid?m`$\overrightarrow{OM}=\frac{(3${m`\cdot`}${n},0)+(0,6)}2=\left(${f(3*n,2)},3\right)$。`:m`$\overrightarrow{OG}=\frac{(0,0)+(${3*n},0)+(0,6)}3=(${n},2)$。`);
}
function line(n:number,segment=false){
 return q(m`$A(1,2),B(${n+1},3)$ ${segment?"を結ぶ線分":"を通る直線"}上の点 $P$ を実数 $t$ で表し、$t$ の範囲も答えなさい。`,m`$\overrightarrow{OP}=(1,2)+t(${n},1)$、$${segment?m`0\leqq t\leqq1`:m`t\in\mathbb R`}$。`,"点 $A$を出発点、ベクトルABを移動方向にします。",m`$\overrightarrow{AB}=(${n},1)$。$t=0$ で $A$、$t=1$ で $B$。`+(segment?"その間だけを動くので、範囲は零から一です。":"前後どこまでも動けるので、すべての実数を使います。"));
}
function proof(n:number,diagonal=false){
 return diagonal?q(m`ひし形 $OABC$ で $\overrightarrow{OA}=\vec a,\overrightarrow{OC}=\vec b$、一辺の長さは $${n}$ です。対角線が垂直な理由をベクトルで示しなさい。`,"二つの非零の対角線の内積が零なので、垂直です。","対角線を和と差で表し、内積を展開します。",m`$\overrightarrow{OB}=\vec a+\vec b,\overrightarrow{AC}=\vec b-\vec a$。$(\vec a+\vec b)\cdot(\vec b-\vec a)=|\vec b|^2-|\vec a|^2=${n}^2-${n}^2=0$。ひし形はつぶれていないので対角線は非零です。`):
 q(m`三角形 $ABC$ で $M,N$ はそれぞれ $AB,AC$ の中点です。$BC=${2*n}$ のとき、$MN$ の長さと $BC$ との位置関係をベクトルで示しなさい。`,m`$MN=${n}$、$MN\parallel BC$。`,"点 $A$を基準にし、二つの中点への移動の差を取ります。",m`$\overrightarrow{MN}=\overrightarrow{AN}-\overrightarrow{AM}=\frac12(\overrightarrow{AC}-\overrightarrow{AB})=\frac12\overrightarrow{BC}$。正の実数倍なので平行で、長さは半分です。`);
}
export const vectorBanks=[
 C(chapter,"vector-components","ベクトルの向きと成分","出発点から、横と縦にどれだけ動くかを表します。",[m`ベクトルは向きと大きさをもつ量です。$\overrightarrow{AB}$ は点 $A$ から点 $B$ への移動を表します。同じ向き・同じ大きさなら、置く場所が違っても同じベクトルです。`,m`成分 $(u,v)$ は横に $u$、縦に $v$ 動くという意味です。点の座標と、点から点への移動は区別します。`],m`$\overrightarrow{AB}=(x_B-x_A,y_B-y_A)$。逆向きでは両成分の符号が反対です。`,[S("forward","始点から終点へ","終点から始点を引きます。",nums.map(n=>displacement(n))),S("reverse","矢印を逆にする","矢印の先を確かめます。",nums.map(n=>displacement(n,true)))],sec[0]),
 C(chapter,"vector-sum","ベクトルの和と差","二つの移動をつなぐことと、逆向きに進むことを考えます。",[m`$\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}$。一つ目の終点から二つ目を始めると、全体の移動になります。`,m`$\vec a-\vec b=\vec a+(-\vec b)$。同じ始点で描いた二本なら、差は $\vec b$ の終点から $\vec a$ の終点へ向かいます。`],"成分ごとに足し引きします。",[S("add","移動を足す","横と縦を分けます。",nums.map(n=>operations(n))),S("subtract","逆向きの移動を足す","後ろの成分を両方引きます。",nums.map(n=>operations(n,true)))],sec[0]),
 C(chapter,"vector-scalar","実数倍と平行","同じ倍率で伸ばしたベクトルかどうかを調べます。",[m`$k\vec a$ の大きさは $|k||\vec a|$。$k>0$ なら同じ向き、$k<0$ なら反対向きです。$k=0$ では零ベクトルになります。`,m`非零ベクトル $\vec a,\vec b$ が平行であることは、ある実数 $k$ で $\vec b=k\vec a$ と表せることと同じです。`],"片方の成分だけで倍率を決めて終わらず、もう片方も確かめます。",[S("scale","大きさと向き","符号と絶対値を分けます。",nums.map(scale)),S("parallel","平行かを判定する","同じ倍率が両成分に使えるか調べます。",nums.map(parallel))],sec[0]),
 C(chapter,"vector-length","大きさと単位ベクトル","方向を保ったまま、長さを一にそろえます。",[m`$\vec a=(x,y)$ の大きさは $|\vec a|=\sqrt{x^2+y^2}$。三平方の定理から求まります。`,m`$\vec a\ne\vec0$ のとき、同じ向きの単位ベクトルは $\frac{\vec a}{|\vec a|}$。零ベクトルには向きがなく、この割り算もできません。`],"ベクトルと、その大きさという数を区別します。",[S("length","長さを求める","二乗の和の非負の平方根です。",nums.map(n=>magnitude(n))),S("unit","長さを一にする","非零の長さで割ります。",nums.map(n=>magnitude(n,true))),unitCondition],sec[0]),
 C(chapter,"vector-dot","内積の意味と計算","二つの向きの関係を、一つの数で表します。",[m`非零の二つのベクトルを同じ始点で描き、そのなす角を $\theta$ とすると $\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta$。一方が零ベクトルなら内積は零と定めます。`,m`余弦定理の $|\vec a-\vec b|^2=|\vec a|^2+|\vec b|^2-2|\vec a||\vec b|\cos\theta$ と成分での展開を比べると、$(a_1,a_2)\cdot(b_1,b_2)=a_1b_1+a_2b_2$ が得られます。`],"内積の答えは数です。長さ・角度が分かる場合と成分が分かる場合で式を選びます。",[S("components","成分から内積へ","同じ位置同士を掛けて足します。",nums.map(n=>dot(n))),S("cosine","長さと角度から内積へ","余弦の符号も確認します。",nums.map(n=>dot(n,true)))],sec[1]),
 C(chapter,"vector-angle","なす角と垂直","内積から、二つのベクトルの角度を読み取ります。",[m`非零なら $\cos\theta=\frac{\vec a\cdot\vec b}{|\vec a||\vec b|}$、$0\leqq\theta\leqq\pi$。内積が正なら $0\leqq\theta<\frac\pi2$、零なら $\theta=\frac\pi2$、負なら $\frac\pi2<\theta\leqq\pi$ です。同じ向きの零度と反対向きの百八十度も含みます。`,m`零ベクトルとの内積は零ですが、なす角は定めません。「内積が零だから直角」とする前に、両方が非零か確かめます。`],"垂直かだけを調べるなら、角度まで計算する必要はありません。",[S("angle","角度を求める","内積を長さの積で割ります。",nums.map(angle)),S("perpendicular","垂直かを調べる","非零と内積の零を確かめます。",nums.map(perpendicular)),angleCondition,endpointAngle],sec[1]),
 C(chapter,"vector-division","内分点と外分点","比がどの二つの長さを表すかを確かめます。",[m`$AP:PB=m:n$ の内分点は $\vec p=\frac{n\vec a+m\vec b}{m+n}$。$\overrightarrow{AP}=\frac{m}{m+n}\overrightarrow{AB}$ を位置ベクトルへ直した式です。`,m`外分では $PA:PB=m:n$、$m,n>0,m\ne n$ として $\vec p=\frac{m\vec b-n\vec a}{m-n}$。$m=n$ では異なる二点を外分する点はありません。`],"求めた点の位置と二つの距離で検算します。",[S("internal","内分する点","点 $A$から進む割合を考えます。",nums.map(n=>section(n))),S("external","外分する点","線分の外側にあるか確かめます。",nums.map(n=>section(n,true)))],sec[2]),
 C(chapter,"vector-centroid","位置ベクトルと重心","一つの原点から測った位置で、点同士の関係を表します。",[m`原点 $O$ を決め、$\overrightarrow{OA}=\vec a$ を点 $A$ の位置ベクトルといいます。$\overrightarrow{AB}=\vec b-\vec a$ です。`,m`中点は $\frac{\vec b+\vec c}{2}$。重心は中線を頂点から $2:1$ に内分するので $\vec g=\frac{\vec a+2\cdot\frac{\vec b+\vec c}{2}}3=\frac{\vec a+\vec b+\vec c}3$。`],"各座標でも同じ平均の計算ができます。",[S("midpoint","中点の位置","二点の位置を平均します。",nums.map(n=>centroid(n,true))),S("centroid","重心の位置","三頂点の位置を平均します。",nums.map(n=>centroid(n)))],sec[2]),
 C(chapter,"vector-line","直線と線分のベクトル表示","出発点と移動方向で、点の動く範囲を表します。",[m`異なる二点 $A,B$ を通る直線は $\vec p=\vec a+t(\vec b-\vec a)$、$t\in\mathbb R$。`,m`$0\leqq t\leqq1$ に制限すると線分 $AB$ です。$t<0$ は点 $A$ より後ろ、$t>1$ は点 $B$ より先になります。`],"式だけでなく、動かす実数の範囲も答えに含めます。",[S("line","直線全体","前後に制限なく進みます。",nums.map(n=>line(n))),S("segment","線分だけ","端点の間に制限します。",nums.map(n=>line(n,true)))],sec[2]),
 C(chapter,"vector-proof","ベクトルによる図形の証明","平行は実数倍、垂直は内積で表します。",[m`図形の証明では、先に示したい関係を式へ直します。平行なら実数倍、垂直なら非零の二つのベクトルの内積が零です。`,m`内積は分配でき、$\vec a\cdot\vec b=\vec b\cdot\vec a$、$\vec a\cdot\vec a=|\vec a|^2$ です。数例で成り立つことと、一般に成り立つ証明を区別します。`],"同じ基準点からのベクトルへそろえて計算します。",[S("midline","中点連結を示す","終点引く始点を使います。",nums.map(n=>proof(n))),S("diagonal","対角線の垂直を示す","和と差の内積を展開します。",nums.map(n=>proof(n,true)))],sec[2])
];
vectorBanks.splice(8,0,...vectorApplicationBanks);
export const vectorChapter=finish(chapter,"vectors",vectorBanks,sec);
varyPractice(vectorBanks.find(b=>b.lesson.slug==="mc-vector-length")!,vectorChapter,"unit",variedUnits);
