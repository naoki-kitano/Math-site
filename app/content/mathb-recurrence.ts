import {B,S,m,q,nums,checked,finish} from "./mathb-authoring";
const chapter="漸化式と数学的帰納法",sec=["隣の項から次の項へ","和と項の関係","すべての自然数への証明"];
const update=(a:number,multiply=false)=>{
 const r=multiply?2:1,d=multiply?1:3,values=[a];
 for(let i=0;i<3;i++)values.push(r*values.at(-1)!+d);
 return checked("recurrence-values",[a,r,d],values[3],m`$a_1=${a},\ a_{n+1}=${multiply?"2":""}a_n+${d}\ (n\ge1)$ から、第 $4$ 項まで書きなさい。`,m`$${values.join(",")}$。`,"直前の項を求めてから、それを次の式に入れます。",values.slice(1).map((v,i)=>m`$a_{${i+2}}=${r}\times${values[i]}+${d}=${v}$。`).join(" "));
};
const accumulated=(a:number,odd=false)=>q(m`$a_1=${a},\ a_{n+1}=a_n+${odd?"2n+1":"n"}\ (n\ge1)$ の一般項を求めなさい。`,
 odd?m`$a_n=${a}+n^2-1\ (n\ge1)$。`:m`$a_n=${a}+\frac{n(n-1)}2\ (n\ge1)$。`,
 "隣との差を、初項から足し戻します。初項にも式が合うか確かめます。",
 m`$n\ge2$ では $a_n-a_1=\sum_{k=1}^{n-1}(${odd?"2k+1":"k"})=${odd?"n^2-1":m`\frac{n(n-1)}2`}$。$n=1$ にも代入して $a_1=${a}$ となるので全範囲で使えます。`);
const affine=(a:number,negative=false)=>{
 const p=negative?-2:2,c=negative?3:1,L=negative?1:-1;
 const shift=negative?"-1":"+1",coefficient=a-L;
 const result=negative?m`${coefficient===1?"":coefficient}(-2)^{n-1}+1`:m`${coefficient}\cdot2^{n-1}-1`;
 return q(m`$a_1=${a},\ a_{n+1}=${p}a_n+${c}\ (n\ge1)$ の一般項を求めなさい。`,
 m`$a_n=${result}\ (n\ge1)$。`,
 "次の項になっても変わらない数を探し、それとの差を新しい数列にします。",
 m`$L=${p}L+${c}$ を解くと $L=${L}$。したがって $a_{n+1}${shift}=${p}(a_n${shift})$。$b_n=a_n${shift}$ は初項 $${coefficient}$、公比 $${p}$ の等比数列です。最後に $a_n$ へ戻し、$a_n=${result}$。$n=1$ で $a_1=${a}$ となり、元の漸化式にも代入して成立します。`);
};
const fromSum=(c:number,linear=false)=>{
 const expr=linear?`${c}n+1`:`n^2+${c}n`;
 return q(m`$S_n=a_1+\cdots+a_n=${expr}\ (n\ge1)$ のとき一般項を求めなさい。`,
 linear?m`$a_1=${c+1}$、$n\ge2$ では $a_n=${c}$。`:m`$a_n=2n+${c-1}\ (n\ge1)$。`,
 m`初項は $S_1$ です。二項目以降は隣り合う和の差を取ります。`,
 m`$a_1=S_1=${linear?c+1:c+1}$。$n\ge2$ では $a_n=S_n-S_{n-1}=${linear?m`(${c}n+1)-\{${c}(n-1)+1\}=${c}`:m`n^2+${c}n-\{(n-1)^2+${c}(n-1)\}=2n+${c-1}`}$。`+(linear?"この式を初項に使うと合わないので分けます。":"この式は初項にも合うのでまとめられます。"));
};
const inductionSum=(d:number,geo=false)=>q(geo?m`すべての正の整数 $n$ について $1+${d}+\cdots+${d}^{n-1}=\frac{${d}^n-1}{${d-1}}$ を数学的帰納法で証明しなさい。`:m`すべての正の整数 $n$ について $\sum_{j=1}^n(${d}j)=\frac{${d}n(n+1)}2$ を数学的帰納法で証明しなさい。`,
 geo?m`$n=1$ で両辺 $1$。$n=k$ の成立を仮定すると、次の左辺は $\frac{${d}^k-1}{${d-1}}+${d}^k=\frac{${d}^{k+1}-1}{${d-1}}$。よって次も成立し、数学的帰納法によりすべての正の整数で成立します。`:m`$n=1$ で両辺 $${d}$。$n=k$ の成立を仮定すると、次の左辺は $\frac{${d}k(k+1)}2+${d}(k+1)=\frac{${d}(k+1)(k+2)}2$。よって次も成立し、すべての正の整数で成立します。`,
 m`初めの場合を確認し、$n=k$ の等式を使って、左辺に次の一項を加えます。`,
 geo?m`$n=1$ では両辺 $1$。$n=k$ で成立すると仮定すると、$n=k+1$ の左辺は $\frac{${d}^k-1}{${d-1}}+${d}^k=\frac{${d}^{k+1}-1}{${d-1}}$。これは次の右辺です。以上よりすべての正の整数で成立。`:m`$n=1$ では両辺 $${d}$。$n=k$ で成立すると仮定すると、次の左辺は $\frac{${d}k(k+1)}2+${d}(k+1)=\frac{${d}(k+1)(k+2)}2$。次の右辺に一致するので成立。`);
const divisibility=(a:number)=>q(m`正の整数 $n$ について $${a}^n-1$ が $${a-1}$ の倍数であることを、数学的帰納法で示しなさい。`,
 m`$n=1$ では $${a}-1=${a-1}$。$${a}^k-1$ が $${a-1}$ の倍数と仮定すると、$${a}^{k+1}-1=${a}(${a}^k-1)+(${a-1})$ も倍数の和です。数学的帰納法により、すべての正の整数で成立します。`,
 "次の式の中に、仮定した式の定数倍を作ります。",
 m`$n=1$ は成立。$${a}^k-1=(${a-1})t$（$t$ は整数）とすると、$${a}^{k+1}-1=${a}(${a}^k-1)+(${a-1})=(${a-1})(${a}t+1)$。最後の括弧も整数。したがって次も成立。`);
const bernoulli=(a:number)=>q(m`正の整数 $n$ について $${a+1}^n\ge1+${a}n$ を数学的帰納法で証明しなさい。`,
 m`$n=1$ では等号。$n=k$ の成立を仮定し、正の $${a+1}$ を掛けると、$${a+1}^{k+1}\ge1+${a}(k+1)+${a*a}k\ge1+${a}(k+1)$。$k\ge1$ より余分な項は非負。数学的帰納法により成立します。`,
 "不等式を掛ける数の符号と、余分な項の符号を確かめます。",
 m`$n=1$ は両辺 $${a+1}$。$${a+1}^k\ge1+${a}k$ と仮定。正の $${a+1}$ を掛けると $${a+1}^{k+1}\ge(${a+1})(1+${a}k)=1+${a}(k+1)+${a*a}k\ge1+${a}(k+1)$。$k\ge1$ なので最後の余分な項は非負です。`);
export const recurrenceBanks=[
 B(chapter,"recurrence","漸化式と初項","次の項を作る規則を、一段ずつ使います。",[m`漸化式は、前後の項の関係を表す式です。$a_{n+1}=a_n+3$ だけでは初めの値は決まりません。`,m`初項も与えれば $a_1$ から $a_2,a_3,\ldots$ と順に求められます。$a_{n+1}$ を求める式の右辺には、まだ求めていない次の項ではなく $a_n$ を入れます。`],"初項と、規則を使える添字の範囲を確認します。",[S("add","一定の差で更新する","直前の項に差を加えます。",nums.map(n=>update(n))),S("multiply-add","掛けてから足す更新","操作の順序を保って次の項を作ります。",nums.map(n=>update(n,true)))],sec[0]),
 B(chapter,"recurrence-difference","差を足して解く漸化式","増える量が変わるときも、隣との差から考えます。",[m`$a_{n+1}=a_n+n$ なら、増える量は $1,2,3,\ldots$ です。元の数列を等差数列と取り違えないようにします。`,m`$a_n=a_1+\sum_{k=1}^{n-1}(a_{k+1}-a_k)$ へ直せば、既に学んだ和が使えます。`],"和で求めた式を、初項と漸化式の両方で確かめます。",[S("linear","自然数の差を足す",m`差を $n-1$ 個足します。`,nums.map(n=>accumulated(n))),S("odd","奇数の差を足す","添字をそろえて和にします。",nums.map(n=>accumulated(n,true)))],sec[0]),
 B(chapter,"affine-recurrence","定数を引いて解く漸化式","変わらない値との差を取ると、等比数列になります。",[m`$a_{n+1}=pa_n+q$（$p\ne1$）では、$L=pL+q$ を満たす定数を探します。`,m`引き算すると $a_{n+1}-L=p(a_n-L)$。そこで $b_n=a_n-L$ と置くと等比数列です。$p=1$ は差が一定なので等差数列として解きます。`],"置き換えた数列の初項も求め、最後に元へ戻します。",[S("positive","正の公比への置き換え","定数項を消す差を作ります。",nums.map(n=>affine(n))),S("negative","負の公比への置き換え","符号を含めて等比数列の式を使います。",nums.map(n=>affine(n,true)))],sec[0]),
 B(chapter,"sum-to-term","和から一般項へ","一つ前までの和を引くと、最後の一項が残ります。",[m`$S_n=a_1+\cdots+a_n$ なら $a_1=S_1$、$n\ge2$ では $a_n=S_n-S_{n-1}$。`,m`$S_n$ の公式が正の整数にしか与えられていないなら、勝手にその式を $S_0$ に使ってはいけません。初項を別に調べます。`],"二項目以降の式が初項にも合うか確認してからまとめます。",[S("joins","初項にも合う式","隣の和の差を取り、初項と照合します。",nums.map(n=>fromSum(n))),S("separate","初項を分ける式","式を使える範囲を守ります。",nums.map(n=>fromSum(n,true)))],sec[1]),
 B(chapter,"induction-identities","数学的帰納法による等式の証明","初めの場合と、次へ進む仕組みを示します。",[m`数学的帰納法は、初めの成立と「$n=k$ の成立から $n=k+1$ の成立」を組み合わせた証明です。`,m`数例だけの確認ではすべての自然数の証明になりません。次の式を最初から正しいと置くのではなく、仮定した式を使って導きます。`],"次へ加わる一項を書き、目標の右辺へ変形します。",[S("sum","和の等式を証明する","仮定した和に次の一項を加えます。",nums.map(n=>inductionSum(n))),S("geometric","等比和を証明する","指数が増えた最後の項を加えます。",nums.map(n=>inductionSum(n,true)))],sec[2]),
 B(chapter,"induction-properties","整数・不等式の帰納法","仮定を使える形を作り、条件を確かめて進めます。",[m`倍数の証明では「ある整数の倍数」という形を保ちます。不等式では掛ける数の符号が必要です。`,m`仮定から結論へのつながりだけでなく、最初の成立も必要です。例えば $a_{n+1}=2a_n$ でも、初項を指定しないと $a_n=2^{n-1}$ とは決まりません。`],"何を仮定し、どの条件で次へ進むかを言葉と式で書きます。",[S("divisibility","倍数であることを示す","仮定した式の定数倍を見つけます。",nums.map(n=>divisibility(n===2?10:n))),S("inequality","不等式を示す","正の数を掛け、非負の余分な項を除きます。",nums.map(bernoulli))],sec[2])
];
export const recurrenceChapter=finish(chapter,"recurrence",recurrenceBanks,sec);
