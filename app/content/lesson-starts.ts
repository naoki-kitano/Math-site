// Concise routes into selected concepts. Full definitions and hypotheses remain
// in the lesson's existing introduction and rule, immediately below each figure.
import {visualLessons} from "./visual-lessons";
import {relationStarts} from "./relation-lessons";
export type LessonStart = { goal: string; steps: string[]; check: string };
export const lessonStarts: Record<string, LessonStart> = {
  ...relationStarts,
  ...Object.fromEntries(Object.entries(visualLessons).map(([slug,lesson])=>[slug,{goal:lesson.goal,steps:[],check:lesson.check}])),
  "jr-linear-equation": {
    goal: "まず、文字のない項を消します。移項の符号を覚える前に、両辺へ同じ操作をしてみよう。",
    steps: [],
    check: "等しさを保つには両辺を同じように変形します。掛けたり割ったりする数は、零でない数にします。",
  },
  "m1-parabola-translation": {
    goal: "まず頂点を動かし、ほかの点も同じ量だけ動かします。",
    steps: [],
    check: "点には移動量を足します。式の中で引くのは、移動前の入力を求めるためです。",
  },
  "trig-unit-circle": {
    goal: "単位円上の点の座標が分かれば、三角関数の値を読み取れます。",
    steps: [String.raw`正弦 $\sin\theta$ は縦の座標を読む。`, String.raw`余弦 $\cos\theta$ は横の座標を読む。`, String.raw`正接 $\tan\theta$ は、横の座標が零でないことを確かめて、縦を横で割る。`],
    check: "「真上」を選ぶと、正接を計算できない理由も分かります。",
  },
  "trig-angle-change": {
    goal: "座標がまだ分からない角は、知っている鋭角の三角形と比べて求めます。",
    steps: [],
    check: "回して比べるのは辺の長さです。最後の符号は、動かす前の点の位置で決めます。",
  },
  "m3-derivative-meaning": {
    goal: "まず、二点を結ぶ直線の傾きを求めます。一方の点を近づけると、傾きはどう変わるでしょう。",
    steps: [],
    check: "最初から零で割ることはできません。微分係数は、平均変化率の極限が有限の値として存在するときに定義します。",
  },
  "ma-conditional-probability": {
    goal: "まず、知らされた条件に合う結果だけを残します。その中で割合を求めよう。",
    steps: [],
    check: "条件の確率が正であることが必要です。枚数の比で求められるのは、各カードを等確率で選んでいるからです。",
  },
  "mb-arithmetic-sum": {
    goal: "まず、和をもう一度、逆順に書きます。上下の対応する項を足すと何がそろうでしょう。",
    steps: [],
    check: "項数は5、末項は11です。項の値と、項の個数を区別します。",
  },
  "mc-vector-sum": {
    goal: "まず、二つ目の矢印を一つ目の先につなぎます。向きと長さは変えずに動かそう。",
    steps: [],
    check: "差は、二つ目の矢印を逆向きにしてから足します。平行移動だけでは向きは変わりません。",
  },
};
