import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;

export const math3CalculusCorrespondence:Record<string,FormulaLesson>={
 'm3-trigonometric-limits':{
  title:'角と分母をそろえる',
  goal:'基本形と、その外に残る倍率を分けます。',
  check:m`角は弧度法。式の整理は $x\ne0$ で行い、最後に $x\to0$ とします。`,
  steps:[
   {label:'使う基本形',text:m`$\displaystyle\lim_{x\to0}\dfrac{\sin3x}{x}$ を求めます。基本形では、正弦の角と分母が同じ $u$ です。`,formulas:[m`\lim_{u\to0}\dfrac{\sin{\color{#176c82}{u}}}{{\color{#176c82}{u}}}=1`]},
   {label:'同じ中身にそろえる',text:m`$u=3x$ とすると、角と分母をともに $3x$ にした部分が基本形に対応します。`,formulas:[m`\dfrac{\sin{\color{#176c82}{3x}}}{{\color{#176c82}{3x}}}=\dfrac{\sin{\color{#176c82}{u}}}{{\color{#176c82}{u}}}`]},
   {label:'倍率を補う',text:m`分母を $x$ から $3x$ にすると値は $\dfrac13$ 倍になるので、外で $3$ 倍して元の値を保ちます。`,formulas:[m`\dfrac{\sin3x}{x}={\color{#936114}{3}}\cdot{\color{#176c82}{\dfrac{\sin3x}{3x}}}`]},
   {label:'基本形の極限を使う',text:m`$x\to0$ なら $3x\to0$。基本形の部分の極限が $1$ なので、外の倍率 $3$ が残ります。`,formulas:[],motion:{
    source:m`\lim_{u\to0}\dfrac{\sin u}{u}={\color{#176c82}{1}}`,
    template:m`\lim_{x\to0}\dfrac{\sin3x}{x}=3\cdot{\color{#176c82}{\lim_{x\to0}\dfrac{\sin3x}{3x}}}`,
    target:m`\lim_{x\to0}\dfrac{\sin3x}{x}=3\cdot{\color{#176c82}{1}}=3`,
    parts:[{tex:m`\color{#176c82}{1}`,color:'#176c82'}]
   }}
  ]
 },
 'm3-inverse-derivative':{
  title:'対応する入力で傾きを求める',
  goal:'元の関数と逆関数の入力を対応させます。',
  check:m`元の関数は近くで連続微分可能、一対一で $f'(a)\ne0$ とします。この例では $f(x)=x^2$、$x>0$ です。`,
  steps:[
   {label:'対応する点を使う',text:m`$f(x)=x^2$（$x>0$）の逆関数を $g$ とし、$g'(4)$ を求めます。$f(a)=b$ に対応する点で、傾きは逆数になります。`,formulas:[m`g'(b)=\dfrac1{f'(a)}`]},
   {label:'入力と出力を交換する',text:m`$f(2)=4$ なので、逆関数への入力 $4$ に対応する元の入力は $2$ です。`,formulas:[],motion:{
    source:m`f({\color{#176c82}{2}})={\color{#936114}{4}}`,
    template:m`g({\color{#936114}{b}})={\color{#176c82}{a}}`,
    target:m`g({\color{#936114}{4}})={\color{#176c82}{2}}`,
    parts:[{tex:m`\color{#176c82}{2}`,color:'#176c82'},{tex:m`\color{#936114}{4}`,color:'#936114'}]
   }},
   {label:'元の傾きの逆数を取る',text:m`$f'(x)=2x$ より $f'(2)=4\ne0$。$g'(4)$ の分母に、この元の傾きを入れます。`,formulas:[],motion:{
    source:m`f'(2)=2\cdot2={\color{#176c82}{4}}`,
    template:m`g'(4)=\dfrac1{{\color{#176c82}{f'(2)}}}`,
    target:m`g'(4)=\dfrac1{{\color{#176c82}{4}}}`,
    parts:[{tex:m`\color{#176c82}{4}`,color:'#176c82',targetEdge:'right'}]
   }}
  ]
 },
 'm3-parametric-derivative':{
  title:'縦と横の変化率を比べる',
  goal:'二つの変化率を、傾きの分子と分母へ対応させます。',
  check:m`両関数は微分可能で、横の変化率は近くで連続かつ注目点で $0$ でないとします。この例は $t>0$ です。`,
  steps:[
   {label:'傾きの公式',text:m`$x=t^2$、$y=t^3$（$t>0$）。傾きは、縦の変化率を横の変化率で割って求めます。`,formulas:[m`\dfrac{dy}{dx}=\dfrac{{\color{#176c82}{\dfrac{dy}{dt}}}}{{\color{#936114}{\dfrac{dx}{dt}}}}`]},
   {label:'分子は縦の変化率',text:m`$y=t^3$ を $t$ で微分します。その結果を、分子の $\dfrac{dy}{dt}$ に入れます。`,formulas:[],motion:{
    source:m`\dfrac{dy}{dt}={\color{#176c82}{3t^2}}`,
    template:m`\dfrac{dy}{dx}=\dfrac{{\color{#176c82}{\dfrac{dy}{dt}}}}{\dfrac{dx}{dt}}`,
    target:m`\dfrac{dy}{dx}=\dfrac{{\color{#176c82}{3t^2}}}{\dfrac{dx}{dt}}`,
    parts:[{tex:m`\color{#176c82}{3t^2}`,color:'#176c82'}]
   }},
   {label:'分母は横の変化率',text:m`$x=t^2$ を $t$ で微分します。分母の $\dfrac{dx}{dt}$ に入れ、$2t\ne0$ を確かめます。`,formulas:[],motion:{
    source:m`\dfrac{dx}{dt}={\color{#936114}{2t}}`,
    template:m`\dfrac{dy}{dx}=\dfrac{3t^2}{{\color{#936114}{\dfrac{dx}{dt}}}}`,
    target:m`\dfrac{dy}{dx}=\dfrac{3t^2}{{\color{#936114}{2t}}}`,
    parts:[{tex:m`\color{#936114}{2t}`,color:'#936114',targetEdge:'right'}]
   }},
   {label:'比を整理する',text:m`$t>0$ なので、分子と分母の共通因子 $t$ で割れます。`,formulas:[m`\dfrac{dy}{dx}=\dfrac{3t^2}{2t}=\dfrac{3t}{2}`]}
  ]
 },
 'm3-tangent-at-point':{
  title:'接点の高さと傾きを入れる',
  goal:'接点と傾きの異なる役割を、直線の式へ対応させます。',
  check:m`$\log$ は自然対数。$x>0$ で考え、接点 $a=1$ では有限な微分係数が存在します。`,
  steps:[
   {label:'点からの縦横の差',text:m`$y=\log x$ の $x=1$ における接線を求めます。接線上では、接点からの縦の差は横の差の $f'(a)$ 倍です。`,formulas:[m`y-f(a)=f'(a)(x-a)`]},
   {label:'元の関数で高さを求める',text:m`接点の横座標は $a=1$。高さ $f(1)=\log1=0$ を、縦の差の中に入れます。`,formulas:[],motion:{
    source:m`f(1)=\log1={\color{#176c82}{0}}`,
    template:m`y-{\color{#176c82}{f(1)}}=f'(1)(x-1)`,
    target:m`y-{\color{#176c82}{0}}=f'(1)(x-1)`,
    parts:[{tex:m`\color{#176c82}{0}`,color:'#176c82'}]
   }},
   {label:'導関数で傾きを求める',text:m`$f'(x)=\dfrac1x$ より $f'(1)=1$。横の差に掛ける傾きの位置へ入れます。`,formulas:[],motion:{
    source:m`f'(1)={\color{#936114}{1}}`,
    template:m`y-0={\color{#936114}{f'(1)}}(x-1)`,
    target:m`y-0={\color{#936114}{1}}(x-1)`,
    parts:[{tex:m`\color{#936114}{1}`,color:'#936114'}]
   }},
   {label:'接線の式',text:'高さと傾きを入れた式を整理します。',formulas:[m`y=x-1`]}
  ]
 }
};
