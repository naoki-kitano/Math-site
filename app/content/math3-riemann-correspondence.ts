import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;
export const math3RiemannCorrespondence:Record<string,FormulaLesson>={
 'm3-riemann-sums':{title:'長方形の和から面積へ',goal:'幅・高さ・足す範囲を対応させます。',check:m`ここでは $y=x^2$、$0\le x\le1$。有限個の長方形の和は近似で、定積分はその極限です。`,steps:[
  {label:'幅を決める',text:m`区間 $[0,1]$ を $n$ 等分します（図は $4$ 等分の例）。色の付いた一つの長方形の幅は、区間の長さを $n$ で割ったものです。`,diagram:{kind:'riemann',stage:0},formulas:[m`\Delta x={\color{#936114}{\dfrac1n}}`]},
  {label:'高さを掛ける',text:m`右端 $x_k=\dfrac kn$ での高さ $f(x_k)$ を、幅に掛けます。$A_k$ はこの長方形の面積です。`,diagram:{kind:'riemann',stage:1},formulas:[m`A_k=\Delta x\cdot f(x_k)`,m`={\color{#936114}{\dfrac1n}}\cdot{\color{#176c82}{\left(\dfrac kn\right)^2}}`]},
  {label:'すべてを足す',text:m`同じ幅で作った $n$ 個の長方形を足します。和の記号は、図のすべての長方形に対応します。`,diagram:{kind:'riemann',stage:2},formulas:[m`S_n=\sum_{k=1}^n A_k`,m`=\sum_{k=1}^n{\color{#936114}{\dfrac1n}}{\color{#176c82}{\left(\dfrac kn\right)^2}}`]},
  {label:'幅を小さくする',text:m`$n\to\infty$ とすると幅が零へ近づき、曲線との隙間も小さくなります。左端と右端のどちらの高さを使っても、同じ面積へ近づきます。`,diagram:{kind:'riemann',stage:3},formulas:[m`\int_0^1x^2\,dx=\dfrac13`]}
 ]}
};
