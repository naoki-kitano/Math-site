import type {Lesson,Exercise,Example} from "./lessons";
const m=String.raw;
type Q={family:string;prompt:string;answer:string;hint:string;working:string};
const q=(family:string,prompt:string,answer:string,hint:string,working:string):Q=>({family,prompt,answer,hint,working});
const iq=(family:string,integrand:string,result:string,domain:string,hint:string,working:string,check:string):Q=>q(family,
 m`次の不定積分を求め、微分して確かめなさい： $\int `+integrand+m`\,dx$。`+domain,
 "$"+result+m`+C$（$C$ は積分定数）。`+domain,hint,working+m` 検算：$`+check+"$。");
const example=(title:string,item:Q):Example=>({title,prompt:item.prompt,steps:[{title:"着目する",text:item.hint},{title:"途中式と検算",text:item.working},{title:"答え",text:item.answer}]});
type S=Lesson["supplements"][number];
const s=(id:string,title:string,text:string,tex:string,check:string,answer:string):S=>({id,title,text,tex,check,answer});
export const math3Chapter6Lessons:Lesson[]=[];
export const math3Chapter6Exercises:Exercise[]=[];
export const math3AntiderivativeOrder=["antiderivative-constant","power-integrals","trig-basic-integrals","exponential-integrals","linear-inner-integrals","reverse-chain-integrals","log-derivative-integrals","algebra-before-integrals","partial-fractions","trig-transform-integrals","substitution-integrals","radical-substitution","trig-substitution","parts-introduction","parts-log-trig","choose-integral"].map(x=>"m3-"+x);
function add(slug:string,title:string,description:string,introduction:string[],rule:string,examples:Example[],supplements:S[],ready:Q[],guided:Q[],practice:Q[],review:Q[],prerequisite:string){
 const lesson:Lesson={slug:"m3-"+slug,title,description,basicsTitle:title,subject:"数学III",chapter:"不定積分",introduction,rule,examples,supplements,guidedAfterExamples:true,prerequisites:[{slug:prerequisite,label:"関連する基礎"}]};
 math3Chapter6Lessons.push(lesson);
 for(const [stage,items] of [["ready",ready],["guided",guided],["practice",practice],["review",review]] as const)
  items.forEach((item,i)=>math3Chapter6Exercises.push({id:lesson.slug+"-"+stage+"-"+(i+1)+"-v1",lesson:lesson.slug,stage,family:item.family,repair:item.family,kind:"paper",prompt:item.prompt,answer:item.answer,hints:[item.hint],steps:[{title:"考えて進める",text:item.working},{title:"答え",text:item.answer}]}));
}
const all="実数全体で考えます。";
const pos=m`$x>0$ で考えます。`;
const nonzero=m`$x=0$ を含まない一つの区間で考えます。`;
const constantSupport=s("constant","同じ微分になる関数の集まり",m`ある区間で $F'=f$ なら $F$ は $f$ の原始関数です。定数を足しても微分は同じ。逆に二つの原始関数の差は導関数がゼロなので、その区間で定数です。`,m`\int f(x)\,dx=F(x)+C`,m`$\int2x\,dx$ を求めなさい。`,m`$x^2+C$。微分すると $2x$。区間が分かれているときは、各区間で定数を独立に選べます。`);
add("antiderivative-constant","原始関数と積分定数","微分すると元に戻る関数を求めよう。",[
 m`$F'(x)=f(x)$ となる関数 $F$ を、$f$ の原始関数といいます。例えば $x^2$ を微分すると $2x$ なので、$x^2$ は $2x$ の原始関数です。`,
 m`$x^2+3$ や $x^2-5$ も微分すると $2x$。これらをまとめた $x^2+C$ を不定積分とし、$\int2x\,dx=x^2+C$ と書きます。$C$ は任意の定数です。`,
 m`$dx$ は、どの変数について積分するかを示します。積分は、一つの数を出すのでなく、微分すると指定された式に戻る関数を求める操作です。`
],m`答えを微分して元の式へ戻るか確認し、積分定数を付けます。原始関数の差が定数になるのは、一つの区間で考えるときです。`,[
 example("定数をまとめる",iq("constant","2x","x^2",all,m`微分すると $2x$ になる関数を考えます。`,m`$(x^2)'=2x$。定数を足しても微分は変わりません。`,"(x^2+C)'=2x")),
 example("条件から一つに決める",q("initial-value",m`$F'(x)=2x$、$F(1)=3$ を満たす $F$ を求めなさい。`,m`$F(x)=x^2+2$。`,m`先に $F=x^2+C$ としてから条件を代入します。`,m`$3=1+C$ より $C=2$。微分は $2x$、$F(1)=3$ の両方を満たします。`))
],[constantSupport,s("initial-value","積分定数を条件から決める",m`導関数から求めた原始関数に積分定数を付け、元の関数の値の条件を代入します。`,m`F(x)=x^2+C`,m`$F'(x)=2x$、$F(0)=-1$ なら？`,m`$C=-1$、$F=x^2-1$。微分と点の条件を両方確認します。`)],[
 q("constant",m`$x^2$ と $x^2+7$ を微分し、違いを説明しなさい。`,m`どちらも $2x$。定数の違いは微分で消えます。`,m`定数の微分はゼロです。`,m`$(x^2+7)'=2x+0=2x$。`),
 q("initial-value",m`$F(x)=x^2+C$、$F(0)=4$ なら $C$ は？`,m`$C=4$。`,m`関数へ $0$ を入れます。`,m`$F(0)=0+C=4$。`)
],[
 iq("constant","3x^2","x^3",all,m`$(x^3)'$ を思い出します。`,m`定数を足して一般の原始関数を表します。`,"(x^3+C)'=3x^2"),
 q("initial-value",m`$F'=3x^2$、$F(1)=0$ なら $F$ は？`,m`$F=x^3-1$。`,m`$x^3+C$ に点の条件を入れます。`,m`$0=1+C$ なので $C=-1$。$(x^3-1)'=3x^2$、$F(1)=0$。`)
],[
 iq("constant","1","x",all,m`微分すると $1$ になる一次式です。`,m`定数の自由度を $C$ で残します。`,"(x+C)'=1"),
 iq("constant","0","0",all,m`微分してゼロになる関数を考えます。`,m`一つの区間では定数関数です。$0+C=C$ と書けます。`,"(C)'=0"),
 iq("constant","2x+1","x^2+x",all,m`和の各項を逆にたどります。`,m`$(x^2)'=2x$、$(x)'=1$。`,"(x^2+x+C)'=2x+1"),
 q("initial-value",m`$F'=1$、$F(2)=5$ を満たす $F$ は？`,m`$F=x+3$。`,m`$F=x+C$ に代入します。`,m`$5=2+C$ より $C=3$。$F'=1$ も確認できます。`),
 q("constant",m`$\int2x\,dx=x^2$ とだけ書くと、何が不足していますか。`,m`任意の積分定数 $C$。`,m`定数を足した原始関数もあります。`,m`不定積分は $x^2+C$。$x^2$ はその一つにすぎません。`),
 q("initial-value",m`$F'=2x+1$、$F(0)=-2$ のとき $F$ は？`,m`$F=x^2+x-2$。`,m`一般形から定数を決めます。`,m`$F=x^2+x+C$、$C=-2$。微分すると $2x+1$。`)
],[
 iq("constant","4x^3","x^4",all,m`指数を一つ戻して微分で確かめます。`,m`$x^4$ の導関数が $4x^3$ です。`,"(x^4+C)'=4x^3"),
 q("initial-value",m`$F'=4x^3$、$F(1)=2$ のとき $F$ は？`,m`$F=x^4+1$。`,m`$F=x^4+C$ を使います。`,m`$2=1+C$ から $C=1$。微分と値の条件を満たします。`)
],"m3-power-derivatives");

add("power-integrals","べきと逆数の積分","指数を一つ増やす理由と、逆数の例外を確かめよう。",[
 m`$(x^{r+1})'=(r+1)x^r$ なので、$r\ne-1$ なら $\int x^r\,dx=\dfrac{x^{r+1}}{r+1}+C$。微分で掛かる係数で割ります。分数指数はまず $x>0$ で扱います。`,
 m`$r=-1$ では分母がゼロになるので、この公式は使えません。代わりに $(\log|x|)'=\dfrac1x$ より $\int\dfrac1x\,dx=\log|x|+C$ です。`,
 m`$\log|x|$ は $x>0$ では $\log x$、$x<0$ では $\log(-x)$。どちらも微分すると $\dfrac1x$。ゼロをまたがない一つの区間で考えます。`
],m`根号・分母を指数で読み、指数が $-1$ かを先に区別します。`,[
 example("負の指数を積分する",iq("power",m`x^{-2}`,m`-\dfrac1x`,nonzero,m`指数を $-1$ に増やし、$-1$ で割ります。`,m`$\dfrac{x^{-1}}{-1}=-x^{-1}$。`,m`(-x^{-1}+C)'=x^{-2}`)),
 example("逆数は対数へ戻す",iq("reciprocal",m`\dfrac1x`,m`\log|x|`,nonzero,m`指数が $-1$ なので対数の微分を使います。`,m`$x<0$ でも $\log(-x)$ の導関数は $\dfrac{-1}{-x}=\dfrac1x$。`,m`(\log|x|+C)'=\dfrac1x`))
],[
 s("power","増やした指数で割る",m`$r\ne-1$ のとき、指数を一つ増やし、その新しい指数で割ります。分数指数では $x>0$ で公式を使います。`,m`\int x^r\,dx=\frac{x^{r+1}}{r+1}+C`,m`$\int\sqrt{x}\,dx$ は？`,m`$x^{\frac12}$ と読み、$\dfrac23x^{\frac32}+C$。微分すると $x^{\frac12}$。`),
 s("reciprocal","対数の絶対値",m`$\dfrac1x$ はべきの積分公式の例外です。$\log|x|$ を微分すると、正負どちらの区間でも $\dfrac1x$ になります。`,m`\int\frac1x\,dx=\log|x|+C`,m`$x<0$ で $\int\dfrac2x\,dx$ は？`,m`$2\log|x|+C$。微分は $\dfrac2x$。$0$ は含めません。`)
],[
 iq("power","x^2",m`\dfrac{x^3}3`,all,m`微分で係数 $3$ が出る分を割ります。`,m`指数は $2+1=3$。`,m`(\dfrac{x^3}3+C)'=x^2`),
 iq("reciprocal",m`\dfrac2x`,m`2\log|x|`,nonzero,m`定数倍を残します。`,m`$\dfrac1x$ の原始関数を二倍します。`,m`(2\log|x|+C)'=\dfrac2x`)
],[
 iq("power",m`\sqrt{x}`,m`\dfrac23x^{\frac32}`,pos,m`$\sqrt{x}=x^{\frac12}$ と読みます。`,m`新しい指数 $\dfrac32$ で割るので係数は $\dfrac23$。`,m`(\dfrac23x^{\frac32}+C)'=x^{\frac12}`),
 iq("reciprocal",m`-\dfrac3x`,m`-3\log|x|`,nonzero,m`負の定数倍もそのまま残します。`,m`対数の微分の三倍に負号を付けます。`,m`(-3\log|x|+C)'=-\dfrac3x`)
],[
 iq("power",m`\dfrac1{\sqrt{x}}`,m`2\sqrt{x}`,pos,m`指数は $-\dfrac12$ です。`,m`$-\dfrac12+1=\dfrac12$ で割るので $2x^{\frac12}$。`,m`(2\sqrt{x}+C)'=\dfrac1{\sqrt{x}}`),
 iq("power",m`\dfrac3{x^4}`,m`-\dfrac1{x^3}`,nonzero,m`$3x^{-4}$ と読みます。`,m`$3\cdot\dfrac{x^{-3}}{-3}=-x^{-3}$。`,m`(-x^{-3}+C)'=3x^{-4}`),
 iq("power","2x^2-3x+1",m`\dfrac23x^3-\dfrac32x^2+x`,all,m`和は項ごとに積分します。`,m`各項の指数を増やしてその数で割ります。`,m`(\dfrac23x^3-\dfrac32x^2+x+C)'=2x^2-3x+1`),
 iq("reciprocal",m`\dfrac1{2x}`,m`\dfrac12\log|x|`,nonzero,m`$\dfrac12$ 倍の逆数です。`,m`$\dfrac1{2x}=\dfrac12\cdot\dfrac1x$。`,m`(\dfrac12\log|x|+C)'=\dfrac1{2x}`),
 iq("power",m`x^{\frac23}`,m`\dfrac35x^{\frac53}`,pos,m`新しい指数は $\dfrac53$。`,m`$\dfrac53$ で割るので係数は $\dfrac35$。`,m`(\dfrac35x^{\frac53}+C)'=x^{\frac23}`),
 iq("reciprocal",m`\dfrac5x`,m`5\log|x|`,m`$x<0$ で考えます。`,m`負の範囲で $\log x$ は使えません。`,m`$\log|x|=\log(-x)$ を使います。`,m`(5\log(-x)+C)'=5\cdot\dfrac{-1}{-x}=\dfrac5x`)
],[
 iq("power",m`\dfrac2{x^3}`,m`-\dfrac1{x^2}`,nonzero,m`$2x^{-3}$ の指数を一つ増やします。`,m`$2\cdot\dfrac{x^{-2}}{-2}=-x^{-2}$。`,m`(-x^{-2}+C)'=2x^{-3}`),
 iq("reciprocal",m`\dfrac4x`,m`4\log|x|`,nonzero,m`指数を増やす公式で割れない場合です。`,m`対数の原始関数を四倍します。`,m`(4\log|x|+C)'=\dfrac4x`)
],"m3-antiderivative-constant");

const trigDomain=m`被積分関数が定義される一つの区間で考えます。`;
add("trig-basic-integrals","三角関数の基本積分","微分公式を逆に読み、符号を確かめよう。",[
 m`$(\sin x)'=\cos x$ より $\int\cos x\,dx=\sin x+C$。$(\cos x)'=-\sin x$ なので $\int\sin x\,dx=-\cos x+C$ です。`,
 m`$(\tan x)'=\dfrac1{\cos^2x}$ から $\int\dfrac1{\cos^2x}\,dx=\tan x+C$。分母がゼロになる点を含まない区間で使います。角は弧度法です。`
],m`微分公式と照合し、負号と定義される区間を確認します。`,[
 example("余弦の微分の負号を戻す",iq("sin-cos",m`\sin x`,m`-\cos x`,all,m`$\cos x$ を微分すると負号が付きます。`,m`原始関数を $-\cos x$ とすれば符号が戻ります。`,m`(-\cos x+C)'=\sin x`)),
 example("正接の微分に戻す",iq("tan-primitive",m`\dfrac1{\cos^2x}`,m`\tan x`,trigDomain,m`$\tan x$ の導関数と一致します。`,m`$\cos x\ne0$ の区間で正接を使います。`,m`(\tan x+C)'=\dfrac1{\cos^2x}`))
],[
 s("sin-cos","正弦と余弦の符号",m`正弦の積分には負号が付き、余弦の積分には付きません。微分して確認するのが確実です。`,m`(-\cos x)'=\sin x,\quad(\sin x)'=\cos x`,m`$\int(\sin x+\cos x)\,dx$ は？`,m`$-\cos x+\sin x+C$。微分すると $\sin x+\cos x$。`),
 s("tan-primitive","分母が余弦の二乗",m`正接の導関数を逆に使います。$\cos x=0$ では元の式も正接も定義されません。`,m`(\tan x)'=\frac1{\cos^2x}`,m`$\int\dfrac2{\cos^2x}\,dx$ は？`,m`$2\tan x+C$。$\cos x\ne0$ の各区間で成り立ちます。`)
],[
 iq("sin-cos",m`\cos x`,m`\sin x`,all,m`正弦の微分を逆に読みます。`,m`積分定数を加えます。`,m`(\sin x+C)'=\cos x`),
 iq("tan-primitive",m`\dfrac2{\cos^2x}`,m`2\tan x`,trigDomain,m`定数 $2$ を残します。`,m`正接の微分の二倍です。`,m`(2\tan x+C)'=\dfrac2{\cos^2x}`)
],[
 iq("sin-cos",m`2\sin x`,m`-2\cos x`,all,m`負号を忘れず二倍します。`,m`$-\cos x$ の二倍を使います。`,m`(-2\cos x+C)'=2\sin x`),
 iq("tan-primitive",m`-\dfrac1{\cos^2x}`,m`-\tan x`,trigDomain,m`正接の微分の符号を反転します。`,m`$\cos x\ne0$ の区間です。`,m`(-\tan x+C)'=-\dfrac1{\cos^2x}`)
],[
 iq("sin-cos",m`3\cos x`,m`3\sin x`,all,m`係数はそのままです。`,m`$\sin x$ を三倍します。`,m`(3\sin x+C)'=3\cos x`),
 iq("sin-cos",m`-\sin x`,m`\cos x`,all,m`余弦の導関数そのものです。`,m`二重に負号を付けないよう照合します。`,m`(\cos x+C)'=-\sin x`),
 iq("sin-cos",m`\sin x+\cos x`,m`-\cos x+\sin x`,all,m`二つの項を別々に積分します。`,m`和の原始関数は原始関数の和です。`,m`(-\cos x+\sin x+C)'=\sin x+\cos x`),
 iq("tan-primitive",m`\dfrac3{\cos^2x}`,m`3\tan x`,trigDomain,m`正接の微分の三倍です。`,m`$\cos x\ne0$ の区間を残します。`,m`(3\tan x+C)'=\dfrac3{\cos^2x}`),
 iq("sin-cos",m`2\cos x-\sin x`,m`2\sin x+\cos x`,all,m`第二項の負号は余弦の微分と一致します。`,m`各項に対応する原始関数を足します。`,m`(2\sin x+\cos x+C)'=2\cos x-\sin x`),
 iq("tan-primitive",m`\dfrac1{2\cos^2x}`,m`\dfrac12\tan x`,trigDomain,m`係数 $\dfrac12$ を残します。`,m`正接の導関数に $\dfrac12$ を掛けます。`,m`(\dfrac12\tan x+C)'=\dfrac1{2\cos^2x}`)
],[
 iq("sin-cos",m`\cos x-2\sin x`,m`\sin x+2\cos x`,all,m`第二項は $2\cos x$ の微分です。`,m`微分時の負号を見て決めます。`,m`(\sin x+2\cos x+C)'=\cos x-2\sin x`),
 iq("tan-primitive",m`-\dfrac2{\cos^2x}`,m`-2\tan x`,trigDomain,m`定数 $-2$ 倍です。`,m`元の分母がゼロになる点を除きます。`,m`(-2\tan x+C)'=-\dfrac2{\cos^2x}`)
],"m3-trigonometric-derivatives");

add("exponential-integrals","指数関数の積分","底によって微分の係数が変わることを使おう。",[
 m`$e^x$ は微分しても $e^x$ なので、$\int e^x\,dx=e^x+C$。`,
 m`$a>0$、$a\ne1$ なら $(a^x)'=a^x\log a$。余分な係数 $\log a$ を打ち消すため、$\int a^x\,dx=\dfrac{a^x}{\log a}+C$ とします。$a=1$ なら $\int1\,dx=x+C$ を使います。`
],m`指数関数の底を確認し、微分で出る係数を割って調整します。`,[
 example("自然対数の底",iq("exponential","e^x","e^x",all,m`微分して変わらない関数です。`,m`原始関数にも $e^x$ を使います。`,"(e^x+C)'=e^x")),
 example("一般の底",iq("exponential","2^x",m`\dfrac{2^x}{\log2}`,all,m`微分すると $\log2$ が掛かります。`,m`定数 $\log2$ で割れば係数が消えます。`,m`(\dfrac{2^x}{\log2}+C)'=\dfrac{2^x\log2}{\log2}=2^x`))
],[s("exponential","微分で生じる係数を補う",m`$a>0$、$a\ne1$ のとき、$a^x$ の微分で $\log a$ が掛かります。原始関数ではこの定数で割ります。`,m`\int a^x\,dx=\frac{a^x}{\log a}+C`,m`$\int3^x\,dx$ は？`,m`$\dfrac{3^x}{\log3}+C$。微分すると分母の $\log3$ と微分で出る $\log3$ が消えます。`)],[
 iq("exponential","3e^x","3e^x",all,m`定数倍をそのまま残します。`,m`$e^x$ の原始関数を三倍します。`,"(3e^x+C)'=3e^x"),
 iq("exponential","3^x",m`\dfrac{3^x}{\log3}`,all,m`微分で出る $\log3$ を割ります。`,m`係数を付けて逆にたどります。`,m`(\dfrac{3^x}{\log3}+C)'=3^x`)
],[
 iq("exponential","-e^x","-e^x",all,m`負の定数倍も残します。`,m`$e^x$ の原始関数の符号を反転します。`,"(-e^x+C)'=-e^x"),
 iq("exponential","5^x",m`\dfrac{5^x}{\log5}`,all,m`底に対応する自然対数で割ります。`,m`$\log5\ne0$ です。`,m`(\dfrac{5^x}{\log5}+C)'=5^x`)
],[
 iq("exponential","e^x+2","e^x+2x",all,m`定数項は一次式へ戻します。`,m`指数関数と定数を別々に積分します。`,"(e^x+2x+C)'=e^x+2"),
 iq("exponential",m`2\cdot3^x`,m`\dfrac{2\cdot3^x}{\log3}`,all,m`係数 $2$ は残して $\log3$ を割ります。`,m`定数倍の積分を使います。`,m`(\dfrac{2\cdot3^x}{\log3}+C)'=2\cdot3^x`),
 iq("exponential",m`\left(\dfrac12\right)^x`,m`-\dfrac{(\frac12)^x}{\log2}`,all,m`$\log\dfrac12=-\log2$ です。`,m`一般の底の公式を使うと負の係数になります。`,m`(-\dfrac{(\frac12)^x}{\log2}+C)'=(\dfrac12)^x`),
 iq("exponential",m`e^x+2^x`,m`e^x+\dfrac{2^x}{\log2}`,all,m`二つの底で係数の扱いを変えます。`,m`項ごとに原始関数を求めます。`,m`(e^x+\dfrac{2^x}{\log2}+C)'=e^x+2^x`),
 iq("exponential",m`(\log2)2^x`,"2^x",all,m`これは $2^x$ の導関数そのものです。`,m`既に $\log2$ が付いているので原始関数は $2^x$。`,m`(2^x+C)'=(\log2)2^x`),
 iq("exponential","1^x","x",all,m`底が $1$ なら関数は定数です。`,m`$1^x=1$。$\log1$ で割る公式は使いません。`,"(x+C)'=1=1^x")
],[
 iq("exponential",m`e^x-3^x`,m`e^x-\dfrac{3^x}{\log3}`,all,m`各底の微分公式を使います。`,m`差も項ごとに積分できます。`,m`(e^x-\dfrac{3^x}{\log3}+C)'=e^x-3^x`),
 iq("exponential",m`\left(\dfrac13\right)^x`,m`-\dfrac{(\frac13)^x}{\log3}`,all,m`底の対数は負になります。`,m`$\log\dfrac13=-\log3$ を使います。`,m`(-\dfrac{(\frac13)^x}{\log3}+C)'=(\dfrac13)^x`)
],"m3-exponential-log-derivatives");

add("linear-inner-integrals","一次式の中身と係数調整","内側の微分が定数なら、その定数で割ろう。",[
 m`$F'=f$ のとき $\{F(ax+b)\}'=a f(ax+b)$。$a\ne0$ なら原始関数を $\dfrac1aF(ax+b)$ とすれば、余分な係数が消えます。`,
 m`内側が一次式なので、その微分は定数です。中身が二次式の場合に、変数を含む微分でそのまま割る方法は使えません。`
],m`中身を保って原始関数へ戻し、内側の微分の定数で割ります。微分して係数と符号を検算します。`,[
 example("べきの係数を二段階で戻す",iq("linear-inner","(2x+1)^3",m`\dfrac{(2x+1)^4}8`,all,m`べきの微分で $4$、内側の微分で $2$ が掛かります。`,m`$(2x+1)^4$ を $4\cdot2=8$ で割ります。`,m`(\dfrac{(2x+1)^4}8+C)'=\dfrac{4(2x+1)^3\cdot2}8=(2x+1)^3`)),
 example("三角関数の中身を保つ",iq("linear-inner",m`\cos3x`,m`\dfrac13\sin3x`,all,m`$\sin3x$ の微分で係数 $3$ が出ます。`,m`原始関数の係数を $\dfrac13$ にします。`,m`(\dfrac13\sin3x+C)'=\cos3x`))
],[s("linear-inner","内側が一次式なら定数で割る",m`$F'=f$、$a\ne0$ のとき $\int f(ax+b)\,dx=\dfrac1aF(ax+b)+C$。元の式が定義される区間を保ちます。`,m`\left\{\frac1aF(ax+b)\right\}'=f(ax+b)`,m`$\int e^{-2x}\,dx$ は？`,m`$-\dfrac12e^{-2x}+C$。微分すると内側の $-2$ が掛かり $e^{-2x}$ に戻ります。`)],[
 iq("linear-inner","2x+1",m`\dfrac{(2x+1)^2}4`,all,m`二乗と中身の微分の両方を見ます。`,m`微分で $2\cdot2$ が出るので $4$ で割ります。`,m`(\dfrac{(2x+1)^2}4+C)'=2x+1`),
 iq("linear-inner","e^{2x}",m`\dfrac12e^{2x}`,all,m`内側の微分は $2$。`,m`定数で割って補正します。`,m`(\dfrac12e^{2x}+C)'=e^{2x}`)
],[
 iq("linear-inner","(3x-1)^2",m`\dfrac{(3x-1)^3}9`,all,m`べきの $3$ と内側の $3$ を掛けます。`,m`$(3x-1)^3$ を $9$ で割ります。`,m`(\dfrac{(3x-1)^3}9+C)'=(3x-1)^2`),
 iq("linear-inner",m`\sin2x`,m`-\dfrac12\cos2x`,all,m`正弦の積分の負号と、内側の $2$ を考えます。`,m`$-\cos2x$ を $2$ で割ります。`,m`(-\dfrac12\cos2x+C)'=\sin2x`)
],[
 iq("linear-inner","e^{-x}","-e^{-x}",all,m`内側の微分は $-1$ です。`,m`負の定数で割ります。`,"(-e^{-x}+C)'=e^{-x}"),
 iq("linear-inner",m`\sqrt{2x+1}`,m`\dfrac13(2x+1)^{\frac32}`,m`$x>-\dfrac12$。`,m`指数を $\dfrac32$ にして、その数と内側の $2$ で割ります。`,m`係数は $\dfrac23\cdot\dfrac12=\dfrac13$。`,m`(\dfrac13(2x+1)^{\frac32}+C)'=\sqrt{2x+1}`),
 iq("linear-inner",m`\dfrac1{(2x+1)^2}`,m`-\dfrac1{2(2x+1)}`,m`$-\dfrac12$ を含まない区間。`,m`中身の指数は $-2$ です。`,m`指数を $-1$ に増やし、$-1$ と $2$ で割ります。`,m`(-\dfrac1{2(2x+1)}+C)'=\dfrac1{(2x+1)^2}`),
 iq("linear-inner",m`\cos(1-x)`,m`-\sin(1-x)`,all,m`中身の微分は負です。`,m`$\sin(1-x)$ の微分の $-1$ を打ち消します。`,m`(-\sin(1-x)+C)'=\cos(1-x)`),
 iq("linear-inner","(1-2x)^4",m`-\dfrac{(1-2x)^5}{10}`,all,m`新しい指数 $5$ と内側の $-2$ を使います。`,m`$5(-2)=-10$ で割ります。`,m`(-\dfrac{(1-2x)^5}{10}+C)'=(1-2x)^4`),
 iq("linear-inner",m`\dfrac1{\cos^2(2x)}`,m`\dfrac12\tan2x`,trigDomain,m`$\tan2x$ の導関数を考えます。`,m`$\cos2x\ne0$ の区間で内側の係数 $2$ を補正します。`,m`(\dfrac12\tan2x+C)'=\dfrac1{\cos^2(2x)}`)
],[
 iq("linear-inner","e^{1-3x}",m`-\dfrac13e^{1-3x}`,all,m`内側の微分は $-3$。`,m`係数を $-\dfrac13$ にします。`,m`(-\dfrac13e^{1-3x}+C)'=e^{1-3x}`),
 iq("linear-inner",m`\sin(3x+1)`,m`-\dfrac13\cos(3x+1)`,all,m`正弦の負号と内側の係数を戻します。`,m`$-\cos(3x+1)$ を $3$ で割ります。`,m`(-\dfrac13\cos(3x+1)+C)'=\sin(3x+1)`)
],"m3-chain-rule");

add("reverse-chain-integrals","内側の微分を見付ける","中身の式と、その微分が外にあるかを見よう。",[
 m`$\{F(g(x))\}'=F'(g(x))g'(x)$。積分では、中身 $g(x)$ と外にある $g'(x)$ の対応を探します。`,
 m`例えば $e^{x^2}$ の中身の微分は $2x$。$\int2xe^{x^2}\,dx$ は $e^{x^2}+C$ へ戻せます。外に $x$ だけあれば、係数 $\dfrac12$ で合わせます。`,
 m`$e^{x^2}$ だけを見て、内側の微分 $2x$ で割ればよいわけではありません。変数を含む係数も微分されるからです。`
],m`合成関数を微分した形全体を探します。足りないのが定数倍だけなら調整できます。`,[
 example("中身と微分がそろっている",iq("reverse-chain","2xe^{x^2}","e^{x^2}",all,m`$x^2$ の微分 $2x$ が外にあります。`,m`合成関数の微分をそのまま逆にたどります。`,"(e^{x^2}+C)'=2xe^{x^2}")),
 example("係数だけを合わせる",iq("reverse-chain","xe^{x^2}",m`\dfrac12e^{x^2}`,all,m`必要な $2x$ に対して外には $x$ があります。`,m`$x=\dfrac12\cdot2x$ と見て、原始関数に $\dfrac12$ を掛けます。`,m`(\dfrac12e^{x^2}+C)'=xe^{x^2}`))
],[s("reverse-chain","合成関数の微分を逆に読む",m`中身を微分した因子が外にあるか確かめます。$F'=f$ なら、合成関数の微分から次が成り立ちます。`,m`\int f(g(x))g'(x)\,dx=F(g(x))+C`,m`$\int x\cos(x^2)\,dx$ は？`,m`$\dfrac12\sin(x^2)+C$。微分すると $\dfrac12\cos(x^2)\cdot2x=x\cos(x^2)$。`),
 s("applicability","中身の微分で割ればよいとは限らない",m`外に内側の微分がないとき、変数で割るだけでは積分できません。提案した答案を微分して確かめます。`,m`\left(\frac{e^{x^2}}{2x}\right)'=e^{x^2}-\frac{e^{x^2}}{2x^2}\quad(x\ne0)`,m`この式は $e^{x^2}$ の原始関数ですか。`,m`違います。余分な項が残ります。ここで学ぶ形に直接当てはまらないということで、別の積分問題へ無理に変形しません。`)],[
 iq("reverse-chain","2x(x^2+1)^2",m`\dfrac{(x^2+1)^3}3`,all,m`中身 $x^2+1$ の微分が外にあります。`,m`中身を一つのまとまりとして、二乗を三乗へ戻します。`,m`(\dfrac{(x^2+1)^3}3+C)'=2x(x^2+1)^2`),
 q("applicability",m`$\dfrac{e^{x^2}}{2x}$（$x>0$）を微分し、$e^{x^2}$ の原始関数か確かめなさい。`,m`原始関数ではありません。`,m`$\dfrac1{2x}$ も微分されます。`,m`導関数は $e^{x^2}-\dfrac{e^{x^2}}{2x^2}$ で元に戻りません。`)
],[
 iq("reverse-chain","3x^2e^{x^3}","e^{x^3}",all,m`中身 $x^3$ の微分は $3x^2$。`,m`合成関数の微分と一致します。`,"(e^{x^3}+C)'=3x^2e^{x^3}"),
 iq("reverse-chain",m`x\cos(x^2)`,m`\dfrac12\sin(x^2)`,all,m`中身の微分 $2x$ の半分です。`,m`正弦へ戻し係数を半分にします。`,m`(\dfrac12\sin(x^2)+C)'=x\cos(x^2)`)
],[
 iq("reverse-chain",m`2x\sqrt{x^2+1}`,m`\dfrac23(x^2+1)^{\frac32}`,all,m`中身の微分が外にそろっています。`,m`平方根の原始関数に中身を入れます。`,m`(\dfrac23(x^2+1)^{\frac32}+C)'=2x\sqrt{x^2+1}`),
 iq("reverse-chain",m`\sin x\,e^{\cos x}`,m`-e^{\cos x}`,all,m`中身の微分は $-\sin x$ です。`,m`足りない負号を外で補います。`,m`(-e^{\cos x}+C)'=\sin x\,e^{\cos x}`),
 iq("reverse-chain",m`\cos x\,\sin^2x`,m`\dfrac{\sin^3x}3`,all,m`中身を $\sin x$ と見ます。`,m`二乗を三乗へ戻し、$3$ で割ります。`,m`(\dfrac{\sin^3x}3+C)'=\sin^2x\cos x`),
 iq("reverse-chain",m`xe^{1-x^2}`,m`-\dfrac12e^{1-x^2}`,all,m`中身の微分は $-2x$。`,m`$x=-\dfrac12(-2x)$ と見ます。`,m`(-\dfrac12e^{1-x^2}+C)'=xe^{1-x^2}`),
 q("applicability",m`$\int e^{x^2}\,dx$ を $e^{x^2}$ とできますか。微分で確かめなさい。`,m`できません。`,m`合成関数の微分を行います。`,m`$(e^{x^2})'=2xe^{x^2}$ で、元の式にはない $2x$ が付きます。`),
 iq("reverse-chain",m`\dfrac{2x}{\sqrt{x^2+1}}`,m`2\sqrt{x^2+1}`,all,m`中身の指数は $-\dfrac12$。`,m`その原始関数は二倍の平方根です。`,m`(2\sqrt{x^2+1}+C)'=\dfrac{2x}{\sqrt{x^2+1}}`)
],[
 iq("reverse-chain","x(x^2+2)^3",m`\dfrac{(x^2+2)^4}8`,all,m`中身の微分の半分が外にあります。`,m`べきで $4$、中身で $2$ が出るので $8$ で割ります。`,m`(\dfrac{(x^2+2)^4}8+C)'=x(x^2+2)^3`),
 q("applicability",m`$\int\cos(x^2)\,dx=\sin(x^2)+C$ は正しいですか。`,m`正しくありません。`,m`右辺を微分して外の因子を確認します。`,m`$(\sin(x^2))'=2x\cos(x^2)$ で、元の式と違います。`)
],"m3-linear-inner-integrals");

add("log-derivative-integrals","分母の微分と対数","分子が分母の微分になっている形を見付けよう。",[
 m`$f(x)\ne0$ の区間では $\{\log|f(x)|\}'=\dfrac{f'(x)}{f(x)}$。分子が分母の微分なら、対数へ戻せます。`,
 m`元の分母がゼロになる点は除きます。分母が常に正なら絶対値を外せますが、負にもなる場合は勝手に外しません。`
],m`分母を微分 → 分子との係数を比べる → 対数へ戻す → 定義域と絶対値を確認します。`,[
 example("常に正の分母",iq("log-form",m`\dfrac{2x}{x^2+1}`,m`\log(x^2+1)`,all,m`分母の微分が分子と一致します。`,m`$x^2+1>0$ なので絶対値は不要です。`,m`(\log(x^2+1)+C)'=\dfrac{2x}{x^2+1}`)),
 example("一次式の係数と絶対値",iq("log-form",m`\dfrac1{2x+1}`,m`\dfrac12\log|2x+1|`,m`$-\dfrac12$ を含まない区間。`,m`分母の微分は $2$ で、分子はその半分です。`,m`係数 $\dfrac12$ を付け、絶対値を残します。`,m`(\dfrac12\log|2x+1|+C)'=\dfrac1{2x+1}`))
],[s("log-form","分母の変化率を分子と照合する",m`分母がゼロでない一つの区間で使います。分母の微分に対して分子が定数倍なら、その定数を外へ出します。`,m`\int\frac{f'(x)}{f(x)}\,dx=\log|f(x)|+C`,m`$\int\dfrac{x}{x^2+1}\,dx$ は？`,m`$\dfrac12\log(x^2+1)+C$。微分は $\dfrac12\cdot\dfrac{2x}{x^2+1}$。分母は正なので絶対値を外せます。`)],[
 iq("log-form",m`\dfrac1{x+1}`,m`\log|x+1|`,m`$-1$ を含まない区間。`,m`分母の微分は $1$。`,m`対数の微分の形です。`,m`(\log|x+1|+C)'=\dfrac1{x+1}`),
 iq("log-form",m`\dfrac{2x}{x^2+4}`,m`\log(x^2+4)`,all,m`分母は正で、その微分が分子です。`,m`絶対値なしの対数へ戻します。`,m`(\log(x^2+4)+C)'=\dfrac{2x}{x^2+4}`)
],[
 iq("log-form",m`\dfrac{x}{x^2+1}`,m`\dfrac12\log(x^2+1)`,all,m`分母の微分は $2x$。`,m`分子はその半分です。`,m`(\dfrac12\log(x^2+1)+C)'=\dfrac{x}{x^2+1}`),
 iq("log-form",m`\dfrac1{3x-2}`,m`\dfrac13\log|3x-2|`,m`$\dfrac23$ を含まない区間。`,m`分母の微分 $3$ で割ります。`,m`符号を限定していないため絶対値を残します。`,m`(\dfrac13\log|3x-2|+C)'=\dfrac1{3x-2}`)
],[
 iq("log-form",m`\dfrac{2x}{x^2-1}`,m`\log|x^2-1|`,m`$-1,1$ を含まない一つの区間。`,m`分母が負になる区間もあります。`,m`微分の形は一致しますが、対数には絶対値を付けます。`,m`(\log|x^2-1|+C)'=\dfrac{2x}{x^2-1}`),
 iq("log-form",m`\dfrac1{x\log x}`,m`\log|\log x|`,m`$0<x<1$ または $x>1$ の区間。`,m`$\dfrac1x$ を $\log x$ の微分として見ます。`,m`$\dfrac{(\log x)'}{\log x}$ の形です。`,m`(\log|\log x|+C)'=\dfrac1{x\log x}`),
 iq("log-form",m`\tan x`,m`-\log|\cos x|`,trigDomain,m`$\tan x=\dfrac{\sin x}{\cos x}$ と見ます。`,m`分母の微分が $-\sin x$ なので負号を補います。`,m`(-\log|\cos x|+C)'=\tan x`),
 iq("log-form",m`\dfrac{e^x}{e^x+1}`,m`\log(e^x+1)`,all,m`分母の微分が分子です。`,m`分母は正で絶対値を外せます。`,m`(\log(e^x+1)+C)'=\dfrac{e^x}{e^x+1}`),
 iq("log-form",m`\dfrac1{1-x}`,m`-\log|1-x|`,m`$1$ を含まない区間。`,m`分母の微分は $-1$ です。`,m`負号を付けて補正します。`,m`(-\log|1-x|+C)'=\dfrac1{1-x}`),
 iq("log-form",m`\dfrac{3x^2}{x^3+1}`,m`\log|x^3+1|`,m`$-1$ を含まない区間。`,m`三乗の微分が分子です。`,m`分母の符号は一定とは限らないため絶対値を保ちます。`,m`(\log|x^3+1|+C)'=\dfrac{3x^2}{x^3+1}`)
],[
 iq("log-form",m`\dfrac{x}{x^2+4}`,m`\dfrac12\log(x^2+4)`,all,m`分母の微分の半分です。`,m`分母は常に正。係数だけを補正します。`,m`(\dfrac12\log(x^2+4)+C)'=\dfrac{x}{x^2+4}`),
 iq("log-form",m`\dfrac{\cos x}{\sin x}`,m`\log|\sin x|`,trigDomain,m`分母の正弦の微分を見ます。`,m`$\sin x\ne0$ の区間で対数の形です。`,m`(\log|\sin x|+C)'=\dfrac{\cos x}{\sin x}`)
],"m3-reverse-chain-integrals");

add("radical-substitution","根号を外す置換","根号そのものを新しい変数にして整理しよう。",[
 m`$\sqrt{x}$ が分数の中に繰り返し現れるとき、$t=\sqrt{x}$ と置くと根号を外せます。$x=t^2$、$dx=2t\,dt$ も一緒に使います。`,
 m`ここでは $x>0$、したがって $t>0$ とします。置換後の式を割り算などで簡単にし、最後に $t=\sqrt{x}$ へ戻します。`
],m`根号を置換したら、元の変数と微分も新しい変数で表します。分母の条件を変換前後で確かめます。`,[
 example("根号を一次式にする",iq("radical-sub",m`\dfrac1{\sqrt{x}+1}`,m`2\sqrt{x}-2\log(\sqrt{x}+1)`,pos,m`$t=\sqrt{x}$、$dx=2t\,dt$ と置きます。`,m`$\int\dfrac{2t}{t+1}\,dt=\int(2-\dfrac2{t+1})\,dt=2t-2\log(t+1)+C$。$t>0$ なので対数の中は正です。`,m`(2\sqrt{x}-2\log(\sqrt{x}+1)+C)'=\dfrac1{\sqrt{x}}-\dfrac1{\sqrt{x}(\sqrt{x}+1)}=\dfrac1{\sqrt{x}+1}`)),
 example("微分の因子を約分する",iq("radical-sub",m`\dfrac1{\sqrt{x}(\sqrt{x}+1)}`,m`2\log(\sqrt{x}+1)`,pos,m`$t=\sqrt{x}$ にすると分母の $t$ と $dx$ の因子を約分できます。`,m`$dx=2t\,dt$ なので $\int\dfrac2{t+1}\,dt=2\log(t+1)+C$。`,m`(2\log(\sqrt{x}+1)+C)'=\dfrac1{\sqrt{x}(\sqrt{x}+1)}`))
],[s("radical-sub","根号・変数・微分を同時に変える",m`$x>0$ で $t=\sqrt{x}>0$ と置くと、$x=t^2$、$dx=2t\,dt$ です。例えば分子に根号がなくても、微分から因子 $2t$ が入ります。`,m`\int\frac1{\sqrt{x}+1}\,dx=\int\frac{2t}{t+1}\,dt`,m`右辺を積分して戻しなさい。`,m`$\dfrac{2t}{t+1}=2-\dfrac2{t+1}$ より $2t-2\log(t+1)+C$。戻すと $2\sqrt{x}-2\log(\sqrt{x}+1)+C$。微分すると元の分数へ戻ります。`)],[
 iq("radical-sub",m`\dfrac1{\sqrt{x}}`,m`2\sqrt{x}`,pos,m`あえて $t=\sqrt{x}$ で計算します。`,m`$dx=2t\,dt$、$\int\dfrac{2t}{t}\,dt=2t+C$。`,m`(2\sqrt{x}+C)'=\dfrac1{\sqrt{x}}`),
 iq("radical-sub",m`\dfrac1{\sqrt{x}+2}`,m`2\sqrt{x}-4\log(\sqrt{x}+2)`,pos,m`$t=\sqrt{x}$ と置きます。`,m`$dx=2t\,dt$、$\dfrac{2t}{t+2}=2-\dfrac4{t+2}$ を積分します。`,m`(2\sqrt{x}-4\log(\sqrt{x}+2)+C)'=\dfrac1{\sqrt{x}}-\dfrac2{\sqrt{x}(\sqrt{x}+2)}=\dfrac1{\sqrt{x}+2}`)
],[
 iq("radical-sub",m`\dfrac1{\sqrt{x}-1}`,m`2\sqrt{x}+2\log|\sqrt{x}-1|`,m`$0<x<1$ または $x>1$ の区間。`,m`$t=\sqrt{x}$、元の分母より $t\ne1$。`,m`$dx=2t\,dt$、$\dfrac{2t}{t-1}=2+\dfrac2{t-1}$。対数には絶対値を付けます。`,m`(2\sqrt{x}+2\log|\sqrt{x}-1|+C)'=\dfrac1{\sqrt{x}}+\dfrac1{\sqrt{x}(\sqrt{x}-1)}=\dfrac1{\sqrt{x}-1}`),
 iq("radical-sub",m`\dfrac1{\sqrt{x}(\sqrt{x}+2)}`,m`2\log(\sqrt{x}+2)`,pos,m`$t=\sqrt{x}$ の微分と分母の根号を合わせます。`,m`$dx=2t\,dt$ で $\int\dfrac2{t+2}\,dt$ になります。`,m`(2\log(\sqrt{x}+2)+C)'=\dfrac1{\sqrt{x}(\sqrt{x}+2)}`)
],[
 iq("radical-sub",m`\dfrac{\sqrt{x}}{\sqrt{x}-1}`,m`x+2\sqrt{x}+2\log|\sqrt{x}-1|`,m`$0<x<1$ または $x>1$ の区間。`,m`$t=\sqrt{x}$ と置いた後の分数を割り算します。`,m`$dx=2t\,dt$、$\dfrac{2t^2}{t-1}=2t+2+\dfrac2{t-1}$ を積分して戻します。`,m`(x+2\sqrt{x}+2\log|\sqrt{x}-1|+C)'=1+\dfrac1{\sqrt{x}}+\dfrac1{\sqrt{x}(\sqrt{x}-1)}=\dfrac{\sqrt{x}}{\sqrt{x}-1}`),
 iq("radical-sub",m`\dfrac{\sqrt{x}}{\sqrt{x}+1}`,m`x-2\sqrt{x}+2\log(\sqrt{x}+1)`,pos,m`$t=\sqrt{x}$ にして分子を二乗にします。`,m`$dx=2t\,dt$、$\dfrac{2t^2}{t+1}=2t-2+\dfrac2{t+1}$。積分して戻します。`,m`(x-2\sqrt{x}+2\log(\sqrt{x}+1)+C)'=1-\dfrac1{\sqrt{x}}+\dfrac1{\sqrt{x}(\sqrt{x}+1)}=\dfrac{\sqrt{x}}{\sqrt{x}+1}`),
 iq("radical-sub",m`\dfrac1{\sqrt{x}(\sqrt{x}-1)}`,m`2\log|\sqrt{x}-1|`,m`$0<x<1$ または $x>1$ の区間。`,m`$t=\sqrt{x}$、$t\ne1$。`,m`$dx=2t\,dt$ より $\int\dfrac2{t-1}\,dt$。絶対値を保ちます。`,m`(2\log|\sqrt{x}-1|+C)'=\dfrac1{\sqrt{x}(\sqrt{x}-1)}`),
 iq("radical-sub",m`\dfrac1{\sqrt{x}(\sqrt{x}+1)^2}`,m`-\dfrac2{\sqrt{x}+1}`,pos,m`根号と $dx$ の因子が消えます。`,m`$t=\sqrt{x}$、$dx=2t\,dt$ より $\int\dfrac2{(t+1)^2}\,dt=-\dfrac2{t+1}+C$。`,m`(-\dfrac2{\sqrt{x}+1}+C)'=\dfrac1{\sqrt{x}(\sqrt{x}+1)^2}`),
 iq("radical-sub",m`\dfrac1{(\sqrt{x}+1)^2}`,m`2\log(\sqrt{x}+1)+\dfrac2{\sqrt{x}+1}`,pos,m`$2t=2(t+1)-2$ と分子を分けます。`,m`$t=\sqrt{x}$、$dx=2t\,dt$。$\dfrac{2t}{(t+1)^2}=\dfrac2{t+1}-\dfrac2{(t+1)^2}$ を積分します。`,m`(2\log(\sqrt{x}+1)+\dfrac2{\sqrt{x}+1}+C)'=\dfrac1{\sqrt{x}(\sqrt{x}+1)}-\dfrac1{\sqrt{x}(\sqrt{x}+1)^2}=\dfrac1{(\sqrt{x}+1)^2}`),
 iq("radical-sub",m`\dfrac1{\sqrt{x}(\sqrt{x}+3)}`,m`2\log(\sqrt{x}+3)`,pos,m`$t=\sqrt{x}$ で変数を統一します。`,m`$dx=2t\,dt$ から $\int\dfrac2{t+3}\,dt$。`,m`(2\log(\sqrt{x}+3)+C)'=\dfrac1{\sqrt{x}(\sqrt{x}+3)}`)
],[
 iq("radical-sub",m`\dfrac1{\sqrt{x}+3}`,m`2\sqrt{x}-6\log(\sqrt{x}+3)`,pos,m`$t=\sqrt{x}$、$2t=2(t+3)-6$。`,m`$\int\dfrac{2t}{t+3}\,dt=\int(2-\dfrac6{t+3})\,dt$。`,m`(2\sqrt{x}-6\log(\sqrt{x}+3)+C)'=\dfrac1{\sqrt{x}+3}`),
 iq("radical-sub",m`\dfrac1{\sqrt{x}(\sqrt{x}+2)^2}`,m`-\dfrac2{\sqrt{x}+2}`,pos,m`$t=\sqrt{x}$ で二乗の逆数へ直します。`,m`$dx=2t\,dt$ より $\int\dfrac2{(t+2)^2}\,dt$。`,m`(-\dfrac2{\sqrt{x}+2}+C)'=\dfrac1{\sqrt{x}(\sqrt{x}+2)^2}`)
],"m3-substitution-integrals");

const circleRange=m`$-1<x<1$。$\sin\theta=x$、$-\dfrac\pi2<\theta<\dfrac\pi2$ とします。`;
const circleTwo=m`$-2<x<2$。$2\sin\theta=x$、$-\dfrac\pi2<\theta<\dfrac\pi2$ とします。`;
add("trig-substitution","三角置換と角の範囲","根号の形を三角関数の恒等式へ結び付けよう。",[
 m`$\sqrt{1-x^2}$ には $1-\sin^2\theta=\cos^2\theta$ が使えます。$x=\sin\theta$ と置くと根号は $\sqrt{\cos^2\theta}=|\cos\theta|$ です。`,
 m`$-1<x<1$ に対し $-\dfrac\pi2<\theta<\dfrac\pi2$ と選ぶと、$\theta$ が一意に定まり $\cos\theta>0$。根号を $\cos\theta$ と書けます。また $dx=\cos\theta\,d\theta$ です。`,
 m`元の変数に戻す際、$\sin\theta=x$、$\cos\theta=\sqrt{1-x^2}$ を使います。答案に残る $\theta$ は、指定した範囲で $\sin\theta=x$ を満たす角という意味です。積分定数とは別で、$x$ によって変わります。`
],m`置換式だけでなく角の範囲を定め、根号を外す際の絶対値と符号を確認します。`,[
 example("根号と微分の両方を変える",iq("trig-sub",m`\sqrt{1-x^2}`,m`\dfrac12\{x\sqrt{1-x^2}+\theta\}`,circleRange,m`$x=\sin\theta$、$dx=\cos\theta\,d\theta$。`,m`$\int\cos^2\theta\,d\theta=\dfrac\theta2+\dfrac14\sin2\theta+C$。$\sin2\theta=2x\sqrt{1-x^2}$ で戻します。$\theta'=\dfrac1{\sqrt{1-x^2}}$ です。`,m`\left(\dfrac{x\sqrt{1-x^2}+\theta}2+C\right)'=\dfrac12\left(\sqrt{1-x^2}-\dfrac{x^2}{\sqrt{1-x^2}}+\dfrac1{\sqrt{1-x^2}}\right)=\sqrt{1-x^2}`)),
 example("根号が微分と消える",iq("trig-sub",m`\dfrac1{\sqrt{1-x^2}}`,m`\theta`,circleRange,m`同じ置換で、分母と $dx$ の余弦が約分できます。`,m`$\int\dfrac{\cos\theta}{\cos\theta}\,d\theta=\theta+C$。$\sin\theta=x$ を微分すると $\cos\theta\,\theta'=1$。`,m`(\theta+C)'=\dfrac1{\cos\theta}=\dfrac1{\sqrt{1-x^2}}`))
],[
 s("trig-sub","円の恒等式で置き換える",m`$-1<x<1$ で $x=\sin\theta$、$-\dfrac\pi2<\theta<\dfrac\pi2$ と選ぶと、$\sqrt{1-x^2}=\cos\theta>0$、$dx=\cos\theta\,d\theta$。`,m`\int\sqrt{1-x^2}\,dx=\int\cos^2\theta\,d\theta`,m`積分して、元の変数との関係を示しなさい。`,m`$\dfrac\theta2+\dfrac14\sin2\theta+C=\dfrac12(\theta+x\sqrt{1-x^2})+C$。$\sin\theta=x$、指定範囲の角です。$\theta'=\dfrac1{\sqrt{1-x^2}}$ を使って微分すると元へ戻ります。`),
 s("angle-sign","二乗の平方根は絶対値",m`$\sqrt{u^2}=|u|$ です。余弦に置き換えても、この原則は変わりません。角の範囲から余弦の符号を確かめます。`,m`\sqrt{\cos^2\theta}=|\cos\theta|`,m`$-\dfrac\pi2<\theta<\dfrac\pi2$ なら何になりますか。`,m`$\cos\theta>0$ なので $\cos\theta$。負になる範囲なら $-\cos\theta$ です。`)
],[
 q("angle-sign",m`$\sqrt{\cos^2\theta}$ は、範囲の指定なしに $\cos\theta$ とできますか。`,m`できません。$|\cos\theta|$ です。`,m`負の数の二乗の平方根を考えます。`,m`例えば $\theta=\pi$ なら左辺は $1$、$\cos\theta=-1$。`),
 q("angle-sign",m`$-\dfrac\pi2<\theta<\dfrac\pi2$ のとき、$\sqrt{1-\sin^2\theta}$ を簡単にしなさい。`,m`$\cos\theta$。`,m`余弦が正になる範囲です。`,m`$\sqrt{\cos^2\theta}=|\cos\theta|=\cos\theta$。`)
],[
 iq("trig-sub",m`2\sqrt{1-x^2}`,m`x\sqrt{1-x^2}+\theta`,circleRange,m`例題の置換を保って二倍します。`,m`$2\int\cos^2\theta\,d\theta=\theta+\dfrac12\sin2\theta+C$。戻すと答案です。`,m`(x\sqrt{1-x^2}+\theta+C)'=2\sqrt{1-x^2}`),
 iq("trig-sub",m`\dfrac2{\sqrt{1-x^2}}`,m`2\theta`,circleRange,m`$dx$ と分母の余弦を約分します。`,m`$2\int d\theta=2\theta+C$。`,m`(2\theta+C)'=\dfrac2{\sqrt{1-x^2}}`)
],[
 iq("trig-sub",m`\sqrt{4-x^2}`,m`\dfrac x2\sqrt{4-x^2}+2\theta`,circleTwo,m`$x=2\sin\theta$、$dx=2\cos\theta\,d\theta$。`,m`根号は $2\cos\theta$。$4\int\cos^2\theta\,d\theta=2\theta+\sin2\theta+C$。$\sin2\theta=\dfrac x2\sqrt{4-x^2}$、$\theta'=\dfrac1{\sqrt{4-x^2}}$。`,m`(\dfrac x2\sqrt{4-x^2}+2\theta+C)'=\dfrac12\sqrt{4-x^2}-\dfrac{x^2}{2\sqrt{4-x^2}}+\dfrac2{\sqrt{4-x^2}}=\sqrt{4-x^2}`),
 iq("trig-sub",m`\dfrac1{\sqrt{4-x^2}}`,m`\theta`,circleTwo,m`分母も $dx$ も $2\cos\theta$ を含みます。`,m`$\int\dfrac{2\cos\theta}{2\cos\theta}\,d\theta=\theta+C$。`,m`(\theta+C)'=\dfrac1{2\cos\theta}=\dfrac1{\sqrt{4-x^2}}`),
 iq("trig-sub",m`\dfrac{x^2}{\sqrt{1-x^2}}`,m`\dfrac12\{\theta-x\sqrt{1-x^2}\}`,circleRange,m`置換すると余弦が消え、正弦の二乗が残ります。`,m`$\int\sin^2\theta\,d\theta=\dfrac\theta2-\dfrac14\sin2\theta+C$。元へ戻します。`,m`\left(\dfrac{\theta-x\sqrt{1-x^2}}2+C\right)'=\dfrac12\left(\dfrac1{\sqrt{1-x^2}}-\sqrt{1-x^2}+\dfrac{x^2}{\sqrt{1-x^2}}\right)=\dfrac{x^2}{\sqrt{1-x^2}}`),
 iq("trig-sub",m`\dfrac{x}{\sqrt{1-x^2}}`,m`-\sqrt{1-x^2}`,circleRange,m`三角置換すると $\sin\theta$ の積分になります。`,m`$\int\sin\theta\,d\theta=-\cos\theta+C$。$\cos\theta=\sqrt{1-x^2}$ に戻します。`,m`(-\sqrt{1-x^2}+C)'=\dfrac{x}{\sqrt{1-x^2}}`),
 q("angle-sign",m`$\dfrac\pi2<\theta<\pi$ で $\sqrt{\cos^2\theta}$ は？`,m`$-\cos\theta$。`,m`第二象限の余弦は負です。`,m`平方根は非負なので、負の余弦に負号を付けます。`),
 q("angle-sign",m`$x=2\sin\theta$、$-\dfrac\pi2<\theta<\dfrac\pi2$ のとき、$\sqrt{4-x^2}$ を表しなさい。`,m`$2\cos\theta$。`,m`$4$ を根号の外へ出して符号を確認します。`,m`$\sqrt{4\cos^2\theta}=2|\cos\theta|=2\cos\theta$。`)
],[
 iq("trig-sub",m`\dfrac{1-x^2}{\sqrt{1-x^2}}`,m`\dfrac12\{x\sqrt{1-x^2}+\theta\}`,circleRange,m`正の根号で割ると平方根に戻ります。`,m`元の式は $\sqrt{1-x^2}$。三角置換で $\int\cos^2\theta\,d\theta$ と計算します。`,m`\left(\dfrac{x\sqrt{1-x^2}+\theta}2+C\right)'=\sqrt{1-x^2}=\dfrac{1-x^2}{\sqrt{1-x^2}}`),
 q("angle-sign",m`$\pi<\theta<\dfrac{3\pi}2$ で $\sqrt{4\cos^2\theta}$ は？`,m`$-2\cos\theta$。`,m`第三象限でも余弦は負です。`,m`$2|\cos\theta|$ から、余弦の符号で絶対値を外します。`)
],"m3-trig-transform-integrals");

add("parts-introduction","積の微分から部分積分へ","微分すると簡単になる因子を選ぼう。",[
 m`積の微分 $(uv)'=u'v+uv'$ を積分すると、$\int uv'\,dx=uv-\int u'v\,dx$ です。これを部分積分といいます。`,
 m`$\int xe^x\,dx$ なら、$x$ を微分すると $1$ になり、$e^x$ は積分しても扱いやすいので、$u=x$、$v'=e^x$ と選びます。`,
 m`積だから必ず部分積分、とは限りません。$xe^{x^2}$ は中身の微分がそろう置換の形です。残りの積分が簡単になるかで選びます。`
],m`微分する因子と積分する因子を決め、積の項から残りの積分を引きます。答案は積の微分で検算します。`,[
 example("一次式を微分して消す",iq("parts-exp","xe^x","xe^x-e^x",all,m`$u=x$、$v'=e^x$ として $u'=1,v=e^x$。`,m`$\int xe^x\,dx=xe^x-\int e^x\,dx=xe^x-e^x+C$。`,"(xe^x-e^x+C)'=e^x+xe^x-e^x=xe^x")),
 example("先に指数の係数を調整",iq("parts-exp","xe^{2x}",m`\dfrac x2e^{2x}-\dfrac14e^{2x}`,all,m`$u=x$、$v'=e^{2x}$ なら $v=\dfrac12e^{2x}$。`,m`$\dfrac x2e^{2x}-\dfrac12\int e^{2x}\,dx$。残りの積分でも係数を調整します。`,m`(\dfrac x2e^{2x}-\dfrac14e^{2x}+C)'=\dfrac12e^{2x}+xe^{2x}-\dfrac12e^{2x}=xe^{2x}`))
],[s("parts-exp","積の項から残りの積分を引く",m`$u=x$、$v'=e^x$ を選ぶと $u'=1$、$v=e^x$。残りの積分の一次式がなくなります。`,m`\int uv'\,dx=uv-\int u'v\,dx`,m`$\int xe^x\,dx$ は？`,m`$xe^x-\int e^x\,dx=xe^x-e^x+C$。微分すると余分な $e^x$ が消えます。`)],[
 iq("parts-exp","(x+1)e^x","xe^x",all,m`$u=x+1$ を微分します。`,m`$(x+1)e^x-\int e^x\,dx=xe^x+C$。`,"(xe^x+C)'=(x+1)e^x"),
 iq("parts-exp","2xe^x","2xe^x-2e^x",all,m`定数倍を外へ出し、$x$ を微分します。`,m`$2(xe^x-\int e^x\,dx)$。`,"(2xe^x-2e^x+C)'=2xe^x")
],[
 iq("parts-exp","(x-1)e^x","(x-2)e^x",all,m`$u=x-1$、$v=e^x$。`,m`$(x-1)e^x-\int e^x\,dx=(x-2)e^x+C$。`,"((x-2)e^x+C)'=(x-1)e^x"),
 iq("parts-exp","xe^{-x}","-(x+1)e^{-x}",all,m`$v'=e^{-x}$ の原始関数は $-e^{-x}$。`,m`$-xe^{-x}+\int e^{-x}\,dx=-xe^{-x}-e^{-x}+C$。`,"(-(x+1)e^{-x}+C)'=-e^{-x}+(x+1)e^{-x}=xe^{-x}")
],[
 iq("parts-exp","(2x-1)e^x","(2x-3)e^x",all,m`一次式を微分すると $2$ になります。`,m`$(2x-1)e^x-\int2e^x\,dx$。`,"((2x-3)e^x+C)'=2e^x+(2x-3)e^x=(2x-1)e^x"),
 iq("parts-exp","x^2e^x","(x^2-2x+2)e^x",all,m`$x^2$ を微分すると $2x$。残りをもう一度部分積分します。`,m`$x^2e^x-2\int xe^x\,dx=x^2e^x-2(xe^x-e^x)+C$。`,"((x^2-2x+2)e^x+C)'=(2x-2+x^2-2x+2)e^x=x^2e^x"),
 iq("parts-exp","(x+1)e^{2x}",m`(\dfrac x2+\dfrac14)e^{2x}`,all,m`$v=\dfrac12e^{2x}$ として係数を残します。`,m`$\dfrac{x+1}2e^{2x}-\dfrac12\int e^{2x}\,dx=(\dfrac x2+\dfrac14)e^{2x}+C$。`,m`((\dfrac x2+\dfrac14)e^{2x}+C)'=(x+1)e^{2x}`),
 iq("parts-exp","(x-1)e^{-x}","-xe^{-x}",all,m`指数の積分の負号を追います。`,m`$-(x-1)e^{-x}+\int e^{-x}\,dx=-xe^{-x}+C$。`,"(-xe^{-x}+C)'=-e^{-x}+xe^{-x}=(x-1)e^{-x}"),
 iq("parts-exp",m`x2^x`,m`\dfrac{x2^x}{\log2}-\dfrac{2^x}{(\log2)^2}`,all,m`$v' =2^x$ なら $v=\dfrac{2^x}{\log2}$。`,m`$\dfrac{x2^x}{\log2}-\dfrac1{\log2}\int2^x\,dx$。残りでも $\log2$ で割ります。`,m`(\dfrac{x2^x}{\log2}-\dfrac{2^x}{(\log2)^2}+C)'=\dfrac{2^x}{\log2}+x2^x-\dfrac{2^x}{\log2}=x2^x`),
 iq("parts-exp","(1-x)e^x","(2-x)e^x",all,m`一次式の微分が $-1$ です。`,m`$(1-x)e^x+\int e^x\,dx=(2-x)e^x+C$。`,"((2-x)e^x+C)'=-e^x+(2-x)e^x=(1-x)e^x")
],[
 iq("parts-exp","(x+2)e^x","(x+1)e^x",all,m`$u=x+2$ とします。`,m`$(x+2)e^x-\int e^x\,dx=(x+1)e^x+C$。`,"((x+1)e^x+C)'=(x+2)e^x"),
 iq("parts-exp","2xe^{-2x}",m`-(x+\dfrac12)e^{-2x}`,all,m`$u=2x$、$v=-\dfrac12e^{-2x}$ とします。`,m`$-xe^{-2x}+\int e^{-2x}\,dx=-(x+\dfrac12)e^{-2x}+C$。`,m`(-(x+\dfrac12)e^{-2x}+C)'=-e^{-2x}+(2x+1)e^{-2x}=2xe^{-2x}`)
],"m3-substitution-integrals");

add("parts-log-trig","三角関数・対数の部分積分","積が見えないときも、一を因子として考えよう。",[
 m`$\int x\cos x\,dx$ では $x$ を微分し、$\cos x$ を積分すると、残りは正弦の基本積分になります。`,
 m`$\int\log x\,dx$ は $\int(\log x)\cdot1\,dx$ と見ます。$\log x$ を微分して $\dfrac1x$、$1$ を積分して $x$ にすると、残りが簡単になります。`
],m`微分すると簡単になる因子を選びます。残りの積分を引く負号と、元の定義域を最後まで保ちます。`,[
 example("余弦を積分して残りを簡単にする",iq("parts-trig",m`x\cos x`,m`x\sin x+\cos x`,all,m`$u=x$、$v'=\cos x$、$v=\sin x$。`,m`$x\sin x-\int\sin x\,dx=x\sin x+\cos x+C$。`,m`(x\sin x+\cos x+C)'=\sin x+x\cos x-\sin x=x\cos x`)),
 example("一との積として見る",iq("parts-log",m`\log x`,m`x\log x-x`,pos,m`$u=\log x$、$v'=1$ とします。`,m`$x\log x-\int x\cdot\dfrac1x\,dx=x\log x-x+C$。`,m`(x\log x-x+C)'=\log x+1-1=\log x`))
],[
 s("parts-trig","残りの積分の符号を追う",m`$x$ を微分して定数にし、三角関数を積分します。引く積分の答えが負なら、全体では正になります。`,m`\int x\cos x\,dx=x\sin x-\int\sin x\,dx`,m`最後まで計算しなさい。`,m`$x\sin x+\cos x+C$。微分で余分な $\sin x$ が消えます。`),
 s("parts-log","対数を微分する側にする",m`$x>0$ で $\log x$ の微分は $\dfrac1x$。$1$ を積分して得る $x$ と打ち消せます。`,m`\int\log x\,dx=x\log x-\int1\,dx`,m`原始関数は？`,m`$x\log x-x+C$。微分すると $\log x+1-1=\log x$。`)
],[
 iq("parts-trig",m`x\sin x`,m`-x\cos x+\sin x`,all,m`正弦の原始関数は負の余弦です。`,m`$-x\cos x+\int\cos x\,dx$ を計算します。`,m`(-x\cos x+\sin x+C)'=x\sin x`),
 iq("parts-log",m`2\log x`,m`2x\log x-2x`,pos,m`定数 $2$ を外へ出します。`,m`$2(x\log x-\int1\,dx)$ です。`,m`(2x\log x-2x+C)'=2\log x`)
],[
 iq("parts-trig",m`x\cos2x`,m`\dfrac x2\sin2x+\dfrac14\cos2x`,all,m`$v=\dfrac12\sin2x$ を使います。`,m`$\dfrac x2\sin2x-\dfrac12\int\sin2x\,dx$。`,m`(\dfrac x2\sin2x+\dfrac14\cos2x+C)'=x\cos2x`),
 iq("parts-log",m`x\log x`,m`\dfrac{x^2}2\log x-\dfrac{x^2}4`,pos,m`$u=\log x$、$v'=x$ にします。`,m`$\dfrac{x^2}2\log x-\int\dfrac{x^2}2\cdot\dfrac1x\,dx=\dfrac{x^2}2\log x-\dfrac{x^2}4+C$。`,m`(\dfrac{x^2}2\log x-\dfrac{x^2}4+C)'=x\log x+\dfrac x2-\dfrac x2=x\log x`)
],[
 iq("parts-trig",m`(x+1)\cos x`,m`(x+1)\sin x+\cos x`,all,m`一次式を微分する側にします。`,m`$(x+1)\sin x-\int\sin x\,dx$。`,m`((x+1)\sin x+\cos x+C)'=(x+1)\cos x`),
 iq("parts-trig",m`x\sin2x`,m`-\dfrac x2\cos2x+\dfrac14\sin2x`,all,m`$v=-\dfrac12\cos2x$ の負号を保ちます。`,m`$-\dfrac x2\cos2x+\dfrac12\int\cos2x\,dx$。`,m`(-\dfrac x2\cos2x+\dfrac14\sin2x+C)'=x\sin2x`),
 iq("parts-log",m`\log(2x)`,m`x\log(2x)-x`,pos,m`$\{\log(2x)\}'=\dfrac1x$ です。`,m`$u=\log(2x)$、$v'=1$ から $x\log(2x)-\int1\,dx$。`,m`(x\log(2x)-x+C)'=\log(2x)`),
 iq("parts-log",m`x^2\log x`,m`\dfrac{x^3}3\log x-\dfrac{x^3}9`,pos,m`対数を微分し、二乗を積分します。`,m`$\dfrac{x^3}3\log x-\dfrac13\int x^2\,dx$。`,m`(\dfrac{x^3}3\log x-\dfrac{x^3}9+C)'=x^2\log x`),
 iq("parts-trig",m`(1-x)\sin x`,m`(x-1)\cos x-\sin x`,all,m`一次式の微分も正弦の原始関数も負です。`,m`$-(1-x)\cos x-\int\cos x\,dx$ を計算します。`,m`((x-1)\cos x-\sin x+C)'=(1-x)\sin x`),
 iq("parts-log",m`\log|x|`,m`x\log|x|-x`,nonzero,m`負の区間でも導関数は $\dfrac1x$。`,m`$u=\log|x|$、$v'=1$ で $x\log|x|-\int1\,dx$。`,m`(x\log|x|-x+C)'=\log|x|`)
],[
 iq("parts-trig",m`(x-1)\cos x`,m`(x-1)\sin x+\cos x`,all,m`$x-1$ を微分して $1$ にします。`,m`$(x-1)\sin x-\int\sin x\,dx$。`,m`((x-1)\sin x+\cos x+C)'=(x-1)\cos x`),
 iq("parts-log",m`\log(3x)`,m`x\log(3x)-x`,pos,m`対数の微分はやはり $\dfrac1x$ です。`,m`$u=\log(3x)$、$v'=1$ で残りは $\int1\,dx$。`,m`(x\log(3x)-x+C)'=\log(3x)`)
],"m3-parts-introduction");


add("algebra-before-integrals","積分の前の式変形","展開や項別の割り算で、基本形の和に直そう。",[
 m`積や分数のまま難しそうに見えても、展開や項別の割り算で既知の積分の和に直せることがあります。`,
 m`$\dfrac{x^2+1}{x}=x+\dfrac1x$ は $x\ne0$ での等式です。式を簡単にしても、元の分母の条件は残します。`
],m`まず基本形の和へ直せるかを見ます。積の積分を、積分した結果どうしの積にしてはいけません。`,[
 example("積を展開する",iq("expand","(x+1)(x+2)",m`\dfrac{x^3}3+\dfrac32x^2+2x`,all,m`二つの一次式を展開します。`,m`$(x+1)(x+2)=x^2+3x+2$。項ごとに積分します。`,m`(\dfrac{x^3}3+\dfrac32x^2+2x+C)'=x^2+3x+2=(x+1)(x+2)`)),
 example("分子の各項を分母で割る",iq("divide",m`\dfrac{x^2+1}{x}`,m`\dfrac{x^2}2+\log|x|`,nonzero,m`分母の $x$ で二項をそれぞれ割ります。`,m`$x+\dfrac1x$ となり、べきと対数の基本形へ分かれます。`,m`(\dfrac{x^2}2+\log|x|+C)'=x+\dfrac1x=\dfrac{x^2+1}{x}`))
],[
 s("expand","先に積を展開する",m`積のままでは基本形に見えないとき、展開して各項を積分します。積分した式どうしを掛ける規則はありません。`,m`(x+1)^2=x^2+2x+1`,m`$\int(x+1)^2\,dx$ は？`,m`$\dfrac{x^3}3+x^2+x+C$。微分すると展開後の式へ戻ります。`),
 s("divide","分子の全項を割る",m`分子が和なら、その各項を同じ分母で割れます。変形前の分母がゼロになる値は除きます。`,m`\frac{x^2+1}{x}=x+\frac1x\quad(x\ne0)`,m`これを積分すると？`,m`$\dfrac{x^2}2+\log|x|+C$。ゼロを含まない区間で微分して元に戻ります。`)
],[
 iq("expand","(x+1)^2",m`\dfrac{x^3}3+x^2+x`,all,m`平方を展開します。`,m`$x^2+2x+1$ を項別に積分します。`,m`(\dfrac{x^3}3+x^2+x+C)'=(x+1)^2`),
 iq("divide",m`\dfrac{x+1}x`,m`x+\log|x|`,nonzero,m`$1+\dfrac1x$ に分けます。`,m`定数と逆数の積分を使います。`,m`(x+\log|x|+C)'=\dfrac{x+1}x`)
],[
 iq("expand","(x-1)(x+2)",m`\dfrac{x^3}3+\dfrac{x^2}2-2x`,all,m`展開すると一次の項は $x$ です。`,m`$x^2+x-2$ を積分します。`,m`(\dfrac{x^3}3+\dfrac{x^2}2-2x+C)'=(x-1)(x+2)`),
 iq("divide",m`\dfrac{x^2-1}x`,m`\dfrac{x^2}2-\log|x|`,nonzero,m`負号を保って各項を割ります。`,m`$x-\dfrac1x$ の積分です。`,m`(\dfrac{x^2}2-\log|x|+C)'=\dfrac{x^2-1}x`)
],[
 iq("expand","x(x+1)^2",m`\dfrac{x^4}4+\dfrac23x^3+\dfrac{x^2}2`,all,m`二乗を展開してから $x$ を掛けます。`,m`$x^3+2x^2+x$ を項ごとに積分します。`,m`(\dfrac{x^4}4+\dfrac23x^3+\dfrac{x^2}2+C)'=x(x+1)^2`),
 iq("divide",m`\dfrac{x^2+x+1}{x^2}`,m`x+\log|x|-\dfrac1x`,nonzero,m`三つの項をすべて $x^2$ で割ります。`,m`$1+\dfrac1x+\dfrac1{x^2}$ に分けます。`,m`(x+\log|x|-\dfrac1x+C)'=\dfrac{x^2+x+1}{x^2}`),
 iq("expand",m`(e^x+1)^2`,m`\dfrac12e^{2x}+2e^x+x`,all,m`指数関数も平方の展開が使えます。`,m`$e^{2x}+2e^x+1$。第一項は内側の係数 $2$ で調整します。`,m`(\dfrac12e^{2x}+2e^x+x+C)'=(e^x+1)^2`),
 iq("divide",m`\dfrac{x+1}{\sqrt{x}}`,m`\dfrac23x^{\frac32}+2\sqrt{x}`,pos,m`各項を割り、指数で読みます。`,m`$x^{\frac12}+x^{-\frac12}$ に直します。`,m`(\dfrac23x^{\frac32}+2\sqrt{x}+C)'=\dfrac{x+1}{\sqrt{x}}`),
 iq("expand",m`(e^x-1)(e^x+1)`,m`\dfrac12e^{2x}-x`,all,m`和と差の積は二乗の差です。`,m`$e^{2x}-1$ を積分します。`,m`(\dfrac12e^{2x}-x+C)'=(e^x-1)(e^x+1)`),
 iq("divide",m`\dfrac{x^2-1}{x-1}`,m`\dfrac{x^2}2+x`,m`$1$ を含まない区間。`,m`分子を因数分解して約分します。`,m`$x\ne1$ で $x+1$。条件は約分後も残します。`,m`(\dfrac{x^2}2+x+C)'=x+1=\dfrac{x^2-1}{x-1}\quad(x\ne1)`)
],[
 iq("expand","(x-2)^2",m`\dfrac{x^3}3-2x^2+4x`,all,m`$x^2-4x+4$ と展開します。`,m`各項の原始関数を足します。`,m`(\dfrac{x^3}3-2x^2+4x+C)'=(x-2)^2`),
 iq("divide",m`\dfrac{2x^2+1}x`,m`x^2+\log|x|`,nonzero,m`$2x+\dfrac1x$ に分けます。`,m`元の分母の条件を保ちます。`,m`(x^2+\log|x|+C)'=\dfrac{2x^2+1}x`)
],"m3-log-derivative-integrals");

add("partial-fractions","部分分数分解と積分","分数を基本的な分数の和に分けよう。",[
 m`分母が一次式の積なら、簡単な分数の和や差に分けることで対数の基本形に直せることがあります。`,
 m`$\dfrac1{x(x+1)}=\dfrac A x+\dfrac B{x+1}$ と置き、通分すると $1=A(x+1)+Bx$。定数項と一次の係数を比べて $A=1,B=-1$ です。`
],m`分ける形を置く → 通分して分子の恒等式を作る → 係数を決める → 積分する。元の分母の条件を残します。`,[
 example("二つの逆数へ分ける",iq("partial-fractions",m`\dfrac1{x(x+1)}`,m`\log|x|-\log|x+1|`,m`$-1,0$ を含まない区間。`,m`$\dfrac A x+\dfrac B{x+1}$ と置きます。`,m`$1=A(x+1)+Bx$ より $A=1$、$A+B=0$、$B=-1$。`,m`(\log|x|-\log|x+1|+C)'=\dfrac1x-\dfrac1{x+1}=\dfrac1{x(x+1)}`)),
 example("差の係数を調整する",iq("partial-fractions",m`\dfrac1{x(x+2)}`,m`\dfrac12\log|x|-\dfrac12\log|x+2|`,m`$-2,0$ を含まない区間。`,m`二つの逆数の差を通分してみます。`,m`$\dfrac1x-\dfrac1{x+2}=\dfrac2{x(x+2)}$ なので半分にします。`,m`(\dfrac12\log|x|-\dfrac12\log|x+2|+C)'=\dfrac1{x(x+2)}`))
],[s("partial-fractions","通分して係数を決める",m`元の分母から $x\ne0,-1$ が必要です。$\frac A x+\frac B{x+1}$ と置いて通分すると、分子は $A(x+1)+Bx=(A+B)x+A$。これが常に $1$ となるには $A+B=0,A=1$、よって $B=-1$ です。分子の恒等式として係数を決め、通分で確かめます。`,m`\frac1{x(x+1)}=\frac1x-\frac1{x+1}`,m`$-1,0$ を含まない区間で、この式を積分しなさい。`,m`$\log|x|-\log|x+1|+C$。$-1,0$ を含まない区間で考え、微分して通分すると元に戻ります。`)],[
 iq("partial-fractions",m`\dfrac1{x(x-1)}`,m`-\log|x|+\log|x-1|`,m`$0,1$ を含まない区間。`,m`$\dfrac A x+\dfrac B{x-1}$ を通分します。`,m`$1=A(x-1)+Bx$ より $A=-1,B=1$。`,m`(-\log|x|+\log|x-1|+C)'=\dfrac1{x(x-1)}`),
 iq("partial-fractions",m`\dfrac2{x(x+2)}`,m`\log|x|-\log|x+2|`,m`$-2,0$ を含まない区間。`,m`逆数の差で分子が $2$ になります。`,m`$\dfrac2{x(x+2)}=\dfrac1x-\dfrac1{x+2}$。`,m`(\log|x|-\log|x+2|+C)'=\dfrac2{x(x+2)}`)
],[
 iq("partial-fractions",m`\dfrac1{(x+1)(x+2)}`,m`\log|x+1|-\log|x+2|`,m`$-2,-1$ を含まない区間。`,m`隣り合う一次式の逆数の差です。`,m`$\dfrac1{x+1}-\dfrac1{x+2}$ を通分すると分子は $1$。`,m`(\log|x+1|-\log|x+2|+C)'=\dfrac1{(x+1)(x+2)}`),
 iq("partial-fractions",m`\dfrac1{x^2-1}`,m`\dfrac12\log|x-1|-\dfrac12\log|x+1|`,m`$-1,1$ を含まない区間。`,m`分母を $(x-1)(x+1)$ と因数分解します。`,m`$\dfrac1{x-1}-\dfrac1{x+1}=\dfrac2{x^2-1}$ なので半分です。`,m`(\dfrac12\log|x-1|-\dfrac12\log|x+1|+C)'=\dfrac1{x^2-1}`)
],[
 iq("partial-fractions",m`\dfrac3{x(x+3)}`,m`\log|x|-\log|x+3|`,m`$-3,0$ を含まない区間。`,m`逆数の差の分子を確認します。`,m`$\dfrac1x-\dfrac1{x+3}=\dfrac3{x(x+3)}$。`,m`(\log|x|-\log|x+3|+C)'=\dfrac3{x(x+3)}`),
 iq("partial-fractions",m`\dfrac1{x(x-2)}`,m`-\dfrac12\log|x|+\dfrac12\log|x-2|`,m`$0,2$ を含まない区間。`,m`$\dfrac1{x-2}-\dfrac1x$ の分子は正の $2$ です。`,m`差の半分に分解します。`,m`(-\dfrac12\log|x|+\dfrac12\log|x-2|+C)'=\dfrac1{x(x-2)}`),
 iq("partial-fractions",m`\dfrac{2x+1}{x(x+1)}`,m`\log|x|+\log|x+1|`,m`$-1,0$ を含まない区間。`,m`今回は差でなく和になります。`,m`$2x+1=A(x+1)+Bx$ より $A=B=1$。`,m`(\log|x|+\log|x+1|+C)'=\dfrac{2x+1}{x(x+1)}`),
 iq("partial-fractions",m`\dfrac{x+2}{x(x+1)}`,m`2\log|x|-\log|x+1|`,m`$-1,0$ を含まない区間。`,m`定数項から $A$ を決めます。`,m`$x+2=A(x+1)+Bx$。$A=2,A+B=1$ より $B=-1$。`,m`(2\log|x|-\log|x+1|+C)'=\dfrac{x+2}{x(x+1)}`),
 iq("partial-fractions",m`\dfrac2{(x-1)(x+1)}`,m`\log|x-1|-\log|x+1|`,m`$-1,1$ を含まない区間。`,m`二つの分母の差は $2$ です。`,m`逆数の差へ分けます。`,m`(\log|x-1|-\log|x+1|+C)'=\dfrac2{(x-1)(x+1)}`),
 iq("partial-fractions",m`\dfrac1{(x+1)(x+3)}`,m`\dfrac12\log|x+1|-\dfrac12\log|x+3|`,m`$-3,-1$ を含まない区間。`,m`通分時の分子が $2$ なので半分にします。`,m`$\dfrac12(\dfrac1{x+1}-\dfrac1{x+3})$。`,m`(\dfrac12\log|x+1|-\dfrac12\log|x+3|+C)'=\dfrac1{(x+1)(x+3)}`)
],[
 iq("partial-fractions",m`\dfrac1{(x-1)(x-2)}`,m`-\log|x-1|+\log|x-2|`,m`$1,2$ を含まない区間。`,m`通分して分子の符号を確かめます。`,m`$\dfrac1{x-2}-\dfrac1{x-1}$ の分子は $1$。`,m`(-\log|x-1|+\log|x-2|+C)'=\dfrac1{(x-1)(x-2)}`),
 iq("partial-fractions",m`\dfrac{3x+1}{x(x+1)}`,m`\log|x|+2\log|x+1|`,m`$-1,0$ を含まない区間。`,m`定数項と一次の係数を合わせます。`,m`$3x+1=A(x+1)+Bx$ より $A=1,B=2$。`,m`(\log|x|+2\log|x+1|+C)'=\dfrac{3x+1}{x(x+1)}`)
],"m3-algebra-before-integrals");

add("trig-transform-integrals","三角関数を積分できる形へ","二乗や積を、基本的な三角関数の和へ直そう。",[
 m`$\sin^2x$ を $\sin x$ の積分の二乗にすることはできません。$\sin^2x=\dfrac{1-\cos2x}{2}$ と直すと、定数と余弦の和になります。`,
 m`積には倍角公式や積和公式を使えます。$2\sin x\cos x=\sin2x$、$2\sin A\cos B=\sin(A+B)+\sin(A-B)$ です。`
],m`二乗は半角公式、積は倍角・積和公式で基本形へ。変形後も内側の係数を確認します。`,[
 example("二乗の次数を下げる",iq("half-angle",m`\sin^2x`,m`\dfrac x2-\dfrac{\sin2x}4`,all,m`$\dfrac{1-\cos2x}2$ と直します。`,m`定数の半分と余弦の積分に分けます。`,m`(\dfrac x2-\dfrac{\sin2x}4+C)'=\dfrac{1-\cos2x}2=\sin^2x`)),
 example("積を一つの正弦へ",iq("product-sum",m`\sin x\cos x`,m`-\dfrac14\cos2x`,all,m`$\sin x\cos x=\dfrac12\sin2x$。`,m`正弦の積分の負号と内側の $2$ で係数を調整します。`,m`(-\dfrac14\cos2x+C)'=\dfrac12\sin2x=\sin x\cos x`))
],[
 s("half-angle","二乗を定数と余弦へ",m`半角公式で二乗をなくします。余弦の二乗では正弦の二乗と符号が違います。`,m`\sin^2x=\frac{1-\cos2x}2,\quad\cos^2x=\frac{1+\cos2x}2`,m`$\int\cos^2x\,dx$ は？`,m`$\dfrac x2+\dfrac14\sin2x+C$。微分すると $\dfrac{1+\cos2x}2$。`),
 s("product-sum","積を和に変える",m`積和公式を使うと、角の異なる正弦の和になります。差の角が負のときの符号を保ちます。`,m`2\sin A\cos B=\sin(A+B)+\sin(A-B)`,m`$\int\sin2x\cos x\,dx$ は？`,m`$\dfrac12(\sin3x+\sin x)$ を積分して $-\dfrac16\cos3x-\dfrac12\cos x+C$。微分して積和公式を逆に戻せます。`)
],[
 iq("half-angle",m`2\sin^2x`,m`x-\dfrac12\sin2x`,all,m`倍にした半角公式を使います。`,m`$2\sin^2x=1-\cos2x$。`,m`(x-\dfrac12\sin2x+C)'=1-\cos2x=2\sin^2x`),
 iq("product-sum",m`2\sin x\cos x`,m`-\dfrac12\cos2x`,all,m`倍角公式の左辺です。`,m`$\sin2x$ の積分へ直します。`,m`(-\dfrac12\cos2x+C)'=\sin2x=2\sin x\cos x`)
],[
 iq("half-angle",m`\cos^2x`,m`\dfrac x2+\dfrac14\sin2x`,all,m`余弦の半角公式では正号です。`,m`$\dfrac12+\dfrac12\cos2x$ の積分。`,m`(\dfrac x2+\dfrac14\sin2x+C)'=\cos^2x`),
 iq("product-sum",m`\sin2x\cos x`,m`-\dfrac16\cos3x-\dfrac12\cos x`,all,m`和の角は $3x$、差の角は $x$。`,m`$\dfrac12(\sin3x+\sin x)$ を積分します。`,m`(-\dfrac16\cos3x-\dfrac12\cos x+C)'=\sin2x\cos x`)
],[
 iq("half-angle",m`\sin^2(2x)`,m`\dfrac x2-\dfrac18\sin4x`,all,m`半角公式で角は $4x$ になります。`,m`$\dfrac{1-\cos4x}2$ として積分します。`,m`(\dfrac x2-\dfrac18\sin4x+C)'=\sin^2(2x)`),
 iq("half-angle",m`\cos^2(3x)`,m`\dfrac x2+\dfrac1{12}\sin6x`,all,m`変形後の角は $6x$。`,m`$\dfrac{1+\cos6x}2$ に直します。`,m`(\dfrac x2+\dfrac1{12}\sin6x+C)'=\cos^2(3x)`),
 iq("product-sum",m`\sin x\cos2x`,m`-\dfrac16\cos3x+\dfrac12\cos x`,all,m`差の角は $-x$ です。`,m`$\dfrac12(\sin3x-\sin x)$ に直し、負号を保って積分します。`,m`(-\dfrac16\cos3x+\dfrac12\cos x+C)'=\sin x\cos2x`),
 iq("half-angle",m`\cos^2x-\sin^2x`,m`\dfrac12\sin2x`,all,m`二乗の差は倍角の余弦です。`,m`$\cos2x$ を積分します。`,m`(\dfrac12\sin2x+C)'=\cos2x=\cos^2x-\sin^2x`),
 iq("product-sum",m`\sin2x\cos2x`,m`-\dfrac18\cos4x`,all,m`同じ角どうしの積なので倍角公式です。`,m`$\dfrac12\sin4x$ に直します。`,m`(-\dfrac18\cos4x+C)'=\sin2x\cos2x`),
 iq("half-angle",m`1-\cos^2x`,m`\dfrac x2-\dfrac14\sin2x`,all,m`最初に $\sin^2x$ と見ても構いません。`,m`$\dfrac{1-\cos2x}2$ です。`,m`(\dfrac x2-\dfrac14\sin2x+C)'=1-\cos^2x`)
],[
 iq("half-angle",m`2\cos^2x`,m`x+\dfrac12\sin2x`,all,m`$1+\cos2x$ へ直します。`,m`余弦の内側の $2$ を調整します。`,m`(x+\dfrac12\sin2x+C)'=2\cos^2x`),
 iq("product-sum",m`\sin3x\cos x`,m`-\dfrac18\cos4x-\dfrac14\cos2x`,all,m`和の角 $4x$、差の角 $2x$ を作ります。`,m`$\dfrac12(\sin4x+\sin2x)$ を積分します。`,m`(-\dfrac18\cos4x-\dfrac14\cos2x+C)'=\sin3x\cos x`)
],"m3-trig-basic-integrals");

add("substitution-integrals","置換積分と変数の統一","式と微分を一緒に置き換えて積分しよう。",[
 m`内側の式を新しい変数にすると、合成関数の積分を基本形として整理できます。$t=g(x)$ と置いたら $dt=g'(x)\,dx$ も一緒に使います。`,
 m`$dt=g'(x)\,dx$ は積分の変数を変えるための書き方です。合成関数の微分 $\{F(g(x))\}'=F'(g(x))g'(x)$ が根拠です。`,
 m`積分の中を新しい変数だけで表し、計算後は元の変数に戻します。不定積分には上下端はありません。`
],m`置換する式 → その微分 → 積分の中の変数を統一 → 積分 → 元に戻す → 微分で検算します。`,[
 example("中身の平方根を一文字にする",iq("substitution",m`x\sqrt{x^2+1}`,m`\dfrac13(x^2+1)^{\frac32}`,all,m`$t=x^2+1$、$dt=2x\,dx$ とします。`,m`$x\,dx=\dfrac12dt$ なので $\dfrac12\int t^{\frac12}\,dt=\dfrac13t^{\frac32}+C$。$t=x^2+1$ に戻します。`,m`(\dfrac13(x^2+1)^{\frac32}+C)'=x\sqrt{x^2+1}`)),
 example("指数の中身を置き換える",iq("substitution","xe^{x^2}",m`\dfrac12e^{x^2}`,all,m`$t=x^2$ の微分は $dt=2x\,dx$。`,m`$\dfrac12\int e^t\,dt=\dfrac12e^t+C$。元の変数へ戻します。`,m`(\dfrac12e^{x^2}+C)'=xe^{x^2}`))
],[s("substitution","式だけでなく微分も置き換える",m`$t=x^2+1$ と置いたとき、$x\,dx=\dfrac12dt$。式だけを $t$ にして $dx$ を放置せず、積分の中を統一します。`,m`\int x\sqrt{x^2+1}\,dx=\frac12\int\sqrt t\,dt`,m`右辺を積分し、元へ戻しなさい。`,m`$\dfrac13t^{\frac32}+C=\dfrac13(x^2+1)^{\frac32}+C$。微分は $x\sqrt{x^2+1}$。`)],[
 iq("substitution","2x(x^2+1)",m`\dfrac12(x^2+1)^2`,all,m`$t=x^2+1$、$dt=2x\,dx$。`,m`$\int t\,dt=\dfrac12t^2+C$ から戻します。`,m`(\dfrac12(x^2+1)^2+C)'=2x(x^2+1)`),
 iq("substitution","2xe^{x^2}","e^{x^2}",all,m`$t=x^2$ と置きます。`,m`$dt=2x\,dx$ より $\int e^t\,dt=e^t+C$。`,"(e^{x^2}+C)'=2xe^{x^2}")
],[
 iq("substitution","x(x^2+2)^2",m`\dfrac16(x^2+2)^3`,all,m`$t=x^2+2$ と置きます。`,m`$dt=2x\,dx$、$\dfrac12\int t^2\,dt=\dfrac16t^3+C$。`,m`(\dfrac16(x^2+2)^3+C)'=x(x^2+2)^2`),
 iq("substitution",m`x\cos(x^2+1)`,m`\dfrac12\sin(x^2+1)`,all,m`中身を $t=x^2+1$ と置きます。`,m`$dt=2x\,dx$、$\dfrac12\int\cos t\,dt=\dfrac12\sin t+C$。`,m`(\dfrac12\sin(x^2+1)+C)'=x\cos(x^2+1)`)
],[
 iq("substitution",m`\dfrac{x}{\sqrt{x^2+1}}`,m`\sqrt{x^2+1}`,all,m`$t=x^2+1$ と置きます。`,m`$dt=2x\,dx$、$\dfrac12\int t^{-\frac12}\,dt=\sqrt t+C$。`,m`(\sqrt{x^2+1}+C)'=\dfrac{x}{\sqrt{x^2+1}}`),
 iq("substitution","x^2e^{x^3}",m`\dfrac13e^{x^3}`,all,m`$t=x^3$、$dt=3x^2\,dx$。`,m`$\dfrac13\int e^t\,dt$ を計算して戻します。`,m`(\dfrac13e^{x^3}+C)'=x^2e^{x^3}`),
 iq("substitution",m`\sin x\,e^{\cos x}`,m`-e^{\cos x}`,all,m`$t=\cos x$ の微分には負号があります。`,m`$dt=-\sin x\,dx$、$-\int e^t\,dt=-e^t+C$。`,m`(-e^{\cos x}+C)'=\sin x\,e^{\cos x}`),
 iq("substitution",m`\dfrac{e^x}{1+e^x}`,m`\log(1+e^x)`,all,m`$t=1+e^x>0$ と置きます。`,m`$dt=e^x\,dx$、$\int\dfrac1t\,dt=\log t+C$。`,m`(\log(1+e^x)+C)'=\dfrac{e^x}{1+e^x}`),
 iq("substitution",m`\dfrac{\log x}{x}`,m`\dfrac12(\log x)^2`,pos,m`$t=\log x$、$dt=\dfrac1x\,dx$。`,m`$\int t\,dt=\dfrac12t^2+C$。`,m`(\dfrac12(\log x)^2+C)'=\dfrac{\log x}{x}`),
 iq("substitution",m`x\sqrt{1-x^2}`,m`-\dfrac13(1-x^2)^{\frac32}`,m`$-1<x<1$。`,m`$t=1-x^2>0$、$dt=-2x\,dx$。`,m`$-\dfrac12\int\sqrt t\,dt=-\dfrac13t^{\frac32}+C$。`,m`(-\dfrac13(1-x^2)^{\frac32}+C)'=x\sqrt{1-x^2}`)
],[
 iq("substitution",m`x(1+x^2)^4`,m`\dfrac1{10}(1+x^2)^5`,all,m`$t=1+x^2$ を使います。`,m`$dt=2x\,dx$、$\dfrac12\int t^4\,dt=\dfrac1{10}t^5+C$。`,m`(\dfrac1{10}(1+x^2)^5+C)'=x(1+x^2)^4`),
 iq("substitution",m`\cos x\,e^{\sin x}`,m`e^{\sin x}`,all,m`$t=\sin x$、$dt=\cos x\,dx$。`,m`$\int e^t\,dt=e^t+C$ から戻します。`,m`(e^{\sin x}+C)'=\cos x\,e^{\sin x}`)
],"m3-reverse-chain-integrals");

function copyQuestion(id:string):Q{
 const e=math3Chapter6Exercises.find(e=>e.id===id)!;
 return q(e.family,e.prompt,e.answer,e.hints[0],e.steps[0].text);
}
const selections=[
 ["m3-linear-inner-integrals",["practice-4","practice-5"],"review-2"],
 ["m3-reverse-chain-integrals",["practice-1","practice-2"],"review-1"],
 ["m3-algebra-before-integrals",["practice-3","practice-5"],"review-1"],
 ["m3-parts-introduction",["practice-3","practice-5"],"review-2"]
] as const;
const picked=(slug:string,key:string)=>copyQuestion(slug+"-"+key+"-v1");
const methodReasons:Record<string,string>={
 "linear-inner":m`基本公式を使い、内側の一次式の微分である定数で割ります。合成関数の微分でその定数が掛かるからです。`,
 "reverse-chain":m`中身の微分を外の因子と比べ、合成関数の微分を逆にたどります。外の因子が中身の微分の定数倍になっているからです。置換積分でも整理できます。`,
 "expand":m`先に積を展開します。展開すれば、基本公式で積分できる項の和になるからです。`,
 "parts-exp":m`一次式を微分する側、指数関数を積分する側として部分積分します。一次式が定数になり、残りの積分が簡単になるからです。`
};
const choose=(item:Q):Q=>{
 const reason=methodReasons[item.family];
 if(!reason)throw new Error("Missing integral method reason: "+item.family);
 return {...item,prompt:"最初に行う操作と理由を述べてから、"+item.prompt,answer:reason+" "+item.answer,working:reason+" "+item.working};
};
const chooseReady=[picked("m3-linear-inner-integrals","ready-2"),picked("m3-reverse-chain-integrals","ready-1")].map(choose);
const chooseGuided=[picked("m3-reverse-chain-integrals","guided-1"),picked("m3-algebra-before-integrals","guided-1"),picked("m3-parts-introduction","guided-2")].map(choose);
add("choose-integral","式の構造と積分法","最初の一手を選び、微分で確かめよう。",[
 m`まず、基本公式で戻せるか、展開・割り算で基本形に直せるかを見ます。中身とその微分があれば合成関数の微分を逆に読み、置換で整理できます。`,
 m`積の形でも、内側の微分がそろっているかで方法は違います。部分積分は、微分する側と積分する側を選んだ結果、残りが簡単になるときに使います。`
],m`方法名を覚えるだけでなく、何が簡単になるかを説明します。別の正しい方法や、定数分だけ違う原始関数も認められます。`,[
 example("中身の微分が外にある",picked("m3-reverse-chain-integrals","practice-4")),
 example("展開すれば項ごとに戻せる",picked("m3-algebra-before-integrals","practice-3")),
 example("一次式を微分すると簡単になる",picked("m3-parts-introduction","practice-3"))
],selections.map(([slug])=>{
 const l=math3Chapter6Lessons.find(l=>l.slug===slug)!;
 const family=math3Chapter6Exercises.find(e=>e.id===slug+"-"+selections.find(a=>a[0]===slug)![1][0]+"-v1")!.family;
 return {...l.supplements.find(s=>s.id===family)!};
}),chooseReady,chooseGuided,selections.flatMap(([slug,keys])=>keys.map(key=>choose(picked(slug,key)))),selections.map(([slug,,key])=>choose(picked(slug,key))),"m3-parts-log-trig");

math3Chapter6Lessons.sort((a,b)=>math3AntiderivativeOrder.indexOf(a.slug)-math3AntiderivativeOrder.indexOf(b.slug));
export const math3IntegralCheckSelection=[
 ["antiderivative-constant","practice-3","review-1"],
 ["antiderivative-constant","practice-4","review-2"],
 ["power-integrals","practice-1","review-1"],["power-integrals","practice-4","review-2"],
 ["trig-basic-integrals","practice-3","review-1"],["trig-basic-integrals","practice-4","review-2"],
 ["exponential-integrals","practice-3","review-2"],
 ["linear-inner-integrals","practice-2","review-1"],
 ["reverse-chain-integrals","practice-1","review-1"],["reverse-chain-integrals","practice-5","review-2"],
 ["log-derivative-integrals","practice-5","review-2"],
 ["algebra-before-integrals","practice-2","review-2"],
 ["algebra-before-integrals","practice-3","review-1"],
 ["partial-fractions","practice-4","review-2"],
 ["trig-transform-integrals","practice-1","review-1"],["trig-transform-integrals","practice-3","review-2"],
 ["substitution-integrals","practice-5","review-1"],
 ["radical-substitution","practice-5","review-2"],
 ["trig-substitution","practice-1","review-1"],["trig-substitution","practice-5","review-2"],
 ["parts-introduction","practice-5","review-2"],
 ["parts-log-trig","practice-2","review-1"],["parts-log-trig","practice-4","review-2"],
 ["choose-integral","practice-7","review-4"]
] as const;
const checkSlug="m3-indefinite-integrals-check";
const checkLessons=[...math3Chapter6Lessons];
math3Chapter6Lessons.push({
 slug:checkSlug,title:"不定積分を確かめる",basicsTitle:"微分の形へ戻す",subject:"数学III",chapter:"不定積分",
 description:"方法を選び、積分定数と定義域を確かめよう。",
 introduction:[m`式の形から最初の操作を選びます。積分定数と式が成り立つ区間を確認し、答案を微分して元へ戻るか確かめましょう。`],
 rule:m`係数・符号・絶対値・積分定数を確認します。別の形の答えでも、差が定数なら同じ区間の原始関数として認められます。`,
 examples:[example("分母の微分を読む",picked("m3-log-derivative-integrals","guided-1")),example("部分積分の引き算",picked("m3-parts-log-trig","guided-2"))],
 guidedAfterExamples:true,supplements:checkLessons.flatMap(l=>l.supplements.map(s=>({...s,id:l.slug+"-"+s.id})))
});
for(const [stage,ids] of [
 ["ready",["m3-power-integrals-ready-1-v1","m3-log-derivative-integrals-ready-1-v1"]],
 ["guided",["m3-log-derivative-integrals-guided-2-v1","m3-parts-log-trig-ready-2-v1"]]
] as const)ids.forEach((id,i)=>{
 const source=math3Chapter6Exercises.find(e=>e.id===id)!;
 math3Chapter6Exercises.push({...source,id:checkSlug+"-"+stage+"-"+(i+1)+"-v1",lesson:checkSlug,stage,family:source.lesson+"-"+source.family,repair:source.lesson+"-"+source.repair});
});
math3IntegralCheckSelection.forEach(([slug,p,r],i)=>{
 for(const [stage,key] of [["practice",p],["review",r]] as const){
  const source=math3Chapter6Exercises.find(e=>e.id==="m3-"+slug+"-"+key+"-v1")!;
  math3Chapter6Exercises.push({...source,id:checkSlug+"-"+stage+"-"+(i+1)+"-v1",lesson:checkSlug,stage,family:source.lesson+"-"+source.family,repair:source.lesson+"-"+source.repair});
 }
});
