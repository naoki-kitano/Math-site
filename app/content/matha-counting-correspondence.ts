import type {FormulaLesson,FormulaStep} from './formula-correspondence';
const m=String.raw;
const view=(kind:string,stage:number):FormulaStep['diagram']=>({kind:'ma-counting-'+kind,stage,animated:kind==='circle'});
export const mathACountingCorrespondence:Record<string,FormulaLesson>={
 'ma-listing':{
  title:'一つの枠が、一つの組',goal:'行と列に沿って、すべての組を調べます。',check:'左はシャツ、右は帽子の番号。',
  steps:[
   {label:'行を一つ固定',text:m`シャツ $1$ に、すべての帽子を合わせます。表の一枠が一組です。`,formulas:[],diagram:view('listing',0)},
   {label:'残りの行を埋める',text:'シャツを変えて、同じように帽子を合わせます。別の枠なら、シャツか帽子の番号が違います。',formulas:[],diagram:view('listing',1)},
   {label:'一組ずつ数えた全体',text:m`各行に $2$ 組ずつ、全部で $3$ 行あります。すべての枠を一度ずつ数えます。`,formulas:[],diagram:view('listing',2)}
  ]
 },
 'ma-sum-product':{
  title:'単品とセット',goal:'足す場合と掛ける場合の違いを見ます。',check:'',
  steps:[
   {label:'別々の場合を合わせる',text:m`ケーキ $3$ 種類かアイス $2$ 種類から、一つだけ選びます。一つの選び方が両方の群に入ることはありません。`,formulas:[],diagram:view('sum-product',0)},
   {label:'一つずつ組にする',text:m`パン $3$ 種類と飲み物 $2$ 種類から、一つずつ選びます。一つの枠が一つのセットです。`,formulas:[],diagram:view('sum-product',1)},
   {label:'同じ個数ずつある',text:m`どのパンにも飲み物が $2$ 通りずつ付くので、同じ個数の $3$ 行を掛け算で数えられます。`,formulas:[],diagram:view('sum-product',2)}
  ]
 },
 'ma-changing-options':{
  title:'一の位で場合分け',goal:'二桁の偶数を、重ならない場合に分けます。',check:m`カード $0,1,2,3$ は各一枚。同じカードを二度使わず、十の位は $0$ にしません。`,
  steps:[
   {label:'一の位が0',text:m`偶数の一の位は $0$ または $2$。一の位を $0$ にすると、十の位に残るのは $1,2,3$ です。`,formulas:[],diagram:view('changing',0)},
   {label:'一の位が2',text:m`一の位を $2$ にすると、十の位は $1,3$。$0$ は先頭にできず、$2$ は使用済みです。`,formulas:[],diagram:view('changing',1)},
   {label:'場合ごとの個数を足す',text:'一の位が違うので、二つの場合は重なりません。候補数は同じではないため、それぞれ数えて足します。',formulas:[],diagram:view('changing',2)}
  ]
 },
 'ma-set-count':{
  title:'両方の人を一回にする',goal:'共通部分を一度だけ数えます。',check:m`全体 $20$ 人。犬好き $12$ 人、猫好き $9$ 人、両方好き $5$ 人です。`,
  steps:[
   {label:'重ならない部分に分ける',text:m`犬だけ好きな人は $12-5=7$ 人、猫だけ好きな人は $9-5=4$ 人です。`,formulas:[],diagram:view('sets',0)},
   {label:'二つの人数を足す',text:m`$12+9$ には、共通する $5$ 人が二回含まれます。`,formulas:[],diagram:view('sets',1)},
   {label:'一回分を引く',text:'共通部分の一回分を引くと、少なくとも一方が好きな人を一人ずつ数えたことになります。',formulas:[],diagram:view('sets',2)},
   {label:'どちらも好きでない人',text:'求める人は、今数えた人以外です。全体から引きます。',formulas:[],diagram:view('sets',3)}
  ]
 },
 'ma-permutation':{
  title:'場所ごとの候補数',goal:'積の各因子が何を数えているか見ます。',check:m`異なる $5$ 人から $3$ 人。発表は一人一度です。`,
  steps:[
   {label:'一番目の人',text:m`一番目には、まだ誰も使っていないので $5$ 人から選べます。`,formulas:[],diagram:view('permutation',0)},
   {label:'使った人を除く',text:m`一番目が誰でも、二番目の候補は残る $4$ 人。その二人を除くと三番目は $3$ 人です。`,formulas:[],diagram:view('permutation',1)},
   {label:'三つの場所を決める',text:m`一つの発表順に、三つの選択が対応します。選ばれなかった $2$ 人の順序は決めません。`,formulas:[],diagram:view('permutation',2)},
   {label:'階乗の式とつなぐ',text:m`$5!$ に含まれる末尾の $2\times1$ は、今回決めない二人の並べ方です。その部分を分母で除きます。`,formulas:[m`{}_5P_3=5\times4\times3`,m`=\frac{5!}{2!}=60`]}
  ]
 },
 'ma-repeated-choice':{
  title:'先頭と再使用の条件',goal:'各桁の候補を別々に確かめます。',check:m`数字 $0,1,2,3$ を、繰り返し使えます。`,
  steps:[
   {label:'先頭も0にできる',text:m`暗証番号なら、どの桁でも同じ $4$ 種類を選べます。`,formulas:[],diagram:view('repeated',0)},
   {label:'候補は減らない',text:m`一度選んだ数字も使えるので、後の桁も $4$ 通りずつです。`,formulas:[],diagram:view('repeated',1)},
   {label:'三桁の整数に変える',text:m`三桁の整数では、先頭だけ $0$ を除きます。後の桁では $0$ も再使用も認められます。`,formulas:[],diagram:view('repeated',2)}
  ]
 },
 'ma-restricted-permutation':{
  title:'まとまりの外側と内側',goal:'隣り合う二人を一つの対象として数えます。',check:m`異なる $4$ 人 $A,B,C,D$ を一列に並べ、$A,B$ が隣り合う場合です。`,
  steps:[
   {label:'二人を一つにまとめる',text:m`$A,B$ を一つのまとまりにすると、並べる対象は「まとまり・$C$・$D$」の三つです。`,formulas:[],diagram:view('adjacent',0)},
   {label:'外側の並び',text:m`三つの対象は異なるので、外側の並びは $3!=6$ 通りです。`,formulas:[],diagram:view('adjacent',1)},
   {label:'それぞれに内部の二通り',text:m`外側の各並びに、内部の $AB$ と $BA$ が対応します。どの完成した並びにも、元のまとまり方は一つだけです。`,formulas:[],diagram:view('adjacent',2)}
  ]
 },
 'ma-circular-permutation':{
  title:'回転の重複を除く',goal:'一人を基準にして、回転による重複を除きます。',check:'番号のない円卓では回転は同じ、裏返しは別です。',
  steps:[
   {label:'一人から順に読む',text:m`$A$ から時計回りに読むと、$B,C,D$ の順です。`,formulas:[],diagram:view('circle',0)},
   {label:'全員を同じだけ回す',text:m`全員を回しても、$A$ から時計回りの順は $B,C,D$ のままです。`,formulas:[],diagram:view('circle',1)},
   {label:'基準の人を固定',text:m`$A$ を基準に固定し、残る $3$ 人の時計回りの順序だけを決めます。`,formulas:[],diagram:view('circle',2)},
   {label:'席に番号がある場合',text:'席番号が違えば別の割り当てです。回した並びも区別するので、一人を固定してはいけません。',formulas:[],diagram:view('circle',3)}
  ]
 },
 'ma-combination':{
  title:'同じ組の並びをまとめる',goal:'組合せで割る理由を確かめます。',check:m`異なる $4$ 人から $2$ 人。選ぶ順序は区別しません。`,
  steps:[
   {label:'順番を付けて選ぶ',text:m`一人目は $4$ 通り、二人目は $3$ 通り。まず順序を区別すると、$12$ 通りです。`,formulas:[],diagram:view('combination',0)},
   {label:'同じ二人をまとめる',text:m`$AB$ と $BA$ は同じ組です。各枠に $2!$ 通りずつ並びが入ります。`,formulas:[],diagram:view('combination',1)},
   {label:'一組につき一回にする',text:m`並びの総数を、一組に入る並びの数で割ります。`,formulas:[],diagram:view('combination',2)},
   {label:'選ぶ人数をrに広げる',text:m`$r$ 人の同じ組は $r!$ 通りに並びます。整数 $0\le r\le n$ で、この重複を除きます。`,formulas:[m`{}_nC_r=\frac{{}_nP_r}{r!}`,m`=\frac{n!}{r!(n-r)!}`]}
  ]
 },
 'ma-order-or-selection':{
  title:'入れ替えると別か',goal:'順序を区別するか、実際の二つを比べます。',check:'本はそれぞれ異なるものです。',
  steps:[
   {label:'持っていく本の組',text:m`$A,B$ を持っていくことと、$B,A$ を持っていくことは同じです。選んだ順序は答えに含まれません。`,formulas:[],diagram:view('order',0)},
   {label:'棚に置いた並び',text:m`左に $A$・右に $B$ と、左に $B$・右に $A$ は違う並びです。場所の担当も答えに含まれます。`,formulas:[],diagram:view('order',1)},
   {label:'一組の内部を数えるか',text:m`$4$ 冊から $2$ 冊を持参する組は $6$ 通り。それぞれの組に左右の $2!$ 通りを付けると、棚の並びになります。`,formulas:[m`{}_4C_2=6`,m`{}_4P_2={}_4C_2\times2!=12`]}
  ]
 },
 'ma-identical-permutation':{
  title:'仮番号を消すと同じ',goal:'同じものの入れ替えによる重複を除きます。',check:'同じ文字どうしは区別しません。',
  steps:[
   {label:'仮番号を付ける',text:m`文字 $A,A,B,C$ の二つの $A$ に仮番号を付けると、異なる四つとして $4!$ 通りに並びます。`,formulas:[],diagram:view('identical',0)},
   {label:'仮番号を消す',text:m`$A_1,A_2$ だけを入れ替えた二列は、番号を消すと同じです。どの並びも $2!$ 回ずつ数えています。`,formulas:[],diagram:view('identical',1)},
   {label:'重複を割る',text:'一つの並びに対応する仮番号の付け方で割ります。',formulas:[],diagram:view('identical',2)},
   {label:'経路を歩く順序へ',text:m`右へ $3$ 回、上へ $2$ 回進む最短経路は、五つの歩く向きの順序と一対一に対応します。`,formulas:[],diagram:view('path',0)},
   {label:'同じ向きどうしの入れ替え',text:m`右の三歩に付けた仮番号の $3!$ 通りと、上の二歩の仮番号の $2!$ 通りが、同じ経路に対応します。`,formulas:[],diagram:view('path',1)}
  ]
 },
 'ma-grouping':{
  title:'同じ分割をまとめる',goal:'組分けで割る必要があるか確かめます。',check:m`異なる $4$ 人 $A,B,C,D$ を二人ずつに分けます。`,
  steps:[
   {label:'先に選ぶペア',text:m`一方のペアを選ぶと、残りのペアは自動的に決まります。先に選ぶペアは $ {}_4C_2=6$ 通りです。`,formulas:[],diagram:view('grouping',0)},
   {label:'名前がない二組',text:m`先に $AB$ を選んでも $CD$ を選んでも同じ分割です。各枠を二度ずつ数えています。`,formulas:[],diagram:view('grouping',1)},
   {label:'組名がある場合',text:m`赤組 $AB$・白組 $CD$ と、赤組 $CD$・白組 $AB$ は違います。赤組を選ぶ $6$ 通りをそのまま数えます。`,formulas:[],diagram:view('grouping',2)},
   {label:'人数が違う場合',text:m`名前がなくても、二人組と三人組は人数で区別できます。二人組を選ぶと一つの分割に決まり、二で割りません。`,formulas:[m`{}_5C_2=10`]}
  ]
 },
 'ma-count-complement':{
  title:'女子が0人の組を除く',goal:'求める条件とその反対で、全体を分けます。',check:m`女子 $3$ 人・男子 $4$ 人から $3$ 人を選びます。`,
  steps:[
   {label:'全体を分ける',text:m`選んだ女子の人数は $0,1,2,3$ のどれかです。一つの組が二つの人数の場合に入ることはありません。`,formulas:[],diagram:view('complement',0)},
   {label:'少なくとも一人',text:m`求めるのは女子が $1,2,3$ 人の組。除くのは女子が $0$ 人、つまり全員男子の組だけです。`,formulas:[],diagram:view('complement',1)},
   {label:'全体から反対を引く',text:m`全体は $ {}_7C_3=35$ 通り、女子が $0$ 人の組は $ {}_4C_3=4$ 通りです。`,formulas:[],diagram:view('complement',2)},
   {label:'分けて足す方法と比べる',text:'残る三つの場合を直接足しても、同じ組を数えています。',formulas:[],diagram:view('complement',3)}
  ]
 }
};
