import {m,q,f} from "./matha-authoring";
import type {Q} from "./matha-authoring";
export type Construction="bisect-segment"|"bisect-angle"|"perpendicular"|"parallel"|"divide"|"ratio"|"tangent-point"|"tangent-outside";
export function construct(kind:Construction,n:number,orientation:string):Q{
 const start="紙に図を描き、目盛りを使わない定規とコンパスで作図しなさい。円弧と補助線を残し、成り立つ理由も書きなさい。";
 const prompt={
  "bisect-segment":m`${orientation}に線分 $AB$ を描きます。垂直二等分線を作図しなさい。`,
  "bisect-angle":m`${orientation}の角 $AOB$ を描きます。内角の二等分線を作図しなさい。`,
  "perpendicular":m`${orientation}の直線と、その外の点 $P$ を描きます。$P$ から直線への垂線を作図しなさい。`,
  "parallel":m`${orientation}の直線と、その外の点 $P$ を描きます。$P$ を通る平行線を作図しなさい。`,
  "divide":m`${orientation}の線分 $AB$ を $${n}$ 等分しなさい。`,
  "ratio":m`${orientation}の線分 $AB$ に $AP:PB=${n}:2$ となる点 $P$ を作図しなさい。`,
  "tangent-point":m`円上で${orientation}にある点 $T$ を一つ取り、その点での接線を作図しなさい。`,
  "tangent-outside":m`円の外で${orientation}にある点 $P$ を一つ取り、$P$ からの二本の接線を作図しなさい。`
 }[kind];
 const working={
  "bisect-segment":m`$A,B$ を中心とし、$AB$ の半分より大きい同じ半径で二つの円を描きます。二交点 $P,Q$ を結びます。$PA=PB,QA=QB$ なので、二点を通る直線 $PQ$ は線分の垂直二等分線です。理由は、$PQ$ と $AB$ の交点を $M$ とすると、三辺相等から $\triangle APQ\equiv\triangle BPQ$、さらに二辺とその間の角から $\triangle APM\equiv\triangle BPM$。よって $AM=BM$、隣り合う等しい角は直角になります。`,
  "bisect-angle":m`頂点 $O$ を中心とする円弧で二辺上に $P,Q$ を取ります。$P,Q$ を中心とする同じ半径の円弧を角内部で交わらせ、交点 $R$ と $O$ を結びます。$OP=OQ,PR=QR,OR$ 共通より $\triangle OPR\equiv\triangle OQR$。よって $\angle POR=\angle ROQ$ です。$R$ は頂点と違う点を選びます。`,
  "perpendicular":m`$P$ を中心とし、直線と二点 $A,B$ で交わる円を描きます。$PA=PB$ なので、$AB$ の垂直二等分線は $P$ を通ります。$A,B$ を中心とする等半径の円弧の二交点を結んで、その線を作図します。`,
  "parallel":m`まず $P$ から元の直線への垂線を作ります。その垂線上で $P$ から等距離の二点 $A,B$ を円で取り、$AB$ の垂直二等分線を作ります。これは $P$ を通り、最初の垂線に垂直です。同じ平面で同じ直線に垂直な二直線なので、元の直線に平行です。`,
  "divide":m`$A$ から、直線 $AB$ 上にない半直線を引き、コンパスの幅を変えずに同じ長さずつ $P_1,\ldots,P_{${n}}$ を順に取ります。$P_{${n}}B$ を結び、途中の各点からこの線に平行な線を作図します。途中の点 $P_j$（$${n===2?"j=1":`j=1,\\ldots,${n-1}`}$）から引いた平行線と $AB$ の交点を $Q_j$ とします。$\triangle AP_jQ_j\sim\triangle AP_{${n}}B$ より $AQ_j:AB=AP_j:AP_{${n}}=j:${n}$。したがって交点は $AB$ の等分点です。平行線は垂線を二回作って引き、目測にしません。`,
  "ratio":m`$A$ から、直線 $AB$ 上にない半直線を引き、同じ長さずつ $${n+2}$ 個の区間をコンパスで取ります。最後の点を $C$、$${n}$ 番目の点を $D$ とします。$CB$ を結び、$D$ からそれに平行な線を作図し、$AB$ との交点を $P$ とします。$DP\parallel CB$ より $\triangle ADP\sim\triangle ACB$。$AP:AB=AD:AC=${n}:${n+2}$ なので、残りの $PB$ は比で $2$、$AP:PB=${n}:2$ です。平行線は垂線を二回作って引きます。`,
  "tangent-point":m`中心 $O$ と $T$ を結びます。$T$ を中心とする円で直線 $OT$ 上に等距離の二点を取り、その二点の垂直二等分線を作図します。これは $T$ を通り $OT$ に垂直なので、元の円の接線です。`,
  "tangent-outside":m`中心 $O$ と $P$ を結び、$OP$ の垂直二等分線で中点 $M$ を作ります。中心 $M$、半径 $MO$ の円を描き、元の円との二交点を $T,U$ とします。$PT,PU$ を引きます。直径 $OP$ に対する円周角は直角なので $OT\perp PT,OU\perp PU$。よって二本とも接線です。$P$ が円内ではこの作図で接点は得られません。`
 }[kind];
 const hint={
  "bisect-segment":"両端から同じ距離にある点を、二つ作ります。",
  "bisect-angle":"二つの三角形の三辺が等しくなるように円弧を描きます。",
  "perpendicular":"外の点から等距離にある二点を、元の直線上に作ります。",
  "parallel":"垂直な線を二回作ることを考えます。",
  "divide":"別の半直線上なら、同じコンパス幅で等しい区間を並べられます。",
  "ratio":"比の和だけ等しい区間を取り、指定の位置から平行線を作ります。",
  "tangent-point":"接点で半径と直角になる線を作ります。",
  "tangent-outside":"接点で直角を作るには、中心と外点を直径の両端にします。"
 }[kind];
 const answer={
  "bisect-segment":m`二円の交点を結ぶ $PQ$。両端から等距離の二点を通り、合同から $AB$ を垂直に二等分します。`,
  "bisect-angle":m`半直線 $OR$。三辺相等の合同から $\angle POR=\angle ROQ$ です。`,
  "perpendicular":m`円で取った二交点 $A,B$ の垂直二等分線。$PA=PB$ なので $P$ を通ります。`,
  "parallel":m`$P$ で最初の垂線に立てた垂線。同じ平面で同じ直線に垂直なので、元の直線に平行です。`,
  "divide":m`補助半直線上の $${n}$ 等分を平行線で移した図。相似により $AB$ も $${n}$ 等分されます。`,
  "ratio":m`補助半直線上の $${n+2}$ 区間のうち、$${n}$ 番目を対応させた点 $P$。相似より $AP:PB=${n}:2$ です。`,
  "tangent-point":m`$T$ を通り半径 $OT$ に垂直な直線。円への接線の条件を満たします。`,
  "tangent-outside":m`直径 $OP$ の円と元の円との交点 $T,U$ を使った $PT,PU$。直径に対する円周角が直角なので、どちらも半径に垂直な接線です。`
 }[kind];
 return q(start+prompt,"円弧・補助線を残した作図と、次の根拠："+answer,hint,working);
}
export const cubeVertices:Record<string,[number,number,number]>={A:[0,0,0],B:[1,0,0],C:[1,1,0],D:[0,1,0],E:[0,0,1],F:[1,0,1],G:[1,1,1],H:[0,1,1]};
export const cubeIntro=m`直方体の下の面を $ABCD$、上の面を $EFGH$ とし、上下を結ぶ辺を $AE,BF,CG,DH$ とします。辺を含む直線は、両方向へ延長して考えます。`;
type V=[number,number,number];
const sub=(a:V,b:V):V=>a.map((v,i)=>v-b[i]) as V;
const cross=(a:V,b:V):V=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a:V,b:V)=>a.reduce((s,v,i)=>s+v*b[i],0);
const lineReasons:Record<string,string>={
 "AB/BC":"どちらも点 $B$ を通るので、$B$ で交わります。",
 "AB/EF":"長方形 $ABFE$ の向かい合う辺なので平行です。",
 "AD/EH":"長方形 $ADHE$ の向かい合う辺なので平行です。",
 "AD/AB":"どちらも点 $A$ を通るので、$A$ で交わります。",
 "AD/BF":"$BF$ が底面と交わる点は $B$ だけで、$B$ は $AD$ 上にありません。また $BF$ は底面に垂直なので、底面内の $AD$ と平行でもありません。よって、ねじれの位置です。",
 "BC/FG":"長方形 $BCGF$ の向かい合う辺なので平行です。",
 "BC/CD":"どちらも点 $C$ を通るので、$C$ で交わります。",
 "BC/AE":"$AE$ が底面と交わる点は $A$ だけで、$A$ は $BC$ 上にありません。また $AE$ は底面に垂直なので、底面内の $BC$ と平行でもありません。よって、ねじれの位置です。",
 "AB/CG":"$CG$ が底面と交わる点は $C$ だけで、$C$ は $AB$ 上にありません。また $CG$ は底面に垂直なので、底面内の $AB$ と平行でもありません。よって、ねじれの位置です。",
 "CD/EF":m`$CD\parallel AB$、$AB\parallel EF$ なので、$CD$ と $EF$ も平行です。`,
 "AC/FH":m`$AC$ と $FH$ は平行な上下面にあるので交わりません。また $FH\parallel BD$ ですが、$AC$ と $BD$ は底面の対角線で交わるため、$AC$ と $FH$ は平行でもありません。よって、ねじれの位置です。`,
 "AC/EG":"上面は底面をそのまま上へ平行移動したものなので、対応する対角線 $AC$ と $EG$ は平行です。",
 "BD/FH":"上面は底面をそのまま上へ平行移動したものなので、対応する対角線 $BD$ と $FH$ は平行です。",
 "AC/BD":"長方形 $ABCD$ の二本の対角線なので、その交点で交わります。",
 "EG/FH":"長方形 $EFGH$ の二本の対角線なので、その交点で交わります。",
 "AF/BE":"長方形 $ABFE$ の二本の対角線なので、その交点で交わります。",
 "AH/DE":"長方形 $ADHE$ の二本の対角線なので、その交点で交わります。",
 "AC/EF":m`平行な上下面にあるので交わりません。$EF\parallel AB$ で、$AC$ と $AB$ は平行でないため、この二直線も平行ではありません。よって、ねじれの位置です。`,
 "BD/FG":m`平行な上下面にあるので交わりません。$FG\parallel BC$ で、$BD$ と $BC$ は平行でないため、この二直線も平行ではありません。よって、ねじれの位置です。`,
};
export function lines(a:string,b:string):Q{
 const av=cubeVertices[a[0]],bv=cubeVertices[b[0]],u=sub(cubeVertices[a[1]],av),v=sub(cubeVertices[b[1]],bv),normal=cross(u,v),parallel=normal.every(x=>x===0),samePlane=dot(sub(bv,av),normal)===0;
 const result=parallel?"平行":samePlane?"交わる":"ねじれの位置";
 const reason=lineReasons[`${a}/${b}`]??(parallel?"直方体の対応する辺（または対応する面の同じ向きの対角線）で、延長しても交わりません。":samePlane?"同じ平面上にあり、平行でないため延長した直線は一点で交わります。":"平行ではなく、延長しても交わりません。同じ平面上にない二直線です。");
 return q(cubeIntro+m`直線 $${a}$ と $${b}$ の位置関係を、理由とともに答えなさい。`,result+"。"+reason,"共有点を持つかを調べ、平行でも交わる関係でもない場合にねじれと判断します。",reason+" 見取図上で線が重なるかどうかだけでは判断しません。");
}
export function linePlane(edge:string,face:string,relation:string,reason:string):Q{
 return q(cubeIntro+m`直線 $${edge}$ と平面 $${face}$ の位置関係を答え、理由も説明しなさい。`,relation+"。"+reason,
 "線が面に含まれるか、交点がないか、一点で交わるかを先に分けます。垂直なら面内の二本との直角を確かめます。",reason+" 平面に含まれる直線を、その平面に平行という答えにはしません。");
}
export function planes(face:string,other:string,perp:boolean):Q{
 return q(cubeIntro+m`平面 $${face}$ と平面 $${other}$ は平行ですか、垂直ですか。理由も答えなさい。`,
 perp?"垂直です。交線にそれぞれの面内で垂直な二直線が、直角をつくるからです。":"平行です。直方体の向かい合う二面で、交線を持たないからです。",
 perp?"交線を探し、その交線に垂直な線を各面内に取ります。":"直方体の向かい合う面かどうかを確かめます。",
 perp?"直方体の隣り合う二面です。交線となる辺の一端で、各面内のもう一方の辺を取ると、どちらも交線に垂直で互いにも直角です。この二線の角が二面の角です。":"直方体の向かい合う面は、面を広げても交わりません。見取図の斜めの角度は、実際の二面の角ではありません。");
}
export function spaceDistance(a:number,h:number):Q{
 return q(cubeIntro+m`$AB=${a},AE=${h}$ です。点 $E$ から点 $B$ までの距離と、点 $E$ から底面 $ABCD$ までの距離を求めなさい。`,
 m`$EB=${Math.sqrt(a*a+h*h)}$、底面までの距離は $${h}$。`,
 "点までの斜めの距離と、面への垂直な距離を分けます。",
 m`側面 $ABFE$ の直角三角形で $EB=\sqrt{${a}^2+${h}^2}=${Math.sqrt(a*a+h*h)}$。底面への垂線は $EA$ なので、面までの距離は $EA=${h}$ です。`);
}
export function projection(top:string,bottom:string,foot:string):Q{
 return q(cubeIntro+m`線分 $${bottom}${top}$ と底面 $ABCD$ のなす角を、三文字の角で答えなさい。`,
 m`$\angle ${top}${bottom}${foot}$（または $\angle ${foot}${bottom}${top}$）。`,
 "上の点から底面への垂線の足を取り、底面上の影を結びます。",
 m`$${top}$ から底面への垂線の足は $${foot}$ です。線分の正射影は $${bottom}${foot}$。したがって線と面の角は、元の線分とこの影との角 $\angle ${top}${bottom}${foot}$ です。`);
}
export function cut(n:number,corner=true):Q{
 return q(cubeIntro+m`一辺 $${n}$ の立方体です。${corner?"辺 $AB,AD,AE$ の中点をそれぞれ $P,Q,R$ とします。この三点を通る平面":"上下を結ぶ四辺の中点を通り、底面に平行な平面"}で切ったときの切り口を、紙に描き、その形と辺の長さ、理由を答えなさい。`,
 corner?m`正三角形。各辺は $${n===2?"":f(n,2)}\sqrt2$。隣り合う面ごとの二等辺直角三角形で、三辺が同じ長さになるからです。` :m`一辺 $${n}$ の正方形。底面に平行で、側面内の各辺が底面の辺と同じ長さだからです。`,
 "同じ面にある二点を結び、隣の面で続きを探します。",
 corner?m`$P,Q$ は底面、$Q,R$ と $R,P$ はそれぞれ側面にあります。三つの線分で切り口が閉じます。各線分は直角を挟む二辺が $\frac{${n}}2$ の二等辺直角三角形の斜辺なので、すべて $${n===2?"":f(n,2)}\sqrt2$。`:
 m`同じ高さの中点どうしを側面で結ぶと、各線分は底面の辺と平行で長さも $${n}$。四辺が底面と対応するので正方形です。`);
}
export function polyhedron(n:number,pyramid=false):Q{
 const v=pyramid?n+1:2*n,e=pyramid?2*n:3*n,faces=n+2-(+pyramid);
 return q(m`$${n}$ 角${pyramid?"錐":"柱"}の頂点・辺・面の数をそれぞれ答え、数え方も説明しなさい。`,
 m`頂点 $${v}$、辺 $${e}$、面 $${faces}$。`+(pyramid?m`底面と上の頂点に分け、頂点は $${n}+1$、辺は $${n}+${n}$、面は $1+${n}$ と数えます。`:m`二つの底面とそれらをつなぐ部分に分け、頂点は $2\times${n}$、辺は $2\times${n}+${n}$、面は $2+${n}$ と数えます。`),
 "底面のものと、上の面または頂点へつながるものを分けます。",
 pyramid?m`底面の $${n}$ 頂点と頂点一つで $${v}$。底面の辺 $${n}$ 本と頂点につながる $${n}$ 本で $${e}$。底面一つと側面 $${n}$ 枚で $${faces}$。`:
 m`二つの底面に頂点が $${n}$ 個ずつで $${v}$。底面の辺 $${2*n}$ 本と上下を結ぶ $${n}$ 本で $${e}$。底面二枚と側面 $${n}$ 枚で $${faces}$。`);
}
export function euler(v:number,faces:number):Q{return q(m`凸多面体の頂点は $${v}$ 個、面は $${faces}$ 枚です。辺の本数を求めなさい。`,
 m`$${v+faces-2}$ 本。`,"凸多面体であるという条件の下で、オイラーの関係式を使います。",
 m`$V-E+F=2$ に代入して $${v}-E+${faces}=2$。したがって $E=${v+faces-2}$。`);}
