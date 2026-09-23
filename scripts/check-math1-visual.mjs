import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 await mkdir('outputs/math1',{recursive:true});
 const page=await browser.newPage();
 const runtimeErrors=[];
 page.on('pageerror',error=>runtimeErrors.push(error.message));
 for(const [route,width] of [['/math-one',1100],['/learn/m1-absolute-distance',1100],['/learn/m1-linear-inequalities',390],['/learn/m1-simultaneous-inequalities',390],['/learn/m1-rationalizing',390],['/learn/m1-product-identities',1100],['/learn/m1-number-expression-check',390],['/learn/points',390]]) {
  await page.setViewportSize({width,height:900});
  const response=await page.goto('http://localhost:3000'+route,{waitUntil:'networkidle',timeout:60000});
  assert.equal(response.status(),200);
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.math-error,.katex-error').count(),0,route);
  assert.deepEqual(runtimeErrors,[],route+' runtime/hydration error');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow');
  if(route.includes('/learn/')) {
   assert.ok(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded')));
   await page.locator('#examples').screenshot({path:'outputs/math1/'+route.split('/').at(-1)+'-'+width+'.png'});
   if(width===390){
    const button=page.locator('#examples .question .actions > .button').first();
    if(await button.count())assert.ok((await button.boundingBox()).width>150,'mobile answer button must not collapse');
    await page.locator('#examples').scrollIntoViewIfNeeded();
    await page.screenshot({path:'outputs/math1/'+route.split('/').at(-1)+'-viewport.png'});
   }
  } else await page.screenshot({path:'outputs/math1/index.png'});
  console.log(JSON.stringify({route,width,status:response.status(),mathErrors:0,overflow:false}));
 }
}finally{await browser.close();}
