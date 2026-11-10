/* eslint-disable no-control-regex -- Detect malformed mathematical source and rendered control characters. */
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const root=fileURLToPath(new URL('..',import.meta.url)).replace(/\/$/,''),out=process.env.MATHCANVAS_SCREENSHOTS??'/tmp/mathi-content-check';
fs.mkdirSync(out+'/html',{recursive:true});fs.mkdirSync(out+'/screenshots',{recursive:true});
const req=createRequire(root+'/package.json');
const React=req('react');
const {renderToStaticMarkup}=req('react-dom/server');
const {loadDisplay}=await import(root+'/scripts/test-display-module.mjs');
const {MathText,Formula}=await loadDisplay('MathText');
const {lessons:allLessons,exercises:allExercises}=globalThis.__mathcanvasDiagnosticTestContent;
const lessons=allLessons.filter(l=>l.subject==='数学I');
const slugs=new Set(lessons.map(l=>l.slug));
const exercises=allExercises.filter(e=>slugs.has(e.lesson));
const {chromium}=createRequire(process.env.MATHCANVAS_PLAYWRIGHT_PACKAGE??import.meta.url)('playwright');
const origin=process.env.MATHCANVAS_CHECK_URL??'http://localhost:3000',suffix=process.env.MATHCANVAS_STATIC==='1'?'.html':'';
const auditWidths=(process.env.MATHCANVAS_WIDTHS??'1100,390,320').split(',').map(Number);
const response=await fetch(origin+'/learn/'+lessons[0].slug+suffix);
const actualHtml=await response.text();
const styles=[...actualHtml.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m=>new URL(m[1],origin).href);
if(styles.length<1)throw new Error('Could not obtain actual site styles: '+JSON.stringify(styles));
const cssSnapshots=await Promise.all(styles.map(async url=>({url,css:await (await fetch(url,{headers:{Accept:'text/css'}})).text()})));
if(cssSnapshots.some(s=>s.css.startsWith('import ')))throw new Error('Stylesheet response contains Vite JavaScript');
const cssHashes=cssSnapshots.map(({url,css})=>({url,sha256:createHash('sha256').update(css).digest('hex')}));
fs.writeFileSync(out+'/content-snapshot.json',JSON.stringify({lessons,exercises}));
cssSnapshots.forEach(({css},i)=>fs.writeFileSync(out+'/css-'+i+'.css',css));
const h=React.createElement, snippets=[], malformedSource=[];
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function text(value,field,tag='p',props={}){
 if(typeof value!=='string'||!value)return null;
 snippets.push({field,mode:'MathText',value});
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\r]|[¥￥][A-Za-z]/.test(value))malformedSource.push({field,value});
 return h(tag,{'data-qa-field':field,...props},h(MathText,{text:value}));
}
function tex(value,field){
 if(typeof value!=='string'||!value)return null;
 snippets.push({field,mode:'Formula',value});
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\r]|[¥￥][A-Za-z]/.test(value))malformedSource.push({field,value});
 return h('div',{'data-qa-field':field},h(Formula,{tex:value,display:true}));
}
function steps(list,base){return h('ol',{className:'steps steps-unnumbered'},...(list??[]).map((s,i)=>h('li',{className:'step',key:i},h('div',null,text(s.title,`${base}.${i}.title`,'strong'),text(s.text,`${base}.${i}.text`),tex(s.tex,`${base}.${i}.tex`)))));}
function walkthrough(list,base){return h('div',{className:'example-walkthrough'},h('details',{className:'supplement',open:true},h('summary',null,'解説をまとめて読む'),steps(list,base)));}
const pages=new Map();
for(const lesson of lessons){
 const slug=lesson.slug,qs=exercises.filter(e=>e.lesson===slug);
 const basic=h('section',{className:'block task-pane'},text(lesson.basicsTitle,slug+'.basicsTitle','h2'),...(lesson.introduction??[]).map((s,i)=>text(s,`${slug}.introduction.${i}`)),h('div',{className:'note'},text(lesson.rule,slug+'.rule'),tex(lesson.ruleTex,slug+'.ruleTex')),
 ...(lesson.prerequisites??[]).map((s,i)=>text(s.label,`${slug}.prerequisites.${i}.label`)),...(lesson.practiceGroups??[]).map((s,i)=>text(s.title,`${slug}.practiceGroups.${i}.title`)));
 const examples=lesson.examples.map((e,i)=>h('section',{className:'block task-pane',key:i},h('article',{className:'example'},text(e.title,`${slug}.examples.${i}.title`,'h2'),text(e.prompt,`${slug}.examples.${i}.prompt`),tex(e.tex,`${slug}.examples.${i}.tex`),walkthrough(e.steps,`${slug}.examples.${i}.steps`))));
 const questions=qs.map(q=>h('section',{className:'block task-pane',key:q.id},h('article',{className:'question','data-question-id':q.id},text(q.prompt,q.id+'.prompt','h3'),tex(q.tex,q.id+'.tex'),q.options?.length?h('div',{className:'options'},...q.options.map((s,i)=>text(s,`${q.id}.options.${i}`,'button',{className:'option'}))):null,h('div',{className:'hint'},...(q.hints??[]).map((s,i)=>text(s,`${q.id}.hints.${i}`))),h('div',{className:'feedback'},text(q.answer,q.id+'.answer'),walkthrough(q.steps,q.id+'.steps')))));
 const supplements=lesson.supplements.map(s=>h('div',{className:'linked-repair',key:s.id},h('div',{className:'repair-card'},
 text(s.title,`${slug}.supplements.${s.id}.title`,'h3'),text(s.text,`${slug}.supplements.${s.id}.text`,'p',{className:'math-paragraph'}),tex(s.tex,`${slug}.supplements.${s.id}.tex`),
 h('div',{className:'repair-exercise'},text(s.check,`${slug}.supplements.${s.id}.check`),h('details',{open:true},h('summary',null,'答えと途中式を確かめる'),text(s.answer,`${slug}.supplements.${s.id}.answer`,'p',{className:'math-paragraph'}))),
 ...(s.additionalExamples??[]).map((e,i)=>h('details',{className:'supplement',open:true,key:i},text(e.title,`${slug}.supplements.${s.id}.additionalExamples.${i}.title`,'summary'),text(e.text,`${slug}.supplements.${s.id}.additionalExamples.${i}.text`,'p',{className:'math-paragraph'}),tex(e.tex,`${slug}.supplements.${s.id}.additionalExamples.${i}.tex`))))));
 const body=h('main',{id:'main'},h('section',{className:'hero focused-hero'},h('div',{className:'breadcrumb'},'数学I / '+lesson.chapter),text(lesson.title,slug+'.title','h1'),text(lesson.description,slug+'.description')),h('div',{className:'wrap focused-layout'},h('div',{className:'lesson-body'},basic,...examples,...questions,h('section',{className:'block'},...supplements))));
 const html='<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+styles.map(s=>'<link rel="stylesheet" href="'+escape(s)+'">').join('')+'<title>表示検査 '+escape(lesson.title)+'</title></head><body>'+renderToStaticMarkup(body)+'</body></html>';
 pages.set(slug,html);fs.writeFileSync(out+'/html/'+slug+'.html',html);
}
fs.writeFileSync(out+'/source-manifest.json',JSON.stringify({lessons:lessons.map(l=>l.slug),exerciseIds:exercises.map(e=>e.id),styles,snippets:snippets.map(({field,mode})=>({field,mode})),malformedSource},null,2));
console.log(JSON.stringify({generatedPages:lessons.length,exercises:exercises.length,displayFields:snippets.length,styles,malformedSource}));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[],actualScreens=[],fieldScreens=[];
const targetFields={};
async function scan(page){return page.evaluate(()=>{
 const vw=document.documentElement.clientWidth;
 const field=el=>el.closest('[data-qa-field]')?.getAttribute('data-qa-field')??el.closest('[data-question-id]')?.getAttribute('data-question-id')??el.tagName;
 const errors=[...document.querySelectorAll('.math-error,.katex-error')].map(el=>({field:field(el),text:el.textContent}));
 const raw=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;while((node=walker.nextNode())){
  const el=node.parentElement;if(!el||el.closest('.katex,script,style'))continue;
  if(/\\[A-Za-z]+|\$|[¥￥][A-Za-z]|[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(node.textContent))raw.push({field:field(el),text:node.textContent});
 }
 const scrolls=[...document.querySelectorAll('.formula.display,.katex-display,.step p')].filter(el=>el.scrollWidth>el.clientWidth+2&&['auto','scroll'].includes(getComputedStyle(el).overflowX)).map(el=>({field:field(el),clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,tex:el.closest('[data-tex]')?.getAttribute('data-tex')}));
 const verticalScrollers=[...document.querySelectorAll('.formula.display,.katex-display,.step p')].filter(el=>['auto','scroll'].includes(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight+1).map(el=>({field:field(el),class:el.className,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight}));
 const fieldOverflows=[...document.querySelectorAll('[data-qa-field]')].filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>({field:field(el),available:el.clientWidth,content:el.scrollWidth,tex:[...el.querySelectorAll('.formula')].map(f=>f.getAttribute('data-tex'))}));
 const leaks=[];
 for(const el of document.querySelectorAll('[data-qa-field],.formula,.katex-html')){
  const rect=el.getBoundingClientRect();if(rect.width===0||rect.height===0||!(rect.right>vw+2||rect.left< -2))continue;
  let contained=false;for(let a=el.parentElement;a&&a!==document.body;a=a.parentElement){const css=getComputedStyle(a),r=a.getBoundingClientRect();if(['auto','scroll'].includes(css.overflowX)&&a.scrollWidth>a.clientWidth+2&&r.left>=-2&&r.right<=vw+2){contained=true;break;}}
  if(!contained)leaks.push({field:field(el),left:Math.round(rect.left*10)/10,right:Math.round(rect.right*10)/10,width:Math.round(rect.width*10)/10,tag:el.tagName,class:el.className,tex:el.getAttribute('data-tex')??undefined});
 }
 const unique=new Map();for(const l of leaks){if(!unique.has(l.field)||l.right>unique.get(l.field).right)unique.set(l.field,l);}
 return {viewport:vw,pageWidth:document.documentElement.scrollWidth,pageOverflow:document.documentElement.scrollWidth>vw+2,mathErrors:errors,unprocessedText:raw,leaks:[...unique.values()],containedFormulaScrolls:scrolls,verticalScrollers,fieldOverflows,formulas:document.querySelectorAll('.formula').length,fonts:{status:document.fonts.status,katexMain:document.fonts.check('16px KaTeX_Main'),katexMath:document.fonts.check('16px KaTeX_Math'),used:[...new Set([...document.querySelectorAll('.katex-html span')].filter(el=>el.textContent.trim()).map(el=>getComputedStyle(el).fontFamily.split(',')[0].replaceAll('"','')).filter(f=>f.startsWith('KaTeX_')))],loaded:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)}};
 });}
for(const width of auditWidths){
 const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1});
 const page=await context.newPage();let failures=[];
 for(const {url,css} of cssSnapshots)await page.route(url,route=>route.fulfill({status:200,contentType:'text/css',body:css}));
 page.on('requestfailed',r=>failures.push({type:'requestfailed',url:r.url(),error:r.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400)failures.push({type:'response',url:r.url(),status:r.status()});});
 await page.route(origin+'/__mathi_audit__/**',route=>{const slug=route.request().url().split('/').at(-1).replace(/\.html$/,'');return route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:pages.get(slug)??'missing'});});
 for(const [index,lesson] of lessons.entries()){
  failures=[];await page.goto(origin+'/__mathi_audit__/'+lesson.slug+'.html',{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
  const check=await scan(page);results.push({slug:lesson.slug,width,...check,networkFailures:[...failures]});
  if([320,1100].includes(width))for(const field of targetFields[lesson.slug]??[]){const locator=page.locator('[data-qa-field='+JSON.stringify(field)+']');await locator.scrollIntoViewIfNeeded();const file=out+'/screenshots/field-'+field+'-'+width+'.png';await locator.screenshot({path:file});fieldScreens.push({field,slug:lesson.slug,width,file});}
  if(index%20===0)console.log(JSON.stringify({width,finished:index+1,total:lessons.length,overflowPages:results.filter(r=>r.pageOverflow).length,mathErrors:results.reduce((n,r)=>n+r.mathErrors.length,0)}));
 }
 for(const slug of ['m1-product-identities','m1-cosine-law-angle','m1-variance-calculation']){
  failures=[];await page.goto(origin+'/learn/'+slug+suffix+'#examples',{waitUntil:'networkidle'});
  await page.waitForSelector('.task-pane[data-task-pane="example-0"]:not([hidden])',{timeout:20000});
  const summary=page.locator('.task-pane[data-task-pane="example-0"] summary').filter({hasText:'解説をまとめて読む'}).first();
  if(await summary.count())await summary.click();
  await page.evaluate(()=>document.fonts.ready);
  const file=`${out}/screenshots/${slug}-${width}.png`;await page.screenshot({path:file,fullPage:true});
  const check=await scan(page);actualScreens.push({slug,width,url:page.url(),file,...check,networkFailures:[...failures]});
 }
 await context.close();
}
await browser.close();
const report={scope:'数学I 全教材本文の共有 MathText/Formula + 実サイトCSS/fontによる静的描画。全問題の操作テストではない。',date:new Date().toISOString(),counts:{lessons:lessons.length,exercises:exercises.length,displayFields:snippets.length,viewports:auditWidths,renderedAuditPages:results.length},styles,cssHashes,sourceIssues:malformedSource,summary:{mathErrors:results.reduce((n,r)=>n+r.mathErrors.length,0),rawTextIssues:results.reduce((n,r)=>n+r.unprocessedText.length,0),pageOverflowPages:results.filter(r=>r.pageOverflow).map(r=>({slug:r.slug,width:r.width,pageWidth:r.pageWidth})),leakFields:results.flatMap(r=>r.leaks.map(l=>({slug:r.slug,viewport:r.width,...l}))),containedFormulaScrollCount:results.reduce((n,r)=>n+r.containedFormulaScrolls.length,0),verticalScrollers:results.flatMap(r=>r.verticalScrollers.map(f=>({slug:r.slug,width:r.width,...f}))),fieldOverflows:results.flatMap(r=>r.fieldOverflows.map(f=>({slug:r.slug,width:r.width,...f}))),fontFailures:results.filter(r=>r.fonts.used.some(f=>!r.fonts.loaded.includes(f))).map(r=>({slug:r.slug,width:r.width,fonts:r.fonts})),networkFailures:results.flatMap(r=>r.networkFailures)},results,actualScreens,fieldScreens,limitations:['例題と設問解説は実UIのまとめ読み details 入れ子・showNumbers=false、補足は linked-repair/repair-exercise 入れ子まで再現。本文の静的全件描画であり全問の解答操作・学習履歴・分岐・アニメーションを全件操作した検査ではない。','実ページの例題表示を3ページ×指定画面幅で保存。スクリーンショットの目視確認は別途実施。','DOM上の数式エラー・生TeX・字幅・横漏れを検査。全数式の全ピクセルを目視した検査ではない。']};
fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({report:out+'/results.json',...report.counts,mathErrors:report.summary.mathErrors,rawTextIssues:report.summary.rawTextIssues,pageOverflowPages:report.summary.pageOverflowPages,leakFields:report.summary.leakFields.length,fieldOverflows:report.summary.fieldOverflows.length,containedFormulaScrollCount:report.summary.containedFormulaScrollCount,verticalScrollers:report.summary.verticalScrollers.length,fontFailures:report.summary.fontFailures.length,networkFailures:report.summary.networkFailures.length},null,2));

assert.equal(report.sourceIssues.length,0,'Malformed mathematical source');
for(const key of ['mathErrors','rawTextIssues','containedFormulaScrollCount'])assert.equal(report.summary[key],0,key);
for(const key of ['pageOverflowPages','leakFields','verticalScrollers','fieldOverflows','fontFailures','networkFailures'])assert.deepEqual(report.summary[key],[],key);
