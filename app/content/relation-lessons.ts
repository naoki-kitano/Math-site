const m=String.raw;
export const relationStarts={
 "m1-quadratic-inequality":{goal:m`$(x+1)(x-2)<0$ となる範囲を考えます。`,steps:[],check:m`積が負になるのは、二つの因数の符号が異なるときです。$x=-1,2$ では積が零なので、解に含めません。`},
 "locus-equations":{goal:m`線分 $y=2x$、$-1\leqq x\leqq1$ 上を動く点 $Q$ と、原点 $O$ の中点 $P$ を考えます。`,steps:[],check:m`方程式だけでなく、点が動ける範囲と両端を含むかも答えます。`},
 "mc-vector-dot":{goal:m`内積の符号が、二つのベクトルの向きとどう結び付くかを見ます。`,steps:[],check:m`非零の二つのベクトルについて、内積は $|\vec a||\vec b|\cos\theta$。一方が零ベクトルなら内積は零と定め、なす角は定めません。`},
 "m3-riemann-sums":{goal:m`$y=x^2$ と $x$ 軸の間の面積を、$0\leqq x\leqq1$ で考えます。`,steps:[],check:m`この図では、長方形の面積の和の極限が定積分になります。有限個の和と、求める面積は区別します。`},
};
