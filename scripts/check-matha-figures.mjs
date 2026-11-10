import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadDisplay} from './test-display-module.mjs';

const require=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??import.meta.url);
const {chromium}=require('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000';
const output=process.env.MATHCANVAS_SCREENSHOTS;
const {default:Answer}=await loadDisplay('ExerciseAnswerDiagram');
const Examples=await Promise.all(['Counting','Probability','Geometry','Space','Integer'].map(async name=>(await loadDisplay('MathA'+name+'Diagrams')).default));
const {MathText}=await loadDisplay('MathText');
const {exercises,lessons}=globalThis.__mathcanvasDiagnosticTestContent;
const cases=exercises.filter(e=>e.lesson.startsWith('ma-')).flatMap(exercise=>{
 const html=renderToStaticMarkup(React.createElement(Answer,{exercise}));
 return html?[{id:exercise.id,prompt:exercise.prompt,html}]:[];
});
const answerCount=cases.length;
for(const lesson of lessons.filter(l=>l.subject==='数学A'))lesson.examples.forEach((example,index)=>{
 const html=renderToStaticMarkup(React.createElement(React.Fragment,null,...Examples.map((Example,i)=>React.createElement(Example,{key:i,slug:lesson.slug,index}))));
 if(html)cases.push({id:lesson.slug+'-example-'+index,prompt:example.prompt,html});
});
assert.ok(cases.length>20,'Actual Math A example figures must be present');
const response=await fetch(base+'/learn/ma-combination'+(process.env.MATHCANVAS_STATIC==='1'?'.html':''));
assert.ok(response.ok);
const source=await response.text();
const styles=[...source.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m=>new URL(m[1],base+'/').href);
assert.ok(styles.length>=1,'Use the actual site styles');
const cssSnapshots=await Promise.all(styles.map(async url=>({url,css:await (await fetch(url,{headers:{Accept:'text/css'}})).text()})));
assert.ok(cssSnapshots.every(s=>!s.css.startsWith('import ')),'Stylesheets must contain CSS, not development modules');
const html='<!doctype html><html lang="ja"><head><meta charset="utf-8">'+styles.map(href=>`<link rel="stylesheet" href="${href}">`).join('')+'</head><body><main class="wrap focused-layout"><div class="lesson-body">'+cases.map(c=>`<section class="block"><article class="question"><h3>${renderToStaticMarkup(React.createElement(MathText,{text:c.prompt}))}</h3><div class="feedback" data-answer-id="${c.id}">${c.html}</div></article></section>`).join('')+'</div></main></body></html>';
if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.MATHCANVAS_BROWSER??'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const results=[];
try{
 for(const width of (process.env.MATHCANVAS_WIDTHS??'320,390,1100').split(',').map(Number)){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  for(const {url,css} of cssSnapshots)await page.route(url,route=>route.fulfill({status:200,contentType:'text/css',body:css}));
  const auditUrl=new URL('/__matha_figures__',base).href;
  await page.route(auditUrl,route=>route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html}));
  const runtime=[],fontFailures=[];
  page.on('pageerror',e=>runtime.push(e.message));
  page.on('response',r=>{if(/\.woff2?(\?|$)/.test(r.url())&&!r.ok())fontFailures.push(r.url());});
  await page.goto(auditUrl,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  const issues=await page.evaluate(()=>{
   const id=el=>el.closest('[data-answer-id]')?.getAttribute('data-answer-id');
   const bars=[...document.querySelectorAll('[data-answer-id] *')].filter(el=>el instanceof HTMLElement&&el.clientHeight&&el.clientWidth&&((/auto|scroll/.test(getComputedStyle(el).overflowX)&&el.scrollWidth>el.clientWidth+1)||(/auto|scroll/.test(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight+1))).map(el=>({id:id(el),class:el.className}));
   const outside=[...document.querySelectorAll('[data-answer-id] .katex-html>.base')].filter(el=>{
    if(el.closest('.sr-only'))return false;
    const r=el.getBoundingClientRect(),b=el.closest('[data-answer-id]').getBoundingClientRect();
    return r.left<b.left-2||r.right>b.right+2;
   }).map(el=>({id:id(el),tex:el.closest('[data-tex]')?.getAttribute('data-tex')}));
   const raw=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
   while((n=walker.nextNode()))if(!n.parentElement.closest('.katex,script,style')&&/\$|\\[A-Za-z]+/.test(n.textContent))raw.push({id:id(n.parentElement),text:n.textContent});
   const clippedLabels=[...document.querySelectorAll('[data-answer-id] foreignObject')].flatMap(box=>{
    if(getComputedStyle(box).overflow==='visible')return [];
    const b=box.getBoundingClientRect();return [...box.querySelectorAll('.katex-html>.base')].filter(el=>{const r=el.getBoundingClientRect();return r.left<b.left-2||r.right>b.right+2||r.top<b.top-2||r.bottom>b.bottom+2;}).map(el=>({id:id(el),tex:el.closest('[data-tex]')?.getAttribute('data-tex')}));
   });
   return {bars,outside,raw,clippedLabels,mathErrors:document.querySelectorAll('.math-error,.katex-error').length,pageOverflow:document.documentElement.scrollWidth>innerWidth+1,fonts:{main:document.fonts.check('16px KaTeX_Main'),math:document.fonts.check('16px KaTeX_Math')}};
  });
  results.push({width,cases:cases.length,...issues,runtime,fontFailures});
  if(output){
   const representatives=['ma-circular-permutation-example-0','ma-probability-tree-example-1','ma-angle-bisector-example-0','ma-circle-tangent','ma-space','ma-euclidean'];
   for(const prefix of representatives){const c=cases.find(c=>c.id.startsWith(prefix));if(c)await page.locator(`[data-answer-id="${c.id}"]`).screenshot({path:`${output}/${c.id}-${width}.png`});}
  }
  await page.close();
 }
 const report={answerCount,exampleStates:cases.length-answerCount,ids:cases.map(c=>c.id),results};
 if(output)await writeFile(output+'/results.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
 for(const r of results){assert.equal(r.pageOverflow,false);assert.equal(r.mathErrors,0);for(const key of ['bars','outside','raw','clippedLabels','runtime','fontFailures'])assert.deepEqual(r[key],[],`${r.width}: ${key}`);assert.ok(r.fonts.main&&r.fonts.math);}
}finally{await browser.close();}
