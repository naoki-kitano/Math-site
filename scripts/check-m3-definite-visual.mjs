import {createRequire} from "node:module";
import {mkdir} from "node:fs/promises";
const require=createRequire("C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json");
const {chromium}=require("playwright");
const browser=await chromium.launch({channel:"msedge",headless:true});
try{
 const page=await browser.newPage({viewport:{width:1100,height:900}});
 await mkdir("outputs/chapter7",{recursive:true});
 for(const slug of ["m3-riemann-sums","m3-moving-endpoints"]){
  const response=await page.goto("http://localhost:3000/learn/"+slug,{waitUntil:"networkidle"});
  await page.evaluate(()=>document.fonts.ready);
  const fonts=await page.evaluate(()=>Array.from(document.fonts).filter(f=>f.status==="loaded").map(f=>f.family));
  const errors=await page.locator(".katex-error").count();
  const target=slug==="m3-riemann-sums"?page.locator(".math-figure").first():page.locator("#examples");
  await target.scrollIntoViewIfNeeded();
  await page.screenshot({path:"outputs/chapter7/"+slug+".png"});
  console.log(JSON.stringify({slug,status:response.status(),katexErrors:errors,fonts}));
 }
}finally{await browser.close();}
