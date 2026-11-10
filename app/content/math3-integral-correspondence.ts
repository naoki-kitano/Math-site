import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;

export const math3IntegralCorrespondence:Record<string,FormulaLesson>={
 'm3-definite-parts':{
  title:'境界の積と、残る積分を作る',
  goal:'部分積分の二つの項を、この積分で求めます。',
  check:m`$u,v$ は積分区間で連続な導関数を持つとします。両方の項で同じ上下端を使います。`,
  steps:[
   {label:'二つの項の役割',text:m`$I=\int_0^1xe^x\,dx$。$u=x$、$v'=e^x$ と選ぶと、$x$ の微分が $1$ になり、残る積分が簡単になります。`,formulas:[m`I=[uv]_0^1-\int_0^1u'v\,dx`]},
   {label:'境界で評価する積',text:m`$v'=e^x$ を積分して $v=e^x$。$uv=xe^x$ を、両端で評価する括弧に入れます。`,formulas:[],motion:{
    source:m`uv={\color{#176c82}{xe^x}}`,
    template:m`I=[{\color{#176c82}{uv}}]_0^1-\int_0^1u'v\,dx`,
    target:m`I=[{\color{#176c82}{xe^x}}]_0^1-\int_0^1u'v\,dx`,
    parts:[{tex:m`\color{#176c82}{xe^x}`,color:'#176c82'}]
   }},
   {label:'残る積分の中身',text:m`$u'=1$、$v=e^x$ なので、残る積分の中身 $u'v$ は $1\cdot e^x$ です。`,formulas:[],motion:{
    source:m`u'v={\color{#936114}{1\cdot e^x}}`,
    template:m`I=[xe^x]_0^1-\int_0^1{\color{#936114}{u'v}}\,dx`,
    target:m`I=[xe^x]_0^1-\int_0^1{\color{#936114}{1\cdot e^x}}\,dx`,
    parts:[{tex:m`\color{#936114}{1\cdot e^x}`,color:'#936114'}]
   }},
   {label:'両端で評価する',text:m`積の項は $[xe^x]_0^1=e$。残る積分は $[e^x]_0^1=e-1$ なので、その値全体を引きます。`,formulas:[m`I=e-(e-1)=1`]}
  ]
 },
 'm3-parametric-area':{
  title:'高さと横幅を、ともに置き換える',
  goal:'帯の高さと横幅を、同じ媒介変数で表します。',
  check:m`$0\le t\le1$ では $x=t^2$ は単調増加し、$y=t\ge0$。曲線を重複せず右向きにたどります。`,
  steps:[
   {label:'高さと横幅',text:m`$x=t^2$、$y=t$、$0\le t\le1$ の曲線と $x$ 軸の間の面積を考えます。高さ $y(t)$ に横方向の微小な変化 $dx=x'(t)dt$ を掛けて積分します。`,formulas:[m`S=\int_0^1y(t)x'(t)\,dt`]},
   {label:'高さを入れる',text:m`高さ $y(t)=t$ を、一つ目の因子に入れます。`,formulas:[],motion:{
    source:m`y(t)={\color{#176c82}{t}}`,
    template:m`S=\int_0^1{\color{#176c82}{y(t)}}x'(t)\,dt`,
    target:m`S=\int_0^1{\color{#176c82}{t}}x'(t)\,dt`,
    parts:[{tex:m`\color{#176c82}{t}`,color:'#176c82'}]
   }},
   {label:'横幅を入れる',text:m`$x=t^2$ の微分は $x'(t)=2t$。横幅 $dx=x'(t)dt$ 全体を $2t\,dt$ に置き換えます。`,formulas:[],motion:{
    source:m`dx={\color{#936114}{2t\,dt}}`,
    template:m`S=\int_0^1t\,{\color{#936114}{x'(t)\,dt}}`,
    target:m`S=\int_0^1t\,{\color{#936114}{2t\,dt}}`,
    parts:[{tex:m`\color{#936114}{2t\,dt}`,color:'#936114'}]
   }},
   {label:'積分する',text:m`高さ $t$ と横方向の変化率 $2t$ を掛けて、$0\le t\le1$ で積分します。`,formulas:[m`S=\int_0^1 2t^2\,dt=\dfrac23`]}
  ]
 },
 'm3-graph-length':{
  title:'縦横の変化から長さへ',
  goal:'線分の長さを、傾きと横幅で表します。',
  check:m`$f$ は区間で連続微分可能とします。$\Delta x>0$、$\Delta s$ は二点を結ぶ線分の長さです。`,
  steps:[
   {label:'三平方で一片を求める',text:m`$y=x^2$、$0\le x\le1$ を考えます。二点を結ぶ線分の長さは、横の変化 $\Delta x$ と縦の変化 $\Delta y$ から求められます。`,diagram:{kind:'arc-length',stage:0},formulas:[m`\Delta s=\sqrt{({\color{#176c82}{\Delta x}})^2+({\color{#936114}{\Delta y}})^2}`]},
   {label:'横幅を取り出す',text:m`$\Delta x>0$ なので、根号から $\Delta x$ を取り出せます。残る比 $\dfrac{\Delta y}{\Delta x}$ は線分の傾きです。`,diagram:{kind:'arc-length',stage:1},formulas:[m`\Delta s={\color{#176c82}{\Delta x}}\sqrt{1+\left(\dfrac{{\color{#936114}{\Delta y}}}{{\color{#176c82}{\Delta x}}}\right)^2}`]},
   {label:'線分の和の極限を取る',text:m`区間を細かくすると、線分の傾きは曲線の傾き $f'(x)$ へ近づきます。線分の長さの和の極限が曲線の長さです。`,diagram:{kind:'arc-length',stage:2},formulas:[m`\dfrac{\Delta y}{\Delta x}\longrightarrow f'(x)`,m`L=\int_0^1\sqrt{1+[f'(x)]^2}\,dx`]},
   {label:'傾きを公式に入れる',text:m`長さの式に入るのは縦の変化率 $f'(x)$。$f(x)=x^2$ を微分した $2x$ を入れます。`,formulas:[],motion:{
    source:m`f'(x)={\color{#176c82}{2x}}`,
    template:m`L=\int_0^1\sqrt{1+({\color{#176c82}{f'(x)}})^2}\,dx`,
    target:m`L=\int_0^1\sqrt{1+({\color{#176c82}{2x}})^2}\,dx`,
    parts:[{tex:m`\color{#176c82}{2x}`,color:'#176c82'}]
   }}
  ]
 }
};
