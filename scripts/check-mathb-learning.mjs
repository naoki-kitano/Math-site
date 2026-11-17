// Inspect actual lesson transitions in the same Chromium viewport used for learning.
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {loadContent} from './content-module.mjs';

const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000';
const suffix=process.env.MATHCANVAS_STATIC==='1'?'.html':'';
const out=process.env.MATHCANVAS_SCREENSHOTS??'/tmp/mathb-learning';
const widths=(process.env.MATHCANVAS_WIDTHS??'320,390,1100').split(',').map(Number);
const requested=process.env.MATHCANVAS_SLUGS?.split(',');
const {formulaCorrespondence}=await loadContent('formula-correspondence');
const {mathBLessons}=await loadContent('mathb');
const lessons=mathBLessons.filter(l=>!l.slug.endsWith('-check')&&(!requested||requested.includes(l.slug)));
assert.ok(lessons.length>0,'No Math B lessons selected');
for (const lesson of lessons) assert.ok(formulaCorrespondence[lesson.slug]?.steps.length,lesson.slug+' is missing its basic lesson sequence');
const representatives=new Set(['mb-arithmetic-sum','mb-power-sums','mb-weighted-geometric','mb-affine-recurrence','mb-sequence-terms','mb-binomial-distribution','mb-data-function','mb-sample-mean','mb-normal-distribution','mb-mean-interval','mb-two-sided-test','mb-balance-recurrence','mb-residuals','mb-survey-simulation']);
const {chromium}=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??import.meta.url)('playwright');
const browser=await chromium.launch({headless:true,...(process.env.MATHCANVAS_CHROMIUM?{executablePath:process.env.MATHCANVAS_CHROMIUM}:{}),args:['--no-sandbox','--disable-dev-shm-usage']});
await mkdir(path.join(out,'screens'),{recursive:true});
const records=[], movements=[], handoffs=[], examples=[], simulations=[], checkpoints=[], errors=[],screens=[];
const url=(slug,hash)=>base+'/learn/'+slug+suffix+'#'+hash;
const pane='.task-pane:not([hidden])';

function inspect(){
 const active=document.querySelector('.task-pane:not([hidden])');
 const visible=el=>el.getClientRects().length>0&&el.checkVisibility();
 const shown=[...active.querySelectorAll('*')].filter(visible);
 const view=innerWidth, raw=[], innerBars=[], leaks=[], bad=[], issues=[];
 const walker=document.createTreeWalker(active,NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
  const el=walker.currentNode.parentElement;
  if(!el||el.closest('script,style,.katex,.sr-only,title,desc')||!visible(el))continue;
  if(/\$|\\[a-z]+|[¥￥][A-Za-z]/i.test(walker.currentNode.nodeValue))raw.push(walker.currentNode.nodeValue.slice(0,150));
 }
 for(const el of shown){
  if(el.closest('.sr-only,.katex-mathml')||!(el instanceof HTMLElement))continue;
  const css=getComputedStyle(el), r=el.getBoundingClientRect();
  if((['auto','scroll'].includes(css.overflowX)&&el.scrollWidth>el.clientWidth+2)||(['auto','scroll'].includes(css.overflowY)&&el.scrollHeight>el.clientHeight+2))innerBars.push(el.tagName+'.'+el.className);
  if(el.matches('.formula,.katex-html')&&(r.left < -2 || r.right>view+2))leaks.push([el.className,r.left,r.right,el.closest('.formula')?.dataset.tex]);
 }
 const failed=[...document.fonts].filter(f=>f.status==='error').map(f=>f.family);
 const tags=shown.filter(e=>e.matches('.math-error,.katex-error')).map(e=>e.textContent);
 const controls=shown.filter(e=>e.matches('button.step-next'));
 const next=controls[0],rect=next?.getBoundingClientRect(),hit=rect&&document.elementFromPoint(rect.x+rect.width/2,rect.y+rect.height/2);
 const readout=active.querySelector('.formula-correspondence-readout,.walkthrough-current');
 const figure=readout?.querySelector('.structure-diagram'),figRect=figure?.getBoundingClientRect();
 const bar=next?.closest('.learning-step-controls')?.getBoundingClientRect();
 if(controls.length!==1||!rect||next.disabled||rect.bottom>innerHeight+1||!next.contains(hit))issues.push('primary control');
 if(document.documentElement.scrollWidth>view+1)issues.push('page width');
 if(raw.length||tags.length||innerBars.length||leaks.length||failed.length)issues.push('math/layout/font');
 if(figure){
  if(!figure.childElementCount||figRect.height<1)issues.push('empty diagram');
  for(const fo of figure.querySelectorAll('foreignObject')){
   const bounds=fo.getBoundingClientRect();
   for(const txt of fo.querySelectorAll('.katex-html')){
    const rr=txt.getBoundingClientRect();
    if(rr.width>0&&(rr.left<bounds.left-2||rr.right>bounds.right+2||rr.bottom>bounds.bottom+2||rr.top<bounds.top-2))bad.push({tex:txt.closest('.formula')?.dataset.tex,outer:[bounds.width,bounds.height],inner:[rr.width,rr.height]});
   }
  }
 }
 return {raw,tags,innerBars,leaks,failed,issues,diagram:!!figure,figureContent:figure?.getAttribute('aria-label')??figure?.querySelector('[aria-label]')?.getAttribute('aria-label')??null,foreignObjectCandidates:bad,primary:rect?[rect.x,rect.y,rect.width,rect.height]:null,role:active.dataset.taskPane,formulaCount:shown.filter(n=>n.matches('.katex')).length,contentBelowControls:bar&&readout?Math.max(0,Math.round(readout.getBoundingClientRect().bottom-bar.top)):null,theme:document.body.dataset.appearance??'cool'};
}

async function record(page, slug, width, stage, kind, config){
 await page.evaluate(()=>document.fonts.ready);
 const signal=await page.evaluate(inspect);
 const state={slug,width,stage,kind,config,...signal};
 records.push(state);
 if(signal.issues.length){errors.push({type:'display',...state});console.error('Display:',slug,width,stage,signal.issues,signal.leaks.slice(0,1));}
 return state;
}

async function movement(page){
 return page.evaluate(async()=>{
  const region=document.querySelector('.formula-correspondence-readout');
  if(!region)return null;
  function frame(){
   return [...region.querySelectorAll('svg :is(g,path,rect,circle,line,polygon,polyline,foreignObject),[style]')].map(el=>{
    const s=getComputedStyle(el),values=['x','y','d','cx','cy','x1','y1','x2','y2','points','transform','height','width'].map(n=>el.getAttribute(n)??'').join(' ');
    return values+'/'+s.transform+'/'+s.opacity+'/'+s.strokeDashoffset;
   }).join('|');
  }
  const animations=region.getAnimations({subtree:true}).map(a=>({type:a.constructor.name,duration:a.effect?.getComputedTiming().activeDuration}));
  const initial=frame();await new Promise(r=>setTimeout(r,140));const mid=frame();await new Promise(r=>setTimeout(r,240));const later=frame();
  await Promise.allSettled(region.getAnimations({subtree:true}).map(animation=>animation.finished));
  return {animations,changes:initial!==mid||mid!==later};
 });
}

async function capture(page,slug,width,stage,kind){
 const name=slug+'-'+width+'-'+kind+'-'+stage+'.png';
 await page.screenshot({path:path.join(out,'screens',name)});
 screens.push(name);
}

async function run(width){
 const context=await browser.newContext({viewport:{width,height:width===320?568:width===390?844:900},reducedMotion:width===320?'reduce':'no-preference'});
 const page=await context.newPage();
 page.setDefaultTimeout(15000);
 page.setDefaultNavigationTimeout(45000);
 let route='';
 page.on('pageerror',e=>errors.push({type:'runtime',route,msg:e.message}));
 page.on('requestfailed',r=>{if(r.failure()?.errorText!=='net::ERR_ABORTED')errors.push({type:'network',route,url:r.url(),msg:r.failure()?.errorText});});
 page.on('response',r=>{if(r.status()>=400)errors.push({type:'http',route,url:r.url(),status:r.status()});});
 const primary=page.locator(pane+' button.step-next:visible');
 try{
  for(const [i,lesson] of lessons.entries()){
   route=lesson.slug;const sequence=formulaCorrespondence[route],count=sequence.steps.length,rep=representatives.has(route);
   const res=await page.goto(url(route,'basics'),{waitUntil:'networkidle'});assert.equal(res?.status(),200,route);
   const active=page.locator(pane+' [data-formula-lesson="'+route+'"]');
   await active.waitFor();
   if(i===0&&width===320){
    await page.getByRole('button',{name:'表示',exact:true}).click();await page.getByRole('radio',{name:'暖色'}).check();await page.keyboard.press('Escape');
   }
   const box=active.getByRole('checkbox',{name:'動きを減らす'});
   const manual=process.env.MATHCANVAS_MANUAL_REDUCED==='1'&&await box.count()>0;
   if(manual)await box.check();
   let position;
   for(let stage=0;stage<count;stage++){
    await page.waitForFunction(({slug,n})=>document.querySelector('[data-formula-lesson="'+slug+'"]')?.dataset.stage===String(n),{slug:route,n:stage});
    if(sequence.steps[stage].diagram?.animated&&stage>0&&process.env.MATHCANVAS_MEASURE_MOTION==='1'){
     const sample=await movement(page);if((manual||width===320)&&(sample?.changes||sample?.animations.length))errors.push({type:'reduced motion still active',route,width,stage,sample});movements.push({slug:route,width,stage,manual,osReduced:width===320,...sample});
    }
    const state=await record(page,route,width,stage,'basic',{manual,osReduced:width===320});
    if(!position)position=state.primary;
    if(position&&state.primary&&position.some((v,k)=>Math.abs(v-state.primary[k])>1))errors.push({type:'primary moved',route,width,stage});
    if(state.diagram!==Boolean(sequence.steps[stage].diagram))errors.push({type:'diagram mismatch',route,width,stage});
    if(rep&&state.diagram&&(stage===1||(route==='mb-power-sums'&&stage===2)))await capture(page,route,width,stage,'basic');
    const references=page.locator(pane+' details.original-explanation');
    if(stage<count-1)assert.equal(await references.count(),0,route+' premature extra references');
    if(stage===count-1&&route!=='mb-survey-simulation'){
     const summary=references.locator(':scope > summary');
     assert.equal(await summary.innerText(),'公式と資料');
     await summary.click();
     await record(page,route,width,stage,'references',{});
     await summary.click();
    }
    if(route==='mb-survey-simulation'&&stage===count-1){
     const experiment=page.locator(pane+' details').filter({has:page.getByText('硬貨を投げて確かめる',{exact:true})});
     await experiment.locator('summary').click();
     const before=await page.evaluate(()=>JSON.stringify(localStorage)),run=experiment.getByRole('button',{name:'一組投げる'});
     for(let j=0;j<10;j++)await run.click();
     assert.ok(await run.isDisabled(), 'ten-run limit');
     const rows=await experiment.locator('tbody tr').allTextContents();assert.equal(rows.length,10);
     await record(page,route,width,stage,'simulation',{samples:10});
     await experiment.getByRole('button',{name:'やり直す'}).click();assert.equal(await experiment.locator('tbody tr').count(),0);
     await run.click();assert.deepEqual(await experiment.locator('tbody tr').allTextContents(),rows.slice(0,1));
     assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),before);simulations.push({width,checkedLimit:10,repeatable:true});
     await experiment.locator(':scope > summary').click();
    }
    if(stage===count-1&&count>1){
     await active.locator('button.step-previous').click();
     await page.waitForFunction(n=>document.querySelector('.task-pane:not([hidden]) [data-formula-lesson]')?.dataset.stage===String(n),stage-1);
     await primary.click();await page.waitForFunction(n=>document.querySelector('.task-pane:not([hidden]) [data-formula-lesson]')?.dataset.stage===String(n),stage);
    }
    await primary.click();
   }
   const example=page.locator('[data-task-pane="example-0"]:not([hidden])');
   await example.waitFor();handoffs.push({slug:route,width});
   if(rep){
    const walkthrough=example.locator('.example-walkthrough');
    for(let j=0;j<15;j++){
     if(!await example.isVisible())break;
     await record(page,route,width,j,'example',{});
     if(j===0&&width===390)await capture(page,route,width,j,'example');
     const prev=await walkthrough.getAttribute('data-step');await primary.click();
     await page.waitForFunction(last=>{const el=document.querySelector('[data-task-pane="example-0"]:not([hidden]) .example-walkthrough');return !el||el.dataset.step!==last;},prev);
    }
    assert.ok(!await example.isVisible(),route+' example exhausted step budget');examples.push({slug:route,width});
   }
   if(i%10===0)console.log(JSON.stringify({width,finished:i+1,total:lessons.length,errors:errors.length}));
  }
  if(!requested)for(const lesson of mathBLessons.filter(l=>l.slug.endsWith('-check'))){
   const response=await page.goto(url(lesson.slug,'basics'),{waitUntil:'networkidle'});assert.equal(response.status(),200);
   await page.locator('[data-task-pane="example-0"]:not([hidden])').waitFor();checkpoints.push({slug:lesson.slug,width});
  }
 } catch(error){
  const state=await page.locator(pane).evaluateAll(nodes=>nodes.map(el=>({task:el.dataset.taskPane,stage:el.querySelector('[data-formula-lesson]')?.dataset.stage,text:el.innerText.slice(0,300)})));
  errors.push({type:'failed navigation state',route,width,url:page.url(),state});
  await page.screenshot({path:path.join(out,'screens','failure-'+route+'-'+width+'.png')});
  throw error;
 } finally{await context.close();}
}

try{
 for(const width of widths)await run(width);
} catch(error){errors.push({type:'harness or navigation',message:String(error),stack:error.stack});throw error;}
finally{
 await browser.close();
 const result={base,widths,lessons:lessons.length,checked:records.length,basics:records.filter(r=>r.kind==='basic').length,examples, handoffs,simulations,checkpoints,movements,records,screens,errors};
 await writeFile(path.join(out,'results.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify({checked:records.length,checkedHandoffs:handoffs.length,examples:examples.length,errors:errors.length,out}));
}
assert.deepEqual(errors,[]);
