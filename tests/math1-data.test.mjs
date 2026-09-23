import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
import katex from 'katex';
function moduleURL(file){
 const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 return 'data:text/javascript;base64,'+Buffer.from(code.replace(/from\s+["']([^"']+)["']/g,(_,p)=>'from '+JSON.stringify(p.startsWith('.')?moduleURL(new URL(p+(existsSync(new URL(p+'.ts',file))?'.ts':'.tsx'),file)):import.meta.resolve(p)))).toString('base64');
}
const {math1Chapter5Topics:topics,math1Chapter5Lessons:lessons,math1Chapter5Exercises:exercises,math1DataCoverage:coverage,math1DataCheckLesson:check}=await import(moduleURL(new URL('../app/content/math1-chapter5.ts',import.meta.url)));
const {quartiles,median,variance,frac}=await import(moduleURL(new URL('../app/content/math1-data-authoring.ts',import.meta.url)));
const {histogramData}=await import(moduleURL(new URL('../app/content/math1-data-distributions.ts',import.meta.url)));
const {correlationCases,correlationParts}=await import(moduleURL(new URL('../app/content/math1-data-relationships.ts',import.meta.url)));
const {coinSimulation,simulateFairCoins}=await import(moduleURL(new URL('../app/content/math1-data-inference.ts',import.meta.url)));
const {mathOneDataFigures:figures}=await import(moduleURL(new URL('../app/components/MathOneDataDiagrams.tsx',import.meta.url)));
const {math1DataTables:tables}=await import(moduleURL(new URL('../app/content/math1-data-tables.ts',import.meta.url)));
test('data chapter has fourteen complete lessons and operation-specific repairs',()=>{
 assert.equal(topics.length,14);assert.equal(lessons.length,15);
 for(const{lesson,exercises:es}of topics){
  assert.equal(lesson.chapter,'データの分析');assert.match(lesson.introduction.join(''),/仮想/);
  assert.equal(es.filter(e=>e.stage==='ready').length,2);
  assert.ok(es.filter(e=>e.stage==='practice').length>=6,lesson.slug);
  assert.deepEqual(lesson.examples.flatMap(e=>e.guidedIds).sort(),es.filter(e=>e.stage==='guided').map(e=>e.id).sort());
 }
 assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
 for(const e of exercises){
  assert.ok(e.prompt&&e.answer&&e.hints[0]&&e.steps[0]?.text,e.id);
  assert.ok(lessons.find(l=>l.slug===e.lesson).supplements.some(s=>s.id===e.repair),e.id);
  assert.ok(exercises.some(a=>a.lesson===e.lesson&&a.family===e.family&&a.id!==e.id&&a.prompt!==e.prompt&&['practice','review'].includes(a.stage)),e.id);
 }
});
function walk(value,visit,path=''){
 if(typeof value==='string')visit(value,path);
 else if(Array.isArray(value))value.forEach((v,i)=>walk(v,visit,path+'/'+i));
 else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>walk(v,visit,path+'/'+k));
}
test('all data formulas use strict TeX and no accidental linebreaks',()=>{
 walk([lessons,exercises,figures,tables],(text,path)=>{
  assert.equal((text.match(/\$/g)||[]).length%2,0,path);
  assert.doesNotMatch(text,/\$\{/,path);
  assert.ok([...text].every(c=>c.charCodeAt(0)>=32||c==='\n'||c==='\r'||c==='\t'),path);
  const formulas=[...text.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
  if(path.endsWith('/tex')&&text)formulas.push(text);
  for(const tex of formulas){
   assert.doesNotMatch(tex,/\/|\\binom|\\\\|\\sum/,tex);
   const html=katex.renderToString(tex,{strict:'error',throwOnError:true,output:'htmlAndMathml'});
   if(tex.includes('\\sqrt'))assert.match(html,/<msqrt>/,tex);
  }
 });
});
test('chapter check retains explicit decisions in its practice body',()=>{
 assert.equal(check.practiceGroups.length,4);
 const practice=exercises.filter(e=>e.lesson===check.slug&&e.stage==='practice');
 assert.deepEqual(check.practiceGroups.flatMap(g=>g.exerciseIds).sort(),practice.map(e=>e.id).sort());
 for(const{lesson,exercises:es}of topics)for(const family of new Set(es.map(e=>e.family))){
  const c=coverage.find(c=>c.lesson===lesson.slug&&c.family===family);assert.ok(c,lesson.slug+'/'+family);assert.ok(c.sourceIds.length>=2);
  for(const id of c.sourceIds){const q=es.find(e=>e.id===id);assert.ok(practice.some(e=>e.family===c.checkFamily&&e.prompt===q.prompt),id);}
 }
});
test('quartiles use sorted halves excluding an odd overall median',()=>{
 assert.equal(median([4,1,3,2]),2.5);
 assert.deepEqual(quartiles([7,1,3,5,9]),[1,2,5,8,9]);
 assert.deepEqual(quartiles([1,2,4,6,8,9]),[1,2,5,8,9]);
 assert.deepEqual(quartiles([0,1,2,3,4,5,6]),quartiles([0,1,1,3,4,5,6]));
});
test('histogram includes lower edges, excludes upper edges and conserves count',()=>{
 const {values,edges,counts}=histogramData;
 assert.deepEqual(edges.slice(0,-1).map((lo,i)=>values.filter(x=>lo<=x&&x<edges[i+1]).length),counts);
 assert.equal(counts.reduce((a,b)=>a+b,0),values.length);
});
test('population variance and affine transformation preserve squared deviations',()=>{
 assert.equal(variance([2,4,4,6]),2);assert.equal(variance([7,7,7]),0);
 const data=[[0,1,2,3],[-2,1,5],[2,2,3,7]];
 for(const xs of data)for(const a of [-3,-1,0,1,2])for(const b of [-4,0,8]){
  const ys=xs.map(x=>a*x+b);assert.ok(Math.abs(variance(ys)-a*a*variance(xs))<1e-10);
  assert.ok(Math.abs(Math.sqrt(variance(ys))-Math.abs(a)*Math.sqrt(variance(xs)))<1e-10);
 }
 assert.equal(frac(0,5),'0');assert.equal(frac(3,-6),'-\\frac{1}{2}');
});
test('paired products yield positive negative and zero correlations',()=>{
 const expected=[0.5,-0.5,1,-1,0,0.5];
 correlationCases.forEach((pairs,i)=>{const p=correlationParts(pairs);assert.ok(p.xx>0&&p.yy>0);assert.ok(Math.abs(p.xy/Math.sqrt(p.xx*p.yy)-expected[i])<1e-12);});
});
test('simulation is reproducible and evaluates upper tails, not exact counts',()=>{
 assert.deepEqual(coinSimulation.counts,[11,105,428,1218,2037,2470,2012,1182,427,99,11]);
 assert.deepEqual(simulateFairCoins(),coinSimulation.counts);
 assert.equal(coinSimulation.counts.reduce((a,b)=>a+b,0),10000);
 assert.equal(coinSimulation.counts.slice(9).reduce((a,b)=>a+b,0),110);
 assert.notEqual(coinSimulation.counts[9],110);
 assert.match(topics.find(t=>t.lesson.slug==='m1-hypothesis-thinking').lesson.introduction.join(''),/互いに独立/);
});
test('review splits preserve the decision and every review has its own compatible alternate',()=>{
 const expected={
  'm1-distribution-comparison-boxplot-limits-4-v1':'median-ties',
  'm1-distribution-comparison-outlier-treatment-5-v1':'correct-record',
  'm1-distribution-comparison-outlier-treatment-4-v1':'outlier-summary',
  'm1-distribution-comparison-compare-distributions-4-v1':'iqr-from-quartiles',
  'm1-correlation-causality-fair-comparison-6-v1':'randomized-uncertainty',
  'm1-data-judgment-inference-design-1-v1':'independence-check',
  'm1-data-judgment-inference-design-5-v1':'conditional-probability-meaning',
  'm1-data-judgment-inference-design-6-v1':'nonrejection-limits',
  'm1-data-judgment-inference-design-4-v1':'predeclared-rule',
  'm1-data-judgment-data-conclusion-5-v1':'median-not-distribution',
  'm1-data-judgment-data-conclusion-6-v1':'mean-not-everyone',
 };
 for(const[id,family]of Object.entries(expected)){const e=exercises.find(e=>e.id===id);assert.equal(e.family,family);assert.equal(e.repair,family);}
 for(const e of exercises.filter(e=>e.stage==='review')){
  const alternates=exercises.filter(a=>a.lesson===e.lesson&&a.family===e.family&&a.id!==e.id&&a.prompt!==e.prompt&&['practice','review'].includes(a.stage));
  assert.ok(alternates.length,e.id);
 }
});
test('hypothesis questions and decision supplements are self-contained',()=>{
 const bank=topics.find(t=>t.lesson.slug==='m1-hypothesis-thinking');
 for(const e of bank.exercises.filter(e=>e.family.startsWith('simulation-'))){
  assert.match(e.prompt,/\\frac12/);assert.match(e.prompt,/互いに独立/);assert.match(e.prompt,/\$10\$/);
 }
 for(const s of bank.lesson.supplements.filter(s=>s.id.startsWith('simulation-'))){assert.match(s.text,/互いに独立/);assert.match(s.text,/\\frac12/);}
});
test('figures and tables match the exact data, axes and example positions',()=>{
 assert.equal(Object.values(figures).flat().filter(Boolean).length,6);
 for(const [slug,list]of Object.entries(figures))list.forEach((f,i)=>{
  if(!f)return;assert.ok(lessons.find(l=>l.slug===slug)?.examples[i]);
  assert.ok(f.xRange[0]<f.xRange[1]&&f.yMax>0);
  for(const b of f.bars??[]){assert.ok(b.lo>=f.xRange[0]&&b.hi<=f.xRange[1]);assert.ok(b.value>=0&&b.value<=f.yMax);}
  for(const[x,y]of f.points??[]){assert.ok(x>=f.xRange[0]&&x<=f.xRange[1]);assert.ok(y>=0&&y<=f.yMax);}
 });
 assert.deepEqual(figures['m1-boxplot'][0].five,[1,2,5,8,9]);
 assert.equal(figures['m1-hypothesis-thinking'][0].bars.filter(b=>b.highlight).reduce((a,b)=>a+b.value,0),110);
 for(const ts of Object.values(tables))for(const table of ts)for(const row of table.rows)assert.equal(row.length,table.headers.length);
});
test('example guidance, repair checks and variance method choice preserve their actual task',()=>{
 const distributions=topics.find(t=>t.lesson.slug==='m1-distribution-comparison');
 const example=distributions.lesson.examples.find(e=>e.id==='boxplot-limits');
 const guided=distributions.exercises.find(e=>e.id===example.guidedIds[0]);
 assert.equal(guided.family,'boxplot-limits');
 const repair=distributions.lesson.supplements.find(s=>s.id==='boxplot-limits');
 assert.match(repair.check,/分布に山/);assert.doesNotMatch(repair.check,/人数/);
 const methods=topics.find(t=>t.lesson.slug==='m1-variance-calculation').exercises.filter(e=>e.family==='variance-method-choice');
 assert.equal(methods.length,4);
 assert.ok(methods.every(q=>/理由/.test(q.prompt)&&/他の|別解/.test(q.answer+q.steps[0].text)));
 const c=coverage.find(c=>c.lesson==='m1-variance-calculation'&&c.family==='variance-method-choice');
 assert.equal(c.sourceIds.length,4);
});
