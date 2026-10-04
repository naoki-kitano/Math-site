import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {loadContent} from './content-module.mjs';
const {visualLessons}=await loadContent('visual-lessons');
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3016';
const staticMode=process.env.MATHCANVAS_STATIC==='1';
const output='outputs/visual-expansion-'+(staticMode?'static':'dev');
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),results=[];
try{
 for(const width of [1100,390]){
  const context=await browser.newContext({viewport:{width,height:950},hasTouch:width===390,reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(m.text());});
  const capture=async(locator,path)=>{
   const viewport=page.viewportSize(),box=await locator.boundingBox();
   await page.setViewportSize({...viewport,height:Math.max(viewport.height,Math.ceil(box.height)+180)});
   await locator.scrollIntoViewIfNeeded();
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await locator.screenshot({path,style:'.topbar{visibility:hidden}'});
   await page.setViewportSize(viewport);
  };
  const inspect=async()=>{
   await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>{
    const raw=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){const n=walker.currentNode;if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;if(/\$|\\[a-zA-Z]+/.test(n.textContent))raw.push(n.textContent.slice(0,150));}
    return {raw,overflow:document.documentElement.scrollWidth>innerWidth+1,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)};
   });
   assert.deepEqual(state.raw,[]);assert.equal(state.overflow,false);assert.ok(state.fonts.includes('KaTeX_Main'));
   assert.equal(await page.locator('.math-error,.katex-error').count(),0);assert.deepEqual(errors,[]);
  };
  for(const [slug,data] of Object.entries(visualLessons).filter(([,data])=>data.kind!=='rotation')){
   await page.goto(base+'/learn/'+slug+(staticMode?'.html':''),{waitUntil:'networkidle'});
   await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
   const visual=page.locator('.visual-lesson');
   assert.equal(await visual.count(),1);
   assert.equal(await page.locator('.lesson-start ol').count(),0);
   for(let step=0;step<data.steps.length;step++){
    await visual.getByRole('group',{name:'考える段階',exact:true}).getByRole('button').nth(step).click();
    await inspect();
    await capture(visual,output+'/'+slug+'-'+step+'-'+width+'.png');
   }
   if(data.kind==='extrema'){
    for(let i=0;i<3;i++){
     await visual.getByRole('group',{name:'定義域を選ぶ'}).getByRole('button').nth(i).click();
     assert.equal(await visual.getAttribute('data-stage'),'0');
     await visual.getByRole('group',{name:'考える段階'}).getByRole('button').last().click();
     await inspect();
     await capture(visual,output+'/extrema-case'+i+'-'+width+'.png');
    }
   }
   await visual.getByRole('button',{name:'初めに戻す',exact:true}).click();
   assert.equal(await visual.getAttribute('data-stage'),'0');
   await visual.getByRole('button',{name:'次の段階を見る',exact:true}).focus();await page.keyboard.press('Enter');
   assert.equal(await visual.getAttribute('data-stage'),'1');
   await page.locator('.original-explanation summary').click();await inspect();
   results.push({slug,width,stages:data.steps.length,rawTeX:0,overflow:false,errors:0});
  }
  await context.close();
 }
 await writeFile(output+'/results.json',JSON.stringify({results,animationControls:'checked separately by check-rotation-clarity.mjs'},null,2));
 console.log(JSON.stringify({pages:results.length,stages:results.reduce((s,r)=>s+r.stages,0),animationControls:'checked separately by check-rotation-clarity.mjs',rawTeX:0,overflow:false}));
}finally{await browser.close();}
