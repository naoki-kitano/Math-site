import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;
export const math3FormulaCorrespondence:Record<string,FormulaLesson>={
 'm3-chain-rule':{
  title:'二つの変化率を掛ける',goal:'連鎖律の二つの因子を求めます。',check:'各関数が対応する点で微分可能なとき、連鎖律を使えます。',steps:[
   {label:'求める変化率',text:m`$y=(2x+1)^3$ で $u=2x+1$ と置くと、$y=u^3$。$x$ から $u$、$u$ から $y$ への二つの変化率を掛けます。`,formulas:[m`\dfrac{dy}{dx}={\color{#176c82}{\dfrac{dy}{du}}}\cdot{\color{#936114}{\dfrac{du}{dx}}}`]},
   {label:'外側の変化率',text:m`$y=u^3$ を $u$ で微分し、$\dfrac{dy}{du}$ に入れます。`,formulas:[],motion:{source:m`\dfrac{dy}{du}={\color{#176c82}{3u^2}}`,template:m`\dfrac{dy}{dx}={\color{#176c82}{\dfrac{dy}{du}}}\cdot\dfrac{du}{dx}`,target:m`\dfrac{dy}{dx}={\color{#176c82}{3u^2}}\cdot\dfrac{du}{dx}`,parts:[{tex:m`\color{#176c82}{3u^2}`,color:'#176c82'}]}},
   {label:'内側の変化率',text:m`$u=2x+1$ を $x$ で微分し、$\dfrac{du}{dx}$ に入れます。`,formulas:[],motion:{source:m`\dfrac{du}{dx}={\color{#936114}{2}}`,template:m`\dfrac{dy}{dx}=3u^2\cdot{\color{#936114}{\dfrac{du}{dx}}}`,target:m`\dfrac{dy}{dx}=3u^2\cdot{\color{#936114}{2}}`,parts:[{tex:m`\color{#936114}{2}`,color:'#936114'}]}},
   {label:'元の変数で表す',text:m`$u=2x+1$ を戻して、$x$ の式で答えます。`,formulas:[m`\dfrac{dy}{dx}=3(2x+1)^2\cdot2`,m`=6(2x+1)^2`]}
  ]
 },
 'm3-product-derivative':{
  title:'積の微分の二つの項を作る',goal:'一般式の二つの項を、この関数で求めます。',check:'二つの因子がともに微分可能なときに使えます。',steps:[
   {label:'二項の役割',text:m`$y=xe^x$ で $u=x$、$v=e^x$ と置きます。一方を微分し、他方を残した二つの項を足します。`,formulas:[m`y'=u'v+uv'`]},
   {label:'左を微分した項',text:m`$u'=1$、$v=e^x$ なので、$u'v$ は $1\cdot e^x$ です。`,formulas:[],motion:{source:m`u'v={\color{#176c82}{1\cdot e^x}}`,template:m`y'={\color{#176c82}{u'v}}+uv'`,target:m`y'={\color{#176c82}{1\cdot e^x}}+uv'`,parts:[{tex:m`\color{#176c82}{1\cdot e^x}`,color:'#176c82'}]}},
   {label:'右を微分した項',text:m`$u=x$、$v'=e^x$ なので、$uv'$ は $xe^x$ です。`,formulas:[],motion:{source:m`uv'={\color{#936114}{xe^x}}`,template:m`y'=e^x+{\color{#936114}{uv'}}`,target:m`y'=e^x+{\color{#936114}{xe^x}}`,parts:[{tex:m`\color{#936114}{xe^x}`,color:'#936114'}]}}
  ]
 },
 'm3-quotient-derivative':{
  title:'商の微分の分子と分母を作る',goal:'一般式の三つの部分を求めます。',check:m`$u,v$ は微分可能で $v\ne0$。この例では $x\ne-1$ です。`,steps:[
   {label:'分子と分母の役割',text:m`$y=\dfrac{x}{x+1}$ で、$u=x$、$v=x+1$ と置きます。`,formulas:[m`y'=\dfrac{u'v-uv'}{v^2}`]},
   {label:'分子を作る',text:m`$u'=v'=1$。$u'v=x+1$、$uv'=x$ を、引く順序を保って入れます。`,formulas:[],motion:{source:m`u'v={\color{#176c82}{x+1}},\quad uv'={\color{#936114}{x}}`,template:m`y'=\dfrac{{\color{#176c82}{u'v}}-{\color{#936114}{uv'}}}{v^2}`,target:m`y'=\dfrac{({\color{#176c82}{x+1}})-{\color{#936114}{x}}}{v^2}`,parts:[{tex:m`\color{#176c82}{x+1}`,color:'#176c82'},{tex:m`\color{#936114}{x}`,color:'#936114'}]}},
   {label:'分母を作る',text:m`$v=x+1$ 全体を二乗します。分子は $(x+1)-x=1$ です。`,formulas:[m`y'=\dfrac{1}{(x+1)^2}`]}
  ]
 },
 'm3-substitution-integrals':{
  title:'内側の式と、その微分をそろえる',goal:'積分の中の二つの部分を置き換えます。',check:'変数と微分をそろえて置き換えます。不定積分の答えは元の変数で表し、積分定数を付けます。',steps:[
   {label:'置換する式を選ぶ',text:m`$\int x\sqrt{x^2+1}\,dx$ では、根号内の微分 $2x$ が外の $x$ の定数倍です。$t=x^2+1$ と置きます。`,formulas:[m`dt=2x\,dx`,m`x\,dx=\dfrac12\,dt`]},
   {label:'微分を含めて置き換える',text:m`根号内は $t$、残る $x\,dx$ は $\dfrac12dt$ に対応します。`,formulas:[],motion:{source:m`x\,dx={\color{#936114}{\dfrac12\,dt}}`,target:m`\int\sqrt t\,{\color{#936114}{\dfrac12\,dt}}`,parts:[{tex:m`\color{#936114}{\dfrac12\,dt}`,color:'#936114'}]}},
   {label:'積分して戻す',text:m`$t$ で積分してから、$t=x^2+1$ を戻します。`,formulas:[m`\dfrac12\int\sqrt t\,dt=\dfrac13t^{\frac32}+C`,m`=\dfrac13(x^2+1)^{\frac32}+C`]}
  ]
 },
 'm3-endpoint-evaluation':{
  title:'原始関数の二つの値を引く',goal:'上端と下端での値を対応させます。',check:m`被積分関数が区間全体で連続なとき、原始関数 $F$ を使えます。`,steps:[
   {label:'両端を入れる式',text:m`$\int_{-1}^2 x^2\,dx$ では、$F(x)=\dfrac{x^3}{3}$、$a=-1$、$b=2$ です。`,formulas:[m`[F(x)]_a^b=F(b)-F(a)`]},
   {label:'上端での値',text:m`上端 $b=2$ を $F$ に入れた値を、先に書きます。`,formulas:[],motion:{source:m`F(2)=\dfrac{2^3}{3}={\color{#176c82}{\dfrac83}}`,template:m`[F(x)]_{-1}^2={\color{#176c82}{F(2)}}-F(-1)`,target:m`[F(x)]_{-1}^2={\color{#176c82}{\dfrac83}}-F(-1)`,parts:[{tex:m`\color{#176c82}{\dfrac83}`,color:'#176c82'}]}},
   {label:'下端での値',text:m`下端での値 $F(-1)$ 全体を引くので、負の値を括弧に入れます。`,formulas:[],motion:{source:m`F(-1)={\color{#936114}{-\dfrac13}}`,template:m`\dfrac83-{\color{#936114}{F(-1)}}`,target:m`\dfrac83-\left({\color{#936114}{-\dfrac13}}\right)=3`,parts:[{tex:m`\color{#936114}{-\dfrac13}`,color:'#936114'}]}}
  ]
 },
 'm3-definite-substitution':{
  title:'式と一緒に、積分の両端も変える',goal:'置換した変数で上下端を求めます。',check:m`この例では $0\le x\le1$、$t=x^2+1$、$dt=2x\,dx$ です。`,steps:[
   {label:'置換する',text:m`$\int_0^1 2x\sqrt{x^2+1}\,dx$ では、根号内の微分が外の $2x$ と一致します。$t=x^2+1$ と置きます。`,formulas:[m`\sqrt{x^2+1}=\sqrt t,\quad 2x\,dx=dt`]},
   {label:'両端の対応',text:m`下端 $x=0$ は $t=1$、上端 $x=1$ は $t=2$。それぞれ同じ役割の位置に入れます。`,formulas:[],motion:{source:m`x=0\longmapsto t={\color{#936114}{1}},\quad x=1\longmapsto t={\color{#176c82}{2}}`,target:m`\int_{{\color{#936114}{1}}}^{{\color{#176c82}{2}}}\sqrt t\,dt`,parts:[{tex:m`\color{#936114}{1}`,color:'#936114',targetEdge:'left'},{tex:m`\color{#176c82}{2}`,color:'#176c82',targetEdge:'right'}]}},
   {label:'新しい変数で計算',text:'式も両端も同じ変数で表せたので、原始関数に両端を代入します。',formulas:[m`\left[\dfrac23t^{\frac32}\right]_1^2`,m`=\dfrac23(2\sqrt2-1)`]}
  ]
 },
 'm3-parts-introduction':{
  title:'部分積分の二つの項を作る',goal:'微分する因子と積分する因子の役割を対応させます。',check:m`区間上で $u,v$ が連続な導関数を持つとき、積の微分を積分して部分積分の公式を得ます。`,steps:[
   {label:'公式の役割',text:m`$\int xe^x\,dx$ では $u=x$、$v'=e^x$ と選びます。$x$ を微分すると $1$ になり、残る積分が簡単になります。`,formulas:[m`\int uv'\,dx=uv-\int u'v\,dx`]},
   {label:'積の項',text:m`$v'=e^x$ を積分して $v=e^x$。$uv$ は $xe^x$ です。`,formulas:[],motion:{source:m`uv={\color{#176c82}{xe^x}}`,template:m`\int xe^x\,dx={\color{#176c82}{uv}}-\int u'v\,dx`,target:m`\int xe^x\,dx={\color{#176c82}{xe^x}}-\int u'v\,dx`,parts:[{tex:m`\color{#176c82}{xe^x}`,color:'#176c82'}]}},
   {label:'残る積分',text:m`$u'=1$、$v=e^x$。残る積分の中に $u'v=1\cdot e^x$ を入れます。`,formulas:[],motion:{source:m`u'v={\color{#936114}{1\cdot e^x}}`,template:m`xe^x-\int {\color{#936114}{u'v}}\,dx`,target:m`xe^x-\int {\color{#936114}{1\cdot e^x}}\,dx`,parts:[{tex:m`\color{#936114}{1\cdot e^x}`,color:'#936114'}]}},
   {label:'残りを計算',text:'微分すると元の被積分関数に戻り、符号と係数を確認できます。',formulas:[m`xe^x-e^x+C`,m`(xe^x-e^x+C)'=xe^x`]}
  ]
 },
 'm3-moving-endpoints':{
  title:'上端の項から、下端の項を引く',goal:'各端の代入値と導関数を組み合わせます。',check:m`$f$ は必要な区間で連続、上下端は微分可能とします。`,steps:[
   {label:'二つの端の役割',text:m`$H(x)=\int_x^{x^2}f(t)\,dt$ で、上端を $g=x^2$、下端を $h=x$ と書きます。両端に合成関数の微分を使います。`,formulas:[m`H'=f(g)g'-f(h)h'`]},
   {label:'上端からの項',text:m`$g=x^2$、$g'=2x$ を上端の項に入れます。`,formulas:[],motion:{source:m`f(g)g'={\color{#176c82}{f(x^2)\cdot2x}}`,template:m`H'={\color{#176c82}{f(g)g'}}-f(h)h'`,target:m`H'={\color{#176c82}{f(x^2)\cdot2x}}-f(h)h'`,parts:[{tex:m`\color{#176c82}{f(x^2)\cdot2x}`,color:'#176c82'}]}},
   {label:'下端からの項',text:m`$h=x$、$h'=1$ を下端の項に入れ、その項を引きます。`,formulas:[],motion:{source:m`f(h)h'={\color{#936114}{f(x)\cdot1}}`,template:m`H'=f(x^2)\cdot2x-{\color{#936114}{f(h)h'}}`,target:m`H'=f(x^2)\cdot2x-{\color{#936114}{f(x)\cdot1}}`,parts:[{tex:m`\color{#936114}{f(x)\cdot1}`,color:'#936114'}]}}
  ]
 }
};
