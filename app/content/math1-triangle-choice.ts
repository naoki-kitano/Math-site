import {trigTopic as topic,m,w,anglePrep,proportionPrep,repairCases,appendTrigQuestion,regroupTrig} from "./math1-trig-authoring";
import {addPair,type Worked} from "./math1-topic";
const methodTasks:Worked[]=[
 w(m`三角形 $ABC$ で $A=30^\circ,B=60^\circ,a=2$。$b$ を求め、使った方法と理由も答えなさい。`,m`正弦定理を使います。辺と対角の既知の組 $a,A$ があるからです。$b=2\sqrt3$。`,m`辺 $a$ と角 $A$ の組を、辺 $b$ と角 $B$ へ結び付けます。`,m`$\frac b{\sin60^\circ}=\frac2{\sin30^\circ}$。$b=2\sqrt3$。正しい別の方法でも構いません。`),
 w(m`三角形 $ABC$ で $b=3,c=4,A=90^\circ$。$a$ を求め、使った方法と理由も答えなさい。`,m`三平方の定理を使います。二辺にはさまれる角が直角だからです。$a=5$。`,"直角があるときは、その向かいの辺を確認します。",m`$a^2=3^2+4^2=25$、$a>0$ より $a=5$。余弦定理でも $\cos90^\circ=0$ となり同じです。`),
 w(m`三角形 $ABC$ で $b=2,c=3,A=60^\circ$。$a$ を求め、使った方法と理由も答えなさい。`,m`余弦定理を使います。二辺とはさむ角が分かっているからです。$a=\sqrt7$。`,"既知の角が、与えられた二辺の間にあることを確かめます。",m`$a^2=2^2+3^2-2\cdot2\cdot3\cos60^\circ=7$。正の根をとり $a=\sqrt7$。`),
 w(m`三角形 $ABC$ で $a=4,b=4,c=4$。$A$ を求め、使った方法と理由も答えなさい。`,m`三辺が等しいので正三角形の性質を使い、$A=60^\circ$。三辺が既知なので余弦定理を使っても求められます。`,"三辺の関係に注目します。定理名を選ぶ前に簡単な性質で分かるかも確かめます。",m`三内角は等しく、和が $180^\circ$ なので各 $60^\circ$。余弦定理でも $\cos A=\frac{16+16-16}{32}=\frac12$。`),
 w(m`三角形 $ABC$ で $A=45^\circ,C=90^\circ,c=6$。$a$ を求め、使った方法と理由も答えなさい。`,m`直角三角形の正弦の定義を使います。斜辺 $c$ と角 $A$ が分かるからです。$a=3\sqrt2$。正弦定理でも求められます。`,"直角の向かいが斜辺です。",m`$\sin45^\circ=\frac a6$ より $a=6\cdot\frac{\sqrt2}{2}=3\sqrt2$。`),
 w(m`三角形 $ABC$ で $a=7,b=5,c=3$。$A$ が鋭角・直角・鈍角のどれかを判定し、方法と理由を答えなさい。`,m`余弦定理を使います。三辺から余弦の符号を調べられるからです。$\cos A=-\frac12$ より鈍角です。`,"角度そのものではなく余弦の符号で判断できます。",m`$\cos A=\frac{25+9-49}{30}=-\frac12<0$。内角の範囲で余弦が負なので鈍角です。`),
 w(m`三角形 $ABC$ で $A=30^\circ,B=120^\circ,a=3$。$b$ を求め、方法と理由を答えなさい。`,m`正弦定理を使います。対辺と角の組 $a,A$ が既知だからです。$b=3\sqrt3$。`,"鈍角でも正弦定理の対辺と角の対応は変わりません。",m`$b=\frac{3\sin120^\circ}{\sin30^\circ}=3\sqrt3$。`),
 w(m`三角形 $ABC$ で $b=2,c=2,A=120^\circ$。$a$ を求め、方法と理由を答えなさい。`,m`余弦定理を使います。二辺とはさむ角が既知だからです。$a=2\sqrt3$。`,"鈍角の余弦の負号を保ちます。",m`$a^2=4+4-8\left(-\frac12\right)=12$。$a>0$ なので $a=2\sqrt3$。`),
];
const choiceReasons=[
 "辺と対角の既知の組があるので正弦定理を選びます。",
 "二辺にはさまれる角が直角なので三平方の定理を選びます。",
 "二辺とはさむ角が分かっているので余弦定理を選びます。",
 "三辺が等しいので正三角形の性質を選びます。",
 "直角三角形の斜辺と角が分かっているので正弦の定義を選びます。",
 "三辺から角の余弦を計算できるので余弦定理を選びます。",
 "既知の辺と対角の組があり、別の角も分かるので正弦定理を選びます。",
 "二辺とはさむ鈍角が分かっているので余弦定理を選びます。",
];
methodTasks.forEach((q,i)=>{q[3]=choiceReasons[i]+q[3];});
export const ssaCases=[
 {A:30,a:"1",b:m`\sqrt2`,s:m`\frac{\sqrt2}{2}`,candidates:[45,135]},
 {A:30,a:"2",b:m`2\sqrt3`,s:m`\frac{\sqrt3}{2}`,candidates:[60,120]},
 {A:60,a:m`\sqrt3`,b:"1",s:m`\frac12`,candidates:[30,150]},
 {A:120,a:m`2\sqrt3`,b:"2",s:m`\frac12`,candidates:[30,150]},
 {A:30,a:"3",b:"6",s:"1",candidates:[90]},
 {A:45,a:m`\sqrt2`,b:"2",s:"1",candidates:[90]},
 {A:30,a:"4",b:m`4\sqrt2`,s:m`\frac{\sqrt2}{2}`,candidates:[45,135]},
 {A:60,a:m`3\sqrt3`,b:"3",s:m`\frac12`,candidates:[30,150]},
];
function ssa(t:typeof ssaCases[number]):Worked{
 const valid=t.candidates.filter(B=>t.A+B<180),angles=valid.map(B=>m`$(B,C)=(${B}^\circ,${180-t.A-B}^\circ)$`).join("、");
 return w(m`三角形 $ABC$ で $A=${t.A}^\circ,a=${t.a},b=${t.b}$。可能な角 $B,C$ の組をすべて求めなさい。`,`${angles}。${valid.length} 通りです。`,t.candidates.length===1?m`正弦定理で $\sin B$ を求めます。値が $1$ なら候補は直角一つで、残る角が正かを調べます。`:m`正弦定理で $\sin B$ を求め、鋭角と鈍角の候補の両方で $A+B<180^\circ$ を調べます。`,m`$\sin B=\frac{b\sin A}{a}=${t.s}$。候補は $B=${t.candidates.map(B=>`${B}^\\circ`).join(",")}$。`+t.candidates.map(B=>m`$B=${B}^\circ$ なら $C=180^\circ-${t.A}^\circ-${B}^\circ=${180-t.A-B}^\circ$ なので${t.A+B<180?"採用":"不採用"}。`).join("")+"残る組は辺の比と内角の条件を満たします。");
}
export const triangleChoice=topic("m1-triangle-choice","定理の選択と三角形の決定",[
 m`まず分かっている辺と角を図へ入れます。辺とその対角の一組があれば正弦定理、二辺とはさむ角なら余弦定理、三辺から角を求めるなら余弦定理が使えます。直角や正三角形なら、より簡単な定義・性質も使えます。`,
 m`二辺と一角が分かっていても、その角が二辺にはさまれていなければ、三角形が一つに決まるとは限りません。$\sin B$ を計算してから、$B$ の候補と $A+B<180^\circ$ を調べます。`,
 m`例えば $A=30^\circ,a=1,b=\sqrt2$ なら $\sin B=\frac{\sqrt2}{2}$。$B=45^\circ,135^\circ$ のどちらも角の和が $180^\circ$ 未満なので、二つの三角形ができます。見た目で鋭角だけを選んではいけません。`,
 m`辺の長さは正で、最長辺は他の二辺の和より短い必要があります。また正弦の値は $-1$ 以上 $1$ 以下です。計算で $\sin B>1$ が出たら、その条件の三角形は存在しません。`,
],"既知の情報に合う方法を選び、できる三角形が一つとは限らないことも確かめます。",[
 {id:"choose-triangle-method",title:"条件から方法を選ぶ",why:"使える式と、なぜ使えるのかを条件に結び付けます。",sample:methodTasks[0],items:methodTasks},
 {id:"ssa-candidates",title:"二つの角の候補を検討",why:"正弦からの候補を列挙し、残る内角が正になるものを採用します。",sample:ssa(ssaCases[0]),items:ssaCases.map(ssa)},
],[anglePrep,proportionPrep]);
repairCases(triangleChoice,"choose-triangle-method",["2","3","4","5","6"]);
repairCases(triangleChoice,"ssa-candidates",["3","4","5"]);
regroupTrig(triangleChoice,["ssa-candidates-5","ssa-candidates-6"],"ssa-right-candidate","正弦が1なら角の候補は直角一つ",m`$\sin B=1$ の場合、単位円の上端に対応する角 $B=90^\circ$ だけを候補にします。残る内角 $C$ が正であることも確認します。`);
addPair(triangleChoice,"ssa-impossible","正弦の値から存在を判断",m`三角形の内角の正弦は $0$ より大きく $1$ 以下です。この範囲を超えたら、別の角を探す前に不成立と判断できます。`,[
 w(m`$A=30^\circ,a=1,b=3$ の三角形 $ABC$ は存在しますか。理由も答えなさい。`,m`存在しません。正弦定理では $\sin B=\frac32>1$ となるからです。`,"計算した正弦の値が取り得る範囲に入るか調べます。",m`$\sin B=\frac{3\sin30^\circ}{1}=\frac32$。正弦は $1$ を超えないため条件は両立しません。`),
 w(m`$A=30^\circ,a=2,b=5$ の三角形 $ABC$ は存在しますか。理由も答えなさい。`,m`存在しません。$\sin B=\frac54>1$ となるからです。`,"辺と対角の既知の組から、もう一つの角の正弦を調べます。",m`$\sin B=\frac{5\sin30^\circ}{2}=\frac54$。内角の正弦として不可能です。`),
]);
addPair(triangleChoice,"triangle-length-condition","三辺が三角形を作れるか","三辺が正なら、最長辺が他の二辺の和より短いかを調べます。等号では一直線になり、三角形にはなりません。",[
 w(m`長さ $2,3,5$ の三辺で三角形を作れますか。理由も答えなさい。`,m`作れません。最長辺 $5$ が他の二辺の和 $2+3$ と等しく、一直線につぶれるからです。`,"最長辺と他の二辺の和を比較します。",m`$5=2+3$ で、必要な厳密不等式 $5<2+3$ を満たしません。`),
 w(m`長さ $3,4,6$ の三辺で三角形を作れますか。理由も答えなさい。`,m`作れます。三辺は正で、最長辺について $6<3+4$ を満たすからです。`,"最も長い辺を先に決めます。",m`$6<7$ なので三角形の成立条件を満たします。`),
]);
appendTrigQuestion(triangleChoice,"ssa-impossible","possible-1",w(m`$A=30^\circ,a=1,b=2$ の三角形 $ABC$ は存在しますか。理由も答えなさい。`,m`存在します。$\sin B=1$ より $B=90^\circ$、$C=60^\circ>0^\circ$ となるからです。`,"正弦の範囲内であれば、角の候補と内角の和まで確かめます。",m`$\sin B=\frac{2\sin30^\circ}{1}=1$。候補 $B=90^\circ$ のとき $C=180^\circ-30^\circ-90^\circ=60^\circ$。三内角と辺の比が条件を満たすので存在します。`));
const sineExistence=triangleChoice.lesson.supplements.find(s=>s.id==="ssa-impossible")!;
appendTrigQuestion(triangleChoice,"ssa-impossible","possible-2",w(m`$A=30^\circ,a=b=2$ の三角形 $ABC$ は存在しますか。理由も答えなさい。`,m`存在します。$B=30^\circ,C=120^\circ$ が内角の条件と辺の比を満たすからです。`,"正弦の範囲内でも、内角の条件による確認を続けます。",m`$\sin B=\frac{2\sin30^\circ}{2}=\frac12$。$B=30^\circ$ なら $C=120^\circ$ で採用。もう一つの候補 $B=150^\circ$ は $C=0^\circ$ となり不採用です。`));
sineExistence.title="正弦の範囲と三角形の存在";
sineExistence.text+=m`正弦が範囲内に入るだけでは十分ではなく、角の候補から残る内角が正になるものがあるかも調べます。`;
repairCases(triangleChoice,"ssa-impossible",["possible-1","possible-2"]);
// Prefer a valid candidate as the alternate for the two out-of-range tasks.
triangleChoice.exercises.find(e=>e.id==="m1-triangle-choice-ssa-impossible-extra-2-v1")!.stage="practice";
addPair(triangleChoice,"ssa-angle-feasibility","角の条件で存在を確かめる",m`正弦が取り得る範囲内でも、三角形が存在するとは限りません。候補ごとに $C=180^\circ-A-B>0^\circ$ を調べます。`,[
 w(m`$A=120^\circ,a=b=1$ の三角形 $ABC$ は存在しますか。理由も答えなさい。`,m`存在しません。$B=60^\circ,120^\circ$ のどちらでも $C$ が正にならないからです。`,"正弦の値から候補を出し、残る内角が正かを一つずつ確かめます。",m`$\sin B=\frac{1\sin120^\circ}{1}=\frac{\sqrt3}{2}$。$B=60^\circ$ なら $C=0^\circ$、$B=120^\circ$ なら $C=-60^\circ$。どちらも内角として認められません。`),
 w(m`$A=120^\circ,a=\sqrt3,b=1$ の三角形 $ABC$ は存在しますか。理由も答えなさい。`,m`存在します。候補のうち $B=30^\circ,C=30^\circ$ が内角の条件を満たすからです。`,"鈍角の候補も出したうえで、残る角を確かめます。",m`$\sin B=\frac{\sin120^\circ}{\sqrt3}=\frac12$。$B=30^\circ$ なら $C=30^\circ>0^\circ$ で採用。$B=150^\circ$ なら $C=-90^\circ$ で不採用。一つ成立する組があるので存在します。`),
]);
