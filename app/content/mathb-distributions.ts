import {B,S,m,q,f,nums,checked,finish,comb,type Q} from "./mathb-authoring";
import {binomialConditions,normalConditions} from "./mathb-conditions";
import {addRepairExample} from "./matha-authoring";
export const normalArea:Record<string,number>={"0":0,"0.5":0.1915,"1":0.3413,"1.5":0.4332,"1.64":0.4495,"1.645":0.45,"1.96":0.475,"2":0.4772,"2.58":0.4951};
export const decimal=(x:number)=>Number(x.toFixed(4)).toString();
const chapter="確率分布",sec=["値と確率","平均と散らばり","代表的な分布"];
const dist=(a:number)=>m`確率変数 $X$ は $0,${a},${2*a}$ の値を取り、その確率は順に $\frac14,\frac12,\frac14$ です。`;
const rv=(n:number,cumulative=false)=>{
 const v=cumulative?3/4:1/4;
 return checked(cumulative?"dist-cumulative":"dist-point",[n],v,dist(n)+(cumulative?m`$P(X\le ${n})$ を求めなさい。`:m`$P(X=${2*n})$ を求めなさい。`),m`$${f(cumulative?3:1,4)}$。`,cumulative?"条件を満たす値を先に選び、それらの確率を足します。":"求めたい値に対応する確率を読みます。",cumulative?m`条件を満たす値は $0,${n}$。互いに同時には取らないので $\frac14+\frac12=\frac34$。`:m`値 $${2*n}$ と対応する確率は $\frac14$。値そのものを確率と取り違えません。`);
};
const expected=(n:number,square=false)=>{
 const v=square?1.5*n*n:n;
 return checked(square?"second-moment":"expectation",[n],v,dist(n)+m`$${square?"E(X^2)":"E(X)"}$ を求めなさい。`,m`$${f(square?3*n*n:2*n,2)}$。`,square?"値を二乗してから、元の確率を掛けて足します。":"値に、それが起こる確率を掛けて足します。",m`$${square?"E(X^2)":"E(X)"}=0${square?"^2":""}\times\frac14+${n}${square?"^2":""}\times\frac12+${2*n}${square?"^2":""}\times\frac14=${f(square?3*n*n:2*n,2)}$。`);
};
const variance=(n:number,sd=false)=>{
 const v=sd?n/Math.sqrt(2):n*n/2;
 return checked(sd?"sd":"variance",[n],v,dist(n)+(sd?"標準偏差を求めなさい。":"分散を求めなさい。"),sd?m`$\frac{${n}\sqrt2}{2}$。`:m`$${f(n*n,2)}$。`,"まず期待値と二乗の期待値を求めます。標準偏差なら最後に非負の平方根を取ります。",m`$E(X)=${n},E(X^2)=${f(3*n*n,2)}$。$V(X)=E(X^2)-\{E(X)\}^2=${f(3*n*n,2)}-${n}^2=${f(n*n,2)}$。`+(sd?m`標準偏差は $\sqrt{${f(n*n,2)}}=\frac{${n}\sqrt2}{2}$。`:""));
};
const transform=(n:number,spread=false)=>{
 const a=n%2?-2:3,b=n,v=spread?a*a*4:a*5+b;
 return checked(spread?"transform-var":"transform-mean",[a,b,5,4],v,m`$E(X)=5,V(X)=4$。$Y=${a}X+${b}$ の${spread?"分散と標準偏差":"期待値"}を求めなさい。`,
 spread?m`分散 $${v}$、標準偏差 $${Math.abs(a)*2}$。`:m`$${v}$。`,
 spread?"平行移動では散らばりは変わりません。倍率を二乗して分散に掛けます。":"期待値にも同じ一次変換をします。",
 spread?m`$Y-E(Y)=${a}\{X-E(X)\}$ より、二乗して平均すると $V(Y)=(${a})^2V(X)=${v}$。標準偏差は $|${a}|\times2=${Math.abs(a)*2}$。`:m`$E(Y)=${a}E(X)+${b}=${a}\times5+${b}=${v}$。期待値の線形性に独立性は不要です。`);
};
const independent=(n:number,difference=false)=>{
 const v=n+4;
 return checked("independent-var",[n,4],v,m`$X,Y$ は独立で、$E(X)=${n},E(Y)=2,V(X)=${n},V(Y)=4$ です。$X${difference?"-":"+"}Y$ の期待値と分散を求めなさい。`,m`期待値 $${difference?n-2:n+2}$、分散 $${v}$。`,
 "平均は加減します。独立な変数の差でも、分散は足します。",
 m`$E(X${difference?"-":"+"}Y)=${n}${difference?"-":"+"}2=${difference?n-2:n+2}$。独立なので共分散は零、$V(X${difference?"-":"+"}Y)=V(X)+V(Y)=${n}+4=${v}$。分散を引いてはいけません。`);
};
const dependent=(n:number)=>{
 return q(m`$V(X)=${n},Y=X$ とします。$V(X+Y)=V(X)+V(Y)$ としてよいですか。実際の分散も求めなさい。`,m`できません。$V(X+Y)=4V(X)=${4*n}$。`,"二つの変数が別の文字でも、独立とは限りません。",m`$X+Y=2X$ なので $V(X+Y)=4V(X)=${4*n}$。単純に足すと $${2*n}$ になり一致しません。$V(X)>0$ で同じ変数を見ているため、独立ではありません。`);
};
const binomial=(n:number,tail=false)=>{
 const k=2,p=1/2,v=tail?1-(1-p)**n:comb(n,k)*p**n;
 return checked(tail?"binomial-tail":"binomial",[n,k,p],v,m`表裏が同じ確率の硬貨を独立に $${n}$ 回投げます。表の回数を $X$ とします。${tail?"少なくとも一回表が出る確率":m`$P(X=2)$`}を求めなさい。`,m`$${f(tail?2**n-1:comb(n,2),2**n)}$。`,
 tail?"一回以上の反対は零回です。":"表になる位置の選び方と、一つの並びの確率を掛けます。",
 tail?m`$P(X\ge1)=1-P(X=0)=1-(\frac12)^{${n}}=${f(2**n-1,2**n)}$。`:m`$X$ は二項分布 $B(${n},\frac12)$ に従います。$P(X=2)={}_{${n}}C_2(\frac12)^2(\frac12)^{${n-2}}=${f(comb(n,2),2**n)}$。`);
};
const binomialMoment=(n:number)=>{
 const trials=n*4;
 return checked("binomial-moments",[trials,1/4],3*n/4,m`$X$ は二項分布 $B(${trials},\frac14)$ に従います。期待値と分散を求めなさい。`,m`$E(X)=${n},V(X)=${f(3*n,4)}$。`,"回数は、各試行の成功なら一・失敗なら零の和です。",m`各試行の指標の平均は $\frac14$、分散は $\frac14(1-\frac14)$。独立な $${trials}$ 個を足すので $E(X)=${trials}\times\frac14=${n}$、$V(X)=${trials}\times\frac14\times\frac34=${f(3*n,4)}$。`);
};
const uniform=(n:number,point=false)=>{
 const v=point?0:1/n;
 return checked(point?"continuous-point":"uniform",[n],v,m`$X$ の確率密度は区間 $0\le x\le ${n}$ で高さ $\frac1{${n}}$、その外で零です。${point?m`$P(X=1)$`:"最初の幅一の区間に入る確率"}を求めなさい。`,m`$${point?"0":f(1,n)}$。`,
 "連続分布の確率は高さではなく、区間の上の面積です。",
 point?m`一点の幅は零なので面積も零です。密度の高さ $\frac1{${n}}$ が一点の確率ではありません。`:m`$P(0\le X\le1)=1\times\frac1{${n}}=${f(1,n)}$。全区間の面積は $${n}\times\frac1{${n}}=1$。`);
};
export function normalQuestion(n:number,tail=false):Q{
 const mu=50+n,sigma=4,z=[0.5,1,1.5,2][n%4],a=normalArea[String(z)],v=tail?.5-a:2*a;
 return checked(tail?"normal-tail":"normal-middle",[mu,sigma,z],v,m`$X$ は正規分布 $N(${mu},16)$ に従います。${tail?m`$P(X\ge${mu+sigma*z})$`:m`$P(${mu-sigma*z}\le X\le${mu+sigma*z})$`}を求めなさい。標準正規変数 $Z$ について $P(0\le Z\le${z})\approx${a}$ を使ってください。`,m`約 $${decimal(v)}$。`,"括弧の二番目は分散です。標準偏差で割って標準化します。",m`標準偏差は $4$。$Z=\frac{X-${mu}}4$ とすると `+(tail?m`$P(Z\ge${z})=\frac12-P(0\le Z\le${z})\approx${decimal(v)}$。`:m`$P(-${z}\le Z\le${z})=2P(0\le Z\le${z})\approx${decimal(v)}$。左右対称を使いました。`));
}
function normalBetween(n:number){
 const mu=50+n,lo=n%2?-1.5:.5,hi=n%2?-.5:1.5;
 return checked("normal-between",[mu,lo,hi],.2417,m`$X\sim N(${mu},16)$ の $P(${mu+4*lo}\le X\le${mu+4*hi})$ を求めなさい。$P(0\le Z\le0.5)\approx0.1915$、$P(0\le Z\le1.5)\approx0.4332$ を使います。`,m`約 $0.2417$。`,"標準化した両端が同じ側なら、大きな区間の面積から小さな区間を引きます。",m`$Z=\frac{X-${mu}}4$ に直すと $${lo}\le Z\le${hi}$。`+(lo<0?m`左右対称なので $0.5\le Z\le1.5$ と同じ面積。`:"")+m`求める面積は $0.4332-0.1915=0.2417$。`);
}
export const distributionBanks=[
 B(chapter,"random-variable","確率変数と確率分布","起こる結果を数で表し、その値に確率を対応させます。",["硬貨の表の回数のように、結果によって値が変わる変数を確率変数といいます。",m`$P(X=x)$ は、変数 $X$ が値 $x$ を取る確率です。離散分布では各確率は非負、すべて足すと $1$ です。条件を満たす値が複数あれば、その確率を足します。`],"値の一覧と確率の一覧を、一対一で対応させます。",[S("point","一つの値の確率","値に対応する確率を読み取ります。",nums.map(n=>rv(n))),S("cumulative","範囲に入る確率","条件を満たす値を選んで足します。",nums.map(n=>rv(n,true)))],sec[0]),
 B(chapter,"expectation","確率変数の期待値","値を、起こりやすさで重み付けして平均します。",[m`$E(X)=\sum_x xP(X=x)$。値の単純平均ではなく、確率を掛けた和です。`,m`$E(X^2)=\sum_x x^2P(X=x)$。こちらは値を二乗してから平均します。$\{E(X)\}^2$ とは違う量です。期待値は一回の結果の予言ではありません。`],"何の期待値かを先に読み、値に行う操作を決めます。",[S("mean","値の期待値","それぞれの値と確率の積を足します。",nums.map(n=>expected(n))),S("square","二乗の期待値","値だけを二乗し、確率は二乗しません。",nums.map(n=>expected(n,true)))],sec[1]),
 B(chapter,"variance","確率変数の分散と標準偏差","平均からのずれを二乗して、散らばりを測ります。",[m`平均を $\mu=E(X)$ とすると $V(X)=E((X-\mu)^2)$。展開すると $E(X^2)-2\mu E(X)+\mu^2=E(X^2)-\mu^2$ です。`,m`標準偏差は $\sqrt{V(X)}$。分散が元の単位の二乗なのに対し、標準偏差は元と同じ単位です。分散は非負なので、負になれば計算を見直します。`],"二乗の平均から平均の二乗を引きます。",[S("variance","分散を求める","二つの期待値を分けて計算します。",nums.map(n=>variance(n))),S("sd","標準偏差を求める","分散の非負の平方根を取ります。",nums.map(n=>variance(n,true)))],sec[1]),
 B(chapter,"random-transform","確率変数の一次変換","値の移動と倍率が、平均と散らばりにどう働くか考えます。",[m`$E(aX+b)=aE(X)+b$。一方 $V(aX+b)=a^2V(X)$ です。`,m`平均との差が $a$ 倍になるため、二乗する分散は $a^2$ 倍、標準偏差は $|a|$ 倍です。定数を足してもずれは変わりません。`],"平均、分散、標準偏差で、倍率の掛け方を区別します。",[S("mean","変換後の平均","平均にも同じ変換をします。",nums.map(n=>transform(n))),S("spread","変換後の散らばり","倍率を二乗し、最後に平方根を考えます。",nums.map(n=>transform(n,true)))],sec[1]),
 B(chapter,"independent-sum","確率変数の和と独立性","期待値を足せることと、分散を足せる条件を区別します。",[m`$E(X+Y)=E(X)+E(Y)$ は独立でなくても成立します。`,m`分散は $V(X+Y)=V(X)+V(Y)+2E((X-E(X))(Y-E(Y)))$。独立なら最後の期待値が零になり、分散を足せます。差の分散も独立なら $V(X-Y)=V(X)+V(Y)$ です。`],"別々の文字であるだけでは、独立とはいえません。",[S("sum","独立な和と差","独立性を確かめて分散を足します。",nums.map(n=>independent(n,n%2===0))),S("dependent","同じ変数を二回使う場合","元の変数の定数倍へ直します。",nums.map(dependent))],sec[1]),
 B(chapter,"binomial-distribution","二項分布","同じ条件の独立な試行で、成功の回数を数えます。",[m`各回の成功確率が一定の $p$、試行が独立、回数が $n$ のとき、成功回数は二項分布 $B(n,p)$ です。`,m`$P(X=k)={}_nC_kp^k(1-p)^{n-k}$（$0\le k\le n$）。成功の位置と、一つの並びの確率を掛けます。`,m`$E(X)=np,V(X)=np(1-p)$。非復元抽出では成功確率が変わり独立でもないため、一般には二項分布を使えません。`],"成功とは何かを決め、回数・独立性・一定確率を確かめます。",[S("exact","ちょうどの回数","成功の位置を選びます。",nums.map(n=>binomial(n))),S("tail","少なくとも一回","零回の余事象にします。",nums.map(n=>binomial(n,true))),S("moments","回数の平均と分散","独立な零・一の変数の和として考えます。",nums.map(binomialMoment))],sec[2]),
 B(chapter,"continuous-distribution","連続分布と確率密度","確率を表すのは、曲線の高さではなく面積です。",[m`連続分布では区間の確率を、その区間と密度曲線で囲まれた面積で表します。密度は非負、全体の面積は $1$ です。`,m`一点だけの確率は $0$ です。そのため端を含むかどうかで区間確率は変わりません。ここでは長方形の面積で計算できる一様分布から始めます。`],"高さと面積を混同しないよう、区間の幅を確かめます。",[S("interval","区間の確率","幅と高さを掛けます。",nums.map(n=>uniform(n))),S("point","一点の確率","一点には幅がありません。",nums.map(n=>uniform(n,true)))],sec[2]),
 B(chapter,"normal-distribution","正規分布と標準化","平均からのずれを、標準偏差何個分かで表します。",[m`正規分布 $N(\mu,\sigma^2)$ は平均 $\mu$ を中心に左右対称です。第二の数は分散で、標準偏差は $\sigma>0$ です。`,m`$Z=\frac{X-\mu}{\sigma}$ とすると標準正規分布 $N(0,1)$ になります。確率は面積の表から読みます。左右の半分はそれぞれ $\frac12$ です。`],"境界も同じ式で標準化してから、求める面積を決めます。",[S("middle","中央の区間確率","標準化して対称な二つの面積を足します。",nums.map(n=>normalQuestion(n))),S("tail","片側の確率","半分の面積から表の値を引きます。",nums.map(n=>normalQuestion(n,true)))],sec[2])
];
const normalBank=distributionBanks.find(b=>b.lesson.slug==="mb-normal-distribution")!;
distributionBanks[distributionBanks.indexOf(normalBank)]=B(chapter,"normal-distribution",normalBank.lesson.title,normalBank.lesson.description,[...normalBank.lesson.introduction,m`両端が同じ側にある区間は、中央から測った大きな面積から小さな面積を引きます。負の側は左右対称を使って正の側へ移せます。`],normalBank.lesson.rule,[...normalBank.skills,S("between","同じ側にある区間","中央からの面積の差を取ります。",nums.map(normalBetween))],sec[2]);
distributionBanks.push(B(chapter,"distribution-conditions","分布を選ぶ条件","計算の前に、使う分布の条件を確認します。",["二項分布には、固定した試行回数・一定の成功確率・独立性が必要です。計算式へ数を入れる前に三つを確かめます。","正規近似では成功と失敗の期待回数、標本数、母集団の形を確認します。標本平均が正確に正規分布になる場合と、大標本で近似する場合は違います。"],"条件が足りないときは、適用できると決めつけません。",[S("binomial","二項分布を使えるか","何を数え、どんな試行をしているか確認します。",binomialConditions),S("normal","正規分布を使えるか","正確な分布と近似を分けて条件を確かめます。",normalConditions)],sec[2]));
addRepairExample(distributionBanks,"mb-independent-sum","sum",independent(2,true));
addRepairExample(distributionBanks,"mb-normal-distribution","between",normalBetween(2));
addRepairExample(distributionBanks,"mb-distribution-conditions","binomial",binomialConditions[1]);
addRepairExample(distributionBanks,"mb-distribution-conditions","binomial",binomialConditions[3]);
addRepairExample(distributionBanks,"mb-distribution-conditions","binomial",binomialConditions[4]);
addRepairExample(distributionBanks,"mb-distribution-conditions","normal",normalConditions[1]);
addRepairExample(distributionBanks,"mb-distribution-conditions","normal",normalConditions[5]);
addRepairExample(distributionBanks,"mb-distribution-conditions","normal",normalConditions[6]);
export const distributionChapter=finish(chapter,"distributions",distributionBanks,sec,{
 "mb-distribution-conditions-binomial":[1,2,3,4,5,6,7],
 "mb-distribution-conditions-normal":[1,2,3,4,5,6,7]
});
