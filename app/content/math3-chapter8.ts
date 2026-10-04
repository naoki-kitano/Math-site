import type {Lesson,Exercise,Example} from "./lessons";
const m=String.raw;
type Q={family:string;prompt:string;answer:string;hint:string;working:string};
const q=(family:string,prompt:string,answer:string,hint:string,working:string):Q=>({family,prompt,answer,hint,working});
const ex=(title:string,a:Q):Example=>({title,prompt:a.prompt,steps:[{title:"着目する",text:a.hint},{title:"式を立てて確かめる",text:a.working},{title:"答え",text:a.answer}]});
type S=Lesson["supplements"][number];
const s=(id:string,title:string,text:string,tex:string,check:string,answer:string):S=>({id,title,text,tex,check,answer});
export const math3Chapter8Lessons:Lesson[]=[];
export const math3Chapter8Exercises:Exercise[]=[];
export const math3IntegralApplicationOrder=["signed-area","between-curves","area-splitting","horizontal-area","cross-section-volume","disk-volume","washer-volume","rotation-direction","graph-length","parametric-length","parametric-area","displacement-distance"].map(x=>"m3-"+x);
function add(slug:string,title:string,description:string,introduction:string[],rule:string,examples:Example[],supplements:S[],ready:Q[],guided:Q[],practice:Q[],review:Q[],prerequisite:string){
 const l:Lesson={slug:"m3-"+slug,title,description,basicsTitle:title,subject:"数学III",chapter:"積分の応用",introduction,rule,examples,supplements,guidedAfterExamples:true,prerequisites:[{slug:prerequisite,label:"関連する基礎"}]};
 math3Chapter8Lessons.push(l);
 for(const [stage,items] of [["ready",ready],["guided",guided],["practice",practice],["review",review]] as const)items.forEach((a,i)=>math3Chapter8Exercises.push({id:l.slug+"-"+stage+"-"+(i+1)+"-v1",lesson:l.slug,stage,family:a.family,repair:a.family,kind:"paper",prompt:a.prompt,answer:a.answer,hints:[a.hint],steps:[{title:"考えて進める",text:a.working},{title:"答え",text:a.answer}]}));
}
add("signed-area","定積分と面積","軸の下でも、面積は正に数えよう。",[
 m`連続な $f$ と $a<b$ に対し、$y=f(x)$ と軸の間の面積は $\int_a^b|f(x)|\,dx$。小さな縦の帯の高さは $|f(x)|$、幅は $dx$ です。`,
 m`定積分 $\int_a^bf(x)\,dx$ は軸の下を負に数えます。面積を求めるときは、指定区間内でゼロになる点と符号を調べ、負の区間では $-f(x)$ を積分します。`
],m`先に区間と符号を確認し、面積の各部分を正の量として足します。`,[
 ex("軸をまたぐ直線",q("area-setup",m`$y=x$ と軸の間の $-1\le x\le2$ の面積を表す積分を立てなさい。`,m`$S=-\int_{-1}^0x\,dx+\int_0^2x\,dx$。`,m`ゼロは $x=0$。左右で符号が変わります。`,m`左の高さは $-x$、右は $x$。各高さに幅 $dx$ を掛けて足します。`)),
 ex("負の寄与と面積を区別",q("area-value",m`$y=x$ について $[-1,2]$ の定積分と軸との面積を求めなさい。`,m`定積分は $\dfrac32$、面積は $\dfrac52$。`,m`面積では左側の負の値を正に直します。`,m`$\int_{-1}^2x\,dx=2-\dfrac12=\dfrac32$。面積は $\dfrac12+2=\dfrac52$。`))
],[s("area-setup","高さは絶対値",m`指定区間全体で連続な曲線の符号を調べ、軸の下では高さを反転します。`,m`S=\int_a^b|f(x)|\,dx`,m`$y=x-1$、$0\le x\le2$ の面積の式は？`,m`$-\int_0^1(x-1)\,dx+\int_1^2(x-1)\,dx$。ゼロの $1$ で分割します。`),
 s("area-value","正の面積を足す",m`面積は各部分で非負です。符号付きの積分値をそのまま足さないようにします。`,m`-\int_{-1}^0x\,dx+\int_0^1x\,dx=1`,m`同じ区間の $\int_{-1}^1x\,dx$ は？`,m`$0$。面積は $\dfrac12+\dfrac12=1$ で、打ち消しません。`)],[
 q("area-setup",m`$x-1$ が $[0,2]$ でゼロになる点は？`,m`$x=1$。`,m`軸との交点を調べます。`,m`$x-1=0$。左で負、右で正です。`),
 q("area-value",m`底辺 $1$、高さ $2$ の三角形の面積は？`,m`$1$。`,m`底辺と高さの積の半分です。`,m`$\dfrac12\cdot1\cdot2=1$。`)
],[
 q("area-setup",m`$y=x-1$、$0\le x\le2$ と軸の間の面積の積分を立てなさい。`,m`$-\int_0^1(x-1)\,dx+\int_1^2(x-1)\,dx$。`,m`符号の変わる $1$ で分割します。`,m`左の高さは $1-x$、右は $x-1$。`),
 q("area-value",m`$y=x-1$ の $[0,2]$ の定積分と軸との面積は？`,m`定積分 $0$、面積 $1$。`,m`左右の三角形は同じ大きさです。`,m`各面積は $\dfrac12$。定積分は $-\dfrac12+\dfrac12=0$、面積は和 $1$。`)
],[
 q("area-setup",m`$y=x$、$-2\le x\le1$ と軸の間の面積の式は？`,m`$-\int_{-2}^0x\,dx+\int_0^1x\,dx$。`,m`軸の下の区間を確認します。`,m`$[-2,0]$ で $x\le0$、$[0,1]$ で $x\ge0$。`),
 q("area-value",m`$y=-x$、$0\le x\le2$ と軸の間の面積は？`,m`$2$。`,m`高さは $x$ です。`,m`$S=\int_0^2x\,dx=\left[\dfrac{x^2}{2}\right]_0^2=2$。`),
 q("area-setup",m`$y=\sin x$、$0\le x\le2\pi$ と軸の間の面積の式は？`,m`$\int_0^\pi\sin x\,dx-\int_\pi^{2\pi}\sin x\,dx$。`,m`区間の後半では正弦が負です。`,m`$\pi$ で高さの表し方を変えます。`),
 q("area-value",m`$y=\sin x$ の $[0,2\pi]$ の定積分と軸との面積は？`,m`定積分 $0$、面積 $4$。`,m`前半と後半を別々に計算します。`,m`前半の積分は $2$、後半は $-2$。面積は $2+2=4$。`),
 q("area-setup",m`$y=x^2-1$、$-1\le x\le1$ と軸の間の面積の式は？`,m`$\int_{-1}^1(1-x^2)\,dx$。`,m`区間全体で曲線は軸以下です。`,m`$x^2\le1$ より高さは $1-x^2$。`),
 q("area-value",m`$y=x^2-1$、$[-1,1]$ と軸の間の面積は？`,m`$\dfrac43$。`,m`負の関数を反転して積分します。`,m`$2\int_0^1(1-x^2)\,dx=2\left(1-\dfrac13\right)=\dfrac43$。`)
],[
 q("area-setup",m`$y=2x-2$、$0\le x\le2$ と軸の間の面積の式は？`,m`$-\int_0^1(2x-2)\,dx+\int_1^2(2x-2)\,dx$。`,m`ゼロの $1$ で分けます。`,m`左の高さは $2-2x$、右は $2x-2$。`),
 q("area-value",m`$y=x$、$[-2,1]$ の定積分と軸との面積は？`,m`定積分 $-\dfrac32$、面積 $\dfrac52$。`,m`面積は負の寄与を反転します。`,m`積分は $\dfrac12-2=-\dfrac32$、面積は $2+\dfrac12=\dfrac52$。`)
],"m3-definite-meaning");

add("between-curves","二曲線の間の面積","交点を求め、上の曲線から下を引こう。",[
 m`縦に細く切った帯の高さは「上の関数−下の関数」です。連続な $f,g$ が $[a,b]$ で $f\ge g$ なら、面積は $\int_a^b(f-g)\,dx$。`,
 m`二曲線だけで囲まれた部分では、まず交点を求めて区間を決めます。$y=x$ と $y=x^2$ なら $x=x^2$ より $x=0,1$。$[0,1]$ では $x-x^2=x(1-x)\ge0$ です。`
],m`交点・区間・上下関係を確認してから、帯の高さを積分します。`,[
 ex("交点が区間の両端になる",q("between-setup",m`$y=x$ と $y=x^2$ で囲まれた面積の積分を立てなさい。`,m`$S=\int_0^1(x-x^2)\,dx$。`,m`交点と区間内の上下を調べます。`,m`$x(x-1)=0$ より両端は $0,1$。$x(1-x)\ge0$ なので直線が上です。`)),
 ex("高さを項別に積分",q("between-value",m`$y=x$ と $y=x^2$ で囲まれた面積を求めなさい。`,m`$\dfrac16$。`,m`$[0,1]$ の高さは $x-x^2$。`,m`$S=\left[\dfrac{x^2}{2}-\dfrac{x^3}{3}\right]_0^1=\dfrac12-\dfrac13=\dfrac16$。正の値です。`))
],[s("between-setup","交点と上下関係",m`交点を求め、間の区間で差の符号を調べます。連続な二関数の上側から下側を引きます。`,m`S=\int_a^b(f-g)\,dx\quad(f\ge g)`,m`$y=2x$ と $y=x^2$ の面積の式は？`,m`交点は $0,2$。$2x-x^2=x(2-x)\ge0$ より $\int_0^2(2x-x^2)\,dx$。`),
 s("between-value","差を一つの積分にする",m`上下を確認した後、差を項ごとに積分し、両端の値を引きます。`,m`\int_0^1(x-x^2)\,dx=\frac16`,m`$\int_0^2(2x-x^2)\,dx$ は？`,m`$\left[x^2-\dfrac{x^3}{3}\right]_0^2=4-\dfrac83=\dfrac43$。`)],[
 q("between-setup",m`$x=x^2$ の解をすべて求めなさい。`,m`$x=0,1$。`,m`移項して因数分解します。`,m`$x(x-1)=0$。`),
 q("between-value",m`$\dfrac12-\dfrac13$ は？`,m`$\dfrac16$。`,m`分母をそろえます。`,m`$\dfrac36-\dfrac26=\dfrac16$。`)
],[
 q("between-setup",m`$y=2x$ と $y=x^2$ で囲まれた面積の式は？`,m`$\int_0^2(2x-x^2)\,dx$。`,m`交点は $x^2=2x$ から求めます。`,m`$x=0,2$、その間で $x(2-x)\ge0$。`),
 q("between-value",m`$y=2x$ と $y=x^2$ で囲まれた面積は？`,m`$\dfrac43$。`,m`区間内では直線が上です。`,m`$\int_0^2(2x-x^2)\,dx=\left[x^2-\dfrac{x^3}{3}\right]_0^2=\dfrac43$。`)
],[
 q("between-setup",m`$y=1$ と $y=x^2$ で囲まれた面積の式は？`,m`$\int_{-1}^1(1-x^2)\,dx$。`,m`交点の負の解も残します。`,m`$x^2=1$ より $x=\pm1$。間では $1\ge x^2$。`),
 q("between-value",m`$y=1$ と $y=x^2$ で囲まれた面積は？`,m`$\dfrac43$。`,m`偶関数の高さを片側で計算できます。`,m`$2\int_0^1(1-x^2)\,dx=\dfrac43$。`),
 q("between-setup",m`$y=\sqrt x$ と $y=x$ で囲まれた面積の式は？`,m`$\int_0^1(\sqrt x-x)\,dx$。`,m`$x\ge0$ で交点と大小を調べます。`,m`$\sqrt x=x$ は $x=0,1$。$0\le x\le1$ では $\sqrt x\ge x$。`),
 q("between-value",m`$y=\sqrt x$ と $y=x$ で囲まれた面積は？`,m`$\dfrac16$。`,m`根号をべきで積分します。`,m`$\left[\dfrac23x^{\frac32}-\dfrac{x^2}{2}\right]_0^1=\dfrac23-\dfrac12=\dfrac16$。`),
 q("between-setup",m`$y=x+1$、$y=x$ と $x=0,2$ に囲まれた面積の式は？`,m`$\int_0^2((x+1)-x)\,dx$。`,m`交点ではなく指定された縦線が区間を決めます。`,m`高さは常に $1$、区間は $[0,2]$。`),
 q("between-value",m`$y=x+1$、$y=x$、$x=0,2$ に囲まれた面積は？`,m`$2$。`,m`帯の高さは一定です。`,m`$\int_0^2 1\,dx=2$。`)
],[
 q("between-setup",m`$y=4$ と $y=x^2$ で囲まれた面積の式は？`,m`$\int_{-2}^2(4-x^2)\,dx$。`,m`交点は二つあります。`,m`$x=\pm2$、間では $4-x^2\ge0$。`),
 q("between-value",m`$y=4$ と $y=x^2$ で囲まれた面積は？`,m`$\dfrac{32}{3}$。`,m`対称性で半分を二倍します。`,m`$2\int_0^2(4-x^2)\,dx=2\left(8-\dfrac83\right)=\dfrac{32}{3}$。`)
],"m3-signed-area");

add("area-splitting","上下が変わる面積","指定区間を最後まで調べ、交点で分けよう。",[
 m`連続な二曲線の間の指定区間 $[a,b]$ の面積は $\int_a^b|f-g|\,dx$。交点を見つけたら、その前後で上下が変わるか調べます。`,
 m`$y=x$ と $y=x^2$ を $[0,2]$ で考えると、$[0,1]$ では直線が上、$[1,2]$ では放物線が上です。交点間の $[0,1]$ だけを計算して終わらず、指定された $2$ まで含めます。`
],m`指定端点と区間内の交点を順に並べ、区間ごとに「上−下」を書き直します。`,[
 ex("交点の先も含める",q("split-setup",m`$y=x$ と $y=x^2$ の間の $0\le x\le2$ の面積の式は？`,m`$\int_0^1(x-x^2)\,dx+\int_1^2(x^2-x)\,dx$。`,m`差 $x-x^2=x(1-x)$ の符号を調べます。`,m`$1$ で上下が逆転します。指定上端 $2$ まで二つの区間を足します。`)),
 ex("二つの正の量を足す",q("split-value",m`$y=x$ と $y=x^2$ の間の $[0,2]$ の面積は？`,m`$1$。`,m`上下が変わる $1$ で分けます。`,m`前半は $\dfrac16$。後半は $\left[\dfrac{x^3}{3}-\dfrac{x^2}{2}\right]_1^2=\dfrac56$。合計 $1$。`))
],[s("split-setup","指定区間内の符号",m`指定端点の外まで計算したり、交点間だけで止めたりしません。差の符号が変わるところで分けます。`,m`S=\int_a^b|f-g|\,dx`,m`$y=x$、$y=x^2$、$[-1,1]$ の式は？`,m`$\int_{-1}^0(x^2-x)\,dx+\int_0^1(x-x^2)\,dx$。ゼロで上下が変わります。`),
 s("split-value","部分ごとの面積を合計",m`それぞれの区間で非負の高さを積分し、最後に足します。`,m`\int_{-1}^0(x^2-x)\,dx=\frac56`,m`さらに $\int_0^1(x-x^2)\,dx=\dfrac16$ を加えると？`,m`$1$。符号付きの差ではなく面積の和です。`)],[
 q("split-setup",m`$x-x^2$ は $1<x\le2$ で正ですか、負ですか。`,m`負。`,m`$x(1-x)$ と見ます。`,m`$x>0$、$1-x<0$ です。`),
 q("split-value",m`$\dfrac16+\dfrac56$ は？`,m`$1$。`,m`同じ分母の分数を足します。`,m`$\dfrac66=1$。`)
],[
 q("split-setup",m`$y=x$、$y=x^2$ の間の $[-1,1]$ の面積の式は？`,m`$\int_{-1}^0(x^2-x)\,dx+\int_0^1(x-x^2)\,dx$。`,m`負の区間では放物線が上です。`,m`差 $x-x^2$ は $[-1,0]$ で非正、$[0,1]$ で非負。`),
 q("split-value",m`$y=x$、$y=x^2$ の間の $[-1,1]$ の面積は？`,m`$1$。`,m`ゼロで区間を分けます。`,m`$\int_{-1}^0(x^2-x)\,dx=\dfrac56$、$\int_0^1(x-x^2)\,dx=\dfrac16$。`)
],[
 q("split-setup",m`$y=x^2$、$y=1$ の間の $[0,2]$ の面積の式は？`,m`$\int_0^1(1-x^2)\,dx+\int_1^2(x^2-1)\,dx$。`,m`区間内の交点は $1$ です。`,m`$[0,1]$ は直線が上、$[1,2]$ は放物線が上。`),
 q("split-value",m`$y=x^2$、$y=1$ の間の $[0,2]$ の面積は？`,m`$2$。`,m`$1$ で高さを変えます。`,m`前半 $\dfrac23$、後半 $\left[\dfrac{x^3}{3}-x\right]_1^2=\dfrac43$。合計 $2$。`),
 q("split-setup",m`$y=x$、$y=x^2$ の間の $[1,2]$ の面積の式は？`,m`$\int_1^2(x^2-x)\,dx$。`,m`この指定区間では上下が途中で変わりません。`,m`$x(x-1)\ge0$。交点間の $[0,1]$ は含めません。`),
 q("split-value",m`$y=x$、$y=x^2$ の間の $[1,2]$ の面積は？`,m`$\dfrac56$。`,m`指定区間だけで上から下を引きます。`,m`$\left[\dfrac{x^3}{3}-\dfrac{x^2}{2}\right]_1^2=\dfrac23-(-\dfrac16)=\dfrac56$。`),
 q("split-setup",m`$y=x$、$y=-x$ の間の $[-1,2]$ の面積の式は？`,m`$\int_{-1}^0(-2x)\,dx+\int_0^2 2x\,dx$。`,m`原点で上下が逆転します。`,m`左の高さは $-x-x=-2x$、右は $x-(-x)=2x$。`),
 q("split-value",m`$y=x$、$y=-x$ の間の $[-1,2]$ の面積は？`,m`$5$。`,m`左右で正の高さを作ります。`,m`$\int_{-1}^0(-2x)\,dx=1$、$\int_0^2 2x\,dx=4$。合計 $5$。`)
],[
 q("split-setup",m`$y=x$、$y=x^2$ の間の $[-1,2]$ の面積の式は？`,m`$\int_{-1}^0(x^2-x)\,dx+\int_0^1(x-x^2)\,dx+\int_1^2(x^2-x)\,dx$。`,m`区間内の二交点を順に並べます。`,m`$0,1$ で高さが変わり、指定両端は $-1,2$ です。`),
 q("split-value",m`$y=x$、$y=x^2$ の間の $[-1,2]$ の面積は？`,m`$\dfrac{11}{6}$。`,m`三つの区間に分けます。`,m`$\dfrac56+\dfrac16+\dfrac56=\dfrac{11}{6}$。`)
],"m3-between-curves");

add("horizontal-area","横に切る面積","右から左を引き、高さの方向に積み重ねよう。",[
 m`曲線が $x=p(y)$、$x=q(y)$ と表されるときは、横長の帯を使うと自然です。右の座標から左の座標を引いた長さに、厚み $dy$ を掛けます。`,
 m`$c\le y\le d$ で連続な $p,q$ が $p\ge q$ なら、面積は $\int_c^d(p(y)-q(y))\,dy$。両端も $y$ の値にそろえます。`
],m`積分方向を決めたら、帯の長さ・微小量・上下端を同じ変数で表します。`,[
 ex("交点の縦の座標を使う",q("horizontal-setup",m`$x=y^2$ と $x=2-y$ で囲まれた面積の式は？`,m`$\int_{-2}^1(2-y-y^2)\,dy$。`,m`交点を $y$ について求めます。`,m`$y^2=2-y$ より $(y+2)(y-1)=0$。間では $2-y-y^2=(1-y)(y+2)\ge0$ なので直線が右です。`)),
 ex("横の長さを積分する",q("horizontal-value",m`$x=y^2$ と $x=2-y$ で囲まれた面積は？`,m`$\dfrac92$。`,m`右−左を $y=-2$ から $1$ へ積分します。`,m`$\left[2y-\dfrac{y^2}{2}-\dfrac{y^3}{3}\right]_{-2}^1=\dfrac76-(-\dfrac{10}{3})=\dfrac92$。`))
],[s("horizontal-setup","右−左と縦の範囲",m`横の帯を使うなら、連続な曲線の左右関係を縦の区間全体で調べます。`,m`S=\int_c^d(x_{\mathrm{right}}-x_{\mathrm{left}})\,dy`,m`$x=y$ と $x=y^2$ の面積の式は？`,m`交点の縦座標は $0,1$、右は $y$。$\int_0^1(y-y^2)\,dy$。`),
 s("horizontal-value","変数をそろえて計算",m`原始関数も代入する端も、すべて縦の変数でそろえます。`,m`\int_0^1(y-y^2)\,dy=\frac16`,m`$x=2y$ と $x=y^2$ で囲まれた面積は？`,m`交点は $y=0,2$。$\left[y^2-\dfrac{y^3}{3}\right]_0^2=\dfrac43$。`)],[
 q("horizontal-setup",m`横の帯の右端が $x=3$、左端が $x=1$。長さは？`,m`$2$。`,m`右から左を引きます。`,m`$3-1=2$。`),
 q("horizontal-value",m`$\int_0^1y\,dy$ は？`,m`$\dfrac12$。`,m`変数の名前が変わっても積分法は同じです。`,m`$\left[\dfrac{y^2}{2}\right]_0^1=\dfrac12$。`)
],[
 q("horizontal-setup",m`$x=y$ と $x=y^2$ で囲まれた面積の式は？`,m`$\int_0^1(y-y^2)\,dy$。`,m`交点と左右を $y$ で調べます。`,m`$y=0,1$、間では $y\ge y^2$。`),
 q("horizontal-value",m`$x=y$ と $x=y^2$ で囲まれた面積は？`,m`$\dfrac16$。`,m`横の長さ $y-y^2$ を積分します。`,m`$\left[\dfrac{y^2}{2}-\dfrac{y^3}{3}\right]_0^1=\dfrac16$。`)
],[
 q("horizontal-setup",m`$x=2y$ と $x=y^2$ で囲まれた面積の式は？`,m`$\int_0^2(2y-y^2)\,dy$。`,m`交点の縦座標が積分の端です。`,m`$y(y-2)=0$、間では $2y-y^2\ge0$。`),
 q("horizontal-value",m`$x=2y$ と $x=y^2$ で囲まれた面積は？`,m`$\dfrac43$。`,m`右の直線から左の放物線を引きます。`,m`$\left[y^2-\dfrac{y^3}{3}\right]_0^2=\dfrac43$。`),
 q("horizontal-setup",m`$x=1$、$x=y^2$ で囲まれた面積の式は？`,m`$\int_{-1}^1(1-y^2)\,dy$。`,m`上下両方の交点を使います。`,m`$y=\pm1$。間では直線が右です。`),
 q("horizontal-value",m`$x=1$ と $x=y^2$ で囲まれた面積は？`,m`$\dfrac43$。`,m`縦方向の対称性を使えます。`,m`$2\int_0^1(1-y^2)\,dy=\dfrac43$。`),
 q("horizontal-setup",m`$x=y+2$ と $x=y$ の間の $0\le y\le1$ の面積の式は？`,m`$\int_0^1((y+2)-y)\,dy$。`,m`指定された縦の範囲を使います。`,m`右−左は $2$、厚みは $dy$。`),
 q("horizontal-value",m`$x=y+2$ と $x=y$ の間の $0\le y\le1$ の面積は？`,m`$2$。`,m`横の長さは一定です。`,m`$\int_0^1 2\,dy=2$。`)
],[
 q("horizontal-setup",m`$x=4$ と $x=y^2$ で囲まれた面積の式は？`,m`$\int_{-2}^2(4-y^2)\,dy$。`,m`交点の縦座標を求めます。`,m`$y=\pm2$、右の座標は $4$。`),
 q("horizontal-value",m`$x=4$ と $x=y^2$ で囲まれた面積は？`,m`$\dfrac{32}{3}$。`,m`対称な縦の区間で積分します。`,m`$2\int_0^2(4-y^2)\,dy=\dfrac{32}{3}$。`)
],"m3-area-splitting");

add("cross-section-volume","断面積から体積へ","薄い一片の体積を積み重ねよう。",[
 m`位置 $x$ で軸に垂直に切った断面積が $A(x)$ なら、薄い一片の体積はおよそ $A(x)\Delta x$。$A$ が $[a,b]$ で連続なら、細かく分けた和の極限は $V=\int_a^b A(x)\,dx$ です。`,
 m`断面が一辺 $x$ の正方形なら $A(x)=x^2$。一辺そのものを積分するのではありません。断面積に厚みを掛けるので、面積の単位と長さの単位の積が体積の単位になります。`
],m`位置・断面の形・断面積・厚みを順に確認します。`,[
 ex("一辺から面積へ",q("section-setup",m`$0\le x\le1$ の立体で、$x$ 軸に垂直な断面が一辺 $x$ の正方形です。体積の積分を立てなさい。`,m`$A(x)=x^2$、$V=\int_0^1x^2\,dx$。`,m`積分するのは一辺でなく断面積です。`,m`一片の体積はおよそ $x^2\Delta x$。全区間で積み重ねます。`)),
 ex("断面積を積分する",q("section-value",m`$0\le x\le1$ で垂直断面が一辺 $x$ の正方形となる立体の体積は？`,m`$\dfrac13$。`,m`断面積は $x^2$、厚みは $dx$。`,m`$V=\int_0^1x^2\,dx=\left[\dfrac{x^3}{3}\right]_0^1=\dfrac13$。単位を指定するなら長さの単位の三乗です。`))
],[s("section-setup","断面積を先に求める",m`連続に変わる断面積を、切る方向の位置で表します。薄片は断面積×厚みです。`,m`V=\int_a^bA(x)\,dx`,m`一辺が $2x$ の正方形なら $A(x)$ は？`,m`$(2x)^2=4x^2$。一辺を二乗します。`),
 s("section-value","面積を長さ方向に積分",m`断面積を求めた後、立体が存在する区間全体で積分します。`,m`\int_0^1 4x^2\,dx=\frac43`,m`断面積が $A(x)=2x$、$0\le x\le2$ の体積は？`,m`$\int_0^2 2x\,dx=4$。すでに面積なので再び二乗しません。`)],[
 q("section-setup",m`一辺が $2$ の正方形の面積は？`,m`$4$。`,m`一辺の二乗です。`,m`$2^2=4$。`),
 q("section-value",m`断面積が一定 $3$、厚さが $2$ の柱体の体積は？`,m`$6$。`,m`断面積と厚さを掛けます。`,m`$3\cdot2=6$。`)
],[
 q("section-setup",m`$0\le x\le1$ の垂直断面が一辺 $2x$ の正方形。体積の式は？`,m`$\int_0^1 4x^2\,dx$。`,m`一辺全体を二乗します。`,m`$A(x)=(2x)^2=4x^2$。`),
 q("section-value",m`$0\le x\le1$ の垂直断面が一辺 $2x$ の正方形。体積は？`,m`$\dfrac43$。`,m`断面積 $4x^2$ を積分します。`,m`$4\left[\dfrac{x^3}{3}\right]_0^1=\dfrac43$。`)
],[
 q("section-setup",m`$0\le x\le1$ の垂直断面が底辺 $x$、高さ $2x$ の三角形。体積の式は？`,m`$\int_0^1x^2\,dx$。`,m`三角形の面積を使います。`,m`$A=\dfrac12x\cdot2x=x^2$。`),
 q("section-value",m`$0\le x\le2$ で断面積が $A(x)=2x$。体積は？`,m`$4$。`,m`与えられた量はすでに面積です。`,m`$V=\int_0^2 2x\,dx=[x^2]_0^2=4$。`),
 q("section-setup",m`$0\le x\le1$ の垂直断面が縦 $1$、横 $x+1$ の長方形。体積の式は？`,m`$\int_0^1(x+1)\,dx$。`,m`縦と横を掛けて断面積を作ります。`,m`$A=1(x+1)=x+1$。`),
 q("section-value",m`$0\le x\le1$ の断面積が $x+1$。体積は？`,m`$\dfrac32$。`,m`各項を積分します。`,m`$\left[\dfrac{x^2}{2}+x\right]_0^1=\dfrac32$。`),
 q("section-setup",m`断面積 $A(x)$ の単位が平方センチメートル、$x$ の単位がセンチメートル。$\int A(x)\,dx$ の単位と理由は？`,m`立方センチメートル。面積に厚みの長さを掛けて足すから。`,m`薄片の体積の単位を考えます。`,m`平方センチメートル×センチメートルが立方センチメートルです。`),
 q("section-value",m`$0\le x\le2$ の垂直断面が一辺 $x$ の正方形。体積は？`,m`$\dfrac83$。`,m`断面積は $x^2$。`,m`$\int_0^2x^2\,dx=\left[\dfrac{x^3}{3}\right]_0^2=\dfrac83$。`)
],[
 q("section-setup",m`$0\le x\le1$ の垂直断面が一辺 $1+x$ の正方形。体積の式は？`,m`$\int_0^1(1+x)^2\,dx$。`,m`和全体が一辺です。`,m`$A=(1+x)^2$。その面積に厚み $dx$ を掛けます。`),
 q("section-value",m`$0\le x\le1$ の垂直断面が一辺 $1+x$ の正方形。体積は？`,m`$\dfrac73$。`,m`一辺全体を二乗した式を積分します。`,m`$\int_0^1(1+2x+x^2)\,dx=1+1+\dfrac13=\dfrac73$。`)
],"m3-riemann-sums");

add("disk-volume","回転体と円板の断面","回転軸からの距離を半径にしよう。",[
 m`$0\le y\le f(x)$、$a\le x\le b$ の領域を $x$ 軸のまわりに回すと、垂直断面は半径 $f(x)$ の円です。連続な $f\ge0$ に対し $A(x)=\pi f(x)^2$、$V=\pi\int_a^bf(x)^2\,dx$。`,
 m`半径を二乗してから積分します。$f(x)=\sqrt x$ なら断面積は $\pi(\sqrt x)^2=\pi x$ です。曲線の高さをそのまま積分すると元の平面図形の面積になってしまいます。`
],m`回転軸→半径→円の面積→厚み、の順に式を立てます。`,[
 ex("根号は半径",q("disk-setup",m`$0\le x\le1$、$0\le y\le\sqrt x$ を $x$ 軸のまわりに回した体積の式は？`,m`$V=\pi\int_0^1x\,dx$。`,m`半径は軸からの距離 $\sqrt x$。`,m`断面積は $\pi(\sqrt x)^2=\pi x$。厚みは $dx$。`)),
 ex("円の面積を積み重ねる",q("disk-value",m`$0\le x\le1$、$0\le y\le\sqrt x$ の $x$ 軸回転の体積は？`,m`$\dfrac{\pi}{2}$。`,m`円板の断面積を積分します。`,m`$\pi\int_0^1x\,dx=\pi\left[\dfrac{x^2}{2}\right]_0^1=\dfrac{\pi}{2}$。`))
],[s("disk-setup","半径を二乗する",m`軸から非負の高さまでを回す円板では、半径の二乗に円周率を掛けたものが断面積です。`,m`A=\pi r^2`,m`$0\le y\le2x$、$0\le x\le1$ を $x$ 軸回転すると体積の式は？`,m`$\pi\int_0^1(2x)^2\,dx=4\pi\int_0^1x^2\,dx$。`),
 s("disk-value","円周率は外に残す",m`半径から断面積を作った後、区間全体の定積分を計算します。`,m`\pi\int_0^1x^2\,dx=\frac\pi3`,m`$0\le y\le x$、$0\le x\le2$ の $x$ 軸回転の体積は？`,m`$\pi\int_0^2x^2\,dx=\dfrac{8\pi}{3}$。`)],[
 q("disk-setup",m`半径 $r$ の円の面積は？`,m`$\pi r^2$。`,m`円周の式と区別します。`,m`断面に必要なのは長さ $2\pi r$ でなく面積です。`),
 q("disk-value",m`$(\sqrt x)^2$ は $x\ge0$ で何になりますか。`,m`$x$。`,m`根号の定義を使います。`,m`非負の平方根を二乗すると元に戻ります。`)
],[
 q("disk-setup",m`$0\le x\le1$、$0\le y\le x$ の $x$ 軸回転の体積の式は？`,m`$\pi\int_0^1x^2\,dx$。`,m`半径は $x$ です。`,m`断面積 $\pi x^2$ に厚み $dx$ を掛けます。`),
 q("disk-value",m`$0\le x\le1$、$0\le y\le x$ の $x$ 軸回転の体積は？`,m`$\dfrac\pi3$。`,m`半径を二乗して積分します。`,m`$\pi\left[\dfrac{x^3}{3}\right]_0^1=\dfrac\pi3$。`)
],[
 q("disk-setup",m`$0\le x\le1$、$0\le y\le2x$ の $x$ 軸回転の体積の式は？`,m`$\pi\int_0^1 4x^2\,dx$。`,m`係数 $2$ も二乗します。`,m`$r=2x$、$A=\pi(2x)^2=4\pi x^2$。`),
 q("disk-value",m`$0\le x\le1$、$0\le y\le2x$ の $x$ 軸回転の体積は？`,m`$\dfrac{4\pi}{3}$。`,m`断面積は $4\pi x^2$。`,m`$4\pi\int_0^1x^2\,dx=\dfrac{4\pi}{3}$。`),
 q("disk-setup",m`$0\le x\le1$、$0\le y\le e^x$ の $x$ 軸回転の体積の式は？`,m`$\pi\int_0^1e^{2x}\,dx$。`,m`指数関数全体を二乗します。`,m`$(e^x)^2=e^{2x}$。区間で半径は正です。`),
 q("disk-value",m`$0\le x\le1$、$0\le y\le e^x$ の $x$ 軸回転の体積は？`,m`$\dfrac\pi2(e^2-1)$。`,m`$e^{2x}$ の原始関数の係数を確認します。`,m`$\pi\left[\dfrac12e^{2x}\right]_0^1=\dfrac\pi2(e^2-1)$。`),
 q("disk-setup",m`$0\le x\le2$、$0\le y\le1$ の $x$ 軸回転の体積の式は？`,m`$\pi\int_0^2 1\,dx$。`,m`断面は半径一定の円です。`,m`$A=\pi$、長さ方向は $[0,2]$。`),
 q("disk-value",m`$0\le x\le2$、$0\le y\le1$ の $x$ 軸回転の体積は？`,m`$2\pi$。`,m`円柱の体積としても確認できます。`,m`$\pi\int_0^2 1\,dx=2\pi$。底面積 $\pi$、高さ $2$。`)
],[
 q("disk-setup",m`$0\le x\le2$、$0\le y\le\sqrt x$ の $x$ 軸回転の体積の式は？`,m`$\pi\int_0^2x\,dx$。`,m`半径の二乗は $x$。`,m`$A=\pi x$、指定上端は $2$。`),
 q("disk-value",m`$0\le x\le2$、$0\le y\le\sqrt x$ の $x$ 軸回転の体積は？`,m`$2\pi$。`,m`円板の断面積を積分します。`,m`$\pi\left[\dfrac{x^2}{2}\right]_0^2=2\pi$。`)
],"m3-cross-section-volume");

add("washer-volume","円環の断面と回転体","外側の円から内側の円を引こう。",[
 m`$0\le g(x)\le f(x)$ の二曲線の間を $x$ 軸回転すると、断面は外半径 $f(x)$、内半径 $g(x)$ の円環です。連続な両関数に対し $V=\pi\int_a^b(f(x)^2-g(x)^2)\,dx$。`,
 m`断面積は二つの円の面積の差です。帯の長さ $f-g$ を二乗した $\pi(f-g)^2$ ではありません。ここでは回転軸をまたがず、外・内が明確な領域を扱います。`
],m`回転軸から測った外半径と内半径を別々に二乗します。`,[
 ex("外側と内側を別々に測る",q("washer-setup",m`$0\le x\le1$、$x\le y\le1$ を $x$ 軸回転した体積の式は？`,m`$\pi\int_0^1(1-x^2)\,dx$。`,m`外半径 $1$、内半径 $x$。`,m`断面積は $\pi1^2-\pi x^2$。幅 $1-x$ の円を作るのではありません。`)),
 ex("二つの円の面積の差を積分",q("washer-value",m`$0\le x\le1$、$x\le y\le1$ の $x$ 軸回転の体積は？`,m`$\dfrac{2\pi}{3}$。`,m`円環の断面積は $\pi(1-x^2)$。`,m`$\pi\int_0^1(1-x^2)\,dx=\pi\left(1-\dfrac13\right)=\dfrac{2\pi}{3}$。`))
],[s("washer-setup","二乗の差",m`外半径 $R$、内半径 $r$、$R\ge r\ge0$ の円環は、外円から内円を除いたものです。`,m`A=\pi(R^2-r^2)`,m`$R=2$、$r=1$ の断面積は？`,m`$3\pi$。$\pi(2-1)^2=\pi$ ではありません。`),
 s("shifted-setup","軸からの距離を作り直す",m`回転軸が $y=2$、領域が $0\le y\le x$、$0\le x\le1$ なら、軸は領域より上です。遠い境界 $y=0$ までの距離が外半径、近い境界 $y=x$ までが内半径です。`,m`R=2,\quad r=2-x,\quad A=\pi(4-(2-x)^2)`,m`この領域を $y=3$ のまわりに回す体積の式は？`,m`外半径 $3$、内半径 $3-x$。$\pi\int_0^1(9-(3-x)^2)\,dx$。区間全体で $0\le3-x\le3$ です。`),
 s("shifted-value","距離の二乗差を展開する",m`ずらした軸から外内の距離を測り、二つの円の面積の差を積分します。$y=2$ の例では外半径 $2$、内半径 $2-x$ です。`,m`V=\pi\int_0^1(4-(2-x)^2)\,dx=\pi\int_0^1(4x-x^2)\,dx`,m`この積分の値は？`,m`$\pi\left[2x^2-\dfrac{x^3}{3}\right]_0^1=\dfrac{5\pi}{3}$。軸からの距離は区間全体で非負です。`),
 s("washer-value","外内を確認して積分",m`区間で外内が入れ替わらず、半径が連続で非負なら、円環の面積を積分できます。`,m`V=\pi\int_a^b(R^2-r^2)\,dx`,m`$[0,1]$ で外半径 $2x$、内半径 $x$ なら？`,m`$\pi\int_0^1(4x^2-x^2)\,dx=\pi$。`)],[
 q("washer-setup",m`外半径 $3$、内半径 $1$ の円環の断面積を式で表しなさい。`,m`$\pi(3^2-1^2)=8\pi$。`,m`それぞれの円を先に求めます。`,m`$9\pi-\pi=8\pi$。`),
 q("washer-value",m`$\int_0^1(1-x^2)\,dx$ は？`,m`$\dfrac23$。`,m`各項を積分します。`,m`$1-\dfrac13=\dfrac23$。`)
],[
 q("washer-setup",m`$0\le x\le1$、$x\le y\le2x$ の $x$ 軸回転の体積の式は？`,m`$\pi\int_0^1((2x)^2-x^2)\,dx$。`,m`外半径は $2x$、内半径は $x$。`,m`断面積は $3\pi x^2$。`),
 q("washer-value",m`$0\le x\le1$、$x\le y\le2x$ の $x$ 軸回転の体積は？`,m`$\pi$。`,m`二乗の差は $3x^2$。`,m`$3\pi\int_0^1x^2\,dx=\pi$。`)
],[
 q("washer-setup",m`$0\le x\le1$、$x^2\le y\le x$ の $x$ 軸回転の体積の式は？`,m`$\pi\int_0^1(x^2-x^4)\,dx$。`,m`$[0,1]$ では $x\ge x^2\ge0$。`,m`外半径 $x$、内半径 $x^2$ を二乗します。`),
 q("washer-value",m`$0\le x\le1$、$x^2\le y\le x$ の $x$ 軸回転の体積は？`,m`$\dfrac{2\pi}{15}$。`,m`外内の二乗の差を積分します。`,m`$\pi\left[\dfrac{x^3}{3}-\dfrac{x^5}{5}\right]_0^1=\pi\left(\dfrac13-\dfrac15\right)=\dfrac{2\pi}{15}$。`),
 q("washer-setup",m`$0\le x\le2$、$1\le y\le2$ の $x$ 軸回転の体積の式は？`,m`$\pi\int_0^2(4-1)\,dx$。`,m`両半径は一定です。`,m`外半径 $2$、内半径 $1$。`),
 q("washer-value",m`$0\le x\le2$、$1\le y\le2$ の $x$ 軸回転の体積は？`,m`$6\pi$。`,m`断面積一定の筒です。`,m`$3\pi\cdot2=6\pi$。`),
 q("shifted-setup",m`$0\le x\le1$、$0\le y\le x$ を $y=2$ のまわりに回す体積の式は？`,m`$\pi\int_0^1(4-(2-x)^2)\,dx$。`,m`半径は座標でなく軸からの距離です。`,m`外半径は $2-0=2$、内半径は $2-x$。`),
 q("shifted-value",m`$0\le x\le1$、$0\le y\le x$ を $y=2$ のまわりに回す体積は？`,m`$\dfrac{5\pi}{3}$。`,m`外半径 $2$、内半径 $2-x$。`,m`$\pi\int_0^1(4-(2-x)^2)\,dx=\pi\int_0^1(4x-x^2)\,dx=\dfrac{5\pi}{3}$。`)
],[
 q("washer-setup",m`$0\le x\le1$、$x\le y\le\sqrt x$ の $x$ 軸回転の体積の式は？`,m`$\pi\int_0^1(x-x^2)\,dx$。`,m`外半径 $\sqrt x$、内半径 $x$。`,m`$[0,1]$ で $\sqrt x\ge x$。二乗の差を使います。`),
 q("washer-value",m`$0\le x\le1$、$x\le y\le\sqrt x$ の $x$ 軸回転の体積は？`,m`$\dfrac\pi6$。`,m`断面積は $\pi(x-x^2)$。`,m`$\pi\left(\dfrac12-\dfrac13\right)=\dfrac\pi6$。`),
 q("shifted-setup",m`$0\le x\le1$、$0\le y\le x$ を $y=3$ のまわりに回す体積の式は？`,m`$\pi\int_0^1(9-(3-x)^2)\,dx$。`,m`軸は領域の上にあります。各境界までの距離を測ります。`,m`外半径は $3-0=3$、内半径は $3-x$。二乗差に円周率と厚みを掛けます。`),
 q("shifted-value",m`$0\le x\le1$、$0\le y\le x$ を $y=3$ のまわりに回す体積は？`,m`$\dfrac{8\pi}{3}$。`,m`外半径 $3$、内半径 $3-x$ を別々に二乗します。`,m`$\pi\int_0^1(9-(3-x)^2)\,dx=\pi\int_0^1(6x-x^2)\,dx=\pi\left(3-\dfrac13\right)=\dfrac{8\pi}{3}$。`)
],"m3-disk-volume");

add("rotation-direction","回転軸と積分方向","軸に垂直に切り、半径を選んだ変数で表そう。",[
 m`$y$ 軸回転を円板で考えるなら、横に切ります。$0\le x\le p(y)$ の断面の半径は $p(y)$、厚みは $dy$。連続な $p\ge0$ に対し体積は $\pi\int_c^dp(y)^2\,dy$ です。`,
 m`$y=x^2$ から半径を求めるときは $x=\sqrt y$ と読み直します。積分区間も $y$ の値で表します。回転軸を変えると、同じ平面図形でも断面の形が変わります。`
],m`円板・円環は回転軸に垂直な断面です。軸に合わせて切る方向を決めます。`,[
 ex("縦軸からの距離を半径にする",q("rotation-setup",m`$0\le y\le1$、$0\le x\le\sqrt y$ を $y$ 軸回転した体積の式は？`,m`$\pi\int_0^1y\,dy$。`,m`横に切り、半径を $y$ で表します。`,m`$r=\sqrt y$、$A=\pi y$、厚みは $dy$。`)),
 ex("縦の範囲を積分する",q("rotation-value",m`$0\le y\le1$、$0\le x\le\sqrt y$ の $y$ 軸回転の体積は？`,m`$\dfrac\pi2$。`,m`断面積 $\pi y$ を積分します。`,m`$\pi\left[\dfrac{y^2}{2}\right]_0^1=\dfrac\pi2$。`))
],[s("rotation-setup","横に切る円板",m`縦軸回転では軸からの横の距離を半径とし、縦の変数で積み重ねます。`,m`V=\pi\int_c^d p(y)^2\,dy`,m`$0\le y\le2$、$0\le x\le y$ を $y$ 軸回転すると？`,m`半径 $y$、体積の式は $\pi\int_0^2y^2\,dy$。`),
 s("vertical-washer-setup","横断面にある穴を引く",m`縦軸回転を横に切ると、$y\le x\le1$、$0\le y\le1$ では外半径 $1$、内半径 $y$ の円環です。厚みは $dy$ です。`,m`A(y)=\pi(1-y^2),\quad V=\pi\int_0^1(1-y^2)\,dy`,m`右の境界が $x=2$ なら体積の式は？`,m`外半径 $2$、内半径 $y$ より $\pi\int_0^1(4-y^2)\,dy$。区間全体で外半径が内半径以上です。`),
 s("vertical-washer-value","円環を縦に積み重ねる",m`連続で非負の外半径 $R(y)$、内半径 $r(y)$ が $R\ge r$ を満たす区間で、二乗差に円周率と厚みを掛けます。`,m`V=\pi\int_c^d(R(y)^2-r(y)^2)\,dy`,m`$0\le y\le1$、$y\le x\le1$ を縦軸回転した体積は？`,m`$\pi\int_0^1(1-y^2)\,dy=\pi\left[y-\dfrac{y^3}{3}\right]_0^1=\dfrac{2\pi}{3}$。`),
 s("rotation-value","縦の端に代入する",m`半径・厚み・両端が縦の変数でそろっていることを確かめて計算します。`,m`\pi\int_0^2y^2\,dy=\frac{8\pi}{3}`,m`$0\le y\le1$、半径 $2y$ の体積は？`,m`$\pi\int_0^1(2y)^2\,dy=\dfrac{4\pi}{3}$。`)],[
 q("rotation-setup",m`$y=x^2$、$x\ge0$ を $x$ について解くと？`,m`$x=\sqrt y$（$y\ge0$）。`,m`条件 $x\ge0$ に合う方を選びます。`,m`$x\ge0$ なので負の平方根は取りません。`),
 q("rotation-value",m`$\int_0^1y\,dy$ は？`,m`$\dfrac12$。`,m`変数 $y$ について積分します。`,m`$\left[\dfrac{y^2}{2}\right]_0^1=\dfrac12$。`)
],[
 q("rotation-setup",m`$0\le y\le2$、$0\le x\le y$ の $y$ 軸回転の体積の式は？`,m`$\pi\int_0^2y^2\,dy$。`,m`横の距離 $y$ が半径です。`,m`断面積は $\pi y^2$、縦の範囲は $[0,2]$。`),
 q("rotation-value",m`$0\le y\le2$、$0\le x\le y$ の $y$ 軸回転の体積は？`,m`$\dfrac{8\pi}{3}$。`,m`円板を縦に積み重ねます。`,m`$\pi\int_0^2y^2\,dy=\dfrac{8\pi}{3}$。`)
],[
 q("rotation-setup",m`$0\le y\le1$、$0\le x\le2y$ の $y$ 軸回転の体積の式は？`,m`$\pi\int_0^1 4y^2\,dy$。`,m`半径の係数も二乗します。`,m`$r=2y$、$A=4\pi y^2$。`),
 q("rotation-value",m`$0\le y\le1$、$0\le x\le2y$ の $y$ 軸回転の体積は？`,m`$\dfrac{4\pi}{3}$。`,m`縦の区間で断面積を積分します。`,m`$4\pi\int_0^1y^2\,dy=\dfrac{4\pi}{3}$。`),
 q("vertical-washer-setup",m`$0\le y\le1$、$y\le x\le1$ の $y$ 軸回転の体積の式は？`,m`$\pi\int_0^1(1-y^2)\,dy$。`,m`今回は横断面に穴があります。`,m`外半径 $1$、内半径 $y$、厚みは $dy$。`),
 q("vertical-washer-value",m`$0\le y\le1$、$y\le x\le1$ の $y$ 軸回転の体積は？`,m`$\dfrac{2\pi}{3}$。`,m`円環の断面積を使います。`,m`$\pi\int_0^1(1-y^2)\,dy=\dfrac{2\pi}{3}$。`),
 q("rotation-setup",m`$0\le x\le1$、$x^2\le y\le1$ を $y$ 軸回転します。横に切った体積の式は？`,m`$\pi\int_0^1 y\,dy$。`,m`固定した $y$ での $x$ の範囲を解きます。`,m`$0\le y\le1$ で $0\le x\le\sqrt y$。半径の二乗は $y$。`),
 q("rotation-value",m`$0\le y\le2$、$0\le x\le1$ の $y$ 軸回転の体積は？`,m`$2\pi$。`,m`円柱としても確かめられます。`,m`$\pi\int_0^2 1\,dy=2\pi$。`)
],[
 q("rotation-setup",m`$0\le y\le2$、$0\le x\le\sqrt y$ の $y$ 軸回転の体積の式は？`,m`$\pi\int_0^2 y\,dy$。`,m`半径を二乗し、縦の端を使います。`,m`$A=\pi(\sqrt y)^2=\pi y$。`),
 q("rotation-value",m`$0\le y\le2$、$0\le x\le\sqrt y$ の $y$ 軸回転の体積は？`,m`$2\pi$。`,m`断面積は $\pi y$。`,m`$\pi\left[\dfrac{y^2}{2}\right]_0^2=2\pi$。`),
 q("vertical-washer-setup",m`$0\le y\le1$、$y\le x\le2$ の $y$ 軸回転の体積の式は？`,m`$\pi\int_0^1(4-y^2)\,dy$。`,m`横断面の外半径と内半径を分けます。`,m`外半径 $2$、内半径 $y$、厚み $dy$ なので断面積は $\pi(4-y^2)$。`),
 q("vertical-washer-value",m`$0\le y\le1$、$y\le x\le2$ の $y$ 軸回転の体積は？`,m`$\dfrac{11\pi}{3}$。`,m`円環の断面積 $\pi(4-y^2)$ を積分します。`,m`$\pi\left[4y-\dfrac{y^3}{3}\right]_0^1=\pi\left(4-\dfrac13\right)=\dfrac{11\pi}{3}$。`)
],"m3-washer-volume");

add("graph-length","曲線の長さと小線分","横と縦の変化を三平方で合わせよう。",[
 m`曲線を短い線分で近似すると、一片の長さは $\sqrt{(\Delta x)^2+(\Delta y)^2}$。$\Delta y$ はおよそ $f'(x)\Delta x$ なので、一片はおよそ $\sqrt{1+f'(x)^2}\Delta x$ です。`,
 m`$f$ が $[a,b]$ で連続微分可能なら、グラフの長さは $L=\int_a^b\sqrt{1+f'(x)^2}\,dx$。積分するのは高さ $f(x)$ ではありません。導関数の二乗を根号内の $1$ に足します。`
],m`一片の長さを三平方で作り、微分可能性と区間を確認します。`,[
 ex("直線で公式を確かめる",q("length-setup",m`$y=\dfrac34x$、$0\le x\le4$ の長さの積分を立てなさい。`,m`$\int_0^4\sqrt{1+\left(\dfrac34\right)^2}\,dx$。`,m`傾きが縦の変化の割合です。`,m`$f'=\dfrac34$。一片の長さは $\dfrac54dx$、区間の幅は $4$。`)),
 ex("円弧の長さを積分する",q("length-value",m`$y=\sqrt{1-x^2}$、$0\le x\le\dfrac12$ の長さは？`,m`$\dfrac\pi6$。`,m`この区間では導関数が連続です。根号を整理してから置換します。`,m`$f'=-\dfrac{x}{\sqrt{1-x^2}}$ より長さは $\int_0^{\frac12}\dfrac1{\sqrt{1-x^2}}\,dx$。$x=\sin t$、$t:0\to\dfrac\pi6$、$\cos t>0$ なので積分は $\int_0^{\frac\pi6}1\,dt=\dfrac\pi6$。`))
],[s("length-setup","高さでなく導関数",m`連続微分可能なグラフで、横の変化と縦の変化を三平方で合成します。`,m`L=\int_a^b\sqrt{1+f'(x)^2}\,dx`,m`$y=2x$、$[0,1]$ の式は？`,m`$\int_0^1\sqrt{1+2^2}\,dx$。$f'$ を二乗します。`),
 s("length-value","根号を整理して計算",m`導関数から長さの積分を作り、正の平方根として整理します。`,m`\int_0^1\sqrt5\,dx=\sqrt5`,m`$y=\sqrt{1-x^2}$、$0\le x\le\dfrac12$ の計算は？`,m`$\int_0^{\frac12}\dfrac1{\sqrt{1-x^2}}\,dx$。$x=\sin t$、$0\le t\le\dfrac\pi6$ では $\sqrt{1-\sin^2t}=\cos t>0$、$dx=\cos t\,dt$。答えは $\dfrac\pi6$。`)],[
 q("length-setup",m`横に $4$、縦に $3$ 動く線分の長さを表す式は？`,m`$\sqrt{4^2+3^2}$。`,m`横と縦は直角です。`,m`二乗して足し、正の平方根を取ります。`),
 q("length-value",m`$\sqrt{1+\left(\dfrac34\right)^2}$ は？`,m`$\dfrac54$。`,m`根号の中を通分します。`,m`$\sqrt{\dfrac{25}{16}}=\dfrac54$。`)
],[
 q("length-setup",m`$y=2x$、$0\le x\le1$ の長さの積分は？`,m`$\int_0^1\sqrt{1+2^2}\,dx$。`,m`一定の導関数を入れます。`,m`$f'=2$、微小長さは $\sqrt5\,dx$。`),
 q("length-value",m`$y=\dfrac34x$、$0\le x\le4$ の長さは？`,m`$5$。`,m`根号は一定です。`,m`$\int_0^4\dfrac54\,dx=5$。両端の距離 $\sqrt{4^2+3^2}=5$ と一致します。`)
],[
 q("length-setup",m`$y=x^2$、$0\le x\le1$ の長さの積分を立てなさい。計算は不要です。`,m`$\int_0^1\sqrt{1+4x^2}\,dx$。`,m`先に微分します。`,m`$f'=2x$ なので $1+(2x)^2=1+4x^2$。`),
 q("length-value",m`$y=2x$、$0\le x\le1$ の長さは？`,m`$\sqrt5$。`,m`導関数は一定です。`,m`$\int_0^1\sqrt{1+4}\,dx=\sqrt5$。`),
 q("length-setup",m`$y=\dfrac23x^{\frac32}$、$0\le x\le1$ の長さの積分は？`,m`$\int_0^1\sqrt{1+x}\,dx$。`,m`導関数を求めて二乗します。`,m`$f'=\sqrt x$ はこの区間で連続。$1+f'^2=1+x$。`),
 q("length-value",m`$y=\dfrac23x^{\frac32}$、$0\le x\le1$ の長さは？`,m`$\dfrac23(2\sqrt2-1)$。`,m`導関数の二乗を使って根号を簡単にします。`,m`$f'=\sqrt x$、$L=\int_0^1\sqrt{1+x}\,dx=\left[\dfrac23(1+x)^{\frac32}\right]_0^1$。`),
 q("length-setup",m`$y=-x$、$0\le x\le2$ の長さの積分は？`,m`$\int_0^2\sqrt{1+(-1)^2}\,dx$。`,m`下降する曲線でも長さは正です。`,m`$f'=-1$ を二乗するため負号は消えます。`),
 q("length-value",m`$y=-x$、$0\le x\le2$ の長さは？`,m`$2\sqrt2$。`,m`負の傾きでも微小長さは正です。`,m`$\int_0^2\sqrt2\,dx=2\sqrt2$。`)
],[
 q("length-setup",m`$y=x^3$、$0\le x\le1$ の長さの積分は？計算は不要です。`,m`$\int_0^1\sqrt{1+9x^4}\,dx$。`,m`導関数全体を二乗します。`,m`$f'=3x^2$ より $f'^2=9x^4$。`),
 q("length-value",m`$y=\sqrt{1-x^2}$、$0\le x\le\dfrac{\sqrt3}{2}$ の長さは？`,m`$\dfrac\pi3$。`,m`区間は $x=1$ に達せず、導関数は連続です。`,m`$L=\int_0^{\frac{\sqrt3}{2}}\dfrac1{\sqrt{1-x^2}}\,dx$。$x=\sin t$、$t:0\to\dfrac\pi3$、$\cos t>0$ なので $\int_0^{\frac\pi3}1\,dt=\dfrac\pi3$。`)
],"m3-definite-substitution");

add("parametric-length","媒介変数と曲線の長さ","二つの座標の変化から速さを作ろう。",[
 m`$x=x(t)$、$y=y(t)$ が連続微分可能なら、小線分の長さはおよそ $\sqrt{x'(t)^2+y'(t)^2}\Delta t$。たどった長さは $\int_\alpha^\beta\sqrt{x'(t)^2+y'(t)^2}\,dt$ です。`,
 m`同じ部分を往復すれば、その分も重ねて数えます。図形そのものの長さを求めるときは、その曲線を一度だけたどる範囲かを確認します。ここでは線分や円弧を一度たどる例を使います。`
],m`両方の座標を微分し、二乗和の平方根と媒介変数の範囲をそろえます。`,[
 ex("円の速さは一定",q("param-speed",m`$x=\cos t$、$y=\sin t$、$0\le t\le\dfrac\pi2$ の速さを求め、長さの積分を立てなさい。`,m`速さは $1$、$L=\int_0^{\frac\pi2}1\,dt$。`,m`二つの座標の導関数を二乗して足します。`,m`$x'=-\sin t$、$y'=\cos t$。$\sqrt{\sin^2t+\cos^2t}=1$。四分円を一度たどります。`)),
 ex("速さを範囲全体で積分",q("param-length",m`$x=\cos t$、$y=\sin t$、$0\le t\le\dfrac\pi2$ の曲線の長さは？`,m`$\dfrac\pi2$。`,m`速さと範囲を確認します。`,m`速さは $1$。$L=\int_0^{\frac\pi2}1\,dt=\dfrac\pi2$。単位円周の四分の一です。`))
],[s("param-speed","座標の微分の二乗和",m`座標が連続微分可能な曲線で、微小な横・縦の変化を三平方で合成します。`,m`v=\sqrt{x'(t)^2+y'(t)^2}`,m`$x=3t$、$y=4t$ の速さは？`,m`$\sqrt{3^2+4^2}=5$。`),
 s("param-length","一度たどる範囲を確認",m`連続微分可能な表示で、速さを媒介変数の区間全体で積分します。重複してたどった部分は重複して数えるので、図形の長さでは一度だけたどる範囲を使います。`,m`L=\int_\alpha^\beta v(t)\,dt`,m`$x=2\cos t$、$y=2\sin t$、$0\le t\le\pi$ の長さは？`,m`速さ $2$ の半円なので $\int_0^\pi2\,dt=2\pi$。`)],[
 q("param-speed",m`$x=\cos t$、$y=\sin t$ をそれぞれ微分すると？`,m`$x'=-\sin t$、$y'=\cos t$。`,m`正弦・余弦の微分を使います。`,m`余弦の微分の負号を残します。`),
 q("param-length",m`$\int_0^{\frac\pi2}1\,dt$ は？`,m`$\dfrac\pi2$。`,m`一定の速さに時間幅を掛けます。`,m`$[t]_0^{\frac\pi2}=\dfrac\pi2$。`)
],[
 q("param-speed",m`$x=2\cos t$、$y=2\sin t$、$0\le t\le\pi$ の速さと長さの積分は？`,m`速さ $2$、$\int_0^\pi2\,dt$。`,m`係数も二乗します。`,m`$\sqrt{4\sin^2t+4\cos^2t}=2$。半円を一度たどります。`),
 q("param-length",m`$x=2\cos t$、$y=2\sin t$、$0\le t\le\pi$ の長さは？`,m`$2\pi$。`,m`半円の速さは一定です。`,m`$L=\int_0^\pi2\,dt=2\pi$。`)
],[
 q("param-speed",m`$x=3t$、$y=4t$、$0\le t\le1$ の速さと長さの積分は？`,m`速さ $5$、$\int_0^1 5\,dt$。`,m`一定の二つの変化率を合わせます。`,m`$x'=3$、$y'=4$、速さ $\sqrt{9+16}=5$。`),
 q("param-length",m`$x=3t$、$y=4t$、$0\le t\le1$ の長さは？`,m`$5$。`,m`線分を一方向にたどります。`,m`$\int_0^1 5\,dt=5$。両端の距離とも一致します。`),
 q("param-speed",m`$x=t$、$y=t^2$、$0\le t\le1$ の速さと長さの積分は？計算は不要です。`,m`速さ $\sqrt{1+4t^2}$、$\int_0^1\sqrt{1+4t^2}\,dt$。`,m`両座標を同じ変数で微分します。`,m`$x'=1$、$y'=2t$。$x$ が増加し一度だけたどります。`),
 q("param-length",m`$x=3\cos t$、$y=3\sin t$、$0\le t\le\dfrac\pi2$ の長さは？`,m`$\dfrac{3\pi}{2}$。`,m`半径 $3$ の四分円です。`,m`速さ $\sqrt{9\sin^2t+9\cos^2t}=3$。$\int_0^{\frac\pi2}3\,dt=\dfrac{3\pi}{2}$。`),
 q("param-speed",m`$x=1-t$、$y=2t$、$0\le t\le1$ の速さと長さの積分は？`,m`速さ $\sqrt5$、$\int_0^1\sqrt5\,dt$。`,m`横の変化率が負でも二乗します。`,m`$x'=-1$、$y'=2$ より $\sqrt{1+4}=\sqrt5$。`),
 q("param-length",m`$x=1-t$、$y=2t$、$0\le t\le1$ の長さは？`,m`$\sqrt5$。`,m`一定の速さを積分します。`,m`$\int_0^1\sqrt5\,dt=\sqrt5$。`)
],[
 q("param-speed",m`$x=3\cos t$、$y=3\sin t$、$0\le t\le\pi$ の速さと長さの積分は？`,m`速さ $3$、$\int_0^\pi3\,dt$。`,m`三角関数の二乗和を使います。`,m`$\sqrt{9\sin^2t+9\cos^2t}=3$。半円を一度たどります。`),
 q("param-length",m`$x=\cos t$、$y=\sin t$、$0\le t\le\pi$ の長さは？`,m`$\pi$。`,m`単位半円を一度たどります。`,m`速さ $1$ より $\int_0^\pi1\,dt=\pi$。`)
],"m3-graph-length");

add("parametric-area","媒介変数と面積の向き","横の幅を媒介変数に直そう。",[
 m`$x=x(t)$、$y=y(t)\ge0$ が連続微分可能で、曲線を一度だけ右向きにたどるとき、軸との面積は $\int y\,dx=\int_\alpha^\beta y(t)x'(t)\,dt$。横の幅を $dx=x'(t)\,dt$ に直しています。`,
 m`左向きにたどる場合は $x$ が減少します。この積分は負になるので、軸との面積はその負号を反転します。ここでは横の座標が単調で、同じ領域を重複せず、曲線が軸以上にある場合を扱います。`
],m`横の座標がどちらへ動くか、軸との位置関係、媒介変数の両端を先に確認します。`,[
 ex("横の幅を置き換える",q("param-area-direction",m`$x=t^2$、$y=t$、$0\le t\le1$ の曲線と軸の間の面積を表す積分を立てなさい。`,m`$\int_0^1 2t^2\,dt$。`,m`右へ進み、曲線は軸以上です。`,m`$dx=2t\,dt$。高さ $t$ に横の幅 $2t\,dt$ を掛けます。$x:0\to1$。`)),
 ex("左へ進む円弧",q("param-area-value",m`$x=\cos t$、$y=\sin t$、$0\le t\le\dfrac\pi2$ の曲線と両座標軸で囲む面積は？`,m`$\dfrac\pi4$。`,m`上半分の第一象限を右から左へたどります。`,m`$dx=-\sin t\,dt$。正の面積は $-\int_0^{\frac\pi2}\sin t(-\sin t)\,dt=\int_0^{\frac\pi2}\sin^2t\,dt=\left[\dfrac t2-\dfrac{\sin2t}{4}\right]_0^{\frac\pi2}=\dfrac\pi4$。`))
],[s("param-area-direction","進む向きと横の幅",m`軸以上の単純な曲線で横座標が単調に動くとき、右向きなら $y x'$ を、左向きなら $-y x'$ を積分して正の面積を作ります。`,m`dx=x'(t)\,dt`,m`$x=1-t$、$y=t$、$0\le t\le1$ の軸との面積の式は？`,m`$-\int_0^1t(-1)\,dt=\int_0^1t\,dt$。左向きで $y\ge0$ なので符号を反転します。`),
 s("param-area-value","向きを確認した積分を計算",m`範囲・非負の高さ・単調な横移動を確認し、面積が正になる向きで計算します。`,m`\int_0^1t\cdot2t\,dt=\frac23`,m`$x=\cos t$、$y=\sin t$、$0\le t\le\dfrac\pi2$ の面積は？`,m`左向きなので $\int_0^{\frac\pi2}\sin^2t\,dt=\int_0^{\frac\pi2}\dfrac{1-\cos2t}{2}\,dt=\dfrac\pi4$。`)],[
 q("param-area-direction",m`$x=t^2$、$0\le t\le1$ で $dx$ を $dt$ で表しなさい。`,m`$dx=2t\,dt$。`,m`横の座標を微分します。`,m`$\dfrac{dx}{dt}=2t$。`),
 q("param-area-value",m`$\int_0^1 2t^2\,dt$ は？`,m`$\dfrac23$。`,m`べきの公式で積分します。`,m`$\left[\dfrac23t^3\right]_0^1=\dfrac23$。`)
],[
 q("param-area-direction",m`$x=1-t$、$y=t$、$0\le t\le1$ の曲線と軸の間の面積の積分は？`,m`$-\int_0^1t(-1)\,dt$。`,m`横は減少、縦は非負です。`,m`$dx=-dt$。左向きの積分を反転して面積にします。`),
 q("param-area-value",m`$x=t^2$、$y=t$、$0\le t\le1$ の曲線と軸の間の面積は？`,m`$\dfrac23$。`,m`右向きなので $y\,dx$ をそのまま積分します。`,m`$dx=2t\,dt$ より $\int_0^1 2t^2\,dt=\dfrac23$。`)
],[
 q("param-area-direction",m`$x=\cos t$、$y=\sin t$、$0\le t\le\dfrac\pi2$ の軸との面積の積分は？`,m`$-\int_0^{\frac\pi2}\sin t(-\sin t)\,dt$。`,m`横座標は $1$ から $0$ へ減少します。`,m`$dx=-\sin t\,dt$。左向きなので負号を反転します。`),
 q("param-area-value",m`$x=1-t$、$y=t$、$0\le t\le1$ の曲線と軸の間の面積は？`,m`$\dfrac12$。`,m`左向きの積分を面積に直します。`,m`$-\int_0^1t(-1)\,dt=\int_0^1t\,dt=\dfrac12$。`),
 q("param-area-direction",m`$x=2t$、$y=t^2$、$0\le t\le1$ の曲線と軸の間の面積の式は？`,m`$\int_0^1 2t^2\,dt$。`,m`横の幅は $dt$ そのものではありません。`,m`$dx=2dt$、右へ一度進み、$y\ge0$ です。`),
 q("param-area-value",m`$x=2t$、$y=t^2$、$0\le t\le1$ の曲線と軸の間の面積は？`,m`$\dfrac23$。`,m`横の変化率 $2$ を掛けます。`,m`$\int_0^1 t^2\cdot2\,dt=\dfrac23$。`),
 q("param-area-direction",m`$x=1-t^2$、$y=t$、$0\le t\le1$ の曲線と軸の間の面積の式は？`,m`$-\int_0^1t(-2t)\,dt$。`,m`横は単調減少します。`,m`$dx=-2t\,dt$、$y=t\ge0$。左向きの符号を反転します。`),
 q("param-area-value",m`$x=2\cos t$、$y=2\sin t$、$0\le t\le\dfrac\pi2$ の曲線と両軸で囲む面積は？`,m`$\pi$。`,m`半径 $2$ の四分円を左へたどります。`,m`$-\int_0^{\frac\pi2}(2\sin t)(-2\sin t)\,dt=4\cdot\dfrac\pi4=\pi$。`)
],[
 q("param-area-direction",m`$x=t^3$、$y=t$、$0\le t\le1$ の曲線と軸の間の面積の式は？`,m`$\int_0^1 3t^3\,dt$。`,m`右向きの横の幅を微分で表します。`,m`$dx=3t^2\,dt$、高さ $t$。`),
 q("param-area-value",m`$x=1-t^2$、$y=t$、$0\le t\le1$ の曲線と軸の間の面積は？`,m`$\dfrac23$。`,m`左へ進むので符号を反転します。`,m`$-\int_0^1t(-2t)\,dt=\dfrac23$。`)
],"m3-parametric-length");

add("displacement-distance","変位と道のり","速度の符号を見て、進んだ長さを足そう。",[
 m`直線上の位置を $s(t)$、連続な速度を $v(t)=s'(t)$ とすると、時刻 $a$ から $b$ の変位は $s(b)-s(a)=\int_a^bv(t)\,dt$。位置の増減なので負にもなります。`,
 m`道のりは進んだ長さの合計で、速さ $|v(t)|$ を積分した $\int_a^b|v(t)|\,dt$ です。速度がゼロになる時刻と前後の符号を調べ、折り返すところで分割します。`,
 m`この教材では時刻の単位を秒、速度をメートル毎秒、位置・変位・道のりをメートルとします。初めの位置が必要なのは最終位置を求めるときです。`
],m`変位には符号付きの速度、道のりには非負の速さを使います。`,[
 ex("折り返す運動の変位",q("displacement",m`$v(t)=t-1$、$0\le t\le2$ の変位は？`,m`$0$ メートル。`,m`位置の差なので符号付きで積分します。`,m`$\int_0^2(t-1)\,dt=\left[\dfrac{t^2}{2}-t\right]_0^2=0$。初めの位置に戻ります。`)),
 ex("戻っても道のりは消えない",q("distance",m`$v(t)=t-1$、$0\le t\le2$ の道のりは？`,m`$1$ メートル。`,m`$t=1$ で負から正へ変わります。`,m`$-\int_0^1(t-1)\,dt+\int_1^2(t-1)\,dt=\dfrac12+\dfrac12=1$。`))
],[s("displacement","位置の変化を積分する",m`連続な速度は位置の導関数です。変位は速度の符号を保って積分します。`,m`s(b)-s(a)=\int_a^bv(t)\,dt`,m`$v=-2$ で $0$ 秒から $3$ 秒まで動く変位は？`,m`$-6$ メートル。$\int_0^3(-2)\,dt=-6$。`),
 s("distance","折り返しで分けて足す",m`道のりは連続な速度の絶対値を積分します。指定時間全体の符号を調べ、負の区間では速度を反転します。`,m`D=\int_a^b|v(t)|\,dt`,m`$v=t-1$、$0\le t\le3$ の道のりは？`,m`$-\int_0^1(t-1)\,dt+\int_1^3(t-1)\,dt=\dfrac12+2=\dfrac52$ メートル。`)],[
 q("displacement",m`初めの位置が $3$、終わりの位置が $1$ メートルなら変位は？`,m`$-2$ メートル。`,m`終わりから初めを引きます。`,m`$1-3=-2$。`),
 q("distance",m`速度が $-2$ メートル毎秒のとき速さは？`,m`$2$ メートル毎秒。`,m`速さは速度の絶対値です。`,m`$|-2|=2$。`)
],[
 q("displacement",m`$v(t)=t-1$、$0\le t\le3$ の変位は？`,m`$\dfrac32$ メートル。`,m`速度をそのまま積分します。`,m`$\left[\dfrac{t^2}{2}-t\right]_0^3=\dfrac92-3=\dfrac32$。`),
 q("distance",m`$v(t)=t-1$、$0\le t\le3$ の道のりは？`,m`$\dfrac52$ メートル。`,m`折り返し時刻 $1$ で分けます。`,m`$-\int_0^1(t-1)\,dt+\int_1^3(t-1)\,dt=\dfrac12+2=\dfrac52$。`)
],[
 q("displacement",m`$v(t)=-2$、$0\le t\le3$ の変位は？`,m`$-6$ メートル。`,m`負の向きに進み続けます。`,m`$\int_0^3(-2)\,dt=-6$。`),
 q("distance",m`$v(t)=-2$、$0\le t\le3$ の道のりは？`,m`$6$ メートル。`,m`速さは一定 $2$ です。`,m`$\int_0^3 2\,dt=6$。`),
 q("displacement",m`$v(t)=2t$、$0\le t\le2$ の変位は？`,m`$4$ メートル。`,m`速度の原始関数を使います。`,m`$\int_0^2 2t\,dt=[t^2]_0^2=4$。`),
 q("distance",m`$v(t)=2t$、$0\le t\le2$ の道のりは？`,m`$4$ メートル。`,m`この区間では速度が非負です。`,m`$|v|=2t$ なので $\int_0^2 2t\,dt=4$。折り返しはありません。`),
 q("displacement",m`$v(t)=2-t$、$0\le t\le4$ の変位は？`,m`$0$ メートル。`,m`速度の符号を保ちます。`,m`$\left[2t-\dfrac{t^2}{2}\right]_0^4=8-8=0$。`),
 q("distance",m`$v(t)=2-t$、$0\le t\le4$ の道のりは？`,m`$4$ メートル。`,m`$t=2$ で正から負へ変わります。`,m`$\int_0^2(2-t)\,dt-\int_2^4(2-t)\,dt=2+2=4$。`)
],[
 q("displacement",m`$v(t)=1-t$、$0\le t\le3$ の変位は？`,m`$-\dfrac32$ メートル。`,m`終わりの位置の差を求めます。`,m`$\left[t-\dfrac{t^2}{2}\right]_0^3=3-\dfrac92=-\dfrac32$。`),
 q("distance",m`$v(t)=1-t$、$0\le t\le3$ の道のりは？`,m`$\dfrac52$ メートル。`,m`時刻 $1$ の前後で符号が変わります。`,m`$\int_0^1(1-t)\,dt-\int_1^3(1-t)\,dt=\dfrac12+2=\dfrac52$。`)
],"m3-signed-area");

// Keep chapter checks after every source lesson; select by mathematical decision.
export const math3ApplicationCheckSelection=[
 ["signed-area","practice-3","review-1"],["signed-area","practice-4","review-2"],
 ["between-curves","practice-3","review-1"],["between-curves","practice-4","review-2"],
 ["area-splitting","practice-1","review-1"],["area-splitting","practice-2","review-2"],
 ["horizontal-area","practice-1","review-1"],["horizontal-area","practice-2","review-2"],
 ["cross-section-volume","practice-1","review-1"],["cross-section-volume","practice-4","review-2"],
 ["disk-volume","practice-3","review-1"],["disk-volume","practice-4","review-2"],
 ["washer-volume","practice-5","review-3"],["washer-volume","practice-2","review-2"],
 ["rotation-direction","practice-5","review-1"],["rotation-direction","practice-4","review-4"],
 ["graph-length","practice-1","review-1"],["graph-length","practice-4","review-2"],
 ["parametric-length","practice-3","review-1"],["parametric-length","practice-2","review-2"],
 ["parametric-area","practice-5","review-1"],["parametric-area","practice-6","review-2"],
 ["displacement-distance","practice-5","review-1"],["displacement-distance","practice-6","review-2"],
 ["washer-volume","practice-1","review-1"],["washer-volume","practice-6","review-4"],
 ["rotation-direction","practice-6","review-2"],["rotation-direction","practice-3","review-3"]
] as const;
function picked(slug:string,key:string):Q{
 const a=math3Chapter8Exercises.find(e=>e.id==="m3-"+slug+"-"+key+"-v1");
 if(!a)throw new Error("Missing application question: "+slug+" "+key);
 return {family:slug+"-"+a.family,prompt:a.prompt,answer:a.answer,hint:a.hints[0],working:a.steps[0].text};
}
const supplements=math3Chapter8Lessons.flatMap(l=>l.supplements.map(a=>({...a,id:l.slug.slice(3)+"-"+a.id})));
add("integral-applications-check","積分の応用の総確認","一片の量から積分を組み立てよう。",[
 m`面積なら帯の長さ、体積なら断面積、曲線の長さなら小線分、道のりなら速さを考えます。図形や運動の範囲を決め、一片の量を積分します。`,
 m`上下・左右・回転軸・進む向きを確かめます。求めた量が面積・体積・長さなら非負か、変位なら向きと合う符号かを確認します。`
],m`式を立てる問題では、式とその根拠を示します。計算する問題では、区間と条件を保って最後まで求めます。`,[
 ex("指定区間の面積を組み立てる",picked("area-splitting","practice-1")),
 ex("円環の体積を求める",picked("washer-volume","practice-2"))
],supplements,[picked("horizontal-area","ready-1"),picked("disk-volume","ready-1")],[picked("area-splitting","guided-1"),picked("washer-volume","guided-2")],
 math3ApplicationCheckSelection.map(([slug,p])=>picked(slug,p)),math3ApplicationCheckSelection.map(([slug,,r])=>picked(slug,r)),"m3-displacement-distance");
