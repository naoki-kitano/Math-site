import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import filePath from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const staticMode=process.env.MATHCANVAS_STATIC==='1';
let server,base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000';
if(staticMode){
 const root=filePath.resolve('dist/client'),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.json':'application/json','.svg':'image/svg+xml'};
 server=createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://localhost');assert.ok(url.pathname.startsWith('/Math-site/'));
   const file=filePath.resolve(root,decodeURIComponent(url.pathname.slice('/Math-site/'.length))||'index.html');assert.ok(file.startsWith(root+filePath.sep));
   const body=await readFile(file);
   res.writeHead(200,{'Content-Type':mime[filePath.extname(file)]||'application/octet-stream'}).end(body);
  }catch{res.writeHead(404).end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base=`http://127.0.0.1:${server.address().port}/Math-site`;
}
const {loadContent}=await import('./content-module.mjs');
const {prerequisiteById}=await loadContent('prerequisite-checks');
const browser=await chromium.launch({channel:'msedge',headless:true});
const key='mathcanvas.math2.progress.v1',origin='m3-sequence-radical-limit-reciprocal-1-v1',variant='m3-sequence-radical-limit-reciprocal-3-v1';
const url=slug=>base+'/learn/'+slug+(staticMode?'.html':'');
const report=[];
try{
 await mkdir('outputs/prerequisites',{recursive:true});
 for(const width of [1100,390]){
  const context=await browser.newContext({viewport:{width,height:950},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')console.error('browser console:',m.text());});
  page.on('requestfailed',r=>console.error('request failed:',r.url(),r.failure()));
  page.on('response',r=>{if(r.status()>=400)console.error('HTTP:',r.status(),r.url());});
  const records=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{"attempts":[]}').attempts,key);
  const go=async path=>{const response=await page.goto(path,{waitUntil:'networkidle'});assert.equal(response?.status(),200,path);};
  const inspect=async()=>{
   await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>{
    const raw=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){const n=walker.currentNode;if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;if(/\$|\\[a-zA-Z]+/.test(n.textContent))raw.push(n.textContent.slice(0,100));}
    return {raw,mathErrors:document.querySelectorAll('.math-error,.katex-error').length,overflow:document.documentElement.scrollWidth>innerWidth+1,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)};
   });
   assert.deepEqual(state.raw,[]);assert.equal(state.mathErrors,0);assert.equal(state.overflow,false);assert.deepEqual(errors,[]);
   assert.ok(state.fonts.includes('KaTeX_Main'));assert.ok(state.fonts.includes('KaTeX_Math'));return state;
  };
  const question=()=>page.locator('#return-question .question');
  const guide=()=>question().locator('.review-guide');
  const current=()=>guide().locator('.diagnostic-sequence');
  const answer=async(index)=>{
   if(index===null)await current().getByRole('button',{name:'まだ分からない',exact:true}).click();
   else{await current().locator('.option').nth(index).click();await current().getByRole('button',{name:'確かめる',exact:true}).click();}
  };
  const openedAt=Date.now();
  await go(url('m3-sequence-radical-limit')+'?exercise='+origin+'#return-question');
  await question().getByRole('button',{name:'復習するところを探す',exact:true}).waitFor();
  const firstInteractiveMs=Date.now()-openedAt;
  await question().getByRole('button',{name:'復習するところを探す',exact:true}).click();
  assert.equal(await current().getAttribute('data-check-id'),'conjugate');
  // Check equal multiplication of numerator/denominator before the conjugate product.
  await answer(2);
  await inspect();
  await guide().screenshot({path:`outputs/prerequisites/conjugate-${staticMode?'static':'dev'}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
  await current().getByRole('button',{name:'先に必要なところを確かめる',exact:true}).click();
  assert.equal(await current().getAttribute('data-check-id'),'rationalize-single');
  await answer(prerequisiteById.get('rationalize-single').correct);
  await current().getByRole('button',{name:'次の確認へ',exact:true}).click();
  for(const id of ['conjugate-product','expand-product','expand']){
   assert.equal(await current().getAttribute('data-check-id'),id);
   await answer(null);
   await current().getByRole('button',{name:'先に必要なところを確かめる',exact:true}).click();
  }
  assert.equal(await current().getAttribute('data-check-id'),'signed-product');
  // Going back must restore a completed unknown response, not a blank yet "passed" card.
  await current().getByRole('button',{name:'← ひとつ前の確認へ',exact:true}).click();
  assert.equal(await current().getAttribute('data-check-id'),'expand');
  assert.equal(await current().locator('.option:disabled').count(),3);
  assert.equal(await current().getByText('ここから確かめよう',{exact:true}).count(),1);
  await current().getByRole('button',{name:'先に必要なところを確かめる',exact:true}).click();
  await answer(null);await inspect();
  assert.ok((await records()).every(a=>a.outcome==='seen'));
  await current().locator('.review-recommendation a').click();await page.waitForLoadState('networkidle');
  assert.match(page.url(),/jr-signed-product/);
  assert.equal(new URL(page.url()).searchParams.get('from'),origin);
  assert.equal(new URL(page.url()).searchParams.get('trail'),'conjugate,conjugate-product,expand-product,expand,signed-product');
  await page.locator('#targeted-review .repair-card').waitFor();
  assert.equal(await page.locator('#targeted-review .question').count(),0);
  assert.match(await page.locator('#targeted-review .repair-exercise').innerText(),/計算しなさい/);
  await page.reload({waitUntil:'networkidle'});await inspect();
  await page.locator('#targeted-review').screenshot({path:`outputs/prerequisites/junior-return-${staticMode?'static':'dev'}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
  await page.locator('#targeted-review').getByRole('link',{name:/ひとつ前へ：/}).click();await page.waitForLoadState('networkidle');
  assert.match(page.url(),/jr-like-terms/);
  assert.equal(new URL(page.url()).searchParams.get('trail'),'conjugate,conjugate-product,expand-product,expand');
  await page.getByRole('link',{name:'元の問題に戻る',exact:true}).click();await page.waitForLoadState('networkidle');
  assert.equal(await question().getAttribute('data-question-id'),origin);

  // Correct probes and merely viewing a worked repair never create independent success.
  await question().getByRole('button',{name:'復習するところを探す',exact:true}).click();
  for(const id of ['conjugate','root-normalize','reciprocal-limit']){
   assert.equal(await current().getAttribute('data-check-id'),id);
   await answer(prerequisiteById.get(id).correct);
   await current().getByRole('button',{name:id==='reciprocal-limit'?'問題の考え方へ進む':'次の確認へ',exact:true}).click();
  }
  await inspect();
  await guide().screenshot({path:`outputs/prerequisites/limit-working-${staticMode?'static':'dev'}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
  await guide().getByRole('button',{name:'閉じる',exact:true}).click();
  await question().getByRole('button',{name:'解き終えたので照合する',exact:true}).click();
  await question().getByRole('button',{name:'説明を使って解けた',exact:true}).click();
  assert.ok((await records()).some(a=>a.outcome==='assisted'));assert.ok((await records()).every(a=>a.outcome!=='independent'));

  await go(url('m3-sequence-radical-limit')+'?exercise='+variant+'&reviewOf='+origin+'#return-question');
  await question().getByRole('button',{name:'復習するところを探す',exact:true}).click();
  await current().locator('.option').nth(0).click();await answer(null);
  assert.equal(await current().getByText('この確認はできました',{exact:true}).count(),0);
  await current().locator('.review-recommendation a').click();await page.waitForLoadState('networkidle');
  assert.match(page.url(),/m1-rationalizing/);
  await page.locator('#targeted-review .question').waitFor();
  assert.match(await page.locator('#targeted-review .question').getAttribute('data-question-id'),/^m1-rationalizing-conjugate-/);
  assert.equal(new URL(page.url()).searchParams.get('fromReview'),origin);
  await inspect();
  await page.locator('#targeted-review').getByRole('link',{name:'同じ問題を解き直す',exact:true}).click();await page.waitForLoadState('networkidle');
  assert.equal(await question().getAttribute('data-question-id'),variant);
  assert.equal(new URL(page.url()).searchParams.get('reviewOf'),origin);
  for(const trail of ['conjugate,conjugate','conjugate,log','unknown']){
   await go(url('m1-rationalizing')+'?from='+origin+'&trail='+encodeURIComponent(trail)+'#targeted-review');
   assert.equal(await page.locator('#targeted-review').count(),0);
  }
  report.push({width,firstInteractiveMs,depth:5,wrongChoiceBranch:true,restoredParentAnswer:true,exactTargetPractice:true,reload:true,oneStepReturn:true,originalQuestionReturn:true,reviewAttribution:true,probesNotMastery:true,invalidPathsIgnored:true,errors});
  await context.close();
 }
 await writeFile(`outputs/prerequisites/ui-${staticMode?'static':'dev'}.json`,JSON.stringify({staticMode,report},null,2));
 console.log(JSON.stringify({staticMode,report}));
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
