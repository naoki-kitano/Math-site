import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3018';
const staticMode=process.env.MATHCANVAS_STATIC==='1';
const junior=process.env.MATHCANVAS_EDITORIAL_SCOPE==='junior';
const mathi=process.env.MATHCANVAS_EDITORIAL_SCOPE==='mathi';
const matha=process.env.MATHCANVAS_EDITORIAL_SCOPE==='matha';
const output=`outputs/editorial${junior?'-junior':mathi?'-mathi':matha?'-matha':''}/browser-${staticMode?'static':'dev'}`;
const {lessons}=await (await import('./content-module.mjs')).loadContent('lessons');
const chapter=lessons.filter(l=>junior?l.subject==='中学数学':mathi?(l.subject==='数学I'||l.subject==='数学A'&&l.chapter==='場合の数'):matha?(l.subject==='数学A'&&l.chapter!=='場合の数'||['式と証明','複素数と方程式'].includes(l.chapter)):l.chapter==='複素数平面');
assert.equal(chapter.length,junior?37:mathi?92:matha?83:10);
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const results=[];
try{
 for(const width of [1100,390]){
  const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'});
  const page=await context.newPage();let errors=[],failedAssets=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400&&['script','stylesheet','font'].includes(r.request().resourceType()))failedAssets.push(r.url());});
  for(const lesson of chapter){
   errors=[];failedAssets=[];
   const response=await page.goto(`${base}/learn/${lesson.slug}${staticMode?'.html':''}`,{waitUntil:'networkidle'});
   assert.equal(response.status(),200,lesson.slug);
   await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
   const original=page.locator('#basics .original-explanation');
   if(await original.count())await original.locator('summary').click();
   const walks=page.locator('.example-walkthrough');
   for(let i=0;i<await walks.count();i++){
    const walk=walks.nth(i),next=walk.getByRole('button',{name:'次の手順',exact:true});
    while(await next.count())await next.click();
    if(lesson.slug==='mc-complex-rotation')assert.equal(await walk.locator(':scope > div[aria-live] .step').count(),3);
    await walk.locator('summary').click();
   }
   const question=page.locator('#practice .question').first();
   await question.getByRole('button',{name:'ヒント',exact:true}).click();
   await question.getByRole('button',{name:'解答から確かめる',exact:true}).click();
   await page.evaluate(async()=>{await document.fonts.load('16px KaTeX_Math','x');await document.fonts.load('16px KaTeX_Main','0');await document.fonts.ready;});
   const state=await page.evaluate(()=>{
    const raw=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
     const n=walker.currentNode;if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;
     if(/\$|\\[a-zA-Z]+/.test(n.textContent))raw.push(n.textContent.slice(0,120));
    }
    return {raw,mathErrors:document.querySelectorAll('.math-error,.katex-error').length,
     overflow:document.documentElement.scrollWidth>innerWidth+1,
     fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)};
   });
   assert.deepEqual(state.raw,[],lesson.slug);assert.equal(state.mathErrors,0,lesson.slug);
   assert.equal(state.overflow,false,lesson.slug);assert.deepEqual(errors,[],lesson.slug);assert.deepEqual(failedAssets,[],lesson.slug);
   assert.ok(state.fonts.includes('KaTeX_Main'));assert.ok(state.fonts.includes('KaTeX_Math'));
   const captures=[['basics',page.locator('#basics')],['example',page.locator('.example').first()]];
   const extraExample={'jr-prime-factors':1,'jr-fractions':1,'jr-quadratic-function':1,'jr-quadratic-equation':3,'jr-probability':1,'jr-root-calculation':1,'jr-simultaneous':1,'jr-expansion':1,'ma-polyhedron-counts':2,'ma-construction-division':1,'ma-space-lines':1,'m1-proof-contradiction':1,'m1-measurement':1,'m1-space-triangles':1,'m1-determine-quadratic':1,'m1-representative-values':3,'m1-histogram':1,'m1-grouping':1,'m1-quadratic-inequality-boundaries':1}[lesson.slug];
   if(extraExample!==undefined)captures.push([`example-${extraExample+1}`,page.locator('.example').nth(extraExample)]);
   for(const [name,locator] of captures){
    const box=await locator.boundingBox();await page.setViewportSize({width,height:Math.max(950,Math.ceil(box.height)+180)});
    await locator.screenshot({path:`${output}/${lesson.slug}-${name}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
    await page.setViewportSize({width,height:950});
   }
   if(lesson.slug==='mc-complex-rotation'){
    const walk=walks.first();
    // Full explanation deliberately hides the duplicate step controls.
    // Return to the step view before testing its reset button.
    await walk.locator('summary').click();
    await walk.getByRole('button',{name:'手順1に戻す',exact:true}).click();
    assert.equal(await walk.locator(':scope > div[aria-live] .step').count(),1);
    assert.equal(await walk.locator('details .step').count(),3);
    assert.equal(await question.locator('.feedback .step').count(),3);
   }
   results.push({slug:lesson.slug,width,allExampleStepsOpened:true,originalOpened:Boolean(await original.count()),practiceHintAndAnswerOpened:true,...state});
   console.log(lesson.slug+' '+width+' OK');
  }
  await context.close();
 }
 if(!junior&&!mathi&&!matha){
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
 const touchPage=await touch.newPage();
 await touchPage.goto(`${base}/learn/mc-complex-rotation${staticMode?'.html':''}`,{waitUntil:'networkidle'});
 await touchPage.addStyleTag({content:'html{scroll-behavior:auto!important}'});
 const panel=touchPage.locator('.complex-rotation');
 assert.ok(await panel.getByRole('checkbox',{name:'動きを減らす',exact:true}).isChecked());
 await panel.locator('.rotation-stages button').nth(1).tap();assert.equal(await panel.getAttribute('data-progress'),'1');
 await panel.locator('.rotation-controls .button').first().tap();assert.equal(await panel.getAttribute('data-progress'),'2');
 await panel.getByRole('button',{name:'初めに戻す',exact:true}).tap();assert.equal(await panel.getAttribute('data-progress'),'0');
 const touchWalk=touchPage.locator('.example-walkthrough').first();
 await touchWalk.getByRole('button',{name:'次の手順',exact:true}).tap();
 assert.equal(await touchWalk.locator(':scope > div[aria-live] .step').count(),2);
 await touch.close();
 await writeFile(`${output}/touch.json`,JSON.stringify({width:390,touchEmulation:true,OSReducedMotion:true,stageTap:true,nextTap:true,resetTap:true,exampleStepTap:true},null,2));
 }
 await writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
}finally{await browser.close();}
