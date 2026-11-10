// Regression: unanswered questions reveal explanations through the same primary
// control, while supplied answers keep grading and accurate review attribution.
// Configure MATHCANVAS_CHECK_URL, MATHCANVAS_STATIC=1, MATHCANVAS_WIDTHS,
// MATHCANVAS_UNANSWERED_OUT, MATHCANVAS_PLAYWRIGHT_PACKAGE and MATHCANVAS_BROWSER.
// MATHCANVAS_UNANSWERED_SMOKE=1 runs the smaller post-deployment check.
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??import.meta.url)('playwright');
const base=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000',staticMode=process.env.MATHCANVAS_STATIC==='1';
const out=process.env.MATHCANVAS_UNANSWERED_OUT??'/tmp/mathcanvas-unanswered-flow';await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.MATHCANVAS_BROWSER??'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const records=[],failures=[],runtime=[],network=[];const store='mathcanvas.math2.progress.v1';
const widths=(process.env.MATHCANVAS_WIDTHS??'320,1100').split(',').map(Number);
const smoke=process.env.MATHCANVAS_UNANSWERED_SMOKE==='1';
let activeCase;
const route=(hash,query='')=>`${base}/learn/amgm${staticMode?'.html':''}${query?'?'+query:''}#${hash}`;
function observe(page){page.on('pageerror',e=>runtime.push(e.message));page.on('requestfailed',r=>network.push({url:r.url(),error:r.failure()?.errorText}));page.on('response',r=>{if(r.status()>=400)network.push({url:r.url(),status:r.status()});});}
async function ready(page,qid){const q=page.locator(`[data-question-id="${qid}"]`);await q.waitFor();await page.waitForFunction(qid=>{const b=document.querySelector(`[data-question-id="${qid}"] .step-next`);return b&&Object.keys(b).some(k=>k.startsWith('__reactProps$'));},qid);await page.evaluate(()=>document.fonts.ready);return q;}
const primary=q=>q.locator('.learning-step-controls:visible .step-next');
async function attempts(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{"attempts":[]}').attempts,store);}
function sameSlot(a,b){assert.ok(a&&b);for(const k of ['x','y','width','height'])assert.ok(Math.abs(a[k]-b[k])<1,`same primary ${k}: ${a[k]} vs ${b[k]}`);}
async function verify(page,q,id,shot=false){const r=await q.evaluate(q=>{const visible=e=>e.checkVisibility();const raw=[],bars=[];const w=document.createTreeWalker(q,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode;if(!visible(n.parentElement)||n.parentElement.closest('.katex,script,style,title,desc'))continue;if(/\$|\\[A-Za-z]+/.test(n.textContent))raw.push(n.textContent);}for(const e of q.querySelectorAll('*')){if(!visible(e)||e instanceof SVGElement)continue;const s=getComputedStyle(e);if((/(auto|scroll)/.test(s.overflowX)&&e.scrollWidth>e.clientWidth+1)||(/(auto|scroll)/.test(s.overflowY)&&e.scrollHeight>e.clientHeight+1))bars.push(e.className);}const b=q.querySelector('.learning-step-controls .step-next').getBoundingClientRect();return{raw,bars,mathErrors:q.querySelectorAll('.math-error,.katex-error').length,overflow:document.documentElement.scrollWidth>innerWidth+1,primaryVisible:b.y>=0&&b.bottom<=innerHeight+1,rows:[...q.querySelectorAll('.learning-step-controls')].filter(visible).length};});assert.deepEqual(r.raw,[]);assert.deepEqual(r.bars,[]);assert.equal(r.mathErrors,0);assert.equal(r.overflow,false);assert.equal(r.primaryVisible,true);assert.equal(r.rows,1);if(shot)await page.screenshot({path:`${out}/${id}.png`});return r;}
async function open(page,qid,reviewOf){await page.goto(route('return-question',`exercise=${qid}&reviewOf=${reviewOf}`),{waitUntil:'networkidle'});return ready(page,qid);}
const cases=[
 {name:'choice-empty',kind:'choice',expected:'seen'},
 {name:'number-empty',kind:'number',expected:'seen'},
 {name:'number-whitespace',kind:'number',input:' \t　',expected:'seen'},
 {name:'number-empty-enter',kind:'number',enter:true,expected:'seen'},
 {name:'choice-correct',kind:'choice',choice:1,expected:'independent'},
 {name:'choice-zero-index-wrong',kind:'choice',choice:0,expected:'retry'},
 {name:'number-fullwidth-correct',kind:'number',input:'２',expected:'independent'},
 {name:'number-zero-wrong',kind:'number',input:'0',expected:'retry'},
 {name:'number-negative-wrong',kind:'number',input:'-2',expected:'retry'},
 {name:'number-invalid-edit',kind:'number',invalid:'abc',input:'2',expected:'independent'},
 {name:'number-invalid-preview',kind:'number',invalid:'1/2',secondary:true,expected:'seen'},
 {name:'number-invalid-clear',kind:'number',invalid:'-',input:'',expected:'seen'},
 {name:'choice-hint-correct',kind:'choice',hint:true,choice:1,expected:'assisted'},
 {name:'number-hint-correct',kind:'number',hint:true,input:'2',expected:'assisted'},
 {name:'choice-hint-empty',kind:'choice',hint:true,expected:'seen'},
 {name:'choice-help-correct',kind:'choice',help:true,choice:1,expected:'assisted'},
 {name:'paper-self',kind:'paper',expected:'independent'},
 {name:'paper-seen',kind:'paper',secondary:true,expected:'seen'},
 {name:'paper-hint-self',kind:'paper',hint:true,expected:'assisted'},
];
async function runCase(width,c){activeCase={case:c.name,width};const ctx=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce'}),page=await ctx.newPage();observe(page);const qid=c.kind==='choice'?'amgm-8-v1':c.kind==='number'?'amgm-3-v1':'amgm-4-v1',reviewOf=c.kind==='choice'?'amgm-9-v1':c.kind==='number'?'amgm-2-v1':'amgm-5-v1';try{
 const q=await open(page,qid,reviewOf),slot=await primary(q).boundingBox();assert.equal(await primary(q).innerText(),c.kind==='paper'?'答え合わせ':'解説を見る');assert.equal(await q.getByRole('button',{name:'解答から確かめる',exact:true}).count(),c.kind==='paper'?1:0);
 let previewId;if(c.hint){await q.getByRole('button',{name:'ヒント',exact:true}).click();const a=await attempts(page);assert.equal(a.length,1);assert.equal(a[0].outcome,'seen');previewId=a[0].id;}
 if(c.help){await q.getByRole('button',{name:'復習するところを探す',exact:true}).click();await q.getByRole('button',{name:'閉じる',exact:true}).click();const a=await attempts(page);assert.equal(a.length,1);assert.equal(a[0].outcome,'seen');previewId=a[0].id;}
 if(c.invalid){await q.locator('input.numeric').fill(c.invalid);assert.equal(await primary(q).innerText(),'答え合わせ');await primary(q).click();assert.equal(await q.locator('.error-text').count(),1);assert.equal((await attempts(page)).length,0);assert.equal(await q.locator('.feedback').count(),0);}
 if(c.choice!==undefined)await q.locator('.option').nth(c.choice).click();if(c.input!==undefined){await q.locator('input.numeric').fill(c.input);assert.equal(await q.locator('.error-text').count(),0);}
 if(c.secondary)await q.getByRole('button',{name:'解答から確かめる',exact:true}).click();else if(c.enter)await q.locator('input.numeric').press('Enter');else await primary(q).click();
 await q.locator('.feedback').waitFor();assert.equal(await q.locator('.error-text').count(),0);assert.equal(await q.getByRole('button',{name:'解説を見る',exact:true}).count(),0);sameSlot(slot,await primary(q).boundingBox());
 if(c.kind==='paper'){
  const initial=await attempts(page);assert.equal(initial.length,1);assert.equal(initial[0].outcome,'seen');
  while(Number(await q.locator('.example-walkthrough').getAttribute('data-step'))<1){await primary(q).click();await page.waitForFunction(qid=>document.querySelector(`[data-question-id="${qid}"] .example-walkthrough`)?.getAttribute('data-step')==='1',qid);}
  if(!c.secondary){assert.equal(await primary(q).innerText(),c.hint?'説明で解けた':'自力で解けた');sameSlot(slot,await primary(q).boundingBox());await primary(q).click();}
 }
 assert.equal(await primary(q).innerText(),'次へ');sameSlot(slot,await primary(q).boundingBox());const final=await attempts(page);assert.equal(final.length,1);assert.equal(final[0].outcome,c.expected);assert.equal(final[0].exerciseId,qid);assert.equal(final[0].reviewOf,reviewOf);assert.equal(final[0].method,c.kind==='paper'?'self':'auto');if(previewId)assert.equal(final[0].id,previewId);
 const result=await verify(page,q,`${c.name}-${width}`,['choice-empty','number-empty','number-invalid-preview','paper-self'].includes(c.name));await primary(q).click();await page.locator('.complete').waitFor();assert.equal((await attempts(page)).length,1);records.push({case:c.name,width,qid,reviewOf,outcome:final[0].outcome,method:final[0].method,oneRecord:true,sameSlot:true,nextWorks:true,...result});
 }finally{await ctx.close();}}
async function queueCase(width,kind){activeCase={case:'actual-next-'+kind,width};const ctx=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce'}),page=await ctx.newPage();observe(page);try{
 if(kind==='choice'){const seed=[4,5,6,7].map(i=>({id:`seed-${i}`,exerciseId:`amgm-${i}-v1`,at:Date.now()-1000+i,outcome:'seen',method:'self'}));await ctx.addInitScript(({store,seed})=>{if(location.protocol.startsWith('http'))localStorage.setItem(store,JSON.stringify({version:1,attempts:seed}));},{store,seed});}
 const first=kind==='choice'?'amgm-8-v1':'amgm-2-v1',second=kind==='choice'?'amgm-9-v1':'amgm-3-v1';await page.goto(route(kind==='choice'?'practice':'guided'),{waitUntil:'networkidle'});let q=await ready(page,first);const slot=await primary(q).boundingBox();assert.equal(await primary(q).innerText(),'解説を見る');await primary(q).click();assert.equal(await primary(q).innerText(),'次へ');sameSlot(slot,await primary(q).boundingBox());await primary(q).click();q=await ready(page,second);assert.equal(await primary(q).innerText(),'解説を見る');sameSlot(slot,await primary(q).boundingBox());assert.equal(await q.locator('.error-text').count(),0);await verify(page,q,`queue-${kind}-${width}`,true);const a=await attempts(page);assert.equal(a.filter(x=>x.exerciseId===first).length,1);assert.equal(a.find(x=>x.exerciseId===first).outcome,'seen');assert.equal(a.filter(x=>x.exerciseId===second).length,0);records.push({case:'actual-next-'+kind,width,first,second,sameSlot:true,seenOnly:true,nextQuestionUnanswered:true});
 }finally{await ctx.close();}}
const smokeCases=new Set(['choice-empty','number-empty','choice-correct','number-invalid-preview']);
const selectedCases=smoke?cases.filter(c=>smokeCases.has(c.name)):cases;
try{for(const width of widths){for(const c of selectedCases)await runCase(width,c);await queueCase(width,'choice');await queueCase(width,'number');}assert.deepEqual(runtime,[]);assert.deepEqual(network,[]);console.log(JSON.stringify({status:'passed',records:records.length,out}));}catch(e){failures.push({...activeCase,message:e.message,stack:e.stack});console.error(e);process.exitCode=1;}finally{await writeFile(out+'/results.json',JSON.stringify({base,staticMode,smoke,records,failures,runtime,network},null,2));await browser.close();}
