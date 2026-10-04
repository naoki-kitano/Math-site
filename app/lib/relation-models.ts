export const quadraticSign=(x:number)=>({left:x+1,right:x-2,value:(x+1)*(x-2)});
export const midpointOnSegment=(t:number)=>({q:[t,2*t],p:[t/2,t]});
export function dotProjection(degrees:number){
 const x=Math.abs(degrees-90)<1e-10?0:4*Math.cos(degrees*Math.PI/180);
 return {x,y:4*Math.sin(degrees*Math.PI/180),dot:3*x};
}
export function squareRiemann(n:number){
 return {lower:(n-1)*(2*n-1)/(6*n*n),upper:(n+1)*(2*n+1)/(6*n*n),width:1/n};
}
