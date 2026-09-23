import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {loadContent,contentModule} from '../scripts/content-module.mjs';
const {lessons,exercises,exerciseById}=await loadContent('lessons');
const {reviewChecks,lessonChecks,checksFor,preparationChecks}=await loadContent('review-checks');
const {legacyReviewGroups,preferredReviewIds}=await loadContent('review-family-refinement');
const {parseBackup,stateFor,alternateFor,DAY}=await import(contentModule(new URL('../app/lib/progress.ts',import.meta.url)));
const strings=x=>typeof x==='string'?[x]:Array.isArray(x)?x.flatMap(strings):x&&typeof x==='object'?Object.values(x).flatMap(strings):[];
test('short review checks have explicit answers, valid targets and strictly typeset formulas',()=>{
 assert.equal(new Set(reviewChecks.map(c=>c.id)).size,reviewChecks.length);
 assert.ok(reviewChecks.length>=30);
 for(const c of reviewChecks){
  assert.ok(lessons.some(l=>l.slug===c.lesson),c.id);
  assert.ok(c.correct>=0&&c.correct<c.options.length);
  assert.equal(new Set(c.options).size,c.options.length);
  assert.ok(c.explanation.length>20);
  for(const s of strings(c)){
   assert.ok([...s].every(c=>c.charCodeAt(0)>=32||c==='\n'));
   assert.equal((s.match(/\$/g)||[]).length%2,0,s);
   for(const [,tex]of s.matchAll(/\$([^$]+)\$/g)){assert.doesNotMatch(tex,/\/|\\binom|\\\\/);katex.renderToString(tex,{strict:'error',throwOnError:true});}
  }
 }
 assert.ok(reviewChecks.find(c=>c.id==='point').options[0].includes('\\cdot'));
 for(const slug of Object.keys(lessonChecks))assert.ok(lessons.some(l=>l.slug===slug),slug);
});
test('help is bounded, respects chapter source and does not turn conditions into calculation tasks',()=>{
 for(const q of exercises){
  const checks=checksFor(q);assert.ok(checks.length<=2,q.id);
  assert.ok(checks.every(c=>c.lesson!==q.lesson));
  if(q.stage==='ready'||q.family.startsWith('prep-'))assert.equal(checks.length,0,q.id);
 }
 for(const [lesson,family]of [['rational','domain'],['mc-vector-angle','angle-condition'],['mc-complex-polar','argument-existence'],['m3-reverse-chain-integrals','applicability'],['m1-set-operations','intersection'],['m1-set-operations','union']]){
  assert.deepEqual(checksFor({lesson,family,stage:'practice'}),[]);
 }
 const e=exercises.find(q=>q.lesson==='m3-partial-fractions'&&q.stage==='practice');
 assert.equal(checksFor(e)[0].lesson,'mb-partial-fractions');
 const chapter=exercises.find(q=>q.family==='mc-vector-angle-angle'&&q.lesson!=='mc-vector-angle');
 assert.deepEqual(checksFor(chapter).map(c=>c.id),checksFor({lesson:'mc-vector-angle',family:'angle',stage:'practice'}).map(c=>c.id));
 assert.equal(preparationChecks('mb-mean-interval')[0].id,'standard-error');
 assert.equal(preparationChecks('jr-angles')[0].id,'straight-angle');
 assert.equal(checksFor({lesson:'m3-second-derivative',family:'second-derivative',stage:'practice'})[0].id,'derivative');
 const visit=(slug,path=[])=>{assert.ok(!path.includes(slug),'review cycle '+[...path,slug]);for(const c of preparationChecks(slug)){if(c.lesson!==slug)visit(c.lesson,[...path,slug]);}};
 for(const slug of Object.keys(lessonChecks))visit(slug);
});
test('refined inference families cover chapter decisions and retain legacy backups without false mastery',()=>{
 const old=exercises.filter(e=>e.lesson==='mb-inference-meaning'&&legacyReviewGroups.has(e.id));
 for(const a of old)for(const b of old){
  if(a.id===b.id||legacyReviewGroups.get(a.id)!==legacyReviewGroups.get(b.id))continue;
  const record={id:'legacy',exerciseId:a.id,reviewOf:b.id,at:Date.now()-DAY,outcome:'independent',method:'self'};
  const parsed=parseBackup(JSON.stringify({version:1,attempts:[record]}));assert.deepEqual(parsed,[record]);
  if(a.family!==b.family)assert.equal(stateFor(b.id,parsed).needsHelp,true);
 }
 const lesson=lessons.find(l=>l.slug==='mb-inference-meaning');
 assert.equal(new Set(exercises.filter(e=>e.lesson===lesson.slug&&!e.family.startsWith('prep')).map(e=>e.family)).size,10);
 for(const q of exercises.filter(e=>e.lesson===lesson.slug&&!e.family.startsWith('prep'))){
  const alt=alternateFor(q.id);assert.equal(alt.family,q.family);
  assert.ok(exercises.some(c=>c.lesson==='mb-inference-check'&&c.stage==='practice'&&c.family===lesson.slug+'-'+q.family));
 }
 for(const ex of lesson.examples){const guided=exerciseById[ex.guidedIds[0]];assert.ok(ex.title===lesson.supplements.find(s=>s.id===guided.repair).title);}
});
test('varied unit vectors and frequencies stay varied during later review, not only first practice',()=>{
 for(const [slug,family]of [['mc-vector-length','unit'],['mb-survey-simulation','frequency']]){
  const qs=exercises.filter(q=>q.lesson===slug&&q.family===family&&q.stage==='practice');
  assert.ok(qs.length>=4);assert.ok(new Set(qs.map(q=>q.answer)).size>=4);
  for(const source of qs){
   const history=[],answers=new Set();
   for(let i=0;i<4;i++){const alt=alternateFor(source.id,history);assert.ok(preferredReviewIds.has(alt.id));answers.add(alt.answer);history.push({id:'a'+i,exerciseId:alt.id,reviewOf:source.id,at:Date.now()-4*DAY+i*DAY,outcome:'independent',method:'self'});}
   assert.ok(answers.size>=2);
  }
 }
 // New exercises use independently checked directions, lengths, and ratios.
 for(const [i,[x,y,r]]of [[4,3,5],[-3,4,5],[0,-2,2],[5,12,13],[-4,-3,5],[1,0,1]].entries()){
  assert.equal(Math.hypot(x,y),r);assert.ok(Math.abs(Math.hypot(x/r,y/r)-1)<1e-12);
  assert.ok(exerciseById[`mc-vector-length-unit-varied-${i+1}-v1`]);
 }
});
test('endpoint angles and zero arguments occur in independent chapter practice as well as repair',()=>{
 const dot=lessons.find(l=>l.slug==='mc-vector-angle').introduction.join('');
 assert.ok(dot.includes('0\\leqq\\theta<\\frac\\pi2'));assert.ok(dot.includes('\\theta\\leqq\\pi'));
 for(const [chapter,family]of [['mc-vectors-check','mc-vector-angle-endpoint-angle'],['mc-complex-check','mc-complex-polar-argument-existence']]){
  const qs=exercises.filter(q=>q.lesson===chapter&&q.family===family&&q.stage==='practice');assert.ok(qs.length>=2);
  assert.ok(qs.every(q=>lessons.find(l=>l.slug===chapter).supplements.some(s=>s.id===q.repair)));
 }
 for(const slug of ['jr-linear-function','jr-quadratic-function','jr-proportion'])assert.ok(lessons.find(l=>l.slug===slug).introduction.join('').includes('a\\ne0'));
});
