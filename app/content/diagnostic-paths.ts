import {lessons,exercises,type Exercise} from "./lessons";
import {prerequisitePlans,type PrerequisitePlan} from "./prerequisite-plans";
import {calculusPrerequisites,exercisePrerequisites} from "./prerequisite-calculus";
import {prerequisiteById,type PrerequisiteCheck} from "./prerequisite-checks";

export const allPrerequisitePlans=[...prerequisitePlans,...calculusPrerequisites];
const plans=new Map<string,PrerequisitePlan>();
for(const row of allPrerequisitePlans)for(const family of row.families){
 const key=row.lesson+":"+family;
 if(plans.has(key))throw Error("Duplicate diagnostic plan "+key);
 plans.set(key,row);
}
const signature=(q:Exercise)=>JSON.stringify([q.prompt,q.tex??"",q.answer,q.kind]);
const copies=new Map<string,Exercise[]>();
const lessonBySlug=new Map(lessons.map(l=>[l.slug,l]));
const sameChapter=(a:string,b:string)=>{
 const left=lessonBySlug.get(a),right=lessonBySlug.get(b);
 return !!left&&!!right&&left.chapter===right.chapter&&(left.subject??"数学II")===(right.subject??"数学II");
};
// Exact mathematical question identity, not matching words in titles.
for(const q of exercises){
 if(plans.has(q.lesson+":"+q.family)||Object.hasOwn(exercisePrerequisites,q.id)){
  const key=signature(q),list=copies.get(key)??[];
  list.push(q);copies.set(key,list);
 }
}
type PlanResult={checks:PrerequisiteCheck[];scope:"exercise"|"family"|"copy"|"chapter"|"local";reason:string;sourceId?:string};
function direct(q:Exercise):PlanResult|undefined{
 const row=plans.get(q.lesson+":"+q.family);
 if(Object.hasOwn(exercisePrerequisites,q.id))return {checks:exercisePrerequisites[q.id].map(id=>prerequisiteById.get(id)!),scope:"exercise",reason:"この設問で実際に使う操作に合わせた個別確認。"};
 // Historical preparation families must not inherit the main lesson's calculation demands.
 if(q.stage==="ready"||q.family.startsWith("prep-"))return;
 if(row)return {checks:row.checks.map(id=>prerequisiteById.get(id)!),scope:"family",reason:row.reason};
}
const cache=new Map<string,PlanResult>();
export function diagnosticPlan(q:Exercise):PlanResult{
 const saved=cache.get(q.id);if(saved)return saved;
 let result=direct(q);
 if(!result&&q.stage!=="ready"&&!q.family.startsWith("prep-")){
  const matching=(copies.get(signature(q))??[]).filter(s=>s.lesson!==q.lesson&&sameChapter(s.lesson,q.lesson));
  const proposed=matching.map(s=>({source:s,result:direct(s)})).filter(x=>x.result);
  // Ambiguous copies never get a guessed prerequisite.
  if(proposed.length&&new Set(proposed.map(x=>x.result!.checks.map(c=>c.id).join(","))).size===1){
   result={...proposed[0].result!,scope:"copy",sourceId:proposed[0].source.id};
  }
  if(!result&&q.lesson.endsWith("-check")){
   const candidates=allPrerequisitePlans.filter(row=>sameChapter(row.lesson,q.lesson)&&row.families.some(f=>
    q.family===row.lesson+"-"+f||q.family===(row.lesson.startsWith("m3-")?row.lesson.slice(3):row.lesson)+"-"+f||
    q.family===f||(f==="core"&&q.family===row.lesson)));
   if(candidates.length&&new Set(candidates.map(p=>p.checks.join(","))).size===1){
    result={checks:candidates[0].checks.map(id=>prerequisiteById.get(id)!),scope:"chapter",reason:candidates[0].reason};
   }
  }
 }
 result??={checks:[],scope:"local",reason:"この設問の専用補足で対象・条件・途中式を確認する。別の内容への依存は未指定。"};
 cache.set(q.id,result);return result;
}
export function diagnosticChecksFor(q:Exercise){return diagnosticPlan(q).checks;}

// Validate the whole trail, not just its last slug. Unknown/cyclic/unrelated paths are ignored.
export function validDiagnosticTrail(raw:string|null,origin:Exercise|undefined):PrerequisiteCheck[]{
 if(!raw||!origin)return [];
 const ids=raw.split(",");
 if(ids.length>prerequisiteById.size||new Set(ids).size!==ids.length)return [];
 const first=diagnosticChecksFor(origin).find(c=>c.id===ids[0]);if(!first)return [];
 const trail=[first];
 for(const id of ids.slice(1)){
  const parent=trail[trail.length-1],permitted=new Set([...parent.requires,...Object.values(parent.wrong??{}).flat()]);
  const child=prerequisiteById.get(id);
  if(!child||!permitted.has(id))return [];
  trail.push(child);
 }
 return trail;
}
export function diagnosticTarget(slug:string,raw:string|null,origin:Exercise|undefined){
 const trail=validDiagnosticTrail(raw,origin),last=trail[trail.length-1];
 return last?.lesson===slug?{check:last,trail}:undefined;
}
// Targeted practice uses the same repair and decision. A different family is never selected
// simply because it happens to be first on a destination page.
export function targetPractice(check:PrerequisiteCheck):Exercise[]{
 if(check.practice)return check.practice.map(id=>{
  const q=exercises.find(q=>q.id===id);
  if(!q)throw Error("Missing targeted practice "+check.id+":"+id);
  return q;
 });
 const qs=exercises.filter(q=>q.lesson===check.lesson&&q.repair===check.repair&&(q.stage==="practice"||q.stage==="review"));
 const seen=new Set<string>();
 return qs.filter(q=>{const k=signature(q);if(seen.has(k))return false;seen.add(k);return true;}).slice(0,3);
}
