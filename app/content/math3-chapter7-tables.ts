import type {MathTableData} from "../components/MathTable";
const m=String.raw;
export const math3DefiniteTables:Record<string,MathTableData[]>={
 "m3-definite-substitution":[{caption:"両端と微小量の対応",headers:["置換","元の下端 → 新しい下端","元の上端 → 新しい上端","微小量"],rows:[
 [m`$t=x^2$`,m`$x=0\ \to\ t=0$`,m`$x=1\ \to\ t=1$`,m`$dt=2x\,dx$`],
 [m`$t=1-x$`,m`$x=0\ \to\ t=1$`,m`$x=1\ \to\ t=0$`,m`$dt=-dx$`]]}],
 "m3-moving-endpoints":[{caption:"連続な被積分関数と微分可能な上下端",headers:["動く端","微分"],rows:[
 [m`$\int_a^x f(t)\,dt$`,m`$f(x)$`],
 [m`$\int_a^{g(x)} f(t)\,dt$`,m`$f(g(x))g'(x)$`],
 [m`$\int_{h(x)}^a f(t)\,dt$`,m`$-f(h(x))h'(x)$`],
 [m`$\int_{h(x)}^{g(x)}f(t)\,dt$`,m`$f(g(x))g'(x)-f(h(x))h'(x)$`]]}],
 "m3-riemann-sums":[{caption:"右端で作る一片と全体の和",headers:["区間","幅","第 $k$ 右端","高さ"],rows:[
 [m`$[0,1]$`,m`$\dfrac1n$`,m`$\dfrac kn$`,m`$f\left(\dfrac kn\right)$`],
 [m`$[1,2]$`,m`$\dfrac1n$`,m`$1+\dfrac kn$`,m`$f\left(1+\dfrac kn\right)$`],
 [m`$[0,2]$`,m`$\dfrac2n$`,m`$\dfrac{2k}{n}$`,m`$f\left(\dfrac{2k}{n}\right)$`]]}]
};
