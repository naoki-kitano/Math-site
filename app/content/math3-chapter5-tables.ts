import type {MathTableData} from "../components/MathTable";
const m=String.raw;
export const math3ApplicationTables:Record<string,MathTableData[]>={
 "m3-monotonicity-extrema":[{caption:"例題：指数の因数は常に正",headers:[m`$x$`,m`$x<1$`,m`$1$`,m`$x>1$`],rows:[
 [m`$e^{-x}$`,m`$+$`,m`$+$`,m`$+$`],[m`$1-x$`,m`$+$`,m`$0$`,m`$-$`],[m`$f'(x)$`,m`$+$`,m`$0$`,m`$-$`],[m`$f(x)=xe^{-x}$`,"増加",m`極大値 $\dfrac1e$`,"減少"]]}],
 "m3-concavity-inflection":[{caption:"例題：二つの導関数を区別する",headers:[m`$y=x^3$`,m`$x<0$`,m`$0$`,m`$x>0$`],rows:[
 [m`$y'=3x^2$`,m`$+$`,m`$0$`,m`$+$`],["増減","増加","極値ではない","増加"],
 [m`$y''=6x$`,m`$-$`,m`$0$`,m`$+$`],["凹凸","上に凸","変曲点","下に凸"]]}],
 "m3-global-extrema":[{caption:"例題：対数を含む関数の増減",headers:[m`$x$`,m`$0<x<e$`,m`$e$`,m`$x>e$`],rows:[
 [m`$1-\log x$`,m`$+$`,m`$0$`,m`$-$`],[m`$f'(x)$`,m`$+$`,m`$0$`,m`$-$`],[m`$f(x)=\dfrac{\log x}{x}$`,"増加",m`最大値 $\dfrac1e$`,"減少"]]}],
 "m3-velocity-acceleration":[{caption:"例題：位置が減る間は速度が負",headers:[m`$t$`,m`$0<t<2$`,m`$2$`,m`$2<t<3$`],rows:[
 [m`$v(t)=2t-4$`,m`$-$`,m`$0$`,m`$+$`],["向き","負の向き","静止","正の向き"],[m`$|v(t)|$`,m`$4-2t$`,m`$0$`,m`$2t-4$`]]}]
};
