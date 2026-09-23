import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
import ts from "typescript";
import katex from "katex";
const chapter=process.argv[2]||"6";
assert.ok(["6","7","8"].includes(chapter));
const source=readFileSync(new URL("../app/content/math3-chapter"+chapter+".ts",import.meta.url),"utf8");
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const data=await import("data:text/javascript;base64,"+Buffer.from(js).toString("base64")).catch(error=>{console.error(error.message);process.exit(1);});
const lessons=data["math3Chapter"+chapter+"Lessons"],exercises=data["math3Chapter"+chapter+"Exercises"];
assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);
for(const e of exercises){
 assert.ok(lessons.find(l=>l.slug===e.lesson)?.supplements.some(s=>s.id===e.repair),e.id+" repair");
 assert.ok(exercises.some(a=>a.id!==e.id&&a.lesson===e.lesson&&a.family===e.family&&["practice","review"].includes(a.stage)),e.id+" alternate");
}
function walk(v,key){
 if(typeof v==="string"){
  const math=key==="tex"?[v]:[...v.matchAll(/\$([^$]+)\$/g)].map(m=>m[1]);
  if(key!=="tex")assert.equal((v.match(/\$/g)||[]).length,math.length*2,v);
  for(const tex of math){
   assert.ok(!tex.includes("/"),tex);assert.ok(!tex.includes("\\binom"),tex);
   katex.renderToString(tex,{throwOnError:true,strict:"error",trust:false});
  }
 }else if(Array.isArray(v))v.forEach(x=>walk(x,key));
 else if(v&&typeof v==="object")Object.entries(v).forEach(([k,x])=>walk(x,k));
}
walk([lessons,exercises]);
console.log(JSON.stringify({lessons:lessons.length,examples:lessons.reduce((n,l)=>n+l.examples.length,0),exercises:exercises.length,supplements:lessons.reduce((n,l)=>n+l.supplements.length,0)}));
