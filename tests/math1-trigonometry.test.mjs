import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
import katex from 'katex';
function moduleURL(file){
 const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 return 'data:text/javascript;base64,'+Buffer.from(code.replace(/from\s+["']([^"']+)["']/g,(_,p)=>'from '+JSON.stringify(p.startsWith('.')?moduleURL(new URL(p+(existsSync(new URL(p+'.ts',file))?'.ts':'.tsx'),file)):import.meta.resolve(p)))).toString('base64');
}
const chapter=await import(moduleURL(new URL('../app/content/math1-chapter4.ts',import.meta.url)));
const {math1Chapter4Topics:topics,math1Chapter4Lessons:lessons,math1Chapter4Exercises:exercises,math1TrigCoverage:coverage,math1TrigCheckLesson:check}=chapter;
const {specialValues,fraction,root}=await import(moduleURL(new URL('../app/content/math1-trig-authoring.ts',import.meta.url)));
const {ssaCases}=await import(moduleURL(new URL('../app/content/math1-triangle-choice.ts',import.meta.url)));
test('trig chapter has fifteen lessons, explicit guided groups and operation-specific repairs',()=>{
 assert.equal(topics.length,15);assert.equal(lessons.length,16);
 for(const{lesson,exercises:es}of topics){
  assert.equal(lesson.chapter,'図形と計量');
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
test('every trig formula has strict notation and actual radical markup',()=>{
 walk([lessons,exercises],(text,path)=>{
  assert.equal((text.match(/\$/g)||[]).length%2,0,path);
  assert.doesNotMatch(text,/\$\{/,path);
  assert.ok([...text].every(c=>c.charCodeAt(0)>=32||c==='\n'||c==='\r'||c==='\t'),path);
  const ts=[...text.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
  if(path.endsWith('/tex')&&text)ts.push(text);
  for(const tex of ts){
   assert.doesNotMatch(tex,/\/|\\binom|\\\\[A-Za-z]/,tex);
   const html=katex.renderToString(tex,{strict:'error',throwOnError:true,output:'htmlAndMathml'});
   if(tex.includes('\\sqrt'))assert.match(html,/<msqrt>/,tex);
  }
 });
});
test('chapter check explicitly retains all families and all selected variants',()=>{
 assert.equal(check.practiceGroups.length,3);
 const practice=exercises.filter(e=>e.lesson===check.slug&&e.stage==='practice');
 assert.deepEqual(check.practiceGroups.flatMap(g=>g.exerciseIds).sort(),practice.map(e=>e.id).sort());
 for(const{lesson,exercises:es}of topics)for(const family of new Set(es.map(e=>e.family))){
  const c=coverage.find(c=>c.lesson===lesson.slug&&c.family===family);assert.ok(c,lesson.slug+'/'+family);
  assert.ok(c.sourceIds.length>=2);
  for(const id of c.sourceIds){
   const source=es.find(e=>e.id===id);
   assert.ok(exercises.some(e=>e.lesson===check.slug&&e.family===c.checkFamily&&e.prompt===source.prompt&&['practice','review'].includes(e.stage)),id);
  }
 }
});
test('exact rational/root helpers preserve sign and square values',()=>{
 assert.equal(fraction(0,5),'0');assert.equal(fraction(3,-5),'-\\frac{3}{5}');assert.equal(fraction(-6,-4),'\\frac{3}{2}');
 for(let n=0;n<=400;n++){
  const tex=root(n),match=tex.match(/^(\d*)\\sqrt\{(\d+)\}$/);
  if(match)assert.equal(Number(match[1]||1)**2*Number(match[2]),n);
  else assert.equal(Number(tex)**2,n);
 }
});
test('special values and angle candidates preserve endpoints and all SSA solutions',()=>{
 assert.equal(specialValues[90][2],null);assert.equal(specialValues[180][0],'0');assert.equal(specialValues[180][1],'-1');
 for(const c of ssaCases){
  assert.equal(new Set(c.candidates).size,c.candidates.length);
  assert.ok(c.candidates.every(B=>B>0&&B<180));
  const sin=c.candidates.map(B=>Math.sin(B*Math.PI/180));
  assert.ok(sin.every(s=>Math.abs(s-sin[0])<1e-12));
  const valid=c.candidates.filter(B=>c.A+B<180);
  assert.ok(valid.length>=1&&valid.length<=2);
  assert.ok(valid.every(B=>180-c.A-B>0));
 }
 assert.ok(ssaCases.some(c=>c.candidates.filter(B=>c.A+B<180).length===2));
 assert.ok(ssaCases.some(c=>c.candidates.length===2&&c.candidates.filter(B=>c.A+B<180).length===1));
});
test('method-choice answers include the chosen method and why, not only a hint',()=>{
 for(const e of exercises.filter(e=>e.family.includes('choose-triangle-method'))){
  assert.match(e.answer,/から|ので/);assert.match(e.answer,/定理|性質|定義/);
 }
});
const {mathOneTrigFigures:figures,mathOneTrigCoordinateFigures:coordinates}=await import(moduleURL(new URL('../app/components/MathOneTrigDiagrams.tsx',import.meta.url)));
const {math1TrigTables:tables}=await import(moduleURL(new URL('../app/content/math1-trig-tables.ts',import.meta.url)));
test('all ordinary examples have diagrams, real right angles and circle coordinates',()=>{
 for(const {lesson}of topics)lesson.examples.forEach((_,i)=>assert.ok(figures[lesson.slug]?.[i]||coordinates[lesson.slug]?.[i],lesson.slug+'/'+i));
 for(const fs of Object.values(figures))for(const f of fs){
  assert.ok(f.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
  for(const [i,j,k]of f.right??[]){
   const a=f.points[i],o=f.points[j],b=f.points[k];
   assert.ok(Math.abs((a.x-o.x)*(b.x-o.x)+(a.y-o.y)*(b.y-o.y))<1e-9,f.title);
  }
  if(f.circle)for(const p of f.points.filter(p=>p.label!=='O'))assert.ok(Math.abs(Math.hypot(p.x-f.circle.x,p.y-f.circle.y)-f.circle.r)<1e-9,f.title);
  for(const p of f.points)katex.renderToString(p.label,{throwOnError:true,strict:'error'});
  for(const e of f.edges)if(e.label)katex.renderToString(e.label,{throwOnError:true,strict:'error'});
 }
 for(const fs of Object.values(coordinates))for(const f of fs){
  assert.match(f.axisDescription,/横座標.*縦座標/);
  for(const p of f.points)assert.ok(Math.abs(Math.hypot(p.x,p.y)-f.arcs[0].r)<1e-9);
 }
 walk([figures,coordinates,tables],(text)=>{
  for(const [,tex]of text.matchAll(/\$([^$]+)\$/g))katex.renderToString(tex,{throwOnError:true,strict:'error'});
 });
});
test('degree tables have rectangular rows and the undefined tangent is explicit',()=>{
 for(const ts of Object.values(tables))for(const t of ts)for(const row of t.rows)assert.equal(row.length,t.headers.length);
 assert.ok(tables['m1-trig-relations'][0].rows.some(row=>row[0]==='$90^\\circ$'&&row[3]==='定義されない'));
});
test('boundary repairs and alternates retain zero, unit sine and right SSA decisions',()=>{
 const get=id=>exercises.find(e=>e.id===id);
 for(const [id,family]of [
  ['m1-trig-coordinates-endpoint-ratios-4-v1','endpoint-tangent-domain'],
  ['m1-equal-sines-sine-all-angles-4-v1','unit-sine-angle'],
  ['m1-equal-sines-sine-all-angles-5-v1','zero-sine-endpoints'],
  ['m1-equal-sines-sine-all-angles-6-v1','zero-sine-endpoints'],
  ['m1-triangle-choice-ssa-candidates-5-v1','ssa-right-candidate'],
  ['m1-triangle-choice-ssa-candidates-6-v1','ssa-right-candidate'],
 ]){assert.equal(get(id).family,family);assert.equal(get(id).repair,family);}
 assert.match(get('m1-equal-sines-sine-all-angles-4-v1').steps[0].text,/x\^2\+1=1/);
 for(const k of [2,5])assert.doesNotMatch(get(`m1-trig-coordinates-endpoint-ratios-${k}-v1`).steps[0].text,/\\tan/);
 for(const k of [5,6]){assert.match(get(`m1-triangle-choice-ssa-candidates-${k}-v1`).hints[0],/直角一つ/);assert.doesNotMatch(get(`m1-triangle-choice-ssa-candidates-${k}-v1`).hints[0],/鋭角と鈍角/);}
 const branch=exercises.filter(e=>e.family==='ssa-angle-feasibility');
 assert.ok(branch.some(e=>e.answer.startsWith('存在しません')));assert.ok(branch.some(e=>e.answer.startsWith('存在します')));
 for(const c of coverage.filter(c=>['unit-sine-angle','zero-sine-endpoints','ssa-right-candidate','ssa-angle-feasibility'].includes(c.family))){
  assert.ok(exercises.filter(e=>e.lesson===check.slug&&e.family===c.checkFamily&&e.stage==='practice').length>=2);
 }
});
test('method choice is explained before calculation, sums carry units, and perpendicular planes are covered',()=>{
 for(const e of exercises.filter(e=>e.family.includes('choose-triangle-method')))assert.match(e.steps[0].text,/ので.*選びます/);
 for(const e of exercises.filter(e=>e.family==='survey-height')){
  assert.match(e.answer,/H=\([^)]+\)\\,\\mathrm\{m\}/);
  assert.match(e.steps[0].text,/メートル単位の数値/);
 }
 assert.match(lessons.find(l=>l.slug==='m1-space-triangles').introduction[3],/垂直.*90\^\\circ.*小さい方/);
});
test('sine-law and SSA numerical cases independently satisfy the given ratios and complete candidate sets',async()=>{
 const {sineSideCases}=await import(moduleURL(new URL('../app/content/math1-triangle-laws.ts',import.meta.url)));
 const value=s=>{const match=s.match(/^(\d*)\\sqrt(?:\{(\d+)\}|(\d+))$/);return match?Number(match[1]||1)*Math.sqrt(Number(match[2]||match[3])):Number(s);};
 const sin=A=>Math.sin(A*Math.PI/180);
 for(const t of sineSideCases)assert.ok(Math.abs(value(t.a)*sin(t.B)-value(t.b)*sin(t.A))<1e-10);
 for(const t of ssaCases){
  const s=value(t.b)*sin(t.A)/value(t.a),alpha=Math.asin(Math.min(1,s))*180/Math.PI;
  const expected=Math.abs(alpha-90)<1e-5?[90]:[alpha,180-alpha];
  assert.equal(expected.length,t.candidates.length);
  expected.forEach((A,i)=>assert.ok(Math.abs(A-t.candidates[i])<1e-5));
 }
});
