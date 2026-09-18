import type {MathTableData} from "../components/MathTable";
const m=String.raw;
export const math3IntegralTables:Record<string,MathTableData[]>={
 "m3-power-integrals":[{caption:"原始関数を微分して確かめる",headers:["被積分関数","原始関数の一つ","考える範囲"],rows:[
 [m`$x^2$`,m`$\dfrac{x^3}3$`,"実数全体"],[m`$x^{-2}$`,m`$-x^{-1}$`,m`$x=0$ を含まない区間`],[m`$x^{-1}$`,m`$\log|x|$`,m`$x=0$ を含まない区間`],[m`$x^{\frac12}$`,m`$\dfrac23x^{\frac32}$`,m`$x>0$`]]}],
 "m3-substitution-integrals":[{caption:"例題：式と微分を一緒に変える",headers:["元の変数","新しい変数"],rows:[
 [m`$x^2+1$`,m`$t$`],[m`$2x\,dx$`,m`$dt$`],[m`$x\,dx$`,m`$\dfrac12dt$`],[m`$\int x\sqrt{x^2+1}\,dx$`,m`$\dfrac12\int\sqrt t\,dt$`]]}],
 "m3-parts-introduction":[{caption:"例題：微分する側と積分する側",headers:["役割","選ぶ式","次の式"],rows:[
 ["微分する側",m`$u=x$`,m`$u'=1$`],["積分する側",m`$v'=e^x$`,m`$v=e^x$`],["積の項",m`$uv$`,m`$xe^x$`],["引く積分",m`$\int u'v\,dx$`,m`$\int e^x\,dx$`]]}]
};
