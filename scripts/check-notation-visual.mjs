import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const root=path.resolve('dist/client');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.json':'application/json','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(!url.pathname.startsWith('/Math-site/')){res.writeHead(404).end();return;}
  const file=path.resolve(root,decodeURIComponent(url.pathname.slice(11))||'index.html');
  assert(file.startsWith(root+path.sep));
  const data=await readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(data);
 }catch{res.writeHead(404).end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 await mkdir('outputs/notation',{recursive:true});
 for(const width of [1100,390]){
  const page=await browser.newPage({viewport:{width,height:900}});
  for(const slug of ['binomial-meaning','trig-addition','m3-trigonometric-limits','m3-parametric-derivative']){
   const response=await page.goto(`http://127.0.0.1:${server.address().port}/Math-site/learn/${slug}.html`,{waitUntil:'networkidle'});
   assert.equal(response.status(),200,slug);
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('.math-error,.katex-error').count(),0,slug);
   assert(await page.evaluate(()=>Array.from(document.fonts).some(f=>f.family==='KaTeX_Math'&&f.status==='loaded')),slug);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   assert(!overflow,`${slug} page overflow at ${width}`);
   await page.locator('#basics').screenshot({path:`outputs/notation/${slug}-${width}.png`});
   console.log(JSON.stringify({slug,width,status:response.status(),overflow}));
  }
  await page.close();
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
