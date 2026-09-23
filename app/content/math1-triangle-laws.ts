import {trigTopic as topic,m,w,anglePrep,proportionPrep,lengthPrep,fraction,root,specialValues,repairCases,type SpecialAngle} from "./math1-trig-authoring";
import {type Worked} from "./math1-topic";
const notation=m`三角形 $ABC$ の角を $A,B,C$、その向かいの辺 $BC,CA,AB$ の長さをそれぞれ $a,b,c$ とします。角と向かいの辺は同じ文字の大小で対応させます。`;
type SineCase={A:SpecialAngle;B:SpecialAngle;a:string;b:string};
export const sineSideCases:SineCase[]=[
 {A:30,B:90,a:"3",b:"6"},{A:30,B:60,a:"4",b:m`4\sqrt3`},
 {A:45,B:90,a:"5",b:m`5\sqrt2`},{A:60,B:30,a:m`6\sqrt3`,b:"6"},
 {A:120,B:30,a:m`3\sqrt3`,b:"3"},{A:30,B:120,a:"2",b:m`2\sqrt3`},
 {A:45,B:60,a:m`2\sqrt2`,b:m`2\sqrt3`},{A:60,B:45,a:m`4\sqrt3`,b:m`4\sqrt2`},
];
function sineSide(t:SineCase):Worked{return w(m`三角形 $ABC$ で $A=${t.A}^\circ,B=${t.B}^\circ,a=${t.a}$。正弦定理で $b$ を求めなさい。`,m`$b=${t.b}$。`,m`既知の対応は $a$ と $A$。求めたい $b$ と $B$ の比を等置します。`,m`$\frac{b}{\sin B}=\frac{a}{\sin A}$ より $b=\frac{${t.a}\sin${t.B}^\circ}{\sin${t.A}^\circ}=\frac{(${t.a})(${specialValues[t.B][0]})}{${specialValues[t.A][0]}}=${t.b}$。角の和は $${t.A+t.B}^\circ<180^\circ$ です。`);}
function pairing(known:"a"|"b"|"c",unknown:"a"|"b"|"c"):Worked{
 const A=known.toUpperCase(),B=unknown.toUpperCase();
 return w(m`三角形 $ABC$ で、辺 $${known}$ と角 $${A}$、角 $${B}$ が分かっています。辺 $${unknown}$ を求めるために使う正弦定理の等式を、必要な二つの比だけで書きなさい。`,m`$\frac{${known}}{\sin ${A}}=\frac{${unknown}}{\sin ${B}}$。`,"辺とその向かいの角を、同じ分数に置きます。",m`$${known}$ の対角は $${A}$、$${unknown}$ の対角は $${B}$ なので、この二組を使います。三角形の内角は $0^\circ$ と $180^\circ$ の間にあり、分母の正弦は正です。`);
}
export const sineLaw=topic("m1-sine-law","正弦定理と辺・角の対応",[
 notation,
 m`正弦定理は $\frac a{\sin A}=\frac b{\sin B}=\frac c{\sin C}$。各内角は $0^\circ$ より大きく $180^\circ$ より小さいので、分母は正です。辺とその向かいの角を一組にします。`,
 m`理由を高さで確かめます。$C$ から直線 $AB$ に下ろした高さを $h$ とすると、$h=b\sin A=a\sin B$。鈍角で垂線の足が辺の延長上に出ても、補角の正弦が同じなのでこの式が成り立ちます。正の $\sin A\sin B$ で割ると $\frac a{\sin A}=\frac b{\sin B}$。別の辺を底辺にしても同様です。`,
 m`既知の辺と対角の一組があり、別の角が分かれば、別の辺を求められます。使わない三つ目の比まで書き続ける必要はありません。`,
],"既知の一組と、求めたい辺の一組だけを取り出します。",[
 {id:"sine-pairing",title:"向かい合う辺と角を組にする",why:"図の左右や並んだ順序ではなく、対角かどうかで対応を決めます。",sample:pairing("a","b"),items:[pairing("b","c"),pairing("c","a"),pairing("b","a"),pairing("a","c"),pairing("c","b"),pairing("a","b")]},
 {id:"sine-side",title:"必要な二つの比から長さを求める",why:"求める辺の分母にある正弦を、両辺に掛けます。",sample:sineSide({A:30,B:90,a:"2",b:"4"}),items:sineSideCases.map(sineSide)},
],[anglePrep,proportionPrep]);
repairCases(sineLaw,"sine-side",["4","5","7"]);
function radiusFromSide(a:number,A:30|90|150):Worked{
 const R=A===90?fraction(a,2):String(a);
 return w(m`三角形 $ABC$ で $a=${a},A=${A}^\circ$。外接円の半径 $R$ を求めなさい。`,m`$R=${R}$。`,m`$\frac a{\sin A}$ は半径ではなく直径 $2R$ です。`,m`$2R=\frac{${a}}{\sin${A}^\circ}=\frac{${a}}{${specialValues[A][0]}}$。両辺を $2$ で割り $R=${R}$。`);
}
function sideFromRadius(R:number,A:30|60|90|120|150):Worked{
 const a=A===90?String(2*R):A===30||A===150?String(R):m`${R===1?"":R}\sqrt3`;
 return w(m`半径 $${R}$ の円に内接する三角形 $ABC$ で $A=${A}^\circ$。対辺 $a$ を求めなさい。`,m`$a=${a}$。`,m`$a=2R\sin A$ を使います。$R$ と $2R$ を区別します。`,m`$a=2\cdot${R}\sin${A}^\circ=2\cdot${R}\cdot(${specialValues[A][0]})=${a}$。`);
}
export const circumcircle=topic("m1-sine-circumcircle","正弦定理と外接円",[
 notation,
 m`三角形の三つの頂点をすべて通る円を外接円といいます。その半径を $R$ とすると、正弦定理の共通の比は直径になり、$\frac a{\sin A}=\frac b{\sin B}=\frac c{\sin C}=2R$ です。辺は円の二点を結ぶ弦になっています。`,
 m`なぜ直径が現れるかを確かめます。円の同じ弦 $BC$ を、同じ側の円周上から見る角は等しく、反対側から見る角は和が $180^\circ$ です（円周角の定理）。どちらでも正弦は同じです。$B$ の反対側の直径端を $D$ とすると、$BD=2R$、$\angle BCD=90^\circ$。したがって $\sin\angle BDC=\frac{BC}{BD}=\frac a{2R}$。よって $a=2R\sin A$。$BC$ 自身が直径なら $A=90^\circ$ で、同じ式が成り立ちます。`,
 m`直角三角形では斜辺が外接円の直径です。「外接円」は半径の名前ではなく、三頂点を通る円の名前です。半径と直径を取り違えないよう、まず $2R$ の式を書きます。`,
],"向かいの辺と角を使い、半径と直径を区別します。",[
 {id:"circumradius",title:"共通の比は直径",why:m`まず $2R$ を求めてから半分にします。`,sample:radiusFromSide(6,30),items:[radiusFromSide(4,90),radiusFromSide(5,30),radiusFromSide(3,150),radiusFromSide(7,90),radiusFromSide(8,150),radiusFromSide(2,30)]},
 {id:"radius-to-chord",title:"円の大きさから弦へ",why:m`直径に対角の正弦を掛けると弦の長さになります。`,sample:sideFromRadius(3,60),items:[sideFromRadius(4,30),sideFromRadius(2,90),sideFromRadius(3,120),sideFromRadius(5,150),sideFromRadius(2,60),sideFromRadius(6,30)]},
],[proportionPrep,anglePrep]);
repairCases(circumcircle,"circumradius",["1","3","4"]);
repairCases(circumcircle,"radius-to-chord",["1","2","3"]);
export type CosineCase={b:number;c:number;A:60|90|120};
export const cosineSideCases:CosineCase[]=[{b:3,c:4,A:60},{b:2,c:3,A:120},{b:5,c:12,A:90},{b:4,c:4,A:60},{b:3,c:3,A:120},{b:2,c:5,A:60},{b:6,c:8,A:90},{b:4,c:5,A:120}];
export function cosineSide(t:CosineCase):Worked{
 const cos=t.A===60?0.5:t.A===90?0:-0.5,n=t.b*t.b+t.c*t.c-2*t.b*t.c*cos;
 return w(m`三角形 $ABC$ で $b=${t.b},c=${t.c},A=${t.A}^\circ$。余弦定理で $a$ を求めなさい。`,m`$a=${root(n)}$。`,"与えられた二辺にはさまれる角がどれかを確かめます。",m`$a^2=b^2+c^2-2bc\cos A=${t.b}^2+${t.c}^2-2\cdot${t.b}\cdot${t.c}\cdot(${specialValues[t.A][1]})=${n}$。長さは正なので $a=${root(n)}$。`);
}
function cosineSetup(target:"a"|"b"|"c",p:number,q:number,angle:number):Worked{
 const others={a:["b","c"],b:["c","a"],c:["a","b"]}[target],A=target.toUpperCase();
 return w(m`三角形 $ABC$ で $${others[0]}=${p},${others[1]}=${q},${A}=${angle}^\circ$。余弦定理で $${target}$ を求めるための式を書きなさい。計算は不要です。`,m`$${target}^2=${p}^2+${q}^2-2\cdot${p}\cdot${q}\cos${angle}^\circ$。`,"求める辺の向かいの角が、既知の二辺にはさまれる角です。",m`$${target}^2=${others[0]}^2+${others[1]}^2-2${others[0]}${others[1]}\cos ${A}$ に条件を入れます。角を別の頂点の角へ取り替えてはいけません。`);
}
export const cosineLawSide=topic("m1-cosine-law-side","余弦定理で辺を求める",[
 notation,
 m`二辺 $b,c$ とその間の角 $A$ が分かるとき、余弦定理 $a^2=b^2+c^2-2bc\cos A$ で残る辺を求められます。二辺と「どこかの角」ではなく、その二辺にはさまれる角が必要です。`,
 m`理由を座標で確かめます。$A$ を原点、$AB$ を正の横軸に置くと $B(c,0),C(b\cos A,b\sin A)$。三平方の定理による二点間の距離から $a^2=(b\cos A-c)^2+(b\sin A)^2=b^2(\cos^2 A+\sin^2 A)-2bc\cos A+c^2=b^2+c^2-2bc\cos A$。鈍角で横座標が負でも同じ式です。`,
 m`$A=90^\circ$ なら $\cos A=0$ なので三平方の定理になります。鈍角なら $\cos A<0$ で、最後の項は正になります。長さを答えるときは、二乗のままで止めず正の平方根をとります。`,
],"二辺とはさむ角を対応させ、最後に二乗から長さへ戻します。",[
 {id:"cosine-setup",title:"はさむ角を式へ入れる",why:"求める辺の向かいの角を余弦に入れます。",sample:cosineSetup("a",3,4,60),items:[cosineSetup("b",4,5,120),cosineSetup("c",2,3,60),cosineSetup("a",6,7,40),cosineSetup("b",3,8,90),cosineSetup("c",5,6,110),cosineSetup("a",2,4,135)]},
 {id:"cosine-side",title:"余弦の符号を含めて計算",why:"鈍角の余弦は負なので、引く項全体の符号に注意します。",sample:cosineSide({b:2,c:2,A:120}),items:cosineSideCases.map(cosineSide)},
],[lengthPrep,proportionPrep]);
repairCases(cosineLawSide,"cosine-side",["1","3","4"]);
export const cosineAngleCases:[number,number,number][]=[[3,3,3],[5,3,4],[7,5,3],[3,4,5],[4,3,5],[5,5,6],[2,2,3],[8,5,5]];
function angleCos(a:number,b:number,c:number):Worked{
 const numerator=b*b+c*c-a*a,den=2*b*c,cos=fraction(numerator,den),type=numerator>0?"鋭角":numerator===0?"直角":"鈍角";
 return w(m`三角形 $ABC$ で $a=${a},b=${b},c=${c}$。$\cos A$ を求め、$A$ が鋭角・直角・鈍角のどれか判定しなさい。`,m`$\cos A=${cos}$。$A$ は${type}です。`,"調べたい角の向かいの辺の二乗を、分子で引きます。",m`$\cos A=\frac{b^2+c^2-a^2}{2bc}=\frac{${b}^2+${c}^2-${a}^2}{2\cdot${b}\cdot${c}}=${cos}$。内角は $0^\circ<A<180^\circ$ なので、余弦の${numerator>0?"正":numerator===0?"ゼロ":"負"}から${type}と分かります。`);
}
function exactAngle(a:string,b:string,c:string,cos:string,A:number):Worked{return w(m`三角形 $ABC$ で $a=${a},b=${b},c=${c}$。角 $A$ を求めなさい。`,m`$A=${A}^\circ$。`,"三辺から余弦を求め、内角の範囲で対応する角を読みます。",m`$\cos A=\frac{(${b})^2+(${c})^2-(${a})^2}{2(${b})(${c})}=${cos}$。$0^\circ<A<180^\circ$ でこの余弦をもつ角は一つなので $A=${A}^\circ$。`);}
export const cosineLawAngle=topic("m1-cosine-law-angle","三辺から角を調べる",[
 notation,
 m`三辺が分かれば、余弦定理を角について整理します。$2bc\cos A=b^2+c^2-a^2$ より $\cos A=\frac{b^2+c^2-a^2}{2bc}$。辺の長さは正なので分母で割れます。`,
 m`内角は $0^\circ<A<180^\circ$。$\cos A>0$ なら鋭角、$=0$ なら直角、$<0$ なら鈍角です。角度の数値まで求められなくても、符号だけで種類を判定できます。`,
 m`三つの正の数が三角形の辺になるには、最長辺が他の二辺の和より短いことが必要十分です。等しければ一直線につぶれてしまいます。この条件を満たさない数から、三角形の角を計算することはできません。`,
],"求める角の対辺を引き、余弦の符号と値を読み取ります。",[
 {id:"cosine-angle-type",title:"余弦の符号から角を判定",why:"分母は正なので、引き算の符号がそのまま角の種類を決めます。",sample:angleCos(4,3,3),items:cosineAngleCases.map(t=>angleCos(...t))},
 {id:"cosine-exact-angle",title:"余弦の値から内角へ",why:"三辺から計算した比を、特別な角の表と照らし合わせます。",sample:exactAngle(m`\sqrt3`,"1","1",m`-\frac12`,120),items:[exactAngle("2","2","2",m`\frac12`,60),exactAngle("5","3","4","0",90),exactAngle(m`2\sqrt3`,"2","2",m`-\frac12`,120),exactAngle(m`\sqrt2`,"1","1","0",90),exactAngle("3","3","3",m`\frac12`,60),exactAngle(m`3\sqrt3`,"3","3",m`-\frac12`,120)]},
],[lengthPrep,anglePrep]);
repairCases(cosineLawAngle,"cosine-angle-type",["2","3"]);
repairCases(cosineLawAngle,"cosine-exact-angle",["1","2"]);
export const triangleLawTopics=[sineLaw,circumcircle,cosineLawSide,cosineLawAngle];
