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
const {mathAProbabilityTopics:topics,mathAChapter2Lessons:lessons,mathAChapter2Exercises:exercises}=await import(moduleURL(new URL('../app/content/matha-chapter2.ts',import.meta.url)));
const {probabilityAudit}=await import(moduleURL(new URL('../app/content/matha-probability-questions.ts',import.meta.url)));
test('probability covers fifteen lessons and every question has a matched alternate',t=>{
 assert.equal(topics.length,15);assert.equal(lessons.length,16);
 t.diagnostic(JSON.stringify({lessons:lessons.length,questions:exercises.length,examples:lessons.reduce((n,l)=>n+l.examples.length,0)}));
 for(const l of lessons){
  const qs=exercises.filter(e=>e.lesson===l.slug);
  assert.equal(qs.filter(e=>e.stage==='ready').length,2);
  for(const e of qs){
   assert.ok(e.hints[0]);assert.ok(l.supplements.some(s=>s.id===e.repair));
   assert.ok(qs.some(v=>v.id!==e.id&&v.family===e.family&&v.prompt!==e.prompt&&['practice','review'].includes(v.stage)),e.id);
  }
  for(const e of l.examples)assert.ok(qs.some(q=>e.guidedIds.includes(q.id)&&q.stage==='guided'));
 }
});
test('probability answers verified by elementary outcomes or weighted paths',()=>{
 const ints=n=>Array.from({length:n},(_,i)=>i+1);
 const binom=(n,r)=>{let x=1;for(let j=1;j<=r;j++)x=x*(n-j+1)/j;return x;};
 for(const {q,kind,args:a} of probabilityAudit){
  let v;
  switch(kind){
   case 'color':v=a[0]/(a[0]+a[1]);break;
   case 'sum':v=ints(6).flatMap(x=>ints(6).filter(y=>x+y===a[0])).length/36;break;
   case 'pair':{const n=a[0]+a[1];let good=0,total=0;for(let x=1;x<=n;x++)for(let y=x+1;y<=n;y++){total++;if(x<=a[0]&&y<=a[0])good++;}v=good/total;break;}
   case 'card':v=ints(a[0]).filter(x=>x%a[1]===0).length/a[0];break;
   case 'heads':v=1-0.5**a[0];break;
   case 'union':v=ints(a[0]).filter(x=>x%a[1]===0||x%a[2]===0).length/a[0];break;
   case 'successive':{const [r,b,replace,different]=a,n=r+b;let good=0,total=0;for(let x=1;x<=n;x++)for(let y=1;y<=n;y++){if(!replace&&x===y)continue;total++;if(different?(x<=r)!==(y<=r):x<=r&&y<=r)good++;}v=good/total;break;}
   case 'independent':v=ints(6).flatMap(x=>ints(6).filter(y=>x>=a[0]&&y%a[1]===0)).length/36;break;
   case 'repeated':{const [n,k,d]=a;v=0;for(let mask=0;mask<2**n;mask++){const count=mask.toString(2).replaceAll('0','').length;if(count===k)v+=(1/d)**k*(1-1/d)**(n-k);}assert.ok(binom(n,k)>0);break;}
   case 'conditional':{const [n,k,lower]=a,all=ints(n).filter(x=>lower?x>=k:x<=k);v=all.filter(x=>x%2===0).length/all.length;break;}
   case 'multiply':v=a[0]*a[2]/(a[1]*a[3]);break;
   case 'posterior':{const [r,b,w,t]=a,A=w/t*r/(r+b),B=(1-w/t)*b/(r+b);v=A/(A+B);break;}
   case 'expectation':v=(a[0]-a[3])*a[1]/a[2]+(-a[3])*(1-a[1]/a[2]);break;
   case 'three':v=a[0]/3+a[1]/6;break;
   default:throw Error(kind);
  }
  assert.ok(Math.abs(q.value-v)<1e-9,kind+JSON.stringify(a));
  if(!['expectation','three'].includes(kind))assert.ok(v>=0&&v<=1);
 }
});
test('all probability text has valid and unescaped TeX',()=>{
 const strings=x=>typeof x==='string'?[x]:Array.isArray(x)?x.flatMap(strings):x&&typeof x==='object'?Object.values(x).flatMap(strings):[];
 for(const text of strings({lessons,exercises})){
  assert.equal((text.match(/\$/g)||[]).length%2,0,text);
  for(const [,tex] of text.matchAll(/\$([^$]+)\$/g)){
   assert.doesNotMatch(tex,/\\\\[a-zA-Z]|\\binom|[0-9]\/[0-9]/);
   katex.renderToString(tex,{throwOnError:true,strict:'error'});
  }
 }
});
test('chapter check retains formula boundaries, impossible condition and unequal box choice',()=>{
 const qs=exercises.filter(e=>e.lesson==='ma-probability-check'&&e.stage==='practice');
 for(const family of ['binomial-probability','binomial-condition','zero-condition','weighted-boxes','mean-not-guarantee','dependence','disjoint']){
  assert.ok(qs.some(e=>e.family.endsWith('-'+family)),family);
 }
 assert.ok(qs.some(e=>e.prompt.includes('ちょうど $0$ 回')));
 assert.ok(qs.some(e=>e.prompt.includes('ちょうど $4$ 回')));
});
