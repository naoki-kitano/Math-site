import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {loadContent} from './content-module.mjs';
const require=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??import.meta.url);
const {chromium}=require('playwright');
const {formulaCorrespondence}=await loadContent('formula-correspondence');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000',staticMode=process.env.MATHCANVAS_STATIC==='1';
const output=process.env.MATHCANVAS_SCREENSHOTS;
if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.MATHCANVAS_BROWSER??'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-features=OverlayScrollbar']});
let states=0;const failures=[];
try{
 for(const width of [1100,390,320]){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',e=>failures.push({width,error:e.message}));
  for(const slug of Object.keys(formulaCorrespondence)){
   await page.goto(`${base}/learn/${slug}${staticMode?'.html':''}#basics`,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   const panel=page.locator('[data-formula-lesson]');await panel.waitFor();
   for(let stage=0;stage<formulaCorrespondence[slug].steps.length;stage++){
    if(stage)await panel.getByRole('button',{name:'次へ',exact:true}).click();
    await page.waitForTimeout(100);
    const issues=await panel.evaluate(panel=>{
     const bars=[...panel.querySelectorAll('*')].filter(el=>{
      if(!(el instanceof HTMLElement)||!el.clientHeight||!el.clientWidth)return false;
      const css=getComputedStyle(el);
      return (/auto|scroll/.test(css.overflowX)&&el.scrollWidth>el.clientWidth+1)||(/auto|scroll/.test(css.overflowY)&&el.scrollHeight>el.clientHeight+1);
     }).map(el=>({class:el.className,tex:el.dataset.tex}));
     const clipped=[...panel.querySelectorAll('.katex-html>.base')].filter(el=>{
      if(el.closest('.formula-flight,.sr-only'))return false;
      const box=el.closest('.formula-transfer,.formula-correspondence-lines,.math3-structure-diagram')?.getBoundingClientRect();if(!box)return false;
      const r=el.getBoundingClientRect();return r.left<box.left-2||r.right>box.right+2;
     }).map(el=>el.closest('[data-tex]')?.getAttribute('data-tex'));
     return {bars,clipped,mathErrors:panel.querySelectorAll('.math-error,.katex-error').length,pageOverflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    if(issues.bars.length||issues.clipped.length||issues.mathErrors||issues.pageOverflow)failures.push({slug,width,stage,...issues});
    if(output)await panel.screenshot({path:`${output}/${slug}-${width}-${stage}.png`});
    states++;
   }
  }
  await page.close();
 }
 console.log(JSON.stringify({states,failures}));assert.deepEqual(failures,[]);
}finally{await browser.close();}
