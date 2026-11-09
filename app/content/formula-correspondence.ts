const m=String.raw;

type FormulaStep={label:string; text:string; formulas:string[]};
type FormulaLesson={title:string; goal:string; check:string; steps:FormulaStep[]};

// Each displayed line remains a true equation. Color identifies the particular
// part being followed, not a general rule for every appearance of a symbol.
export const formulaCorrespondence:Record<string,FormulaLesson>={
 "logarithm-base-change":{
  title:"真数と底の行き先",goal:m`$\log_a b$ を、別の底 $c$ を使って表します。`,
  check:m`$a,c>0$、$a,c\ne1$、$b>0$ です。新しい底 $c$ は分子・分母で同じです。`,
  steps:[
   {label:"元の式",text:m`$a$ は底、$b$ は真数です。`,formulas:[]},
   {label:"真数を分子へ",text:m`元の真数 $b$ は、分子の対数の真数になります。`,formulas:[]},
   {label:"底を分母へ",text:m`元の底 $a$ は、分母の対数の真数になります。`,formulas:[]},
   {label:"新しい底をそろえる",text:m`分子と分母の底を、ともに $c$ にします。`,formulas:[]},
  ],
 },
 "logarithm-laws":{
  title:"真数の積と対数の和",goal:m`真数を掛けた式と、二つの対数の和を見比べます。`,
  check:m`$a>0$、$a\ne1$、$M,N>0$ です。真数の和 $M+N$ を同じように分けることはできません。`,
  steps:[
   {label:"真数を分けて見る",text:m`真数の積を $M$ と $N$ の二つに分けて見ます。`,formulas:[m`\log_a({\color{#176c82}{M}}\,{\color{#936114}{N}})`]},
   {label:"それぞれの対数",text:m`真数の積が、同じ底の対数の和に対応します。`,formulas:[m`\log_a({\color{#176c82}{M}}\,{\color{#936114}{N}})=\log_a{\color{#176c82}{M}}+\log_a{\color{#936114}{N}}`]},
   {label:"指数で理由を確かめる",text:m`$M=a^p$、$N=a^q$ なら、積では指数が $p+q$ になります。`,formulas:[m`MN=a^p a^q=a^{p+q}`,m`\log_a(MN)=p+q=\log_a M+\log_a N`]},
  ],
 },
 "m1-completing-square":{
  title:"平方を作り、増えた数を補う",goal:m`$x^2+6x+2$ の値を変えずに、平方の形に直します。`,
  check:"同じ数を足して引いているので、どの実数を入れても式の値は変わりません。",
  steps:[
   {label:"係数を半分にする",text:m`一次の係数 $6$ の半分は $3$。平方の括弧に入れます。`,formulas:[m`x^2+{\color{#176c82}{6}}x+2`,m`(x+{\color{#176c82}{3}})^2=x^2+6x+9`]},
   {label:"増えた数を補う",text:m`平方の中で増えた $9$ を引き、元の $2$ を残します。`,formulas:[m`x^2+6x+2=(x+3)^2-{\color{#936114}{9}}+2`]},
   {label:"定数をまとめる",text:m`$-9+2=-7$ なので、平方完成は次のようになります。`,formulas:[m`x^2+6x+2=(x+3)^2-7`]},
  ],
 },
 "m1-completing-square-coefficient":{
  title:"外の係数を補正にも掛ける",goal:m`$2x^2+8x+1$ を平方完成します。`,
  check:"括弧の中のすべての項に、外の係数を掛けます。",
  steps:[
   {label:"係数をくくる",text:m`二次と一次の項から $2$ をくくります。`,formulas:[m`2x^2+8x+1=2(x^2+4x)+1`]},
   {label:"平方を作る",text:m`括弧の中に増える $4$ を、括弧の中で引きます。`,formulas:[m`2(x^2+4x)+1=2\{(x+2)^2-{\color{#936114}{4}}\}+1`]},
   {label:"補正にも掛ける",text:m`括弧の中の $-4$ にも、外の $2$ が掛かります。`,formulas:[m`2\{(x+2)^2-{\color{#936114}{4}}\}+1=2(x+2)^2-{\color{#936114}{8}}+1`,m`=2(x+2)^2-7`]},
  ],
 },
 "m3-chain-rule":{
  title:"内側を残し、内側の微分を掛ける",goal:m`$(2x+1)^3$ の外側と内側を分けて微分します。`,
  check:"各関数が対応する点で微分可能なとき、合成関数の微分を使えます。",
  steps:[
   {label:"内側を一まとまりに",text:m`内側全体を $u=2x+1$ と置くと、外側は $u$ の三乗です。`,formulas:[m`u={\color{#176c82}{2x+1}},\qquad y=u^3`]},
   {label:"外側を微分する",text:m`外側を微分した $3u^2$ の $u$ に、内側をそのまま戻します。`,formulas:[m`\dfrac{dy}{du}=3u^2`,m`3u^2=3({\color{#176c82}{2x+1}})^2`]},
   {label:"内側の微分を掛ける",text:m`内側の微分は $2$。これを別の因子として掛けます。`,formulas:[m`\dfrac{du}{dx}={\color{#936114}{2}}`,m`\dfrac{dy}{dx}=3({\color{#176c82}{2x+1}})^2\cdot{\color{#936114}{2}}`]},
  ],
 },
 "m3-product-derivative":{
  title:"一方ずつ微分して二つの項を作る",goal:m`$xe^x$ を、二つの因子の積として微分します。`,
  check:"二つの因子がともに微分可能なとき、積の微分の公式を使えます。",
  steps:[
   {label:"二つの因子",text:m`$x$ と $e^x$ を、それぞれ別の因子として見ます。`,formulas:[m`y={\color{#176c82}{x}}\,{\color{#936114}{e^x}}`]},
   {label:"左の因子を微分",text:m`$x$ を微分し、$e^x$ は残します。`,formulas:[m`({\color{#176c82}{x}})'\,{\color{#936114}{e^x}}=1\cdot e^x`]},
   {label:"右の因子も微分",text:m`今度は $x$ を残し、$e^x$ を微分した項も足します。`,formulas:[m`y'=({\color{#176c82}{x}})'e^x+x({\color{#936114}{e^x}})'`,m`=e^x+xe^x`]},
  ],
 },
 "m3-substitution-integrals":{
  title:"式と微分を一緒に置き換える",goal:m`$\int x\sqrt{x^2+1}\,dx$ の中身を別の文字に置き換えます。`,
  check:"不定積分は元の変数に戻し、積分定数を付けます。置換の根拠は合成関数の微分です。",
  steps:[
   {label:"中身を置く",text:m`根号の中身を $t=x^2+1$ と置きます。`,formulas:[m`t={\color{#176c82}{x^2+1}}`,m`\int x\sqrt{{\color{#176c82}{x^2+1}}}\,dx`]},
   {label:"微分も置き換える",text:m`$dt=2x\,dx$ なので、$x\,dx=\dfrac12dt$ です。`,formulas:[m`{\color{#936114}{x\,dx}}=\dfrac12dt`,m`\int x\sqrt{x^2+1}\,dx=\dfrac12\int\sqrt t\,dt`]},
   {label:"積分して元に戻す",text:m`積分した後、$t$ を $x^2+1$ に戻します。`,formulas:[m`\dfrac12\int\sqrt t\,dt=\dfrac13t^{\frac32}+C`,m`=\dfrac13({\color{#176c82}{x^2+1}})^{\frac32}+C`]},
  ],
 },
};
