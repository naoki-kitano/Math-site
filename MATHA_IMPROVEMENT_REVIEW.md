# 数学Aの見直しと実装対象

2026-11-10。全74教材・157例題・2,219設問・432補足の原本、生成関数と実行時対応を分野別に点検。各数値変種を全問独立に再計算したという意味ではない。

判断基準は、操作の理由、式や図の対応、今必要な情報量、次へ進む操作、小画面での可読性。色だけを加える図、単なる実況、問題に関係のない注意を避ける。必要な条件・途中式・理由・既存の有効な動きは残す。

以下の対象を実装した。実装範囲と確認結果は [MATHA_IMPLEMENTATION.md](MATHA_IMPLEMENTATION.md)、版ごとの証拠は [MATHA_IMPLEMENTATION_EVIDENCE.json](MATHA_IMPLEMENTATION_EVIDENCE.json) を参照。

## 第1章

- `ma-listing`：列挙の一行と一組の対応を表示
- `ma-sum-product`：和と積の数える対象を分ける
- `ma-changing-options`：枝ごとの残りの候補を見せる
- `ma-set-count`：共通部分の二重計数を可視化
- `ma-permutation`：発表位置と積の因子を対応
- `ma-repeated-choice`：先頭の条件と再使用を分ける
- `ma-restricted-permutation`：ブロック内外を分ける
- `ma-circular-permutation`：回転による同一性を示す
- `ma-combination`：同じ組に含まれる並びを束ねる
- `ma-order-or-selection`：入れ替えて同一かを直接比べる
- `ma-identical-permutation`：仮番号を消す対応と経路文字列
- `ma-grouping`：同一分割の二重計数を束ねる
- `ma-count-complement`：全体の排反分割と差を対応
- `ma-counting-check`：定型指示を具体的な判断へ

## 第2章

- `ma-events`：全結果から事象へ残す対応
- `ma-equally-likely`：色の種類と等確率な個体の混同
- `ma-probability-count`：分母と分子の数える単位
- `ma-probability-complement`：少なくとも一回の反対を選ぶ
- `ma-probability-union`：共通部分を引く理由
- `ma-probability-tree`：経路の積と経路間の和・例題図の値不一致
- `ma-replacement`：一回目の後に減る分母と分子
- `ma-independent-trials`：独立な積の中身
- `ma-repeated-trials`：組合せ係数と一列の確率・不要な全問共通の境界注意
- `ma-conditional-probability`：条件後の分母の意味・実況的な禁止文
- `ma-probability-multiplication`：条件付きの確率をどこへ入れるか
- `ma-independent-exclusive`：排反と独立は別の判定
- `ma-posterior-probability`：箱の重みと結果後の全体
- `ma-expected-value`：確率と値の対応・単純平均との違い
- `ma-expected-profit`：費用を全結果から引く・平均と実結果の違い
- `ma-probability-check`：章末コピーと復習先の整合

## 第3章

- `ma-figure-angles`：三角形の三角と和を対応させ、平行条件の有無を分ける。
- `ma-congruence-similarity`：頂点の順序から対応辺を作り、その辺の比へ数値を入れる。
- `ma-parallel-ratios`：部分2と3を全体5へ組み立て、AE/ACとAD/ABをそろえる。
- `ma-area-ratios`：共通の高さが消える場合と高さも変わる場合を面積式から分ける。
- `ma-triangle-sides-angles`：最長辺とその向かいの頂点を対応させる。成立条件の理由を保持。
- `ma-angle-bisector`：内分の和と外分の差を位置と長さから組み立てる。
- `ma-centroid`：中線を頂点側2・中点側1に分け、全体3を図で見せる。
- `ma-incenter-circumcenter`：辺への垂線と頂点までの半径を別々に表示する。
- `ma-ceva`：BC→CA→ABを巡り、各辺の前半/後半を同じ順序の三つの比へ対応。
- `ma-menelaus`：同じ巡りの比を作り、外点ではAFがAB+BFとなることを示す。
- `ma-geometry-converses`：既知の比から積を調べ、配置条件を伴って結論する向きを明確にする。
- `ma-inscribed-angle`：頂点を含まない弧を先に選び、中心角と円周角の両端を対応。
- `ma-cyclic-quadrilateral`：対角が見込む二つの弧を合わせて一周→半分の180度へ。
- `ma-circle-tangent`：接点に半径を加え、直角三角形の斜辺・半径・接線を式の項に対応。
- `ma-tangent-chord`：接線の半直線と円周角頂点の側を固定し、反対向きの補角を区別。
- `ma-power-of-point`：同じ起点から測る二組の積を対応し、外側はPB=PA+ABを先に作る。
- `ma-two-circles`：外接の和・内接の差を中心と接点の位置から示す。一致は別扱い。
- `ma-common-tangents`：垂直な二半径の和/差が直角三角形の一辺になる構造を示す。
- `ma-plane-geometry-check`：章末の設問と理由・条件・元教材の対応を維持。重複する定型案内を増やさない。

## 第4章

- `ma-construction-bisectors`：同じ半径で作る等距離と、合同の対応を円弧/辺/角と合わせる。 / 作図の長い一段落を操作と根拠で分け、毎問の重複した一般注意を短くする。
- `ma-construction-perpendicular`：外点から等距離の二点を取る理由と、垂線を二回使う平行線の理由を段階図で対応させる。
- `ma-construction-division`：補助半直線の部分/全体を、平行線による相似で元の線分の部分/全体へ対応させる。比の和を全体とする構造を可視化。
- `ma-construction-tangents`：補助円の直径→円周角の直角→半径に垂直な接線、を同じ接点で段階表示する。
- `ma-space-lines`：見取図の交差と空間の共有点を区別し、比べる二直線だけ強調。設問に不要な定型末尾を除く。
- `ma-space-lines-planes`：平面に交わる二直線と垂線の条件を図で示す。二平面の理由を実際の交線・面内の辺に具体化。
- `ma-space-angle-distance`：点への距離と平面への距離を別の線分に対応させる。正射影は上の点→垂線の足→元の始点と結ぶ、の順に示す。
- `ma-solid-sections`：各線分を含む面を順に示し、切り口が閉じることと辺の長さの根拠を対応させる。
- `ma-polyhedron-counts`：底面/上面/つなぐ辺・側面を数式の各項に対応させる。Eulerの証明は必要な不変量を短い文で段階化。
- `ma-space-construction-check`：元教材での理由・作図段階の修正を章末コピーにも保持。章末は方法選択の練習なので新しい総覧アニメーションは追加しない。

## 第5章

- `ma-divisors-primes`：積の対と約数の集合を対応させ、平方根までで十分な理由を短く示す
- `ma-prime-factorization`：指数の選択が約数と一対一に対応する構造と、奇数指数を補う役割を示す
- `ma-gcd-lcm`：小さい/大きい指数を採る理由を、両方を割る/含む制約へ結び付ける
- `ma-quotient-remainder`：負の商と非負の余りを、下側の倍数からの距離に対応させる
- `ma-parity-proofs`：二倍の整数の枠へ式全体をまとめる役割を示す
- `ma-remainder-classification`：元の全余りから平方の余りへの対応を漏れなく追う
- `ma-divisibility-digits`：位の重みと桁和が同じ余りになる理由を示す
- `ma-euclidean-algorithm`：割る数と余りが次の二数へ移る構造、公約数不変の理由を結ぶ
- `ma-linear-diophantine`：一解との差から全解の増減幅が決まる構造を示す
- `ma-integer-count-conditions`：整数パラメータの範囲と許される組の対応を明示
- `ma-terminating-recurring`：約分後の分母が10の累乗へ補えること、循環部分の相殺を示す
- `ma-binary-notation`：桁と重み、2で割る余りと最下位桁の対応を示す
- `ma-coordinates-space`：0の成分と残る座標平面/軸を対応させる
- `ma-mathematics-activities`：面の等分と枚数、石取りの2通りの応答と不変量を対応させる
- `ma-integers-check`：章末は前章の問い/補足の変更が正しく追随することを確認

## 実装と確認

対応する部分を同じ色で保ち、段階ごとに数え方・分母・辺・因数の役割を見せる。例題・設問の解説は、著者が定義や条件に基づくまとまりを指定する。補足の別条件の例は任意表示へ分ける。例題図を別の値の設問に流用しない。

実装結果と実測した確認範囲は、実装記録へ別途記載する。
