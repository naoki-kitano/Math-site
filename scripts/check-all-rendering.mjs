import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import filePath from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const staticMode=true;
const output=process.env.MATHCANVAS_AUDIT_OUTPUT??'outputs/site-audit';
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

const {lessons}=await (await import('./content-module.mjs')).loadContent('lessons');
const routes=['/','/junior','/math-one','/math-a','/math-two','/math-b','/math-three','/math-c','/review','/record',...lessons.map(l=>'/learn/'+l.slug)];
const jobs=[1100,390].flatMap(width=>routes.map(path=>({path,width})));
const results=[];let cursor=0;
try{
 await mkdir(output,{recursive:true});
 await Promise.all(Array.from({length:3},async()=>{
  const page=await browser.newPage();let errors=[],failedAssets=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400&&['stylesheet','script','font'].includes(r.request().resourceType()))failedAssets.push(r.url());});
  while(cursor<jobs.length){
   const {path,width}=jobs[cursor++];errors=[];failedAssets=[];
   try{
    await page.setViewportSize({width,height:900});
    const response=await page.goto(base+path+(path==='/'?'':'.html'),{waitUntil:'load',timeout:60000});
    // Some lessons initially show only prose; their formulas are in closed details.
    // Explicitly test the bundled font rather than assuming it was already used.
    await page.evaluate(async()=>{await document.fonts.load('16px KaTeX_Main','1');await document.fonts.ready;});
    const state=await page.evaluate(()=>{
     const raw=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
     while(walker.nextNode()){
      const n=walker.currentNode;
      if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;
      if(/\$|\\[a-zA-Z]+/.test(n.textContent))raw.push(n.textContent.slice(0,120));
     }
     return {raw,mathErrors:document.querySelectorAll('.math-error,.katex-error').length,overflow:document.documentElement.scrollWidth>innerWidth+1,formulas:document.querySelectorAll('.katex').length,font:[...document.fonts].some(f=>f.family==='KaTeX_Main'&&f.status==='loaded'),mathFont:[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded'),needsMathFont:[...document.querySelectorAll('.mathnormal')].some(n=>n.checkVisibility()&&getComputedStyle(n).fontFamily.includes('KaTeX_Math'))};
    });
    const ok=response.status()===200&&!state.raw.length&&!state.mathErrors&&!state.overflow&&!errors.length&&!failedAssets.length&&(!state.formulas||state.font)&&(!state.needsMathFont||state.mathFont);
    results.push({path,width,status:response.status(),...state,errors:[...errors],failedAssets:[...failedAssets],ok});
   }catch(e){results.push({path,width,ok:false,error:String(e)});}
   if(results.length%50===0)console.log(JSON.stringify({checked:results.length,total:jobs.length,failures:results.filter(r=>!r.ok).length}));
  }
  await page.close();
 }));
 await writeFile(output+'/render-audit.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify({checked:results.length,failures:results.filter(r=>!r.ok)}));
 assert.ok(results.every(r=>r.ok),'See outputs/site-audit/render-audit.json');
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
