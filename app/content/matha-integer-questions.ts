import {m,q,f,gcd,range,skill} from "./matha-authoring";
import type {Q} from "./matha-authoring";
export const integerAudit:{q:Q;kind:string;args:number[]}[]=[];
const checked=(x:Q,kind:string,args:number[])=>{integerAudit.push({q:x,kind,args});return x;};
export const factors=(n:number)=>{const list:[number,number][]=[];for(let p=2;p*p<=n;p++){let e=0;while(n%p===0){e++;n/=p;}if(e)list.push([p,e]);}if(n>1)list.push([n,1]);return list;};
const factorTex=(n:number)=>factors(n).map(([p,e])=>e===1?String(p):`${p}^{${e}}`).join("\\times");
export function divisors(n:number):Q{
 const ds=range(n,1).filter(d=>n%d===0),pairs=ds.filter(d=>d*d<=n).map(d=>`${d}\\times${n/d}`).join("=");
 return checked(q(m`$${n}$ の正の約数をすべて求めなさい。`,m`$${ds.join(",")}$。`,"小さい方の因数を順に試し、積の相手も一緒に記録します。",
 m`$${n}=${pairs}$。積の組から $${ds.join(",")}$ を得ます。小さい側が平方根を超えると既に調べた組が逆になるので、これですべてです。`,ds.length),"divisors",[n]);
}
export function prime(n:number):Q{
 const ds=range(Math.max(0,n-2),2).filter(d=>n%d===0),ok=n>=2&&!ds.length;
 return checked(q(m`$${n}$ は素数ですか。理由も答えなさい。`,ok?m`素数です。正の約数が $1$ と $${n}$ の二つだけだからです。`:n===1?"素数ではありません。正の約数が一つだけだからです。":m`素数ではありません。$${n}=${ds[0]}\times${n/ds[0]}$ と分けられるからです。`,
 "一は素数ではありません。それ以外は平方根以下の素数で割れるかを調べます。",
 n===1?"素数は、正の約数がちょうど二つある二以上の整数です。一はこの条件を満たしません。":
 ok?m`$${n}$ の平方根以下の素数を試しても割り切れません。合成数なら二因数の小さい方が平方根以下になるはずなので、正の約数は $1,${n}$ だけです。`:
 m`$${ds[0]}$ は一と自分自身以外の正の約数なので、素数ではありません。`,+ok),"prime",[n]);
}
export function factorCount(n:number,square=false):Q{
 const fs=factors(n),count=fs.reduce((x,[,e])=>x*(e+1),1),need=fs.filter(([,e])=>e%2).reduce((x,[p])=>x*p,1),v=square?need:count;
 return checked(q(m`$${n}$ を素因数分解し、${square?"掛けると平方数になる最小の正の整数":"正の約数の個数"}を求めなさい。`,
 m`$${n}=${factorTex(n)}$。${square?"掛ける数":"約数の個数"}は $${v}$${square?"":"個"}。`,
 square?"平方数では各素因数の指数が偶数になります。":"約数の各素因数の指数は、零から元の指数まで選べます。",
 m`まず $${n}=${factorTex(n)}$。`+(square?m`奇数の指数を一つずつ増やすには $${need}$ を掛けます。余分な素因数を加えないので最小です。$${n}\times${need}=${n*need}=${Math.sqrt(n*need)}^2$。`:
 m`指数の選び方は $${fs.map(([,e])=>`(${e}+1)`).join("\\times")}=${count}$ 通り。指数零（その素数を使わない選択）も含めます。`),v),square?"square-factor":"factor-count",[n]);
}
export function gcdLcm(a:number,b:number,context:"plain"|"cut"|"period"="plain"):Q{
 const d=gcd(a,b),l=a*b/d;
 return checked(q(context==="plain"?m`$${a}$ と $${b}$ の最大公約数と最小公倍数を求めなさい。`:context==="cut"?m`長さ $${a}$ cm と $${b}$ cm の棒を、余りなく同じ長さに切ります。切り口の厚さは考えません。一片を最も長くすると何 cm ですか。理由も答えなさい。`:m`ある二つの信号は $${a}$ 分ごと、$${b}$ 分ごとに点灯します。同時に点灯した後、次に同時になるのは何分後ですか。理由も答えなさい。`,
 context==="plain"?m`最大公約数 $${d}$、最小公倍数 $${l}$。`:context==="cut"?m`$${d}$ cm。両方の長さを割り切る最大の数を選ぶからです。`:m`$${l}$ 分後。両方の周期の倍数となる最小の正の時間を選ぶからです。`,
 context==="period"?"両方の倍数を求める問題です。":"両方を割る数か、両方の倍数かを確かめます。",
 m`$${a}=${factorTex(a)},${b}=${factorTex(b)}$。共通に含む素因数を小さい指数まで取ると $${d}$。両方を含むために各素因数を大きい指数まで取ると $${l}$。`+(context==="cut"?"等分には最大公約数を使います。":context==="period"?"次の一致には最小公倍数を使います。":""),context==="period"?l:d),"gcd",[a,b,context==="period"?1:0]);
}
export function division(a:number,b:number):Q{
 const quo=Math.floor(a/b),r=a-b*quo;
 return checked(q(m`整数 $${a}$ を正の整数 $${b}$ で割る商と余りを求めなさい。余りは零以上、割る数未満とします。`,m`商 $${quo}$、余り $${r}$。`,
 a<0?"負の整数でも、余りが零以上になる商を選びます。":"割る数の倍数を引き、余りが割る数未満か確認します。",
 m`$${a}=${b}\times(${quo})+${r}$。$0\leqq ${r}<${b}$ なので、この商と余りです。`,r),"division",[a,b]);
}
export function parity(a:number,b:number,product=false,diff=false):Q{
 const pa=a%2,pb=b%2,A=pa?`2m+${a}`:`2m+${a}`,B=`2n+${b}`;
 const value=product?pa*pb:(pa+pb)%2,label=value?"奇数":"偶数";
 const inner=product?`2mn+${b}m+${a}n+${Math.floor(a*b/2)}`:diff?`m-n+${(a-b-value)/2}`:`m+n+${(a+b-value)/2}`;
 return q(m`$m,n$ は整数です。$(${A})${product?"\\times":diff?"-":"+"}(${B})$ が偶数か奇数かを、式を変形して説明しなさい。`,
 m`${label}です。$2(${inner})${value?"+1":""}$ と表せ、括弧内が整数だからです。`,
 "二倍の整数、または二倍の整数に一を足した形を目指します。",
 m`$(${A})${product?"\\times":diff?"-":"+"}(${B})=2(${inner})${value?"+1":""}$。$m,n$ が整数なので括弧内も整数です。したがって${label}です。`);
}
export function squareRemainder(r:number,d=3):Q{
 const rem=(r*r)%d;
 return q(m`整数 $n$ を $${d}$ で割ると $${r}$ 余ります。$n^2$ を $${d}$ で割った余りを、式で説明しなさい。`,
 m`余りは $${rem}$。$n^2=${d}(${d}k^2+${2*r}k+${Math.floor(r*r/d)})+${rem}$ と書け、括弧内は整数だからです。`,m`$n=${d}k+${r}$ と置き、二乗して $${d}$ の倍数を取り出します。`,
 m`$k$ を整数として $n=${d}k+${r}$ と書けます。$n^2=${d}(${d}k^2+${2*r}k+${Math.floor(r*r/d)})+${rem}$。括弧内は整数で、$0\leqq ${rem}<${d}$ なので余りは $${rem}$。`);
}
export function squareClassification(d:number):Q{
 const residues=range(d),vals=[...new Set(residues.map(r=>r*r%d))].sort((a,b)=>a-b);
 return q(m`整数の平方を $${d}$ で割った余りとして可能なものをすべて答え、余りによる場合分けで説明しなさい。`,
 m`$${vals.join(",")}$。元の余り $${residues.join(",")}$ を全部調べると、平方の余りは順に $${residues.map(r=>r*r%d).join(",")}$ で、これ以外はありません。`,
 "元の整数を割った余りを、零から順に全部調べます。",
 residues.map(r=>m`整数 $k$ に対して $n=${d}k+${r}$ なら $n^2=${d}(${d}k^2+${2*r}k+${Math.floor(r*r/d)})+${r*r%d}$。`).join(" ")+m`元の余りは $${residues.join(",")}$ のいずれかなので、これで全場合です。$n=0,1,\ldots,${d-1}$ で得られた余りは実際に生じます。`);
}
export function oddSquare(k:number):Q{
 const prompt=k===1?m`奇数の平方を $8$ で割った余りが $1$ であることを説明しなさい。`:k===3?m`奇数の平方から $1$ を引くと $8$ の倍数になることを説明しなさい。`:k===5?m`奇数 $n$ について $n^2=8v+1$ となる整数 $v$ があることを説明しなさい。`:k===7?"連続する二つの偶数の積が、八の倍数になることを説明しなさい。":m`奇数 $n$ に対して $(n-1)(n+1)$ が $8$ の倍数になることを説明しなさい。`;
 const working=(k===7?m`連続する二つの偶数を $2u,2u+2$（$u$ は整数）とすると、積は $4u(u+1)$。`:m`奇数を $n=2u+1$（$u$ は整数）と表すと、$n^2-1=(n-1)(n+1)=4u(u+1)$。`)+m`連続する二整数 $u,u+1$ の一方は偶数だから、$u(u+1)=2v$（$v$ は整数）と書けます。よってこの積は $8v$、奇数の平方は $8v+1$ です。`;
 return q(prompt,k===7?m`$(2u)(2u+2)=4u(u+1)$ で、連続整数の積 $u(u+1)$ は偶数だから八の倍数です。`:m`$n^2-1=4u(u+1)$ は八の倍数なので、$n^2=8v+1$（$v$ は整数）。余りは一です。`,
 "連続する二整数の積では、どちらかに必ず二の因数があります。",working);
}
export function digitRule(n:number,d:number):Q{
 const remainder=d===4?n%100:String(n).split("").reduce((s,x)=>s+Number(x),0),ok=n%d===0;
 return checked(q(m`$${n}$ が $${d}$ の倍数か、桁を使った判定の理由も含めて答えなさい。`,
 m`${ok?"倍数です":"倍数ではありません"}。${d===4?"下二桁":"各桁の和"} $${remainder}$ が $${d}$ の倍数${ok?"だから":"でないから"}です。`,
 d===4?"百の位以上の部分は、四の倍数になっています。":"十の累乗と一の差が、割る数の倍数になることを使います。",
 d===4?m`$${n}=100\times${Math.floor(n/100)}+${n%100}$。$100$ は $4$ の倍数なので、下二桁 $${n%100}$ だけを調べればよく、${ok?"割り切れます":"割り切れません"}。`:
 m`$10,100,1000,\ldots$ は $${d}$ で割ると一余ります。各位の数を一に置き換えた各桁和 $${remainder}$ と、元の数の余りは同じです。この和が${ok?"割り切れる":"割り切れない"}ので判定できます。`,+ok),"digit-rule",[n,d]);
}
export function euclid(a:number,b:number):Q{
 const steps:string[]=[];let x=a,y=b;
 while(y){const z=x%y;steps.push(m`$${x}=${y}\times${Math.floor(x/y)}+${z}$`);x=y;y=z;}
 return checked(q(m`$${a}$ と $${b}$ の最大公約数を、ユークリッドの互除法で求めなさい。`,m`$${x}$。`,
 "割る数と余りを次の二数にします。零になったとき、その直前の割る数が答えです。",
 steps.join("、")+m`。余りが零になったので、最後の零でない数 $${x}$ が最大公約数です。`,x),"euclid",[a,b]);
}
export function invariant(a:number,b:number):Q{
 const quo=Math.floor(a/b),r=a%b;
 return q(m`$${a}=${b}\times${quo}+${r}$ を使い、$${a},${b}$ の公約数と $${b},${r}$ の公約数が同じになる理由を、両方向から説明しなさい。`,
 "元の二数を割る整数は余りも割り、割る数と余りを割る整数は元の数も割るからです。",
 "引き算の形と、足して戻す形の両方を使います。",
 m`$d$ が $${a},${b}$ の公約数なら、差 $${a}-${b}\times${quo}=${r}$ も $d$ で割り切れます。逆に $d$ が $${b},${r}$ を割るなら、和 $${b}\times${quo}+${r}=${a}$ も割ります。したがって公約数の集合が同じです。`);
}
export function integerSolutions(a:number,b:number,c:number,no=false):Q{
 if(no){const d=gcd(a,b);return q(m`$${a}x+${b}y=${c}$ に整数解はありますか。理由も答えなさい。`,
 m`整数解はありません。左辺は $${d}$ の倍数ですが、右辺 $${c}$ はその倍数ではないからです。`,m`左辺は必ず $${d}$ の倍数です。`,
 m`$x,y$ が整数なら、左辺は $${d}$ の倍数です。右辺 $${c}$ は $${d}$ の倍数でないので、等しくできません。`);}
 const d=gcd(a,b);if(c%d)throw Error("inconsistent equation");
 const A=a/d,B=b/d,C=c/d;let x0=0;while((C-A*x0)%B!==0)x0++;
 const y0=(C-A*x0)/B;
 return checked(q(m`$${a}x+${b}y=${c}$ の整数解をすべて求め、すべての解を表している理由も説明しなさい。`,
 m`$x=${x0}+${B}t,\ y=${y0}-${A}t$（$t$ は整数）。任意の解と $(${x0},${y0})$ の差からこの形が必要になり、逆にすべての整数 $t$ で式が成り立つので、全解です。`,
 "一組の解を探し、元の式との差を取ります。必要なら共通因数で割ります。",
 (d>1?m`まず共通因数 $${d}$ で割り、$${A}x+${B}y=${C}$ とします。`:"")+m`一組の解は $(${x0},${y0})$ です。その解の式を元の式から引くと $${A}(x-${x0})=-${B}(y${y0<0?"+"+(-y0):"-"+y0})$。$${A},${B}$ は互いに素なので $x-${x0}$ は $${B}$ の倍数です。$x-${x0}=${B}t$ と置けば $y=${y0}-${A}t$。逆に任意の整数 $t$ を代入すれば元の式が成り立つので、これですべてです。`),"solutions",[a,b,c,x0,y0,A,B]);
}
export function countSolutions(a:number,b:number,c:number,positive=false):Q{
 const pairs=range(Math.floor(c/b)+1).flatMap(y=>{const x=(c-b*y)/a;return Number.isInteger(x)&&x>=(positive?1:0)&&y>=(positive?1:0)?[[x,y]]:[];});
 return checked(q(m`$${a}x+${b}y=${c}$ を満たす${positive?"正の整数":"非負整数"} $x,y$ の組をすべて求めなさい。${positive?"どちらも零は含めません。":"零個も認めます。"}`,
 pairs.length?pairs.map(([x,y])=>`$(${x},${y})$`).join("、")+"。":"該当する組はありません。",
 "二つの個数の範囲を決め、一方を変えながら他方が整数かを調べます。",
 m`$y$ は $${positive?1:0}$ 以上、$\frac{${c}}{${b}}$ 以下の整数です。各 $y$ について $x=\frac{${c}-${b}y}{${a}}$ を調べます。`+pairs.map(([x,y])=>m`$y=${y}$ では $x=${x}$。`).join(" ")+(pairs.length?"この範囲をすべて調べたので、他の組はありません。":"正の整数となる組はありません。"),pairs.length),"count-solutions",[a,b,c,+positive]);
}
export function decimal(a:number,b:number):Q{
 const d=gcd(a,b),den=b/d;let rem=den;while(rem%2===0)rem/=2;while(rem%5===0)rem/=5;const finite=rem===1;
 return checked(q(m`$\frac{${a}}{${b}}$ は有限小数で表せますか。約分してから理由を説明しなさい。`,finite?`有限小数です。既約分母に含まれる素因数が二と五だけだからです。`:"有限小数では表せず、循環小数になります。既約分母に二・五以外の素因数が残るからです。",
 "最初に約分します。約分前の分母だけでは判定できません。",
 m`$\frac{${a}}{${b}}=${f(a,b)}$。既約分母は $${den}$。`+(finite?m`$10$ の累乗を分母にできるので、有限小数になります。整数なら小数部分が零で終わります。`:"十の累乗を分母にできません。割り算の余りは有限種類で、零で終わらなければ同じ余りが繰り返されるので循環します。"),+finite),"decimal",[a,b]);
}
export function recurring(n:number):Q{
 const digits=String(n).length,den=10**digits-1;
 return q(m`小数点以下で数字列「${n}」を最初から繰り返す循環小数を、分数で表しなさい。`,
 m`$${f(n,den)}$。`,"繰り返す桁数だけ小数点を動かし、元の式を引きます。",
 m`この数を $x$ とすると、$${10**digits}x$ と $x$ の小数部分は同じになります。引いて $${den}x=${n}$。よって $x=${f(n,den)}$。`);
}
export function binary(n:number,toBinary=false):Q{
 const bits=n.toString(2),terms=bits.split("").map((b,i)=>`${b}\\times2^{${bits.length-1-i}}`).join("+"),steps:string[]=[];let a=n;
 while(a){steps.push(m`$${a}=2\times${Math.floor(a/2)}+${a%2}$`);a=Math.floor(a/2);}
 return checked(q(toBinary?m`十進法の $${n}$ を二進法で表しなさい。`:m`二進法の $${bits}_{(2)}$ を十進法で表しなさい。`,
 toBinary?m`$${bits}_{(2)}$。`:m`$${n}$。`,
 toBinary?"二で割った余りを、最後から逆順に読みます。":"右端から、一・二・四・八という桁の重みを掛けます。",
 toBinary?steps.join("、")+m`。最初の余りが一の位なので、逆順に読んで $${bits}_{(2)}$。`:
 m`$${bits}_{(2)}=${terms}=${n}$。零の桁も位置を保って計算します。`,n),toBinary?"binary-encode":"binary-decode",[n]);
}
export function binaryAdd(a:number,b:number):Q{
 const bitsA=a.toString(2),bitsB=b.toString(2),steps:string[]=[];let carry=0;
 for(let pos=0;pos<Math.max(bitsA.length,bitsB.length)||carry;pos++){
  const x=Number(bitsA.at(-1-pos)??0),y=Number(bitsB.at(-1-pos)??0),sum=x+y+carry;
  steps.push(m`右から $${pos+1}$ 桁目は $${x}+${y}+${carry}=${sum}$。この桁に $${sum%2}$ を書き、次へ $${Math.floor(sum/2)}$ を送ります。`);
  carry=Math.floor(sum/2);
 }
 return checked(q(m`二進法で $${a.toString(2)}_{(2)}+${b.toString(2)}_{(2)}$ を計算し、繰り上がりの理由も書きなさい。`,
 m`$${(a+b).toString(2)}_{(2)}$。同じ位が二個になると、一つ上の位の一個に繰り上がります。`,
 "一と一で、今の位は零、次の位に一を送ります。",
 steps.join(" ")+m`結果は $${(a+b).toString(2)}_{(2)}$。十進法で確認すると $${a}+${b}=${a+b}$ です。`,a+b),"binary-add",[a,b]);
}
export function coordinate(x:number,y:number,z:number,axes=false):Q{
 const vals=[x,y,z],planes=vals.flatMap((v,i)=>v===0?[["yz","xz","xy"][i]]:[]),ax=vals.flatMap((_,i)=>vals.every((v,j)=>i===j||v===0)?[["x","y","z"][i]]:[]);
 return q(m`空間の直交座標で点 $(${x},${y},${z})$ が属する${axes?"座標軸":"座標平面"}をすべて答えなさい。`,
 (axes?ax:planes).length?(axes?ax:planes).map(v=>`$${v}$ ${axes?"軸":"平面"}`).join("、")+"。":"どれにも属しません。",
 axes?"軸上なら、残る二つの座標が零です。":"座標平面では、それに垂直な方向の座標が零です。",
 m`$x=${x},y=${y},z=${z}$ を一つずつ確認します。`+(axes?"二成分が零なら残りの成分の軸上です。三成分とも零の原点は、すべての座標軸上です。":"一成分が零なら、その成分を使わない座標平面上です。原点は三つすべての座標平面に属します。"));
}
export function tiling(a:number,b:number):Q{
 const d=gcd(a,b),count=a*b/(d*d);
 return checked(q(m`縦 $${a}$ cm、横 $${b}$ cm の長方形を、各辺に平行な同じ大きさの正方形で隙間なく敷き詰めます。正方形の一辺を最も長くしたときの長さと枚数を求めなさい。`,
 m`一辺 $${d}$ cm、$${count}$ 枚。`,
 "縦も横も割り切る最大の長さを求めます。",
 m`一辺は最大公約数 $${d}$ cm。縦に $${a/d}$ 枚、横に $${b/d}$ 枚なので $${a/d}\times${b/d}=${count}$ 枚です。`,count),"tiling",[a,b]);
}
export function stones(n:number):Q{
 const r=n%3;
 return q(m`石が $${n}$ 個あります。二人で交互に一個または二個取り、最後を取った人の勝ちです。先手に必ず勝つ方法はありますか。相手も最善を尽くすとして、理由と、ある場合は最初の手を答えなさい。`,
 r?m`あります。最初に $${r}$ 個取り、その後は相手と合わせて三個になるように取ります。相手に毎回三の倍数個を渡せるので、最後を自分で取れます。`:"ありません。相手が二人の合計を三個にするように返すと、自分の手番に三の倍数個が残り続け、最後も相手が取れるからです。",
 "自分の手番で三の倍数個残る場合と、それ以外の場合を比べます。",
 r?m`最初に $${r}$ 個取り、相手に三の倍数個を渡します。相手が一個なら二個、二個なら一個と返せば、相手には再び三の倍数個が残ります。この方法で最後の三個も自分が取り切ります。`:
 "先手が一個でも二個でも取ると、後手は二人の合計が三個になるように返せます。先手の手番には再び三の倍数個が残り、最後の三個でも後手が取り切れます。");
}
export const integerPrep=[
 skill("multiply-prep","積を確かめる","因数を調べる前に積を確認します。",q("$3\\times4$ を計算しなさい。","$12$。","同じ数ずつ足す計算です。","$3\\times4=12$。"),[3,4,5].map(n=>q(m`$${n}\times6$ を計算しなさい。`,m`$${6*n}$。`,"同じ数ずつ足す計算です。",m`$${n}\times6=${6*n}$。`))),
 skill("division-prep","正の整数の割り算を確かめる","商と余りで元の数に戻せるかを見ます。",division(17,5),[division(19,4),division(23,6),division(28,5)])
];
