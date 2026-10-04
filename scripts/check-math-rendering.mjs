import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {readdirSync,readFileSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000';
const staticMode=process.env.MATHCANVAS_STATIC==='1';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 await mkdir('outputs/math-rendering',{recursive:true});
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1100,390]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/math-one','/math-two','/math-three','/learn/m1-data-variance','/learn/m1-variance-calculation','/learn/m1-data-transformation']){
   const response=await page.goto(base+route+(staticMode?'.html':''),{waitUntil:'networkidle'});
   assert.equal(response.status(),200,route);
   await page.evaluate(()=>document.fonts.ready);
   const raw=await page.evaluate(()=>{
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),bad=[];
    while(walker.nextNode()){
     const node=walker.currentNode;
     if(node.parentElement?.closest('script,style,.katex,title,desc'))continue;
     if(/\$|\\[a-zA-Z]+/.test(node.textContent))bad.push(node.textContent.slice(0,180));
    }
    return bad;
   });
   assert.deepEqual(raw,[],route+': unprocessed TeX in rendered DOM');
   assert.equal(await page.locator('.math-error,.katex-error').count(),0,route);
   assert.deepEqual(errors,[],route);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route);
   if(route==='/math-one'){
    for(const title of ['分散の計算方法','データの変換']){
     const tile=page.locator('.lesson-tile').filter({has:page.getByRole('heading',{name:title,exact:true})});
     assert.ok(await tile.locator('.katex').count()>0,title);
     assert.ok(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded')));
     await tile.screenshot({path:`outputs/math-rendering/${title}-${width}.png`});
    }
   }
   if(route.startsWith('/learn/')){
    const formula=page.locator('.hero .formula').first();
    assert.ok(await formula.count()>0,route);
    assert.ok(await formula.evaluate(el=>getComputedStyle(el).color===getComputedStyle(el.parentElement).color),route+': hero contrast');
    await page.locator('.hero').screenshot({path:`outputs/math-rendering/${route.split('/').at(-1)}-${width}.png`});
   }
   console.log(JSON.stringify({route,width,status:200,rawTeX:0,mathErrors:0,runtimeErrors:0,overflow:false}));
  }
 }
 if(process.env.MATHCANVAS_SCAN_EXPORT==='1'){
  const root=path.resolve('dist/client');
  const files=readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'));
  const failures=[];
  for(const file of files){
   const html=readFileSync(path.join(root,file),'utf8');
   const raw=await page.evaluate(html=>{
    const doc=new DOMParser().parseFromString(html,'text/html');
    const walker=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT),bad=[];
    while(walker.nextNode()){
     const n=walker.currentNode;
     if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;
     if(/\$|\\[a-zA-Z]+/.test(n.textContent))bad.push(n.textContent.slice(0,160));
    }
    return bad;
   },html);
   if(raw.length)failures.push({file,raw});
  }
  assert.deepEqual(failures,[],'unprocessed math in exported page bodies');
  console.log(JSON.stringify({exportedHTML:files.length,unprocessedMath:0}));
 }
}finally{await browser.close();}
