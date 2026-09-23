import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import katex from 'katex';
function moduleURL(file){
 const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 return 'data:text/javascript;base64,'+Buffer.from(code.replace(/from\s+["'](\.\/[^"']+)["']/g,(_,p)=>'from '+JSON.stringify(moduleURL(new URL(p+'.ts',file))))).toString('base64');
}
const {math1Chapter2Topics:topics,math1Chapter2Lessons:lessons,math1Chapter2Exercises:exercises,math1LogicCoverage:coverage,math1LogicCheckLesson:check}=await import(moduleURL(new URL('../app/content/math1-chapter2.ts',import.meta.url)));

test('logic chapter retains ten topics, explicit guided associations and decision-level alternates',()=>{
 assert.equal(topics.length,10);assert.equal(lessons.length,11);
 assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
 for(const lesson of lessons){
  const items=exercises.filter(e=>e.lesson===lesson.slug);
  assert.equal(lesson.chapter,'集合と命題');assert.equal(lesson.subject,'数学I');
  assert.equal(items.filter(e=>e.stage==='ready').length,2);
  assert.ok(items.filter(e=>e.stage==='practice').length>=6,lesson.slug);
  assert.deepEqual(lesson.examples.flatMap(e=>e.guidedIds).sort(),items.filter(e=>e.stage==='guided').map(e=>e.id).sort());
  assert.equal(new Set(lesson.supplements.map(s=>s.id)).size,lesson.supplements.length);
  for(const e of items){
   assert.ok(e.hints[0]&&e.steps[0].text&&e.answer,e.id);
   assert.ok(lesson.supplements.some(s=>s.id===e.repair),e.id);
   assert.ok(items.some(a=>a.id!==e.id&&a.family===e.family&&a.prompt!==e.prompt&&['practice','review'].includes(a.stage)),e.id);
  }
 }
});
test('all chapter formulas including supplements and tables render with strict KaTeX',async()=>{
 const {math1LogicTables:tables}=await import(moduleURL(new URL('../app/content/math1-logic-tables.ts',import.meta.url)));
 function walk(v,key=''){
  if(typeof v==='string'){
   assert.ok([...v].every(c=>c.charCodeAt(0)>=32||c==='\n'||c==='\t'),v);
   const formulas=key==='tex'?[v]:[...v.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
   assert.equal((v.match(/\$/g)||[]).length%2,0,v);
   for(const tex of formulas){assert.ok(!tex.includes('/')&&!tex.includes('\\binom'),tex);katex.renderToString(tex,{throwOnError:true,strict:'error'});}
  }else if(Array.isArray(v))v.forEach(x=>walk(x));
  else if(v&&typeof v==='object')Object.entries(v).forEach(([k,x])=>walk(x,k));
 }
 walk(lessons);walk(exercises);walk(tables);
 for(const list of Object.values(tables))for(const t of list)for(const row of t.rows)assert.equal(row.length,t.headers.length);
});
test('finite set operations match independently enumerated membership and universe',()=>{
 const parse=s=>s==='\\varnothing'?[]:s.slice(2,-2).split(',').map(Number);
 const setString=a=>a.length?'\\{'+a.join(',')+'\\}':'\\varnothing';
 for(const e of exercises.filter(e=>e.lesson==='m1-set-operations'&&['intersection','union','complement'].includes(e.family))){
  const get=name=>parse(e.prompt.match(new RegExp(name+'=(\\\\\\{[^}]*\\\\\\}|\\\\varnothing)'))[1]);
  const u=get('U'),a=get('A'),b=get('B');
  const expected=u.filter(n=>e.family==='intersection'?a.includes(n)&&b.includes(n):e.family==='union'?a.includes(n)||b.includes(n):!a.includes(n));
  assert.ok(e.answer.includes('='+setString(expected)+'$'),e.id);
 }
});
test('integer listings respect the stated endpoints rather than silently using real numbers',()=>{
 for(const e of exercises.filter(e=>e.lesson==='m1-sets-elements'&&e.family==='listing')){
  const parts=e.prompt.match(/(-?\d+)(\\le|<) x(\\le|<)(-?\d+)/);
  assert.ok(parts,e.id);
  const lo=Number(parts[1]),hi=Number(parts[4]),expected=[];
  for(let n=lo-1;n<=hi+1;n++)if((parts[2]==='<'?n>lo:n>=lo)&&(parts[3]==='<'?n<hi:n<=hi))expected.push(n);
  assert.ok(e.answer.includes('\\{'+expected.join(',')+'\\}'),e.id);
  assert.ok(e.prompt.includes('\\{x\\mid x\\text{ は整数}'),e.id);
 }
});
test('subset failures and empty-set reasoning have their own repairs and chapter coverage',()=>{
 for(const family of ['object-kind','empty-zero','subset-counter','empty-subset','range-counter']){
  const c=coverage.find(c=>c.family===family);assert.ok(c,family);
  assert.ok(exercises.some(e=>e.lesson===check.slug&&e.family===c.checkFamily&&e.stage==='practice'));
 }
 const empty=exercises.find(e=>e.id==='m1-condition-inclusion-subset-4-v1');
 assert.equal(empty.family,'empty-subset');
 const range=exercises.find(e=>e.id==='m1-condition-inclusion-range-counter-extra-1-v1');
 assert.ok(range.prompt.includes('x\\ge3'));assert.ok(range.answer.includes('x=2'));
 assert.ok(range.answer.includes('2<3'));
 for(const c of coverage){
  for(const id of c.sourceIds){const source=exercises.find(e=>e.id===id);assert.ok(source,id);assert.equal(source.family,c.family);}
  assert.ok(exercises.some(e=>e.lesson===check.slug&&e.family===c.checkFamily&&e.stage==='review'));
 }
 const grouped=check.practiceGroups.flatMap(g=>g.exerciseIds);
 assert.equal(check.practiceGroups.length,4);
 assert.equal(new Set(grouped).size,grouped.length);
 assert.deepEqual(grouped.slice().sort(),exercises.filter(e=>e.lesson===check.slug&&e.stage==='practice').map(e=>e.id).sort());
});
const compare=(s,x)=>{
 const a=s.match(/^x(\\ge|\\le|\\ne|>|<|=)(-?\d+)$/);assert.ok(a,s);
 const n=Number(a[2]);return {'\\ge':()=>x>=n,'\\le':()=>x<=n,'\\ne':()=>x!==n,'>':()=>x>n,'<':()=>x<n,'=':()=>x===n}[a[1]]();
};
test('inequality negations partition the boundary and conjunction negations obey De Morgan',async()=>{
 const {boundaryNegations,compoundNegations}=await import(moduleURL(new URL('../app/content/math1-logic-negation.ts',import.meta.url)));
 for(const[p,np]of boundaryNegations){const n=Number(p.match(/-?\d+$/)[0]);for(const x of[n-1,n,n+1])assert.notEqual(compare(p,x),compare(np,x),p);}
 for(const c of compoundNegations)for(const x of[-4,-1,0,1,2,3,4,5,6])for(const y of[-1,0,1]){
  const value=s=>compare(s.replace(/^y/,'x'),s.startsWith('y')?y:x);
  const original=c.and?value(c.p)&&value(c.q):value(c.p)||value(c.q);
  const negated=c.and?value(c.np)||value(c.nq):value(c.np)&&value(c.nq);
  assert.equal(negated,!original,JSON.stringify(c));
 }
});
test('all required quantifier directions and necessary/sufficient outcomes remain represented',async()=>{
 const {quantifiedNegations}=await import(moduleURL(new URL('../app/content/math1-logic-negation.ts',import.meta.url)));
 assert.ok(quantifiedNegations.some(c=>c.all));assert.ok(quantifiedNegations.some(c=>!c.all));
 const qs=exercises.filter(e=>e.lesson==='m1-condition-negation'&&e.family==='quantifier');
 for(const q of qs){
  const universal=q.prompt.startsWith('「すべて');
  assert.ok(q.answer.startsWith(universal?'ある':'すべて'),q.id);
  assert.equal(q.prompt.includes('実数'),q.answer.includes('実数'),q.id);
 }
 const names=exercises.filter(e=>e.lesson==='m1-necessary-sufficient'&&e.family==='classify-conditions').map(e=>e.answer);
 for(const text of ['必要十分条件','十分条件ですが、必要条件ではありません','必要条件ですが、十分条件ではありません','必要条件でも十分条件でもありません'])assert.ok(names.some(s=>s.includes(text)),text);
});
test('proof questions contain full reasons, integer domains and explicit contradiction targets',()=>{
 const proofs=topics.filter(d=>['m1-direct-proof','m1-proof-contrapositive','m1-proof-contradiction'].includes(d.lesson.slug));
 for(const d of proofs)for(const e of d.exercises.filter(e=>!['integer-form','consecutive-form','expand-square'].includes(e.family)&&!e.family.endsWith('-plan'))){
  assert.ok(e.answer.length>45,e.id);
  if(e.family==='parity-algebra'||e.family==='consecutive'||e.family==='parity-contra')assert.ok(e.answer.includes('整数')||e.answer.includes('奇数同士の積'),e.id);
  if(e.family.includes('contra')&&e.lesson==='m1-proof-contrapositive')assert.ok(e.answer.includes('対偶')&&e.answer.includes('元の命題'),e.id);
  if(e.family==='irrational-root')assert.ok(e.answer.includes('互いに素')&&e.answer.includes('矛盾')&&e.answer.includes('正の整数'),e.id);
 }
 const kinds=['m1-direct-proof','m1-proof-contrapositive','m1-proof-contradiction'].map(slug=>new Set(exercises.filter(e=>e.lesson===slug).map(e=>e.family)));
 assert.ok(!kinds[0].has('parity-contra'));assert.ok(!kinds[1].has('irrational-root'));
});
test('scaffolds, full proofs, method choices and review variants remain separate',()=>{
 const proofSlugs=['m1-direct-proof','m1-proof-contrapositive','m1-proof-contradiction'];
 for(const e of exercises.filter(e=>proofSlugs.includes(e.lesson)&&e.stage==='guided')){
  assert.ok(e.family.endsWith('-plan'),e.id);
  assert.ok(exercises.filter(a=>a.lesson===e.lesson&&a.family===e.family&&['practice','review'].includes(a.stage)).length>=2,e.id);
 }
 const root=exercises.find(e=>e.id==='m1-proof-contradiction-irrational-root-1-v1');assert.equal(root.family,'root-plan');
 const completeRoots=exercises.filter(e=>e.lesson===root.lesson&&e.family==='irrational-root');
 assert.equal(new Set(completeRoots.map(e=>e.prompt)).size,completeRoots.length);
 for(const family of ['integer-extreme','open-domain-extreme','irrational-reciprocal','consecutive-form','nonzero-contra','counter-candidate','truth-choice'])assert.ok(coverage.some(c=>c.family===family),family);
 const choices=exercises.filter(e=>e.lesson===check.slug&&e.family.includes('-choose-'));
 assert.ok(choices.length>=12);
 for(const e of choices){
  assert.ok(!/対偶を用いて|背理法で/.test(e.prompt),e.id);
  assert.ok(e.prompt.includes('理由')&&e.answer.includes('から。'),e.id);
  const repair=check.supplements.find(s=>s.id===e.repair);
  assert.ok(repair.text.includes('方法の一例')&&repair.text.includes('別解'),e.id);
 }
 for(const id of ['m1-necessary-sufficient-classify-conditions-new-1-v1','m1-condition-negation-boundary-3-v1','m1-condition-negation-boundary-5-v1','m1-proof-contradiction-contradiction-4-v1'])assert.ok(coverage.some(c=>c.sourceIds.includes(id)),id);
});
