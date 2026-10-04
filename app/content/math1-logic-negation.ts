import {logicTopic,m,math,w} from "./math1-logic-authoring";
import type {Worked} from "./math1-topic";
export const boundaryNegations=[
 ["x>2",m`x\le2`,"等しくなる場合も、元の条件を満たさない側に入ります。"],
 [m`x\ge-1`,"x<-1","等号は元の条件に含まれるので、否定には含めません。"],
 ["x<3",m`x\ge3`,"境界の三も元の条件を満たしません。"],
 [m`x\le0`,"x>0","ゼロは元の条件を満たすので除きます。"],
 ["x=4",m`x\ne4`,"等しくない実数をすべて含めます。"],
 [m`x\ne-2`,"x=-2","等しくないという条件を満たさないのは、等しい場合です。"],
 ["x>0",m`x\le0`,"負の数だけでなく、ゼロも入れます。"],
];
const negateBoundary=(c:string[]):Worked=>w(m`$x$ を実数とする。条件 ${math(c[0])} の否定を書きなさい。`,math(c[1])+"。",c[2],`${c[2]} 元の条件と否定で実数全体を分け、重なりも抜けもないようにします。`);
export const compoundNegations=[
 {p:"x>0",q:"y>0",np:m`x\le0`,nq:m`y\le0`,and:true},
 {p:"x=0",q:"y=0",np:m`x\ne0`,nq:m`y\ne0`,and:true},
 {p:"x>2",q:"x<5",np:m`x\le2`,nq:m`x\ge5`,and:true},
 {p:"x<0",q:"y<0",np:m`x\ge0`,nq:m`y\ge0`,and:false},
 {p:"x=1",q:"x=2",np:m`x\ne1`,nq:m`x\ne2`,and:false},
 {p:m`x\ge0`,q:m`y\ge0`,np:"x<0",nq:"y<0",and:true},
 {p:"x>3",q:"x<-3",np:m`x\le3`,nq:m`x\ge-3`,and:false},
];
const negateCompound=(c:typeof compoundNegations[number]):Worked=>{
 const why=c.and?"両方が成立することの否定は、少なくとも一方が成立しないことです。":"少なくとも一方が成立することの否定は、両方とも成立しないことです。";
 return w(m`文字は実数とする。「${math(c.p)} ${c.and?"かつ":"または"} ${math(c.q)}」の否定を書きなさい。`,`${math(c.np)} ${c.and?"または":"かつ"} ${math(c.nq)}。`,why,`${why} 各条件も否定して ${math(c.np)}、${math(c.nq)} とし、${c.and?"または":"かつ"}で結びます。`);
};
export const quantifiedNegations=[
 {domain:"実数",v:"x",predicate:m`x^2\ge0`,negative:"x^2<0",all:true},
 {domain:"実数",v:"x",predicate:"x>0",negative:m`x\le0`,all:true},
 {domain:"整数",v:"n",predicate:"n^2=2",negative:m`n^2\ne2`,all:false},
 {domain:"実数",v:"x",predicate:"x^2=4",negative:m`x^2\ne4`,all:false},
 {domain:"整数",v:"n",predicate:m`n^2\ge n`,negative:"n^2<n",all:true},
 {domain:"実数",v:"x",predicate:"x^2<0",negative:m`x^2\ge0`,all:false},
 {domain:"整数",v:"n",predicate:m`n\le5`,negative:"n>5",all:true},
];
const negateQuantifier=(c:typeof quantifiedNegations[number]):Worked=>{
 const original=c.all?`すべての${c.domain} ${math(c.v)} について ${math(c.predicate)}`:`ある${c.domain} ${math(c.v)} が存在して ${math(c.predicate)}`;
 const answer=c.all?`ある${c.domain} ${math(c.v)} が存在して ${math(c.negative)}`:`すべての${c.domain} ${math(c.v)} について ${math(c.negative)}`;
 return w(`「${original}」の否定を書きなさい。真偽の判定ではなく、文の書き換えを答えます。`,answer+"。",c.all?"全部が満たすことの否定は、満たさないものが一つでもあることです。":"一つでもあることの否定は、一つもないことです。",`${c.all?"すべてを「ある」に":"あるを「すべて」に"}変え、条件 ${math(c.predicate)} を ${math(c.negative)} に否定します。数の範囲は${c.domain}のままです。`);
};
export const negation=logicTopic("m1-condition-negation","条件の否定",[
 m`条件 $p$ の否定は「$p$ でない」という条件です。実数 $x$ について $x>2$ の否定は $x\le2$。$x<2$ とすると $x=2$ が抜けるので誤りです。元の条件と否定は、考えている範囲を重なりなく全部に分けます。`,
 m`「$p$ かつ $q$」でないとは、少なくとも一方が成り立たないこと。「$p$ または $q$」でないとは、両方とも成り立たないことです。例えば「$x>0$ かつ $y>0$」の否定は「$x\le0$ または $y\le0$」。`,
 m`「すべての数が条件を満たす」の否定は「条件を満たさない数がある」です。「ある数が条件を満たす」の否定は「すべての数が条件を満たさない」です。ここで「ある」は少なくとも一つ存在する意味です。`,
 m`否定を書くことと、元の文の真偽を答えることは違います。否定では、数の範囲を変えず、量を表す言葉と条件の両方を確かめます。`,
],"境界を落とさず、かつ・または、すべて・あるの両方を確かめます。",[
 {id:"boundary",title:"等号を含む側を確かめる",why:"元の条件を満たさない値を漏れなく集めます。",sample:negateBoundary(boundaryNegations[0]),items:boundaryNegations.slice(1).map(negateBoundary)},
 {id:"compound",title:"かつ・またはの否定",why:"各条件を否定するだけでなく、結び方も変わります。",sample:negateCompound(compoundNegations[0]),items:compoundNegations.slice(1).map(negateCompound)},
 {id:"quantifier",title:"すべて・あるの否定",why:"全体の主張を否定するときは、存在の言葉と条件を一緒に変えます。",sample:negateQuantifier(quantifiedNegations[0]),items:quantifiedNegations.slice(1).map(negateQuantifier)},
]);

export const transformations=[
 {p:"x=2",q:"x^2=4",np:m`x\ne2`,nq:m`x^2\ne4`},
 {p:"x>3",q:"x>1",np:m`x\le3`,nq:m`x\le1`},
 {p:"x=0",q:"2x=0",np:m`x\ne0`,nq:m`2x\ne0`},
 {p:"x<0",q:"x<2",np:m`x\ge0`,nq:m`x\ge2`},
 {p:m`x\ge2`,q:"x>0",np:"x<2",nq:m`x\le0`},
 {p:"x=3",q:"x^2=9",np:m`x\ne3`,nq:m`x^2\ne9`},
 {p:"x>1",q:m`x\ge1`,np:m`x\le1`,nq:"x<1"},
];
const transform=(c:typeof transformations[number]):Worked=>{
 const answer=m`逆：${math(c.q+"\\Rightarrow "+c.p)}。裏：${math(c.np+"\\Rightarrow "+c.nq)}。対偶：${math(c.nq+"\\Rightarrow "+c.np)}。`;
 return w(m`$x$ は実数とする。命題 ${math(c.p+"\\Rightarrow "+c.q)} の逆・裏・対偶を書きなさい。`,answer,"逆は順序を交換、裏は両方を否定、対偶は交換して両方を否定します。",m`仮定を $p:${c.p}$、結論を $q:${c.q}$ とする。否定は ${math(c.np)} と ${math(c.nq)}。これを $q\Rightarrow p$、$\neg p\Rightarrow\neg q$、$\neg q\Rightarrow\neg p$ に当てはめます。`);
};
function equivalent(original:boolean,reverse:boolean,ask:"contra"|"inverse"):Worked {
 const target=ask==="contra"?"対偶":"裏",result=ask==="contra"?original:reverse;
 return w(m`命題 $p\Rightarrow q$ は${original?"真":"偽"}、逆 $q\Rightarrow p$ は${reverse?"真":"偽"}です。${target}の真偽と、その根拠を答えなさい。`,`${target}は${result?"真":"偽"}です。${ask==="contra"?"元の命題と対偶":"逆と裏"}の真偽は一致するからです。`,`${ask==="contra"?"対偶は元の命題":"裏は逆"}と組にして考えます。`,m`$p\Rightarrow q$ と $\neg q\Rightarrow\neg p$ が同値です。同じことを逆にも使うと、$q\Rightarrow p$ と $\neg p\Rightarrow\neg q$ が同値です。したがって${target}は${result?"真":"偽"}です。`);
}
export const contrapositive=logicTopic("m1-converse-contrapositive","逆・裏・対偶",[
 m`命題 $p\Rightarrow q$ に対し、逆は $q\Rightarrow p$、裏は $\neg p\Rightarrow\neg q$、対偶は $\neg q\Rightarrow\neg p$ です。$\neg p$ は $p$ の否定を表します。対偶では順序の交換と否定の両方が必要です。`,
 m`元の命題と対偶の真偽は必ず一致します。元の命題が偽になるのは「$p$ が真で $q$ が偽」の場合です。対偶が偽になるのも「$q$ が偽で $p$ が真」の場合です。偽になる場合が同じなので、真偽が一致します。`,
 m`逆と裏も互いに対偶なので真偽が一致します。ただし元の命題と逆の真偽は一般には一致しません。「$x=2$ ならば $x^2=4$」は真ですが、逆は $x=-2$ が反例です。`,
],"対偶は順序を交換して両方を否定する。元の命題と真偽が一致します。",[
 {id:"transform",title:"仮定と結論を書き分ける",why:"元の仮定・結論と、その否定を先に用意すると、向きを取り違えません。",sample:transform(transformations[0]),items:transformations.slice(1).map(transform)},
 {id:"truth-pair",title:"同じ真偽になる組を選ぶ",why:"元と対偶、逆と裏を組にします。元と逆を同じだとは扱いません。",sample:equivalent(true,false,"contra"),items:[equivalent(true,false,"inverse"),equivalent(false,true,"contra"),equivalent(false,true,"inverse"),equivalent(true,true,"contra"),equivalent(false,false,"inverse"),equivalent(true,true,"inverse")]},
]);
