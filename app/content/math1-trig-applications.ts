import {trigTopic as topic,m,w,anglePrep,proportionPrep,lengthPrep,fraction,root,specialValues,repairCases} from "./math1-trig-authoring";
import {addPair,type Worked} from "./math1-topic";
export const areaCases:[number,number,30|60|90|120|150][]=[[4,5,30],[3,6,60],[5,8,90],[4,6,120],[6,7,150],[2,9,30],[4,8,60],[3,8,120]];
function area(b:number,c:number,A:30|60|90|120|150):Worked{
 const coefficient=fraction(b*c,A===90?2:4),answer=A===60||A===120?m`${coefficient==="1"?"":coefficient}\sqrt3`:coefficient;
 return w(m`三角形 $ABC$ で $AB=${c},AC=${b},A=${A}^\circ$。面積 $S$ を求めなさい。`,m`$S=${answer}$。`,"二辺と、その二辺の間の角を確かめます。",m`$S=\frac12bc\sin A=\frac12\cdot${b}\cdot${c}\cdot(${specialValues[A][0]})=${answer}$。`+(A>90?"鈍角でも正弦は正なので面積は正です。":""));
}
function areaHeight(base:number,side:number,A:30|90|150):Worked{
 const h=A===90?String(side):fraction(side,2),s=fraction(base*side,A===90?2:4);
 return w(m`三角形 $ABC$ で $AB=${base},AC=${side},A=${A}^\circ$。$AB$ を底辺とした高さ $h$ と面積 $S$ を求めなさい。`,m`$h=${h},\ S=${s}$。`,"高さは底辺の直線までの垂直な距離です。斜めの辺をそのまま高さにしません。",m`$C$ から直線 $AB$ へ垂線を下ろすと $h=AC\sin A=${side}\cdot(${specialValues[A][0]})=${h}$。${A===150?"足は辺の延長上にあり、補角の正弦を使っても同じ高さです。":""}$S=\frac12\cdot${base}\cdot(${h})=${s}$。`);
}
export const triangleArea=topic("m1-triangle-area","三角形の面積",[
 m`三角形 $ABC$ で $AB=c,AC=b$ とすると、この二辺の間の角は $A$ です。底辺 $AB$ に対する高さは $b\sin A$ なので、面積は $S=\frac12bc\sin A$。三辺のうち任意の二辺と、その間の角で同様に表せます。`,
 m`高さは底辺そのものではなく、底辺を含む直線への垂直距離です。$A$ が鈍角なら垂線の足が延長上に出ますが、$\sin(180^\circ-A)=\sin A$ より高さは同じく $b\sin A$。`,
 m`例えば辺の長さがセンチメートルなら面積の単位は平方センチメートルです。正弦を余弦に置き換えたり、二辺にはさまれていない角を入れたりしないよう、図で対応を確かめます。`,
],"底辺と垂直な高さを結び付け、二辺とはさむ角から面積を求めます。",[
 {id:"triangle-area",title:"二辺とはさむ角で面積へ",why:"一辺を底辺にすると、もう一辺と正弦の積が高さになります。",sample:area(4,3,60),items:areaCases.map(t=>area(...t))},
 {id:"height-and-area",title:"高さを取り出す",why:"底辺の延長上まで含め、垂直な距離を求めます。",sample:areaHeight(6,4,150),items:[areaHeight(8,6,30),areaHeight(5,8,90),areaHeight(7,4,150),areaHeight(4,5,30),areaHeight(10,3,150),areaHeight(3,6,90)]},
],[proportionPrep,anglePrep]);
repairCases(triangleArea,"triangle-area",["1","3","4"]);
repairCases(triangleArea,"height-and-area",["1","2"]);
addPair(triangleArea,"area-angle-choice","二辺にはさまれた角を選ぶ","面積公式に入れる角は、掛ける二辺に共通する頂点の角です。別の角が与えられていれば、そのまま代入できません。",[
 w(m`三角形 $ABC$ の辺 $a=BC,b=CA$ を使う面積公式を、角 $A,B,C$ から適切に選んで書きなさい。`,m`$S=\frac12ab\sin C$。`,"二辺に共通する頂点を探します。",m`$BC$ と $CA$ は頂点 $C$ で交わるので、はさむ角は $C$ です。`),
 w(m`三角形 $ABC$ の辺 $c=AB,a=BC$ を使う面積公式を、角 $A,B,C$ から適切に選んで書きなさい。`,m`$S=\frac12ca\sin B$。`,"同じ辺の対角ではなく、二辺の間の角を選びます。",m`$AB$ と $BC$ は頂点 $B$ で交わるので、はさむ角は $B$ です。`),
]);
function survey(distance:number,elevation:30|45|60,eye:number):Worked{
 const tan=specialValues[elevation][2]!,height=elevation===45?String(distance+eye):m`${eye}+${elevation===60?String(distance):fraction(distance,3)}\sqrt3`;
 return w(m`水平な地面に垂直な塔を、塔の根元から水平方向に $${distance}\,\mathrm{m}$ 離れた地点で見ます。地面から $${eye}\,\mathrm{m}$ の目の高さで、頂上への仰角は $${elevation}^\circ$ でした。塔の高さ $H$ を求めなさい。`,m`$H=(${height})\,\mathrm{m}$。`,"仰角は目から引いた水平線との角です。目の高さより上の部分を先に求めます。",m`長さをメートル単位の数値で計算します。目の水平線から頂上までの高さの数値を $h$ とすると $\frac h{${distance}}=\tan${elevation}^\circ=${tan}$。塔全体の高さは $(h+${eye})\,\mathrm{m}$ なので $H=(${height})\,\mathrm{m}$。`);
}
const triangulations=[
 {L:10,A:45,B:45,C:90,answer:m`5\sqrt2`},
 {L:6,A:30,B:120,C:30,answer:m`6\sqrt3`},
 {L:8,A:60,B:60,C:60,answer:"8"},
 {L:12,A:90,B:30,C:60,answer:m`4\sqrt3`},
 {L:4,A:30,B:60,C:90,answer:m`2\sqrt3`},
 {L:10,A:60,B:30,C:90,answer:"5"},
];
function surveyTriangle(t:typeof triangulations[number]):Worked{return w(m`平面上の二地点 $A,B$ の距離が $${t.L}\,\mathrm{m}$。同じ平面上の地点 $C$ を見て、$\angle CAB=${t.A}^\circ,\angle ABC=${t.B}^\circ$ と測りました。距離 $AC$ を求めなさい。`,m`$AC=${t.answer}\,\mathrm{m}$。`,"既知の辺の対角を、内角の和から先に求めます。",m`$C=180^\circ-${t.A}^\circ-${t.B}^\circ=${t.C}^\circ$。$AC$ の対角は $B$、$AB$ の対角は $C$ なので $\frac{AC}{\sin${t.B}^\circ}=\frac{${t.L}\,\mathrm{m}}{\sin${t.C}^\circ}$。よって $AC=${t.answer}\,\mathrm{m}$。`);}
function splitArea(diagonal:number,hB:number,hD:number):Worked{return w(m`凸四角形 $ABCD$ の対角線 $AC$ は $${diagonal}\,\mathrm{cm}$。$B,D$ から直線 $AC$ への垂直距離は、それぞれ $${hB}\,\mathrm{cm},${hD}\,\mathrm{cm}$ です。四角形の面積を求めなさい。`,m`$${fraction(diagonal*(hB+hD),2)}\,\mathrm{cm}^2$。`,"凸四角形の対角線で二つの三角形に分け、同じ底辺を使います。",m`$B,D$ は対角線の反対側にあり、二つの三角形の内部は重なりません。面積を $\mathrm{cm}^2$ 単位で計算すると、$\frac12\cdot${diagonal}\cdot${hB}+\frac12\cdot${diagonal}\cdot${hD}=${fraction(diagonal*(hB+hD),2)}$ です。`);}
export const measurement=topic("m1-measurement","測量と図形の分割",[
 m`文章から図へ移すときは、水平・垂直・同じ平面という条件を先に書きます。仰角は、見る位置から引いた水平線より上を見上げる角です。視線の長さと水平方向の距離は違います。`,
 m`目から塔の頂上を見る場合、三角比で出るのは目の水平線から上の高さです。塔全体の高さには目の高さを加えます。測定値を使う問題では、三角比表か電卓の度数設定を確認し、指定された精度で最後に丸めます。`,
 m`直接測れない距離でも、測れる一辺と二角から三角形を決められることがあります。既知の辺の対角がまだ分からなければ、内角の和で補います。`,
 m`四角形の面積は、重ならない三角形に分けて足せます。底辺に選んだ線に対する高さを使い、斜めの辺の長さと取り違えないようにします。`,
],"図に条件を写し、求めた長さや面積を元の数量へ戻します。",[
 {id:"survey-height",title:"目の高さと塔の高さ",why:"三角比で求める高さの始点を、地面と混同しないようにします。",sample:survey(10,45,1.5),items:[survey(12,45,1.5),survey(6,60,1),survey(9,30,1.5),survey(8,45,1),survey(4,60,1.5),survey(12,30,1)]},
 {id:"survey-triangle",title:"測れる一辺から離れた地点へ",why:"三角形の内角をそろえてから、既知の辺と対角の比を使います。",sample:surveyTriangle({L:8,A:45,B:45,C:90,answer:m`4\sqrt2`}),items:triangulations.map(surveyTriangle)},
 {id:"split-plane-area",title:"対角線で二つの三角形に分ける",why:"同じ底辺に対する二つの高さを使い、重なりなく面積を足します。",sample:splitArea(8,3,4),items:[splitArea(6,2,5),splitArea(10,3,4),splitArea(5,4,6),splitArea(9,2,4),splitArea(7,3,5),splitArea(12,5,4)]},
],[proportionPrep,anglePrep]);
repairCases(measurement,"survey-height",["2","3"]);
repairCases(measurement,"survey-triangle",["2","4"]);
function cuboid(a:number,b:number,h:number):Worked{
 const d2=a*a+b*b,n=d2+h*h;
 return w(m`直方体 $ABCD\text{-}EFGH$ で、$E,F,G,H$ は順に $A,B,C,D$ の真上にあります。$AB=${a},BC=${b},CG=${h}$ のとき、底面の対角線 $AC$ と空間の対角線 $AG$ を求めなさい。`,m`$AC=${root(d2)},\ AG=${root(n)}$。`,"底面で一つの直角三角形を解き、その対角線と高さを含む直角三角形を取り出します。",m`底面で $AC^2=${a}^2+${b}^2=${d2}$。$CG$ は底面に垂直なので $\angle ACG=90^\circ$。断面の三角形 $ACG$ で $AG^2=AC^2+CG^2=${d2}+${h*h}=${n}$。どちらも正の根をとります。`);
}
function pyramid(side:number,h:number):Worked{
 const half=side/2,slant2=half*half+h*h,edge2=side*side/2+h*h;
 return w(m`正方形 $ABCD$ を底面とする四角錐で、一辺は $${side}$。頂点 $V$ は底面の中心 $O$ の真上にあり、$VO=${h}$ です。辺 $AB$ の中点を $M$ として、側面の高さ $VM$ と側辺 $VA$ を求めなさい。`,m`$VM=${root(slant2)},\ VA=${root(edge2)}$。`,"側面の高さには辺の中点、側辺には底面の頂点を結ぶ断面を使います。",m`$OM=${half}$。$O$ は底面の対角線 $AC$ の中点なので、$OA=\frac{AC}{2}$。三平方の定理より $OA^2=\frac{${side}^2+${side}^2}{4}=${side*side/2}$。$VO$ は底面に垂直なので、三角形 $VOM,VOA$ は $O$ で直角です。$VM^2=${h}^2+${half}^2=${slant2}$、$VA^2=${h}^2+${side*side/2}=${edge2}$。$VM$ と $VA$ は違う線分です。`);
}
export const spaceTriangles=topic("m1-space-triangles","空間図形の中の三角形",[
 m`立体の図は紙の上に斜めに描くため、直角も鋭角に見えることがあります。見た目の角度ではなく、底面や高さの条件から、同じ平面上の三角形を取り出します。`,
 m`直方体の底面の対角線と、底面に垂直な辺を含む断面は長方形です。その半分の直角三角形を使えば、立体の対角線を求められます。まず底面、次に断面、と二回に分けます。`,
 m`正方形の中心の真上に頂点がある四角錐では、立体の高さ、側面の高さ、側辺は別の線分です。底面の中心・辺の中点・頂点のどこへ結ぶのかを、求めたい量に合わせて選びます。`,
 m`平面に垂直な直線とその平面のなす角は $90^\circ$ です。それ以外では、直線と、その平面への垂直な投影との小さい方の角を使います。直方体の対角線と底面なら、対角線を底面へ垂直に写した底面の対角線を使います。`,
],"必要な三角形を一つ取り出し、直角と長さの対応を確かめます。",[
 {id:"cuboid-section",title:"底面から断面へ",why:"底面の対角線を先に求め、その長さを断面の辺として使います。",sample:cuboid(3,4,12),items:[cuboid(3,4,5),cuboid(2,3,6),cuboid(6,8,4),cuboid(1,2,2),cuboid(4,4,2),cuboid(2,2,2)]},
 {id:"pyramid-section",title:"側面の高さと側辺を区別",why:"中点へ結ぶ断面と、頂点へ結ぶ断面では底面側の長さが違います。",sample:pyramid(6,4),items:[pyramid(8,3),pyramid(4,2),pyramid(6,3),pyramid(10,12),pyramid(2,2),pyramid(8,6)]},
],[lengthPrep,proportionPrep]);
addPair(spaceTriangles,"line-plane-angle","対角線と底面のなす角",m`直方体 $ABCD\text{-}EFGH$ で上の頂点は下の同じ順の頂点の真上です。$AG$ を底面へ写すと $AC$ なので、求める角は断面の $\angle GAC$。`,[
 w(m`直方体 $ABCD\text{-}EFGH$ で上の頂点は下の同じ順の頂点の真上です。$AB=3,BC=4,CG=5$ のとき、$AG$ と底面 $ABCD$ のなす角 $\theta$ を求めなさい。`,m`$\theta=45^\circ$。`,"底面への垂直な投影を探し、断面の直角三角形で正接を考えます。",m`$AC=\sqrt{3^2+4^2}=5$。$AG$ の底面への投影は $AC$ なので $\theta=\angle GAC$。$\tan\theta=\frac{CG}{AC}=1$、$0^\circ<\theta<90^\circ$ より $\theta=45^\circ$。`),
 w(m`直方体 $ABCD\text{-}EFGH$ で上の頂点は下の同じ順の頂点の真上です。$AB=3,BC=4,CG=5\sqrt3$ のとき、$AG$ と底面 $ABCD$ のなす角 $\theta$ を求めなさい。`,m`$\theta=60^\circ$。`,"立体の図の見た目ではなく、底面の対角線と高さの比を使います。",m`$AC=5$、$\theta=\angle GAC$。$\tan\theta=\frac{5\sqrt3}{5}=\sqrt3$。鋭角の範囲で $\theta=60^\circ$。`),
]);
export const trigApplicationTopics=[triangleArea,measurement,spaceTriangles];
