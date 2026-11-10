import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;
export const math1DataCorrespondence:Record<string,FormulaLesson>={
 'm1-histogram':{
  title:'同じ記録を、階級・柱・割合へ',goal:'階級に入る個数を数えます。',check:'各階級は下端を含み、上端を含みません。',
  steps:[
   {label:'元の記録',text:m`$12$ 人の所要時間から、$5$ 分以上 $10$ 分未満の人を調べます。同じ値も別の人の記録です。`,formulas:[],diagram:{kind:'m1-data-frequency',stage:0}},
   {label:'範囲で選ぶ',text:m`$5\le x<10$ に入るのは、二つの $5$ と一つの $8$。$10$ は次の階級に入ります。`,formulas:[],diagram:{kind:'m1-data-frequency',stage:1}},
   {label:'個数と割合',text:m`選んだ $3$ 人が柱の高さになり、全体 $12$ 人に占める割合の分子にもなります。`,formulas:[],diagram:{kind:'m1-data-frequency',stage:2}}
  ]
 },
 'm1-boxplot':{
  title:'上下の組の中央を、箱の位置へ',goal:'四分位数から箱ひげ図を作ります。',check:'奇数個では全体の中央値を除いて上下に分けます。ひげは最小値・最大値までです。',
  steps:[
   {label:'小さい順',text:m`記録 $8$、$1$、$5$、$2$、$7$、$4$、$9$ を小さい順に並べます。`,formulas:[],diagram:{kind:'m1-data-quartiles',stage:0}},
   {label:'全体の中央',text:m`$7$ 個の中央は第 $4$ 番目。その値 $5$ が第二四分位数 $Q_2$ です。`,formulas:[],diagram:{kind:'m1-data-quartiles',stage:1}},
   {label:'下半分の中央',text:m`第一四分位数 $Q_1$ は下半分の中央値です。下の三つの中央は $2$。`,formulas:[],diagram:{kind:'m1-data-quartiles',stage:2}},
   {label:'上半分の中央',text:m`第三四分位数 $Q_3$ は上半分の中央値です。上の三つの中央は $8$。`,formulas:[],diagram:{kind:'m1-data-quartiles',stage:3}},
   {label:'数直線の位置にする',text:m`$Q_1=2$ から $Q_3=8$ が箱、$Q_2=5$ が箱の中の線。最小値 $1$ と最大値 $9$ までひげを伸ばします。`,formulas:[],diagram:{kind:'m1-data-quartiles',stage:4}}
  ]
 },
 'm1-data-variance':{
  title:'各記録のずれを、二乗の平均へ',goal:'偏差と分散の意味を確かめます。',check:'',
  steps:[
   {label:'平均を基準にする',text:m`データは $2,4,4,6$。平均を $\bar x$ と書き、各記録のずれを測る基準にします。`,formulas:[],diagram:{kind:'m1-data-variance',stage:0}},
   {label:'各値から平均を引く',text:'偏差は各値から平均を引いた値です。正負のずれをそのまま足すと打ち消し合い、散らばりを測れません。',formulas:[],diagram:{kind:'m1-data-variance',stage:1}},
   {label:'ずれを二乗する',text:'二乗すると正負のずれをともに非負の量として数えられ、平均から離れるほど大きくなります。',formulas:[],diagram:{kind:'m1-data-variance',stage:2}},
   {label:'二乗した四つを平均する',text:m`分散 $s^2$ は偏差の二乗の平均です。表の二乗列の合計と、記録の個数を対応させます。`,formulas:[],diagram:{kind:'m1-data-variance',stage:3}}
  ]
 },
 'm1-variance-calculation':{
  title:'二乗と平均の順序を分ける',goal:'二つの平均の違いから分散を求めます。',check:m`$x_i$ は各記録、$\bar x$ はその平均、$s^2$ は分散です。`,
  steps:[
   {label:'二乗してから平均',text:m`データ $1,2,4,5$ の分散を求めます。各値を二乗してから平均した量を、$\overline{x^2}$ と書きます。`,formulas:[],diagram:{kind:'m1-data-moments',stage:0}},
   {label:'平均してから二乗',text:m`$(\bar x)^2$ は先に平均 $3$ を求め、その一つの数を二乗した量です。操作の順序が違います。`,formulas:[],diagram:{kind:'m1-data-moments',stage:1}},
   {label:'二つの量の差',text:'二乗の平均から平均の二乗を引くと、分散が得られます。次に、この式が成り立つ理由を確かめます。',formulas:[],diagram:{kind:'m1-data-moments',stage:2}},
   {label:'偏差の二乗を展開',text:'分散の定義にある偏差の二乗を、三つの項へ展開します。',formulas:[m`(x_i-\bar x)^2`,m`=x_i^2-2\bar x x_i+(\bar x)^2`]},
   {label:'各項を平均する',text:m`$x_i$ の平均は $\bar x$。同じ定数 $\bar x$ を使っているので、後ろの二項の平均は次のようになります。`,formulas:[m`-2\bar x\cdot\bar x+(\bar x)^2`,m`=-(\bar x)^2`]},
   {label:'定義と同じ量',text:'最初の項の平均は二乗の平均です。三項の平均を合わせると、もとの分散の定義と同じ量になります。',formulas:[m`s^2=\overline{x^2}-(\bar x)^2`]}
  ]
 },
 'm1-data-transformation':{
  title:'データと平均を、同じ変換で動かす',goal:'平均と散らばりの変化を比べます。',check:m`元の四つの記録は $2,4,4,6$。破線はその時点の平均です。`,
  steps:[
   {label:'元の位置',text:m`元の平均は $4$。各点と平均の差が偏差です。`,formulas:[],diagram:{kind:'m1-data-affine',stage:0,animated:true}},
   {label:'同じだけ足す',text:m`全ての値に $5$ を足すと、平均も $5$ 増えます。各点と平均が同じだけ動くので、偏差は変わりません。`,formulas:[],diagram:{kind:'m1-data-affine',stage:1,animated:true}},
   {label:'倍率を変える',text:m`元の値を $-2$ 倍すると、平均も $-2$ 倍。偏差の向きは反転し、平均からの距離は $2$ 倍になります。`,formulas:[],diagram:{kind:'m1-data-affine',stage:2,animated:true}},
   {label:'同じ値にする',text:m`$y=0x+7$ なら、どの記録も平均も $7$。偏差が全て $0$ になるので、分散・標準偏差も $0$ です。`,formulas:[],diagram:{kind:'m1-data-affine',stage:3,animated:true}},
   {label:'変換の項を対応させる',text:m`元の各値を $x_i$、変換後を $y_i=ax_i+b$ とすると、平均は $\bar y=a\bar x+b$。各値と平均から同じ $b$ が消えます。`,formulas:[m`y_i-\bar y`,m`=(ax_i+b)-(a\bar x+b)`,m`=a(x_i-\bar x)`]},
   {label:'二乗と距離の倍率',text:m`元と変換後の標準偏差を $s_x,s_y$ とします。偏差を二乗して平均すれば分散、さらに非負の平方根を取れば標準偏差です。`,formulas:[m`s_y^2=a^2s_x^2`,m`s_y=|a|s_x`]}
  ]
 },
 'm1-correlation-coefficient':{
  title:'同じ組の偏差から相関係数へ',goal:'散布図・偏差・相関係数を対応させます。',check:'相関係数は、両方の標準偏差が正のときに定義します。',
  steps:[
   {label:'平均を基準にする',text:m`対応する組は $(1,1)$、$(2,3)$、$(3,2)$。横と縦の平均はどちらも $2$ です。`,formulas:[],diagram:{kind:'m1-data-correlation',stage:0}},
   {label:'同じ行の偏差を掛ける',text:'一つの点が一つの対象です。横と縦を別の対象と組み替えず、同じ行の偏差を掛けます。',formulas:[],diagram:{kind:'m1-data-correlation',stage:1}},
   {label:'三つの集計を区別する',text:'分子には偏差の積の和を使います。分母には横と縦、それぞれの偏差の二乗和を使います。',formulas:[],diagram:{kind:'m1-data-correlation',stage:2}},
   {label:'役割に合わせて入れる',text:'積の和を、二つの二乗和の積の平方根で割ります。分母の二つの量はどちらも正です。',formulas:[],diagram:{kind:'m1-data-correlation',stage:3}},
   {label:'平均を使う公式との関係',text:m`偏差の積の平均を $s_{xy}$、横と縦の標準偏差を $s_x,s_y$ と書きます。この三組では $s_{xy}=\frac13$、$s_xs_y=\frac23$。分子・分母の個数分の割り算が打ち消し合います。`,formulas:[m`r=\frac{s_{xy}}{s_xs_y}`,m`=\frac{\frac13}{\frac23}=\frac12`]},
   {label:'値の意味',text:m`符号は傾向の向き、絶対値は直線的な関係の強さを表します。$r=0$ でも曲線的な関係は残ることがあるので、散布図も確かめます。`,formulas:[m`-1\le r\le1`]}
  ]
 },
 'm1-distribution-comparison':{
  title:'同じ箱ひげ図でも、平均は変わる',goal:'箱ひげ図に残る情報を確かめます。',check:'この教材では奇数個の全体の中央値を除いて上下に分け、ひげは最小値・最大値までです。',
  steps:[
   {label:'一つの記録だけ変える',text:m`二組目では、第三の記録だけを $2$ から $1$ に変えています。上下の組の中央と、全体の中央は変わりません。`,formulas:[],diagram:{kind:'m1-data-box-limits',stage:0}},
   {label:'合計は変わる',text:m`平均には全ての値の合計を使います。一つの値が $1$ 減ったので、二組の平均は異なります。`,formulas:[],diagram:{kind:'m1-data-box-limits',stage:1}},
   {label:'図から決まる量を読む',text:'五数要約が同じなので箱ひげ図は同じです。図に残っていない個々の記録は復元できず、平均も一般には決まりません。',formulas:[],diagram:{kind:'m1-data-box-limits',stage:2}}
  ]
 },
 'm1-hypothesis-thinking':{
  title:'観測以上の範囲を、全試行と比べる',goal:'仮定の下での珍しさを調べます。',check:m`各回独立、表の確率 $\frac12$ と仮定します。表が多い側を調べ、$5\%$ 以下なら仮定を疑うと事前に決めています。`,
  steps:[
   {label:'仮定の下で繰り返す',text:m`コインを $10$ 回投げて、表が $9$ 回出ました。仮定の下での $10$ 回投げを計算機で $10000$ 試行繰り返した結果と比べます。`,formulas:[],diagram:{kind:'m1-data-tail',stage:0}},
   {label:'観測以上を数える',text:m`表が出やすいかを調べるので、観測した $9$ 回だけでなく、それより多い $10$ 回も数えます。`,formulas:[],diagram:{kind:'m1-data-tail',stage:1}},
   {label:'全試行に占める割合',text:m`該当するのは $110$ 試行、全体は $10000$ 試行です。これは仮定の下での割合の推定です。`,formulas:[],diagram:{kind:'m1-data-tail',stage:2}},
   {label:'事前の基準で判断する',text:m`$1.1\%$ は事前の基準 $5\%$ 以下なので、仮定を疑う材料になります。仮定が必ず誤りだと断言する結果ではありません。`,formulas:[m`1.1\%\le5\%`]},
   {label:'結論の意味',text:'調べたのは、仮定が正しいとしたときのデータの珍しさです。仮定が正しい確率を計算したのではありません。また、基準に達しなくても仮定が正しいと証明されたことにはなりません。',formulas:[]}
  ]
 },
};
