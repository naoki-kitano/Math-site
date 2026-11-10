import type {FormulaLesson,FormulaStep} from './formula-correspondence';
const m=String.raw;
const diagram=(kind:string,stage:number)=>({kind:'ma-geometry-'+kind,stage,animated:false});
const s=(label:string,text:string,formulas:string[]=[],kind?:string,stage=0):FormulaStep=>({label,text,formulas,...(kind?{diagram:diagram(kind,stage)}:{})});
const blue=(tex:string)=>m`{\color{#176c82}{${tex}}}`;
const gold=(tex:string)=>m`{\color{#936114}{${tex}}}`;
export const mathAGeometryCorrespondence:Record<string,FormulaLesson>={
 'ma-figure-angles':{title:'三つの角を内角の和へ',goal:'求める角を三角形の内角に対応させます。',check:'',steps:[
  s('三角形の内角をそろえる',m`三角形 $ABC$ で $\angle A=50^\circ$、$\angle B=60^\circ$。求めるのは残る角 $C$ です。`,[], 'angles',0),
  s('三つで平角になる',m`頂点 $C$ を通り $AB$ に平行な線を引くと、錯角で $A,B$ の角を移せます。三つの角が一直線に並びます。`,[], 'angles',1),
  s('分かっている角を引く','三つの内角の和から、分かっている二つを引きます。',[m`\angle C=180^\circ-(50^\circ+60^\circ)=70^\circ`]),
  s('条件から角を決める','対頂角は二直線が交われば等しくなります。同位角・錯角を等しいとするには、二直線が平行であることが必要です。')
 ]},
 'ma-congruence-similarity':{title:'頂点から辺の対応へ',goal:'相似な三角形の対応をそろえます。',check:'',steps:[
  s('同じ位置の頂点',m`$\triangle ABC\sim\triangle DEF$ の文字の順序が、頂点の対応を表します。`,[], 'correspondence',0),
  s('二つの頂点で一つの辺',m`$A\leftrightarrow D$、$B\leftrightarrow E$ なので、辺 $AB$ に対応するのは $DE$ です。`,[], 'correspondence',1),
  s('次の辺も同じ順序',m`$B\leftrightarrow E$、$C\leftrightarrow F$ から、辺 $BC$ に対応するのは $EF$ です。`,[], 'correspondence',2),
  s('同じ倍率を使う',m`$AB=4,DE=10,BC=6$ なら、二組とも同じ相似比です。`,[m`\frac{${blue('DE')}}{${blue('AB')}}=\frac{${gold('EF')}}{${gold('BC')}}`,m`\frac{10}{4}=\frac{EF}{6}\quad\Rightarrow\quad EF=15`]),
  s('合同をいうための条件','二辺が等しいだけでは、その間の角を変えられます。二辺とその間の角もそれぞれ等しければ、合同といえます。')
 ]},
 'ma-parallel-ratios':{title:'部分を合わせて全体へ',goal:'平行線から相似比を作ります。',check:m`$D,E$ は辺 $AB,AC$ の内部、$DE\parallel BC$ です。`,steps:[
  s('部分と全体',m`$AD=2,DB=3,AC=10$。まず、分かっている二つの部分から全体 $AB$ を作ります。`,[m`AB=AD+DB=2+3=5`], 'parallel',0),
  s('小さい三角形と大きい三角形',m`平行線の同位角と共通角から $\triangle ADE\sim\triangle ABC$。頂点 $A$ から測った部分と全体が対応します。`,[], 'parallel',1),
  s('同じ役割の比をそろえる',m`$AD:AB$ に対応するのは $AE:AC$。$AD:DB$ ではありません。`,[m`\frac{${blue('AD')}}{${gold('AB')}}=\frac{${blue('AE')}}{${gold('AC')}}`,m`\frac25=\frac{AE}{10}\quad\Rightarrow\quad AE=4`]),
  s('残りの部分',m`$EC=AC-AE=6$。部分どうしの比 $AE:EC=2:3$ と、部分・全体の比 $AE:AC=2:5$ を区別します。`)
 ]},
 'ma-area-ratios':{title:'共通の高さで面積を比べる',goal:'長さの比と面積比を区別します。',check:'',steps:[
  s('高さを一本で表す',m`$BD:DC=2:3$。三角形 $ABD,ADC$ は、同じ頂点 $A$ から直線 $BC$ までの高さ $h$ を使います。`,[], 'area',0),
  s('共通の量が消える','二つの面積で変わるのは底辺だけです。',[m`[ABD]:[ADC]`,m`=\left(\frac12 BDh\right):\left(\frac12 DCh\right)=2:3`], 'area',1),
  s('相似なら高さも変わる',m`一方、相似比が $2:3$ の三角形では、底辺と高さの両方が $2:3$ になります。`,[], 'area',2),
  s('二つの倍率を掛ける','面積は底辺と高さの積なので、相似比を二回掛けます。',[m`S_1:S_2=(2\times2):(3\times3)=4:9`])
 ]},
 'ma-triangle-sides-angles':{title:'辺と向かいの角',goal:'三角形の成立と角の大小を確かめます。',check:'辺の長さは正です。',steps:[
  s('等号では一直線',m`長さ $2,3,5$ では、短い二辺をつないでも一直線になるだけです。`,[m`2+3=5`], 'triangle',0),
  s('三角形になる範囲',m`正の三辺を長さ順にすると、短い二辺の和が最長辺より大きいことが必要十分です。`,[m`2+3>4`], 'triangle',1),
  s('角の向かいの辺',m`$AB=3,BC=5,CA=4$ の三角形では、最長辺 $BC$ の向かいにある頂点は $A$ です。`,[], 'triangle',2),
  s('大小を対応させる',m`三角形では長い辺の向かいの角ほど大きいため、最大の角は $\angle A$ です。`)
 ]},
 'ma-angle-bisector':{title:'内側は和、外側は差',goal:'二等分線の比を元の辺の長さに結び付けます。',check:m`$AB=6,AC=9,BC=10$。外角の場合は $AB\ne AC$ です。`,steps:[
  s('内側の二つの部分',m`内角の二等分線より $BD:DC=AB:AC=2:3$。$BD$ と $DC$ をつなぐと $BC$ になります。`,[], 'bisector',0),
  s('比の和に全体を当てる',m`比の合計 $5$ に長さ $10$ が対応するので、比の $1$ は長さ $2$ です。`,[m`BD=2\times2=4,\qquad DC=3\times2=6`]),
  s('外点から同じ方向に測る',m`外角の二等分線の交点 $E$ は $B$ 側です。$BE:CE=2:3$ ですが、長い $CE$ の一部分が $BE$ です。`,[], 'bisector',1),
  s('比の差に元の辺を当てる',m`残る $BC=10$ に対応するのは、比の差 $3-2=1$ です。`,[m`CE-BE=10`,m`BE=20,\qquad CE=30`])
 ]},
 'ma-centroid':{title:'中線全体は比の三つ分',goal:'重心の比と測る線分を対応させます。',check:m`$G$ は重心、$D$ は辺 $BC$ の中点です。`,steps:[
  s('頂点から中点へ',m`中線 $AD$ は重心 $G$ により、頂点側と中点側が $2:1$ に分かれます。`,[], 'centroid',0),
  s('部分から全体へ',m`$AG$ は二つ分、$GD$ は一つ分。中線全体 $AD$ は三つ分です。`,[], 'centroid',1),
  s('与えられた長さを置く',m`例えば $AD=9$ なら、三つ分が $9$。一つ分は $3$ です。`,[m`AG=\frac23\times9=6`,m`GD=\frac13\times9=3`]),
  s('中点側が分かる場合',m`$GD=t$ と分かっていれば、それが一つ分です。頂点側と全体を組み立てます。`,[m`AG=2t,\qquad AD=3t`])
 ]},
 'ma-incenter-circumcenter':{title:'何までの距離か',goal:'内心と外心の距離を見分けます。',check:'',steps:[
  s('内心から辺へ',m`内心 $I$ から三辺へ下ろした垂線の長さが等しくなります。辺までの距離は、斜めに測る長さではありません。`,[], 'centers',0),
  s('外心から頂点へ',m`外心 $O$ から三頂点へ引いた線分は、同じ外接円の半径です。`,[m`OA=OB=OC`], 'centers',1),
  s('直角三角形では',m`直角の頂点は斜辺を直径とする円周上にあります。外心は斜辺の中点、半径は斜辺の半分です。`,[], 'centers',2)
 ]},
 'ma-ceva':{title:'三辺を同じ向きに巡る',goal:'辺の各部分を三つの比に対応させます。',check:m`$D,E,F$ は三辺の内部、$AD,BE,CF$ は一点で交わります。`,steps:[
  s('一辺目の比',m`$B\to C$ をたどり、途中の $D$ で前半 $BD$ と後半 $DC$ に分けます。`,[m`\frac{BD}{DC}=\frac23`], 'ceva',0),
  s('次も同じ向きに',m`続けて $C\to A$、$A\to B$ と巡ります。前半を分子、後半を分母にそろえます。`,[m`\frac{BD}{DC}\cdot\frac{CE}{EA}\cdot\frac{AF}{FB}=1`], 'ceva',1),
  s('求める比を一つ残す',m`$CE:EA=3:4$ と分かれば、残る一つの比を求められます。`,[m`\frac23\cdot\frac34\cdot\frac{AF}{FB}=1`,m`\frac{AF}{FB}=2\quad\Rightarrow\quad AF:FB=2:1`])
 ]},
 'ma-menelaus':{title:'外点でも辺を巡る',goal:'外点を含む三つの比をそろえます。',check:m`$D,E$ は辺 $BC,CA$ の内部、$F$ は $AB$ の $B$ 側延長上。$D,E,F$ は一直線です。`,steps:[
  s('二つの内点',m`$B\to C$、$C\to A$ の順に読み、$BD:DC=1:2$、$CE:EA=1:3$ を使います。`,[], 'menelaus',0),
  s('外点で測る二つの長さ',m`$AF$ は $AB$ と $BF$ を合わせた全体です。$AF$ と $FB$ は重なりを持つ線分なので、和ではなく差が $AB$ になります。`,[m`AF=AB+BF`], 'menelaus',1),
  s('同じ順序の積を使う',m`メネラウスの定理の比に、そのまま対応させます。`,[m`\frac12\cdot\frac13\cdot\frac{AF}{FB}=1`,m`AF:FB=6:1`]),
  s('配置と比を確かめる',m`$F$ は $B$ 側の外点なので $AF>FB$。求めた比もこの条件を満たします。`)
 ]},
 'ma-geometry-converses':{title:'比から図形の関係へ',goal:'定理とその逆を区別します。',check:'点の配置を確かめてから、それぞれの逆を使います。',steps:[
  s('分かっていること',m`$BD:DC=1:2,CE:EA=1:3,AF:FB=6:1$ のとき、まず三つの比の積を計算します。`,[m`\frac12\cdot\frac13\cdot6=1`]),
  s('三辺の内部なら',m`$D,E,F$ が各辺の内部なら、チェバの定理の逆から $AD,BE,CF$ は一点で交わります。`,[], 'converse',0),
  s('内点二つと外点一つなら',m`$D,E$ が辺の内部、$F$ が $AB$ の $B$ 側延長上なら、メネラウスの定理の逆から三点は一直線上にあります。`,[], 'converse',1),
  s('積が一でなければ','もし求める関係が成り立つなら、順方向の定理で積は一になるはずです。一でない場合は、その必要条件に反します。')
 ]},
 'ma-inscribed-angle':{title:'同じ弧を見る二つの角',goal:'中心角と円周角が見込む弧をそろえます。',check:'円周角が見込むのは、その頂点を含まない方の弧です。',steps:[
  s('角の両端をたどる',m`円周角 $ACB$ の二辺が円に届く点は $A,B$。頂点 $C$ を含まない弧 $AB$ を選びます。`,[], 'arc',0),
  s('中心から同じ両端へ',m`中心 $O$ からも同じ $A,B$ を結びます。この弧に対する中心角が $50^\circ$ なら、円周角はその半分です。`,[m`\angle ACB=\frac{50^\circ}{2}=25^\circ`], 'arc',1),
  s('頂点が反対側なら',m`反対側の円周角は、残りの弧を見込みます。二つの弧で一周なので、円周角の和は $180^\circ$ です。`,[m`\angle ADB=180^\circ-25^\circ=155^\circ`], 'arc',2)
 ]},
 'ma-cyclic-quadrilateral':{title:'対角が見込む弧',goal:'対角の和が平角になる理由を確かめます。',check:'四角形は凸で、四頂点は異なります。',steps:[
  s('一方の対角から弧を見る',m`$\angle A$ が見込むのは、$A$ を含まない弧 $BCD$ です。`,[], 'cyclic',0),
  s('向かいの角から残りを見る',m`$\angle C$ が見込む弧 $BAD$ と合わせると、一周になります。`,[], 'cyclic',1),
  s('一周の半分',m`円周角は、それぞれの弧に対する中心角の半分です。`,[m`\angle A+\angle C=\frac{360^\circ}{2}=180^\circ`]),
  s('逆を使う場合',m`凸四角形の対角の和が $180^\circ$ と分かれば、逆に四点は同じ円周上にあります。隣り合う角の和では判定できません。`)
 ]},
 'ma-circle-tangent':{title:'半径から直角を作る',goal:'接線の長さを三平方の定理に対応させます。',check:'',steps:[
  s('接点と中心を結ぶ',m`円外の点 $P$ からの接点を $T$ とします。半径 $OT$ を引くと、接線 $PT$ と直角になります。`,[], 'tangent',0),
  s('斜辺を確かめる',m`$OP=5,OT=3$。直角の向かいにある $OP$ が斜辺で、求める $PT$ は残る一辺です。`,[], 'tangent',1),
  s('対応する辺を式に置く',m`三平方の定理より $PT^2+OT^2=OP^2$。長さなので正の平方根を取ります。`,[m`PT^2=5^2-3^2=16`,m`PT=4`]),
  s('もう一本の接線',m`同じ外点からの接点を $U$ とすると、二つの直角三角形は共通の斜辺と同じ半径で合同です。したがって $PT=PU$。`,[], 'tangent',2)
 ]},
 'ma-tangent-chord':{title:'接線の向きと円周角',goal:'接弦角に対応する円周角を選びます。',check:m`$A,B,C$ は円上の異なる点です。`,steps:[
  s('弦を先に選ぶ',m`円周角 $ACB$ の両端は $A,B$。対応させる接線との角も、この弦 $AB$ を一辺にします。`,[], 'tangent-chord',0),
  s('接線の半直線を選ぶ',m`直線 $AB$ に対して $C$ と反対側の半直線 $AT$ を選ぶと、接弦定理で $\angle TAB=\angle ACB$ です。`,[], 'tangent-chord',1),
  s('反対向きの半直線',m`$AT$ と反対向きを $AS$ とすると、二つの接弦角の和は $180^\circ$ です。`,[m`\angle TAB=50^\circ\quad\Rightarrow\quad\angle SAB=130^\circ`], 'tangent-chord',2)
 ]},
 'ma-power-of-point':{title:'同じ起点から測る積',goal:'割線の全長を作ってから方べきに対応させます。',check:'円内では交点、円外では外点を起点にして測ります。',steps:[
  s('円内の交点から両端へ',m`二つの弦 $AB,CD$ が円内の点 $P$ で交わります。各弦の両端までを、どちらも $P$ から測ります。`,[], 'power',3),
  s('相似の比を積に直す',m`対頂角と同じ弧の円周角から $\triangle APC\sim\triangle DPB$。辺の対応から、二つの積が等しいと分かります。`,[m`\frac{PA}{PD}=\frac{PC}{PB}`,m`PA\cdot PB=PC\cdot PD`]),
  s('二つの部分から全長へ',m`円外の点 $P$ から $A,B$ の順に円と交わり、$PA=3,AB=5$。方べきに使うのは、弦 $AB$ ではなく、起点 $P$ から遠い交点 $B$ までです。`,[m`PB=PA+AB=3+5=8`], 'power',0),
  s('同じ起点の二組を対応',m`別の割線も同じ起点 $P$ から測ります。近い交点までと遠い交点までの積を比べます。`,[m`${blue('PA')}\cdot${gold('PB')}=${blue('PC')}\cdot${gold('PD')}`], 'power',1),
  s('残る長さを求める',m`$PC=2$ なら、$PA\cdot PB=3\times8$ をもう一方の積へ入れます。`,[m`3\times8=2\times PD\quad\Rightarrow\quad PD=12`]),
  s('接線の場合',m`一方が接線 $PT$ なら、その長さを二回掛けた $PT^2$ が対応します。接弦定理を使う相似が根拠です。`,[m`PT^2=3\times8=24`,m`PT=2\sqrt6`], 'power',2)
 ]},
 'ma-two-circles':{title:'半径の和と差',goal:'中心間距離を二つの境界と比べます。',check:'半径は正です。中心と半径がともに同じ場合は、同じ円です。',steps:[
  s('外側で触れるとき',m`半径 $5,2$ の円が外接すると、接点を挟んだ二つの半径で中心間をつなぎます。`,[m`d=5+2=7`], 'circles',0),
  s('内側で触れるとき',m`内接では、大きい半径から小さい半径を除いた長さが中心間距離です。`,[m`d=5-2=3`], 'circles',1),
  s('二つの境界の間',m`中心間距離が差より大きく、和より小さいと二点で交わります。境界より外なら交わりません。`,[m`3<d<7`], 'circles',2),
  s('一致は別に確かめる',m`例えば $r=s=3,d=0$ は同じ円です。共有点は接点一つではなく、円周上のすべての点です。`,[], 'circles',3)
 ]},
 'ma-common-tangents':{title:'半径から直角三角形へ',goal:'共通接線で現れる半径の差・和を対応させます。',check:'中心間距離は、外共通接線では半径差より、内共通接線では半径和より大きいものとします。',steps:[
  s('二本とも接線に垂直',m`外共通接線の接点を $T,U$ とします。$OT=4,PU=1,OP=5$。二本の半径は平行で、中心は接線の同じ側です。`,[], 'common',0),
  s('同じ長さを差し引く',m`$OT$ 上に $TH=PU=1$ となる $H$ を取ると、$HTUP$ は長方形です。$OH=4-1=3$、$HP=TU$ になります。`,[], 'common',1),
  s('斜辺と一辺に対応させる',m`直角三角形 $OHP$ の斜辺は $OP=5$。接点間の長さ $TU$ は $HP$ に対応します。`,[m`TU=HP=\sqrt{5^2-3^2}=4`], 'common',2),
  s('中心が反対側なら和',m`内共通接線で $OT=2,PU=1$ とします。半径が反対向きなので、$OT$ の延長に $TH=PU$ となる $H$ を取ります。$OH=2+1=3$、$HP=TU$ です。`,[], 'common',3),
  s('一般の長さ',m`半径を $r,s$、中心間距離を $d$ とすると、同じ三平方の定理に対応させられます。`,[m`\text{外：}\sqrt{d^2-(r-s)^2}`,m`\text{内：}\sqrt{d^2-(r+s)^2}`])
 ]}
};
