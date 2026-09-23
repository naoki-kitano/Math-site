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
const {mathCLessons:lessons,mathCExercises:exercises,mathCBanks:banks}=await get('mathc');
const {mathCPlots:plots}=await get('mathc-diagrams');
const strings=x=>typeof x==='string'?[x]:Array.isArray(x)?x.flatMap(strings):x&&typeof x==='object'?Object.values(x).flatMap(strings):[];
const qs=(slug,family)=>{const s=banks.find(b=>b.lesson.slug==='mc-'+slug).skills.find(s=>s.id===family);return [s.sample,...s.items];};
const ns=[3,1,2,4,5,6,7,8];
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('math C curriculum, stages, all alternates and chapter coverage',t=>{
 assert.equal(lessons.length,46);
 t.diagnostic(JSON.stringify({totalPages:lessons.length,examples:lessons.reduce((n,l)=>n+l.examples.length,0),questions:exercises.length,ordinaryQuestions:banks.reduce((n,b)=>n+b.exercises.length,0),supplements:lessons.reduce((n,l)=>n+l.supplements.length,0)}));
 assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
 for(const chapter of new Set(lessons.map(l=>l.chapter))){
  const ls=lessons.filter(l=>l.chapter===chapter),es=exercises.filter(e=>ls.some(l=>l.slug===e.lesson));
  t.diagnostic(JSON.stringify({chapter,pages:ls.length,examples:ls.reduce((n,l)=>n+l.examples.length,0),questions:es.length}));
 }
 for(const l of lessons){
  assert.equal(l.subject,'数学C');const es=exercises.filter(e=>e.lesson===l.slug);
  assert.equal(es.filter(e=>e.stage==='ready').length,2,l.slug);
  assert.ok(es.filter(e=>e.stage==='practice').length>=6,l.slug);
  for(const ex of l.examples)assert.ok(ex.guidedIds.every(id=>es.some(e=>e.id===id&&e.stage==='guided')),l.slug);
  for(const e of es){
   assert.ok(e.hints[0]?.length>5,e.id);
   assert.ok(l.supplements.some(s=>s.id===e.repair),e.id);
   assert.ok(es.some(a=>a.id!==e.id&&a.family===e.family&&a.prompt!==e.prompt&&['practice','review'].includes(a.stage)),e.id);
  }
  for(const p of l.prerequisites??[])assert.ok(lessons.some(x=>x.slug===p.slug),p.slug);
 }
 for(const b of banks){
  const check=lessons.find(l=>l.chapter===b.lesson.chapter&&l.practiceGroups);
  for(const s of b.skills){
   assert.equal(new Set([s.sample,...s.items].map(q=>q.prompt)).size,s.items.length+1,b.lesson.slug+s.id);
   for(const e of b.exercises.filter(e=>e.stage==='practice'&&e.family===s.id)){
    assert.ok(exercises.some(c=>c.lesson===check.slug&&c.stage==='practice'&&c.prompt===e.prompt&&c.family===b.lesson.slug+'-'+s.id),'check loses '+e.id);
   }
  }
 }
});
test('math C all formulas and captions use strict TeX and preserve notation',()=>{
 for(const text of strings({lessons,exercises,plots})){
  assert.ok([...text].every(c=>c.charCodeAt(0)>=32||c==='\n'),'control character '+text);
  assert.equal((text.match(/\$/g)||[]).length%2,0,text);
  assert.doesNotMatch(text.replace(/\$[^$]*\$/g,'').replace(/数学[ABC]/g,'数学'),/\b[xyzrstijkABCOPFGHMN]\b|[₀-₉]/,'plain math '+text);
  for(const [,tex]of text.matchAll(/\$([^$]+)\$/g)){
   assert.doesNotMatch(tex,/\\binom|\//,tex);
   // Matrix row separators are valid; repeated TeX command escapes are not.
   assert.doesNotMatch(tex,/\\\\(?:frac|sqrt|vec|overline|cos|sin|pi)\b/,tex);
   katex.renderToString(tex,{throwOnError:true,strict:'error'});
  }
 }
});
test('component operations, inner products, distances and intersections have checked answers',()=>{
 for(const [i,n] of ns.entries()){
  assert.equal(qs('vector-components','forward')[i].answer,`$(${2-n},${n+1})$。`);
  assert.equal(qs('vector-components','reverse')[i].answer,`$(${n-2},${-1-n})$。`);
  const b=n%2?3:-3;
  assert.equal(qs('vector-sum','add')[i].answer,`$(${n-1},${b-2})$。`);
  assert.equal(qs('vector-sum','subtract')[i].answer,`$(${n+1},${-2-b})$。`);
  const dot=[n,-2].reduce((sum,v,j)=>sum+v*[3,n][j],0);
  assert.equal(qs('vector-dot','components')[i].answer,`$${dot}$。`);
  near(Math.hypot(3*n,-4*n),5*n);
  assert.equal(qs('vector-length','length')[i].answer,`$${5*n}$。`);
  assert.match(qs('vector-length','unit')[i].answer,/\\frac35,-\\frac45/);
  near(Math.acos((n*(n%2?n:-n))/(n*Math.hypot(n,n)))*180/Math.PI,n%2?45:135);
  assert.equal(qs('vector-angle','angle')[i].answer,`$${n%2?45:135}^\\circ$。`);
  assert.equal(qs('space-dot','dot')[i].answer,`$${[n,1,-2].reduce((s,v,j)=>s+v*[2,-n,3][j],0)}$。`);
  assert.equal(qs('vector-intersection','intersection')[i].answer,`$(${n},${n})$。`);
  assert.equal(qs('vector-basis','independent')[i].answer,`$s=${n},t=2$。`);
  // Check the returned division points against the stated ratio, not the authoring formula.
  const internal=Number(qs('vector-division','internal')[i].answer.match(/\$(-?\d+)\$/)[1]);
  const external=Number(qs('vector-division','external')[i].answer.match(/\$(-?\d+)\$/)[1]);
  near((internal-1)/(1+3*n-internal),2);
  near(Math.abs(external-1)/Math.abs(external-(1+3*n)),2);
 }
});
test('complex rotations and all roots agree with independent Cartesian computations',()=>{
 const mul=([a,b],[c,d])=>[a*c-b*d,a*d+b*c];
 const fmt=(a,b)=>!a?(!b?'0':b===1?'i':b===-1?'-i':b+'i'):!b?''+a:`${a}${b>0?'+':'-'}${Math.abs(b)===1?'':Math.abs(b)}i`;
 for(const [i,n]of ns.entries()){
  for(const [family,k] of [['multiply',1],['divide',-1]]){
   const v=mul([n,n%2?-1:1],[0,k]);assert.ok(qs('complex-product',family)[i].answer.includes('$'+fmt(...v)+'$'));
  }
  for(const [family,k]of [['left',1],['right',-1]]){
   const v=mul([n,1],[0,k]).map((v,j)=>v+[1,2][j]);
   assert.equal(qs('complex-rotation',family)[i].answer,`$w=${fmt(...v)}$。`);
  }
  for(const negative of [false,true]){
   const k=n%2?3:4,answer=qs('complex-roots',negative?'negative':'positive')[i].answer;
   const angles=answer.split('\\theta=')[1].split('$')[0].split(',').map(t=>{
    const frac=t.match(/\\frac\{(\d+)\}\{(\d+)\}/);return (frac?Number(frac[1])/Number(frac[2]):t==='\\pi'?1:Number(t.replace('\\pi','')))*Math.PI;
   });
   assert.equal(angles.length,k);
   assert.equal(new Set(angles.map(a=>a.toFixed(8))).size,k);
   for(const theta of angles){
    let z=[1,0];for(let j=0;j<k;j++)z=mul(z,[n*Math.cos(theta),n*Math.sin(theta)]);
    near(z[0],(negative?-1:1)*n**k);near(z[1],0);
   }
  }
 }
});
test('curve conditions, focal geometry and tangent equations checked independently',()=>{
 for(const [i,n]of ns.entries()){
  const a=n+2,b=n,c=Math.sqrt(a*a-b*b);
  for(const t of [.1,.8,1.7,3.8]){
   const x=a*Math.cos(t),y=b*Math.sin(t);
   near(Math.hypot(x-c,y)+Math.hypot(x+c,y),2*a);
  }
  const h=n,k=n+1,focal=Math.hypot(h,k);
  for(const t of [-.9,0,.7]){
   const x=h*Math.cosh(t),y=k*Math.sinh(t);
   near(Math.abs(Math.hypot(x-focal,y)-Math.hypot(x+focal,y)),2*h);
  }
  assert.ok(qs('conic-tangent','parabola')[i].answer.includes(`x-${n}y+${n*n}=0`));
  // Substitution gives y²-4ny+4n²=(y-2n)², a repeated root.
  for(const y of [-2,0,2*n,7])near(y*y-4*(n*y-n*n),(y-2*n)**2);
  assert.ok(qs('parametric-elimination','range')[i].answer.includes(`y\\geqq${n}`));
  assert.ok(qs('polar-equation','circle')[i].answer.includes('原点も含まれます'));
  for(const t of [-1,0,1]){
   const r=2*n*Math.cos(t),x=r*Math.cos(t),y=r*Math.sin(t);
   near((x-n)**2+y*y,n*n);
  }
 }
 for(const slug of ['ellipse','hyperbola','parabola']){
  const intro=banks.find(b=>b.lesson.slug==='mc-'+slug).lesson.introduction.join('');
  assert.ok(intro.includes('二乗'));assert.ok(intro.includes('逆')||intro.includes('同値'));
 }
});
test('matrix multiplication, graph path counting and visual geometry',()=>{
 const mm=(a,b)=>a.map(row=>b[0].map((_,j)=>row.reduce((s,v,k)=>s+v*b[k][j],0)));
 for(const [i,n]of ns.entries()){
  const ab=mm([[1,n],[0,1]],[[1,0],[1,1]]),ba=mm([[1,0],[1,1]],[[1,n],[0,1]]);
  assert.notDeepEqual(ab,ba);
  assert.ok(qs('matrix-product','order')[i].answer.includes(`\\begin{pmatrix}${ab[0][0]}&${ab[0][1]}\\\\${ab[1][0]}&${ab[1][1]}\\end{pmatrix}`));
  const sales=mm([[n,2],[3,4]],[[200],[100]]);
  assert.ok(qs('matrix-product','sales')[i].answer.includes(`\\begin{pmatrix}${sales[0][0]}\\\\${sales[1][0]}\\end{pmatrix}`));
  assert.ok(qs('discrete-graph','shortest')[i].answer.includes(`$${n+2}$`));
 }
 assert.equal(mm([[0,1,1],[0,0,1],[1,0,0]],[[0,1,1],[0,0,1],[1,0,0]])[0][2],1);
 for(const plot of Object.values(plots))for(const path of plot.paths)for(const p of path.points)assert.ok(p.every(Number.isFinite));
 for(const [x,y] of plots['mc-ellipse'].paths[0].points)near(x*x/25+y*y/9,1);
 for(const path of plots['mc-hyperbola'].paths.slice(0,2))for(const [x,y]of path.points)near(x*x/9-y*y/16,1);
 for(const [x,y]of plots['mc-parabola'].paths[0].points)near(y*y,12*x);
 for(const [x,y]of plots['mc-polar-equation'].paths[0].points)near((x-3)**2+y*y,9);
 const rotation=plots['mc-complex-rotation'].points;
 near(Math.hypot(rotation[1].at[0]-1,rotation[1].at[1]-2),Math.hypot(rotation[2].at[0]-1,rotation[2].at[1]-2));
});
test('non-applicability repairs remain separate from calculation in chapter checks',()=>{
 for(const [slug,family,word]of [['vector-length','existence','零'],['vector-angle','angle-condition','零'],['complex-polar','argument-condition','範囲']]){
  const b=banks.find(b=>b.lesson.slug==='mc-'+slug),help=b.lesson.supplements.find(s=>s.id===family);
  assert.ok(help.text.includes(word));
  const c=lessons.find(l=>l.chapter===b.lesson.chapter&&l.practiceGroups);
  assert.ok(exercises.some(e=>e.lesson===c.slug&&e.family===b.lesson.slug+'-'+family&&e.stage==='practice'));
 }
});
test('added angle, tangent, representation and dimension decisions retain their actual conditions',()=>{
 for(const [i,n]of ns.entries()){
  const sign=n%2?1:-1;
  near(Math.acos((n*sign*n)/(Math.hypot(n,n,0)*Math.hypot(sign*n,0,n)))*180/Math.PI,sign>0?60:120);
  assert.equal(qs('space-dot','angle')[i].answer,`$${sign>0?60:120}^\\circ$。`);
  assert.ok(qs('space-line-plane','membership')[i].answer.startsWith(n%2?'ありません':'あります'));
  assert.equal(qs('complex-product','polar-product')[i].answer,`$${2*n}i$。`);
  assert.equal(qs('complex-product','polar-quotient')[i].answer,`$${n===1?'':n}i$。`);
  near((3*n)**2/(25*n*n)+16/25,1);
  near(3*(3*n)/n+4*4,25);
  assert.ok(qs('conic-tangent','ellipse')[i].answer.endsWith('+4y=25$。'));
  near((2*n)**2/(n*n)-3**2/3,1);
  near(2*(2*n)/n-3,1);
  for(const u of [-3,0,2,5])near(3*u*u-(2*u-1)**2-3,-((u-2)**2));
  assert.ok(qs('conic-tangent','hyperbola')[i].answer.endsWith('-y=1$。'));
 }
 const conditions=qs('matrix-product','dimensions');
 assert.ok(conditions.some(q=>q.answer.startsWith('計算できません')));
 assert.ok(conditions.some(q=>q.answer.startsWith('計算できます')));
 const help=banks.find(b=>b.lesson.slug==='mc-matrix-product').lesson.supplements.find(s=>s.id==='dimensions');
 assert.ok(help.text.includes('計算できません'));
 const graphHelp=banks.find(b=>b.lesson.slug==='mc-data-representation').lesson.supplements.find(s=>s.id==='purpose');
 for(const type of ['棒グラフ','折れ線グラフ','散布図'])assert.ok(graphHelp.text.includes(type));
});
