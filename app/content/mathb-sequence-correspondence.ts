import type {FormulaLesson, FormulaStep} from "./formula-correspondence";

const m = String.raw;
const step = (label: string, text: string, ...formulas: string[]): FormulaStep => ({label, text, formulas});
function frame(label: string, text: string, kind: string, stage: number, animated = false): FormulaStep {
  return {label, text, formulas: [], diagram: {kind: "mb-sequence-" + kind, stage, animated}};
}
function lesson(title: string, steps: FormulaStep[]): FormulaLesson {
  return {title, goal: steps[0].text, check: "", steps};
}

export const mathBSequenceCorrespondence: Record<string, FormulaLesson> = {
  "mb-sequence-terms": lesson("番号を決めて、項を読む", [
    frame("番号と値", m`$a_n=2n-1$ の数列です。第3項は、番号が3の列で読みます。`, "indices", 0),
    frame("一つ後の番号", m`$a_{3+1}$ は右隣の列の値。$a_3+1$ なら、元の列の値に1を足します。`, "indices", 1, true),
  ]),
  "mb-arithmetic": lesson("項の間にある区間を数える", [
    frame("公差を足す回数", "初項3から第4項の9まで、公差2を足す区間は三つです。", "gaps", 0),
    step("離れた二項", m`$i<j$ のとき、第 $i$ 項から第 $j$ 項までに公差を $j-i$ 回足します。公差が負でも同じ式です。`, m`a_j-a_i=(j-i)d`, m`a_n=a_1+(n-1)d`),
  ]),
  "mb-arithmetic-sum": lesson("逆順の和を重ねる", [
    frame("項を列にする", m`点の列の高さは $1,2,3,4$。全部の点が、求めたい和です。`, "pairs", 0),
    frame("同じ和を逆順にする", "もう一枚を半回転すると、どの列も両端の和と同じ高さになります。", "pairs", 1, true),
    step("二枚分から一枚分へ", m`一般の等差数列でも、片方が公差だけ増えると相手は同じだけ減ります。各組の和は一定です。`, m`2S_n=n(a_1+a_n)`, m`S_n=\frac{n(a_1+a_n)}{2}`),
  ]),
  "mb-geometric": lesson("項の値を同じ倍率で動かす", [
    frame("公比と符号", m`初項2から $-2$ 倍するたび、符号は交替し、絶対値は2倍になります。`, "ratio", 0),
    step("倍率を掛けた回数", m`$a_1$ から $a_n$ までは $n-1$ 回。$r\ne0$ ならこの回数が指数です。`, m`a_n=a_1r^{n-1}`),
    step("公比が0のとき", m`掛け算の規則 $a_{n+1}=ra_n$ に戻ると、初項の次からすべて0です。前の項で割る方法は、その項が0のときは使えません。`),
  ]),
  "mb-geometric-sum": lesson("同じべきが並ぶ位置へずらす", [
    frame("元の和", m`初項1、公比2の四項の和 $S$。横の位置を2の指数に合わせます。`, "geosum", 0),
    frame("公比倍した和", m`$2S$ の各項は、$S$ の一つ右の列へ移ります。上下を引くと、相手のない両端が残ります。`, "geosum", 1, true),
    step("残った二項", m`一般には $S_n-rS_n=a-ar^n$。$r\ne1$ なら両辺を $1-r$ で割れます。`, m`S_n=\frac{a(1-r^n)}{1-r}`),
    step("公比が1", "各項が初項と同じ値なので、項数を掛けます。", m`S_n=na`),
  ]),
  "mb-sigma": lesson("下端から上端まで一項ずつ読む", [
    step("動く番号", m`下端2から上端5まで、$k$ に入る整数は四つです。`, m`\sum_{k=2}^5 k=2+3+4+5`),
    step("定数を足す回数", m`同じ範囲でも、足す式が3なら、どの番号にも3が対応します。`, m`\sum_{k=2}^5 3=3+3+3+3`),
    step("同じ範囲の和", m`整数 $p\le q$ の間には $q-p+1$ 項あります。各項を足し算に分ければ、同じ範囲の和ごとにまとめられます。`, m`\sum_{k=p}^q c=(q-p+1)c\quad(c\text{ は定数})`),
  ]),
  "mb-power-sums": lesson("立方体から平方和へ", [
    frame("もとの立方体", m`一辺 $k$ の立方体を一辺 $k+1$ に広げます。図では $k=3$。何が増えるでしょうか。`, "shell", 0),
    frame("増える部品", m`厚さ1の板が三枚、長さ $k$ の棒が三本、角に単位立方体が一個です。`, "shell", 1, true),
    frame("一つの立方体へ", m`部品を戻すと、一辺 $k+1$ の立方体になります。増えた体積は各部品の体積の和です。`, "shell", 2, true),
    step("増えた体積を足す", m`$k=1$ から $n$ まで足すと、途中の立方体は差し引きで消えます。残った式を平方和について解きます。`, m`(n+1)^3-1=3\sum_{k=1}^n k^2+3\sum_{k=1}^n k+n`, m`\sum_{k=1}^n k^2=\frac{n(n+1)(2n+1)}6`),
    step("立方和の形", m`三角数 $T_k=\frac{k(k+1)}2$ の平方どうしの差は $k^3$。足すと最後の平方が残ります。`, m`T_k^2-T_{k-1}^2=k^3`, m`\sum_{k=1}^n k^3=T_n^2\quad(T_0=0)`),
  ]),
  "mb-differences": lesson("差を項の間に置く", [
    frame("増えた量", m`$1,4,9,16$ の隣り合う値を引くと、間に $3,5,7$ が並びます。`, "gaps", 1),
    step("初項から戻す", m`第 $n$ 項へ着く最後の区間は $a_{n-1}$ から $a_n$。階差を定める規則が与えられれば、この区間までを足せます。`, m`a_n=a_1+\sum_{k=1}^{n-1}(a_{k+1}-a_k)\quad(n\ge2)`),
  ]),
  "mb-partial-fractions": lesson("通分後の分子から係数を決める", [
    step("因数の間隔", m`正の整数 $k$ で、二つの分母の間隔は2。逆数の差を通分すると、その2が分子に現れます。`, m`\frac1k-\frac1{k+2}=\frac{(k+2)-k}{k(k+2)}`),
    step("元の分子に合わせる", "分子を1にしたいので、差全体を半分にします。", m`\frac1{k(k+2)}=\frac12\left(\frac1k-\frac1{k+2}\right)`),
  ]),
  "mb-telescoping": lesson("相手のある項と、端に残る項", [
    frame("差を縦に置く", m`$\sum_{k=1}^{4}(b_k-b_{k+1})$。各列に同じ $k$ から生まれた正負の項を並べます。`, "cancel", 0),
    frame("同じ添字をそろえる", "下段を一列動かすと、同じ項が逆の符号で上下に並びます。端には相手がいません。", "cancel", 1, true),
    step("ずれた幅と残る項", m`一つ先との差なら一項ずつ。二つ先との差では、$n\ge2$ のとき二項ずつ残ります。`, m`\sum_{k=1}^n(b_k-b_{k+1})=b_1-b_{n+1}`, m`\sum_{k=1}^n(b_k-b_{k+2})`, m`=b_1+b_2-b_{n+1}-b_{n+2}`),
  ]),
  "mb-weighted-geometric": lesson("べきをそろえて係数を引く", [
    frame("各べきの係数", m`$S=1r+2r^2+3r^3$。上の段に、それぞれのべきの係数を置きます。`, "weighted", 0),
    frame("一つ右のべきへ", m`$rS$ は各係数が右へ一列ずれます。中央では係数の差が1、右端では下段だけが残ります。`, "weighted", 1, true),
    step("端も含めた差", m`$S=\sum_{k=1}^n kr^k$ とします。先頭から $n$ 列の係数は1。末尾は下段を引くため負です。$r\ne1$ なら $1-r$ で割れます。`, m`(1-r)S=\sum_{k=1}^n r^k-nr^{n+1}`),
  ]),
  "mb-recurrence": lesson("初項と更新の式を組み合わせる", [
    step("出発点", m`$a_{n+1}=2a_n+1$ は、今の値が決まると次の値を一つに決めます。初項を2とします。`, m`a_1=2,\qquad a_2=2\cdot2+1=5`),
    step("次の入力", m`求めた $a_2$ がそのまま次の入力です。同じ更新を、添字を一つずつ進めて使います。`, m`a_3=2\cdot5+1=11`, m`a_4=2\cdot11+1=23`),
  ]),
  "mb-recurrence-difference": lesson("更新一回分を、隣の項の差へ", [
    step("変わる量", m`$a_{n+1}=a_n+n$ で決まっているのは、一回で増える量です。$a_2-a_1=1$、$a_3-a_2=2$ と並びます。`),
    step("最初と最後を残す", m`第 $n$ 項までの $n-1$ 個の差を足すと、途中の項は符号が逆で消えます。`, m`a_n-a_1=1+\cdots+(n-1)\quad(n\ge2)`),
    step("初項を戻す", m`両辺に $a_1$ を足します。$n=1$ でも増分が0になるので、初項にも合います。`, m`a_n=a_1+\frac{n(n-1)}2\quad(n\ge1)`),
  ]),
  "mb-affine-recurrence": lesson("動かない点から距離を測る", [
    frame("動かない値", m`$a_{n+1}=2a_n+1$ で、$-1$ は更新後も $-1$。初項を0とし、この固定点から各項までを測ります。`, "fixed", 0),
    frame("距離の倍率", m`項は $0,1,3$ と進みます。同じ固定点から測ると、距離は $1,2,4$ と毎回2倍です。`, "fixed", 1, true),
    step("定数項が消える理由", m`一般に $a_{n+1}=pa_n+q$、$p\ne1$ なら、$L=pL+q$ を引くと、固定点からの符号付きの差が毎回 $p$ 倍になります。`, m`a_{n+1}-L=p(a_n-L)`),
    step("元の項に戻す", m`$p\ne0,1$ なら $a_n-L=(a_1-L)p^{n-1}$。$p=0$ なら第2項以降は $q$、$p=1$ なら公差 $q$ の等差数列です。`, m`a_n=L+(a_1-L)p^{n-1}\quad(p\ne0,1)`),
  ]),
  "mb-sum-to-term": lesson("二つの和の重なりを取り除く", [
    frame("二つの和", m`$S_4$ と $S_3$ を初項から並べると、初めの三項が一致します。`, "partial", 0),
    frame("最後の一項", m`$S_4$ から $S_3$ を引けば、重ならない $a_4$ だけが残ります。`, "partial", 1, true),
    step("初項の扱い", m`$S_n$ の式が $n\ge1$ で与えられたとき、$S_{n-1}$ にもこの式が使えるのは $n\ge2$ です。初項は $S_1$ で確かめます。`, m`a_1=S_1,\quad a_n=S_n-S_{n-1}\ (n\ge2)`),
  ]),
  "mb-induction-identities": lesson("仮定した和を、次の左辺の中に探す", [
    step("最初の成立", m`$1+\cdots+n=\frac{n(n+1)}2$ を示します。$n=1$ のとき、左辺も右辺も1です。`),
    step("仮定を使う場所", m`ある正の整数 $k$ での成立を仮定します。次の左辺では、最後の一項より前が、仮定した和です。`, m`S_{k+1}=S_k+(k+1)`, m`=\frac{k(k+1)}2+(k+1)`),
    step("次の式につなぐ", m`共通の $k+1$ をくくると、目標の右辺になります。初めが成り立ち、任意の $k$ から次へ進めるので、すべての正の整数で成立します。`, m`\frac{k(k+1)}2+(k+1)=\frac{(k+1)(k+2)}2`),
  ]),
  "mb-induction-properties": lesson("次の式に、仮定を使える形を作る", [
    step("最初の倍数", m`$4^n-1$ が3の倍数であることを示します。$n=1$ では $4-1=3$ です。`),
    step("仮定の形を残す", m`任意の正の整数 $k$ で $4^k-1=3t$（$t$ は整数）と仮定します。次の式にも $4^k-1$ を作ります。`, m`4^{k+1}-1=4(4^k-1)+3`),
    step("同じ性質へ", m`代入すると $3(4t+1)$。括弧の中が整数なので、次も3の倍数です。初めの成立と合わせ、すべての正の整数で成立します。`),
    step("不等式を引き継ぐとき", m`不等式では掛ける数の符号を読みます。例えば $2^k\ge k+1$ に正の2を掛ければ向きが保たれ、$k\ge1$ なら $2(k+1)\ge k+2$ です。`),
  ]),
};
