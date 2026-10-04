import {trigTopic as topic,m,w,fraction,anglePrep,ratioPrep,lengthPrep,specialValues,repairCases,appendTrigQuestion,regroupTrig,type SpecialAngle} from "./math1-trig-authoring";
import {addPair,type Worked} from "./math1-topic";
function coordinateRatio(x:number,y:number,r:number):Worked{return w(m`原点 $O$ を中心とする半径 $${r}$ の上半円上に点 $P(${x},${y})$ があります。正の横軸から $OP$ までの角を $\theta$ として、三つの三角比を求めなさい。`,m`$\sin\theta=${fraction(y,r)},\ \cos\theta=${fraction(x,r)},\ \tan\theta=${fraction(y,x)}$。`,"正弦は縦座標を半径で割り、余弦は横座標を半径で割ります。正接の分母は横座標です。",m`$\sin\theta=\frac{${y}}{${r}}=${fraction(y,r)},\ \cos\theta=\frac{${x}}{${r}}=${fraction(x,r)},\ \tan\theta=\frac{${y}}{${x}}=${fraction(y,x)}$。座標の負号を長さに置き換えて消してはいけません。`);}
function boundaryRatio(a:0|90|180,kind:0|1|2):Worked{
 const cmd=["\\sin","\\cos","\\tan"][kind],value=specialValues[a][kind],point={0:"(1,0)",90:"(0,1)",180:"(-1,0)"}[a];
 const prompt=kind===2?m`$${cmd}${a}^\circ$ は定義されますか。理由を答え、定義される場合は値も求めなさい。`:m`$${cmd}${a}^\circ$ の値を求めなさい。`;
 const answer=value===null?m`$\tan90^\circ$ は定義されません。横座標が $0$ で、$0$ で割れないためです。`:kind===2?m`定義されます。単位円上の横座標は $${a===0?1:-1}\ne0$ なので、$${cmd}${a}^\circ=${value}$。`:m`$${cmd}${a}^\circ=${value}$。`;
 return w(prompt,answer,"単位円上の点の座標へ戻ります。正接では分母がゼロでないか確かめます。",m`角 $${a}^\circ$ に対応する点は $${point}$。`+(value===null?m`$\tan\theta=\frac yx$ の分母が $0$ になります。`:kind===2?m`横座標は $0$ でないので $\tan\theta=\frac yx$ を使えて、$${cmd}${a}^\circ=${value}$。`:m`$${kind===0?"\\sin\\theta=y":"\\cos\\theta=x"}$ の定義から $${cmd}${a}^\circ=${value}$。`));
}
export const trigCoordinates=topic("m1-trig-coordinates","座標で広げる三角比",[
 m`直角三角形の鋭角だけでなく、$0^\circ\le\theta\le180^\circ$ へ広げます。原点 $O$ を中心とする半径 $r>0$ の上半円上の点を $P(x,y)$ とし、正の横軸から反時計回りに測った角を $\theta$ とします。`,
 m`$\sin\theta=\frac yr,\ \cos\theta=\frac xr$、$x\ne0$ のとき $\tan\theta=\frac yx$ と定めます。鋭角なら、垂線を下ろした直角三角形の比と一致します。半径を変えても相似により同じ値です。`,
 m`鈍角では $x<0,y>0$ なので、正弦は正、余弦と正接は負です。座標は符号をもつ数であり、辺の長さと同じではありません。`,
 m`半径 $1$ の円を単位円といいます。$0^\circ,90^\circ,180^\circ$ の点は順に $(1,0),(0,1),(-1,0)$。$\tan90^\circ$ は分母が $0$ になるので定義されません。無限大という値をもつわけではありません。`,
],"座標の符号を保ち、正接では横座標がゼロでないか確認します。",[
 {id:"coordinate-ratios",title:"座標を比へ読み替える",why:"半径は正、座標には正負があります。",sample:coordinateRatio(-3,4,5),items:[coordinateRatio(3,4,5),coordinateRatio(-4,3,5),coordinateRatio(5,12,13),coordinateRatio(-5,12,13),coordinateRatio(-8,15,17),coordinateRatio(12,5,13),coordinateRatio(-12,5,13),coordinateRatio(8,15,17)]},
 {id:"endpoint-ratios",title:"軸上の点で定義を確かめる",why:"三角形がつぶれる角でも、円の点の座標で正弦と余弦は定まります。",sample:boundaryRatio(90,0),items:[boundaryRatio(0,0),boundaryRatio(90,0),boundaryRatio(180,1),boundaryRatio(90,2),boundaryRatio(90,1),boundaryRatio(180,0),boundaryRatio(0,1),boundaryRatio(180,2),boundaryRatio(0,2)]},
],[ratioPrep,lengthPrep]);
repairCases(trigCoordinates,"coordinate-ratios",["1"]);
repairCases(trigCoordinates,"endpoint-ratios",["1","2","3","5","9"]);
function recoverCos(o:number,a:number,h:number,obtuse:boolean):Worked{
 const c=obtuse?-a:a;
 return w(m`$\sin\theta=${fraction(o,h)}$、$${obtuse?"90^\\circ<\\theta<180^\\circ":"0^\\circ<\\theta<90^\\circ"}$ です。$\cos\theta,\tan\theta$ を求めなさい。`,m`$\cos\theta=${fraction(c,h)},\ \tan\theta=${fraction(o,c)}$。`,"まず余弦の二乗を求め、指定された角の範囲から符号を選びます。",m`$\cos^2\theta=1-\left(${fraction(o,h)}\right)^2=${fraction(a*a,h*h)}$。${obtuse?"鈍角なので余弦は負":"鋭角なので余弦は正"}、よって $\cos\theta=${fraction(c,h)}$。$\cos\theta\ne0$ なので $\tan\theta=\frac{\sin\theta}{\cos\theta}=${fraction(o,c)}$。`);
}
function transform(a:30|45|60,op:"complement"|"supplement",kind:0|1|2):Worked{
 const b=(op==="complement"?90-a:180-a) as SpecialAngle,cmd=["\\sin","\\cos","\\tan"][kind],v=specialValues[b][kind]!;
 const rhs=op==="complement"?(kind===0?m`\cos${a}^\circ`:kind===1?m`\sin${a}^\circ`:m`\frac1{\tan${a}^\circ}`):(kind===0?m`\sin${a}^\circ`:kind===1?m`-\cos${a}^\circ`:m`-\tan${a}^\circ`);
 return w(m`$${cmd}(${op==="complement"?90:180}^\circ-${a}^\circ)$ を、$${a}^\circ$ の三角比を使って表し、値も求めなさい。`,m`$${cmd}(${op==="complement"?90:180}^\circ-${a}^\circ)=${rhs}=${v}$。`,op==="complement"?"二つの鋭角を入れ替えると、向かいと隣が入れ替わります。":"上半円の左右対称な点で、横座標だけが反対符号になります。",m`${op==="complement"?"余角":"補角"}の関係を使うと $${cmd}${b}^\circ=${rhs}=${v}$。`);
}
export const trigRelations=topic("m1-trig-relations","三角比の相互関係",[
 m`半径 $r$ の円上で $x^2+y^2=r^2$。両辺を $r^2$ で割ると $\cos^2\theta+\sin^2\theta=1$ です。$\sin^2\theta$ は $(\sin\theta)^2$ の略記で、$\sin(\theta^2)$ ではありません。`,
 m`$\cos\theta\ne0$ なら $\frac{\sin\theta}{\cos\theta}=\frac{y}{x}=\tan\theta$。この条件で $1+\tan^2\theta=\frac1{\cos^2\theta}$ も得られます。$\theta=90^\circ$ では使えません。`,
 m`$0^\circ<\theta<90^\circ$ で、直角三角形の二つの鋭角は和が $90^\circ$。向かいと隣が入れ替わるので $\sin(90^\circ-\theta)=\cos\theta,\ \cos(90^\circ-\theta)=\sin\theta,\ \tan(90^\circ-\theta)=\frac1{\tan\theta}$。`,
 m`上半円で角 $\theta$ と $180^\circ-\theta$ の点は左右対称です。$0^\circ\le\theta\le180^\circ$ で $\sin(180^\circ-\theta)=\sin\theta,\ \cos(180^\circ-\theta)=-\cos\theta$。$\theta\ne90^\circ$ なら $\tan(180^\circ-\theta)=-\tan\theta$。`,
 m`二乗の値から元へ戻すときには、角の範囲で符号を選びます。$\sin\theta=\frac35$ でも、鋭角なら $\cos\theta=\frac45$、鈍角なら $-\frac45$ です。`,
],"二乗から求める大きさと、角の範囲から選ぶ符号を分けます。",[
 {id:"recover-cosine",title:"二乗の関係と符号",why:"二乗だけでは正負が決まらないので、角の範囲を最後まで使います。",sample:recoverCos(3,4,5,true),items:[recoverCos(3,4,5,false),recoverCos(4,3,5,true),recoverCos(5,12,13,false),recoverCos(12,5,13,true),recoverCos(8,15,17,true),recoverCos(15,8,17,false),recoverCos(5,12,13,true),recoverCos(4,3,5,false)]},
 {id:"complement-ratio",title:"和が直角となる二つの角",why:"直角三角形の二つの鋭角を交換すると、向かいと隣が入れ替わります。",sample:transform(30,"complement",0),items:[transform(60,"complement",0),transform(30,"complement",1),transform(45,"complement",2),transform(60,"complement",2),transform(45,"complement",0),transform(30,"complement",2)]},
 {id:"supplement-ratio",title:"左右対称な点の符号",why:"横座標だけが反対符号になることを三つの定義に入れます。",sample:transform(30,"supplement",1),items:[transform(60,"supplement",0),transform(45,"supplement",1),transform(30,"supplement",2),transform(60,"supplement",2),transform(30,"supplement",0),transform(45,"supplement",2)]},
],[ratioPrep,anglePrep]);
repairCases(trigRelations,"recover-cosine",["1"]);
repairCases(trigRelations,"complement-ratio",["2","4"]);
repairCases(trigRelations,"supplement-ratio",["1","3"]);
addPair(trigRelations,"identity-domain","正接の関係を使える条件",m`$\tan\theta=\frac{\sin\theta}{\cos\theta}$ は $\cos\theta\ne0$ が条件です。式の見た目だけでなく分母を確かめます。`,[
 w(m`$\theta=90^\circ$ に $\tan\theta=\frac{\sin\theta}{\cos\theta}$ を使って正接の値を求められますか。理由も答えなさい。`,m`求められません。$\cos90^\circ=0$ で、右辺も正接も定義されません。`,"分母に来る値を確かめます。",m`$\sin90^\circ=1,\cos90^\circ=0$。$0$ で割ることはできないので適用できません。`),
 w(m`$\theta=180^\circ$ に $\tan\theta=\frac{\sin\theta}{\cos\theta}$ を使えますか。使えるなら値も答えなさい。`,m`使えます。$\cos180^\circ=-1\ne0$ なので $\tan180^\circ=0$。`,"三角形の内角かどうかではなく、この恒等式の条件を確かめます。",m`$\frac{\sin180^\circ}{\cos180^\circ}=\frac0{-1}=0$。`),
]);
function sineAngles(a:0|30|45|60|90,domain:"closed"|"interior"|"obtuse"):Worked{
 const candidates=[a,180-a].filter((v,i,arr)=>arr.indexOf(v)===i).filter(v=>domain==="closed"||domain==="interior"&&v>0&&v<180||domain==="obtuse"&&v>90&&v<180);
 const range=domain==="closed"?m`0^\circ\le\theta\le180^\circ`:domain==="interior"?m`0^\circ<\theta<180^\circ`:m`90^\circ<\theta<180^\circ`;
 return w(m`$${range}$ で $\sin\theta=${specialValues[a][0]}$ を満たす $\theta$ をすべて求めなさい。`,candidates.length?m`$\theta=${candidates.map(v=>`${v}^\\circ`).join(",")}$。`:"該当する角はありません。","半径1の単位円上で同じ高さの点を探し、指定範囲と重複を確認します。",(a===90?m`単位円で $y=1$ となる点は $x^2+1=1$ より $(0,1)$ だけです。したがって候補は $90^\circ$ だけです。`:a===0?m`単位円で $y=0$ となる点は $(1,0),(-1,0)$ の二つだけなので、候補は $0^\circ,180^\circ$ です。`:m`半径1の単位円で $${a}^\circ$ と $${180-a}^\circ$ の異なる二点は同じ高さです。水平線と円の交点は高々二つなので、これらが全候補です。`)+m`範囲 $${range}$ を満たすものだけを残します。`);
}
function cosineAngle(a:SpecialAngle):Worked{return w(m`$0^\circ\le\theta\le180^\circ$ で $\cos\theta=${specialValues[a][1]}$ を満たす角をすべて求めなさい。`,m`$\theta=${a}^\circ$。`,"単位円では余弦は横座標です。同じ高さの点を探す正弦とは区別します。",m`上半円では横座標が $1$ から $-1$ へ一方向に減るので、指定の横座標の点は一つ。$\cos${a}^\circ=${specialValues[a][1]}$ より答えは $${a}^\circ$ だけです。`);}
export const equalSines=topic("m1-equal-sines","同じ正弦をもつ角",[
 m`$\sin30^\circ=\sin150^\circ=\frac12$。半径1の単位円では正弦は高さなので、上半円の左右二点が同じ値をもちます。三角比の値が分かっても、角がただ一つに決まるとは限りません。`,
 m`$0^\circ\le\theta\le180^\circ$ で $0<s<1$ に対する $\sin\theta=s$ は、鋭角 $\alpha$ と鈍角 $180^\circ-\alpha$ が二つの解です。水平線と上半円の交点が二つあることから、ほかに解がないと分かります。`,
 m`$\sin\theta=1$ は頂点の $90^\circ$ だけ。$\sin\theta=0$ は両端の $0^\circ,180^\circ$ です。三角形の内角では両端を含まないので、範囲を必ず確かめます。`,
 m`半径1の単位円では余弦は横座標です。上半円上で同じ横座標の点は一つなので、正弦と同じように補角を追加してはいけません。`,
],"値から候補を出し、角の範囲と重複を確かめます。",[
 {id:"sine-all-angles",title:"同じ高さの点をすべて拾う",why:"半径1の単位円で左右の候補を出し、指定範囲の外にある角と重複を除きます。",sample:sineAngles(30,"closed"),items:[sineAngles(45,"closed"),sineAngles(60,"interior"),sineAngles(30,"obtuse"),sineAngles(90,"closed"),sineAngles(0,"closed"),sineAngles(0,"interior"),sineAngles(45,"obtuse"),sineAngles(60,"closed")]},
 {id:"cosine-unique",title:"横座標から一つの角を決める",why:"半径1の単位円で余弦の符号と横座標の位置に注目します。",sample:cosineAngle(120),items:[cosineAngle(60),cosineAngle(135),cosineAngle(90),cosineAngle(180),cosineAngle(150),cosineAngle(0),cosineAngle(30),cosineAngle(45)]},
],[anglePrep,ratioPrep]);
repairCases(equalSines,"sine-all-angles",["3","4","5","6"]);
export const trigExtensionTopics=[trigCoordinates,trigRelations,equalSines];
regroupTrig(trigCoordinates,["endpoint-ratios-4","endpoint-ratios-8","endpoint-ratios-9"],"endpoint-tangent-domain","正接の分母を確かめる",m`単位円上で $\tan\theta=\frac yx$ を使うには $x\ne0$ が必要です。軸上でも、定義される場合とされない場合を分けます。`);
appendTrigQuestion(equalSines,"unit-sine-angle","extra-1",w(m`単位円の上半分で、縦座標が $1$ になる点はどこですか。正の横軸から測る角 $\theta$（$0^\circ\le\theta\le180^\circ$）もすべて答えなさい。`,m`点 $(0,1)$ のみで、$\theta=90^\circ$ のみです。`,"円の式に縦座標を代入し、横座標が何通りあるか確かめます。",m`$x^2+1^2=1$ より $x=0$。したがって上半円の頂点一つだけで、角も $90^\circ$ のみです。`));
regroupTrig(equalSines,["sine-all-angles-4","unit-sine-angle-extra-1"],"unit-sine-angle","正弦が1となる点は一つ",m`半径1の単位円で高さ $1$ の点は頂点 $(0,1)$ だけです。二つの異なる候補を探す必要はありません。`);
regroupTrig(equalSines,["sine-all-angles-5","sine-all-angles-6"],"zero-sine-endpoints","正弦が0となる端点と角の範囲",m`単位円で高さ $0$ の点は $(1,0),(-1,0)$。候補 $0^\circ,180^\circ$ を指定された範囲に含むかを調べます。内角のように両端を除く範囲では解がありません。`);
addPair(trigRelations,"recover-sine","余弦から正弦を求める",m`$0^\circ<\theta<180^\circ$ では正弦は正です。$\sin^2\theta=1-\cos^2\theta$ から正の平方根を選びます。余弦が負でも二乗は正です。`,[
 w(m`$0^\circ<\theta<180^\circ$、$\cos\theta=-\frac35$ のとき、$\sin\theta$ を求めなさい。`,m`$\sin\theta=\frac45$。`,"余弦の負号も含めて二乗してから、正弦の符号を決めます。",m`$\sin^2\theta=1-\left(-\frac35\right)^2=\frac{16}{25}$。$0^\circ<\theta<180^\circ$ では、上半円上の点の縦座標は正なので $\sin\theta=\frac45$。`),
 w(m`$0^\circ<\theta<180^\circ$、$\cos\theta=\frac5{13}$ のとき、$\sin\theta$ を求めなさい。`,m`$\sin\theta=\frac{12}{13}$。`,"正弦の二乗を求め、角の範囲から正の根を選びます。",m`$\sin^2\theta=1-\frac{25}{169}=\frac{144}{169}$。正弦は正なので $\sin\theta=\frac{12}{13}$。`),
]);
addPair(trigRelations,"tangent-squared","正接から余弦の二乗へ",m`$\cos\theta\ne0$ で $\sin^2\theta+\cos^2\theta=1$ を $\cos^2\theta$ で割ると、$1+\tan^2\theta=\frac1{\cos^2\theta}$。したがって $\cos^2\theta=\frac1{1+\tan^2\theta}$ です。`,[
 w(m`$0^\circ<\theta<90^\circ$、$\tan\theta=2$ のとき、$\cos^2\theta$ を求めなさい。`,m`$\cos^2\theta=\frac15$。`,"求めるのは余弦そのものではなく二乗です。逆数の関係を整理します。",m`鋭角なので $\cos\theta\ne0$。$1+\tan^2\theta=1+4=5=\frac1{\cos^2\theta}$ から $\cos^2\theta=\frac15$。`),
 w(m`$90^\circ<\theta<180^\circ$、$\tan\theta=-3$ のとき、$\cos^2\theta$ を求めなさい。`,m`$\cos^2\theta=\frac1{10}$。`,"正接が負でも、その二乗は正です。",m`鈍角なので $\cos\theta\ne0$。$1+(-3)^2=10=\frac1{\cos^2\theta}$ より $\cos^2\theta=\frac1{10}$。余弦自体が負であることと、その二乗が正であることを区別します。`),
]);
