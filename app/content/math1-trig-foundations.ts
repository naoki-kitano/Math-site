import {trigTopic as topic,m,w,fraction,anglePrep,lengthPrep,ratioPrep,proportionPrep,specialValues,repairCases} from "./math1-trig-authoring";
import {addPair,type Worked} from "./math1-topic";
function sideRoles(vertices:string,right:number,focus:number):Worked{
 const v=vertices.split(""),hyp=v.filter((_,i)=>i!==right).join(""),opp=v.filter((_,i)=>i!==focus).join(""),adj=v[focus]+v[right];
 return w(m`三角形 $${vertices}$ で $\angle ${v[right]}=90^\circ$。$\angle ${v[focus]}$ に着目して、斜辺・向かいの辺・斜辺でない隣の辺を答えなさい。`,m`斜辺は $${hyp}$、向かいの辺は $${opp}$、斜辺でない隣の辺は $${adj}$。`,"直角の向かいが斜辺です。次に、着目する角の頂点を含まない辺を探します。",m`直角の頂点 $${v[right]}$ を含まない辺 $${hyp}$ が斜辺。着目する頂点 $${v[focus]}$ を含まない辺 $${opp}$ が向かいの辺です。残る $${adj}$ が斜辺でない隣の辺です。`);
}
function pythagoras(a:number,b:number,c:number,missing:"hyp"|"leg"):Worked{
 return w(missing==="hyp"?m`直角三角形の斜辺でない二辺が $${a},${b}$ です。斜辺の長さ $x$ を求めなさい。`:m`直角三角形の斜辺が $${c}$、他の一辺が $${a}$ です。残る辺の長さ $x$ を求めなさい。`,m`$x=${missing==="hyp"?c:b}$。`,"斜辺の二乗だけを等式の片側に置きます。",missing==="hyp"?m`三平方の定理より $x^2=${a}^2+${b}^2=${c*c}$。長さは正なので $x=${c}$。`:m`三平方の定理より $${c}^2=${a}^2+x^2$。$x^2=${c*c}-${a*a}=${b*b}$ で、長さは正なので $x=${b}$。`);
}
export const rightTriangle=topic("m1-right-triangle","直角三角形と辺の対応",[
 m`直角の向かいの辺を斜辺といいます。図を回転しても斜辺は変わりません。最も上にある辺、斜めに描かれた辺、という決め方はしません。`,
 m`直角でない一つの角に着目すると、残る二辺は「その角の向かい」と「その角に隣り合う辺」に分かれます。隣り合う二辺のうち斜辺でない方を使うので、まず斜辺を確定します。`,
 m`三平方の定理は、斜辺の長さを $c$、他の二辺を $a,b$ として $a^2+b^2=c^2$。直角三角形であることが前提です。斜辺以外を求めるときは、二乗の和ではなく差になります。`,
],"図の向きではなく、直角と着目する角から辺を決めます。",[
 {id:"side-roles",title:"角を決めて三つの辺を読む",why:"直角の向かいを先に決め、その後で着目する角の向かいと隣を区別します。",sample:sideRoles("ABC",2,0),items:[sideRoles("ABC",2,1),sideRoles("PQR",1,0),sideRoles("ABC",0,2),sideRoles("XYZ",2,0),sideRoles("PQR",0,1),sideRoles("ABC",1,2),sideRoles("XYZ",0,2),sideRoles("PQR",2,1)]},
 {id:"pythagoras",title:"斜辺の二乗を見分ける",why:"未知の辺が斜辺かどうかを先に確かめます。",sample:pythagoras(3,4,5,"leg"),items:[pythagoras(3,4,5,"hyp"),pythagoras(5,12,13,"leg"),pythagoras(6,8,10,"hyp"),pythagoras(8,15,17,"leg"),pythagoras(9,12,15,"hyp"),pythagoras(12,16,20,"leg")]},
],[anglePrep,lengthPrep]);
repairCases(rightTriangle,"pythagoras",["1"]);
function trigRatios(o:number,a:number,h:number,focus="A"):Worked{
 return w(m`$\angle C=90^\circ$ の三角形 $ABC$ で、$${focus==="A"?"BC":"AC"}=${o},${focus==="A"?"AC":"BC"}=${a},AB=${h}$。$\sin ${focus},\cos ${focus},\tan ${focus}$ を求めなさい。`,m`$\sin ${focus}=${fraction(o,h)},\ \cos ${focus}=${fraction(a,h)},\ \tan ${focus}=${fraction(o,a)}$。`,"最初に着目する角の向かい・隣・斜辺を対応させます。",m`$\angle ${focus}$ の向かいは $${o}$、斜辺でない隣は $${a}$、斜辺は $${h}$。定義へ入れて $\sin ${focus}=\frac{${o}}{${h}}=${fraction(o,h)},\ \cos ${focus}=\frac{${a}}{${h}}=${fraction(a,h)},\ \tan ${focus}=\frac{${o}}{${a}}=${fraction(o,a)}$。`);
}
function scaledRatio(o:number,a:number,h:number,k:number):Worked{return w(m`ある鋭角 $\theta$ の向かい・隣・斜辺が $${o},${a},${h}$ の直角三角形を、辺の長さがすべて $${k}$ 倍になるよう拡大します。拡大後の $\sin\theta$ と、それが変わらない理由を答えなさい。`,m`$\sin\theta=${fraction(o,h)}$。向かいと斜辺をともに $${k}$ 倍するので、比は変わりません。`,"長さ自体と長さの比を区別します。",m`拡大後は $\sin\theta=\frac{${o*k}}{${h*k}}=\frac{${k}\cdot${o}}{${k}\cdot${h}}=${fraction(o,h)}$。相似な三角形では同じ角の三角比は等しくなります。`);}
export const trigMeaning=topic("m1-trig-meaning","三角比の意味",[
 m`ここでは $0^\circ<\theta<90^\circ$。直角三角形で $\sin\theta$（サイン）は「向かいの辺÷斜辺」、$\cos\theta$（コサイン）は「斜辺でない隣の辺÷斜辺」、$\tan\theta$（タンジェント）は「向かいの辺÷斜辺でない隣の辺」です。`,
 m`式では $\sin\theta=\frac{\text{向かい}}{\text{斜辺}}$、$\cos\theta=\frac{\text{隣}}{\text{斜辺}}$、$\tan\theta=\frac{\text{向かい}}{\text{隣}}$。三つとも長さではなく比なので、長さの単位は付きません。`,
 m`同じ鋭角を含む直角三角形は相似です。辺が同じ倍率で伸びるため、対応する辺の比は変わりません。三角比は三角形の大きさではなく角で決まります。`,
 m`着目する角をもう一つの鋭角に変えると、向かいと隣が入れ替わります。辺に固定された「サインの辺」があるわけではありません。`,
],"角を一つ決め、必要な二辺の比を書きます。",[
 {id:"trig-ratios",title:"辺の対応を三つの比へ",why:"斜辺を固定し、着目する角を基準に分子と分母を決めます。",sample:trigRatios(3,4,5),items:[trigRatios(4,3,5),trigRatios(5,12,13),trigRatios(12,5,13,"B"),trigRatios(8,15,17,"B"),trigRatios(15,8,17),trigRatios(6,8,10,"B"),trigRatios(8,6,10),trigRatios(9,12,15,"B")]},
 {id:"similarity-ratio",title:"大きさを変えても比は同じ",why:"長さに掛かった倍率は分子と分母で約分されます。",sample:scaledRatio(3,4,5,2),items:[scaledRatio(4,3,5,3),scaledRatio(5,12,13,2),scaledRatio(12,5,13,3),scaledRatio(8,15,17,2),scaledRatio(15,8,17,3),scaledRatio(3,4,5,4)]},
],[ratioPrep,anglePrep]);
function special(a:30|45|60,k:0|1|2):Worked{
 const name=["sin","cos","tan"][k],value=specialValues[a][k]!;
 const base=a===45?m`直角二等辺三角形の辺の比は $1:1:\sqrt2$。`:m`正三角形を二等分した直角三角形の辺の比は、$30^\circ$ の向かい・$60^\circ$ の向かい・斜辺の順で $1:\sqrt3:2$。`;
 const opposite=a===60?m`\sqrt3`:"1",adjacent=a===30?m`\sqrt3`:"1",hypotenuse=a===45?m`\sqrt2`:"2";
 const raw=m`\frac{${k===1?adjacent:opposite}}{${k===2?adjacent:hypotenuse}}`;
 const rationalizer=a===45&&k!==2?m`\sqrt2`:a===30&&k===2?m`\sqrt3`:null;
 const reason=rationalizer?m`分子と分母に同じ $${rationalizer}$ を掛け、分母の根号をなくします。`:"";
 return w(m`$${"\\"+(name)}${a}^\circ$ を正確な値で表しなさい。`,m`$${"\\"+(name)}${a}^\circ=${value}$。`,a===45?"直角二等辺三角形を使い、必要な二辺を選びます。":"正三角形を二等分し、着目する角に対応する二辺を選びます。",base+m`定義の比へ入れると $${"\\"+(name)}${a}^\circ=${rationalizer||k===2?m`${raw}=${value}`:value}$。`+reason);
}
function specialDerived(angle:30|45|60,ratio:"sin"|"cos",scale:number):Worked{
 const opp=angle===30?String(scale):angle===60?m`${scale}\sqrt3`:String(scale);
 const adj=angle===60?String(scale):angle===30?m`${scale}\sqrt3`:String(scale);
 const hyp=angle===45?m`${scale}\sqrt2`:String(2*scale);
 return w(m`$\theta=${angle}^\circ$ の直角三角形で、向かい・隣・斜辺の長さは順に $${opp},${adj},${hyp}$ です。この長さから $${"\\"+(ratio)}\theta$ を求めなさい。`,m`$${"\\"+(ratio)}\theta=${specialValues[angle][ratio==="sin"?0:1]}$。`,"角の値を暗記で答えるだけでなく、指定された辺から比を作ります。",m`$${"\\"+(ratio)}\theta=\frac{${ratio==="sin"?opp:adj}}{${hyp}}=${specialValues[angle][ratio==="sin"?0:1]}$。三角形の大きさによらず同じ比です。`);
}
export const specialAngles=topic("m1-special-angles","特別な角の三角比",[
 m`直角二等辺三角形で、等しい二辺を $1$ とすると斜辺は $\sqrt{1^2+1^2}=\sqrt2$。鋭角は両方 $45^\circ$ なので、$\sin45^\circ=\cos45^\circ=\frac1{\sqrt2}=\frac{\sqrt2}{2}$、$\tan45^\circ=1$ です。`,
 m`一辺 $2$ の正三角形に高さを下ろすと、斜辺 $2$、短い辺 $1$、残る辺 $\sqrt{2^2-1^2}=\sqrt3$ の直角三角形になります。角は $30^\circ,60^\circ,90^\circ$。どちらの角に着目するかで、向かいと隣が入れ替わります。`,
 m`$\sin30^\circ=\frac12,\ \cos30^\circ=\frac{\sqrt3}{2},\ \tan30^\circ=\frac{\sqrt3}{3}$。$\sin60^\circ=\frac{\sqrt3}{2},\ \cos60^\circ=\frac12,\ \tan60^\circ=\sqrt3$。表を忘れたら、二種類の直角三角形から作り直せます。`,
],"二種類の直角三角形から、角と辺の比を結び付けます。",[
 {id:"special-ratio",title:"角から必要な比を選ぶ",why:"直角二等辺三角形か、正三角形の半分かを選びます。",sample:special(30,2),items:[special(45,0),special(60,1),special(30,0),special(60,2),special(45,2),special(30,1),special(60,0),special(45,1)]},
 {id:"derive-special",title:"与えられた辺から確かめる",why:"向かいと斜辺、または隣と斜辺を使って定義へ戻します。",sample:specialDerived(45,"sin",2),items:[specialDerived(30,"cos",2),specialDerived(60,"sin",3),specialDerived(45,"cos",3),specialDerived(30,"sin",4),specialDerived(60,"cos",2),specialDerived(45,"sin",4)]},
],[lengthPrep,ratioPrep]);
repairCases(specialAngles,"special-ratio",["1","2"]);
type SideTask={a:30|45|60;known:string;which:"hyp-to-opp"|"hyp-to-adj"|"adj-to-opp"|"opp-to-hyp";answer:string};
function sideFromAngle(t:SideTask):Worked{
 const names={"hyp-to-opp":["斜辺","向かいの辺","sin"],"hyp-to-adj":["斜辺","斜辺でない隣の辺","cos"],"adj-to-opp":["斜辺でない隣の辺","向かいの辺","tan"],"opp-to-hyp":["向かいの辺","斜辺","sin"]}[t.which];
 const ratio=specialValues[t.a][{sin:0,cos:1,tan:2}[names[2] as "sin"|"cos"|"tan"]]!;
 const knownSide=names[0]==="斜辺"?"斜辺":m`$\theta$ の${names[0]}`;
 const unknownSide=names[1]==="斜辺"?"斜辺":m`$\theta$ の${names[1]}`;
 const eq=t.which==="opp-to-hyp"?m`\frac{${t.known}}{x}=${ratio}`:m`\frac{x}{${t.known}}=${ratio}`;
 return w(m`直角三角形で $\theta=${t.a}^\circ$、${knownSide}の長さは $${t.known}$ です。${unknownSide}の長さ $x$ を求めなさい。`,m`$x=${t.answer}$。`,m`既知の辺と未知の辺を含む比は $${"\\"+(names[2])}\theta$ です。未知数が分子か分母かを確かめます。`,m`この二辺の比を表す $${"\\"+(names[2])}${t.a}^\circ$ の定義から、$${eq}$。`+(t.which==="opp-to-hyp"?m`$x>0$ なので両辺に $x$ を掛けると $${t.known}=\left(${ratio}\right)x$。正の数 $${ratio}$ で割って $x=\dfrac{${t.known}}{${ratio}}=${t.answer}$。`:m`両辺に $${t.known}$ を掛けると $x=${t.known}\times\left(${ratio}\right)=${t.answer}$。`));
}
const sideTasks:SideTask[]=[
 {a:30,known:"8",which:"hyp-to-opp",answer:"4"},{a:60,known:"10",which:"hyp-to-adj",answer:"5"},
 {a:45,known:"6",which:"adj-to-opp",answer:"6"},{a:30,known:"3",which:"opp-to-hyp",answer:"6"},
 {a:60,known:"4",which:"hyp-to-opp",answer:m`2\sqrt3`},{a:30,known:"6",which:"hyp-to-adj",answer:m`3\sqrt3`},
 {a:60,known:"2",which:"adj-to-opp",answer:m`2\sqrt3`},{a:45,known:"4",which:"opp-to-hyp",answer:m`4\sqrt2`},
];
function angleFromRatio(a:30|45|60,k:0|1|2):Worked{return w(m`$0^\circ<\theta<90^\circ$ で $${"\\"+(["sin","cos","tan"][k])}\theta=${specialValues[a][k]}$。$\theta$ を求めなさい。`,m`$\theta=${a}^\circ$。`,"鋭角の範囲で、指定された種類の比が一致する角を探します。",m`特別な角の値から $${"\\"+(["sin","cos","tan"][k])}${a}^\circ=${specialValues[a][k]}$。鋭角ではこの値に対応する角は一つなので $\theta=${a}^\circ$。`);}
export const sidesAndAngles=topic("m1-trig-sides-angles","三角比から辺・角へ",[
 m`三角比で長さを求めるときは、先に「分かっている辺」と「求める辺」を含む比を選びます。式を書いてから数を入れると、掛けるのか割るのかを判断できます。`,
 m`例えば $\sin30^\circ=\frac{x}{8}$ なら $x=8\sin30^\circ=4$。一方 $\sin30^\circ=\frac3x$ なら $\frac12=\frac3x$ より $x=6$。同じ正弦でも、未知数の位置が違います。`,
 m`角を求める場合は、比が表のどの角と一致するかを逆に探します。このページでは鋭角に限定します。鈍角まで広げたときに同じ比をもつ角があるかは、後で確かめます。`,
],"使う二辺を決めて比の式を立て、未知数の位置に合わせて解きます。",[
 {id:"side-from-angle",title:"二辺を含む比で立式",why:"斜辺を含むなら正弦か余弦、向かいと隣なら正接を使えます。",sample:sideFromAngle({a:30,known:"4",which:"opp-to-hyp",answer:"8"}),items:sideTasks.map(sideFromAngle)},
 {id:"angle-from-ratio",title:"値から鋭角を読む",why:"三角比の種類と角の範囲を固定して、表を逆向きに読みます。",sample:angleFromRatio(60,1),items:[angleFromRatio(30,0),angleFromRatio(45,2),angleFromRatio(60,0),angleFromRatio(30,1),angleFromRatio(60,2),angleFromRatio(45,1)]},
],[proportionPrep,anglePrep]);
repairCases(sidesAndAngles,"side-from-angle",["1","2","3","5","6","7","8"]);
addPair(sidesAndAngles,"trig-approximation","三角比表と近似値","角度は度数法です。電卓ではDEG（度）の設定を確認します。途中で丸め直さず、問いの指定に合わせて最後に丸めます。",[
 w(m`直角三角形で、$37^\circ$ の角に隣り合う斜辺でない辺が $12\,\mathrm{m}$ です。$\tan37^\circ\simeq0.7536$ を用い、向かいの辺を $0.1\,\mathrm{m}$ の位に四捨五入しなさい。`,m`約 $9.0\,\mathrm{m}$。`,"向かいと隣を結ぶ比を選び、百分の一の位を見て丸めます。",m`求める辺の長さを $x\,\mathrm{m}$ とします。$\frac{x}{12}=\tan37^\circ$ なので $x\simeq12\cdot0.7536=9.0432$。$0.1\,\mathrm{m}$ の位へ四捨五入して約 $9.0\,\mathrm{m}$。`),
 w(m`直角三角形で、$53^\circ$ の角の向かいの辺が $8\,\mathrm{m}$ です。$\sin53^\circ\simeq0.7986$ を用い、斜辺を $0.1\,\mathrm{m}$ の位に四捨五入しなさい。`,m`約 $10.0\,\mathrm{m}$。`,"未知の斜辺は分母に入ります。",m`求める斜辺の長さを $x\,\mathrm{m}$ とします。$\frac8x=\sin53^\circ$ なので $x\simeq\frac8{0.7986}\simeq10.0175$。指定の位に丸めて約 $10.0\,\mathrm{m}$。`),
]);
export const trigFoundationTopics=[rightTriangle,trigMeaning,specialAngles,sidesAndAngles];
