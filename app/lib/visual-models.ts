export const intervalCases=[{a:-1,b:3},{a:0,b:3},{a:2,b:3}] as const;
export const parabolaValue=(x:number)=>(x-1)**2;
export function intervalExtrema(a:number,b:number){
 const xs=Array.from(new Set([a,b,...(a<=1&&1<=b?[1]:[])]));
 const points=xs.map(x=>({x,y:parabolaValue(x)}));
 const min=Math.min(...points.map(p=>p.y)),max=Math.max(...points.map(p=>p.y));
 return {points,min,max,minX:points.filter(p=>p.y===min).map(p=>p.x),maxX:points.filter(p=>p.y===max).map(p=>p.x)};
}
export function centeredRotation(progress:number){
 if(progress<=1)return {center:[1-progress,2*(1-progress)],point:[4-progress,3-2*progress]};
 if(progress<=2){const angle=(progress-1)*Math.PI/2;return {center:[0,0],point:[3*Math.cos(angle)-Math.sin(angle),3*Math.sin(angle)+Math.cos(angle)]};}
 return {center:[progress-2,2*(progress-2)],point:[-1+progress-2,3+2*(progress-2)]};
}
export const combinationPairs=["AB","AC","AD","BC","BD","CD"];
export const rotationCenterLabel=(progress:number)=>progress===0||progress===3?String.raw`\alpha`:progress>=1&&progress<=2?"O":null;
export const geometricRows={original:[2,4,8,16],scaled:[4,8,16,32]};
