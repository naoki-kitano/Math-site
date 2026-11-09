import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??import.meta.url);
const {chromium}=require('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000',staticMode=process.env.MATHCANVAS_STATIC==='1';
const browser=await chromium.launch({executablePath:process.env.MATHCANVAS_BROWSER??'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const report=[];
try{
 for(const width of [1100,390]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'no-preference'});
  for(const slug of ['logarithm-laws','m3-chain-rule','m3-endpoint-evaluation']){
   await page.goto(`${base}/learn/${slug}${staticMode?'.html':''}#basics`,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   const panel=page.locator('[data-formula-lesson]');await panel.getByRole('button',{name:'次へ',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('.formula-flight')?.getAnimations().length);
   const flight=panel.locator('.formula-flight').first(),first=await flight.evaluate(e=>getComputedStyle(e).transform);
   await page.waitForTimeout(220);const middle=await flight.evaluate(e=>getComputedStyle(e).transform);
   assert.notEqual(first,middle,slug+': corresponding symbol actually moves');
   const hasTemplate=await panel.locator('.transfer-template').count();
   if(hasTemplate){assert.equal(await panel.locator('.transfer-result').evaluate(e=>getComputedStyle(e).opacity),'0','the general formula stays visible while the value moves');assert.equal(await panel.locator('.transfer-template').evaluate(e=>getComputedStyle(e).opacity),'1');}
   await page.waitForTimeout(1000);assert.equal(await flight.evaluate(e=>getComputedStyle(e).opacity),'0');
   if(hasTemplate){assert.equal(await panel.locator('.transfer-result').evaluate(e=>getComputedStyle(e).opacity),'1');assert.equal(await panel.locator('.transfer-template').evaluate(e=>getComputedStyle(e).opacity),'0');}
   const paths=panel.locator('.transfer-arrows g>path');assert.ok(await paths.count()>0);
   for(const node of await paths.all()){
    const points=await node.evaluate(p=>{const a=p.getPointAtLength(0),b=p.getPointAtLength(p.getTotalLength());return {ax:a.x,ay:a.y,bx:b.x,by:b.y,w:p.ownerSVGElement.width.baseVal.value,h:p.ownerSVGElement.height.baseVal.value}});
    assert.ok(points.by>points.ay&&points.ax>=0&&points.bx>=0&&points.ax<=points.w&&points.bx<=points.w&&points.by<=points.h,slug+': connectors remain inside diagram');
   }
   await panel.getByLabel('動きを減らす').check();await panel.getByRole('button',{name:'前へ',exact:true}).click();await panel.getByRole('button',{name:'次へ',exact:true}).click();await panel.locator('.formula-flight').first().waitFor({state:'attached'});
   assert.equal(await panel.locator('.formula-flight').evaluateAll(nodes=>nodes.flatMap(n=>n.getAnimations()).length),0);
   assert.equal(await page.locator('.math-error,.katex-error').count(),0);
   report.push({width,slug,motion:true,arrows:true,reducedMotion:true});
  }
  await page.close();
 }
 console.log(JSON.stringify(report));
}finally{await browser.close();}
