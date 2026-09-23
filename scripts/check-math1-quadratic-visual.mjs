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
 await mkdir('outputs/math1-chapter3',{recursive:true});
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const routes=[['/math-one',1100],['/learn/m1-domain-range',390],['/learn/m1-basic-parabola',1100],['/learn/m1-parabola-translation',390],['/learn/m1-completing-square-coefficient',390],['/learn/m1-quadratic-formula',390],['/learn/m1-interval-extrema',1100],['/learn/m1-quadratic-inequality-boundaries',390],['/learn/m1-quadratics-check',1100],['/learn/m1-quadratic-model',390]];
 for(const[route,width]of routes){
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
   await page.locator(target).first().scrollIntoViewIfNeeded();
   await page.screenshot({path:`outputs/math1-chapter3/${route.split('/').at(-1)}-${width}${staticMode?'-static':''}.png`});
  }else await page.screenshot({path:'outputs/math1-chapter3/index.png'});
  console.log(JSON.stringify({route,width,status:response.status(),runtimeErrors:0,mathErrors:0,overflow:false}));
 }
}finally{await browser.close();if(server)await new Promise(resolve=>server.close(resolve));}
