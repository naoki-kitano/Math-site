import type {Exercise} from "./lessons";
import {foundationsFor} from "./foundation-links";
const m=String.raw;
export type ReviewCheck={id:string;title:string;prompt:string;options:string[];correct:number;explanation:string;lesson:string};
const check=(id:string,title:string,prompt:string,options:string[],correct:number,explanation:string,lesson:string):ReviewCheck=>({id,title,prompt,options:options.map(s=>s.replaceAll("\\frac","\\dfrac")),correct,explanation,lesson});
export const reviewChecks:ReviewCheck[]=[
 check("straight-angle","一直線の角",m`一直線の角を二つに分け、一方が $65^\circ$ でした。もう一方はどれですか。`,[m`$25^\circ$`,m`$115^\circ$`,m`$295^\circ$`],1,m`合わせて $180^\circ$ なので $180^\circ-65^\circ=115^\circ$。`,"jr-angles"),
 check("standard-error","平均の標準誤差",m`独立で同じ分布に従う $100$ 個の値を平均します。母標準偏差が $10$ のとき、平均の標準誤差はどれですか。`,["$10$","$1$","$100$"],1,m`平均の標準誤差は $\frac{\sigma}{\sqrt n}=\frac{10}{\sqrt{100}}=1$。個々の値の標準偏差とは違います。`,"mb-sample-mean"),
 check("sign","負の数の計算",m`$3-(-2)$ の値はどれですか。`,["$1$","$5$","$-5$"],1,m`負の数を引くことは、反対の数を足すことです。$3-(-2)=3+2=5$。`,"jr-signed-add"),
 check("power","二乗する範囲",m`$(-3)^2$ と $-3^2$ の値を順に並べたものはどれですか。`,["$9,9$","$-9,-9$","$9,-9$"],2,m`$(-3)^2=(-3)(-3)=9$。$-3^2=-(3\cdot3)=-9$。括弧によって二乗する範囲が違います。`,"jr-order-powers"),
 check("fraction","分数の足し算",m`$\frac12+\frac13$ はどれですか。`,[m`$\frac25$`,m`$\frac56$`,m`$\frac16$`],1,m`分母をそろえます。$\frac36+\frac26=\frac56$。分母同士を足すのではありません。`,"jr-fractions"),
 check("substitution","文字に数を入れる",m`$x=-2$ のとき、$2x+1$ の値はどれですか。`,["$-3$","$-5$","$5$"],0,m`負の数を括弧に入れて代入します。$2(-2)+1=-4+1=-3$。`,"jr-substitution"),
 check("expand","括弧を外す",m`$-2(x-3)$ を展開した式はどれですか。`,["$-2x-3$","$-2x-6$","$-2x+6$"],2,m`括弧の中の両方の項に掛けます。$(-2)x+(-2)(-3)=-2x+6$。`,"jr-like-terms"),
 check("factor","因数分解",m`$x^2+5x+6$ の因数分解はどれですか。`,["$(x+2)(x+3)$","$(x+1)(x+6)$","$(x-2)(x-3)$"],0,m`和が $5$、積が $6$ になる二数は $2,3$。$(x+2)(x+3)=x^2+5x+6$ と掛け戻せます。`,"jr-factorization"),
 check("root","根号が表す値",m`$\sqrt{9}$ の値はどれですか。`,[m`$\pm3$`,"$-3$","$3$"],2,m`$9$ の平方根は $3,-3$ の二つですが、$\sqrt9$ はそのうち非負の $3$ だけを表します。`,"jr-square-roots"),
 check("radical","根号の整理",m`$\sqrt{12}$ を簡単にしたものはどれですか。`,[m`$6$`,m`$2\sqrt3$`,m`$3\sqrt2$`],1,m`$12=4\cdot3$ なので $\sqrt{12}=\sqrt4\sqrt3=2\sqrt3$。足し算に分けることはできません。`,"jr-root-calculation"),
 check("equation","両辺に同じ操作",m`$2x+3=7$ から $2x=4$ にする操作はどれですか。`,["両辺から $3$ を引く","左辺からだけ $3$ を引く","両辺を $3$ で割る"],0,m`両辺に同じ操作をして等しさを保ちます。$2x+3-3=7-3$ です。`,"jr-linear-equation"),
 check("zero","積が零になる条件",m`$x(x-2)=0$ の解をすべて選んだものはどれですか。`,["$x=2$","$x=0$","$x=0,2$"],2,m`$x=0$ または $x-2=0$。両辺を $x$ で割ると、$x=0$ の解を落とします。`,"jr-quadratic-equation"),
 check("point","グラフ上にある点",m`点 $(2,5)$ は直線 $y=2x+1$ 上にありますか。`,[m`ある。$5=2\cdot2+1$ が成り立つから`,"ない。横と縦の座標が違うから","横の座標だけでは確かめられない"],0,m`横の座標 $2$ を入れた値は $5$。点の縦の座標と一致するので、直線上にあります。`,"jr-coordinates"),
 check("slope","傾きの計算",m`横の座標が $2$、縦の座標が $6$ 増えました。二点を結ぶ直線の傾きはどれですか。`,[m`$\frac13$`,"$3$","$4$"],1,m`傾きは縦の増加量を横の増加量で割った値です。$\frac62=3$。`,"jr-linear-function"),
 check("distance","直角三角形の長さ",m`直角を挟む二辺が $3,4$ の三角形で、斜辺 $c$ を求める式はどれですか。`,["$c=3+4$","$c^2=4^2-3^2$","$c^2=3^2+4^2$"],2,m`斜辺は直角の向かいです。$c^2=3^2+4^2=25$、長さなので $c=5$。`,"jr-pythagoras"),
 check("ratio","割合の基準",m`全体 $20$ 個のうち $5$ 個が赤です。赤の割合はどれですか。`,[m`$\frac14$`,m`$4$`,m`$\frac13$`],0,m`基準は全体の $20$ 個です。$\frac5{20}=\frac14$。赤以外の $15$ 個で割るのではありません。`,"jr-ratio-percent"),
 check("probability","同じ確率の結果を数える",m`赤玉 $1$ 個と白玉 $3$ 個から、各玉が同じ確率で一つ選ばれます。赤の確率はどれですか。`,[m`$\frac12$`,m`$\frac14$`,m`$\frac13$`],1,m`玉一個ずつを結果として数えます。全 $4$ 個のうち赤は $1$ 個なので $\frac14$。色が二種類だから半分、とはなりません。`,"jr-probability"),
 check("mean","平均と個数",m`$2,3,7$ の平均値はどれですか。`,["$3$","$12$","$4$"],2,m`合計は $12$、データは $3$ 個。平均値は $\frac{12}{3}=4$。並べたときの中央の値とは区別します。`,"jr-averages"),
 check("sigma","和の記号を読む",m`$\sum_{k=2}^{4}k$ を書き出したものはどれですか。`,["$2+3+4$","$1+2+3+4$","$2+4$"],0,m`添字に下端から上端まで順に入れます。$k=2,3,4$ の三つの項です。`,"mb-sigma"),
 check("partial","部分分数と通分",m`$x\ne0,-1$ のとき、$\frac1x-\frac1{x+1}$ を通分したものはどれですか。`,[m`$\frac1{x(x+1)}$`,m`$\frac{-1}{x(x+1)}$`,m`$\frac1{2x+1}$`],0,m`分子は $(x+1)-x=1$。よって $\frac1{x(x+1)}$。この等式を逆向きに使うのが部分分数分解です。`,"mb-partial-fractions"),
 check("derivative","微分と関数値",m`$f(x)=x^2$ のとき、$f'(3)$ はどれですか。`,["$9$","$6$","$2x$"],1,m`先に $f'(x)=2x$ と微分し、$x=3$ を入れると $6$。元の関数値 $f(3)=9$ とは違います。`,"m3-derivative-meaning"),
 check("chain","内側の微分",m`$(2x+1)^3$ の微分はどれですか。`,["$3(2x+1)^2$","$6(2x+1)^2$","$6x^2$"],1,m`外側の三乗を微分した $3(2x+1)^2$ に、内側 $2x+1$ の微分 $2$ を掛けます。`,"m3-chain-rule"),
 check("integral","積分を微分で確かめる",m`$\int 2x\,dx$ はどれですか。定数を $C$ とします。`,["$2+C$","$2x^2+C$","$x^2+C$"],2,m`$x^2+C$ を微分すると $2x$ に戻ります。不定積分では積分定数を付けます。`,"m3-antiderivative-constant"),
 check("density","確率密度と面積","連続型確率変数の密度曲線で、区間に入る確率を表すものはどれですか。",["曲線の高さ","区間と曲線の下の面積","区間の両端の高さの差"],1,"密度の高さそのものではなく、区間の面積が確率です。全範囲の面積は一になります。","mb-continuous-distribution"),
 check("vector","始点と終点",m`$A(1,2),B(4,6)$ のとき、$\overrightarrow{AB}$ の成分はどれですか。`,["$(3,4)$","$(-3,-4)$","$(5,8)$"],0,m`終点から始点を引きます。$(4-1,6-2)=(3,4)$。逆向きのベクトルとは符号が反対です。`,"mc-vector-components"),
 check("negation","条件の否定",m`実数 $x$ について「$x>2$」の否定はどれですか。`,["$x<2$","$x=2$",m`$x\leqq2$`],2,m`元の条件に入らない値をすべて含めます。$2$ も「$2$ より大きい」には入らないため、等号が必要です。`,"m1-condition-negation"),
 check("trig","辺の比と三角比",m`直角三角形で、鋭角 $\theta$ の向かいの辺が $3$、斜辺が $5$ です。$\sin\theta$ はどれですか。`,[m`$\frac53$`,m`$\frac35$`,"$3$"],1,m`正弦は、向かいの辺を斜辺で割った比です。$\sin\theta=\frac35$。`,"m1-trig-meaning"),
 check("log","対数が使える範囲",m`$\log_2(x-1)$ が実数として定義される条件はどれですか。`,["$x>1$",m`$x\geqq1$`,"$x>0$"],0,m`真数 $x-1$ は正でなければなりません。$x-1>0$ なので $x>1$。真数が零の場合も使えません。`,"logarithm-meaning"),
 check("exponent","負の指数",m`$2^{-3}$ の値はどれですか。`,["$-8$",m`$-\frac18$`,m`$\frac18$`],2,m`負の指数は逆数を表します。$2^{-3}=\frac1{2^3}=\frac18$。数の前に負号を付ける意味ではありません。`,"exponent-extension"),
 check("square","平方完成",m`$x^2+4x$ と等しいものはどれですか。`,["$(x+2)^2$","$(x+2)^2-4$","$(x+4)^2-16$"],1,m`$(x+2)^2=x^2+4x+4$。増えた $4$ を引くと元の式と同じ値になります。`,"m1-completing-square"),
];
const byId=new Map(reviewChecks.map(c=>[c.id,c]));
const byLesson=new Map(reviewChecks.map(c=>[c.lesson,c]));
export const lessonChecks:Record<string,string[]>={
 "rational":["factor","fraction"],"rational-product":["factor","fraction"],"rational-sum":["fraction","expand"],
 "point-distance":["distance"],"section-points":["ratio","point"],"circle-equation":["distance","square"],"circle-completing-square":["square"],
 "m1-quadratic-formula":["root","substitution"],"m1-quadratic-factor-equation":["zero","factor"],"m1-quadratic-graph":["square","point"],
 "m1-completing-square-coefficient":["expand","square"],"m1-interval-extrema":["square","point"],"m1-linear-inequalities":["sign","equation"],
 "m1-set-operations":["negation"],"m1-necessary-sufficient":["negation"],"m1-converse-contrapositive":["negation"],
 "m1-data-variance":["mean","power"],"m1-standard-deviation":["mean","root"],"m1-variance-calculation":["mean","power"],"m1-data-transformation":["substitution","mean"],
 "m1-trig-relations":["trig","root"],"m1-cosine-law-side":["trig","root"],"m1-sine-law":["trig","equation"],
 "ma-probability-count":["probability"],"ma-conditional-probability":["ratio","probability"],"ma-repeated-trials":["probability","power"],
 "ma-area-ratios":["ratio"],"ma-parallel-ratios":["ratio"],"ma-expected-profit":["mean","probability"],
 "mb-sigma":["substitution"],"mb-arithmetic-sum":["sigma"],"mb-geometric-sum":["exponent","sigma"],"mb-telescoping":["partial","sigma"],
 "mb-variance":["mean","power"],"mb-expectation":["probability","mean"],"mb-normal-distribution":["density"],"mb-binomial-normal":["density"],
 "mb-mean-interval":["standard-error"],"mb-proportion-interval":["ratio","root"],
 "mc-vector-sum":["vector","sign"],"mc-vector-scalar":["vector","ratio"],"mc-vector-dot":["vector","substitution"],"mc-vector-angle":["trig","root"],
 "mc-space-dot":["vector","substitution"],"mc-complex-distance":["distance"],"mc-complex-polar":["trig","distance"],
 "mc-conic-shift":["square"],"mc-conic-intersection":["substitution","zero"],
 "m3-function-input":["substitution"],"m3-factorization-limits":["factor"],"m3-rationalizing-limits":["radical","fraction"],
 "m3-telescoping-series":["partial","sigma"],"m3-geometric-series":["exponent","sigma"],
 "m3-derivative-definition":["expand","fraction"],"m3-chain-rule":["derivative","substitution"],"m3-chain-rule-functions":["chain"],
 "m3-product-derivative":["derivative"],"m3-quotient-derivative":["derivative","fraction"],"m3-second-derivative":["derivative"],
 "m3-tangent-at-point":["derivative","slope"],"m3-normal-line":["slope"],"m3-partial-fractions":["partial","integral"],
 "m3-substitution-integrals":["chain","integral"],"m3-reverse-chain-integrals":["chain","integral"],"m3-parts-introduction":["derivative","integral"],
 "m3-definite-substitution":["substitution","chain"],"m3-definite-parts":["integral"],
 "trig-identities":["trig","root"],"trig-equations":["trig"],"trig-unit-circle":["point","trig"],
 "logarithmic-equations":["log","equation"],"logarithm-laws":["log","exponent"],"exponential-equations":["exponent"],
};
// Explicit overrides prevent an algebra check from masquerading as a domain check.
export const familyChecks:Record<string,string[]>={
 "rational:domain":[], "rational:factor":["factor"],"rational:cancel":["factor"],"rational:structure":[],
 "mc-vector-angle:perpendicular":["vector"],"mc-vector-dot:cosine":["trig"],"mc-space-dot:angle":["trig","root"],
 "mc-complex-distance:translate":["vector"],"ma-expected-profit:mean-not-guarantee":[],
 "m3-geometric-series:condition":[],"m3-normal-line:vertical-normal":[],
 "m1-standard-deviation:zero-spread":[],"mb-proportion-interval:size":["root"],
 "mb-geometric-sum:one":["sigma"],
 "m1-set-operations:intersection":[],"m1-set-operations:union":[],
};
export function checksFor(q:Pick<Exercise,"lesson"|"family"|"stage">):ReviewCheck[]{
 if(q.stage==="ready"||q.family.startsWith("prep-"))return [];
 const source=Object.keys(lessonChecks).sort((a,b)=>b.length-a.length).find(slug=>q.lesson===slug||q.family.startsWith(slug+"-"));
 const family=source&&q.family.startsWith(source+"-")?q.family.slice(source.length+1):q.family;
 const key=(source??q.lesson)+":"+family;
 if(Object.hasOwn(familyChecks,key))return familyChecks[key].map(id=>byId.get(id)!);
 // Do not substitute a routine calculation probe for a condition/meaning task.
 if(/condition|existence|applicability|endpoint|unattained|validity|domain|membership|ready|recognition|compare|count|order/.test(family))return [];
 const chosen=source?lessonChecks[source].map(id=>byId.get(id)!):foundationsFor(q).map(slug=>byLesson.get(slug)).filter((x):x is ReviewCheck=>!!x);
 return chosen.filter(c=>c.lesson!==q.lesson).slice(0,2);
}
export function preparationChecks(slug:string):ReviewCheck[]{
 if(slug==="jr-angles")return [byId.get("straight-angle")!];
 const ids=lessonChecks[slug];
 const chosen=ids?ids.map(id=>byId.get(id)!):foundationsFor({lesson:slug,family:"",stage:"practice"}).map(s=>byLesson.get(s)).filter((c):c is ReviewCheck=>!!c);
 return chosen.filter(c=>c.lesson!==slug).slice(0,2);
}
