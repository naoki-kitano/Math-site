import {topic,type Worked,type Skill} from "./math1-topic";
const m=String.raw;
const math=(s:string)=>m`$${s}$`;
const sign=(n:number)=>n<0?String(n):m`+${n}`;
const term=(n:number,v:string)=>n===0?"":m`${n<0?"-":""}${Math.abs(n)===1&&v?"":Math.abs(n)}${v}`;
const poly=(a:number,b:number,c:number)=>[term(a,"x^2"),term(b,"x"),term(c,"")].filter(Boolean).map((t,i)=>i&&t[0]!=="-"?"+"+t:t).join("");
const lin=(a:number,b:number)=>term(a,"x")+(b?sign(b):"");
function multiply(a:number,b:number):Worked{return [math(m`(${a})(${b})`)+" を計算しなさい。",math(String(a*b))+"。",m`符号を確かめてから ${math(String(Math.abs(a)))} と ${math(String(Math.abs(b)))} を掛けます。`,math(m`(${a})(${b})=${a*b}`)+"。負と負の積は正、異符号の積は負です。"]}
const prepMultiply:Skill={id:"number-product",title:"符号を含む積",why:"因数の係数を扱う前に、数の積の符号を確かめます。",sample:multiply(-2,3),items:[multiply(-3,-4),multiply(2,-5),multiply(-4,-2)]};
function expand(a:number,b:number):Worked{return [math(m`${a}x(x${sign(b)})`)+" を展開しなさい。",math(poly(a,a*b,0))+"。",math(m`${a}x`)+" を括弧の両方の項に掛けます。",math(m`${a}x\cdot x+${a}x\cdot(${b})=${poly(a,a*b,0)}`)+"。"]}
const prepExpand:Skill={id:"expand",title:"展開で確かめる",why:"積を各項に配ると元の和へ戻せます。",sample:expand(2,3),items:[expand(3,-2),expand(2,5),expand(4,-1)]};
export {prepMultiply,prepExpand};
function common(k:number,a:number,b:number):Worked {
  const input=poly(k*a,k*b,0),inside=lin(a,b),answer=m`${term(k,"x")}(${inside})`;
  return [math(input)+" を因数分解しなさい。",math(answer)+"。",m`両方の項に共通する ${math(term(k,"x"))} を取り出します。`,m`${math(input+"="+term(k,"x")+m`\cdot(${term(a,"x")})+`+term(k,"x")+m`\cdot(${b})`)} なので ${math(answer)}。展開すると元の式に戻ります。式を ${math("x")} で割る方程式変形ではなく、分配法則を逆向きに使っています。`];
}
function complete(k:number,a:number):Worked {
 const input=m`${term(k,"x^3")}${sign(-k*a*a)}x`,answer=m`${term(k,"x")}(x-${a})(x+${a})`;
 return [math(input)+" を整数係数でできるところまで因数分解しなさい。",math(answer)+"。",m`まず ${math(term(k,"x"))} をくくり、残る二乗の差を見ます。`,math(m`${input}=${term(k,"x")}(x^2-${a*a})=${answer}`)+m`。${math(m`${a*a}=${a}^2`)} なので、残った括弧も和と差の積へ直せます。`];
}
export const factors=topic("m1-common-factors","共通因数と因数分解",[
 m`因数分解は、和の形の式を積の形に直すことです。$6x^2+9x=3x(2x+3)$ の右辺の $3x$ と $2x+3$ は因数です。左辺の $6x^2$ と $9x$ は項であり、因数とは区別します。`,
 m`分配法則 $a(b+c)=ab+ac$ を逆に使います。まず各項を掛け算に分け、共通して掛かっているものを括弧の外へ出します。残りの各項を括弧に入れ、掛け戻して確かめます。`,
 m`$x$ を共通因数としてくくることは、両辺を $x$ で割る操作ではありません。$x=0$ でも因数分解の等式は成り立ちます。くくった後の括弧も、さらに因数分解できるか確認します。`,
 m`例えば $2x^3-8x=2x(x^2-4)=2x(x-2)(x+2)$。共通因数を見つけたところで止めず、二乗の差も使います。ここでは整数係数での因数分解を扱います。`,
],"最初に共通因数を取り出し、残りの式も調べます。",[
 {id:"common",title:"共通因数を取り出す",why:"すべての項に共通する数と文字を、積の形で取り出します。",sample:common(3,2,3),items:[[2,1,3],[3,1,2],[2,3,-1],[5,2,-3],[-2,1,4],[4,1,-3],[3,2,1]].map(v=>common(v[0],v[1],v[2]))},
 {id:"complete",title:"くくった後も因数分解する",why:"共通因数を取り出した後、二乗の差が残れば和と差の積に直します。",sample:complete(2,2),items:[[3,2],[2,3],[1,4],[4,1],[-2,2],[3,3],[2,5]].map(v=>complete(v[0],v[1]))},
],[prepMultiply,prepExpand]);

function monic(a:number,b:number):Worked {
 const input=poly(1,a+b,a*b),answer=m`(x${sign(a)})(x${sign(b)})`;
 return [math(input)+" を因数分解しなさい。",math(answer)+"。",m`和が ${math(String(a+b))}、積が ${math(String(a*b))} になる二数を探します。`,m`${math(m`${a}+(${b})=${a+b}`)}、${math(m`(${a})(${b})=${a*b}`)} なので二数は ${math(String(a))} と ${math(String(b))}。${math(answer+"="+input)} と展開して、一次の係数と定数項の両方を確認します。`];
}
function nonmonic(a:number,b:number,k=2):Worked {
 const input=poly(k,k*b+a,a*b),answer=m`(${k}x${sign(a)})(x${sign(b)})`;
 return [math(input)+" を因数分解しなさい。",math(answer)+"。",m`先頭を ${math(m`${k}x\cdot x`)} とし、交差する積の和が ${math(term(k*b+a,"x"))} になる組を探します。`,m`${math(m`(${k}x)(${b})+(${a})x=${term(k*b+a,"x")}`)}、定数の積は ${math(m`(${a})(${b})=${a*b}`)}。したがって ${math(answer)}。展開すると ${math(input)} です。`];
}
export const quadratics=topic("m1-quadratic-factorization","二次式の因数分解",[
 m`$(x+a)(x+b)=x^2+(a+b)x+ab$ を逆に読みます。$x^2+px+q$ では、和が $p$、積が $q$ となる二数を探します。積だけが合っても十分ではありません。`,
 m`$x^2+x-6$ なら、積が $-6$ なので二数の符号は反対です。$3$ と $-2$ は和も $1$ なので、$(x+3)(x-2)$ です。`,
 m`二次の係数が $1$ でない場合は、交差する積も確かめます。$(2x+1)(x+3)$ の一次の項は $6x+x=7x$。したがって $2x^2+7x+3=(2x+1)(x+3)$ です。`,
 m`ここでは整数係数で因数分解できる基本的な式を扱います。候補を決めたら展開し、二次・一次・定数のすべてを元の式と照合します。`,
],"定数項の積だけでなく、一次の係数も一致させます。",[
 {id:"monic",title:"和と積を満たす二数",why:"共通項のある積の公式を逆向きに読みます。",sample:monic(2,3),items:[[1,4],[2,2],[-2,3],[-3,-1],[4,-1],[5,-2],[-4,-2]].map(v=>monic(v[0],v[1]))},
 {id:"nonmonic",title:"交差する積で一次の項を確認",why:"二次の係数を因数へ分け、交差する二つの積の和を確かめます。",sample:nonmonic(1,3),items:[[3,1,2],[1,2,3],[-1,3,2],[3,-2,2],[-3,-1,2],[5,1,4],[-1,-2,3]].map(v=>nonmonic(v[0],v[1],v[2]))},
],[prepMultiply,prepExpand]);

function grouped(a:number,b:number):Worked {
 const common=m`x${sign(a)}`,bx=term(b,"x"),input=m`${bx}(${common})+(${common})`,answer=m`(${common})(${bx}+1)`;
 return [math(input)+" を因数分解しなさい。",math(answer)+"。",math(m`(${common})`)+" 全体が両方の項にあります。",m`共通の括弧を ${math("A")} と見ると ${math(m`${bx}A+A=A(${bx}+1)`)}。${math(m`A=${common}`)} を戻して ${math(answer)}。展開して元に戻ります。`];
}
function groupFour(a:number,b:number):Worked {
 const signedTerm=(n:number,v:string)=>n<0?term(n,v):"+"+term(n,v);
 const input=m`xy${signedTerm(a,"x")}${signedTerm(b,"y")}${sign(a*b)}`,answer=m`(x${sign(b)})(y${sign(a)})`;
 return [math(input)+" を因数分解しなさい。",math(answer)+"。",math("x")+" を含む二項と、含まない二項に分けます。",math(m`${input}=x(y${sign(a)})+(${b})(y${sign(a)})=${answer}`)+"。二つの組から同じ括弧が現れるようにまとめます。"];
}
export const grouping=topic("m1-grouping","まとまりに注目する式変形",[
 m`共通因数は一文字とは限りません。$2x(x+1)+(x+1)$ では $x+1$ 全体が共通因数なので、$(x+1)(2x+1)$ とできます。最初からすべてを展開しなくてもよいのです。`,
 m`まとまりを一時的に $A$ と置いても構いません。ただし、最後は元の式に戻します。$A=x+1$ なら $2xA+A=A(2x+1)$ です。`,
 m`四つの項も、共通の括弧が現れるよう組にできます。$xy+2x+3y+6=x(y+2)+3(y+2)=(x+3)(y+2)$。$x$ を含む項と含まない項に分けると見つけやすくなります。`,
],"同じ括弧を一つのまとまりと見て、共通因数を探します。",[
 {id:"group",title:"括弧全体を共通因数にする",why:"展開する前に、同じ括弧が掛かっているかを見ます。",sample:grouped(1,2),items:[[2,3],[-1,2],[3,1],[-2,4],[4,2],[5,3],[-3,2]].map(v=>grouped(v[0],v[1]))},
 {id:"four",title:"項を組にして同じ括弧を作る",why:"一文字を含む項をまとめると、共通する括弧が現れます。",sample:groupFour(2,3),items:[[1,2],[2,1],[-1,3],[3,-2],[-2,-1],[4,2],[-3,1]].map(v=>groupFour(v[0],v[1]))},
],[prepMultiply,prepExpand]);
