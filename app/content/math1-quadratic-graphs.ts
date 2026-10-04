import {addRepairExamples,quadraticTopic as topic,m,w,num,poly,vertexForm,squarePrep,substitutionPrep,boundaryPrep} from "./math1-quadratic-authoring";
import {complete} from "./math1-completing-square";
import {addPair,type Worked,type Skill} from "./math1-topic";
function vertexRead(a:number,h:number,k:number):Worked{return w(m`$y=${vertexForm(a,h,k)}$ の頂点と軸を答えなさい。`,m`頂点 $(${num(h)},${num(k)})$、軸 $x=${num(h)}$。`,"平方がゼロになる横座標と、そのときの縦座標を読みます。",m`$x=${num(h)}$ のとき平方項がゼロになり $y=${num(k)}$。`);}
export const vertexPrep:Skill={id:"vertex-form-reading",title:"平方の形と頂点",why:"頂点は点、軸はその横座標を通る縦の直線です。",sample:vertexRead(1,2,1),items:[vertexRead(1,-1,2),vertexRead(-1,2,3),vertexRead(2,0,-1)]};
function graph(a:number,h:number,k:number,expanded:boolean):Worked{
 const b=-2*a*h,c=a*h*h+k,form=vertexForm(a,h,k);
 return w(m`$y=${expanded?poly(a,b,c):form}$ のグラフをかきなさい。頂点、軸、開く向きと、頂点以外の二点も示しなさい。`,m`頂点 $(${num(h)},${num(k)})$、軸 $x=${num(h)}$。${a>0?"上向き（下に凸）":"下向き（上に凸）"}に開き、$(${num(h-1)},${num(k+a)})$、$(${num(h+1)},${num(k+a)})$ を通る放物線。`,expanded?"平方完成して頂点と軸を読み、軸から左右同じ距離の二点を計算します。":"頂点の左右で横座標を一ずつ変え、対応する高さを計算します。",(expanded?complete(a,b,c)[3]:"")+m` $y=${form}$ より頂点と軸が分かります。$x=${num(h-1)},${num(h+1)}$ では平方の中が $-1,1$ なので、ともに $y=${num(k+a)}$。頂点で滑らかに折り返し、軸の両側へ対称に続く曲線をかきます。点を直線で結んだ折れ線ではありません。`);
}
export const quadraticGraph=topic("m1-quadratic-graph","二次関数のグラフ",[
 m`二次関数 $y=ax^2+bx+c$（$a\ne0$）を平方完成すると $y=a(x-h)^2+k$ の形になります。頂点 $(h,k)$、軸 $x=h$、係数 $a$ の符号による開く向きを順に調べます。`,
 m`形だけでなく位置を確かめるため、頂点の左右に同じ距離の点を取ります。$y=2(x-1)^2-3$ なら、頂点は $(1,-3)$、$x=0,2$ ではともに $y=-1$ です。`,
 m`グラフはすべての入力と出力の対応を表します。確認した数点だけで終わりではなく、軸に対称な滑らかな放物線として続きます。頂点を尖らせた折れ線にはしません。`,
],"平方完成で位置を決め、対称な点で放物線の形を確かめます。",[
 {id:"graph-vertex-form",title:"頂点と対称な二点からかく",why:"軸から等距離なら平方の値が等しく、同じ高さになります。",sample:graph(2,1,-3,false),items:[graph(1,-2,1,false),graph(-1,1,3,false),graph(2,0,-2,false),graph(0.5,2,-1,false),graph(-2,-1,2,false),graph(1,3,0,false)]},
 {id:"graph-expanded",title:"平方完成を作図へつなぐ",why:"展開された式からは、まず平方の形へ直して頂点を取り出します。",sample:graph(1,-2,1,true),items:[graph(1,1,-2,true),graph(2,-1,-3,true),graph(-1,2,1,true),graph(1,-0.5,0.75,true),graph(-2,1,3,true),graph(1,3,-4,true)]},
],[vertexPrep,squarePrep]);

function determineVertex(h:number,k:number,x:number,a:number):Worked{
 const y=a*(x-h)**2+k;
 return w(m`頂点が $(${h},${k})$ で、点 $(${x},${y})$ を通る二次関数を求めなさい。`,m`$y=${vertexForm(a,h,k)}$。`,"頂点の条件を先に式へ入れ、残った係数を通る点から決めます。",m`$y=a(x${h<0?"+"+(-h):h>0?"-"+h:""})^2+(${k})$ と置きます。通る点から $${y}=a\cdot${(x-h)**2}+(${k})$。よって $a=\frac{${y-k}}{${(x-h)**2}}=${num(a)}\ne0$。頂点と点の条件を両方満たします。`);
}
function determineAxis(h:number,a:number,k:number):Worked{
 const y0=a+k,y1=4*a+k;
 return w(m`軸が $x=${h}$ で、点 $(${h+1},${y0})$、$(${h+2},${y1})$ を通る二次関数を求めなさい。`,m`$y=${vertexForm(a,h,k)}$。`,"軸から括弧の中を決め、二点を代入した二式の差を取ります。",m`$y=a(x${h<0?"+"+(-h):h>0?"-"+h:""})^2+k$ と置くと $a+k=${y0}$、$4a+k=${y1}$。$4a+k=${y1}$ から $a+k=${y0}$ を引くと、$k$ が消えて $3a=${y1-y0}$。したがって $a=${a}$。これを $a+k=${y0}$ に代入すると $k=${k}$。$a\ne0$ で、二点をともに通ります。`);
}
function determineThree(a:number,b:number,c:number):Worked{
 return w(m`三点 $(-1,${a-b+c})$、$(0,${c})$、$(1,${a+b+c})$ を通る二次関数を求めなさい。`,m`$y=${poly(a,b,c)}$。`,"頂点や軸の情報がないので、一般形に三点を代入します。まず横座標ゼロの点を使います。",m`$y=ax^2+bx+c$ と置くと、まず $c=${c}$。残る二点から $a-b=${a-b}$、$a+b=${a+b}$。足して $2a=${2*a}$ より $a=${a}\ne0$。これを $a+b=${a+b}$ に代入して $b=${b}$。三点へ代入して元の高さに戻ることを確かめます。`);
}
export const determineQuadratic=topic("m1-determine-quadratic","条件から求める二次関数",[
 m`与えられた条件が式に入りやすい形を選びます。頂点 $(h,k)$ が分かるなら $y=a(x-h)^2+k$、軸だけなら $y=a(x-h)^2+k$ の $k$ も未知数とします。`,
 m`頂点や軸が分からず三点を通るなら $y=ax^2+bx+c$ と置きます。点 $(s,t)$ を通る条件は $t=as^2+bs+c$ です。各点の横座標を $x$、縦座標を $y$ に代入して三つの等式を作ります。`,
 m`求めた係数が二次関数の条件 $a\ne0$ を満たすか、与えられたすべての点を通るかを最後に確かめます。条件が少なければ一つに決まらない場合もあります。`,
],"条件に合う式の形を選び、点の座標を代入して係数を決めます。",[
 {id:"vertex-and-point",title:"頂点を先に式へ入れる",why:"頂点で二つの位置が決まるので、残る係数一つを点から求めます。",sample:determineVertex(1,-2,2,3),items:[determineVertex(-1,2,0,2),determineVertex(2,1,0,1),determineVertex(1,3,3,-1),determineVertex(0,-1,2,0.5),determineVertex(-2,-3,-1,4),determineVertex(3,0,1,-2)]},
 {id:"axis-and-points",title:"軸を使い、二式から係数を決める",why:"同じ定数を含む二式を引くと、一つの係数から決まります。",sample:determineAxis(1,2,-1),items:[determineAxis(-1,1,2),determineAxis(2,-1,3),determineAxis(0,2,-3),determineAxis(1,-2,1),determineAxis(-2,3,0),determineAxis(3,1,-2)]},
 {id:"three-points",title:"三点を一般形へ代入する",why:"各点が同じ式を満たすことを三つの等式で表します。",sample:determineThree(1,2,3),items:[determineThree(2,-1,1),determineThree(-1,3,2),determineThree(1,0,-2),determineThree(3,1,0),determineThree(-2,-1,1),determineThree(1,-2,4)]},
],[vertexPrep,substitutionPrep]);
addPair(determineQuadratic,"insufficient-condition","頂点だけでは開き方が決まらない","頂点自身を通る条件を追加しても新しい情報にはなりません。係数の異なる二つの二次関数が条件を満たせば、一意でないことが分かります。",[
 w(m`頂点 $(1,2)$ をもち、点 $(1,2)$ を通る二次関数は一つに決まりますか。理由を答えなさい。`,m`決まりません。$y=(x-1)^2+2$ と $y=2(x-1)^2+2$ の両方が条件を満たします。`,"通る点が頂点そのものなら、開き方について情報が増えるか考えます。",m`$y=a(x-1)^2+2$ で $a\ne0$ はまだ自由です。点を代入しても $2=2$ となるだけです。`),
 w(m`軸が $x=0$ で点 $(0,1)$ を通る二次関数は一つに決まりますか。理由を答えなさい。`,m`決まりません。$y=x^2+1$ と $y=-x^2+1$ の両方が条件を満たします。`,"軸上の点が決まっても、開く向きや幅が決まるか考えます。",m`$y=ax^2+k$ に点を代入すると $k=1$。$a\ne0$ は決まりません。`),
]);

function globalExtreme(a:number,h:number,k:number,expanded=false):Worked{
 const expression=expanded?poly(a,-2*a*h,a*h*h+k):vertexForm(a,h,k);
 return w(m`定義域を実数全体とする $y=${expression}$ の最大値・最小値と、それをとる $x$ を答えなさい。`,m`$x=${num(h)}$ で${a>0?"最小値":"最大値"} $${num(k)}$。${a>0?"最大値":"最小値"}はありません。`,"平方はゼロ以上です。係数の符号で上から抑えられるか下から抑えられるかを決めます。",(expanded?complete(a,-2*a*h,a*h*h+k)[3]:"")+m` $y=${vertexForm(a,h,k)}$ で平方がゼロになるのは $x=${num(h)}$。それ以外では $y${a>0?">":"<"}${num(k)}$。また $|x-(${num(h)})|$ をいくらでも大きくでき、$y$ は${a>0?"上へ":"下へ"}際限なく変わるので、${a>0?"最大値":"最小値"}はありません。`);
}
export const globalExtrema=topic("m1-parabola-extrema","放物線の最大値・最小値",[
 m`最大値・最小値は、定義域内で実際にとる $y$ の値です。その値をとる $x$ と組で答えます。頂点の座標そのものと、最大値・最小値を混同しないようにします。`,
 m`定義域が実数全体なら、$y=(x-2)^2+1$ は $(x-2)^2\ge0$ より $y\ge1$。$x=2$ で等号が成立するため、最小値は $1$ です。上にはいくらでも大きくなり、最大値はありません。`,
 m`$y=-(x+1)^2+3$ なら平方の係数が負なので $y\le3$。$x=-1$ で最大値 $3$ をとり、最小値はありません。頂点が最大になるか最小になるかは開く向きで決まります。`,
],"平方の符号から値の限界を求め、等号をとる入力も確かめます。",[
 {id:"vertex-extrema",title:"平方の非負性から限界を読む",why:"平方がゼロになるときに、下限または上限の値を実際にとります。",sample:globalExtreme(1,2,1),items:[globalExtreme(2,-1,3),globalExtreme(-1,1,4),globalExtreme(0.5,0,-2),globalExtreme(-2,-2,1),globalExtreme(3,1,0),globalExtreme(-0.5,2,-3)]},
 {id:"complete-extrema",title:"平方完成して値と入力を答える",why:"一般形を平方の形へ直してから、係数の符号と等号条件を使います。",sample:globalExtreme(1,-2,1,true),items:[globalExtreme(1,1,-2,true),globalExtreme(-1,2,5,true),globalExtreme(2,-1,-3,true),globalExtreme(1,-0.5,0.75,true),globalExtreme(-2,1,4,true),globalExtreme(1,-3,2,true)]},
],[vertexPrep,squarePrep]);

export const intervalCases:{a:number;h:number;k:number;l:number;r:number;min:number;max:number;minAt:number[];maxAt:number[]}[]=[];
function interval(a:number,h:number,k:number,l:number,r:number):Worked{
 const f=(x:number)=>a*(x-h)**2+k,candidates=[l,r,...(h>l&&h<r?[h]:[])];
 const min=Math.min(...candidates.map(f)),max=Math.max(...candidates.map(f)),minAt=candidates.filter(x=>f(x)===min),maxAt=candidates.filter(x=>f(x)===max);
 intervalCases.push({a,h,k,l,r,min,max,minAt,maxAt});
 const answer=m`$x=${minAt.map(num).join(",")}$ で最小値 $${num(min)}$、$x=${maxAt.map(num).join(",")}$ で最大値 $${num(max)}$。`;
 return w(m`$y=${vertexForm(a,h,k)}$（$${l}\le x\le${r}$）の最大値・最小値と、それをとる $x$ をすべて求めなさい。`,answer,"頂点の横座標が定義域に入るかを先に調べ、両端の値と、使える場合の頂点の値を比べます。",m`頂点の横座標 $${h}$ は定義域 $${l}\le x\le${r}$ に${h>=l&&h<=r?"含まれます":"含まれません"}。$x=${l}$ では $y=${num(f(l))}$、$x=${r}$ では $y=${num(f(r))}$。${h>=l&&h<=r?m`頂点では $y=${num(k)}$。`:"区間内では軸からの距離が一方向に変わるため、両端を比べれば十分です。"}平方は軸からの距離の二乗なので、${a>0?"近いほど小さく、遠いほど大きい":"近いほど大きく、遠いほど小さい"}値になります。${answer}`);
}
export const intervalExtrema=topic("m1-interval-extrema","区間内の最大値・最小値",[
 m`定義域が指定されたら、頂点をそのまま答えにしてはいけません。頂点の横座標が区間に入っているかを最初に確認します。`,
 m`$y=(x-1)^2$（$0\le x\le3$）なら頂点の $x=1$ は使えます。頂点で $y=0$、両端では $y=1,4$。したがって最小値は $0$（$x=1$）、最大値は $4$（$x=3$）です。`,
 m`同じ式でも $2\le x\le3$ なら頂点は使えません。軸からの距離は $1$ から $2$ に増えるので、最小値は $1$（$x=2$）、最大値は $4$（$x=3$）です。`,
 m`閉区間では両端を含むため、その点の値も候補です。両端が軸から同じ距離なら値も同じです。同じ最大値・最小値をとる入力はすべて答えます。`,
],"頂点の横座標が定義域に入るかを確かめ、両端の値と比べます。",[
 {id:"axis-inside",title:"頂点と両端の値を比べる",why:"平方は軸からの距離の二乗なので、最も近い頂点と最も遠い端点が候補です。",sample:interval(1,1,0,0,3),items:[interval(1,0,1,-1,2),interval(-1,1,3,-1,2),interval(2,-1,0,-2,1),interval(1,1,-2,-1,3),interval(-2,0,4,-2,1),interval(1,2,1,2,4)]},
 {id:"axis-outside",title:"使えない頂点を除いて端点を比べる",why:"軸をまたがない区間では、軸からの距離は一方向に変わります。",sample:interval(1,1,0,2,3),items:[interval(1,2,-1,-1,1),interval(-1,0,3,1,3),interval(2,-1,1,0,2),interval(-2,2,0,-1,0),interval(1,-2,3,0,1),interval(-1,3,2,0,2)]},
],[vertexPrep,boundaryPrep]);
addPair(intervalExtrema,"unattained-endpoint","近づける値と実際にとる値", "端を含まないと、その端に近づけても値そのものをとれない場合があります。実際にその値をとる入力があるかを調べます。",[
 w(m`$y=x^2$（$0<x\le2$）の最大値・最小値を答えなさい。`,m`$x=2$ で最大値 $4$。最小値はありません。`,"ゼロをとる入力が定義域にあるか確認します。",m`$0<y\le4$。$x=0$ は含まれず $y=0$ にはなりません。どの正の入力 $x$ にも、同じ定義域の $\frac x2$ でさらに小さい値 $\frac{x^2}4$ があるため、最小値はありません。`),
 w(m`$y=-x^2$（$0<x\le1$）の最大値・最小値を答えなさい。`,m`$x=1$ で最小値 $-1$。最大値はありません。`,"ゼロが上限でも、その値をとれるとは限りません。",m`$-1\le y<0$。$x=0$ は使えません。どの正の入力 $x$ にも $\frac x2$ でより大きい値 $-\frac{x^2}4$ があるため、最大値はありません。`),
]);
quadraticGraph.lesson.prerequisites=[{slug:"m1-completing-square-coefficient",label:"係数をくくる平方完成"}];
determineQuadratic.lesson.prerequisites=[{slug:"m1-graph-points",label:"座標とグラフ上の点"}];
globalExtrema.lesson.prerequisites=[{slug:"m1-quadratic-graph",label:"二次関数のグラフ"}];
intervalExtrema.lesson.prerequisites=[{slug:"m1-parabola-extrema",label:"放物線の最大値・最小値"},{slug:"m1-domain-range",label:"定義域と値域"}];
export const quadraticGraphTopics=[quadraticGraph,determineQuadratic,globalExtrema,intervalExtrema];
for(const b of quadraticGraphTopics)b.exercises.forEach(e=>{e.steps=e.steps.slice(0,1);});
addRepairExamples(quadraticGraph,"graph-vertex-form",["2"]);
addRepairExamples(quadraticGraph,"graph-expanded",["3","4"]);
addRepairExamples(globalExtrema,"vertex-extrema",["2"]);
addRepairExamples(globalExtrema,"complete-extrema",["2","4"]);
addRepairExamples(intervalExtrema,"axis-inside",["2","4","6"]);
addRepairExamples(intervalExtrema,"axis-outside",["2"]);
