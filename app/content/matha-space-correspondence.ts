import type {FormulaLesson} from "./formula-correspondence";
const m=String.raw;
const d=(kind:string,stage:number)=>({kind:"ma-space-"+kind,stage,animated:false});
export const mathASpaceCorrespondence:Record<string,FormulaLesson>={
 "ma-construction-bisectors":{
  title:"等距離から二等分線へ",goal:"作図で作った等しさを、線や角に対応させます。",check:"目盛りのない定規とコンパスを使います。",
  steps:[
   {label:"同じ半径の二円",text:m`線分 $AB$ の両端を中心に、同じ半径の円弧を描きます。二交点を作るため、半径は $AB$ の半分より大きく取ります。`,formulas:[],diagram:d("bisectors",0)},
   {label:"二つの等距離",text:m`交点 $P,Q$ は、それぞれ $A,B$ から等距離です。この二点を通る直線が、等距離の点の集まりになります。`,formulas:[m`{\color{#176c82}{PA=PB}},\qquad {\color{#936114}{QA=QB}}`],diagram:d("bisectors",1)},
   {label:"線分の中点と直角",text:m`$PQ$ と $AB$ の交点を $M$ とします。三角形の合同から $AM=BM$。隣り合う二角も等しく、合わせて $180^\circ$ なので直角です。`,formulas:[m`AM=BM,\qquad PQ\perp AB`],diagram:d("bisectors",2)},
   {label:"角でも等しい辺を作る",text:m`同じ円の半径で $OP=OQ$ を作ります。次に同じ半径の円弧で $PR=QR$ を作ります。$R$ は角の内部で、$O$ と異なる点です。`,formulas:[],diagram:d("angle-bisector",0)},
   {label:"対応する角が等しい",text:m`$OR$ は共通。三辺がそれぞれ等しいので二つの三角形は合同です。対応する角を読むと、半直線 $OR$ が角を二等分しています。`,formulas:[m`\triangle OPR\equiv\triangle OQR`,m`\angle POR=\angle ROQ`],diagram:d("angle-bisector",1)}
  ]
 },
 "ma-construction-perpendicular":{
  title:"等距離から垂線へ",goal:"外点を通る垂線と平行線を作ります。",check:"同じ平面内で考えます。",
  steps:[
   {label:"直線上に等距離の点",text:m`外点 $P$ を中心とする円が、元の直線と二点 $A,B$ で交わるようにします。同じ半径なので $PA=PB$ です。`,formulas:[],diagram:d("perpendicular",0)},
   {label:"垂直二等分線へつなぐ",text:m`$A,B$ から同じ半径で円弧を描き、その二交点を結びます。$PA=PB$ なので、この垂直二等分線は $P$ を通ります。`,formulas:[m`PA=PB\quad\Longrightarrow\quad PH\perp AB`],diagram:d("perpendicular",1)},
   {label:"垂直をもう一度使う",text:m`平行線を作るなら、$P$ で $PH$ にもう一度垂線を作ります。同じ直線に垂直な二直線は平行です。`,formulas:[m`\ell\perp PH,\quad AB\perp PH`,m`\ell\parallel AB`],diagram:d("perpendicular",2)}
  ]
 },
 "ma-construction-division":{
  title:"補助線の比を移す",goal:"線分を2対3に内分する点を作ります。",check:"補助半直線は直線 $AB$ とは異なる向きに取ります。",
  steps:[
   {label:"比の和を全体にする",text:m`線分を $2:3$ に分けます。補助半直線に同じ幅で $2+3=5$ 区間を取り、二番目を $D$、最後を $C$ とします。`,formulas:[m`{\color{#176c82}{AD}}:{\color{#936114}{DC}}=2:3`],diagram:d("division",0)},
   {label:"平行線で位置を移す",text:m`$CB$ を結び、$D$ からこれに平行な直線を作ります。元の線分との交点を $P$ とします。`,formulas:[m`DP\parallel CB`],diagram:d("division",1)},
   {label:"対応する部分と全体",text:m`平行線から二つの三角形は相似です。部分の辺 $AD,AP$ と、全体の辺 $AC,AB$ を対応させます。`,formulas:[m`\triangle ADP\sim\triangle ACB`,m`\frac{\color{#176c82}{AP}}{AB}=\frac{\color{#176c82}{AD}}{AC}=\frac25`],diagram:d("division",2)},
   {label:"残りの部分を対応させる",text:m`全体が $5$、$AP$ が $2$ に対応するので、残りの $PB$ は $3$ に対応します。`,formulas:[m`{\color{#176c82}{AP}}:{\color{#936114}{PB}}=2:3`],diagram:d("division",3)}
  ]
 },
 "ma-construction-tangents":{
  title:"直角から接線へ",goal:"円外の点から二本の接線を作ります。",check:m`$P$ は元の円の外にあります。`,
  steps:[
   {label:"直角を作る直径",text:m`中心 $O$ と外点 $P$ を結び、中点 $M$ を作ります。$M$ を中心、$MO$ を半径とする補助円の直径は $OP$ です。`,formulas:[],diagram:d("tangents",0)},
   {label:"二円の交点を取る",text:m`二円の交点を $T,U$ とします。元の円の上にあるので、接点の候補になります。`,formulas:[],diagram:d("tangents",1)},
   {label:"直径に対する直角",text:m`$T$ は直径 $OP$ の円上にあるため、円周角 $\angle OTP$ は直角です。$U$ でも同じことがいえます。`,formulas:[m`{\color{#176c82}{OT}}\perp{\color{#936114}{PT}}`,m`OU\perp PU`],diagram:d("tangents",2)},
   {label:"接線の条件へ",text:m`円上の点で半径に垂直な直線は接線です。したがって $PT,PU$ が求める二本の接線です。`,formulas:[],diagram:d("tangents",3)}
  ]
 },
 "ma-space-lines":{
  title:"二直線の位置関係",goal:"直方体の二直線を分類します。",check:"辺を含む直線は、両方向へ延長して考えます。",
  steps:[
   {label:"平行な二直線",text:m`下の面を $ABCD$、上の面を $EFGH$ とします。$AB$ と $EF$ は長方形 $ABFE$ の向かい合う辺なので、平行です。`,formulas:[m`{\color{#176c82}{AB}}\parallel{\color{#936114}{EF}}`],diagram:d("lines",0)},
   {label:"共有点がある二直線",text:m`$AB$ と $BC$ は、どちらも点 $B$ を通ります。この共有点で交わります。`,formulas:[],diagram:d("lines",1)},
   {label:"ねじれの位置",text:m`$CG$ が底面と交わる点は $C$ だけで、$C$ は $AB$ 上にありません。さらに $CG$ は底面に垂直なので、$AB$ と平行でもありません。`,formulas:[m`AB\text{ と }CG\text{ はねじれの位置}`],diagram:d("lines",2)},
   {label:"見取図の交差と区別する",text:m`$AC$ と $FH$ は異なる平行な面にあるので交わりません。$FH\parallel BD$ ですが、$BD$ と $AC$ は平行でないので、この二直線もねじれの位置です。`,formulas:[],diagram:d("lines",3)}
  ]
 },
 "ma-space-lines-planes":{
  title:"面内の二本との関係",goal:"直線や二平面が垂直になる条件を調べます。",check:"直方体の下の面は $ABCD$、上の面は $EFGH$ です。",
  steps:[
   {label:"一本との直角だけでは足りない",text:m`$AB\perp AD$ ですが、$AB$ は底面 $ABCD$ の中にあります。面内の一本との直角だけで、面への垂直とはいえません。`,formulas:[],diagram:d("planes",0)},
   {label:"交わる二本との直角",text:m`$AE$ は、底面内で点 $A$ で交わる $AB,AD$ の両方に垂直です。この二本との関係から、底面への垂直が分かります。`,formulas:[m`AE\perp AB,\quad AE\perp AD`,m`AE\perp\text{平面 }ABCD`],diagram:d("planes",1)},
   {label:"二面の角を取り出す",text:m`底面 $ABCD$ と側面 $ABFE$ の交線は $AB$。各面内で交線に垂直な $AD,AE$ を取ると、二面の角は $\angle DAE$ です。`,formulas:[m`\angle DAE=90^\circ`],diagram:d("planes",2)},
   {label:"面を広げても交わらない",text:m`底面 $ABCD$ と上面 $EFGH$ は向かい合う面です。面を広げても交わらないので平行です。`,formulas:[],diagram:d("planes",3)}
  ]
 },
 "ma-space-angle-distance":{
  title:"距離と角を測る線分",goal:"点への距離、平面への距離、正射影を区別します。",check:"直方体の下の面は $ABCD$、上の面は $EFGH$ です。",
  steps:[
   {label:"平面への距離",text:m`$AB=3,AE=4$ とします。$EA$ は底面への垂線なので、点 $E$ から底面までの距離は $EA=4$ です。`,formulas:[],diagram:d("distance",0)},
   {label:"点への距離",text:m`点 $B$ までの距離は、斜めの線分 $EB$。側面から直角三角形 $EAB$ を取り出し、三平方の定理で求めます。`,formulas:[m`EB=\sqrt{3^2+4^2}=5`],diagram:d("distance",1)},
   {label:"点を垂直に写す",text:m`$G$ の垂線の足は $C$。底面上の $A$ はそのままなので、線分 $AG$ の正射影は $AC$ です。`,formulas:[],diagram:d("projection",0)},
   {label:"元の線分と影の角",text:m`線分 $AG$ と底面の角は、$AG$ と正射影 $AC$ が作る小さい方の角です。角の頂点は共通の点 $A$ になります。`,formulas:[m`\angle GAC`],diagram:d("projection",1)}
  ]
 },
 "ma-solid-sections":{
  title:"切り口を面ごとにつなぐ",goal:"三つの中点を通る切り口を作ります。",check:"一辺 $2$ の立方体です。図は位置関係を表す見取図です。",
  steps:[
   {label:"同じ面の二点を探す",text:m`辺 $AB,AD,AE$ の中点を $P,Q,R$ とします。まず $P,Q$ は同じ底面 $ABCD$ にあるので、切り口の一辺として結べます。`,formulas:[],diagram:d("section",0)},
   {label:"隣の面へ進む",text:m`$Q,R$ は側面 $ADHE$ にあります。切断面とこの側面の交わりが、次の辺 $QR$ です。`,formulas:[],diagram:d("section",1)},
   {label:"最初の点へ戻る",text:m`$R,P$ は側面 $ABFE$ にあります。$RP$ を結ぶと三辺が閉じ、切り口は三角形 $PQR$ になります。`,formulas:[],diagram:d("section",2)},
   {label:"三辺の長さを対応させる",text:m`各辺は、直角を挟む二辺がともに $1$ の三角形の斜辺です。三辺とも同じ長さなので、切り口は正三角形です。`,formulas:[m`PQ=QR=RP=\sqrt{1^2+1^2}=\sqrt2`],diagram:d("section",3)},
   {label:"底面に平行な切り口",text:m`$AE,BF,CG,DH$ の中点は同じ高さにあります。結ぶと底面に平行な切り口になり、一辺 $2$ の正方形です。`,formulas:[],diagram:d("parallel-section",0)}
  ]
 },
 "ma-polyhedron-counts":{
  title:"立体の部分と個数",goal:"三角柱の頂点・辺・面を重複なく数えます。",check:"見えない頂点・辺・面も含めます。",
  steps:[
   {label:"一つの底面",text:m`三角柱の一つの底面には、頂点が $3$ 個、辺が $3$ 本あります。`,formulas:[],diagram:d("counts",0)},
   {label:"対応するもう一つの底面",text:m`もう一つの底面にも同じ数があります。頂点はこれですべてですが、辺はまだ上下をつなぐものが残っています。`,formulas:[m`V=3+3=6`],diagram:d("counts",1)},
   {label:"上下をつなぐ辺",text:m`対応する頂点を一本ずつつなぐ辺が $3$ 本。二つの底面の辺と分けて数えます。`,formulas:[m`E={\color{#176c82}{3+3}}+{\color{#936114}{3}}=9`],diagram:d("counts",2)},
   {label:"底面と側面",text:m`面は底面 $2$ 枚と側面 $3$ 枚。各側面が、底面の一辺に対応します。`,formulas:[m`F={\color{#176c82}{2}}+{\color{#936114}{3}}=5`],diagram:d("counts",3)},
   {label:"同じ分け方を角錐へ",text:m`三角錐では、上の底面の代わりに頂点が一つです。底面の三頂点から、それぞれ一本ずつ辺をつなぎます。`,formulas:[m`V=3+1=4,\quad E=3+3=6`,m`F=1+3=4`],diagram:d("pyramid",0)},
   {label:"条件を確かめて検算する",text:m`凸多面体ではオイラーの関係式が成り立ちます。先ほど数えた三角柱の値を使って確かめます。`,formulas:[m`V-E+F=2`,m`6-9+5=2`]}
  ]
 }
};
