import type {Lesson,Exercise} from "./lessons";
const m=String.raw;
// A content-module refresh can retain imported lesson objects. Replace only
// this extension's own IDs so repeated assembly cannot duplicate supplements.
function replaceOwnIds<T extends {id:string}>(target:T[],items:T[]){
 const ids=new Set(items.map(item=>item.id));
 for(let i=target.length-1;i>=0;i--)if(ids.has(target[i].id))target.splice(i,1);
 target.push(...items);
}
// Four structurally related but numerically different tasks: two practice, two later review.
// Keep the existing IDs and chapter questions; add an operation-specific family.
export function addPrerequisiteScenarios(lessons:Lesson[],exercises:Exercise[]){
 const slug="m3-sequence-radical-limit",lesson=lessons.find(l=>l.slug===slug)!;
 const cases=[
  ["n+1",m`n+1`,m`1+\frac1n+\frac1{n^2}`,m`1+\frac1n`,"2","1"],
  ["2n+3",m`2n+3`,m`1+\frac2n+\frac3{n^2}`,m`2+\frac3n`,"1","2"],
  ["4n+1",m`4n+1`,m`1+\frac4n+\frac1{n^2}`,m`4+\frac1n`,m`\frac12`,"4"],
  ["3n+2",m`3n+2`,m`1+\frac3n+\frac2{n^2}`,m`3+\frac2n`,m`\frac23`,"3"],
 ];
 const additions:Exercise[]=cases.map(([inside,denom,root,normal,value,denominatorLimit],i)=>({
  id:`${slug}-reciprocal-${i+1}-v1`,lesson:slug,family:"reciprocal-limit",repair:"reciprocal-limit",stage:i<2?"practice":"review",kind:"paper",
  prompt:m`$n$ は正の整数です。$\displaystyle\lim_{n\to\infty}\frac1{\sqrt{n^2+${inside}}-n}$ を求めなさい。`,
  answer:m`$${value}$。`,
  hints:[m`和と差の積で分母の根号を消せるので、分子・分母に $\sqrt{n^2+${inside}}+n$ を掛けます。`,m`有理化後の分母は一次式なので、分子・分母を $n$ で割ります。根号の中では $n^2$ で割ります。`],
  steps:[
   {title:"分母と掛ける式を確認する",text:m`$n>0$、$${denom}>0$ なので $\sqrt{n^2+${inside}}>n$。元の分母も、掛ける和も正です。`},
   {title:"差を有理化する",text:"分子にも同じ式を掛け、和と差の積を使います。",tex:m`\frac1{\sqrt{n^2+${inside}}-n}=\frac{\sqrt{n^2+${inside}}+n}{${denom}}`},
   {title:"次数をそろえる",text:m`分子と分母を $n$ で割ります。$n>0$ なので $\sqrt{n^2}=n$ です。`,tex:m`\frac{\sqrt{${root}}+1}{${normal}}\longrightarrow ${value}`},
   {title:"極限を確認する",text:m`$\frac1n,\frac1{n^2}$ は$0$へ近づくので、分子は $2$、分母は $${denominatorLimit}$ へ近づきます。分母の極限が$0$ではないため、商の極限を使えます。`},
  ],
 }));
 const repair={
  id:"reciprocal-limit",title:"根号の差を含む分母",
  text:m`正の整数 $n$ について、$n\to\infty$ の極限を考えます。$n+1>0$ なので $\sqrt{n^2+n+1}>n$。分母に対応する和を掛けると、和と差の積で分母の根号が消えます。次に分母の一次式に合わせて分子・分母を $n$ で割ります。$n>0$ なので根号の中では $n^2$ で割ります。`,
  tex:m`\begin{aligned}&\frac1{\sqrt{n^2+n+1}-n}\\&=\frac{\sqrt{n^2+n+1}+n}{n+1}\\&=\frac{\sqrt{1+\frac1n+\frac1{n^2}}+1}{1+\frac1n}\\&\longrightarrow2\end{aligned}`,
  check:additions[1].prompt,
  answer:m`$n>0$、$2n+3>0$ なので元の分母は正です。対応する和を掛け、分子・分母を $n$ で割ると $\dfrac{\sqrt{1+\frac2n+\frac3{n^2}}+1}{2+\frac3n}$。分子も分母も $2$ へ近づくので、極限は $1$ です。`
 };
 replaceOwnIds(lesson.supplements,[repair]);
 replaceOwnIds(exercises,additions);
 const chapter=lessons.find(l=>l.slug==="m3-sequences-check")!;
 replaceOwnIds(chapter.supplements,[{...repair,id:slug+"-reciprocal-limit"}]);
 replaceOwnIds(exercises,additions.map((q,i)=>({...q,id:`${chapter.slug}-reciprocal-${i+1}-v1`,lesson:chapter.slug,family:slug+"-reciprocal-limit",repair:slug+"-reciprocal-limit"})));
}
