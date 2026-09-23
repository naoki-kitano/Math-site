import {m,w,skill,dataTopic,addDataCases,appendData,regroupData,frac,sum} from "./math1-data-authoring";
import type {Worked} from "./math1-topic";
// Reproducible computer simulation, not observed student data and not an exact probability table.
export function simulateFairCoins(seed=20260922,trials=10000){
 let state=seed>>>0;const counts=Array<number>(11).fill(0);
 for(let i=0;i<trials;i++){let heads=0;for(let j=0;j<10;j++){state=(Math.imul(state,1664525)+1013904223)>>>0;if(state<2147483648)heads++;}counts[heads]++;}
 return counts;
}
export const coinSimulation={seed:20260922,trials:10000,tosses:10,counts:simulateFairCoins()};
export const coinModel=m`各回で表の確率は $\frac12$、各回は互いに独立と仮定し、$10$ 回投げることを一試行とします。`;
export const coinAssumption=m`「表も裏も確率 $\frac12$ で、各回の結果は互いに独立」と仮定します。これをまねた計算機実験で、$10$ 回投げる試行を $10000$ 回繰り返しました。仮想の実験であり、表はシミュレーションの結果です。繰り返し方を変えると度数も少し変わります。`;
export const coinRule=m`実験前に「表が出やすいか」を調べると決め、観測以上の表の回数を数えます。この教材では、その割合が $5\%$ 以下なら仮定を疑う、という判断基準も実験前に決めておきます。`;
function upperTail(observed:number):Worked{
 const count=sum(coinSimulation.counts.slice(observed));
 return w(m`${coinModel} 表が出やすいかを調べます。$10$ 回中 $${observed}$ 回が表でした。同じ仮定でのシミュレーションで、表が $${observed}$ 回以上の試行は $${coinSimulation.counts.slice(observed).join("+")}$ 回です。「観測以上」の割合を求めなさい。試行総数は $10000$ 回です。`,m`$\frac{${count}}{10000}=${count/10000}$、$${count/100}\%$。`,"ちょうど観測回数だけでなく、それ以上の全てを足します。",m`表が $${observed}$ 回から $10$ 回までを合計すると $${count}$ 回。割合は $\frac{${count}}{10000}$。これは仮定の下で観測以上が出る割合の推定で、仮定が正しい確率ではありません。`);
}
const tails=skill("simulation-tail","同程度以上に極端な結果を数える",coinAssumption+" "+coinRule,upperTail(9),[upperTail(8),upperTail(7),upperTail(10),upperTail(6),upperTail(5),upperTail(4)]);
type DecisionCase={rare:number;total:number};
export const decisionCases:DecisionCase[]=[{rare:18,total:1000},{rare:120,total:1000},{rare:8,total:400},{rare:160,total:2000},{rare:12,total:1000},{rare:90,total:500}];
function decision(c:DecisionCase):Worked{
 const reject=c.rare/c.total<=0.05;
 return w(m`${coinModel} 「表が出やすいか」を調べ、仮定の下で観測以上となる割合が $5\%$ 以下なら仮定を疑うと事前に決めました。シミュレーション $${c.total}$ 回中、観測以上は $${c.rare}$ 回。基準に照らした結論と、断言できないことを答えなさい。`,reject?"基準より珍しいので、仮定を疑う材料になります。ただし仮定が必ず誤りとは断定しません。":"この基準では仮定を疑うに足りません。ただし仮定が正しいと証明されたわけではありません。","割合を計算して事前の基準と比べ、結論を強く言い過ぎないようにします。",m`割合は $${frac(c.rare,c.total)}=${c.rare/c.total}$、$${100*c.rare/c.total}\%$。これは $5\%$ ${reject?"以下":"より大きい"}です。${reject?"仮定の下では珍しい結果なので仮定を疑いますが、偶然にも起こり得ます。":"珍しいと判断する基準には達しません。データ不足で差を見逃す可能性もあり、仮定の証明とは違います。"}`);
}
const decisions=skill("simulation-decision","基準に照らして判断する",m`基準は結果を見る前に決めます。仮定の下での珍しさを判断しているのであって、「仮定が真である確率」を求めているのではありません。シミュレーションの割合は近似なので、基準の近くでは回数や不確かさも慎重に検討します。`,decision({rare:110,total:10000}),decisionCases.map(decision));
decisions.why=coinModel+" "+decisions.why;
export const hypothesisThinking=dataTopic("m1-hypothesis-thinking","仮説検定の考え方",[
 "「偶然のばらつきだけでも、この結果はよく起こるだろうか」と考えます。まず比較の基準となる仮定をはっきりさせます。",
 coinAssumption,coinRule,
 "この問いは「表が出やすい」という片側の問いです。「表裏のどちらかに偏っているか」という問いなら、極端さの決め方も違います。結果を見た後に都合のよい側へ変えてはいけません。"
],"仮定と実験条件を定める → 観測以上の範囲を決める → 仮定の下での割合を調べる → 限定した結論を述べる。",[tails,decisions]);

const summary=skill("data-conclusion","根拠に合う結論にする","何を、誰について、どの指標で判断したかを明記します。調べていない人や記録にまで結論を広げません。",w("二つの待ち列の中央値は同じでした。「どちらでも待ち時間は全く同じ」と報告してよいですか。","いけません。「中央値は同じ」と述べ、散らばりや長い待ち時間も確かめます。","一つの要約値と、全部の分布を区別します。","中央値が同じでも、長い待ち時間の多さやばらつきは異なり得ます。目的に合った指標と分布を確認します。"),[
 w("二群の平均だけを比べて「全ての人で一方が大きい」と報告しました。どう直しますか。","平均の比較に限定し、個々の値の大小までは言わないようにします。","平均は各人の比較を表しているでしょうか。","平均は全体の合計をならした値です。平均が大きい群にも小さい値が含まれ得るので、全員については断定できません。"),
 w("来店者アンケートの結果を「地域の全員の希望」として報告しました。どう直しますか。","調べた来店者の回答についての結果と明記します。","回答者以外が含まれているかを確かめます。","未調査の住民への一般化はできません。調査対象、時期、回答人数を併記します。"),
 w("平均待ち時間だけが示されています。長時間待つ人がいるか知るには何を追加で見ますか。","分布や最大値、四分位数などを見ます。","中心の値だけで端の状況が分かるかを考えます。","平均が小さくても一部の待ち時間は長い場合があります。どの程度長い値がどれだけあるかを分布で確認します。"),
 w("相関係数が大きかったので「一方を増やせば他方も必ず増える」と報告しました。どう直しますか。","このデータで直線的な関連が見られたと述べ、原因は未確定とします。","観察と、操作した場合の効果を分けます。","第三の要因や逆の因果も考えられます。相関だけから操作の効果や「必ず」を結論しません。"),
 w("二群の中央値が等しかったので「分布も同じ」と報告しました。どう直しますか。","中央値が等しいとだけ述べ、四分位範囲や範囲、分布形状も調べます。","中心以外に比較していない量を挙げます。","中心が等しくても散らばりは異なり得ます。一つの指標の一致と分布全体の一致は別です。"),
 w("平均の高い班では全員の値も高いといわれました。この結論を確認するには何が必要ですか。","個々のデータや分布を確かめます。平均だけでは全員について断定できません。","少数の大きな値で平均が上がる場合を考えます。","平均は一人ずつの値を示さないため、全員の大小を判断する根拠には不足しています。")
]);
const inferenceLimits=skill("inference-design","判断の前提と限界","仮定、独立性、比較する範囲、事前の判断基準を確認して初めて、シミュレーションと観測を比較できます。",w(m`結果を見てから、表の多い側を選び、基準も $5\%$ から $10\%$ に変更しました。最初の基準で判断したと報告してよいですか。`,"いけません。問いや基準を結果に合わせて変えています。","判断のルールをいつ決めたかを確認します。","事後的な変更では、事前に定めた検定と同じ判断にはなりません。変更を明記し、新しいデータでの確認などを検討します。"),[
 w("独立な試行を仮定しているのに、前回の結果を使って次の出方を変える実験をしました。同じシミュレーションを使えますか。","そのまま使えません。独立性の仮定と実験が合っていません。","前回の結果が次回に影響するかを考えます。","仮定の下で作った分布と、違う仕組みの実験結果はそのまま比較できません。実験条件やモデルを見直します。"),
 w(m`仮定の下で観測以上の割合が $2\%$ でした。「仮定が正しい確率は $2\%$」といえますか。`,"いえません。仮定が正しいとしたときの結果の割合です。","条件として置いたものと、数えた結果を区別します。","仮定を出発点にしてデータの珍しさを計算しました。仮定そのものの真偽の確率を求めたわけではありません。"),
 w("事前の基準で仮定を疑う結果になりませんでした。「差は絶対にない」といえますか。","いえません。このデータでは仮定を疑うに足りないという結論です。","差を発見できなかったことと、差がない証明を区別します。","試行回数が少なくて小さな差を捉えられない場合もあります。仮定を疑えないことは、その正しさの証明ではありません。"),
 w("結果を見てから、珍しく見える側だけを数えることにしました。問題点を説明しなさい。","極端さの範囲を事後的に選んでおり、事前に決めた問いによる判断ではありません。","反対側に偏った場合にも同じ選び方をしたか考えます。","どちら側でも都合よく選ぶなら、もともとの片側の判断とは異なります。方向・極端さ・基準は結果を見る前に決めます。"),
 w(m`観測以上の割合が $1\%$ でした。「仮定が真である確率は $1\%$」という解釈を直しなさい。`,"仮定の下で、今回以上に極端な結果が出る割合の推定がその値、という意味です。","仮定は計算の条件になっています。","仮定の真偽の確率ではありません。データの珍しさを根拠に仮定を疑うのであって、真である確率を直接計算していません。"),
 w("仮定を疑う基準に達しなかったので、試行を増やしても違いは絶対に出ないといいました。適切ですか。","不適切です。今回疑えなかったことは、将来も差が見つからない保証ではありません。","現在の証拠の強さと、差がない証明を区別します。","試行数が増えれば判断が変わることがあります。現在のデータで仮定を疑うに足りない、と範囲を限定します。")
]);
export const dataJudgment=dataTopic("m1-data-judgment","データに基づく判断",["計算結果を、もとの問いへの答えに戻します。分かったことと、まだ確かめていないことを分けて述べます。"],"データ・指標・仮定が支える範囲で結論を述べます。",[summary,inferenceLimits]);
export const dataInferenceTopics=[hypothesisThinking,dataJudgment];
for(const bank of dataInferenceTopics)for(const family of new Set(bank.exercises.filter(e=>e.stage==="guided").map(e=>e.family)))addDataCases(bank,family,[2,3,4]);
appendData(dataJudgment,"independence-check","extra",w("各回独立のコイン投げを仮定した計算機実験と比べますが、実験では前回が表なら次回も必ず表になる仕組みでした。そのまま比較できますか。","できません。独立という仮定を満たさない仕組みです。","前回の結果で次回の確率が変わるかを確かめます。","前回が表だと次回が決まるため、各回独立の仮定とは違います。モデルと実験の条件を合わせる必要があります。"),"practice");
regroupData(dataJudgment,["inference-design-1","independence-check-extra"],"independence-check","実験と独立性の仮定","仮定した仕組みと実際の試行の仕組みが合っているかを確かめます。");
regroupData(dataJudgment,["inference-design-2","inference-design-5"],"conditional-probability-meaning","仮定の下での割合","仮定を置いた上でのデータの珍しさと、仮定自体が真である確率は別です。");
regroupData(dataJudgment,["inference-design-3","inference-design-6"],"nonrejection-limits","疑えないことは証明ではない","今回仮定を疑うに足りないことと、仮定が正しいことの証明を区別します。");
appendData(dataJudgment,"predeclared-rule","extra",w(m`実験前は $5\%$ 以下を珍しいとする予定でしたが、結果を見て $10\%$ 以下へ変えました。当初の基準による判断といえますか。`,"いえません。結果を見て基準を変えています。","割合だけでなく、基準をいつ決めたかを考えます。","結果に合わせた基準の変更は、事前に定めた規則による判断とは違います。変更を明示し、新しいデータでの確認などを検討します。"));
regroupData(dataJudgment,["inference-design-4","predeclared-rule-extra"],"predeclared-rule","方向と基準を事前に決める","どちら側を調べるか、どの程度を珍しいとするかを結果を見る前に決めます。");
appendData(dataJudgment,"mean-not-everyone","extra",w("二群の平均には差がありました。このことだけで、一方の群の最小値も他方の最大値より大きいといえますか。","いえません。個々の値の範囲は平均だけでは決まりません。","平均値と全ての組合せでの大小を区別します。","平均は合計をならしたものです。値の範囲は重なる場合があるため、全員についての大小は別に確かめます。"),"practice");
regroupData(dataJudgment,["data-conclusion-1","data-conclusion-6","mean-not-everyone-extra"],"mean-not-everyone","平均と一人ずつの値","平均での比較から、全員についての大小を断定することはできません。");
appendData(dataJudgment,"conclusion-scope","extra",w("昼の施設利用者だけを調べた平均を、一日中の全利用者の平均と報告しました。どう直しますか。","昼に調べた利用者の平均と範囲を限定します。","調べた時間帯の外を含めていないか見ます。","他の時間帯は未調査で、同じ傾向とは限りません。対象と調査時間を明記します。"));
regroupData(dataJudgment,["data-conclusion-2","conclusion-scope-extra"],"conclusion-scope","調査した範囲で述べる","調査に含まれない集団にまで結論を広げません。");
appendData(dataJudgment,"tail-information","extra",w("配達時間の平均は短いそうです。極端に遅い配達がどの程度あるか知るには何を見ますか。","元データや度数分布で、長い時間の記録とその個数を確かめます。","平均だけで端の状況が分かるか考えます。","平均が短くても一部は長い場合があります。長い側の範囲と頻度を見て、知りたいことに直接答えます。"));
regroupData(dataJudgment,["data-conclusion-3","tail-information-extra"],"tail-information","端の状況を調べる","長い時間の記録の有無や個数は、中心の値だけでは分かりません。分布も確認します。");
appendData(dataJudgment,"causal-conclusion","extra",w("観察した二つの量に正の相関がありました。一方を操作すれば他方も必ず増えると結論してよいですか。","いけません。関連は見られても、操作の効果は確定しません。","第三の要因や逆向きの原因がないかを考えます。","観察された関連を報告し、原因や効果には追加の検討が必要とします。"));
regroupData(dataJudgment,["data-conclusion-4","causal-conclusion-extra"],"causal-conclusion","関連にとどめて報告する","観察で分かった関連を、介入したときの効果へ読み替えません。");
appendData(dataJudgment,"median-not-distribution","extra",w("二つの待ち時間の中央値が同じだったので、長く待つ人の状況も同じといってよいですか。","いえません。中央値が同じでも、長い側の分布は違うことがあります。","中央の値と端の値を分けて考えます。","中央値の一致だけでは分布の端や散らばりは決まりません。範囲・四分位範囲・元の分布も比べます。"),"practice");
regroupData(dataJudgment,["data-conclusion-5","median-not-distribution-extra"],"median-not-distribution","中央値と分布全体は別","中央値の一致を、全体の分布の一致とは扱いません。");
dataJudgment.lesson.supplements=dataJudgment.lesson.supplements.filter(s=>dataJudgment.exercises.some(e=>e.repair===s.id));
dataJudgment.lesson.examples[0]={...dataJudgment.lesson.examples[0],title:"平均から全員を決め付けない",prompt:"平均点の高い群なら、全員がもう一方の群の全員より高い点を取ったといえますか。",steps:[{title:"着目する",text:"群の平均と、一人ずつの大小を分けます。"},{title:"確かめる",text:m`$0,10$ の平均は $5$、$4,4$ の平均は $4$。前者の平均は高くても $0<4$ です。`},{title:"答え",text:"平均が高いというだけでは、全員の点が高いとはいえません。"}]};
dataJudgment.lesson.examples[1]={...dataJudgment.lesson.examples[1],title:"仮定と実験の仕組みを合わせる",prompt:"独立な試行のシミュレーションと比べたいのに、実験では前の結果によって次の確率を変えていました。そのまま比べてよいですか。",steps:[{title:"着目する",text:"前の結果が次の確率に影響するかを確かめます。"},{title:"確かめる",text:"前の結果に応じて次の確率が変わるなら、独立な試行として用意した分布とは条件が違います。"},{title:"答え",text:"そのままは比較できません。実験条件と仮定を合わせます。"}]};
appendData(dataJudgment,"independence-check","second",w("公平で各回独立と仮定したモデルで、前の結果が表なら次も表に固定する実験を評価してよいですか。","そのままは評価できません。公平さと独立性の仮定に合っていません。","前の結果を知ると次の結果が変わるかを調べます。","前回が表と分かると次回も表に決まるため、各回独立の公平な試行ではありません。条件の合うモデルで比較します。"));
