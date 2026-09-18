import type {Lesson,Exercise,Example} from "./lessons";
const m=String.raw;
type Q={family:string;prompt:string;answer:string;hint:string;working:string};
const q=(family:string,prompt:string,answer:string,hint:string,working:string):Q=>({family,prompt,answer,hint,working});
const ex=(title:string,a:Q):Example=>({title,prompt:a.prompt,steps:[{title:"着目する",text:a.hint},{title:"途中式",text:a.working},{title:"答え",text:a.answer}]});
type S=Lesson["supplements"][number];
const s=(id:string,title:string,text:string,tex:string,check:string,answer:string):S=>({id,title,text,tex,check,answer});
export const math3Chapter7Lessons:Lesson[]=[];
export const math3Chapter7Exercises:Exercise[]=[];
export const math3DefiniteOrder=["definite-meaning","endpoint-evaluation","integral-properties","dummy-variable","definite-substitution","definite-parts","integral-symmetry","integral-function","moving-endpoints","riemann-sums","integral-bounds"].map(x=>"m3-"+x);
function add(slug:string,title:string,description:string,introduction:string[],rule:string,examples:Example[],supplements:S[],ready:Q[],guided:Q[],practice:Q[],review:Q[],prerequisite:string){
 const l:Lesson={slug:"m3-"+slug,title,description,basicsTitle:title,subject:"数学III",chapter:"定積分",introduction,rule,examples,supplements,guidedAfterExamples:true,prerequisites:[{slug:prerequisite,label:"関連する基礎"}]};
 math3Chapter7Lessons.push(l);
 for(const [stage,items] of [["ready",ready],["guided",guided],["practice",practice],["review",review]] as const)items.forEach((a,i)=>math3Chapter7Exercises.push({id:l.slug+"-"+stage+"-"+(i+1)+"-v1",lesson:l.slug,stage,family:a.family,repair:a.family,kind:"paper",prompt:a.prompt,answer:a.answer,hints:[a.hint],steps:[{title:"考えて進める",text:a.working},{title:"答え",text:a.answer}]}));
}
add("definite-meaning","不定積分と定積分","関数の集まりと、一つの数を区別しよう。",[
 m`$\int 2x\,dx=x^2+C$ は、微分すると $2x$ になる関数の集まりです。一方、$\int_0^1 2x\,dx=[x^2]_0^1=1$ は、区間を決めて得られる一つの数です。`,
 m`$f$ が $[a,b]$ で連続で、$F'=f$ なら、$\int_a^b f(x)\,dx=F(b)-F(a)$ で計算できます。$[F(x)]_a^b$ はこの差の略記です。原始関数の定数は差で消えます。`,
 m`$a<b$ のとき、グラフが軸の上にあれば定積分は面積と一致し、下にあればその部分は負に数えます。上下にまたがる場合、面積の合計とは限りません。`
],m`求めるものが関数か数かを先に確認します。定積分の答えに積分定数を付けません。`,[
 ex("同じ式でも答えの種類が違う",q("meaning",m`$\int2x\,dx$ と $\int_0^1 2x\,dx$ を求め、違いを述べなさい。`,m`前者は $x^2+C$ という関数の集まり、後者は数 $1$。`,m`上下端が指定されているかを見ます。`,m`$(x^2)'=2x$。定積分では $[x^2]_0^1=1-0=1$。`)),
 ex("定数は差で消える",q("value",m`$F(x)=x^2+5$ を使って $\int_0^2 2x\,dx$ を求めなさい。`,m`$4$。`,m`$F(2)$ と $F(0)$ を両方計算します。`,m`$F'=2x$ なので $(4+5)-(0+5)=4$。`))
],[s("meaning","答えの種類",m`不定積分は原始関数の集まり、上下端の決まった定積分は一つの数です。`,m`\int_0^1 2x\,dx=1`,m`$\int1\,dx$ と $\int_0^2 1\,dx$ の違いは？`,m`前者は $x+C$、後者は $2$。定積分に $C$ は不要です。`),
 s("value","原始関数の差",m`連続な被積分関数の原始関数を選び、上端と下端での値を引きます。定数は相殺されます。`,m`(F(b)+C)-(F(a)+C)=F(b)-F(a)`,m`$\int_1^2 2x\,dx$ は？`,m`$[x^2]_1^2=4-1=3$。`)],[
 q("meaning",m`$\int3\,dx=3x+C$ の $C$ は何ですか。`,m`任意の積分定数。`,m`定数を微分するとどうなりますか。`,m`$(3x+C)'=3$ で、定数を自由に加えられます。`),
 q("value",m`$F(x)=x^2$ のとき $F(2)-F(1)$ は？`,m`$3$。`,m`先に各関数値を求めます。`,m`$4-1=3$。`)
],[
 q("meaning",m`$\int3\,dx$ と $\int_0^2 3\,dx$ を求め、種類を区別しなさい。`,m`$3x+C$ は関数の集まり、$6$ は数。`,m`定積分では端の値を引きます。`,m`$[3x]_0^2=6$。`),
 q("value",m`$F=x^3+2$ を使い $\int_0^1 3x^2\,dx$ を求めなさい。`,m`$1$。`,m`定数を含め両端に代入します。`,m`$(1+2)-(0+2)=1$。`)
],[
 q("meaning",m`$\int_0^1 1\,dx=1+C$ は適切ですか。`,m`不適切。答えは $1$。`,m`上下端の決まった積分です。`,m`$[x]_0^1=1$。定数は差で消えます。`),
 q("value",m`$\int_0^2 1\,dx$ を求めなさい。`,m`$2$。`,m`$1$ の原始関数を使います。`,m`$[x]_0^2=2-0=2$。`),
 q("meaning",m`$\int_0^1(-2)\,dx$ は面積 $2$ と同じ値ですか。`,m`同じではなく、定積分は $-2$。`,m`軸の下は負に数えます。`,m`$[-2x]_0^1=-2$。面積そのものは正の $2$ です。`),
 q("value",m`$F=x^2-7$ で $\int_1^3 2x\,dx$ を求めなさい。`,m`$8$。`,m`負の定数も両端で引きます。`,m`$(9-7)-(1-7)=2-(-6)=8$。`),
 q("meaning",m`$\int x^2\,dx$ と $\int_0^1 x^2\,dx$ の答えを区別しなさい。`,m`$\dfrac{x^3}{3}+C$ と $\dfrac13$。前者は関数の集まり、後者は数。`,m`同じ原始関数を使えます。`,m`$\left[\dfrac{x^3}{3}\right]_0^1=\dfrac13$。`),
 q("value",m`$\int_0^1 (2x+1)\,dx$ を求めなさい。`,m`$2$。`,m`各項を積分します。`,m`$[x^2+x]_0^1=2$。`)
],[
 q("meaning",m`$\int2\,dx$ と $\int_1^3 2\,dx$ の違いを答えなさい。`,m`$2x+C$ は関数の集まり、$4$ は数。`,m`上下端の有無を見ます。`,m`$[2x]_1^3=6-2=4$。`),
 q("value",m`$F=x^3-4$ で $\int_1^2 3x^2\,dx$ を求めなさい。`,m`$7$。`,m`定数を含む値全体を引きます。`,m`$(8-4)-(1-4)=7$。`)
],"m3-antiderivative-constant");

add("endpoint-evaluation","原始関数と両端の値","下端の値全体を引き、定義域も確かめよう。",[
 m`$[F(x)]_a^b$ は $F(b)-F(a)$ です。下端が負の数のときも、まず $F(a)$ を括弧にまとめます。`,
 m`例えば $\int_{-1}^1(2x+1)\,dx=[x^2+x]_{-1}^1=(1+1)-(1-1)=2$。積分後の式の各項に両端を代入します。`,
 m`計算前に被積分関数が区間全体で連続か調べます。$\dfrac1x$ は $0$ で未定義なので、$\int_{-1}^1\dfrac1x\,dx$ にこの公式をそのまま使えません。この章ではそのような積分は扱いません。`
],m`端だけでなく区間の途中も調べ、上端の値から下端の値全体を引きます。`,[
 ex("負の下端を括弧で扱う",q("endpoints",m`$\int_{-1}^2(2x-1)\,dx$ を求めなさい。`,m`$0$。`,m`原始関数は $x^2-x$。下端の符号に注意します。`,m`$(4-2)-(1+1)=2-2=0$。正負の寄与が打ち消し合います。`)),
 ex("ゼロをまたがないか",q("domain",m`$\int_1^2\dfrac1x\,dx$ と $\int_{-1}^1\dfrac1x\,dx$ に、連続関数の定積分公式を使えますか。`,m`前者は使えて $\log2$。後者は使えません。`,m`分母がゼロになる点が区間にあるかを見ます。`,m`$[1,2]$ では連続で $[\log x]_1^2=\log2$。$[-1,1]$ には未定義点 $0$ があります。`))
],[s("endpoints","下端を丸ごと引く",m`連続な関数の原始関数を求め、代入後の下端全体を括弧に入れます。`,m`[x^2-x]_{-1}^1=(1-1)-(1+1)=-2`,m`$\int_{-1}^1(2x-1)\,dx$ は？`,m`$-2$。下端の $(-1)^2-(-1)=2$ を引きます。`),
 s("domain","区間内の未定義点",m`分母ゼロや対数の真数条件を区間全体で確認します。未定義点をまたいで両端だけ引くことはできません。`,m`\int_1^2\frac1{x+1}\,dx=\log3-\log2`,m`$\int_{-2}^0\dfrac1{x+1}\,dx$ に同じ公式を使える？`,m`使えません。区間内の $x=-1$ で分母がゼロです。`)],[
 q("endpoints",m`$F=x^2-x$ の $F(-2)$ は？`,m`$6$。`,m`負の数を括弧で代入します。`,m`$(-2)^2-(-2)=4+2=6$。`),
 q("domain",m`$\dfrac1{x-1}$ が未定義となる値は？`,m`$x=1$。`,m`分母をゼロにします。`,m`$x-1=0$。`)
],[
 q("endpoints",m`$\int_{-1}^1(3x^2-2)\,dx$ を求めなさい。`,m`$-2$。`,m`$x^3-2x$ の下端の値を括弧にします。`,m`$(1-2)-(-1+2)=-1-1=-2$。`),
 q("domain",m`$\int_2^3\dfrac1{x-1}\,dx$ と $\int_0^2\dfrac1{x-1}\,dx$ に連続関数の公式を使えますか。`,m`前者は使えて $\log2$、後者は使えません。`,m`区間に $1$ が含まれるかを調べます。`,m`前者は $[\log(x-1)]_2^3=\log2$。後者には未定義点 $1$ があります。`)
],[
 q("endpoints",m`$\int_{-2}^0(2x+3)\,dx$ は？`,m`$2$。`,m`下端で一次項が負になります。`,m`$[x^2+3x]_{-2}^0=0-(4-6)=2$。`),
 q("domain",m`$\int_{-2}^{-1}\dfrac1x\,dx$ に公式を使えますか。使えるなら値は？`,m`使えます。$-\log2$。`,m`負でもゼロを含まなければ連続です。`,m`$[\log|x|]_{-2}^{-1}=\log1-\log2=-\log2$。`),
 q("endpoints",m`$\int_0^{\pi}\sin x\,dx$ は？`,m`$2$。`,m`原始関数の負号を残します。`,m`$[-\cos x]_0^\pi=-(-1)-(-1)=2$。`),
 q("domain",m`$\int_0^1\dfrac1x\,dx$ に連続関数の公式を使えますか。`,m`使えません。下端 $0$ で未定義です。`,m`端も区間に含みます。`,m`$\log0$ は定義されず、区間全体での連続性もありません。`),
 q("endpoints",m`$\int_0^{\log2}e^x\,dx$ は？`,m`$1$。`,m`$e^{\log2}=2$ を使います。`,m`$[e^x]_0^{\log2}=2-1=1$。`),
 q("domain",m`$\int_0^1\dfrac1{x+2}\,dx$ に公式を使えますか。使えるなら値は？`,m`使えます。$\log3-\log2$。`,m`分母は区間で正です。`,m`$x+2\ge2$ なので連続。$[\log(x+2)]_0^1=\log3-\log2$。`)
],[
 q("endpoints",m`$\int_{-1}^2 3x^2\,dx$ は？`,m`$9$。`,m`下端の三乗は負です。`,m`$[x^3]_{-1}^2=8-(-1)=9$。`),
 q("domain",m`$\int_{-1}^1\dfrac1{x+2}\,dx$ に公式を使えますか。使えるなら値は？`,m`使えます。$\log3$。`,m`分母ゼロは $x=-2$ です。`,m`その点は区間外。$[\log(x+2)]_{-1}^1=\log3-\log1=\log3$。`)
],"m3-definite-meaning");

add("integral-properties","積分区間と基本性質","区間の向きとつながりを式にしよう。",[
 m`以下では、扱う区間全体で $f,g$ は連続、$c$ は定数とします。$\int_a^b(cf+g)\,dx=c\int_a^b f\,dx+\int_a^b g\,dx$。和と定数倍は項ごとに扱えます。`,
 m`$\int_b^a f(x)\,dx=-\int_a^b f(x)\,dx$、$\int_a^a f(x)\,dx=0$。両端を交換すると原始関数の差が逆になります。`,
 m`区間をつなぐと $\int_a^c f+\int_c^b f=\int_a^b f$。途中で分けても、向きを保って足せば元の積分に戻ります。`
],m`式の係数と積分区間の向きをそれぞれ確かめます。`,[
 ex("和と定数倍",q("linearity",m`$\int_0^1 f(x)\,dx=2$、$\int_0^1 g(x)\,dx=-1$ のとき、$\int_0^1(3f(x)-g(x))\,dx$ は？ 両関数は連続とします。`,m`$7$。`,m`同じ区間なので項別に分けます。`,m`$3\cdot2-(-1)=7$。`)),
 ex("区間の向きを反転する",q("orientation",m`連続な $f$ について $\int_1^3 f(x)\,dx=4$。$\int_3^1 f(x)\,dx$ は？`,m`$-4$。`,m`上下端が入れ替わっています。`,m`$F(1)-F(3)=-(F(3)-F(1))$ です。`)),
 ex("残りの区間を取り出す",q("split",m`連続な $f$ について $\int_0^3 f(x)\,dx=5$、$\int_0^1 f(x)\,dx=2$。$\int_1^3 f(x)\,dx$ は？`,m`$3$。`,m`全体を二つに分けた式を書きます。`,m`$5=2+\int_1^3 f(x)\,dx$ なので $5-2=3$。`))
],[s("linearity","同じ区間で項別に",m`連続な関数の和・定数倍は、同じ区間の定積分の和・定数倍にできます。積には一般に使えません。`,m`\int_a^b cf=c\int_a^b f`,m`$\int_0^1f=3$ なら $\int_0^1(-2f)$ は？`,m`$-6$。定数 $-2$ を外に出します。`),
 s("linearity-scope","和の性質を積へ使わない",m`連続関数でも、積の積分は一般に積分の積とは一致しません。両方を別々に計算して比べます。`,m`\int_0^1x^2\,dx=\frac13\ne\left(\int_0^1x\,dx\right)^2=\frac14`,m`上の二つの値を求める途中式は？`,m`左は $\left[\dfrac{x^3}{3}\right]_0^1=\dfrac13$。右は $\left(\left[\dfrac{x^2}{2}\right]_0^1\right)^2=\left(\dfrac12\right)^2=\dfrac14$。`),
 s("orientation","両端の交換",m`連続関数の定積分で、両端を交換すると符号が反転します。同じ端ならゼロです。`,m`\int_b^a f=-\int_a^b f`,m`$\int_0^2 f=5$ なら $\int_2^0 f$ は？`,m`$-5$。`),
 s("split","区間の加法",m`連続関数を同じ向きの区間に分け、合計から既知部分を引きます。`,m`\int_0^3 f=\int_0^1 f+\int_1^3 f`,m`左辺が $7$、右辺第一項が $4$ なら残りは？`,m`$7-4=3$。`)],[
 q("linearity",m`$\int_0^1 2x\,dx$ を定数倍の性質で書き換えなさい。`,m`$2\int_0^1 x\,dx$。`,m`定数だけを外へ出します。`,m`$2$ は積分変数によらないので外へ出せます。`),
 q("orientation",m`連続な $f$ について $\int_2^2 f(x)\,dx$ は？`,m`$0$。`,m`同じ関数値を引きます。`,m`$F(2)-F(2)=0$。`)
],[
 q("linearity",m`$\int_0^1 f=3$、$\int_0^1 g=2$。連続な両関数について $\int_0^1(f-2g)$ は？`,m`$-1$。`,m`係数を保って分けます。`,m`$3-2\cdot2=-1$。`),
 q("orientation",m`$\int_0^2 x\,dx=2$ を用い $\int_2^0 x\,dx$ を求めなさい。`,m`$-2$。`,m`区間の向きが逆です。`,m`$\int_2^0 x\,dx=-\int_0^2 x\,dx=-2$。`),
 q("split",m`連続な $f$ について $\int_0^4f=6$、$\int_0^2f=1$。$\int_2^4 f$ は？`,m`$5$。`,m`全体から最初の部分を引きます。`,m`$6=1+\int_2^4 f$。`)
],[
 q("linearity",m`連続な $f$ について $\int_0^2 f=3$。$\int_0^2(2f+1)$ は？`,m`$8$。`,m`定数関数 $1$ の積分は区間の長さです。`,m`$2\cdot3+[x]_0^2=6+2=8$。`),
 q("linearity-scope",m`$\int_0^1 x^2\,dx$ は $\left(\int_0^1x\,dx\right)^2$ と等しいですか。`,m`等しくありません。$\dfrac13$ と $\dfrac14$。`,m`和の性質を積へ使えるか、実際に計算します。`,m`$\int_0^1x^2=\dfrac13$、$\int_0^1x=\dfrac12$。二乗は $\dfrac14$ です。`),
 q("orientation",m`$\int_3^1 2\,dx$ は？`,m`$-4$。`,m`向きを戻してから符号を変えます。`,m`$-\int_1^3 2\,dx=-4$。`),
 q("orientation",m`$\int_1^0 e^x\,dx$ は？`,m`$1-e$。`,m`上端は $0$ です。`,m`$[e^x]_1^0=1-e$。`),
 q("split",m`連続な $f$ について $\int_0^1 f=-2$、$\int_1^3 f=5$。$\int_0^3 f$ は？`,m`$3$。`,m`符号付きの値を足します。`,m`$-2+5=3$。`),
 q("split",m`連続な $f$ について $\int_0^3 f=4$、$\int_0^1 f=6$。$\int_1^3 f$ は？`,m`$-2$。`,m`全体より部分が大きくても矛盾ではありません。`,m`$4-6=-2$。定積分は負にもなります。`)
],[
 q("linearity",m`連続な $f$ について $\int_1^2 f=-1$。$\int_1^2(3f+2)$ は？`,m`$-1$。`,m`定数の積分も加えます。`,m`$3(-1)+2(2-1)=-1$。`),
 q("orientation",m`$\int_2^1 2x\,dx$ は？`,m`$-3$。`,m`上端の値から下端の値を引きます。`,m`$[x^2]_2^1=1-4=-3$。`),
 q("split",m`連続な $f$ について $\int_0^2 f=7$、$\int_0^1 f=3$。$\int_1^2 f$ は？`,m`$4$。`,m`区間をつなぐ式を書きます。`,m`$7=3+\int_1^2 f$。`),
 q("linearity-scope",m`$\int_0^2x^2\,dx$ と $\left(\int_0^2x\,dx\right)^2$ は等しいですか。`,m`等しくありません。$\dfrac83$ と $4$。`,m`二つの積分を別々に計算します。`,m`左は $\left[\dfrac{x^3}{3}\right]_0^2=\dfrac83$。右は $\left(\left[\dfrac{x^2}{2}\right]_0^2\right)^2=2^2=4$。`)
],"m3-endpoint-evaluation");

add("dummy-variable","積分変数と定数","積分の中で動く文字を見分けよう。",[
 m`$\int_0^1 x^2\,dx=\int_0^1 t^2\,dt=\dfrac13$。積分変数の名前をそろえて変えても、値は変わりません。式の中だけで使われるこの文字をダミー変数ともいいます。`,
 m`$\int_0^1 a t\,dt$ では、動くのは $t$ であり、$a$ は $t$ によらない定数です。よって $a\int_0^1t\,dt=\dfrac a2$ です。`,
 m`$\int_0^x t\,dt$ では、上端の $x$ は区間を指定し、中の $t$ は積分変数です。役割を混同しないよう別の文字を使います。`
],m`まず $dx$ や $dt$ を見て、どの文字について積分するかを決めます。`,[
 ex("文字の名前を変える",q("dummy",m`$\int_0^1 x^2\,dx$ を積分変数 $t$ で書き直し、値を求めなさい。`,m`$\int_0^1t^2\,dt=\dfrac13$。`,m`中の式と微小量の記号を一緒に変えます。`,m`$\left[\dfrac{t^3}{3}\right]_0^1=\dfrac13$。端の数は変わりません。`)),
 ex("外の文字を定数として扱う",q("parameter",m`$x$ を定数として $\int_0^1 xt\,dt$ を求めなさい。`,m`$\dfrac x2$。`,m`積分変数は $t$ です。`,m`$x\int_0^1t\,dt=x\left[\dfrac{t^2}{2}\right]_0^1=\dfrac x2$。`))
],[s("dummy","式と微小量の文字をそろえる",m`変えるのは積分に使う文字の名前です。中の式と微小量を一緒に変えます。`,m`\int_0^2 x\,dx=\int_0^2 u\,du`,m`$\int_0^1 t^3\,dt$ を $u$ で書くと？`,m`$\int_0^1u^3\,du$。値は $\dfrac14$。`),
 s("parameter","積分変数によらない量",m`$dt$ なら、積分中に動くのは $t$ です。他の独立した文字は定数として扱います。`,m`\int_0^2 a\,dt=2a`,m`$\int_0^1(t+2x)\,dt$ は？`,m`$\left[\dfrac{t^2}{2}+2xt\right]_0^1=\dfrac12+2x$。`)],[
 q("dummy",m`$\int_0^1 u^2\,du$ の積分変数は？`,m`$u$。`,m`末尾の微小量を見ます。`,m`$du$ が $u$ について積分することを示します。`),
 q("parameter",m`$x$ は $t$ によらないとします。$xt$ を $t$ で微分すると？`,m`$x$。`,m`$x$ は定数です。`,m`$x\cdot1=x$。`)
],[
 q("dummy",m`$\int_1^2 x\,dx$ を $u$ で書き直し、計算しなさい。`,m`$\int_1^2u\,du=\dfrac32$。`,m`両端は数なのでそのままです。`,m`$\left[\dfrac{u^2}{2}\right]_1^2=2-\dfrac12=\dfrac32$。`),
 q("parameter",m`$a$ を定数として $\int_0^2 at\,dt$ を求めなさい。`,m`$2a$。`,m`$a$ を外へ出します。`,m`$a\left[\dfrac{t^2}{2}\right]_0^2=2a$。`)
],[
 q("dummy",m`$\int_0^1 e^x\,dx$ を $t$ で書き直しなさい。`,m`$\int_0^1e^t\,dt$。`,m`指数の文字も変えます。`,m`どちらも $e-1$ です。`),
 q("parameter",m`$x$ を定数として $\int_0^1x\,dt$ は？`,m`$x$。`,m`一定の値に区間の長さを掛けます。`,m`$[xt]_0^1=x$。`),
 q("dummy",m`$\int_0^1t^2\,dt$ の値に文字 $t$ は残りますか。`,m`残りません。$\dfrac13$。`,m`両端に代入すると積分変数は消えます。`,m`$\left[\dfrac{t^3}{3}\right]_0^1=\dfrac13$。`),
 q("parameter",m`$x$ を定数として $\int_0^1(t+x)\,dt$ は？`,m`$\dfrac12+x$。`,m`$x$ も $t$ に関して積分します。`,m`$\left[\dfrac{t^2}{2}+xt\right]_0^1=\dfrac12+x$。`),
 q("dummy",m`$\int_0^x t^2\,dt$ を積分変数 $u$ で書き直しなさい。`,m`$\int_0^x u^2\,du$。`,m`区間を指定する $x$ は変えません。`,m`中の $t$ と $dt$ だけを $u$ と $du$ にします。`),
 q("parameter",m`$a$ を定数として $\int_0^1 at^2\,dt$ は？`,m`$\dfrac a3$。`,m`積分変数は $t$ です。`,m`$a\left[\dfrac{t^3}{3}\right]_0^1=\dfrac a3$。`)
],[
 q("dummy",m`$\int_1^x t\,dt$ を $u$ で書き直しなさい。`,m`$\int_1^x u\,du$。`,m`上端と積分変数の役割は別です。`,m`区間の端 $x$ は固定し、積分に使う名前だけを変えます。`),
 q("parameter",m`$x$ を定数として $\int_0^2(t+x)\,dt$ は？`,m`$2+2x$。`,m`定数項も区間の長さを掛けます。`,m`$\left[\dfrac{t^2}{2}+xt\right]_0^2=2+2x$。`)
],"m3-integral-properties");

add("definite-substitution","置換と積分範囲","式・微小量・両端を同じ変数にそろえよう。",[
 m`$\int_0^1 2xe^{x^2}\,dx$ では、指数の中身 $x^2$ の微分が外にある $2x$ です。$t=x^2$ とすれば $dt=2x\,dx$、$x=0,1$ は $t=0,1$ へ移ります。`,
 m`したがって $\int_0^1e^t\,dt=e-1$。新しい変数で積分したら、その変数の端を代入します。元の式に戻してから元の端を代入する方法も正しいですが、途中で混ぜません。`,
 m`$t=1-x$ なら $x=0,1$ は $t=1,0$ です。端の順序を勝手に並べ直さず、$dt=-dx$ の負号と区間の向きを両方保ちます。ここでは被積分関数が連続で、滑らかに置換できる区間を扱います。`
],m`置換の式だけでなく、微小量と下端・上端の対応も書きます。`,[
 ex("中身と微分をまとめる",q("sub-value",m`$\int_0^1 2xe^{x^2}\,dx$ を置換して求めなさい。`,m`$e-1$。`,m`$t=x^2$ とし、$2x\,dx$ をまとめます。`,m`$dt=2x\,dx$、$x:0\to1$ で $t:0\to1$。$\int_0^1e^t\,dt=[e^t]_0^1=e-1$。`)),
 ex("端の向きも変わる",q("sub-bounds",m`$\int_0^1(1-x)^2\,dx$ を $t=1-x$ で置換し、新しい積分を書きなさい。`,m`$-\int_1^0 t^2\,dt=\int_0^1t^2\,dt$。`,m`$dt=-dx$ と両端を別々に調べます。`,m`$x=0$ で $t=1$、$x=1$ で $t=0$。負号を使って端を反転できます。`))
],[s("sub-value","新しい変数だけで計算",m`区間内で連続な式を置換するとき、微小量を含む積を新しい変数に直し、対応する両端で評価します。`,m`\int_0^1 2x(x^2+1)\,dx=\int_1^2t\,dt`,m`右辺の値は？`,m`$\left[\dfrac{t^2}{2}\right]_1^2=\dfrac32$。$t=x^2+1$、$dt=2x\,dx$ を用いました。`),
 s("sub-bounds","端を置換式に代入",m`端の対応は置換式への代入で求めます。新しい変数で小さい端から並べ直すなら積分の符号も変えます。`,m`t=2-x,\quad x:0\to1,\quad t:2\to1`,m`$\int_0^1(2-x)\,dx$ を置換すると？`,m`$-\int_2^1t\,dt=\int_1^2t\,dt$。$dt=-dx$ です。`)],[
 q("sub-bounds",m`$t=x+1$ とすると $x=0,2$ はそれぞれ何に移りますか。`,m`$t=1,3$。`,m`置換式へ各端を代入します。`,m`$0+1=1$、$2+1=3$。`),
 q("sub-value",m`$t=x^2+1$ のとき $dt$ を $dx$ で表しなさい。`,m`$dt=2x\,dx$。`,m`置換式を微分します。`,m`$\dfrac{dt}{dx}=2x$ です。`)
],[
 q("sub-value",m`$\int_0^1 2x(x^2+1)^2\,dx$ を求めなさい。`,m`$\dfrac73$。`,m`$t=x^2+1$ と置きます。`,m`$dt=2x\,dx$、$t:1\to2$。$\int_1^2t^2\,dt=\left[\dfrac{t^3}{3}\right]_1^2=\dfrac73$。`),
 q("sub-bounds",m`$\int_0^2(3-x)^2\,dx$ を $t=3-x$ で置換した積分を書きなさい。`,m`$-\int_3^1t^2\,dt=\int_1^3t^2\,dt$。`,m`端の順序と微分の負号を残します。`,m`$dt=-dx$、$x:0\to2$ で $t:3\to1$。`)
],[
 q("sub-value",m`$\int_0^1\dfrac{2x}{x^2+1}\,dx$ は？`,m`$\log2$。`,m`分母を新しい変数にします。`,m`$t=x^2+1$、$dt=2x\,dx$、$t:1\to2$。$\int_1^2\dfrac1t\,dt=\log2$。真数は正です。`),
 q("sub-bounds",m`$\int_1^2 2x e^{x^2}\,dx$ を $t=x^2$ で置換した式は？`,m`$\int_1^4e^t\,dt$。`,m`上端も二乗します。`,m`$dt=2x\,dx$、$x=1,2$ は $t=1,4$。`),
 q("sub-value",m`$\int_0^1 e^{2x}\,dx$ を置換して求めなさい。`,m`$\dfrac{e^2-1}{2}$。`,m`$t=2x$ なら $dx=\dfrac12dt$。`,m`$t:0\to2$ なので $\dfrac12[e^t]_0^2=\dfrac{e^2-1}{2}$。`),
 q("sub-bounds",m`$\int_0^1\sqrt{x+1}\,dx$ を $t=x+1$ で置換した式は？`,m`$\int_1^2\sqrt t\,dt$。`,m`$dx=dt$、端には $1$ を加えます。`,m`$x:0\to1$ に対し $t:1\to2$。`),
 q("sub-value",m`$\int_0^{\frac{\pi}{2}}\sin x\cos x\,dx$ は？`,m`$\dfrac12$。`,m`$t=\sin x$ とすれば $\cos x\,dx=dt$。`,m`$t:0\to1$ なので $\int_0^1t\,dt=\dfrac12$。`),
 q("sub-bounds",m`$\int_0^1(2-x)^3\,dx$ を $t=2-x$ で置換した式は？`,m`$-\int_2^1t^3\,dt=\int_1^2t^3\,dt$。`,m`$dt=-dx$ を忘れません。`,m`$x=0,1$ は $t=2,1$。`)
],[
 q("sub-value",m`$\int_0^1 2x\sqrt{x^2+1}\,dx$ は？`,m`$\dfrac23(2\sqrt2-1)$。`,m`根号の中身を $t$ にします。`,m`$dt=2x\,dx$、$t:1\to2$。$\left[\dfrac23t^{\frac32}\right]_1^2=\dfrac23(2\sqrt2-1)$。`),
 q("sub-bounds",m`$\int_0^1(4-x)^2\,dx$ を $t=4-x$ で置換した式は？`,m`$-\int_4^3t^2\,dt=\int_3^4t^2\,dt$。`,m`元の下端から順に対応させます。`,m`$dt=-dx$、$t:4\to3$。`)
],"m3-substitution-integrals");

add("definite-parts","部分積分と境界の項","積の両端の値と、残りの積分を分けよう。",[
 m`$u,v$ が区間で連続微分可能なら、積の微分 $(uv)'=u'v+uv'$ を積分して $\int_a^b uv'\,dx=[uv]_a^b-\int_a^b u'v\,dx$。`,
 m`$\int_0^1 xe^x\,dx$ では、$x$ を微分すると $1$ になり、残りが簡単になります。$u=x$、$v'=e^x$ と選び、$[xe^x]_0^1-\int_0^1e^x\,dx$ とします。`,
 m`最初の $[uv]_a^b$ は積全体の上端と下端の差です。残りの積分にも同じ区間を付け、最後まで負号を保ちます。`
],m`微分で簡単になる側を選び、境界の項と残りの定積分を別々に計算します。`,[
 ex("一次式を微分する",q("parts",m`$\int_0^1 xe^x\,dx$ を求めなさい。`,m`$1$。`,m`$x$ を微分、$e^x$ を積分します。`,m`$[xe^x]_0^1-\int_0^1e^x\,dx=e-(e-1)=1$。`)),
 ex("下端の積も引く",q("boundary",m`部分積分に現れた $[xe^x]_1^2$ を計算しなさい。`,m`$2e^2-e$。`,m`積全体へ両端を入れます。`,m`$2e^2-1\cdot e$。下端はゼロではありません。`))
],[s("parts","残りが簡単になる選択",m`連続微分可能な二関数で部分積分を使います。一次式を微分すれば定数となります。`,m`\int_a^b xe^x\,dx=[xe^x]_a^b-[e^x]_a^b`,m`$\int_0^1x\cos x\,dx$ は？`,m`$[x\sin x]_0^1-\int_0^1\sin x\,dx=\sin1+\cos1-1$。`),
 s("boundary","積全体の両端",m`境界の項では、両方の因子を同じ端で評価してから差を取ります。`,m`[u(x)v(x)]_a^b=u(b)v(b)-u(a)v(a)`,m`$[x\log x]_1^e$ は？`,m`$e\log e-1\log1=e$。区間は正なので対数も定義されます。`)],[
 q("parts",m`$x$ を微分し、$e^x$ を積分するとそれぞれ？（原始関数は一つでよい。）`,m`$1$、$e^x$。`,m`残りの積が簡単になる組合せです。`,m`$x'=1$、$(e^x)'=e^x$。`),
 q("boundary",m`$[x\sin x]_0^{\frac{\pi}{2}}$ は？`,m`$\dfrac{\pi}{2}$。`,m`両因子へ同じ端を入れます。`,m`$\dfrac{\pi}{2}\cdot1-0\cdot0=\dfrac{\pi}{2}$。`)
],[
 q("parts",m`$\int_0^{\frac{\pi}{2}}x\cos x\,dx$ は？`,m`$\dfrac{\pi}{2}-1$。`,m`$x$ を微分し、$\cos x$ を積分します。`,m`$[x\sin x]_0^{\frac{\pi}{2}}-\int_0^{\frac{\pi}{2}}\sin x\,dx=\dfrac{\pi}{2}-1$。`),
 q("boundary",m`$[x\log x]_1^2$ は？`,m`$2\log2$。`,m`下端では $\log1=0$。`,m`$2\log2-1\log1=2\log2$。`)
],[
 q("parts",m`$\int_1^e\log x\,dx$ は？`,m`$1$。`,m`$\log x$ を微分、$1$ を積分します。`,m`$[x\log x]_1^e-\int_1^e1\,dx=e-(e-1)=1$。区間は正です。`),
 q("boundary",m`$[-x\cos x]_0^\pi$ は？`,m`$\pi$。`,m`原始関数から来た負号を保ちます。`,m`$-\pi(-1)-0=\pi$。`),
 q("parts",m`$\int_0^\pi x\sin x\,dx$ は？`,m`$\pi$。`,m`$\sin x$ の原始関数は $-\cos x$。`,m`$[-x\cos x]_0^\pi+\int_0^\pi\cos x\,dx=\pi+[\sin x]_0^\pi=\pi$。`),
 q("boundary",m`$[xe^x]_0^2$ は？`,m`$2e^2$。`,m`下端の一次因子がゼロです。`,m`$2e^2-0e^0=2e^2$。`),
 q("parts",m`$\int_0^1xe^{2x}\,dx$ は？`,m`$\dfrac{e^2+1}{4}$。`,m`$e^{2x}$ の原始関数は $\dfrac12e^{2x}$。`,m`$\left[\dfrac x2e^{2x}\right]_0^1-\dfrac12\int_0^1e^{2x}\,dx=\dfrac{e^2}{2}-\dfrac{e^2-1}{4}=\dfrac{e^2+1}{4}$。`),
 q("boundary",m`$[x\sin x]_0^\pi$ は？`,m`$0$。`,m`両端での正弦を見ます。`,m`$\pi\sin\pi-0\sin0=0$。`)
],[
 q("parts",m`$\int_0^2xe^x\,dx$ は？`,m`$e^2+1$。`,m`$x$ を微分して残りを簡単にします。`,m`$[xe^x]_0^2-[e^x]_0^2=2e^2-(e^2-1)=e^2+1$。`),
 q("boundary",m`$[xe^x]_{-1}^0$ は？`,m`$e^{-1}$。`,m`負の下端の値全体を引きます。`,m`$0-(-e^{-1})=e^{-1}$。`)
],"m3-parts-introduction");

add("integral-symmetry","偶奇性と対称区間","関数の対称性と、両端の対称性を確かめよう。",[
 m`$f(-x)=f(x)$ なら偶関数、$f(-x)=-f(x)$ なら奇関数です。連続な $f$ と $a>0$ について、区間が $[-a,a]$ なら、偶関数は $\int_{-a}^a f=2\int_0^a f$、奇関数は $\int_{-a}^a f=0$。`,
 m`負の側で $x=-t$ と置くと $\int_{-a}^0 f(x)\,dx=\int_0^a f(-t)\,dt$。偶関数なら正の側と同じ値、奇関数なら反対の値になります。`,
 m`関数が奇関数でも、区間が $[0,1]$ ならこの打ち消しは使えません。また $\dfrac1x$ はゼロで未定義なので、$[-1,1]$ で連続な奇関数の公式を使うことはできません。`
],m`偶奇性・区間の対称性・区間全体での連続性をそろえて確認します。`,[
 ex("奇数次の項が打ち消し合う",q("sym-value",m`$\int_{-1}^1(x^3+x^2)\,dx$ は？`,m`$\dfrac23$。`,m`奇関数の項と偶関数の項に分けます。`,m`$\int_{-1}^1x^3\,dx=0$、$\int_{-1}^1x^2\,dx=2\int_0^1x^2\,dx=\dfrac23$。`)),
 ex("公式を使う前の確認",q("sym-condition",m`奇関数 $x^3$ について、$\int_0^1x^3\,dx=0$ といえますか。`,m`いえません。値は $\dfrac14$。`,m`区間は原点に対称ですか。`,m`$[0,1]$ は対称でないため公式は使えません。$\left[\dfrac{x^4}{4}\right]_0^1=\dfrac14$。`))
],[s("sym-value","左右の積分を合わせる",m`連続関数を原点に対称な区間で積分すると、奇関数の寄与は相殺し、偶関数の寄与は片側の二倍になります。`,m`\int_{-1}^1(x+x^2)\,dx=0+2\int_0^1x^2\,dx`,m`値は？`,m`$\dfrac23$。奇関数の項と偶関数の項を分けました。`),
 s("sym-condition","公式の三つの条件",m`関数の偶奇性だけでなく、区間が原点対称であり、その区間全体で関数が連続であることを確認します。`,m`f(-x)=-f(x),\quad [-a,a]\quad(a>0)`,m`$\int_{-1}^1\dfrac1x\,dx=0$ といえる？`,m`いえません。$0$ で未定義なので、この章の連続関数の公式を使えません。`)],[
 q("sym-condition",m`$f(x)=x^2$ の $f(-x)$ を求め、偶奇性を判定しなさい。`,m`$f(-x)=x^2=f(x)$。偶関数。`,m`$x$ に $-x$ を入れます。`,m`$(-x)^2=x^2$。`),
 q("sym-value",m`$\int_{-1}^1x\,dx$ は？`,m`$0$。`,m`連続な奇関数を対称区間で積分します。`,m`正と負の寄与が等しく反対になります。`)
],[
 q("sym-value",m`$\int_{-2}^2(x^3+1)\,dx$ は？`,m`$4$。`,m`奇関数の項を分けます。`,m`$x^3$ の積分はゼロ、定数項は $2\int_0^2 1\,dx=4$。`),
 q("sym-condition",m`$\int_{-1}^2x\,dx$ を奇関数だからゼロとしてよいですか。`,m`よくありません。区間が非対称で、値は $\dfrac32$。`,m`両端の絶対値を比べます。`,m`$\left[\dfrac{x^2}{2}\right]_{-1}^2=2-\dfrac12=\dfrac32$。`)
],[
 q("sym-value",m`$\int_{-\frac{\pi}{2}}^{\frac{\pi}{2}}\cos x\,dx$ は？`,m`$2$。`,m`余弦は偶関数です。`,m`$2\int_0^{\frac{\pi}{2}}\cos x\,dx=2[\sin x]_0^{\frac{\pi}{2}}=2$。`),
 q("sym-condition",m`$\int_{-2}^2\dfrac1x\,dx$ に奇関数の公式を使えますか。`,m`使えません。$0$ で未定義。`,m`対称性以外の条件も調べます。`,m`区間全体で連続ではありません。`),
 q("sym-value",m`$\int_{-1}^1(x^5+3x^2)\,dx$ は？`,m`$2$。`,m`奇数次と偶数次を分けます。`,m`$0+6\int_0^1x^2\,dx=2$。`),
 q("sym-condition",m`$\int_{-1}^1 e^x\,dx$ に偶関数の二倍の公式を使えますか。`,m`使えません。$e^{-x}\ne e^x$ が一般に成り立ちます。`,m`$f(-x)$ を直接書きます。`,m`例えば $x=1$ で $e^{-1}\ne e$。連続ですが偶関数ではありません。`),
 q("sym-value",m`$\int_{-\pi}^{\pi}(\sin x+2)\,dx$ は？`,m`$4\pi$。`,m`正弦は奇関数です。`,m`正弦の積分はゼロ、定数項は $2\cdot2\pi=4\pi$。`),
 q("sym-condition",m`連続な奇関数 $f$ について $\int_{-3}^3f(x)\,dx=0$ といえる理由は？`,m`区間が原点対称で、左右の積分が符号を反転して打ち消し合うから。`,m`$f(-t)=-f(t)$ を使います。`,m`$\int_{-3}^0f(x)\,dx=\int_0^3f(-t)\,dt=-\int_0^3f(t)\,dt$。`)
],[
 q("sym-value",m`$\int_{-1}^1(x^3+2x^2+1)\,dx$ は？`,m`$\dfrac{10}{3}$。`,m`奇関数の項を消し、残りを片側で計算します。`,m`$2\int_0^1(2x^2+1)\,dx=2\left(\dfrac23+1\right)=\dfrac{10}{3}$。`),
 q("sym-condition",m`$\int_0^\pi\sin x\,dx=0$ と奇関数の性質からいえますか。`,m`いえません。区間が原点対称でなく、値は $2$。`,m`奇関数でも両端の確認が必要です。`,m`$[-\cos x]_0^\pi=2$。`)
],"m3-integral-properties");

add("integral-function","積分で定義された関数","上端が動くと積分値はどう変わるだろう。",[
 m`$F(x)=\int_0^x t^2\,dt$ では、$t$ が積分変数、$x$ が動く上端です。計算すると $F(x)=\dfrac{x^3}{3}$、微分すると $F'(x)=x^2$。`,
 m`一般に $f$ が区間で連続で、その区間内の固定点 $a$ から $F(x)=\int_a^x f(t)\,dt$ とおくと、区間の内点で $F'(x)=f(x)$ です。`,
 m`理由は $F(x+h)-F(x)=\int_x^{x+h}f(t)\,dt$。これを $h$ で割った値は、小区間での $f$ の平均です。連続性により $h\to0$ で $f(x)$ に近づきます。$h<0$ でも向きと分母の負号が相殺され、同じ極限になります。`,
 m`原始関数 $G$ があれば $(F-G)'=0$ なので差は定数。$F(a)=0$ から $F(x)=G(x)-G(a)$ となり、定積分を原始関数の差で計算できることにつながります。`
],m`積分変数と上端を区別し、微分の公式では被積分関数の連続性を確認します。`,[
 ex("先に計算して確かめる",q("ftc-compute",m`$F(x)=\int_0^x t^2\,dt$ の $F(x)$ と $F'(x)$ を求めなさい。`,m`$F(x)=\dfrac{x^3}{3}$、$F'(x)=x^2$。`,m`上端 $x$ を原始関数へ入れます。`,m`$\left[\dfrac{t^3}{3}\right]_0^x=\dfrac{x^3}{3}$。この式を微分すると $x^2$。`)),
 ex("積分を計算せずに微分する",q("ftc",m`$F(x)=\int_0^x e^{-t^2}\,dt$ の $F'(x)$ を求めなさい。`,m`$e^{-x^2}$。`,m`被積分関数は連続です。`,m`基本定理より $F'(x)=f(x)=e^{-x^2}$。原始関数の具体式は不要です。`))
],[s("ftc-compute","上端が文字でも両端の差",m`積分変数について原始関数を求め、上端に動く文字を代入します。その後、得られた関数を微分します。`,m`F(x)=\int_1^x2t\,dt=x^2-1`,m`$F'(x)$ と $F(1)$ は？`,m`$F'=2x$、$F(1)=0$。`),
 s("ftc","増分を短い区間で表す",m`被積分関数が区間で連続で、固定下端と動く上端がその区間内にあれば、内点で基本定理が使えます。`,m`\frac{d}{dx}\int_a^xf(t)\,dt=f(x)`,m`$\dfrac{d}{dx}\int_0^x\cos(t^2)\,dt$ は？`,m`$\cos(x^2)$。被積分関数は全実数で連続です。`)],[
 q("ftc-compute",m`$\int_0^x2t\,dt$ で積分する文字と上端の文字は？`,m`積分変数は $t$、上端は $x$。`,m`末尾の微小量と上端を見ます。`,m`$dt$ は $t$ について積分する意味です。`),
 q("ftc",m`連続な $f$ について $F(x)=\int_a^x f(t)\,dt$。$F(a)$ は？`,m`$0$。`,m`両端が等しくなります。`,m`$F(a)=\int_a^a f(t)\,dt=0$。`)
],[
 q("ftc-compute",m`$F(x)=\int_1^x2t\,dt$ の $F$ と $F'$ は？`,m`$F=x^2-1$、$F'=2x$。`,m`下端の値を引きます。`,m`$[t^2]_1^x=x^2-1$。微分すると $2x$。`),
 q("ftc",m`$F(x)=\int_0^x\sin(t^2)\,dt$ の $F'$ は？`,m`$\sin(x^2)$。`,m`連続性を確認して基本定理を使います。`,m`$\sin(t^2)$ は連続なので、上端の値 $\sin(x^2)$ が導関数です。`)
],[
 q("ftc-compute",m`$F(x)=\int_0^x(2t+1)\,dt$ の $F$ と $F'$ は？`,m`$F=x^2+x$、$F'=2x+1$。`,m`項ごとに積分します。`,m`$[t^2+t]_0^x=x^2+x$。微分で $2x+1$ に戻ります。`),
 q("ftc",m`$F(x)=\int_1^x\dfrac1{1+t^2}\,dt$ の $F'$ は？`,m`$\dfrac1{1+x^2}$。`,m`分母は常に正です。`,m`被積分関数は全実数で連続なので基本定理が使えます。`),
 q("ftc-compute",m`$F(x)=\int_0^x\cos t\,dt$ の $F$ と $F'$ は？`,m`$F=\sin x$、$F'=\cos x$。`,m`下端の正弦はゼロです。`,m`$[\sin t]_0^x=\sin x$。`),
 q("ftc",m`$F(x)=\int_0^x(t^2+1)\,dt$ の $F'(2)$ は？`,m`$5$。`,m`関数値と導関数値を区別します。`,m`$F'(x)=x^2+1$ より $F'(2)=5$。`),
 q("ftc-compute",m`$x>0$ で $F(x)=\int_1^x\dfrac1t\,dt$ の $F$ と $F'$ は？`,m`$F=\log x$、$F'=\dfrac1x$。`,m`区間が正の側にあります。`,m`$[\log t]_1^x=\log x$。微分すると $\dfrac1x$。`),
 q("ftc",m`$F(x)=\int_0^x e^{t^2}\,dt$ の $F'(0)$ は？`,m`$1$。`,m`積分全体を計算する必要はありません。`,m`連続性より $F'(x)=e^{x^2}$、したがって $F'(0)=1$。`)
],[
 q("ftc-compute",m`$F(x)=\int_1^x3t^2\,dt$ の $F$ と $F'$ は？`,m`$F=x^3-1$、$F'=3x^2$。`,m`積分後に下端を忘れません。`,m`$[t^3]_1^x=x^3-1$。`),
 q("ftc",m`$F(x)=\int_2^x\cos(t^2)\,dt$ の $F'(1)$ は？`,m`$\cos1$。`,m`下端が上端より大きくても基本定理は使えます。`,m`被積分関数は連続。$F'(x)=\cos(x^2)$ より $\cos1$。`)
],"m3-dummy-variable");

add("moving-endpoints","動く上下端と合成関数","積分の微分にも、内側の微分を掛けよう。",[
 m`連続な $f$ に対し $G(u)=\int_a^u f(t)\,dt$ とおけば $G'(u)=f(u)$。上端が $g(x)$ なら合成関数 $G(g(x))$ なので、微分は $f(g(x))g'(x)$ です。`,
 m`例えば $\dfrac{d}{dx}\int_0^{x^2}f(t)\,dt=f(x^2)\cdot2x$。上端を代入するだけでは $2x$ が不足します。$g$ は微分可能で、固定点と上端を含む区間で $f$ が連続であることが前提です。`,
 m`上下端の両方が動く場合、$\int_{h(x)}^{g(x)}f=\int_a^{g(x)}f-\int_a^{h(x)}f$ と分けます。$g,h$ が微分可能で必要な区間で $f$ が連続なら、微分は $f(g(x))g'(x)-f(h(x))h'(x)$。`
],m`上端側と下端側を別々の合成関数として微分し、下端側を引きます。`,[
 ex("上端の微分を掛ける",q("upper-chain",m`$F(x)=\int_0^{x^2}t\,dt$ の $F'$ は？`,m`$2x^3$。`,m`基本定理と合成関数の微分を続けて使います。`,m`$f(x^2)(x^2)'=x^2\cdot2x=2x^3$。直接 $F=\dfrac{x^4}{2}$ と計算しても一致します。`)),
 ex("下端からの寄与を引く",q("two-ends",m`$F(x)=\int_x^{2x}t^2\,dt$ の $F'$ は？`,m`$7x^2$。`,m`上端側の変化から下端側の変化を引きます。`,m`$(2x)^2\cdot2-x^2\cdot1=8x^2-x^2=7x^2$。`))
],[s("upper-chain","基本定理の後に合成関数",m`$f$ が必要な区間で連続、$g$ が微分可能なら、上端が $g(x)$ の積分を微分すると $f(g(x))g'(x)$ です。`,m`\frac{d}{dx}\int_0^{2x}e^t\,dt=2e^{2x}`,m`$\dfrac{d}{dx}\int_0^{x^2}\cos t\,dt$ は？`,m`$2x\cos(x^2)$。上端の微分 $2x$ を掛けます。`),
 s("two-ends","下端側は引く",m`必要な区間で $f$ は連続、両端の関数は微分可能とします。固定点からの二つの積分の差に分けます。`,m`\frac{d}{dx}\int_{h(x)}^{g(x)}f(t)\,dt=f(g(x))g'(x)-f(h(x))h'(x)`,m`$\dfrac{d}{dx}\int_x^1t^2\,dt$ は？`,m`$-x^2$。上端は定数なので寄与はゼロです。`)],[
 q("upper-chain",m`$g(x)=x^2$ の $g'$ は？`,m`$2x$。`,m`合成関数で掛ける因子を確認します。`,m`べきの微分公式を使います。`),
 q("two-ends",m`連続な $f$ について $\int_x^1 f(t)\,dt$ を上下端を交換して書きなさい。`,m`$-\int_1^x f(t)\,dt$。`,m`向きを逆にすると符号が変わります。`,m`この負号が微分後にも残ります。`)
],[
 q("upper-chain",m`$\dfrac{d}{dx}\int_0^{2x}e^t\,dt$ は？`,m`$2e^{2x}$。`,m`上端 $2x$ の微分を掛けます。`,m`$e^{2x}\cdot2=2e^{2x}$。被積分関数は連続です。`),
 q("two-ends",m`$\dfrac{d}{dx}\int_x^1t^2\,dt$ は？`,m`$-x^2$。`,m`動くのは下端です。`,m`$0-x^2\cdot1=-x^2$。`)
],[
 q("upper-chain",m`$\dfrac{d}{dx}\int_0^{x^2}\cos t\,dt$ は？`,m`$2x\cos(x^2)$。`,m`上端を代入した後にその微分を掛けます。`,m`$\cos(x^2)\cdot2x$。連続性と微分可能性を満たします。`),
 q("two-ends",m`$\dfrac{d}{dx}\int_x^{x+1}t\,dt$ は？`,m`$1$。`,m`両端の微分はともに $1$。`,m`$(x+1)-x=1$。`),
 q("upper-chain",m`$\dfrac{d}{dx}\int_0^{1-x}t^2\,dt$ は？`,m`$-(1-x)^2$。`,m`上端の微分は負です。`,m`$(1-x)^2\cdot(-1)=-(1-x)^2$。`),
 q("two-ends",m`$\dfrac{d}{dx}\int_{x^2}^1e^t\,dt$ は？`,m`$-2xe^{x^2}$。`,m`下端の合成関数を微分して引きます。`,m`$0-e^{x^2}\cdot2x=-2xe^{x^2}$。`),
 q("upper-chain",m`$f$ が実数全体で連続。$\dfrac{d}{dx}\int_0^{3x}f(t)\,dt$ は？`,m`$3f(3x)$。`,m`上端の関数とその微分を分けます。`,m`$g(x)=3x$、$g'=3$ なので $f(g(x))g'=3f(3x)$。`),
 q("two-ends",m`$\dfrac{d}{dx}\int_x^{2x}e^t\,dt$ は？`,m`$2e^{2x}-e^x$。`,m`上端にだけ係数 $2$ が付きます。`,m`$e^{2x}\cdot2-e^x\cdot1$。`)
],[
 q("upper-chain",m`$\dfrac{d}{dx}\int_1^{x^2}e^t\,dt$ は？`,m`$2xe^{x^2}$。`,m`固定下端は微分に寄与しません。`,m`$e^{x^2}\cdot2x$。`),
 q("two-ends",m`$\dfrac{d}{dx}\int_x^{x+1}t^2\,dt$ は？`,m`$2x+1$。`,m`両端での関数値の差になります。`,m`$(x+1)^2-x^2=2x+1$。`)
],"m3-integral-function");

add("integral-bounds","関数の大小と積分の評価","計算できなくても、積分値の範囲を調べよう。",[
 m`$a<b$、$f$ が $[a,b]$ で連続とします。区間全体で $m\le f(x)\le M$ なら $m(b-a)\le\int_a^b f(x)\,dx\le M(b-a)$。高さの上下限に区間の長さを掛けます。`,
 m`連続な $f,g$ が区間全体で $f(x)\le g(x)$ を満たすなら $\int_a^b f\le\int_a^b g$。差 $g-f$ が非負なので、その積分も非負だからです。`,
 m`一つの点での大小だけでは使えません。また $a>b$ に向きを逆転すると、不等号の向きも反転します。評価は積分の正確な値を求めることとは違います。`
],m`大小関係が区間全体で成り立つことと、区間の長さ・向きを確かめます。`,[
 ex("高さの上下限で挟む",q("bounds",m`$0\le x\le1$ で $\dfrac12\le\dfrac1{1+x^2}\le1$ を示し、$I=\int_0^1\dfrac1{1+x^2}\,dx$ を評価しなさい。`,m`$\dfrac12\le I\le1$。`,m`分母の範囲を調べ、正の数の逆数を取ります。`,m`$1\le1+x^2\le2$ より指定の不等式。区間長は $1$ なので各辺を積分して $\dfrac12\le I\le1$。`)),
 ex("区間全体で比較する",q("compare",m`$\int_0^1x^2\,dx\le\int_0^1x\,dx$ を、関数の大小から説明しなさい。`,m`$[0,1]$ で $x^2\le x$ であり、連続関数を同じ向きに積分するので成り立ちます。`,m`差の符号を調べます。`,m`$x-x^2=x(1-x)\ge0$。したがって両積分の差も非負です。`))
],[s("bounds","区間の長さを掛ける",m`$a<b$ で連続な $f$ が区間全体で $m\le f\le M$ を満たすとき、積分値を長方形の符号付きの値で挟めます。`,m`m(b-a)\le\int_a^bf(x)\,dx\le M(b-a)`,m`$[1,3]$ で連続な $f$ が $2\le f\le4$ なら？`,m`区間長は $2$。$4\le\int_1^3f\le8$。`),
 s("reverse-compare","向きを逆にすると大小も逆",m`$a<b$、連続な $f,g$ が $[a,b]$ 全体で $f\le g$ とします。正向きの積分を比べた後、両辺に負号を付けます。`,m`\int_a^b f\le\int_a^b g\ \Longrightarrow\ -\int_a^b f\ge-\int_a^b g`,m`$\int_b^a f$ と $\int_b^a g$ は？`,m`$\int_b^a f\ge\int_b^a g$。上下端の交換による負号が不等号を反転させます。`),
 s("compare-assumption","一点の大小では足りない",m`積分の大小を関数の比較から結論するには、同じ正向きの区間全体での大小が必要です。一点での大小だけでは反例があります。`,m`f(x)=x,\quad g(x)=0`,m`$f(0)=g(0)$ なら $\int_0^1f\le\int_0^1g$ といえる？`,m`いえません。$\int_0^1f=\dfrac12$、$\int_0^1g=0$ です。一点の等しさだけでは積分を比較できません。`),
 s("compare","差を非負と確認する",m`$a<b$、両関数は区間で連続とします。区間全体で $g-f\ge0$ なら $\int_a^b g-\int_a^b f\ge0$ です。`,m`\int_a^b(g-f)\,dx\ge0`,m`$[0,1]$ で $x^3\le x^2$ から何がいえる？`,m`$\int_0^1x^3\,dx\le\int_0^1x^2\,dx$。差は $x^2(1-x)\ge0$。`)],[
 q("bounds",m`区間 $[1,3]$ の長さは？`,m`$2$。`,m`右端から左端を引きます。`,m`$3-1=2$。`),
 q("compare",m`$0\le x\le1$ で $x(1-x)$ の符号は？`,m`非負。`,m`二つの因子の符号を見ます。`,m`$x\ge0$、$1-x\ge0$ なので積も非負です。`)
],[
 q("bounds",m`連続な $f$ が $[1,3]$ で $2\le f(x)\le5$ を満たします。$\int_1^3f(x)\,dx$ を評価しなさい。`,m`$4\le\int_1^3f(x)\,dx\le10$。`,m`区間長を両方の高さに掛けます。`,m`$2(3-1)=4$、$5(3-1)=10$。`),
 q("compare",m`$\int_0^1x^3\,dx\le\int_0^1x^2\,dx$ を関数の大小で説明しなさい。`,m`$x^2-x^3=x^2(1-x)\ge0$ が区間全体で成り立つため。`,m`大きい側から小さい側を引きます。`,m`両関数は連続で、差の積分は非負です。`)
],[
 q("bounds",m`連続な $f$ が $[0,2]$ で $-1\le f\le3$。$\int_0^2f$ を評価しなさい。`,m`$-2\le\int_0^2f\le6$。`,m`下限が負でも長さは正です。`,m`両限界へ区間長 $2$ を掛けます。`),
 q("reverse-compare",m`$[0,1]$ で連続な $f,g$ が $f\le g$。$\int_1^0f$ と $\int_1^0g$ の大小は？`,m`$\int_1^0f\ge\int_1^0g$。`,m`正向きの積分に戻すと負号が付きます。`,m`$\int_0^1f\le\int_0^1g$ の両辺に $-1$ を掛けます。`),
 q("bounds",m`$I=\int_0^1e^{-x^2}\,dx$ を $e^{-1}\le e^{-x^2}\le1$ から評価し、この大小の理由も述べなさい。`,m`$e^{-1}\le I\le1$。$-1\le-x^2\le0$ で指数関数は増加するからです。`,m`指数の範囲と区間長を確認します。`,m`$0\le x^2\le1$ なので指定の大小が全区間で成立。連続な関数を長さ $1$ の区間で積分します。`),
 q("compare-assumption",m`連続な $f,g$ が一点 $x=0$ で $f(0)\le g(0)$。それだけで $\int_0^1f\le\int_0^1g$ といえますか。反例も示しなさい。`,m`いえません。$f(x)=x$、$g(x)=0$ が反例。`,m`一点以外で大小が逆になる関数を考えます。`,m`$f(0)=g(0)=0$ ですが、$\int_0^1f=\dfrac12>0=\int_0^1g$。`),
 q("bounds",m`$I=\int_1^2\dfrac1x\,dx$ を関数の上下限で評価しなさい。`,m`$\dfrac12\le I\le1$。`,m`正の $x$ の範囲から逆数の範囲を出します。`,m`$1\le x\le2$ より $\dfrac12\le\dfrac1x\le1$。連続で区間長は $1$。`),
 q("compare",m`$0\le x\le1$ で $\sqrt x\ge x$ を用い、二つの積分の大小を理由付きで述べなさい。`,m`$\int_0^1\sqrt x\,dx\ge\int_0^1x\,dx$。連続な両関数の大小が区間全体で成り立つから。`,m`同じ正向きの区間で積分します。`,m`差 $\sqrt x-x\ge0$ を積分しても非負です。`)
],[
 q("bounds",m`連続な $f$ が $[-1,2]$ で $1\le f\le2$。$\int_{-1}^2f$ を評価しなさい。`,m`$3\le\int_{-1}^2f\le6$。`,m`区間長は端の差です。`,m`$2-(-1)=3$ なので下限 $3$、上限 $6$。`),
 q("compare",m`$\int_0^1x^4\,dx\le\int_0^1x^2\,dx$ を関数の大小で説明しなさい。`,m`$x^2-x^4=x^2(1-x^2)\ge0$ が区間全体で成り立ち、両関数が連続だから。`,m`差を因数分解します。`,m`$x^2\ge0$、$1-x^2\ge0$。差の積分も非負です。`),
 q("reverse-compare",m`$[1,2]$ で連続な $f,g$ が $f\le g$。$\int_2^1 f$ と $\int_2^1g$ の大小を理由付きで答えなさい。`,m`$\int_2^1f\ge\int_2^1g$。正向きの大小の両辺に負号を付けるから。`,m`先に $1$ から $2$ へ積分した大小を書きます。`,m`$\int_1^2f\le\int_1^2g$。両辺に $-1$ を掛けて向きを反転します。`),
 q("compare-assumption",m`連続な $f,g$ で $f(0)\le g(0)$ だけ分かっています。$\int_0^2f\le\int_0^2g$ といえますか。反例も示しなさい。`,m`いえません。$f(x)=x$、$g(x)=0$ が反例です。`,m`一点の条件と区間全体の条件を分けます。`,m`$f(0)=g(0)=0$ ですが $\int_0^2f=2>0=\int_0^2g$。`)
],"m3-riemann-sums");


add("riemann-sums","小長方形の和と定積分","幅・高さ・個数から積分を組み立てよう。",[
 m`$[0,1]$ を $n$ 等分すると幅は $\dfrac1n$。$y=x^2$ の第 $k$ 区間の右端を使えば、高さは $\left(\dfrac kn\right)^2$。小長方形の面積の和は $\dfrac1n\sum_{k=1}^n\left(\dfrac kn\right)^2$ です。`,
 m`$[a,b]$ で連続な $f$ と $a<b$ について、幅 $\Delta x=\dfrac{b-a}{n}$、右端 $x_k=a+k\Delta x$ とすれば、$\lim_{n\to\infty}\sum_{k=1}^n f(x_k)\Delta x=\int_a^b f(x)\,dx$。負の高さは符号付きの寄与になります。`,
 m`連続関数では、小区間の最大値と最小値による和の差が、分割を細かくするとゼロへ近づきます。その間にある右端・左端の和も同じ極限になります。幅を掛け忘れると、この積分を表しません。`
],m`先に一片の幅と高さを書き、足す個数を確かめてから極限を考えます。`,[
 ex("幅と高さを別々に書く",q("sum-setup",m`$[0,1]$ を $n$ 等分し、$y=x^2$ の右端の高さで作る長方形の和を書きなさい。`,m`$\dfrac1n\sum_{k=1}^n\left(\dfrac kn\right)^2$。`,m`幅は $\dfrac1n$、第 $k$ 右端は $\dfrac kn$。`,m`一片は $\left(\dfrac kn\right)^2\dfrac1n$、これを $n$ 個足します。`)),
 ex("和の極限を積分で読む",q("sum-limit",m`$\lim_{n\to\infty}\dfrac1n\sum_{k=1}^n\left(\dfrac kn\right)^2$ を求めなさい。`,m`$\dfrac13$。`,m`幅と高さから $[0,1]$ の積分に対応させます。`,m`$x^2$ は連続なので $\int_0^1x^2\,dx=\dfrac13$。直接でも $\dfrac{n(n+1)(2n+1)}{6n^3}\to\dfrac13$。`))
],[s("sum-setup","左端から右端までの位置",m`$[a,b]$ を $n$ 等分した右端は $a+\dfrac{(b-a)k}{n}$。関数へ代入した高さと、幅を掛けます。`,m`\Delta x=\frac{b-a}{n},\quad x_k=a+\frac{(b-a)k}{n}`,m`$[1,2]$ の $y=x$ の右端の和は？`,m`$\dfrac1n\sum_{k=1}^n\left(1+\dfrac kn\right)$。幅は $\dfrac1n$、左端の $1$ を位置へ足します。`),
 s("sum-limit","連続関数の和を積分へ",m`幅がゼロへ近づく等分の和で、関数が区間で連続なら、幅と高さの積の和は定積分に収束します。`,m`\lim_{n\to\infty}\frac1n\sum_{k=1}^nf\left(\frac kn\right)=\int_0^1f(x)\,dx`,m`$f(x)=x$ のときの値は？`,m`$\int_0^1x\,dx=\dfrac12$。`)],[
 q("sum-setup",m`$[0,2]$ を $n$ 等分した幅は？`,m`$\dfrac2n$。`,m`全体の長さを個数で割ります。`,m`$\dfrac{2-0}{n}=\dfrac2n$。`),
 q("sum-limit",m`$\int_0^1x\,dx$ は？`,m`$\dfrac12$。`,m`和の極限に対応する基本積分です。`,m`$\left[\dfrac{x^2}{2}\right]_0^1=\dfrac12$。`)
],[
 q("sum-setup",m`$[0,2]$ の $y=x$ を右端で $n$ 等分した長方形の和は？`,m`$\dfrac2n\sum_{k=1}^n\dfrac{2k}{n}$。`,m`幅と右端の位置の両方に $2$ が入ります。`,m`幅 $\dfrac2n$、高さ $\dfrac{2k}{n}$、個数 $n$。`),
 q("sum-limit",m`$\lim_{n\to\infty}\dfrac1n\sum_{k=1}^ne^{\frac kn}$ は？`,m`$e-1$。`,m`高さは $f\left(\dfrac kn\right)$ の形です。`,m`$e^x$ は $[0,1]$ で連続。$\int_0^1e^x\,dx=e-1$。`)
],[
 q("sum-setup",m`$[1,2]$ の $y=x^2$ を右端で $n$ 等分した和は？`,m`$\dfrac1n\sum_{k=1}^n\left(1+\dfrac kn\right)^2$。`,m`左端が $1$ であることを位置に反映します。`,m`幅 $\dfrac1n$、右端 $1+\dfrac kn$、高さはその二乗です。`),
 q("sum-limit",m`$\lim_{n\to\infty}\dfrac2n\sum_{k=1}^n\dfrac{2k}{n}$ は？`,m`$2$。`,m`幅 $\dfrac2n$ と右端 $\dfrac{2k}{n}$ は $[0,2]$。`,m`$\int_0^2x\,dx=2$。`),
 q("sum-setup",m`$[0,1]$ の $y=x^2$ を左端の高さで $n$ 等分した和は？`,m`$\dfrac1n\sum_{k=1}^n\left(\dfrac{k-1}{n}\right)^2$。`,m`第 $k$ 区間の左端は一つ前の位置です。`,m`左端 $\dfrac{k-1}{n}$、幅 $\dfrac1n$、個数 $n$。`),
 q("sum-limit",m`$\lim_{n\to\infty}\dfrac1n\sum_{k=1}^n\left(1+\dfrac kn\right)$ は？`,m`$\dfrac32$。`,m`$[1,2]$ の右端の高さとして読めます。`,m`$\int_1^2x\,dx=\dfrac32$。$[0,1]$ で $1+x$ を積分しても同じです。`),
 q("sum-setup",m`$\dfrac1n\sum_{k=1}^n f\left(\dfrac kn\right)$ の幅・右端・個数を答えなさい。`,m`幅 $\dfrac1n$、右端 $\dfrac kn$、個数 $n$。`,m`和の外の係数と中の入力を区別します。`,m`$[0,1]$ を $n$ 等分しています。`),
 q("sum-limit",m`$\lim_{n\to\infty}\dfrac1n\sum_{k=1}^n\dfrac1{1+\frac kn}$ は？`,m`$\log2$。`,m`高さは $\dfrac1{1+x}$ です。`,m`$[0,1]$ で連続なので $\int_0^1\dfrac1{1+x}\,dx=\log2$。`)
],[
 q("sum-setup",m`$[0,2]$ の $y=x^2$ を右端で $n$ 等分した和は？`,m`$\dfrac2n\sum_{k=1}^n\left(\dfrac{2k}{n}\right)^2$。`,m`幅と高さを分けて書きます。`,m`幅 $\dfrac2n$、右端 $\dfrac{2k}{n}$、その二乗が高さです。`),
 q("sum-limit",m`$\lim_{n\to\infty}\dfrac1n\sum_{k=1}^n\left(\dfrac kn\right)^3$ は？`,m`$\dfrac14$。`,m`$[0,1]$ の $x^3$ の積分に対応します。`,m`連続性より $\int_0^1x^3\,dx=\left[\dfrac{x^4}{4}\right]_0^1=\dfrac14$。`)
],"m3-integral-function");

// Derived checks are assembled only after every source lesson has been registered.
math3Chapter7Lessons.sort((a,b)=>math3DefiniteOrder.indexOf(a.slug)-math3DefiniteOrder.indexOf(b.slug));
export const math3DefiniteCheckSelection=[
 ["definite-meaning","practice-1","review-1"],["definite-meaning","practice-4","review-2"],
 ["endpoint-evaluation","practice-3","review-1"],["endpoint-evaluation","practice-4","review-2"],
 ["integral-properties","practice-1","review-1"],["integral-properties","practice-3","review-2"],["integral-properties","practice-6","review-3"],
 ["dummy-variable","practice-5","review-1"],["dummy-variable","practice-4","review-2"],
 ["definite-substitution","practice-1","review-1"],["definite-substitution","practice-6","review-2"],
 ["definite-parts","practice-1","review-1"],["definite-parts","practice-6","review-2"],
 ["integral-symmetry","practice-3","review-1"],["integral-symmetry","practice-2","review-2"],
 ["integral-function","practice-1","review-1"],["integral-function","practice-4","review-2"],
 ["moving-endpoints","practice-3","review-1"],["moving-endpoints","practice-4","review-2"],
 ["riemann-sums","practice-1","review-1"],["riemann-sums","practice-6","review-2"],
 ["integral-bounds","practice-3","review-1"],["integral-bounds","practice-2","review-3"],
 ["integral-bounds","practice-6","review-2"],["integral-bounds","practice-4","review-4"],
 ["integral-properties","practice-2","review-4"]
] as const;
function picked(slug:string,key:string):Q{
 const a=math3Chapter7Exercises.find(e=>e.id==="m3-"+slug+"-"+key+"-v1");
 if(!a)throw new Error("Missing definite integral source: "+slug+" "+key);
 return {family:slug+"-"+a.family,prompt:a.prompt,answer:a.answer,hint:a.hints[0],working:a.steps[0].text};
}
const checkExamples=[picked("definite-substitution","practice-3"),picked("moving-endpoints","practice-6")];
const checkSupplements=math3Chapter7Lessons.flatMap(l=>l.supplements.map(a=>({...a,id:l.slug.slice(3)+"-"+a.id})));
add("definite-integrals-check","定積分の総確認","文字・区間・計算方法を自分で確かめよう。",[
 m`積分変数、両端、区間内での連続性を確かめてから計算します。置換するなら微小量と範囲をそろえ、部分積分するなら境界の項を残します。`,
 m`積分で定義された関数の微分では、上端・下端の動きも見ます。和の極限や大小評価では、幅・高さ・区間全体の条件を先に確認します。`
],m`答えだけでなく、用いた関係と必要な条件が途中式から分かるように書きます。`,[
 ex("置換して両端をそろえる",checkExamples[0]),ex("両端の動きを微分する",checkExamples[1])
],checkSupplements,[
 picked("dummy-variable","ready-1"),picked("integral-bounds","ready-1")
],[
 picked("definite-substitution","guided-1"),picked("moving-endpoints","guided-2")
],math3DefiniteCheckSelection.map(([slug,p])=>picked(slug,p)),math3DefiniteCheckSelection.map(([slug,,r])=>picked(slug,r)),"m3-integral-bounds");
