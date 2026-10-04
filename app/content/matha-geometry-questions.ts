import {m,q,f,gcd,skill} from "./matha-authoring";
import type {Q} from "./matha-authoring";
import {root} from "./math1-trig-authoring";
const rootCalculation=(n:number)=>{const raw=m`\sqrt{${n}}`,value=root(n);return raw===value?value:m`${raw}=${value}`;};
export const geoAudit:{q:Q;kind:string;args:number[]}[]=[];
const checked=(x:Q,kind:string,args:number[])=>{x.model={kind,args};geoAudit.push({q:x,kind,args});return x;};
export function angle(a:number,b:number):Q{return checked(q(m`三角形 $ABC$ で $\angle A=${a}^\circ,\angle B=${b}^\circ$。$\angle C$ と理由を答えなさい。`,m`$${180-a-b}^\circ$。三角形の内角の和は $180^\circ$ だからです。`,"分かっている二角の和を、内角の和から引きます。",m`$\angle C=180^\circ-(${a}^\circ+${b}^\circ)=${180-a-b}^\circ$。`,180-a-b),"angle",[a,b]);}
export function crossing(a:number):Q{return q(m`交わる二直線の一つの角が $${a}^\circ$ です。その対頂角と、それに隣り合う角を求め、理由も書きなさい。`,m`対頂角 $${a}^\circ$、隣の角 $${180-a}^\circ$。対頂角は等しく、一直線の角は $180^\circ$ です。`,"隣の角との和が平角になることを使います。",m`隣角は $180^\circ-${a}^\circ=${180-a}^\circ$。元の角と向かい合う角も、その隣角の補角なので $${a}^\circ$ になり、対頂角が等しいと分かります。`);}
export function similar(a:number,b:number,c:number):Q{return checked(q(m`$\triangle ABC\sim\triangle DEF$ で $AB=${a},BC=${b},DE=${c}$。$EF$ を求め、対応する辺も答えなさい。`,m`$AB$ と $DE$、$BC$ と $EF$ が対応し、$EF=${f(b*c,a)}$。`,"相似を表す頂点の順序を、同じ位置どうしで対応させます。",m`$A,B,C$ は順に $D,E,F$ に対応します。倍率は $\frac{DE}{AB}=\frac{${c}}{${a}}$。$EF=${b}\times\frac{${c}}{${a}}=${f(b*c,a)}$。`,b*c/a),"similar",[a,b,c]);}
export function congruence(a:number,b:number,angleGiven:boolean):Q{
 return q(m`二つの三角形で、それぞれ対応する二辺が $${a}$ と $${b}$ です。${angleGiven?"その二辺の間の角も等しいと分かっています。":"角については何も分かっていません。"}合同といえますか。理由も答えなさい。`,
 angleGiven?"いえます。二組の辺とその間の角がそれぞれ等しいからです。":"いえません。二辺が同じでも、その間の角を変えると三つ目の辺が変わるからです。",
 "三角形の形を一つに決めるための条件がそろっているか確かめます。",
 angleGiven?"二辺の長さと、それらを開く角が決まると、残る頂点の位置が定まります。これは二辺とその間の角による合同条件です。":"同じ二本の棒を小さく開く場合と大きく開く場合を考えると、両端の距離は異なります。二辺だけでは合同条件を満たしません。");
}
export function parallel(a:number,b:number,c:number):Q{return checked(q(m`三角形 $ABC$ の辺 $AB,AC$ の内部に $D,E$ を取り、$DE\parallel BC$ とします。$AD=${a},DB=${b},AC=${c}$ のとき $AE$ を求めなさい。`,m`$AE=${f(a*c,a+b)}$。`,"相似な三角形の、頂点から測った全体と部分を対応させます。",m`平行線の同位角と共通角から $\triangle ADE\sim\triangle ABC$。$AB=${a}+${b}=${a+b}$ なので $\frac{AE}{${c}}=\frac{${a}}{${a+b}}$。したがって $AE=${f(a*c,a+b)}$。`,a*c/(a+b)),"parallel",[a,b,c]);}
export function partRatio(a:number,b:number,parallelGiven=true):Q{return q(m`三角形 $ABC$ で $D,E$ はそれぞれ辺 $AB,AC$ の内部、$AD:DB=${a}:${b}$ です。${parallelGiven?"$DE\\parallel BC$ が分かっています。":"平行であるかは分かりません。"}$AE:EC$ と $AE:AC$ を決められますか。理由も書きなさい。`,
 parallelGiven?m`$AE:EC=${a}:${b}$、$AE:AC=${a}:${a+b}$。平行線から相似が成り立つからです。`:"決められません。平行など、二つの三角形を相似とする条件が不足しています。",
 "部分どうしの比か、部分と全体の比かを区別します。平行条件も確認します。",
 parallelGiven?m`相似から $\frac{AE}{AC}=\frac{AD}{AB}=\frac{${a}}{${a+b}}$。残り $EC$ の比は $${b}$ なので、部分どうしは $${a}:${b}$。`:"$AD:DB$ で点 $D$ が決まっても、点 $E$ は辺 $AC$ 上で動かせます。したがって $AE:EC$ と $AE:AC$ は一つに決まりません。");}
export function areaRatio(a:number,b:number,similarity=false):Q{return checked(q(similarity?m`二つの相似な三角形の対応する辺の比は $${a}:${b}$ です。面積比と理由を答えなさい。`:m`三角形 $ABC$ の辺 $BC$ 上に $D$ を取り、$BD:DC=${a}:${b}$ とします。$\triangle ABD$ と $\triangle ADC$ の面積比と理由を答えなさい。`,
 similarity?m`$${a*a}:${b*b}$。底辺も高さも同じ相似比で変わるからです。`:m`$${a}:${b}$。同じ直線 $BC$ への高さが共通だからです。`,
 similarity?"面積では、底辺と高さの両方が何倍になるか考えます。":"二つの三角形の高さを、同じ頂点から同じ直線へ下ろします。",
 similarity?m`底辺比も高さ比も $${a}:${b}$。面積の $\frac12$ は共通なので、比は $${a}\times${a}:${b}\times${b}=${a*a}:${b*b}$。`:m`共通の高さを $h$ とすると面積比は $\frac12 BDh:\frac12 DCh=BD:DC=${a}:${b}$。高さの足が辺の延長上でも同じです。`,similarity?a*a/(b*b):a/b),"area",[a,b,+similarity]);}
export function triangleExists(a:number,b:number,c:number):Q{
 const exists=a+b>c;
 return checked(q(m`長さ $${a},${b},${c}$ の三辺で三角形を作れますか。理由も答えなさい。`,exists?m`作れます。短い二辺の和 $${a+b}$ が最長辺 $${c}$ より大きいからです。`:m`作れません。短い二辺の和 $${a+b}$ が最長辺 $${c}$ 以下だからです。`,
 "正の三辺を長さ順にし、短い二辺の和と最長辺を比べます。",
 m`$${a}+${b}=${a+b}$ と $${c}$ を比べます。`+(a+b===c?"等しい場合は一直線になり、三角形ではありません。":exists?"他の二つの和も、それぞれ残る辺より大きいので成立します。":"二辺をつないでも、最長辺の両端に届きません。"),+exists),"exists",[a,b,c]);
}
export function opposite(a:number,b:number,c:number):Q{
 const names=["C","A","B"],v=[a,b,c],max=Math.max(...v),big=names[v.indexOf(max)];
 return q(m`三角形 $ABC$ で $AB=${a},BC=${b},CA=${c}$ です。最大の角と、その判断の理由を答えなさい。`,m`$\angle ${big}$。最長辺の向かいの角だからです。`,
 "角をつくる二辺ではなく、その角の向かいにある辺を探します。",
 m`最長辺は $${["AB","BC","CA"][v.indexOf(max)]}=${max}$。三角形では長い辺の向かいの角ほど大きいので、$\angle ${big}$ が最大です。`);
}
export function bisector(a:number,b:number,c:number,external=false):Q{
 if(!(a+b>c&&a+c>b&&b+c>a)||external&&b<=a)throw Error("Invalid bisector triangle");
 const d=external?b-a:a+b,x=a*c/d,y=b*c/d;
 return checked(q(m`三角形 $ABC$ で $AB=${a},AC=${b},BC=${c}$。$A$ の${external?"外角":"内角"}の二等分線が${external?"直線":"辺"} $BC$ と交わる点を $${external?"E":"D"}$ とします。${external?"点は $B$ 側の延長上です。$BE,CE$":"$BD,DC$"} を求めなさい。`,
 external?m`$BE=${f(a*c,d)},CE=${f(b*c,d)}$。`:m`$BD=${f(a*c,d)},DC=${f(b*c,d)}$。`,
 external?"まず $BE:CE=AB:AC$ を書き、点 $E$ が $B$ 側なので $CE-BE=BC$ を使います。":"まず $BD:DC=AB:AC$ を書き、$BD+DC=BC$ を使います。",
 external?m`外角の二等分線より $BE:CE=${a}:${b}$。$CE-BE=${c}$ なので、比の差 $${b-a}$ が $${c}$ に対応します。よって $BE=${f(a*c,d)},CE=${f(b*c,d)}$。`:
 m`内角の二等分線より $BD:DC=AB:AC=${a}:${b}$。和 $BC=${c}$ を比の和 $${a+b}$ で分けて、$BD=${f(a*c,d)},DC=${f(b*c,d)}$。`,x/y),"bisector",[a,b,c,+external]);
}
export function centroid(n:number,part=false):Q{return q(m`三角形 $ABC$ の重心を $G$、辺 $BC$ の中点を $D$ とします。$${part?"GD":"AD"}=${n}$ のとき、$AG$ と $${part?"AD":"GD"}$ を求めなさい。`,
 part?m`$AG=${2*n},AD=${3*n}$。`:m`$AG=${f(2*n,3)},GD=${f(n,3)}$。`,
 "中線を頂点側から二対一に分けます。",
 part?m`$AG:GD=2:1$ なので $AG=2\times${n}=${2*n}$。全体は $AD=${2*n}+${n}=${3*n}$。`:m`$AG:GD=2:1$ なので $AG=\frac23\times${n}=${f(2*n,3)},GD=\frac13\times${n}=${f(n,3)}$。`);}
export function center(n:number,kind:"in"|"out"|"right"):Q{
 return q(kind==="in"?m`三角形の内心 $I$ から一辺に下ろした垂線の長さが $${n}$ です。他の二辺までの距離を求め、距離を測る方向も答えなさい。`:kind==="out"?m`三角形 $ABC$ の外心 $O$ について $OA=${n}$ です。$OB,OC$ と理由を答えなさい。`:m`直角三角形の斜辺の長さは $${n}$ です。外接円の中心の位置と半径を答えなさい。`,
 kind==="in"?m`どちらも $${n}$。辺に垂直に測ります。`:kind==="out"?m`$OB=OC=${n}$。外心は三頂点から等距離だからです。`:m`斜辺の中点が中心で、半径は $${f(n,2)}$。`,
 kind==="in"?"辺への距離は、点からその直線に下ろす垂線の長さです。":kind==="out"?"外接円の半径を三頂点へ引きます。":"円周角の定理の逆を使い、斜辺を直径とする円を考えます。",
 kind==="in"?"角の二等分線上の点から二辺に下ろす垂線では、斜辺が共通で一つの鋭角が等しい直角三角形が合同になります。よって二辺への垂線の長さは等しい。内心は二つの二等分線の交点なので、三辺への距離が等しくなります。":
 kind==="out"?m`外心は各辺の垂直二等分線上にあり、両端から等距離です。したがって $OA=OB=OC=${n}$。`:
 m`円周角の定理の逆より、直角の頂点は斜辺を直径とする円上にあります。したがって中心は斜辺の中点で、半径は $\frac{${n}}2=${f(n,2)}$。`);
}
export function cevian(a:number,b:number,c:number,d:number,menelaus=false):Q{
 const num=b*d,den=a*c,g=gcd(num,den);
 if(menelaus&&num<=den)throw Error("Impossible outer point");
 return checked(q(m`三角形 $ABC$ で、$D$ は辺 $BC$ の内部、$E$ は辺 $CA$ の内部です。${menelaus?"$F$ は辺 $AB$ の $B$ 側の延長上で、$D,E,F$ は一直線上にあります。":"$F$ は辺 $AB$ の内部で、$AD,BE,CF$ が一点で交わります。"}$BD:DC=${a}:${b},CE:EA=${c}:${d}$ のとき $AF:FB$ を求めなさい。`,
 m`$AF:FB=${num/g}:${den/g}$。`,"辺を巡る順序で比を書き、求める比以外を先に代入します。",
 m`${menelaus?"メネラウス":"チェバ"}の定理より $\frac{BD}{DC}\frac{CE}{EA}\frac{AF}{FB}=1$。したがって $\frac{AF}{FB}=\frac{${b}\times${d}}{${a}\times${c}}=${f(num,den)}$。`+(menelaus?"外点なので、全体の線分が部分の線分より長いこととも一致します。":""),num/den),"cevian",[a,b,c,d,+menelaus]);
}
export function converse(a:number,b:number,menelaus=false,valid=true):Q{
 const r=valid?a*b:a*b+1;
 return q(m`三角形 $ABC$ で $D,E$ は辺 $BC,CA$ の内部、$F$ は${menelaus?"$AB$ の $B$ 側の延長上":"辺 $AB$ の内部"}にあります。$BD:DC=1:${a},CE:EA=1:${b},AF:FB=${r}:1$ です。${menelaus?"三点 $D,E,F$ が一直線上にある":"三線 $AD,BE,CF$ が一点で交わる"}といえますか。理由を答えなさい。`,
 valid?`いえます。比の積が一で、配置の条件も満たすため、${menelaus?"メネラウス":"チェバ"}の定理の逆を使えます。`:`いえません。もし${menelaus?"一直線上にある":"一点で交わる"}なら比の積は一になりますが、この比では一ではありません。`,
 "定理を使うのか、比から結論を出す逆を使うのかを区別します。",
 m`比の積は $\frac1{${a}}\times\frac1{${b}}\times${r}=${f(r,a*b)}$。`+(valid?`${menelaus?"メネラウス":"チェバ"}の逆の条件がそろうので結論できます。`:"一ではないので、定理の必要条件に反します。"));
}
export function circleAngle(a:number,opposite=false):Q{return q(opposite?m`同じ円周上の点 $C,D$ が、弦 $AB$ を含む直線の反対側にあります。四点は異なります。$\angle ACB=${a}^\circ$ のとき $\angle ADB$ を求めなさい。`:m`円で、頂点 $C$ を含まない弧 $AB$ に対する中心角は $${a}^\circ$ です。円周角 $\angle ACB$ を求めなさい。`,
 m`$${opposite?180-a:a/2}^\circ$。`,opposite?"反対側の頂点は、互いに違う弧を見込んでいます。":"同じ弧に対する中心角と円周角を対応させます。",
 opposite?m`二つの弧の中心角の和は $360^\circ$。円周角はそれぞれ半分なので、和は $180^\circ$。よって $180^\circ-${a}^\circ=${180-a}^\circ$。`:
 m`同じ弧に対する円周角は中心角の半分なので、$\angle ACB=\frac{${a}^\circ}2=${a/2}^\circ$。`);}
export function cyclic(a:number,b:number,judge=false):Q{return q(judge?m`凸四角形 $ABCD$ で $\angle A=${a}^\circ,\angle C=${b}^\circ$ です。この四角形は円に内接しますか。理由も答えなさい。`:m`円に内接する凸四角形 $ABCD$ で $\angle A=${a}^\circ$。$\angle C$ を求めなさい。`,
 judge?(a+b===180?"内接します。向かい合う角の和が平角なので、内接四角形の性質の逆を使えます。":"内接しません。向かい合う角の和が平角ではないからです。"):m`$\angle C=${180-a}^\circ$。`,
 "向かい合う角を選び、その和を確かめます。隣り合う角ではありません。",
 judge?m`$\angle A+\angle C=${a+b}^\circ$。凸四角形が円に内接するための必要十分条件は、この和が $180^\circ$ になることです。`:
 m`対角は、合わせて円一周の弧を見込みます。円周角の和は $180^\circ$ なので、$\angle C=180^\circ-${a}^\circ=${180-a}^\circ$。`);}
export function tangent(h:number,r:number):Q{
 const sq=h*h-r*r,s=Math.sqrt(sq);
 return checked(q(m`中心 $O$、半径 $${r}$ の円の外に点 $P$ があり、$OP=${h}$。$P$ からの接点を $T$ とするとき、接線の長さ $PT$ を求めなさい。`,
 m`$PT=${Number.isInteger(s)?s:`\\sqrt{${sq}}`}$。`,"中心と接点を結ぶと、接線に垂直な半径ができます。",
 m`$OT\perp PT$ なので三平方の定理より $PT^2=OP^2-OT^2=${h}^2-${r}^2=${sq}$。長さは正だから $PT=${Number.isInteger(s)?s:`\\sqrt{${sq}}`}$。`,s),"tangent",[h,r]);
}
export function equalTangents(n:number):Q{return q(m`同じ円の外の点 $P$ から二本の接線を引き、接点を $T,U$ とします。$PT=${n}$ なら $PU$ はいくつですか。理由も説明しなさい。`,
 m`$PU=${n}$。同じ外点からの二本の接線の長さは等しいからです。`,
 "中心から二つの接点と外点へ線を引き、二つの直角三角形を比べます。",
 m`中心を $O$ とすると、$\triangle OPT,\triangle OPU$ は直角三角形です。斜辺 $OP$ は共通、半径 $OT=OU$ なので合同。対応する辺より $PT=PU=${n}$。`);}
export function tangentChord(a:number,other=false):Q{return q(m`円上に異なる三点 $A,B,C$ があります。$A$ の接線の半直線 $AT$ は、直線 $AB$ に対して $C$ と反対側にあります。$\angle TAB=${a}^\circ$ のとき、${other?"$AT$ と反対向きの接線の半直線を $AS$ として、$\\angle SAB$":"$\\angle ACB$"}を求めなさい。`,
 m`$${other?180-a:a}^\circ$。`,other?"接線上の二つの半直線は、一直線をつくります。":"接線のどちら側との角かを確かめ、対応する円周角を探します。",
 other?m`$\angle SAB+\angle TAB=180^\circ$ なので $\angle SAB=${180-a}^\circ$。`:
 m`指定された側の接弦角と、それに対応する円周角は等しいので $\angle ACB=\angle TAB=${a}^\circ$。`);}
export function power(a:number,b:number,c:number,external=false,tangentCase=false):Q{
 const product=external?a*(a+b):a*b,ans=tangentCase?Math.sqrt(product):product/c;
 const tex=tangentCase?root(product):f(product,c);
 return checked(q(external?m`円外の点 $P$ から引く割線は $A,B$ の順に円と交わり、$PA=${a},AB=${b}$。${tangentCase?"接点 $T$ への接線の長さ $PT$ を求めなさい。":m`別の割線は $C,D$ の順に交わり、$PC=${c}$ です。$PD$ を求めなさい。`}`:
 m`円内の点 $P$ で二つの弦 $AB,CD$ が交わります。$PA=${a},PB=${b},PC=${c}$ のとき $PD$ を求めなさい。`,
 m`$${tangentCase?"PT":"PD"}=${tex}$。`,"すべての長さを、同じ点から測っているか確認します。"+(external?"外側の割線では近い部分と弦の長さを足します。":""),
 (external?m`$PB=PA+AB=${a+b}$。`:"")+m`方べきの定理から ${tangentCase?"$PT^2=PA\\cdot PB$":"$PA\\cdot PB=PC\\cdot PD$"}。`+
 (tangentCase?m`$PT^2=${a}\times${a+b}=${product}$。正の根を取り $PT=${rootCalculation(product)}$。`:m`$PD=\frac{${product}}{${c}}=${tex}$。`),ans),"power",[a,b,c,+external,+tangentCase]);
}
export function circles(r:number,s:number,d:number):Q{
 const sum=r+s,diff=Math.abs(r-s);
 const answer=d===0&&r===s?"一致します。交点は円周上のすべての点です。":d>sum?"離れていて、交点はありません。":d===sum?"外接し、接点は一つです。":d>diff?"二点で交わります。":d===diff?"内接し、接点は一つです。":"一方が他方の内部にあり、交点はありません。";
 return q(m`二円の半径は $${r},${s}$、中心間の距離は $${d}$ です。二円の位置関係と共有点について答えなさい。`,answer,
 "まず同じ円でないかを確かめ、次に中心間距離を半径の和・差と比べます。",
 m`半径の和は $${sum}$、差の絶対値は $${diff}$。`+(d===0&&r===s?"中心も半径も同じなので同じ円です。":m`中心間距離 $${d}$ をこの二つと比べます。`)+answer);
}
export function commonTangent(r:number,s:number,d:number,inner=false):Q{
 const leg=inner?r+s:Math.abs(r-s),sq=d*d-leg*leg;
 if(sq<=0)throw Error("No positive common tangent segment");
 return checked(q(m`二円の半径は $${r},${s}$、中心間距離は $${d}$ です。${inner?"二つの中心が接線の反対側にある内共通接線":"二つの中心が接線の同じ側にある外共通接線"}の、二つの接点間の長さを求めなさい。`,
 m`$${root(sq)}$。`,
 inner?"二本の半径は接線の反対側なので、垂直方向の長さは和になります。":"二本の半径は接線の同じ側なので、垂直方向の長さは差になります。",
 m`半径は接線に垂直です。中心間を斜辺とする直角三角形をつくると、一辺は $${inner?`${r}+${s}`:`|${r}-${s}|`}=${leg}$。$${d}>${leg}$ なので接点間の長さは正です。三平方の定理で $\sqrt{${d}^2-${leg}^2}=${rootCalculation(sq)}$。`,Math.sqrt(sq)),"common",[r,s,d,+inner]);
}
export const geoPrep=[
 skill("angle-prep","三角形の内角を確かめる","三角形の内角の和を使います。",angle(50,60),[angle(40,70),angle(35,65),angle(45,75)]),
 skill("ratio-prep","比から全体を分ける","比の和に全体が対応します。",q(m`$10$ を $2:3$ に分けなさい。`,"$4$ と $6$。","比の和で全体を割ります。",m`$10\div(2+3)=2$ を各比に掛け、$4,6$。`),[3,4,5].map(n=>q(m`$${5*n}$ を $2:3$ に分けなさい。`,m`$${2*n}$ と $${3*n}$。`,"比の和で全体を割ります。",m`$${5*n}\div5=${n}$ を各比に掛け、$${2*n},${3*n}$。`)))
];
