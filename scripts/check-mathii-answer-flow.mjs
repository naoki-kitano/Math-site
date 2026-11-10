import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {loadDisplay} from './test-display-module.mjs';
const require=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??import.meta.url);
const {chromium}=require('playwright');
const {default:Answer}=await loadDisplay('ExerciseAnswerDiagram');
const cases=globalThis.__mathcanvasDiagnosticTestContent.exercises.filter(exercise=>renderToStaticMarkup(React.createElement(Answer,{exercise})));
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000',staticMode=process.env.MATHCANVAS_STATIC==='1',output=process.env.MATHCANVAS_SCREENSHOTS;
if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.MATHCANVAS_BROWSER??'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-features=OverlayScrollbar']});
const results=[],failures=[];
try{
 for(const width of (process.env.MATHCANVAS_WIDTHS??'320,390,1100').split(',').map(Number)){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',e=>failures.push({width,error:e.message}));
  for(const q of cases){
   await page.goto(`${base}/learn/${q.lesson}${staticMode?'.html':''}?exercise=${q.id}#return-question`,{waitUntil:'networkidle'});
   const question=page.locator(`[data-question-id="${q.id}"]`);await question.waitFor();
   assert.equal(await question.locator('.feedback svg').count(),0,'No answer figure before revealing');
   await question.getByRole('button',{name:/^(解答から確かめる|解説を見る)$/}).click();
   await question.locator('.feedback svg').first().waitFor();await page.evaluate(()=>document.fonts.ready);
   const issues=await question.evaluate(el=>{
    const bars=[...el.querySelectorAll('*')].filter(e=>e instanceof HTMLElement&&e.clientHeight&&e.clientWidth&&((/auto|scroll/.test(getComputedStyle(e).overflowX)&&e.scrollWidth>e.clientWidth+1)||(/auto|scroll/.test(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+1))).map(e=>e.className);
    const clipped=[...el.querySelectorAll('foreignObject')].flatMap(box=>{if(getComputedStyle(box).overflow==='visible')return [];const b=box.getBoundingClientRect();return [...box.querySelectorAll('.katex-html>.base')].filter(e=>{const r=e.getBoundingClientRect();return r.left<b.left-2||r.right>b.right+2||r.top<b.top-2||r.bottom>b.bottom+2;}).map(e=>e.closest('[data-tex]')?.getAttribute('data-tex'));});
    return {bars,clipped,mathErrors:el.querySelectorAll('.math-error,.katex-error').length,pageOverflow:document.documentElement.scrollWidth>innerWidth+1,fontReady:document.fonts.check('16px KaTeX_Main')&&document.fonts.check('16px KaTeX_Math')};
   });
   results.push({id:q.id,width,...issues});
   if(issues.bars.length||issues.clipped.length||issues.mathErrors||issues.pageOverflow||!issues.fontReady)failures.push({id:q.id,width,...issues});
   if(output&&['inequality-regions-guided-half-plane-region-1-v1','trig-graphs-practice-negative-v1','trig-inequalities-review-tangent-v1','exponential-graph-practice-graph-read-v1'].includes(q.id))await question.screenshot({path:`${output}/${q.id}-${width}.png`});
  }
  await page.close();
 }
 const report={states:results.length,results,failures};if(output)await writeFile(output+'/results.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));assert.deepEqual(failures,[]);
}finally{await browser.close();}
