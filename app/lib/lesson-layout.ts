import type {Example,Exercise,Lesson} from "../content/lessons";
export function guidedForExample(example:Example,index:number,items:Exercise[]):Exercise[] {
  return example.guidedIds?example.guidedIds.map(id=>items.find(e=>e.id===id)).filter((e):e is Exercise=>!!e):items[index]?[items[index]]:[];
}
export function practiceForGroup(lesson:Lesson,group:string,items:Exercise[]):Exercise[] {
  const ids=lesson.practiceGroups?.find(g=>g.id===group)?.exerciseIds;
  return ids?items.filter(e=>ids.includes(e.id)):items;
}
