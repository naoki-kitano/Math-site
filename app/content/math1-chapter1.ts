import { defineMathOneLesson, question as q } from "./math1-authoring";
import {terms,collecting} from "./math1-algebra-reading";
import {expansion,identities} from "./math1-expansion";
import {factors,quadratics,grouping} from "./math1-factoring";
import {rootMeaning,radicals,rationalizing,absoluteValues} from "./math1-roots";
import {inequalities,simultaneous,modeling} from "./math1-inequalities";
const m = String.raw;

const numbers = defineMathOneLesson({
  slug:"m1-real-numbers", title:"数の分類と小数表示", basicsTitle:"数の表し方と、数の種類",
  description:"分数に表せるかどうかで、数を分類しよう。",
  introduction:[
    m`整数には $\ldots,-2,-1,0,1,2,\ldots$ があります。整数 $p,q$ を使って $\dfrac pq$（$q\ne0$）と表せる数が有理数です。整数も $3=\dfrac31$ のように表せるので、有理数に含まれます。`,
    m`有限小数は $0.25=\dfrac{25}{100}=\dfrac14$ のように分数で表せます。ある桁から同じ数字の並びが繰り返される無限小数を循環小数といい、これも有理数です。逆に、有理数を小数で表すと有限小数か循環小数になります。割り算の余りは有限通りなので、余りがゼロになるか、同じ余りから同じ計算を繰り返すためです。`,
    m`分数で表せない実数が無理数です。$\sqrt2$ や $\pi$ がその例です。ここで $\sqrt2$ は二乗すると $2$ になる正の数、$\pi$ は円周率です。無理数の小数表示は、終わらず、循環もしません。有理数と無理数を合わせて実数といいます。`,
    m`記号の見た目ではなく、表している数で判断します。$\sqrt9=3$ は整数でも有理数でもあります。$\sqrt2$ が分数で表せない理由は、背理法を学ぶときに扱います。小数を何桁か眺めるだけでは、その先も循環しないとは証明できません。`,
  ],
  rule:m`整数はすべて有理数です。有理数と無理数は、どちらも実数です。小数の「…」だけでは循環するかどうかは決まりません。`,
  examples:[
    {id:"classify",guidedIds:["m1-real-numbers-g-classify-v1"],title:"含まれる種類をすべて挙げる",prompt:m`$-4,\ 0.6,\ \sqrt{16},\ \sqrt2$ について、整数・有理数・無理数のうち当てはまるものをすべて挙げなさい。`,steps:[
      {title:"表している値を見る",text:m`$-4=\dfrac{-4}{1}$、$0.6=\dfrac35$、$\sqrt{16}=4$。整数も分数で表せます。`},
      {title:"重なりを残して答える",text:m`$-4$ と $\sqrt{16}$ は整数・有理数。$0.6$ は有理数。$\sqrt2$ は無理数です。いずれも実数です。`},
    ]},
    {id:"repeat",guidedIds:["m1-real-numbers-g-repeat-v1"],title:"繰り返す部分を引き算で消す",prompt:m`$0.272727\ldots$（$27$ がずっと繰り返す）を分数で表しなさい。`,steps:[
      {title:"同じ並びになるようにずらす",text:m`この数を $a$ とおきます。繰り返しは二桁なので $100$ 倍すると、小数部分が元と同じになります。`,tex:m`a=0.272727\ldots,\qquad100a=27.272727\ldots`},
      {title:"差を取る",text:m`$100a-a=27$ より $99a=27$。小数を途中で切らず、繰り返し全体をそろえています。`},
      {title:"約分する",text:m`$a=\dfrac{27}{99}=\dfrac3{11}$。分数で表せるので有理数です。`},
    ]},
  ],
  supplements:[
    {id:"insufficient-digits",title:"途中の桁だけでは決められない",text:m`小数の初めの数桁だけでは、その後が循環するかは分かりません。例えば $0.123\ldots$ という始まり方だけでは、有理数とも無理数とも断定できません。`,tex:"",check:m`$0.246\ldots$ と始まる数は、必ず有理数ですか。`,answer:m`いいえ。以後の並びが不明なので断定できません。有限小数または循環小数であると分かる情報が必要です。`},
    {id:"classification",title:"整数と有理数の重なり",text:m`整数は分母を $1$ とする分数で表せます。根号があっても、値が整数なら整数・有理数です。`,tex:m`0=\frac01,\qquad\sqrt{25}=5=\frac51`,check:m`$\sqrt{36}$ は整数・有理数・無理数のどれに当てはまりますか。すべて挙げなさい。`,answer:m`$\sqrt{36}=6$ なので整数・有理数。無理数ではありません。`},
    {id:"finite-decimal",title:"有限小数を分数にする",text:m`小数点以下の桁数に合わせて分母を選び、最後に約分します。二桁なら分母は $100$ です。`,tex:m`0.35=\frac{35}{100}=\frac7{20}`,check:m`$0.45$ を分数で表しなさい。`,answer:m`$\dfrac{45}{100}=\dfrac9{20}$。`},
    {id:"repeating-decimal",title:"循環する桁をそろえる",text:m`$a=0.444\ldots$（$4$ の繰り返し）なら、$10a=4.444\ldots$。小数部分がそろうので、引くと $9a=4$ です。`,tex:m`a=\frac49`,check:m`$0.181818\ldots$（$18$ の繰り返し）を分数で表しなさい。`,answer:m`これを $a$ とすると $100a-a=18$。$a=\dfrac{18}{99}=\dfrac2{11}$。`},
    {id:"decimal-judgment",title:"無限小数と無理数を区別する",text:m`終わらない小数でも、循環するなら有理数です。有理数の割り算は、余りがゼロになるか、同じ余りを繰り返すので、有限小数または循環小数になります。`,tex:m`0.777\ldots=\frac79`,check:m`$0.777\ldots$（$7$ がずっと繰り返す）は無理数ですか。理由も述べなさい。`,answer:m`いいえ。$\dfrac79$ という整数の比で表せる有理数です。循環しない無限小数で表される実数が無理数です。`},
  ],
},{
  ready:[
    q("r-integer","classification",m`$-2$ は分数で表せますか。整数を分子・分母に使って表しなさい。`,m`$-2=\dfrac{-2}{1}$。`,m`分母を $1$ にしてみます。`,m`$-2$ を $1$ で割っても値は変わりません。`),
    q("r-decimal","finite-decimal",m`$0.5$ を分数で表しなさい。`,m`$\dfrac12$。`,m`小数第一位までなので、まず分母を $10$ にします。`,m`$0.5=\dfrac5{10}=\dfrac12$。`),
  ],
  guided:[
    q("g-classify","classification",m`$0,\ -\dfrac12,\ \sqrt{25}$ のそれぞれについて、整数・有理数・無理数のうち当てはまるものをすべて挙げなさい。`,m`$0$ と $\sqrt{25}$ は整数・有理数。$-\dfrac12$ は有理数。`,m`$\sqrt{25}$ の値と、$0=\dfrac01$ を確かめます。`,m`$\sqrt{25}=5$。$-\dfrac12$ は整数ではありませんが、整数の比なので有理数です。どれも無理数ではありません。`),
    q("g-repeat","repeating-decimal",m`$0.666\ldots$（$6$ の繰り返し）を分数で表しなさい。`,m`$\dfrac23$。`,m`この数を $a$ として $10a-a$ を考えます。`,m`$10a=6.666\ldots$ なので $9a=6$。$a=\dfrac69=\dfrac23$。`),
  ],
  practice:[
    q("p-classify","classification",m`$-5$ に当てはまるものを整数・有理数・無理数からすべて挙げ、理由を述べなさい。`,m`整数・有理数。$-5=\dfrac{-5}{1}$ と表せます。`,m`整数も分数で表せることを使います。`,m`$-5$ は整数で、整数の比にも表せます。無理数ではありません。`),
    q("p-root","classification",m`$\sqrt{49}$ は無理数ですか。理由も述べなさい。`,m`無理数ではありません。$\sqrt{49}=7$ で、整数・有理数です。`,m`二乗して $49$ になる正の数を考えます。`,m`$7^2=49$ より $\sqrt{49}=7=\dfrac71$。`),
    q("p-finite","finite-decimal",m`$0.75$ を分数で表しなさい。`,m`$\dfrac34$。`,m`$\dfrac{75}{100}$ の分子と分母を同じ数で割ります。`,m`$0.75=\dfrac{75}{100}=\dfrac34$。`),
    q("p-negative-finite","finite-decimal",m`$-0.125$ を分数で表しなさい。`,m`$-\dfrac18$。`,m`負号を残し、分母を $1000$ にします。`,m`$-0.125=-\dfrac{125}{1000}=-\dfrac18$。`),
    q("p-repeat-one","repeating-decimal",m`$0.888\ldots$（$8$ の繰り返し）を分数で表しなさい。`,m`$\dfrac89$。`,m`$10$ 倍した数から元の数を引きます。`,m`$a=0.888\ldots$ とすると $10a-a=8$。$9a=8$ より $a=\dfrac89$。`),
    q("p-repeat-two","repeating-decimal",m`$0.363636\ldots$（$36$ の繰り返し）を分数で表しなさい。`,m`$\dfrac4{11}$。`,m`二桁の繰り返しなので $100$ 倍します。`,m`$a$ とおくと $100a-a=36$。$a=\dfrac{36}{99}=\dfrac4{11}$。`),
    q("p-infinite","decimal-judgment",m`「小数が終わらなければ無理数である」は正しいですか。理由を述べなさい。`,m`正しくありません。循環小数は終わらなくても有理数です。`,m`$\dfrac13$ の小数表示を考えます。`,m`$\dfrac13=0.333\ldots$（$3$ の繰り返し）は終わりませんが、整数の比です。`),
    q("p-prefix","insufficient-digits",m`ある実数の小数表示が $0.123\ldots$ で始まることだけから、無理数といえますか。理由を述べなさい。`,m`いえません。表示された桁だけでは、その先が循環するか分からないからです。`,m`$123$ が繰り返す場合も、この始まり方になります。`,m`$0.123123\ldots$（$123$ の繰り返し）は有理数です。始まりの数桁だけでは区別できません。`),
  ],
  review:[
    q("v-prefix","insufficient-digits",m`ある実数の小数表示が $0.357\ldots$ と始まることだけから、有理数と断定できますか。理由を述べなさい。`,m`できません。その先が循環するかどうかが与えられていないからです。`,m`表示されていない部分の規則は決まっていますか。`,m`初めの三桁を指定しても、それ以降の数字の並びは決まりません。有限小数または循環小数と分かる情報が必要です。`),
    q("v-classify","classification",m`$\sqrt{81}$ に当てはまるものを整数・有理数・無理数からすべて挙げ、理由を述べなさい。`,m`整数・有理数。$\sqrt{81}=9$ だからです。`,m`根号を外して値を確かめます。`,m`$9^2=81$ で $9>0$。$\sqrt{81}=9=\dfrac91$。`),
    q("v-finite","finite-decimal",m`$1.2$ を分数で表しなさい。`,m`$\dfrac65$。`,m`整数部分も含めて $\dfrac{12}{10}$ とします。`,m`$1.2=\dfrac{12}{10}=\dfrac65$。`),
    q("v-repeat","repeating-decimal",m`$0.545454\ldots$（$54$ の繰り返し）を分数で表しなさい。`,m`$\dfrac6{11}$。`,m`$100$ 倍して小数部分をそろえます。`,m`$a$ とおくと $99a=54$。$a=\dfrac{54}{99}=\dfrac6{11}$。`),
    q("v-judgment","decimal-judgment",m`「循環しない無限小数で表される実数は無理数である」は正しいですか。理由を述べなさい。`,m`正しい。有理数の小数表示は有限小数か循環小数だからです。`,m`有理数の割り算で生じる余りの種類を思い出します。`,m`整数の比の割り算では、余りがゼロになるか同じ余りが再び現れます。終わらず循環もしない実数は、有理数ではありません。`),
  ],
});

const substitution = defineMathOneLesson({
  slug:"m1-substitution",title:"代入と計算の順序",basicsTitle:"文字を数に置き換えてから計算する",
  description:"負号と括弧を保って、式の値を求めよう。",
  introduction:[
    m`代入とは、式の文字を指定された数に置き換えることです。負の数や分数は括弧で囲むと、掛け算や累乗の範囲がはっきりします。$x=-2$ のとき $3x^2=3(-2)^2$ です。`,
    m`計算は、括弧の中、累乗、掛け算・割り算、足し算・引き算の順に行います。同じ優先順位なら左から計算します。$-2^2$ は $2^2$ に負号を付けるので $-4$、$(-2)^2$ は $(-2)(-2)$ なので $4$ です。`,
    m`係数まで二乗するかは括弧で決まります。$3x^2$ は $3\cdot x\cdot x$、$(3x)^2$ は $(3x)(3x)$。文字を置き換えても、元の括弧や計算の順序は変えません。`,
  ],
  rule:m`まずすべての文字を括弧付きの数に置き換えます。累乗の範囲を確かめてから計算し、分数の足し算では分母をそろえます。`,
  examples:[
    {id:"negative",guidedIds:["m1-substitution-g-negative-v1"],title:"負の数を代入する",prompt:m`$x=-3$ のとき、$2x^2-x$ の値を求めなさい。`,steps:[
      {title:"二か所の文字を置き換える",text:m`二乗される数は $x$ です。後ろの $-x$ は、負の数をさらに引く形になります。`,tex:m`2(-3)^2-(-3)`},
      {title:"累乗を先に計算する",text:m`$(-3)^2=9$ なので、$2\cdot9-(-3)=18+3=21$。`},
      {title:"二乗の範囲を確かめる",text:m`答えは $21$。係数 $2$ は二乗の外にあり、二乗するのは $-3$ だけです。`},
    ]},
    {id:"fraction",guidedIds:["m1-substitution-g-fraction-v1"],title:"分数を代入する",prompt:m`$x=-\dfrac12$ のとき、$x^2+x$ の値を求めなさい。`,steps:[
      {title:"分数全体を置き換える",text:m`$x^2$ では分子と分母の両方を二乗します。`,tex:m`\left(-\frac12\right)^2+\left(-\frac12\right)`},
      {title:"同じ分母で足す",text:m`$\dfrac14-\dfrac12=\dfrac14-\dfrac24=-\dfrac14$。分母同士を足すのではなく、同じ大きさに分けた個数を足し引きします。`},
      {title:"答え",text:m`$-\dfrac14$。二乗の部分は正ですが、足す数は負です。`},
    ]},
  ],
  supplements:[
    {id:"power-scope",title:"どこまでを二乗するか",text:m`$-4^2$ は $-(4\cdot4)$。$(-4)^2$ は $(-4)(-4)$。括弧は見た目だけでなく計算の対象を変えます。`,tex:m`-4^2=-16,\qquad(-4)^2=16`,check:m`$-5^2$ と $(-5)^2$ を計算しなさい。`,answer:m`それぞれ $-25$、$25$。`},
    {id:"fraction-arithmetic",title:"分数の加減と累乗",text:m`加減では分母をそろえます。累乗では分数全体を繰り返し掛けるので、分子と分母の両方を累乗します。`,tex:m`\frac16+\frac13=\frac16+\frac26=\frac12,\qquad\left(-\frac23\right)^2=\frac49`,check:m`$\dfrac14-\dfrac12$ を計算しなさい。`,answer:m`$\dfrac14-\dfrac24=-\dfrac14$。`},
    {id:"integer-substitution",title:"負号を保って代入する",text:m`$x=-2$ を $x^2-x$ に入れるなら、二か所の $x$ をどちらも $(-2)$ に置き換えます。引く数が負なら足し算になります。`,tex:m`(-2)^2-(-2)=4+2=6`,check:m`$x=-1$ のとき $2x^2-x$ は？`,answer:m`$2(-1)^2-(-1)=2+1=3$。`},
    {id:"fraction-substitution",title:"分数を代入した後の計算",text:m`$x=\dfrac12$ を $x^2-x$ に代入すると、二乗の分母は $4$ になります。引き算の前に通分します。`,tex:m`\left(\frac12\right)^2-\frac12=\frac14-\frac24=-\frac14`,check:m`$x=\dfrac13$ のとき $x^2+x$ は？`,answer:m`$\dfrac19+\dfrac13=\dfrac19+\dfrac39=\dfrac49$。`},
    {id:"order",title:"括弧と計算の順序",text:m`足し算と掛け算が混じった式は、掛け算を先にします。括弧があれば、その中を先に計算します。割る数が括弧全体なら、$12\div(2\cdot3)=12\div6=2$ です。`,tex:m`2+3\cdot4=14,\qquad(2+3)\cdot4=20`,check:m`$8-2\cdot3$ を計算しなさい。`,answer:m`$8-6=2$。`},
    {id:"left-to-right",title:"乗除は同じ優先順位",text:m`掛け算と割り算は同じ優先順位なので、左から計算します。$12\div2\cdot3$ の割る数は $2$ であり、$2\cdot3$ 全体ではありません。`,tex:m`12\div2\cdot3=6\cdot3=18`,check:m`$20\div5\cdot2$ は？`,answer:m`$4\cdot2=8$。$20\div(5\cdot2)$ とは違います。`},
  ],
},{
  ready:[
    q("r-power","power-scope",m`$-3^2$ と $(-3)^2$ を計算しなさい。`,m`それぞれ $-9$、$9$。`,m`負号まで二乗の中にあるか見ます。`,m`$-3^2=-(3\cdot3)=-9$。$(-3)^2=(-3)(-3)=9$。`),
    q("r-fraction","fraction-arithmetic",m`$\dfrac12+\dfrac13$ を計算しなさい。`,m`$\dfrac56$。`,m`分母を $6$ にそろえます。`,m`$\dfrac36+\dfrac26=\dfrac56$。`),
  ],
  guided:[
    q("g-negative","integer-substitution",m`$x=-2$ のとき $3x^2-x$ の値は？`,m`$14$。`,m`$3(-2)^2-(-2)$ と書いてから計算します。`,m`$3\cdot4+2=14$。係数 $3$ は二乗しません。`),
    q("g-fraction","fraction-substitution",m`$x=-\dfrac13$ のとき $x^2+x$ の値は？`,m`$-\dfrac29$。`,m`二乗は $\dfrac19$。足す $-\dfrac13$ と分母をそろえます。`,m`$\left(-\dfrac13\right)^2-\dfrac13=\dfrac19-\dfrac39=-\dfrac29$。`),
  ],
  practice:[
    q("p-negative-a","integer-substitution",m`$x=-4$ のとき $x^2-x$ の値は？`,m`$20$。`,m`引く数も $-4$ です。`,m`$(-4)^2-(-4)=16+4=20$。`),
    q("p-negative-b","integer-substitution",m`$x=-2$ のとき $2x^2+3x$ の値は？`,m`$2$。`,m`$2(-2)^2+3(-2)$ と書きます。`,m`$2\cdot4-6=8-6=2$。`),
    q("p-negative-c","integer-substitution",m`$a=-1,\ b=3$ のとき $a^2-ab$ の値は？`,m`$4$。`,m`$ab$ は $(-1)\cdot3$ です。`,m`$(-1)^2-(-1)\cdot3=1-(-3)=4$。`),
    q("p-zero","integer-substitution",m`$x=0$ のとき $2x^2-x+5$ の値は？`,m`$5$。`,m`文字を含む項と定数項を別に計算します。`,m`$2\cdot0^2-0+5=0-0+5=5$。`),
    q("p-fraction-a","fraction-substitution",m`$x=\dfrac12$ のとき $2x^2+x$ の値は？`,m`$1$。`,m`二乗してから係数 $2$ を掛けます。`,m`$2\cdot\dfrac14+\dfrac12=\dfrac12+\dfrac12=1$。`),
    q("p-fraction-b","fraction-substitution",m`$x=-\dfrac12$ のとき $x^2-x$ の値は？`,m`$\dfrac34$。`,m`引く数が負なので、二乗の結果に正の分数を足します。`,m`$\dfrac14-\left(-\dfrac12\right)=\dfrac14+\dfrac24=\dfrac34$。`),
    q("p-scope","power-scope",m`$2(-3)^2$ と $(2\cdot(-3))^2$ を計算し、違いを説明しなさい。`,m`それぞれ $18$、$36$。後者は係数 $2$ も二乗の中にあります。`,m`二乗するまとまりを括弧で確かめます。`,m`$2(-3)^2=2\cdot9=18$。$(2\cdot(-3))^2=(-6)^2=36$。`),
    q("p-order","order",m`$12-2\cdot3+1$ を計算しなさい。`,m`$7$。`,m`先に $2\cdot3$ を計算します。`,m`$12-6+1=6+1=7$。`),
    q("p-brackets","order",m`$(12-2)\cdot3+1$ を計算しなさい。`,m`$31$。`,m`括弧の中を先に計算します。`,m`$10\cdot3+1=30+1=31$。`),
    q("p-fraction-sum","fraction-arithmetic",m`$\dfrac34-\dfrac16$ を計算しなさい。`,m`$\dfrac7{12}$。`,m`分母の $4$ と $6$ の公倍数を使います。`,m`$\dfrac9{12}-\dfrac2{12}=\dfrac7{12}$。`),
  ],
  review:[
    q("v-power","power-scope",m`$-2^4$ と $(-2)^4$ を計算しなさい。`,m`それぞれ $-16$、$16$。`,m`前者の負号は累乗の外です。`,m`$-2^4=-(2\cdot2\cdot2\cdot2)=-16$。$(-2)^4=(-2)(-2)(-2)(-2)=16$。`),
    q("v-fraction","fraction-arithmetic",m`$\dfrac23-\dfrac14$ を計算しなさい。`,m`$\dfrac5{12}$。`,m`分母を $12$ にそろえます。`,m`$\dfrac8{12}-\dfrac3{12}=\dfrac5{12}$。`),
    q("v-integer","integer-substitution",m`$x=-3$ のとき $x^2+2x$ の値は？`,m`$3$。`,m`$(-3)^2$ と $2(-3)$ を分けて計算します。`,m`$9-6=3$。`),
    q("v-sub-fraction","fraction-substitution",m`$x=-\dfrac23$ のとき $x^2+x$ の値は？`,m`$-\dfrac29$。`,m`分子と分母を二乗してから通分します。`,m`$\dfrac49-\dfrac23=\dfrac49-\dfrac69=-\dfrac29$。`),
    q("v-order","left-to-right",m`$18\div3\cdot2-1$ を計算しなさい。`,m`$11$。`,m`割り算と掛け算は同じ優先順位なので、左から計算します。`,m`$18\div3=6$、$6\cdot2-1=12-1=11$。`),
    q("v-left-to-right","left-to-right",m`$24\div4\cdot2+1$ を計算しなさい。`,m`$13$。`,m`まず左の $24\div4$ を計算します。`,m`$24\div4\cdot2+1=6\cdot2+1=12+1=13$。`),
    q("v-brackets","order",m`$18\div(3\cdot2)-1$ を計算しなさい。`,m`$2$。`,m`割る数は括弧全体です。`,m`$3\cdot2=6$ なので $18\div6-1=3-1=2$。`),
  ],
});

export const math1Chapter1Drafts = [numbers,substitution,terms,collecting,expansion,identities,factors,quadratics,grouping,rootMeaning,radicals,rationalizing,absoluteValues,inequalities,simultaneous,modeling];
