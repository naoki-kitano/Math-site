// Regression checks for a continuous learning control: internal steps, self-rating,
// and the next task share one primary slot. Only representative lessons are visited.
// Configure MATHCANVAS_CHECK_URL, MATHCANVAS_STATIC=1, MATHCANVAS_WIDTHS,
// MATHCANVAS_PLAYWRIGHT_PACKAGE, MATHCANVAS_BROWSER, and MATHCANVAS_SCREENSHOTS.
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {loadContent} from './content-module.mjs';
const {chromium}=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??import.meta.url)('playwright');
const {lessons,exercises}=await loadContent('lessons');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000',staticMode=process.env.MATHCANVAS_STATIC==='1';
const out=process.env.MATHCANVAS_SCREENSHOTS??`/tmp/mathcanvas-continuous-${staticMode?'static':'dev'}`;await mkdir(out,{recursive:true});
const url=(slug,hash='basics',query='')=>`${base}/learn/${slug}${staticMode?'.html':''}${query?'?'+query:''}#${hash}`;
const removed=['答えだけでなく、途中式・理由・必要な条件も比べてください。','紙で解いた結果は自己評価として記録します。','この計算・考え方を、途中式から復習できます。','もう一度確かめたい問題を選んでください。'];
const browser=await chromium.launch({executablePath:process.env.MATHCANVAS_BROWSER??'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-features=OverlayScrollbar']});
const records=[],failures=[];
async function newContext(options){const context=await browser.newContext(options);context.on('page',page=>page.on('pageerror',error=>failures.push({page:page.url(),message:error.message})));return context;}
const active=page=>page.locator('[data-task-pane]:visible');
const controls=root=>root.locator('.learning-step-controls:visible').first();
const next=root=>controls(root).getByRole('button',{name:'次へ',exact:true});
const previous=root=>controls(root).getByRole('button',{name:'前へ',exact:true});
async function progress(page){const bar=page.getByRole('progressbar');assert.equal(await bar.count(),1,'one lesson progressbar');const now=Number(await bar.getAttribute('aria-valuenow')),min=Number(await bar.getAttribute('aria-valuemin')??0),max=Number(await bar.getAttribute('aria-valuemax')??100);assert.ok(Number.isFinite(now)&&now>=min&&now<=max);return now;}
const sameSlot=(a,b,label)=>assert.ok(a&&b&&Math.abs(a.x-b.x)<1&&Math.abs(a.width-b.width)<1,label);

async function goto(page,slug,hash='basics',query=''){
 await page.goto(url(slug,hash,query),{waitUntil:'networkidle'});await active(page).waitFor();await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>[...document.querySelectorAll('[data-task-pane]:not([hidden]) button')].some(e=>Object.keys(e).some(k=>k.startsWith('__reactProps$'))));
}
async function verify(page,label,root=active(page),shot=false){
 await page.evaluate(()=>document.fonts.ready);
 const r=await root.evaluate(root=>{
  const bars=[...root.querySelectorAll('*')].filter(el=>el instanceof HTMLElement&&el.clientHeight&&el.clientWidth&&((/auto|scroll/.test(getComputedStyle(el).overflowX)&&el.scrollWidth>el.clientWidth+1)||(/auto|scroll/.test(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight+1))).map(el=>el.className);
  const raw=[];const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;if(!n.parentElement?.getBoundingClientRect().width||n.parentElement.closest('.katex,script,style,title,desc'))continue;if(/\$|\\[a-zA-Z]+/.test(n.textContent))raw.push(n.textContent);}
  return {bars,raw,errors:root.querySelectorAll('.math-error,.katex-error').length,overflow:document.documentElement.scrollWidth>innerWidth+1,visibleTasks:[...document.querySelectorAll('[data-task-pane]')].filter(e=>e.getBoundingClientRect().width).map(e=>e.getAttribute('data-task-pane')),focus:{tag:document.activeElement.tagName,inside:root.contains(document.activeElement),visible:!!document.activeElement.getBoundingClientRect().width,text:document.activeElement.textContent?.slice(0,100)}};
 });
 assert.deepEqual(r.bars,[],label);assert.deepEqual(r.raw,[],label);assert.equal(r.errors,0,label);assert.equal(r.overflow,false,label);assert.equal(r.visibleTasks.length,1,label);
 for(const sentence of removed)assert.equal(await root.getByText(sentence,{exact:true}).count(),0,label);
 const buttonLines=await root.locator('.learning-step-controls:visible button').evaluateAll(buttons=>buttons.map(button=>({label:button.textContent,height:button.getBoundingClientRect().height,lineHeight:parseFloat(getComputedStyle(button).lineHeight),padding:parseFloat(getComputedStyle(button).paddingTop)+parseFloat(getComputedStyle(button).paddingBottom),border:parseFloat(getComputedStyle(button).borderTopWidth)+parseFloat(getComputedStyle(button).borderBottomWidth)})));
 for(const button of buttonLines)assert.ok(button.height-button.padding-button.border<button.lineHeight*1.5,label+' single-line progression: '+button.label);
 if(shot)await root.screenshot({path:`${out}/${label}.png`,animations:'disabled',style:'.topbar{visibility:hidden}'});
 records.push({label,...r});return r;
}
async function oneForward(page,root,label){
 assert.equal(await root.locator('.learning-step-controls:visible').count(),1,label+' one control row');
 assert.equal(await root.locator('.learning-step-controls:visible .button:not(.secondary)').count(),1,label+' one primary progression');
 assert.equal(await page.locator('.focused-navigation:visible').count(),0,label+' no competing outer navigation');
 const b=await next(root).boundingBox();assert.ok(b,label+' Next exists');return {x:b.x,width:b.width};
}
async function stageValue(root){return Number(await root.getAttribute('data-stage'));}
async function completedOwner(page,slug,selector,count,width){
 await goto(page,slug);const owner=active(page).locator(selector);await owner.waitFor();const positions=[],progressValues=[];
 for(let i=0;i<count;i++){
  if(await owner.getAttribute('data-stage')!==null)assert.equal(await stageValue(owner),i,slug+' stage');
  positions.push(await oneForward(page,active(page),`${slug}-${width}-${i}`));progressValues.push(await progress(page));await verify(page,`${slug}-${width}-${i}`,owner,i===0||i===count-1);
  if(slug==='m1-set-operations'&&(i===0||i===count-1))await page.locator('main').screenshot({path:`${out}/whole-${slug}-${width}-${i}.png`,animations:'disabled',style:'.topbar{visibility:hidden}'});
  if(i<count-1){await next(owner).click();if(await owner.getAttribute('data-stage')!==null)await page.waitForFunction(({sel,i})=>Number(document.querySelector('[data-task-pane="basics"] '+sel)?.getAttribute('data-stage'))===i,{sel:selector,i:i+1});}
 }
 assert.ok(positions.every(p=>Math.abs(p.x-positions[0].x)<1&&Math.abs(p.width-positions[0].width)<1),slug+' Next remains in right-hand slot');
 assert.ok(progressValues.every((n,i)=>!i||n>progressValues[i-1]),slug+' progress increases at each internal step '+JSON.stringify(progressValues));
 await previous(owner).click();await page.waitForFunction(last=>Number(document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow'))<last,progressValues.at(-1));const backProgress=await progress(page);await next(owner).click();await page.waitForFunction(last=>Number(document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow'))===last,progressValues.at(-1));

 await next(owner).focus();await page.keyboard.press('Enter');await page.locator('[data-task-pane="example-0"]:visible').waitFor();
 const f=await verify(page,`${slug}-${width}-continued`,active(page),slug==='m1-set-operations');assert.ok(f.focus.visible&&f.focus.inside,slug+' focus moves into the new task');const afterProgress=await progress(page);assert.ok(afterProgress>=progressValues.at(-1),slug+' progress does not fall at next task');
 assert.equal(await active(page).locator('.learning-step-controls:visible').count(),1,slug+' example owns continuation');
 await page.goBack({waitUntil:'networkidle'});await page.locator('[data-task-pane="basics"]:visible').waitFor();if(await owner.getAttribute('data-stage')!==null)assert.equal(await stageValue(owner),count-1,slug+' browserback keeps stage');
 await page.goForward({waitUntil:'networkidle'});await page.locator('[data-task-pane="example-0"]:visible').waitFor();
 await previous(active(page)).click();await page.locator('[data-task-pane="basics"]:visible').waitFor();
 await oneForward(page,active(page),slug+' after back');
 records.push({label:`${slug}-${width}-position-history`,positions,progressValues,backProgress,afterProgress,browserBackPreservesStage:true,firstExamplePreviousReturnsBasics:true});
}
async function answerAssertions(page,qid,expected,reviewOf){
 const result=await page.evaluate(({qid,reviewOf})=>JSON.parse(localStorage.getItem('mathcanvas.math2.progress.v1')||'{"attempts":[]}').attempts.filter(a=>a.exerciseId===qid&&(reviewOf===undefined||a.reviewOf===reviewOf)),{qid,reviewOf});
 assert.equal(result.length,1,'one record per attempt');assert.equal(result[0].outcome,expected);assert.equal(result[0].method,'self');if(reviewOf)assert.equal(result[0].reviewOf,reviewOf);return result[0];
}
async function paperCase(width,mode){
 const ctx=await newContext({viewport:{width,height:950},reducedMotion:'reduce'}),page=await ctx.newPage(),qid='m1-sets-elements-membership-2-v1',reviewOf='m1-sets-elements-membership-1-v1';
 try{
  await goto(page,'m1-sets-elements','return-question',`exercise=${qid}&reviewOf=${reviewOf}`);const q=page.locator(`[data-question-id="${qid}"]`);await q.waitFor();
  if(mode==='assisted')await q.getByRole('button',{name:'ヒント',exact:true}).click();
  await q.getByRole('button',{name:mode==='seen'?'解答から確かめる':'答え合わせ',exact:true}).click();
  assert.ok(await q.locator('.feedback .katex').count()>0,'math answer remains rendered');
  await answerAssertions(page,qid,'seen',reviewOf);
  let ratingPosition;
  if(mode!=='seen'){
   const rate=q.getByRole('button',{name:mode==='assisted'?'説明で解けた':mode==='retry'?'もう一度解く':'自力で解けた',exact:true});await rate.waitFor();await verify(page,`paper-${mode}-${width}-rating`,q,mode==='independent'||mode==='assisted');ratingPosition=await q.locator(".learning-step-controls .step-next").boundingBox();await rate.click();
  }
  await answerAssertions(page,qid,mode,reviewOf);assert.equal(await q.getByRole('button',{name:'自力で解けた',exact:true}).count(),0);
  assert.equal(await q.getByRole('button',{name:'次へ',exact:true}).count(),1,'one continuing button after judgment');
  assert.equal(await q.getByRole('button',{name:/次の問題へ|結果へ/}).count(),0,'no separate outside progression');
  if(ratingPosition)sameSlot(ratingPosition,await q.getByRole('button',{name:'次へ',exact:true}).boundingBox(),'self rating to Next keeps primary slot');
  await verify(page,`paper-${mode}-${width}-answer`,q,mode==='independent');await q.getByRole('button',{name:'次へ',exact:true}).click();await page.locator('.complete:visible').waitFor();await answerAssertions(page,qid,mode,reviewOf);records.push({label:`paper-${mode}-${width}-record`,expected:mode,method:'self',reviewOf,completedBySameRow:true});
 }finally{await ctx.close();}
}
async function multiStepPaper(width){
 const ctx=await newContext({viewport:{width,height:950},reducedMotion:'reduce'}),page=await ctx.newPage(),qid='m3-sequence-radical-limit-reciprocal-1-v1';
 try{
  await goto(page,'m3-sequence-radical-limit','return-question',`exercise=${qid}`);const q=page.locator(`[data-question-id="${qid}"]`);await q.getByRole('button',{name:'ヒント',exact:true}).click();await q.getByRole('button',{name:'答え合わせ',exact:true}).click();
  assert.equal(await q.getByRole('button',{name:'説明で解けた',exact:true}).count(),0,'rating waits for explanation');const firstNextPosition=await q.getByRole('button',{name:'次へ',exact:true}).boundingBox();let moves=0;while(!await q.getByRole('button',{name:'説明で解けた',exact:true}).count()){
   assert.equal(await q.getByRole('button',{name:'次へ',exact:true}).count(),1);await q.getByRole('button',{name:'次へ',exact:true}).click();assert.ok(++moves<12);
  }
  assert.ok(moves>=2);await verify(page,`paper-multistep-${width}`,q,true);const rate=q.getByRole('button',{name:'説明で解けた',exact:true});sameSlot(firstNextPosition,await rate.boundingBox(),'explanation Next to rating keeps primary slot');await rate.click();sameSlot(firstNextPosition,await q.getByRole('button',{name:'次へ',exact:true}).boundingBox(),'rating to Next keeps primary slot');await answerAssertions(page,qid,'assisted');await q.getByRole('button',{name:'次へ',exact:true}).click();await page.locator('.complete:visible').waitFor();records.push({label:`paper-multistep-${width}-record`,moves,assistancePreserved:true,ratingOnlyAfterExplanation:true});
 }finally{await ctx.close();}
}
async function fullReadState(page,width){
 await goto(page,'m1-number-expression-check');const reader=active(page).locator('.basics-reader');await reader.getByText('説明をまとめて読む',{exact:true}).click();await oneForward(page,active(page),'full basic one row');await reader.getByText('説明をまとめて読む',{exact:true}).click();await next(reader).click();assert.equal(await page.locator('[data-task-pane="basics"]:visible').count(),1,'closing full reading restores internal progress');await reader.getByText('説明をまとめて読む',{exact:true}).click();await next(reader).click();await page.locator('[data-task-pane="example-0"]:visible').waitFor();
 const walkthrough=active(page).locator('.example-walkthrough');await walkthrough.getByText('解説をまとめて読む',{exact:true}).click();await oneForward(page,active(page),'full example one row');await walkthrough.getByText('解説をまとめて読む',{exact:true}).click();await next(walkthrough).click();assert.equal(await page.locator('[data-task-pane="example-0"]:visible').count(),1);await walkthrough.getByText('解説をまとめて読む',{exact:true}).click();await next(walkthrough).click();await page.locator('[data-task-pane="guided-0"]:visible').waitFor();records.push({label:`full-reading-${width}`,oneRow:true,closingRestoresStage:true,fullReadingAllowsContinuation:true});
}
async function autoCase(width,kind){
 const ctx=await newContext({viewport:{width,height:950},reducedMotion:'reduce'}),page=await ctx.newPage(),qid=kind==='choice'?'r-ready-factor-v1':'r-guide-factor-v1';try{
  await goto(page,'rational','return-question',`exercise=${qid}`);const q=page.locator(`[data-question-id="${qid}"]`);
  if(kind==='choice')await q.locator('.options .option').first().click();else await q.locator('input.numeric').fill('2');
  await q.getByRole('button',{name:'答え合わせ',exact:true}).click();const expected=kind==='choice'?'independent':'retry';const rows=await page.evaluate(qid=>JSON.parse(localStorage.getItem('mathcanvas.math2.progress.v1')).attempts.filter(a=>a.exerciseId===qid),qid);assert.equal(rows.length,1);assert.equal(rows[0].outcome,expected);assert.equal(rows[0].method,'auto');assert.equal(await q.getByRole('button',{name:'次へ',exact:true}).count(),1);assert.equal(await q.getByRole('button',{name:/次の問題へ|結果へ/}).count(),0);await verify(page,`auto-${kind}-${width}`,q);await q.getByRole('button',{name:'次へ',exact:true}).click();await page.locator('.complete:visible').waitFor();records.push({label:`auto-${kind}-${width}-record`,method:'auto',outcome:expected});
 }finally{await ctx.close();}
}
async function resumeGroups(width){
 const lesson=lessons.find(item=>item.slug==='m1-number-expression-check');
 const fixture={slug:lesson.slug,groups:lesson.practiceGroups.map(group=>({...group,items:exercises.filter(q=>q.lesson===lesson.slug&&q.stage==='practice'&&group.exerciseIds.includes(q.id))}))};
 const route=url(fixture.slug,'practice');
  const context=await newContext({viewport:{width,height:950},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(route,{waitUntil:'networkidle'});await page.locator('.task-pane:visible .question:visible').waitFor();const before=await progress(page);await context.close();
  const ctx=await newContext({viewport:{width,height:950},reducedMotion:'reduce'});const seedCount=Math.floor(fixture.groups[0].items.length/2),seed=fixture.groups[0].items.slice(0,seedCount).map((q,i)=>({id:'qa-resume-'+i,exerciseId:q.id,at:Date.now()-60000+i,outcome:'independent',method:q.kind==='paper'?'self':'auto'}));await ctx.addInitScript(seed=>{if(location.protocol!=='http:'&&location.protocol!=='https:')return;if(!localStorage.getItem('mathcanvas.math2.progress.v1'))localStorage.setItem('mathcanvas.math2.progress.v1',JSON.stringify({version:1,attempts:seed}));},seed);
  const p=await ctx.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(route,{waitUntil:'networkidle'});const pane=p.locator('[data-task-pane="practice"]:visible'),question=()=>pane.locator('.question:visible');await question().waitFor();assert.equal(await question().getAttribute('data-question-id'),fixture.groups[0].items[seedCount].id);await p.waitForFunction(before=>Number(document.querySelector('[role="progressbar"]').getAttribute('aria-valuenow'))>before,before);const resumed=await progress(p);
  const qid=await question().getAttribute('data-question-id');await question().getByRole('button',{name:'解答から確かめる',exact:true}).click();await question().getByRole('button',{name:'次へ',exact:true}).click();await p.waitForTimeout(100);const preservedId=await question().getAttribute('data-question-id'),advanced=await progress(p);assert.ok(advanced>=resumed);
  async function group(i){await pane.getByText('練習する内容を選ぶ',{exact:true}).click();await pane.getByRole('button',{name:fixture.groups[i].title,exact:true}).click();await p.waitForTimeout(250);}
  await group(1);assert.equal(await question().getAttribute('data-question-id'),fixture.groups[1].items[0].id);const switched=await progress(p);assert.equal(switched,before,'fresh group starts at practice boundary, hidden group cannot overwrite it');await p.waitForTimeout(200);assert.equal(await progress(p),switched);
  await group(0);assert.equal(await question().getAttribute('data-question-id'),preservedId);const restored=await progress(p);assert.equal(restored,advanced,'returning group restores exact internal progress');await pane.screenshot({path:`${out}/group-restored-${width}.png`,animations:'disabled',style:'.topbar{visibility:hidden}'});
  await p.reload({waitUntil:'networkidle'});await question().waitFor();assert.equal(await question().getAttribute('data-question-id'),fixture.groups[0].items[seedCount+1].id);const reloaded=await progress(p);assert.ok(reloaded>=resumed);const attempts=await p.evaluate(()=>JSON.parse(localStorage.getItem('mathcanvas.math2.progress.v1')).attempts);assert.equal(attempts.find(a=>a.exerciseId===qid).outcome,'seen');assert.equal(attempts.filter(a=>a.outcome==='independent').length,seedCount);assert.deepEqual(errors,[]);records.push({label:`group-resume-${width}`,width,seedCount,before,resumed,advanced,switched,restored,reloaded,originalId:qid,restoredId:preservedId,seenNotIndependent:true});await ctx.close();
}
try{
 for(const width of (process.env.MATHCANVAS_WIDTHS??'320,1100').split(',').map(Number)){
  const ctx=await newContext({viewport:{width,height:950},reducedMotion:'reduce'}),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await completedOwner(page,'m1-set-operations','[data-formula-lesson]',3,width);
  await completedOwner(page,'m1-number-expression-check','.basics-reader',3,width);
  for(const [slug,selector]of [['rational','.visual-lesson'],['trig-unit-circle','.unit-coordinates'],['trig-angle-change','.unit-explorer'],['m1-parabola-translation','.parabola-explorer'],['m1-linear-inequalities','.visual-lesson'],['m1-interval-extrema','.visual-lesson'],['m1-quadratic-inequality','.relation-explorer']])await completedOwner(page,slug,selector,3,width);
  await goto(page,'logarithm-laws','first-example');const example=active(page).locator('.example-walkthrough');let before=await oneForward(page,active(page),'multi-example initial');
  for(let i=0;i<2;i++){await next(example).click();await verify(page,`example-${width}-${i}`,active(page),i===1);assert.equal(await page.locator('[data-task-pane="example-0"]:visible').count(),1);}
  const last=await oneForward(page,active(page),'multi-example final');assert.ok(Math.abs(last.x-before.x)<1);await next(example).click();await page.locator('[data-task-pane="example-1"]:visible').waitFor();await previous(active(page)).click();await page.locator('[data-task-pane="example-0"]:visible').waitFor();
  await goto(page,'m1-set-operations','first-example');await next(active(page)).click();await page.locator('[data-task-pane="guided-0"]:visible').waitFor();await verify(page,`one-step-example-guided-${width}`);
  await fullReadState(page,width);assert.deepEqual(errors,[]);await ctx.close();
  for(const mode of ['independent','assisted','retry','seen'])await paperCase(width,mode);
  await multiStepPaper(width);await autoCase(width,'choice');await autoCase(width,'number');await resumeGroups(width);
 }
 assert.deepEqual(failures,[]);console.log(JSON.stringify({status:'passed',records:records.length,out}));
}catch(e){failures.push({message:e.message,stack:e.stack});console.error(e);process.exitCode=1;}
finally{await writeFile(out+'/results.json',JSON.stringify({base,staticMode,records,failures},null,2));await browser.close();}
