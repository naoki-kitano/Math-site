import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3012';
const staticMode=process.env.MATHCANVAS_STATIC==='1';
const output=`outputs/seven-subjects/${staticMode?'static':'dev'}`;
const cases=[
 ['jr-linear-equation','equation'],['ma-conditional-probability','conditional'],
 ['mb-arithmetic-sum','sum'],['mc-vector-sum','vector'],['m3-derivative-meaning','derivative'],
];
const browser=await chromium.launch({channel:'msedge',headless:true});
await mkdir(output,{recursive:true});
const results=[];
async function check(page){
 await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.math-error,.katex-error').count(),0);
 const raw=await page.evaluate(()=>{
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),bad=[];
  while(walker.nextNode()){
   const n=walker.currentNode;
   if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;
   if(/\$|\\[a-zA-Z]+/.test(n.textContent))bad.push(n.textContent.slice(0,120));
  }return bad;
 });
 assert.deepEqual(raw,[]);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow');
 assert.deepEqual(await page.locator('.concept-explorer .katex-display').evaluateAll(nodes=>nodes.filter(n=>n.scrollWidth>n.clientWidth+2).map(n=>n.textContent)),[],'new figure formulas fit without sideways scrolling');
 assert.ok(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded')));
}
try{
 for(const width of [1100,390]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===390});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(m.text());});
  for(const [slug,kind] of cases){
   await page.goto(`${base}/learn/${slug}${staticMode?'.html':''}`,{waitUntil:'networkidle'});
   await page.getByRole('link',{name:'まず図で確かめる',exact:true}).click();
   assert.ok(page.url().endsWith('#basics'));
   const panel=page.locator('.concept-explorer');
   assert.equal(await panel.getAttribute('data-kind'),kind);
   const progress=()=>panel.getAttribute('data-progress');
   assert.equal(await progress(),'0');
   await panel.screenshot({path:`${output}/${kind}-start-${width}.png`,style:'.topbar{visibility:hidden}'});
   if(kind==='conditional'){
    await panel.getByRole('button',{name:'次の段階を見る',exact:true}).click();
    assert.equal(await progress(),'1');
    await panel.getByRole('button',{name:'次の段階を見る',exact:true}).click();
   }else{
    await panel.getByRole('button',{name:'変化を再生',exact:true}).click();
    await page.waitForFunction(()=>Number(document.querySelector('.concept-explorer').dataset.progress)>.2);
    await panel.getByRole('button',{name:'停止',exact:true}).click();
    const stopped=await progress();await page.waitForTimeout(150);assert.equal(await progress(),stopped);
    if(kind==='vector'){
     const d=await panel.locator('[data-vector=b]').getAttribute('d'),n=d.match(/-?\d+(?:\.\d+)?/g).map(Number);
     assert.ok(Math.abs((n[2]-n[0])/54+1)<1e-10);
     assert.ok(Math.abs(-(n[3]-n[1])/36-3)<1e-10,'both components stay constant while moving');
    }
    await panel.screenshot({path:`${output}/${kind}-paused-${width}.png`,style:'.topbar{visibility:hidden}'});
    await panel.getByRole('button',{name:'再生を続ける',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.concept-explorer').dataset.progress==='2');
   }
   assert.equal(await progress(),'2');
   await check(page);
   await panel.screenshot({path:`${output}/${kind}-end-${width}.png`,style:'.topbar{visibility:hidden}'});
   if(kind==='derivative'){
    await panel.getByRole('button',{name:'左から近づける',exact:true}).click();
    assert.equal(await progress(),'0');
    await panel.getByRole('button',{name:'2 点を近づける',exact:true}).click();
    assert.match(await panel.locator('.translation-readout').innerText(),/−0.5|-0.5/);
    await panel.screenshot({path:`${output}/derivative-left-${width}.png`,style:'.topbar{visibility:hidden}'});
   }
   await page.locator('.original-explanation summary').click();await check(page);
   await panel.getByRole('button',{name:'リセット',exact:true}).click();assert.equal(await progress(),'0');
   if(kind!=='conditional'){
    await panel.getByRole('checkbox',{name:'動きを減らす',exact:true}).check();
    await panel.getByRole('button',{name:'次の段階を見る',exact:true}).click();assert.equal(await progress(),'1');
    await panel.getByRole('button',{name:'次の段階を見る',exact:true}).click();assert.equal(await progress(),'2');
    await panel.getByRole('button',{name:'リセット',exact:true}).click();
    await panel.getByRole('button',{name:/2 /}).first().focus();await page.keyboard.press('Enter');assert.equal(await progress(),'1');
   }
   results.push({slug,width,touch:width===390,controls:true,renderedMath:true});
  }
  assert.deepEqual(errors,[]);
  await context.close();
 }
 const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();
 for(const [slug,kind] of cases.filter(([,kind])=>kind!=='conditional')){
  await page.goto(`${base}/learn/${slug}${staticMode?'.html':''}`,{waitUntil:'networkidle'});
  const panel=page.locator('.concept-explorer'),checkbox=panel.getByRole('checkbox',{name:/動きを減らす/});
  assert.ok(await checkbox.isChecked());assert.ok(await checkbox.isDisabled());
  await panel.getByRole('button',{name:'次の段階を見る',exact:true}).click();
  assert.equal(await panel.getAttribute('data-progress'),'1');
  results.push({kind,systemReduced:true});
 }
 await context.close();
 await writeFile(`${output}/results.json`,JSON.stringify({results,runtimeErrors:0,consoleErrors:0,rawTeX:0},null,2));
 console.log(JSON.stringify({checks:results.length,output}));
}finally{await browser.close();}
