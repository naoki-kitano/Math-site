import {topic,addPair,type Worked,type Skill} from "./math1-topic";
import {prepMultiply} from "./math1-factoring";
const m=String.raw;
const t=(s:string)=>m`$${s}$`;
const w=(tex:string,answer:string,hint:string,working:string):Worked=>[t(tex)+" を計算しなさい。",t(answer)+"。",hint,t(working)+"。"];
function square(n:number):Worked{return w(m`(${n})^2`,String(n*n),"括弧の中の数を二つ掛け合わせます。",m`(${n})(${n})=${n*n}`)}
const prepSquare:Skill={id:"number-square",title:"負の数の二乗",why:"同じ負の数を二つ掛け合わせると正になります。",sample:square(-2),items:[square(-3),square(4),square(-5)]};
const P=[prepMultiply,prepSquare];
function principal(n:number):Worked{return w(m`\sqrt{(${n})^2}`,String(Math.abs(n)),"先に根号の中を二乗し、非負の平方根を選びます。",m`\sqrt{(${n})^2}=\sqrt{${n*n}}=${Math.abs(n)}`)}
function allRoots(n:number):Worked{return [t(String(n*n))+" の平方根をすべて求めなさい。",n===0?t("0")+"。":t(m`\pm${Math.abs(n)}`)+"。","二乗して元の数になる実数を、正負とも確かめます。",n===0?m`$0^2=0$。二乗してゼロになる実数は $0$ だけです。`:t(m`${n}^2=(-${n})^2=${n*n}`)+"。正の数の平方根は正負二つあります。"]}
const domains:Worked[]=[
 [m`$\sqrt{-4}$ は実数として定義されますか。理由も述べなさい。`,"定義されません。実数の二乗は負にならないからです。","根号の中の符号を見ます。",m`実数 $r$ なら $r^2\ge0$。$r^2=-4$ を満たす実数はありません。`],
 [m`$\sqrt0$ は実数として定義されますか。値も答えなさい。`,m`定義され、値は $0$。`,"ゼロを境界に含むか確かめます。",m`$0^2=0$ で $0\ge0$ なので $\sqrt0=0$。`],
 [m`$\sqrt{-1}$ は実数として定義されますか。理由も述べなさい。`,"定義されません。実数の二乗は負にならないからです。","実数の範囲で考えます。",m`$r^2=-1$ を満たす実数 $r$ はありません。`],
 [m`$\sqrt{9}$ は実数として定義されますか。値も答えなさい。`,m`定義され、値は $3$。`,"根号の中は非負です。",m`$9\ge0$、$3^2=9$、$3\ge0$ より $\sqrt9=3$。`],
];
export const rootMeaning=topic("m1-square-roots","平方根と根号の意味",[
 m`二乗すると $a$ になる数を $a$ の平方根といいます。実数の範囲で考えると、$a>0$ のとき正負二つ、$a=0$ のとき $0$ だけ、$a<0$ のとき存在しません。`,
 m`$a\ge0$ のとき、非負の平方根だけを $\sqrt a$ と書きます。$9$ の平方根は $3,-3$ ですが、$\sqrt9$ は $3$ です。根号そのものに正負両方の意味はありません。`,
 m`$\sqrt{(-3)^2}=\sqrt9=3$。二乗と根号を外して単に $-3$ としてはいけません。根号の値は非負だからです。一般に $\sqrt{x^2}$ は $x$ の符号を除いた大きさで、後の絶対値のページで $|x|$ と表します。`,
],"平方根をすべて求める問いと、根号の値を求める問いを区別します。",[
 {id:"principal",title:"根号は非負の値",why:"根号の中を計算した後、非負の平方根を選びます。",sample:principal(-3),items:[-2,4,-5,0,-1,6,-4].map(principal)},
 {id:"all-roots",title:"平方根をすべて挙げる",why:"正の数の平方根は正負二つ、ゼロの平方根は一つです。",sample:allRoots(3),items:[2,5,0,4,1,6,7].map(allRoots)},
 {id:"real-domain",title:"実数として定義されるか",why:"実数の二乗は非負なので、実数の平方根を考えるには根号の中が非負であることが必要です。",sample:domains[0],items:[domains[1],domains[2],domains[3]]},
],P);

function simplify(k:number,d:number):Worked{return w(m`\sqrt{${k*k*d}}`,m`${k}\sqrt${d}`,m`根号の中を平方数 ${t(String(k*k))} と ${t(String(d))} の積にします。`,m`\sqrt{${k*k*d}}=\sqrt{${k*k}\cdot${d}}=${k}\sqrt${d}`)}
function sumRoots(k:number,j:number,d:number):Worked{return w(m`\sqrt{${k*k*d}}+\sqrt{${j*j*d}}`,m`${k+j}\sqrt${d}`,"まず両方の根号を整理し、同じ根号の係数を足します。",m`\sqrt{${k*k*d}}+\sqrt{${j*j*d}}=${k}\sqrt${d}+${j}\sqrt${d}=${k+j}\sqrt${d}`)}
const products:Worked[]=[
 w(m`\sqrt2\cdot\sqrt3`,m`\sqrt6`,"二つとも非負なので根号の中を掛けます。",m`\sqrt2\cdot\sqrt3=\sqrt{2\cdot3}=\sqrt6`),
 w(m`\sqrt3\cdot\sqrt6`,m`3\sqrt2`,"積の根号を作り、平方因子を取り出します。",m`\sqrt{18}=\sqrt{9\cdot2}=3\sqrt2`),
 w(m`\sqrt2\cdot\sqrt8`,"4","積を一つの根号にまとめます。",m`\sqrt{16}=4`),
 w(m`2\sqrt3\cdot3\sqrt2`,m`6\sqrt6`,"係数と根号をそれぞれ掛けます。",m`2\cdot3\cdot\sqrt{3\cdot2}=6\sqrt6`),
 w(m`\frac{\sqrt{12}}{\sqrt3}`,"2","分母が正なので根号の中で割れます。",m`\frac{\sqrt{12}}{\sqrt3}=\sqrt{\frac{12}3}=\sqrt4=2`),
 w(m`\sqrt5\cdot\sqrt{10}`,m`5\sqrt2`,"積を整理します。",m`\sqrt{50}=\sqrt{25\cdot2}=5\sqrt2`),
 w(m`\frac{\sqrt{18}}{\sqrt2}`,"3","分母が正であることを確かめます。",m`\sqrt{\frac{18}2}=\sqrt9=3`),
];
const sumInvalid:Worked=[m`$\sqrt{9+16}=\sqrt9+\sqrt{16}$ は正しいですか。両辺を計算して確かめなさい。`,m`正しくありません。左辺は $5$、右辺は $7$。`,"和の根号を項ごとに外さず、両辺を別々に計算します。",m`$\sqrt{25}=5$ に対し、$3+4=7$。積についての規則は和には使えません。`];
export const radicals=topic("m1-radical-calculation","根号の整理と四則計算",[
 m`$a,b\ge0$ のとき $\sqrt a\sqrt b=\sqrt{ab}$。左辺は非負で、その二乗が $ab$ になるからです。割り算では $b>0$ のとき $\dfrac{\sqrt a}{\sqrt b}=\sqrt{\dfrac ab}$ です。分母をゼロにはできません。`,
 m`$\sqrt{12}=\sqrt{4\cdot3}=2\sqrt3$ のように、根号の中の平方数を外へ出します。$\sqrt{12}+\sqrt{27}=2\sqrt3+3\sqrt3=5\sqrt3$。同じ根号になったら係数を足せます。`,
 m`$\sqrt2+\sqrt3$ は同じ根号でないので、そのままです。$\sqrt{a+b}=\sqrt a+\sqrt b$ という規則はありません。例えば $\sqrt{9+16}=5$ と $3+4=7$ は異なります。`,
],"平方因子を取り出してから、同じ根号の項をまとめます。",[
 {id:"simplify",title:"平方因子を根号の外へ",why:"根号の中を平方数と残りの数の積に分けます。",sample:simplify(2,3),items:[[3,2],[2,5],[4,3],[3,5],[5,2],[2,7],[4,2]].map(v=>simplify(v[0],v[1]))},
 {id:"sum",title:"同じ根号をまとめる",why:"各根号を整理すると、同じ根号を含む項の係数を足せます。",sample:sumRoots(2,3,3),items:[[2,3,2],[2,4,3],[3,4,2],[2,3,5],[3,5,3],[2,5,2],[4,5,2]].map(v=>sumRoots(v[0],v[1],v[2]))},
 {id:"product",title:"根号の積と商",why:"根号の中が非負、割り算の分母が正という条件で積・商を計算します。",sample:products[0],items:products.slice(1)},
],[prepMultiply,{id:"sum-invalid",title:"和に積の規則は使えない",why:"和の根号は、中の和を先に計算します。",sample:sumInvalid,items:[sumInvalid,[m`$\sqrt{4+5}=\sqrt4+\sqrt5$ は正しいですか。`,m`正しくありません。左辺は $3$、右辺は $2+\sqrt5>4$。`,"両辺を別々に計算します。",m`$\sqrt9=3$、$\sqrt5>2$ より右辺は $4$ より大きくなります。`],[m`$\sqrt{1+3}=\sqrt1+\sqrt3$ は正しいですか。`,m`正しくありません。左辺は $2$、右辺は $1+\sqrt3>2$。`,"根号の中をまず足します。",m`$\sqrt4=2$、$\sqrt3>1$ なので右辺は $2$ より大きくなります。`]]}]);

function rational(d:number,n=1,k=1):Worked{
 const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;
 const g=gcd(n,k*d),num=n/g,den=k*d/g;
 const answer=den===1?m`${num===1?"":num}\sqrt{${d}}`:m`\frac{${num===1?"":num}\sqrt{${d}}}{${den}}`;
 const input=m`\frac{${n}}{${k===1?"":k}\sqrt{${d}}}`;
 const multiplied=m`\frac{${n}\cdot\sqrt{${d}}}{${k===1?"":k}\sqrt{${d}}\cdot\sqrt{${d}}}`;
 const combined=m`\frac{${n===1?"":n}\sqrt{${d}}}{${k*d}}`;
 const calculation=[input,multiplied,combined,...(combined===answer?[]:[answer])].join("=");
 return [t(input)+" の分母を有理化しなさい。",t(answer)+"。",m`分子・分母に同じ非零の数 ${t(m`\sqrt{${d}}`)} を掛け、係数を約分します。`,t(calculation)+m`。元の分母と掛ける ${t(m`\sqrt{${d}}`)} は正なので、値を保つ変形です。`];
}
function conjugate(a:number,d:number,s:number):Worked {
 const denom=m`${a}${s===1?"+":"-"}\sqrt{${d}}`,conj=m`${a}${s===1?"-":"+"}\sqrt{${d}}`,base=a*a-d;
 const answer=base===1?conj:m`\frac{${conj}}{${base}}`;
 return [t(m`\frac1{${denom}}`)+" の分母を有理化しなさい。",t(answer)+"。","根号の項の符号を反対にした式を、分子と分母の両方に掛けます。",t(m`\frac1{${denom}}=\frac{${conj}}{(${denom})(${conj})}=\frac{${conj}}{${a*a}-${d}}=${answer}`)+m`。二つの因数の積は ${t(m`${base}\ne0`)} なので、元の分母と掛ける式はどちらも非零です。`];
}
export const rationalizing=topic("m1-rationalizing","分母の有理化",[
 m`分母にある根号をなくす変形を有理化といいます。分数の値を保つには、分子と分母に同じ非零の数を掛けます。$\dfrac1{\sqrt2}=\dfrac{\sqrt2}{2}$ です。分母だけに掛けると値が変わります。`,
 m`二項の分母では和と差の積を使います。$(a+b)(a-b)=a^2-b^2$ なので、$2+\sqrt3$ には $2-\sqrt3$ を掛けます。積は $4-3=1$ です。`,
 m`元の分母も、掛ける式もゼロでないことが必要です。ここで使う $a\pm\sqrt d$ は、$a^2-d\ne0$ なのでどちらもゼロではありません。有理化後は係数の約分も確かめます。`,
],"分子と分母に同じ非零の数を掛け、値を保ちます。",[
 {id:"single",title:"一項の分母を有理化",why:"分子・分母に同じ非零の根号を掛けます。係数を約分できる場合は最後に簡単にします。",sample:rational(2),items:[rational(3),rational(5,2),rational(2,2),rational(3,3,2),rational(7,2),rational(5,5,2),rational(2,3,2)]},
 {id:"conjugate",title:"二項の分母は和と差の積",why:"根号の項の符号を反対にした式を掛けます。分母の積がゼロでないことも確かめます。",sample:conjugate(2,3,1),items:[[3,5,1],[3,7,-1],[2,2,1],[4,7,-1],[3,2,1],[4,5,1],[2,3,-1]].map(v=>conjugate(v[0],v[1],v[2]))},
],P);

// Preserve question IDs while giving distinct decisions their own repairs.
addPair(rootMeaning,"zero-root","ゼロの平方根","二乗がゼロになる実数はゼロだけです。",[
 [m`$0$ の平方根は二つありますか。理由も述べなさい。`,m`一つだけです。$+0=-0=0$ だからです。`,"正負の符号を付けても違う数になるか考えます。",m`$r^2=0$ なら $r=0$。正の数の平方根と違い、二つの異なる値にはなりません。`],
 [m`$r^2=0$ を満たす実数をすべて求めなさい。`,m`$r=0$。`,"ゼロでない実数の二乗は正です。",m`$r\ne0$ なら $r^2>0$ なので、$r^2=0$ となるのは $r=0$ だけです。`],
]);
const zeroRoot=rootMeaning.exercises.find(e=>e.id.endsWith("-all-roots-3-v1"))!;
zeroRoot.family=zeroRoot.repair="zero-root";
zeroRoot.hints=["二乗してゼロになる実数がいくつあるか考えます。"];

addPair(radicals,"quotient","根号の割り算",m`$a\ge0,b>0$ なら $\dfrac{\sqrt a}{\sqrt b}=\sqrt{\dfrac ab}$。分母が正であることを先に確かめます。`,[
 w(m`\frac{\sqrt{20}}{\sqrt5}`,"2","分母は正です。根号の中で割ります。",m`\frac{\sqrt{20}}{\sqrt5}=\sqrt4=2`),
 w(m`\frac{\sqrt{24}}{\sqrt6}`,"2","分母がゼロでないことを確かめます。",m`\sqrt6>0,\quad\frac{\sqrt{24}}{\sqrt6}=\sqrt4=2`),
]);
for(const key of ["product-4","product-6"]) {
 const e=radicals.exercises.find(e=>e.id===`m1-radical-calculation-${key}-v1`)!;
 e.family=e.repair="quotient";
}
addPair(radicals,"difference","根号の項を引く","根号を整理して同じ根号になったら、係数を引きます。結果が負になることもあります。",[
 w(m`\sqrt{12}-\sqrt{27}`,m`-\sqrt3`,"根号をそれぞれ簡単にしてから係数を引きます。",m`2\sqrt3-3\sqrt3=(2-3)\sqrt3=-\sqrt3`),
 w(m`\sqrt{50}-\sqrt8`,m`3\sqrt2`,"どちらも平方因子を取り出します。",m`5\sqrt2-2\sqrt2=3\sqrt2`),
]);
addPair(radicals,"unlike-roots","異なる根号はまとめない","根号を整理した後も根号部分が異なる項は、係数を足して一項にできません。",[
 w(m`\sqrt8+\sqrt3`,m`2\sqrt2+\sqrt3`,"整理後の根号部分が同じか比べます。",m`\sqrt8+\sqrt3=2\sqrt2+\sqrt3`),
 w(m`\sqrt{12}-\sqrt2`,m`2\sqrt3-\sqrt2`,"根号部分が異なるので、それ以上まとめません。",m`\sqrt{12}-\sqrt2=2\sqrt3-\sqrt2`),
]);
// Applicability of a new root rule belongs after its explanation, not in readiness.
radicals.exercises.find(e=>e.id.endsWith("-sum-invalid-1-v1"))!.stage="practice";
const squareBank=topic("m1-radical-calculation","",[],"",[],[prepSquare]);
radicals.exercises.push(...squareBank.exercises);
radicals.lesson.supplements.push(...squareBank.lesson.supplements);

function absolute(a:number,b:number):Worked{return w(m`|${a}-${b<0?m`(${b})`:b}|`,String(Math.abs(a-b)),"まず絶対値の中を計算し、原点からの距離に直します。",m`|${a}-${b<0?m`(${b})`:b}|=|${a-b}|=${Math.abs(a-b)}`)}
function distance(a:number,r:number):Worked{return [t(m`|x${a<0?m`+${-a}`:m`-${a}`}|=${r}`)+" を満たす実数をすべて求めなさい。",t(r===0?m`x=${a}`:m`x=${a-r},\ ${a+r}`)+"。",m`数直線で ${t(String(a))} から距離 ${t(String(r))} の点を探します。`,r===0?m`距離がゼロなので ${t(m`x=${a}`)} だけです。`:m`中心 ${t(String(a))} から左右へ ${t(String(r))} 進むので、${t(m`${a}-${r}=${a-r}`)} と ${t(m`${a}+${r}=${a+r}`)}。両方を元の式に入れると距離は ${t(String(r))} です。`]}
function interval(a:number,r:number,closed:boolean):Worked {const rel=closed?"\\le":"<";return [t(m`|x${a<0?m`+${-a}`:m`-${a}`}|${rel}${r}`)+" を満たす範囲を求めなさい。",t(m`${a-r}${rel} x${rel}${a+r}`)+"。",m`中心 ${t(String(a))} から距離 ${t(String(r))} ${closed?"以下":"未満"}の点を数直線で考えます。`,m`${t(String(a-r))} と ${t(String(a+r))} の間です。距離がちょうど ${t(String(r))} の両端は${closed?"含みます":"含みません"}。`]}
export const absoluteValues=topic("m1-absolute-distance","絶対値と数直線上の距離",[
 m`実数 $a$ の絶対値 $|a|$ は、数直線上で原点から $a$ までの距離です。$|3|=3$、$|-3|=3$、$|0|=0$。距離なので負にはなりません。`,
 m`$a\ge0$ なら $|a|=a$、$a<0$ なら $|a|=-a$。負の数の符号を反対にすると非負になるからです。$\sqrt{x^2}=|x|$ も、二乗が $x^2$ になる非負の値を選んでいると分かります。`,
 m`二点 $a,b$ の距離は $|a-b|$。$|x-2|=3$ は $2$ から距離 $3$ の点を探すので、$x=-1,5$。$|x-2|<3$ はその両端より内側、$-1<x<5$ です。ここでは距離から直接読み、不等式の式変形は後で学びます。`,
],"絶対値は距離。中心と距離を数直線で確かめます。",[
 {id:"value",title:"絶対値の中を先に計算",why:"中の計算結果が負なら符号を反対にし、非負ならそのままにします。",sample:absolute(2,5),items:[[1,4],[5,2],[-2,3],[-3,-1],[2,2],[-4,-2],[1,-3]].map(v=>absolute(v[0],v[1]))},
 {id:"distance",title:"中心から左右の点を探す",why:"正の距離なら中心の左右に一つずつ、距離ゼロなら中心だけです。",sample:distance(2,3),items:[[1,2],[-2,3],[3,1],[2,0],[-1,2],[4,2],[0,3]].map(v=>distance(v[0],v[1]))},
 {id:"interval",title:"距離から範囲を読む",why:"中心の左右の境界を求め、等号があるかで端点を含むか決めます。",sample:interval(2,3,false),items:[interval(1,2,true),interval(-2,3,false),interval(3,2,true),interval(-1,1,false),interval(2,1,true)]},
],P);
addPair(absoluteValues,"zero-distance","距離ゼロは中心だけ","距離がゼロの点は中心そのものです。左右に異なる二点はありません。",[
 distance(-1,0),distance(4,0),
]);
const zeroDistance=absoluteValues.exercises.find(e=>e.id.endsWith("-distance-4-v1"))!;
zeroDistance.family=zeroDistance.repair="zero-distance";
