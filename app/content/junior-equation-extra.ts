import {J,S,m,q,ns,skill} from "./junior-authoring";
const radicands=[3,2,5,6,7,10,11,13];
const simplify=(n:number)=>q(m`$\sqrt{${4*n}}$ を簡単にしなさい。`,m`$2\sqrt{${n}}$。`,"平方数の因数を探し、その平方根を外へ出します。",m`$\sqrt{${4*n}}=\sqrt{4\cdot${n}}=2\sqrt{${n}}$。どちらの因数も非負です。`);
const rationalize=(n:number)=>q(m`$\frac1{\sqrt{${n}}}$ の分母を有理化しなさい。`,m`$\frac{\sqrt{${n}}}{${n}}$。`,m`分母を $${n}$ にするため、分子と分母に、零でない $\sqrt{${n}}$ を掛けます。`,m`$\sqrt{${n}}\sqrt{${n}}=${n}$ を使います。$\frac1{\sqrt{${n}}}=\frac{\sqrt{${n}}}{\sqrt{${n}}\sqrt{${n}}}=\frac{\sqrt{${n}}}{${n}}$。$\frac{\sqrt{${n}}}{\sqrt{${n}}}=1$ を掛けるので値は変わりません。`);
const formula=(n:number,word=false)=>q(word?m`一個 $120$ 円の品物を何個か買い、袋代 $20$ 円を合わせて $${120*n+20}$ 円払いました。個数を求めなさい。`:m`$y=${n+1}x+2$ を $x$ について解きなさい。`,word?m`$${n}$ 個。`:m`$x=\frac{y-2}{${n+1}}$。`,word?"分からない量を文字にし、数量の関係を式にします。":"指定された文字だけを一方の辺に残します。",word?m`個数を $x$ とすると品物代は $120x$ 円、袋代を加えた支払額は $120x+20$ 円です。したがって $120x+20=${120*n+20}$。$120x=${120*n}$ から $x=${n}$。正の整数なので、個数としても適切です。`:m`両辺から $2$ を引いて $y-2=${n+1}x$。非零の $${n+1}$ で割ります。`);
export const equationExtraBanks=[
 J("方程式と平方根の基礎","root-calculation","平方根の計算と有理化","平方数の因数を取り出し、同じ値の見やすい形に直します。",[m`$a,b\geqq0$ のとき $\sqrt{ab}=\sqrt a\sqrt b$。積全体を二乗すると $ab$ になり、非負であることから確かめられます。`,m`同じ根号の項は $2\sqrt3+\sqrt3=3\sqrt3$ とまとめられます。$\sqrt{a+b}$ を $\sqrt a+\sqrt b$ に分けることは、一般にはできません。`],"分母を有理化するときは、分子にも同じ数を掛けます。",[S("simplify","平方数を外に出す","積として分けます。",radicands.map(simplify)),S("rationalize","分母の根号を外す","分母の根号と同じ数を、分子と分母に掛けます。",radicands.map(rationalize))],"平方根と二次方程式"),
 J("方程式と平方根の基礎","formula-quantities","式の変形と数量の関係","求めたい量を選び、等しさを保って式を変えます。",[m`「$x$ について解く」は、$x=$ の形にすることです。数値が一つに決まるとは限らず、ほかの文字を使って表すこともあります。`,"文章題では、文字が何の量かと単位を決め、同じ量を表す式同士を等号で結びます。求めた数が個数や長さとして使えるかも確認します。"],"式を作る前に、何を求めるかを言葉で確かめます。",[S("rearrange","指定された文字を残す","両辺に同じ操作をします。",ns.map(n=>formula(n))),S("word","文章を等式にする","個数と金額を区別します。",ns.map(n=>formula(n,true)))],"等式と方程式")
];
const cases=[
 [m`$x^2=0$`,"$x=0$。","零の二乗だけが零です。"],
 [m`$x^2=-1$`,"実数解はありません。","実数の二乗は非負です。"],
 [m`$x^2=4$`,m`$x=2,-2$。`,"正負どちらも二乗すると四です。"],
 [m`$x^2=-4$`,"実数解はありません。","実数の二乗を負にすることはできません。"],
 [m`$(x-1)^2=0$`,"$x=1$。","括弧の中が零になる場合だけです。"],
 [m`$x^2=9$`,m`$x=3,-3$。`,"正負どちらも二乗すると九です。"],
 [m`$(x+2)^2=0$`,"$x=-2$。","括弧の中が零になる場合だけです。"],
 [m`$x^2=-9$`,"実数解はありません。","実数の二乗は非負です。"]
].map(([expr,answer,why])=>q(expr+" を実数の範囲で解き、理由を答えなさい。",answer+why,"右辺の符号を見て、実数の平方の性質を使います。",why+answer));
export const squareCondition=skill("real-solutions","実数解の有無と個数","右辺が正・零・負のどれかを先に確かめます。",cases[0],cases.slice(1));
export const generalQuadratic=S("formula","平方の形と解の公式","因数分解が見付からないときは、平方の形へ変えます。",ns.map(n=>{
 const rad=n+2,integerRoot=Number.isInteger(Math.sqrt(rad));
 let outside=1;for(let candidate=2;candidate*candidate<=rad;candidate++)if(rad%(candidate*candidate)===0)outside=candidate;
 const root=integerRoot?String(Math.sqrt(rad)):outside===1?m`\sqrt{${rad}}`:m`${outside}\sqrt{${rad/(outside*outside)}}`;
 const solution=integerRoot?m`x=${1+Math.sqrt(rad)},${1-Math.sqrt(rad)}`:m`x=1\pm${root}`;
 return q(m`$x^2-2x-${n+1}=0$ を実数の範囲で解きなさい。`,m`$${solution}$。`,
 "左辺の最初の二項に何を足すと、差の二乗になるか考えます。",
 m`$(x-1)^2=x^2-2x+1$ なので、平方の形にするには $1$ を補います。$x^2-2x=${n+1}$ の両辺に $1$ を足すと $(x-1)^2=${rad}$。$x-1=\pm${root}$ より $${solution}$。両方を元の式へ代入すると零になります。`);
}));
