import {m,w,skill,dataTopic,addDataCases,appendData,regroupData,medianWorking,frac,list,sum,median,quartiles,quartileRule} from "./math1-data-authoring";
import type {Worked} from "./math1-topic";

function unitRecord(place:string,people:number,measure:string,unit:string):Worked{return w(m`${place}の $${people}$ 人について、一人ずつ${measure}を${unit}単位で記録しました。一つのデータが表す対象・量・単位を答えなさい。`,m`対象は一人、量は${measure}、単位は${unit}。`,"一行を誰の、何の記録として読むかを確かめます。",m`人数 $${people}$ はデータの個数です。一つの値は一人の${measure}を${unit}で表し、人数そのものではありません。`);}
const objects=skill("record-unit","一つの記録を読む","まず「誰の・何を・どの単位で測ったか」を確かめます。",unitRecord("ある読書会",8,"読書時間","分"),[
 unitRecord("ある部活動",12,"通学時間","分"),unitRecord("ある班",6,"身長","センチメートル"),unitRecord("ある教室",20,"一週間の貸出冊数","冊"),unitRecord("ある講座",15,"実験の所要時間","秒"),unitRecord("ある委員会",9,"一日の歩数","歩"),unitRecord("ある体験会",18,"持参した水の量","ミリリットル")]);
const scopes=skill("survey-scope","調べた範囲と結論","調べた集団と、結論を述べたい集団が同じかを確かめます。",w("図書館の利用者だけに読書時間を尋ねました。この平均を地域の全住民の平均と決めてよいですか。","決められません。図書館を利用しない人が含まれていません。","回答者に含まれていない人を考えます。","調査対象は図書館利用者。結論の対象は全住民で、調べた範囲を越えています。"),[
 w("運動部員だけの運動時間の平均を、学校全員の平均といえますか。","いえません。運動部員以外を調べていません。","二つの集団の範囲を比べます。","運動部員の平均と学校全員の平均は別です。部員以外にも同じ傾向があるとは限りません。"),
 w("朝の来店者だけに希望商品を尋ねました。夜の来店者にも最も人気の品だといえますか。","いえません。夜の来店者の希望は未調査です。","時間帯によって調査対象が偏っていないか考えます。","朝の結果としては記述できますが、時間帯を越えた結論には夜の調査も必要です。"),
 w("ある学級の全員について、その日の登校時刻を記録しました。その学級のその日の平均登校時刻を求められますか。","求められます。対象と記録の範囲が一致しています。","「学校全体」や「普段」まで広げていないか確かめます。","その学級の全員・その日に限る結論なら、必要な対象を記録しています。他の日まで同じとはいえません。"),
 w("自由参加の満足度アンケートで回答者の平均が高くなりました。未回答者も含む参加者全体の平均といえますか。","いえません。未回答者の満足度は分かりません。","回答した人と参加した人の範囲を比べます。","回答者の平均についての結果です。未回答者が同じ傾向とは限らないため、参加者全体の平均とはいえません。"),
 w("ある店の月曜日の全売上を記録しました。これを週全体の売上として扱えますか。","扱えません。火曜日以降の記録がありません。","記録した期間と述べたい期間を比べます。","月曜日については全記録でも、一週間全体の記録ではありません。"),
 w("ある班全員の荷物の重さを測りました。この班の測定時の平均を求めてよいですか。","よいです。測定対象と結論の範囲が一致しています。","他の班や他の日にまで広げていないかを見ます。","この班の全員を測っているため、その時点の班の平均を計算できます。")
]);
export const dataReading=dataTopic("m1-data-reading","データの対象と読み方",["数値だけでなく、その数値が何を記録したものかを読みます。"],"対象・量・単位・調査範囲を確かめてから比べます。",[objects,scopes]);

export const histogramData={values:[2,5,5,8,10,12,14,15,18,19,21,24],edges:[0,5,10,15,20,25],counts:[1,3,3,3,2]};
function frequency(xs:number[],lo:number,hi:number):Worked{return w(m`一人ずつ測った $${xs.length}$ 人の所要時間（分）は $${list(xs)}$。$${lo}$ 分以上 $${hi}$ 分未満の階級の度数と相対度数を求めなさい。`,m`度数 $${xs.filter(x=>lo<=x&&x<hi).length}$、相対度数 $${frac(xs.filter(x=>lo<=x&&x<hi).length,xs.length)}$。`,"下の境界を含め、上の境界は次の階級に入れます。",m`該当する値は ${xs.filter(x=>lo<=x&&x<hi).length?`$${list(xs.filter(x=>lo<=x&&x<hi))}$`:"ありません"}。度数は $${xs.filter(x=>lo<=x&&x<hi).length}$、全体 $${xs.length}$ 個で割ると $${frac(xs.filter(x=>lo<=x&&x<hi).length,xs.length)}$ です。`);}
const classes=skill("class-frequency","境界を確かめて数える","度数は階級に入る個数、相対度数はその個数を全体の個数で割った割合です。",frequency(histogramData.values,5,10),[
 frequency([1,4,5,5,9,10],5,10),frequency([0,3,5,7,10,14,15,19],10,15),frequency([2,4,6,8,10,12],0,5),frequency([5,5,10,10,15,15],5,10),frequency([0,4,5,9,10,14,15,19],15,20),frequency([1,2,5,7,8,10],5,10)]);
function groupedMean(counts:number[]):Worked{
 const centers=[5,15,25],n=sum(counts),total=sum(counts.map((c,i)=>c*centers[i]));
 return w(m`時間（分）の階級 $0$ 以上 $10$ 未満、$10$ 以上 $20$ 未満、$20$ 以上 $30$ 未満の度数が順に $${list(counts)}$ です。階級値で平均を推定し、正確な平均かどうか答えなさい。`,m`推定平均 $${frac(total,n)}$ 分。一般には近似値です。`,"階級の中央の値を、その階級の個数だけ使います。",m`階級値は $5,15,25$。$\frac{5\cdot${counts[0]}+15\cdot${counts[1]}+25\cdot${counts[2]}}{${n}}=${frac(total,n)}$。各記録を階級値で置き換えたため、元の正確な平均とは限りません。`);
}
const classMeans=skill("class-mean","階級値で平均を推定する","階級ごとの個数を重みにし、最後に全個数で割ります。",groupedMean([2,4,2]),[[1,2,1],[2,3,1],[1,3,2],[4,1,1],[2,2,4],[3,2,1]].map(groupedMean));
export const histograms=dataTopic("m1-histogram","度数分布とヒストグラム",["ばらばらの値を区間ごとに数えると、どのあたりに集まっているかを見渡せます。","ここでは等しい階級幅を使います。横軸は時間（分）、縦軸は度数（人）。隣り合う階級の柱を接して描きます。"],"階級の端を含むかを確かめ、度数の合計が全体の個数と一致するか確認します。",[classes,classMeans]);

function central(xs:number[],which:"mean"|"median"|"mode"):Worked{
 const sorted=[...xs].sort((a,b)=>a-b),counts=new Map<number,number>();xs.forEach(x=>counts.set(x,(counts.get(x)??0)+1));const max=Math.max(...counts.values()),modes=[...counts].filter(([,c])=>c===max).map(([x])=>x).sort((a,b)=>a-b);
 const ans=which==="mean"?frac(sum(xs),xs.length):which==="median"?String(median(xs)):list(modes);
 const title={mean:"平均値",median:"中央値",mode:"最頻値"}[which];
 const work=which==="mean"?m`合計は $${sum(xs)}$、個数は $${xs.length}$ なので $\frac{${sum(xs)}}{${xs.length}}=${ans}$。`:which==="median"?m`小さい順に $${list(sorted)}$。${medianWorking(xs)}`:m`各値の出現回数を数えます。最大の出現回数は $${max}$ 回で、その値は $${ans}$。最頻値は一つとは限りません。`;
 return w(m`データ $${list(xs)}$ の${title}を求めなさい。`,m`${title}は $${ans}$。`,which==="mean"?"合計を、データの個数で割ります。":which==="median"?"小さい順に並べ、個数の偶奇に応じて中央を読みます。":"出現回数が最も多い値を、すべて挙げます。",work);
}
const means=skill("arithmetic-mean","全部の値をならす","平均値は合計を個数で割った値です。大きく離れた値の影響も受けます。",central([2,3,4,7],"mean"),[[1,2,3,6],[0,2,2,4],[3,3,5,9],[-2,0,2,4],[1,1,2,8],[2,4,5,7]].map(a=>central(a,"mean")));
const medians=skill("median","順序の中央を読む","偶数個では中央の二つの平均を取り、奇数個では中央の一つを取ります。",central([8,2,3,1,6],"median"),[[6,1,2,4],[9,1,3,3,5],[1,7,2,5,4,3],[0,0,3,6,9],[-3,2,0,7],[2,8,4,5,1]].map(a=>central(a,"median")));
const modes=skill("mode","最も多く現れる値","最頻値は出現回数で決めます。同じ最大回数の値が複数なら、すべて挙げます。",central([1,2,2,3,4],"mode"),[[2,2,3,4,4],[1,1,1,2,3],[0,1,1,2,2,3],[5,4,5,6,5],[1,3,3,4,4,5],[0,0,2,3,3,3]].map(a=>central(a,"mode")));
function pooled(n:number,a:number,k:number,b:number):Worked{return w(m`$${n}$ 人の平均は $${a}$ 分、別の $${k}$ 人の平均は $${b}$ 分です。全員の平均を求めなさい。`,m`$${frac(n*a+k*b,n+k)}$ 分。`,"それぞれの合計に戻してから、一緒にした人数で割ります。",m`合計は $${n}\cdot${a}+${k}\cdot${b}=${n*a+k*b}$。したがって平均は $\frac{${n*a+k*b}}{${n+k}}=${frac(n*a+k*b,n+k)}$。人数が違う場合、二つの平均の単純平均では一般に正しく求められません。`);}
const pooledMeans=skill("pooled-mean","人数の違う平均を合わせる","「平均×人数」で合計を復元してから、全員の平均を求めます。",pooled(2,4,6,8),[pooled(3,4,2,9),pooled(2,6,4,3),pooled(5,8,1,2),pooled(4,5,2,8),pooled(2,3,3,8),pooled(1,10,4,5)]);
export const representatives=dataTopic("m1-representative-values","平均値・中央値・最頻値",["「中心」を表す方法は一つではありません。合計をならす、順序の中央を見る、よく現れる値を探す、という違いがあります。"],"何を表したいかに応じて、代表値の求め方と意味を区別します。",[means,medians,modes,pooledMeans]);

export const boxData=[8,1,5,2,7,4,9];
function quartile(xs:number[]):Worked{
 const a=[...xs].sort((x,y)=>x-y),q=quartiles(xs),k=Math.floor(xs.length/2);
 return w(m`$${list(xs)}$ の三つの四分位数を求めなさい。奇数個では全体の中央値を除いて上下に分けます。`,m`$Q_1=${q[1]},\ Q_2=${q[2]},\ Q_3=${q[3]}$。`,"まず小さい順に並べ、上下の組にどの値が入るかを書きます。",m`昇順は $${list(a)}$。下半分 $${list(a.slice(0,k))}$、上半分 $${list(a.slice(xs.length%2?k+1:k))}$。下半分：${medianWorking(a.slice(0,k))} 全体：${medianWorking(a)} 上半分：${medianWorking(a.slice(xs.length%2?k+1:k))} よって $Q_1=${q[1]},\ Q_2=${q[2]},\ Q_3=${q[3]}$。`);
}
const quartileSkill=skill("quartiles","上下の組の中央値",quartileRule,quartile(boxData),[[7,1,3,5,9],[1,2,4,6,8,9],[2,2,3,4,5,7,9],[0,1,2,3,5,6,7,8],[-2,0,1,2,4],[1,3,4,5,7,8,9,11]].map(quartile));
function spread(q:number[]):Worked{return w(m`箱ひげ図の最小値・$Q_1$・中央値・$Q_3$・最大値は順に $${list(q)}$ です。範囲と四分位範囲を求めなさい。ひげは最小値・最大値までです。`,m`範囲は $${q[4]-q[0]}$、四分位範囲は $${q[3]-q[1]}$。`,"全体の両端と、箱の両端を区別します。",m`範囲は $${q[4]}-(${q[0]})=${q[4]-q[0]}$。四分位範囲は $Q_3-Q_1=${q[3]}-(${q[1]})=${q[3]-q[1]}$。`);}
const spreads=skill("range-iqr","全体と中央部分の広がり",m`範囲は最大値から最小値を引いた値、四分位範囲は $Q_3-Q_1$ です。`,spread([1,2,5,8,11]),[[0,2,4,6,10],[1,3,5,8,12],[2,4,4,7,9],[-3,-1,0,2,5],[0,0,2,5,8],[4,5,6,7,10]].map(spread));
export const boxplots=dataTopic("m1-boxplot","四分位数と箱ひげ図",[quartileRule,"箱の左端・中の線・右端が、三つの四分位数です。図の位置を数値の目盛りと対応させます。"],"五つの要約値を数直線上に置き、箱とひげを描きます。",[quartileSkill,spreads]);

const compare=skill("compare-distributions","比較する量を選ぶ","中央値は順序の中心、四分位範囲は中央部分の広がりです。どちらが大きいかは別々に調べます。",w(m`同じ単位の二群で、$A$ の中央値は $6$、四分位範囲は $4$。$B$ はそれぞれ $8,2$ です。中心と中央部分の散らばりを比べなさい。`,m`中央値は $B$ が大きく、中央部分の散らばりは $A$ が大きい。`,"中心の指標と散らばりの指標を取り違えないようにします。",m`中央値は $8>6$、四分位範囲は $4>2$。一方が大きいからといって両方大きいとは限りません。`),[
 w(m`時間（分）の二群で、$A$ は中央値 $10$、四分位範囲 $6$、$B$ は中央値 $12$、四分位範囲 $4$。何が比べられますか。`,m`中央値は $B$ が大きく、中央部分の広がりは $A$ が大きい。`,"二種類の数値をそれぞれ比較します。",m`$12>10$ なので中央値は $B$。$6>4$ なので四分位範囲は $A$。全員の大小まではいえません。`),
 w(m`同じ単位の二群の中央値はいずれも $5$。四分位範囲は $A$ が $2$、$B$ が $6$ です。中央値と中央部分の散らばりを比較しなさい。`,m`中央値は同じ。中央部分は $B$ の方が散らばっています。`,"中央値が等しくても分布全体が同じとは限りません。",m`中央値は一致しますが、$6>2$ なので四分位範囲は異なります。中心と広がりを分けて記述します。`),
 w(m`同じ単位の二群で、$A$ の範囲は $20$、四分位範囲は $3$。$B$ はそれぞれ $12,5$ です。二つの広がりを比べなさい。`,m`全体の広がりは $A$、中央部分の広がりは $B$ が大きい。`,"範囲と四分位範囲は違う場所を測っています。",m`範囲では $20>12$、四分位範囲では $5>3$。どの指標での比較かを明記します。`),
 w(m`同じ単位の二群で、$A$ は $Q_1=2,Q_3=8$、$B$ は $Q_1=5,Q_3=9$。中央部分の広がりを比べなさい。`,m`$A$ の方が広い。`,"箱の右端だけでなく、両端の差を求めます。",m`$A$ の四分位範囲は $8-2=6$、$B$ は $9-5=4$。$6>4$ より $A$。`),
 w(m`同じ単位の二群で、中央値は $A$ が $7$、$B$ が $9$、四分位範囲はどちらも $3$。比べなさい。`,m`中央値は $B$ が大きく、四分位範囲は同じ。`,"同じといえるものを限定して答えます。",m`$9>7$。中央部分の広がりの指標は等しいですが、分布全体が一致するとはいえません。`),
 w(m`同じ単位の二群で、範囲はどちらも $10$、四分位範囲は $A$ が $2$、$B$ が $5$。比べなさい。`,m`全体の幅は同じで、中央部分の幅は $B$ が大きい。`,"両端の距離と箱の長さを分けて考えます。",m`範囲は等しくても、$5>2$ なので中央部分の広がりは違います。`)
]);
const boxLimits=skill("boxplot-limits","箱ひげ図からは決まらない量","箱ひげ図は五つの要約値を示す図です。個々の記録や区間内の細かな並び方を復元する図ではありません。",w("箱ひげ図の五つの要約値だけから平均値を求められますか。","一般には求められません。","平均値には全ての値の合計が必要です。","五つの要約値が同じでも、他の値の位置は変えられます。合計が決まらないので平均値も決まりません。"),[
 w("箱ひげ図で右半分の箱が長いので、そこには左半分より多くのデータがある、といえますか。","いえません。長さは値の広がりであり、人数を表しません。","箱の横軸は値です。","四分位数は順位をもとに決めます。同じ値が重なる場合もあるため、箱の長さから人数の多少は断定できません。"),
 w("箱ひげ図から、最も多く現れた値を必ず読み取れますか。","読み取れません。最頻値は記録の出現回数で決まります。","五つの要約値に、出現回数が含まれるか考えます。","箱ひげ図には各値の出現回数が示されないため、最頻値は一般に決まりません。"),
 w("箱ひげ図が同じ二組は、平均値も必ず同じですか。","同じとは限りません。","箱の内部の個々の値まで固定されているかを考えます。","五つの要約値は同じでも、それ以外の値を変えれば合計や平均が変わる場合があります。"),
 w("同じ値の記録が多いとき、中央値以上の記録は必ず全体のちょうど半分ですか。","ちょうど半分とは限りません。","中央値と同じ値が複数ある例を考えます。",m`例えば $1,2,2,2,3$ の中央値は $2$。中央値以上は $4$ 個で、全体のちょうど半分ではありません。`),
 w("箱ひげ図の箱が短いので、調査人数も少ないといえますか。","いえません。箱の長さは四分位範囲です。","人数と値の幅の単位を区別します。","同じ四分位範囲でも調査人数は異なり得ます。人数は別途確かめます。"),
 w("五つの要約値だけで、分布に山が一つか二つか必ず分かりますか。","分かりません。細かな分布には度数分布や元データも必要です。","各区間の中でどう集まっているかが示されているかを見ます。","箱ひげ図だけでは各区間の内部の集まり方まで分からないため、山の数を確定できません。")
]);
const outliers=skill("outlier-treatment","離れた値の背景を確かめる","他から離れた値を見つけたら、入力・単位・測定条件を確認します。珍しいだけで誤りと決め付けません。",w("他の所要時間が数分なのに一つだけ長い記録があります。平均を求める前に削除してよいですか。","離れていることだけを理由に削除してはいけません。","長くかかった事情や入力の根拠を確かめます。","誤記なら元記録に基づいて直します。実際に長くかかったなら重要な情報です。扱いを説明して集計します。"),[
 w("高い測定値が一つあります。平均を小さくするため除いてよいですか。","いけません。都合のよい結論のために除くのは不適切です。","削除の根拠が測定内容か、希望する結論かを区別します。","元記録や測定条件を調べ、除外する正当な理由があるか確認します。高いだけでは誤りといえません。"),
 w("一つの身長だけ非常に大きく、元票を見ると単位の転記を誤っていました。どう扱いますか。","元票に基づいて単位をそろえ、修正の記録を残します。","誤りの根拠が確認できた場合を考えます。","値の大きさだけで判断せず、元票で確認できた単位の誤りを修正します。無断で消す必要はありません。"),
 w("待ち時間が一件だけ長く、機器故障で実際に長く待った記録でした。どう扱いますか。","実際の待ち時間の分析なら、その記録を含めて検討します。","何を分析したいかと、実際に起きたかを確かめます。","故障時の長い待ち時間も実態の一部です。通常時だけを別に分析するなら対象条件を明示します。"),
 w("外れた値を含む平均だけでは典型的な待ち時間が分かりにくいとき、何を併記するとよいですか。","中央値や分布、離れた値の背景を併記します。","削除以外の伝え方を考えます。","平均は離れた値の影響を受けます。順位の中心を示す中央値と分布を添えると、中心と長い待ち時間を両方伝えられます。"),
 w("一件だけ異なる単位で入力されていたことが元記録で分かりました。どうしますか。","共通の単位に換算し、修正内容を残します。","同じ量でも単位が違えば数値は違います。","元記録の単位を確認して換算します。値が離れているだけで捨てるのではなく、比較できる形に直します。"),
 w("記録の最大値が大きいので誤記と決め付けました。この判断は適切ですか。","不適切です。元記録や測定条件の確認が必要です。","大きい値が実際に起こり得るか考えます。","珍しい観測と入力ミスは別です。大きさだけではどちらか判定できません。")
]);
export const distributions=dataTopic("m1-distribution-comparison","分布の比較と外れ値",["一つの代表値だけでは、集まり方の違いは見えません。何を比較するかを先に決めます。"],"中心・広がり・離れた値を分けて見て、図にない情報は断定しません。",[compare,boxLimits,outliers]);
for(const bank of [dataReading,histograms,representatives,boxplots,distributions])for(const family of new Set(bank.exercises.filter(e=>e.stage==="guided").map(e=>e.family)))addDataCases(bank,family,[2,3,4]);
export const dataDistributionTopics=[dataReading,histograms,representatives,boxplots,distributions];
// Preserve the actual decision during later review, including review questions themselves.
appendData(distributions,"iqr-from-quartiles","extra",w(m`同じ単位の二群で、$A$ は $Q_1=1,Q_3=4$、$B$ は $Q_1=3,Q_3=8$。中央部分の広がりを比べなさい。`,m`$B$ の方が広い。`,"各群で箱の両端の差を求めます。",m`$A$ は $4-1=3$、$B$ は $8-3=5$。四分位範囲は $B$ の方が大きいです。`));
regroupData(distributions,["compare-distributions-4","iqr-from-quartiles-extra"],"iqr-from-quartiles","四分位数から幅を比べる",m`中央部分の広がりを比べるには、両群で $Q_3-Q_1$ を計算します。`);
regroupData(distributions,["compare-distributions-3","compare-distributions-6"],"range-versus-iqr","全体と中央部分を区別する","範囲と四分位範囲で比較の結果が異なることがあります。指標を明記します。");
regroupData(distributions,["boxplot-limits-1","boxplot-limits-5"],"box-width-not-count","箱の長さは人数ではない","箱の横の長さは値の幅です。人数の多さを表す柱の高さとは違います。");
appendData(distributions,"median-ties","extra",w(m`$0,1,1,1,1,2$ では、中央値以上の記録はちょうど半分ですか。`,m`いいえ。中央値は $1$、中央値以上は $5$ 個です。`,"中央値に等しい値も数えることに注意します。",m`中央の二つはいずれも $1$。中央値以上は四つの $1$ と一つの $2$ で、全部で $5$ 個です。`));
regroupData(distributions,["boxplot-limits-4","median-ties-extra"],"median-ties","同じ値が重なる場合","中央値は順位を基に決めますが、「中央値以上」には中央値と同じ値を全て含めます。ちょうど半分とは限りません。");
regroupData(distributions,["outlier-treatment-2","outlier-treatment-5"],"correct-record","元記録に基づいて修正する","入力誤りを確認できたときは、元記録を根拠に直します。変更を記録し、勝手に値を消しません。");
appendData(distributions,"outlier-population","extra",w("一つだけ長い配送時間は、実際に起きた道路通行止めによるものでした。配送時間の実態を調べるとき、誤記として消してよいですか。","いけません。実際の配送の実態に含まれます。","調べたい対象に、その出来事が含まれるかを考えます。","通常時だけを別に調べることはできますが、その場合は対象の条件を明記します。実際に起きた値を入力ミスと決め付けません。"));
regroupData(distributions,["outlier-treatment-3","outlier-population-extra"],"outlier-population","分析の対象に含まれるか","実際に起きた記録は、分析目的に照らして扱います。通常時のみを扱うなら対象条件を明示します。");
appendData(distributions,"outlier-summary","extra",w("配達時間に少数のとても長い値があり、平均だけでは普段の様子を伝えにくいとき、何を追加しますか。","中央値と分布、長い配達が起きた背景を添えます。","離れた値を消さずに中心を伝える方法を考えます。","平均は大きく離れた値に引かれます。順位の中心である中央値と分布を併記し、典型的な状況と長い配達の両方を伝えます。"));
regroupData(distributions,["outlier-treatment-4","outlier-summary-extra"],"outlier-summary","代表値を補って伝える","離れた値を消すのでなく、中央値や分布も示して、平均だけでは見えにくい状況を伝えます。");
distributions.lesson.supplements.find(s=>s.id==="boxplot-limits")!.text+=m`
例えば $0,1,2,3,4,5,6$ と $0,1,1,3,4,5,6$ は、五数要約がともに $0,1,3,5,6$ ですが、平均はそれぞれ $3,\frac{20}{7}$ です。箱ひげ図が同じでも平均が決まるわけではありません。`;
appendData(distributions,"box-width-not-count","extra",w("箱ひげ図の箱が横に長い群ほど、調査人数が多いといえますか。","いえません。箱の横の長さは四分位範囲です。","横軸で測っている量を確かめます。","横軸はデータの値であって人数ではありません。調査人数は別の情報として確かめます。"),"practice");
appendData(distributions,"outlier-treatment","extra",w("一つだけ非常に小さい記録がありました。小さすぎるから誤記だと断定してよいですか。","断定できません。元記録や測定条件を確認します。","実際に小さい値が生じた可能性を残して考えます。","他から離れていても実測値かもしれません。見かけだけで削除せず、根拠を確かめます。"),"practice");
function histogramDrawing(counts:number[]):Worked{return w(m`所要時間（分）を $0$ 以上 $5$ 未満、$5$ 以上 $10$ 未満、$10$ 以上 $15$ 未満に分けた度数が順に $${list(counts)}$ 人です。軸と単位を記し、ヒストグラムを描きなさい。`,m`横軸は所要時間（分）、縦軸は度数（人）。幅 $5$ の柱を接して描き、高さを順に $${list(counts)}$ にします。`,"横の幅が階級、柱の高さが度数です。隣の階級との間を空けません。",m`横軸に $0,5,10,15$ と目盛りを付けます。各区間を底辺とする三つの柱を描き、高さを順に $${list(counts)}$ にします。人数の合計は $${sum(counts)}$ 人で、度数の合計と一致します。`);}
appendData(histograms,"draw-histogram","one",histogramDrawing([2,5,3]),"practice");
appendData(histograms,"draw-histogram","two",histogramDrawing([4,3,1]));
regroupData(histograms,["draw-histogram-one","draw-histogram-two"],"draw-histogram","度数分布から柱を描く","等しい階級幅のヒストグラムでは、横の区間が階級、柱の高さが度数です。数値の目盛りと単位を添えます。");
function boxDrawing(xs:number[]):Worked{
 const q=quartiles(xs);
 return w(m`$${list(xs)}$ の箱ひげ図を描きなさい。奇数個では全体の中央値を除いて上下に分け、ひげは最小値・最大値までとします。`,m`最小値 $${q[0]}$、$Q_1=${q[1]}$、中央値 $${q[2]}$、$Q_3=${q[3]}$、最大値 $${q[4]}$ を使った箱ひげ図。`,"先に五つの数値を求め、数直線上の位置を決めます。",quartile(xs)[3]+m`数直線上の $${q[1]}$ から $${q[3]}$ に箱を描き、$${q[2]}$ に中央値の線を入れます。箱から左右へひげを伸ばし、$${q[0]},${q[4]}$ で止めます。`);
}
appendData(boxplots,"draw-boxplot","one",boxDrawing([1,2,3,4,6,8,9]),"practice");
appendData(boxplots,"draw-boxplot","two",boxDrawing([2,3,5,6,7,9,10]));
regroupData(boxplots,["draw-boxplot-one","draw-boxplot-two"],"draw-boxplot","五つの値から箱ひげ図を描く",quartileRule);
const boxInformationCheck=distributions.exercises.find(e=>e.id==="m1-distribution-comparison-boxplot-limits-6-v1")!;
const boxInformationRepair=distributions.lesson.supplements.find(s=>s.id==="boxplot-limits")!;
boxInformationRepair.check=boxInformationCheck.prompt;
boxInformationRepair.answer=boxInformationCheck.steps[0].text+"\n"+boxInformationCheck.answer;
const boxInformationGuided=distributions.exercises.find(e=>e.id==="m1-distribution-comparison-boxplot-limits-3-v1")!;
distributions.exercises.find(e=>e.id==="m1-distribution-comparison-boxplot-limits-1-v1")!.stage="practice";
boxInformationGuided.stage="guided";
distributions.lesson.examples.find(e=>e.id==="boxplot-limits")!.guidedIds=[boxInformationGuided.id];
