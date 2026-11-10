"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

const storageKey="mathcanvas.appearance.v1";
const changeEvent="mathcanvas-appearance-change";
type Appearance="cool"|"warm";
const readAppearance=():Appearance=>document.body.dataset.appearance==="warm"?"warm":"cool";
const subscribe=(onChange:()=>void)=>{
 const onStorage=(event:StorageEvent)=>{
  if(event.key!==storageKey&&event.key!==null)return;
  document.body.dataset.appearance=event.newValue==="warm"?"warm":"cool";
  onChange();
 };
 window.addEventListener(changeEvent,onChange);window.addEventListener("storage",onStorage);
 return()=>{window.removeEventListener(changeEvent,onChange);window.removeEventListener("storage",onStorage);};
};
function choose(appearance:Appearance){
 document.body.dataset.appearance=appearance;
 try{localStorage.setItem(storageKey,appearance);}catch{/* The choice still works for this visit. */}
 window.dispatchEvent(new Event(changeEvent));
}

export default function AppearanceSettings(){
 const appearance=useSyncExternalStore(subscribe,readAppearance,()=>"cool" as Appearance);
 const [open,setOpen]=useState(false),id=useId();
 const root=useRef<HTMLDivElement>(null),trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(!open)return;
  root.current?.querySelector<HTMLInputElement>("input:checked")?.focus();
  const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!root.current?.contains(event.target))setOpen(false);};
  const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){event.preventDefault();setOpen(false);trigger.current?.focus();}};
  document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);
  return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
 },[open]);
 return <div className="appearance-settings" ref={root} onBlur={event=>{if(event.relatedTarget instanceof Node&&!event.currentTarget.contains(event.relatedTarget))setOpen(false);}}>
  <button ref={trigger} className="appearance-trigger" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(value=>!value)}>表示</button>
  {open&&<div className="appearance-popover" id={id} role="dialog" aria-label="表示の設定">
   <fieldset><legend>配色</legend>
    {([{value:"cool",label:"現在の色"},{value:"warm",label:"暖色"}] as const).map(option=><label className="appearance-option" key={option.value}>
     <input type="radio" name={id} value={option.value} checked={appearance===option.value} onChange={()=>choose(option.value)}/>
     <span className={`appearance-swatch appearance-swatch-${option.value}`} aria-hidden="true"/>
     <span>{option.label}</span>
    </label>)}
   </fieldset>
  </div>}
 </div>;
}
