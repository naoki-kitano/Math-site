import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import katex from 'katex';

function moduleURL(file) {
  const source=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  const resolved=source.replace(/from\s+["'](\.\/[^"']+)["']/g,(_,relative)=>'from '+JSON.stringify(moduleURL(new URL(relative+'.ts',file))));
  return 'data:text/javascript;base64,'+Buffer.from(resolved).toString('base64');
}
const {math1Chapter1Drafts:drafts}=await import(moduleURL(new URL('../app/content/math1-chapter1.ts',import.meta.url)));

test('drafts have stable IDs, explicit example associations and independent same-skill alternates',()=>{
  assert.equal(drafts.length,16);
  const all=drafts.flatMap(d=>d.exercises);
  assert.equal(all.length,372);
  assert.equal(new Set(all.map(e=>e.id)).size,all.length);
  for(const {lesson,exercises} of drafts) {
    assert.equal(lesson.subject,'数学I');
    assert.equal(exercises.filter(e=>e.stage==='ready').length,2);
    const guided=exercises.filter(e=>e.stage==='guided').map(e=>e.id);
    const assigned=lesson.examples.flatMap(e=>e.guidedIds);
    assert.deepEqual([...assigned].sort(),[...guided].sort());
    assert.equal(new Set(assigned).size,assigned.length);
    assert.equal(new Set(lesson.examples.map(e=>e.id)).size,lesson.examples.length);
    for(const e of exercises) {
      assert.equal(e.lesson,lesson.slug);
      assert.ok(e.prompt&&e.answer&&e.hints[0]&&e.steps[0].text,e.id);
      assert.ok(lesson.supplements.some(s=>s.id===e.repair),e.id);
      const candidates=exercises.filter(c=>c.family===e.family&&['practice','review'].includes(c.stage));
      assert.ok(candidates.length>=2,e.id);
      assert.ok(candidates.some(c=>c.id!==e.id&&c.prompt!==e.prompt),e.id);
    }
  }
});

test('every draft formula renders strictly and respects fraction notation',()=>{
  let count=0;
  function walk(value,key='') {
    if(typeof value==='string') {
      const formulas=key==='tex'?[value]:[...value.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
      assert.ok([...value].every(c=>c.charCodeAt(0)>=32||c==='\n'||c==='\t'),'control character in '+key);
      assert.equal((value.match(/\$/g)||[]).length%2,0,value);
      for(const formula of formulas) {
        assert.ok(!/(?<![\\a-zA-Z])(?:frac|dfrac|sqrt|ldots|qquad|cdot|left|right)/.test(formula),formula);
        assert.ok(!/(?<!\\)cdot/.test(formula),formula);
        assert.ok(!formula.includes('/')&&!formula.includes('\\binom'),formula);
        katex.renderToString(formula,{throwOnError:true,strict:'error'});
        count++;
      }
    } else if(Array.isArray(value)) value.forEach(v=>walk(v));
    else if(value&&typeof value==='object') Object.entries(value).forEach(([k,v])=>walk(v,k));
  }
  walk(drafts);
  assert.ok(count>200);
});

test('root, boundary and integer decisions retain operation-specific repairs and chapter sources',async()=>{
 const {math1CheckExercises:check,math1CheckCoverage:coverage}=await import(moduleURL(new URL('../app/content/math1-chapter-check.ts',import.meta.url)));
 const all=drafts.flatMap(d=>d.exercises);
 const required={
  'm1-square-roots':['zero-root'],
  'm1-radical-calculation':['quotient','difference','unlike-roots','sum-invalid'],
  'm1-absolute-distance':['zero-distance'],
  'm1-linear-inequalities':['both-sides','brackets'],
  'm1-simultaneous-inequalities':['singleton','same-direction','empty'],
  'm1-inequality-modeling':['integer-words'],
 };
 for(const [lesson,families] of Object.entries(required))for(const family of families){
  const c=coverage.find(c=>c.lesson===lesson&&c.family===family);
  assert.ok(c,lesson+'/'+family);
  assert.ok(check.some(e=>e.family===c.checkFamily&&e.stage==='practice'));
  assert.ok(check.some(e=>e.family===c.checkFamily&&e.stage==='review'));
 }
 for(const d of drafts)assert.equal(new Set(d.lesson.supplements.map(s=>s.id)).size,d.lesson.supplements.length);
 assert.equal(all.find(e=>e.id==='m1-radical-calculation-product-4-v1').family,'quotient');
 assert.equal(all.find(e=>e.id==='m1-radical-calculation-sum-invalid-1-v1').stage,'practice');
 assert.equal(all.find(e=>e.id==='m1-absolute-distance-distance-4-v1').family,'zero-distance');
 assert.ok(!all.find(e=>e.id==='m1-square-roots-all-roots-3-v1').hints[0].includes('正負とも'));
 for(const e of all.filter(e=>e.lesson==='m1-simultaneous-inequalities'&&e.family==='empty'))assert.ok(e.answer.includes('両立しません'),e.id);
 const practice=check.filter(e=>e.stage==='practice').map(e=>e.prompt);
 for(const id of ['m1-product-identities-p-square-minus-v1','m1-product-identities-p-square-coefficient-v1','m1-product-identities-p-square-fraction-v1','m1-quadratic-factorization-monic-2-v1','m1-radical-calculation-product-4-v1','m1-absolute-distance-interval-3-v1'])assert.ok(practice.includes(all.find(e=>e.id===id).prompt),id);
});

// Exact integer-coefficient polynomial arithmetic: checks identities, not samples.
function polynomial(source){
 const tokens=source.replace(/\s/g,'').match(/\d+|[-xy()+*^]/g);
 assert.equal(tokens.join(''),source.replace(/\s/g,''),source);
 let i=0;
 const constant=n=>new Map([['0,0',n]]);
 const add=(a,b,s=1)=>{const c=new Map(a);for(const[k,v]of b)c.set(k,(c.get(k)||0)+s*v);return c;};
 const mul=(a,b)=>{const c=new Map();for(const[ak,av]of a)for(const[bk,bv]of b){const aa=ak.split(',').map(Number),bb=bk.split(',').map(Number),k=[aa[0]+bb[0],aa[1]+bb[1]].join(',');c.set(k,(c.get(k)||0)+av*bv);}return c;};
 function atom(){let a;if(tokens[i]==='('){i++;a=sum();assert.equal(tokens[i++],')');}else if(tokens[i]==='x'||tokens[i]==='y'){a=new Map([[tokens[i++]==='x'?'1,0':'0,1',1]]);}else{assert.match(tokens[i],/^\d+$/);a=constant(Number(tokens[i++]));}if(tokens[i]==='^'){i++;const n=Number(tokens[i++]),base=a;a=constant(1);for(let j=0;j<n;j++)a=mul(a,base);}return a;}
 function product(){let s=1;while(tokens[i]==='+'||tokens[i]==='-'){if(tokens[i++]==='-')s=-s;}let a=mul(constant(s),atom());while(i<tokens.length&&tokens[i]!==')'&&tokens[i]!=='+'&&tokens[i]!=='-'){if(tokens[i]==='*')i++;a=mul(a,atom());}return a;}
 function sum(){let a=product();while(tokens[i]==='+'||tokens[i]==='-'){const s=tokens[i++]==='+'?1:-1;a=add(a,product(),s);}return a;}
 const a=sum();assert.equal(i,tokens.length);return [...a].filter(([,v])=>v!==0).sort(([a],[b])=>a.localeCompare(b));
}
test('every factoring answer expands to the full original polynomial',()=>{
 let count=0;
 for(const d of drafts.filter(d=>['m1-common-factors','m1-quadratic-factorization','m1-grouping'].includes(d.lesson.slug))){
  for(const e of d.exercises.filter(e=>!['number-product'].includes(e.family))){
   const p=e.prompt.match(/\$([^$]+)\$/)[1],a=e.answer.match(/\$([^$]+)\$/)[1];
   assert.deepEqual(polynomial(a),polynomial(p),e.id);count++;
  }
  for(const example of d.lesson.examples){
   const p=example.prompt.match(/\$([^$]+)\$/)[1],a=example.steps.at(-1).text.match(/\$([^$]+)\$/)[1];
   assert.deepEqual(polynomial(a),polynomial(p),example.title);count++;
  }
 }
 assert.ok(count>=50);
});

test('linear inequality answers preserve exact boundaries and integer models check both neighbours',()=>{
 const all=drafts.flatMap(d=>d.exercises);
 function number(s){const match=s.match(/^(-?)\\frac\{(\d+)\}\{(\d+)\}$/);return match?(match[1]?-1:1)*Number(match[2])/Number(match[3]):Number(s);}
 for(const e of all.filter(e=>e.lesson==='m1-linear-inequalities'&&['positive','negative'].includes(e.family))){
  const p=e.prompt.match(/\$(-?\d+)x([+-]\d+)(<|\\le)(-?\d+)\$/);
  const a=e.answer.match(/\$x(\\ge|\\le|>|<)([^$]+)\$/);
  assert.ok(p&&a,e.id);
  assert.equal(number(a[2]),(Number(p[4])-Number(p[2]))/Number(p[1]),e.id);
  assert.equal(a[1],Number(p[1])>0?p[3]:(p[3]==='<'?'>':'\\ge'),e.id);
 }
 for(const e of all.filter(e=>e.lesson==='m1-inequality-modeling'&&['budget','threshold'].includes(e.family))){
  const inputs=[...e.prompt.matchAll(/\$(\d+)\$/g)].map(m=>Number(m[1]));
  const n=Number(e.answer.match(/\$(\d+)\$/)[1]);
  if(e.family==='budget'){const[p,f,b]=inputs;assert.ok(n*p+f<=b&&(n+1)*p+f>b,e.id);}
  else{const[p,t]=inputs;assert.ok(n*p>t&&(n-1)*p<=t,e.id);}
 }
});

test('mathematics I is registered with its chapter check in the local lesson index',()=>{
  const index=readFileSync(new URL('../app/content/lessons.ts',import.meta.url),'utf8');
  assert.ok(index.includes('math1-chapter1'));
  assert.ok(index.includes('math1CheckLesson'));
});

test('review repairs distinguish insufficient information from decimal properties and left-to-right operations',()=>{
  const all=drafts.flatMap(d=>d.exercises);
  const byKey=id=>all.find(e=>e.id===id);
  for(const [id,family] of [
    ['m1-real-numbers-p-prefix-v1','insufficient-digits'],
    ['m1-real-numbers-v-prefix-v1','insufficient-digits'],
    ['m1-real-numbers-p-infinite-v1','decimal-judgment'],
    ['m1-real-numbers-v-judgment-v1','decimal-judgment'],
    ['m1-substitution-v-order-v1','left-to-right'],
    ['m1-substitution-v-left-to-right-v1','left-to-right'],
    ['m1-substitution-v-brackets-v1','order'],
    ['m1-terms-degree-p-zero-v1','zero-degree'],
    ['m1-terms-degree-v-zero-v1','zero-degree'],
    ['m1-like-terms-v-signed-a-v1','signed'],
    ['m1-like-terms-v-signed-b-v1','subtract-negative'],
  ]) {
    assert.equal(byKey(id).family,family);
    assert.equal(byKey(id).repair,family);
  }
  const supplement=drafts[1].lesson.supplements.find(s=>s.id==='left-to-right');
  assert.ok(supplement.text.includes('左から'));
  assert.ok(supplement.answer.includes('8'));
  assert.deepEqual(drafts.slice(0,6).map(d=>d.lesson.slug),['m1-real-numbers','m1-substitution','m1-terms-degree','m1-like-terms','m1-distributive-expansion','m1-product-identities']);
  for(const d of drafts) {
    assert.ok(d.exercises.filter(e=>e.stage==='practice').length>=8);
    assert.ok(d.exercises.filter(e=>e.stage==='review').length>=4);
  }
});

test('expansion answers agree with independent polynomial coefficient multiplication',()=>{
  // Coefficients are in ascending degree order. This compares whole polynomials,
  // not their values at a handful of points. Fractions here are exact binary halves.
  const cases=[
    ['m1-distributive-expansion','g-one',[0,-2],[-4,3]],
    ['m1-distributive-expansion','g-two',[-2,3],[1,1]],
    ['m1-distributive-expansion','p-one-a',[0,2],[3,1]],
    ['m1-distributive-expansion','p-one-b',[0,3],[1,2]],
    ['m1-distributive-expansion','p-negative',[0,-4],[-2,1]],
    ['m1-distributive-expansion','p-fraction',[0,0.5],[-6,4]],
    ['m1-distributive-expansion','p-two-a',[2,1],[4,1]],
    ['m1-distributive-expansion','p-two-b',[-3,1],[2,1]],
    ['m1-distributive-expansion','p-two-c',[1,2],[-4,1]],
    ['m1-distributive-expansion','p-two-d',[-2,1],[-5,1]],
    ['m1-distributive-expansion','p-three',[1,1],[2,-1,1]],
    ['m1-distributive-expansion','v-three',[2,1],[1,-1,1]],
    ['m1-product-identities','g-square',[-2,3],[-2,3]],
    ['m1-product-identities','g-conjugates',[3,2],[-3,2]],
    ['m1-product-identities','p-square-a',[4,1],[4,1]],
    ['m1-product-identities','p-square-b',[5,1],[5,1]],
    ['m1-product-identities','p-square-minus',[-3,1],[-3,1]],
    ['m1-product-identities','p-square-coefficient',[1,2],[1,2]],
    ['m1-product-identities','p-conjugates-a',[7,1],[-7,1]],
    ['m1-product-identities','p-conjugates-b',[-1,4],[1,4]],
    ['m1-product-identities','g-common',[-2,1],[3,1]],
    ['m1-product-identities','p-common',[3,1],[5,1]],
    ['m1-product-identities','v-common',[-4,1],[-1,1]],
  ];
  const exercises=drafts.flatMap(d=>d.exercises);
  for(const [slug,key,a,b] of cases) {
    const result=Array(a.length+b.length-1).fill(0);
    a.forEach((x,i)=>b.forEach((y,j)=>{result[i+j]+=x*y;}));
    let tex='';
    for(let n=result.length-1;n>=0;n--) {
      const c=result[n];
      if(!c)continue;
      assert.ok(Number.isInteger(c));
      tex+=(c<0?'-':tex?'+':'')+(Math.abs(c)===1&&n?'':Math.abs(c))+(n?(n===1?'x':'x^'+n):'');
    }
    const exercise=exercises.find(e=>e.id===`${slug}-${key}-v1`);
    assert.equal(exercise.answer.match(/\$([^$]+)\$/)[1],tex,exercise.id);
  }
});

test('formula choices include both outcomes, three-term distribution and common-term products have their own repair',()=>{
  const d=drafts.find(d=>d.lesson.slug==='m1-product-identities');
  for(const stage of ['practice','review']) {
    const choices=d.exercises.filter(e=>e.stage===stage&&e.family==='choice');
    assert.ok(choices.some(e=>e.answer.startsWith('使えます。')));
    assert.ok(choices.some(e=>e.answer.startsWith('使えません。')));
  }
  assert.equal(d.lesson.examples.length,3);
  assert.equal(d.exercises.filter(e=>e.stage==='guided').length,4);
  assert.equal(d.lesson.examples.find(e=>e.id==='conjugates').guidedIds.length,2);
  assert.ok(d.lesson.examples.some(e=>e.id==='common'));
  for(const [slug,family,keys] of [
    ['m1-distributive-expansion','three',['p-three','v-three']],
    ['m1-product-identities','common',['g-common','p-common','v-common']],
  ]) {
    const draft=drafts.find(d=>d.lesson.slug===slug);
    assert.ok(draft.lesson.supplements.some(s=>s.id===family&&s.answer));
    for(const key of keys) {
      const question=draft.exercises.find(e=>e.id===`${slug}-${key}-v1`);
      assert.equal(question.family,family);
      assert.equal(question.repair,family);
    }
  }
});
