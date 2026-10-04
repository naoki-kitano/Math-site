// Remove only consecutive identical passages; never summarize away a condition.
export const workedText=(...parts:string[])=>parts.filter((s,i)=>s&&(!i||s!==parts[i-1])).join("\n");
