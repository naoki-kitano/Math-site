import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;
export const math2TrigCorrespondence:Record<string,FormulaLesson>={
 'trig-radians':{
  title:'半径とラジアン角を公式に入れる',goal:'扇形の面積を、円全体に対する割合から求めます。',
  check:m`半径 $r>0$、扇形の中心角は $0<\theta\le2\pi$。公式の角はラジアンです。`,
  steps:[
   {label:'一周に対する割合',text:m`半径 $3\,\mathrm{cm}$、中心角 $120^\circ$ の扇形です。一周の $\frac13$ なので、ラジアン角も $2\pi$ の $\frac13$ です。`,formulas:[m`\theta=\frac13\cdot2\pi=\frac{2\pi}3`]},
   {label:'面積の公式',text:m`円の面積 $\pi r^2$ に、一周に対する割合 $\frac{\theta}{2\pi}$ を掛けます。`,formulas:[m`S=\pi r^2\cdot\frac{\theta}{2\pi}`,m`=\frac12r^2\theta`]},
   {label:'角の位置へ入れる',text:m`$r=3$ とし、中心角 $\frac{2\pi}3$ を $\theta$ の位置に入れます。`,formulas:[],motion:{source:m`\theta={\color{#936114}{\frac{2\pi}3}}`,template:m`S=\frac12\cdot3^2\cdot{\color{#936114}{\theta}}`,target:m`S=\frac12\cdot3^2\cdot{\color{#936114}{\frac{2\pi}3}}`,parts:[{tex:m`\color{#936114}{\frac{2\pi}3}`,color:'#936114'}]}},
   {label:'面積を求める',text:m`面積は円全体 $9\pi\,\mathrm{cm}^2$ の三分の一です。`,formulas:[m`S=3\pi\,\mathrm{cm}^2`]}
  ]
 },
 'trig-identities':{
  title:'同じ因数を作って約分する',goal:'平方和の関係と、約分できる条件を結び付けます。',
  check:m`元の分母を $0$ にしないため、$\cos\theta\ne-1$ とします。`,
  steps:[
   {label:'使う平方和',text:m`$\frac{\sin^2\theta}{1+\cos\theta}$ を簡単にします。単位円の式から、正弦と余弦の平方和は $1$ です。`,formulas:[m`\sin^2\theta+\cos^2\theta=1`]},
   {label:'分子を直す',text:m`平方和の関係を使い、分子を余弦の式に直します。`,formulas:[m`{\color{#176c82}{\sin^2\theta}}={\color{#176c82}{1-\cos^2\theta}}`,m`\frac{\sin^2\theta}{1+\cos\theta}=\frac{1-\cos^2\theta}{1+\cos\theta}`]},
   {label:'共通する因数',text:m`和と差の積にすると、分母と同じ因数が見えます。`,formulas:[m`\frac{(1-\cos\theta){\color{#936114}{(1+\cos\theta)}}}{{\color{#936114}{1+\cos\theta}}}`]},
   {label:'同じ非零因数で割る',text:m`$1+\cos\theta\ne0$ なので、分子と分母をその因数で割れます。`,formulas:[m`\frac{\sin^2\theta}{1+\cos\theta}=1-\cos\theta`]}
  ]
 },
 'trig-graphs':{
  title:'同じ高さを取る入力を対応させる',goal:'式の中の引き算から、グラフの移動方向を読み取ります。',
  check:m`角はラジアン。$u,x$ は実数です。`,
  steps:[
   {label:'元の入力',text:m`$y=\sin u$ の点は $(u,\sin u)$。高さを変えずに $y=\sin(x-\frac\pi2)$ の点へ対応させます。`,formulas:[],diagram:{kind:'m2-trig-shift',stage:0}},
   {label:'中の角をそろえる',text:m`同じ正弦の値を使うため、中の角を元の入力 $u$ と同じにします。`,formulas:[m`x-\frac\pi2=u`,m`x=u+\frac\pi2`]},
   {label:'点の対応',text:m`横の座標に $\frac\pi2$ を足し、高さを保ちます。灰色の点に対応する青緑の点は、右へ $\frac\pi2$ の位置です。`,formulas:[],diagram:{kind:'m2-trig-shift',stage:1}},
   {label:'周期は保たれる',text:m`すべての点を同じだけ右へ動かすので、一周分の横幅 $2\pi$ は変わりません。`,formulas:[m`y=\sin\left(x-\frac\pi2\right)`]}
  ]
 },
 'trig-equations':{
  title:'中の角の全解を、元の角へ戻す',goal:'角の範囲と各解を、一対一に対応させます。',
  check:m`$0\le\theta<2\pi$。上端 $2\pi$ は含みません。`,
  steps:[
   {label:'角を置き換える',text:m`$\sin2\theta=0$ を解きます。$u=2\theta$ とすると、範囲の両端も $2$ 倍です。`,formulas:[m`0\le u<4\pi`],diagram:{kind:'m2-trig-double-range',stage:0}},
   {label:'二周分の全解',text:m`正弦は単位円の縦座標。縦が $0$ になる角を、二周分すべて取ります。`,formulas:[m`u=0,\pi,2\pi,3\pi`]},
   {label:'同じ列の角へ戻す',text:m`$\theta=\frac u2$ なので、上の各解を $2$ で割った角が下に対応します。右端の白丸は範囲外です。`,formulas:[],diagram:{kind:'m2-trig-double-range',stage:1}},
   {label:'元の角で答える',text:'四つの角が、指定範囲のすべての解です。',formulas:[m`\theta=0,\frac\pi2,\pi,\frac{3\pi}2`]}
  ]
 },
 'trig-inequalities':{
  title:'選んだ弧を、角の区間へ対応させる',goal:'同じ点に見える0と2πを、指定範囲の両端として区別します。',
  check:m`$0\le\theta<2\pi$ で $\cos\theta>\frac12$ を解きます。`,
  steps:[
   {label:'横の座標で選ぶ',text:m`余弦は横の座標なので、縦線 $x=\frac12$ より右の弧を選びます。境界の二点は含みません。`,formulas:[],diagram:{kind:'m2-trig-wrap',stage:0}},
   {label:'角の範囲を開いて見る',text:m`右側の弧は、指定範囲の初めと終わりに分かれます。$\cos0=1$ なので $0$ は含みますが、$2\pi$ は指定範囲にありません。`,formulas:[],diagram:{kind:'m2-trig-wrap',stage:1}},
   {label:'二つの区間で答える',text:m`境界 $\frac\pi3,\frac{5\pi}3$ では余弦が $\frac12$ なので、厳密な不等号では除きます。`,formulas:[m`0\le\theta<\frac\pi3`,m`\text{または}\quad\frac{5\pi}3<\theta<2\pi`]}
  ]
 },
 'trig-addition':{
  title:'二つの移動を、二つの積へ対応させる',goal:'加法定理の根拠と、公式の各因子への代入を追います。',
  check:m`この図では $\alpha=\frac\pi4$、$\beta=\frac\pi6$。加法定理は実数の角で成り立ちます。`,
  steps:[
   {label:'元の横と縦の移動',text:m`$\sin\frac{5\pi}{12}$ を求めます。$\alpha$ の点へ進む移動を、横の $\cos\alpha$ と縦の $\sin\alpha$ に分けます。`,formulas:[],diagram:{kind:'m2-trig-addition',stage:0,animated:true}},
   {label:'回した二つの縦の成分',text:m`両方の移動を $\beta$ だけ回します。青緑の移動の縦成分は $\cos\alpha\sin\beta$、黄土色は $\sin\alpha\cos\beta$。二つを足した高さが答えです。`,formulas:[m`\sin(\alpha+\beta)`,m`={\color{#936114}{\sin\alpha\cos\beta}}+{\color{#176c82}{\cos\alpha\sin\beta}}`],diagram:{kind:'m2-trig-addition',stage:1,animated:true}},
   {label:'一つ目の積',text:m`一般式の $\sin\alpha\cos\beta$ に、各角の値を入れます。同じ列が同じ因子に対応しています。`,formulas:[m`\frac{\sqrt2}2\cdot\frac{\sqrt3}2=\frac{\sqrt6}4`],diagram:{kind:'m2-trig-addition-factors',stage:0}},
   {label:'二つ目の積',text:m`次は $\cos\alpha\sin\beta$。角の順は同じまま、使う関数が入れ替わります。`,formulas:[m`\frac{\sqrt2}2\cdot\frac12=\frac{\sqrt2}4`],diagram:{kind:'m2-trig-addition-factors',stage:1}},
   {label:'二つの縦成分を足す',text:'加法定理の二つの積を足します。',formulas:[m`\sin\frac{5\pi}{12}=\frac{\sqrt6}4+\frac{\sqrt2}4`,m`=\frac{\sqrt6+\sqrt2}4`]}
  ]
 },
 'trig-double-half':{
  title:'半角の平方を求め、範囲から符号を選ぶ',goal:'二倍角の公式の中身を対応させ、平方と符号を分けて考えます。',
  check:m`この例は $\pi<\theta<2\pi$、$\cos\theta=-\frac35$。`,
  steps:[
   {label:'二倍角の公式から',text:m`$\sin\frac\theta2$ と $\cos\frac\theta2$ を求めます。$u=\frac\theta2$ と置くと、$2u=\theta$。二倍角の公式の二つの角を、それぞれ対応させます。`,formulas:[m`\cos({\color{#176c82}{2u}})=1-2\sin^2{\color{#936114}{u}}`,m`\cos{\color{#176c82}{\theta}}=1-2\sin^2{\color{#936114}{\frac\theta2}}`]},
   {label:'平方の値を取り出す',text:m`両辺を整理して、$2\sin^2\frac\theta2=1-\cos\theta$。$2$ で割ると平方の値が得られます。`,formulas:[m`\sin^2\frac\theta2=\frac{1-\cos\theta}2=\frac45`,m`\cos^2\frac\theta2=1-\frac45=\frac15`]},
   {label:'半角の範囲',text:m`元の範囲の各辺を $2$ で割ります。半角は第二象限なので、正弦は正、余弦は負です。`,formulas:[],diagram:{kind:'m2-trig-half-range',stage:0}},
   {label:'座標の符号を選ぶ',text:m`平方から分かる大きさに、半角の座標の符号を付けます。`,formulas:[m`\sin\frac\theta2=\frac{2\sqrt5}5`,m`\cos\frac\theta2=-\frac{\sqrt5}5`],diagram:{kind:'m2-trig-half-sign',stage:0}}
  ]
 },
 'trig-synthesis':{
  title:'同じ関数の係数をそろえる',goal:'合成する式と展開した式の、同じ役割の部分を対応させます。',
  check:m`$R>0$、$-\pi<\varphi\le\pi$ とします。`,
  steps:[
   {label:'展開して係数を読む',text:m`$\sqrt3\sin\theta+\cos\theta$ を合成します。$R\sin(\theta+\varphi)$ の展開で、$\sin\theta$ の係数は $R\cos\varphi$、$\cos\theta$ の係数は $R\sin\varphi$ です。`,formulas:[],diagram:{kind:'m2-trig-coefficients',stage:1}},
   {label:'係数を一致させる',text:'同じ列の係数を等しくします。二式を平方して足すと、平方和の関係を使えます。',formulas:[m`R\cos\varphi=\sqrt3`,m`R\sin\varphi=1`,m`R^2(\cos^2\varphi+\sin^2\varphi)=4`]},
   {label:'大きさと角を求める',text:m`平方和は $1$ なので $R^2=4$。$R>0$ より $R=2$。各係数を $2$ で割ると、位相角が決まります。`,formulas:[m`\cos\varphi=\frac{\sqrt3}2`,m`\sin\varphi=\frac12`,m`\varphi=\frac\pi6`]},
   {label:'一つの正弦で表す',text:'求めた大きさと角を、合成する式へ入れます。',formulas:[m`\sqrt3\sin\theta+\cos\theta`,m`=2\sin\left(\theta+\frac\pi6\right)`]}
  ]
 }
};
