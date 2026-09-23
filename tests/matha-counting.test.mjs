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
const {mathACountingTopics:topics,mathAChapter1Lessons:lessons,mathAChapter1Exercises:exercises,mathACheckCoverage:coverage}=await import(moduleURL(new URL('../app/content/matha-chapter1.ts',import.meta.url)));
const {auditQuestions}=await import(moduleURL(new URL('../app/content/matha-counting-authoring.ts',import.meta.url)));
const binomial=(n,r)=>{if(r<0||r>n)return 0;let row=[1];for(let i=1;i<=n;i++)row=Array.from({length:i+1},(_,j)=>(row[j-1]??0)+(row[j]??0));return row[r];};
const ordered=(n,r)=>{let v=1;for(let i=0;i<r;i++)v*=n-i;return v;};
const multinomial=(a,b,c)=>binomial(a+b+c,a)*binomial(b+c,b);
test('counting operations retain real TeX multiplication commands',async()=>{
 const {arithmetic,menu}=await import(moduleURL(new URL('../app/content/matha-counting-authoring.ts',import.meta.url)));
 assert.ok(arithmetic(3,4).prompt.includes('\\times'));
 assert.ok(menu(3,4,'product').working.includes('\\times'));
 for(const {q} of auditQuestions)for(const text of [q.prompt,q.answer,q.working,q.hint])assert.ok([...text].every(c=>c.charCodeAt(0)>=32||c==='\n'||c==='\r'));
});
test('math A chapter has 13 complete lessons, explicit guidance and focused review',t=>{
 t.diagnostic(JSON.stringify({lessons:lessons.length,examples:lessons.reduce((n,l)=>n+l.examples.length,0),questions:exercises.length,ordinaryQuestions:topics.reduce((n,b)=>n+b.exercises.length,0),supplements:lessons.reduce((n,l)=>n+l.supplements.length,0)}));
 assert.equal(lessons.length,14);assert.equal(topics.length,13);
 assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
 for(const l of lessons){
  assert.equal(l.subject,'数学A');
  const qs=exercises.filter(e=>e.lesson===l.slug);
  assert.equal(qs.filter(e=>e.stage==='ready').length,2,l.slug);
  assert.ok(qs.filter(e=>e.stage==='practice').length>=10,l.slug);
  for(const example of l.examples){
   assert.equal(example.guidedIds.length,1);
   assert.ok(qs.some(e=>e.id===example.guidedIds[0]&&e.stage==='guided'));
  }
  for(const e of qs){
   assert.ok(e.hints[0].length>8);
   assert.ok(l.supplements.some(s=>s.id===e.repair));
   assert.ok(qs.some(v=>v.id!==e.id&&v.family===e.family&&v.prompt!==e.prompt&&['review','practice'].includes(v.stage)),e.id);
  }
 }
});
test('all source counting answers agree with independent recurrences and direct digit enumeration',()=>{
 const examples=topics.flatMap(t=>t.skills.map(s=>({id:t.lesson.slug+" example "+s.id,q:s.sample})));
 for(const {id,q} of [...auditQuestions,...examples]){
  const {kind,args:a}=q.model;let v;
  switch(kind){
   case 'add':v=a[0]+a[1];break;
   case 'multiply':case 'pairs':v=a[0]*a[1];break;
   case 'digits':case 'even-digits':v=a.flatMap(x=>a.filter(y=>y!==x&&x!==0&&(kind!=='even-digits'||y%2===0)).map(y=>10*x+y)).length;break;
   case 'union':v=a[1]+a[2]-a[3];break;
   case 'outside':v=a[0]-a[1]-a[2]+a[3];break;
   case 'permutation':v=ordered(a[0],a[1]);break;
   case 'repeat':v=a[0]**a[1];break;
   case 'integer-repeat':v=a[0]**a[1]-a[0]**(a[1]-1);break;
   case 'adjacent':v=ordered(a[0]-2,a[0]-2)*2*(a[0]-1);break;
   case 'apart':v=ordered(a[0]-2,a[0]-2)*(a[0]-1)*(a[0]-2);break;
   case 'left-end':v=ordered(a[0]-1,a[0]-1);break;
   case 'both-ends':v=2*ordered(a[0]-2,a[0]-2);break;
   case 'circle':v=ordered(a[0],a[0])/a[0];break;
   case 'seats':v=ordered(a[0],a[0]);break;
   case 'choose':v=binomial(...a);break;
   case 'identical':v=multinomial(...a);break;
   case 'labelled-groups':v=binomial(a[0]+a[1],a[0]);break;
   case 'groups':v=binomial(a[0]+a[1],a[0])/(a[0]===a[1]?2:1);break;
   case 'complement':v=0;for(let k=1;k<=a[2];k++)v+=binomial(a[0],k)*binomial(a[1],a[2]-k);break;
   default:throw Error(kind);
  }
  assert.equal(q.value,v,id);
 }
});
test('all new text has strict TeX, stacked fractions and matching delimiters',()=>{
 let count=0;
 function walk(v){
  if(typeof v==='string'){
   assert.equal((v.match(/\$/g)??[]).length%2,0,v);
   for(const [,tex] of v.matchAll(/\$([^$]+)\$/g)){
    assert.ok(!tex.includes('\\binom')&&!tex.includes('/'),tex);
    assert.ok(!/\\\\[a-z]/i.test(tex),tex);
    katex.renderToString(tex,{throwOnError:true,strict:'error'});count++;
   }
  }else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);
 }
 walk(lessons);walk(exercises);assert.ok(count>1000);
});
test('chapter check retains each authored decision and important boundary variants',()=>{
 assert.equal(coverage.length,topics.reduce((n,t)=>n+t.skills.length,0));
 const check=lessons.at(-1),qs=exercises.filter(e=>e.lesson===check.slug);
 assert.equal(check.practiceGroups.length,3);
 assert.deepEqual(new Set(check.practiceGroups.flatMap(g=>g.exerciseIds)),new Set(qs.filter(e=>e.stage==='practice').map(e=>e.id)));
 const boundary=coverage.find(c=>c.family==='boundary-combination');
 const originals=boundary.sourceIds.map(id=>exercises.find(e=>e.id===id));
 assert.ok(originals.some(e=>e.prompt.includes('$0$')));
 for(const name of ['union','outside']){
  const selection=coverage.find(c=>c.family===name).sourceIds;
  assert.ok(selection.some(id=>exercises.find(e=>e.id===id).prompt.includes('両方好きな人は $0$')));
 }
});
test('method questions answer the reason, not only the numerical count',()=>{
 for(const t of topics)for(const e of t.exercises){
  if(/理由|説明/.test(e.prompt))assert.ok(/ので|から|ため|なら|区別|同じ|全体/.test(e.answer),e.id);
 }
});
