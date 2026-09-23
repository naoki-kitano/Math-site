import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
import katex from 'katex';
function moduleURL(file){
 const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 return 'data:text/javascript;base64,'+Buffer.from(code.replace(/from\s+["']([^"']+)["']/g,(_,p)=>'from '+JSON.stringify(p.startsWith('.')?moduleURL(new URL(p+(existsSync(new URL(p+'.ts',file))?'.ts':'.tsx'),file)):import.meta.resolve(p)))).toString('base64');
}
const {functionFoundationTopics}=await import(moduleURL(new URL('../app/content/math1-function-foundations.ts',import.meta.url)));
const {completingSquareTopics,completionCases}=await import(moduleURL(new URL('../app/content/math1-completing-square.ts',import.meta.url)));
const {quadraticGraphTopics,intervalCases}=await import(moduleURL(new URL('../app/content/math1-quadratic-graphs.ts',import.meta.url)));
const {quadraticEquationTopics}=await import(moduleURL(new URL('../app/content/math1-quadratic-equations.ts',import.meta.url)));
const {quadraticInequalityTopics,inequalityCases,specialSignCases}=await import(moduleURL(new URL('../app/content/math1-quadratic-inequalities.ts',import.meta.url)));
const {quadraticApplicationTopics,intersectionCases}=await import(moduleURL(new URL('../app/content/math1-quadratic-applications.ts',import.meta.url)));
const topics=[...functionFoundationTopics,...completingSquareTopics,...quadraticGraphTopics,...quadraticEquationTopics,...quadraticInequalityTopics,...quadraticApplicationTopics];
const {math1QuadraticCheckLesson:check,math1Chapter3Exercises:allExercises,math1QuadraticCoverage:coverage}=await import(moduleURL(new URL('../app/content/math1-chapter3.ts',import.meta.url)));
const {mathOneQuadraticFigures:figures}=await import(moduleURL(new URL('../app/components/MathOneQuadraticDiagrams.tsx',import.meta.url)));
test('quadratic drafts have explicit guided coverage, individual hints and distinct alternates',()=>{
 assert.equal(topics.length,18);
 for(const{lesson,exercises}of topics){
  assert.equal(lesson.chapter,'二次関数');
  assert.equal(exercises.filter(e=>e.stage==='ready').length,2);
  assert.ok(exercises.filter(e=>e.stage==='practice').length>=6,lesson.slug);
  assert.deepEqual(lesson.examples.flatMap(e=>e.guidedIds).sort(),exercises.filter(e=>e.stage==='guided').map(e=>e.id).sort());
  assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
  for(const e of exercises){
   assert.ok(e.answer&&e.hints[0]&&e.steps[0].text,e.id);
   assert.ok(lesson.supplements.some(s=>s.id===e.repair),e.id);
   assert.ok(exercises.some(a=>a.id!==e.id&&a.family===e.family&&a.prompt!==e.prompt&&['practice','review'].includes(a.stage)),e.id);
  }
 }
});
test('intersection answers satisfy both polynomials and preserve all roots',()=>{
 for(const {f,g,xs,ys}of intersectionCases){
  assert.ok(f[0]!==g[0]);
  xs.forEach((x,i)=>{assert.equal(f[0]*x*x+f[1]*x+f[2],ys[i]);assert.equal(g[0]*x*x+g[1]*x+g[2],ys[i]);});
  const a=f[0]-g[0],b=f[1]-g[1],c=f[2]-g[2],p=xs[0],q=xs.at(-1);
  assert.deepEqual([a,-a*(p+q)||0,a*p*q||0],[a,b||0,c||0]);
 }
});
test('inequality decisions cover both openings and all four relation types',()=>{
 for(const sign of [-1,1])for(const rel of ['>','<','\\ge','\\le']){
  assert.ok(inequalityCases.some(e=>Math.sign(e.a)===sign&&e.rel===rel));
  assert.ok(specialSignCases.some(e=>Math.sign(e.a)===sign&&e.rel===rel&&e.k===0));
  assert.ok(specialSignCases.some(e=>Math.sign(e.a)===sign&&e.rel===rel&&e.k!==0));
 }
 for(const e of inequalityCases){
  assert.ok(e.p<e.q);
  const wantPositive=['>','\\ge'].includes(e.rel);
  assert.equal(e.inside,wantPositive?e.a<0:e.a>0);
  assert.equal(e.closed,['\\ge','\\le'].includes(e.rel));
 }
});
test('closed interval extrema respect the domain, endpoint ties and sign',()=>{
 for(const e of intervalCases){
  const closest=Math.max(e.l,Math.min(e.r,e.h));
  const farthest=Math.abs(e.l-e.h)>Math.abs(e.r-e.h)?e.l:e.r;
  const near=e.a*(closest-e.h)**2+e.k,far=e.a*(farthest-e.h)**2+e.k;
  assert.equal(e.min,Math.min(near,far));assert.equal(e.max,Math.max(near,far));
  for(const x of [...e.minAt,...e.maxAt])assert.ok(x>=e.l&&x<=e.r);
  if(Math.abs(e.l-e.h)===Math.abs(e.r-e.h))assert.equal((e.a>0?e.maxAt:e.minAt).length,2);
 }
});
test('quadratic draft notation is strictly typeset',()=>{
 function walk(v,key=''){
  if(typeof v==='string'){
   assert.ok([...v].every(c=>c.charCodeAt(0)>=32||c==='\n'||c==='\t'),v);
   assert.equal((v.match(/\$/g)||[]).length%2,0,v);
   for(const tex of key==='tex'?[v]:[...v.matchAll(/\$([^$]+)\$/g)].map(m=>m[1])){
    assert.ok(!tex.includes('/')&&!tex.includes('\\binom'),tex);
    assert.ok(!/\\\\[A-Za-z]/.test(tex),'Doubled command escape: '+tex);
    const rendered=katex.renderToString(tex,{throwOnError:true,strict:'error'});
    if(tex.includes('\\sqrt'))assert.ok(rendered.includes('<msqrt>'),'Missing radical semantics: '+tex);
   }
  }else if(Array.isArray(v))v.forEach(x=>walk(x));
  else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>walk(x,k));
 }
 topics.forEach(walk);walk(check);walk(allExercises);walk(figures);
});
test('chapter check has explicit coverage and preserves repair and alternate decisions',()=>{
 const exerciseMap=new Map(allExercises.map(e=>[e.id,e]));
 for(const c of coverage){
  assert.ok(c.sourceIds.length>=2,c.family);
  assert.ok(c.sourceIds.every(id=>exerciseMap.has(id)),c.family);
  assert.ok(check.supplements.some(s=>s.id===c.checkFamily),c.family);
 }
 const items=allExercises.filter(e=>e.lesson===check.slug);
 for(const e of items)assert.ok(items.some(x=>x.family===e.family&&x.id!==e.id&&x.prompt!==e.prompt&&['practice','review'].includes(x.stage)),e.id);
 assert.equal(check.practiceGroups.length,5);
 assert.deepEqual(check.practiceGroups.flatMap(g=>g.exerciseIds).sort(),items.filter(e=>e.stage==='practice').map(e=>e.id).sort());
});
test('review fixes retain actual operations and guided full-completion requirements',()=>{
 const bySlug=Object.fromEntries(topics.map(t=>[t.lesson.slug,t]));
 for(const slug of ['m1-completing-square','m1-completing-square-coefficient']){
  const t=bySlug[slug];
  for(const e of t.exercises.filter(e=>e.stage==='guided'))assert.ok(e.prompt.includes('等式全体')&&e.answer.includes('半分')&&e.answer.includes('等式全体は $'),e.id);
  assert.ok(t.lesson.supplements.find(s=>s.id==='vertex-reading').text.includes('a\\ne0'));
 }
 const points=bySlug['m1-graph-points'].exercises.filter(e=>e.family==='point-domain');
 assert.ok(points.some(e=>e.answer.startsWith('あります')));
 assert.ok(points.some(e=>e.answer.includes('定義域内ですが')));
 const width=bySlug['m1-basic-parabola'].exercises.filter(e=>e.family==='opening-width');
 assert.ok(width.every(e=>e.answer.includes('x=1')&&!e.hints[0].includes('軸からの縦')));
});
test('chapter sections retain critical variants and choices do not name the method in advance',()=>{
 const items=allExercises.filter(e=>e.lesson===check.slug);
 for(const c of coverage){
  if(c.family in {'signed-square':1,'linear-substitution':1})continue;
  assert.ok(items.filter(e=>e.family===c.checkFamily&&['practice','review'].includes(e.stage)).every(e=>e.stage==='practice'),c.family);
 }
 const choices=items.filter(e=>e.family.includes('-choose-'));
 assert.equal(choices.length,13);
 for(const e of choices){
  assert.ok(!/解の公式で|判別式で/.test(e.prompt),e.id);
  assert.ok(e.answer.includes('方法の一例：')&&e.answer.includes('から。'),e.id);
  const s=check.supplements.find(s=>s.id===e.repair);
  assert.ok(s.check.includes('選んだ方法')&&s.answer.includes('方法の一例：'));
 }
 const counts=topics.find(t=>t.lesson.slug==='m1-equation-graph').exercises.filter(e=>e.family==='intercept-count');
 assert.ok(counts.every(e=>e.answer.includes('D=')&&e.answer.includes('対応')));
 const formulas=topics.find(t=>t.lesson.slug==='m1-quadratic-formula').exercises;
 assert.equal(formulas.find(e=>e.id.endsWith('quadratic-formula-7-v1')).answer,'$x=1\\pm\\sqrt{2}$。');
 assert.equal(formulas.find(e=>e.id.endsWith('quadratic-formula-8-v1')).answer,'$x=\\frac{1\\pm\\sqrt{3}}{2}$。');
});
test('new figures keep finite geometry and explicitly distinguish discrete and interval inputs',()=>{
 assert.equal(figures['m1-domain-range'][0].curves,undefined);
 assert.equal(figures['m1-domain-range'][0].points.length,3);
 assert.equal(figures['m1-domain-range'][1].curves[0].from,0);
 assert.equal(figures['m1-domain-range'][1].curves[0].to,2);
 for(const group of Object.values(figures))for(const f of group.filter(Boolean)){
  assert.ok(f.xRange[0]<f.xRange[1]&&f.yRange[0]<f.yRange[1]);
  for(const p of f.points??[])assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
  for(const c of f.curves??[])for(const x of [c.from??f.xRange[0],c.to??f.xRange[1]])assert.ok(Number.isFinite(c.value(x)));
 }
});
test('every generated square completion expands to the full original coefficient triple',()=>{
 function decimal(s){return s.replace(/\\frac\{(\d+)\}\{(\d+)\}/g,(_,n,d)=>String(Number(n)/Number(d)));}
 assert.ok(completionCases.length>=30);
 for(const {a,b,c,answer}of completionCases){
  const text=decimal(answer);
  const match=text.match(/^(-?(?:\d+(?:\.\d+)?)?)\(x([+-]\d+(?:\.\d+)?)\)\^2([+-]\d+(?:\.\d+)?)?$/);
  assert.ok(match,answer);
  const lead=match[1]===''?1:match[1]==='-'?-1:Number(match[1]),shift=Number(match[2]),offset=Number(match[3]||0);
  // All inputs here are integers or dyadic fractions, exact in binary arithmetic.
  assert.deepEqual([lead,2*lead*shift,lead*shift*shift+offset],[a,b,c],answer);
 }
});
test('domain, input uniqueness and repair operations are kept separate',()=>{
 const bySlug=Object.fromEntries(topics.map(t=>[t.lesson.slug,t]));
 assert.ok(bySlug['m1-graph-points'].exercises.filter(e=>e.family==='point-domain').every(e=>e.answer.includes('定義域')));
 assert.ok(bySlug['m1-domain-range'].exercises.some(e=>e.family==='open-range'));
 assert.ok(bySlug['m1-function-values'].exercises.some(e=>e.family==='function-uniqueness'));
 const b=bySlug['m1-completing-square'];
 for(const family of ['integer-completion','fraction-completion','vertex-reading','completion-check','expand-square','fraction-sum'])assert.ok(b.exercises.filter(e=>e.family===family).length>=2,family);
});
