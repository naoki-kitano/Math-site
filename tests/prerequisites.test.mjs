import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadContent} from '../scripts/content-module.mjs';
import {loadDisplay} from '../scripts/test-display-module.mjs';
const {lessons,exercises,exerciseById}=await loadContent('lessons');
const {prerequisiteChecks,prerequisiteById,prerequisitesOf}=await loadContent('prerequisite-checks');
const {allPrerequisitePlans,diagnosticPlan,diagnosticChecksFor,validDiagnosticTrail,diagnosticTarget,targetPractice}=await loadContent('diagnostic-paths');
const {exercisePrerequisites}=await loadContent('prerequisite-calculus');
const ids=q=>diagnosticChecksFor(q).map(c=>c.id);
const strings=x=>typeof x==='string'?[x]:Array.isArray(x)?x.flatMap(strings):x&&typeof x==='object'?Object.values(x).flatMap(strings):[];
test('diagnostic graph has valid explicit targets, answer choices and no prerequisite cycles',()=>{
 assert.ok(prerequisiteChecks.length>=100);
 assert.equal(prerequisiteById.size,prerequisiteChecks.length);
 for(const c of prerequisiteChecks){
  assert.ok(lessons.find(l=>l.slug===c.lesson)?.supplements.some(s=>s.id===c.repair),c.id);
  assert.ok(Number.isInteger(c.correct)&&c.correct>=0&&c.correct<c.options.length,c.id);
  assert.equal(new Set(c.options).size,c.options.length,c.id);
  for(const s of strings(c))for(const [,tex]of s.matchAll(/\$([^$]+)\$/g)){
   assert.doesNotMatch(tex,/\/|\\binom|\\\\/,c.id);
   katex.renderToString(tex,{strict:'error',throwOnError:true});
  }
  const visit=(node,path=[])=>{
   assert.ok(!path.includes(node.id),[...path,node.id].join(' -> '));
   for(const id of new Set([...node.requires,...Object.values(node.wrong??{}).flat()])){
    assert.ok(prerequisiteById.has(id),node.id+' missing '+id);visit(prerequisiteById.get(id),[...path,node.id]);
   }
  };
  visit(c);
  for(const key of Object.keys(c.wrong??{}))assert.ok(Number(key)!==c.correct&&Number(key)<c.options.length);
 }
});
test('every authored family and per-exercise exception refers to current real content',()=>{
 const keys=new Set();
 for(const row of allPrerequisitePlans){
  assert.ok(row.reason.length>8);assert.ok(row.checks.length<=3);
  for(const id of row.checks)assert.ok(prerequisiteById.has(id),id);
  for(const family of row.families){
   const key=row.lesson+':'+family;assert.ok(!keys.has(key),key);keys.add(key);
   assert.ok(exercises.some(q=>q.lesson===row.lesson&&q.family===family),key);
  }
 }
 for(const id of Object.keys(exercisePrerequisites))assert.ok(exerciseById[id],id);
 for(const q of exercises){
  const plan=diagnosticPlan(q);assert.ok(plan.checks.every(Boolean),q.id);
  assert.ok(lessons.find(l=>l.slug===q.lesson).supplements.some(r=>r.id===q.repair),q.id);
 }
});
test('rationalization, common denominators, root signs and finite sums are separate decisions',()=>{
 assert.deepEqual(ids(exerciseById['m3-sequence-radical-limit-reciprocal-1-v1']),['conjugate','root-normalize','reciprocal-limit']);
 assert.deepEqual(ids(exerciseById['m3-rationalizing-limits-1-v1']),['conjugate-product']);
 assert.deepEqual(ids(exerciseById['m3-function-limits-check-20-v1']),['fraction-expression','cancel-factor']);
 assert.deepEqual(ids(exerciseById['m3-limits-at-infinity-8-v1']),['root-square','conjugate']);
 assert.deepEqual(ids(exerciseById['m3-telescoping-series-3-v1']),['partial-gap']);
 assert.deepEqual(ids(exerciseById['m3-telescoping-series-4-v1']),['telescoping-two','partial-sum-limit']);
 assert.deepEqual(ids(exerciseById['m3-telescoping-series-2-v1']),['telescoping']);
 assert.deepEqual(ids(exerciseById['m3-geometric-series-8-v1']),[]);
 assert.deepEqual(ids(exerciseById['m3-derivative-definition-practice-5-v1']),['cubic-expand','cancel-factor']);
});
test('ordinary, chapter and review copies keep operation-specific prerequisite plans',()=>{
 for(const n of [1,2,3,4]){
  assert.deepEqual(ids(exerciseById[`m3-sequences-check-reciprocal-${n}-v1`]),ids(exerciseById[`m3-sequence-radical-limit-reciprocal-${n}-v1`]));
 }
 for(const q of exercises.filter(q=>q.family==='mc-vector-angle-angle'&&q.lesson!=='mc-vector-angle')){
  const base=exercises.find(b=>b.lesson==='mc-vector-angle'&&b.family==='angle');
  assert.deepEqual(ids(q),ids(base),q.id);
 }
 const conditions=['m3-reverse-chain-integrals:applicability','mc-vector-angle:angle-condition','mc-complex-polar:argument-existence'];
 for(const key of conditions)for(const q of exercises.filter(q=>q.lesson+':'+q.family===key))assert.deepEqual(ids(q),[],q.id);
});
test('diagnostic trails accept only known acyclic prerequisite edges and the matching destination',()=>{
 const origin=exerciseById['m3-sequence-radical-limit-reciprocal-1-v1'];
 const trail='conjugate,conjugate-product,expand-product,expand,signed-product';
 assert.equal(validDiagnosticTrail(trail,origin).length,5);
 assert.equal(diagnosticTarget('jr-signed-product',trail,origin).check.id,'signed-product');
 assert.equal(diagnosticTarget('jr-square-roots',trail,origin),undefined);
 for(const bad of ['conjugate,conjugate','conjugate,log','unknown','https://example.com','root-square','conjugate,,expand']){
  assert.deepEqual(validDiagnosticTrail(bad,origin),[],bad);
 }
 assert.deepEqual(validDiagnosticTrail(trail,undefined),[]);
 assert.deepEqual(prerequisitesOf(prerequisiteById.get('conjugate'),1).map(c=>c.id),['rationalize-single']);
 assert.deepEqual(prerequisitesOf(prerequisiteById.get('conjugate'),2).map(c=>c.id),['rationalize-single','conjugate-product']);
});
test('review destination practice is tied to the selected repair rather than lesson array order',()=>{
 for(const c of prerequisiteChecks){
  for(const id of c.practice??[])assert.ok(exerciseById[id],`${c.id}: ${id}`);
  assert.ok(new Set(targetPractice(c).map(q=>q.family)).size<=1,c.id);
 }
 for(const c of prerequisiteChecks)for(const q of targetPractice(c)){
  assert.equal(q.lesson,c.lesson,c.id);assert.equal(q.repair,c.repair,c.id);
  assert.ok(['practice','review'].includes(q.stage));assert.ok(q.hints.length);
 }
 const rational=targetPractice(prerequisiteById.get('conjugate'));
 assert.ok(rational.length>=2);
 assert.ok(rational.every(q=>q.family==='conjugate'));
 assert.ok(targetPractice(prerequisiteById.get('partial-gap')).every(q=>q.family==='gap'));
 assert.deepEqual(targetPractice(prerequisiteById.get('signed-product')),[]);
 const signs=lessons.find(l=>l.slug==='jr-signed-product').supplements.find(s=>s.id==='multiply');
 assert.ok(signs.text.includes('異符号の場合は、絶対値の積に負号'));
 assert.ok(signs.check.includes('(-3)(-4)'));
});
test('already supplied forms and local applicability judgments do not force unrelated prerequisites',()=>{
 const expectations={
  'jr-quadratic-equation-zero-product-2-v1':['zero'],
  'm1-proof-contrapositive-compound-contra-2-v1':['negation'],
  'm1-standard-deviation-compare-sd-2-v1':[],
  'm1-data-analysis-check-m1-standard-deviation-compare-sd-2-v1':[],
  'ma-sum-product-sum-2-v1':[],
  'ma-incenter-circumcenter-right-circumcenter-2-v1':[],
  'mb-proportion-interval-size-2-v1':['root'],
  'mc-matrix-table-read-2-v1':[],
  'mc-matrix-product-order-2-v1':[],
  'root-relations-2-v1':[],
  'root-relations-6-v1':['square-expand'],
  'm3-infinite-series-meaning-3-v1':['reciprocal-limit'],
  'm3-infinite-series-meaning-5-v1':[],
  'm3-infinite-series-meaning-7-v1':['sigma'],
  'm3-geometric-sequence-limit-3-v1':[],
  'm3-second-derivative-practice-1-v1':[],
  'm3-second-derivative-practice-5-v1':['chain'],
  'm3-second-derivative-practice-6-v1':['power-derivative','substitution'],
  'm3-integral-symmetry-practice-2-v1':[],
  'm3-dummy-variable-practice-1-v1':[],
  'm3-integral-properties-guided-1-v1':[],
  'm3-integral-properties-practice-4-v1':['endpoint-value'],
  'm3-integral-bounds-practice-2-v1':['inequality-linear'],
  'm3-parametric-area-practice-1-v1':[],
 };
 for(const [id,expected]of Object.entries(expectations)){
  assert.ok(exerciseById[id],id);assert.deepEqual(ids(exerciseById[id]),expected,id);
 }
 for(const n of [2,3,7,8]){
  const tree=exerciseById[`ma-probability-check-ma-probability-tree-tree-path-${n}-v1`];
  const replacement=exerciseById[`ma-probability-check-ma-replacement-with-replacement-${n}-v1`];
  assert.ok(tree&&replacement);assert.deepEqual(ids(tree),ids(replacement),tree.id);
 }
 for(const stage of ['practice','review']){
  const copy=exerciseById[`m3-derivatives-check-${stage}-m3-second-derivative-v1`];
  assert.ok(copy);assert.ok(!ids(copy).includes('chain'),copy.id);
 }
});
test('new reciprocal radical limits preserve conditions, compatible alternates and exact transformations',()=>{
 const qs=exercises.filter(q=>q.lesson==='m3-sequence-radical-limit'&&q.family==='reciprocal-limit');
 assert.equal(qs.length,4);assert.equal(new Set(qs.map(q=>q.answer)).size,4);
 for(const [i,[a,b]]of [[1,1],[2,3],[4,1],[3,2]].entries()){
  for(const n of [1,2,5,100]){
   const root=Math.sqrt(n*n+a*n+b);
   assert.ok(root>n);
   assert.ok(Math.abs(1/(root-n)-(Math.sqrt(1+a/n+b/(n*n))+1)/(a+b/n))<1e-10);
  }
  assert.ok(qs[i].steps.some(s=>s.text.includes('n>0')));
 }
 // Algebraic justification is in the worked solution, numerical checks are only a regression.
 const repaired=lessons.find(l=>l.slug==='m3-rationalizing-limits').supplements.find(s=>s.id==='root');
 assert.ok(repaired.tex.includes('x\\geqq-1'));
 const b=lessons.find(l=>l.slug==='mb-telescoping');
 assert.ok(b.supplements.every(s=>!s.text.includes('\\frac12-\\frac13)+\\cdots+(\\frac1{2}')));
});
test('all diagnostic questions and targeted worked repairs use actual shared math display components',async()=>{
 const {CheckCard,RepairCard}=await loadDisplay('ReviewGuide');
 for(const c of prerequisiteChecks){
  const repair=lessons.find(l=>l.slug===c.lesson).supplements.find(r=>r.id===c.repair);
  const html=renderToStaticMarkup(React.createElement('section',null,
   React.createElement(CheckCard,{check:c,onResult:()=>{}}),
   React.createElement(RepairCard,{repair})));
  assert.ok(!html.includes('math-error')&&!html.includes('katex-error'),c.id);
  // Strip KaTeX subtrees with balanced HTML nesting; plain body prose must not retain TeX.
  let depth=0;const plain=[];
  for(const part of html.split(/(<[^>]+>)/)){
   if(part.startsWith('<')){
    if(/^<[^/!][^>]*class="[^"]*\bkatex\b/.test(part)&&!depth){depth=1;continue;}
    if(depth){if(/^<\//.test(part))depth--;else if(!/^<!|\/>$|^<(?:br|hr|img|input)\b/.test(part))depth++;}
   }else if(!depth)plain.push(part);
  }
  assert.doesNotMatch(plain.join(''),/\$|\\[a-zA-Z]+/,c.id);
 }
});
