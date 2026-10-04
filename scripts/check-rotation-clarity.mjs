import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3016';
const staticMode=process.env.MATHCANVAS_STATIC==='1';
const output=`outputs/clarity-overhaul/rotation-${staticMode?'static':'dev'}`;
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const results=[];
try{
 for(const width of [1100,390]){
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(m.text());});
  await page.goto(`${base}/learn/mc-complex-rotation${staticMode?'.html':''}#basics`,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  const panel=page.locator('.complex-rotation');
  for(let stage=0;stage<4;stage++){
   await panel.locator('.rotation-stages button').nth(stage).click();
   assert.equal(await panel.getAttribute('data-progress'),String(stage));
   assert.equal(await page.locator('.math-error,.katex-error').count(),0);
   const raw=await page.evaluate(()=>{
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),bad=[];
    while(walker.nextNode()){
     const node=walker.currentNode;
     if(node.parentElement?.closest('script,style,.katex,title,desc'))continue;
     if(/\$|\\[a-zA-Z]+/.test(node.textContent))bad.push(node.textContent.slice(0,100));
    }return bad;
   });
   assert.deepEqual(raw,[]);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   const box=await panel.boundingBox();
   await page.setViewportSize({width,height:Math.max(950,Math.ceil(box.height)+180)});
   await panel.scrollIntoViewIfNeeded();
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   await panel.screenshot({path:`${output}/${width}-stage-${stage}.png`,style:'.topbar{visibility:hidden}'});
   await page.setViewportSize({width,height:900});
  }
  await panel.getByRole('button',{name:'初めに戻す',exact:true}).click();
  await panel.locator('.rotation-controls .button').first().click();
  await page.waitForFunction(()=>Number(document.querySelector('.complex-rotation').dataset.progress)>.3);
  await panel.getByRole('button',{name:'停止',exact:true}).click();
  const p=Number(await panel.getAttribute('data-progress'));
  await page.waitForTimeout(150);assert.equal(Number(await panel.getAttribute('data-progress')),p);
  assert.match(await panel.locator('h3').innerText(),/原点へ移す/);
  await panel.getByRole('button',{name:'この移動を続ける',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.complex-rotation').dataset.progress==='1');
  await panel.getByRole('checkbox',{name:'動きを減らす',exact:true}).check();
  await panel.locator('.rotation-controls .button').first().click();
  assert.equal(await panel.getAttribute('data-progress'),'2');
  await panel.locator('.rotation-controls .button').first().click();
  assert.equal(await panel.getAttribute('data-progress'),'3');
  assert.deepEqual(errors,[]);results.push({width,stages:4,rawTeX:0,overflow:false,pauseResume:true,reducedMotion:true});
  await page.close();
 }
 await writeFile(`${output}/results.json`,JSON.stringify(results,null,2));console.log(results);
}finally{await browser.close();}
