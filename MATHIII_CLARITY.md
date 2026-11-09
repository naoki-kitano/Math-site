# 数学IIIの導入・式の対応の見直し（2026-11-09）

対象は106教材の導入・公式・基本画面。全1,600設問を再校閲した記録ではない。

## 今回の基準

- 一度に取り組む説明を一つにし、進行番号とジャンプメニューを増やさない。
- 色は同じ対象の対応に使い、動きは移動先・残る因子・代入先を伝える。
- 数学的な条件と記号の定義を、その式を読む画面にも残す。動く図を証明として扱わない。
- 既存の根拠・途中式・演習は保持し、全文を読む選択肢も残す。
- 数式の実際の寸法から矢印を配置する。添字・分子には横から接続し、記号を横切らせない。

## 変更範囲

95教材の導入を段階表示にし、必要な条件・記号を継続表示。8教材で式の対応を動きで示し、3教材の既存の対話図を維持。数学IIIの表は存在する教材だけで開けるようにした。対数の積の矢印も同じ測定方式へ変更した。

独立したgpt-6-astraレビューは全106教材の導入・rule、既存の図解・表、変更した式・条件を対象とした。段落分割で条件が離れる問題、動きの追加で途中式が隠れる問題を修正し再確認済み。画面・矢印は主担当が確認する。

## 教材別の対応

| 教材 | 今回の基本画面 |
|---|---|
| 関数に数や式を代入する (m3-function-input) | 導入を段階表示 |
| 定義域と値域を区別する (m3-domain-range) | 導入を段階表示 |
| 分数関数のグラフを読む (m3-rational-functions) | 導入を段階表示 |
| 無理関数のグラフを読む (m3-radical-functions) | 導入を段階表示 |
| 合成関数の計算順を読む (m3-composition) | 導入を段階表示 |
| 合成関数の定義域を調べる (m3-composition-domain) | 導入を段階表示 |
| 逆関数を入力と出力から考える (m3-inverse-functions) | 導入を段階表示 |
| グラフから方程式と不等式を読む (m3-graph-equations) | 導入を段階表示 |
| 第1章を振り返る (m3-functions-check) | 導入を段階表示 |
| 一般項と部分和を区別する (m3-sequence-basics) | 導入を段階表示 |
| 収束と発散を読み分ける (m3-sequence-convergence) | 導入を段階表示 |
| 分数の数列を読みやすく直す (m3-sequence-rational-limit) | 導入を段階表示 |
| 根号の差を有理化する (m3-sequence-radical-limit) | 導入を段階表示 |
| 等比数列の大きさと符号を見る (m3-geometric-sequence-limit) | 導入を段階表示 |
| 値の範囲ではさむ (m3-sequence-squeeze) | 導入を段階表示 |
| 無限級数を部分和で考える (m3-infinite-series-meaning) | 導入を段階表示 |
| 無限等比級数の条件を確かめる (m3-geometric-series) | 導入を段階表示 |
| 部分和で消える項を見つける (m3-telescoping-series) | 導入を段階表示 |
| 漸化式から収束を確かめる (m3-recurrence-limit) | 導入を段階表示 |
| 数列と級数を自分で確かめる (m3-sequences-check) | 導入を段階表示 |
| 関数値と極限値 (m3-limit-and-value) | 導入を段階表示 |
| 左右から近づく極限 (m3-one-sided-limits) | 導入を段階表示 |
| 代入で求まる極限 (m3-direct-substitution) | 導入を段階表示 |
| 因数分解と不定形 (m3-factorization-limits) | 導入を段階表示 |
| 有理化と通分 (m3-rationalizing-limits) | 導入を段階表示 |
| 無限遠と式の主要項 (m3-limits-at-infinity) | 導入を段階表示 |
| 三角関数の基本極限 (m3-trigonometric-limits) | 導入を段階表示 |
| 自然対数への入口 (m3-e-and-natural-log) | 導入を段階表示 |
| 指数・対数の基本極限 (m3-exponential-log-limits) | 導入を段階表示 |
| 連続性と点のつながり (m3-continuity) | 導入を段階表示 |
| 中間値の定理と解の存在 (m3-intermediate-value) | 導入を段階表示 |
| 関数の極限・章末確認 (m3-function-limits-check) | 導入を段階表示 |
| 微分係数と導関数 (m3-derivative-meaning) | 既存の対話図を維持 |
| 差商から導く微分 (m3-derivative-definition) | 導入を段階表示 |
| 連続性と微分可能性 (m3-differentiability) | 導入を段階表示 |
| 累乗の微分 (m3-power-derivatives) | 導入を段階表示 |
| 三角関数の微分 (m3-trigonometric-derivatives) | 導入を段階表示 |
| 指数・対数関数の微分 (m3-exponential-log-derivatives) | 導入を段階表示 |
| 積の微分 (m3-product-derivative) | 式の対応を動きで表示 |
| 商の微分 (m3-quotient-derivative) | 式の対応を動きで表示 |
| 合成関数の微分 (m3-chain-rule) | 式の対応を動きで表示 |
| 三角・指数・対数の合成 (m3-chain-rule-functions) | 導入を段階表示 |
| 微分前の式整理 (m3-simplify-before-derivative) | 導入を段階表示 |
| 対数を使う微分 (m3-logarithmic-differentiation) | 導入を段階表示 |
| 方程式から求める微分 (m3-implicit-derivative) | 導入を段階表示 |
| 逆関数の微分 (m3-inverse-derivative) | 導入を段階表示 |
| 媒介変数と傾き (m3-parametric-derivative) | 導入を段階表示 |
| 第二次導関数 (m3-second-derivative) | 導入を段階表示 |
| 式の構造と微分法 (m3-choose-derivative) | 導入を段階表示 |
| 微分法の総合確認 (m3-derivatives-check) | 導入を段階表示 |
| 接点と接線 (m3-tangent-at-point) | 導入を段階表示 |
| 接線に垂直な法線 (m3-normal-line) | 導入を段階表示 |
| 接点が未知の接線 (m3-unknown-contact) | 導入を段階表示 |
| 接線による一次近似 (m3-linear-approximation) | 導入を段階表示 |
| 平均値の定理 (m3-mean-value-theorem) | 導入を段階表示 |
| 導関数の符号と極値 (m3-monotonicity-extrema) | 導入を段階表示 |
| 最大値・最小値と定義域 (m3-global-extrema) | 導入を段階表示 |
| 凹凸と変曲点 (m3-concavity-inflection) | 導入を段階表示 |
| 極限・増減・凹凸とグラフ (m3-curve-sketch) | 導入を段階表示 |
| 解の存在と個数 (m3-roots-existence-count) | 導入を段階表示 |
| 差の最小値と不等式 (m3-derivative-inequalities) | 導入を段階表示 |
| 位置・速度・加速度 (m3-velocity-acceleration) | 導入を段階表示 |
| 条件から作る最大・最小 (m3-optimization-model) | 導入を段階表示 |
| 微分の応用を確かめる (m3-applications-check) | 導入を段階表示 |
| 原始関数と積分定数 (m3-antiderivative-constant) | 導入を段階表示 |
| べきと逆数の積分 (m3-power-integrals) | 導入を段階表示 |
| 三角関数の基本積分 (m3-trig-basic-integrals) | 導入を段階表示 |
| 指数関数の積分 (m3-exponential-integrals) | 導入を段階表示 |
| 一次式の中身と係数調整 (m3-linear-inner-integrals) | 導入を段階表示 |
| 内側の微分を見付ける (m3-reverse-chain-integrals) | 導入を段階表示 |
| 分母の微分と対数 (m3-log-derivative-integrals) | 導入を段階表示 |
| 積分の前の式変形 (m3-algebra-before-integrals) | 導入を段階表示 |
| 部分分数分解と積分 (m3-partial-fractions) | 導入を段階表示 |
| 三角関数を積分できる形へ (m3-trig-transform-integrals) | 導入を段階表示 |
| 置換積分と変数の統一 (m3-substitution-integrals) | 式の対応を動きで表示 |
| 根号を外す置換 (m3-radical-substitution) | 導入を段階表示 |
| 三角置換と角の範囲 (m3-trig-substitution) | 導入を段階表示 |
| 積の微分から部分積分へ (m3-parts-introduction) | 式の対応を動きで表示 |
| 三角関数・対数の部分積分 (m3-parts-log-trig) | 導入を段階表示 |
| 式の構造と積分法 (m3-choose-integral) | 導入を段階表示 |
| 不定積分を確かめる (m3-indefinite-integrals-check) | 導入を段階表示 |
| 不定積分と定積分 (m3-definite-meaning) | 導入を段階表示 |
| 原始関数と両端の値 (m3-endpoint-evaluation) | 式の対応を動きで表示 |
| 積分区間と基本性質 (m3-integral-properties) | 導入を段階表示 |
| 積分変数と定数 (m3-dummy-variable) | 導入を段階表示 |
| 置換と積分範囲 (m3-definite-substitution) | 式の対応を動きで表示 |
| 部分積分と境界の項 (m3-definite-parts) | 導入を段階表示 |
| 偶奇性と対称区間 (m3-integral-symmetry) | 導入を段階表示 |
| 積分で定義された関数 (m3-integral-function) | 導入を段階表示 |
| 動く上下端と合成関数 (m3-moving-endpoints) | 式の対応を動きで表示 |
| 小長方形の和と定積分 (m3-riemann-sums) | 既存の対話図を維持 |
| 関数の大小と積分の評価 (m3-integral-bounds) | 導入を段階表示 |
| 定積分の総確認 (m3-definite-integrals-check) | 導入を段階表示 |
| 定積分と面積 (m3-signed-area) | 既存の対話図を維持 |
| 二曲線の間の面積 (m3-between-curves) | 導入を段階表示 |
| 上下が変わる面積 (m3-area-splitting) | 導入を段階表示 |
| 横に切る面積 (m3-horizontal-area) | 導入を段階表示 |
| 断面積から体積へ (m3-cross-section-volume) | 導入を段階表示 |
| 回転体と円板の断面 (m3-disk-volume) | 導入を段階表示 |
| 円環の断面と回転体 (m3-washer-volume) | 導入を段階表示 |
| 回転軸と積分方向 (m3-rotation-direction) | 導入を段階表示 |
| 曲線の長さと小線分 (m3-graph-length) | 導入を段階表示 |
| 媒介変数と曲線の長さ (m3-parametric-length) | 導入を段階表示 |
| 媒介変数と面積の向き (m3-parametric-area) | 導入を段階表示 |
| 変位と道のり (m3-displacement-distance) | 導入を段階表示 |
| 積分の応用の総確認 (m3-integral-applications-check) | 導入を段階表示 |

次の改善候補は、分数・無理関数の点の移動、逆関数の座標交換、曲線間の帯と回転体の断面。今回はこれらの図を新たにアニメーション化したとは数えない。
