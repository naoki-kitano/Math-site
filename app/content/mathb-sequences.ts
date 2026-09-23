import {B,S,m,q,f,nums,checked,finish} from "./mathb-authoring";
const chapter="数列と和",sec=["基本の数列と和","Σと和の公式","和を求める工夫"];
function term(n:number,shift=false){
 const v=2*(shift?n+1:n)-1;
 return checked(shift?"term-next":"term",[n],v,m`$a_n=2n-1$ とします。$${shift?`a_{${n}+1}`:`a_{${n}}`}$ を求め、添字の意味も答えなさい。`,m`第 $${shift?n+1:n}$ 項で、値は $${v}$。`,"添字は何番目かを表します。項に数を掛ける意味ではありません。",m`一般項の $n$ に $${shift?n+1:n}$ を入れると $2\times${shift?n+1:n}-1=${v}$。`);
}
function arithmetic(n:number,sum=false){
 const a=n%2?3:7,d=n%2?2:-1,v=sum?n*(2*a+(n-1)*d)/2:a+(n-1)*d;
 return checked(sum?"arithmetic-sum":"arithmetic",[a,d,n],v,m`初項 $${a}$、公差 $${d}$ の等差数列の${sum?m`初項から第 $${n}$ 項までの和`:m`第 $${n}$ 項`}を求めなさい。`,m`$${v}$。`,sum?"項数と末項を先に確かめ、両端の和を使います。":"初項から何回、公差を加えるか数えます。",m`第 $${n}$ 項は $${a}+(${n}-1)\times(${d})=${a+(n-1)*d}$。`+(sum?m`したがって和は $\frac{${n}\{${a}+(${a+(n-1)*d})\}}{2}=${v}$。`:""));
}
function findDiff(n:number){
 const i=2,j=5,d=n-5,a=3,v=d;
 return checked("difference",[a,d,i,j],v,m`等差数列で $a_2=${a+d},a_5=${a+4*d}$ です。公差と初項を求めなさい。`,m`公差 $${d}$、初項 $${a}$。`,"第2項から第5項までは、差を3回加えます。",m`$a_5-a_2=3d$ なので $d=\frac{${3*d}}{3}=${d}$。$a_1=a_2-d=${a}$。`);
}
function intervalSum(n:number){
 const start=3,end=n+3,v=(n+1)*(start+end)/2;
 return checked("interval-sum",[start,end],v,m`$${start}+${start+1}+\cdots+${end}$ の項数と和を求めなさい。`,m`項数 $${n+1}$、和 $${v}$。`,"最後の数を項数と決めつけず、最初と最後を含めて数えます。",m`項数は $${end}-${start}+1=${n+1}$。和は $\frac{(${start}+${end})\times${n+1}}{2}=${v}$。`);
}
function geometric(n:number,sum=false){
 const a=2,r=n%2?-2:1/2,k=n,v=sum?a*(1-r**k)/(1-r):a*r**(k-1),ratio=r<0?"-2":m`\frac12`,answer=r<0?String(v):f(sum?4*(2**k-1):4,2**k);
 return checked(sum?"geometric-sum":"geometric",[a,r,k],v,m`初項 $${a}$、公比 $${ratio}$ の等比数列の${sum?m`初項から第 $${k}$ 項までの和`:m`第 $${k}$ 項`}を求めなさい。`,m`$${answer}$。`,sum?"和を公比倍した式と引き算します。":"初項に公比を掛ける回数は、項番号より一つ少なくなります。",sum?m`$S=2+2(${ratio})+\cdots+2(${ratio})^{${k-1}}$。$S-(${ratio})S=2-2(${ratio})^{${k}}$ より $S=\frac{2\{1-(${ratio})^{${k}}\}}{1-(${ratio})}=${answer}$。`:m`$a_{${k}}=2(${ratio})^{${k-1}}=${answer}$。`);
}
// A varying initial term avoids duplicate prompts when the exponent repeats.
function geoRatio(n:number){
 const a=n,r=n%2?-1:2;
 return q(m`数列 $${a},${a*r},${a*r*r},${a*r*r*r},\ldots$ は、この後も同じ数を掛けて続きます。公比と一般項を求めなさい。`,m`公比 $${r}$、$a_n=${a}(${r})^{n-1}$。`,"次の項を前の項で割り、同じ比か確かめます。",m`$\frac{${a*r}}{${a}}=${r}$。初項に公比を $n-1$ 回掛けます。`);
}
function constantSum(n:number){
 return q(m`初項 $${n}$、公比 $1$ の等比数列の初項から第 $6$ 項までの和を求めなさい。`,m`$${6*n}$。`,"すべて同じ値になります。分母が零になる公式は使いません。",m`各項が $${n}$ なので $S_6=6\times${n}=${6*n}$。`);
}
function sigma(n:number,constant=false){
 const v=constant?(n-1)*3:n*(n+1)/2-1;
 return checked(constant?"sigma-constant":"sigma",[n],v,m`$\sum_{k=2}^{${n}}${constant?"3":"k"}$ を省略せずに書いて計算しなさい。`,m`$${Array.from({length:n-1},(_,i)=>constant?3:i+2).join("+")}=${v}$。`,"下端から上端まで、添字に一つずつ整数を入れます。",m`$k=2,3,\ldots,${n}$ の $${n-1}$ 項を足します。`+(constant?m`定数 $3$ も $${n-1}$ 回足すので $3\times${n-1}=${v}$。`:m`$\frac{${n}(${n}+1)}{2}-1=${v}$。`));
}
function powers(n:number,cube=false){
 const v=cube?(n*(n+1)/2)**2:n*(n+1)*(2*n+1)/6;
 return checked(cube?"cube-sum":"square-sum",[n],v,m`$\sum_{k=1}^{${n}}k^{${cube?3:2}}$ を求めなさい。`,m`$${v}$。`,"項そのものを二乗・三乗した和です。和を二乗したものと混同しません。",cube?m`立方和の公式から $\left\{\frac{${n}(${n}+1)}{2}\right\}^2=${v}$。`:m`平方和の公式から $\frac{${n}(${n}+1)(2\times${n}+1)}{6}=${v}$。`);
}
function mixedPower(n:number){
 const v=2*n*(n+1)*(2*n+1)/6-n*(n+1)/2;
 return checked("mixed-power",[n],v,m`$\sum_{k=1}^{${n}}(2k^2-k)$ を求めなさい。`,m`$${v}$。`,"足し算と引き算を分け、定数倍を和の外へ出します。",m`$2\sum_{k=1}^{${n}}k^2-\sum_{k=1}^{${n}}k=2\cdot\frac{${n}(${n}+1)(2\cdot${n}+1)}6-\frac{${n}(${n}+1)}2=${v}$。`);
}
function difference(n:number,which=false){
 const a=which?2:1,v=which?2+n*(n-1):n*n;
 return checked(which?"difference-even":"difference-odd",[n],v,m`$a_1=${a}$、$a_{k+1}-a_k=${which?"2k":"2k+1"}$ です。$a_{${n}}$ を求めなさい。`,m`$${v}$。`,m`第 $1$ 項から第 $n$ 項までには、$n-1$ 個の差があります。`,m`$a_{${n}}=a_1+\sum_{k=1}^{${n-1}}(${which?"2k":"2k+1"})=${a}+${which?n*(n-1):n*n-1}=${v}$。差の最後の添字は $${n-1}$ です。`);
}
function split(n:number,wide=false){
 const d=wide?2:1;
 return q(m`$\frac{${n}}{k(k+${d})}$ を二つの分数の差に直し、通分して確かめなさい。ただし $k$ は正の整数です。`,m`$${f(n,d)}\left(\frac{1}{k}-\frac{1}{k+${d}}\right)$。`,"分子を引き算して、元の分子になる係数を決めます。",m`$\frac{1}{k}-\frac{1}{k+${d}}=\frac{${d}}{k(k+${d})}$。これを $${f(n,d)}$ 倍します。$k>0$ なので両分母は零ではありません。`);
}
function telescope(n:number,wide=false){
 const d=wide?2:1,v=wide?(1+1/2-1/(n+1)-1/(n+2))/2:1-1/(n+1);
 const terms=n===2?m`(1-\frac1{${1+d}})+(\frac12-\frac1{${2+d}})`:m`(1-\frac1{${1+d}})+(\frac12-\frac1{${2+d}})+\cdots+(\frac1{${n}}-\frac1{${n+d}})`;
 return checked(wide?"telescoping-wide":"telescoping",[n],v,m`$\sum_{k=1}^{${n}}\frac{1}{k(k+${d})}$ を求めなさい。`,wide?m`$\frac12\left(1+\frac12-\frac{1}{${n+1}}-\frac{1}{${n+2}}\right)$。`:m`$${f(n,n+1)}$。`,"分数の差に直したら、先頭と末尾の数項を実際に書きます。",m`$\frac{1}{k(k+${d})}=${f(1,d)}\left(\frac1k-\frac1{k+${d}}\right)$。`+(wide?m`$\frac12\{${terms}\}$ で、初めの二つと最後の二つが残ります。`:m`$${terms}=1-\frac1{${n+1}}=${f(n,n+1)}$。`));
}
function weighted(n:number,half=false){
 const r=half?1/2:2,v=half?2-(n+2)/2**n:(n-1)*2**(n+1)+2;
 return checked(half?"weighted-half":"weighted",[n],v,m`$S=\sum_{k=1}^{${n}}k${half?m`\left(\frac12\right)^k`:"2^k"}$ を求めなさい。`,m`$${half?f(2**(n+1)-n-2,2**n):v}$。`,m`$S$ と公比倍した $S$ を、同じべきの項が縦にそろうように書きます。`,m`$S-${f(r*2,2)}S=\sum_{k=1}^{${n}}${half?m`\left(\frac12\right)^k`:"2^k"}-${n}${half?m`\left(\frac12\right)^{${n+1}}`:m`\cdot2^{${n+1}}`}$。`+(half?m`$\frac12 S=1-\frac1{2^{${n}}}-\frac{${n}}{2^{${n+1}}}$。両辺を $2$ 倍し $S=2-\frac{${n+2}}{2^{${n}}}$。`:m`$-S=(2^{${n+1}}-2)-${n}\cdot2^{${n+1}}$ より $S=(${n}-1)2^{${n+1}}+2=${v}$。`));
}
export const sequenceBanks=[
 B(chapter,"sequence-terms","項と添字","何番目かと、その場所にある数を区別します。",[m`順に並べた数を数列といいます。$a_n$ は第 $n$ 項で、$a$ と $n$ の積ではありません。`,m`$a_n=2n-1$ なら $a_1=1,a_2=3,a_3=5$。$a_{n+1}$ は一つ後の項、$a_n+1$ は今の項に一を足した数です。`],"添字を先に読み、一般項の文字へ代入します。",[S("term","指定された項","添字が表す場所を決めます。",nums.map(n=>term(n))),S("next","一つ後の項","添字全体を代入します。",nums.map(n=>term(n,true)))],sec[0]),
 B(chapter,"arithmetic","等差数列","隣の項までの差を使って、離れた項を求めます。",[m`隣り合う項の差が一定の数列が等差数列です。その差を公差 $d$ といいます。`,m`初項を $a$ とすると $a_n=a+(n-1)d$。第 $n$ 項までには $n-1$ 回の移動があるためです。公差が負でも同じです。`],m`$a_j-a_i=(j-i)d$。項番号の差が、公差を足す回数です。`,[S("term","初項と公差から項へ","足す回数を数えます。",nums.map(n=>arithmetic(n))),S("recover","二つの項から公差へ","値の差を、番号の差で割ります。",nums.map(findDiff))],sec[0]),
 B(chapter,"arithmetic-sum","等差数列の和","逆順に並べた和と合わせて考えます。",[m`$S_n=a_1+\cdots+a_n$ と逆順の和を足すと、各組が $a_1+a_n$ になります。`,m`したがって $2S_n=n(a_1+a_n)$、$S_n=\frac{n(a_1+a_n)}2$。両端の平均に項数を掛けた式でもあります。`],"上端の数と項数は同じとは限りません。",[S("sum","初項からの和","末項を求めてから、両端の和を使います。",nums.map(n=>arithmetic(n,true))),S("count","途中からの和","両端を含む項数を先に数えます。",nums.map(intervalSum))],sec[1]),
 B(chapter,"geometric","等比数列","同じ数を掛けて進む規則を式にします。",[m`次の項が前の項の $r$ 倍になる数列を等比数列といい、$r$ を公比といいます。`,m`公比 $r\ne0$ なら、初項 $a$ から $n-1$ 回掛けるので $a_n=ar^{n-1}$。公比が負なら符号が交互に変わります。公比が零なら初項の次からはすべて零です。前の項が零のとき、割り算で公比を調べることはできません。`],m`$a_{n+1}=ra_n$ という関係を確かめます。`,[S("term","公比から項へ","掛けた回数を指数にします。",nums.map(n=>geometric(n))),S("ratio","並びから一般項へ","前の項が非零であることを確かめて比を求めます。",nums.map(geoRatio))],sec[0]),
 B(chapter,"geometric-sum","等比数列の和","公比倍した和との差から、残る項を調べます。",[m`$S_n=a+ar+\cdots+ar^{n-1}$ を $r$ 倍すると $rS_n=ar+\cdots+ar^n$。引くと $(1-r)S_n=a(1-r^n)$ です。`,m`$r\ne1$ なら $S_n=\frac{a(1-r^n)}{1-r}$。$r=1$ のときは割れないので、同じ項を $n$ 個足して $S_n=na$ とします。`],"公式の分母が零にならないか確認します。",[S("sum","公比が一でない和","公比倍した式を引きます。",nums.map(n=>geometric(n,true))),S("one","公比が一の和","同じ値が続くことに戻ります。",nums.map(constantSum))],sec[1]),
 B(chapter,"sigma","和の記号と添字","足すものと、添字が動く範囲を読み分けます。",[m`$\sum_{k=1}^{n}a_k$ は $a_1+a_2+\cdots+a_n$ の省略記号です。$k$ は足すときに動かす番号です。`,m`$\sum_{k=p}^{q}c=(q-p+1)c$。定数も項の数だけ足します。和は $\sum(au_k+bv_k)=a\sum u_k+b\sum v_k$ と分けられます。`],"迷ったら省略記号をほどいて書きます。",[S("expand","添字を順に入れる","下端から上端まで含めます。",nums.map(n=>sigma(n))),S("constant","定数を足す","定数が現れる回数を数えます。",nums.map(n=>sigma(n,true)))],sec[1]),
 B(chapter,"power-sums","平方・立方の和","二乗した項の和と、和の二乗を区別します。",[m`$\sum_{k=1}^n k=\frac{n(n+1)}2$、$\sum_{k=1}^n k^2=\frac{n(n+1)(2n+1)}6$、$\sum_{k=1}^n k^3=\left\{\frac{n(n+1)}2\right\}^2$。`,m`平方和は $(k+1)^3-k^3=3k^2+3k+1$ を足すと導けます。立方和は $\{\frac{k(k+1)}2\}^2-\{\frac{(k-1)k}2\}^2=k^3$ を足すと途中が消えます。`,m`例えば $1^2+2^2=5$ ですが $(1+2)^2=9$。式全体の括弧を見ます。`],"何をべき乗してから足すか確認します。",[S("square","平方の和","平方和の公式の上端を確認します。",nums.map(n=>powers(n))),S("cube","立方の和","立方和の公式を使います。",nums.map(n=>powers(n,true)))],sec[1]),
 B(chapter,"differences","階差数列","隣り合う項の差を足して、元の項へ戻します。",[m`$a_{k+1}-a_k$ を並べたものが階差数列です。差を足すと途中の項が消えます。`,m`$a_n=a_1+\sum_{k=1}^{n-1}(a_{k+1}-a_k)$ は $n\ge2$ で使い、初項は別に確かめます。`,m`数個の項から規則を予想することはできますが、その先が一意に決まるとは限りません。問題に与えられた規則を使います。`],"差を足す範囲は、求める項の一つ手前までです。",[S("odd","奇数の階差","初項に、必要な個数の差を加えます。",nums.map(n=>difference(n))),S("even","偶数の階差","階差の最終番号を確かめます。",nums.map(n=>difference(n,true)))],sec[2]),
 B(chapter,"partial-fractions","部分分数分解","分数を差に直し、通分して元へ戻るか確かめます。",[m`$\frac1{k(k+1)}=\frac1k-\frac1{k+1}$。右辺を通分すると分子が $(k+1)-k=1$ になります。`,m`$\frac1{k(k+2)}=\frac12(\frac1k-\frac1{k+2})$。間隔が二なら分子も二になるため、係数が必要です。`],"分母だけを見て分けず、分子が一致することまで確認します。",[S("adjacent","隣り合う因数","分母をそろえて分子の差を見ます。",nums.map(n=>split(n))),S("gap","二つ離れた因数","通分後の係数を調整します。",nums.map(n=>split(n,true)))],sec[2]),
 B(chapter,"telescoping","差に直して求める和","途中で消える項と、端に残る項を見分けます。",[m`$\sum_{k=1}^n(b_k-b_{k+1})=b_1-b_{n+1}$。先頭・末尾を実際に書くと消える理由が分かります。`,m`二つ先との引き算では、端に二項ずつ残ります。どちらも正の整数の範囲で、分母が零でないことを確かめます。`],"消えることを確認する前に、すべての項を消してはいけません。",[S("one","一つ先との差","部分分数へ直し、端を残します。",nums.map(n=>telescope(n))),S("two","二つ先との差","二項ずつ残る境界を確かめます。",nums.map(n=>telescope(n,true)))],sec[2]),
 B(chapter,"weighted-geometric","等差数列と等比数列の積の和","公比倍して引くと、係数の差が一定になります。",[m`$S=\sum_{k=1}^n kr^k$ では、$rS$ の指数を一つずらすと、同じ指数の係数の差が一になります。`,m`$(1-r)S=\sum_{k=1}^n r^k-nr^{n+1}$。末尾の項を忘れず、残りの等比和を計算します。ここでは $r\ne1$ を扱います。`],"同じ指数の項をそろえてから引き算します。",[S("grow","公比が二の和","元の和と二倍した和を比べます。",nums.map(n=>weighted(n))),S("decay","公比が分数の和","分数の公比でも同じ指数をそろえます。",nums.map(n=>weighted(n,true)))],sec[2])
];
for(const b of sequenceBanks)if(["mb-arithmetic-sum","mb-geometric-sum"].includes(b.lesson.slug))b.lesson.section=sec[0];
const powersBank=sequenceBanks.find(b=>b.lesson.slug==="mb-power-sums")!;
const mixed=S("combine","和を分けて計算する","分配法則で和を分け、平方和と自然数の和を使います。",nums.map(mixedPower));
// Rebuild this new lesson before registration so its additional decision gets its own repair.
const extended=B(chapter,"power-sums",powersBank.lesson.title,powersBank.lesson.description,powersBank.lesson.introduction,powersBank.lesson.rule,[...powersBank.skills,mixed],sec[1]);
sequenceBanks[sequenceBanks.indexOf(powersBank)]=extended;
export const sequenceChapter=finish(chapter,"sequences",sequenceBanks,sec);
