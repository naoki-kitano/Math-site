import type {Exercise,Lesson} from './lessons';
import {logicWorking} from './math1-logic-authoring';
import {transformations} from './math1-logic-negation';
const m=String.raw;
type Bank={lesson:Lesson;exercises:Exercise[]};

export const rootLemmas={
 2:{title:'平方が偶数なら、元の整数も偶数',text:m`奇数は $n=2k+1$（$k$ は整数）と表せます。$n^2=2(2k^2+2k)+1$ も奇数です。したがって対偶により、平方が偶数の整数は偶数です。`},
 3:{title:'平方が三の倍数なら、元の整数も三の倍数',text:m`三の倍数でない整数は、整数 $k$ を使って $3k+1$ または $3k+2$ と表せます。平方はそれぞれ $3(3k^2+2k)+1$、$3(3k^2+4k+1)+1$。どちらも三で割った余りが一です。対偶により、平方が三の倍数の整数は三の倍数です。`},
};
export function rootProofSteps(d:2|3):Exercise['steps']{
 return [
  {title:'既約分数として表す',text:m`$\sqrt${d}$ が有理数だと仮定します。互いに素な正の整数 $a,b$ を用いて $\sqrt${d}=\frac ab$ と書くと、$a^2=${d}b^2$ です。`},
  {title:'平方の性質を確かめる',text:rootLemmas[d].text},
  {title:'分子に性質を使う',text:m`$a^2=${d}b^2$ なので $a^2$ は ${d===2?'偶数':'三の倍数'}。先ほどの性質から、$a=${d}k$（$k$ は整数）と書けます。`},
  {title:'分母にも性質を使う',text:m`$a=${d}k$ を代入すると $${d*d}k^2=${d}b^2$、すなわち $b^2=${d}k^2$。同じ性質から $b=${d}\ell$（$\ell$ は整数）です。`},
  {title:'互いに素という条件と照合する',text:m`$a=${d}k$、$b=${d}\ell$ は共通因数 $${d}$ をもちます。これは $a,b$ が互いに素な正の整数であることに矛盾します。よって $\sqrt${d}$ は無理数です。`},
 ];
}
const fullProofFamilies=new Set(['parity-algebra','consecutive','parity-contra','compound-contra','nonzero-contra','contradiction','integer-extreme','open-domain-extreme','irrational-root','irrational-expression','irrational-reciprocal']);
const warmupKeys:Record<string,string[]>={
 'm1-sets-elements':['compare-1','integer-recognition-1'],
 'm1-set-operations':['member-ready-1'],
 'm1-statements-counterexamples':['compare-1','substitute-1'],
 'm1-condition-inclusion':['member-ready-1','compare-1'],
 'm1-necessary-sufficient':[],
 'm1-condition-negation':['compare-1'],
 'm1-converse-contrapositive':[],
 'm1-direct-proof':['integer-form-1'],
 'm1-proof-contrapositive':['integer-form-1','expand-square-1'],
 'm1-proof-contradiction':[],
};
function example(lesson:Lesson,id:string,steps:Exercise['steps']){const e=lesson.examples.find(e=>e.id===id);if(e)e.steps=steps;}
function transformSteps(c:typeof transformations[number]):Exercise['steps']{
 return [
  {title:'逆',text:'仮定と結論の順序を交換します。',tex:`${c.q}\\Rightarrow ${c.p}`},
  {title:'裏',text:'元の順序を保ち、両方の条件を否定します。',tex:`${c.np}\\Rightarrow ${c.nq}`},
  {title:'対偶',text:'順序を交換し、両方の条件を否定します。',tex:`${c.nq}\\Rightarrow ${c.np}`},
 ];
}
export function applyLogicPresentation(banks:Bank[]){
 for(const {lesson,exercises} of banks){
  lesson.warmupIds=warmupKeys[lesson.slug].map(key=>`${lesson.slug}-${key}-v1`);
  for(const e of exercises){
   const isProof=lesson.slug.includes('proof')&&fullProofFamilies.has(e.family);
   e.steps=[{title:'',text:isProof?e.answer:logicWorking(...e.steps.map(s=>s.text),e.answer)}];
   e.answerInSteps=true;
   if(e.family==='irrational-root')e.steps=rootProofSteps(e.prompt.includes('{3}')?3:2);
   if(lesson.slug==='m1-converse-contrapositive'&&e.family==='transform'){
    const number=Number(e.id.match(/-transform-(\d+)-v1$/)?.[1]);
    e.steps=transformSteps(transformations[number]);
   }
  }
  if(lesson.slug==='m1-converse-contrapositive')example(lesson,'transform',transformSteps(transformations[0]));
  if(lesson.slug==='m1-direct-proof'){
   example(lesson,'parity-algebra',[
    {title:'仮定を整数で表す',text:m`偶数を $a=2r$、奇数を $b=2s+1$ と表します。$r,s$ は別々に選べる整数です。`},
    {title:'和をまとめる',text:m`$a+b=2r+(2s+1)=2(r+s)+1$。`},
    {title:'奇数の定義へ戻す',text:m`$r+s$ は整数の和なので整数です。和は「整数の二倍に一を足した数」だから奇数です。`},
   ]);
   example(lesson,'consecutive',[
    {title:'連続する関係を表す',text:m`最小を整数 $n$ とすると、三つは $n,n+1,n+2$ です。`},
    {title:'和をまとめる',text:m`$n+(n+1)+(n+2)=3(n+1)$。`},
    {title:'三の倍数の定義へ戻す',text:m`$n+1$ は整数なので、和 $3(n+1)$ は三の倍数です。`},
   ]);
  }
  if(lesson.slug==='m1-proof-contrapositive'){
   example(lesson,'parity-contra',[
    {title:'対偶を作る',text:m`対偶は「$n$ が奇数なら $n^2$ は奇数」です。整数の範囲では、偶数でないことと奇数であることは同じです。`},
    {title:'奇数の平方を計算する',text:m`$n=2k+1$（$k$ は整数）とすると、$n^2=4k^2+4k+1=2(2k^2+2k)+1$。`},
    {title:'元の命題へ戻る',text:m`$2k^2+2k$ は整数なので平方も奇数です。対偶が真と分かったので、元の命題も真です。`},
   ]);
   example(lesson,'compound-contra',[
    {title:'結論全体を否定する',text:m`対偶は「$a\le0$ かつ $b\le0$ なら $a+b\le0$」です。`},
    {title:'仮定から計算する',text:m`$a\le0$、$b\le0$ の両辺を足すと $a+b\le0$。対偶が真なので元の命題も真です。`},
   ]);
  }
  if(lesson.slug==='m1-proof-contradiction'){
   example(lesson,'contradiction',[
    {title:'元の仮定を保つ',text:m`$a+b>0$ とします。結論を否定して、$a\le0$ かつ $b\le0$ と仮定します。`},
    {title:'同じ量の条件を比べる',text:m`二つの不等式を足すと $a+b\le0$。元の $a+b>0$ と両立しません。よって結論の否定は誤りで、少なくとも一方は正です。`},
   ]);
   example(lesson,'irrational-root',rootProofSteps(2));
   example(lesson,'irrational-expression',[
    {title:'有理数と仮定する',text:m`$1+\sqrt2=r$（$r$ は有理数）と仮定します。`},
    {title:'既知の無理数に戻す',text:m`$\sqrt2=r-1$。有理数と整数の差は有理数なので、$\sqrt2$ が無理数であることに矛盾します。よって $1+\sqrt2$ は無理数です。`},
   ]);
   const s=lesson.supplements.find(s=>s.id==='irrational-root')!;
   s.text=m`$\sqrt2$ が有理数なら、互いに素な正の整数 $a,b$ で $\sqrt2=\frac ab$ と書けます。$a^2=2b^2$ より、下の平方の性質を使うと $a=2k$（$k$ は整数）。代入して $b^2=2k^2$ となるため $b$ も偶数です。共通因数 $2$ をもつことは互いに素という条件に矛盾するので、$\sqrt2$ は無理数です。`;
   s.additionalExamples=[{title:rootLemmas[2].title,text:rootLemmas[2].text},{title:rootLemmas[3].title,text:rootLemmas[3].text}];
  }
 }
}
