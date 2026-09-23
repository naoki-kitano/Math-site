import {logicTopic,m,math,w} from "./math1-logic-authoring";
import type {Worked} from "./math1-topic";
type Claim={domain:string;p:string;q:string;proof:string};
const trueClaims:Claim[]=[
 {domain:m`実数 $x$`,p:"x>3",q:"x>1",proof:m`$x>3>1$ より $x>1$。仮定を満たすどの実数についても成り立ちます。`},
 {domain:m`実数 $x$`,p:"x=2",q:"x^2=4",proof:m`仮定 $x=2$ を代入すると $x^2=2^2=4$。`},
 {domain:m`整数 $n$`,p:m`n\text{ は }6\text{ の倍数}`,q:m`n\text{ は }3\text{ の倍数}`,proof:m`$n=6k$（$k$ は整数）と書けるので $n=3(2k)$。$2k$ は整数だから $3$ の倍数です。`},
 {domain:m`実数 $x$`,p:"x<0",q:"x^2>0",proof:m`$-x>0$ なので $x^2=(-x)^2>0$。ゼロは仮定に含まれません。`},
 {domain:m`実数 $a,b$`,p:"a=b",q:"a^2=b^2",proof:m`同じ数同士を掛けるので、$a=b$ から $a^2=b^2$。`},
 {domain:m`実数 $x$`,p:m`x\ge2`,q:m`x\ge0`,proof:m`$x\ge2>0$ より $x\ge0$。境界 $x=2$ でも成り立ちます。`},
 {domain:m`整数 $n$`,p:m`n\text{ は }10\text{ の倍数}`,q:m`n\text{ は偶数}`,proof:m`$n=10k=2(5k)$（$k$ は整数）。$5k$ は整数だから偶数です。`},
];
const prove=(c:Claim):Worked=>w(`${c.domain} について「${math(c.p)} ならば ${math(c.q)}」は真ですか。理由も示しなさい。`,"真です。"+c.proof,"仮定を満たす数全体で成り立つ理由を、式や範囲で示します。",c.proof);
type FalseClaim={domain:string;p:string;q:string;value:string;check:string;hint:string};
export const counterClaims:FalseClaim[]=[
 {domain:m`実数 $x$`,p:"x^2=4",q:"x=2",value:"x=-2",check:m`$(-2)^2=4$ で仮定は真、$-2\ne2$ で結論は偽です。`,hint:"二乗して同じ値になる負の数を調べます。"},
 {domain:m`実数 $x$`,p:"x^2=9",q:"x=3",value:"x=-3",check:m`$(-3)^2=9$、しかし $-3\ne3$。`,hint:"正の平方根以外も考えます。"},
 {domain:m`実数 $x$`,p:"x>0",q:"x>1",value:m`x=\frac12`,check:m`$\frac12>0$、しかし $\frac12>1$ は偽です。`,hint:"実数の範囲なので、ゼロと一の間も調べます。"},
 {domain:m`整数 $n$`,p:m`n\text{ は偶数}`,q:m`n\text{ は }4\text{ の倍数}`,value:"n=2",check:m`$2=2\cdot1$ で偶数ですが、$4$ の整数倍ではありません。`,hint:"偶数のうち四の倍数でないものを探します。"},
 {domain:m`実数 $a,b$`,p:"ab=0",q:"a=0",value:"a=1,b=0",check:m`$ab=1\cdot0=0$ ですが、$a=1\ne0$。`,hint:"積がゼロになるのは、どちらかの因数がゼロのときです。"},
 {domain:m`実数 $x$`,p:m`x\ge0`,q:"x>0",value:"x=0",check:m`$0\ge0$ は真、$0>0$ は偽です。`,hint:"等号を含む境界を確かめます。"},
 {domain:m`実数 $a,b$`,p:"a^2=b^2",q:"a=b",value:"a=1,b=-1",check:m`$a^2=b^2=1$ ですが、$1\ne-1$。`,hint:"絶対値が同じでも符号が異なる数を考えます。"},
];
const disprove=(c:FalseClaim):Worked=>w(`${c.domain} について「${math(c.p)} ならば ${math(c.q)}」が偽であることを、反例で示しなさい。`,m`偽です。反例は ${math(c.value)}。`+c.check,c.hint,`${math(c.value)} を調べます。${c.check} 仮定を満たし結論を満たさない例が一つあるので、命題は偽です。`);
export const truth=logicTopic("m1-statements-counterexamples","命題の真偽と反例",[
 m`真か偽かが定まる文を命題といいます。「$2+3=5$」は真、「$2+3=6$」は偽です。「この数は大きい」のように基準が決まらない文は、ここでいう命題にはなりません。`,
 m`文字を含む $x>0$ だけでは、$x$ の値によって真偽が変わるので条件と呼びます。「すべての実数 $x$ で $x^2\ge0$」のように範囲と主張を定めると命題になります。`,
 m`「$p$ ならば $q$」では $p$ が仮定、$q$ が結論です。真であるとは、考えている範囲で $p$ を満たすものがすべて $q$ も満たすことです。数例がうまくいっても、全体の証明にはなりません。`,
 m`偽を示すには、仮定を満たし、結論を満たさない反例を一つ挙げます。仮定を満たさない数は反例になりません。「$x^2=4$ ならば $x=2$」の反例は $x=-2$。$x=0$ は仮定を満たさないので反例ではありません。`,
],"真は全体に通じる理由で、偽は仮定を満たす反例で示します。",[
 {id:"true-reason",title:"仮定から結論までつなぐ",why:"例の列挙ではなく、仮定を満たすすべての場合に通じる理由を示します。",sample:prove(trueClaims[0]),items:trueClaims.slice(1).map(prove)},
 {id:"counterexample",title:"反例の二つの条件",why:"候補について、仮定が真で結論が偽になることを両方確認します。",sample:disprove(counterClaims[0]),items:counterClaims.slice(1).map(disprove)},
]);

export const conditionCases=[
 {domain:m`実数 $x$`,p:"x=2",q:"x^2=4",forward:true,backward:false,f:m`$x=2$ を二乗すれば $x^2=4$。`,b:m`$x=-2$ は $x^2=4$ を満たすが $x=2$ を満たしません。`},
 {domain:m`実数 $x$`,p:"x>2",q:"x>0",forward:true,backward:false,f:m`$x>2>0$。`,b:m`$x=1$ は $x>0$ を満たすが $x>2$ を満たしません。`},
 {domain:m`実数 $x$`,p:"x^2=9",q:"x=3",forward:false,backward:true,f:m`$x=-3$ は $x^2=9$ を満たすが $x=3$ を満たしません。`,b:m`$x=3$ を二乗すると $x^2=9$。`},
 {domain:m`実数 $x$`,p:"x=0",q:"x^2=0",forward:true,backward:true,f:m`$0^2=0$。`,b:m`ゼロでない実数の二乗は正なので、$x^2=0$ なら $x=0$。`},
 {domain:m`実数 $x$`,p:"x>1",q:"x<3",forward:false,backward:false,f:m`$x=4$ は $x>1$ を満たすが $x<3$ を満たしません。`,b:m`$x=0$ は $x<3$ を満たすが $x>1$ を満たしません。`},
 {domain:m`整数 $n$`,p:m`n\text{ は偶数}`,q:m`n\text{ は }4\text{ の倍数}`,forward:false,backward:true,f:m`$n=2$ は偶数ですが $4$ の倍数ではありません。`,b:m`$n=4k=2(2k)$（$k$ は整数）なので偶数です。`},
 {domain:m`実数 $x$`,p:"x=1",q:"2x=2",forward:true,backward:true,f:m`$2\cdot1=2$。`,b:m`$2x=2$ の両辺を非零の数 $2$ で割ると $x=1$。`},
];
const relationName=(f:boolean,b:boolean)=>f?(b?"必要十分条件":"十分条件ですが、必要条件ではありません"):b?"必要条件ですが、十分条件ではありません":"必要条件でも十分条件でもありません";
const named=(c:typeof conditionCases[number]):Worked=>{
 const reasons=m`$p\Rightarrow q$ は${c.forward?"真":"偽"}。${c.f} $q\Rightarrow p$ は${c.backward?"真":"偽"}。${c.b}`;
 return w(`${c.domain} とする。${math("p:"+c.p)}、${math("q:"+c.q)} について、${math("p")} は ${math("q")} のどの条件ですか。両方向の理由も示しなさい。`,`${math("p")} は ${math("q")} の${relationName(c.forward,c.backward)}。`+reasons,"先に二つの向きの真偽を別々に確かめ、最後に名前を付けます。",reasons);
};
function directions(f:boolean,b:boolean,target:"p"|"q"="p"):Worked {
 const other=target==="p"?"q":"p",sufficient=target==="p"?f:b,necessary=target==="p"?b:f;
 const answer=relationName(sufficient,necessary);
 return w(m`条件 $p,q$ について、$p\Rightarrow q$ は${f?"真":"偽"}、$q\Rightarrow p$ は${b?"真":"偽"}と分かっています。${math(target)} は ${math(other)} のどの条件ですか。`,m`${math(target)} は ${math(other)} の${answer}。`,m`${math(target)} から ${math(other)} に届けば十分、逆向きに必ず戻れれば必要です。`,m`${math(target+"\\Rightarrow "+other)} が${sufficient?"真なので十分条件":"偽なので十分条件ではありません"}。${math(other+"\\Rightarrow "+target)} が${necessary?"真なので必要条件":"偽なので必要条件ではありません"}。両方を合わせて判定します。`);
}
export const necessary=logicTopic("m1-necessary-sufficient","必要条件・十分条件",[
 m`$p\Rightarrow q$ が真なら、$p$ は $q$ の十分条件です。$p$ が分かれば、$q$ だといえるだけの情報が「十分にある」と読みます。`,
 m`$q\Rightarrow p$ が真なら、$p$ は $q$ の必要条件です。$q$ が成り立つには、$p$ が必ず必要だと読みます。必要であっても、それだけで $q$ が成り立つとは限りません。`,
 m`両方向が真なら必要十分条件です。実数 $x$ について、「$x=2$」は「$x^2=4$」の十分条件ですが必要条件ではありません。$x=-2$ でも二乗は $4$ になるからです。`,
 m`判断の順序は、二つの向きを書く→それぞれの真偽と理由を調べる→名前を付ける、です。一つの反例で両方向が偽だと決めず、向きごとに仮定と結論を確認します。`,
],"どちら向きが成り立つかを先に決め、必要・十分の名前を付けます。",[
 {id:"direction-name",title:"矢印から必要・十分を読む",why:"十分は出発点から結論へ、必要は結論から必ず戻る条件です。",sample:directions(true,false),items:[directions(false,true),directions(true,true),directions(false,false),directions(true,false,"q"),directions(false,true,"q"),directions(true,true,"q")]},
 {id:"classify-conditions",title:"実際の条件を両方向に調べる",why:"各方向の証明または反例を用意してから、関係を名付けます。",sample:named(conditionCases[0]),items:conditionCases.slice(1).map(named)},
]);
