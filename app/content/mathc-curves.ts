import {C,S,m,q,nums,finish} from "./mathc-authoring";
const chapter="媒介変数と極座標",sec=["媒介変数","極座標と曲線"];
function eliminate(n:number,restricted=false){
 return restricted?q(m`$x=t^2,y=t+${n}$、$t\geqq0$ のとき、点 $(x,y)$ の軌跡を条件付きの式で表しなさい。`,m`$x=(y-${n})^2$、$y\geqq${n}$。`,"文字を消した後も、元の実数の範囲を残します。",m`$t=y-${n}$ より $x=(y-${n})^2$。$t\geqq0$ は $y\geqq${n}$。逆にこの条件を満たす点には $t=y-${n}\geqq0$ が対応します。`):
 q(m`$x=t+${n},y=2t-1$、$t\in\mathbb R$ のとき、媒介変数を消去し、軌跡を求めなさい。`,m`直線 $y=2x-${2*n+1}$ 全体。`,"一つの式から動かしている実数を表し、もう一つへ代入します。",m`$t=x-${n}$ なので $y=2(x-${n})-1=2x-${2*n+1}$。$t$ がすべての実数を動くと $x$ もすべての実数を動きます。`);
}
function trigCurve(n:number,half=false){
 return q(m`$x=${n}\cos t,y=2\sin t$、$${half?m`0\leqq t\leqq\pi`:m`0\leqq t<2\pi`}$ の軌跡と、$t=0$ からの進む向きを答えなさい。`,m`$\frac{x^2}{${n*n}}+\frac{y^2}4=1$ の${half?m`$y\geqq0$ の部分`:"全体"}。$(${n},0)$ から上側へ、反時計回りに進みます。`,"正弦と余弦を二乗して足します。範囲と動く順も確認します。",m`$\left(\frac x{${n}}\right)^2+\left(\frac y2\right)^2=\cos^2t+\sin^2t=1$。`+(half?m`この範囲では $\sin t\geqq0$ なので $y\geqq0$。`:"一周分の角度を動くので全体を通ります。")+m`$t=0$ で $(${n},0)$、$t=\frac\pi2$ で $(0,2)$。`);
}
function polar(n:number,inverse=false){
 return inverse?q(m`直交座標 $(-${n},0)$ を、$r\geqq0,0\leqq\theta<2\pi$ の極座標で表しなさい。`,m`$(r,\theta)=(${n},\pi)$。`,"原点からの距離と、正の横軸からの角度に分けます。",m`距離は $r=${n}$。負の横軸上なので $\theta=\pi$。$r\cos\theta=-${n},r\sin\theta=0$ と確かめられます。`):
 q(m`極座標 $(r,\theta)=\left(${2*n},\frac\pi3\right)$ を直交座標で表しなさい。`,m`$(x,y)=(${n},${n}\sqrt3)$。`,"横は余弦、縦は正弦を掛けます。",m`$x=${2*n}\cos\frac\pi3=${n}$、$y=${2*n}\sin\frac\pi3=${n}\sqrt3$。`);
}
function polarEquation(n:number,circle=false){
 return circle?q(m`$r\geqq0$ とします。極方程式 $r=${2*n}\cos\theta$ の表す曲線を直交座標の式で表し、原点が含まれるか答えなさい。`,m`$(x-${n})^2+y^2=${n*n}$。原点も含まれます。`,"両辺に距離を掛け、二乗の和と横座標に置き換えます。零で割らないようにします。",m`$r^2=${2*n}r\cos\theta$ より $x^2+y^2=${2*n}x$。原点以外では $r>0$ なので逆に割って元へ戻せます。原点も $r=0,\theta=\frac\pi2$ で元の式を満たします。`):
 q(m`極方程式 $r\cos\theta=${n}$ を直交座標で表し、その図形を答えなさい。ただし $r\geqq0$。`,m`直線 $x=${n}$。`,"距離と余弦の積は横座標です。",m`$x=r\cos\theta$ より $x=${n}$。直線上の任意の点に距離と偏角を対応させれば、元の式を満たします。`);
}
export const curveBanks=[
 C(chapter,"parametric-elimination","媒介変数の消去と範囲","一つの数を動かして決まる二つの座標を、直接結びます。",[m`$x=f(t),y=g(t)$ のように、共通の実数 $t$ を使って曲線を表すことを媒介変数表示といいます。$t$ は点を動かすための数です。`,m`$t$ を消した方程式だけでは余分な点が入ることがあります。元の範囲から座標の範囲を求め、逆にその点へ戻る $t$ があるか確かめます。`],"消去した式と、必要な範囲を一緒に書きます。",[S("line","一次式から消去する","片方から変数を解きます。",nums.map(n=>eliminate(n))),S("range","範囲を残す","二乗で失った符号を元の条件から戻します。",nums.map(n=>eliminate(n,true)))],sec[0]),
 C(chapter,"parametric-ellipse","円・楕円の媒介変数表示","角度を動かして、曲線上の点を順にたどります。",[m`$x=a\cos t,y=b\sin t$、$a,b>0$ は $\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$ を満たします。$a=b$ なら円です。`,m`同じ方程式でも $t$ の範囲で描く部分が変わります。座標が同じ場所に戻ることと、その間の進む向きも読み取りましょう。`],"方程式、範囲、進む向きを分けて確かめます。",[S("whole","一周する範囲","正弦と余弦が一周することを使います。",nums.map(n=>trigCurve(n))),S("half","半周する範囲","正弦の符号から上下を決めます。",nums.map(n=>trigCurve(n,true)))],sec[0]),
 C(chapter,"polar-coordinates","極座標と直交座標","距離と角度の表し方を、横と縦の表し方へ変えます。",[m`極座標 $(r,\theta)$ は、原点からの距離 $r\geqq0$ と、正の横軸からの角度 $\theta$ です。$x=r\cos\theta,y=r\sin\theta$。`,m`逆は $r=\sqrt{x^2+y^2}$ と、二つの符号に合う角度で求めます。原点では角度を一つに決められず、どの角度でも同じ点を表します。`],"この教材では距離を非負として扱います。角度の範囲が指定されていれば従います。",[S("cartesian","横と縦へ直す","距離に余弦・正弦を掛けます。",nums.map(n=>polar(n))),S("polar","距離と角度へ直す","軸上の向きも確かめます。",nums.map(n=>polar(n,true)))],sec[1]),
 C(chapter,"polar-equation","極方程式で表す直線と円","距離と角度の式を、座標の関係へ読み替えます。",[m`$r\cos\theta=x,r\sin\theta=y,r^2=x^2+y^2$ を使います。`,m`式を変形するときに $r$ で割ると、原点を落とす可能性があります。まず掛け算で変換し、原点とそれ以外に分けて同じ図形か確かめます。`],"変換した後は、元の条件へ戻れるかも調べます。",[S("line","横座標を読む","余弦との積を横座標へ置き換えます。",nums.map(n=>polarEquation(n))),S("circle","円の式へ直す","距離を掛け、平方完成します。",nums.map(n=>polarEquation(n,true)))],sec[1])
];
export const curveChapter=finish(chapter,"curves",curveBanks,sec);
