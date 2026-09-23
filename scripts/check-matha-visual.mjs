import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 await mkdir('outputs/matha-chapter1',{recursive:true});
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1100,390]){
  await page.setViewportSize({width,height:900});
  for(const path of ['/math-a','/learn/ma-listing','/learn/ma-changing-options','/learn/ma-combination','/learn/ma-circular-permutation','/learn/ma-identical-permutation','/learn/ma-grouping','/learn/ma-counting-check']){
   const response=await page.goto('http://localhost:3000'+path,{waitUntil:'networkidle'});
   assert.equal(response.status(),200);
   await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>{
    const raw=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
     const n=walker.currentNode;if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;
     if(/\$|\\[a-zA-Z]+/.test(n.textContent))raw.push(n.textContent.slice(0,100));
    }
    return {raw,errors:document.querySelectorAll('.math-error,.katex-error').length,overflow:document.documentElement.scrollWidth>innerWidth+1,font:[...document.fonts].some(f=>f.family==='KaTeX_Main'&&f.status==='loaded'),mathFont:[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded'),hasVariables:[...document.querySelectorAll('.mathnormal')].some(n=>n.checkVisibility()&&getComputedStyle(n).fontFamily.includes('KaTeX_Math'))};
   });
   assert.deepEqual(state.raw,[],path);assert.equal(state.errors,0,path);assert.equal(state.overflow,false,path);assert.deepEqual(errors,[],path);
   if(path.startsWith('/learn/')){
    assert.ok(state.font,path);
    if(state.hasVariables)assert.ok(state.mathFont,path);
    await page.locator('.example').first().screenshot({path:`outputs/matha-chapter1/${path.split('/').at(-1)}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
    const diagrams=page.locator('.math-a-figure');
    for(let i=0;i<await diagrams.count();i++)await diagrams.nth(i).screenshot({path:`outputs/matha-chapter1/figure-${path.split('/').at(-1)}-${i}-${width}.png`});
   }else{
    assert.equal(await page.locator('.lesson-tile').count(),74);
    await page.screenshot({path:`outputs/matha-chapter1/index-${width}.png`});
   }
   console.log(JSON.stringify({path,width,...state}));
  }
 }
}finally{await browser.close();}
