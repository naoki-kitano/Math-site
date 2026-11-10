import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;

export const math3SequenceCorrespondence:Record<string,FormulaLesson>={
 'm3-sequence-basics':{
  title:'添字が、足す範囲を決める',
  goal:'部分和の範囲と、部分和の差で残る項を対応させます。',
  check:m`$n$ は正の整数。$a_n$ は第 $n$ 項、$S_n$ は初項から第 $n$ 項までの和です。`,
  steps:[
   {label:'初項から二項分',text:m`項が $2,4,6$ と続く数列です。$S_2$ の添字 $2$ は、初項から二項分を足すことを表します。`,formulas:[],diagram:{kind:'sequence-range',stage:0}},
   {label:'共通の項を引く',text:m`$S_3$ から $S_2$ を引くと、共通の初項と第2項が消え、第3項だけが残ります。`,formulas:[],diagram:{kind:'sequence-cancellation',stage:0}},
   {label:'第n項を取り出す',text:m`一般の部分和でも、初項から第 $n-1$ 項までが共通です。差を取ると第 $n$ 項になります。`,formulas:[m`a_n=S_n-S_{n-1}\quad(n\ge2)`,m`a_1=S_1`]}
  ]
 },
 'm3-geometric-series':{
  title:'一項ずらして和を求める',
  goal:'等比数列の有限和を導いてから、その極限を考えます。',
  check:m`$N$ は正の整数。$r=1$ なら $S_N=Na$。$a=0$ なら全項が $0$ で、級数の和も $0$ です。`,
  steps:[
   {label:'各項に公比を掛ける',text:m`初項 $a$、公比 $r$ の最初の3項を考えます。和全体に $r$ を掛けると、各項が一つ先の項になります。`,formulas:[],diagram:{kind:'sequence-geometric',stage:0}},
   {label:'同じ項をそろえる',text:m`$rS_3$ を一項分右へずらすと、同じ項が縦にそろいます。二つの式を引くと、中間の項が消えます。`,formulas:[],diagram:{kind:'sequence-geometric',stage:1}},
   {label:'有限和を求める',text:m`$N$ 項でも同じように中間の項が消えます。$r\ne1$ なら、残った式の両辺を $1-r$ で割れます。`,formulas:[m`(1-r)S_N=a-ar^N`,m`S_N=\dfrac{a(1-r^N)}{1-r}`]},
   {label:'有限和の極限を取る',text:m`$a\ne0$ の場合、級数が収束する条件は $|r|<1$。このとき $r^N\to0$ なので、部分和の極限が求まります。`,formulas:[m`\lim_{N\to\infty}S_N=\dfrac{a}{1-r}\quad(|r|<1)`]}
  ]
 },
 'm3-sequence-radical-limit':{
  title:'二乗の差で同じ項を消す',
  goal:'根号の差を和と差の積に対応させ、消える項を確かめます。',
  check:m`$n$ は正の整数。掛ける和 $\sqrt{n^2+n}+n$ は正です。`,
  steps:[
   {label:'二つのまとまりを読む',text:m`$\sqrt{n^2+n}-n$ の極限を考えます。根号の部分を $A$、引く $n$ を $B$ とすると、和と差の積の公式が使えます。`,formulas:[m`({\color{#176c82}{A}}-{\color{#936114}{B}})({\color{#176c82}{A}}+{\color{#936114}{B}})={\color{#176c82}{A^2}}-{\color{#936114}{B^2}}`,m`{\color{#176c82}{A=\sqrt{n^2+n}}},\quad {\color{#936114}{B=n}}`]},
   {label:'値を変えずに和を掛ける',text:m`$A=\sqrt{n^2+n}$、$B=n$。$\dfrac{A+B}{A+B}=1$ を掛けるので、元の差の値は変わりません。`,formulas:[m`A-B=\dfrac{(A-B)(A+B)}{A+B}`,m`=\dfrac{A^2-B^2}{A+B}`]},
   {label:'二乗の差を計算する',text:m`分子は $(n^2+n)-n^2$ です。同じ $n^2$ が引き合い、$n$ が残ります。`,formulas:[],diagram:{kind:'sequence-radical-cancellation',stage:0}},
   {label:'分子と分母をnで割る',text:m`分子が $n$ になったので、分子・分母を正の $n$ で割ります。根号内では $n^2$ で割ります。`,formulas:[m`\dfrac{n}{\sqrt{n^2+n}+n}`,m`=\dfrac1{\sqrt{1+\dfrac1n}+1}`]},
   {label:'差の極限を求める',text:m`$n\to\infty$ で $\dfrac1n\to0$。分母は $2$ に近づくので、元の差の極限は $\dfrac12$ です。`,formulas:[m`\lim_{n\to\infty}\dfrac1{\sqrt{1+\dfrac1n}+1}=\dfrac12`]}
  ]
 },
 'm3-recurrence-limit':{
  title:'候補との差は等比数列',
  goal:'固定値の式を引く理由と、実際に収束する根拠を分けます。',
  check:m`$n$ は正の整数。$a_1=0$、$a_{n+1}=\dfrac{a_n+2}{2}$ の場合を考えます。`,
  steps:[
   {label:'変わらない値を求める',text:m`収束するなら、その極限 $L$ は漸化式に入れても変わりません。この方程式から得る値は、極限の候補です。`,formulas:[m`L=\dfrac{L+2}{2}`,m`L=2`]},
   {label:'同じ定数項を引く',text:m`元の式と、候補 $2$ が満たす式を引きます。同じ位置にある定数項 $1$ が消え、$2$ との差だけの関係になります。`,formulas:[],diagram:{kind:'sequence-recurrence-cancellation',stage:0}},
   {label:'差の一般項を求める',text:m`$2$ との差は、一つ進むたびに半分になります。最初の差は $a_1-2=-2$ なので、等比数列の一般項を使えます。`,formulas:[m`a_n-2=-2\left(\dfrac12\right)^{n-1}`]},
   {label:'収束を証明する',text:m`$\left(\dfrac12\right)^{n-1}\to0$ なので、$2$ との差は $0$ に近づきます。ここから、実際に $a_n\to2$ と分かります。`,formulas:[m`a_n=2-2\left(\dfrac12\right)^{n-1}`,m`\lim_{n\to\infty}a_n=2`]}
  ]
 }
};
