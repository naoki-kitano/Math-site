import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;
const blue='#176c82',ochre='#936114';
export const math1QuadraticCorrespondence:Record<string,FormulaLesson>={
 'm1-function-values':{title:'入力と出力を式につなぐ',goal:'',check:'',steps:[
  {label:'同じ入力',text:m`$f(x)=x^2-2x+3$ の $f(-1)$ を求めます。式のすべての $x$ に、同じ $-1$ を入れます。`,formulas:[m`f({\color{#176c82}{x}})={\color{#176c82}{x}}^2-2{\color{#176c82}{x}}+3`,m`f({\color{#176c82}{-1}})=({\color{#176c82}{-1}})^2-2({\color{#176c82}{-1}})+3`]},
  {label:'出力',text:m`負号も含めて二乗し、掛け算から計算します。`,formulas:[m`f(-1)=1+2+3=6`]},
  {label:'出力同士',text:m`$f(1)+f(2)$ は、二つの出力の和です。今の関数では $f(1)=2$、$f(2)=3$。`,formulas:[m`\underbrace{f(1)}_{2}+\underbrace{f(2)}_{3}=5`]}
 ]},
 'm1-domain-range':{title:'入力の端と出力の端',goal:'',check:m`ここでは $y=-x+2$、定義域は $0\le x<3$ です。`,steps:[
  {label:'含む端',text:m`定義域は使える入力の集合です。$x=0$ は含むので、対応する出力 $y=2$ も含みます。`,formulas:[m`x=0\ \longmapsto\ y=2`],diagram:{kind:'m1-quadratic-domain',stage:0,animated:false}},
  {label:'含まない端',text:m`$x=3$ は除いた境界です。近づける出力 $-1$ も除きます。`,formulas:[m`x\to3\ \longmapsto\ y\to-1`],diagram:{kind:'m1-quadratic-domain',stage:1,animated:false}},
  {label:'値域',text:m`この一次関数は減少し、両端の間の値をすべてとります。値域を小さい順に書きます。`,formulas:[m`-1<y\le2`],diagram:{kind:'m1-quadratic-domain',stage:2,animated:false}}
 ]},
 'm1-completing-square':{title:'平方の中間項と、増える数',goal:'',check:'',steps:[
  {label:'中間項を合わせる',text:m`$x^2+6x+2$ を平方完成します。$(x+p)^2$ の中間項は $px+px=2px$ なので、$2p=6$ に合わせます。`,formulas:[m`(x+p)^2=x^2+\underbrace{px+px}_{2px}+p^2`,m`2p=6\quad\Longrightarrow\quad p=3`]},
  {label:'半分を括弧へ',text:m`求めた $3$ を括弧に入れると、中間項は $6x$。新たに $3^2=9$ が加わります。`,formulas:[],motion:{source:m`p=\dfrac62={\color{#176c82}{3}}`,target:m`(x+{\color{#176c82}{3}})^2=x^2+6x+{\color{#936114}{9}}`,parts:[{tex:'3',color:blue}]}},
  {label:'増えた同じ数を引く',text:m`増えた $9$ を両辺から引けば、元の $x^2+6x$ に戻ります。`,formulas:[],motion:{source:m`(x+3)^2=x^2+6x+{\color{#936114}{9}}`,target:m`x^2+6x=(x+3)^2-{\color{#936114}{9}}`,parts:[{tex:'9',color:ochre}]}},
  {label:'元の定数を戻す',text:m`元からあった $2$ を加え、定数をまとめます。`,formulas:[m`\begin{aligned}x^2+6x+2&=(x+3)^2-9+2\\&=(x+3)^2-7\end{aligned}`]}
 ]},
 'm1-completing-square-coefficient':{title:'括弧の外の係数も保つ',goal:'',check:'',steps:[
  {label:'係数をくくる',text:m`$2x^2+8x+1$ を平方完成します。二次と一次の項から $2$ をくくると、括弧内の一次係数は $4$ です。`,formulas:[m`2x^2+8x+1=2(x^2+4x)+1`]},
  {label:'括弧内の平方',text:m`$(x+2)^2=x^2+4x+4$。括弧内で増えた $4$ を、同じ括弧内で引きます。`,formulas:[],motion:{source:m`(x+2)^2=x^2+4x+{\color{#936114}{4}}`,target:m`2(x^2+4x)+1=2\{(x+2)^2-{\color{#936114}{4}}\}+1`,parts:[{tex:'4',color:ochre}]}},
  {label:'外の係数を掛ける',text:m`外の $2$ は、平方の項にも補正 $-4$ にも掛かります。`,formulas:[],motion:{source:m`{\color{#176c82}{2}}\{(x+2)^2-4\}+1`,target:m`=2(x+2)^2+{\color{#176c82}{2}}(-4)+1`,parts:[{tex:'2',color:blue}]}},
  {label:'正の係数の結果',text:m`括弧の外では補正は $-8$。元の定数 $1$ と合わせます。`,formulas:[m`2(-4)+1=-7`,m`2x^2+8x+1=2(x+2)^2-7`]},
  {label:'外が負の場合',text:m`$-x^2+4x+3$ なら、$-(x^2-4x)+3$ とくくります。$(x-2)^2=x^2-4x+4$ なので、括弧内では同じ $4$ を引きます。`,formulas:[m`-x^2+4x+3=-\{(x-2)^2-4\}+3`]},
  {label:'負号と補正',text:m`外の $-1$ が内の $-4$ にも掛かり、補正は $+4$ になります。`,formulas:[],motion:{source:m`{\color{#176c82}{-1}}\{(x-2)^2-4\}+3`,target:m`=-(x-2)^2+({\color{#176c82}{-1}})(-4)+3`,parts:[{tex:'-1',color:blue}]}},
  {label:'負の係数の結果',text:m`$(-1)(-4)=4$ なので、定数は $4+3=7$ です。`,formulas:[m`-x^2+4x+3=-(x-2)^2+7`]}
 ]},
 'm1-determine-quadratic':{title:'頂点と通る点の役割',goal:'',check:m`二次関数なので $a\ne0$ です。`,steps:[
  {label:'頂点で位置を決める',text:m`頂点が $(1,-2)$、点 $(2,1)$ を通る二次関数を求めます。頂点は平方の形の位置を決めます。`,formulas:[m`y=a(x-{\color{#176c82}{1}})^2{\color{#936114}{-2}}`],diagram:{kind:'m1-quadratic-conditions',stage:0,animated:false}},
  {label:'通る点を式へ',text:m`通る点 $(2,1)$ は、$x=2$ のとき $y=1$ という条件です。`,formulas:[m`{\color{#936114}{1}}=a({\color{#176c82}{2}}-1)^2-2`],diagram:{kind:'m1-quadratic-conditions',stage:1,animated:false}},
  {label:'残る係数',text:m`$1=a-2$ から $a=3$。位置と開き方が決まります。`,formulas:[m`y=3(x-1)^2-2`],diagram:{kind:'m1-quadratic-conditions',stage:2,animated:false}},
  {label:'軸だけ分かる場合',text:m`軸が $x=1$、点 $(2,1),(3,7)$ を通る場合は、$a$ と高さ $k$ が未知数です。二点の条件を別々の行にします。`,formulas:[m`y=a(x-1)^2+k`,m`\begin{aligned}(2,1)&:\ a+k=1\\(3,7)&:\ 4a+k=7\end{aligned}`,m`3a=6\quad\Longrightarrow\quad a=2,\ k=-1`]}
 ]},
 'm1-quadratic-graph':{title:'平方の形とグラフの位置',goal:'',check:'',steps:[
  {label:'頂点',text:m`$y=2(x-1)^2-3$ のグラフを考えます。平方がゼロになる $x=1$ で $y=-3$。ここが頂点です。`,formulas:[m`x-1=0\quad\Longrightarrow\quad(1,-3)`],diagram:{kind:'m1-quadratic-vertex',stage:0,animated:false}},
  {label:'対称な点',text:m`軸 $x=1$ から左右に $1$ 離れると、平方の中は $-1,1$。どちらも二乗が $1$ なので高さは同じです。`,formulas:[m`x=0,2\quad\Longrightarrow\quad y=2\cdot1-3=-1`],diagram:{kind:'m1-quadratic-vertex',stage:1,animated:false}},
  {label:'曲線',text:m`平方の係数が正なので上向きに開きます。頂点と対称な二点を通る滑らかな放物線です。`,formulas:[],diagram:{kind:'m1-quadratic-vertex',stage:2,animated:false}}
 ]},
 'm1-quadratic-formula':{title:'係数を公式の役割へ',goal:'',check:m`$ax^2+bx+c=0$、$a\ne0$。ここでは実数解を考えます。`,steps:[
  {label:'係数を読む',text:m`$x^2-2x-1=0$ を解きます。各項を一般形に合わせ、係数の符号も含めます。`,formulas:[m`{\color{#176c82}{a}}x^2+{\color{#936114}{b}}x+c=0`,m`a=1,\quad b=-2,\quad c=-1`]},
  {label:'判別式',text:m`同じ $b=-2$ を二乗し、$a,c$ の積を使います。`,formulas:[m`D=b^2-4ac`,m`D=(-2)^2-4(1)(-1)=8`]},
  {label:'公式の位置へ',text:m`分子は $-b$ と $\pm\sqrt D$、分母は $2a$ です。`,formulas:[m`x=\dfrac{\overbrace{-b}^{2}\pm\overbrace{\sqrt D}^{\sqrt8}}{\underbrace{2a}_{2}}`,m`x=\dfrac{2\pm2\sqrt2}{2}=1\pm\sqrt2`]},
  {label:'根号が決める個数',text:m`平方根の中の $D$ が正なら二つ、ゼロなら同じ一つの値になります。負なら実数の平方根がありません。`,formulas:[m`D>0:\ -b+\sqrt D\ne-b-\sqrt D`,m`D=0:\ -b\pm0=-b`,m`D<0:\ \text{実数解なし}`]}
 ]},
 'm1-equation-graph':{title:'解の横座標を点へ戻す',goal:'',check:'',steps:[
  {label:'軸の条件',text:m`$y=x^2-x-2$ と $x$ 軸の共有点を求めます。$x$ 軸上では高さが $0$ です。`,formulas:[m`y=0\quad\Longrightarrow\quad x^2-x-2=0`],diagram:{kind:'m1-quadratic-intercepts',stage:0,animated:false}},
  {label:'横座標',text:m`積がゼロなので、どちらかの因子がゼロです。`,formulas:[m`(x+1)(x-2)=0`,m`x=-1\ \text{または}\ x=2`],diagram:{kind:'m1-quadratic-intercepts',stage:1,animated:false}},
  {label:'共有点',text:m`それぞれの横座標と、軸上の縦座標 $0$ を組にします。`,formulas:[m`x=-1\ \longmapsto\ (-1,0)`,m`x=2\ \longmapsto\ (2,0)`],diagram:{kind:'m1-quadratic-intercepts',stage:2,animated:false}}
 ]},
 'm1-quadratic-inequality-boundaries':{title:'今の不等号を満たす入力',goal:'',check:m`$x$ は実数です。`,steps:[
  {label:'正になる入力',text:m`$(x-1)^2>0$ を解きます。平方は非負で、ゼロになるのは $x=1$ だけ。正にするにはその一点を除きます。`,formulas:[m`x\ne1`],diagram:{kind:'m1-quadratic-boundaries',stage:0,animated:false}},
  {label:'ゼロ以下の入力',text:m`次に $(x-1)^2\le0$。平方は $0$ 以上なので、両立するのは $0$ のときだけです。`,formulas:[m`(x-1)^2=0\quad\Longrightarrow\quad x=1`],diagram:{kind:'m1-quadratic-boundaries',stage:1,animated:false}},
  {label:'負にならない式',text:m`$(x-1)^2+2<0$ なら、左辺は常に $2$ 以上。負にはならず、解はありません。`,formulas:[m`(x-1)^2+2\ge2>0`],diagram:{kind:'m1-quadratic-boundaries',stage:2,animated:false}}
 ]},
 'm1-graph-intersections':{title:'二つの式が同じ高さになるとき',goal:'',check:'',steps:[
  {label:'高さを等しくする',text:m`$y=2x^2-2$ と $y=x^2+x$ の共有点を求めます。同じ横座標で高さも等しくなる条件を書きます。`,formulas:[m`{\color{#176c82}{2x^2-2}}={\color{#936114}{x^2+x}}`],diagram:{kind:'m1-quadratic-intersections',stage:0,animated:false}},
  {label:'横座標を解く',text:m`両辺から $x^2+x$ を引き、ゼロの積へ直します。`,formulas:[m`x^2-x-2=0`,m`(x+1)(x-2)=0\quad\Longrightarrow\quad x=-1,2`],diagram:{kind:'m1-quadratic-intersections',stage:1,animated:false}},
  {label:'高さへ戻す',text:m`元の式 $y=x^2+x$ へ戻すと、$x=-1$ では $y=0$、$x=2$ では $y=6$。どちらも二つの曲線上の点です。`,formulas:[m`(-1,0),\quad(2,6)`],diagram:{kind:'m1-quadratic-intersections',stage:2,animated:false}}
 ]},
 'm1-quadratic-model':{title:'辺の長さを面積の式へ',goal:'',check:m`長方形の二辺は正。長さは $\mathrm{cm}$、面積は $\mathrm{cm}^2$ です。`,steps:[
  {label:'周から辺へ',text:m`周が $12\,\mathrm{cm}$ の長方形です。一辺を $x$、他方を $y$ とすると、同じ長さの辺が二本ずつあります。`,formulas:[m`2x+2y=12\quad\Longrightarrow\quad y=6-x`],diagram:{kind:'m1-quadratic-rectangle',stage:0,animated:false}},
  {label:'二辺を掛ける',text:m`面積は縦と横の積です。二つの長さを、そのまま二つの因子へ対応させます。`,formulas:[m`S={\color{#176c82}{x}}{\color{#936114}{(6-x)}}`],diagram:{kind:'m1-quadratic-rectangle',stage:1,animated:false}},
  {label:'入力の条件',text:m`二辺とも正なので、$x>0$ と $6-x>0$ を両方満たします。`,formulas:[m`0<x<6`,m`S=-x^2+6x`],diagram:{kind:'m1-quadratic-rectangle',stage:1,animated:false}},
  {label:'最大の面積',text:m`$S=-(x-3)^2+9$ より、$x=3$ で最大面積 $9\,\mathrm{cm}^2$。もう一辺も $3\,\mathrm{cm}$ です。$3$ は定義域に含まれます。`,formulas:[],diagram:{kind:'m1-quadratic-rectangle',stage:2,animated:false}}
 ]}
};
