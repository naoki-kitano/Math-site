import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import ts from 'typescript';
import katex from 'katex';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const compile = path => ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const url = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
function contentModule(file){
  const source=file.pathname.endsWith('.json')?'export default '+readFileSync(file,'utf8'):ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  return url(source.replace(/from\s+["'](\.\/[^"']+)["']/g,(_,relative)=>{
    const dependency=new URL(/\.(ts|json)$/.test(relative)?relative:relative+'.ts',file);
    return 'from '+JSON.stringify(contentModule(dependency));
  }));
}
const contentURL = contentModule(new URL('../app/content/lessons.ts',import.meta.url));
const {lessons,exercises,exerciseById} = await import(contentURL);
const progress = await import(url(compile('../app/lib/progress.ts').replace('"../content/lessons"',JSON.stringify(contentURL)).replace('"../content/review-family-refinement"',JSON.stringify(contentModule(new URL('../app/content/review-family-refinement.ts',import.meta.url))))));
const {DAY,parseBackup,mergeAttempts,stateFor,historyFor,attemptedExercises,alternateFor,matchesNumber,dueExercises} = progress;
const at = Date.now()-10*DAY;
const layout=await import(url(compile('../app/lib/lesson-layout.ts')));
const {subjectPath}=await import(contentModule(new URL('../app/content/chapters.ts',import.meta.url)));
const attempt=(id,exerciseId,outcome='independent',offset=0,reviewOf)=>({id,exerciseId,outcome,at:at+offset,method:exerciseById[exerciseId].kind==='paper'?'self':'auto',...(reviewOf?{reviewOf}:{})});

test('function explanations identify the base graph and home starts with junior mathematics',()=>{
 const home=readFileSync(new URL('../app/components/Home.tsx',import.meta.url),'utf8');
 assert.ok(home.indexOf('<h2>中学数学</h2>')<home.indexOf('<h2>数学I</h2>'));
 const radical=lessons.find(l=>l.slug==='m3-radical-functions');
 const text=JSON.stringify(radical);
 assert.ok(text.includes('基準'));
 const question=exerciseById['m3-radical-functions-5-v1'];
 assert.ok(question.prompt.includes(String.raw`$y=\sqrt{x}$`));
 assert.match(JSON.stringify(question),/\(0,-3\)/);
 const rational=lessons.find(l=>l.slug==='m3-rational-functions');
 assert.ok(!JSON.stringify(rational).includes('枝'));
 assert.ok(JSON.stringify(rational).includes('dfrac'));
 const figure=readFileSync(new URL('../app/components/Math3FunctionDiagrams.tsx',import.meta.url),'utf8');
 assert.ok(figure.includes('移動前')&&figure.includes('移動後'));
});

test('junior prerequisite routes exist across all subjects and preserve saved progress',async()=>{
 const {foundationMap,foundationsFor}=await import(contentModule(new URL('../app/content/foundation-links.ts',import.meta.url)));
 const subjects=new Set();
 for(const [slug,targets]of Object.entries(foundationMap)){
  const source=lessons.find(l=>l.slug===slug);assert.ok(source,'missing foundation source '+slug);
  subjects.add(source.subject??'数学II');
  for(const target of targets)assert.ok(lessons.some(l=>l.slug===target),target);
 }
 for(const s of ['数学I','数学A','数学II','数学B','数学III','数学C','中学数学'])assert.ok(subjects.has(s),s);
 const qs=exercises.filter(e=>e.lesson.startsWith('jr-'));
 for(const q of qs){
  const alt=alternateFor(q.id,[],Date.now());
  assert.ok(alt&&alt.id!==q.id&&alt.family===q.family,q.id);
  assert.ok(foundationsFor(q).length<=2);
 }
 const {default:Diagram}=await import(displayModule(new URL('../app/components/JuniorDiagrams.tsx',import.meta.url)));
 for(const l of lessons.filter(l=>l.slug.startsWith('jr-'))){
  const html=renderToStaticMarkup(React.createElement(Diagram,{slug:l.slug,index:0}));
  assert.ok(!html.includes('math-error')&&!html.includes('katex-error'),l.slug);
 }
 const seen=attempt('junior-seen',qs[0].id,'seen');
 assert.notEqual(stateFor(qs[0].id,[seen],Date.now()),'mastered');
});

// Exercise the real display consumers, not just KaTeX parsing of source strings.
// Share the loaded catalogue instead of embedding its multi-megabyte data URL recursively
// in every client component. This is the same object used by the assertions above.
globalThis.__mathcanvasDisplayContent={lessons,exercises,exerciseById};
const displayContentURL=url('export const {lessons,exercises,exerciseById}=globalThis.__mathcanvasDisplayContent;');
const displayCache=new Map();
function displayModule(file){
 if(file.href===new URL('../app/content/lessons.ts',import.meta.url).href)return displayContentURL;
 if(displayCache.has(file.href))return displayCache.get(file.href);
 const compiled=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const result=url(compiled.replace(/from\s+["']([^"']+)["']/g,(_,p)=>{
  if(p==='../content/lessons')return 'from '+JSON.stringify(displayContentURL);
  if(p==='./Practice')return 'from '+JSON.stringify(url('export const Practice=()=>null;export const Steps=()=>null;'));
  if(['./LessonDiagrams','./LessonTables','./MathOneDiagrams'].includes(p))return 'from '+JSON.stringify(url('export default ()=>null;'));
  return 'from '+JSON.stringify(p.startsWith('.')?displayModule(new URL(p+(existsSync(new URL(p+'.tsx',file))?'.tsx':'.ts'),file)):import.meta.resolve(p));
 }));
 displayCache.set(file.href,result);return result;
}
test('every subject card and lesson hero actually typesets its math description',async()=>{
 const {default:SubjectIndex}=await import(displayModule(new URL('../app/components/SubjectIndex.tsx',import.meta.url)));
 const {default:LessonView}=await import(displayModule(new URL('../app/components/LessonView.tsx',import.meta.url)));
 const {ProgressProvider}=await import(displayModule(new URL('../app/components/Progress.tsx',import.meta.url)));
 const {MathText}=await import(displayModule(new URL('../app/components/MathText.tsx',import.meta.url)));
 const indices=Object.fromEntries(['数学I','数学A','数学II','数学B','数学III','数学C','中学数学'].map(subject=>[subject,renderToStaticMarkup(React.createElement(SubjectIndex,{subject}))]));
 let checked=0;
 for(const lesson of lessons.filter(l=>l.description.includes('$'))){
  const expected=renderToStaticMarkup(React.createElement(MathText,{text:lesson.description}));
  assert.ok(indices[lesson.subject??'数学II'].includes(expected),'raw description in subject card: '+lesson.slug);
  const html=renderToStaticMarkup(React.createElement(ProgressProvider,null,React.createElement(LessonView,{lesson})));
  const hero=html.slice(0,html.indexOf('</section>'));
  assert.ok(hero.includes(expected),'raw description in lesson hero: '+lesson.slug);
  checked++;
 }
 assert.ok(checked>=3,'test must cover real formula-bearing descriptions');
});

test('every math table caption uses the same typesetter as its cells',async()=>{
 const {lessonTables}=await import(displayModule(new URL('../app/components/LessonTables.tsx',import.meta.url)));
 const {default:MathTable}=await import(displayModule(new URL('../app/components/MathTable.tsx',import.meta.url)));
 const {MathText}=await import(displayModule(new URL('../app/components/MathText.tsx',import.meta.url)));
 for(const tables of Object.values(lessonTables))for(const table of tables){
  const expected=renderToStaticMarkup(React.createElement(MathText,{text:table.caption}));
  const html=renderToStaticMarkup(React.createElement(MathTable,table));
  assert.ok(html.includes('<caption>'+expected+'</caption>'),'unprocessed caption: '+table.caption);
 }
});
test('each published lesson is complete and every exercise has a valid answer and repair',()=>{
  assert.equal(lessons.length,466); assert.equal(exercises.filter(e=>!e.lesson.startsWith('m1-')&&!e.lesson.startsWith('ma-')&&!e.lesson.startsWith('mb-')&&!e.lesson.startsWith('mc-')&&!e.lesson.startsWith('jr-')).length,2751);
  assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
  for(const l of lessons){
    assert.ok(l.examples.length>=2,l.slug);
    const checkCount=l.slug==='m3-function-limits-check'?11:l.slug==='m3-sequences-check'?10:l.slug==='chapter-one-check'?11:l.slug==='chapter-two-check'?9:l.slug==='chapter-four-check'?16:l.slug==='chapter-seven-check'?12:0;
    for(const [stage,count] of [['ready',2],['guided',2],['practice',checkCount||6],['review',checkCount||2]]) {
      const actual=exercises.filter(e=>e.lesson===l.slug&&e.stage===stage).length;
      if(l.subject==='数学I'||l.subject==='数学III'||l.subject==='数学A'||l.subject==='数学B'||l.subject==='数学C'||l.subject==='中学数学'||(['図形と方程式','指数関数・対数関数','微分の考え','積分の考え'].includes(l.chapter)&&l.slug!=='points')||l.slug==='trig-synthesis')assert.ok(actual>=count,l.slug+' '+stage);
      else assert.equal(actual,count,l.slug+' '+stage);
    }
  }
  for(const e of exercises){
    assert.ok(e.answer&&e.hints.length&&e.steps.length,e.id);
    assert.ok(lessons.find(l=>l.slug===e.lesson).supplements.some(s=>s.id===e.repair),e.id);
    if(e.kind==='choice')assert.ok(Number.isInteger(e.correct)&&e.correct>=0&&e.correct<e.options.length,e.id);
    if(e.kind==='number')assert.ok(Number.isFinite(e.correct),e.id);
  }
});

test('math I uses complete explicit guided groups and chapter-check sections without changing old layouts',()=>{
  const one=lessons.filter(l=>l.subject==='数学I');
  assert.equal(one.length,78);
  assert.equal(subjectPath('数学I'),'/math-one');
  assert.equal(subjectPath('数学II'),'/math-two');
  assert.equal(subjectPath('数学III'),'/math-three');
  for(const lesson of lessons) {
    const items=exercises.filter(e=>e.lesson===lesson.slug);
    if(lesson.guidedAfterExamples) {
      const guided=items.filter(e=>e.stage==='guided');
      const shown=lesson.examples.flatMap((e,i)=>layout.guidedForExample(e,i,guided));
      assert.deepEqual(shown.map(e=>e.id).sort(),guided.map(e=>e.id).sort(),lesson.slug);
    }
    if(lesson.subject==='数学I')for(const e of items) {
      const alternate=alternateFor(e.id);
      assert.ok(alternate,e.id);
      assert.equal(alternate.family,e.family);
      assert.equal(alternate.lesson,e.lesson);
      assert.notEqual(alternate.id,e.id);
      assert.notEqual(alternate.prompt,e.prompt,e.id+' needs a different question, not only a different ID');
    }
  }
  const check=one.find(l=>l.slug==='m1-number-expression-check');
  assert.equal(check.practiceGroups.length,4);
  const practice=exercises.filter(e=>e.lesson===check.slug&&e.stage==='practice');
  const grouped=check.practiceGroups.flatMap(g=>layout.practiceForGroup(check,g.id,practice));
  assert.equal(new Set(grouped.map(e=>e.id)).size,practice.length);
  assert.equal(grouped.length,practice.length);
  assert.deepEqual(layout.practiceForGroup(check,'all',practice),practice);
  const old=lessons.find(l=>l.slug==='rational');
  const original=exercises.filter(e=>e.lesson===old.slug&&e.stage==='practice');
  assert.deepEqual(layout.practiceForGroup(old,'all',original),original);
});

test('math I and existing records coexist under the same backup format and review attribution',()=>{
  const ids=['rational','m3-function-input','m1-common-factors'].map(slug=>exercises.find(e=>e.lesson===slug).id);
  const saved=ids.map((id,i)=>attempt('three-subjects-'+i,id));
  assert.deepEqual(parseBackup(JSON.stringify({version:1,attempts:saved})),saved);
  const original=exercises.find(e=>e.lesson==='m1-rationalizing'&&e.stage==='practice');
  const alternate=alternateFor(original.id);
  const answer=attempt('math1-review',alternate.id,'independent',DAY,original.id);
  const history=[...saved,answer];
  assert.equal(historyFor(original.id,history).length,1);
  assert.equal(historyFor(alternate.id,history).length,0);
});

test('math A integrates without changing old backup records and keeps all review decisions',()=>{
 assert.equal(subjectPath('数学A'),'/math-a');
 const a=exercises.find(e=>e.lesson==='ma-grouping'&&e.stage==='practice');
 const old=exercises.find(e=>e.lesson==='rational');
 const saved=[attempt('a-record',a.id),attempt('old-record',old.id)];
 assert.deepEqual(parseBackup(JSON.stringify({version:1,attempts:saved})),saved);
 for(const e of exercises.filter(e=>e.lesson.startsWith('ma-'))){
  const alt=alternateFor(e.id);
  assert.ok(alt,e.id);assert.equal(alt.family,e.family);assert.equal(alt.lesson,e.lesson);
  assert.notEqual(alt.prompt,e.prompt,e.id);
 }
 const alt=alternateFor(a.id),entry=attempt('a-review',alt.id,'independent',DAY,a.id);
 assert.equal(historyFor(a.id,[entry]).length,1);
 assert.equal(historyFor(alt.id,[entry]).length,0);
});
test('math B integrates with the same records and keeps review attribution',()=>{
 assert.equal(subjectPath('数学B'),'/math-b');
 const b=exercises.find(e=>e.lesson==='mb-one-sided-test'&&e.stage==='practice');
 const old=exercises.find(e=>e.lesson==='rational');
 const saved=[attempt('b-record',b.id),attempt('old-b-record',old.id)];
 assert.deepEqual(parseBackup(JSON.stringify({version:1,attempts:saved})),saved);
 for(const e of exercises.filter(e=>e.lesson.startsWith('mb-'))){
  const alt=alternateFor(e.id);
  assert.ok(alt,e.id);assert.equal(alt.family,e.family);assert.equal(alt.lesson,e.lesson);assert.notEqual(alt.prompt,e.prompt,e.id);
 }
 const alt=alternateFor(b.id),entry=attempt('b-review',alt.id,'independent',DAY,b.id);
 assert.equal(historyFor(b.id,[entry]).length,1);assert.equal(historyFor(alt.id,[entry]).length,0);
 for(const l of lessons.filter(l=>l.subject==='数学B'))for(const p of l.prerequisites??[])assert.ok(lessons.some(x=>x.slug===p.slug),p.slug);
});
test('math C integrates with existing progress and renders every new diagram',async()=>{
 assert.equal(subjectPath('数学C'),'/math-c');
 const e=exercises.find(e=>e.lesson==='mc-vector-angle'&&e.family==='angle-condition'&&e.stage==='practice');
 const saved=[attempt('c-record',e.id),attempt('old-c-record',exercises.find(e=>e.lesson==='rational').id)];
 assert.deepEqual(parseBackup(JSON.stringify({version:1,attempts:saved})),saved);
 for(const e of exercises.filter(e=>e.lesson.startsWith('mc-'))){
  const a=alternateFor(e.id);assert.ok(a,e.id);assert.equal(a.family,e.family);assert.equal(a.lesson,e.lesson);assert.notEqual(a.prompt,e.prompt,e.id);
 }
 const a=alternateFor(e.id),entry=attempt('c-review',a.id,'independent',DAY,e.id);
 assert.equal(historyFor(e.id,[entry]).length,1);assert.equal(historyFor(a.id,[entry]).length,0);
 const {default:Diagrams}=await import(displayModule(new URL('../app/components/MathCDiagrams.tsx',import.meta.url)));
 let count=0;
 for(const l of lessons.filter(l=>l.subject==='数学C'))for(let index=0;index<l.examples.length;index++){
  const html=renderToStaticMarkup(React.createElement(Diagrams,{slug:l.slug,index}));
  assert.ok(!html.includes('math-error'),l.slug+' '+index);
  if(html){assert.ok(html.includes('katex'),l.slug);count++;}
 }
 assert.equal(count,16);
});

test('math III chapter preserves exercise volume, prerequisites and same-skill review',()=>{
  const chapter=lessons.filter(l=>l.chapter==='関数を読むための基礎');
  assert.equal(chapter.length,9);
  for(const lesson of chapter){
    for(const p of lesson.prerequisites||[])assert.ok(lessons.some(l=>l.slug===p.slug),p.slug);
    const items=exercises.filter(e=>e.lesson===lesson.slug);
    assert.equal(items.filter(e=>e.stage==='practice').length,8);
    assert.equal(items.filter(e=>e.stage==='review').length,lesson.slug==='m3-functions-check'?8:4);
    if(lesson.guidedAfterExamples)assert.equal(items.filter(e=>e.stage==='guided').length,lesson.examples.length);
    for(const e of items){
      const variant=alternateFor(e.id);
      assert.ok(variant,e.id);
      assert.equal(variant.lesson,e.lesson);
      assert.equal(variant.family,e.family);
    }
  }
  const saved=[attempt('math2',exercises.find(e=>e.lesson==='rational').id),attempt('math3',exercises.find(e=>e.lesson==='m3-function-input').id)];
  // Preserve both subjects in the same validated backup without changing IDs.
  assert.deepEqual(parseBackup(JSON.stringify({version:1,attempts:saved})),saved);
});
test('math III sequences cover eleven decisions and preserve compatible review variants',()=>{
 const chapter=lessons.filter(l=>l.chapter==='数列の極限と無限級数');
 assert.equal(chapter.length,11);
 for(const l of chapter){
  const qs=exercises.filter(e=>e.lesson===l.slug);
  assert.equal(qs.length,l.slug==='m3-sequences-check'?28:l.slug==='m3-sequence-radical-limit'?16:12);
  for(const q of qs){
   const alt=alternateFor(q.id);
   assert.ok(alt,q.id);assert.equal(alt.lesson,q.lesson);assert.equal(alt.family,q.family);
  }
 }
 const check=exercises.filter(e=>e.lesson==='m3-sequences-check');
 assert.equal(new Set(check.filter(e=>e.stage==='practice').map(e=>e.family)).size,11);
 assert.equal(new Set(check.filter(e=>e.stage==='review').map(e=>e.family)).size,11);
});
test('function limits cover eleven skills with same-skill alternate practice',()=>{
 const chapter=lessons.filter(l=>l.chapter==='関数の極限と連続性');
 assert.equal(chapter.length,12);
 for(const l of chapter){
  const qs=exercises.filter(e=>e.lesson===l.slug);
  assert.equal(qs.length,l.slug==='m3-function-limits-check'?26:12);
  for(const q of qs){
   const alt=alternateFor(q.id);assert.ok(alt,q.id);
   assert.equal(alt.lesson,q.lesson);assert.equal(alt.family,q.family);
  }
 }
 const check=exercises.filter(e=>e.lesson==='m3-function-limits-check');
 for(const stage of ['practice','review'])assert.equal(new Set(check.filter(e=>e.stage===stage).map(e=>e.family)).size,11);
});
test('function limit diagrams preserve holes, branches and strict mathematical labels',async()=>{
 const require=createRequire(import.meta.url);
 const source=readFileSync(new URL('../app/components/Math3LimitDiagrams.tsx',import.meta.url),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
  .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
  .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/,'const CoordinateDiagram=()=>null;');
 const {limitFigures}=await import(url(compiled));
 const figures=Object.values(limitFigures).flatMap(Object.values);
 assert.equal(figures.length,10);
 const walk=v=>{
  if(typeof v==='string'){for(const [,tex] of v.matchAll(/\$([^$]+)\$/g))katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});}
  else if(Array.isArray(v))v.forEach(walk);
  else if(v&&typeof v==='object')Object.values(v).forEach(walk);
 };
 walk(figures);
 assert.equal(limitFigures['m3-limit-and-value'][0].points[0].open,true);
 assert.equal(limitFigures['m3-limit-and-value'][1].points[1].y,5);
 for(const slug of ['m3-one-sided-limits','m3-limits-at-infinity','m3-intermediate-value']){
  for(const curve of limitFigures[slug][1].curves)assert.ok((curve.to??1)<0||(curve.from??-1)>0);
 }
});
test('math III derivatives retain the approved order, volume and chapter-check coverage',async()=>{
 const {math3DerivativeOrder}=await import(contentModule(new URL('../app/content/math3-chapter4.ts',import.meta.url)));
 const chapter=lessons.filter(l=>l.chapter==='微分法');
 assert.deepEqual(chapter.map(l=>l.slug),[...math3DerivativeOrder,'m3-derivatives-check']);
 const items=exercises.filter(e=>chapter.some(l=>l.slug===e.lesson));
 assert.equal(items.length,297);
 for(const lesson of chapter){
  for(const p of lesson.prerequisites||[])assert.ok(lessons.some(l=>l.slug===p.slug),p.slug);
  assert.equal(items.filter(e=>e.lesson===lesson.slug&&e.stage==='guided').length,lesson.examples.length);
  for(const e of items.filter(e=>e.lesson===lesson.slug)){
   const variant=alternateFor(e.id);
   assert.ok(variant,e.id);
   assert.equal(variant.lesson,e.lesson);
   assert.equal(variant.family,e.family);
   assert.notEqual(variant.id,e.id);
  }
 }
 for(const slug of ['power-derivatives','trigonometric-derivatives','exponential-log-derivatives','product-derivative','quotient-derivative','chain-rule','chain-rule-functions','choose-derivative']){
  assert.equal(items.filter(e=>e.lesson==='m3-'+slug&&e.stage==='practice').length,10);
  assert.equal(items.filter(e=>e.lesson==='m3-'+slug&&e.stage==='review').length,4);
 }
 for(const stage of ['practice','review'])assert.equal(new Set(items.filter(e=>e.lesson==='m3-derivatives-check'&&e.stage===stage).map(e=>e.family)).size,17);
});
test('derivative review fixes preserve the required decision and targeted supplements',()=>{
 const e=id=>exerciseById[id];
 for(const [source,target] of [
  ['m3-derivative-meaning-practice-5-v1','m3-derivative-meaning-review-2-v1'],
  ['m3-derivative-definition-practice-6-v1','m3-derivative-definition-review-radical-v1'],
  ['m3-differentiability-practice-5-v1','m3-differentiability-review-endpoint-v1'],
  ['m3-implicit-derivative-practice-3-v1','m3-implicit-derivative-review-zero-denominator-v1'],
  ['m3-parametric-derivative-practice-5-v1','m3-parametric-derivative-review-zero-horizontal-v1']
 ])assert.equal(alternateFor(source).id,target);
 for(const n of [4,5])assert.match(alternateFor('m3-inverse-derivative-practice-'+n+'-v1').family,/applicability$/);
 assert.match(e('m3-inverse-derivative-ready-2-v1').prompt,/公式を使える/);
 for(const [key,number] of [['derivative-meaning',4],['power-derivatives',6],['chain-rule-functions',6]]){
  assert.equal(e('m3-derivatives-check-practice-m3-'+key+'-v1').prompt,e('m3-'+key+'-practice-'+number+'-v1').prompt);
 }
 const check=lessons.find(l=>l.slug==='m3-derivatives-check');
 assert.equal(check.supplements.length,23);
 for(const [slug,key,repair] of [
  ['derivative-definition','guided-2','reciprocal'],['derivative-definition','practice-6','radical'],
  ['differentiability','practice-5','endpoint'],['chain-rule','practice-3','root-domain'],
  ['chain-rule-functions','practice-9','log-domain'],['second-derivative','practice-5','repeat-rules']
 ]){
  assert.equal(e('m3-'+slug+'-'+key+'-v1').repair,repair);
  assert.ok(check.supplements.some(s=>s.id==='m3-'+slug+'-'+repair));
 }
 assert.equal(e('m3-derivatives-check-practice-m3-chain-rule-functions-v1').repair,'m3-chain-rule-functions-log-domain');
 assert.equal(e('m3-derivatives-check-guided-2-v1').repair,'m3-second-derivative-repeat-rules');
});
test('math III derivative diagrams preserve example coordinates and mathematical labels',async()=>{
 const require=createRequire(import.meta.url);
 const source=readFileSync(new URL('../app/components/Math3DerivativeDiagrams.tsx',import.meta.url),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
  .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
  .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/,'const CoordinateDiagram=()=>null;');
 const {math3DerivativeFigures:f}=await import(url(compiled));
 const all=Object.values(f).flatMap(Object.values);
 assert.equal(all.length,7);
 const walk=v=>{
  if(typeof v==='string')for(const [,tex] of v.matchAll(/\$([^$]+)\$/g))katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});
  else if(Array.isArray(v))v.forEach(walk);
  else if(v&&typeof v==='object')Object.values(v).forEach(walk);
 };
 walk(all);
 for(const [slug,figures] of Object.entries(f))for(const index of Object.keys(figures))assert.ok(lessons.find(l=>l.slug===slug).examples[Number(index)]);
 const secant=f['m3-derivative-meaning'][0];
 for(const p of secant.points)assert.ok(Math.abs(secant.curves[1].value(p.x)-p.y)<1e-12);
 assert.equal(secant.curves[2].value(1),1);
 assert.equal(f['m3-differentiability'][0].curves[0].to,0);
 assert.equal(f['m3-differentiability'][0].curves[1].from,0);
 assert.equal(f['m3-inverse-derivative'][0].points[0].open,true);
 const circle=f['m3-implicit-derivative'][0],p=circle.points[0];
 assert.ok(Math.abs(p.x*p.x+p.y*p.y-1)<1e-12);
 assert.ok(Math.abs(circle.curves[0].value(p.x)-p.y)<1e-12);
});
test('applications retain thirteen decisions, exercise volume, targeted repairs and notation',async()=>{
 const {math3ApplicationsOrder,math3ApplicationsCheckSelection}=await import(contentModule(new URL('../app/content/math3-chapter5.ts',import.meta.url)));
 const chapter=lessons.filter(l=>l.chapter==='微分の応用');
 assert.deepEqual(chapter.map(l=>l.slug),[...math3ApplicationsOrder,'m3-applications-check']);
 const all=exercises.filter(e=>chapter.some(l=>l.slug===e.lesson));
 assert.equal(all.length,195);
 for(const l of chapter){
  const qs=all.filter(e=>e.lesson===l.slug);
  assert.ok(!l.description.includes('$'),'list summaries are plain text: '+l.slug);
  assert.equal(qs.filter(e=>e.stage==='guided').length,l.examples.length);
  assert.ok(qs.filter(e=>e.stage==='practice').length>=6,l.slug);
  for(const pre of l.prerequisites||[])assert.ok(lessons.some(a=>a.slug===pre.slug),pre.slug);
  for(const e of qs){const alt=alternateFor(e.id);assert.ok(alt,e.id);assert.equal(alt.family,e.family);assert.ok(l.supplements.some(s=>s.id===e.repair));}
 }
 for(const [i,[slug,p,r]] of math3ApplicationsCheckSelection.entries()){
  const cp=exerciseById['m3-applications-check-practice-'+(i+1)+'-v1'];
  const cr=exerciseById['m3-applications-check-review-'+(i+1)+'-v1'];
  assert.equal(cp.prompt,exerciseById['m3-'+slug+'-practice-'+p+'-v1'].prompt);
  assert.equal(cr.prompt,exerciseById['m3-'+slug+'-review-'+r+'-v1'].prompt);
  assert.equal(cp.family,cr.family,slug);
 }
 const walk=(v,k)=>{
  if(typeof v==='string'){
   const math=k==='tex'?[v]:[...v.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
   for(const tex of math){assert.ok(!tex.includes('/'),tex);assert.ok(!tex.includes('\\binom'),tex);}
  }else if(Array.isArray(v))v.forEach(a=>walk(a,k));
  else if(v&&typeof v==='object')Object.entries(v).forEach(([key,value])=>walk(value,key));
 };
 walk([chapter,all]);
});

test('application review fixes retain attainment, endpoint and speed decisions with justified limits',()=>{
 const e=id=>exerciseById['m3-'+id+'-v1'];
 for(const [key,family] of [
  ['optimization-model-practice-2','area-infimum'],['optimization-model-practice-5','area-infimum'],
  ['optimization-model-practice-3','constrained-area'],['optimization-model-practice-4','constrained-area'],
  ['velocity-acceleration-practice-5','speed-change']
 ]){
  const source=e(key);assert.equal(source.family,family);assert.equal(source.repair,family);
  assert.equal(alternateFor(source.id).family,family);
 }
 assert.equal(alternateFor('m3-optimization-model-review-2-v1').family,'fence');
 for(const slug of ['global-extrema','curve-sketch','roots-existence-count']){
  const l=lessons.find(l=>l.slug==='m3-'+slug);
  const support=l.supplements.find(s=>s.id==='exponential-growth');
  assert.ok(support.text.includes("G'(u)=e^u-1"));
  assert.ok(support.tex.includes('\\frac4t'));
  assert.ok(support.answer.includes('x(1-\\dfrac{\\log x}{x})'));
 }
 const check=lessons.find(l=>l.slug==='m3-applications-check');
 assert.equal(check.supplements.length,31);
 for(const family of ['m3-global-extrema-closed-max','m3-roots-existence-count-one-root']){
  for(const stage of ['practice','review'])assert.ok(exercises.some(e=>e.lesson===check.slug&&e.family===family&&e.stage===stage));
 }
});

test('applications figures preserve tangency, perpendicularity, separate branches and strict labels',async()=>{
 const require=createRequire(import.meta.url);
 const source=readFileSync(new URL('../app/components/Math3ApplicationDiagrams.tsx',import.meta.url),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
  .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
  .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/,'const CoordinateDiagram=()=>null;');
 const {math3ApplicationFigures:f}=await import(url(compiled));
 assert.equal(Object.values(f).flatMap(Object.values).length,13);
 const walk=v=>{
  if(typeof v==='string')for(const [,tex] of v.matchAll(/\$([^$]+)\$/g)){katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});assert.ok(!tex.includes('/'));}
  else if(Array.isArray(v))v.forEach(walk);
  else if(v&&typeof v==='object')Object.values(v).forEach(walk);
 };
 walk(f);
 for(const [slug,figs] of Object.entries(f))for(const [index,fig] of Object.entries(figs)){
  assert.ok(lessons.find(l=>l.slug===slug).examples[Number(index)]);
  for(const p of fig.points||[])assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
 }
 const tangent=f['m3-tangent-at-point'][0];
 assert.equal(tangent.curves[0].value(1),tangent.curves[1].value(1));
 const normal=f['m3-normal-line'][0];
 assert.equal((normal.curves[1].value(1)-normal.curves[1].value(0))*(normal.curves[2].value(1)-normal.curves[2].value(0)),-1);
 const unknown=f['m3-unknown-contact'][0];
 for(const curve of unknown.curves.slice(1))assert.equal(curve.value(0),-1);
 const split=f['m3-curve-sketch'][1].curves;
 assert.ok(split[0].to<0&&split[1].from>0);
 const curve=f['m3-curve-sketch'][0];
 for(const p of curve.points)assert.ok(Math.abs(curve.curves[0].value(p.x)-p.y)<1e-12);
});

test('indefinite integrals preserve the approved scope, working and review decisions',async()=>{
 const {math3AntiderivativeOrder,math3IntegralCheckSelection}=await import(contentModule(new URL('../app/content/math3-chapter6.ts',import.meta.url)));
 const chapter=lessons.filter(l=>l.chapter==='不定積分');
 assert.deepEqual(chapter.map(l=>l.slug),[...math3AntiderivativeOrder,'m3-indefinite-integrals-check']);
 assert.equal(chapter.reduce((n,l)=>n+l.examples.length,0),35);
 assert.equal(exercises.filter(e=>chapter.some(l=>l.slug===e.lesson)).length,249);
 assert.ok(math3IntegralCheckSelection.some(([s,p,r])=>s==='antiderivative-constant'&&p==='practice-4'&&r==='review-2'));
 assert.ok(math3IntegralCheckSelection.some(([s,p,r])=>s==='algebra-before-integrals'&&p==='practice-3'&&r==='review-1'));
 const methodItems=exercises.filter(e=>e.lesson==='m3-choose-integral');
 assert.equal(methodItems.length,17);
 for(const e of methodItems){assert.ok(e.answer.includes('からです'),e.id);assert.ok(e.steps[0].text.includes('からです'),e.id);}
 for(const l of chapter){
  assert.ok(!l.description.includes('$'));
  for(const p of l.prerequisites||[])assert.ok(lessons.some(a=>a.slug===p.slug),p.slug);
  const items=exercises.filter(e=>e.lesson===l.slug);
  assert.equal(items.filter(e=>e.stage==='guided').length,l.examples.length);
  for(const e of items){const alt=alternateFor(e.id);assert.ok(alt,e.id);assert.equal(alt.family,e.family);assert.ok(l.supplements.some(s=>s.id===e.repair));}
 }
 for(const [i,[slug,p,r]] of math3IntegralCheckSelection.entries()){
  const a=exerciseById['m3-indefinite-integrals-check-practice-'+(i+1)+'-v1'],b=exerciseById['m3-indefinite-integrals-check-review-'+(i+1)+'-v1'];
  assert.equal(a.prompt,exerciseById['m3-'+slug+'-'+p+'-v1'].prompt);
  assert.equal(b.prompt,exerciseById['m3-'+slug+'-'+r+'-v1'].prompt);assert.equal(a.family,b.family);
 }
});

test('indefinite-integral diagrams preserve vertical shifts and substitution signs',async()=>{
 const require=createRequire(import.meta.url);
 const source=readFileSync(new URL('../app/components/Math3IntegralDiagrams.tsx',import.meta.url),'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
  .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
  .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/,'const CoordinateDiagram=()=>null;');
 const {math3IntegralFigures:f}=await import(url(js));
 assert.equal(Object.values(f).flatMap(Object.values).length,3);
 const walk=v=>{
  if(typeof v==='string')for(const [,tex] of v.matchAll(/\$([^$]+)\$/g)){assert.ok(!tex.includes('/'));katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});}
  else if(Array.isArray(v))v.forEach(walk);
  else if(v&&typeof v==='object')Object.values(v).forEach(walk);
 };
 walk(f);
 for(const [slug,figs] of Object.entries(f))for(const key of Object.keys(figs))assert.ok(lessons.find(l=>l.slug===slug).examples[Number(key)]);
 const curves=f['m3-antiderivative-constant'][0].curves;
 for(const x of [-1,0,1]){assert.equal(curves[1].value(x)-curves[0].value(x),2);assert.equal(curves[2].value(x)-curves[0].value(x),-2);}
 const circle=f['m3-trig-substitution'][0],p=circle.points[0];
 assert.ok(circle.axisDescription.includes('\\sin\\theta=x'));
 assert.ok(Math.abs(p.x*p.x+p.y*p.y-1)<1e-12);assert.ok(p.x>0);
 assert.equal(circle.arcs[0].from,-Math.PI/2);assert.equal(circle.arcs[0].to,Math.PI/2);
 assert.ok(circle.points.slice(1).every(p=>p.open));
});

test('definite integrals cover decisions, conditions and compatible repair variants',async()=>{
 const {math3DefiniteOrder,math3DefiniteCheckSelection}=await import(contentModule(new URL('../app/content/math3-chapter7.ts',import.meta.url)));
 const chapter=lessons.filter(l=>l.chapter==='定積分');
 assert.deepEqual(chapter.map(l=>l.slug),[...math3DefiniteOrder,'m3-definite-integrals-check']);
 assert.equal(chapter.reduce((n,l)=>n+l.examples.length,0),25);
 assert.equal(chapter.reduce((n,l)=>n+l.supplements.length,0),52);
 const items=exercises.filter(e=>chapter.some(l=>l.slug===e.lesson));
 assert.equal(items.length,193);
 for(const l of chapter){
  assert.ok(!l.description.includes('$'));
  for(const p of l.prerequisites||[])assert.ok(lessons.some(a=>a.slug===p.slug));
  assert.equal(items.filter(e=>e.lesson===l.slug&&e.stage==='guided').length,l.examples.length);
 }
 for(const e of items){const a=alternateFor(e.id);assert.ok(a,e.id);assert.equal(a.family,e.family);assert.notEqual(a.id,e.id);}
 for(const [i,[slug,p,r]] of math3DefiniteCheckSelection.entries()){
  const a=exerciseById['m3-definite-integrals-check-practice-'+(i+1)+'-v1'],b=exerciseById['m3-definite-integrals-check-review-'+(i+1)+'-v1'];
  assert.equal(a.prompt,exerciseById['m3-'+slug+'-'+p+'-v1'].prompt);
  assert.equal(b.prompt,exerciseById['m3-'+slug+'-'+r+'-v1'].prompt);assert.equal(a.family,b.family);
 }
 for(const [id,family] of [['m3-integral-properties-practice-2','linearity-scope'],['m3-integral-bounds-practice-2','reverse-compare'],['m3-integral-bounds-practice-4','compare-assumption']]){
  const e=exerciseById[id+'-v1'];assert.equal(e.family,family);assert.equal(e.repair,family);
 }
 const check=items.filter(e=>e.lesson==='m3-definite-integrals-check'&&e.stage==='practice');
 for(const f of ['integral-properties-linearity-scope','integral-bounds-compare','integral-bounds-reverse-compare','integral-bounds-compare-assumption'])assert.ok(check.some(e=>e.family===f));
 const walk=(v,k)=>{
  if(typeof v==='string')for(const tex of k==='tex'?[v]:[...v.matchAll(/\$([^$]+)\$/g)].map(x=>x[1])){assert.ok(!tex.includes('/'));assert.ok(!tex.includes('\\binom'));katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});}
  else if(Array.isArray(v))v.forEach(x=>walk(x,k));
  else if(v&&typeof v==='object')Object.entries(v).forEach(([key,x])=>walk(x,key));
 };
 walk([chapter,items]);
});

test('definite integral figures preserve widths, heights, signs and comparison intervals',async()=>{
 const require=createRequire(import.meta.url);
 const source=readFileSync(new URL('../app/components/Math3DefiniteDiagrams.tsx',import.meta.url),'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
 .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
 .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/,'const CoordinateDiagram=()=>null;');
 const {math3DefiniteFigures:f}=await import(url(js));
 assert.equal(Object.values(f).flatMap(Object.values).length,6);
 for(const [slug,figs] of Object.entries(f))for(const key of Object.keys(figs)){
  assert.ok(lessons.find(l=>l.slug===slug).examples[Number(key)]);
  const g=figs[key];
  for(const a of g.areas||[])for(let i=0;i<=16;i++){const x=a.from+(a.to-a.from)*i/16;assert.ok(a.upper(x)>=a.lower(x));}
  const walk=v=>{
   if(typeof v==='string')for(const [,tex] of v.matchAll(/\$([^$]+)\$/g)){assert.ok(!tex.includes('/'));katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});}
   else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);
  };walk(g);
 }
 const rectangles=f['m3-riemann-sums'][0].areas;
 assert.equal(rectangles.length,4);
 assert.equal(rectangles.reduce((sum,a)=>sum+(a.to-a.from)*a.upper(a.to),0),15/32);
 rectangles.forEach(a=>{assert.equal(a.to-a.from,1/4);assert.equal(a.upper(a.to),a.to*a.to);});
 const band=f['m3-integral-function'][0].areas[0];
 assert.equal(band.to-band.from,1/4);assert.ok(f['m3-integral-function'][0].axisDescription.includes('$t$'));
 const {math3DefiniteTables:tables}=await import(contentModule(new URL('../app/content/math3-chapter7-tables.ts',import.meta.url)));
 assert.equal(Object.values(tables).flat().length,3);
 for(const table of Object.values(tables).flat())for(const row of table.rows){assert.equal(row.length,table.headers.length);for(const cell of row)for(const [,tex] of cell.matchAll(/\$([^$]+)\$/g))katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});}
});

test('integral applications preserve setup and calculation, scope and repairs',async()=>{
 const {math3IntegralApplicationOrder,math3ApplicationCheckSelection}=await import(contentModule(new URL('../app/content/math3-chapter8.ts',import.meta.url)));
 const chapter=lessons.filter(l=>l.chapter==='積分の応用');
 assert.deepEqual(chapter.map(l=>l.slug),[...math3IntegralApplicationOrder,'m3-integral-applications-check']);
 assert.equal(chapter.reduce((n,l)=>n+l.examples.length,0),26);
 assert.equal(chapter.reduce((n,l)=>n+l.supplements.length,0),56);
 const items=exercises.filter(e=>chapter.some(l=>l.slug===e.lesson));assert.equal(items.length,208);
 for(const [id,family] of [['m3-washer-volume-practice-5','shifted-setup'],['m3-washer-volume-practice-6','shifted-value'],['m3-rotation-direction-practice-3','vertical-washer-setup'],['m3-rotation-direction-practice-4','vertical-washer-value']]){
  const e=exerciseById[id+'-v1'];assert.equal(e.family,family);assert.equal(e.repair,family);
 }
 const covered=new Set(items.filter(e=>e.lesson==='m3-integral-applications-check'&&e.stage==='practice').map(e=>e.family));
 for(const f of ['washer-volume-washer-setup','washer-volume-washer-value','washer-volume-shifted-setup','washer-volume-shifted-value','rotation-direction-rotation-setup','rotation-direction-rotation-value','rotation-direction-vertical-washer-setup','rotation-direction-vertical-washer-value'])assert.ok(covered.has(f),f);
 for(const l of chapter){
  assert.ok(!l.description.includes('$'));
  for(const p of l.prerequisites||[])assert.ok(lessons.some(a=>a.slug===p.slug));
  assert.equal(items.filter(e=>e.lesson===l.slug&&e.stage==='guided').length,l.examples.length);
 }
 for(const e of items){const a=alternateFor(e.id);assert.ok(a,e.id);assert.equal(a.family,e.family);assert.notEqual(a.id,e.id);assert.ok(chapter.find(l=>l.slug===e.lesson).supplements.some(s=>s.id===e.repair));}
 for(const [i,[slug,p,r]] of math3ApplicationCheckSelection.entries()){
  const a=exerciseById['m3-integral-applications-check-practice-'+(i+1)+'-v1'],b=exerciseById['m3-integral-applications-check-review-'+(i+1)+'-v1'];
  assert.equal(a.prompt,exerciseById['m3-'+slug+'-'+p+'-v1'].prompt);
  assert.equal(b.prompt,exerciseById['m3-'+slug+'-'+r+'-v1'].prompt);assert.equal(a.family,b.family);
 }
 const walk=(v,k)=>{
  if(typeof v==='string')for(const tex of k==='tex'?[v]:[...v.matchAll(/\$([^$]+)\$/g)].map(x=>x[1])){assert.ok(!tex.includes('/'));assert.ok(!tex.includes('\\binom'));katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});}
  else if(Array.isArray(v))v.forEach(x=>walk(x,k));else if(v&&typeof v==='object')Object.entries(v).forEach(([key,x])=>walk(x,key));
 };walk([chapter,items]);
});

test('integral application figures retain nonnegative slices, axes and radii',async()=>{
 const require=createRequire(import.meta.url);
 const source=readFileSync(new URL('../app/components/Math3IntegralApplicationDiagrams.tsx',import.meta.url),'utf8');
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
 .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
 .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/,'const CoordinateDiagram=()=>null;');
 const {math3IntegralApplicationFigures:f}=await import(url(js));
 assert.equal(Object.values(f).flatMap(Object.values).length,15);
 for(const [slug,figs] of Object.entries(f))for(const key of Object.keys(figs)){
  assert.ok(lessons.find(l=>l.slug===slug).examples[Number(key)]);
  const g=figs[key];
  for(const a of g.areas||[])for(let i=0;i<=32;i++){const x=a.from+(a.to-a.from)*i/32;assert.ok(Number.isFinite(a.upper(x)));assert.ok(a.upper(x)>=a.lower(x)-1e-12);}
  const walk=v=>{
   if(typeof v==='string')for(const [,tex] of v.matchAll(/\$([^$]+)\$/g)){assert.ok(!tex.includes('/'));katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false});}
   else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);
  };walk(g);
 }
 const horizontal=f['m3-horizontal-area'][0];
 for(const p of horizontal.points){assert.equal(p.x,p.y*p.y);assert.equal(p.x,2-p.y);}
 const washer=f['m3-washer-volume'][1].circles;
 assert.deepEqual(washer.map(c=>c.r),[1,0.5]);
 assert.equal(f['m3-disk-volume'][1].circles[0].r**2,0.25);
 const arc=f['m3-graph-length'][1].arcs[0];
 assert.ok(Math.abs(arc.to-arc.from-Math.PI/6)<1e-12);
 const speed=f['m3-displacement-distance'][1];
 assert.ok(speed.axisDescription.includes('$t$'));
 assert.equal(speed.curves[0].value(1),0);
 assert.equal(f['m3-area-splitting'][0].areas[1].to,2);
});

test('all inline and display formulas render strictly with KaTeX',()=>{
  let count=0;
  const walk=(value,key)=>{
    if(typeof value==='string'){
      const expressions=key==='tex'?[value]:[...value.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
      if(key!=='tex')assert.equal((value.match(/\$/g)||[]).length,expressions.length*2,value);
      for(const tex of expressions){assert.doesNotThrow(()=>katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false}),tex);count++;}
    }else if(Array.isArray(value))value.forEach(v=>walk(v,key));
    else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>walk(v,k));
  };
  walk([lessons,exercises]);assert.ok(count>150);
});
test('published mathematics uses stacked fractions and Japanese combination notation',()=>{
  const walk=(value,key)=>{
    if(typeof value==='string'){
      const expressions=key==='tex'?[value]:[...value.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
      for(const tex of expressions){
        assert.ok(!tex.includes('/'),tex);assert.ok(!tex.includes('\\binom'),tex);
        assert.ok(!/\\(?:d?frac)\{[^{}]*\}\{[fg]'?\}\(/.test(tex),'Function argument outside denominator: '+tex);
      }
      if(key!=='tex')assert.ok(!/\d\/\d/.test(value.replace(/\$[^$]+\$/g,'')),value);
    }else if(Array.isArray(value))value.forEach(v=>walk(v,key));
    else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>walk(v,k));
  };
  walk([lessons,exercises]);
});
test('chapter one is ordered and mixed reviews retain the requested skill',()=>{
  assert.deepEqual(lessons.filter(l=>l.chapter==='式と証明').map(l=>l.slug),[
    'cubic-expansion','cubic-factorization','binomial-meaning','binomial-coefficient','polynomial-division',
    'rational','rational-product','rational-sum','identities','equalities','inequalities','amgm','chapter-one-check'
  ]);
  const mixed=exercises.filter(e=>['chapter-one-check','chapter-two-check','chapter-three-check'].includes(e.lesson)||(e.lesson!=='points'&&['図形と方程式','三角関数','指数関数・対数関数','微分の考え','積分の考え'].includes(lessons.find(l=>l.slug===e.lesson)?.chapter)));
  for(const q of mixed){
    const variant=alternateFor(q.id);
    assert.ok(variant,q.id);
    assert.equal(variant.family,q.family,q.id);
    assert.notEqual(variant.id,q.id);
  }
  for(const l of lessons.filter(l=>!['rational','points'].includes(l.slug)))assert.ok(l.basicsTitle);
});
test('chapter three example diagrams cover every new example and use valid math labels',async()=>{
  const require=createRequire(import.meta.url);
  const source=readFileSync(new URL('../app/components/LessonDiagrams.tsx',import.meta.url),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
    .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
    .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/, 'const CoordinateDiagram=()=>null;')
    .replace(/import TrigDiagrams from ["']\.\/TrigDiagrams["'];?/, 'const TrigDiagrams=()=>null;')
    .replace(/import ExponentialDiagrams from ["']\.\/ExponentialDiagrams["'];?/, 'const ExponentialDiagrams=()=>null;')
    .replace(/import DerivativeDiagrams from ["']\.\/DerivativeDiagrams["'];?/, 'const DerivativeDiagrams=()=>null;')
    .replace(/import Math3LimitDiagrams from ["']\.\/Math3LimitDiagrams["'];?/, 'const Math3LimitDiagrams=()=>null;')
    .replace(/import Math3DerivativeDiagrams from ["']\.\/Math3DerivativeDiagrams["'];?/, 'const Math3DerivativeDiagrams=()=>null;')
    .replace(/import Math3ApplicationDiagrams from ["']\.\/Math3ApplicationDiagrams["'];?/, 'const Math3ApplicationDiagrams=()=>null;')
    .replace(/import Math3IntegralDiagrams from ["']\.\/Math3IntegralDiagrams["'];?/, 'const Math3IntegralDiagrams=()=>null;')
    .replace(/import Math3DefiniteDiagrams from ["']\.\/Math3DefiniteDiagrams["'];?/, 'const Math3DefiniteDiagrams=()=>null;')
    .replace(/import Math3IntegralApplicationDiagrams from ["']\.\/Math3IntegralApplicationDiagrams["'];?/, 'const Math3IntegralApplicationDiagrams=()=>null;')
    .replace(/import Math3FunctionDiagrams from ["']\.\/Math3FunctionDiagrams["'];?/, 'const Math3FunctionDiagrams=()=>null;')
    .replace(/import IntegralDiagrams from ["']\.\/IntegralDiagrams["'];?/, 'const IntegralDiagrams=()=>null;');
  const {figures}=await import(url(compiled));
  for(const lesson of lessons.filter(l=>l.chapter==='図形と方程式'&&l.slug!=='points')){
    assert.equal(figures[lesson.slug]?.length,lesson.examples.length,lesson.slug);
  }
  const walk=value=>{
    if(typeof value==='string')for(const [,tex] of value.matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false}),tex);
    else if(Array.isArray(value))value.forEach(walk);
    else if(value&&typeof value==='object')Object.values(value).forEach(walk);
  };
  walk(figures);
  for(const list of Object.values(figures))for(const diagram of list){
    assert.ok(diagram.xRange[0]<diagram.xRange[1]);assert.ok(diagram.yRange[0]<diagram.yRange[1]);
    for(const circle of diagram.circles||[])assert.ok(Number.isFinite(circle.r)&&circle.r>0);
    for(const point of diagram.points||[])assert.ok(Number.isFinite(point.x)&&Number.isFinite(point.y));
  }
});
test('chapter three review fixes keep circle equations and verification conditions consistent',()=>{
  const circle=lessons.find(l=>l.slug==='circle-completing-square');
  assert.ok(circle.examples[1].prompt.includes('x^2+y^2+2x-3=0'));
  assert.ok(exerciseById['circle-completing-square-guided-circle-completing-square-1-v1'].prompt.includes('x^2+y^2+4x=0'));
  for(const e of exercises.filter(e=>e.lesson===circle.slug))assert.ok(!e.prompt.includes('xy'),e.id);
  const line=lessons.find(l=>l.slug==='line-equations');
  assert.ok(line.examples[0].steps[2].text.includes('$-2$'));
  assert.ok(line.examples[1].prompt.includes('縦の直線と横の直線'));
  const chord=lessons.find(l=>l.slug==='circle-common-chord');
  assert.ok(chord.introduction[0].includes('中心の異なる'));
  assert.ok(chord.rule.includes('中心の異なる'));
  assert.ok(exerciseById['locus-equations-ready-distance-ratio-locus-1-v1'].steps[2].text.includes('非負の平方根'));
  for(const [x,y] of [[-1,-2],[1,2]])assert.equal(y,2*x);
  assert.equal(3*2+4*4,22);
  for(const a of [0,Math.PI/2,Math.PI,3*Math.PI/2]){
    const x=-1+2*Math.cos(a),y=2*Math.sin(a);
    assert.ok(Math.abs(x*x+y*y+2*x-3)<1e-12);
  }
});
test('trigonometry diagrams cover examples with strict math and correctly placed unit-circle points',async()=>{
  const require=createRequire(import.meta.url);
  const source=readFileSync(new URL('../app/components/TrigDiagrams.tsx',import.meta.url),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
    .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
    .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/, 'const CoordinateDiagram=()=>null;');
  const {trigFigures}=await import(url(compiled));
  for(const l of lessons.filter(l=>l.chapter==='三角関数'))assert.equal(trigFigures[l.slug]?.length,l.examples.length,l.slug);
  const walk=value=>{
    if(typeof value==='string'){
      const expressions=[...value.matchAll(/\$([^$]+)\$/g)];
      assert.equal((value.match(/\$/g)||[]).length,2*expressions.length,value);
      for(const [,tex] of expressions)assert.doesNotThrow(()=>katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false}),tex);
    }else if(Array.isArray(value))value.forEach(walk);
    else if(value&&typeof value==='object')Object.values(value).forEach(walk);
  };
  walk(trigFigures);
  const tableSource=readFileSync(new URL('../app/components/LessonTables.tsx',import.meta.url),'utf8');
  const tableCompiled=ts.transpileModule(tableSource,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
    .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
    .replace(/import MathTable from ["']\.\/MathTable["'];?/, 'const MathTable=()=>null;')
    .replace('"../content/math3-chapter5-tables"',JSON.stringify(contentModule(new URL('../app/content/math3-chapter5-tables.ts',import.meta.url))))
    .replace('"../content/math3-chapter6-tables"',JSON.stringify(contentModule(new URL('../app/content/math3-chapter6-tables.ts',import.meta.url))))
    .replace('"../content/math1-logic-tables"',JSON.stringify(contentModule(new URL('../app/content/math1-logic-tables.ts',import.meta.url))))
    .replace('"../content/math1-trig-tables"',JSON.stringify(contentModule(new URL('../app/content/math1-trig-tables.ts',import.meta.url))))
    .replace('"../content/math1-data-tables"',JSON.stringify(contentModule(new URL('../app/content/math1-data-tables.ts',import.meta.url))))
    .replace('"../content/matha-counting-tables"',JSON.stringify(contentModule(new URL('../app/content/matha-counting-tables.ts',import.meta.url))))
    .replace('"../content/matha-probability-tables"',JSON.stringify(contentModule(new URL('../app/content/matha-probability-tables.ts',import.meta.url))))
    .replace('"../content/mathb-tables"',JSON.stringify(contentModule(new URL('../app/content/mathb-tables.ts',import.meta.url))))
    .replace('"../content/matha-integer-tables"',JSON.stringify(contentModule(new URL('../app/content/matha-integer-tables.ts',import.meta.url))))
    .replace('"../content/math3-chapter7-tables"',JSON.stringify(contentModule(new URL('../app/content/math3-chapter7-tables.ts',import.meta.url))));
  const {lessonTables}=await import(url(tableCompiled));
  walk(lessonTables);
  for(const list of Object.values(lessonTables))for(const table of list)for(const row of table.rows)assert.equal(row.length,table.headers.length);
  for(const list of Object.values(trigFigures))for(const d of list){
    if(d.circles?.[0]?.r===1)for(const p of d.points||[])assert.ok(Math.abs(p.x*p.x+p.y*p.y-1)<1e-12,d.title);
    for(const tick of d.xTicks||[])assert.ok(tick.value>=d.xRange[0]&&tick.value<=d.xRange[1]);
  }
  const tan=trigFigures['trig-graphs'][1];
  assert.equal(tan.curves.length,3);
  assert.ok(tan.curves[0].to<-Math.PI/4&&tan.curves[1].from>-Math.PI/4);
  assert.ok(tan.curves[1].to<Math.PI/4&&tan.curves[2].from>Math.PI/4);
  const sineRegion=trigFigures['trig-inequalities'][0].arcs[0];
  for(let i=0;i<=100;i++)assert.ok(Math.sin(sineRegion.from+(sineRegion.to-sineRegion.from)*i/100)>=.5-1e-12);
});
test('exponential and logarithmic figures respect their domains and answer coordinates',async()=>{
  const require=createRequire(import.meta.url);
  const source=readFileSync(new URL('../app/components/ExponentialDiagrams.tsx',import.meta.url),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
    .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
    .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/, 'const CoordinateDiagram=()=>null;');
  const {exponentialFigures}=await import(url(compiled));
  for(const [slug,list] of Object.entries(exponentialFigures))for(const [index,d] of Object.entries(list)){
    assert.ok(lessons.find(l=>l.slug===slug)?.examples[Number(index)]);
    const walk=value=>{
      if(typeof value==='string')for(const [,tex] of value.matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false}),tex);
      else if(Array.isArray(value))value.forEach(walk);
      else if(value&&typeof value==='object')Object.values(value).forEach(walk);
    };walk(d);
    for(const p of d.points||[])assert.ok(Math.abs(d.curves[0].value(p.x)-p.y)<1e-12,slug);
    const boundary=slug==='logarithmic-graph'?(Number(index)===0?0:2):slug==='logarithmic-equations'?1:null;
    if(boundary!==null)assert.ok(d.curves[0].from>boundary,slug);
  }
});
test('derivative figures match example points and preserve interval endpoints',async()=>{
  const require=createRequire(import.meta.url);
  const source=readFileSync(new URL('../app/components/DerivativeDiagrams.tsx',import.meta.url),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
    .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
    .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/, 'const CoordinateDiagram=()=>null;');
  const {derivativeFigures}=await import(url(compiled));
  for(const l of lessons.filter(l=>l.chapter==='微分の考え'&&l.slug!=='polynomial-differentiation'))assert.equal(Object.keys(derivativeFigures[l.slug]??{}).length,l.examples.length,l.slug);
  const walk=value=>{
    if(typeof value==='string')for(const [,tex] of value.matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false}),tex);
    else if(Array.isArray(value))value.forEach(walk);
    else if(value&&typeof value==='object')Object.values(value).forEach(walk);
  };walk(derivativeFigures);
  for(const list of Object.values(derivativeFigures))for(const d of Object.values(list)){
    for(const p of d.points||[])assert.ok(d.curves.some(c=>Math.abs(c.value(p.x)-p.y)<1e-12),d.title);
  }
  for(const d of Object.values(derivativeFigures['closed-interval-extrema'])){
    assert.equal(d.curves[0].to,2);
    assert.ok(d.points.every(p=>!p.open));
    assert.ok(d.points.some(p=>p.x===d.curves[0].from));
    assert.ok(d.points.some(p=>p.x===d.curves[0].to));
  }
});
test('integral diagrams preserve positive heights, intersections, and area values',async()=>{
  const bounded=exercises.filter(e=>/between-(bounded|split)-/.test(e.id));
  assert.equal(bounded.length,12);
  for(const e of bounded){assert.ok(e.hints[0].includes('指定された区間内'));assert.ok(e.hints[0].includes('交点がなければ指定区間全体'));}
  const require=createRequire(import.meta.url);
  const source=readFileSync(new URL('../app/components/IntegralDiagrams.tsx',import.meta.url),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
    .replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href))
    .replace(/import CoordinateDiagram from ["']\.\/CoordinateDiagram["'];?/, 'const CoordinateDiagram=()=>null;');
  const {integralFigures}=await import(url(compiled));
  for(const l of lessons.filter(l=>l.chapter==='積分の考え'&&!['polynomial-integrals','definite-properties'].includes(l.slug)))assert.equal(Object.keys(integralFigures[l.slug]??{}).length,l.examples.length,l.slug);
  const walk=value=>{
    if(typeof value==='string')for(const [,tex] of value.matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>katex.renderToString(tex,{throwOnError:true,strict:'error',trust:false}),tex);
    else if(Array.isArray(value))value.forEach(walk);
    else if(value&&typeof value==='object')Object.values(value).forEach(walk);
  };walk(integralFigures);
  for(const list of Object.values(integralFigures))for(const d of Object.values(list)){
    for(const p of d.points||[])assert.ok(d.curves.some(c=>Math.abs(c.value(p.x)-p.y)<1e-12),d.title);
    for(const a of d.areas||[]){
      assert.ok(a.from<a.to,d.title);
      for(let i=0;i<=100;i++){const x=a.from+(a.to-a.from)*i/100;assert.ok(a.upper(x)-a.lower(x)>=-1e-12,d.title);}
    }
  }
  // Simpson's rule is a numerical regression, not a proof of the area formula.
  const area=a=>{const h=(a.to-a.from)/100;let sum=0;for(let i=0;i<=100;i++){const x=a.from+h*i;sum+=(i===0||i===100?1:i%2?4:2)*(a.upper(x)-a.lower(x));}return sum*h/3;};
  for(const [slug,index,expected] of [['area-with-axis',0,2],['area-with-axis',1,1],['area-between-curves',0,1/6],['area-between-curves',1,1],['chapter-seven-check',1,8/3]]){
    assert.ok(Math.abs(integralFigures[slug][index].areas.reduce((sum,a)=>sum+area(a),0)-expected)<1e-10,slug);
  }
  const signed=integralFigures['definite-integrals'][1].areas;
  assert.ok(Math.abs(-area(signed[0])+area(signed[1])+2)<1e-10);
});

test('number input accepts fullwidth/minus but not expressions, blanks, or trailing garbage',()=>{
  for(const input of ['-1','−1','－１',' -1.0 '])assert.ok(matchesNumber(input,-1));
  for(const input of ['', ' ', '1+0', '1abc', 'Infinity', '1e0'])assert.ok(!matchesNumber(input,1));
  assert.ok(!matchesNumber('2',1));
});
test('hints, early answers, and mistakes stay due and cannot establish independent success',()=>{
  for(const outcome of ['assisted','seen','retry']){
    const list=[attempt('a','r-practice-1-v1',outcome)];
    assert.ok(stateFor('r-practice-1-v1',list).needsHelp);
    assert.ok(!stateFor('r-practice-1-v1',list).retained);
    assert.equal(dueExercises(list).length,1);
  }
});
test('retention needs independent answers on different exercises and different days',()=>{
  const id='r-practice-1-v1',other='r-review-cancel-v1';
  const first=attempt('a',id);
  assert.ok(!stateFor(id,[first,attempt('b',other,'independent',1,id)]).retained);
  assert.ok(!stateFor(id,[first,attempt('b',id,'independent',DAY)]).retained);
  assert.ok(stateFor(id,[first,attempt('b',other,'independent',DAY,id)]).retained);
  assert.ok(!stateFor(id,[first,attempt('b',other,'independent',DAY,id),attempt('c',id,'retry',2*DAY)]).retained);
  assert.equal(stateFor(id,[first],at).due,false);
  assert.equal(stateFor(id,[first],at+DAY).due,true);
});
test('a variant belongs only to its review target; variants rotate',()=>{
  const id='r-practice-1-v1';
  const first=alternateFor(id),list=[attempt('a',first.id,'independent',0,id)];
  assert.equal(historyFor(first.id,list).length,0);
  assert.deepEqual(attemptedExercises(list).map(e=>e.id),[id]);
  assert.notEqual(alternateFor(id,list).id,first.id);
});
test('backups reject malformed data and merge without duplicate attempts',()=>{
  const a=attempt('a','p-practice-1-v1');
  assert.equal(mergeAttempts([a],[a]).length,1);
  assert.deepEqual(parseBackup(JSON.stringify({version:1,attempts:[a,a]})),[a]);
  for(const v of [{version:2,attempts:[]},{version:1,attempts:[{...a,exerciseId:'unknown'}]},{version:1,attempts:[{...a,outcome:'done'}]},{version:1,attempts:[{...a,at:Date.now()+2*DAY}]}]) assert.throws(()=>parseBackup(JSON.stringify(v)));
  assert.throws(()=>parseBackup('{'));
});
test('backup IDs must be own known IDs with a compatible review target and method',()=>{
  const a=attempt('a','p-practice-1-v1');
  for(const patch of [{id:''},{exerciseId:'constructor'},{exerciseId:'__proto__'},{exerciseId:1},{reviewOf:'constructor'},{reviewOf:''},{reviewOf:'r-practice-1-v1'},{reviewOf:'p-practice-3-v1'},{method:'self'}]){
    assert.throws(()=>parseBackup(JSON.stringify({version:1,attempts:[{...a,...patch}]})));
  }
});
test('merging valid backups never creates an unreadable over-limit record',()=>{
  const a=attempt('a','p-practice-1-v1');
  const first=Array.from({length:10001},(_,i)=>({...a,id:'a'+i}));
  const second=Array.from({length:10000},(_,i)=>({...a,id:'b'+i}));
  assert.throws(()=>mergeAttempts(first,second),RangeError);
  assert.equal(first.length,10001);assert.equal(second.length,10000);
  assert.equal(parseBackup(JSON.stringify({version:1,attempts:mergeAttempts(first,second.slice(1))})).length,20000);
});
test('an abandoned preview remains due; final paper self-evaluation resolves that preview',()=>{
  const id='r-practice-1-v1',seen=attempt('session',id,'seen');
  assert.ok(stateFor(id,[seen]).needsHelp);
  const final=attempt('session',id,'independent',100),record=mergeAttempts([seen],[final]);
  assert.equal(record.length,1);
  assert.ok(!stateFor(id,record).needsHelp);
  assert.ok(!stateFor(id,record).retained);
  assert.deepEqual(mergeAttempts(record,[seen]),record);
  assert.equal(mergeAttempts([{...final,at:seen.at}],[seen])[0].outcome,'independent');
});
test('paper previews do not erase independent successes across days, but hints still do',()=>{
  const id='r-practice-1-v1',other='r-review-cancel-v1';
  let record=mergeAttempts([attempt('session1',id,'seen')],[attempt('session1',id,'independent',100)]);
  record=mergeAttempts(record,[attempt('session2',other,'seen',2*DAY,id)]);
  assert.ok(stateFor(id,record).needsHelp);
  record=mergeAttempts(record,[attempt('session2',other,'independent',2*DAY+100,id)]);
  assert.ok(stateFor(id,record).retained);
  const helped=mergeAttempts(record,[attempt('session3',other,'seen',4*DAY,id),attempt('session3',other,'assisted',4*DAY+100,id)]);
  assert.ok(!stateFor(id,helped).retained);
  assert.ok(stateFor(id,helped).needsHelp);
});
test('rational example and exercise transformations agree at admissible test values',()=>{
  const cases=[
    [x=>(x*x-3*x-4)/(x-4),x=>x+1,[4]],
    [x=>(x*x-5*x+6)/(x-2),x=>x-3,[2]],
    [x=>(x*x-9)/(x+3),x=>x-3,[-3]],
    [x=>(x*x-9)/(x*x-x-6),x=>(x+3)/(x+2),[3,-2]],
    [x=>(x*x+x-12)/(x-3),x=>x+4,[3]],
    [x=>(x*x-4)/(x*x+x-6),x=>(x+2)/(x+3),[2,-3]],
  ];
  for(const [before,after,excluded] of cases)for(let x=-9;x<=9;x++)if(!excluded.includes(x))assert.ok(Math.abs(before(x)-after(x))<1e-10);
});
test('site navigation renders native anchors without the failing hosted Link client',async()=>{
  const require=createRequire(import.meta.url);
  const source=readFileSync(new URL('../app/components/SiteLink.tsx',import.meta.url),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText.replace('"react/jsx-runtime"',JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href));
  const {default:SiteLink}=await import(url(compiled.replace('"../lib/site-path"',JSON.stringify(url(compile('../app/lib/site-path.ts'))))));
  assert.equal(renderToStaticMarkup(React.createElement(SiteLink,{href:'/review',className:'button'},'復習')),'<a href="/review" class="button">復習</a>');
  for(const file of ['components/Home','components/LessonView','components/Practice','components/Review','components/Shell','not-found'])assert.ok(!readFileSync(new URL('../app/'+file+'.tsx',import.meta.url),'utf8').includes('next/link'),file);
});
test('storage failure keeps the latest answer exportable without page navigation',()=>{
  const previous=attempt('old','p-practice-1-v1'),latest=attempt('new','p-practice-3-v1');
  for(const storage of [()=>({getItem:()=>null,setItem:()=>{throw new Error('quota');}}),()=>{throw new Error('storage denied');},()=>({getItem:()=>'{bad',setItem:()=>{throw new Error('must not overwrite');}})]){
    const result=progress.persistAttempts([previous],[latest],storage);
    assert.ok(!result.saved);assert.ok(result.error.includes('下のボタン'));
    assert.deepEqual(parseBackup(progress.backupJSON(result.attempts)),mergeAttempts([previous],[latest]));
  }
});
test('storage limit rejection keeps original records and successful saves reload final sessions',()=>{
  const previous=attempt('session','r-practice-1-v1','seen'),final=attempt('session','r-practice-1-v1','independent',100);
  let raw=progress.backupJSON([previous]);
  const storage=()=>({getItem:()=>raw,setItem:(_key,value)=>{raw=value;}});
  const saved=progress.persistAttempts([previous],[final],storage);
  assert.ok(saved.saved);assert.deepEqual(parseBackup(raw),[final]);
  const full=Array.from({length:20000},(_,i)=>({...final,id:'a'+i}));
  const failed=progress.persistAttempts(full,[{...final,id:'extra'}],storage);
  assert.ok(!failed.saved);assert.deepEqual(failed.attempts,full);assert.deepEqual(parseBackup(raw),[final]);
});
test('same-screen rescue download includes the answer whose storage write failed',async t=>{
  const latest=attempt('rescue','p-practice-3-v1');
  const result=progress.persistAttempts([],[latest],()=>({getItem:()=>null,setItem:()=>{throw Error('quota');}}));
  let blob,clicked=false;
  const anchor={href:'',download:'',click(){clicked=true;}};
  const original=globalThis.document;
  globalThis.document={createElement:tag=>{assert.equal(tag,'a');return anchor;}};
  t.after(()=>{if(original===undefined)delete globalThis.document;else globalThis.document=original;});
  t.mock.method(URL,'createObjectURL',value=>{blob=value;return 'blob:qa-record';});
  t.mock.method(URL,'revokeObjectURL',()=>{});
  t.mock.method(globalThis,'setTimeout',callback=>{callback();return 0;});
  progress.downloadBackup(result.attempts);
  assert.ok(clicked);assert.equal(anchor.download,'mathcanvas-record.json');
  assert.deepEqual(parseBackup(await blob.text()),[latest]);
});
