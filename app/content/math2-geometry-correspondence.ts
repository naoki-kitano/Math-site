import type {FormulaLesson} from './formula-correspondence';
const m=String.raw;
const diagram=(kind:string,stage:number,animated=false)=>({kind:`m2-geometry-${kind}`,stage,animated});
export const math2GeometryCorrespondence:Record<string,FormulaLesson>={
 'section-points':{
  title:'比から、座標の重みへ',goal:'端から進む割合を、座標の式に表します。',
  check:m`異なる二点を $m:n$ に内分するとき、$m,n>0$ です。`,
  steps:[
   {label:'三つに分ける',text:m`$A(0,-1)$、$B(6,2)$ を $AP:PB=1:2$ に内分します。全体を三等分すると、$AP$ は一つ分です。`,formulas:[],diagram:diagram('section',0)},
   {label:'一つ分進む',text:m`$A$ から $B$ へ、横の変化 $6-0$ の三分の一だけ進みます。`,formulas:[m`x_P=0+\dfrac{6-0}{3}=2`],diagram:diagram('section',1,true)},
   {label:'重みが入れ替わる理由',text:m`横の座標を $a,c$ と書くと、$A$ の座標には $1-\dfrac13=\dfrac23$ が掛かります。これが、比 $1:2$ に対して重みが $2:1$ になる理由です。`,formulas:[m`x_P=a+\dfrac{c-a}{3}`,m`=\dfrac{2a+c}{3}`],diagram:diagram('section',2)},
   {label:'縦も同じ割合',text:m`縦の変化も三分の一です。横と縦を組にして、点の座標に戻します。`,formulas:[m`y_P=-1+\dfrac{2-(-1)}3=0`,m`P=(2,0)`],diagram:diagram('section',3)}
  ]
 },
 'point-distance':{
  title:'二つの差を、三平方の式へ',goal:'横・縦の変化と辺の長さを区別します。',check:'距離には非負の平方根を取ります。',
  steps:[
   {label:'二つの変化',text:m`$A(-1,2)$ から $B(2,-2)$ へは、右に $3$、下に $4$。縦の変化は $-4$ ですが、縦の辺の長さは $4$ です。`,formulas:[],diagram:diagram('distance',0)},
   {label:'斜辺の二乗',text:'直角をはさむ二辺の二乗を足すと、求める斜辺の二乗になります。',formulas:[m`AB^2={\color{#176c82}{3}}^2+{\color{#936114}{(-4)}}^2=25`],diagram:diagram('distance',1)},
   {label:'長さへ戻す',text:'二乗した長さから、非負の平方根を取ります。',formulas:[m`AB=\sqrt{25}=5`],diagram:diagram('distance',2)}
  ]
 },
 'point-line-distance':{
  title:'直線の係数と、点の座標',goal:'公式のどこに何を入れるかを見分けます。',check:m`直線 $ax+by+c=0$ では $(a,b)\ne(0,0)$。距離は垂線の長さです。`,
  steps:[
   {label:'役割を分ける',text:m`点 $P(-1,-1)$ と直線 $3x+4y+1=0$ を考えます。$a,b,c$ は直線の係数、$x_0,y_0$ は点の座標です。`,formulas:[m`d=\dfrac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}`],diagram:diagram('line-distance',0)},
   {label:'分子には点を代入',text:'直線の左辺に点の座標を入れ、絶対値を取ります。',formulas:[m`3(-1)+4(-1)+1=-6`,m`|-6|=6`],diagram:diagram('line-distance',1)},
   {label:'分母は直線の係数から',text:m`分母には $a,b$ だけを使います。二乗和の平方根は $5$ なので、垂線の長さは $\dfrac65$ です。`,formulas:[m`\sqrt{3^2+4^2}=5`,m`d=\dfrac65`],diagram:diagram('line-distance',2)},
   {label:'同じ直線なら同じ距離',text:m`直線の式を二倍しても、直線は変わりません。分子も分母も二倍になるので、距離は同じです。`,formulas:[m`6x+8y+2=0`,m`d=\dfrac{12}{10}=\dfrac65`],diagram:diagram('line-distance',3)}
  ]
 },
 'line-equations':{
  title:'点からの差を結ぶ',goal:'点を通る式を、横と縦の変化から作ります。',check:m`傾きは横の差が $0$ でないときに使えます。縦の直線は $x=a$ です。`,
  steps:[
   {label:'点からの変化',text:m`傾き $2$ で $A(-1,-2)$ を通る直線を作ります。まず $A$ の右上の点 $P(x,y)$ を考え、横と縦の差を読みます。`,formulas:[],diagram:diagram('point-slope',0)},
   {label:'縦は横の二倍',text:m`傾きが $2$ なので、縦の変化は横の変化の二倍です。`,formulas:[m`y-(-2)=2\{x-(-1)\}`,m`y+2=2(x+1)`],diagram:diagram('point-slope',1)},
   {label:'一般の点へ',text:m`差を符号付きの変化と考えれば、$A$ の左下でも同じ式です。一般に、点 $A(a,b)$ を通り傾きが $m$ なら $y-b=m(x-a)$。この例では $a=-1,b=-2,m=2$ です。`,formulas:[m`y+2=2(x+1)`,m`y=2x`],diagram:diagram('point-slope',2)}
  ]
 },
 'parallel-perpendicular':{
  title:'直角に回すと、横と縦が入れ替わる',goal:'垂直な方向の傾きを、横と縦の変化から読みます。',check:'両方の傾きがあるとき、その積は負の一です。縦線と横線は別に考えます。',
  steps:[
   {label:'元の方向',text:m`傾き $2$ の直線に垂直な方向を調べます。元の方向は、横に $1$、縦に $2$ 進む向きです。`,formulas:[m`m=\dfrac21=2`],diagram:diagram('perpendicular',0)},
   {label:'直角に回す',text:m`同じ矢印を直角に回すと、左に $2$、上に $1$。横の変化が $-2$ になるので、傾きは負になります。`,formulas:[m`m'=\dfrac{1}{-2}=-\dfrac12`],diagram:diagram('perpendicular',1,true)},
   {label:'指定点を通す',text:m`この方向で $(0,1)$ を通るようにすると、次の直線になります。`,formulas:[m`y-1=-\dfrac12x`,m`2\left(-\dfrac12\right)=-1`],diagram:diagram('perpendicular',2)}
  ]
 },
 'circle-completing-square':{
  title:'平方を作り、増えた数を引く',goal:'二つの平方を、一組ずつ作ります。',check:m`平方完成後の右辺が正なら円、$0$ なら一点、負なら実数の点はありません。`,
  steps:[
   {label:'括弧に入る数',text:m`$x^2+y^2-2x+2y+1=0$ を整理します。まず $x$ の係数 $-2$ を半分にします。`,formulas:[],motion:{source:m`\dfrac{-2}{2}={\color{#176c82}{-1}}`,target:m`(x{\color{#176c82}{-1}})^2=x^2-2x+1`,parts:[{tex:m`\color{#176c82}{-1}`,color:'#176c82'}]}},
   {label:'増えた一を補う',text:m`平方の中では $1$ が増えています。その $1$ を引けば、元の $x^2-2x$ と等しくなります。`,formulas:[],motion:{source:m`(x-1)^2=x^2-2x+{\color{#936114}{1}}`,target:m`x^2-2x=(x-1)^2-{\color{#936114}{1}}`,parts:[{tex:m`\color{#936114}{1}`,color:'#936114'}]}},
   {label:'縦の項も同じように',text:m`$y$ の係数 $2$ の半分は $1$。こちらも平方で増える $1$ を引きます。`,formulas:[m`y^2+2y=(y+1)^2-{\color{#936114}{1}}`]},
   {label:'中心と半径を読む',text:m`補った定数を合わせると右辺は $1$。中心は $(1,-1)$、半径は $1$ です。`,formulas:[m`(x-1)^2+(y+1)^2=1`],diagram:diagram('completed-circle',0)}
  ]
 },
 'circle-common-chord':{
  title:'共通の項を引き、直線を残す',goal:'二円の共通点が満たす一次の式を作ります。',check:'二円の二次の係数をそろえて引きます。差の式だけでは、円上にあるとは限りません。',
  steps:[
   {label:'同じ項をそろえる',text:m`二円 $(x-1)^2+y^2=5$ と $(x+1)^2+y^2=5$ を展開します。同じ点は両式を満たすので、両式の差も $0$ です。`,formulas:[],diagram:diagram('chord-terms',0)},
   {label:'差を取る',text:m`上の式から下の式を引きます。$x^2$、$y^2$、定数が打ち消し合い、一次の項だけが残ります。`,formulas:[m`-4x=0`,m`x=0`],diagram:diagram('chord-terms',1,true)},
   {label:'円の条件も満たす点',text:m`$x=0$ を円へ戻すと $y=\pm2$。この二点が、円と直線の両方を満たします。`,formulas:[m`1+y^2=5`,m`(0,-2),\quad(0,2)`],diagram:diagram('chord',0)}
  ]
 },
 'circle-tangents':{
  title:'半径の方向から、接線の式へ',goal:'接線の係数がどこから来るかを確かめます。',check:'接点は円上にあり、接線はその点への半径と垂直です。縦の直線には傾きを使いません。',
  steps:[
   {label:'半径の傾き',text:m`円 $(x+1)^2+y^2=25$ の中心は $C(-1,0)$、接点は $T(2,4)$。半径の横・縦の変化は $3,4$ です。`,formulas:[m`m_{CT}=\dfrac43`],diagram:diagram('tangent',0)},
   {label:'垂直な方向',text:m`接線は右に $4$、下に $3$ 進む方向です。半径に垂直なので傾きは $-\dfrac34$ になります。`,formulas:[m`m=-\dfrac34`],diagram:diagram('tangent',1)},
   {label:'接点を通る式',text:m`接点 $T(2,4)$ と傾きを、点を通る式へ入れます。分母を払うと、半径の変化 $3,4$ が係数に現れます。`,formulas:[m`y-4=-\dfrac34(x-2)`,m`3(x-2)+4(y-4)=0`],diagram:diagram('tangent',2)}
  ]
 },
 'two-circle-position':{
  title:'接点の位置が、和と差を決める',goal:'中心間の距離を、二つの半径と比べます。',check:m`半径 $r,s>0$。中心が同じ場合は、異なる半径なら共有点なし、同じ半径なら同一円です。`,
  steps:[
   {label:'外側で接する',text:m`半径が $3$ と $1$ の二円を考えます。外接するとき、接点は二つの中心の間にあるので、中心間の距離は二半径の和です。`,formulas:[m`d=3+1=4`],diagram:diagram('two-circles',0)},
   {label:'内側で接する',text:'内接するとき、大きい半径は中心間の距離と小さい半径の和になります。',formulas:[m`3=d+1`,m`d=3-1=2`],diagram:diagram('two-circles',1)},
   {label:'二つの境目',text:m`一般には外接で $d=r+s$、内接で $d=|r-s|$。二つの境目の間なら、二点で交わります。`,formulas:[m`|r-s|<d<r+s`],diagram:diagram('two-circles',2)}
  ]
 },
 'circle-line-position':{
  title:'同じ円で、距離を比べる',goal:'中心からの距離が変わると、交点がどう変わるかを見ます。',check:m`半径 $r>0$、垂線の長さ $d\ge0$ を比べます。`,
  steps:[
   {label:'半径より短い',text:m`中心 $(0,1)$、半径 $3$ の円です。直線 $y=2$ までの距離は $1$。半径より短いので、二点で交わります。`,formulas:[m`d=1<3=r`],diagram:diagram('circle-line',0)},
   {label:'半径と等しい',text:m`直線 $y=4$ までの距離は $3$。垂足が円周上に重なり、接点一つだけになります。`,formulas:[m`d=r=3`],diagram:diagram('circle-line',1)},
   {label:'半径より長い',text:m`直線 $y=5$ までの距離は $4$。直線が円の外側を通るので、共有点はありません。`,formulas:[m`d=4>3=r`],diagram:diagram('circle-line',2)}
  ]
 }
};
