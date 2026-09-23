import {truth,necessary} from "./math1-logic-statements";
import {negation} from "./math1-logic-negation";
import {direct,contraProof,contradiction} from "./math1-logic-proofs";
import {m,w} from "./math1-logic-authoring";
import type {Worked} from "./math1-topic";
import type {Exercise} from "./lessons";
type Bank=typeof direct;
const find=(b:Bank,key:string)=>{const e=b.exercises.find(e=>e.id===`${b.lesson.slug}-${key}-v1`);if(!e)throw new Error(`Missing logic refinement ${key}`);return e;};
const worked=(e:Exercise):Worked=>[e.prompt,e.answer,e.hints[0],e.steps[0].text];
function repair(b:Bank,id:string,title:string,why:string,examples:Worked[]){
 const last=examples.at(-1)!;
 const s={id,title,text:why+"\n"+examples.map(e=>[e[0],e[3],e[1]].filter((x,i,a)=>a.indexOf(x)===i).join("\n")).join("\n"),tex:"",check:last[0],answer:last[1]};
 const i=b.lesson.supplements.findIndex(s=>s.id===id);if(i<0)b.lesson.supplements.push(s);else b.lesson.supplements[i]=s;
}
function add(b:Bank,family:string,title:string,why:string,items:Worked[]){
 repair(b,family,title,why,items.slice(0,2));
 items.forEach(([prompt,answer,hint,working],i)=>b.exercises.push({id:`${b.lesson.slug}-${family}-new-${i+1}-v1`,lesson:b.lesson.slug,family,repair:family,kind:"paper",stage:i<Math.ceil(items.length/2)?"practice":"review",prompt,answer,hints:[hint],steps:[{title:"考え方",text:working}]}));
}
function split(b:Bank,keys:string[],family:string,title:string,why:string){
 const selected=keys.map(k=>find(b,k));selected.forEach(e=>{e.family=e.repair=family;});
 repair(b,family,title,why,selected.map(worked));
}
export function applyLogicRefinements(){
// Supplements include every operation actually assigned to the family.
repair(truth,"true-reason","仮定から結論へ進む理由","代入・範囲の比較・整数の表現など、仮定に合う理由を使います。",[worked(find(truth,"true-reason-1")),worked(find(truth,"true-reason-2")),worked(find(truth,"true-reason-5"))]);
repair(negation,"compound","かつ・またはを否定する","「両方が成立する」の否定は、「少なくとも一方が成立しない」です。「少なくとも一方が成立する」の否定は、「両方とも成立しない」です。",[worked(find(negation,"compound-2")),worked(find(negation,"compound-3"))]);
repair(negation,"quantifier","すべて・あるを否定する","数の範囲を変えず、全体と存在の言葉、および条件の両方を否定します。",[worked(find(negation,"quantifier-1")),worked(find(negation,"quantifier-2"))]);
repair(direct,"consecutive","連続する整数・奇数を表す","整数の間隔は一、連続する奇数の間隔は二です。指定された数の種類を先に確かめます。",[worked(find(direct,"consecutive-1")),worked(find(direct,"consecutive-3")),worked(find(direct,"consecutive-5"))]);
split(contraProof,["compound-contra-2","compound-contra-5"],"nonzero-contra","両方が非零という結論の対偶",m`「$a\ne0$ かつ $b\ne0$」の否定は「$a=0$ または $b=0$」。いずれの場合も積がゼロになることを使います。`);
repair(contraProof,"compound-contra","またはの結論を否定して証明する","結論を否定すると、二つの条件が同時に成立する仮定になります。指定された和をその仮定のもとで調べます。",[worked(find(contraProof,"compound-contra-3")),worked(find(contraProof,"compound-contra-6"))]);

// Distinct domains and operations must remain distinct during repair/review.
split(contradiction,["contradiction-2","contradiction-5"],"integer-extreme","最大・最小の整数を仮定する","整数に一を足す・引くと整数のままです。仮定した最大・最小を超える数を作ります。");
split(contradiction,["contradiction-3"],"open-domain-extreme","範囲内にさらに小さい・大きい数を作る","新しく作った数が元の範囲に残ることと、最大・最小を破ることを両方示します。");
add(contradiction,"open-domain-extreme","範囲を保って極端な値を否定する","半分にした数の符号と大小を両方確かめます。",[
 w("最大の負の実数は存在しないことを、背理法で証明しなさい。","最大の負の実数 "+m`$a<0$ があると仮定する。$a<\frac a2<0$ なので、$\frac a2$ は負の実数のまま $a$ より大きい。最大性に矛盾するため存在しない。`,"負の数を半分にすると、ゼロに近づきます。",m`$a<0$ より $a<\frac a2<0$。負の範囲に残ることを省略しません。`),
 w(m`$0<x<1$ を満たす実数に最小のものは存在しないことを、背理法で証明しなさい。`,m`最小の数 $a$ があると仮定すると $0<a<1$。$0<\frac a2<a<1$ より、$\frac a2$ は同じ範囲にあるのに $a$ より小さい。最小性に矛盾するので存在しない。`,"半分にした数がゼロより大きく一より小さいことも示します。",m`$0<\frac a2<a<1$ が、範囲の条件と最小性への反例を同時に示します。`),
]);
// Retain the original positive-half example in this operation-specific repair.
repair(contradiction,"open-domain-extreme","範囲を保って極端な値を否定する","仮定した最小・最大を破るだけでなく、作った数が指定範囲に残ることを示します。",[worked(find(contradiction,"contradiction-3")),worked(find(contradiction,"open-domain-extreme-new-1"))]);
split(contradiction,["irrational-expression-5"],"irrational-reciprocal","逆数を取る前に非零を確認する","ゼロでない有理数の逆数は有理数です。仮定した値がゼロでないことを示してから使います。");
add(contradiction,"irrational-reciprocal","逆数を取る前に非零を確認する",m`$\sqrt2,\sqrt3$ の無理数性はこのページの証明を使います。有理数と仮定した値が非零であることを先に確認します。`,[
 w(m`$\sqrt3$ が無理数であることを用い、$\frac1{\sqrt3}$ が無理数であることを背理法で証明しなさい。`,m`$\frac1{\sqrt3}=r$ が有理数だと仮定する。$r>0$ より $r\ne0$。すると $\sqrt3=\frac1r$ は有理数となり矛盾する。よって無理数である。`,"逆数を取れる理由を先に書きます。",m`$r\ne0$ があるため $\frac1r$ が定義でき、有理数になります。`),
 w(m`$\sqrt2$ が無理数であることを用い、$\frac2{\sqrt2}$ が無理数であることを背理法で証明しなさい。`,m`$\frac2{\sqrt2}=r$ が有理数だと仮定する。$r>0$ なので $\sqrt2=\frac2r$ も有理数となり矛盾する。よって無理数である。`,"分子が二でも、ゼロでない有理数で割ると有理数です。",m`$r>0$ を確認してから $\sqrt2=\frac2r$ と直します。`),
]);
for(const b of [direct,contraProof,contradiction]){
 split(b,["integer-form-3"],"consecutive-form","連続する整数を同じ文字で表す","一だけ違う関係を保ち、同じ文字で表します。");
 add(b,"consecutive-form","連続する整数を同じ文字で表す","独立な数ではなく、隣との差が決まっている数を表します。",[
  w("連続する三つの整数を、最も小さい整数を用いて表しなさい。",m`$n,n+1,n+2$（$n$ は整数）。`,"隣へ進むたび一を足します。",m`最小を $n$ とすると、二番目は $n+1$、三番目は $n+2$。`),
  w("連続する四つの整数を、最も小さい整数を用いて表しなさい。",m`$n,n+1,n+2,n+3$（$n$ は整数）。`,"全部を別の文字にせず、差が一という関係を入れます。",m`最小を整数 $n$ と置き、一ずつ足して残りを表します。`),
 ]);
 add(b,"integer-form","独立な数を別々の整数文字で表す","等しいとは限らない数に、同じ文字一つを使わないようにします。",[
  w(m`整数 $a$ と偶数 $b$ を、整数の文字で表しなさい。`,m`$a=r,b=2s$（$r,s$ は整数）。`,"偶数という条件は後者だけにあります。",m`$a$ は任意の整数、$b$ は二の整数倍なので別々の $r,s$ で表します。`),
  w(m`二つの三の倍数 $a,b$ を、整数の文字で表しなさい。`,m`$a=3r,b=3s$（$r,s$ は整数）。`,"二つの倍数は等しいとは限らないので別々に置きます。",m`それぞれが三の整数倍ですが、その整数が同じとは限りません。`),
 ]);
}

add(truth,"truth-choice","証明か反例かを選ぶ","仮定を満たすすべてで結論が成立するなら理由を示し、一つでも外れるなら反例の両条件を確かめます。",[
 w(m`実数 $x$ について「$x^2=1$ ならば $x=1$」の真偽を判断し、理由を示しなさい。`,m`偽。$x=-1$ なら $x^2=1$ ですが $x\ne1$ なので反例です。`,"負の数も仮定を満たすか調べます。",m`$(-1)^2=1$ と $-1\ne1$ の両方を確認します。`),
 w(m`実数 $x$ について「$x>4$ ならば $x>2$」の真偽を判断し、理由を示しなさい。`,m`真。$x>4>2$ なので、仮定を満たすすべての実数で $x>2$ です。`,"二つの境界の順序から、範囲全体について判断します。",m`$x>4>2$ が一般の $x$ についての理由です。`),
 w(m`整数 $n$ について「$n$ が三の倍数なら六の倍数」の真偽を判断し、理由を示しなさい。`,m`偽。$n=3$ は三の倍数ですが六の倍数ではありません。`,"小さい三の倍数から、結論を満たさないものを探します。",m`$3=3\cdot1$ ですが、六の整数倍ではありません。`),
 w(m`実数 $x$ について「$x=0$ ならば $x^2=0$」の真偽を判断し、理由を示しなさい。`,m`真。$x=0$ を代入すると $x^2=0^2=0$ です。`,"仮定で値が決まるので、その値を式へ代入します。",m`仮定が許す値はゼロだけであり、その値で結論が成立します。`),
]);
add(truth,"counter-candidate","反例として使える候補か確かめる","仮定を満たすだけでも、結論を満たさないだけでも不十分です。二つを同時に確かめます。",[
 w(m`実数 $x$ の命題「$x^2=4$ ならば $x=2$」に対し、$x=0$ は反例になりますか。理由も答えなさい。`,m`なりません。$0^2\ne4$ で仮定を満たさないからです。`,"結論より先に仮定を確認します。",m`結論 $x=2$ が偽でも、仮定も偽なので反例ではありません。`),
 w(m`実数 $x$ の命題「$x^2=9$ ならば $x=3$」に対し、$x=-3$ は反例になりますか。理由も答えなさい。`,m`なります。$(-3)^2=9$ で仮定は真、$-3\ne3$ で結論は偽です。`,"仮定と結論へ同じ候補を代入します。",m`仮定が真かつ結論が偽なので反例です。`),
 w(m`実数 $x$ の命題「$x>0$ ならば $x>1$」に対し、$x=-1$ は反例になりますか。理由も答えなさい。`,m`なりません。$-1>0$ は偽で、仮定を満たしません。`,"正の数という仮定から外れていないかを見ます。",m`結論が偽であっても、仮定から外れた値は反例には使えません。`),
 w(m`実数 $x$ の命題「$x\ge0$ ならば $x>0$」に対し、$x=0$ は反例になりますか。理由も答えなさい。`,m`なります。$0\ge0$ は真、$0>0$ は偽です。`,"等号の境界を両方で確認します。",m`仮定を満たし結論を満たさないので、反例として使えます。`),
]);
add(necessary,"classify-conditions","具体的な条件を両方向に調べる","両方向を別々に調べ、真には理由、偽には反例を示してから名前を付けます。",[
 w(m`実数 $x$ について $p:x=4$、$q:x^2=16$ とする。$p$ は $q$ のどの条件か、両方向の理由も答えなさい。`,m`十分条件ですが必要条件ではありません。$x=4$ なら $x^2=16$。逆は $x=-4$ が反例で、$x^2=16$ ですが $x\ne4$。`,"平方には正負二つの候補があることを確認します。",m`$p\Rightarrow q$ は真、$q\Rightarrow p$ は偽。したがって十分条件のみです。`),
 w(m`実数 $x$ について $p:x>5$、$q:x>2$ とする。$p$ は $q$ のどの条件か、両方向の理由も答えなさい。`,m`十分条件ですが必要条件ではありません。$x>5>2$ より順方向は真。逆は $x=3$ が反例で、$3>2$ ですが $3>5$ は偽です。`,"狭い範囲から広い範囲へ進む向きを確かめます。",m`$p\Rightarrow q$ は真、$q\Rightarrow p$ は偽。十分と必要を逆にしません。`),
]);
// Keep all four outcomes demonstrated in the repair after adding the sufficient-only pair.
repair(necessary,"classify-conditions","具体的な条件を両方向に調べる","真には理由、偽には反例を示してから必要・十分を名付けます。",["classify-conditions-new-1","classify-conditions-2","classify-conditions-3","classify-conditions-4"].map(k=>worked(find(necessary,k))));

// Each guided stage has its own partial-proof family; full proofs stay separate.
function scaffold(b:Bank,sourceKey:string,family:string,title:string,why:string,first:Worked,alternates:Worked[]){
 const e=find(b,sourceKey);
 [e.prompt,e.answer]=first;e.hints=[first[2]];e.steps=[{title:"理由をつなぐ",text:first[3]}];e.family=e.repair=family;
 add(b,family,title,why,alternates);
 repair(b,family,title,why,[first,...alternates]);
}
scaffold(direct,"parity-algebra-1","parity-plan","整数という理由を補う","まず表し方、次に計算、最後に整数である理由と結論を確かめます。",
 w(m`偶数の和の証明を補いなさい。$a=2r,b=2s$（$r,s$ は整数）のとき $a+b=2(\square)$。括弧内が整数である理由と、和についての結論も答えなさい。`,m`括弧は $r+s$。整数の和は整数なので、和は二の整数倍、つまり偶数です。`,"二をくくった後の式を考えます。",m`$a+b=2r+2s=2(r+s)$。整数の和は整数です。`),[
 w(m`奇数の和の証明を補いなさい。$a=2r+1,b=2s+1$（$r,s$ は整数）なら $a+b=2(\square)$。整数である理由と結論も答えなさい。`,m`$r+s+1$。整数の和なので括弧内は整数、よって偶数です。`,"一が二つ加わります。",m`$a+b=2r+2s+2=2(r+s+1)$。`),
 w(m`偶数と奇数の和の証明を補いなさい。$a=2r,b=2s+1$（$r,s$ は整数）なら $a+b=2(\square)+1$。整数である理由と結論も答えなさい。`,m`$r+s$。整数の和なので整数、よって和は奇数です。`,"二の倍数と残る一を分けます。",m`$a+b=2(r+s)+1$。`),
]);
scaffold(direct,"consecutive-1","consecutive-plan","連続する条件から結論へ","どの数を文字で表したかを書き、連続する関係を式にしてから結論へ進みます。",
 w(m`連続する二整数の和の証明を補いなさい。小さい方を整数 $n$ とすると次は何ですか。和を計算し、なぜ奇数か答えなさい。`,m`次は $n+1$。和は $2n+1$ で、$n$ が整数だから奇数です。`,"隣との差は一です。",m`$n+(n+1)=2n+1$。`),[
 w(m`連続する三整数の和の証明を補いなさい。最小を整数 $n$ として残り二つを書き、和が三の倍数となる理由を答えなさい。`,m`$n+1,n+2$。和は $3(n+1)$ で、$n+1$ は整数だから三の倍数です。`,"先に三つの整数を全部書きます。",m`$n+(n+1)+(n+2)=3n+3=3(n+1)$。`),
 w(m`連続する四整数の和の証明を補いなさい。最小を整数 $n$ として残りを書き、和が偶数となる理由を答えなさい。`,m`$n+1,n+2,n+3$。和は $2(2n+3)$ で、$2n+3$ は整数だから偶数です。`,"定数部分もまとめてから二をくくります。",m`$n+(n+1)+(n+2)+(n+3)=4n+6=2(2n+3)$。`),
]);
scaffold(contraProof,"parity-contra-1","parity-contra-plan","対偶の出発点と結論を補う","整数の範囲を保ち、結論の否定から元の仮定の否定へつなぎます。",
 w(m`「整数 $n$ で $n^2$ が奇数なら $n$ は奇数」の対偶を書きなさい。さらに $n=2k$（$k$ は整数）から平方を求め、何が示せたか答えなさい。`,m`対偶は「$n$ が偶数なら $n^2$ は偶数」。$n^2=4k^2=2(2k^2)$ は偶数なので対偶が真、元の命題も真です。`,"奇数でない整数は偶数です。",m`$2k^2$ は整数なので、平方は二の整数倍です。`),[
 w(m`「整数 $n$ で $n^2$ が偶数なら $n$ は偶数」の対偶を書き、$n=2k+1$（$k$ は整数）から平方の偶奇と結論を答えなさい。`,m`対偶は「$n$ が奇数なら $n^2$ は奇数」。$n^2=2(2k^2+2k)+1$ は奇数なので、対偶も元の命題も真です。`,"両方を否定して順序を交換します。",m`括弧内 $2k^2+2k$ が整数なので奇数といえます。`),
 w(m`「整数 $n$ で $n^3$ が奇数なら $n$ は奇数」の対偶を書き、$n=2k$（$k$ は整数）から三乗の偶奇と結論を答えなさい。`,m`対偶は「$n$ が偶数なら $n^3$ は偶数」。$n^3=2(4k^3)$ は偶数なので、対偶も元の命題も真です。`,"三乗してから二をくくります。",m`$4k^3$ は整数です。`),
]);
scaffold(contraProof,"compound-contra-1","sum-contra-plan","結論全体を否定する","またはの否定はかつになります。二つの不等式を足して対偶の結論へつなぎます。",
 w(m`「$a+b<0$ なら $a<0$ または $b<0$」（$a,b$ は実数）の対偶の仮定・結論を書き、仮定から結論が出る理由を答えなさい。`,m`仮定は $a\ge0$ かつ $b\ge0$、結論は $a+b\ge0$。二つの不等式を足すと得られます。`,"またはで結ばれた結論全体を否定します。",m`二数がともに非負なら和も非負です。`),[
 w(m`「$a+b>4$ なら $a>2$ または $b>2$」（$a,b$ は実数）の対偶の仮定・結論と、成立する理由を答えなさい。`,m`仮定は $a\le2$ かつ $b\le2$、結論は $a+b\le4$。両辺を足せば得られます。`,"等号を落とさずに否定します。",m`$a+b\le2+2=4$。`),
 w(m`「$a+b<2$ なら $a<1$ または $b<1$」（$a,b$ は実数）の対偶の仮定・結論と、成立する理由を答えなさい。`,m`仮定は $a\ge1$ かつ $b\ge1$、結論は $a+b\ge2$。両辺を足せば得られます。`,"二つとも一以上であることを仮定します。",m`$a+b\ge1+1=2$。`),
]);
scaffold(contradiction,"contradiction-1","contradiction-plan","矛盾する二つの条件を示す","元の仮定は保ち、結論だけを否定して矛盾の相手を明示します。",
 w(m`実数 $a,b$ で $a+b<0$ なら一方は負、という背理法を補いなさい。結論の否定は何ですか。そこから得られる不等式と、矛盾する元の条件を答えなさい。`,m`否定は $a\ge0$ かつ $b\ge0$。すると $a+b\ge0$ となり、元の $a+b<0$ と矛盾します。`,"和が負という仮定は変えません。",m`非負な数の和は非負です。`),[
 w(m`実数 $a,b$ で $a+b>0$ なら一方は正、という背理法を補いなさい。結論の否定、そこから得る式、矛盾する条件を答えなさい。`,m`否定は $a\le0$ かつ $b\le0$。和は $a+b\le0$ となり、$a+b>0$ と矛盾します。`,"一方は正、を全体として否定します。",m`両方が非正なら和も非正です。`),
 w(m`実数 $a,b$ で $a+b>6$ なら一方は三より大きい、という背理法を補いなさい。結論の否定、そこから得る式、矛盾する条件を答えなさい。`,m`否定は $a\le3$ かつ $b\le3$。和は $a+b\le6$ となり、$a+b>6$ と矛盾します。`,"三以下の二数の和を考えます。",m`$a+b\le3+3=6$。`),
]);
scaffold(contradiction,"irrational-root-1","root-plan","既約分数の条件と矛盾を結ぶ","分数を既約にする理由と、何を示せば矛盾になるかを確かめます。",
 w(m`$\sqrt3$ の無理数性の背理法を補いなさい。有理数と仮定して $\sqrt3=\frac ab$ とするときの $a,b$ の条件、二乗後の式、両方が三の倍数と分かったときの矛盾を答えなさい。`,m`$a,b$ は互いに素な正の整数。$a^2=3b^2$。両方が三の倍数なら共通因数三をもち、互いに素に矛盾します。`,"正の数を表す既約分数にします。",m`既約という条件があるから、両方に共通因数が現れることが矛盾になります。`),[
 w(m`$\sqrt2=\frac ab$ と仮定する背理法で、$a,b$ の条件と二乗後の式を書き、両方が偶数なら何と矛盾するか答えなさい。`,m`$a,b$ は互いに素な正の整数。$a^2=2b^2$。両方が偶数なら共通因数二をもち、互いに素に矛盾します。`,"約分済みであることを忘れずに条件へ書きます。",m`$b\ne0$ であり、既約分数として表すから矛盾に到達できます。`),
 w(m`$\sqrt3=\frac ab$（$a,b$ は互いに素な正の整数）から $a=3k$（$k$ は整数）と分かりました。代入して得る $b^2$ の式と、$b$ も三の倍数なら何と矛盾するか答えなさい。`,m`$9k^2=3b^2$ より $b^2=3k^2$。$b$ も三の倍数なら $a,b$ は共通因数三をもち、互いに素に矛盾します。`,"二乗した等式へ代入して三で割ります。",m`$a^2=3b^2$ に $a=3k$ を代入します。`),
]);
scaffold(contradiction,"irrational-expression-1","irrational-plan","既知の無理数へ戻す式を補う","有理数と仮定した式を、既知の無理数だけが片側に残る形へ直します。",
 w(m`$2\sqrt2=r$（$r$ は有理数）と仮定しました。$\sqrt2$ を $r$ で表し、何に矛盾するか答えなさい。`,m`$\sqrt2=\frac r2$。右辺は有理数なので、$\sqrt2$ の無理数性に矛盾します。`,"非零の整数二で割ります。",m`有理数を非零の整数で割った商は有理数です。`),[
 w(m`$1+\sqrt2=r$（$r$ は有理数）と仮定しました。$\sqrt2$ を $r$ で表し、何に矛盾するか答えなさい。`,m`$\sqrt2=r-1$。右辺は有理数なので、$\sqrt2$ の無理数性に矛盾します。`,"両辺から一を引きます。",m`有理数と整数の差は有理数です。`),
 w(m`$3-\sqrt2=r$（$r$ は有理数）と仮定しました。$\sqrt2$ を $r$ で表し、何に矛盾するか答えなさい。`,m`$\sqrt2=3-r$。右辺は有理数なので、$\sqrt2$ の無理数性に矛盾します。`,"根号の項を移し、三から有理数を引く形にします。",m`整数と有理数の差は有理数です。`),
]);
}
