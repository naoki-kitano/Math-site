import {defineMathOneLesson,question} from "./math1-authoring";
export type Worked = [prompt:string,answer:string,hint:string,working:string];
export type Skill = {id:string;title:string;why:string;sample:Worked;items:Worked[]};
export function addPair(bank:ReturnType<typeof topic>,id:string,title:string,why:string,pair:[Worked,Worked]) {
 const [a,b]=pair;
 const supplement={id,title,text:[why,a[0],a[3],a[1]].join("\n"),tex:"",check:b[0],answer:b[3]+"\n"+b[1]};
 const existing=bank.lesson.supplements.findIndex(s=>s.id===id);
 if(existing<0)bank.lesson.supplements.push(supplement);
 else bank.lesson.supplements[existing]=supplement;
 pair.forEach(([prompt,answer,hint,working],i)=>bank.exercises.push({id:`${bank.lesson.slug}-${id}-extra-${i+1}-v1`,lesson:bank.lesson.slug,stage:i===0?"practice":"review",family:id,repair:id,kind:"paper",prompt,answer,hints:[hint],steps:[{title:"考えて進める",text:working},{title:"答えと確認",text:answer}]}));
}
// Each bank is authored for one mathematical decision. No hints are inherited.
export function topic(slug:string,title:string,introduction:string[],rule:string,main:Skill[],preparation:Skill[]) {
  const stages={ready:[],guided:[],practice:[],review:[]} as Parameters<typeof defineMathOneLesson>[1];
  const examples=main.map(s=>({id:s.id,title:s.title,prompt:s.sample[0],guidedIds:[`${slug}-${s.id}-1-v1`],steps:[{title:"着目する",text:s.why},{title:"途中式",text:s.sample[3]},{title:"答えと確認",text:s.sample[1]}]}));
  for(const s of [...main,...preparation]) {
    const isPreparation=preparation.includes(s);
    s.items.forEach(([prompt,answer,hint,working],i)=>{
      const stage=i===0?(isPreparation?"ready":"guided"):i>=s.items.length-(isPreparation?1:2)?"review":"practice";
      stages[stage].push(question(`${s.id}-${i+1}`,s.id,prompt,answer,hint,working));
    });
  }
  return defineMathOneLesson({slug,title,basicsTitle:title,description:rule,introduction,rule,examples,
    supplements:[...main,...preparation].map(s=>({id:s.id,title:s.title,text:s.why+"\n"+s.sample[0]+"\n"+s.sample[3]+"\n"+s.sample[1],tex:"",check:s.items[0][0],answer:s.items[0][3]+"\n"+s.items[0][1]}))},stages);
}
