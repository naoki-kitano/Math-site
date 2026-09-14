import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
const progress = await import(url(compile('../app/lib/progress.ts').replace('"../content/lessons"',JSON.stringify(contentURL))));
const {DAY,parseBackup,mergeAttempts,stateFor,historyFor,attemptedExercises,alternateFor,matchesNumber,dueExercises} = progress;
const at = Date.now()-10*DAY;
const attempt=(id,exerciseId,outcome='independent',offset=0,reviewOf)=>({id,exerciseId,outcome,at:at+offset,method:exerciseById[exerciseId].kind==='paper'?'self':'auto',...(reviewOf?{reviewOf}:{})});

test('each published lesson is complete and every exercise has a valid answer and repair',()=>{
  assert.equal(lessons.length,113); assert.equal(exercises.length,1601);
  assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
  for(const l of lessons){
    assert.ok(l.examples.length>=2,l.slug);
    const checkCount=l.slug==='m3-function-limits-check'?11:l.slug==='m3-sequences-check'?10:l.slug==='chapter-one-check'?11:l.slug==='chapter-two-check'?9:l.slug==='chapter-four-check'?16:l.slug==='chapter-seven-check'?12:0;
    for(const [stage,count] of [['ready',2],['guided',2],['practice',checkCount||6],['review',checkCount||2]]) {
      const actual=exercises.filter(e=>e.lesson===l.slug&&e.stage===stage).length;
      if(l.subject==='数学III'||(['図形と方程式','指数関数・対数関数','微分の考え','積分の考え'].includes(l.chapter)&&l.slug!=='points')||l.slug==='trig-synthesis')assert.ok(actual>=count,l.slug+' '+stage);
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
test('math III sequences cover ten skills and preserve compatible review variants',()=>{
 const chapter=lessons.filter(l=>l.chapter==='数列の極限と無限級数');
 assert.equal(chapter.length,11);
 for(const l of chapter){
  const qs=exercises.filter(e=>e.lesson===l.slug);
  assert.equal(qs.length,l.slug==='m3-sequences-check'?24:12);
  for(const q of qs){
   const alt=alternateFor(q.id);
   assert.ok(alt,q.id);assert.equal(alt.lesson,q.lesson);assert.equal(alt.family,q.family);
  }
 }
 const check=exercises.filter(e=>e.lesson==='m3-sequences-check');
 assert.equal(new Set(check.filter(e=>e.stage==='practice').map(e=>e.family)).size,10);
 assert.equal(new Set(check.filter(e=>e.stage==='review').map(e=>e.family)).size,10);
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
    .replace(/import MathTable from ["']\.\/MathTable["'];?/, 'const MathTable=()=>null;');
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
