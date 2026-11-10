import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;

export const math2ExplogCorrespondence:Record<string,FormulaLesson>={
 'exponent-extension':{
  title:'分数の指数が表す二つの操作',goal:m`$27^{\frac23}$ を根号で表して計算します。`,
  check:m`$a>0$、$m$ は整数、$n$ は正の整数です。`,
  steps:[
   {label:'分数指数の意味',text:'分母は何乗根か、分子はその値を何乗するかを表します。',formulas:[m`a^{\frac mn}=(\sqrt[n]{a})^m`]},
   {label:'分母は何乗根か',text:m`分母の $3$ は三乗根に対応します。`,formulas:[],motion:{source:m`27^{\frac{2}{\color{#176c82}{3}}}`,target:m`=(\sqrt[\color{#176c82}{3}]{27})^2`,parts:[{tex:'3',color:'#176c82',targetEdge:'left'}]}},
   {label:'分子は何乗か',text:m`分子の $2$ は、根を取った値全体の二乗に対応します。`,formulas:[],motion:{source:m`27^{\frac{\color{#936114}{2}}{3}}`,target:m`=(\sqrt[3]{27})^{\color{#936114}{2}}`,parts:[{tex:'2',color:'#936114'}]}},
   {label:'根を先に計算する',text:m`$3^3=27$ なので、三乗根は $3$ です。`,formulas:[m`27^{\frac23}=(\sqrt[3]{27})^2=3^2=9`]}
  ]
 },
 'exponent-laws':{
  title:'積と累乗のまとまり',goal:'指数を足す場合と、掛ける場合の理由を比べます。',check:m`$a>0$ とします。`,
  steps:[
   {label:'二つの積を合わせる',text:m`$a^2$ と $a^3$ を掛けると、$a$ が合わせて五つになります。`,formulas:[],diagram:{kind:'m2-explog-product',stage:0}},
   {label:'同じまとまりを繰り返す',text:m`$(a^2)^3$ は $a^2$ を三つ掛けます。$a$ の個数は $2+2+2=2\cdot3$ です。`,formulas:[],diagram:{kind:'m2-explog-power',stage:0}},
   {label:'一般の指数',text:m`正の底では、同じ法則が実数の指数 $r,s$ にも成り立ちます。`,formulas:[m`a^ra^s=a^{r+s}`,m`(a^r)^s=a^{rs}`]}
  ]
 },
 'exponential-equations':{
  title:'繰り返す累乗を一つの文字にする',goal:m`$4^x-3\cdot2^x+2=0$ を二次方程式に直します。`,check:m`$x$ は実数。$t=2^x$ と置くと、必ず $t>0$ です。`,
  steps:[
   {label:'同じ累乗を見つける',text:m`$4=2^2$ なので、$4^x$ も $2^x$ を使って表せます。`,formulas:[m`4^x=(2^2)^x=(2^x)^2`,m`(2^x)^2-3(2^x)+2=0`]},
   {label:'対応する塊を置き換える',text:m`二か所の $2^x$ 全体を $t$ にします。二乗や係数はそのまま残ります。`,formulas:[],diagram:{kind:'m2-explog-substitution',stage:0}},
   {label:'候補を求める',text:m`二次方程式を解きます。候補 $1,2$ はどちらも $t>0$ を満たします。`,formulas:[m`t^2-3t+2=(t-1)(t-2)=0`,m`t=1,2`]},
   {label:'元の未知数へ戻す',text:m`求めたのは $t$ の値です。$t=2^x$ に戻して、$x$ を求めます。`,formulas:[m`\begin{aligned}t=1&\Rightarrow2^x=1\Rightarrow x=0\\t=2&\Rightarrow2^x=2\Rightarrow x=1\end{aligned}`]}
  ]
 },
 'logarithmic-graph':{
  title:'同じ真数になる位置を追う',goal:m`$y=\log_{\frac12}(x-2)$ が右へ移る理由を確かめます。`,check:m`移動後の関数では、真数は $x-2>0$、つまり $x>2$ です。`,
  steps:[
   {label:'真数を一つ決める',text:m`$y=\log_{\frac12}(x-2)$ を考えます。元の $y=\log_{\frac12}x$ は、真数が $1$ のとき高さが $0$。点 $(1,0)$ を通ります。`,formulas:[m`\log_{\frac12}1=0`]},
   {label:'同じ高さになるx',text:m`移動後も真数を $1$ にすれば、高さは $0$ のままです。$x-2=1$ を解くと $x=3$ になります。`,formulas:[],diagram:{kind:'m2-explog-shift',stage:0}},
   {label:'境界も同じだけ移る',text:m`真数が $0$ に近づく境界は $x=2$。点も漸近線も右へ $2$ 移り、底が $1$ 未満なので減少する形は変わりません。`,formulas:[],diagram:{kind:'m2-explog-shift',stage:1}}
  ]
 },
 'logarithmic-equations':{
  title:'真数条件と不等式を重ねる',goal:m`$\log_2(x-1)\le\log_2(5-x)$ を解きます。`,check:m`底は $2>1$。元の二つの真数は、どちらも正である必要があります。`,
  steps:[
   {label:'二つの真数条件',text:m`この不等式では、まず $x-1>0$ と $5-x>0$ を同時に満たす範囲を求めます。`,formulas:[m`\log_2(x-1)\le\log_2(5-x)`],diagram:{kind:'m2-explog-interval',stage:0}},
   {label:'増加性で比較する',text:m`底が $2>1$ なので、対数の大小は真数の大小と一致します。`,formulas:[m`x-1\le5-x\iff x\le3`],diagram:{kind:'m2-explog-interval',stage:1}},
   {label:'重なる部分を残す',text:m`$x=1$ では真数が $0$ なので除きます。$x=3$ では両真数が $2$ で等号が成り立つので含みます。`,formulas:[],diagram:{kind:'m2-explog-interval',stage:2}}
  ]
 },
 'common-logarithm':{
  title:'十の指数と、数字の位置',goal:'対数から求めた範囲を、実際の位取りに対応させます。',check:m`この教材の $\log$ の底は $10$ です。`,
  steps:[
   {label:'整数の桁数',text:m`正の整数 $N$ で $2\le\log N<3$ なら、$100\le N<1000$。百・十・一の三つの位を持ちます。`,formulas:[],diagram:{kind:'m2-explog-digits',stage:0}},
   {label:'小数の最初の数字',text:m`$-4\le\log q<-3$ なら、$0.0001\le q<0.001$。小数第三位までは $0$ で、第四位が最初のゼロでない数字です。`,formulas:[],diagram:{kind:'m2-explog-digits',stage:1}},
   {label:'与えられた上下限で判断する',text:m`$0.30102<\log2<0.30104$ なら、下の範囲は整数の境界をまたぎません。$2^{10}$ は四桁と確定できます。`,formulas:[m`3.0102<\log(2^{10})<3.0104`,m`10^3<2^{10}<10^4`]}
  ]
 }
};
