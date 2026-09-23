import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 await mkdir('outputs/function-clarity',{recursive:true});
 for(const width of [1100,390]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  for(const route of ['/','/learn/m3-rational-functions','/learn/m3-radical-functions']) {
   await page.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.math-error,.katex-error').count(),0);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   const raw=await page.evaluate(()=>{
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),bad=[];
    while(walker.nextNode()) {const n=walker.currentNode;if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;if(/\$|\\[a-zA-Z]+/.test(n.textContent))bad.push(n.textContent);}
    return bad;
   });
   assert.deepEqual(raw,[]);
   if(route==='/') {
    assert.equal(await page.locator('.home-grid h2').first().innerText(),'中学数学');
    await page.screenshot({path:`outputs/function-clarity/home-${width}.png`});
   } else {
    assert(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded')));
    await page.locator('#basics').screenshot({path:`outputs/function-clarity/${route.split('/').at(-1)}-basics-${width}.png`});
    const figure=page.locator('.math-figure').first();
    if(route.endsWith('radical-functions')) {assert.match(await figure.innerText(),/移動前/);assert.match(await figure.innerText(),/移動後/);}
    await figure.screenshot({path:`outputs/function-clarity/${route.split('/').at(-1)}-figure-${width}.png`});
   }
   console.log(JSON.stringify({route,width,rawTeX:0,overflow:false}));
  }
  await page.close();
 }
} finally {await browser.close();}
