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
const paths=['/','/math-one','/math-a','/learn/ma-equally-likely','/learn/ma-probability-tree','/learn/ma-conditional-probability','/learn/ma-posterior-probability','/learn/ma-expected-value','/learn/ma-angle-bisector','/learn/ma-ceva','/learn/ma-menelaus','/learn/ma-incenter-circumcenter','/learn/ma-tangent-chord','/learn/ma-power-of-point','/learn/ma-common-tangents','/learn/ma-construction-bisectors','/learn/ma-construction-division','/learn/ma-construction-tangents','/learn/ma-space-lines-planes','/learn/ma-solid-sections','/learn/ma-linear-diophantine','/learn/ma-quotient-remainder','/learn/ma-binary-notation','/learn/ma-coordinates-space','/learn/ma-mathematics-activities','/learn/ma-probability-check','/learn/ma-plane-geometry-check','/learn/ma-space-construction-check','/learn/ma-integers-check'];
try{
 await mkdir('outputs/matha-remaining',{recursive:true});
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1100,390]){
  await page.setViewportSize({width,height:900});
  for(const path of paths){
   const response=await page.goto(base+path+(staticMode&&path!=='/'?'.html':''),{waitUntil:'networkidle'});assert.equal(response.status(),200,path);
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
    await page.locator('.example').first().screenshot({path:`outputs/matha-remaining/${name}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
    const figures=page.locator('.math-a-figure');
    for(let i=0;i<await figures.count();i++)await figures.nth(i).screenshot({path:`outputs/matha-remaining/figure-${name}-${i}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
   }else{
    if(path==='/math-a')assert.equal(await page.locator('.lesson-tile').count(),74);
    if(path==='/')assert.ok((await page.locator('.lesson-tile').first().innerText()).includes('二次関数'));
    await page.screenshot({path:`outputs/matha-remaining/${name}-${width}.png`});
   }
   console.log(JSON.stringify({path,width,...state}));
  }
 }
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
