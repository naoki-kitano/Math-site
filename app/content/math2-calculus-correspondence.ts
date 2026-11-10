import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;
const teal='#176c82',ochre='#936114';
const t=(s:string)=>m`{\color{#176c82}{${s}}}`;
const o=(s:string)=>m`{\color{#936114}{${s}}}`;

export const math2CalculusCorrespondence:Record<string,FormulaLesson>={
 'average-rate':{
  title:'縦の変化を、横の変化で割る',goal:'図の二つの変化量を分数へ対応させます。',check:m`$f(x)=x^2$、始めは $a=1$、終わりは $b=3$。分子と分母を同じ順に引きます。`,
  steps:[
   {label:'横と縦の変化',text:m`$f(x)=x^2$ の $x=1$ から $3$ までを見ます。横は $3-1=2$、縦は $9-1=8$ 変わります。`,formulas:[],diagram:{kind:'m2-calculus-average',stage:0}},
   {label:'分子と分母へ',text:'縦の変化を分子、横の変化を分母へ入れます。',formulas:[],motion:{source:m`\begin{aligned}f(3)-f(1)&=${t('8')}\\3-1&=${o('2')}\end{aligned}`,template:m`\dfrac{${t('f(3)-f(1)')}}{${o('3-1')}}`,target:m`\dfrac{${t('8')}}{${o('2')}}=4`,parts:[{tex:m`\color{#176c82}{8}`,color:teal},{tex:m`\color{#936114}{2}`,color:ochre,targetEdge:'right'}]}},
   {label:'二点を結ぶ傾き',text:m`横の変化 $1$ あたり、縦は平均して $4$ 変わります。二点を結ぶ直線の傾きです。`,formulas:[m`\dfrac{f(b)-f(a)}{b-a}=4`],diagram:{kind:'m2-calculus-average',stage:1}},
  ],
 },
 'derivative-at-point':{
  title:'幅を小さくして、接線の傾きへ',goal:'割線の幅と差商を一緒に追います。',check:m`$f(x)=x^2$、固定する点は $(2,4)$。割線では $h\ne0$ です。`,
  steps:[
   {label:'二点の傾き',text:m`もう一つの点を $x=2+h$ に置きます。差商は、二点を結ぶ直線の傾きです。`,formulas:[m`\dfrac{f(2+h)-f(2)}h`],diagram:{kind:'m2-calculus-secant',stage:0}},
   {label:'同じ幅で割る',text:m`分子から幅 $h$ をくくります。$h\ne0$ なので約分できます。`,formulas:[m`\dfrac{${t('h')}(4+h)}{${t('h')}}=4+h`]},
   {label:'右から近づける',text:m`正の幅 $h$ を小さくすると、傾き $4+h$ は $4$ へ近づきます。図の数値は近似値です。`,formulas:[],diagram:{kind:'m2-calculus-secant',stage:1,animated:true}},
   {label:'左からも近づける',text:m`負の $h$ もゼロへ近づけます。割線の傾き $4+h$ は、左からも $4$ へ近づきます。`,formulas:[],diagram:{kind:'m2-calculus-secant',stage:2,animated:true}},
   {label:'極限が接線の傾き',text:'左右からの行き先が同じなので、その値が微分係数です。',formulas:[m`f'(2)=\lim_{h\to0}(4+h)=4`],diagram:{kind:'m2-calculus-secant',stage:3}},
  ],
 },
 'derivative-function':{
  title:'点の文字を残して傾きを求める',goal:'差商の因子と、導関数の役割を対応させます。',check:m`$f(x)=x^2$。$x$ を固定し、$h\ne0$ で整理してから $h\to0$ とします。`,
  steps:[
   {label:'差を作る',text:'幅に対応する因子を取り出します。',formulas:[m`f(x+h)-f(x)=2xh+h^2`,m`=${t('h')}(2x+h)`]},
   {label:'幅を約分する',text:m`分子全体と分母を、同じ $h$ で割ります。`,formulas:[m`\dfrac{f(x+h)-f(x)}h`,m`=\dfrac{${t('h')}(2x+h)}{${t('h')}}=2x+h`]},
   {label:'傾きの関数',text:m`どの $x$ でも、幅をゼロへ近づけると傾きは $2x$ です。`,formulas:[m`f'(x)=\lim_{h\to0}(2x+h)=2x`]},
   {label:'点を決めた傾き',text:m`$x=3$ での傾きは、導関数に $3$ を入れた $6$。点の高さは元の関数に入れた $9$ です。`,formulas:[m`f'(3)=2\cdot3=6`,m`f(3)=3^2=9`]},
  ],
 },
 'polynomial-differentiation':{
  title:'元の項と、微分した項',goal:'項の位置を変えずに微分の対応を見ます。',check:m`$f(x)=3x^2-2x+4$ を微分します。定数項の微分は $0$ です。`,
  steps:[
   {label:'元の三つの項',text:m`$3x^2-2x+4$ を、符号を含む三つの項として見ます。`,formulas:[m`f(x)=${t('3x^2')}${o('-2x')}+4`]},
   {label:'同じ順に微分する',text:'各項の下に、微分した結果を並べます。',formulas:[m`\begin{array}{c|ccc}&${t('3x^2')}&${o('-2x')}&4\\\hline \text{微分}&${t('6x')}&${o('-2')}&0\end{array}`]},
   {label:'次数を係数へ掛ける',text:m`$x^2$ の指数 $2$ が係数へ掛かり、指数は $1$ になります。`,formulas:[m`(3x^{${t('2')}})'=3\cdot${t('2')}x^{2-1}=6x`,m`f'(x)=6x-2`]},
  ],
 },
 'tangent-line':{
  title:'接点と傾きを、直線の式へ',goal:'a、f(a)、f′(a)の役割を区別します。',check:m`$f(x)=x^2+1$ の $x=2$ における接線です。`,
  steps:[
   {label:'接点からの縦横の差',text:m`横の位置を $a$、点の高さを $f(a)$、傾きを $f'(a)$ とします。`,formulas:[m`y-${t('f(a)')}=${o("f'(a)")}(x-a)`]},
   {label:'横の位置を入れる',text:m`接点の横座標は $a=2$。その位置で高さと傾きを求めます。`,formulas:[m`y-f(2)=f'(2)(x-2)`]},
   {label:'高さを入れる',text:m`元の式に入れると $f(2)=5$。縦の差の位置へ入れます。`,formulas:[],motion:{source:m`f(2)=${t('5')}`,template:m`y-${t('f(2)')}=f'(2)(x-2)`,target:m`y-${t('5')}=f'(2)(x-2)`,parts:[{tex:m`\color{#176c82}{5}`,color:teal}]}},
   {label:'傾きを入れる',text:m`導関数は $f'(x)=2x$ なので、傾き $f'(2)=4$ を横の差へ掛けます。`,formulas:[],motion:{source:m`f'(2)=${o('4')}`,template:m`y-5=${o("f'(2)")}(x-2)`,target:m`y-5=${o('4')}(x-2)`,parts:[{tex:m`\color{#936114}{4}`,color:ochre}]}},
   {label:'式を整理する',text:m`接点 $(2,5)$ を通り、傾きが $4$ の直線です。`,formulas:[m`y=4x-3`]},
  ],
 },
 'derivative-sign':{
  title:'因子の符号から、曲線の向きへ',goal:'一つの区間で、因子・導関数・増減を対応させます。',check:m`$f(x)=-x^3+3x+1$、$f'(x)=-3(x+1)(x-1)$ です。`,
  steps:[
   {label:'区切りを求める',text:m`導関数が $0$ になる $x=-1,1$ で、符号が変わる可能性があります。`,formulas:[m`f'(x)=-3(x+1)(x-1)`]},
   {label:'左の区間',text:m`$x<-1$ では二因子が負。係数 $-3$ も掛けるので、導関数は負です。`,formulas:[],diagram:{kind:'m2-calculus-signs',stage:0}},
   {label:'中央の区間',text:m`$-1<x<1$ では二因子が異符号。係数 $-3$ を掛けると、導関数は正です。`,formulas:[],diagram:{kind:'m2-calculus-signs',stage:1}},
   {label:'右の区間',text:m`$x>1$ では二因子が正。係数 $-3$ を掛けるので、導関数は負です。`,formulas:[],diagram:{kind:'m2-calculus-signs',stage:2}},
  ],
 },
 'local-extrema':{
  title:'向きが変わる点の高さ',goal:'符号の変化を極値の位置へ結びます。',check:m`$f(x)=x^3-3x$、$f'(x)=3(x+1)(x-1)$。極値の高さは元の関数で求めます。`,
  steps:[
   {label:'増加から減少へ',text:m`$x=-1$ で導関数の符号が正から負へ変わります。高さ $f(-1)=2$ が極大値です。`,formulas:[],diagram:{kind:'m2-calculus-extrema',stage:0}},
   {label:'減少から増加へ',text:m`$x=1$ では負から正へ変わります。高さ $f(1)=-2$ が極小値です。`,formulas:[],diagram:{kind:'m2-calculus-extrema',stage:1}},
   {label:'符号が変わらない場合',text:m`$y=x^3$ は $x=0$ で微分係数が $0$ でも、両側で増加します。極値ではありません。`,formulas:[m`(x^3)'=3x^2`]},
  ],
 },
 'graph-sketch':{
  title:'増減表の欄を、曲線の場所へ',goal:'横の位置・高さ・向きを対応させます。',check:m`$f(x)=x^3-3x$、$f'(x)=3(x+1)(x-1)$ です。`,
  steps:[
   {label:'山の場所と高さ',text:m`表の $x=-1$ と $f(x)=2$ を、点 $(-1,2)$ へ対応させます。`,formulas:[],diagram:{kind:'m2-calculus-extrema',stage:0}},
   {label:'谷の場所と高さ',text:m`表の $x=1$ と $f(x)=-2$ を、点 $(1,-2)$ へ対応させます。`,formulas:[],diagram:{kind:'m2-calculus-extrema',stage:1}},
   {label:'区間の向きをつなぐ',text:m`$x<-1$ で上がり、$-1<x<1$ で下がり、$x>1$ で上がります。`,formulas:[],diagram:{kind:'m2-calculus-extrema',stage:2}},
  ],
 },
 'closed-interval-extrema':{
  title:'区間内の候補と、両端を比べる',goal:'候補を区間に置いてから値を比較します。',check:m`$f(x)=x^3-3x$ の閉区間 $0\le x\le2$。多項式はこの区間で連続です。`,
  steps:[
   {label:'内部の候補を選ぶ',text:m`$f'(x)=0$ の解は $-1,1$。この区間の内部にあるのは $1$ です。`,formulas:[],diagram:{kind:'m2-calculus-interval',stage:0}},
   {label:'両端も加える',text:m`端で最大・最小になることもあるため、$0,1,2$ の値を比べます。`,formulas:[],diagram:{kind:'m2-calculus-interval',stage:1}},
   {label:'値を比較する',text:m`最小値は $x=1$ のとき $-2$、最大値は $x=2$ のとき $2$ です。`,formulas:[m`\begin{array}{c|ccc}x&0&1&2\\\hline f(x)&0&-2&2\end{array}`]},
  ],
 },
 'polynomial-integrals':{
  title:'新しい次数で割る理由',goal:'積分の分母と、微分で掛かる係数を対応させます。',check:m`実数全体の多項式を扱います。$C$ は任意の実数です。`,
  steps:[
   {label:'微分して戻る形',text:m`$3x^2$ の原始関数を探します。指数を一つ上げた $x^3$ を微分すると、係数 $3$ が掛かります。`,formulas:[m`(x^{${t('3')}})'=${t('3')}x^2`]},
   {label:'同じ次数で割る',text:m`新しい次数 $3$ で係数を割れば、微分で掛かる $3$ と打ち消し合います。`,formulas:[m`\left(\dfrac{3}{${t('3')}}x^3\right)'=\dfrac{3}{${t('3')}}\cdot${t('3')}x^2=3x^2`]},
   {label:'各項に対応させる',text:m`$3x^2-2x+1$ を同じ順に積分します。一次の項は新しい次数 $2$ で割ります。`,formulas:[m`\begin{aligned}\int3x^2\,dx&=\dfrac33x^3+C\\\int(-2x)\,dx&=\dfrac{-2}{2}x^2+C\\\int1\,dx&=x+C\end{aligned}`]},
   {label:'定数をまとめる',text:'任意定数を一つにまとめます。',formulas:[m`\int(3x^2-2x+1)\,dx`,m`=x^3-x^2+x+C`]},
  ],
 },
 'integral-constant':{
  title:'点の条件で、定数を決める',goal:'横の位置と関数値を、それぞれの代入先へ対応させます。',check:m`実数全体で $F'(x)=2x-2$、$F(1)=2$ を満たす関数を求めます。`,
  steps:[
   {label:'定数を残す',text:'導関数だけでは縦の位置は決まりません。',formulas:[m`F(x)=x^2-2x+C`]},
   {label:'横の位置を入れる',text:m`$F(1)=2$ の $1$ は横の位置です。積分した式の $x$ に入れます。`,formulas:[m`F(${t('1')})=${t('1')}^2-2\cdot${t('1')}+C`]},
   {label:'関数値を入れる',text:m`同じ条件の $2$ は関数値です。$F(1)$ の位置に入れます。`,formulas:[],motion:{source:m`F(1)=${o('2')}`,template:m`${o('F(1)')}=1-2+C`,target:m`${o('2')}=-1+C`,parts:[{tex:m`\color{#936114}{2}`,color:ochre}]}},
   {label:'両方の条件を確かめる',text:m`$C=3$。微分すると $2x-2$、$x=1$ を入れると $2$ になります。`,formulas:[m`F(x)=x^2-2x+3`]},
  ],
 },
 'definite-integrals':{
  title:'上端の値から、下端の値全体を引く',goal:'端点と原始関数の値を分けて対応させます。',check:m`$\displaystyle\int_{-1}^{1}(2x-1)\,dx$ を求めます。原始関数は $F(x)=x^2-x$ です。`,
  steps:[
   {label:'二つの端の役割',text:m`上端 $b$ を先、下端 $a$ を後に置きます。`,formulas:[m`\int_a^b f(x)\,dx=F(${t('b')})-F(${o('a')})`]},
   {label:'上端の値',text:m`上端は $1$。原始関数に入れると $F(1)=0$ です。`,formulas:[],motion:{source:m`F(1)=${t('0')}`,template:m`${t('F(1)')}-F(-1)`,target:m`${t('0')}-F(-1)`,parts:[{tex:m`\color{#176c82}{0}`,color:teal}]}},
   {label:'下端の値全体',text:m`下端は $-1$ ですが、原始関数の値は $F(-1)=2$。この $2$ 全体を引きます。`,formulas:[],motion:{source:m`F(-1)=(-1)^2-(-1)=${o('2')}`,template:m`0-\bigl(${o('F(-1)')}\bigr)`,target:m`0-\bigl(${o('2')}\bigr)=-2`,parts:[{tex:m`\color{#936114}{2}`,color:ochre}]}},
  ],
 },
 'definite-properties':{
  title:'隣り合う区間をつなぐ',goal:'共通の端で、原始関数の値が打ち消し合うことを見ます。',check:m`$f$ は区間 $[0,3]$ で連続、$F$ はその原始関数です。`,
  steps:[
   {label:'二つの区間',text:m`$0$ から $1$、$1$ から $3$ の定積分を、同じ向きにつなぎます。`,formulas:[],diagram:{kind:'m2-calculus-additivity',stage:0}},
   {label:'共通の端が消える',text:m`途中の端 $1$ は、一方の上端でもう一方の下端です。同じ $F(1)$ が足され、引かれます。`,formulas:[m`\begin{aligned}&[${t('F(1)')}-F(0)]\\&\quad+[F(3)-${t('F(1)')}]\\&=F(3)-F(0)\end{aligned}`]},
   {label:'全体の区間',text:'残るのは、全体の上端の値と下端の値の差です。',formulas:[m`\int_0^3f(x)\,dx`,m`=\int_0^1f(x)\,dx+\int_1^3f(x)\,dx`],diagram:{kind:'m2-calculus-additivity',stage:1}},
  ],
 },
 'area-with-axis':{
  title:'同じ二部分を、どう足すか',goal:'符号付きの定積分と面積を対応させます。',check:m`$y=x$ と軸の間を、$-1\le x\le1$ で考えます。`,
  steps:[
   {label:'符号付きの和',text:m`定積分では、軸の下を負として数えます。左と右が打ち消し合います。`,formulas:[m`\int_{-1}^1x\,dx=-\dfrac12+\dfrac12=0`],diagram:{kind:'m2-calculus-signed-area',stage:0}},
   {label:'面積の和',text:m`面積では、同じ二部分をどちらも正に数えます。`,formulas:[m`S=\dfrac12+\dfrac12=1`],diagram:{kind:'m2-calculus-signed-area',stage:1}},
   {label:'軸より下の高さ',text:m`左側では上が $0$、下が $x$。高さは $0-x=-x$ です。`,formulas:[m`S=\int_{-1}^0(-x)\,dx+\int_0^1x\,dx`],diagram:{kind:'m2-calculus-height-axis',stage:0}},
  ],
 },
 'area-between-curves':{
  title:'縦の長さを、積分する式へ',goal:'上の曲線と下の曲線を、差の二つの項へ対応させます。',check:m`$y=x$ と $y=x^2$ の間を、$0\le x\le2$ で考えます。交点は $(0,0),(1,1)$ です。`,
  steps:[
   {label:'左の区間の高さ',text:m`$0\le x\le1$ では $x-x^2=x(1-x)\ge0$。上が $x$、下が $x^2$ です。`,formulas:[m`S_{\text{左}}=\int_0^1\{${t('x')}-${o('x^2')}\}\,dx`],diagram:{kind:'m2-calculus-height-between',stage:0}},
   {label:'右の区間の高さ',text:m`$1\le x\le2$ では上下が入れ替わります。上が $x^2$、下が $x$ です。`,formulas:[m`S_{\text{右}}=\int_1^2\{${o('x^2')}-${t('x')}\}\,dx`],diagram:{kind:'m2-calculus-height-between',stage:1}},
   {label:'二つの面積を足す',text:'どちらも上から下を引いた非負の高さで計算します。',formulas:[m`S=\dfrac16+\dfrac56=1`]},
  ],
 },
};
