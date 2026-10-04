import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {contentModule} from '../scripts/content-module.mjs';
import {loadDisplay} from '../scripts/test-display-module.mjs';
const {originalTriangle,rotateClockwise}=await import(contentModule(new URL('../app/lib/unit-circle-motion.ts',import.meta.url)));
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-12,`${a} != ${b}`);
test('clarity revisions preserve mathematical reasons rather than generic instructions',async()=>{
 const {lessons,exercises}=await import(contentModule(new URL('../app/content/lessons.ts',import.meta.url)));
 const lesson=slug=>lessons.find(l=>l.slug===slug);
 assert.equal(lessons.length,466);assert.equal(exercises.length,11111);
 assert.match(JSON.stringify(lesson('mc-complex-rotation')),/中心.*原点/);
 assert.match(JSON.stringify(lesson('ma-space-lines-planes')),/二平面の平行と垂直/);
 assert.doesNotMatch(JSON.stringify(lesson('ma-expected-value')),/確率の大きい額ほど/);
 assert.match(JSON.stringify(lesson('ma-equally-likely')),/二色というだけでは理由になりません/);
 assert.match(JSON.stringify(lesson('ma-construction-division')),/直線.*上にない半直線/);
 assert.match(lesson('m1-cosine-law-angle').rule,/対辺の二乗/);
 assert.doesNotMatch(JSON.stringify(lesson('m1-trig-sides-angles')),/整理と/);
 assert.match(JSON.stringify(lesson('mb-balance-recurrence')),/A_\{k\+1\}-50000/);
 assert.match(JSON.stringify(lesson('mb-proportion-interval')),/標準誤差の推定値/);
 const checkExactNumbers=value=>{
  if(typeof value==='string')assert.doesNotMatch(value,/\d+\.\d{12,}/,'do not expose floating-point noise in student text');
  else if(Array.isArray(value))value.forEach(checkExactNumbers);
  else if(value&&typeof value==='object')Object.values(value).forEach(checkExactNumbers);
 };
 checkExactNumbers(lessons);checkExactNumbers(exercises);
 const {workedText}=await import(contentModule(new URL('../app/content/worked-text.ts',import.meta.url)));
 assert.equal(workedText('条件','解説','解説','答え'),'条件\n解説\n答え');
 assert.equal(workedText('解説','異なる理由','解説'),'解説\n異なる理由\n解説');
 const {stepHeading,distinctSteps}=await import(contentModule(new URL('../app/lib/step-heading.ts',import.meta.url)));
 assert.equal(stepHeading('順に進める'),'');assert.equal(stepHeading('共通の因数で割る'),'共通の因数で割る');
 assert.equal(distinctSteps([{title:'$x=1$ の場合',text:'成り立ちます。'},{title:'$x=2$ の場合',text:'成り立ちます。'}]).length,2,'different mathematical conditions must survive');
 assert.deepEqual(distinctSteps([{title:'着目する',text:'共通因数で割ります。'},{title:'共通の因数で割る',text:'共通因数で割ります。'}]),[{title:'共通の因数で割る',text:'共通因数で割ります。'}]);
 const {Steps}=await loadDisplay('Practice');
 const html=renderToStaticMarkup(React.createElement(Steps,{steps:[{title:'順に進める',text:'同じ説明'},{title:'答え',text:'同じ説明'}]}));
 assert.equal((html.match(/同じ説明/g)||[]).length,1);assert.doesNotMatch(html,/順に進める/);
});
test('relations preserve factor signs, midpoint coverage, projection and Riemann bounds',async()=>{
 const {quadraticSign,midpointOnSegment,dotProjection,squareRiemann}=await import(contentModule(new URL('../app/lib/relation-models.ts',import.meta.url)));
 for(const x of [-2,-1,0,1,2,3]){const f=quadraticSign(x);close(f.value,x*x-x-2);assert.equal(f.value<0,x>-1&&x<2);}
 for(let i=0;i<=20;i++){const t=-1+i/10,{p,q}=midpointOnSegment(t);close(p[0]*2,q[0]);close(p[1]*2,q[1]);close(p[1],2*p[0]);assert.ok(p[0]>=-.5&&p[0]<=.5);const reverse=midpointOnSegment(2*p[0]);close(reverse.p[0],p[0]);close(reverse.p[1],p[1]);}
 for(const [angle,value] of [[60,6],[90,0],[120,-6]])close(dotProjection(angle).dot,value);
 for(const n of [4,8,16,32]){const r=squareRiemann(n);close(r.upper-r.lower,1/n);assert.ok(r.lower<1/3&&1/3<r.upper);}
 const {default:Component}=await loadDisplay('RelationExplorer');
 for(const slug of ['m1-quadratic-inequality','locus-equations','mc-vector-dot','m3-riemann-sums']){
  const html=renderToStaticMarkup(React.createElement(Component,{slug}));assert.match(html,/<math /);assert.doesNotMatch(html,/math-error|katex-error/);
 }
 const {default:Rotation}=await loadDisplay('ComplexRotationExplorer');
 const html=renderToStaticMarkup(React.createElement(Rotation));
 assert.match(html,/<mi>α<\/mi>/);assert.doesNotMatch(html,/<mi>a<\/mi><mi>l<\/mi><mi>p<\/mi>/,'escaped alpha must not become a word');
});

test('nontrigonometric visual models preserve extrema, cancellation, counts and rotation distance',async()=>{
 const models=await import(contentModule(new URL('../app/lib/visual-models.ts',import.meta.url)));
 assert.deepEqual(models.intervalCases,[{a:-1,b:3},{a:0,b:3},{a:2,b:3}],'keep the right endpoint fixed and move the left endpoint rightward');
 const expected=[{min:0,max:4,minX:[1],maxX:[-1,3]},{min:0,max:4,minX:[1],maxX:[3]},{min:1,max:4,minX:[2],maxX:[3]}];
 models.intervalCases.forEach(({a,b},i)=>{
  const {min,max,minX,maxX}=models.intervalExtrema(a,b);assert.deepEqual({min,max,minX,maxX},expected[i]);
 });
 for(let i=0;i<=60;i++){
  const {center,point}=models.centeredRotation(i/20);
  close(Math.hypot(point[0]-center[0],point[1]-center[1]),Math.sqrt(10));
 }
 assert.deepEqual(models.centeredRotation(0),{center:[1,2],point:[4,3]});
 const end=models.centeredRotation(3);close(end.point[0],0);close(end.point[1],5);
 const halfway=models.centeredRotation(1.5);assert.ok(halfway.point[0]<3&&halfway.point[1]>1,'counterclockwise');
 assert.equal(models.rotationCenterLabel(.5),null);assert.equal(models.rotationCenterLabel(2.5),null);
 assert.equal(models.rotationCenterLabel(1.5),'O');
 assert.equal(models.combinationPairs.length,6);
 assert.equal(new Set(models.combinationPairs.flatMap(p=>[p,[...p].reverse().join('')])).size,12);
 assert.equal(models.geometricRows.original.reduce((a,b)=>a+b),30);
 assert.deepEqual(models.geometricRows.scaled,models.geometricRows.original.map(x=>2*x));
});

test('all new visual introductions render through shared math components without duplicate introductory steps',async()=>{
 const {visualLessons}=await import(contentModule(new URL('../app/content/visual-lessons.ts',import.meta.url)));
 const {lessonStarts}=await import(contentModule(new URL('../app/content/lesson-starts.ts',import.meta.url)));
 const {default:Visual}=await loadDisplay('VisualLessonExplorer');
 const {MathText,Formula}=await loadDisplay('MathText');
 assert.equal(Object.keys(visualLessons).length,8);
 for(const [slug,data] of Object.entries(visualLessons)){
  assert.equal(data.steps.length,data.text.length);assert.equal(data.tex.length,data.text.length);
  assert.equal(lessonStarts[slug].steps.length,0);
  for(const text of [data.goal,data.check,...data.text])assert.doesNotMatch(renderToStaticMarkup(React.createElement(MathText,{text})),/math-error|katex-error/);
  for(const tex of data.tex)assert.doesNotMatch(renderToStaticMarkup(React.createElement(Formula,{tex})),/math-error|katex-error/);
  const html=renderToStaticMarkup(React.createElement(Visual,{slug}));
  assert.match(html,/data-stage="0"/);assert.match(html,/<math /);assert.doesNotMatch(html,/math-error|katex-error/);
 }
});

test('coordinate reading and angle reduction use different actual lesson figures',async()=>{
 const {readFileSync}=await import('node:fs');
 const source=readFileSync(new URL('../app/components/LessonView.tsx',import.meta.url),'utf8');
 assert.ok(source.includes('lesson.slug==="trig-unit-circle"&&<UnitCircleCoordinates/>'));
 assert.ok(source.includes('lesson.slug==="trig-angle-change"&&<UnitCircleExplorer/>'));
 const {default:Component,coordinateCases}=await loadDisplay('UnitCircleCoordinates');
 for(const p of coordinateCases) {
  close(p.x*p.x+p.y*p.y,1);
  if(p.x===0)assert.equal(p.tan,null);
  else assert.equal(p.tan.startsWith('-'),p.x*p.y<0);
 }
 const html=renderToStaticMarkup(React.createElement(Component));
 assert.doesNotMatch(html,/math-error|katex-error/);
 assert.match(html,/<mfrac>/);
 assert.doesNotMatch(html,/時計回りに回す/);
 const {lessonStarts}=await import(contentModule(new URL('../app/content/lesson-starts.ts',import.meta.url)));
 assert.ok(!JSON.stringify(lessonStarts['trig-unit-circle']).includes('4\\pi'));
 assert.equal(lessonStarts['trig-angle-change'].steps.length,0,'do not repeat the animated example before it starts');
});

test('clockwise motion preserves the rigid triangle, not a moving axis projection',()=>{
 const {origin,foot,point}=originalTriangle;
 for(const degree of [0,30,60,90,120,150,180]){
  const o=rotateClockwise(origin,degree),h=rotateClockwise(foot,degree),p=rotateClockwise(point,degree);
  close(distance(o,h),.5);close(distance(h,p),Math.sqrt(3)/2);close(distance(o,p),1);
  close((o[0]-h[0])*(p[0]-h[0])+(o[1]-h[1])*(p[1]-h[1]),0);
 }
 const quarter=rotateClockwise(point,90);
 assert.ok(quarter[0]<0&&quarter[1]>0,'clockwise must pass through Q2');
 const end=rotateClockwise(point,180);
 close(end[0],.5);close(end[1],Math.sqrt(3)/2);
 assert.ok(originalTriangle.point[1]<0,'original sine stays negative');
 const intermediate=rotateClockwise(point,45);
 assert.ok(Math.abs(intermediate[1])!==distance(rotateClockwise(foot,45),intermediate));
});

test('all seven subject routes keep typeset instructions and their existing definitions',async()=>{
 const {lessonStarts}=await import(contentModule(new URL('../app/content/lesson-starts.ts',import.meta.url)));
 const {lessons}=await import(contentModule(new URL('../app/content/lessons.ts',import.meta.url)));
 const {subjectForChapter}=await import(contentModule(new URL('../app/content/chapters.ts',import.meta.url)));
 const {MathText}=await loadDisplay('MathText');
 const subjects=new Set();
 assert.equal(Object.keys(lessonStarts).length,20);
 for(const [slug,start] of Object.entries(lessonStarts)){
  const lesson=lessons.find(l=>l.slug===slug);assert.ok(lesson);
  subjects.add(subjectForChapter(lesson.chapter));
  assert.ok(lesson.introduction.length>0&&lesson.rule,'original definitions retained');
  for(const text of [start.goal,...start.steps,start.check]){
   const html=renderToStaticMarkup(React.createElement(MathText,{text}));
   assert.doesNotMatch(html,/math-error|katex-error/);
   if(text.includes('$'))assert.match(html,/<math /);
  }
 }
 assert.equal(subjects.size,7);
});

test('new concept figures render formulas through KaTeX and start without motion',async()=>{
 const {default:Component}=await loadDisplay('ConceptExplorer');
 for(const slug of ['jr-linear-equation','ma-conditional-probability','mb-arithmetic-sum','mc-vector-sum','m3-derivative-meaning']){
  const html=renderToStaticMarkup(React.createElement(Component,{slug}));
  assert.match(html,/data-progress="0"/);
  assert.doesNotMatch(html,/math-error|katex-error/);
  assert.match(html,/<math /);
  assert.match(html,/リセット/);
 }
});

test('new mathematical figures render actual TeX through the display components',async()=>{
 for(const name of ['UnitCircleExplorer','ParabolaExplorer']){
  const {default:Component}=await loadDisplay(name);
  const html=renderToStaticMarkup(React.createElement(Component));
  assert.doesNotMatch(html,/math-error|katex-error/);
  assert.match(html,/<math /);
  assert.match(html,/リセット/);
  assert.match(html,/動きを減らす/);
  assert.doesNotMatch(html,/data-tex="\\\\/,'doubled TeX slash in rendered attributes');
  if(name==='UnitCircleExplorer'){
   assert.match(html,/<msqrt>/);assert.match(html,/<mfrac>/);
   assert.match(html,/原点を中心に時計回り/);
  }
 }
});
