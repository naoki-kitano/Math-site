import type {FormulaLesson,FormulaStep} from './formula-correspondence';
const m=String.raw;
const step=(kind:string,stage:number,label:string,text:string):FormulaStep=>({label,text,formulas:[],diagram:{kind:`m1-logic-${kind}`,stage}});

export const math1LogicCorrespondence:Record<string,FormulaLesson>={
 'm1-sets-elements':{title:'条件と、そこに入る要素',goal:'集合を表す二つの書き方を対応させます。',check:'',steps:[
  step('sets',0,'整数の中から選ぶ',m`$1\le x<4$ を満たす整数を集めます。整数という指定と、不等式の両方を満たすのはどの数でしょう。`),
  step('sets',1,'実数なら区間になる',m`同じ $1\le x<4$ でも、実数を集めるなら整数の間も含みます。`),
  step('sets',2,'数と集合を分ける',m`$3$ は一つの数、$\{3\}$ はその数を要素にもつ集合です。波括弧は集合を表します。`),
  step('sets',3,'空集合と比べる',m`要素がない集合を空集合といいます。数 $0$ が入っていれば、要素は一つです。`),
 ]},
 'm1-set-operations':{title:'どの条件を満たす要素か',goal:'集合の演算と要素の所属を対応させます。',check:'',steps:[
  step('operations',0,'両方に入る',m`$A\cap B$ は、$A$ にも $B$ にも入る要素の集合です。下の同じ要素について、二つの所属を確かめます。`),
  step('operations',1,'少なくとも一方に入る',m`$A\cup B$ は、少なくとも一方に入る要素の集合です。両方に入る $3$ も一度だけ含めます。`),
  step('operations',2,'全体の中で外側を選ぶ',m`$\overline A$ は、全体集合 $U$ の中で $A$ に入らない要素の集合です。`),
 ]},
 'm1-statements-counterexamples':{title:'反例は二つの条件で確かめる',goal:'仮定と結論に同じ値を入れて調べます。',check:m`$x$ は実数です。`,steps:[
  step('counterexample',0,'仮定は真、結論は偽',m`「$x^2=4$ ならば $x=2$」を調べます。$x=-2$ は仮定を満たし、結論を満たしません。この一例で命題は偽と分かります。`),
  step('counterexample',1,'仮定に入っているか',m`同じ命題で $x=0$ を調べると、仮定を満たしません。結論が偽でも、反例にはなりません。`),
 ]},
 'm1-condition-inclusion':{title:'条件の範囲と、命題の向き',goal:'条件を満たす集合の包含から含意を読みます。',check:m`$x$ は実数です。`,steps:[
  step('inclusion',0,'出発する範囲が全部入る',m`$p:x>3$、$q:x>1$ とします。$p$ を満たす集合 $P$ は、$q$ を満たす集合 $Q$ にすべて含まれます。`),
  step('inclusion',1,'包含を命題として読む',m`$P$ のどの要素も $Q$ に入るので、「$p$ ならば $q$」は真です。`),
  step('inclusion',2,'逆向きは一点で確かめる',m`$x=2$ は $Q$ に入りますが、$P$ には入りません。したがって逆向きの「$q$ ならば $p$」は偽です。`),
 ]},
 'm1-necessary-sufficient':{title:'二つの向きから条件の名前へ',goal:'条件の名前を、保証できる向きに対応させます。',check:m`$x$ は実数です。`,steps:[
  step('necessary',0,'この条件があれば十分',m`$p:x=2$、$q:x^2=4$ とします。$x=2$ と分かれば二乗は $4$。$p$ は $q$ を保証する十分条件です。`),
  step('necessary',1,'逆向きも成り立つか',m`$x^2=4$ には $x=-2$ も含まれるので、$q$ から $p$ は保証できません。$p$ は $q$ の必要条件ではありません。`),
  step('necessary',2,'何の条件かを主語と結ぶ',m`同じ関係を $q$ の側から読むと、$q$ は $p$ の必要条件です。$p$ なら必ず $q$ も満たすからです。`),
 ]},
 'm1-condition-negation':{title:'否定する範囲をそろえる',goal:'変わる部分と、そのままの部分を見比べます。',check:'',steps:[
  step('negation',0,'境界はどちらに入るか',m`実数 $x$ について、$x>2$ の否定は $x\le2$。元の条件と否定で、実数全体を重なりなく分けます。`),
  step('negation',1,'かつで結ばれた条件全体',m`$x,y$ は実数です。「$x>0$ かつ $y>0$」が成り立たないのは、少なくとも一方が成り立たないときです。`),
  step('negation',2,'またはで結ばれた条件全体',m`$x,y$ は実数です。「$x<0$ または $y<0$」が成り立たないのは、両方とも成り立たないときです。`),
  step('negation',3,'すべての否定',m`「すべての実数 $x$ で $x^2\ge0$」の否定を書きます。「すべて」を否定するには、条件を満たさないものが一つでもあればよいのです。`),
  step('negation',4,'あるの否定',m`「ある整数 $n$ が存在して $n^2=2$」の否定を書きます。一つも存在しないとは、すべての整数がその条件を満たさないことです。`),
 ]},
 'm1-converse-contrapositive':{title:'条件全体を、向きと否定に対応させる',goal:'同じ条件を一つのまとまりとして扱います。',check:m`$x$ は実数、$p:x=2$、$q:x^2=4$ です。`,steps:[
  step('transform',0,'逆は順序を交換する',m`元の命題 $p\Rightarrow q$ の逆は、$q\Rightarrow p$。仮定と結論を交換します。`),
  step('transform',1,'裏は両方を否定する',m`裏は $\neg p\Rightarrow\neg q$。元の順序を保って、二つの条件をそれぞれ否定します。`),
  step('transform',2,'対偶は交換して否定する',m`対偶は $\neg q\Rightarrow\neg p$。結論の否定から、仮定の否定へ進みます。`),
  step('transform',3,'偽になる場合が同じ',m`元の命題も対偶も、偽になるのは「$p$ が真で $q$ が偽」の場合です。したがって真偽が一致します。`),
 ]},
 'm1-direct-proof':{title:'計算結果を、整数の定義に戻す',goal:'括弧全体がどんな数かを確かめます。',check:'',steps:[
  step('direct',0,'偶数と奇数を式にする',m`偶数 $a$ と奇数 $b$ の和を考えます。別々の整数 $r,s$ を使い、$a=2r$、$b=2s+1$ と表します。`),
  step('direct',1,'整数のまとまりを見つける',m`和は $2(r+s)+1$。$r+s$ は整数の和なので整数です。奇数の定義の「整数」に、括弧全体が対応します。`),
  step('direct',2,'連続する関係を表す',m`次は連続する三整数の和です。最小を整数 $n$ とすれば、残りは $n+1,n+2$ と表せます。`),
  step('direct',3,'三の倍数の定義へ戻す',m`和は $3(n+1)$。$n+1$ は整数なので、和は三の倍数です。`),
 ]},
 'm1-proof-contrapositive':{title:'対偶で、計算できる仮定へ',goal:'結論全体の否定から仮定の否定へつなぎます。',check:m`$a,b$ は実数です。`,steps:[
  step('contra-proof',0,'結論全体を否定する',m`「$a+b>0$ ならば $a>0$ または $b>0$」を証明します。結論の否定は「$a\le0$ かつ $b\le0$」です。`),
  step('contra-proof',1,'二つの不等式を足す',m`$a\le0$ と $b\le0$ を仮定すると、和は $a+b\le0$。元の仮定の否定が得られます。`),
  step('contra-proof',2,'元の命題へ戻る',m`対偶が真と示せました。元の命題と対偶の真偽は一致するので、元の命題も真です。`),
 ]},
 'm1-proof-contradiction':{title:'どの二つが矛盾するか',goal:'保つ仮定と否定する結論を区別します。',check:m`$a,b$ は実数です。`,steps:[
  step('contradiction',0,'元の仮定を保つ',m`「$a+b>0$ ならば、少なくとも一方は正」を証明します。元の仮定 $a+b>0$ はそのまま保ちます。`),
  step('contradiction',1,'結論を否定して計算する',m`結論を否定して $a\le0$ かつ $b\le0$ と仮定すると、二つを足して $a+b\le0$ です。`),
  step('contradiction',2,'同じ量の条件を照合する',m`$a+b>0$ と $a+b\le0$ は両立しません。結論の否定が誤りなので、少なくとも一方は正です。`),
 ]},
};
