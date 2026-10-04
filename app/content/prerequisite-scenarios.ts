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
  ["n+1",m`n+1`,m`1+\frac1n+\frac1{n^2}`,m`1+\frac1n`,"2"],
  ["2n+3",m`2n+3`,m`1+\frac2n+\frac3{n^2}`,m`2+\frac3n`,"1"],
  ["4n+1",m`4n+1`,m`1+\frac4n+\frac1{n^2}`,m`4+\frac1n`,m`\frac12`],
  ["3n+2",m`3n+2`,m`1+\frac3n+\frac2{n^2}`,m`3+\frac2n`,m`\frac23`],
 ];
 const additions:Exercise[]=cases.map(([inside,denom,root,normal,value],i)=>({
  id:`${slug}-reciprocal-${i+1}-v1`,lesson:slug,family:"reciprocal-limit",repair:"reciprocal-limit",stage:i<2?"practice":"review",kind:"paper",
  prompt:m`$n$ は正の整数です。$\displaystyle\lim_{n\to\infty}\frac1{\sqrt{n^2+${inside}}-n}$ を求めなさい。`,
  answer:m`$${value}$。`,
  hints:[m`分母の差に対応する和 $\sqrt{n^2+${inside}}+n$ を、分子と分母に掛けます。`,m`有理化後は分子・分母を $n$ で割ります。根号の中では $n^2$ で割ります。`],
  steps:[
   {title:"分母と掛ける式を確認する",text:m`$n>0$、$${denom}>0$ なので $\sqrt{n^2+${inside}}>n$。元の分母も、掛ける和も正です。`},
   {title:"差を有理化する",text:"分子にも同じ式を掛け、和と差の積を使います。",tex:m`\frac1{\sqrt{n^2+${inside}}-n}=\frac{\sqrt{n^2+${inside}}+n}{${denom}}`},
   {title:"次数をそろえる",text:m`分子と分母を $n$ で割ります。$n>0$ なので $\sqrt{n^2}=n$ です。`,tex:m`\frac{\sqrt{${root}}+1}{${normal}}\longrightarrow ${value}`},
   {title:"極限を確認する",text:m`$\frac1n,\frac1{n^2}$ は零へ近づきます。整理した分母の極限は零ではないので、商の極限を使えます。`},
  ],
 }));
 const ex=additions[0];
 const repair={id:"reciprocal-limit",title:"根号の差を含む分母",text:ex.prompt+"\n"+ex.steps.map(s=>s.text+(s.tex?m` $${s.tex}$`:"")).join("\n"),tex:"",check:additions[1].prompt,answer:additions[1].steps.map(s=>s.text+(s.tex?m` $${s.tex}$`:"")).join("\n")};
 replaceOwnIds(lesson.supplements,[repair]);
 replaceOwnIds(exercises,additions);
 const chapter=lessons.find(l=>l.slug==="m3-sequences-check")!;
 replaceOwnIds(chapter.supplements,[{...repair,id:slug+"-reciprocal-limit"}]);
 replaceOwnIds(exercises,additions.map((q,i)=>({...q,id:`${chapter.slug}-reciprocal-${i+1}-v1`,lesson:chapter.slug,family:slug+"-reciprocal-limit",repair:slug+"-reciprocal-limit"})));
}
