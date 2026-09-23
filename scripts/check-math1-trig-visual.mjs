import {createRequire} from 'node:module';
import {mkdir,readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const staticMode=process.env.MATHCANVAS_STATIC==='1';
let server,base='http://localhost:3000';
if(staticMode){
 const root=path.resolve('dist/client'),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.woff':'font/woff','.json':'application/json','.svg':'image/svg+xml'};
 server=createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,'http://localhost');
   assert.ok(url.pathname.startsWith('/Math-site/'));
   const file=path.resolve(root,decodeURIComponent(url.pathname.slice('/Math-site/'.length))||'index.html');
   assert.ok(file.startsWith(root+path.sep));
   res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}).end(await readFile(file));
  }catch{res.writeHead(404).end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base=`http://127.0.0.1:${server.address().port}/Math-site`;
}
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 await mkdir('outputs/math1-chapter4',{recursive:true});
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const routes=[['/math-one',1100],['/learn/m1-right-triangle',390],['/learn/m1-special-angles',390],['/learn/m1-trig-coordinates',1100],['/learn/m1-trig-relations',390],['/learn/m1-sine-circumcircle',1100],['/learn/m1-triangle-choice',390],['/learn/m1-measurement',390],['/learn/m1-space-triangles',1100],['/learn/m1-trigonometry-check',390],['/learn/m1-triangle-choice',390,1],['/learn/m1-triangle-area',390,1],['/learn/m1-space-triangles',390,1]];
 for(const[route,width,index=0]of routes){
  await page.setViewportSize({width,height:900});
  const response=await page.goto(base+route+(staticMode?'.html':''),{waitUntil:'networkidle'});
  assert.equal(response.status(),200,route);
  await page.evaluate(()=>document.fonts.ready);
  assert.deepEqual(errors,[],route);
  assert.equal(await page.locator('.math-error,.katex-error').count(),0,route);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route);
  if(route.includes('/learn/')){
   assert.ok(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded')));
   const target=route.endsWith('quadratic-formula')?'.example':await page.locator('.math-figure').count()?'.math-figure':'#examples';
   await page.locator(target).nth(index).scrollIntoViewIfNeeded();
   await page.screenshot({path:`outputs/math1-chapter4/${route.split('/').at(-1)}-${width}${index?'-figure'+(index+1):''}${staticMode?'-static':''}.png`});
  }else await page.screenshot({path:'outputs/math1-chapter4/index.png'});
  console.log(JSON.stringify({route,width,status:response.status(),runtimeErrors:0,mathErrors:0,overflow:false}));
 }
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
