import type {FormulaLesson, FormulaStep} from './formula-correspondence';

const m = String.raw;
function scene(kind: string, stage: number): FormulaStep['diagram'] {
  return {kind: `mb-society-${kind}`, stage, animated: true};
}

export const mathBSocietyCorrespondence: Record<string, FormulaLesson> = {
  'mb-compound-growth': {
    title: '利息はどこに付く？', goal: '利率を掛ける残高を見つけます。', check: '',
    steps: [
      {label: '元金', text: m`元金は $4$ 万円。年率 $50\%$ のモデルです。入出金・税・手数料はありません。`, formulas: [], diagram: scene('interest', 0)},
      {label: '一年後', text: m`最初の一年は、どちらも元金 $4$ 万円の半分が利息です。`, formulas: [], diagram: scene('interest', 1)},
      {label: '二年後', text: m`単利は最初の $4$ 万円に、複利は利息を含む $6$ 万円に利率を掛けます。`, formulas: [], diagram: scene('interest', 2)},
      {label: '一定なのは額か割合か', text: m`元金を $P$、一定の年利率を $r$ とします。$n$ 年後まで、単利では毎年 $Pr$ を足し、複利では毎年 $1+r$ 倍します。`, formulas: [m`P+nPr`, m`P(1+r)^n`]},
    ],
  },
  'mb-balance-recurrence': {
    title: '入金ごとに、利息が付く年を数える', goal: '利息と入金の順序から残高の式を作ります。', check: '',
    steps: [
      {label: '一年目の入金', text: m`初めの残高は $0$ 円。毎年 $2\%$ の利息を付けた直後に $1000$ 円ずつ入金します。初回の入金に、その年の利息は付きません。`, formulas: [], diagram: scene('deposits', 0)},
      {label: '二年目の入金', text: '前の年から置いてあったお金だけに利息が付きます。二回目の入金は、ここから預け始めます。', formulas: [], diagram: scene('deposits', 1)},
      {label: '三年目の残高', text: m`同じ $1000$ 円でも、利息が付いた回数は順に $2,1,0$ 回。三つを足すと年末の残高です。`, formulas: [], diagram: scene('deposits', 2)},
      {label: '一年分の式', text: m`年末の残高 $A_n$ 全体に利息を付け、その後で入金します。返済なら、利息を付けた借入残高から返済額を引きます。`, formulas: [m`A_{n+1}=1.02A_n+1000`]},
    ],
  },
  'mb-data-function': {
    title: '横に一つ進むと、縦はいくつ？', goal: '代表点を結んで、変化量と予測値を読みます。', check: '',
    steps: [
      {label: '代表点', text: m`架空の観測を黒い点で示します。両端の $(0,5)$ と $(4,13)$ を代表点に選びます。`, formulas: [], diagram: scene('fit', 0)},
      {label: '一単位の変化', text: m`横に $4$ 進む間に縦に $8$ 上がります。直線では横に $1$ 進むごとに、縦に $2$ 上がります。`, formulas: [], diagram: scene('fit', 1)},
      {label: '同じ場所で読む', text: m`$x=3$ の直線上の高さは $5+2\times3=11$。観測した値は $12$ です。代表点を通る直線は、間の値を予測するモデルです。`, formulas: [], diagram: scene('fit', 2)},
    ],
  },
  'mb-residuals': {
    title: '予測の高さをそろえる', goal: '同じ横座標で、観測が予測からどちらにずれたかを読みます。', check: '',
    steps: [
      {label: '同じ横座標', text: m`白い丸は直線の予測、黒い点は観測です。$x=2$ では予測が $9$、観測が $8$。残差は $8-9=-1$ です。`, formulas: [], diagram: scene('residual', 0)},
      {label: '予測を引く', text: m`予測を引くと、白い丸の高さが $0$ にそろいます。観測点に残る高さが残差です。`, formulas: [], diagram: scene('residual', 1)},
      {label: 'ずれの大きさ', text: m`$+1$ と $-1$ は足すと打ち消し合います。二乗すれば、どちらも $1$ のずれとして数えられます。`, formulas: [], diagram: scene('residual', 2)},
      {label: '予測できる範囲', text: '観測した範囲で残差が小さくても、その外で同じ傾きが続くとは限りません。予測する範囲と条件を確かめます。', formulas: []},
    ],
  },
  'mb-survey-simulation': {
    title: '一回の実験から一点を作る', goal: '試行回数と実験の反復回数を区別します。', check: '',
    steps: [
      {label: '一回の実験', text: m`公平な硬貨を独立に $4$ 回投げるのが一回の実験です。表の回数を一つ記録します。`, formulas: [], diagram: scene('trials', 0)},
      {label: '同じ条件で繰り返す', text: m`同じ実験をあと $3$ 回行ったとします。各行の表を数えると、それぞれ一つの結果になります。`, formulas: [], diagram: scene('trials', 1)},
      {label: '実験ごとに一点', text: '一行を一点にすると、表が二回だった実験が二つ重なります。', formulas: [], diagram: scene('trials', 2)},
      {label: '結果の出どころ', text: '実験の結果は仮定したモデルから生まれます。学校の実態を知るには、対象と質問を決め、実際の生徒を偏りの少ない方法で調査します。', formulas: []},
    ],
  },
};
