import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import katex from 'katex';
const cache=new Map();
function moduleURL(file){
 if(cache.has(file.href))return cache.get(file.href);
 const js=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace(/from\s+["'](\.\/[^"']+)["']/g,(_,p)=>'from '+JSON.stringify(moduleURL(new URL(p+'.ts',file))));
 const url='data:text/javascript;base64,'+Buffer.from(js).toString('base64');cache.set(file.href,url);return url;
}
const get=async f=>import(moduleURL(new URL('../app/content/'+f+'.ts',import.meta.url)));
const {juniorLessons:lessons,juniorExercises:exercises,juniorBanks:banks}=await get('junior');
const {foundationMap,foundationsFor,knownExercise,knownReviewOf}=await get('foundation-links');
const strings=x=>typeof x==='string'?[x]:Array.isArray(x)?x.flatMap(strings):x&&typeof x==='object'?Object.values(x).flatMap(strings):[];
const qs=(slug,family)=>{const s=banks.find(b=>b.lesson.slug==='jr-'+slug).skills.find(s=>s.id===family);return [s.sample,...s.items];};
const ns=[3,1,2,4,5,6,7,8];

test('junior curriculum, stages, all alternates and chapter coverage',t=>{
 assert.equal(lessons.length,37);
 t.diagnostic(JSON.stringify({totalPages:lessons.length,examples:lessons.reduce((n,l)=>n+l.examples.length,0),questions:exercises.length,ordinaryQuestions:banks.reduce((n,b)=>n+b.exercises.length,0),supplements:lessons.reduce((n,l)=>n+l.supplements.length,0)}));
 assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
 for(const chapter of new Set(lessons.map(l=>l.chapter))){
  const ls=lessons.filter(l=>l.chapter===chapter),es=exercises.filter(e=>ls.some(l=>l.slug===e.lesson));
  t.diagnostic(JSON.stringify({chapter,pages:ls.length,examples:ls.reduce((n,l)=>n+l.examples.length,0),questions:es.length}));
 }
 for(const l of lessons){
  assert.equal(l.subject,'中学数学');const es=exercises.filter(e=>e.lesson===l.slug);
  assert.equal(es.filter(e=>e.stage==='ready').length,2,l.slug);
  assert.ok(es.filter(e=>e.stage==='practice').length>=6,l.slug);
  for(const ex of l.examples)assert.ok(ex.guidedIds.every(id=>es.some(e=>e.id===id&&e.stage==='guided')),l.slug);
  for(const e of es){
   assert.ok(e.hints[0]?.length>5,e.id);
   assert.ok(l.supplements.some(s=>s.id===e.repair),e.id);
   assert.ok(es.some(a=>a.id!==e.id&&a.family===e.family&&a.prompt!==e.prompt&&['practice','review'].includes(a.stage)),e.id);
  }
  for(const p of l.prerequisites??[])assert.ok(lessons.some(x=>x.slug===p.slug),p.slug);
 }
 for(const b of banks){
  const check=lessons.find(l=>l.chapter===b.lesson.chapter&&l.practiceGroups);
  for(const s of b.skills){
   assert.equal(new Set([s.sample,...s.items].map(q=>q.prompt)).size,s.items.length+1,b.lesson.slug+s.id);
   for(const e of b.exercises.filter(e=>e.stage==='practice'&&e.family===s.id)){
    assert.ok(exercises.some(c=>c.lesson===check.slug&&c.stage==='practice'&&c.prompt===e.prompt&&c.family===b.lesson.slug+'-'+s.id),'check loses '+e.id);
   }
  }
 }
});
test('junior all formulas and captions use strict TeX and preserve notation',()=>{
 for(const text of strings({lessons,exercises})){
  assert.ok([...text].every(c=>c.charCodeAt(0)>=32||c==='\n'),'control character '+text);
  assert.equal((text.match(/\$/g)||[]).length%2,0,text);
  assert.doesNotMatch(text.replace(/\$[^$]*\$/g,'').replace(/数学[ABC]/g,'数学'),/\b[xyzrstijkABCOPFGHMN]\b|[₀-₉]/,'plain math '+text);
  for(const [,tex]of text.matchAll(/\$([^$]+)\$/g)){
   assert.doesNotMatch(tex,/\\binom|\//,tex);
   // Matrix row separators are valid; repeated TeX command escapes are not.
   assert.doesNotMatch(tex,/\\\\(?:frac|sqrt|vec|overline|cos|sin|pi)\b/,tex);
   katex.renderToString(tex,{throwOnError:true,strict:'error'});
  }
 }
});

test('foundation links stay narrow, ignore preparation and have an acyclic junior graph',()=>{
 for(const [source,targets]of Object.entries(foundationMap)){
  assert.ok(targets.length<=2);
  for(const target of targets){assert.ok(lessons.some(l=>l.slug===target),target);assert.notEqual(source,target);}
 }
 function visit(slug,path=[]){assert.ok(!path.includes(slug),'cycle '+path);for(const s of foundationMap[slug]??[])visit(s,[...path,slug]);}
 for(const slug of Object.keys(foundationMap))visit(slug);
 assert.deepEqual(foundationsFor({lesson:'mc-vector-length',family:'length',stage:'ready'}),[]);
 assert.deepEqual(foundationsFor({lesson:'mc-vectors-check',family:'mc-vector-length-length',stage:'practice'}),foundationMap['mc-vector-length']);
 assert.equal(knownExercise('constructor',exercises),undefined);
 assert.equal(knownExercise('https://example.com',exercises),undefined);
 assert.equal(knownExercise(exercises[0].id,exercises),exercises[0]);
 const q=exercises[0],other=exercises.find(e=>e.id!==q.id&&e.lesson===q.lesson&&e.family===q.family);
 assert.equal(knownReviewOf(other.id,q,exercises),other.id);
 assert.equal(knownReviewOf(q.id,q,exercises),undefined);
 assert.equal(knownReviewOf('constructor',q,exercises),undefined);
 assert.equal(knownReviewOf(exercises.find(e=>e.lesson!==q.lesson).id,q,exercises),undefined);
});
test('chapter checks retain zero, positive and negative square conditions and unbiased sampling',()=>{
 const squares=exercises.filter(q=>q.lesson==='jr-equations-check'&&q.stage==='practice'&&q.family.endsWith('-real-solutions'));
 assert.ok(squares.some(q=>q.prompt.includes('(x-1)^2=0')));
 assert.ok(squares.some(q=>q.prompt.includes('x^2=-4')));
 assert.ok(squares.some(q=>q.prompt.includes('x^2=4')));
 const sample=exercises.filter(q=>q.lesson==='jr-data-check'&&q.stage==='practice'&&q.family.endsWith('-bias'));
 assert.ok(sample.some(q=>q.answer.startsWith('無作為')));
 assert.ok(sample.some(q=>q.answer.startsWith('適切とは')));
});
test('signs, powers, roots and geometric lengths use independently checked answers',()=>{
 for(const [i,n] of ns.entries()){
  assert.equal(qs('signed-add','add')[i].answer,`$${n-5}$。`);
  assert.equal(qs('signed-add','subtract')[i].answer,`$${n+5}$。`);
  assert.equal(qs('substitution','square')[i].answer,`$${n*n}$。`);
  assert.equal(qs('square-roots','radical')[i].answer,`$${Math.sqrt(n*n)}$。`);
  assert.equal(qs('pythagoras','hypotenuse')[i].answer,`$${Math.hypot(3*n,4*n)}$。`);
  assert.equal(qs('pythagoras','leg')[i].answer,`$${Math.sqrt((5*n)**2-(3*n)**2)}$。`);
  assert.equal(qs('similarity','area')[i].answer,`$${n*3*3}$。`);
  assert.equal(qs('averages','mean')[i].answer,`$${[n+5,n,n+2,n+1].reduce((s,x)=>s+x,0)/4}$。`);
 }
});
