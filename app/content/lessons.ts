import { chapterOneLessons, chapterOneExercises, chapterOneOrder } from "./chapter1";
import { chapterTwoLessons, chapterTwoExercises } from "./chapter2";
import { chapters } from "./chapters";
import chapterThreeData from "./chapter3.json";
import chapterFourData from "./chapter4.json";
import chapterFiveData from "./chapter5.json";
import chapterSixData from "./chapter6.json";
import chapterSevenData from "./chapter7.json";
import mathThreeChapterOneData from "./math3-chapter1.json";
export type Step = { title: string; text: string; tex?: string };
export type Example = { title: string; prompt: string; tex?: string; steps: Step[] };
export type Exercise = {
  id: string; lesson: string; stage: "ready" | "guided" | "practice" | "review";
  family: string; prompt: string; tex?: string; kind: "choice" | "number" | "paper";
  options?: string[]; correct?: number; answer: string; hints: string[]; steps: Step[];
  repair: string;
};
export type Lesson = {
  subject?: "数学II" | "数学III";
  guidedAfterExamples?: boolean;
  prerequisites?: {slug:string;label:string}[];
  slug: string; title: string; chapter: string; description: string; basicsTitle?: string;
  introduction: string[]; rule: string; ruleTex?: string; examples: Example[];
  supplements: { id: string; title: string; text: string; tex: string; check: string; answer: string }[];
};

export const lessons: Lesson[] = [
  {
    slug: "rational", title: "分数式を約分する", chapter: "式と証明",
    description: "共通の因数を見つけて、分数式を簡単にしよう。",
    introduction: [
      "数の分数では、分子と分母に共通する因数を取り除いて約分します。",
      "$\\dfrac{3\\cdot5}{3\\cdot2}=\\dfrac52$ では、分子と分母を同じ数 $3$ で割っています。",
      "文字を含む式でも同じです。まず、分子と分母を掛け算の形にして、共通の因数を探します。",
    ],
    rule: "約分できるのは、分子と分母に共通する因数です。元の分母がゼロになる値は、約分後も使えません。",
    examples: [
      {title:"掛け算の形から約分する", prompt:"次の式を簡単にしなさい。", tex:"\\frac{(x-2)(x+3)}{x-2}", steps:[
        {title:"分母を確かめる",text:"分母をゼロにする値は使えません。",tex:"x\\ne2"},
        {title:"共通の因数を探す",text:"分子は二つの因数の積です。分子と分母の両方に $x-2$ があります。",tex:"\\frac{(x-2)(x+3)}{x-2}=x+3"},
        {title:"条件を添える",text:"約分しても、元の式で使えなかった値は使えません。",tex:"x+3\\quad(x\\ne2)"},
      ]},
      {title:"因数分解してから約分する",prompt:"次の式を簡単にしなさい。",tex:"\\frac{x^2-3x-4}{x-4}",steps:[
        {title:"元の分母を見る",text:"分母がゼロにならない条件を先に残します。",tex:"x\\ne4"},
        {title:"分子を積の形にする",text:"積が $-4$、和が $-3$ になる二つの数は $-4$ と $1$ です。",tex:"x^2-3x-4=(x-4)(x+1)"},
        {title:"共通の因数で約分する",text:"分子と分母を $x-4$ で割ります。",tex:"\\frac{(x-4)(x+1)}{x-4}=x+1"},
        {title:"条件と計算を確かめる",text:"答えは $x+1$、ただし $x\\ne4$。$x=2$ を入れると、元の式も答えも $3$ になります。これは計算ミスの確認で、等しさの根拠は上の式変形です。"},
      ]},
    ],
    supplements:[
      {id:"factors",title:"項と因数を確かめる",text:"$x+3$ は和なので、$x$ と $3$ は項です。$(x-2)(x+3)$ は積なので、$x-2$ と $x+3$ が因数です。分子の一部分だけを消す約分はできません。",tex:"\\frac{x+3}{x}",check:"$\\dfrac{x+3}{x}$ の分子と分母の $x$ を消してよいですか。",answer:"消せません。分子全体が $x$ を因数にもつ形ではないからです。"},
      {id:"factorization",title:"因数分解を確かめる",text:"$x^2+px+q$ を $(x+a)(x+b)$ にするには、和が $p$、積が $q$ になる二つの数を探します。展開して戻るか確かめましょう。",tex:"(x+2)(x+3)=x^2+5x+6",check:"$x^2+x-6$ を因数分解しなさい。",answer:"$(x+3)(x-2)$。和は $1$、積は $-6$ です。"},
      {id:"domain",title:"分母の条件を確かめる",text:"ゼロで割ることはできません。約分前の分母を見て、ゼロになる値を除きます。分母が積なら、それぞれの因数を確かめます。",tex:"(x-2)(x+3)\\ne0",check:"この分母で使えない $x$ の値は何ですか。",answer:"$2$ と $-3$ です。"},
    ],
  },
  {
    slug:"points",title:"座標とグラフ上の点",chapter:"図形と方程式",
    description:"「グラフ上にある」を、式で確かめよう。",
    introduction:[
      "点の座標 $(a,b)$ は、横の座標が $a$、縦の座標が $b$ という意味です。",
      "$y=x^2+1$ では、横の座標 $x$ を決めると、縦の座標 $y$ は $x^2+1$ で決まります。",
      "$x=2$ のとき $y=5$ なので、点 $(2,5)$ はグラフ上にあります。同じ横の座標でも、点 $(2,4)$ はグラフ上にありません。",
    ],
    rule:"$a$ が関数 $f$ の定義域に入っているとき、点 $(a,b)$ が $y=f(x)$ 上にあることと、$b=f(a)$ が成り立つことは同じ条件です。",
    examples:[
      {title:"点がグラフ上にあるか確かめる",prompt:"点 $(2,5)$ は $y=x^2+1$ 上にありますか。",steps:[
        {title:"横と縦を読み取る",text:"点の横の座標は $2$、縦の座標は $5$ です。",tex:"x=2,\\quad y=5"},
        {title:"横の座標を式に入れる",text:"右辺の $x$ に $2$ を入れ、グラフが決める縦の座標を計算します。",tex:"2^2+1=5"},
        {title:"点の縦の座標と比べる",text:"計算結果と点の縦の座標が一致するので、この点はグラフ上にあります。"},
      ]},
      {title:"分からない座標を求める",prompt:"点 $(3,b)$ が直線 $y=2x+1$ 上にあるとき、$b$ を求めなさい。",steps:[
        {title:"分かっている座標を見る",text:"横の座標は $3$。縦の座標が $b$ です。"},
        {title:"点が式を満たすことを使う",text:"$x$ に $3$、$y$ に $b$ を入れます。",tex:"b=2\\cdot3+1"},
        {title:"計算して確かめる",text:"縦の座標は $7$。点 $(3,7)$ は直線の式を満たします。",tex:"b=7"},
      ]},
    ],
    supplements:[
      {id:"coordinates",title:"座標の順序を確かめる",text:"$(a,b)$ の最初が横、次が縦です。$y$ 軸上の点は、横の座標がゼロです。",tex:"(0,3)",check:"この点の横の座標はいくつですか。",answer:"$0$ です。縦の座標は $3$ です。"},
      {id:"substitution",title:"負の数の代入を確かめる",text:"負の数は括弧を付けて代入します。$(-2)^2$ は $(-2)\\cdot(-2)$ なので $4$ です。",tex:"(-2)^2+1=5",check:"$f(x)=x^2+1$ のとき $f(-3)$ を求めなさい。",answer:"$(-3)^2+1=10$ です。"},
      {id:"reverse",title:"縦の座標から横の座標を求める",text:"$y=x^2$ で縦の座標が $4$ のとき、$x^2=4$ を解きます。横の座標は一つとは限りません。",tex:"x=2,\\quad x=-2",check:"$y=x^2$ 上で、縦の座標が $9$ の点をすべて挙げなさい。",answer:"$(3,9)$ と $(-3,9)$ です。"},
    ],
  },
];

const r = "rational", p = "points";
export const exercises: Exercise[] = [
  {id:"r-ready-factor-v1",lesson:r,stage:"ready",family:"factor",kind:"choice",prompt:"$x^2+x-6$ を因数分解した式を選びなさい。",options:["$(x+3)(x-2)$","$(x-3)(x+2)$","$(x+3)(x+2)$"],correct:0,answer:"$(x+3)(x-2)$",hints:["和が $1$、積が $-6$ になる二つの数を探します。"],steps:[{title:"和と積を確かめる",text:"$3+(-2)=1$、$3\\cdot(-2)=-6$ なので、$(x+3)(x-2)$ です。"}],repair:"factorization"},
  {id:"r-ready-structure-v1",lesson:r,stage:"ready",family:"structure",kind:"choice",prompt:"$\\dfrac{x+3}{x}$ の分子と分母の $x$ を消してよいですか。",options:["消してよい","消してはいけない"],correct:1,answer:"消してはいけません。",hints:["分子全体は、掛け算の形になっていますか。"],steps:[{title:"分子の形を見る",text:"分子は $x$ と $3$ の和です。共通の因数を割る操作ではないので、$x$ だけを消せません。"}],repair:"factors"},
  {id:"r-guide-factor-v1",lesson:r,stage:"guided",family:"cancel",kind:"number",prompt:"空欄に入る数を答えなさい。",tex:"x^2-3x-4=(x-4)(x+\\square)",correct:1,answer:"$1$",hints:["積が $-4$、和が $-3$ になる組を考えます。","$-4$ と組み合わせる数を探します。"],steps:[{title:"展開して確認",text:"$(x-4)(x+1)=x^2-3x-4$ です。"}],repair:"factorization"},
  {id:"r-guide-domain-v1",lesson:r,stage:"guided",family:"domain",kind:"choice",prompt:"$\\dfrac{(x-4)(x+1)}{x-4}$ を約分した答えとして正しいものを選びなさい。",options:["$x+1$（すべての実数で使える）","$x+1$（$x\\ne4$）","$x-4$（$x\\ne-1$）"],correct:1,answer:"$x+1$、ただし $x\\ne4$。",hints:["元の分母がゼロになる値を確かめます。"],steps:[{title:"約分と条件",text:"共通の因数 $x-4$ で約分します。元の式は $x=4$ で定義されないので、その条件を残します。"}],repair:"domain"},
  {id:"r-practice-1-v1",lesson:r,stage:"practice",family:"cancel",kind:"paper",prompt:"次の式を簡単にし、使えない値も書きなさい。",tex:"\\frac{(x-3)(x+2)}{x-3}",answer:"$x+2$、ただし $x\\ne3$。",hints:["分子と分母に共通する因数を探します。","$x-3$ で約分します。"],steps:[{title:"共通の因数で割る",text:"$x\\ne3$ のもとで、分子と分母を $x-3$ で割ると $x+2$ です。"}],repair:"factors"},
  {id:"r-practice-2-v1",lesson:r,stage:"practice",family:"cancel",kind:"paper",prompt:"次の式を簡単にし、使えない値も書きなさい。",tex:"\\frac{x^2-5x+6}{x-2}",answer:"$x-3$、ただし $x\\ne2$。",hints:["まず分子を因数分解します。","分子は $(x-2)(x-3)$ です。"],steps:[{title:"因数分解",text:"積が $6$、和が $-5$ になる数は $-2$ と $-3$。",tex:"x^2-5x+6=(x-2)(x-3)"},{title:"約分",text:"$x-2$ で約分し、$x\\ne2$ を残します。"}],repair:"factorization"},
  {id:"r-practice-3-v1",lesson:r,stage:"practice",family:"cancel",kind:"paper",prompt:"次の式を簡単にし、使えない値も書きなさい。",tex:"\\frac{x^2-9}{x+3}",answer:"$x-3$、ただし $x\\ne-3$。",hints:["平方の差の因数分解を使います。","$x^2-9=(x-3)(x+3)$ です。"],steps:[{title:"因数分解して約分",text:"分子を $(x-3)(x+3)$ にして、$x+3$ で約分します。元の分母から $x\\ne-3$ です。"}],repair:"factorization"},
  {id:"r-practice-4-v1",lesson:r,stage:"practice",family:"domain",kind:"paper",prompt:"次の式を簡単にし、使えない値もすべて書きなさい。",tex:"\\frac{x^2-9}{x^2-x-6}",answer:"$\\dfrac{x+3}{x+2}$、ただし $x\\ne3,-2$。",hints:["分子だけでなく、分母も因数分解します。","分母は $(x-3)(x+2)$ です。"],steps:[{title:"両方を因数分解",text:"分子は $(x-3)(x+3)$、分母は $(x-3)(x+2)$ です。"},{"title":"条件を残して約分",text:"$x-3$ で約分します。元の分母がゼロになる $3$ と $-2$ は、どちらも使えません。"}],repair:"domain"},
  {id:"r-practice-5-v1",lesson:r,stage:"practice",family:"structure",kind:"choice",prompt:"$\\dfrac{x^2+3}{x}$ で、$x$ を消して $x+3$ としてよいですか。",options:["してよい","してはいけない"],correct:1,answer:"してはいけません。",hints:["分子のすべての項が $x$ を因数にもっていますか。"],steps:[{title:"分子全体を見る",text:"$3$ は $x$ を因数にもっていません。正しく分けると $x+\\dfrac3x$（$x\\ne0$）です。"}],repair:"factors"},
  {id:"r-practice-6-v1",lesson:r,stage:"practice",family:"domain",kind:"choice",prompt:"$\\dfrac{x^2-1}{x-1}=x+1$ と約分しました。元の式に $x=1$ を代入できますか。",options:["できる。値は $2$","できない。元の分母がゼロになる"],correct:1,answer:"代入できません。",hints:["約分前の分母を見ます。"],steps:[{title:"元の式の条件",text:"元の分母は $1-1=0$ です。約分後の式で計算できても、元の式が定義されるようにはなりません。"}],repair:"domain"},
  {id:"r-review-cancel-v1",lesson:r,stage:"review",family:"cancel",kind:"paper",prompt:"次の式を簡単にし、使えない値も書きなさい。",tex:"\\frac{x^2+x-12}{x-3}",answer:"$x+4$、ただし $x\\ne3$。",hints:["積が $-12$、和が $1$ になる二つの数を探します。"],steps:[{title:"因数分解して約分",text:"$x^2+x-12=(x+4)(x-3)$ なので、$x-3$ で約分できます。元の分母から $x\\ne3$ です。"}],repair:"factorization"},
  {id:"r-review-domain-v1",lesson:r,stage:"review",family:"domain",kind:"paper",prompt:"次の式を簡単にし、使えない値もすべて書きなさい。",tex:"\\frac{x^2-4}{x^2+x-6}",answer:"$\\dfrac{x+2}{x+3}$、ただし $x\\ne2,-3$。",hints:["分母を因数分解し、使えない値を先に書きます。"],steps:[{title:"因数分解",text:"分子は $(x-2)(x+2)$、分母は $(x-2)(x+3)$ です。"},{"title":"約分",text:"$x-2$ で約分します。条件は $x\\ne2,-3$ です。"}],repair:"domain"},
  {id:"p-ready-order-v1",lesson:p,stage:"ready",family:"coordinates",kind:"number",prompt:"点 $(2,-3)$ の横の座標はいくつですか。",correct:2,answer:"$2$",hints:["座標の最初が横、次が縦です。"],steps:[{title:"順序を読む",text:"横の座標が $2$、縦の座標が $-3$ です。"}],repair:"coordinates"},
  {id:"p-ready-negative-v1",lesson:p,stage:"ready",family:"substitution",kind:"number",prompt:"$f(x)=x^2+1$ のとき、$f(-2)$ を求めなさい。",correct:5,answer:"$5$",hints:["負の数を括弧で囲んで代入します。"],steps:[{title:"代入",text:"$(-2)^2+1=4+1=5$ です。"}],repair:"substitution"},
  {id:"p-guide-1-v1",lesson:p,stage:"guided",family:"membership",kind:"number",prompt:"点 $(2,5)$ が $y=x^2+1$ 上にあるか調べます。右辺に $x=2$ を入れた値はいくつですか。",correct:5,answer:"$5$",hints:["$2^2+1$ を計算します。"],steps:[{title:"縦の座標を計算",text:"$2^2+1=5$。点の縦の座標 $5$ と一致するので、グラフ上にあります。"}],repair:"substitution"},
  {id:"p-guide-2-v1",lesson:p,stage:"guided",family:"coordinate",kind:"choice",prompt:"点 $(3,b)$ が $y=2x+1$ 上にあります。条件を表す式を選びなさい。",options:["$3=2b+1$","$b=2\\cdot3+1$","$b=3+1$"],correct:1,answer:"$b=2\\cdot3+1$",hints:["横の座標を $x$、縦の座標を $y$ に入れます。"],steps:[{title:"座標を代入",text:"$x=3$、$y=b$ なので $b=2\\cdot3+1$。計算すると $b=7$ です。"}],repair:"coordinates"},
  {id:"p-practice-1-v1",lesson:p,stage:"practice",family:"membership",kind:"choice",prompt:"点 $(1,3)$ は $y=2x+1$ 上にありますか。",options:["ある","ない"],correct:0,answer:"あります。",hints:["$x=1$ のときの右辺を計算します。"],steps:[{title:"代入して比較",text:"$2\\cdot1+1=3$ で、縦の座標と一致します。"}],repair:"substitution"},
  {id:"p-practice-2-v1",lesson:p,stage:"practice",family:"membership",kind:"choice",prompt:"点 $(2,4)$ は $y=x^2+1$ 上にありますか。",options:["ある","ない"],correct:1,answer:"ありません。",hints:["横の座標 $2$ を式に入れます。"],steps:[{title:"縦の座標と比較",text:"$2^2+1=5$ ですが、点の縦の座標は $4$ です。一致しません。"}],repair:"substitution"},
  {id:"p-practice-3-v1",lesson:p,stage:"practice",family:"coordinate",kind:"number",prompt:"点 $(2,b)$ が $y=3x-1$ 上にあるとき、$b$ を求めなさい。",correct:5,answer:"$b=5$",hints:["$x=2$、$y=b$ を代入します。"],steps:[{title:"代入して計算",text:"$b=3\\cdot2-1=5$ です。"}],repair:"substitution"},
  {id:"p-practice-4-v1",lesson:p,stage:"practice",family:"substitution",kind:"number",prompt:"点 $(-2,b)$ が $y=x^2+1$ 上にあるとき、$b$ を求めなさい。",correct:5,answer:"$b=5$",hints:["負の数は括弧で囲んで代入します。"],steps:[{title:"負数を代入",text:"$b=(-2)^2+1=5$ です。"}],repair:"substitution"},
  {id:"p-practice-5-v1",lesson:p,stage:"practice",family:"reverse",kind:"choice",prompt:"$y=x^2$ 上で、縦の座標が $4$ の点をすべて挙げたものを選びなさい。",options:["$(2,4)$ だけ","$(4,2)$ と $(4,-2)$","$(2,4)$ と $(-2,4)$"],correct:2,answer:"$(2,4)$ と $(-2,4)$",hints:["$x^2=4$ を満たす $x$ をすべて求めます。"],steps:[{title:"横の座標を求める",text:"$x^2=4$ の解は $2$ と $-2$。縦の座標はいずれも $4$ です。"}],repair:"reverse"},
  {id:"p-practice-6-v1",lesson:p,stage:"practice",family:"coordinate",kind:"number",prompt:"直線 $y=2x+c$ が点 $(1,5)$ を通るとき、定数 $c$ を求めなさい。",correct:3,answer:"$c=3$",hints:["点の座標を直線の式に代入します。","$5=2\\cdot1+c$ です。"],steps:[{title:"条件を式にする",text:"$5=2\\cdot1+c$ なので $c=3$。直線 $y=2x+3$ に点 $(1,5)$ を代入すると成立します。"}],repair:"coordinates"},
  {id:"p-review-membership-v1",lesson:p,stage:"review",family:"membership",kind:"choice",prompt:"点 $(-1,2)$ は $y=x^2+1$ 上にありますか。",options:["ある","ない"],correct:0,answer:"あります。",hints:["$(-1)^2+1$ を計算して、縦の座標と比べます。"],steps:[{title:"代入して比較",text:"$(-1)^2+1=2$ で、点の縦の座標と一致します。"}],repair:"substitution"},
  {id:"p-review-coordinate-v1",lesson:p,stage:"review",family:"coordinate",kind:"number",prompt:"点 $(-1,b)$ が $y=3x+2$ 上にあるとき、$b$ を求めなさい。",correct:-1,answer:"$b=-1$",hints:["$x=-1$ を代入します。"],steps:[{title:"代入して計算",text:"$b=3\\cdot(-1)+2=-1$ です。"}],repair:"substitution"},
];

lessons.push(...chapterOneLessons);
lessons.sort((a,b) => (chapterOneOrder.indexOf(a.slug)<0?99:chapterOneOrder.indexOf(a.slug))-(chapterOneOrder.indexOf(b.slug)<0?99:chapterOneOrder.indexOf(b.slug)));
exercises.push(...chapterOneExercises);
lessons.push(...chapterTwoLessons);
exercises.push(...chapterTwoExercises);
const chapterThree=chapterThreeData as {lessons:Lesson[];exercises:Exercise[]};
lessons.push(...chapterThree.lessons);
exercises.push(...chapterThree.exercises);
const chapterFour=chapterFourData as {lessons:Lesson[];exercises:Exercise[]};
lessons.push(...chapterFour.lessons);
exercises.push(...chapterFour.exercises);
const chapterFive=chapterFiveData as {lessons:Lesson[];exercises:Exercise[]};
lessons.push(...chapterFive.lessons);
exercises.push(...chapterFive.exercises);
const chapterSix=chapterSixData as {lessons:Lesson[];exercises:Exercise[]};
lessons.push(...chapterSix.lessons);
exercises.push(...chapterSix.exercises);
const chapterSeven=chapterSevenData as {lessons:Lesson[];exercises:Exercise[]};
lessons.push(...chapterSeven.lessons);
exercises.push(...chapterSeven.exercises);
const mathThreeChapterOne=mathThreeChapterOneData as {lessons:Lesson[];exercises:Exercise[]};
lessons.push(...mathThreeChapterOne.lessons);
exercises.push(...mathThreeChapterOne.exercises);
const mathThreeChapterTwo=mathThreeChapterTwoData as {lessons:Lesson[];exercises:Exercise[]};
lessons.push(...mathThreeChapterTwo.lessons);
exercises.push(...mathThreeChapterTwo.exercises);
const mathThreeChapterThree=mathThreeChapterThreeData as {lessons:Lesson[];exercises:Exercise[]};
lessons.push(...mathThreeChapterThree.lessons);
exercises.push(...mathThreeChapterThree.exercises);
lessons.sort((a,b)=>chapters.findIndex(c=>c.name===a.chapter)-chapters.findIndex(c=>c.name===b.chapter));
export const exerciseById = Object.fromEntries(exercises.map(e => [e.id, e]));
import mathThreeChapterTwoData from "./math3-chapter2.json";
import mathThreeChapterThreeData from "./math3-chapter3.json";
