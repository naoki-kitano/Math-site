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
const paths=process.env.MATHCANVAS_CHECK_PATHS?.split(",")??["/","/junior","/learn/jr-signed-add","/learn/jr-order-powers","/learn/jr-fractions","/learn/jr-expansion","/learn/jr-quadratic-equation","/learn/jr-root-calculation","/learn/jr-coordinates","/learn/jr-linear-function","/learn/jr-quadratic-function","/learn/jr-pythagoras","/learn/jr-area-volume","/learn/jr-frequency-quartiles","/learn/jr-sampling","/learn/jr-numbers-check","/learn/jr-equations-check","/learn/jr-geometry-check"];
try{
 await mkdir('outputs/junior',{recursive:true});
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
    await page.locator('.example').first().screenshot({path:`outputs/junior/${name}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
    const figures=page.locator('.junior-figure');
    for(let i=0;i<await figures.count();i++)await figures.nth(i).screenshot({path:`outputs/junior/figure-${name}-${i}-${width}.png`,style:'.topbar{visibility:hidden!important}'});
   }else{
    if(path==='/junior')assert.equal(await page.locator('.lesson-tile').count(),37);
    if(path==='/')assert.ok((await page.locator('.lesson-tile').first().innerText()).includes('二次関数'));
    await page.screenshot({path:`outputs/junior/${name}-${width}.png`});
   }
   console.log(JSON.stringify({path,width,...state}));
  }
 }
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
