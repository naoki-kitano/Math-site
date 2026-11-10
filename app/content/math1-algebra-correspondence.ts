import type {FormulaLesson,FormulaStep} from './formula-correspondence';
const m=String.raw;
const step=(kind:string,stage:number,label:string,text:string,formulas:string[]=[]):FormulaStep=>({label,text,formulas,diagram:{kind:`m1-algebra-${kind}`,stage,animated:false}});
export const math1AlgebraCorrespondence:Record<string,FormulaLesson>={
 'm1-real-numbers':{title:'循環する部分をそろえる',goal:'循環小数を分数に表す。',check:'小数は途中で切らず、示した並びがずっと繰り返します。',steps:[
  step('repeat',0,'繰り返しを見る',m`$0.272727\ldots$ を分数で表します。この数を $a$ とおきます。`),
  step('repeat',1,'小数部をそろえる',m`二桁の繰り返しなので、$100$ 倍すると小数部が同じになります。`),
  step('repeat',2,'同じ部分を引く',m`上の式から下の式を引くと、小数部の差は $0$ です。`),
  step('repeat',3,'分数にする',m`$99a=27$ の両辺を $99$ で割ります。整数の比になりました。`),
 ]},
 'm1-substitution':{title:'二乗するまとまり',goal:'負の数を代入して計算する。',check:'',steps:[
  step('scope',0,'二乗の範囲を見る',m`$x=-3$ のとき、$2x^2-x$ の値を求めます。二乗するのは $x$ だけです。`),
  step('scope',1,'括弧を保って代入する',m`二か所の $x$ を $(-3)$ に置き換えます。係数 $2$ は二乗の外です。`),
  step('scope',2,'二乗から計算する',m`$(-3)^2=9$。後ろの項では、負の数を引くので $3$ を足します。`),
 ]},
 'm1-terms-degree':{title:'係数として見る部分',goal:'着目する文字によって係数を読む。',check:m`他の文字に値を代入せず、式として読みます。`,steps:[
  step('coefficient',0,'全ての文字を見る',m`$-2x^3y^2$ の係数と次数を考えます。全ての文字を見ると、数の部分が係数です。`),
  step('coefficient',1,'一つの文字を見る',m`$x$ について見ると、$y$ を含む部分も係数に入ります。`),
 ]},
 'm1-like-terms':{title:'符号を含めて項をそろえる',goal:'同類項と括弧を整理する。',check:'',steps:[
  step('collect',0,'同じ文字部分をそろえる',m`$3x^2-2x+5x-x^2$ を整理します。前の符号を項と一緒に保ちます。`),
  step('collect',1,'係数をまとめる',m`分配法則を逆に使い、同じ文字部分に掛かる係数をまとめます。`),
  step('collect',2,'括弧全体を引く',m`次は $(4x+1)-(x-3)$。括弧を引くことは、各項に $-1$ を掛けることです。`),
  step('collect',3,'符号を保って整理する',m`$-1\cdot(-3)=3$ なので、定数の項は $1+3$ です。`),
 ]},
 'm1-distributive-expansion':{title:'括弧の全ての組を掛ける',goal:'展開を項どうしの積へ対応させる。',check:'',steps:[
  step('distribute',0,'掛ける組をそろえる',m`$(2x-1)(x+3)$ を展開します。行と列の項を一つずつ掛けます。`),
  step('distribute',1,'同類項をまとめる',m`四つの積のうち、$6x$ と $-x$ は文字部分が同じです。`),
  step('distribute',2,'三項にも分配する',m`$(x+1)(x^2-x+2)$ では六つの積ができます。全ての組を掛けます。`),
  step('distribute',3,'逆符号の項を消す',m`$-x^2+x^2=0$。一次の項は $2x-x=x$ です。`),
 ]},
 'm1-product-identities':{title:'公式のまとまりと交差する積',goal:'乗法公式の対応と根拠を読む。',check:'',steps:[
  step('square',0,'まとまりを対応させる',m`$(2x-3)^2$ を展開します。公式の $a$ は $2x$、$b$ は $3$ です。`),
  step('square',1,'中間項を作る',m`二つの交差する積がどちらも $-6x$ なので、中間項は $-12x$ です。`),
  step('square',2,'和と差の積を見る',m`$(3x+2)(3x-2)$ では、交差する積の符号が逆になります。`),
  step('square',3,'相殺して残す',m`$-6x+6x=0$。同じまとまりの和と差だから、この二項が消えます。`),
  step('square',4,'同じまとまりか確かめる',m`$(2x+1)(3x-1)$ では、最初の項が $2x$ と $3x$ で異なります。交差する積は消えません。`),
 ]},
 'm1-common-factors':{title:'同じ因数と残る因数',goal:'分配法則を逆向きに使う。',check:m`因数分解は、どの $x$ でも成り立つ等式です。$x$ で割る操作ではありません。`,steps:[
  step('common',0,'各項を積にする',m`$6x^2+9x$ を因数分解します。両方に $3x$ が掛かっています。`),
  step('common',1,'残る因数をまとめる',m`共通の $3x$ を一つにまとめると、括弧の中には $2x$ と $3$ が残ります。`),
 ]},
 'm1-quadratic-factorization':{title:'一次の係数を作る二つの積',goal:'因数の候補を係数で確かめる。',check:'ここでは整数係数で因数分解します。',steps:[
  step('quadratic',0,'因数の候補を見る',m`$2x^2+7x+3$ を因数分解します。候補 $(2x+1)(x+3)$ を掛け戻します。`),
  step('quadratic',1,'一次の項をそろえる',m`交差する積は $6x$ と $x$。和が、元の一次の項 $7x$ になります。`),
  step('quadratic',2,'全ての係数を確かめる',m`二次の項と定数も一致するので、この積が因数分解です。`),
 ]},
 'm1-grouping':{title:'括弧全体を共通因数にする',goal:'元のまとまりを保って因数分解する。',check:'',steps:[
  step('grouping',0,'同じ括弧を見つける',m`$2x(x+1)+(x+1)$ を因数分解します。後ろの項にも $1$ が掛かっています。`),
  step('grouping',1,'係数を一つの括弧へ',m`$(x+1)$ 全体を共通因数にすると、残る係数は $2x$ と $1$ です。`),
  step('grouping',2,'二組から同じ括弧を作る',m`$xy+2x+3y+6$ では、前の二項と後ろの二項をそれぞれくくります。`),
  step('grouping',3,'共通の括弧をまとめる',m`両方に $y+2$ が掛かっているので、残る $x$ と $3$ をまとめます。`),
 ]},
 'm1-square-roots':{title:'平方根全体と根号の値',goal:'根号が表す非負の値を区別する。',check:m`根号が表す値は非負です。`,steps:[
  step('roots',0,'二乗して同じ数になる',m`$9$ の平方根は、二乗すると $9$ になる数です。正負の二つがあります。`),
  step('roots',1,'非負の方を選ぶ',m`根号 $\sqrt9$ が表すのは、そのうち非負の $3$ だけです。`),
  step('roots',2,'根号の中から計算する',m`$\sqrt{(-3)^2}$ も、二乗してから非負の平方根を選びます。`),
 ]},
 'm1-radical-calculation':{title:'平方因子と残る根号',goal:'根号を整理して同類項をまとめる。',check:m`$a,b\ge0$ なら $\sqrt{ab}=\sqrt a\sqrt b$。`,steps:[
  step('radicals',0,'平方数の積にする',m`$\sqrt{12}$ を整理します。$12=4\cdot3$ と分けます。`),
  step('radicals',1,'平方根を計算する',m`$\sqrt4=2$。$\sqrt3$ はそのまま残ります。`),
  step('radicals',2,'同じ根号をそろえる',m`$\sqrt{12}+\sqrt{27}$ も、まずそれぞれを整理します。`),
  step('radicals',3,'係数をまとめる',m`同じ $\sqrt3$ が掛かっているので、分配法則で係数を足せます。`),
 ]},
 'm1-rationalizing':{title:'値を保って分母の根号を消す',goal:'$0$ でない同じ因数を掛けて有理化する。',check:m`$2>\sqrt3>0$ より、元の分母 $2+\sqrt3$ と掛ける式 $2-\sqrt3$ はともに正です。`,steps:[
  step('rationalize',0,'一を掛ける',m`$\dfrac1{2+\sqrt3}$ を有理化します。分子と分母に同じ $2-\sqrt3$ を掛けます。`),
  step('rationalize',1,'分母の積を見る',m`分母は和と差の積です。交差する二項は逆符号になります。`),
  step('rationalize',2,'分母を整理する',m`交差する二項の和は $0$。分母は $4-3=1$ です。`),
 ]},
 'm1-absolute-distance':{title:'中心からの距離と解',goal:'絶対値を中心からの距離で読む。',check:m`実数 $x$ を考えます。距離は非負です。`,steps:[
  step('absolute',0,'中心を読む',m`$|x+2|<3$ の範囲を求めます。$x+2=x-(-2)$ なので、中心は $-2$ です。`),
  step('absolute',1,'左右の境界を求める',m`中心 $-2$ から距離 $3$ の境界は、$-5$ と $1$ です。`),
  step('absolute',2,'距離が小さい点を残す',m`距離が $3$ 未満の点は両端の内側です。ちょうど $3$ の両端は含みません。`),
 ]},
 'm1-simultaneous-inequalities':{title:'両方の条件を満たす範囲',goal:'各条件と共通部分を対応させる。',check:'',steps:[
  step('intersection',0,'それぞれの範囲を見る',m`$x>1$ と $x\le4$ を同時に満たす範囲を求めます。`),
  step('intersection',1,'重なる範囲を残す',m`$1$ は最初の条件を満たさず、$4$ は両方の条件を満たします。`),
  step('intersection',2,'境界だけが重なる場合',m`$x\ge2$ と $x\le2$ の共通部分は一点です。両方が $2$ を含みます。`),
  step('intersection',3,'境界を含まない場合',m`$x>2$ と $x\le2$ では、境界 $2$ が最初の条件を満たさず、解はありません。`),
 ]},
 'm1-inequality-modeling':{title:'数量と不等式の対応',goal:'数量を立式し整数の答えを選ぶ。',check:m`個数 $x$ は $1$ 以上の整数です。`,steps:[
  step('modeling',0,'数量を式にする',m`一個 $120$ 円、送料 $200$ 円の商品を、合計 $1000$ 円以下で買います。最大何個買えるでしょう。`),
  step('modeling',1,'予算の条件を解く',m`品物代と送料の合計が、予算以下になるようにします。`),
  step('modeling',2,'整数から選ぶ',m`$\dfrac{20}{3}$ 以下の整数で最も大きいものを選びます。`),
  step('modeling',3,'隣の個数と比べる',m`$6$ 個は予算内ですが、次の $7$ 個では予算を超えます。`),
 ]},
};
