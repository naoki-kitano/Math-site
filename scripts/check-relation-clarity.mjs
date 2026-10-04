import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/naoch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/package.json');
const {chromium}=require('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3016',staticMode=process.env.MATHCANVAS_STATIC==='1';
const output=`outputs/clarity-overhaul/relations-${staticMode?'static':'dev'}`;
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),results=[];
try{
 for(const width of [1100,390]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!m.text().startsWith('Failed to load resource:'))errors.push(m.text());});
  for(const slug of ['m1-quadratic-inequality','locus-equations','mc-vector-dot','m3-riemann-sums']){
   await page.goto(`${base}/learn/${slug}${staticMode?'.html':''}#basics`,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
   const panel=page.locator('.relation-explorer'),kind=await panel.getAttribute('data-relation');
   const states=kind==='signs'?[-2,-1,0,2,3]:kind==='locus'?[-1,0,1]:kind==='projection'?[60,90,120]:[4,8,16,32];
   for(const value of states){
    if(kind==='signs'||kind==='locus'){
     const slider=panel.getByRole('slider');await slider.fill(String(value));await slider.dispatchEvent('input');
     if(kind==='locus'&&await panel.getByRole('button',{name:'軌跡を見る',exact:true}).count())await panel.getByRole('button',{name:'軌跡を見る',exact:true}).click();
    }else if(kind==='projection')await panel.locator('.graph-controls button').nth(states.indexOf(value)).click();
    else await panel.getByRole('group',{name:'分割する個数'}).locator('button').nth(states.indexOf(value)).click();
    const raw=await page.evaluate(()=>{
     const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),bad=[];
     while(walker.nextNode()){const n=walker.currentNode;if(n.parentElement?.closest('script,style,.katex,title,desc'))continue;if(/\$|\\[a-zA-Z]+/.test(n.textContent))bad.push(n.textContent.slice(0,120));}return bad;
    });
    assert.deepEqual(raw,[],slug);assert.equal(await page.locator('.math-error,.katex-error').count(),0,slug);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),slug+' overflow');
    assert.ok(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='KaTeX_Math'&&f.status==='loaded')),slug+' font');
    const box=await panel.boundingBox();await page.setViewportSize({width,height:Math.max(950,Math.ceil(box.height)+180)});
    await panel.scrollIntoViewIfNeeded();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await panel.screenshot({path:`${output}/${slug}-${width}-${value}.png`,style:'.topbar{visibility:hidden}'});
    await page.setViewportSize({width,height:900});
   }
   if(kind==='riemann'){await panel.getByRole('button',{name:'左端の高さ',exact:true}).click();assert.match(await panel.innerText(),/面積より小さく/);}
   results.push({slug,width,states:states.length,rawTeX:0,mathErrors:0,overflow:false});
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 await writeFile(`${output}/results.json`,JSON.stringify(results,null,2));console.log(results);
}finally{await browser.close();}
