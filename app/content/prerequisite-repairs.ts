import type {Lesson} from "./lessons";
const m=String.raw;
// Explicit repairs for the operation actually checked. No "first example" substitution.
export function refinePrerequisiteRepairs(lessons:Lesson[]){
 const get=(slug:string,id:string)=>lessons.find(l=>l.slug===slug)!.supplements.find(s=>s.id===id)!;
 const extend=(slug:string,id:string,title:string,prose:string,check?:string,answer?:string)=>{
  const source=get(slug,id),old=source.text;
  source.title=title;source.text=prose+"\n"+old;
  if(check)source.check=check;if(answer)source.answer=answer;
  for(const l of lessons)for(const s of l.supplements)if(s.id===slug+"-"+id&&s.text===old){
   s.text=source.text;s.check=source.check;s.answer=source.answer;
  }
 };
 const add=(slug:string,id:string,title:string,text:string,check:string,answer:string)=>{
  lessons.find(l=>l.slug===slug)!.supplements.push({id,title,text,tex:"",check,answer});
 };
 extend("jr-signed-product","multiply","正負の数の積",
  m`正の数 $a,b$ に対して、$(-a)\{b+(-b)\}=0$ を分配すると $-ab+(-a)(-b)=0$。したがって $(-a)(-b)=ab>0$ なので、負の数どうしの積は正です。例えば $(-2)(-4)=8$ です。`,
  m`$(-3)(-4)$ と $(-3)\cdot4$ を計算しなさい。`,m`順に $12,-12$。大きさはどちらも $3\cdot4=12$、同符号の積は正、異符号の積は負です。`);
 extend("jr-like-terms","distribute","符号も含めて括弧を外す",
  m`$-2(x-3)=(-2)x+(-2)(-3)=-2x+6$。括弧内のすべての項に掛けます。負の数どうしの積は正なので、定数の符号にも注意します。`);
 extend("jr-like-terms","collect","同類項をまとめる",
  m`$5x$ と $-2x$ は文字の部分が同じなので、$5x-2x=(5-2)x=3x$ とまとめます。$5x$ と定数 $-2$ は同類項ではありません。`);
 extend("jr-averages","median","中央値",
  m`個数が奇数なら、並べたときの中央の一つです。$2,9,4$ を $2,4,9$ と並べると、中央値は $4$。個数が偶数なら中央二つの平均です。`);
 extend("rational-sum","common","分数式の通分と引き算",
  m`$x\ne0,-1$ のとき、$\frac1x$ の分子と分母に $x+1$ を、$\frac1{x+1}$ の分子と分母に $x$ を掛けます。$\frac1x-\frac1{x+1}=\frac{x+1}{x(x+1)}-\frac{x}{x(x+1)}=\frac{(x+1)-x}{x(x+1)}=\frac1{x(x+1)}$。`,
  m`$\frac1{x-1}-\frac1{x+2}$ を通分しなさい。ただし $x\ne1,-2$。`,
  m`分母を $(x-1)(x+2)$ にそろえると、分子は $(x+2)-(x-1)=3$。答えは $\frac3{(x-1)(x+2)}$（$x\ne1,-2$）。`);
 extend("trig-double-half","double-angle","二倍角の式を変形する",
  m`$\cos2x=1-2\sin^2x$ の両辺を移項すると $2\sin^2x=1-\cos2x$。したがって $\sin^2x=\frac{1-\cos2x}{2}$。二乗を一つの三角関数の一次式に直せます。`,
  m`$\cos2x=2\cos^2x-1$ から $\cos^2x$ を表しなさい。`,
  m`両辺に $1$ を足して $2$ で割ると、$\cos^2x=\frac{1+\cos2x}{2}$。`);
 add("jr-ratio-percent","part-whole","全体に対する割合",
  m`一部分が全体の何倍かを求めるには、一部分を全体で割ります。全体 $20$ 個のうち赤が $5$ 個なら $\frac5{20}=\frac14$。赤以外の個数を分母にするのではありません。`,
  m`全体 $30$ 人のうち、徒歩で通う人が $12$ 人です。徒歩の人の割合は？`,
  m`全体の $30$ 人を基準にして、$\frac{12}{30}=\frac25$。百分率では $40\%$ です。`);
 add("jr-area-volume","rectangle","長方形の面積",
  m`長方形の面積は、隣り合う垂直な二辺の長さを掛けて求めます。横 $3$、縦 $2$ なら $3\cdot2=6$。グラフ上の長方形でも「区間の幅」と「高さ」を掛けます。`,
  m`横が $\frac12$、縦が $3$ の長方形の面積は？`,
  m`$\frac12\cdot3=\frac32$。三角形や錐と違い、さらに半分や三分の一にはしません。`);
 add("jr-square-roots","squared","根号と二乗",
  m`非負の数 $a$ に対して、$\sqrt a$ は二乗すると $a$ になる非負の数です。したがって $(\sqrt a)^2=a$。例えば $(\sqrt5)^2=5$ です。`,
  m`$(\sqrt7)^2$ と $\sqrt{7^2}$ をそれぞれ求めなさい。`,
  m`どちらも $7$。ただし、一般の実数 $x$ については $\sqrt{x^2}=|x|$ なので、負の $x$ でそのまま $x$ とはできません。`);
 add("m1-absolute-distance","two-points","数直線上の二点間の距離",
  m`二点の座標の差は、引く順序によって符号が変わります。距離にするときは絶対値を取り、$2$ と $-1$ の間なら $|2-(-1)|=3$。逆順でも $|-1-2|=3$ です。`,
  m`数直線上の二点 $-4,2$ の間の距離は？`,
  m`$|2-(-4)|=|6|=6$。途中でどのように動いたかによる道のりとは別です。`);
 add("cubic-expansion","binomial-cube","括弧全体の三乗を展開する",
  m`$(x+h)^3=(x+h)^2(x+h)=(x^2+2xh+h^2)(x+h)$。項ごとに掛けてまとめると $x^3+3x^2h+3xh^2+h^3$。$x^3$ と $h^3$ だけではありません。`,
  m`$(x+2)^3$ を展開しなさい。`,
  m`$h=2$ として $x^3+3x^2\cdot2+3x\cdot2^2+2^3=x^3+6x^2+12x+8$。`);
}
