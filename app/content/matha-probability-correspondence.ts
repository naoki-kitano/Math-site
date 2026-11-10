import type {FormulaLesson,FormulaStep} from './formula-correspondence';
const m=String.raw;
const picture=(kind:string,stage:number):FormulaStep['diagram']=>({kind:'ma-probability-'+kind,stage,animated:false});
export const mathAProbabilityCorrespondence:Record<string,FormulaLesson>={
 'ma-events':{title:'全結果から、条件に合う結果を残す',goal:'試行と事象を対応させます。',check:'',steps:[
  {label:'一つの結果',text:'同じ条件で繰り返せ、結果が決まっていない操作を試行といいます。硬貨を二回投げた結果は、順番も区別します。',formulas:[],diagram:picture('events',0)},
  {label:'事象に含まれる結果',text:'「表がちょうど一回」という条件に合う二列を集めます。この結果の集まりが事象です。',formulas:[],diagram:picture('events',1)}
 ]},
 'ma-equally-likely':{title:'等確率なのは、色ではなく一個ずつの玉',goal:'数える対象を確かめます。',check:'',steps:[
  {label:'等確率な結果',text:'同じ色の玉も番号で区別します。五個の玉から一個を等確率で選びます。',formulas:[],diagram:picture('equal',0)},
  {label:'同じ色を集める',text:'赤に含まれる結果は三個、青は二個。二色でも、起こる確率は異なります。',formulas:[],diagram:picture('equal',1)},
  {label:'個数を割合へ',text:'分母も分子も、等確率で選ばれる玉の個数です。',formulas:[m`P(\text{赤})=\frac35`,m`P(\text{青})=\frac25`]}
 ]},
 'ma-probability-count':{title:'分母と分子を、同じ組で数える',goal:'場合の数を確率に対応させます。',check:'どの二個の組も等確率で選びます。',steps:[
  {label:'全体の単位',text:m`赤玉 $R_1,R_2,R_3$ と青玉 $B_1,B_2$ から二個を選びます。並べる順序は区別しません。`,formulas:[],diagram:picture('pairs',0)},
  {label:'条件に合う組',text:'同じ一覧から、二個とも赤の三組を選びます。分子だけ順序を付け直す必要はありません。',formulas:[],diagram:picture('pairs',1)},
  {label:'同じ単位の比',text:'赤二個の組数を、全体の組数で割ります。',formulas:[m`P(\text{赤二個})=\frac{{}_3C_2}{{}_5C_2}=\frac3{10}`]}
 ]},
 'ma-probability-complement':{title:'「少なくとも一回」の反対を除く',goal:'余事象を全体と対応させます。',check:'',steps:[
  {label:'確率の範囲',text:'必ず起こる事象の確率は1、起こり得ない事象の確率は0です。',formulas:[m`0\leqq P(A)\leqq1`]},
  {label:'全体を決める',text:'公平な硬貨を独立に三回投げると、八つの列は等確率です。',formulas:[],diagram:picture('complement',0)},
  {label:'起こらない場合を除く',text:'「少なくとも一回表」の反対は「全部裏」。除くのは一列だけです。',formulas:[],diagram:picture('complement',1)},
  {label:'残る確率',text:'求める事象とその余事象は重ならず、合わせると全体になります。',formulas:[m`P(\text{少なくとも一回表})`,m`=1-P(\text{全部裏})=1-\frac18=\frac78`]}
 ]},
 'ma-probability-union':{title:'二度数えた共通部分を、一度戻す',goal:'和事象の式と重複を対応させます。',check:m`$1$～$12$ のカードを等確率で一枚選びます。`,steps:[
  {label:'一方を数える',text:m`事象 $A$ は $2$ の倍数。該当するカードは六枚です。`,formulas:[],diagram:picture('union',0)},
  {label:'もう一方も数える',text:m`事象 $B$ の四枚を足すと、$6,12$ を二度ずつ数えます。`,formulas:[],diagram:picture('union',1)},
  {label:'共通部分を一度引く',text:'「または」には両方の場合も含みます。共通する二枚を一度ずつ引くと、どのカードも一度だけ数えられます。',formulas:[m`P(A\cup B)=\frac{6+4-2}{12}=\frac23`],diagram:picture('union',2)},
  {label:'公式の各項',text:'共通部分の確率を引けば、和事象の確率になります。排反なら引く項は0です。',formulas:[m`P(A\cup B)+P(A\cap B)`,m`=P(A)+P(B)`]}
 ]},
 'ma-probability-tree':{title:'経路の中では掛け、経路どうしは足す',goal:'枝と終点を確率の式に対応させます。',check:'各回、各玉を等確率で選び、戻してよく混ぜます。',steps:[
  {label:'一つの経路',text:'最初が赤だった後も、袋の中身は元と同じです。次に赤となる割合を掛けます。',formulas:[],diagram:picture('tree',0)},
  {label:'終点の確率',text:'二つの枝をたどった「赤・赤」の確率は、枝の確率の積です。',formulas:[],diagram:picture('tree',1)},
  {label:'必要な経路を合わせる',text:'異色になるのは、赤・青と青・赤。二つの経路の確率を足します。',formulas:[m`\frac6{25}+\frac6{25}=\frac{12}{25}`],diagram:picture('tree',2)}
 ]},
 'ma-replacement':{title:'次の袋の中身を、分子と分母へ',goal:'戻す操作の有無を確率に対応させます。',check:'',steps:[
  {label:'引く前',text:'最初が赤である確率は、赤の個数を全体の個数で割って求めます。',formulas:[m`P(\text{最初が赤})=\frac35`],diagram:picture('replacement',0)},
  {label:'戻さない',text:'赤を一個引いて戻さないと、赤も全体も一個ずつ減ります。',formulas:[m`P_{\text{最初が赤}}(\text{次が赤})=\frac24`],diagram:picture('replacement',1)},
  {label:'戻す',text:'引いた赤玉を戻すと、赤も全体も元の個数に戻ります。次も元の袋から選びます。',formulas:[m`\text{戻す場合：}\frac35`],diagram:picture('replacement',2)}
 ]},
 'ma-independent-trials':{title:'二つの条件を、別々の軸で絞る',goal:'独立な試行の積を組の数で確かめます。',check:'独立な公平な二つのさいころを投げます。',steps:[
  {label:'第一の条件',text:m`第一の目が $4$ 以上になる行を選びます。どの行にも、第二の六つの目が残ります。`,formulas:[],diagram:picture('independent',0)},
  {label:'第二の条件',text:m`第二の目が $3$ の倍数になる列を選びます。両方に合うのは六マスです。`,formulas:[],diagram:picture('independent',1)},
  {label:'個数の積と確率の積',text:'第一の結果で第二の確率が変わらないため、二つの割合を掛けられます。',formulas:[m`\frac{3\times2}{6\times6}=\frac36\times\frac26=\frac16`]}
 ]},
 'ma-repeated-trials':{title:'一列の確率と、成功位置の数',goal:'反復試行の公式の二つの役割を分けます。',check:m`各回は独立で成功確率が一定。一般式では $0<p<1$、$n$ は正の整数、$k$ は $0\leqq k\leqq n$ を満たす整数です。`,steps:[
  {label:'一つの並び',text:'公平な硬貨を三回投げ、表がちょうど二回出る確率を考えます。まず表・表・裏の一列を見ます。',formulas:[],diagram:picture('repeated',0)},
  {label:'表の位置を選ぶ',text:'表の位置が違えば別の結果です。三か所から二か所を選ぶと、この三列になります。',formulas:[m`{}_3C_2=3`],diagram:picture('repeated',1)},
  {label:'同じ確率を集める',text:'どの列も表二回・裏一回。同じ確率の三列を足します。',formulas:[m`{}_3C_2\left(\frac12\right)^2\frac12=\frac38`],diagram:picture('repeated',2)},
  {label:'公式の役割',text:'組合せは成功する位置の数、積は一列の確率を表します。',formulas:[m`\underbrace{{}_nC_k}_{\text{位置の数}}\,\underbrace{p^k(1-p)^{n-k}}_{\text{一列の確率}}`]}
 ]},
 'ma-conditional-probability':{title:'条件に合う結果を、新しい全体にする',goal:'条件付き確率の分母を見える形にします。',check:'各カードを等確率で選びます。条件に合うカードが0枚なら、この割合は定義できません。',steps:[
  {label:'元の全体',text:m`$1$～$6$ のカードから選びました。番号が $3$ 以上だったと分かったとき、偶数である確率を求めます。`,formulas:[],diagram:picture('conditional',0)},
  {label:'条件に合う全体',text:m`$1,2$ は条件に合いません。残った四枚を分母にします。`,formulas:[],diagram:picture('conditional',1)},
  {label:'その中の事象',text:'残った四枚のうち、偶数は二枚。その割合が条件付き確率です。',formulas:[m`P_{\text{3以上}}(\text{偶数})=\frac24=\frac12`],diagram:picture('conditional',2)},
  {label:'公式と対応させる',text:m`条件を $A$、調べる事象を $B$ とすると、分子は両方に合う部分、分母は条件の全体です。`,formulas:[m`P_A(B)=\frac{P(A\cap B)}{P(A)}`,m`P(A)>0`]}
 ]},
 'ma-probability-multiplication':{title:'事象の確率と、その条件での確率',goal:'与えられた二つの確率を、乗法定理へ対応させます。',check:m`$P(A)>0$。独立である必要はありません。`,steps:[
  {label:'条件付き確率から',text:'条件付き確率の式で、分母の確率を両辺に掛けます。',formulas:[m`P_A(B)=\frac{P(A\cap B)}{P(A)}`,m`P(A\cap B)=P(A)P_A(B)`]},
  {label:'各確率の役割へ入れる',text:m`$P(A)=\frac35$、$P_A(B)=\frac12$ を、それぞれ対応する位置へ入れます。`,formulas:[],motion:{source:m`\underbrace{\color{#176c82}{\frac35}}_{P(A)}\quad\underbrace{\color{#936114}{\frac12}}_{P_A(B)}`,target:m`P(A\cap B)=\color{#176c82}{\frac35}\cdot\color{#936114}{\frac12}`,parts:[{tex:m`\color{#176c82}{\frac35}`,color:'#176c82'},{tex:m`\color{#936114}{\frac12}`,color:'#936114'}]}},
  {label:'積を求める',text:m`二つ目に掛けたのは、$A$ が起きたと分かったときの $B$ の確率です。`,formulas:[m`P(A\cap B)=\frac3{10}`]}
 ]},
 'ma-independent-exclusive':{title:'共通部分と、確率の変化を分けて調べる',goal:'排反と独立を別々に判断します。',check:'公平なさいころを一回投げます。',steps:[
  {label:'共通部分を見る',text:'偶数と奇数に共通する目はありません。したがって二つの事象は排反です。',formulas:[m`P(A\cap B)=0`],diagram:picture('exclusive',0)},
  {label:'確率の積と比べる',text:'偶数と分かれば奇数の確率は0になります。もとの確率と異なるので独立ではありません。',formulas:[m`P(A)P(B)=\frac12\times\frac12=\frac14`,m`P(A\cap B)\ne P(A)P(B)`]},
  {label:'共通部分があっても独立',text:'今度は偶数と3の倍数。共通する6の確率と、二つの確率の積が一致します。',formulas:[m`P(A\cap B)=\frac16=\frac12\times\frac13`],diagram:picture('exclusive',2)},
  {label:'条件を区別する',text:'両事象の確率が正なら、排反と独立は両立しません。排反でも片方の確率が0なら、共通部分の確率と積はどちらも0になり、独立が成り立ちます。',formulas:[m`P(A),P(B)>0\ \Longrightarrow\ P(A)P(B)>0`]}
 ]},
 'ma-posterior-probability':{title:'結果に合う経路を分母に集める',goal:'原因から結果への確率と、結果から原因への確率を分けます。',check:'選んだ箱から各玉を等確率で一個引きます。赤となる確率は正です。',steps:[
  {label:'箱を選ぶ重み',text:m`箱 $A$ を確率 $\frac13$、箱 $B$ を確率 $\frac23$ で選びます。箱から色へ進む経路の確率を求めます。`,formulas:[],diagram:picture('posterior',0)},
  {label:'赤に至る経路を残す',text:'赤が出たと分かったので、青に至る経路を除きます。残る二経路が条件後の全体です。',formulas:[],diagram:picture('posterior',1)},
  {label:'求める経路の割合',text:m`赤だった経路の全体を分母、そのうち箱 $A$ の経路を分子にします。`,formulas:[m`P_{\text{赤}}(A)=\frac{\frac3{15}}{\frac7{15}}=\frac37`]}
 ]},
 'ma-expected-value':{title:'同じ値を集め、値と確率を一組にする',goal:'期待値を確率で重み付けした平均として読みます。',check:'',steps:[
  {label:'等確率な六つの結果',text:m`得点 $0,0,0,2,2,5$ がそれぞれ確率 $\frac16$ で出る試行を考えます。`,formulas:[],diagram:picture('mean',0)},
  {label:'同じ得点をまとめる',text:'同じ得点に属する確率を足します。得点の種類を三つ並べても、三分の一ずつではありません。',formulas:[],diagram:picture('mean',1)},
  {label:'重み付きの平均',text:'各得点にその確率を掛けて足すと、もとの六つの結果の平均と同じ量になります。',formulas:[m`0\times\frac12+2\times\frac13+5\times\frac16`,m`=\frac32`]},
  {label:'一回の値とは違う',text:m`期待値は $\frac32$ 点ですが、一回に出る得点は $0,2,5$ のいずれかです。`,formulas:[]}
 ]},
 'ma-expected-profit':{title:'費用は、当たりにも外れにも掛かる',goal:'受取額と利益を対応させます。',check:'仮想のくじで、参加費は毎回100円です。',steps:[
  {label:'受取額',text:'四つの結果は等確率です。当たりは600円、三つの外れは0円を受け取ります。',formulas:[],diagram:picture('profit',0)},
  {label:'各結果から費用を引く',text:'利益は受取額から費用を引いた額です。外れたときにも参加費を引きます。',formulas:[],diagram:picture('profit',1)},
  {label:'利益の期待値',text:'各利益にその確率を掛けます。受取額の期待値から費用を引いても同じです。',formulas:[m`500\times\frac14+(-100)\times\frac34=50`,m`600\times\frac14-100=50`]},
  {label:'平均と損の確率',text:m`期待利益は $50$ 円でも、実際の利益は $500$ 円か $-100$ 円。損をする確率は $\frac34$ です。`,formulas:[]}
 ]},
};
