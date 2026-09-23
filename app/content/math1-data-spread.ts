import {m,w,skill,dataTopic,addDataCases,appendData,regroupData,frac,list,sum,mean,variance} from "./math1-data-authoring";
import type {Worked} from "./math1-topic";

function deviation(xs:number[]):Worked{
 const n=xs.length,s=sum(xs),av=frac(s,n),ds=xs.map(x=>frac(n*x-s,n));
 return w(m`データ $${list(xs)}$ の平均と、もとの順序での偏差を求め、偏差の和を確かめなさい。`,m`平均は $${av}$、偏差は $${ds.join(",")}$、その和は $0$。`,"偏差は「値から平均を引く」です。負の偏差を消さないでください。",m`平均は $\frac{${s}}{${n}}=${av}$。各値からこの平均を引くと $${ds.join(",")}$。平均より下は負、上は正になり、和は $0$ です。`);
}
export const deviationData=[2,4,4,6];
const deviations=skill("deviation","平均からのずれ",m`偏差は $x_i-\bar x$。値の合計は $n\bar x$。各値から平均を引いて全部足すと、平均も $n$ 個分引くので、$n\bar x-n\bar x=0$ です。偏差をそのまま足しても散らばりは測れません。`,deviation(deviationData),[[1,2,3],[2,2,5],[0,2,4,6],[1,2,4,5],[-3,-1,1,3],[1,2,3,4]].map(deviation));
function varianceFromData(xs:number[]):Worked{
 const n=xs.length,s=sum(xs),av=frac(s,n),numer=sum(xs.map(x=>(n*x-s)**2)),v=frac(numer,n*n*n);
 const dev=xs.map(x=>frac(n*x-s,n));
 return w(m`$${list(xs)}$ の分散を、偏差の二乗の平均として求めなさい。`,m`分散は $${v}$。`,"平均からのずれを一つずつ二乗して足し、データの個数で割ります。",m`平均は $${av}$、偏差は $${dev.join(",")}$。二乗して足すと $${dev.map(d=>`(${d})^2`).join("+")}=${frac(numer,n*n)}$。よって分散は $\frac{${frac(numer,n*n)}}{${n}}=${v}$。ここでは不偏分散ではなく、$${n}$ 個のデータ自身の散らばりを求めています。`);
}
const variances=skill("deviation-variance","二乗してから平均する",m`分散 $s^2$ は偏差を一つずつ二乗して合計し、データの個数 $n$ で割った値です。負のずれも二乗で正になり、平均から離れた値ほど大きく数えられます。`,varianceFromData(deviationData),[[1,3,5],[2,2,5],[1,2,3,4],[0,2,4,6],[-2,0,2],[2,4,4,6]].map(varianceFromData));
export const dataVariance=dataTopic("m1-data-variance","偏差と分散",["同じ平均でも、一か所に集まるデータと広く散らばるデータがあります。平均からどれだけ離れているかを、一つずつ見ます。",m`$n$ 個の記録を $x_1,x_2,\ldots,x_n$ と書きます。$x_i$ は $i$ 番目の値、$\bar x$ は全体の平均です。添字は何番目の記録かを表します。`],m`偏差を二乗し、その平均を取って散らばりを表します。分散は必ず $0$ 以上です。`,[deviations,variances]);

function radical(n:number):string{if(n===0)return "0";let k=1;for(let i=2;i*i<=n;i++)if(n%(i*i)===0)k=i;return n===k*k?String(k):m`${k===1?"":k}\sqrt{${n/(k*k)}}`;}
function sd(v:number,unit:string):Worked{return w(m`${unit}単位のデータの分散が $${v}$ です。標準偏差とその単位を求めなさい。`,m`標準偏差は $${radical(v)}$ ${unit}。`,"分散の非負の平方根を取ります。単位はもとの量に戻ります。",m`$s=\sqrt{s^2}=\sqrt{${v}}=${radical(v)}$。標準偏差は非負なので負の平方根は取りません。分散の単位は${unit}の二乗、標準偏差の単位は${unit}です。`);}
const standard=skill("standard-deviation","もとの単位に戻す",m`標準偏差は分散の非負の平方根 $s=\sqrt{s^2}$。たとえば分なら、分散は分の二乗、標準偏差は分で表します。`,sd(4,"分"),[sd(9,"分"),sd(2,"センチメートル"),sd(0,"秒"),sd(8,"分"),sd(16,"秒"),sd(5,"センチメートル")]);
function sdCompare(a:number,b:number,av:number):Worked{return w(m`同じ単位の二群の平均はどちらも $${av}$。標準偏差は $A$ が $${a}$、$B$ が $${b}$ です。平均のまわりの散らばりを比較しなさい。`,a===b?"標準偏差で測った散らばりは同じです。":m`標準偏差で測った散らばりは $${a>b?"A":"B"}$ の方が大きい。`,"標準偏差が大きい方ほど、平均からの二乗のずれの平均も大きいです。",m`標準偏差 $${a}$ と $${b}$ を比べます。${a===b?"この指標は等しいですが、個々の値が一致するとは限りません。":"大きい方を選びます。平均の大小ではなく、平均のまわりの広がりについての比較です。"}`);}
const compareSD=skill("compare-sd","平均と散らばりを分けて読む","同じ種類・単位の量を比べます。平均が同じでも、標準偏差が同じとは限りません。",sdCompare(1,3,5),[sdCompare(2,4,10),sdCompare(5,2,20),sdCompare(0,2,3),sdCompare(3,3,12),sdCompare(4,1,6),sdCompare(2,2,8)]);
const zeroSpread=skill("zero-spread","散らばりがないということ",m`分散は非負の二乗の平均なので、分散が $0$ になるのは全ての偏差が $0$ のとき。全ての値が平均と等しいことを意味します。`,w(m`平均 $5$、分散 $0$ のデータについて、各値は何ですか。`,m`全て $5$ です。`,"二乗の和が零になるには、それぞれの二乗が零である必要があります。",m`各 $(x_i-5)^2$ は非負。その平均が $0$ なら全て $0$ なので、全て $x_i=5$。`),[
 w(m`平均 $3$、標準偏差 $0$。全ての値は何ですか。`,m`全て $3$。`,"標準偏差を二乗すると分散です。",m`分散も $0$ なので全ての偏差が $0$。全ての値が平均 $3$ と一致します。`),
 w(m`$4,4,4,4$ の標準偏差を求め、理由を述べなさい。`,m`$0$。全て平均と等しいためです。`,"平均からのずれを考えます。",m`平均は $4$。全ての偏差が $0$ なので分散も標準偏差も $0$。`),
 w(m`標準偏差が $0$ なら、元の値も全て $0$ ですか。`,"そうとは限りません。全て同じ値であればよく、その値は平均です。","全て同じ非零の値の例を考えます。",m`$2,2,2$ の平均は $2$ で、偏差は全て $0$。標準偏差は $0$ ですが元の値は $2$。`),
 w(m`$-1,-1,-1$ の分散と標準偏差を求めなさい。`,m`どちらも $0$。`,"元の値の符号でなく、平均からのずれを見ます。",m`平均は $-1$。偏差は全て $0$ なので、分散もその非負の平方根も $0$。`),
 w(m`平均 $8$、分散 $0$。各値を答えなさい。`,m`全て $8$。`,"二乗した偏差は負にならないことを使います。",m`非負の二乗の平均が $0$ なので各偏差が $0$。各値は平均 $8$ と同じです。`),
 w(m`$7,7,7,7,7$ の標準偏差と、その意味を答えなさい。`,m`$0$。平均のまわりに散らばっていません。`,"全て同じ値のときの偏差を考えます。",m`平均は $7$ で偏差は全て $0$。分散は $0$、標準偏差も $0$ です。`)
]);
export const dataSD=dataTopic("m1-standard-deviation","標準偏差",["二乗で測った散らばりを、もとの量の単位で読み直します。"],"標準偏差は分散の非負の平方根。比較では量の種類と単位をそろえます。",[standard,compareSD,zeroSpread]);

function secondMoment(xs:number[]):Worked{
 const n=xs.length,s=sum(xs),ss=sum(xs.map(x=>x*x)),ans=frac(n*ss-s*s,n*n);
 return w(m`$${list(xs)}$ の分散を「二乗の平均から平均の二乗を引く」方法で求めなさい。`,m`分散は $${ans}$。`,"平均と、各値を二乗したものの平均を別々に求めます。",m`平均は $${frac(s,n)}$、各値の二乗を足すと $${xs.map(x=>`(${x})^2`).join("+")}=${ss}$。これを個数で割って、二乗の平均は $${frac(ss,n)}$。したがって $s^2=${frac(ss,n)}-\left(${frac(s,n)}\right)^2=${ans}$。平均の二乗を引く位置を逆にしません。`);
}
const moments=skill("variance-moments","二乗の平均を使う",m`$(x_i-\bar x)^2=x_i^2-2\bar x x_i+\bar x^2$ と展開し、全ての記録について平均します。$x_i$ の平均は $\bar x$ なので、後ろの二項の平均は $-2\bar x\cdot\bar x+\bar x^2=-(\bar x)^2$。したがって分散は「二乗の平均から平均の二乗を引く」と求まります。`,secondMoment([1,2,4,5]),[[0,1,2,3],[1,1,3,3],[2,3,5],[0,0,3,5],[-2,0,2,4],[2,4,4,6]].map(secondMoment));
function shifted(xs:number[],base:number):Worked{
 const ys=xs.map(x=>x-base),av=mean(xs),v=variance(xs);
 if(!Number.isInteger(av)||!Number.isInteger(v))throw new Error("Use simple shift data");
 return w(m`$${list(xs)}$ の分散を求めなさい。各値から $${base}$ を引いて計算を簡単にし、分散が変わらない理由も説明しなさい。`,m`分散は $${v}$。平均も同じだけ移動するので、偏差が変わりません。`,"値から基準を引いた小さな数を作り、その平均からのずれを調べます。",m`新しい値は $${list(ys)}$、平均は $${mean(ys)}$。元の平均 $${av}$ とも $${base}$ の差です。$(x_i-${base})-(\bar x-${base})=x_i-\bar x$ なので偏差は不変。新しい値で二乗の平均から平均の二乗を引くと $${frac(sum(ys.map(x=>x*x)),ys.length)}-(${mean(ys)})^2=${v}$。`);
}
const convenient=skill("variance-shift-method","近い基準からの差で計算する","大きな数同士の二乗を引くより、全体を近い基準だけ平行移動すると楽な場合があります。偏差が変わらないので分散も変わりません。",shifted([98,100,100,102],100),[
 shifted([19,21,21,23],20),shifted([48,50,50,52],50),shifted([101,103,103,105],100),shifted([198,200,200,202],200),shifted([29,31,31,33],30),shifted([78,80,80,82],80)]);
export const varianceMethods=dataTopic("m1-variance-calculation","分散の計算方法",["偏差の二乗を一つずつ出す方法と、二乗の平均を使う方法は、同じ量を計算しています。数値を見て計算しやすい方を選びます。"],m`$s^2=\overline{x^2}-(\bar x)^2$。$\overline{x^2}$ と $(\bar x)^2$ は別の量です。`,[moments,convenient]);

export function affineTex(a:number,b:number){return a===0?String(b):(a===1?"x":a===-1?"-x":`${a}x`)+(b===0?"":b<0?String(b):"+"+b);}
function transformedMean(av:number,a:number,b:number):Worked{return w(m`元のデータの平均は $${av}$。全ての値を $y=${affineTex(a,b)}$ に変えます。新しい平均を求めなさい。`,m`$${a*av+b}$。`,"各値を足すとき、倍率と加えた定数がどうまとまるかを考えます。",m`$\bar y=${a}\bar x${b<0?b:"+"+b}=${a}\cdot${av}${b<0?b:"+"+b}=${a*av+b}$。同じ変換を全ての値に行っているので、平均にも同じ変換を適用できます。`);}
const transformedCenters=skill("transformed-mean","平均にも同じ変換を行う",m`$y_i=ax_i+b$ を全て足すと、元の合計の $a$ 倍に $nb$ を足した値になります。これを $n$ で割ると $\bar y=a\bar x+b$。足す定数も平均に残ります。`,transformedMean(5,2,3),[transformedMean(4,1,5),transformedMean(3,2,0),transformedMean(6,-1,10),transformedMean(5,0,7),transformedMean(8,-2,20),transformedMean(7,3,-2)]);
export const transformCases=[{sd:2,a:1,b:5},{sd:3,a:2,b:0},{sd:2,a:-1,b:10},{sd:4,a:0,b:7},{sd:3,a:-2,b:20},{sd:2,a:3,b:-2}];
function transformedSpread(s:number,a:number,b:number):Worked{return w(m`元の標準偏差は $${s}$。全ての値を $y=${affineTex(a,b)}$ に変えます。新しい分散と標準偏差を求めなさい。`,m`分散は $${a*a*s*s}$、標準偏差は $${Math.abs(a)*s}$。`,"加える定数は偏差から消えます。倍率は二乗と絶対値で使い分けます。",m`$y_i-\bar y=${a}(x_i-\bar x)$。二乗の平均は $(${a})^2\cdot${s*s}=${a*a*s*s}$、その非負の平方根は $|${a}|\cdot${s}=${Math.abs(a)*s}$。${a===0?"全ての値が同じ定数になるので、散らばりは零です。":a<0?"向きが反転しても、標準偏差を負にしてはいけません。":"定数を加えても平均からの距離は変わりません。"}`);}
const transformedSpreads=skill("transformed-spread","偏差の変化から散らばりへ",m`$y_i-\bar y=a(x_i-\bar x)$ だから分散は $a^2$ 倍、標準偏差は $|a|$ 倍。加えた定数 $b$ は偏差から消えます。`,transformedSpread(2,-3,8),transformCases.map(c=>transformedSpread(c.sd,c.a,c.b)));
export const dataTransform=dataTopic("m1-data-transformation","データの変換",["値の目盛りや基準を変えたとき、平均と散らばりは違う変化をします。毎回元データを並べ直さず、偏差がどう変わるかに着目します。"],m`$y=ax+b$ では、平均は $a\bar x+b$、分散は $a^2s_x^2$、標準偏差は $|a|s_x$。`,[transformedCenters,transformedSpreads]);
export const dataSpreadTopics=[dataVariance,dataSD,varianceMethods,dataTransform];
for(const bank of dataSpreadTopics)for(const family of new Set(bank.exercises.filter(e=>e.stage==="guided").map(e=>e.family)))addDataCases(bank,family,[2,3,4]);
const dataNotation=m`$x_i$ は一つずつの記録、$\bar x$ はその平均、$n$ は個数です。$s^2$ が分散、$s$ が標準偏差を表します。`;
for(const bank of dataSpreadTopics){
 if(bank!==dataVariance)bank.lesson.introduction.splice(1,0,dataNotation);
 for(const supplement of bank.lesson.supplements)if(supplement.text.includes("x_i"))supplement.text=dataNotation+"\n"+supplement.text;
}
dataSD.lesson.prerequisites=[{slug:dataVariance.lesson.slug,label:"偏差と分散"}];
varianceMethods.lesson.prerequisites=[{slug:dataVariance.lesson.slug,label:"偏差と分散"}];
dataTransform.lesson.prerequisites=[{slug:dataSD.lesson.slug,label:"標準偏差"},{slug:varianceMethods.lesson.slug,label:"分散の計算方法"}];
const methodChoices:Worked[]=[
 w(m`$98,100,100,102$ の分散を求めなさい。計算法を自分で選び、その方法を選んだ理由も書きなさい。`,m`例えば全体から $100$ を引きます。近い基準との差にすると小さい整数で計算できるからです。新しい平均は $0$、分散は $\frac{4+0+0+4}{4}=2$。正しく計算・説明できれば他の方法でも構いません。`,"値の大きさだけでなく、近い基準との差や平均を見ます。",m`値が $100$ 付近にあるので、全てから $100$ を引いて $-2,0,0,2$ にします。平均も $100$ だけ移り、偏差は変わりません。新しい平均は $0$、偏差の二乗の合計は $8$。$4$ 個の平均なので分散は $2$。元の値で偏差を計算しても同じです。`),
 w(m`$0,1,2,3$ の分散を求めなさい。計算法を自分で選び、その方法を選んだ理由も書きなさい。`,m`例えば二乗の平均を使います。元の値は小さい整数で、分数の偏差を一つずつ二乗する計算を減らせるからです。$\frac{14}{4}-(\frac32)^2=\frac54$。妥当な理由と正しい計算があれば他の方法でも構いません。`,"元の値の二乗と、平均からのずれのどちらが計算しやすいか考えます。",m`平均は $\frac32$ なので、偏差は分数です。一方、元の二乗の和は $0+1+4+9=14$。二乗の平均から平均の二乗を引く方法を選ぶと、$\frac72-\frac94=\frac54$。偏差を使っても同じ分散になります。`),
 w(m`$48,50,50,52$ の分散を求めなさい。使う計算法と、それを選んだ理由も述べなさい。`,m`例えば $50$ からの差に変えます。値が $50$ 付近なので計算が小さくなるためです。$\frac{(-2)^2+0^2+0^2+2^2}{4}=2$。説明と計算が正しければ他の方法も認められます。`,"共通の数を引いても、平均からのずれは変わりません。",m`$50$ を引けば $-2,0,0,2$。平均は $0$、偏差の二乗和は $8$ なので分散は $2$。値も平均も同じだけ移すため、この小さな数で求めた分散は元の分散です。`),
 w(m`$1,2,3$ の分散を求めなさい。使う計算法と選んだ理由を述べなさい。`,m`例えば偏差を使います。平均が $2$ で、ずれが $-1,0,1$ と簡単だからです。分散は $\frac{1+0+1}{3}=\frac23$。他の正しい方法と理由でも構いません。`,"まず平均を考え、ずれが簡単に出せるか確かめます。",m`平均は $2$。偏差が小さな整数になるので、その二乗の平均を選びます。$(-1)^2+0^2+1^2=2$ より分散は $\frac23$。二乗の平均を使う別解では $\frac{14}{3}-4=\frac23$。`)
];
methodChoices.forEach((q,i)=>appendData(varianceMethods,"variance-method-choice",String(i+1),q,i<2?"practice":"review"));
regroupData(varianceMethods,methodChoices.map((_,i)=>"variance-method-choice-"+(i+1)),"variance-method-choice","計算しやすい方法を選ぶ","平均からのずれが簡単なら偏差の二乗、元の値の二乗が簡単なら二乗の平均、値が大きくても近い基準があるなら平行移動を考えます。方法は一つに決まりません。選んだ理由を添え、同じ分散が得られることを確かめます。");
