import {createRequire} from 'node:module';
import {mkdir,readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import filePath from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??'C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
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
const browser=await chromium.launch({...(process.env.MATHCANVAS_CHROMIUM?{executablePath:process.env.MATHCANVAS_CHROMIUM,args:['--no-sandbox','--disable-dev-shm-usage']}:{channel:'msedge'}),headless:true});
const paths=process.env.MATHCANVAS_CHECK_PATHS?.split(',')??['/','/math-b','/learn/mb-sequence-terms','/learn/mb-geometric-sum','/learn/mb-partial-fractions','/learn/mb-weighted-geometric','/learn/mb-affine-recurrence','/learn/mb-sum-to-term','/learn/mb-induction-properties','/learn/mb-expectation','/learn/mb-binomial-distribution','/learn/mb-normal-distribution','/learn/mb-distribution-conditions','/learn/mb-mean-interval','/learn/mb-proportion-interval','/learn/mb-two-sided-test','/learn/mb-one-sided-test','/learn/mb-inference-meaning','/learn/mb-balance-recurrence','/learn/mb-data-function','/learn/mb-survey-simulation','/learn/mb-sequences-check','/learn/mb-recurrence-check','/learn/mb-distributions-check','/learn/mb-inference-check','/learn/mb-society-check'];
try{
 await mkdir('outputs/mathb',{recursive:true});
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1100,390]){
  await page.setViewportSize({width,height:900});
  for(const path of paths){
   const fragment=path.startsWith('/learn/')?'#first-example':'';
   const response=await page.goto(base+path+(staticMode&&path!=='/'?'.html':'')+fragment,{waitUntil:'networkidle'});assert.equal(response.status(),200,path);
   await page.evaluate(()=>document.fonts.ready);
   const state=await page.evaluate(()=>{
    const raw=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){const n=walker.currentNode;if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;if(/\$|\\[a-zA-Z]+/.test(n.textContent))raw.push(n.textContent.slice(0,100));}
    return {raw,errors:document.querySelectorAll('.math-error,.katex-error').length,overflow:document.documentElement.scrollWidth>innerWidth+1,font:[...document.fonts].some(f=>f.family==='KaTeX_Main'&&f.status==='loaded'),mathFont:[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded'),hasVariables:[...document.querySelectorAll('.mathnormal')].some(n=>n.checkVisibility()&&getComputedStyle(n).fontFamily.includes('KaTeX_Math'))};
   });
   assert.deepEqual(state.raw,[],path);assert.equal(state.errors,0,path);assert.equal(state.overflow,false,path);assert.deepEqual(errors,[],path);
   const name=path.split('/').at(-1)||'home';
   if(path.startsWith('/learn/')){
    assert.ok(state.font,path);if(state.hasVariables)assert.ok(state.mathFont,path);
    const example=page.locator('[data-task-pane="example-0"]:not([hidden])');
    await example.screenshot({path:`outputs/mathb/${name}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
    let stage=0;
    while(await example.isVisible()){
     const figure=example.locator('.math-b-figure:visible');
     for(let i=0;i<await figure.count();i++)await figure.nth(i).screenshot({path:`outputs/mathb/figure-${name}-${stage}-${i}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
     const walkthrough=example.locator('.example-walkthrough');
     const before=await walkthrough.getAttribute('data-step');
     await walkthrough.locator('button.step-next').click();
     await page.waitForFunction(previous=>{const step=document.querySelector('[data-task-pane="example-0"]:not([hidden]) .example-walkthrough');return !step||step.dataset.step!==previous;},before);
     assert.ok(++stage<20,'Example should continue into the next task');
    }
   }else{
    if(path==='/math-b')assert.equal(await page.locator('.lesson-tile').count(),44);
    if(path==='/')assert.ok((await page.locator('.lesson-tile').first().innerText()).includes('二次関数'));
    await page.screenshot({path:`outputs/mathb/${name}-${width}.png`});
   }
   // Survey repetitions, reset and record attribution are exercised by check-mathb-learning.mjs.
   console.log(JSON.stringify({path,width,...state}));
  }
 }
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
