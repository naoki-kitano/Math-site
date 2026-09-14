import { exerciseById, exercises } from "../content/lessons";
export const STORAGE_KEY = "mathcanvas.math2.progress.v1";
export type Outcome = "independent" | "assisted" | "seen" | "retry";
export type Attempt = { id:string; exerciseId:string; at:number; outcome:Outcome; method:"auto"|"self"; reviewOf?:string };
export const DAY = 86400000;
export const MAX_ATTEMPTS = 20000;
export function validAttempt(a: unknown): a is Attempt {
  if (!a || typeof a !== "object") return false;
  const x = a as Attempt;
  if(typeof x.exerciseId!=="string"||!Object.hasOwn(exerciseById,x.exerciseId))return false;
  if(x.reviewOf!==undefined){
    if(typeof x.reviewOf!=="string"||!Object.hasOwn(exerciseById,x.reviewOf))return false;
    const source=exerciseById[x.exerciseId],target=exerciseById[x.reviewOf];
    if(source.lesson!==target.lesson||source.family!==target.family)return false;
  }
  return typeof x.id==="string" && x.id.length>0 && x.id.length<100 && Number.isFinite(x.at) && x.at>0 && x.at<=Date.now()+DAY
    && ["independent","assisted","seen","retry"].includes(x.outcome) && ["auto","self"].includes(x.method)
    && x.method===(exerciseById[x.exerciseId].kind==="paper"?"self":"auto");
}
export function parseBackup(raw:string):Attempt[] {
  const value=JSON.parse(raw);
  if(value?.version!==1 || !Array.isArray(value.attempts) || value.attempts.length>MAX_ATTEMPTS || !value.attempts.every(validAttempt)) throw new Error("invalid backup");
  return mergeAttempts([],value.attempts);
}
export function mergeAttempts(a:Attempt[],b:Attempt[]) {
  // A preview and its final judgment share an ID. Stale tab/storage copies
  // must not replace the final judgment with the earlier preview.
  const records=new Map<string,Attempt>();
  const rank:Record<Outcome,number>={seen:0,retry:1,assisted:2,independent:3};
  for(const item of [...a,...b]){
    const old=records.get(item.id);
    if(!old||item.at>old.at||(item.at===old.at&&rank[item.outcome]>rank[old.outcome]))records.set(item.id,item);
  }
  const merged=[...records.values()];
  if(merged.length>MAX_ATTEMPTS)throw new RangeError("記録の保存上限に達しました。今ある記録を先に書き出してください。記録は削除していません。");
  return merged.sort((x,y)=>x.at-y.at||x.id.localeCompare(y.id));
}
export function historyFor(id:string, attempts:Attempt[]) {
  return attempts.filter(a=>(a.reviewOf??a.exerciseId)===id).sort((a,b)=>a.at-b.at||a.id.localeCompare(b.id));
}
export function stateFor(id:string,attempts:Attempt[],now=Date.now()) {
  const history=historyFor(id,attempts), last=history.at(-1);
  if(!last)return {label:"未回答",due:false,dueAt:0,needsHelp:false,retained:false};
  const breakAt=history.findLastIndex(a=>a.outcome!=="independent");
  const wins=history.slice(breakAt+1).filter(a=>a.outcome==="independent");
  const retained=new Set(wins.map(a=>a.exerciseId)).size>=2 && wins.length>=2 && wins.at(-1)!.at-wins[0].at>=DAY;
  const needsHelp=last.outcome!=="independent";
  const dueAt=needsHelp?last.at:last.at+DAY*(retained?7:wins.length>=2?3:1);
  return {label:needsHelp?"もう一度":retained?"日を空けて確認":"自力でできた",due:dueAt<=now,dueAt,needsHelp,retained};
}
export function attemptedExercises(attempts:Attempt[]) {
  return exercises.filter(e=>attempts.some(a=>(a.reviewOf??a.exerciseId)===e.id));
}
export function dueExercises(attempts:Attempt[],now=Date.now()) {
  return attemptedExercises(attempts).filter(e=>stateFor(e.id,attempts,now).due).sort((a,b)=>stateFor(a.id,attempts,now).dueAt-stateFor(b.id,attempts,now).dueAt);
}
export function alternateFor(id:string, attempts:Attempt[] = []) {
  const source=exerciseById[id];
  const last=historyFor(id,attempts).at(-1);
  const candidates=exercises.filter(e=>e.id!==id&&e.lesson===source.lesson&&e.family===source.family&&(e.stage==="review"||e.stage==="practice"));
  return candidates.find(e=>e.id!==last?.exerciseId&&e.stage==="review")
    ?? candidates.find(e=>e.id!==last?.exerciseId)
    ?? candidates[0];
}
export function matchesNumber(input:string, expected:number) {
  const normalized=input.normalize("NFKC").replace(/−/g,"-").trim();
  return /^[+-]?\d+(?:\.\d+)?$/.test(normalized) && Number(normalized)===expected;
}

export function backupJSON(attempts:Attempt[]){return JSON.stringify({version:1,attempts},null,2);}
export function downloadBackup(attempts:Attempt[]){
  const url=URL.createObjectURL(new Blob([backupJSON(attempts)],{type:"application/json"}));
  const link=document.createElement("a");link.href=url;link.download="mathcanvas-record.json";link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function persistAttempts(current:Attempt[],incoming:Attempt[],storage:()=>Pick<Storage,"getItem"|"setItem">){
  const failure="このブラウザに記録を保存できません。別のページへ移動したり画面を閉じたりする前に、下のボタンから書き出してください。";
  let merged:Attempt[];
  try{merged=mergeAttempts(current,incoming);}catch(e){return {attempts:current,saved:false,error:e instanceof Error?e.message:"記録を追加できませんでした。"};}
  try{
    const raw=storage().getItem(STORAGE_KEY);
    if(raw)merged=mergeAttempts(merged,parseBackup(raw));
  }catch(e){
    return e instanceof RangeError?{attempts:current,saved:false,error:e.message}:{attempts:merged,saved:false,error:failure};
  }
  try{storage().setItem(STORAGE_KEY,backupJSON(merged));return {attempts:merged,saved:true,error:""};}
  catch{return {attempts:merged,saved:false,error:failure};}
}
