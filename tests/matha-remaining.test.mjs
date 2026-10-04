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
const get=async file=>import(moduleURL(new URL('../app/content/'+file+'.ts',import.meta.url)));
const g=await get('matha-chapter3'),s=await get('matha-chapter4'),i=await get('matha-chapter5'),p=await get('matha-chapter2');
const banks=[...p.mathAProbabilityTopics,...g.mathAGeometryTopics,...s.mathASpaceTopics,...i.mathAIntegerTopics];
const lessons=[...p.mathAChapter2Lessons,...g.mathAChapter3Lessons,...s.mathAChapter4Lessons,...i.mathAChapter5Lessons];
const exercises=[...p.mathAChapter2Exercises,...g.mathAChapter3Exercises,...s.mathAChapter4Exercises,...i.mathAChapter5Exercises];
const strings=x=>typeof x==='string'?[x]:Array.isArray(x)?x.flatMap(strings):x&&typeof x==='object'?Object.values(x).flatMap(strings):[];

test('internal division diagram uses the proof points and preserves the required ratios',async()=>{
 const {spaceFigure}=await get('matha-space-figures');
 const figure=spaceFigure('ma-construction-division',1),{A,B,C,D,P}=figure.points;
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
 assert.equal(distance(A,D)/distance(A,C),1/2);
 assert.equal(distance(A,P)/distance(A,B),1/2);
 assert.equal(distance(A,P),distance(P,B));
 assert.equal((P[0]-D[0])*(B[1]-C[1])-(P[1]-D[1])*(B[0]-C[0]),0);
 assert.ok(figure.dashed.some(([a,b])=>a==='D'&&b==='P'));
 for(const index of [0,1]){
  const drawing=spaceFigure('ma-construction-division',index);
  const labeled=Object.entries(drawing.points).filter(([name])=>drawing.labels?.[name]!=='');
  assert.equal(new Set(labeled.map(([,point])=>point.join(','))).size,labeled.length,'distinct names must not overlap at the same point');
 }
});
test('math A chapters 2–5 preserve all planned pages and every review decision',t=>{
 assert.deepEqual([p.mathAProbabilityTopics.length,g.mathAGeometryTopics.length,s.mathASpaceTopics.length,i.mathAIntegerTopics.length],[15,18,9,14]);
 for(const chapter of new Set(lessons.map(l=>l.chapter))){
  const ls=lessons.filter(l=>l.chapter===chapter),qs=exercises.filter(e=>ls.some(l=>l.slug===e.lesson));
  t.diagnostic(JSON.stringify({chapter,lessons:ls.length,examples:ls.reduce((n,l)=>n+l.examples.length,0),questions:qs.length,supplements:ls.reduce((n,l)=>n+l.supplements.length,0)}));
 }
 assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
 for(const l of lessons){
  const qs=exercises.filter(e=>e.lesson===l.slug);
  assert.ok(qs.filter(e=>e.stage==='practice').length>=6,l.slug);
  assert.equal(qs.filter(e=>e.stage==='ready').length,2,l.slug);
  for(const example of l.examples)assert.ok(example.guidedIds.every(id=>qs.some(e=>e.id===id&&e.stage==='guided')),l.slug);
  for(const e of qs){
   assert.ok(e.hints[0].length>5&&e.steps.length>=2,e.id);
   assert.ok(l.supplements.some(h=>h.id===e.repair),e.id);
   assert.ok(qs.some(v=>v.id!==e.id&&v.family===e.family&&v.prompt!==e.prompt&&['practice','review'].includes(v.stage)),e.id);
  }
 }
 for(const b of banks){
  const check=lessons.find(l=>l.chapter===b.lesson.chapter&&l.practiceGroups);
  for(const sk of b.skills)assert.ok(exercises.some(e=>e.lesson===check.slug&&e.stage==='practice'&&e.family===b.lesson.slug+'-'+sk.id),b.lesson.slug+sk.id);
 }
});
test('all new formulas and captions are strict and preserve literal TeX commands',async()=>{
 const figs=await get('matha-geometry-figures'),space=await get('matha-space-figures'),int=await get('matha-integer-figures');
 const diagrams=banks.flatMap(b=>b.lesson.examples.flatMap((_,j)=>[figs.geometryFigure(b.lesson.slug,j),space.spaceFigure(b.lesson.slug,j),int.integerFigure(b.lesson.slug,j)]).filter(Boolean));
 for(const text of strings({lessons,exercises,diagrams})){
  assert.ok([...text].every(c=>c.charCodeAt(0)>=32||c==='\n'||c==='\r'),'lost command '+text);
  assert.equal((text.match(/\$/g)||[]).length%2,0,text);
  for(const [,tex] of text.matchAll(/\$([^$]+)\$/g)){
   assert.doesNotMatch(tex,/\\\\[a-zA-Z]|\\binom|[0-9]\/[0-9]/);
   katex.renderToString(tex,{throwOnError:true,strict:'error'});
  }
 }
});
test('geometry answers retain feasible triangles, inner/outer ratios and positive lengths',async()=>{
 const {geoAudit}=await get('matha-geometry-questions');
 for(const {q,kind,args:a} of geoAudit){
  let v;
  switch(kind){
   case 'angle':assert.ok(a[0]>0&&a[1]>0&&a[0]+a[1]<180);v=180-a[0]-a[1];break;
   case 'similar':v=a[2]/a[0]*a[1];break;
   case 'parallel':v=a[0]/(a[0]+a[1])*a[2];break;
   case 'area':v=(a[0]/a[1])**(a[2]?2:1);break;
   case 'exists':v=+(a[0]+a[1]>a[2]&&a[0]+a[2]>a[1]&&a[1]+a[2]>a[0]);break;
   case 'bisector':assert.ok(a[0]+a[1]>a[2]&&a[0]+a[2]>a[1]&&a[1]+a[2]>a[0]);if(a[3])assert.ok(a[1]>a[0]);v=a[0]/a[1];break;
   case 'cevian':v=1/(a[0]/a[1]*a[2]/a[3]);if(a[4])assert.ok(v>1);break;
   case 'tangent':assert.ok(a[0]>a[1]);v=Math.sqrt((a[0]-a[1])*(a[0]+a[1]));break;
   case 'power':{const product=a[0]*(a[3]?a[0]+a[1]:a[1]);v=a[4]?Math.sqrt(product):product/a[2];if(a[3]&&!a[4])assert.ok(v>a[2]);break;}
   case 'common':{const leg=a[3]?a[0]+a[1]:a[0]-a[1];v=Math.sqrt(a[2]*a[2]-leg*leg);assert.ok(v>0);break;}
   default:throw Error(kind);
  }
  assert.ok(Math.abs(q.value-v)<1e-9,kind+JSON.stringify(a));
 }
});
test('figures have valid points, the marked circles and tangencies agree with coordinates',async()=>{
 const {geometryFigure}=await get('matha-geometry-figures');
 const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),dot=(a,b)=>a[0]*b[0]+a[1]*b[1],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
 for(const b of g.mathAGeometryTopics)for(let j=0;j<b.lesson.examples.length;j++){
  const fig=geometryFigure(b.lesson.slug,j);if(!fig)continue;
  for(const point of Object.values(fig.points))assert.ok(point.every(Number.isFinite));
  for(const edge of [...fig.edges,...fig.dashed??[]])assert.ok(edge.every(n=>fig.points[n]));
 }
 for(const [slug,index] of [['ma-power-of-point',0],['ma-power-of-point',1],['ma-inscribed-angle',0],['ma-cyclic-quadrilateral',0],['ma-tangent-chord',0]]){
  const fig=geometryFigure(slug,index),circle=fig.circles[0];
  for(const name of ['A','B','C','D'].filter(n=>fig.points[n]))assert.ok(Math.abs(distance(fig.points[name],circle.center)-circle.radius)<1e-8,slug+name);
 }
 for(const index of [0,1]){
  const fig=geometryFigure('ma-common-tangents',index),{O,P,T,U}=fig.points;
  assert.ok(Math.abs(dot(sub(T,O),sub(U,T)))<1e-8);
  assert.ok(Math.abs(dot(sub(U,P),sub(U,T)))<1e-8);
 }
 for(const slug of ['ma-ceva','ma-geometry-converses']){
  const {A,B,C,D,E,F}=geometryFigure(slug,0).points,u=sub(D,A),v=sub(E,B),ba=sub(B,A),t=cross(ba,v)/cross(u,v),P=[A[0]+t*u[0],A[1]+t*u[1]];
  assert.ok(Math.abs(cross(sub(P,C),sub(F,C)))<1e-8);
 }
 const {D,E,F}=geometryFigure('ma-menelaus',0).points;
 assert.ok(Math.abs(cross(sub(E,D),sub(F,D)))<1e-8);
});
test('integer arithmetic agrees with independent enumeration and modular checks',async()=>{
 const {integerAudit}=await get('matha-integer-questions');
 const gcd=(a,b)=>{while(b){const t=a%b;a=b;b=t;}return a;};
 for(const {q,kind,args:a} of integerAudit){
  let v;
  switch(kind){
   case 'divisors':case 'factor-count':v=Array.from({length:a[0]},(_,j)=>j+1).filter(d=>a[0]%d===0).length;break;
   case 'prime':v=+(a[0]>1&&!Array.from({length:a[0]-2},(_,j)=>j+2).some(d=>a[0]%d===0));break;
   case 'square-factor':v=1;while(!Number.isInteger(Math.sqrt(a[0]*v)))v++;break;
   case 'gcd':v=a[2]?a[0]*a[1]/gcd(a[0],a[1]):gcd(a[0],a[1]);break;
   case 'division':v=((a[0]%a[1])+a[1])%a[1];break;
   case 'digit-rule':v=+(a[0]%a[1]===0);break;
   case 'euclid':v=gcd(...a);break;
   case 'solutions':{const [aa,b,c,x0,y0,A,B]=a;assert.equal(aa*x0+b*y0,c);assert.equal(aa*B-b*A,0);for(let x=-20;x<=20;x++)for(let y=-20;y<=20;y++)if(aa*x+b*y===c){assert.ok(Number.isInteger((x-x0)/B));assert.equal(y,y0-A*(x-x0)/B);}continue;}
   case 'count-solutions':{const [aa,b,c,positive]=a;v=0;for(let x=positive;x<=c;x++)for(let y=positive;y<=c;y++)if(aa*x+b*y===c)v++;break;}
   case 'decimal':{let d=a[1]/gcd(...a);while(d%2===0)d/=2;while(d%5===0)d/=5;v=+(d===1);break;}
   case 'binary-encode':case 'binary-decode':v=parseInt(a[0].toString(2),2);break;
   case 'binary-add':v=a[0]+a[1];break;
   case 'tiling':v=a[0]*a[1]/gcd(...a)**2;break;
   default:throw Error(kind);
  }
  assert.equal(q.value,v,kind+JSON.stringify(a));
 }
});
test('chapter checks retain negative remainder, zero choices, nonexistence and geometry conditions',()=>{
 const practiced=exercises.filter(e=>e.stage==='practice'&&lessons.find(l=>l.slug===e.lesson)?.practiceGroups);
 for(const fragment of ['negative-remainder','no-integer-solutions','positive-solutions','nonnegative-solutions','coordinate-plane','converse-ceva','converse-menelaus','external-bisector','external-power','line-plane','construct-tangent-from']){
  assert.ok(practiced.some(e=>e.family.endsWith('-'+fragment)),fragment);
 }
 assert.ok(practiced.some(e=>e.prompt.includes('$(0,0,0)$')));
});
test('mixed practice alternates decisions and repairs include changed conditions',()=>{
 for(const bank of banks){
  const qs=bank.exercises.filter(e=>e.stage==='practice');
  assert.notEqual(qs[0].family,qs[1].family,bank.lesson.slug);
 }
 for(const [slug,family,needed] of [
  ['ma-independent-trials','dependence','独立ではありません'],
  ['ma-parallel-ratios','part-whole','決められません'],
  ['ma-divisors-primes','prime-judgment','素数ではありません'],
  ['ma-linear-diophantine','all-integer-solutions','au+bv=1'],
  ['ma-coordinates-space','coordinate-axis','原点']]){
  const text=lessons.find(l=>l.slug===slug).supplements.find(s=>s.id===family).text;
  assert.ok(text.includes(needed),slug);
 }
});
test('subject descriptions and browser metadata describe the completed subjects',()=>{
 const home=readFileSync(new URL('../app/components/Home.tsx',import.meta.url),'utf8');
 assert.ok(home.includes('数と式、集合と命題、二次関数、図形と計量、データの分析'));
 assert.ok(home.includes('場合の数と確率、図形の性質と作図、整数と数学の活用'));
 assert.ok(!home.includes('数と式・平方根・不等式の基礎'));
 for(const route of ['math-one','math-two','math-three','math-a']){
  const source=readFileSync(new URL(`../app/${route}/page.tsx`,import.meta.url),'utf8');
  assert.ok(!source.includes('| MathCanvas'),'layout owns the title suffix');
 }
});

test('the Euler example illustration satisfies its stated vertex and face counts',async()=>{
 const {spaceFigure}=await get('matha-space-figures');
 const fig=spaceFigure('ma-polyhedron-counts',2);
 const vertices=Object.keys(fig.points),edges=[...fig.edges,...fig.dashed??[]];
 const uniqueEdges=new Set(edges.map(e=>[...e].sort().join('/')));
 assert.equal(vertices.length,6);
 assert.equal(uniqueEdges.size,9);
 assert.equal(2-vertices.length+uniqueEdges.size,5);
 assert.equal(edges.length,uniqueEdges.size);
 for(const edge of edges)assert.ok(edge.every(v=>vertices.includes(v)));
});
