import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadDisplay} from '../scripts/test-display-module.mjs';
import {loadContent} from '../scripts/content-module.mjs';

const {lessons,exercises,exerciseById}=globalThis.__mathcanvasDiagnosticTestContent;
const mathI=lessons.filter(l=>l.subject==='数学I');

test('selected warmups and supplemental figures retain the actual question',()=>{
 assert.equal(mathI.length,78);
 let figures=0,optional=0;
 for(const lesson of mathI){
  if(lesson.warmupIds){
   assert.equal(new Set(lesson.warmupIds).size,lesson.warmupIds.length,lesson.slug);
   for(const id of lesson.warmupIds){const e=exerciseById[id];assert.ok(e, id);assert.equal(e.lesson,lesson.slug,id);assert.equal(e.stage,'ready',id);}
  }
  for(const s of lesson.supplements){
   if(s.answerExerciseId){const e=exerciseById[s.answerExerciseId];assert.ok(e,s.id);assert.equal(e.prompt,s.check,`${lesson.slug}/${s.id}`);figures++;}
   for(const example of s.additionalExamples??[]){assert.ok(example.title&&example.text,`${lesson.slug}/${s.id}`);optional++;}
  }
 }
 assert.ok(figures>=20);assert.ok(optional>=100);
});

test('proof steps contain the complete reasoning when the duplicate answer is hidden',()=>{
 const proofs=exercises.filter(e=>e.lesson.startsWith('m1-')&&e.answerInSteps);
 assert.ok(proofs.length>0);
 for(const e of proofs){assert.ok(e.answer&&e.steps.length,e.id);assert.ok(e.steps.every(s=>s.text||s.tex),e.id);}
 for(const e of proofs.filter(e=>e.family.includes('irrational-root'))){
  const reasoning=e.steps.map(s=>s.text+' '+(s.tex??'')).join('\n');
  assert.match(reasoning,/正の整数/,e.id);assert.match(reasoning,/互いに素/,e.id);assert.match(reasoning,/矛盾/,e.id);assert.match(reasoning,/無理数/,e.id);
 }
});

test('every new correspondence diagram is registered and typesets its mathematics',async()=>{
 const {formulaCorrespondence}=await loadContent('formula-correspondence');
 const {default:Diagram}=await loadDisplay('StructureDiagram');
 let count=0;
 for(const [slug,lesson]of Object.entries(formulaCorrespondence).filter(([s])=>s.startsWith('m1-'))){
  assert.ok(lesson.steps[0].text,slug);
  for(const step of lesson.steps)if(step.diagram){
   const html=renderToStaticMarkup(React.createElement(Diagram,{...step.diagram,reduce:true}));
   assert.ok(html,slug+' '+step.diagram.kind);assert.doesNotMatch(html,/math-error|katex-error/,slug);
   assert.doesNotMatch(html,/(?<!\\)(?:cdot|dfrac)/,slug+' lost TeX command escape');count++;
  }
 }
 assert.ok(count>=100);
});

test('a cosine example starts with the cosine condition and preserves its single upper intersection',async()=>{
 const {default:Diagrams}=await loadDisplay('MathOneTrigDiagrams');
 const initial=renderToStaticMarkup(React.createElement(Diagrams,{slug:'m1-equal-sines',index:1,step:0,complete:false}));
 assert.ok(initial);assert.doesNotMatch(initial,/30\^|150\^/);
 assert.ok(initial.includes(String.raw`data-tex="-\tfrac12"`),'negative horizontal coordinate');
});

test('completing square keeps the compensating number and the outer coefficient',async()=>{
 const {formulaCorrespondence:f}=await loadContent('formula-correspondence');
 for(const slug of ['m1-completing-square','m1-completing-square-coefficient'])assert.ok(f[slug].steps.some(s=>s.motion),slug);
 const {default:Answer}=await loadDisplay('ExerciseAnswerDiagram');
 const count=exercises.filter(e=>e.lesson.startsWith('m1-')).filter(exercise=>renderToStaticMarkup(React.createElement(Answer,{exercise}))).length;
 assert.ok(count>=89,'authored number lines, quadratic graphs, and data plots are connected');
});
