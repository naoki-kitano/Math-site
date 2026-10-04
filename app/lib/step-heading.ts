import type {Step} from "../content/lessons";
// These headings repeat the function of a worked solution but name no operation.
const emptyGuidance=new Set(["順に進める","考えて進める","まず考えること","着目する","途中式","途中式を書く","考え方","式をつなぐ","注目する","式を書いて進める","注目するものを決める","式にして進める"]);
export const stepHeading=(title:string)=>emptyGuidance.has(title)?"":title;
const genericAnswer=new Set(["答え","答えと確認","答えと条件を確かめる"]);
// Preserve distinct mathematical headings, even when the body happens to match.
export function distinctSteps(steps:Step[]){
 const result:Step[]=[];
 for(const step of steps){
  const previous=result.at(-1),plain=(s:Step)=>!stepHeading(s.title)||genericAnswer.has(s.title);
  if(previous&&previous.text===step.text&&previous.tex===step.tex&&(previous.title===step.title||plain(previous)||plain(step))){
   if(plain(previous)&&!plain(step))result[result.length-1]=step;
  }else result.push(step);
 }
 return result;
}
