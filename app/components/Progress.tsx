"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { STORAGE_KEY, parseBackup, mergeAttempts, persistAttempts, downloadBackup, type Attempt } from "../lib/progress";
type Progress = {attempts:Attempt[];ready:boolean;add:(a:Attempt)=>void;importData:(s:string)=>boolean;error:string};
const Context=createContext<Progress|null>(null);
export function ProgressProvider({children}:{children:React.ReactNode}) {
  const [attempts,setAttempts]=useState<Attempt[]>([]),[ready,setReady]=useState(false),[error,setError]=useState("");
  const current=useRef<Attempt[]>([]);
  useEffect(()=>{
    // Hydrate the browser-owned record only after SSR; never overwrite unreadable data.
    const hydrate=()=>{
      try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){current.current=parseBackup(raw);setAttempts(current.current);} }
      catch { setError("保存した記録を読み込めませんでした。元の保存データは変更していません。新しく解いた記録は、この画面を離れる前に下のボタンから書き出してください。"); }
      setReady(true);
    };
    hydrate();
    const listener=(e:StorageEvent)=>{if(e.key===STORAGE_KEY&&e.newValue){try {current.current=mergeAttempts(current.current,parseBackup(e.newValue));setAttempts(current.current);}catch {setError("別の画面の記録を読み込めませんでした。");}}};
    window.addEventListener("storage",listener);return()=>window.removeEventListener("storage",listener);
  },[]);
  const save=useCallback((incoming:Attempt[])=>{
      const result=persistAttempts(current.current,incoming,()=>localStorage);
      current.current=result.attempts;
      setAttempts(result.attempts);setError(result.error);
      return result.saved;
  },[]);
  const add=useCallback((a:Attempt)=>save([a]),[save]);
  const importData=useCallback((s:string)=>save(parseBackup(s)),[save]);
  return <Context.Provider value={{attempts,ready,add,importData,error}}>{error&&<div className="warning" role="alert"><p>{error}</p><button className="button secondary" onClick={()=>downloadBackup(attempts)}>この画面の記録を書き出す</button></div>}{children}</Context.Provider>;
}
export function useProgress(){const ctx=useContext(Context);if(!ctx)throw new Error("Missing progress provider");return ctx;}
