import {topic,addPair,type Worked,type Skill} from "./math1-topic";
import {prepMultiply} from "./math1-factoring";
const m=String.raw,t=(s:string)=>m`$${s}$`;
const sign=(n:number)=>n<0?String(n):m`+${n}`;
const linear=(a:number,b:number)=>(a===1?"x":a===-1?"-x":m`${a}x`)+(b?sign(b):"");
function gcd(a:number,b:number):number{return b?gcd(b,a%b):a}
const fraction=(n:number,d:number)=>{if(d<0){n=-n;d=-d;}const g=gcd(Math.abs(n),d);return d/g===1?String(n/g):m`${n<0?"-":""}\frac{${Math.abs(n)/g}}{${d/g}}`};
function solve(a:number,b:number,c:number,inclusive:boolean):Worked {
 const rel=inclusive?"\\le":"<",out=a>0?rel:(inclusive?"\\ge":">");
 const answer=m`x${out}${fraction(c-b,a)}`;
 return [t(m`${linear(a,b)}${rel}${c}`)+" を解きなさい。",t(answer)+"。",m`両辺から ${t(String(b))} を引き、${t(String(a))} で割ります。${a<0?"負の数で割るので不等号を反対にします。":"正の数で割るので不等号は変えません。"}`,t(m`${a}x${rel}${c-b}`)+m`。${t(String(a))} で割ると ${t(answer)}。${a<0?"数直線の向きが反転するので不等号も反転します。":"正の数で割っても大小の順序は変わりません。"}`];
}
const endpoints:Worked[]=[
 [m`$x<3$ と $x\le3$ の違いを、端の値について説明しなさい。`,m`前者は $3$ を含まず、後者は $3$ を含みます。`,"等号があるかを確かめます。",m`$3<3$ は偽、$3\le3$ は真です。`],
 [m`$x>2$ の範囲に $2$ は含まれますか。`,"含まれません。",m`$x=2$ を入れます。`,m`$2>2$ は成り立ちません。`],
 [m`$x\ge-1$ の範囲に $-1$ は含まれますか。`,"含まれます。",m`$x=-1$ を入れます。`,m`$-1\ge-1$ は成り立ちます。`],
 [m`$x<4$ の範囲に $4$ は含まれますか。`,"含まれません。",m`$x=4$ を入れます。`,m`$4<4$ は成り立ちません。`],
];
const prepEndpoint:Skill={id:"endpoints",title:"端を含むか確かめる",why:"等号が付いていれば等しい値も許されます。",sample:endpoints[0],items:endpoints.slice(1)};
export const inequalities=topic("m1-linear-inequalities","一次不等式と不等号",[
 m`不等式を解くとは、それを成り立たせる値の範囲を求めることです。方程式のように一つの値だけとは限りません。$x<3$ は $3$ より小さい実数すべて、$x\le3$ は $3$ も含みます。`,
 m`両辺に同じ数を足したり引いたりしても大小は変わりません。正の数で両辺を掛けたり割ったりしても同じです。負の数の場合は不等号の向きが逆になります。例えば $2<5$ でも $-2>-5$ です。`,
 m`数直線で負の数を掛けると原点の反対側へ移り、左右の順序が反転します。だから $-2x<6$ の両辺を $-2$ で割ると $x>-3$ です。単に項を移すことと、負の数で割ることを区別します。`,
],"負の数で掛ける・割るときだけ、不等号の向きを反対にします。",[
 {id:"positive",title:"正の数で割る",why:"同じ数を引き、正の係数で割ると大小の向きは変わりません。",sample:solve(2,1,7,false),items:[[3,2,11],[2,-1,5],[4,3,9],[2,5,2],[3,-2,4],[5,1,12],[2,-3,0]].map((v,i)=>solve(v[0],v[1],v[2],i%2===0))},
 {id:"negative",title:"負の数で割る",why:"負の係数で割ると大小の向きが反転します。端を含むかは等号の有無で決まります。",sample:solve(-2,1,7,false),items:[[-3,2,11],[-2,-1,5],[-4,3,9],[-2,5,2],[-3,-2,4],[-5,1,12],[-2,-3,0]].map((v,i)=>solve(v[0],v[1],v[2],i%2===0))},
],[prepMultiply,prepEndpoint]);

function overlap(a:number,b:number,closed:boolean):Worked {
 const l=closed?"\\le":"<",r="\\le";
 return [t(m`x${closed?"\\ge":">"}${a}`)+" と "+t(m`x\le${b}`)+" を同時に満たす範囲を求めなさい。",t(m`${a}${l} x${r}${b}`)+"。",m`左の条件は ${t(String(a))} より${closed?"右（端を含む）":"右（端を含まない）"}、右の条件は ${t(String(b))} 以下です。`,"両方が重なる部分を取ります。"+t(m`${a}${l} x${r}${b}`)+" はどちらの条件も満たします。"];
}
function empty(a:number,b:number):Worked{return [t(m`x>${a}`)+" と "+t(m`x\le${b}`)+" を同時に満たす実数はありますか。理由も述べなさい。","ありません。解なしです。",m`二つの境界 ${t(String(a))} と ${t(String(b))} の順序を比べます。`,m`${t(m`x>${a}`)} なら ${t(m`x>${b}`)} でもあるので、${t(m`x\le${b}`)} と両立しません。共通範囲はありません。`]}
function system(a:number,b:number):Worked {
 const lower=2*a+1,upper=4-b;
 return [t(m`\begin{cases}2x+1>${lower}\\-x+4\ge${upper}\end{cases}`)+" を解きなさい。",t(m`${a}<x\le${b}`)+"。", "各不等式を別々に解き、最後に共通範囲を取ります。二つ目は負の数で割ります。",m`${t(m`2x>${2*a}`)} より ${t(m`x>${a}`)}。${t(m`-x\ge${-b}`)} より ${t(m`x\le${b}`)}。共通部分は ${t(m`${a}<x\le${b}`)} です。`];
}
export const simultaneous=topic("m1-simultaneous-inequalities","連立不等式と共通範囲",[
 m`連立不等式は、すべての不等式を同時に満たす値を求めます。別々に解いた範囲の「どちらか」ではなく「両方に入る部分」を取ります。`,
 m`$x>1$ と $x\le4$ の共通部分は $1<x\le4$。$1$ は含まず、$4$ は含みます。数直線の二つの範囲を重ねて確かめられます。`,
 m`$x>3$ と $x\le2$ は重ならないので解なしです。境界が同じでも、$x>2$ と $x\le2$ は両立しません。一方 $x\ge2$ と $x\le2$ なら共通部分は $x=2$ だけです。`,
],"各不等式を解いてから、両方を満たす共通範囲を取ります。",[
 {id:"overlap",title:"二つの範囲を重ねる",why:"下限と上限を両方守る範囲だけを選びます。",sample:overlap(1,4,false),items:[overlap(0,3,true),overlap(-2,1,false),overlap(2,5,true),overlap(-3,-1,false),overlap(1,2,true),overlap(-1,4,false),overlap(0,2,true)]},
 {id:"empty",title:"重ならなければ解なし",why:"範囲が離れている場合や、唯一の境界が含まれない場合は共通部分がありません。",sample:empty(3,2),items:[empty(2,1),empty(1,1),empty(0,-2),empty(-1,-1),empty(4,2)]},
 {id:"solve-system",title:"解いてから共通範囲へ",why:"式を解く計算と、二つの範囲の共通部分を選ぶ判断を分けます。",sample:system(1,4),items:[[0,3],[-1,2],[2,5],[-3,0],[1,3],[-2,4],[0,2]].map(v=>system(v[0],v[1]))},
],[prepMultiply,prepEndpoint]);

function budget(price:number,fixed:number,limit:number):Worked {
 const n=Math.floor((limit-fixed)/price);
 return [m`一個 ${t(String(price))} 円の商品を買い、送料が ${t(String(fixed))} 円かかります。合計を ${t(String(limit))} 円以下にするとき、買える個数の最大を求めなさい。商品は一個以上買うものとします。`,t(String(n))+" 個。", "個数を整数として置き、代金と送料の合計を予算以下にします。",m`個数を ${t("x")} とすると ${t(m`x\ge1`)} の整数で、${t(m`${price}x+${fixed}\le${limit}`)}。${t(m`x\le${fraction(limit-fixed,price)}`)} だから最大 ${t(String(n))} 個。${t(String(price*n+fixed))} 円なら予算内、次の ${t(String(n+1))} 個では ${t(String(price*(n+1)+fixed))} 円となり超えます。`];
}
function threshold(points:number,target:number):Worked {
 const n=Math.floor(target/points)+1;
 return [m`一回ごとに ${t(String(points))} 点を得ます。合計が ${t(String(target))} 点を超えるには、最低何回必要ですか。最初の点数はゼロです。`,t(String(n))+" 回。", "「超える」は等号を含まないので、整数の最小を考えます。",m`回数 ${t("x")} は非負整数で ${t(m`${points}x>${target}`)}。${t(m`x>${fraction(target,points)}`)} より最小 ${t(String(n))} 回。${t(String(n-1))} 回の ${t(String(points*(n-1)))} 点では超えず、${t(String(n))} 回の ${t(String(points*n))} 点で超えます。`];
}
const words:Worked[]=[
 [m`「重さが $5$ kg以上」を、重さ $x$ kgの不等式で表しなさい。`,m`$x\ge5$。`,"「以上」はちょうどの値を含みます。",m`$5$ kgも許されるので等号を含めます。`],
 [m`「長さが $3$ m未満」を、長さ $x$ mの不等式で表しなさい。`,m`$0\le x<3$。`,"「未満」は等号を含みません。長さは非負です。",m`$3$ mは含まず、長さの条件 $x\ge0$ も残します。`],
 [m`「所持金が $1000$ 円以下」を、所持金 $x$ 円の不等式で表しなさい。`,m`$0\le x\le1000$。`,"所持金は非負で、「以下」は等号を含みます。",m`$1000$ 円もちょうどの上限として含みます。`],
 [m`「人数が $10$ 人を超える」を、人数 $x$ 人の条件で表しなさい。`,m`$x>10$、$x$ は整数。`,"人数を小数にはしません。",m`$10$ 人ではなく、$11$ 人以上の整数です。`],
];
const prepWords:Skill={id:"words",title:"以上・以下・未満を式にする",why:"言葉が端の値を含むかを確かめ、数量の単位と範囲も保ちます。",sample:words[0],items:words.slice(1)};
export const modeling=topic("m1-inequality-modeling","数量の条件と不等式",[
 m`まず何を文字で表すかと単位を決めます。個数や回数なら整数、長さなら非負という条件も必要です。次に「以下」「以上」「未満」「超える」を不等号に直します。`,
 m`一個 $80$ 円の商品を $x$ 個、送料 $200$ 円で買うなら合計は $80x+200$ 円。$1000$ 円以下という条件は $80x+200\le1000$ です。商品を一個以上買うなら $x\ge1$ の整数です。`,
 m`計算の結果が $x\le7.5$ なら、個数の最大は $7$ 個です。$x>4$ なら整数の最小は $5$。機械的な四捨五入でなく、元の不等号を満たす整数を選びます。最後に求めた個数と、その隣の個数の金額を確かめます。`,
],"数量と単位を決め、整数条件を保ち、元の場面で答えを確かめます。",[
 {id:"budget",title:"予算以内で買える最大個数",why:"品物代と固定費の合計を式にし、不等式の解から許される整数を選びます。",sample:budget(80,200,1000),items:[[120,200,1000],[150,100,1000],[80,150,700],[200,300,1800],[90,100,1000],[130,200,1200],[70,250,900]].map(v=>budget(v[0],v[1],v[2]))},
 {id:"threshold",title:"目標を超える最小回数",why:"「超える」は等号を含みません。境界が整数でも、その次の整数が必要です。",sample:threshold(5,20),items:[[3,12],[4,10],[6,24],[7,42],[5,17],[8,40],[9,50]].map(v=>threshold(v[0],v[1]))},
],[prepWords,prepMultiply]);

for(const e of simultaneous.exercises.filter(e=>e.family==="empty")) {
 e.answer += e.steps[0].text;
 e.steps[e.steps.length-1].text=e.answer;
}
const emptyRepair=simultaneous.lesson.supplements.find(s=>s.id==="empty")!;
emptyRepair.text += "\n"+m`$x>3$ なら $x>2$ なので、$x\le2$ と両立しません。`;
addPair(simultaneous,"singleton","共通部分が一点になるとき","上下の境界が一致し、どちらもその境界を含むときは、その一点だけが解です。",[
 [m`$x\ge2$ と $x\le2$ を同時に満たす範囲を求めなさい。`,m`$x=2$。`,"両方の等号が許す値を確かめます。",m`$2$ より小さい値は前者を、大きい値は後者を満たしません。$x=2$ は両方を満たします。`],
 [m`$x\le-1$ と $x\ge-1$ を同時に満たす範囲を求めなさい。`,m`$x=-1$。`,"境界を両方の条件に代入します。",m`$-1$ だけが上下の条件を同時に満たします。両方に等号があるので、この点は除きません。`],
]);
addPair(simultaneous,"same-direction","同じ向きの条件を重ねる","両方を満たすには、より狭い範囲を選びます。同じ境界では、等号を含まない条件にも従います。",[
 [m`$x>1$ と $x\ge3$ を同時に満たす範囲を求めなさい。`,m`$x\ge3$。`,"一方の範囲が他方に含まれるか確かめます。",m`$x\ge3$ なら必ず $x>1$。$x=3$ も両方を満たすので含みます。`],
 [m`$x\le2$ と $x<2$ を同時に満たす範囲を求めなさい。`,m`$x<2$。`,"等号を含まない方の条件も守る必要があります。",m`$x<2$ なら $x\le2$ も成り立ちます。$x=2$ は二つ目を満たさないので除きます。`],
]);
addPair(inequalities,"both-sides","両辺の文字をまとめる","両辺から同じ文字式を引き、文字の項を一方に集めます。係数で割る段階で不等号の向きを確かめます。",[
 [m`$3x+2<x+8$ を解きなさい。`,m`$x<3$。`,m`両辺から $x$ と $2$ を引きます。`,m`$2x<6$。正の数 $2$ で割るので $x<3$。`],
 [m`$2x+5\le4x-1$ を解きなさい。`,m`$x\ge3$。`,m`両辺から $4x$ と $5$ を引いてみましょう。`,m`$-2x\le-6$。負の数 $-2$ で割るので、不等号を反対にして $x\ge3$。`],
]);
addPair(inequalities,"brackets","括弧を外してから解く","分配法則で括弧を外し、同類項をまとめてから不等式を解きます。",[
 [m`$2(x-1)\le x+3$ を解きなさい。`,m`$x\le5$。`,m`$2$ を括弧の両方の項に掛けます。`,m`$2x-2\le x+3$ より、両辺から $x$ を引いて $x-2\le3$。両辺に $2$ を足して $x\le5$。`],
 [m`$3-2(x+1)>5$ を解きなさい。`,m`$x<-2$。`,"括弧の前の負号も含めて分配します。",m`$3-2x-2>5$、$-2x>4$。負の数 $-2$ で割って $x<-2$。`],
]);
addPair(modeling,"integer-words","人数は整数で表す","人数や個数は整数です。不等号の向きとともに、整数という条件も残します。",[
 [m`「人数が $4$ 人未満」を、人数 $x$ 人の条件で表しなさい。`,m`$0\le x<4$、$x$ は整数。`,"ゼロ人を含め、可能な人数を考えます。",m`人数は $0,1,2,3$。非負整数で、上端 $4$ は含みません。`],
 [m`「人数が $6$ 人以上」を、人数 $x$ 人の条件で表しなさい。`,m`$x\ge6$、$x$ は整数。`,"以上には端の人数を含みます。",m`$6,7,8,\ldots$ 人なので、$x\ge6$ という範囲に整数条件を付けます。`],
]);
const integerWords=modeling.exercises.find(e=>e.id.endsWith("-words-3-v1"))!;
integerWords.family=integerWords.repair="integer-words";
addPair(modeling,"words","言葉と数量の範囲","端の値を含むか確かめ、長さや重さが非負であることも保ちます。",[
 [m`「長さが $5$ m以下」を、長さ $x$ mの不等式で表しなさい。`,m`$0\le x\le5$。`,"以下は等号を含み、長さは非負です。",m`下限は $0$、上限は $5$ でどちらも含みます。`],
 [m`「重さが $2$ kg未満」を、重さ $x$ kgの不等式で表しなさい。`,m`$0\le x<2$。`,"未満は上端を含みません。",m`重さの非負条件 $x\ge0$ と $x<2$ を合わせます。`],
]);
