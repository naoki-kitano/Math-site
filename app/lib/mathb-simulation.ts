// Reproducible teaching simulation; not an empirical data source.
export function coinSample(seed:number,count=100){
 if(!Number.isInteger(count)||count<1||count>10000)throw Error("Invalid sample size");
 let state=seed>>>0,heads=0;
 for(let i=0;i<count;i++){
  state=(Math.imul(1664525,state)+1013904223)>>>0;
  if(state/4294967296<.5)heads++;
 }
 return {seed:state,heads,count};
}
