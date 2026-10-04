import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3012';
const staticMode=process.env.MATHCANVAS_STATIC==='1';
const route=slug=>`${base}/learn/${slug}${staticMode?'.html':''}`;
const output=`outputs/clarity-${staticMode?'static':'dev'}`;
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const results=[];
async function check(page,label){
 await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('.math-error,.katex-error').count(),0,label);
 const raw=await page.evaluate(()=>{
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),bad=[];
  while(walker.nextNode()){
   const node=walker.currentNode;
   if(node.parentElement?.closest('script,style,.katex,title,desc'))continue;
   if(/\$|\\[a-zA-Z]+/.test(node.textContent))bad.push(node.textContent.slice(0,120));
  }return bad;
 });
 assert.deepEqual(raw,[],label);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' overflow');
 assert.ok(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded')),label+' bundled font');
}
try{
 for(const width of [1100,390]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===390});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',message=>{
   if(message.type()==='error'&&!message.text().startsWith('Failed to load resource:'))errors.push(message.text());
  });
  await page.goto(route('trig-unit-circle'),{waitUntil:'networkidle'});
  assert.equal(await page.locator('.unit-explorer').count(),0,'no duplicate angle-reduction figure');
  const coordinates=page.locator('.unit-coordinates');
  for(const position of ['右上','左上','左下','右下','真上']){
   await coordinates.getByRole('button',{name:position,exact:true}).click();
   for(const fn of ['正弦','余弦','正接']){
    await coordinates.getByRole('button',{name:fn,exact:true}).click();
    await check(page,`coordinate-${position}-${fn}-${width}`);
   }
  }
  assert.match(await coordinates.innerText(),/正接は定義されません/);
  await coordinates.screenshot({style:'.topbar{visibility:hidden}',path:`${output}/coordinate-axis-${width}.png`});
  await coordinates.getByRole('button',{name:'左上',exact:true}).click();
  await coordinates.getByRole('button',{name:'正弦',exact:true}).click();
  await coordinates.screenshot({style:'.topbar{visibility:hidden}',path:`${output}/coordinate-left-${width}.png`});
  await page.goto(route('trig-angle-change'),{waitUntil:'networkidle'});
  assert.equal(await page.locator('.unit-coordinates').count(),0);
  const explorer=page.locator('.unit-explorer'),diagram=explorer.locator('svg.unit-diagram');
  await explorer.scrollIntoViewIfNeeded();
  await explorer.screenshot({style:'.topbar{visibility:hidden}',path:`${output}/unit-start-${width}.png`});
  assert.equal(await diagram.getAttribute('data-rotation'),'0');
  await explorer.getByRole('button',{name:'時計回りに回す',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('.unit-diagram').dataset.rotation)>15);
  await explorer.getByRole('button',{name:'停止',exact:true}).click();
  const stopped=Number(await diagram.getAttribute('data-rotation'));
  assert.ok(stopped>0&&stopped<180);
  await page.waitForTimeout(180);
  assert.equal(Number(await diagram.getAttribute('data-rotation')),stopped,'pause holds');
  await explorer.screenshot({style:'.topbar{visibility:hidden}',path:`${output}/unit-paused-${width}.png`});
  await explorer.locator('.unit-manual summary').click();
  const slider=explorer.getByRole('slider');
  await slider.focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');
  assert.equal(Number(await diagram.getAttribute('data-rotation')),1);
  await explorer.getByRole('button',{name:'再生を続ける',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('.unit-diagram').dataset.rotation)===180);
  await check(page,`unit-length-${width}`);
  await explorer.screenshot({style:'.topbar{visibility:hidden}',path:`${output}/unit-length-${width}.png`});
  await explorer.getByRole('button',{name:'元の点の符号をみる',exact:true}).click();
  await check(page,`unit-sign-${width}`);
  assert.equal(await explorer.locator('.unit-answer .katex').count(),1);
  await explorer.screenshot({style:'.topbar{visibility:hidden}',path:`${output}/unit-sign-${width}.png`});
  await explorer.getByRole('button',{name:'リセット',exact:true}).click();
  assert.equal(await diagram.getAttribute('data-rotation'),'0');
  await explorer.getByRole('checkbox',{name:'動きを減らす',exact:true}).check();
  await explorer.getByRole('button',{name:'半回転後を見る',exact:true}).click();
  assert.equal(await diagram.getAttribute('data-rotation'),'180');
  assert.equal(await explorer.getByRole('button',{name:'停止',exact:true}).count(),0);
  await explorer.locator('.supplement > summary').click();await check(page,`unit-details-${width}`);
  const first=page.locator('.example').first();
  assert.equal(await first.locator('.example-walkthrough > div[aria-live] .step').count(),1);
  await first.getByRole('button',{name:/次の手順/}).click();
  assert.equal(await first.locator('.example-walkthrough > div[aria-live] .step').count(),2);
  await first.getByRole('button',{name:/次の手順/}).click();
  await first.locator('.example-walkthrough summary').click();
  assert.ok(await first.locator('.example-walkthrough > div[aria-live]').isHidden(),'full reading avoids duplicate steps');
  await check(page,`example-${width}`);
  await first.screenshot({style:'.topbar{visibility:hidden}',path:`${output}/example-${width}.png`});
  await first.locator('.example-walkthrough summary').click();
  await first.getByRole('button',{name:'手順1に戻す'}).click();
  assert.equal(await first.locator('.example-walkthrough > div[aria-live] .step').count(),1);

  await page.goto(route('m1-parabola-translation'),{waitUntil:'networkidle'});
  const parabola=page.locator('.parabola-explorer'),graph=parabola.locator('.parabola-diagram');
  await parabola.scrollIntoViewIfNeeded();
  await parabola.screenshot({style:'.topbar{visibility:hidden}',path:`${output}/parabola-start-${width}.png`});
  await parabola.getByRole('button',{name:'移動を再生',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('.parabola-diagram').dataset.progress)>.2);
  await parabola.getByRole('button',{name:'停止',exact:true}).click();
  const stoppedP=await graph.getAttribute('data-progress');await page.waitForTimeout(160);
  assert.equal(await graph.getAttribute('data-progress'),stoppedP);
  await parabola.getByRole('button',{name:'移動を再生',exact:true}).click();
  await page.waitForFunction(()=>Number(document.querySelector('.parabola-diagram').dataset.progress)===2);
  await parabola.getByRole('button',{name:/の点/}).last().click();
  await check(page,`parabola-${width}`);
  await parabola.screenshot({style:'.topbar{visibility:hidden}',path:`${output}/parabola-end-${width}.png`});
  await parabola.getByRole('button',{name:'リセット',exact:true}).click();
  assert.equal(await graph.getAttribute('data-progress'),'0');
  await parabola.getByRole('checkbox',{name:'動きを減らす',exact:true}).check();
  await parabola.getByRole('button',{name:'次の移動を見る'}).click();assert.equal(await graph.getAttribute('data-progress'),'1');
  await parabola.getByRole('button',{name:'次の移動を見る'}).click();assert.equal(await graph.getAttribute('data-progress'),'2');
  await parabola.locator('summary').click();await check(page,`parabola-details-${width}`);
  for(const slug of ['rational','trig-angle-change','m3-rational-functions']){
   await page.goto(route(slug),{waitUntil:'networkidle'});
   const visual=slug==='trig-angle-change'||slug==='rational';
   await page.getByRole('link',{name:visual?'まず図で確かめる':'まず例題を1問',exact:true}).click();
   assert.ok(page.url().endsWith(visual?'#basics':'#first-example'));
   const example=page.locator('.example').first();
   await example.locator('.example-walkthrough summary').click();
   await check(page,`${slug}-${width}`);
  }
  assert.deepEqual(errors,[]);
  results.push({width,touch:width===390,runtimeErrors:0,consoleErrors:0,rawTeX:0,overflow:false,controls:true});
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});
 const page=await context.newPage();
 for(const slug of ['trig-angle-change','m1-parabola-translation']){
  await page.goto(route(slug),{waitUntil:'networkidle'});
  const explorer=page.locator('.unit-explorer,.parabola-explorer');
  assert.ok(await explorer.getByRole('checkbox').isChecked());assert.ok(await explorer.getByRole('checkbox').isDisabled());
  await explorer.getByRole('button',{name:/半回転後を見る|次の移動を見る/}).click();
  assert.equal(await explorer.getByRole('button',{name:'停止',exact:true}).count(),0);
  await check(page,`system-reduced-${slug}`);
 }
 await context.close();results.push({systemReducedMotion:true});
 await writeFile(`${output}/results.json`,JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
}finally{await browser.close();}
