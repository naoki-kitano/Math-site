import {createRequire} from "node:module";
import {mkdir} from "node:fs/promises";
import assert from "node:assert/strict";
const require=createRequire("C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json");
const {chromium}=require("playwright");
const browser=await chromium.launch({channel:"msedge",headless:true});
try{
 const page=await browser.newPage({viewport:{width:1100,height:900}});
 await mkdir("outputs/chapter8",{recursive:true});
 for(const [slug,index] of [["m3-horizontal-area",0],["m3-washer-volume",1],["m3-graph-length",1]]){
  const response=await page.goto("http://localhost:3000/learn/"+slug,{waitUntil:"networkidle"});
  assert.equal(response.status(),200);
  await page.evaluate(()=>document.fonts.ready);
  const fonts=await page.evaluate(()=>Array.from(document.fonts).filter(f=>f.status==="loaded").map(f=>f.family));
  assert.ok(fonts.includes("KaTeX_Math"));
  assert.equal(await page.locator(".katex-error").count(),0);
  const target=page.locator(".math-figure").nth(index);
  await target.screenshot({path:"outputs/chapter8/"+slug+".png"});
  console.log(JSON.stringify({slug,status:response.status(),fonts}));
 }
}finally{await browser.close();}
