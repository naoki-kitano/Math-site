import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;
export const math3GeometryCorrespondence:Record<string,FormulaLesson>={
 'm3-optimization-model':{
  title:'図の辺から、面積の式を作る',
  goal:'同じ長さの辺の本数を数え、もう一辺を表します。',
  check:m`長さは $\mathrm m$、面積 $A$ は $\mathrm{m^2}$。二辺が正なので $0<x<6$ です。`,
  steps:[
   {label:'同じ長さの辺',text:m`壁に沿う長方形を、三辺の合計 $12\,\mathrm m$ の柵で囲みます。壁に垂直な二辺は、どちらも $x\,\mathrm m$ です。`,formulas:[],diagram:{kind:'fence',stage:0}},
   {label:'二本分を数える',text:m`二本の長さを並べて足すと、$x+x=2x$。係数 $2$ は、同じ長さの柵が二本あることを表します。`,formulas:[],diagram:{kind:'fence',stage:1}},
   {label:'残る辺の長さ',text:m`柵全体の $12$ から、垂直な二本分の $2x$ を引きます。残りが、壁に平行な辺の長さです。`,formulas:[],diagram:{kind:'fence',stage:2}},
   {label:'二辺の積',text:'長方形の面積は、垂直な辺と平行な辺の長さを掛けたものです。',formulas:[m`A={\color{#176c82}{x}}\,{\color{#936114}{(12-2x)}}`],diagram:{kind:'fence',stage:3}}
  ]
 },
 'm3-washer-volume':{
  title:'軸からの距離を、二つの半径へ',
  goal:'外側の円と穴の円の面積を、別々に求めます。',
  check:m`外半径 $R$、内半径 $r$ は $R\ge r\ge0$。回転軸に垂直な断面を考えます。`,
  steps:[
   {label:'回転軸を確かめる',text:m`$0\le x\le1$、$1\le y\le2$ の領域を、直線 $y=-1$ のまわりに回します。`,formulas:[],diagram:{kind:'washer',stage:0}},
   {label:'軸から測る',text:m`半径は、回転軸から境界までの距離です。遠い境界 $y=2$ までが $R$、近い境界 $y=1$ までが $r$ です。`,formulas:[m`R=2-(-1)={\color{#176c82}{3}}`,m`r=1-(-1)={\color{#936114}{2}}`],diagram:{kind:'washer',stage:1}},
   {label:'二つの円に対応させる',text:'二つの距離が、そのまま断面の外半径と内半径になります。内側には穴が残るので、外円から内円の面積を引きます。',formulas:[m`A=\pi{\color{#176c82}{R^2}}-\pi{\color{#936114}{r^2}}`],diagram:{kind:'washer',stage:2}},
   {label:'断面積を積分する',text:m`この領域では、どの $x$ でも半径は同じです。断面積を $0\le x\le1$ で積分します。`,formulas:[m`A=\pi\cdot{\color{#176c82}{3^2}}-\pi\cdot{\color{#936114}{2^2}}=5\pi`,m`V=\int_0^1 5\pi\,dx=5\pi`],diagram:{kind:'washer',stage:3}}
  ]
 }
};
