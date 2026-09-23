import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const base='https://naoki-kitano.github.io/Math-site/';
for(const route of ['', 'math-three.html','learn/m3-graph-length.html','learn/m3-inverse-derivative.html','learn/binomial-meaning.html']){
 const response=await fetch(base+route);assert.equal(response.status,200,route);
 const html=await response.text();assert(!html.includes('class="math-error"'),route);
 if(route==='math-three.html')assert(html.includes('math3-chapter-eight'));
 console.log(JSON.stringify({route,status:response.status}));
}
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 await mkdir('outputs/notation',{recursive:true});
 for(const width of [1100,390]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto(base+'learn/binomial-meaning.html',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.math-error,.katex-error').count(),0);
  assert(await page.evaluate(()=>Array.from(document.fonts).some(f=>f.family==='KaTeX_Math'&&f.status==='loaded')));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.equal(await page.locator('[role="status"]').filter({hasText:'練習を読み込んでいます'}).count(),0);
  await page.locator('#basics').screenshot({path:`outputs/notation/public-binomial-${width}.png`});
  console.log(JSON.stringify({width,fonts:true,mathErrors:0,hydrated:true}));
  await page.close();
 }
}finally{await browser.close();}
