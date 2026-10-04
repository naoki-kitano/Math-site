import {m,q,f,gcd,comb,range,skill} from "./matha-authoring";
import type {Q} from "./matha-authoring";
export const probabilityAudit:{q:Q;kind:string;args:number[]}[]=[];
const checked=(x:Q,kind:string,args:number[])=>{probabilityAudit.push({q:x,kind,args});return x;};
const reducedFraction=(a:number,b:number)=>{const original=m`\frac{${a}}{${b}}`,simplified=f(a,b);return original===simplified?original:m`${original}=${simplified}`;};
export const fraction=(a:number,b:number)=>q(m`分数 $\frac{${a}}{${b}}$ を約分しなさい。`,m`$${f(a,b)}$。`,"分子と分母を同じ公約数で割ります。",m`分子と分母を $${gcd(a,b)}$ で割って $${f(a,b)}$。値は変わりません。`);
export const prep=[
 skill("fraction","分数を約分する","割合を表す分数も、分子と分母を同じ数で割れます。",fraction(2,6),[fraction(4,10),fraction(6,8),fraction(9,12)]),
 skill("fraction-complement","全体から一部分を引く","全体の一を同じ分母の分数で表します。",q(m`$1-\frac25$ を計算しなさい。`,m`$\frac35$。`,"一を五分の五と表します。",m`$\frac55-\frac25=\frac35$。`),[2,3,4].map(a=>q(m`$1-\frac{${a}}{${a+3}}$ を計算しなさい。`,m`$${f(3,a+3)}$。`,"一を同じ分母で表します。",m`$\frac{${a+3}}{${a+3}}-\frac{${a}}{${a+3}}=${f(3,a+3)}$。`)))
];
export function event(k:number,less=false):Q{
 const vals=range(6,1).filter(x=>less?x<k:x>=k);
 return q(m`さいころを $1$ 回投げます。「目が $${k}$ ${less?"未満":"以上"}」という事象に含まれる目を、すべて書きなさい。`,vals.length?m`$\{${vals.join(",")}\}$。`:m`$\varnothing$（該当なし）。`,
 less?"未満では境界の数を含めません。":"以上では境界の数を含めます。",
 m`起こり得る目は $\{1,2,3,4,5,6\}$。`+(vals.length?m`条件に合う目だけを残すと $\{${vals.join(",")}\}$。`:"条件に合う目はありません。"));
}
export function coinEvent(n:number,k:number,atLeast=false):Q{
 const all=range(2**n).map(v=>range(n).map(i=>(v>>(n-1-i))&1?"表":"裏").join(""));
 const selected=all.filter(s=>atLeast?s.split("表").length-1>=k:s.split("表").length-1===k);
 return q(m`硬貨を $${n}$ 回投げます。順番を区別し、「表が${atLeast?"少なくとも":"ちょうど"} $${k}$ 回」という事象の結果をすべて書きなさい。`,selected.join("、")+"。",
 "最初の結果を固定し、次の表・裏へ枝を分けます。条件に合う列を残します。",
 `すべての列は ${all.join("、")}。表の回数を調べると、${selected.join("、")} が当てはまります。表が出る位置が違えば、別の結果です。`);
}
export function color(r:number,b:number,judgment=false):Q{
 const p=r/(r+b);
 return checked(q(m`赤玉 $${r}$ 個、青玉 $${b}$ 個の袋から、どの玉も同じ確率で選ばれるように $1$ 個取り出します。${judgment?"「二色だから赤が出る確率は半分」といえますか。理由と正しい確率を書きなさい。":"赤が出る確率を求めなさい。"}`,
 m`$${f(r,r+b)}$。`+(judgment?(r===b?"確率は半分ですが、二色というだけでは理由になりません。赤と青が同数で、各玉が等確率で選ばれるからです。":"いえません。色ではなく、各玉が等確率で選ばれるからです。"):""),
 "同じ色でも玉一個ずつに番号を付け、全体と赤の個数を数えます。",
 m`等確率の結果は $${r+b}$ 個の玉です。そのうち赤は $${r}$ 個なので $${reducedFraction(r,r+b)}$。色の種類数だけを分母にはできません。`,p),"color",[r,b]);
}
export function diceSum(target:number):Q{
 const pairs=range(6,1).flatMap(a=>range(6,1).filter(b=>a+b===target).map(b=>`(${a},${b})`));
 return checked(q(m`独立な公平な赤・白のさいころを $1$ 回ずつ投げます。和が $${target}$ になる確率を求め、「和の種類は等確率」としてよいかも説明しなさい。`,
 m`$${f(pairs.length,36)}$。和の種類は等確率ではありません。和ごとに出目の組の数が違います。`,
 "赤の目を一つずつ固定し、求める和になる白の目を探します。",
 m`等確率なのは順序付きの $36$ 組。条件に合う組は $${pairs.join(",")}$ の $${pairs.length}$ 組なので $${reducedFraction(pairs.length,36)}$。和が $2$ の組は一つ、和が $7$ の組は六つで、和そのものは等確率ではありません。`,pairs.length/36),"sum",[target]);
}
export function drawPair(r:number,b:number):Q{
 const a=comb(r,2),d=comb(r+b,2);
 return checked(q(m`赤玉 $${r}$ 個、青玉 $${b}$ 個から、どの二個の組も同じ確率になるように同時に $2$ 個選びます。両方赤である確率を求めなさい。`,m`$${f(a,d)}$。`,
 "全体も赤だけの場合も、順序を付けない二個の組で数えます。",
 m`全体は $ {}_{${r+b}}C_2=${d}$ 組、赤だけは $ {}_{${r}}C_2=${a}$ 組。したがって $${reducedFraction(a,d)}$。分母と分子で数える単位をそろえます。`,a/d),"pair",[r,b]);
}
export function card(n:number,k:number):Q{
 const a=Math.floor(n/k);
 return checked(q(m`番号 $1$ から $${n}$ のカードから、各カードを等確率で $1$ 枚選びます。番号が $${k}$ の倍数である確率を求めなさい。`,m`$${f(a,n)}$。`,
 "範囲内にある倍数を書き出します。",
 m`該当する番号は $${range(a,1).map(x=>x*k).join(",")}$ の $${a}$ 枚。全 $${n}$ 枚なので $${reducedFraction(a,n)}$。`,a/n),"card",[n,k]);
}
export function noHeads(n:number):Q{
 return checked(q(m`公平な硬貨を独立に $${n}$ 回投げます。少なくとも $1$ 回表が出る確率を求めなさい。`,m`$${f(2**n-1,2**n)}$。`,
 "求める事象の反対は、表が一度も出ないことです。",
 m`等確率の列は $2^{${n}}=${2**n}$ 通り。そのうち全部裏の一列だけを除きます。$1-\frac1{${2**n}}=${f(2**n-1,2**n)}$。`,1-1/2**n),"heads",[n]);
}
export function certain(k:number,impossible:boolean):Q{
 return q(m`公平なさいころを $1$ 回投げます。「目が $${k}$ ${impossible?"以上":"以下"}」の確率と理由を答えなさい。`,
 impossible?"$0$。当てはまる目がありません。":"$1$。どの目も当てはまります。",
 "起こり得る一から六の目を、すべて確かめます。",
 impossible?m`$1$ から $6$ のどの目も $${k}$ 以上ではないので $\frac06=0$。`:m`$1$ から $6$ のすべての目が $${k}$ 以下なので $\frac66=1$。`);
}
export function union(n:number,a:number,b:number):Q{
 const aa=range(n,1).filter(x=>x%a===0),bb=range(n,1).filter(x=>x%b===0),both=aa.filter(x=>bb.includes(x)),u=aa.length+bb.length-both.length;
 return checked(q(m`番号 $1$ から $${n}$ のカードを等確率で $1$ 枚選びます。$${a}$ の倍数または $${b}$ の倍数である確率を求めなさい。`,
 m`$${f(u,n)}$。`,"両方の倍数を二度数えていないか調べます。",
 m`二つの枚数は $${aa.length}$ 枚と $${bb.length}$ 枚。共通する番号は ${both.length?`$${both.join(",")}$`:"なく"}、$${both.length}$ 枚です。$\frac{${aa.length}+${bb.length}-${both.length}}{${n}}=${f(u,n)}$。`,u/n),"union",[n,a,b]);
}
export function disjoint(n:number,a:number,b:number):Q{
 const both=range(n,1).filter(x=>x%a===0&&x%b===0);
 return q(m`番号 $1$ から $${n}$ のカードを等確率で $1$ 枚選びます。$A$ を「$${a}$ の倍数」、$B$ を「$${b}$ の倍数」とします。二つの事象は排反ですか。理由も答えなさい。`,
 both.length?m`排反ではありません。$${both.join(",")}$ が両方に含まれます。`:"排反です。両方に含まれる番号がありません。",
 "二つの条件を同時に満たす番号があるか探します。",
 m`範囲内の共通する倍数を調べます。${both.length?`$${both.join(",")}$ があるので同時に起こり得ます。`:"一つもないので同時には起こりません。"}排反とは、共通する結果がないことです。`);
}
export function successive(r:number,b:number,replace:boolean,different=false):Q{
 const n=r+b,num=different?2*r*b:r*(replace?r:r-1),den=n*(replace?n:n-1);
 return checked(q(m`赤玉 $${r}$ 個、青玉 $${b}$ 個から $1$ 個ずつ $2$ 回引きます。毎回、残っている各玉を等確率で選びます。最初の玉は${replace?"戻してよく混ぜます":"戻しません"}。${different?"二個の色が異なる":"二個とも赤になる"}確率を求めなさい。`,m`$${f(num,den)}$。`,
 different?"赤の後に青、青の後に赤という二経路を別々に求めて足します。":replace?"戻すので、二回目の全体も赤の数も元に戻ります。":"一回目が赤の枝では、全体も赤も一個ずつ減ります。",
 different?m`赤青は $\frac{${r}}{${n}}\times\frac{${b}}{${replace?n:n-1}}$、青赤は $\frac{${b}}{${n}}\times\frac{${r}}{${replace?n:n-1}}$。この二経路は重ならないので足し、$${f(num,den)}$。`:
 m`最初が赤の確率は $\frac{${r}}{${n}}$。赤を引${replace?"いて戻した":"いた"}後、赤は $${replace?r:r-1}$ 個、全体は $${replace?n:n-1}$ 個。経路に沿って掛け、$\frac{${r}}{${n}}\times\frac{${replace?r:r-1}}{${replace?n:n-1}}=${f(num,den)}$。`,num/den),"successive",[r,b,+replace,+different]);
}
export function independent(k:number,j:number):Q{
 const a=range(6,1).filter(x=>x>=k).length,b=range(6,1).filter(x=>x%j===0).length;
 return checked(q(m`独立な公平な二つのさいころを投げます。第一の目が $${k}$ 以上で、第二の目が $${j}$ の倍数になる確率を求めなさい。`,
 m`$${f(a*b,36)}$。`,"独立なので、一方の結果を知っても他方の確率は変わりません。",
 m`第一の確率は $\frac{${a}}6$、第二は $\frac{${b}}6$。独立だから掛けて $\frac{${a}}6\times\frac{${b}}6=${f(a*b,36)}$。`,a*b/36),"independent",[k,j]);
}
export function dependence(r:number,b:number,replace:boolean):Q{
 const n=r+b;
 return q(m`赤玉 $${r}$ 個、青玉 $${b}$ 個から一個ずつ二回引きます。各回は残っている各玉から等確率で選び、最初の玉は${replace?"戻してよく混ぜます":"戻しません"}。二回の色は独立ですか。赤を引いた後と青を引いた後で比べなさい。`,
 replace?m`独立です。どちらの後も次が赤の確率は $${f(r,n)}$ です。`:m`独立ではありません。次が赤の確率は、赤の後 $${f(r-1,n-1)}$、青の後 $${f(r,n-1)}$ で異なります。`,
 "一回目の色ごとに、次の袋の中身を書きます。",
 replace?m`どちらの後も赤 $${r}$ 個、青 $${b}$ 個に戻ります。次の色の確率が変わらないので独立です。`:
 m`赤の後は赤 $${r-1}$ 個、青の後は赤 $${r}$ 個。どちらも全体 $${n-1}$ 個で、赤の割合が異なります。一回目の結果が次の確率を変えます。`);
}
export function repeated(n:number,k:number,d:number):Q{
 const a=comb(n,k)*(d-1)**(n-k),b=d**n;
 return checked(q(m`各回の成功確率が $\frac1{${d}}$ である試行を、独立に $${n}$ 回行います。成功がちょうど $${k}$ 回となる確率を求めなさい。`,
 m`$${f(a,b)}$。`,"成功する位置の選び方と、一つの並びの確率を分けます。",
 m`成功位置は $ {}_{${n}}C_{${k}}=${comb(n,k)}$ 通り。一列の確率は $\left(\frac1{${d}}\right)^{${k}}\left(\frac{${d-1}}{${d}}\right)^{${n-k}}$。独立で各回同じ成功確率なので、積に組数を掛けて $${f(a,b)}$。零回や全回でも、位置の選び方は一通りです。`,a/b),"repeated",[n,k,d]);
}
export function repeatAllowed(r:number,b:number,replace:boolean):Q{
 return q(m`赤玉 $${r}$ 個、青玉 $${b}$ 個から、${replace?"毎回戻してよく混ぜ":"戻さず"}、各玉を等確率で二回引きます。赤がちょうど一回出る確率に、毎回同じ成功確率の反復試行の公式を使えますか。理由も答えなさい。`,
 replace?"使えます。袋の中身が毎回同じで、各回の抽出は独立だからです。":"そのままでは使えません。最初の色により、二回目の赤の割合が変わるからです。",
 "各回の成功確率は同じか、前の結果に左右されないかを確かめます。",
 dependence(r,b,replace).working+" 反復試行の公式は、独立で、各回の成功確率が同じという条件の下で用います。");
}
export function conditional(n:number,k:number,lower=true):Q{
 const remaining=range(n,1).filter(x=>lower?x>=k:x<=k),good=remaining.filter(x=>x%2===0);
 return checked(q(m`番号 $1$ から $${n}$ のカードを等確率で一枚選びました。番号が $${k}$ ${lower?"以上":"以下"}と分かったとき、偶数である確率を求めなさい。`,
 m`$${f(good.length,remaining.length)}$。`,"知らせてもらった条件に合わない番号を、全体から除きます。",
 m`条件後の全体は $\{${remaining.join(",")}\}$ の $${remaining.length}$ 枚。その中の偶数は $${good.length}$ 枚なので $${reducedFraction(good.length,remaining.length)}$。最初の全枚数では割りません。`,good.length/remaining.length),"conditional",[n,k,+lower]);
}
export function conditionImpossible(n:number,k:number):Q{
 return q(m`番号 $1$ から $${n}$ のカードを一枚選びます。「番号が $${k}$」という条件の下で偶数になる確率を、条件付き確率の式で求められますか。`,
 "求められません。この条件の確率は零で、分母が零になるため定義されません。",
 "条件に当てはまるカードが一枚でもあるか確認します。",
 m`$${k}$ のカードはないので条件事象 $A$ は空です。$P(A)=0$ だから、$\frac{P(A\cap B)}{P(A)}$ は定義できません。確率が零であるという答案とは違います。`);
}
export function multiplication(a:number,b:number,c:number,d:number):Q{
 return checked(q(m`$P(A)=${f(a,b)}$、$P_A(B)=${f(c,d)}$ です。$A$ と $B$ がともに起こる確率を求めなさい。`,
 m`$${f(a*c,b*d)}$。`,"二つ目は、最初の事象が起きたという条件の下での確率です。",
 m`$P(A)>0$ のとき、$P_A(B)=\frac{P(A\cap B)}{P(A)}$ の両辺に $P(A)$ を掛け、$P(A\cap B)=P(A)P_A(B)=${f(a,b)}\times${f(c,d)}=${f(a*c,b*d)}$。独立を仮定する必要はありません。`,a*c/(b*d)),"multiply",[a,b,c,d]);
}
export function independenceEvents(a:number,b:number,opposite=false):Q{
 const aa=range(6,1).filter(x=>x%a===0),bb=range(6,1).filter(x=>opposite?x%a!==0:x%b===0),both=aa.filter(x=>bb.includes(x));
 const ind=both.length*6===aa.length*bb.length;
 return q(m`公平なさいころで、$A=\{${aa.join(",")}\}$、$B=\{${bb.join(",")}\}$ とします。排反かどうかと、独立かどうかを、それぞれ理由とともに答えなさい。`,
 `${both.length?m`排反ではありません。$${both.join(",")}$ が両方に含まれます。`:"排反です。共通する目がありません。"}${ind?"独立です":"独立ではありません"}。`+m`$P(A\cap B)=${f(both.length,6)}$ と $P(A)P(B)=${f(aa.length*bb.length,36)}$ が${ind?"等しい":"異なる"}からです。`,
 "共通部分が空かを調べた後、共通部分の確率と二つの確率の積を比べます。",
 m`$P(A)=${f(aa.length,6)},P(B)=${f(bb.length,6)}$。共通する目は $${both.length}$ 個なので $P(A\cap B)=${f(both.length,6)}$。排反は共通部分が空という条件、独立は $P(A\cap B)=P(A)P(B)$ という条件で、別々に調べます。`);
}
export function posterior(r:number,b:number,w:number,total:number):Q{
 const a=w*r,bb=(total-w)*b,den=a+bb;
 return checked(q(m`箱 $A$ には赤 $${r}$ 個・青 $${b}$ 個、箱 $B$ には赤 $${b}$ 個・青 $${r}$ 個があります。箱 $A$ を選ぶ確率は $${f(w,total)}$、箱 $B$ は $${f(total-w,total)}$ です。選んだ箱から各玉を等確率で一個引き、赤でした。箱 $A$ を選んだ確率を求めなさい。`,
 m`$${f(a,den)}$。`,"赤と分かったので、赤に至る二経路だけを残します。$A$ から赤になる確率を、二経路の確率の合計で割ります。",
 m`$A$ から赤は $${f(w,total)}\times${f(r,r+b)}=${f(a,total*(r+b))}$、$B$ から赤は $${f(total-w,total)}\times${f(b,r+b)}=${f(bb,total*(r+b))}$。赤全体はその和 $${f(den,total*(r+b))}$。条件後の割合は $\dfrac{${f(a,total*(r+b))}}{${f(den,total*(r+b))}}=${f(a,den)}$。`,a/den),"posterior",[r,b,w,total]);
}
export function expectation(prize:number,a:number,b:number,cost=0):Q{
 const val=prize*a/b-cost;
 return checked(q(m`仮想のくじで、$${f(a,b)}$ の確率で $${prize}$ 円、それ以外は零円を受け取ります。${cost?m`参加費は $${cost}$ 円です。利益（受取額から参加費を引いた額）`:"受取額"}の期待値を求めなさい。${cost?"損をする確率と、期待値の額を必ず得るかも答えなさい。":""}`,
 m`$${f(prize*a-cost*b,b)}$ 円。`+(cost?m`損をする確率は $${f(b-a,b)}$。この期待利益を毎回必ず得るわけではありません。`:""),
 cost?"受取額の平均から費用を引きます。当たらないときの利益も考えます。":"受け取る額に、それが起こる確率を掛けて足します。",
 m`受取額の期待値は $${prize}\times${f(a,b)}+0\times${f(b-a,b)}=${f(prize*a,b)}$ 円。`+(cost?m`費用を引いて $${f(prize*a,b)}-${cost}=${f(prize*a-cost*b,b)}$ 円。外れると $${cost}$ 円の損です。期待値は一回の結果の保証ではありません。`:""),val),"expectation",[prize,a,b,cost]);
}
export function threeValues(a:number,b:number):Q{
 const num=2*a+b;
 return checked(q(m`得点 $0,${a},${b}$ が、それぞれ確率 $\frac12,\frac13,\frac16$ で出ます。得点の期待値を求めなさい。`,
 m`$${f(num,6)}$ 点。`,"値と、その値が出る確率を対応させます。",
 m`確率は $\frac12+\frac13+\frac16=1$。期待値は $0\times\frac12+${a}\times\frac13+${b}\times\frac16=${f(num,6)}$ 点。平均の値は、実際に出る得点と一致しなくても構いません。`,num/6),"three",[a,b]);
}
export function compare(a:number):Q{
 return q(m`仮想の二つのくじで、$A$ は必ず $${a}$ 円、$B$ は確率 $\frac12$ で零円、確率 $\frac12$ で $${2*a}$ 円を受け取ります。費用はありません。期待値を比べ、「どちらも毎回同じ額を得る」といえるか答えなさい。`,
 m`期待値はどちらも $${a}$ 円。同じなのは平均で、毎回の受取額ではありません。`,
 "平均を計算した後、それぞれで実際に出る額を書きます。",
 m`$A$ は $${a}$ 円。$B$ は $0\times\frac12+${2*a}\times\frac12=${a}$ 円。一方、$B$ の実際の結果は零円か $${2*a}$ 円なので、平均の一致は結果の一致ではありません。`);
}
