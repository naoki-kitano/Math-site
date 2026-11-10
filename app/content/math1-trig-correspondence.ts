import type {FormulaLesson,FormulaStep} from './formula-correspondence';
const m=String.raw;
const d=(kind:string,stage:number)=>({kind:`m1-trig-${kind}`,stage,animated:false});
const s=(label:string,text:string,formulas:string[],kind:string,stage:number):FormulaStep=>({label,text,formulas,diagram:d(kind,stage)});
export const math1TrigCorrespondence:Record<string,FormulaLesson>={
 'm1-right-triangle':{title:'角から辺の役割を決める',goal:'直角三角形の三つの辺を区別します。',check:m`$\angle C=90^\circ$。着目する角は鋭角です。`,steps:[
 s('斜辺を決める',m`三角形 $ABC$ の直角は $C$。直角の向かいの $AB$ が斜辺です。`,[], 'roles',0),
 s('角 A に着目する',m`$A$ を端に持たない $BC$ が向かい。$A$ に接する二辺のうち、斜辺でない $AC$ が隣です。`,[], 'roles',1),
 s('角 B に着目する',m`今度は $B$ を基準にします。向かいと隣が入れ替わっても、直角の向かいの斜辺は同じです。`,[], 'roles',2),
 s('斜辺の二乗を置く',m`$AB=5,BC=3$ のとき、残る辺 $AC$ を求めます。斜辺の二乗から、分かる辺の二乗を引きます。`,[m`AC^2=5^2-3^2=16`,m`AC=4`], 'roles',3),
 ]},
 'm1-trig-meaning':{title:'辺の役割を比にする',goal:'三角比を辺の比として読みます。',check:m`$\angle C=90^\circ$、$A$ は鋭角です。三角比は長さの比なので単位は付きません。`,steps:[
 s('向かいと斜辺',m`$BC=3,AC=4,AB=5$ の三角形で $A$ に着目します。正弦は向かいを斜辺で割った比です。`,[m`\sin A=\frac{\color{#176c82}{BC}}{\color{#936114}{AB}}=\frac35`], 'ratios',0),
 s('隣と斜辺',m`余弦は、斜辺でない隣の辺を斜辺で割った比です。`,[m`\cos A=\frac{\color{#176c82}{AC}}{\color{#936114}{AB}}=\frac45`], 'ratios',1),
 s('向かいと隣',m`正接は、向かいの辺を斜辺でない隣の辺で割った比です。`,[m`\tan A=\frac{\color{#176c82}{BC}}{\color{#936114}{AC}}=\frac34`], 'ratios',2),
 s('同じ倍率なら同じ比',m`三辺をすべて $2$ 倍すると角は同じ。分子と分母の倍率が約分されます。`,[m`\frac{2\cdot3}{2\cdot5}=\frac35`], 'similarity',0),
 ]},
 'm1-special-angles':{title:'正三角形から比を作る',goal:'30度と60度の三角比を作ります。',check:'角は度数法です。',steps:[
 s('正三角形を半分にする',m`一辺 $2$ の正三角形 $ABC$ で、$A$ から $BC$ の中点 $H$ に線を引きます。二つの三角形は合同なので、$AH\perp BC$、$\angle BAH=30^\circ$ です。`,[m`BH=1`], 'special',0),
 s('残る辺を求める',m`直角三角形 $ABH$ の斜辺は $AB=2$。三平方の定理から高さが決まります。`,[m`AH^2=2^2-1^2=3`,m`AH=\sqrt3`], 'special',1),
 s('30 度から二辺を選ぶ',m`直角三角形 $ABH$ で $\angle BAH=30^\circ$。この角の向かいは $BH$、隣は $AH$ です。`,[m`\sin30^\circ=\frac12`,m`\cos30^\circ=\frac{\sqrt3}{2}`,m`\tan30^\circ=\frac1{\sqrt3}`], 'special',2),
 s('60 度から見直す',m`今度は $\angle ABH=60^\circ$ に着目すると、向かいと隣が入れ替わります。斜辺は $AB=2$ のままです。`,[m`\sin60^\circ=\frac{\sqrt3}{2}`,m`\cos60^\circ=\frac12`,m`\tan60^\circ=\sqrt3`], 'special',3),
 ]},
 'm1-trig-sides-angles':{title:'未知の辺を比の中に置く',goal:'正弦の定義から未知の斜辺を求めます。',check:m`直角三角形の長さ $x$ は正です。`,steps:[
 s('使う二辺を決める',m`$\angle C=90^\circ,\angle A=30^\circ,BC=4$。斜辺 $AB=x$ を求めます。分かる辺は $A$ の向かいなので正弦を使います。`,[m`\sin A=\frac{\text{向かい}}{\text{斜辺}}`], 'unknown',0),
 s('同じ役割の場所に置く',m`向かいの $4$ が分子、未知の斜辺 $x$ が分母に入ります。`,[m`\sin30^\circ=\frac{\color{#176c82}{4}}{\color{#936114}{x}}`], 'unknown',1),
 s('長さを求める',m`$\sin30^\circ=\frac12$。両辺に $2x$ を掛けると、分母がなくなります。`,[m`\frac12=\frac4x`,m`x=8`], 'unknown',2),
 ]},
 'm1-trig-coordinates':{title:'座標を三角比に対応させる',goal:'鈍角の三角比を座標から読みます。',check:m`$0^\circ\le\theta\le180^\circ$、$r>0$。正接は $x\ne0$ のときに定義されます。`,steps:[
 s('長さと座標を区別する',m`原点から点 $P(-3,4)$ への距離は $r=5$。正の横軸から反時計回りに $OP$ まで測った角を $\theta$ とします。横座標 $x=-3$ は負でも、距離 $r$ は正です。`,[], 'coordinates',0),
 s('縦座標を使う',m`正弦は縦座標を半径で割った比です。`,[m`\sin\theta=\frac{\color{#176c82}{y}}{\color{#936114}{r}}=\frac45`], 'coordinates',1),
 s('横座標を使う',m`余弦は横座標を半径で割った比。点が縦軸の左にあるので負です。`,[m`\cos\theta=\frac{\color{#176c82}{x}}{\color{#936114}{r}}=-\frac35`], 'coordinates',2),
 s('縦と横を比べる',m`正接では横座標で割ります。$x=-3\ne0$ なので、この値を使えます。`,[m`\tan\theta=\frac{\color{#176c82}{y}}{\color{#936114}{x}}=-\frac43`], 'coordinates',3),
 ]},
 'm1-trig-relations':{title:'円の関係から二つの比へ',goal:'相互関係の根拠と符号を確かめます。',check:m`$0^\circ\le\theta\le180^\circ$、$r>0$。`,steps:[
 s('座標の二乗を結ぶ',m`半径 $r$ の上半円上に $P(x,y)$ を取ります。正の横軸から反時計回りに $OP$ まで測った角を $\theta$ とすると、三平方の定理で座標と半径が結ばれます。`,[m`x^2+y^2=r^2`], 'identity',0),
 s('同じ半径で割る',m`両辺を $r^2$ で割ります。横座標と縦座標の比が、それぞれ余弦と正弦です。`,[m`\left(\frac{\color{#176c82}{x}}r\right)^2+\left(\frac{\color{#936114}{y}}r\right)^2=1`,m`\cos^2\theta+\sin^2\theta=1`], 'identity',1),
 s('二乗から大きさを求める',m`ここからは $\sin\theta=\frac35$、$90^\circ<\theta<180^\circ$ とします。二乗の式では、余弦の符号はまだ決まりません。`,[m`\cos^2\theta=1-\frac9{25}=\frac{16}{25}`,m`\cos\theta=\pm\frac45`], 'identity',2),
 s('角の範囲で符号を決める',m`鈍角の点は縦軸の左側なので $x<0$。余弦も負です。`,[m`\cos\theta=-\frac45`], 'identity',3),
 ]},
 'm1-equal-sines':{title:'同じ比を持つ点を探す',goal:'角の候補を上半円上で探します。',check:m`$0^\circ\le\theta\le180^\circ$。単位円では $P=(\cos\theta,\sin\theta)$ です。`,steps:[
 s('正弦を高さに直す',m`$\sin\theta=\frac12$ を解きます。上半円と、高さ $y=\frac12$ の直線との交点を探します。`,[], 'equal',0),
 s('同じ高さの二点',m`右の点の角が $30^\circ$。左の点は縦軸に関して対称なので $180^\circ-30^\circ$ です。`,[m`\theta=30^\circ,150^\circ`], 'equal',1),
 s('余弦なら横座標',m`今度は $\cos\theta=-\frac12$。縦の直線 $x=-\frac12$ と上半円との交点は一つです。`,[m`\theta=120^\circ`], 'equal',2),
 s('端の高さも確かめる',m`$y=1$ では上端の一点。$y=0$ では左右の端点が対応します。`,[m`\sin\theta=1\ \Rightarrow\ \theta=90^\circ`,m`\sin\theta=0\ \Rightarrow\ \theta=0^\circ,180^\circ`], 'equal',3),
 ]},
 'm1-sine-law':{title:'同じ高さを二つの角で表す',goal:'正弦定理を高さから導きます。',check:m`三角形 $ABC$ で $a=BC,b=CA,c=AB$。内角は $0^\circ<A,B,C<180^\circ$。図は鋭角の場合です。`,steps:[
 s('高さを共通にする',m`$C$ から $AB$ に垂線 $CH=h$ を下ろします。同じ高さ $h$ が二つの直角三角形に含まれます。`,[], 'sine',0),
 s('左の三角形から',m`$\triangle ACH$ の斜辺は $b$、$A$ の向かいは $h$ です。`,[m`\sin A=\frac{\color{#176c82}{h}}b`,m`\color{#176c82}{h}=b\sin A`], 'sine',1),
 s('右の三角形から',m`$\triangle BCH$ でも高さは同じ $h$。斜辺は $a$ です。`,[m`\sin B=\frac{\color{#176c82}{h}}a`,m`\color{#176c82}{h}=a\sin B`], 'sine',2),
 s('共通の高さを結ぶ',m`二つの式は同じ高さを表すので等しくなります。正の $\sin A\sin B$ で割ると、辺とその対角が組になります。`,[m`b\sin A=a\sin B`,m`\frac a{\sin A}=\frac b{\sin B}`], 'sine',3),
 s('どの内角にも使う',m`同様にもう一辺も結べます。高さの足が延長上に出る鈍角の場合も、$\sin(180^\circ-A)=\sin A$ により同じ式になります。`,[m`\frac a{\sin A}=\frac b{\sin B}`,m`\frac b{\sin B}=\frac c{\sin C}`], 'sine',4),
 ]},
 'm1-sine-circumcircle':{title:'共通の弦から直径へ',goal:'正弦定理の共通比を円の直径と結び付けます。',check:m`$R>0$ は三角形 $ABC$ の外接円の半径、$a=BC$ です。`,steps:[
 s('同じ弦を見る',m`外接円上の三角形 $ABC$ で $\angle BAC=A$。辺 $BC=a$ は円の弦です。`,[], 'circle',0),
 s('直径を引く',m`$B$ の正反対の点を $D$ とすると、$BD=2R$。直径に対する円周角なので $\angle BCD=90^\circ$ です。`,[], 'circle',1),
 s('同じ弦の角を結ぶ',m`図の $A,D$ は弦 $BC$ の同じ側にあるので、$\angle BDC=A$。直角三角形 $BCD$ で正弦を読むと、分母は直径です。`,[m`\sin A=\frac{\color{#176c82}{a}}{\color{#936114}{2R}}`,m`\frac a{\sin A}=2R`], 'circle',2),
 s('半径と直径を区別する',m`$a=6,A=30^\circ$ のとき、共通比は直径 $2R$ です。$A$ が鈍角なら二つの円周角は補角ですが、正弦は等しくなります。$A=90^\circ$ なら $BC$ 自体が直径です。`,[m`2R=\frac6{\sin30^\circ}=12`,m`R=6`], 'circle',3),
 ]},
 'm1-cosine-law-side':{title:'射影から第三の辺へ',goal:'余弦定理を直角三角形から導きます。',check:m`$a=BC,b=CA,c=AB$、$0^\circ<A<180^\circ$。$a,b,c>0$。`,steps:[
 s('底辺への射影を取る',m`$A$ を原点、$AB$ を横軸に置きます。$AC=b$ を横と縦に分けると、$C$ の座標が決まります。`,[m`C=(b\cos A,b\sin A)`,m`B=(c,0)`], 'cosine',0),
 s('横と縦の差を使う',m`$BC=a$ の二乗は、横の差と縦の差の二乗の和です。`,[m`\begin{aligned}a^2&=(c-b\cos A)^2\\&\quad+(b\sin A)^2\end{aligned}`], 'cosine',1),
 s('同じ辺の成分をまとめる',m`展開すると、$b^2$ に掛かる二つの二乗の和は $1$ です。`,[m`b^2(\cos^2 A+\sin^2 A)=b^2`,m`a^2=b^2+c^2-2bc\cos A`], 'cosine',2),
 s('鈍角の射影を読む',m`鈍角では $b\cos A<0$ となり、$C$ は $A$ の左にあります。横の差 $c-b\cos A$ が長くなることも同じ式で表せます。`,[m`a^2=b^2+c^2-2bc\cos A`], 'cosine',3),
 ]},
 'm1-cosine-law-angle':{title:'向かいの辺とはさむ二辺',goal:'三辺から角の余弦を求めます。',check:m`三角形の三辺は正で、三角不等式を満たします。内角 $0^\circ<A<180^\circ$。`,steps:[
 s('角と三辺を対応させる',m`$a=BC=4,b=CA=3,c=AB=3$ のとき $A$ を調べます。$A$ の向かいが $a$、$A$ をはさむ二辺が $b,c$ です。`,[m`a^2=b^2+c^2-2bc\cos A`], 'cosangle',0),
 s('余弦を取り出す',m`向かいの辺の二乗を引き、はさむ二辺の積の $2$ 倍で割ります。`,[m`\cos A=\frac{b^2+c^2-a^2}{2bc}`,m`\cos A=\frac{9+9-16}{18}=\frac19`], 'cosangle',1),
 s('符号から角を判断する',m`内角の範囲では、余弦が正なら鋭角、$0$ なら直角、負なら鈍角です。この $A$ は鋭角です。`,[m`0^\circ<A<90^\circ`], 'cosangle',2),
 ]},
 'm1-triangle-choice':{title:'二辺と対角では候補を残す',goal:'正弦定理で現れる二つの角を調べます。',check:m`$a=BC,b=CA$。三角形の各内角は正で、和は $180^\circ$ です。`,steps:[
 s('分かる組を使う',m`$A=30^\circ,a=1,b=\sqrt2$ の三角形を調べます。辺 $a$ とその対角 $A$ が分かるので、正弦定理を使えます。`,[m`\frac{\sin B}{\sqrt2}=\frac{\sin30^\circ}1`], 'ssa',0),
 s('二つの角を候補にする',m`正弦が同じ内角は補角の組になることがあります。図でも、長さ $BC=1$ を満たす点が半直線上に二つあります。`,[m`\sin B=\frac{\sqrt2}{2}`,m`B=45^\circ\ \text{または}\ 135^\circ`], 'ssa',1),
 s('残る内角を確かめる',m`どちらも $C=180^\circ-A-B>0$。この条件では二つの三角形が成立します。`,[m`B=45^\circ\ \Rightarrow\ C=105^\circ`,m`B=135^\circ\ \Rightarrow\ C=15^\circ`], 'ssa',2),
 ]},
 'm1-triangle-area':{title:'辺から高さを作って面積へ',goal:'二辺とその間の角から面積を求めます。',check:m`三角形 $ABC$ で $AB=c,AC=b$、$0^\circ<A<180^\circ$。`,steps:[
 s('底辺と高さを取る',m`$C$ から直線 $AB$ への垂線を $CH=h$ とします。面積 $S$ は、底辺 $c$ と高さ $h$ の積の半分です。`,[m`S=\frac12c\,\color{#176c82}{h}`], 'area',0),
 s('同じ高さを辺と角で表す',m`$\triangle ACH$ の正弦の定義から、高さは辺 $b$ の縦の成分です。`,[m`\color{#176c82}{h}=b\sin A`], 'area',1),
 s('高さの位置に入れる',m`底辺 $c$ はそのまま、同じ高さ $h$ を $b\sin A$ に置き換えます。`,[m`S=\frac12c(\color{#176c82}{b\sin A})`,m`S=\frac12bc\sin A`], 'area',2),
 s('鈍角では延長上の高さ',m`$A$ が鈍角なら $H$ は辺の延長上。$\sin(180^\circ-A)=\sin A$ なので、高さも面積も同じ式で表せます。`,[m`h=b\sin A`], 'area',3),
 ]},
 'm1-space-triangles':{title:'共通の辺で二つの平面をつなぐ',goal:'直方体の対角線を二つの直角三角形から求めます。',check:m`直方体 $ABCD$–$EFGH$ で $E,F,G,H$ は順に $A,B,C,D$ の真上。見取図の角度・縮尺は実際と異なります。`,steps:[
 s('底面から調べる',m`$AB=3,BC=4,CG=12$ の直方体で対角線 $AG$ を求めます。まず底面の直角三角形 $ABC$ に着目します。`,[], 'space',0),
 s('底面の対角線を求める',m`底面が長方形なので $\angle ABC=90^\circ$。この三角形の斜辺が $AC$ です。`,[m`AC^2=3^2+4^2=25`,m`\color{#176c82}{AC}=5`], 'space',1),
 s('同じ辺を断面へ持ち込む',m`$CG$ は底面に垂直なので、底面上の $AC$ とも垂直です。今求めた $AC$ を三角形 $ACG$ の一辺として使います。`,[m`AG^2=\color{#176c82}{5}^2+12^2=169`,m`AG=13`], 'space',2),
 s('底面との角を読む',m`$AG$ の底面への正射影は $AC$。したがって底面となす角は $\angle GAC=\theta$ です。`,[m`\tan\theta=\frac{CG}{AC}=\frac{12}{5}`], 'space',3),
 ]},
};
