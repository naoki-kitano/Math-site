"use client";
import {useSyncExternalStore} from "react";
function subscribe(onChange:()=>void){
 window.addEventListener("popstate",onChange);
 return ()=>window.removeEventListener("popstate",onChange);
}
export function useQuery(){
 const search=useSyncExternalStore(subscribe,()=>window.location.search,()=>"");
 return new URLSearchParams(search);
}
