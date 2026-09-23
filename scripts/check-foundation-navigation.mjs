import {createRequire} from 'node:module';
import {mkdir,readFile} from 'node:fs/promises';
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
const browser=await chromium.launch({channel:'msedge',headless:true});

try{
 await mkdir('outputs/junior',{recursive:true});
 const page=await browser.newPage({viewport:{width:390,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=(path)=>base+path+(staticMode?'.html':'');
 await page.goto(url('/learn/mc-vector-length'),{waitUntil:'networkidle'});
 const question=page.locator('.example .question').first();
 const id=await question.getAttribute('data-question-id');
 await question.getByRole('button',{name:'復習するところを探す',exact:true}).click();
 await question.locator('.review-guide').getByRole('button',{name:'まだ分からない',exact:true}).click();
 const link=question.locator('.review-recommendation a').first();
 assert.match(await link.getAttribute('href'),/jr-pythagoras/);
 await link.click();await page.waitForLoadState('networkidle');
 assert.equal(new URL(page.url()).searchParams.get('from'),id);
 await page.getByRole('link',{name:'元の問題に戻る',exact:true}).waitFor();
 const nested=page.locator('#targeted-review .question').first();
 await nested.getByRole('button',{name:'復習するところを探す',exact:true}).click();
 await nested.locator('.review-guide').getByRole('button',{name:'まだ分からない',exact:true}).click();
 await nested.locator('.review-recommendation a').first().click();
 await page.waitForLoadState('networkidle');
 assert.equal(new URL(page.url()).searchParams.get('from'),id);
 assert.match(new URL(page.url()).pathname,/jr-square-roots/);
 await page.getByRole('link',{name:'元の問題に戻る',exact:true}).click();
 await page.waitForLoadState('networkidle');
 const returned=page.locator('#return-question .question');
 await returned.waitFor();
 assert.equal(await returned.getAttribute('data-question-id'),id);
 const records=await page.evaluate(()=>Object.values(localStorage).flatMap(v=>{try{return JSON.parse(v).attempts??[];}catch{return [];}}));
 assert.ok(records.some(a=>a.exerciseId===id&&a.outcome==='seen'));
 assert.ok(records.every(a=>a.outcome!=='independent'));
 await page.locator('#return-question').screenshot({path:'outputs/junior/return-question'+(staticMode?'-static':'')+'.png',style:'.topbar{visibility:hidden!important}'});
 await page.reload({waitUntil:'networkidle'});
 await page.locator('#return-question .question').waitFor();
 assert.equal(await page.locator('#return-question .question').getAttribute('data-question-id'),id);
 const variant='mc-vector-length-length-6-v1';
 await page.goto(url('/learn/mc-vector-length')+'?exercise='+variant+'&reviewOf='+id+'#return-question',{waitUntil:'networkidle'});
 const variantQuestion=page.locator('#return-question .question');
 await variantQuestion.getByRole('button',{name:'復習するところを探す',exact:true}).click();
 await variantQuestion.locator('.review-guide').getByRole('button',{name:'まだ分からない',exact:true}).click();
 await variantQuestion.locator('.review-recommendation a').first().click();
 await page.waitForLoadState('networkidle');
 assert.equal(new URL(page.url()).searchParams.get('fromReview'),id);
 await page.getByRole('link',{name:'元の問題に戻る',exact:true}).click();
 await page.waitForLoadState('networkidle');
 assert.equal(new URL(page.url()).searchParams.get('reviewOf'),id);
 await page.locator('#return-question .question').getByRole('button',{name:'解答から確かめる',exact:true}).click();
 const variantRecords=await page.evaluate(()=>Object.values(localStorage).flatMap(v=>{try{return JSON.parse(v).attempts??[];}catch{return [];}}));
 assert.ok(variantRecords.filter(a=>a.exerciseId===variant).length>=2);
 assert.ok(variantRecords.filter(a=>a.exerciseId===variant).every(a=>a.reviewOf===id&&a.outcome==='seen'));
 await page.goto(url('/learn/jr-square-roots')+'?from=https%3A%2F%2Fexample.com&exercise=constructor',{waitUntil:'networkidle'});
 assert.equal(await page.getByRole('link',{name:'元の問題に戻る',exact:true}).count(),0);
 assert.equal(await page.locator('#return-question').count(),0);
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({staticMode,origin:id,nestedReturn:true,reload:true,reviewAttributionPreserved:true,noIndependentOnNavigation:true,invalidOriginIgnored:true,errors}));
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
