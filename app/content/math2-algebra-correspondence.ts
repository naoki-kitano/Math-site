import type {FormulaLesson,FormulaStep} from './formula-correspondence';
const m=String.raw;
const figure=(label:string,text:string,kind:string,stage:number,animated=false):FormulaStep=>({label,text,formulas:[],diagram:{kind:'m2-algebra-'+kind,stage,...(animated?{animated:true}:{})}});
const line=(label:string,text:string,...formulas:string[]):FormulaStep=>({label,text,formulas});

export const math2AlgebraCorrespondence:Record<string,FormulaLesson>={
 'cubic-expansion':{
  title:'括弧全体を公式に入れる',goal:'三乗の公式で、同じまとまりが入る場所をそろえます。',check:'',
  steps:[
   figure('まとまりを決める',m`$(2x-1)^3$ を展開します。差の公式の $a$ に $2x$、$b$ に $1$ が入ります。`,'cube-parts',0),
   figure('四つの項を対応させる',m`公式の $a$ が現れる場所には、どれも同じまとまり $(2x)$ を入れます。`,'cube-parts',1),
   line('累乗を計算する',m`$(2x)^3=2^3x^3$、$(2x)^2=2^2x^2$。係数も累乗してまとめます。`,m`(2x-1)^3`,m`=8x^3-12x^2+6x-1`)
  ]
 },
 'cubic-factorization':{
  title:'中間の項が消える符号',goal:'立方の和を作る積で、消える項を確かめます。',check:'',
  steps:[
   line('二つの立方を見る',m`$x^3+8=x^3+2^3$。立方の和の公式で $a=x$、$b=2$ と対応させます。`,m`a^3+b^3=(a+b)(a^2-ab+b^2)`,m`x^3+8=(x+2)(x^2-2x+4)`),
   figure('二つの行に分けて掛ける',m`$(x+2)(x^2-2x+4)$ を掛け戻します。上の行は $x$ 倍、下の行は $2$ 倍です。`,'cube-cancel',0),
   figure('同じ次数を足す',m`二次と一次の項は、同じ大きさで逆符号です。二行を足すと $x^3+8$ が残ります。`,'cube-cancel',1,true)
  ]
 },
 'binomial-meaning':{
  title:'同じ積を何回作れるか',goal:'各括弧からの選び方を、項の係数に結び付けます。',check:m`$(a+b)^n$ では $n$ は正の整数、$b$ を選ぶ個数 $r$ は $0\le r\le n$ の整数です。`,
  steps:[
   figure('選ぶ場所を変える',m`$(x+1)^3$ の $x^2$ を作ります。$1$ を選ぶ場所だけを変えると、三通りあります。`,'choice',0),
   figure('同じ積をまとめる',m`三通りとも積は $x^2$。同じ項が三つあるので、係数は $3$ です。`,'choice',1),
   figure('選んだ数も掛ける',m`$(x+2)^4$ の $x^2$ では、$2$ を選ぶ場所が六通り。どれも数の部分は $2^2=4$ です。`,'choice',2),
   line('選び方と積を結ぶ',m`一通りの積が $4x^2$、その選び方が六通りなので、$6$ 倍します。`,m`{}_4C_2\cdot x^2\cdot2^2=24x^2`,m`(a+b)^n\text{ の一般項 }`,m`{}_nC_r a^{n-r}b^r`)
  ]
 },
 'binomial-coefficient':{
  title:'欲しい次数にそろえる',goal:'一般項の指数から、必要な項だけを選びます。',check:'',
  steps:[
   figure('指数を比べる',m`$(x+2)^5$ の $x^3$ の係数を求めます。$2$ を $r$ 個選ぶと、$x$ は残りの $5-r$ 個。指数を $3$ にそろえます。`,'degree',0),
   figure('選ぶ個数をそろえる',m`$5-r=3$ より $r=2$。組合せと数の累乗にも、この同じ $r$ を使います。`,'degree',1),
   line('係数を読む',m`項は $40x^3$。聞かれている係数は、その数の部分です。`,m`{}_5C_2 x^3 2^2=40x^3`,m`\underbrace{40}_{\text{係数}}x^3`)
  ]
 },
 'polynomial-division':{
  title:'最高次を消して進む',goal:'商を選ぶ理由と、引く式の位置をそろえます。',check:m`割る式は零多項式でないものとします。余りは $0$、または割る式より低い次数です。`,
  steps:[
   figure('商にxを書く',m`$x^2+3x+1$ を $x+1$ で割ります。先頭の $x^2$ を消すため、$x(x+1)$ を引きます。`,'division',0),
   figure('同じ次数を引く',m`$x^2$ が消え、次に残る最高次は $2x$ です。商に書いた $x$ は残します。`,'division',1,true),
   figure('商に2を加える',m`$2x$ を消すため、$2(x+1)$ を引きます。定数の余りは一次式より低いので、ここで止めます。`,'division',2,true),
   line('掛け戻す',m`商は $x+2$、余りは $-1$。割る式に商を掛けて、余りを足すと元の式に戻ります。`,m`x^2+3x+1=(x+1)(x+2)-1`),
   figure('欠けた次数もそろえる',m`$x^3+1$ を $x^2+1$ で割るときも同じです。一次の項は $0x-x=-x$。余りは $-x+1$ です。`,'division',3,true)
  ]
 },
 'rational-product':{
  title:'掛けて1になる式を使う',goal:'逆数の定義から、割り算の書き換えを確かめます。',check:m`元の分母だけでなく、割る式そのものも $0$ でないことが必要です。`,
  steps:[
   line('逆数を確かめる',m`$\frac45$ に掛けて $1$ になる数は $\frac54$。これが逆数です。`,m`\dfrac45\cdot\dfrac54=1`,m`\dfrac23\div\dfrac45=\dfrac23\cdot\dfrac54`),
   line('元の条件を残す',m`元の分母から $x\ne2,-2$。さらに割る式が $0$ になる $x=-1$ も除きます。`,m`\dfrac{x+1}{x-2}\div\dfrac{x+1}{x+2}`,m`x\ne2,-2,-1`),
   line('逆数を掛けて約分する',m`後ろの式の逆数を掛けます。共通因数を約分しても、元の除外値は変わりません。`,m`\dfrac{x+1}{x-2}\cdot\dfrac{x+2}{x+1}`,m`=\dfrac{x+2}{x-2}\quad(x\ne2,-2,-1)`)
  ]
 },
 'rational-sum':{
  title:'分子と分母を同じ倍にする',goal:'分母に足りない因数を、値を変えずに補います。',check:'元の分母がゼロになる値は使えません。',
  steps:[
   figure('一つ目の分母をそろえる',m`$\frac1x+\frac1{x+1}$ を考えます（$x\ne0,-1$）。一つ目には、値が $1$ の $\frac{x+1}{x+1}$ を掛けます。`,'common-denominator',0),
   figure('二つ目も同じ分母へ',m`$x\ne0,-1$ なので、二つ目は $\frac xx=1$ を掛けられます。分子と分母を同じ倍にするので、値は変わりません。`,'common-denominator',1),
   line('分子を足す',m`分母がそろったので、分子の $(x+1)$ と $x$ を足します。`,m`\dfrac{(x+1)+x}{x(x+1)}=\dfrac{2x+1}{x(x+1)}`,m`x\ne0,-1`),
   figure('引く分子を保つ',m`次は $\frac1{x-1}-\frac1{x+1}$（$x\ne1,-1$）。通分後の分子では、後ろの $(x-1)$ 全体を引きます。`,'subtract',0),
   line('負号を全体へ掛ける',m`分子は $(x+1)-(x-1)=x+1-x+1=2$。`,m`\dfrac1{x-1}-\dfrac1{x+1}`,m`=\dfrac2{x^2-1}\quad(x\ne1,-1)`)
  ]
 },
 'identities':{
  title:'同じ次数の係数をそろえる',goal:'係数の対応から、恒等式となる条件を取り出します。',check:'恒等式は、すべての実数を入れて成り立つ等式です。',
  steps:[
   line('左辺を展開する',m`$a(x+1)+b=2x+5$ が恒等式になる $a,b$ を求めます。左辺を次数ごとにまとめます。`,m`a(x+1)+b=ax+(a+b)`),
   figure('二つの列を比べる',m`すべての $x$ で等しくなるには、$x$ の係数も定数項も一致します。`,'compare',0),
   figure('条件から定数を求める',m`$a=2$ を $a+b=5$ に入れると $b=3$。この値なら、展開した両辺は同じ式です。`,'compare',1)
  ]
 },
 'equalities':{
  title:'消える項をそろえる',goal:'既知の展開公式から、一方を他方へ変形します。',check:'文字は実数とします。証明したい等式そのものを、正しいと仮定して使いません。',
  steps:[
   line('左辺から出発する',m`$(a+b)^2-(a-b)^2=4ab$ を示します。左辺の二つの平方を展開します。`,m`(a+b)^2-(a-b)^2`),
   figure('後ろの全項を引く',m`後ろの括弧の全項に負号を掛けます。特に $-(-2ab)=+2ab$ です。`,'proof-squares',0),
   figure('共通の項を打ち消す',m`二乗の項が消えて $4ab$、つまり右辺になります。よって等式が成り立ちます。`,'proof-squares',1,true)
  ]
 },
 'inequalities':{
  title:'差の符号から大小へ',goal:'差が非負であることと、元の不等式を結び付けます。',check:'文字は実数とします。',
  steps:[
   line('差を調べる理由',m`$A-B\ge0$ の両辺に $B$ を足すと $A\ge B$。大きいと示したい側から引きます。`,m`A-B\ge0\quad\Longleftrightarrow\quad A\ge B`),
   line('平方で表す',m`$x^2+4\ge4x$ なら、差は $(x-2)^2$。実数の平方なので非負です。`,m`x^2+4-4x=(x-2)^2\ge0`),
   line('等号になる値',m`差が $0$ のとき、両辺は等しくなります。平方の中身が $0$ になる値を求めます。`,m`(x-2)^2=0\quad\Longleftrightarrow\quad x=2`)
  ]
 },
 'amgm':{
  title:'二つの数を式に対応させる',goal:'同じ二数を、評価と等号条件の両方に使います。',check:m`相加相乗平均は正の二数 $a,b$ に使います。ここでは $x>0$ です。`,
  steps:[
   figure('正の二数を決める',m`$x+\frac4x$（$x>0$）の最小値を考えます。公式の $a,b$ に入れる二数は、どちらも正です。`,'amgm',0),
   line('和を下から押さえる',m`積は $x\cdot\frac4x=4$ で一定です。`,m`x+\dfrac4x\ge2\sqrt{x\cdot\dfrac4x}=4`),
   figure('等号が実現するか',m`等号は使った二数が等しいとき。正の解 $x=2$ は条件を満たし、値は $4$。したがって最小値は $4$ です。`,'amgm',1)
  ]
 },
 'complex-numbers':{
  title:'実部と虚部の位置を読む',goal:'標準形の係数と、実際の数を対応させます。',check:m`$i^2=-1$。$a+bi$ の $a,b$ は実数で、虚部は $i$ の係数 $b$ です。`,
  steps:[
   line('標準形へ直す',m`$3-2i$ を $a+bi$ の形にします。負号も係数の中へ入れます。`,m`3+(-2)i`,m`a=3,\qquad b=-2`),
   line('数を分類する',m`虚部が $0$ でないので虚数です。純虚数は、そのうち実部が $0$ のものです。`,m`3-2i:\quad a=3,\ b=-2`,m`-2i=0+(-2)i\quad\text{は純虚数}`),
   figure('等しい複素数を比べる',m`$a+(b-1)i=2+3i$ では、実部どうし、虚部どうしをそろえます。`,'compare',2),
   figure('実数の方程式へ',m`$a=2$、$b-1=3$ より $b=4$ です。`,'compare',3)
  ]
 },
 'complex-arithmetic':{
  title:'共役で虚数の項を消す',goal:'共役を選ぶ理由を、消える交差項から確かめます。',check:m`分母は $0$ でないものとします。$a,b$ が実数なら、$(a+bi)(a-bi)=a^2+b^2$ です。`,
  steps:[
   line('値を変えずに掛ける',m`$\frac1{1+i}$ の分母を実数にします。共役 $1-i$ を分子と分母の両方に掛けます。`,m`\dfrac1{1+i}\cdot\dfrac{1-i}{1-i}`,m`=\dfrac{1-i}{(1+i)(1-i)}`),
   figure('分母の積を展開する',m`分母の $(1+i)(1-i)$ を展開します。$+i$ と $-i$ が同じ大きさの逆符号です。`,'conjugate',0),
   figure('交差項を消す',m`$-i+i=0$。残った $1-i^2$ は、$i^2=-1$ より $2$ です。`,'conjugate',1,true),
   line('実部と虚部へ分ける',m`分母が実数になったので、分子の二項をそれぞれ $2$ で割ります。`,m`\dfrac{1-i}{2}=\dfrac12-\dfrac12i`)
  ]
 },
 'quadratic-equations':{
  title:'根号と二つの符号を読む',goal:'解の公式の各部分を確かめ、複素数の解を求めます。',check:m`$ax^2+bx+c=0$ は実係数、$a\ne0$。ここでは複素数の範囲で解きます。`,
  steps:[
   line('因数から解へ',m`積が $0$ なら、少なくとも一方の因数が $0$ です。`,m`x^2-3x+2=(x-1)(x-2)`,m`(x-1)(x-2)=0`,m`x=1\quad\text{または}\quad x=2`),
   line('公式の根号内を見る',m`次は $x^2-2x+5=0$。$a=1,b=-2,c=5$ なので、$-b=2$、$b^2-4ac=-16$ です。`,m`x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}`,m`x=\dfrac{2\pm\sqrt{-16}}2`),
   line('二つの符号を別々に取る',m`$\sqrt{-16}=4i$。公式の $+$ と $-$ をそれぞれ取って、両方の解を書きます。`,m`x=\dfrac{2+4i}2=1+2i`,m`x=\dfrac{2-4i}2=1-2i`)
  ]
 },
 'discriminant':{
  title:'根号内が解の種類を決める',goal:'解の公式の同じ場所を見て、三つの場合を区別します。',check:m`実係数二次方程式 $ax^2+bx+c=0$ で、$a\ne0$、$D=b^2-4ac$ とします。`,
  steps:[
   line('正なら二つの実数',m`$D>0$ なら $\sqrt D>0$。$+$ と $-$ は異なる二つの実数を与えます。`,m`x=\dfrac{-b+\color{#176c82}{\sqrt D}}{2a}`,m`x=\dfrac{-b-\color{#176c82}{\sqrt D}}{2a}`),
   line('ゼロなら同じ値',m`$D=0$ では、二つの符号で同じ値になります。これが重解です。`,m`\dfrac{-b+0}{2a}=\dfrac{-b}{2a}`,m`\dfrac{-b-0}{2a}=\dfrac{-b}{2a}`),
   line('負なら虚数を含む',m`$D<0$ では $\sqrt D=i\sqrt{-D}$。虚部がゼロでない、異なる二つの虚数解になります。`,m`x=\dfrac{-b\pm i\sqrt{-D}}{2a}`)
  ]
 },
 'root-relations':{
  title:'展開した係数を比べる',goal:'解の和と積が、どの係数になるかを確かめます。',check:m`$a\ne0$。二つの解 $\alpha,\beta$ は、重解なら同じ解を二回数えます。虚数解にも同じ関係が成り立ちます。`,
  steps:[
   line('二つの根から積を作る',m`$ax^2+bx+c=0$ の二つの解を $\alpha,\beta$ とします。先頭の係数 $a$ も付けて展開します。`,m`a(x-\alpha)(x-\beta)`,m`=ax^2-a(\alpha+\beta)x+a\alpha\beta`),
   figure('同じ次数をそろえる',m`$ax^2+bx+c$ と比べます。一次の係数には和、定数項には積が現れます。`,'vieta',0),
   figure('和と積を取り出す',m`二つの関係式を、それぞれ $a$ で割ります。和の負号は、展開した一次の係数から来ています。`,'vieta',1),
   figure('二乗の和を作る',m`$(\alpha+\beta)^2$ には $2\alpha\beta$ が含まれます。二乗の和だけを取り出すには、その分を引きます。`,'square-sum',0),
   line('分かっている和と積を使う',m`$2x^2-6x+1=0$ では、和は $3$、積は $\frac12$。二乗の和の式へ入れます。`,m`\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta`,m`=3^2-2\cdot\dfrac12=8`)
  ]
 },
 'equation-from-roots':{
  title:'ゼロになる因数を作る',goal:'解から因数、因数から係数へ対応をたどります。',check:'ここでは二次の係数が1の方程式を作ります。',
  steps:[
   line('負の解も括弧で引く',m`解 $2,-3$ に対し、それぞれの値で $0$ になる因数を作ります。`,m`x=2:\quad x-2=0`,m`x=-3:\quad x-(-3)=x+3=0`),
   line('積をゼロにする',m`どちらかの因数が $0$ になればよいので、積を $0$ とおきます。`,m`(x-2)(x+3)=0`,m`x^2+x-6=0`),
   line('和と積からも作れる',m`一般に、一次の係数は解の和の負号付き、定数項は解の積です。`,m`(x-\alpha)(x-\beta)`,m`=x^2-(\alpha+\beta)x+\alpha\beta`),
   line('共役な解の場合',m`解が $1+i,1-i$ なら和は $2$、積は $2$。同じ係数の位置へ入れます。`,m`x^2-\underbrace{2}_{\text{解の和}}x+\underbrace{2}_{\text{解の積}}=0`)
  ]
 },
 'remainder-theorem':{
  title:'商の項をゼロにする',goal:'商を計算せずに余りを取り出せる理由を確かめます。',check:m`多項式の恒等式に代入しています。ゼロで割っているのではありません。一次式で割った余り $r$ は定数です。`,
  steps:[
   figure('割り算の関係を書く',m`$P(x)$ を $x-2$ で割ります。商を $Q(x)$、余りを $r$ とすると、この関係が成り立ちます。`,'remainder',0),
   figure('因数をゼロにする値',m`$x=2$ を代入すると、$(2-2)Q(2)$ 全体が $0$ になります。`,'remainder',1,true),
   line('余りだけを計算する',m`$P(2)=r$ が残ります。$P(x)=x^3+2x+1$ なら、余りは次の値です。`,m`r=P(2)=2^3+2\cdot2+1=13`),
   line('一般の一次式でも同じ',m`$x-a$ をゼロにする $x=a$ を入れると、商を含む積が消えます。`,m`P(x)=(x-a)Q(x)+r`,m`P(a)=0\cdot Q(a)+r=r`)
  ]
 },
 'factor-theorem':{
  title:'余りゼロを因数へ結ぶ',goal:'因数をもつ条件と、代入してゼロになる条件を結び付けます。',check:m`$P(x),Q(x)$ は多項式です。`,
  steps:[
   line('余りがゼロなら積になる',m`$x-a$ で割った余りは $P(a)$。$P(a)=0$ なら、余りのない積の形です。`,m`P(x)=(x-a)Q(x)+P(a)`,m`P(a)=0\quad\Longrightarrow\quad P(x)=(x-a)Q(x)`),
   line('逆向きも確かめる',m`$P(x)=(x-a)Q(x)$ に $x=a$ を入れると、積が $0$。二つの条件は同値です。`,m`P(a)=(a-a)Q(a)=0`),
   line('因数を具体的に使う',m`$P(x)=x^3-2x^2-x+2$ は $P(1)=0$。$x-1$ で割った商は $x^2-x-2$ です。`,m`P(x)=(x-1)(x^2-x-2)`),
   line('商も積にする',m`商の二次式は、和が $-1$、積が $-2$ の二数を使って分けられます。`,m`x^2-x-2=(x-2)(x+1)`,m`P(x)=(x-1)(x-2)(x+1)`)
  ]
 },
 'higher-equations':{
  title:'因数ごとに解を残す',goal:'各因数から得られる解を見失わずにまとめます。',check:'複素数の範囲で解きます。積がゼロなら、少なくとも一つの因数がゼロです。',
  steps:[
   figure('因数と解を対応させる',m`$x^3-4x=0$ は $x(x-2)(x+2)=0$。各因数が $0$ になる場合を並べます。`,'factor-tree',0),
   line('ゼロの解も残る理由',m`元の式で $x=0$ も積を $0$ にします。$x$ で割らず、因数として残せばこの解も得られます。`,m`x=0,\ 2,\ -2`),
   line('二次式に置き換える',m`次は $x^4-5x^2+4=0$。$t=x^2$ と置くと、二次方程式になります。`,m`t^2-5t+4=(t-1)(t-4)=0`),
   figure('元の文字へ戻す',m`$t=1,4$ は $x^2=1,4$ のことです。それぞれを $x$ について解き、両方の符号を取ります。`,'factor-tree',1)
  ]
 }
};
