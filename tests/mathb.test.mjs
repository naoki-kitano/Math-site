import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import katex from 'katex';
const cache=new Map();
function moduleURL(file){
 if(cache.has(file.href))return cache.get(file.href);
 const js=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace(/from\s+["'](\.\/[^"']+)["']/g,(_,p)=>'from '+JSON.stringify(moduleURL(new URL(p+'.ts',file))));
 const url='data:text/javascript;base64,'+Buffer.from(js).toString('base64');cache.set(file.href,url);return url;
}
const get=async f=>import(moduleURL(new URL('../app/content/'+f+'.ts',import.meta.url)));
const {mathBLessons:lessons,mathBExercises:exercises,mathBBanks:banks}=await get('mathb');
const {audit}=await get('mathb-authoring');
const strings=x=>typeof x==='string'?[x]:Array.isArray(x)?x.flatMap(strings):x&&typeof x==='object'?Object.values(x).flatMap(strings):[];
test('math B coverage, separate review decisions, samples and chapter selection',t=>{
 assert.equal(lessons.length,44);
 assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
 for(const chapter of new Set(lessons.map(l=>l.chapter))){
  const ls=lessons.filter(l=>l.chapter===chapter),qs=exercises.filter(e=>ls.some(l=>l.slug===e.lesson));
  t.diagnostic(JSON.stringify({chapter,pages:ls.length,examples:ls.reduce((n,l)=>n+l.examples.length,0),questions:qs.length}));
 }
 for(const l of lessons){
  assert.equal(l.subject,'数学B');const qs=exercises.filter(e=>e.lesson===l.slug);
  assert.equal(qs.filter(e=>e.stage==='ready').length,2,l.slug);
  assert.ok(qs.filter(e=>e.stage==='practice').length>=6,l.slug);
  for(const ex of l.examples)assert.ok(ex.guidedIds.every(id=>qs.some(e=>e.id===id&&e.stage==='guided')),l.slug);
  for(const e of qs){
   assert.ok(e.hints[0]?.length>5,e.id);
   assert.ok(l.supplements.some(s=>s.id===e.repair),e.id);
   assert.ok(qs.some(a=>a.id!==e.id&&a.family===e.family&&a.prompt!==e.prompt&&['practice','review'].includes(a.stage)),e.id);
  }
 }
 for(const b of banks){
  const check=lessons.find(l=>l.chapter===b.lesson.chapter&&l.practiceGroups);
  for(const sk of b.skills){
   assert.equal(new Set(sk.items.map(x=>x.prompt)).size,sk.items.length,'repeated prompt '+b.lesson.slug+sk.id);
   assert.ok(!sk.items.some(x=>x.prompt===sk.sample.prompt),'sample repeated '+b.lesson.slug+sk.id);
   assert.ok(exercises.some(e=>e.lesson===check.slug&&e.stage==='practice'&&e.family===b.lesson.slug+'-'+sk.id),sk.id);
  }
 }
});
test('math B formulas are actual strict TeX with fractions and no control characters',()=>{
 for(const text of strings(banks.find(b=>b.lesson.slug==='mb-weighted-geometric'))){
  assert.doesNotMatch(text,/\b\d+2\^\{/,'numeric coefficient must not merge with base: '+text);
 }
 for(const text of strings({lessons,exercises})){
  assert.ok([...text].every(c=>c.charCodeAt(0)>=32||c==='\n'||c==='\r'),'control character '+text);
  assert.equal((text.match(/\$/g)||[]).length%2,0,text);
  assert.doesNotMatch(text.replace(/\$[^$]*\$/g,''),/\b[nkXYS]\b|[₀-₉]/,'plain math variable: '+text);
  for(const [,tex]of text.matchAll(/\$([^$]+)\$/g)){
   assert.doesNotMatch(tex,/\\\\|\\binom|\//,tex);
   katex.renderToString(tex,{throwOnError:true,strict:'error'});
  }
 }
});
const sum=(n,fn,start=1)=>Array.from({length:n-start+1},(_,i)=>fn(start+i)).reduce((a,b)=>a+b,0);
const choose=(n,k)=>{let a=1;for(let i=1;i<=k;i++)a=a*(n-i+1)/i;return a;};
test('math B numeric answers checked by direct enumeration, moments and recurrence',()=>{
 assert.ok(audit.length>300);
 for(const {kind,args:a,value}of audit){
  let v;
  switch(kind){
   case'term':v=2*a[0]-1;break;case'term-next':v=2*(a[0]+1)-1;break;
   case'arithmetic':v=a[0];for(let j=1;j<a[2];j++)v+=a[1];break;
   case'arithmetic-sum':v=sum(a[2],j=>a[0]+(j-1)*a[1]);break;
   case'difference':v=((a[0]+(a[3]-1)*a[1])-(a[0]+(a[2]-1)*a[1]))/(a[3]-a[2]);break;
   case'interval-sum':v=sum(a[1],j=>j,a[0]);break;
   case'geometric':v=a[0];for(let j=1;j<a[2];j++)v*=a[1];break;
   case'geometric-sum':v=sum(a[2],j=>a[0]*a[1]**(j-1));break;
   case'sigma':v=sum(a[0],j=>j,2);break;case'sigma-constant':v=sum(a[0],()=>3,2);break;
   case'square-sum':v=sum(a[0],j=>j*j);break;case'cube-sum':v=sum(a[0],j=>j**3);break;
   case'mixed-power':v=sum(a[0],j=>2*j*j-j);break;
   case'difference-even':v=2+sum(a[0]-1,j=>2*j);break;case'difference-odd':v=1+sum(a[0]-1,j=>2*j+1);break;
   case'telescoping':v=sum(a[0],j=>1/(j*(j+1)));break;case'telescoping-wide':v=sum(a[0],j=>1/(j*(j+2)));break;
   case'weighted':v=sum(a[0],j=>j*2**j);break;case'weighted-half':v=sum(a[0],j=>j/2**j);break;
   case'recurrence-values':v=a[0];for(let j=0;j<3;j++)v=a[1]*v+a[2];break;
   case'dist-point':v=.25;break;case'dist-cumulative':v=.25+.5;break;
   case'expectation':v=0*.25+a[0]*.5+2*a[0]*.25;break;
   case'second-moment':v=a[0]**2*.5+(2*a[0])**2*.25;break;
   case'variance':case'sd':v=(0-a[0])**2*.25+(2*a[0]-a[0])**2*.25;if(kind==='sd')v=Math.sqrt(v);break;
   case'transform-mean':v=a[0]*a[2]+a[1];break;case'transform-var':v=a[0]**2*a[3];break;
   case'independent-var':v=a[0]+a[1];break;
   case'binomial':v=0;for(let mask=0;mask<2**a[0];mask++)if(mask.toString(2).replaceAll('0','').length===a[1])v+=1/2**a[0];break;
   case'binomial-tail':v=1-1/2**a[0];break;
   case'binomial-moments':{const [n,p]=a;const mean=n*p;v=sum(n,k=>(k-mean)**2*choose(n,k)*p**k*(1-p)**(n-k),0);break;}
   case'uniform':v=1/a[0];break;case'continuous-point':v=0;break;
   case'normal-middle':case'normal-tail':{const z=a[2],h=z/10000,area=sum(10000,j=>Math.exp(-(((j-.5)*h)**2)/2)/Math.sqrt(2*Math.PI))*h;v=kind==='normal-middle'?2*area:.5-area;assert.ok(Math.abs(value-v)<.00011,kind);continue;}
   case'normal-between':{const h=(a[2]-a[1])/10000;v=sum(10000,j=>Math.exp(-((a[1]+(j-.5)*h)**2)/2)/Math.sqrt(2*Math.PI))*h;assert.ok(Math.abs(value-v)<.00011);continue;}
   case'sample-var':v=a[1]/a[0];break;case'sample-sd':v=Math.sqrt(a[1]/a[0]);break;
   case'normal-approx':v=.1587;break;
   case'ci-known':case'ci-unknown':v=1.96*a[1]/Math.sqrt(a[2]);break;
   case'ci-proportion':v=1.96*Math.sqrt(a[0]*(1-a[0])/a[1]);break;
   case'sample-size-width':v=Math.sqrt(a[0])/Math.sqrt(4*a[0]);break;
   case'hypothesis':v=+(a[1]===0?Math.abs(a[0])>1.96:a[1]>0?a[0]>1.645:a[0]<-1.645);break;
   case'proportion-test':v=+(Math.abs((a[0]-.5*a[1])/Math.sqrt(.25*a[1]))>1.96);break;
   case'simple-interest':v=a[0]+a[2]*a[0]*a[1];break;
   case'compound-interest':v=a[0];for(let j=0;j<a[2];j++)v*=1+a[1];break;
   case'saving':case'loan':v=a[0];for(let j=0;j<a[3];j++)v=v*a[1]+a[2];assert.ok(v>0);break;
   case'fit-slope':v=((a[0]+8)-a[0])/4;break;case'fit-prediction':v=3*a[1]+a[0];break;
   case'residual':v=a[1];break;case'squared-errors':v=a[1]**2;break;
   case'frequency':v=a[0]/a[1];break;
   default:assert.fail('unchecked '+kind);
  }
  assert.ok(Math.abs(v-value)<1e-8*Math.max(1,Math.abs(value)),kind+' '+a+' '+value+' != '+v);
 }
});
test('inference conditions, two-sided and one-sided decisions and return links are retained',()=>{
 for(const slug of ['mb-mean-interval','mb-two-sided-test','mb-one-sided-test']){
  const qs=exercises.filter(e=>e.lesson===slug&&e.stage!=='ready'&&!e.family.startsWith('prep-'));
  assert.ok(qs.every(e=>e.prompt.includes('独立')),slug);
 }
 const qs=exercises.filter(e=>e.lesson==='mb-one-sided-test');
 for(const f of ['upper','lower']){
  assert.ok(qs.some(e=>e.family===f&&e.answer.includes('棄却します')));
  assert.ok(qs.some(e=>e.family===f&&e.answer.includes('棄却しません')));
 }
 assert.ok(lessons.find(l=>l.slug==='mb-sum-to-term').introduction.join('').includes('S_0'));
 assert.ok(lessons.find(l=>l.slug==='mb-geometric-sum').examples.some(e=>e.id==='one'));
 assert.ok(lessons.find(l=>l.slug==='mb-independent-sum').examples.some(e=>e.id==='dependent'));
 const check=exercises.filter(e=>e.lesson==='mb-inference-check'&&e.stage==='practice'&&e.family==='mb-one-sided-test-upper');
 assert.ok(check.some(e=>e.answer.includes('棄却します')));assert.ok(check.some(e=>e.answer.includes('棄却しません')));
 const residuals=exercises.filter(e=>e.lesson==='mb-society-check'&&e.stage==='practice'&&e.family==='mb-residuals-residual');
 for(const sign of ['残差 $0$','残差 $1$','残差 $-1$'])assert.ok(residuals.some(e=>e.answer.includes(sign)),sign);
});
test('all math B tables have strict math, and the simulation is reproducible',async()=>{
 const {mathBTables}=await get('mathb-tables');
 for(const tables of Object.values(mathBTables))for(const table of tables){
  for(const row of table.rows)assert.equal(row.length,table.headers.length);
  for(const text of strings(table))for(const [,tex]of text.matchAll(/\$([^$]+)\$/g))katex.renderToString(tex,{throwOnError:true,strict:'error'});
 }
 const {coinSample}=await import(moduleURL(new URL('../app/lib/mathb-simulation.ts',import.meta.url)));
 assert.deepEqual(coinSample(20260923),coinSample(20260923));
 let seed=20260923,total=0;const counts=[];
 for(let i=0;i<10;i++){const r=coinSample(seed);assert.ok(r.heads>=0&&r.heads<=100);total+=r.heads;counts.push(r.heads);seed=r.seed;}
 assert.ok(new Set(counts).size>1);assert.ok(total>350&&total<650);
 assert.throws(()=>coinSample(1,0));
});
