import type {defineMathOneLesson} from './math1-authoring';
const m=String.raw;
const compact=(text:string)=>text.replaceAll('$','').replaceAll('\\dfrac','\\frac').replace(/[\s。、「」]/g,'');
// Only remove a conclusion already written in the immediately preceding work.
// New reasons, conditions and answers absent from that work are retained.
function withoutRepeatedConclusion(text:string){
 const lines=text.split('\n');
 if(lines.length>1&&compact(lines.at(-2)!).includes(compact(lines.at(-1)!)))lines.pop();
 return lines.join('\n');
}
const warmups:Record<string,string[]>={
 'm1-common-factors':['m1-common-factors-expand-1-v1'],
 'm1-quadratic-factorization':['m1-quadratic-factorization-expand-1-v1'],
 'm1-grouping':['m1-grouping-expand-1-v1'],
 'm1-square-roots':['m1-square-roots-number-square-1-v1'],
 'm1-radical-calculation':[],
 'm1-rationalizing':[],
 'm1-absolute-distance':[],
 'm1-linear-inequalities':['m1-linear-inequalities-endpoints-1-v1'],
 'm1-simultaneous-inequalities':['m1-simultaneous-inequalities-endpoints-1-v1'],
 'm1-inequality-modeling':['m1-inequality-modeling-words-1-v1'],
};
export function refineMath1Algebra(drafts:ReturnType<typeof defineMathOneLesson>[]){
 for(const {lesson,exercises} of drafts){
  if(Object.hasOwn(warmups,lesson.slug))lesson.warmupIds=warmups[lesson.slug];
  for(const example of lesson.examples){
   const last=example.steps.at(-1),before=example.steps.at(-2);
   if(last&&before&&['答え','答えと確認'].includes(last.title)&&compact(before.text).includes(compact(last.text)))example.steps.pop();
  }
  for(const supplement of lesson.supplements){
   supplement.text=withoutRepeatedConclusion(supplement.text);
   supplement.answer=withoutRepeatedConclusion(supplement.answer);
   const exact=exercises.find(q=>q.prompt===supplement.check);
   if(exact)supplement.answerExerciseId=exact.id;
  }
 }
 const substitution=drafts.find(d=>d.lesson.slug==='m1-substitution')!;
 substitution.lesson.examples[0].steps[0].text=m`二乗するのは $x$ だけで、係数 $2$ は外側です。二か所の $x$ に $(-3)$ を入れます。`;
 substitution.lesson.examples[0].steps=substitution.lesson.examples[0].steps.slice(0,2);
 substitution.lesson.examples[1].steps=substitution.lesson.examples[1].steps.slice(0,2);
 const roots=drafts.find(d=>d.lesson.slug==='m1-square-roots')!;
 roots.lesson.examples[1].steps=[{title:'二乗して確かめる',text:m`$3^2=(-3)^2=9$ なので、$9$ の平方根は $3,-3$ です。`}];
 const rootSupplement=roots.lesson.supplements.find(s=>s.id==='all-roots')!;
 rootSupplement.text=m`二乗して元の数になる値を探します。$3^2=(-3)^2=9$ なので、$9$ の平方根は $3,-3$ です。`;
}
