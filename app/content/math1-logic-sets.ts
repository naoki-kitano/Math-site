import {logicTopic,logicPreparation,m,math,set,w} from "./math1-logic-authoring";
import {addPair,type Worked,type Skill} from "./math1-topic";
const integerCheck=(tex:string,yes:boolean,why:string):Worked=>w(`${math(tex)} は整数ですか。理由も答えなさい。`,`${yes?"整数です":"整数ではありません"}。${why}`,"整数には負の整数とゼロも含みます。小数部分をもつ値と区別します。",why);
const prepInteger:Skill={id:"integer-recognition",title:"整数の範囲",why:"整数はゼロと正負の整数です。整数でない分数や小数は含みません。",sample:integerCheck("-2",true,"負の整数も含まれます。"),items:[integerCheck("0",true,"ゼロも整数です。"),integerCheck(m`\frac12`,false,"ゼロと一の間にあり整数ではありません。"),integerCheck("-3",true,"負の整数も整数の範囲に含まれます。") ]};
function member(a:number[],n:number):Worked {
 const yes=a.includes(n);
 return w(m`$A=${set(a)}$ とする。${math(String(n))} が $A$ の要素かを記号で表しなさい。`,math(m`${n}${yes?"\\in":"\\notin"} A`)+"。",m`$A$ の波括弧の中に ${math(String(n))} があるか確かめます。`,`${math(String(n))} は列挙された数に${yes?"含まれます":"含まれません"}。要素と集合の関係には ${math(yes?m`\in`:m`\notin`)} を使います。`);
}
function enumerate(lo:number,hi:number,strict:boolean):Worked {
 const values=Array.from({length:hi-lo+(strict?-1:1)},(_,i)=>lo+i+(strict?1:0));
 const condition=m`${lo}${strict?"<":"\\le"} x${strict?"<":"\\le"}${hi}`;
 return w(m`$A=\{x\mid x\text{ は整数},\ ${condition}\}$ を、要素を書き並べて表しなさい。`,math(m`A=${set(values)}`)+"。","「整数である」と「不等式を満たす」の両方を確かめ、両端が含まれるか調べます。",`${math(condition)} を満たす数のうち、整数だけを集めると ${math(set(values))}。${strict?"不等号に等号がないので両端は除きます":"両端も等号を満たすので含めます"}。`);
}
export const sets=logicTopic("m1-sets-elements","集合と要素",[
 m`ある数が仲間に入るかどうかをはっきり決められる集まりを集合といいます。$A=\{1,3,5\}$ は三つの数からなる集合です。数 $3$ は $A$ の要素なので $3\in A$、数 $2$ は要素でないので $2\notin A$ と書きます。`,
 m`$\{1,3,5\}=\{5,1,3\}$。並べる順序や同じ要素の重複は集合を変えません。$3$ は数、$\{3\}$ はその数だけを要素とする集合で、別のものです。`,
 m`条件で表すときは $\{x\mid x\text{ が条件を満たす}\}$ と書きます。縦線の左に要素を表す文字、右にその条件を書きます。例えば $\{x\mid x\text{ は整数},\ 1\le x<4\}=\{1,2,3\}$ です。「整数である」と不等式の両方が条件です。`,
 m`不等式だけで整数に限られるわけではありません。$\{x\mid x\text{ は実数},\ 1\le x<4\}$ には $\frac32$ なども入るので、$\{1,2,3\}$ とは異なります。`,
 m`要素を一つももたない集合を空集合 $\varnothing$ といいます。$\{0\}$ は要素 $0$ を一つもつので、空集合ではありません。`,
],"要素か集合かを区別し、数の範囲と境界を確かめます。",[
 {id:"membership",title:"要素が入っているか",why:"数一つと集合の関係を確かめます。",sample:member([1,3,5],3),items:[member([2,4,6],4),member([-1,0,1],0),member([1,3,5],2),member([-2,2],-2),member([0,2,4],1),member([-3,-1,1],1)]},
 {id:"listing",title:"条件を満たす整数を並べる",why:"数の範囲を整数に限定し、端点を含むか確かめて列挙します。",sample:enumerate(-1,2,false),items:[enumerate(0,3,false),enumerate(-2,2,true),enumerate(1,4,false),enumerate(0,2,true),enumerate(-3,1,false),enumerate(-1,3,true)]},
],[logicPreparation[0],prepInteger]);
addPair(sets,"object-kind","数と集合を区別する","波括弧は集合を表します。その中に書かれた数そのものとは区別します。",[
 w(m`$3$ と $\{3\}$ は、それぞれ数ですか、集合ですか。`,m`$3$ は数、$\{3\}$ は数 $3$ だけを要素とする集合です。`,"外側に波括弧があるかを見ます。",m`要素が一つでも、$\{3\}$ は集合です。要素の数 $3$ と集合自体を同一視しません。`),
 w(m`$0$ と $\{0\}$ は、それぞれ数ですか、集合ですか。`,m`$0$ は数、$\{0\}$ は数 $0$ を要素とする集合です。`,"ゼロと、ゼロを包んだ集合を分けます。",m`$\{0\}$ には要素が一つあります。$0$ 自体はその要素である数です。`),
]);
addPair(sets,"empty-zero","空集合とゼロを含む集合","要素がないことと、数ゼロを要素としてもつことは違います。",[
 w(m`$\varnothing$ と $\{0\}$ は等しい集合ですか。要素の個数も答えなさい。`,m`等しくありません。要素はそれぞれ $0$ 個、$1$ 個です。`,"要素の値と、要素の個数を区別します。",m`空集合には要素がなく、$\{0\}$ には数 $0$ が入っています。`),
 w(m`$A=\{0,0\}$ は空集合ですか。要素の個数も答えなさい。`,m`空集合ではありません。$A=\{0\}$ で要素は $1$ 個です。`,"同じ数を重ねて書いても、要素は増えません。",m`数 $0$ が一つ入っている集合なので、要素がない $\varnothing$ とは違います。`),
]);
const prepMembership:Skill={id:"member-ready",title:"要素を照合する",why:"集合の計算の前に、その要素が入っているかを確かめます。",sample:member([1,2,3],2),items:[member([0,2,4],2),member([-1,0,1],2),member([1,3,5],3)]};

type Op="intersection"|"union"|"complement";
export const setCases=[
 {u:[0,1,2,3,4,5],a:[0,2,4],b:[2,3,4]},
 {u:[1,2,3,4,5,6],a:[1,2,3],b:[3,4,5]},
 {u:[0,1,2,3,4],a:[0,2],b:[1,3]},
 {u:[-2,-1,0,1,2],a:[-2,0,2],b:[0,2]},
 {u:[1,2,3,4],a:[1,2,3,4],b:[2,4]},
 {u:[0,1,2,3],a:[],b:[1,2]},
 {u:[-1,0,1,2,3],a:[-1,1,3],b:[0,1,2]},
];
function operation(op:Op,c:typeof setCases[number]):Worked {
 const target=op==="intersection"?m`A\cap B`:op==="union"?m`A\cup B`:m`\overline A`;
 const result=op==="intersection"?c.a.filter(n=>c.b.includes(n)):op==="union"?[...new Set([...c.a,...c.b])].sort((a,b)=>a-b):c.u.filter(n=>!c.a.includes(n));
 const why=op==="intersection"?"両方の集合に入る数だけを残します。":op==="union"?"少なくとも一方に入る数を、重複させずに集めます。":"全体集合の中で、集合に入っていない数だけを残します。";
 return w(m`全体集合 $U=${set(c.u)}$、$A=${set(c.a)}$、$B=${set(c.b)}$ とする。${math(target)} を求めなさい。`,math(`${target}=${set(result)}`)+"。",why,`${why} ${math(target)} は ${math(set(result))} です。${op==="complement"?m`$U$ の外の数は補集合に含めません。`:result.length===0?"条件に合う要素がないので空集合です。":"一つずつ元の集合に戻して確かめます。"}`);
}
export const operations=logicTopic("m1-set-operations","共通部分・和集合・補集合",[
 m`$A\cap B$ は両方に入る要素の集合（共通部分）、$A\cup B$ は少なくとも一方に入る要素の集合（和集合）です。「または」には両方を満たす場合も含みます。`,
 m`考える範囲全体を全体集合 $U$ といいます。$A$ の補集合 $\overline A$ は、$U$ に入っていて $A$ に入らない要素の集合です。$U$ を変えると補集合も変わることがあります。`,
 m`$U=\{1,2,3,4\},A=\{1,2\},B=\{2,3\}$ なら、$A\cap B=\{2\}$、$A\cup B=\{1,2,3\}$、$\overline A=\{3,4\}$。両方に入る $2$ は和集合にも入りますが、二回書く必要はありません。`,
],"両方・少なくとも一方・全体の中で外側、を区別します。",(["intersection","union","complement"] as Op[]).map((op,i)=>({id:op,title:["両方に入る要素","少なくとも一方に入る要素","全体集合から除く要素"][i],why:["一つの要素が二つの条件を同時に満たすか見ます。","両方にある要素も含めて集めます。","補集合は全体集合を決めてから求めます。"][i],sample:operation(op,setCases[0]),items:setCases.slice(1).map(c=>operation(op,c))})),[prepMembership,prepInteger]);

function subset(a:number[],b:number[]):Worked {
 const outside=a.find(x=>!b.includes(x)),yes=outside===undefined;
 return w(m`$A=${set(a)},B=${set(b)}$ のとき $A\subseteq B$ ですか。理由も述べなさい。`,yes?m`はい。$A$ のすべての要素が $B$ に含まれます。`:m`いいえ。${math(String(outside))} は $A$ に入りますが $B$ に入りません。`,m`$A$ の側から一つずつ $B$ にもあるか調べます。`,a.length===0?m`$A$ に要素がないので、「$A$ に入るのに $B$ に入らない」要素はありません。空集合はどの集合の部分集合でもあります。`:yes?m`$A=${set(a)}$ の各要素がすべて $B=${set(b)}$ にあります。等しい集合でも $\subseteq$ は成り立ちます。`:m`$${outside}\in A$ かつ $${outside}\notin B$。一つでも外に出る要素があると包含は成り立ちません。`);
}
function bound(a:number,b:number,closed:boolean):Worked {
 const p=m`x>${a}`,q=m`x${closed?"\\ge":">"}${b}`,yes=a>=b;
 const numerator=a+b,mid=numerator%2===0?String(numerator/2):m`${numerator<0?"-":""}\frac{${Math.abs(numerator)}}2`;
 const counter=m`$x=${mid}$ は $${mid}>${a}$ を満たしますが、$${mid}<${b}$ なので ${math(q)} を満たしません。`;
 return w(m`$x$ は実数とする。条件 $p:${p}$ を満たす集合が、条件 $q:${q}$ を満たす集合に含まれるか、理由とともに答えなさい。`,yes?m`含まれます。${math(p)} なら必ず ${math(q)} だからです。`:"含まれません。"+counter,m`条件 $p$ を満たす数を出発点に、$q$ も必ず成り立つか見ます。`,yes?m`$x>${a}\ge${b}$ より ${math(q)}。したがって $p$ の集合は $q$ の集合に含まれます。`:counter);
}
export const inclusion=logicTopic("m1-condition-inclusion","条件と集合の包含",[
 m`$A$ の要素がすべて $B$ にも入るとき、$A$ は $B$ の部分集合といい、ここでは $A\subseteq B$ と書きます。等しい場合も含む記号です。教科書で $\subset$ を同じ意味に使うこともあります。`,
 m`実数 $x$ の条件を $p:x>3$、$q:x>1$ とすると、$p$ を満たす範囲は $q$ の範囲にすべて含まれます。このことを「$p$ ならば $q$」、$p\Rightarrow q$ と表します。`,
 m`「$p$ ならば $q$」を調べるときは、$p$ を満たすものから出発します。$q$ を満たす例を一つ見つけるだけでは不十分です。$p$ を満たすのに $q$ を満たさないものがないかを確かめます。`,
 m`空集合はすべての集合の部分集合です。「入っているのに相手に入らない」要素がないためです。ただし $\varnothing$ と $\{0\}$ は異なります。`,
],"出発する条件を満たすものが、すべて行き先の条件も満たすかを調べます。",[
 {id:"subset",title:"要素を一つずつ照合する",why:"包含は出発する集合のすべての要素についての主張です。",sample:subset([1,2],[1,2,3]),items:[subset([2,4],[1,2,3,4]),subset([1,3],[1,2]),subset([0],[0]),subset([],[1]),subset([-1,1],[-1,0,1]),subset([0,2],[1,2,3])]},
 {id:"condition-range",title:"条件を満たす範囲を比べる",why:"実数の範囲全体を比べ、狭い条件から広い条件への向きを確かめます。",sample:bound(3,1,false),items:[bound(2,0,false),bound(1,3,false),bound(0,0,true),bound(-1,-3,false),bound(4,2,true),bound(-2,0,false)]},
],[prepMembership,logicPreparation[0]]);
addPair(inclusion,"subset-counter","包含しないことを一つの要素で示す",m`$A$ に入り $B$ に入らない要素を一つ挙げ、両方を確かめます。`,[subset([2,3],[1,2]),subset([-2,0],[-1,0])]);
addPair(inclusion,"empty-subset","空集合からの包含","要素がないので、相手の集合の外にはみ出す要素もありません。",[subset([],[]),subset([],[0])]);
addPair(inclusion,"range-counter","包含しないことを範囲の反例で示す","出発する条件は満たし、行き先の条件は満たさない数を選びます。境界を含むかも確かめます。",[bound(1,3,true),bound(-2,1,false)]);
for(const e of inclusion.exercises){
 if(["subset-2","subset-6"].some(k=>e.id.endsWith(`-${k}-v1`)))e.family=e.repair="subset-counter";
 if(e.id.endsWith("-subset-4-v1"))e.family=e.repair="empty-subset";
 if(["condition-range-2","condition-range-6"].some(k=>e.id.endsWith(`-${k}-v1`)))e.family=e.repair="range-counter";
}
