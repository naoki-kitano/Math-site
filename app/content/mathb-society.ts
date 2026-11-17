import {B,S,m,q,nums,checked,finish,type Q} from "./mathb-authoring";
import {decimal} from "./mathb-distributions";
import {addRepairExample} from "./matha-authoring";
const chapter="数学と社会生活",sec=["変化を式にする","データを関数で読む","調査と実験を考える"];
const compound = (years: number, simple = false) => {
 const principal = 10000, rate = .02;
 const value = simple ? principal + 200 * years : principal * (1 + rate) ** years;
 const kind = simple ? '単利' : '複利';
 return checked(simple ? 'simple-interest' : 'compound-interest', [principal, rate, years], value,
  m`元金 $10000$ 円、年率 $2\%$ の${kind}で $${years}$ 年後はいくらですか。年末に利息を付け、入出金・税・手数料はなく、最後に円未満を四捨五入します。`,
  m`$${Math.round(value)}$ 円。`,
  simple ? '毎年、どの金額に利率を掛けますか。' : '二年目には一年目の利息にも利息が付きます。',
  simple ? m`元金は変わらないので、毎年の利息は $10000\times0.02=200$ 円。$10000+200\times${years}=${value}$ 円です。`
         : m`前年の残高に利息を付けるので、$1.02$ 倍を $${years}$ 回繰り返します。$10000(1.02)^{${years}}\approx${value.toFixed(2)}$ 円です。`);
};
const saving = (n: number, loan = false) => {
 const initial = loan ? 10000 : 0, payment = loan ? -1000 : 1000, factor = 1.02;
 let balance = initial;
 for (let year = 0; year < n; year++) balance = factor * balance + payment;
 const formula = m`$A_0=${initial}$。利息の後に${loan ? '返済' : '入金'}するので $A_{k+1}=1.02A_k${loan ? '-' : '+'}1000$。`;
 const reason = loan
  ? m`$L=1.02L-1000$ を満たす残高は $L=50000$。この値を引くと $A_{k+1}-50000=1.02(A_k-50000)$ です。`
  : m`初回の入金には $n-1$ 回、最後の入金には $0$ 回の利息が付きます。$A_n$ は初項 $1000$、公比 $1.02$ の等比数列の初めの $n$ 項の和です。`;
 const term = loan
  ? m`初期値との差は $A_0-50000=-40000$。従って $A_n=50000-40000(1.02)^n$ です。`
  : m`$A_n=1000\dfrac{(1.02)^n-1}{0.02}$。`;
 const result = Number.isInteger(Number(decimal(balance)))
  ? m`$n=${n}$ を代入すると $${Math.round(balance)}$ 円です。`
  : m`$n=${n}$ を代入し、円未満を四捨五入すると $${Math.round(balance)}$ 円です。`;
 const steps = [
  {title: '一年の残高', text: formula},
  {title: loan ? '一定の残高との差' : '入金ごとの利息', text: reason},
  {title: '一般項', text: term},
  {title: '年末の残高', text: result},
 ];
 const question = checked(loan ? 'loan' : 'saving', [initial, factor, payment, n], balance,
  m`初めの${loan ? '借入残高は $10000$ 円' : '残高は $0$ 円'}。毎年末、残高に $2\%$ の利息を付けた直後に $1000$ 円を${loan ? '返済' : '入金'}します。$${n}$ 年後の残高を、最後に円未満を四捨五入して求めなさい。`,
  m`$${Math.round(balance)}$ 円。`, loan ? '返済の直前、昨年の残高は何倍ですか。' : '最初と最後の入金、それぞれに何回利息が付きますか。',
  steps.map(step => step.text).join('\n'));
 return {...question, steps, answerInSteps: true};
};
const fitting = (intercept: number, rate = false) => {
 const end = intercept + 8;
 return checked(rate ? 'fit-slope' : 'fit-prediction', [intercept, 2], rate ? 2 : intercept + 6,
  m`代表点は $(0,${intercept})$ と $(4,${end})$ です。${rate ? '二点を通る直線の傾きと、その意味を答えなさい。' : m`二点を通る一次関数と、$x=3$ での予測値を求めなさい。`}`,
  rate ? m`傾きは $2$。$x$ が一単位増えると、モデルの $y$ は二単位増えます。` : m`$y=2x+${intercept}$、予測値は $${intercept + 6}$。`,
  rate ? '横に四つ進んだときの縦の変化を、横一つ分に直します。' : '横一単位あたりの変化と、出発点の高さを読みます。',
  m`横に $4$ 進むと縦に $${end}-${intercept}=8$ 上がるので、傾きは $\frac{8}{4}=2$。`+
  (rate ? '' : m`$x=0$ で $y=${intercept}$。従って $x=3$ なら $y=${intercept}+2\times3=${intercept+6}$。`));
};
const residual = (x: number, compare = false) => {
 const prediction = 2*x + 1, error = x%5 - 2, observed = prediction + error;
 const meaning = error > 0 ? '観測点は直線より上です。' : error < 0 ? '観測点は直線より下です。' : '観測点は直線上です。';
 return checked(compare ? 'squared-errors' : 'residual', [x, error], compare ? error**2 : error,
  m`観測点は $(${x},${observed})$、モデルは $y=2x+1$ です。${compare ? 'この点の残差の二乗を求めなさい。' : '残差（観測値−予測値）と、その符号の意味を答えなさい。'}`,
  compare ? m`$${error**2}$。` : m`残差 $${error}$。`+meaning,
  compare ? '同じ横座標での差を求めてから、差全体を二乗します。' : '観測点と、同じ横座標の直線上の点を比べます。',
  m`$x=${x}$ の予測値は $2\times${x}+1=${prediction}$。残差は $${observed}-${prediction}=${error}$。`+
  (compare ? m`従って残差の二乗は $(${error})^2=${error**2}$。` : meaning));
};
const word = (rows: [string, string, string][]): Q[] => rows.map(([prompt, answer, hint]) => ({
 ...q(prompt, answer, hint, answer), steps: [{title: '', text: answer}], answerInSteps: true,
}));
const modelLimits=word([
 ["十代の身長データを直線で近似しました。その直線で百歳の身長を予測してよいですか。","適切ではありません。観測範囲から大きく外れ、身長が年齢に対して同じ傾きで変化し続ける仮定は妥当ではありません。","直線が当てはまる範囲を確認します。"],
 ["売上と広告費に強い相関がありました。広告費だけが売上を変えたと結論できますか。","できません。季節や店舗規模など別の要因が関係しているかもしれません。相関だけで因果は決まりません。","他の要因の可能性を考えます。"],
 ["観測した温度範囲内で予測するときも、直線モデルの予測値は必ず実測値に一致しますか。","一致するとは限りません。測定値にはばらつきがあるため、同じ条件でも予測からずれることがあります。","予測と観測を区別します。"],
 ["散布図が曲がっているのに、直線だけを使い続けてよいですか。","残差が正、負、正とまとまって現れるなら、直線が曲がりを捉えていません。別の関数や範囲分けを検討します。","残差に規則的な形が残っていないか見ます。"],
 ["一つの外れた観測を消すと相関が強くなりました。理由を調べず削除してよいですか。","よくありません。記録ミスか、重要な実際の観測かを確認し、除外する理由と影響を説明します。","都合のよさと妥当な除外理由を区別します。"],
 ["気温を摂氏から華氏へ変えると、回帰直線の係数はそのまま使えますか。","温度の一単位の大きさと原点が変わるため、傾きと切片を換算します。","係数にも単位の意味があります。"],
 ["モデルを作ったデータだけで誤差が小さければ、将来にもよく当たりますか。","保証はありません。別のデータで確かめ、社会状況や測定条件が変わっていないか確認します。","モデル作成と確かめるデータを分けます。"],
 ["二つのモデルの精度を比べるとき、それぞれ別の観測点だけで誤差を比べてよいですか。","条件が異なるので公平な比較とは限りません。同じ評価用データと同じ尺度で比べます。","比較条件をそろえます。"]
]);
const simulation=(n:number)=>{
 const tosses=100*n,heads=50*n+n,value=heads/tosses;
 return checked("frequency",[heads,tosses],value,m`公平な硬貨の計算機実験で、$${tosses}$ 回中 $${heads}$ 回表でした。相対度数を求め、理論確率が変わったといえるか答えなさい。`,m`相対度数 $0.51$。この結果だけで理論確率が変わったとはいえません。`,"実験の割合と、仮定したモデルの確率を区別します。",m`$\frac{${heads}}{${tosses}}=0.51$。公平なモデルの確率は $\frac12$ ですが、有限回の割合には変動があります。回数を増やしても、毎回単調に近づくとは限りません。`);
};
const surveyDesign=word([
 ["全校の睡眠時間を調べる計画を立てます。対象、抽出、質問、報告に必要なことを挙げなさい。","全校生徒を対象に、名簿から無作為抽出する。平日か休日かと時間の単位をそろえて尋ね、回答率・分布・平均・調査の限界を報告する。","対象と測り方を先にそろえます。"],
 ["住民の交通手段を調べる計画で、平日と休日の回答を混ぜないための工夫を挙げなさい。","どの日の移動かを明示して質問し、曜日別に記録・集計する。抽出の対象と回答率も示す。","条件の異なる回答を区別します。"],
 ["硬貨が公平な場合の表の回数を計算機で再現するには、どう設計しますか。","各回で独立に同じ確率で表裏を生成し、一回の実験の投げる回数を固定する。同じ設定で実験を繰り返し、表の回数の分布を記録する。","一回の試行と、実験の反復を分けます。"],
 ["調査で「この便利な制度に賛成ですか」と質問してよいですか。","便利という評価が回答を誘導するおそれがある。制度の条件を中立的に示し、賛成・反対・判断できないなどの回答を用意する。","質問文による誘導を点検します。"],
 ["計算機実験の結果を別の人が確かめられるように、何を記録しますか。","モデルの仮定、試行回数、反復回数、乱数生成の方法や種、集計方法を記録する。実測データでなく計算機実験と明記する。","再現できる条件を残します。"],
 ["通学時間の調査で個人を特定できる住所まで集める必要がありますか。","目的に不要なら収集しない。必要な時間や大まかな分類に絞り、個人情報を保護して集計結果だけを報告する。","調べる目的に必要な情報だけを選びます。"],
 ["シミュレーションでは行列が短かったので、実際の店でも必ず短いといえますか。","来客間隔や接客時間の仮定で列の長さは変わる。実際の混雑時の記録と比べる必要がある。","モデルと現実の対応を点検します。"],
 ["学習時間と得点を調べた結果を発表します。図のほかに何を添えますか。","対象、人数、抽出方法、測定時期、単位、欠測の扱い、相関だけでは因果を示せないことなどを添える。","読み手が結果の範囲と限界を判断できるようにします。"]
]);
export const societyBanks=[
 B(chapter,"compound-growth","増加率と複利","一定額の増加と、一定割合の増加を区別します。",[m`一定額を足す変化は等差、一定割合を掛ける変化は等比で表せます。年率 $r$ なら一年後は $1+r$ 倍です。`,"税・手数料・途中の入出金・途中の丸めを省いた架空のモデルで考えます。"],"初めの時点と、何回増加するかを対応させます。",[S("simple","一定額を加えるモデル","毎年の利息の基準が最初の元金か確かめます。",nums.map(n=>compound(n,true))),S("compound","割合を繰り返すモデル","直前の残高を基準にします。",nums.map(n=>compound(n)))],sec[0]),
 B(chapter,"balance-recurrence","積立・返済と漸化式","一年間の操作を順番に式へ表します。",[m`$0$年後の残高を $A_0$ と書きます。利息が先、年末の積立が後なら $A_{n+1}=(1+r)A_n+d$。入金が先なら式が変わります。`,m`返済なら、利息を付けた後の借入残高から返済額を引きます。完済後まで同じ式を使って負の借入残高を作らず、最後の支払いを調整します。数値例は税・手数料なし、利率一定の架空のモデルです。`],"一期間に何がどの順番で起きるかを言葉で確認します。",[S("saving","年末に積み立てる","利息を付けてから入金します。",nums.map(n=>saving(n))),S("loan","年末に返済する","利息を付けてから返済します。",nums.map(n=>saving(n,true)))],sec[0]),
 B(chapter,"data-function","データを一次関数で近似する","散布図の傾向を式に表し、単位と意味を読みます。",["観測値が一つの直線にぴったり乗るとは限りません。ここでは代表的な二点を使い、近似直線を決めます。すべての観測点を使った最小二乗直線とは一致しないことがあります。",m`直線 $y=ax+b$ の傾きは横一単位当たりの縦の変化です。切片は $x=0$ での予測値ですが、その値が現実に意味をもつかは対象によります。`],"軸の意味と単位を決め、予測を観測事実と区別します。",[S("slope","変化率を読む","二点間の変化量の比を計算します。",nums.map(n=>fitting(n,true))),S("predict","式を作って予測する","傾きと切片を求め、範囲内の値を代入します。",nums.map(n=>fitting(n)))],sec[1]),
 B(chapter,"residuals","残差と予測の限界","予測と観測のずれを調べ、モデルを見直します。",[m`残差は「観測値−予測値」です。異なる点の正負のずれが打ち消し合うため、比較には残差の二乗和なども使います。`,m`残差の二乗和が最小になるように係数を選ぶ方法が最小二乗法です。ただし誤差が小さいだけで因果関係や遠い範囲への予測が保証されるわけではありません。`],"計算した誤差と、モデルの適用範囲を両方確認します。",[S("residual","観測と予測の差","同じ横座標で値を比べます。",nums.map(n=>residual(n))),S("squared","ずれを二乗する","符号の打消しを避けます。",nums.map(n=>residual(n,true))),S("limits","モデルを使える範囲","データの範囲、条件、他の要因を確認します。",modelLimits)],sec[1]),
 B(chapter,"survey-simulation","調査とシミュレーション","調べる目的、集め方、結果の読み方をつなぎます。",["調査は現実の対象から情報を集めます。シミュレーションは仮定したモデルの下で結果を作ります。両者を同じデータとは扱いません。","目的→対象と条件→収集・実験→表や図で分析→限界を添えて報告、の順で進めます。自分で調べる場合も個人情報は必要以上に集めません。"],"調査は対象と抽出法、計算機実験は試行の条件と回数を記録します。",[S("frequency","実験の割合を読む","観測割合と理論確率を区別します。",nums.map(simulation)),S("design","調査・実験を計画する","目的に合う条件を具体的に書きます。",surveyDesign)],sec[2])
];
addRepairExample(societyBanks,"mb-residuals","residual",residual(3));
addRepairExample(societyBanks,"mb-residuals","residual",residual(2));
addRepairExample(societyBanks,"mb-residuals","limits",modelLimits[1]);
addRepairExample(societyBanks,"mb-residuals","limits",modelLimits[3]);
addRepairExample(societyBanks,"mb-survey-simulation","design",surveyDesign[2]);
export const societyChapter=finish(chapter,"society",societyBanks,sec,{
 "mb-residuals-residual":[1,2,4,6,7],
 "mb-residuals-squared":[1,2,4,6,7]
});
import {varyPractice} from "./review-family-refinement";
import {variedFrequencies} from "./content-audit-additions";
varyPractice(societyBanks.find(b=>b.lesson.slug==="mb-survey-simulation")!,societyChapter,"frequency",variedFrequencies);
