import {addRepairExamples,quadraticTopic as topic,m,w,num,poly,vertexForm,signed,squarePrep,boundaryPrep} from "./math1-quadratic-authoring";
import {type Worked} from "./math1-topic";
type Rel=">"|"<"|"\\ge"|"\\le";
export const inequalityCases:{a:number;p:number;q:number;rel:Rel;inside:boolean;closed:boolean}[]=[];
function inequality(a:number,p:number,q:number,rel:Rel):Worked{
 const positive=rel===">"||rel==="\\ge",closed=rel==="\\ge"||rel==="\\le",inside=positive?a<0:a>0;
 const edge=closed?"\\le":"<",ans=inside?m`$${p}${edge} x${edge}${q}$。`:m`$x${edge}${p}$ または $${q}${edge} x$。`;
 inequalityCases.push({a,p,q,rel,inside,closed});
 return w(m`$${poly(a,-a*(p+q),a*p*q)}${rel}0$ を解きなさい。`,ans,"まずゼロになる二つの境界を求め、開く向きから $x$ 軸の上・下にある範囲を読みます。",m`左辺は $${a===1?"":num(a)}(x${signed(-p)})(x${signed(-q)})$。境界は $${p},${q}$。二因数の符号は外側で同じ、内側で逆なので、左辺は内側で${a>0?"負":"正"}、外側で${a>0?"正":"負"}です。${positive?"正":"負"}の範囲を選び、${closed?"等号があるので両境界も含めます":"等号がないので境界は除きます"}。`);
}
const signAt=(a:number,p:number,q:number,x:number):Worked=>{
 const v=a*(x-p)*(x-q);return w(m`$y=${poly(a,-a*(p+q),a*p*q)}$ で $x=${x}$ の点は、$x$ 軸より上・下・軸上のどれですか。`,v>0?"上です。":v<0?"下です。":"軸上です。","関数値の正負が、軸の上か下かを表します。",m`$y=${v}$ なので、${v>0?"正で軸より上":v<0?"負で軸より下":"ゼロで軸上"}です。`);
};
export const quadraticInequality=topic("m1-quadratic-inequality","二次不等式とグラフの符号",[
 m`$f(x)>0$ はグラフの点が $x$ 軸より上にある入力、$f(x)<0$ は下にある入力を求める問いです。二次方程式の二つの解だけを答えるのではなく、入力の範囲を答えます。`,
 m`$x^2-x-2=(x+1)(x-2)$ では、$x<-1$ と $x>2$ で二因数の符号が同じなので積は正、$-1<x<2$ では符号が逆なので積は負です。`,
 m`二次の係数が負なら符号が逆になり、二つの境界の内側で正、外側で負です。「内側か外側か」を不等号だけで暗記せず、開く向きと軸の上下を確かめます。`,
 m`$\ge,\le$ では関数値ゼロも認めるので境界を含め、$>,<$ では除きます。外側の二つの範囲は「または」で結びます。`,
],"境界、開く向き、等号の有無を確かめて解の範囲を選びます。",[
 {id:"positive-leading-sign",title:"下に凸の放物線で範囲を選ぶ",why:"二つの零点の内側では負、外側では正になります。",sample:inequality(1,-1,2,"<"),items:[inequality(1,-2,3,"<"),inequality(1,1,4,"\\ge"),inequality(2,-1,2,">"),inequality(1,0,3,"\\le"),inequality(1,-3,-1,"\\ge"),inequality(2,1,3,"<"),inequality(1,-2,2,"\\le"),inequality(1,0,2,">")]},
 {id:"negative-leading-sign",title:"上に凸の放物線で範囲を選ぶ",why:"負の係数により、二つの零点の内側で正、外側で負になります。",sample:inequality(-1,-1,2,">"),items:[inequality(-1,0,3,">"),inequality(-1,-2,1,"\\le"),inequality(-2,1,4,"<"),inequality(-1,-3,2,"\\ge"),inequality(-2,-2,2,"\\ge"),inequality(-1,-1,3,"<"),inequality(-1,1,3,"\\le"),inequality(-2,0,2,">")]},
],[boundaryPrep,{id:"graph-sign",title:"関数値の符号と軸の上下",why:"縦座標が正なら上、負なら下、ゼロなら軸上です。",sample:signAt(1,-1,2,0),items:[signAt(1,-1,2,3),signAt(1,-1,2,-1),signAt(-1,0,3,1)]}]);

export const specialSignCases:{a:number;h:number;k:number;rel:Rel;answer:string}[]=[];
function special(a:number,h:number,k:number,rel:Rel):Worked{
 const positive=rel===">"||rel==="\\ge",closed=rel==="\\ge"||rel==="\\le",same=positive===(a>0);
 const answer=k===0?(same?(closed?"すべての実数。":m`$x\ne${h}$ のすべての実数。`):(closed?m`$x=${h}$。`:"解なし。")):(same?"すべての実数。":"解なし。");
 specialSignCases.push({a,h,k,rel,answer});
 return w(m`$${vertexForm(a,h,k)}${rel}0$ を解きなさい。`,answer,"平方の非負性から左辺の符号と、ゼロになる入力があるかを調べます。",m`平方は非負なので左辺は $${a>0?"\\ge":"\\le"}${k}$。${k===0?m`ゼロになるのは $x=${h}$ だけです。`:"定数項も同じ符号なので、左辺はゼロになりません。"}${k===0?m`$x=${h}$ 以外では${a>0?"正":"負"}です。`:""}求める不等号と等号の有無を合わせると、${answer}`);
}
export const specialInequality=topic("m1-quadratic-inequality-boundaries","接する・交わらない場合の不等式",[
 m`実数解のない方程式と、解のない不等式は同じ意味ではありません。$x^2+1=0$ の実数解はありませんが、$x^2+1>0$ はすべての実数で成り立ちます。`,
 m`$(x-1)^2$ は $x=1$ でだけゼロ、それ以外で正です。したがって $(x-1)^2\ge0$ はすべての実数、$(x-1)^2>0$ は $x\ne1$、$(x-1)^2\le0$ は $x=1$、$(x-1)^2<0$ は解なしです。`,
 m`負の係数を掛ければ符号は逆になります。例えば $-(x-1)^2\ge0$ は $x=1$ のみ。零点だけでなく、零点以外の符号を必ず調べます。`,
],"ゼロになる点と、それ以外の符号を分けて判断します。",[
 {id:"tangent-sign",title:"接点で等号になるかを確かめる",why:"平方がゼロになる一点と、それ以外を分ければ四種類の不等号を判断できます。",sample:special(1,1,0,">"),items:[special(1,2,0,"\\le"),special(1,-1,0,"<"),special(-1,2,0,"\\ge"),special(2,3,0,"\\ge"),special(-2,-1,0,"<"),special(-1,1,0,">"),special(1,-2,0,">"),special(-2,0,0,"\\le")]},
 {id:"no-intersection-sign",title:"零点がなくても符号は判断できる",why:"平方項と定数が同じ符号なので、全体が常に正か常に負になります。",sample:special(1,0,1,">"),items:[special(1,1,2,"<"),special(-1,2,-1,"\\le"),special(2,-1,1,"\\ge"),special(-2,0,-3,">"),special(1,-2,3,"\\le"),special(-1,1,-2,"<"),special(2,0,1,">"),special(-1,-1,-1,"\\ge")]},
],[squarePrep,boundaryPrep]);
quadraticInequality.lesson.prerequisites=[{slug:"m1-equation-graph",label:"二次方程式とグラフ"}];
specialInequality.lesson.prerequisites=[{slug:"m1-quadratic-inequality",label:"二次不等式とグラフの符号"}];
export const quadraticInequalityTopics=[quadraticInequality,specialInequality];
addRepairExamples(quadraticInequality,"positive-leading-sign",["2","4"]);
addRepairExamples(quadraticInequality,"negative-leading-sign",["2","4"]);
addRepairExamples(specialInequality,"tangent-sign",["2","3","4","5","6","8"]);
addRepairExamples(specialInequality,"no-intersection-sign",["2","4"]);
