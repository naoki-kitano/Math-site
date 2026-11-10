import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadDisplay} from '../scripts/test-display-module.mjs';
import {loadContent} from '../scripts/content-module.mjs';

const {lessons,exercises,exerciseById}=globalThis.__mathcanvasDiagnosticTestContent;
const mathA=lessons.filter(lesson=>lesson.subject==='数学A');

test('math A supplementary answers refer to the exact displayed problem and retain guided practice',()=>{
 let links=0,alternates=0;
 for(const lesson of mathA){
  for(const example of lesson.examples)for(const id of example.guidedIds){
   const question=exerciseById[id];
   assert.ok(question,id);assert.equal(question.lesson,lesson.slug,id);assert.equal(question.stage,'guided',id);
  }
  for(const id of lesson.warmupIds??[]){
   const question=exerciseById[id];assert.ok(question,id);assert.equal(question.lesson,lesson.slug,id);assert.equal(question.stage,'ready',id);
  }
  for(const supplement of lesson.supplements){
   const name=lesson.slug+'/'+supplement.id;
   if(supplement.answerExerciseId){
    const question=exerciseById[supplement.answerExerciseId];
    assert.ok(question,name);assert.equal(supplement.check,question.prompt,name+' must not borrow a different problem figure');links++;
   }
   for(const example of supplement.additionalExamples??[]){
    assert.ok(example.title&&example.text,name);assert.notEqual(example.text,supplement.text,name+' must retain a separate example');alternates++;
   }
  }
 }
 assert.ok(links>=432,'existing mathematics A supplements retain exact exercise links');
 assert.ok(alternates>0,'optional changed-condition examples remain available');
});

test('each mathematics A correspondence module is registered and all its diagram stages render',async t=>{
 const {formulaCorrespondence}=await loadContent('formula-correspondence');
 const {default:Diagram}=await loadDisplay('StructureDiagram');
 const seen=new Set();let stages=0;
 for(const [name,exportName]of [['counting','mathACountingCorrespondence'],['probability','mathAProbabilityCorrespondence'],['geometry','mathAGeometryCorrespondence'],['space','mathASpaceCorrespondence'],['integer','mathAIntegerCorrespondence']]){
  const authored=(await loadContent('matha-'+name+'-correspondence'))[exportName];
  assert.ok(Object.keys(authored).length>0,name);
  for(const [slug,lesson]of Object.entries(authored)){
   assert.ok(!seen.has(slug),'duplicate correspondence '+slug);seen.add(slug);
   assert.ok(mathA.some(item=>item.slug===slug),slug+' has a real lesson');
   assert.deepEqual(formulaCorrespondence[slug],lesson,slug+' is connected to the lesson registry');
   for(const step of lesson.steps)if(step.diagram){
    assert.ok(step.diagram.kind.startsWith('ma-'+name+'-'),slug+' uses its authored diagram family');
    assert.ok(Number.isInteger(step.diagram.stage)&&step.diagram.stage>=0,slug);
    for(const reduce of [false,true]){
     const html=renderToStaticMarkup(React.createElement(Diagram,{...step.diagram,reduce}));
     assert.ok(html.trim(),slug+'/'+step.diagram.kind+'/'+step.diagram.stage);
     assert.doesNotMatch(html,/math-error|katex-error|NaN|Infinity|\$/,slug+' must render mathematical notation rather than raw delimiters');
     // Doubled operator/formatting commands can parse as a row break plus
     // letters. A legitimate array row starting with a variable (\\x) is valid.
     for(const [,tex]of html.matchAll(/<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/g)){
      assert.doesNotMatch(tex,/(?<!\\)\\\\(?:times|cdot|quad|qquad|longrightarrow|rightarrow|Rightarrow|Longrightarrow|frac|dfrac|tfrac|sqrt|left|right|begin|end|text|color|sum|prod|lim|log|sin|cos|tan|vec|overline|underline|mathbb|mathrm|ge|le|neq|in)\b/,slug+' has a doubled TeX command in its rendered diagram: '+tex);
     }
    }
    stages++;
   }
  }
 }
 assert.ok(stages>0);t.diagnostic(JSON.stringify({registeredLessons:seen.size,diagramStages:stages,renderedStates:stages*2}));
});

test('the second probability-tree example and its diagram use three red and two blue balls',async()=>{
 const lesson=mathA.find(item=>item.slug==='ma-probability-tree'),example=lesson.examples[1];
 assert.match(example.prompt,/赤玉 \$3\$ 個、青玉 \$2\$ 個/);
 assert.match(example.prompt,/戻して/);assert.match(example.prompt,/色が異なる/);
 const balls=['red','red','red','blue','blue'];
 const ordered=balls.flatMap(first=>balls.map(second=>[first,second]));
 const successes=ordered.filter(([first,second])=>first!==second);
 assert.equal(ordered.length,25);assert.equal(successes.length,12);
 const steps=example.steps.map(step=>(step.text??'')+' '+(step.tex??'')).join('\n');
 assert.match(steps,/\\frac\{12\}\{25\}/);
 const {default:Diagrams}=await loadDisplay('MathAProbabilityDiagrams');
 const html=renderToStaticMarkup(React.createElement(Diagrams,{slug:lesson.slug,index:1}));
 assert.ok(html);assert.doesNotMatch(html,/math-error|katex-error/);
 const formulas=[...html.matchAll(/data-tex="([^"]*)"/g)].map(match=>match[1]);
 assert.equal((html.match(/<path\b/g)??[]).length,6,'two first branches and four second branches');
 assert.deepEqual(formulas.filter(tex=>tex===String.raw`\frac35`||tex===String.raw`\frac25`),
  [String.raw`\frac35`,String.raw`\frac25`,String.raw`\frac35`,String.raw`\frac25`,String.raw`\frac35`,String.raw`\frac25`],
  'both first outcomes retain the same three-red/two-blue probabilities after replacement');
 assert.match(html,/赤・青/);assert.match(html,/青・赤/);
 assert.equal(formulas.filter(tex=>tex===String.raw`\frac6{25}`).length,2,'each disjoint path has probability 6/25');
 assert.ok(formulas.some(tex=>tex.includes(String.raw`=\frac{12}{25}`)),'sum agrees with independent enumeration');
 const guided=example.guidedIds.map(id=>exercises.find(question=>question.id===id));
 assert.ok(guided.every(question=>question?.family==='tree-union'));
});
