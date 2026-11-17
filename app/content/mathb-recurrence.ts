import {B,S,m,q,nums,checked,finish} from "./mathb-authoring";
import {worked} from "./mathb-worked";
const chapter="漸化式と数学的帰納法",sec=["隣の項から次の項へ","和と項の関係","すべての自然数への証明"];

function update(a:number, multiply=false) {
 const r=multiply?2:1, d=multiply?1:3, values=[a];
 for(let i=0;i<3;i++) values.push(r*values[i]+d);
 const working=values.slice(1).map((v,i)=>m`$a_{${i+2}}=${multiply?m`2\times`:""}${values[i]}+${d}=${v}$。`).join(" ");
 return worked(checked("recurrence-values",[a,r,d],values[3],
  m`$a_1=${a},\ a_{n+1}=${multiply?"2":""}a_n+${d}\ (n\ge1)$ から、第 $4$ 項まで書きなさい。`,
  m`$${values.join(",")}$。`, "求めた値が、次の回の入力です。",working),
  working, m`初項から並べると $${values.join(",")}$。`);
}

function accumulated(a:number, odd=false) {
 const delta=odd?"2k+1":"k", increase=odd?"n^2-1":m`\frac{n(n-1)}2`;
 const result=odd?m`n^2+${a-1}`:m`${a}+\frac{n(n-1)}2`;
 const prompt=m`$a_1=${a},\ a_{n+1}=a_n+${odd?"2n+1":"n"}\ (n\ge1)$ の一般項を求めなさい。`;
 const answer=m`$a_n=${result}\ (n\ge1)$。`;
 return worked(q(prompt,answer,"初項から目的の項までに通る差を足します。",""),
  m`第 $n$ 項へは $n-1$ 回進むので、$n\ge2$ では $a_n-a_1=\sum_{k=1}^{n-1}(${delta})$。`,
  m`差の和は $${odd?m`2\cdot\frac{n(n-1)}2+(n-1)=`:""}${increase}$。初項 $${a}$ を戻すと $a_n=${result}$。$n=1$ でも $${a}$ となります。`);
}

function affine(a:number, negative=false) {
 const p=negative?-2:2, c=negative?3:1, L=negative?1:-1;
 const shift=negative?"-1":"+1", factor=a-L;
 const result=negative?m`${factor===1?"":factor}(-2)^{n-1}+1`:m`${factor}\cdot2^{n-1}-1`;
 const prompt=m`$a_1=${a},\ a_{n+1}=${p}a_n+${c}\ (n\ge1)$ の一般項を求めなさい。`;
 const answer=m`$a_n=${result}\ (n\ge1)$。`;
 return worked(q(prompt,answer,"更新しても変わらない値を、両辺から引きます。",""),
  m`$L=${p}L+${c}$ を解くと $L=${L}$。この等式を漸化式から引けば、$a_{n+1}${shift}=${p}(a_n${shift})$。`,
  m`$b_n=a_n${shift}$ は初項 $${factor}$、公比 $${p}$ の等比数列。$b_n=${factor}(${p})^{n-1}$ なので、$a_n=b_n${negative?"+1":"-1"}=${result}\ (n\ge1)$。`);
}

function fromSum(c:number, linear=false) {
 const expr=linear?`${c}n+1`:`n^2+${c}n`;
 const prompt=m`$S_n=a_1+\cdots+a_n=${expr}\ (n\ge1)$ のとき一般項を求めなさい。`;
 const answer=linear?m`$a_1=${c+1}$、$n\ge2$ では $a_n=${c}$。`:m`$a_n=2n+${c-1}\ (n\ge1)$。`;
 const difference=linear?m`(${c}n+1)-\{${c}(n-1)+1\}=${c}`:m`n^2+${c}n-\{(n-1)^2+${c}(n-1)\}=2n+${c-1}`;
 return worked(q(prompt,answer,"初項は最初の和、二項目以降は隣の和の差です。",""),
  m`$a_1=S_1=${c+1}$。$n\ge2$ では、初めの $n-1$ 項が消えて $a_n=S_n-S_{n-1}$。`,
  m`$a_n=${difference}$。`+(linear?m`初項 $${c+1}$ と異なるので、この一定値は $n\ge2$ で使います。`:m`$n=1$ でも $${c+1}$ になるので、$n\ge1$ にまとめられます。`));
}

function proof(prompt:string,hint:string,base:string,induction:string,conclusion:string) {
 const passages=[base,induction,conclusion];
 return worked(q(prompt, passages.join(" "), hint, ""), ...passages);
}

function inductionSum(d:number,geo=false) {
 const prompt=geo?m`すべての正の整数 $n$ について $1+${d}+\cdots+${d}^{n-1}=\frac{${d}^n-1}{${d-1}}$ を数学的帰納法で証明しなさい。`:m`すべての正の整数 $n$ について $\sum_{j=1}^n(${d}j)=\frac{${d}n(n+1)}2$ を数学的帰納法で証明しなさい。`;
 const substitution=geo?m`$\frac{${d}^k-1}{${d-1}}+${d}^k=\frac{${d}^{k+1}-1}{${d-1}}$`:m`$\frac{${d}k(k+1)}2+${d}(k+1)=\frac{${d}(k+1)(k+2)}2$`;
 return proof(prompt,m`$k+1$ 項の和を、仮定した $k$ 項の和と最後の一項に分けます。`,
  m`$n=1$ では両辺とも $${geo?1:d}$。`,
  m`任意の正の整数 $k$ で等式を仮定します。その両辺に次の項 $${geo?m`${d}^k`:m`${d}(k+1)`}$ を足すと、左辺は $k+1$ 項の和、右辺は ${substitution}。`,
  m`これは $n=k+1$ の等式です。数学的帰納法により、すべての正の整数 $n$ で成立します。`);
}

function divisibility(a:number) {
 return proof(m`正の整数 $n$ について $${a}^n-1$ が $${a-1}$ の倍数であることを、数学的帰納法で示しなさい。`,
  m`次の式の中に、仮定の $${a}^k-1$ を作ります。`,
  m`$n=1$ では $${a}-1=${a-1}$ で成立。`,
  m`任意の正の整数 $k$ で $${a}^k-1=${a-1}t$（$t$ は整数）と仮定します。$${a}^{k+1}-1=${a}(${a}^k-1)+${a-1}=${a-1}(${a}t+1)$。`,
  m`$${a}t+1$ も整数なので、次も $${a-1}$ の倍数です。数学的帰納法により、すべての正の整数で成立します。`);
}

function bernoulli(a:number) {
 return proof(m`正の整数 $n$ について $${a+1}^n\ge1+${a}n$ を数学的帰納法で証明しなさい。`,
  m`仮定した不等式に正の $${a+1}$ を掛け、右辺と次の目標との差を調べます。`,
  m`$n=1$ では両辺とも $${a+1}$。`,
  m`任意の正の整数 $k$ で $${a+1}^k\ge1+${a}k$ と仮定します。正の $${a+1}$ を掛けると $${a+1}^{k+1}\ge(${a+1})(1+${a}k)=1+${a}(k+1)+${a*a}k$。`,
  m`$${a*a}k\ge0$ なので、$${a+1}^{k+1}\ge1+${a}(k+1)$。数学的帰納法により、すべての正の整数で成立します。`);
}
export const recurrenceBanks=[
 B(chapter,"recurrence","漸化式と初項","次の項を作る規則を、一段ずつ使います。",[m`漸化式は、前後の項の関係を表す式です。$a_{n+1}=a_n+3$ だけでは初めの値は決まりません。`,m`初項も与えれば $a_1$ から $a_2,a_3,\ldots$ と順に求められます。$a_{n+1}$ を求める式の右辺には、まだ求めていない次の項ではなく $a_n$ を入れます。`],"初項と、規則を使える添字の範囲を確認します。",[S("add","一定の差で更新する","直前の項に差を加えます。",nums.map(n=>update(n))),S("multiply-add","掛けてから足す更新","操作の順序を保って次の項を作ります。",nums.map(n=>update(n,true)))],sec[0]),
 B(chapter,"recurrence-difference","差を足して解く漸化式","増える量が変わるときも、隣との差から考えます。",[m`$a_{n+1}=a_n+n$ なら、増える量は $1,2,3,\ldots$ です。元の数列を等差数列と取り違えないようにします。`,m`$n\ge2$ では $a_n=a_1+\sum_{k=1}^{n-1}(a_{k+1}-a_k)$ へ直せば、既に学んだ和が使えます。初項は別に確かめます。`],"和で求めた式を、初項と漸化式の両方で確かめます。",[S("linear","自然数の差を足す",m`差を $n-1$ 個足します。`,nums.map(n=>accumulated(n))),S("odd","奇数の差を足す","添字をそろえて和にします。",nums.map(n=>accumulated(n,true)))],sec[0]),
 B(chapter,"affine-recurrence","定数を引いて解く漸化式","変わらない値との差を取ると、等比数列になります。",[m`$a_{n+1}=pa_n+q$（$p\ne1$）では、$L=pL+q$ を満たす定数を探します。`,m`引き算すると $a_{n+1}-L=p(a_n-L)$。そこで $b_n=a_n-L$ と置くと等比数列です。$p=1$ は差が一定なので等差数列として解きます。`],"置き換えた数列の初項も求め、最後に元へ戻します。",[S("positive","正の公比への置き換え","定数項を消す差を作ります。",nums.map(n=>affine(n))),S("negative","負の公比への置き換え","符号を含めて等比数列の式を使います。",nums.map(n=>affine(n,true)))],sec[0]),
 B(chapter,"sum-to-term","和から一般項へ","一つ前までの和を引くと、最後の一項が残ります。",[m`$S_n=a_1+\cdots+a_n$ なら $a_1=S_1$、$n\ge2$ では $a_n=S_n-S_{n-1}$。`,m`$S_n$ の公式が正の整数にしか与えられていないなら、勝手にその式を $S_0$ に使ってはいけません。初項を別に調べます。`],"二項目以降の式が初項にも合うか確認してからまとめます。",[S("joins","初項にも合う式","隣の和の差を取り、初項と照合します。",nums.map(n=>fromSum(n))),S("separate","初項を分ける式","式を使える範囲を守ります。",nums.map(n=>fromSum(n,true)))],sec[1]),
 B(chapter,"induction-identities","数学的帰納法による等式の証明","初めの場合と、次へ進む仕組みを示します。",[m`数学的帰納法は、初めの成立と「$n=k$ の成立から $n=k+1$ の成立」を組み合わせた証明です。`,m`数例だけの確認ではすべての自然数の証明になりません。次の式を最初から正しいと置くのではなく、仮定した式を使って導きます。`],"次へ加わる一項を書き、目標の右辺へ変形します。",[S("sum","和の等式を証明する","仮定した和に次の一項を加えます。",nums.map(n=>inductionSum(n))),S("geometric","等比和を証明する","指数が増えた最後の項を加えます。",nums.map(n=>inductionSum(n,true)))],sec[2]),
 B(chapter,"induction-properties","整数・不等式の帰納法","仮定を使える形を作り、条件を確かめて進めます。",[m`倍数の証明では「ある整数の倍数」という形を保ちます。不等式では掛ける数の符号が必要です。`,m`仮定から結論へのつながりだけでなく、最初の成立も必要です。例えば $a_{n+1}=2a_n$ でも、初項を指定しないと $a_n=2^{n-1}$ とは決まりません。`],"何を仮定し、どの条件で次へ進むかを言葉と式で書きます。",[S("divisibility","倍数であることを示す","仮定した式の定数倍を見つけます。",nums.map(n=>divisibility(n===2?10:n))),S("inequality","不等式を示す","正の数を掛け、非負の余分な項を除きます。",nums.map(bernoulli))],sec[2])
];
export const recurrenceChapter=finish(chapter,"recurrence",recurrenceBanks,sec);
