import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {loadContent} from './content-module.mjs';
const require=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??import.meta.url);
const {chromium}=require('playwright');
const {formulaCorrespondence}=await loadContent('formula-correspondence');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000',staticMode=process.env.MATHCANVAS_STATIC==='1';
const output=process.env.MATHCANVAS_SCREENSHOTS;
const slugFilter=process.env.MATHCANVAS_SLUGS?.split(',');
const widths=(process.env.MATHCANVAS_WIDTHS??'1100,390,320').split(',').map(Number);
if(output)await mkdir(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.MATHCANVAS_BROWSER??'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-features=OverlayScrollbar']});
let states=0;const failures=[];
try{
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
  page.on('pageerror',e=>failures.push({width,error:e.message}));
  for(const slug of Object.keys(formulaCorrespondence).filter(slug=>!slugFilter||slugFilter.includes(slug))){
   await page.goto(`${base}/learn/${slug}${staticMode?'.html':''}#basics`,{waitUntil:'domcontentloaded'});
   const panel=page.locator('[data-formula-lesson]');await panel.waitFor();
   await page.waitForFunction(()=>{const b=document.querySelector('[data-formula-lesson] button');return b&&Object.keys(b).some(k=>k.startsWith('__reactProps$'));});
   await page.evaluate(()=>document.fonts.ready);
   for(let stage=0;stage<formulaCorrespondence[slug].steps.length;stage++){
    if(stage)await panel.getByRole('button',{name:'次へ',exact:true}).click();
    await page.waitForFunction(expected=>Number(document.querySelector('[data-formula-lesson]')?.getAttribute('data-stage'))===expected,stage);
    assert.equal(await panel.getAttribute('data-stage'),String(stage),slug+' stage');
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(100);
    const issues=await panel.evaluate(panel=>{
     const bars=[...panel.querySelectorAll('*')].filter(el=>{
      if(!(el instanceof HTMLElement)||!el.clientHeight||!el.clientWidth)return false;
      const css=getComputedStyle(el);
      return (/auto|scroll/.test(css.overflowX)&&el.scrollWidth>el.clientWidth+1)||(/auto|scroll/.test(css.overflowY)&&el.scrollHeight>el.clientHeight+1);
     }).map(el=>({class:el.className,tex:el.dataset.tex}));
     const clipped=[...panel.querySelectorAll('.katex-html>.base')].filter(el=>{
      if(el.closest('.formula-flight,.sr-only'))return false;
      const box=el.closest('.formula-transfer,.formula-correspondence-lines,.structure-diagram,.math3-structure-diagram')?.getBoundingClientRect();if(!box)return false;
      const r=el.getBoundingClientRect();return r.left<box.left-2||r.right>box.right+2;
     }).map(el=>el.closest('[data-tex]')?.getAttribute('data-tex'));
     const clippedLabels=[...panel.querySelectorAll('foreignObject')].flatMap(box=>{
      if(getComputedStyle(box).overflow==='visible')return [];
      const b=box.getBoundingClientRect();
      return [...box.querySelectorAll('.katex-html>.base')].filter(el=>{const r=el.getBoundingClientRect();return r.left<b.left-2||r.right>b.right+2||r.top<b.top-2||r.bottom>b.bottom+2;}).map(el=>({tex:el.closest('[data-tex]')?.getAttribute('data-tex'),box:{width:b.width,height:b.height}}));
     });
     return {bars,clipped,clippedLabels,mathErrors:panel.querySelectorAll('.math-error,.katex-error').length,pageOverflow:document.documentElement.scrollWidth>innerWidth+1};
    });
    if(issues.bars.length||issues.clipped.length||issues.clippedLabels.length||issues.mathErrors||issues.pageOverflow)failures.push({slug,width,stage,...issues});
    if(output)await panel.screenshot({path:`${output}/${slug}-${width}-${stage}.png`});
    states++;
   }
  }
  await page.close();
 }
 console.log(JSON.stringify({states,failures}));assert.deepEqual(failures,[]);
}finally{await browser.close();}
