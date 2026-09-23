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
   const url=new URL(req.url,'http://localhost');
   assert.ok(url.pathname.startsWith('/Math-site/'));
   const file=filePath.resolve(root,decodeURIComponent(url.pathname.slice('/Math-site/'.length))||'index.html');
   assert.ok(file.startsWith(root+filePath.sep));
   const contents=await readFile(file);
   res.writeHead(200,{'Content-Type':mime[filePath.extname(file)]||'application/octet-stream'}).end(contents);
  }catch{res.writeHead(404).end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base=`http://127.0.0.1:${server.address().port}/Math-site`;
}


const {loadContent}=await import('./content-module.mjs');
const {lessons,exercises}=await loadContent('lessons');
const {reviewChecks}=await loadContent('review-checks');
const browser=await chromium.launch({channel:'msedge',headless:true});
const key='mathcanvas.math2.progress.v1';
const url=path=>base+path+(staticMode&&path!=='/'?'.html':'');
const origin=exercises.find(q=>q.lesson==='m3-partial-fractions'&&q.stage==='practice');
const variant=exercises.find(q=>q.lesson===origin.lesson&&q.family===origin.family&&q.stage==='review');
const report=[];
try{
 await mkdir('outputs/site-audit',{recursive:true});
 for(const width of [1100,390]){
  const context=await browser.newContext({viewport:{width,height:900}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const go=async path=>{const response=await page.goto(path,{waitUntil:'networkidle'});if(response)assert.equal(response.status(),200,path);else assert.equal(page.url(),path);};
  const records=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{"attempts":[]}').attempts,key);
  const inspect=async()=>{
   await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>{
    const raw=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){const n=walker.currentNode;if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;if(/\$|\\[a-zA-Z]+/.test(n.textContent))raw.push(n.textContent.slice(0,100));}
    return {raw,errors:document.querySelectorAll('.math-error,.katex-error').length,overflow:document.documentElement.scrollWidth>innerWidth+1,fonts:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)};
   });
   assert.deepEqual(state.raw,[]);assert.equal(state.errors,0);assert.equal(state.overflow,false);assert.ok(state.fonts.includes('KaTeX_Main'));assert.deepEqual(errors,[]);
  };
  await go(url('/learn/'+origin.lesson)+'?exercise='+origin.id+'#return-question');
  let question=page.locator('#return-question .question');
  await question.waitFor({state:'visible'}).catch(async e=>{console.log(JSON.stringify({width,url:page.url(),errors,body:(await page.locator('body').innerText()).slice(0,2000)}));throw e;});
  await question.getByRole('button',{name:'復習するところを探す',exact:true}).click();
  assert.equal((await records()).length,1);assert.equal((await records())[0].outcome,'seen');
  let guide=question.locator('.review-guide');
  const partial=reviewChecks.find(c=>c.id==='partial');
  await guide.locator('.option').nth(partial.correct).click();
  await guide.getByRole('button',{name:'確かめる',exact:true}).click();
  assert.equal((await records()).length,1);
  await guide.getByRole('button',{name:'次の確認へ',exact:true}).click();
  const integral=reviewChecks.find(c=>c.id==='integral');
  await guide.locator('.option').nth(integral.correct).click();
  await guide.getByRole('button',{name:'確かめる',exact:true}).click();
  await guide.getByRole('button',{name:'問題の考え方へ進む',exact:true}).click();
  await inspect();
  await guide.screenshot({path:`outputs/site-audit/review-explanation-${width}.png`,style:'.topbar{visibility:hidden!important}'});
  await guide.getByRole('button',{name:'閉じる',exact:true}).click();
  await question.getByRole('button',{name:'解き終えたので照合する',exact:true}).click();
  await question.getByRole('button',{name:'説明を使って解けた',exact:true}).click();
  assert.equal((await records()).length,1);assert.equal((await records())[0].outcome,'assisted');

  await go(url('/learn/'+variant.lesson)+'?exercise='+variant.id+'&reviewOf='+origin.id+'#return-question');
  question=page.locator('#return-question .question');
  await question.getByRole('button',{name:'復習するところを探す',exact:true}).click();
  guide=question.locator('.review-guide');
  await guide.locator('.option').nth(partial.correct).click();
  await guide.getByRole('button',{name:'まだ分からない',exact:true}).click();
  assert.equal(await guide.getByText('この確認はできました',{exact:true}).count(),0);
  assert.equal(await guide.getByText('ここから確かめよう',{exact:true}).count(),1);
  assert.equal(await guide.locator('.review-recommendation a').count(),1);
  await inspect();
  await guide.screenshot({path:`outputs/site-audit/review-route-${width}.png`,style:'.topbar{visibility:hidden!important}'});
  await guide.locator('.review-recommendation a').click();await page.waitForLoadState('networkidle');
  assert.match(page.url(),/mb-partial-fractions/);
  assert.equal(new URL(page.url()).searchParams.get('from'),variant.id);
  assert.equal(new URL(page.url()).searchParams.get('fromReview'),origin.id);
  const nested=page.locator('#practice .question').first();
  await nested.getByRole('button',{name:'復習するところを探す',exact:true}).click();
  await nested.locator('.review-guide').getByRole('button',{name:'まだ分からない',exact:true}).click();
  await nested.locator('.review-guide').getByRole('button',{name:'先に必要なところを確かめる',exact:true}).click();
  await nested.locator('.review-guide').getByRole('button',{name:'まだ分からない',exact:true}).click();
  await nested.locator('.review-recommendation a').click();await page.waitForLoadState('networkidle');
  assert.match(page.url(),/jr-fractions/);assert.equal(new URL(page.url()).searchParams.get('from'),variant.id);
  await page.getByRole('link',{name:'元の問題に戻る',exact:true}).click();await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('#return-question .question').getAttribute('data-question-id'),variant.id);
  assert.equal(new URL(page.url()).searchParams.get('reviewOf'),origin.id);
  assert.ok((await records()).every(a=>a.outcome!=='independent'));
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('#return-question .question').getAttribute('data-question-id'),variant.id);

  const check=lessons.find(l=>l.slug==='mb-inference-check');
  await go(url('/learn/'+check.slug)+'#help');
  const library=page.locator('#help .help-library');
  await library.locator(':scope > summary').click();
  assert.ok(await library.locator('.supplement').count()<=5);
  await library.getByRole('button',{name:'次へ',exact:true}).click();
  assert.ok(await library.locator('.supplement').count()<=5);
  await library.locator('input').fill('有意水準');
  assert.ok(await library.locator('.supplement').count()>0);
  await inspect();
  await page.locator('#help').screenshot({path:`outputs/site-audit/help-library-${width}.png`,style:'.topbar{visibility:hidden!important}'});
  const last=check.supplements.at(-1);
  await go(url('/learn/'+check.slug)+'#'+encodeURIComponent(last.id));
  await page.locator('.linked-repair').waitFor();
  assert.equal(await page.locator('.linked-repair').getAttribute('id'),last.id);
  await inspect();

  const seed=exercises.filter(q=>q.stage==='practice'&&q.lesson==='mb-inference-check').slice(0,25).map((q,i)=>({id:'ui-test-'+i,exerciseId:q.id,at:Date.now()-50000+i,outcome:'retry',method:q.kind==='paper'?'self':'auto'}));
  assert.equal(seed.length,25);
  await page.evaluate(({key,seed})=>localStorage.setItem(key,JSON.stringify({version:1,attempts:seed})),{key,seed});
  await go(url('/review'));
  assert.equal(await page.locator('.record-row').count(),10);
  await page.getByRole('button',{name:'次の10問',exact:true}).click();
  assert.equal(await page.locator('.record-row').count(),10);
  await page.getByRole('button',{name:'次の10問',exact:true}).click();
  assert.equal(await page.locator('.record-row').count(),5);
  await page.getByRole('button',{name:'復習するところを探す',exact:true}).first().click();
  await page.locator('#record-help .review-guide').waitFor();
  await inspect();
  await page.getByRole('button',{name:'数学C',exact:true}).click();
  assert.equal(await page.locator('.record-row').count(),0);
  await page.getByRole('button',{name:'すべて',exact:true}).click();
  assert.equal(await page.locator('.record-row').count(),10);
  await inspect();
  const legacy={id:'legacy-cross-decision',exerciseId:'mb-inference-meaning-interval-1-v1',reviewOf:'mb-inference-meaning-interval-2-v1',at:Date.now()-5000,outcome:'independent',method:'self'};
  await page.evaluate(({key,legacy})=>localStorage.setItem(key,JSON.stringify({version:1,attempts:[legacy]})),{key,legacy});
  await go(url('/learn/mb-inference-meaning')+'#help');
  assert.equal(await page.locator('.help-problem').count(),1);
  await page.locator('.help-problem').click();
  await page.locator('#help .review-guide').waitFor();
  report.push({width,assistanceNotIndependent:true,unknownOverridesSelectedAnswer:true,legacyUnresolvedRetained:true,oneRecommendation:true,crossSubjectAndJuniorReturn:true,reviewAttribution:true,helpLimit:5,reviewPageSize:10,deepLink:true,errors});
  await context.close();
 }
 console.log(JSON.stringify({staticMode,report}));
 await writeFile(`outputs/site-audit/review-ui-${staticMode?'static':'dev'}.json`,JSON.stringify({staticMode,report},null,2));
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
