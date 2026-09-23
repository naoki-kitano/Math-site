import {quadraticTopic as topic,m,w,num,poly,value,vertexForm,signed,squarePrep,substitutionPrep,coordinatePrep,boundaryPrep} from "./math1-quadratic-authoring";
import {addPair,type Worked} from "./math1-topic";
const evalAt=(a:number,b:number,c:number,x:number):Worked=>w(m`$f(x)=${poly(a,b,c)}$ のとき $f(${num(x)})$ を求めなさい。`,m`$f(${num(x)})=${num(value(a,b,c,x))}$。`,m`すべての $x$ を $${num(x)}$ に置き換えます。関数名 $f$ を掛ける意味ではありません。`,m`$f(${num(x)})=${num(a)}\cdot(${num(x)})^2+(${num(b)})\cdot(${num(x)})+(${num(c)})=${num(value(a,b,c,x))}$。`);
const combine=(a:number,b:number,c:number,u:number,v:number):Worked=>w(m`$f(x)=${poly(a,b,c)}$ のとき $f(${u})+f(${v})$ を求めなさい。`,m`$${num(value(a,b,c,u)+value(a,b,c,v))}$。`,m`$f(${u})$ と $f(${v})$ を別々に計算してから足します。`,m`$f(${u})=${num(value(a,b,c,u))}$、$f(${v})=${num(value(a,b,c,v))}$。したがって和は $${num(value(a,b,c,u)+value(a,b,c,v))}$。入力を先に足した $f(${u+v})$ を求める問題ではありません。`);
export const functionValues=topic("m1-function-values","関数値と代入",[
 m`ある範囲の $x$ の値を一つ決めると、それに対応する $y$ の値がただ一つ決まるとき、$y$ は $x$ の関数といいます。$y=f(x)$ の $f$ は、その対応に付けた名前です。`,
 m`$f(x)=x^2-2x+3$ なら、$f(-1)$ は入力を $-1$ にしたときの値です。$f(-1)=(-1)^2-2(-1)+3=6$。$f(-1)$ は $f$ と $-1$ の掛け算ではありません。`,
 m`同じ入力には一つの出力が必要ですが、違う入力の出力が同じでも構いません。$y=x^2$ では $x=2$ と $x=-2$ のどちらにも $y=4$ が対応します。`,
 m`$f(1)+f(2)$ は二つの出力を足した数です。一般に $f(1+2)$ とは違います。例えば $f(x)=x^2$ なら前者は $5$、後者は $9$ です。`,
],"入力する数と、計算して得られる関数値を区別します。",[
 {id:"evaluate",title:"すべての文字へ同じ数を代入",why:"負数は括弧に入れ、二乗と一次の項を別々に計算します。",sample:evalAt(1,-2,3,-1),items:[evalAt(1,2,-1,-2),evalAt(1,-3,2,2),evalAt(-1,2,3,-1),evalAt(2,-1,0,0),evalAt(1,0,-2,-3),evalAt(2,0,1,0.5),evalAt(-2,1,4,1),evalAt(1,-1,0,-2)]},
 {id:"combine-values",title:"二つの関数値を計算してから足す",why:"括弧の数はそれぞれの入力です。出力同士の計算を後にします。",sample:combine(1,0,0,1,2),items:[combine(1,1,0,-1,2),combine(1,0,1,0,2),combine(-1,0,2,-1,1),combine(2,0,-1,1,2),combine(1,-1,0,0,3),combine(1,2,1,-2,0)]},
],[squarePrep,substitutionPrep]);
addPair(functionValues,"function-uniqueness","同じ入力の出力が一つか", "違う入力が同じ出力になることは認められます。同じ入力の出力が複数あることとは区別します。",[
 w(m`入力が $1,2,3$ の三つで、出力がそれぞれ $4,4,9$ の対応は関数ですか。`,"関数です。それぞれの入力の出力は一つに決まっています。","同じ出力が重なっていることではなく、入力ごとの出力の個数を見ます。",m`入力 $1$ と $2$ の出力が同じでも、どちらの入力にも出力は一つだけです。`),
 w(m`入力 $1$ に出力 $2$ と $3$ の両方を対応させる規則は、そのままで関数ですか。`,"関数ではありません。同じ入力の出力が一つに決まりません。","一つの入力だけに注目して、出力が何通りあるか見ます。",m`入力 $1$ に二つの出力があるので、関数の条件を満たしません。`),
]);

const membership=(a:number,b:number,c:number,x:number,y:number):Worked=>w(m`点 $(${x},${y})$ が $y=${poly(a,b,c)}$ のグラフ上にあるか、式で確かめなさい。`,value(a,b,c,x)===y?"グラフ上にあります。":"グラフ上にありません。",m`横座標 $${x}$ を右辺へ入れ、縦座標 $${y}$ と一致するか比べます。`,m`右辺は $${num(a)}\cdot(${x})^2+(${num(b)})\cdot(${x})+(${num(c)})=${num(value(a,b,c,x))}$。縦座標 $${y}$ と${value(a,b,c,x)===y?"一致する":"一致しない"}ので、${value(a,b,c,x)===y?"グラフ上にあります":"グラフ上にありません"}。`);
const ordinate=(a:number,b:number,c:number,x:number):Worked=>w(m`$y=${poly(a,b,c)}$ のグラフ上で、横座標が $${x}$ の点の座標を求めなさい。`,m`$(${x},${num(value(a,b,c,x))})$。`,"横座標を式へ代入し、得られた縦座標と組にします。",m`$x=${x}$ を代入すると $y=${num(value(a,b,c,x))}$。答えは値だけでなく点の座標です。`);
export const graphPoints=topic("m1-graph-points","座標とグラフ上の点",[
 m`点 $(a,b)$ は、横座標が $a$、縦座標が $b$ の点です。横に $a$、縦に $b$ の位置をとります。`,
 m`関数 $y=f(x)$ のグラフは、対応する入力と出力を組にした点 $(x,f(x))$ の集まりです。入力に許される範囲を定義域といいます。点 $(a,b)$ がグラフ上にあるかは、$a$ が定義域に入り、$b=f(a)$ かを確かめます。`,
 m`例えば $y=x^2+1$ では $x=2$ のとき $y=5$。点 $(2,5)$ はグラフ上ですが、$(2,4)$ はグラフ上ではありません。見た目ではなく代入で判断できます。`,
],"横座標を代入し、グラフが決める縦座標と比べます。",[
 {id:"point-membership",title:"点の二つの座標を式へ戻す",why:"横だけでなく、対応する縦の値まで一致することが必要です。",sample:membership(1,0,1,2,5),items:[membership(1,0,1,2,4),membership(1,-1,0,-1,2),membership(-1,0,3,1,2),membership(2,0,-1,0,1),membership(1,1,1,-2,3),membership(1,0,0,3,-3),membership(1,-2,0,2,0),membership(-1,0,1,-2,3)]},
 {id:"find-ordinate",title:"関数値から点を決める",why:"計算した値を縦座標にし、横、縦の順に答えます。",sample:ordinate(1,0,-1,-2),items:[ordinate(1,1,0,2),ordinate(-1,0,3,-1),ordinate(2,-1,1,0),ordinate(1,0,0,-3),ordinate(1,-2,1,3),ordinate(-2,0,1,2)]},
],[coordinatePrep,substitutionPrep]);
addPair(graphPoints,"point-domain","式の一致と定義域を両方確認", "式が一致しても、横座標が指定された定義域に入っていなければ、そのグラフ上の点ではありません。",[
 w(m`$y=x^2$（$0\le x\le2$）のグラフ上に点 $(-1,1)$ はありますか。`,m`ありません。$1=(-1)^2$ ですが、横座標 $-1$ が定義域に入りません。`,"まず横座標が指定範囲に入るかを調べます。",m`グラフは $0\le x\le2$ の点だけを集めています。式の一致だけでは不十分です。`),
 w(m`$y=x^2+1$（$-1\le x<2$）のグラフ上に点 $(2,5)$ はありますか。`,m`ありません。$5=2^2+1$ ですが、横座標 $2$ は定義域に含まれません。`,"右端の不等号に等号があるか見ます。",m`定義域の条件 $x<2$ を満たさないので、式が一致してもグラフ上にはありません。`),
]);

function finiteRange(inputs:number[],outputs:number[]):Worked{
 const rows=inputs.map((x,i)=>m`$x=${x}$ の出力は $${outputs[i]}$`).join("、");
 return w(`入力を ${inputs.map(x=>`$${x}$`).join("、")} だけに限り、${rows} とします。定義域と値域を、要素を書き並べて表しなさい。`,m`定義域は $\{${inputs.join(",")}\}$、値域は $\{${[...new Set(outputs)].sort((a,b)=>a-b).join(",")}\}$。`,"入力を集めた集合と、実際の出力を集めた集合を分けます。", "指定した入力だけを使います。出力の同じ値は重ねて書きません。入力の間の数を勝手に追加しません。");
}
function affineRange(a:number,b:number,l:number,r:number,closed=true):Worked{
 const p=a*l+b,q=a*r+b,min=Math.min(p,q),max=Math.max(p,q);
 const domain=m`${l}\le x${closed?"\\le":"<"}${r}`;
 const range=a>0?m`${min}\le y${closed?"\\le":"<"}${max}`:m`${min}${closed?"\\le":"<"} y\le${max}`;
 return w(m`$y=${poly(0,a,b)}$ の定義域が $${domain}$ のとき、値域を求めなさい。`,m`$${range}$。`,m`$x$ が増えると $y$ は${a>0?"増え":"減り"}ます。両端の値と、端を含むかを調べます。`,m`$x=${l}$ に対応する値は $${p}$、$x=${r}$ に対応する値は $${q}$。一次関数はその間の値をすべてとり、${closed?"両端も含む":"右の入力端は除く"}ので $${range}$。`);
}
export const domainRange=topic("m1-domain-range","定義域と値域",[
 m`入力 $x$ がとる値全体を定義域、そこから得られる出力 $y$ がとる値全体を値域といいます。式だけでなく、入力をどこまで認めるかも関数の条件です。`,
 m`入力を $-1,0,1$ だけとする $y=x^2$ では、出力は順に $1,0,1$。定義域は $\{-1,0,1\}$、値域は $\{0,1\}$ です。指定した三つの入力の間を埋めてはいけません。`,
 m`実数の範囲 $0\le x\le2$ で $y=x+1$ を考えるなら、入力は区間のすべての実数です。出力も $1\le y\le3$ のすべての実数をとります。点を数個計算しただけで値域が決まるとは限りません。ここでは一次関数が一方向に増えることを使っています。`,
 m`$0\le x<2$ なら右端を含まないので、$y=x+1$ の値域は $1\le y<3$。近づける値と、実際にとれる値を区別します。`,
],"入力の集合と、実際に得られる出力の集合を分けます。",[
 {id:"finite-range",title:"指定した入力から出力を集める",why:"離れた入力だけの指定では、その点での出力だけを集めます。",sample:finiteRange([-1,0,1],[1,0,1]),items:[finiteRange([0,1,2],[1,2,5]),finiteRange([-2,0,2],[4,0,4]),finiteRange([1,2,3],[2,4,6]),finiteRange([-1,1,3],[3,3,-5]),finiteRange([0,2,4],[1,1,1]),finiteRange([-2,-1,0],[-4,-2,0])]},
 {id:"interval-range",title:"入力の区間を出力の範囲へ",why:"増減と両端の対応を使って、出力の大小順に書きます。",sample:affineRange(2,1,0,2),items:[affineRange(1,-2,-1,3),affineRange(-1,3,0,2),affineRange(2,0,-2,1),affineRange(-2,1,-1,2),affineRange(1,4,-3,0),affineRange(-1,0,-2,2)]},
],[boundaryPrep,substitutionPrep]);
addPair(domainRange,"open-range","含まない入力端と対応する出力端", "増える関数では右の入力端が出力の上端、減る関数では出力の下端に対応します。端の対応を確かめてから不等号を書きます。",[affineRange(1,1,0,2,false),affineRange(-1,2,0,3,false)]);

const basicShape=(a:number):Worked=>w(m`$y=${vertexForm(a,0,0)}$ の頂点・軸・開く向きを答え、$x=1,-1$ での点も求めなさい。`,m`頂点 $(0,0)$、軸 $x=0$。${a>0?"上向きに開く（下に凸）":"下向きに開く（上に凸）"}。点は $(1,${num(a)}),(-1,${num(a)})$。`,"二乗は非負で、正負の入力を入れ替えても値が同じです。係数の符号を見ます。",m`$x=0$ で $y=0$。$x^2\ge0$ より $y${a>0?"\\ge":"\\le"}0$。また $a(-x)^2=ax^2$ なので左右対称です。$x=\pm1$ では $y=${num(a)}$。`);
const width=(a:number,b:number):Worked=>w(m`$y=${vertexForm(a,0,0)}$ と $y=${vertexForm(b,0,0)}$ では、どちらの放物線の開き方が狭いですか。$x=1$ の値を用いて説明しなさい。`,m`$y=${vertexForm(Math.abs(a)>Math.abs(b)?a:b,0,0)}$ の方が狭いです。$x=1$ での値はそれぞれ $${num(a)},${num(b)}$。同じ横座標で $|y|$ が大きい方なので、係数の絶対値が大きい方が狭くなります。`,"係数の符号は開く向き、絶対値は同じ横座標での関数値の絶対値に関わります。",m`$x=1$ のとき $y$ はそれぞれ $${num(a)},${num(b)}$。同じ $|x|$ で $|y|$ が大きい方、すなわち係数の絶対値が大きい方が狭くなります。`);
export const basicParabola=topic("m1-basic-parabola","放物線の基本形",[
 m`$y=ax^2$（$a\ne0$）のグラフを放物線といいます。$x$ と $-x$ の関数値が同じなので、直線 $x=0$ を軸として左右対称です。折り返しの中心の点 $(0,0)$ を頂点といいます。`,
 m`$a>0$ なら $ax^2\ge0$ なので上向きに開き、これを「下に凸」といいます。$a<0$ なら $ax^2\le0$ なので下向きに開き、「上に凸」といいます。頂点は点、軸は直線です。`,
 m`$|a|$ が大きいと、同じ横座標での $|y|$ が大きく、開き方は狭くなります。$a=0$ では $y=0$ という直線になり、二次関数ではありません。`,
],"頂点・軸・開く向きを区別し、対称な点をとります。",[
 {id:"basic-shape",title:"係数の符号と左右対称",why:"平方の非負性から開く向きを決め、対称な二点を確かめます。",sample:basicShape(1),items:[basicShape(2),basicShape(-1),basicShape(0.5),basicShape(-2),basicShape(3),basicShape(-0.5)]},
 {id:"opening-width",title:"係数の絶対値と開き方",why:"符号の大小ではなく、同じ入力での値の絶対値を比べます。",sample:width(1,2),items:[width(1,3),width(-1,-2),width(0.5,1),width(-0.5,-1),width(2,4),width(-3,-1)]},
],[squarePrep,coordinatePrep]);

function shiftRule(a:number,h:number,k:number):Worked{return w(m`$y=${vertexForm(a,0,0)}$ を、$x$ 軸方向へ $${h}$、$y$ 軸方向へ $${k}$ 平行移動したグラフの式と頂点を求めなさい。`,m`$y=${vertexForm(a,h,k)}$、頂点 $(${h},${k})$。`,"移動後の横座標から移動量を引くと、移動前の横座標に戻ります。",m`移動前の点を $(u,v)$、移動後を $(x,y)$ とすると $u=x${signed(-h)},v=y${signed(-k)}$。$v=${a===1?"":a===-1?"-":num(a)}u^2$ に代入すると $y=${vertexForm(a,h,k)}$。頂点 $(0,0)$ も $(${h},${k})$ へ移ります。`);}
const shiftPoint=(x:number,y:number,h:number,k:number):Worked=>w(m`グラフを $x$ 軸方向へ $${h}$、$y$ 軸方向へ $${k}$ 平行移動します。点 $(${x},${y})$ はどこへ移りますか。`,m`$(${x+h},${y+k})$。`,"点の座標には移動量をそのまま足します。式の中の符号とは役割が違います。",m`横座標は $${x}+(${h})=${x+h}$、縦座標は $${y}+(${k})=${y+k}$。`);
export const translation=topic("m1-parabola-translation","平行移動と対応する点",[
 m`点 $(u,v)$ を横に $h$、縦に $k$ 移すと $(u+h,v+k)$ になります。正の横移動は右、負なら左です。正の縦移動は上、負なら下です。`,
 m`$y=x^2$ を右に $2$、上に $1$ 移すと、頂点は $(2,1)$ です。新しい点の横座標を $x$ とすると、元の横座標は $x-2$。元の高さ $(x-2)^2$ に $1$ を足すので、式は $y=(x-2)^2+1$ です。`,
 m`一般に $y=ax^2$（$a\ne0$）を横に $h$、縦に $k$ 移すと $y=a(x-h)^2+k$。頂点は $(h,k)$、軸は $x=h$ です。点の移動では足し、式では元の入力に戻すために引きます。`,
],"点の移動と、移動後の式に現れる符号を結び付けます。",[
 {id:"shift-point",title:"対応する点を移す",why:"横と縦の座標に、それぞれの移動量を足します。",sample:shiftPoint(1,1,2,1),items:[shiftPoint(-1,1,2,1),shiftPoint(0,0,-2,3),shiftPoint(2,4,1,-2),shiftPoint(-2,4,-1,-3),shiftPoint(1,2,0,-2),shiftPoint(0,1,-3,0)]},
 {id:"shift-equation",title:"元の入力へ戻して式を作る",why:"新しい横座標から横移動量を引き、最後に高さを加えます。",sample:shiftRule(1,2,1),items:[shiftRule(1,3,-2),shiftRule(1,-2,1),shiftRule(-1,1,2),shiftRule(2,-1,-3),shiftRule(1,0,3),shiftRule(-2,2,0),shiftRule(0.5,1,-1),shiftRule(-1,-3,2)]},
],[coordinatePrep,substitutionPrep]);
for(const bank of [functionValues,graphPoints,domainRange,basicParabola,translation]){
 bank.lesson.prerequisites=[{slug:"m1-substitution",label:"代入と計算の順序"}];
 bank.exercises.forEach(e=>{e.steps=e.steps.slice(0,1);});
}
export const functionFoundationTopics=[functionValues,graphPoints,domainRange,basicParabola,translation];
for(const [bank,family,key]of [[domainRange,"interval-range","interval-range-2"],[basicParabola,"basic-shape","basic-shape-2"]] as const){
 const e=bank.exercises.find(e=>e.id===`${bank.lesson.slug}-${key}-v1`)!;
 bank.lesson.supplements.find(s=>s.id===family)!.text+="\n"+[e.prompt,e.steps[0].text,e.answer].join("\n");
}
const domainChecks:Worked[]=[
 w(m`$y=x^2$（$0\le x\le2$）のグラフ上に点 $(2,4)$ はありますか。`,m`あります。$2$ は定義域内で、$4=2^2$ も成立します。`,"入力の範囲と式の一致を両方調べます。",m`$0\le2\le2$ かつ $4=2^2$ なので両条件を満たします。`),
 w(m`$y=x^2+1$（$-1\le x<2$）のグラフ上に点 $(1,3)$ はありますか。`,m`ありません。$1$ は定義域内ですが、$1^2+1=2\ne3$ です。`,"入力の条件だけで判断せず、縦座標も照合します。",m`$-1\le1<2$ は成立しますが、式が決める高さと点の縦座標が一致しません。`),
];
domainChecks.forEach(([prompt,answer,hint,working],i)=>graphPoints.exercises.push({id:`m1-graph-points-point-domain-additional-${i+1}-v1`,lesson:graphPoints.lesson.slug,family:"point-domain",repair:"point-domain",kind:"paper",stage:i===0?"practice":"review",prompt,answer,hints:[hint],steps:[{title:"二つの条件を照合",text:working}]}));
graphPoints.lesson.supplements.find(s=>s.id==="point-domain")!.text+="\n"+domainChecks.map(e=>[e[0],e[3],e[1]].join("\n")).join("\n");
