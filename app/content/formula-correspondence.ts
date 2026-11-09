import type {Transfer} from "../components/FormulaTransfer";
const m=String.raw;

type FormulaStep={label:string; text:string; formulas:string[];motion?:Transfer};
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

// Keep complete expressions visible; the moving copies show correspondence.
formulaCorrespondence['logarithm-laws'].steps[1].motion={
 source:m`\log_a({\color{#176c82}{M}}{\color{#936114}{N}})`,target:m`=\log_a{\color{#176c82}{M}}+\log_a{\color{#936114}{N}}`,
 parts:[{tex:m`\color{#176c82}{M}`,color:'#176c82'},{tex:m`\color{#936114}{N}`,color:'#936114'}]
};
formulaCorrespondence['m3-chain-rule'].steps[1].motion={
 source:m`u={\color{#176c82}{2x+1}}`,target:m`3({\color{#176c82}{2x+1}})^2`,parts:[{tex:m`\color{#176c82}{2x+1}`,color:'#176c82'}]
};
formulaCorrespondence['m3-chain-rule'].steps[2].motion={
 source:m`\dfrac{du}{dx}={\color{#936114}{2}}`,target:m`y'=3(2x+1)^2\cdot{\color{#936114}{2}}`,parts:[{tex:m`\color{#936114}{2}`,color:'#936114'}]
};
formulaCorrespondence['m3-substitution-integrals'].steps[1].motion={
 source:m`x\,dx={\color{#936114}{\dfrac12\,dt}}`,target:m`\int\sqrt t\,{\color{#936114}{\dfrac12\,dt}}`,parts:[{tex:m`\color{#936114}{\dfrac12\,dt}`,color:'#936114'}]
};
formulaCorrespondence['m3-substitution-integrals'].steps[2].motion={
 source:m`t={\color{#176c82}{x^2+1}}`,target:m`\dfrac13({\color{#176c82}{x^2+1}})^{\frac32}+C`,parts:[{tex:m`\color{#176c82}{x^2+1}`,color:'#176c82'}]
};
Object.assign(formulaCorrespondence,{
 'm3-quotient-derivative':{
  title:'分母を残す項から、分母を微分する項を引く',goal:'分子と分母の役割を見ます。',check:m`$u,v$ は微分可能、$v\ne0$。分母は $v^2$、分子は $u'v-uv'$ です。`,steps:[
   {label:'商を見る',text:m`$y=\dfrac uv$ の分子は $u$、分母は $v$ です。`,formulas:[m`y=\dfrac uv`]},
   {label:'分母を残す',text:m`分子を微分する項では、分母 $v$ を残します。`,formulas:[],motion:{source:m`y=\dfrac u{\color{#176c82}{v}}`,target:m`y'=\dfrac{u'{\color{#176c82}{v}}-uv'}{v^2}`,parts:[{tex:m`\color{#176c82}{v}`,color:'#176c82'}]}},
   {label:'分子を残す',text:m`分母を微分する項では、分子 $u$ を残します。この項全体を引きます。`,formulas:[],motion:{source:m`y=\dfrac{\color{#936114}{u}}v`,target:m`y'=\dfrac{u'v-{\color{#936114}{u}}v'}{v^2}`,parts:[{tex:m`\color{#936114}{u}`,color:'#936114'}]}}
  ]
 },
 'm3-endpoint-evaluation':{
  title:'上端の値から、下端の値を引く',goal:'原始関数に両端を代入します。',check:m`被積分関数が区間全体で連続なとき、原始関数 $F$ を使って $F(b)-F(a)$ と計算できます。`,steps:[
   {label:'原始関数',text:m`$\int_{-1}^2 x^2\,dx$ を求めます。原始関数は $F(x)=\dfrac{x^3}{3}$ です。`,formulas:[m`\left[\dfrac{x^3}{3}\right]_{-1}^2`]},
   {label:'両端を代入',text:m`上端 $b=2$ と下端 $a=-1$ を、それぞれ同じ式に代入します。`,formulas:[],motion:{source:m`b={\color{#176c82}{2}},\quad a={\color{#936114}{-1}}`,target:m`\dfrac{{\color{#176c82}{2}}^3}{3}-\dfrac{({\color{#936114}{-1}})^3}{3}`,parts:[{tex:m`\color{#176c82}{2}`,color:'#176c82'},{tex:m`\color{#936114}{-1}`,color:'#936114'}]}},
   {label:'下端の値を引く',text:m`下端の値は負です。括弧ごと引きます。`,formulas:[m`\dfrac83-\left(-\dfrac13\right)=3`]}
  ]
 },
 'm3-definite-substitution':{
  title:'式と一緒に、積分の両端も変える',goal:'置換した変数で上下端を求めます。',check:m`この例では $0\le x\le1$ で $t=x^2+1$ と置き、$dt=2x\,dx$ を使います。`,steps:[
   {label:'置換する',text:m`$\int_0^1 2x\sqrt{x^2+1}\,dx$ で、$t=x^2+1$ と置きます。`,formulas:[m`dt=2x\,dx`]},
   {label:'両端の対応',text:m`$x=0$ は $t=1$、$x=1$ は $t=2$ に対応します。`,formulas:[],motion:{source:m`x=0\longmapsto t={\color{#936114}{1}},\quad x=1\longmapsto t={\color{#176c82}{2}}`,target:m`\int_{{\color{#936114}{1}}}^{{\color{#176c82}{2}}}\sqrt t\,dt`,parts:[{tex:m`\color{#936114}{1}`,color:'#936114'},{tex:m`\color{#176c82}{2}`,color:'#176c82'}]}},
   {label:'新しい変数で計算',text:'式も両端も同じ変数になったので、そのまま計算します。',formulas:[m`\left[\dfrac23t^{\frac32}\right]_1^2`,m`=\dfrac23(2\sqrt2-1)`]}
  ]
 },
 'm3-parts-introduction':{
  title:'微分する因子と、積分する因子を選ぶ',goal:'積の微分を逆に使います。',check:m`区間上で $u,v$ が連続な導関数を持つとき、積の微分を積分して部分積分の公式を得ます。`,steps:[
   {label:'元の積分',text:m`$\int xe^x\,dx$ では、$x$ を微分し、$e^x$ を積分します。`,formulas:[m`u=x,\quad v'=e^x`,m`u'=1,\quad v=e^x`]},
   {label:'積の項と残る積分',text:m`$uv$ から $\int u'v\,dx$ を引きます。残る積分は簡単になります。`,formulas:[],motion:{source:m`u={\color{#176c82}{x}},\quad v={\color{#936114}{e^x}}`,target:m`\int xe^x\,dx={\color{#176c82}{x}}{\color{#936114}{e^x}}-\int e^x\,dx`,parts:[{tex:m`\color{#176c82}{x}`,color:'#176c82'},{tex:m`\color{#936114}{e^x}`,color:'#936114'}]}},
   {label:'残りを積分',text:'最後に微分して、元の被積分関数に戻ることを確かめます。',formulas:[m`xe^x-e^x+C`,m`(xe^x-e^x+C)'=xe^x`]}
  ]
 },
 'm3-moving-endpoints':{
  title:'端を代入し、その端の導関数を掛ける',goal:'上下端それぞれに合成関数の微分を使います。',check:m`$f$ は必要な区間で連続、上下端は微分可能とします。下端からの項には減号が付きます。`,steps:[
   {label:'動く上端',text:m`$G(x)=\int_0^{x^2}f(t)\,dt$ を微分します。上端は $x^2$ です。`,formulas:[m`G(x)=\int_0^{x^2}f(t)\,dt`]},
   {label:'上端を代入',text:m`上端 $x^2$ を $f$ に代入し、その導関数 $2x$ を掛けます。`,formulas:[],motion:{source:m`G(x)=\int_0^{{\color{#176c82}{x^2}}}f(t)\,dt`,target:m`G'(x)=f({\color{#176c82}{x^2}})\cdot2x`,parts:[{tex:m`\color{#176c82}{x^2}`,color:'#176c82'}]}},
   {label:'下端も動く場合',text:m`下端 $x$ からの項を引きます。`,formulas:[m`H(x)=\int_x^{x^2}f(t)\,dt`,m`H'(x)=f(x^2)\cdot2x-f(x)`]}
  ]
 }
} satisfies Record<string,FormulaLesson>);
formulaCorrespondence['m3-chain-rule'].steps[1].text=m`外側の $u^3$ を微分すると $3u^2$。$u$ に内側を戻します。`;
formulaCorrespondence['m3-substitution-integrals'].steps[2].text=m`$\dfrac12\int\sqrt t\,dt=\dfrac13t^{\frac32}+C$ を求めてから、元の変数に戻します。`;
formulaCorrespondence['m3-product-derivative'].steps=[
 formulaCorrespondence['m3-product-derivative'].steps[0],
 {label:'右を微分するとき',text:m`右の因子を微分する項では、左の $x$ を残します。`,formulas:[],motion:{source:m`y={\color{#176c82}{x}}e^x`,target:m`y'=(x)'e^x+{\color{#176c82}{x}}(e^x)'`,parts:[{tex:m`\color{#176c82}{x}`,color:'#176c82'}]}},
 {label:'左を微分するとき',text:m`左の因子を微分する項では、右の $e^x$ を残します。二つの項を足します。`,formulas:[],motion:{source:m`y=x{\color{#936114}{e^x}}`,target:m`y'=(x)'{\color{#936114}{e^x}}+x(e^x)'`,parts:[{tex:m`\color{#936114}{e^x}`,color:'#936114'}]}},
 {label:'微分を計算する',text:m`$(x)'=1$、$(e^x)'=e^x$ を入れます。`,formulas:[m`y'=1\cdot e^x+x\cdot e^x`,m`=e^x+xe^x`]}
];

// Bounds and fraction numerators are approached from the side to avoid crossing their operators.
formulaCorrespondence['m3-definite-substitution'].steps[1].motion!.parts[0].targetEdge='left';
formulaCorrespondence['m3-definite-substitution'].steps[1].motion!.parts[1].targetEdge='right';
formulaCorrespondence['m3-quotient-derivative'].steps[2].motion!.parts[0].sourceEdge='right';
formulaCorrespondence['m3-moving-endpoints'].steps[1].motion!.parts[0].sourceEdge='right';
